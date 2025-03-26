import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  const onFileChange = (e) => {
    setFiles(e.target.files);
    setProgress(0);
    setDownloadUrl(null);
  };

  const uploadFiles = async () => {
    if (!files) {
      alert("Please select files.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setDownloadUrl(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post("http://localhost:8000/extract_tables_bulk/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
        onDownloadProgress: () => {
          // Simulate progress: one update per file every second
          let current = 0;
          const interval = setInterval(() => {
            current++;
            setProgress(current);
            if (current >= files.length) {
              clearInterval(interval);
            }
          }, 1000);
        },
      });

      const blob = response.data;
      const downloadUrl = window.URL.createObjectURL(blob);
      setDownloadUrl(downloadUrl);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred during the file upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>PDF Table Extractor</h1>
      <div className="file-upload">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={onFileChange}
        />
      </div>

      {loading ? (
        <div>
          <div className="spinner"></div>
          <div className="loading-text">Processing files...</div>
          <div className="progress-text">
            {progress} of {files?.length || 0} file(s) done
          </div>
        </div>
      ) : (
        <button onClick={uploadFiles}>Upload and Extract Tables</button>
      )}

      {downloadUrl && (
        <div className="download">
          <a href={downloadUrl} download="processed_tables.zip">
            Download Processed Tables
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
