import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Button, 
  message, 
  Progress, 
  List, 
  Typography 
} from 'antd';
import { 
  UploadOutlined, 
  FileTextOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const PDFTableUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files || []);
    const pdfFiles = newFiles.filter(
      file => file.type === 'application/pdf'
    );

    if (pdfFiles.length === 0) {
      message.error('Please select PDF files only');
      return;
    }

    // Check for duplicates
    const uniquePDFs = pdfFiles.filter(
      newFile => !files.some(existingFile => existingFile.name === newFile.name)
    );

    setFiles(prevFiles => [...prevFiles, ...uniquePDFs]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(prevFiles => 
      prevFiles.filter(file => file.name !== fileToRemove.name)
    );
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      message.error('Please select PDF files first');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    setUploading(true);
    setProgress(0);

    try {
      const response = await axios.post(
        'http://localhost:8000/extract_tables_bulk/', 
        formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percentCompleted);
          }
        }
      );

      // Create a link to download the zip file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_tables.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success('PDF tables extracted successfully');
      setFiles([]); // Clear files after successful upload
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to extract tables');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <input 
        type="file" 
        multiple 
        accept=".pdf" 
        onChange={handleFileChange} 
        ref={fileInputRef}
        className="hidden"
        id="pdf-upload"
      />
      
      <Button 
        icon={<UploadOutlined />} 
        onClick={() => fileInputRef.current?.click()}
        className="w-full mb-4"
        type="dashed"
      >
        Select PDF Files
      </Button>

      {files.length > 0 && (
        <div className="mb-4">
          <List
            bordered
            dataSource={files}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <DeleteOutlined 
                    key="delete" 
                    onClick={() => removeFile(file)} 
                    className="text-red-500 cursor-pointer"
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined className="text-red-500" />}
                  title={file.name}
                />
              </List.Item>
            )}
          />
        </div>
      )}

      {uploading && (
        <Progress 
          percent={progress} 
          status="active" 
          className="mb-4"
        />
      )}

      <Button 
        type="primary" 
        onClick={handleUpload} 
        disabled={uploading || files.length === 0}
        className="w-full"
      >
        {uploading ? 'Extracting Tables...' : 'Extract Tables'}
      </Button>

      <Text type="secondary" className="block text-center mt-2">
        {files.length > 0 
          ? `${files.length} PDF file(s) selected` 
          : 'No files selected'}
      </Text>
    </div>
  );
};

export default PDFTableUploader;