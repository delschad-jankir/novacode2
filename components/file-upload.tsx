'use client';

import { useDropzone } from 'react-dropzone';
import { Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

interface FileUploadProps {
  onChange?: (files: File[]) => void;
  onRemove: (files: File[]) => void;
  value: File[];
}

export default function FileUpload({
  onChange,
  onRemove,
  value
}: FileUploadProps) {
  const { toast } = useToast();
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>(value);

  // Handle incoming value changes from the parent component
  useEffect(() => {
    setAcceptedFiles(value);
  }, [value]);

  const onDrop = (newAcceptedFiles: File[]) => {
    // Update the state and parent component with new files
    const updatedFiles = [...acceptedFiles, ...newAcceptedFiles];
    setAcceptedFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const handleRemove = (file: File) => {
    const filteredFiles = acceptedFiles.filter(f => f !== file);
    setAcceptedFiles(filteredFiles);
    if (onRemove) {
      onRemove(filteredFiles);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(file => {
        if (file.errors) {
          file.errors.forEach(error => {
            if (error.code === 'file-too-large') {
              toast({
                title: 'Error',
                variant: 'destructive',
                description: 'File is too large. Max size is 100 MB.',
              });
            } else if (error.code === 'file-invalid-type') {
              toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Invalid file type. Only ZIP files are allowed.',
              });
            }
          });
        }
      });
    }
  });

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {!!acceptedFiles.length &&
          acceptedFiles.map((file, index) => (
            <div
              key={index}
              className="relative h-[200px] w-[200px] overflow-hidden rounded-md flex items-center justify-center bg-gray-100"
            >
              <div className="absolute right-2 top-2 z-10">
                <Button
                  type="button"
                  onClick={() => handleRemove(file)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center text-sm">
                {file.name}
              </div>
            </div>
          ))}
      </div>
      <div
        {...getRootProps({
          className: 'border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer'
        })}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          Drag & drop ZIP files here, or click to select files
        </p>
      </div>
    </div>
  );
}
