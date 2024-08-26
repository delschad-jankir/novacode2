import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolder, FaHtml5, FaCss3Alt, FaMarkdown, FaJsSquare, FaTypewriter, FaJson, FaFileAlt, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { TFiles } from './types';
import convertJsonToTFiles from './convertJsonToTFiles';

const sortEntries = (entries: TFiles[]): TFiles[] => {
    // Sort entries where folders come before files
    return entries.sort((a, b) => {
      // If both are folders or both are files, sort alphabetically
      if ((a.children && b.children) || (!a.children && !b.children)) {
        return a.name.localeCompare(b.name);
      }
      // Folders come before files
      return a.children ? -1 : 1;
    });
  };

const getFileIcon = (type?: string) => {
  switch (type) {
    case 'html': return <FaHtml5 className="text-black dark:text-white" />;
    case 'css': return <FaCss3Alt className="text-black dark:text-white" />;
    case 'md': return <FaMarkdown className="text-black dark:text-white" />;
    case 'js': return <FaJsSquare className="text-black dark:text-white" />;
    case 'ts': return <FaTypewriter className="text-black dark:text-white" />;
    case 'json': return <FaJson className="text-black dark:text-white" />;
    default: return <FaFileAlt className="text-black dark:text-white" />;
  }
};

type EntryProps = {
  entry: TFiles;
  depth: number;
  onFileClick: (fileName: string) => void;
  selectedFile: string;
  onSelect: (fileName: string) => void;
};

const Entry: React.FC<EntryProps> = ({ entry, depth, onFileClick, selectedFile, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleClick = () => {
    if (entry.children && entry.children.length > 0) {
      setIsExpanded(prev => !prev);
    } else {
      onFileClick(entry.name);
      onSelect(entry.name);
    }
  };

  const isSelected = entry.name === selectedFile;
  const isFolder = entry.children && entry.children.length > 0;

  return (
    <div className={`flex flex-col ${depth > 0 ? 'ml-4' : ''}`}>
      <div className={`flex items-center ${isSelected ? 'bg-gray-200 dark:bg-gray-800' : ''}`}>
        {isFolder && (
          <button
            onClick={handleClick}
            className="flex items-center p-1 text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-100"
            style={{ marginLeft: depth * 16 }} // Adjust left margin based on depth
          >
            {isExpanded ? <FaChevronDown className="text-base" /> : <FaChevronRight className="text-base" />}
          </button>
        )}
        {isFolder ? (
          <FaFolder className="ml-1 text-black dark:text-white" />
        ) : (
          getFileIcon(entry.type)
        )}
        <span
          onClick={handleClick}
          className={`ml-2 cursor-pointer text-gray-800 dark:text-gray-200 hover:underline ${
            isSelected ? 'font-bold' : ''
          }`}
        >
          {entry.name}
        </span>
      </div>
      {isExpanded && isFolder && (
        <div className="flex flex-col ml-4">
          {sortEntries(entry.children).map((child) => (
            <Entry
              key={child.name}
              entry={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type TreeViewProps = {
  onFileClick: (fileName: string) => void;
};

const TreeView: React.FC<TreeViewProps> = ({ onFileClick }) => {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [filesData, setFilesData] = useState<TFiles[]>([]);

  const handleSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:4000/testDirectory');
        const convertedData = convertJsonToTFiles(response.data);
        console.log('Converted Data:', convertedData);
        setFilesData(sortEntries(convertedData)); // Apply sorting here
      } catch (error) {
        console.error('Error fetching directory structure:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      {filesData.length === 0 ? (
        <p>No files available</p>
      ) : (
        sortEntries(filesData).map((entry) => (
          <Entry
            key={entry.name}
            entry={entry}
            depth={0}
            onFileClick={onFileClick}
            selectedFile={selectedFile}
            onSelect={handleSelect}
          />
        ))
      )}
    </div>
  );
};

export default TreeView;
