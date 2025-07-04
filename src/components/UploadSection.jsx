import React, { useState, useCallback } from 'react';
import {
  Card,
  Button,
  DropZone,
  Text,
  Banner,
  Box,
  InlineStack,
  BlockStack
} from '@shopify/polaris';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { useCompatibility } from '../context/CompatibilityContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiCheck, FiAlertTriangle } = FiIcons;

const UploadSection = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const { saveCompatibilityData, loading, setLoading } = useCompatibility();

  const handleDropZoneDrop = useCallback((droppedFiles) => {
    setFiles(droppedFiles);
    setUploadStatus(null);
    setValidationErrors([]);
  }, []);

  const validateCSVData = (data) => {
    const errors = [];
    const requiredColumns = ['Product ID', 'Compatible Product IDs'];
    
    if (data.length === 0) {
      errors.push('CSV file is empty');
      return errors;
    }

    const headers = Object.keys(data[0]);
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    data.forEach((row, index) => {
      if (!row['Product ID']) {
        errors.push(`Row ${index + 2}: Product ID is required`);
      }
      if (!row['Compatible Product IDs']) {
        errors.push(`Row ${index + 2}: Compatible Product IDs is required`);
      }
    });

    return errors;
  };

  const processCSV = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setUploadStatus(null);
    setValidationErrors([]);

    try {
      const file = files[0];
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const errors = validateCSVData(results.data);
          
          if (errors.length > 0) {
            setValidationErrors(errors);
            setUploadStatus('error');
            setLoading(false);
            return;
          }

          const compatibilityData = results.data.map(row => ({
            productId: row['Product ID'].trim(),
            compatibleProducts: row['Compatible Product IDs']
              .split(',')
              .map(id => id.trim())
              .filter(id => id.length > 0)
          }));

          saveCompatibilityData(compatibilityData);
          setUploadStatus('success');
          setLoading(false);
        },
        error: (error) => {
          setValidationErrors([`CSV parsing error: ${error.message}`]);
          setUploadStatus('error');
          setLoading(false);
        }
      });
    } catch (error) {
      setValidationErrors([`Upload failed: ${error.message}`]);
      setUploadStatus('error');
      setLoading(false);
    }
  };

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint="Accepts .csv files" />
  );

  const uploadedFiles = files.length > 0 && (
    <BlockStack gap="300">
      {files.map((file, index) => (
        <InlineStack alignment="center" gap="200" key={index}>
          <SafeIcon icon={FiUpload} size={16} className="text-blue-500" />
          <Text variant="bodySm" className="truncate max-w-[120px]">{file.name}</Text>
        </InlineStack>
      ))}
    </BlockStack>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Upload Compatibility Data
        </Text>
        
        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <DropZone onDrop={handleDropZoneDrop} accept=".csv" type="file">
                {uploadedFiles}
                {fileUpload}
              </DropZone>

              {files.length > 0 && (
                <InlineStack gap="200">
                  <Button
                    variant="primary"
                    onClick={processCSV}
                    loading={loading}
                    disabled={loading}
                  >
                    Process CSV
                  </Button>
                  <Button
                    onClick={() => {
                      setFiles([]);
                      setUploadStatus(null);
                      setValidationErrors([]);
                    }}
                  >
                    Clear
                  </Button>
                </InlineStack>
              )}
            </BlockStack>
          </Box>
        </Card>

        {uploadStatus === 'success' && (
          <Banner tone="success" title="Upload Successful">
            <Text as="p">
              Your compatibility data has been processed and saved successfully.
            </Text>
          </Banner>
        )}

        {uploadStatus === 'error' && validationErrors.length > 0 && (
          <Banner tone="critical" title="Upload Failed">
            <BlockStack gap="200">
              {validationErrors.map((error, index) => (
                <Text as="p" key={index}>
                  • {error}
                </Text>
              ))}
            </BlockStack>
          </Banner>
        )}

        <Card>
          <Box padding="400">
            <BlockStack gap="300">
              <Text variant="headingMd" as="h3">
                CSV Format Requirements
              </Text>
              <Text as="p">
                Your CSV file should contain the following columns:
              </Text>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li><strong>Product ID</strong>: The unique identifier for the main product</li>
                <li><strong>Compatible Product IDs</strong>: Comma-separated list of compatible product IDs</li>
              </ul>
              <Text as="p" tone="subdued">
                Example: product-1,"product-2,product-3,product-4"
              </Text>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </motion.div>
  );
};

export default UploadSection;