import os
import json
import ast
import logging
from pathlib import Path
from typing import List, Dict, Any
import re  # Import for regex usage in JavaScript/TypeScript parsing

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

# Define a file size limit (in characters)
FILE_SIZE_LIMIT = 10000  # Example limit, set this to your desired size

def parse_directory_structure(base_path: Path) -> Dict[str, Any]:
    structure = {
        "directories": {},
        "files": []
    }
    
    for root, dirs, files in os.walk(base_path):
        # Sort directories and files to ensure consistent output
        dirs.sort()
        files.sort()

        # Get the relative path from the base path
        relative_path = Path(root).relative_to(base_path)

        # Traverse directories
        current_dir = structure
        for part in relative_path.parts:
            if part not in current_dir["directories"]:
                current_dir["directories"][part] = {"directories": {}, "files": []}
            current_dir = current_dir["directories"][part]
        
        # Add only file names, not full paths
        for file in files:
            current_dir["files"].append(file)
    
    return structure


def parse_code_files(files: List[Path]) -> Dict[str, Any]:
    code_structure = {}
    
    for file in files:
        try:
            content = file.read_text(encoding='utf-8', errors='replace')
            
            if file.suffix == '.py':
                tree = ast.parse(content, filename=str(file))
                classes = [node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]
                functions = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
                imports = [ast.unparse(node) for node in ast.walk(tree) if isinstance(node, (ast.Import, ast.ImportFrom))]
                
            elif file.suffix in ['.js', '.ts', ".jsx", ".tsx"]:
                # Simple regex-based parsing for JavaScript/TypeScript
                classes = re.findall(r'class\s+(\w+)', content)
                functions = re.findall(r'(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>))', content)
                functions = [f[0] or f[1] for f in functions if f[0] or f[1]]  # Flatten the function matches
                imports = re.findall(r'^(import\s+.*?;)$', content, re.MULTILINE)
            
            elif file.suffix == '.java':
                # Simple regex-based parsing for Java
                classes = re.findall(r'class\s+(\w+)', content)
                functions = re.findall(r'(?:public|private|protected|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\) *\{', content)
                imports = re.findall(r'^(import\s+.*;)$', content, re.MULTILINE)
            
            else:
                continue  # Skip unsupported file types
            
            # Only add to code_structure if there are classes, functions, or imports
            if classes or functions or imports:
                code_structure[str(file)] = {
                    "classes": classes,
                    "functions": functions,
                    "imports": imports
                }
        
        except Exception as e:
            logging.warning(f"Failed to parse file {file}: {e}")
    
    return code_structure

def read_documentation(files: List[Path]) -> Dict[str, str]:
    documentation = {}
    
    for file in files:
        if 'readme' in file.name.lower():
            try:
                with open(file, 'r', encoding='utf-8', errors='replace') as f:
                    documentation[str(file)] = f.read()
            except Exception as e:
                logging.warning(f"Failed to read documentation file {file}: {e}")
    
    return documentation

def save_to_json(data: Dict[str, Any], output_file: str) -> None:
    try:
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        logging.error(f"Failed to save results to {output_file}: {e}")

def main(base_path: str, output_file: str):
    base_path = Path(base_path)
    structure = parse_directory_structure(base_path)
    
    # Collect all files to be parsed
    files = []
    def collect_files(directory_structure):
        files.extend(Path(file) for file in directory_structure.get("files", []))
        for subdir in directory_structure.get("directories", {}).values():
            collect_files(subdir)

    collect_files(structure)
    
    code_info = parse_code_files(files)
    documentation = read_documentation(files)
    
    result = {
        "Directory and File Structure": structure,
        "Classes, Functions, and Imports": code_info,
        "Documentation and Comments": documentation,
    }
    
    # Save result to a JSON file
    save_to_json(result, output_file)
    
    # Pretty-print the result for immediate feedback
    from rich import print
    #print(result)

if __name__ == "__main__":
    base_path = "./repo2"
    output_file = 'codebase_analysis.json'
    main(base_path, output_file)
