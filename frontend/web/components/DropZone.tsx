"use client";

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { File as FileIcon, Image as ImageIcon } from 'lucide-react';

export const DropZone = ({ onTextExtracted }) => {
  const [files, setFiles] = useState([]);

  const onDrop = async (acceptedFiles) => {
    setFiles(acceptedFiles);
    
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/vision', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          onTextExtracted(data.text);
        } catch (error) {
          console.error("Failed to process image:", error);
        }
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
    >
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <div className="flex flex-col items-center">
          {files[0].type.startsWith('image/') ? <ImageIcon /> : <FileIcon />}
          <p>{files.map(f => f.name).join(', ')}</p>
        </div>
      ) : (
        <p>Drop files here, or click to select</p>
      )}
    </div>
  );
};