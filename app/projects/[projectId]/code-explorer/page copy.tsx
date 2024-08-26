// page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import TreeView from './TreeView';  // Adjust the import path as necessary
import { files } from './types';  // Adjust the import path as necessary
import InputBar from '@/components/InputBar';
import PageContainer from '@/components/layout/page-container';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import the default styles

interface FileContents {
  [key: string]: string;
}

const fileContents: FileContents = {
  indexHtml: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple HTML Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a simple HTML and CSS example.</p>
</body>
</html>`,
  stylesCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
  }
  h1 {
    color: #007BFF;
    text-align: center;
  }
  p {
    text-align: center;
    font-size: 18px;
  }`,
  readmeMd: `# Simple HTML Project

This project demonstrates a basic HTML structure with an external CSS file. The HTML file includes a heading and a paragraph styled with CSS.

## Files

- **index.html**: The main HTML file.
- **styles.css**: The CSS file for styling the HTML content.

To view the project, open the \\index.html\\ file in a web browser.`,
};

const CodeExplorer: React.FC = () => {
  const [code, setCode] = useState<string>('// Select a file to view its content');
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('light');
  const [currentFile, setCurrentFile] = useState<string>('index.html');
  const [language, setLanguage] = useState<string>('html');

  const handleFileClick = (fileName: string) => {
    const fileKey = fileName.replace('.', '') + 'Html'; // Simple mapping, adjust if needed
    if (fileContents[fileKey]) {
      setCode(fileContents[fileKey]);
      setCurrentFile(fileName);

      // Determine the language based on the file extension
      const extension = fileName.split('.').pop();
      let detectedLanguage = 'plaintext';

      switch (extension) {
        case 'html':
          detectedLanguage = 'html';
          break;
        case 'css':
          detectedLanguage = 'css';
          break;
        case 'md':
          detectedLanguage = 'markdown';
          break;
        case 'js':
          detectedLanguage = 'javascript';
          break;
        case 'ts':
          detectedLanguage = 'typescript';
          break;
        case 'json':
          detectedLanguage = 'json';
          break;
        // Add more cases as needed
        default:
          detectedLanguage = 'plaintext';
      }

      setLanguage(detectedLanguage);
    }
  };

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      setTheme(darkModeMediaQuery.matches ? 'vs-dark' : 'light');
    };

    updateTheme();
    darkModeMediaQuery.addEventListener('change', updateTheme);

    return () => {
      darkModeMediaQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  const handleExplainClick = () => {
    alert(`Explain the content of ${currentFile}`);
  };

  return (
    <PageContainer scrollable>
      <div className="flex gap-4 p-4 h-full">
        {/* File Explorer Card */}
        <ResizableBox
          width={200}
          height={500}
          minConstraints={[150, 500]}
          maxConstraints={[400, 500]}
          className="bg-white dark:bg-black rounded-lg shadow-lg"
          axis="x"
        >
          <div className="p-4 h-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4">File Explorer</h2>
            <TreeView data={files} onFileClick={handleFileClick} />
          </div>
        </ResizableBox>

        {/* Code Editor Card */}
        <ResizableBox
          width={400}
          height={500}
          minConstraints={[300, 500]}
          maxConstraints={[600, 500]}
          className="bg-white dark:bg-black rounded-lg shadow-lg"
          axis="x"
        >
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Code Editor</h2>

            {/* Bar Above the Editor */}
            <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
              <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                /src/{currentFile}
              </span>
              <button
                className="px-4 py-2 text-xs md:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={handleExplainClick}
              >
                Explain
              </button>
            </div>

            <div className="w-full h-full border border-gray-300 dark:border-gray-700 rounded-b-lg">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={theme}
                language={language}  // Set the detected language here
              />
            </div>
          </div>
        </ResizableBox>

        {/* Chat Card */}
        <ResizableBox
          width={300}
          height={500}
          minConstraints={[200, 500]}
          maxConstraints={[400, 500]}
          className="bg-white dark:bg-black rounded-lg shadow-lg"
          axis="x"
        >
          <div className="flex flex-col h-full p-4">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Chat</h2>
            <div className="flex-grow overflow-y-auto mb-4">
              {/* Chat messages would go here */}
            </div>
            <div className="mt-auto">
              <InputBar />
            </div>
          </div>
        </ResizableBox>
      </div>
    </PageContainer>
  );
};

export default CodeExplorer;
