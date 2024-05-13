import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';



const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        const newFiles = [...files, { name: file.name, type: file.type, content: reader.result }];
        setFiles(newFiles);
        setActiveFile(newFiles.length - 1);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  const handleCloseFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Update activeFile state if the closed file was active
    if (activeFile === index) {
      setActiveFile(newFiles.length > 0 ? 0 : null);
      //setActiveFile(newFiles.length > 0 ? Math.max(0, index - 1) : null);
    } else if (activeFile > index) {
      setActiveFile(activeFile - 1); // Adjust activeFile index if necessary
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileUpload} />
      <div>
        {files.map((file, index) => (
          <div key={index}>
            <button onClick={() => handleCloseFile(index)}>Close</button>
            <span>{file.name}</span>
            {activeFile === index && (
              <div>
                {file.type === 'application/pdf' ? (
                  <Document file={{ data: file.content }}>
                    <Page pageNumber={1} />
                  </Document>
                ) : (
                  <pre>{file.content}</pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
