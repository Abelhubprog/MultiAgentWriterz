"use client";

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CheckCircle, File as FileIcon } from 'lucide-react';

export const UploadZone = ({ onSimPdfUpload, onAiPdfUpload }) => {
  const [simFile, setSimFile] = useState(null);
  const [aiFile, setAiFile] = useState(null);

  const onDropSim = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSimFile(file);
      onSimPdfUpload(file);
    }
  };

  const onDropAi = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setAiFile(file);
      onAiPdfUpload(file);
    }
  };

  const { getRootProps: getRootPropsSim, getInputProps: getInputPropsSim } = useDropzone({
    onDrop: onDropSim,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const { getRootProps: getRootPropsAi, getInputProps: getInputPropsAi } = useDropzone({
    onDrop: onDropAi,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const renderDropzoneContent = (file, title) => {
    if (file) {
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span>{file.name}</span>
        </div>
      );
    }
    return (
      <>
        <FileIcon className="h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">{title}</p>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootPropsSim()}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputPropsSim()} />
        {renderDropzoneContent(simFile, 'Drop Similarity PDF here, or click to select')}
      </div>
      <div
        {...getRootPropsAi()}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputPropsAi()} />
        {renderDropzoneContent(aiFile, 'Drop AI Score PDF here, or click to select')}
      </div>
    </div>
  );
};