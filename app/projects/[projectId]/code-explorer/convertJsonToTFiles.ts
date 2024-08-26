import { TFiles } from './types';

type ApiResponse = {
  directories: { [key: string]: any };
};

// Helper function to extract the file/directory name from the full path
const extractNameFromPath = (path: string): string => {
  const parts = path.split('\\');
  return parts[parts.length - 1];
};

// Recursive function to build the file tree structure
const buildTree = (node: any): TFiles[] => {
  const result: TFiles[] = [];

  if (node.files && Array.isArray(node.files)) {
      node.files.forEach((file: string) => {
          result.push({ name: file, type: 'file' });
      });
  }

  if (node.directories && typeof node.directories === 'object') {
      Object.entries(node.directories).forEach(([dirName, dirNode]: [string, any]) => {
          result.push({
              name: dirName,
              type: 'directory',
              children: buildTree(dirNode)
          });
      });
  }

  return result;
};



const convertJsonToTFiles = (data: any): TFiles[] => {
  if (!data || typeof data !== 'object') {
      console.error("Invalid data structure:", data);
      return [];
  }

  const root = data["Directory and File Structure"];
  if (!root || typeof root !== 'object') {
      console.error("Root directory structure is missing or invalid:", root);
      return [];
  }

  return buildTree(root);
};


export default convertJsonToTFiles;
