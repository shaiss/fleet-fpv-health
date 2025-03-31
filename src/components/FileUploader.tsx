
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCSV, DroneData } from '@/utils/csvParser';

interface FileUploaderProps {
  onDataLoaded: (data: DroneData[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const data = parseCSV(csvText);
        
        if (data.length === 0) {
          toast.error('No valid data found in the CSV file');
          return;
        }
        
        onDataLoaded(data);
        toast.success(`Successfully loaded ${data.length} drones`);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Failed to parse the CSV file');
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read the file');
    };
    
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full mb-6">
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-secondary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">Upload your drone fleet CSV</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your CSV file here, or click to browse
        </p>
        <Button 
          onClick={handleButtonClick}
          variant="outline" 
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Select CSV File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
};

export default FileUploader;
