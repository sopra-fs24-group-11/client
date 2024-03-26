import React, { useState } from "react";
import { FileInputButton, FileCard } from "@files-ui/react";

const FileButton: React.FC = () => {
  const [files, setFiles] = useState([]);

  const updateFiles = (newFiles) => {
    // Assuming newFiles is an array of file objects
    setFiles(newFiles);
  };

  const removeFile = (fileToRemove) => {
    // Filter out the file to remove
    setFiles(files.filter((file) => file.id !== fileToRemove.id));
  };

  return (
    <>
      <FileInputButton onChange={updateFiles} value={files} />
      {files.map((file) => (
        <FileCard
          key={file.id}
          {...file}
          onDelete={() => removeFile(file)}
          info
        />
      ))}
    </>
  );
};

export default FileButton;
