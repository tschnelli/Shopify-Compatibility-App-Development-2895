import React, { useState } from 'react';
import {
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  EmptyState,
  Filters,
  Box,
  InlineStack,
  BlockStack
} from '@shopify/polaris';
import { motion } from 'framer-motion';
import { useCompatibility } from '../context/CompatibilityContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPackage } = FiIcons;

const ProductList = () => {
  const { compatibilityData, products, getMissingProducts } = useCompatibility();
  const [queryValue, setQueryValue] = useState('');

  const missingProducts = getMissingProducts();

  const filteredData = compatibilityData.filter(item => {
    const matchesQuery = item.productId.toLowerCase().includes(queryValue.toLowerCase());
    return matchesQuery;
  });

  const renderItem = (item) => {
    const { productId, compatibleProducts } = item;
    const product = products.find(p => p.id === productId);
    const existingCompatible = compatibleProducts.filter(id => 
      products.find(p => p.id === id)
    );
    const missingCompatible = compatibleProducts.filter(id => 
      !products.find(p => p.id === id)
    );

    return (
      <ResourceItem
        id={productId}
        key={productId}
        accessibilityLabel={`Product ${productId}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box padding="300">
            <BlockStack gap="200">
              <InlineStack alignment="space-between">
                <InlineStack gap="200" alignment="center">
                  <SafeIcon icon={FiPackage} size={16} className="text-blue-500" />
                  <Text variant="bodyMd" fontWeight="semibold" className="text-blue-900">
                    {product ? product.title : productId}
                  </Text>
                  {!product && (
                    <Badge tone="warning" size="small">Not Found</Badge>
                  )}
                </InlineStack>
                <Text variant="bodySm" tone="subdued">
                  {compatibleProducts.length} compatible products
                </Text>
              </InlineStack>

              <InlineStack gap="400">
                <div>
                  <Text variant="bodySm" fontWeight="medium" tone="success">
                    Found: {existingCompatible.length}
                  </Text>
                </div>
                {missingCompatible.length > 0 && (
                  <div>
                    <Text variant="bodySm" fontWeight="medium" tone="warning">
                      Missing: {missingCompatible.length}
                    </Text>
                  </div>
                )}
              </InlineStack>

              {missingCompatible.length > 0 && (
                <Box
                  padding="200"
                  background="bg-surface-warning-subdued"
                  borderRadius="200"
                  className="text-xs"
                >
                  <Text variant="bodySm">
                    Missing products: {missingCompatible.join(', ')}
                  </Text>
                </Box>
              )}
            </BlockStack>
          </Box>
        </motion.div>
      </ResourceItem>
    );
  };

  if (compatibilityData.length === 0) {
    return (
      <EmptyState
        heading="No compatibility data found"
        action={{
          content: 'Upload CSV',
          onAction: () => {
            // Switch to upload tab
          }
        }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <Text as="p">
          Upload a CSV file to start managing product compatibility relationships.
        </Text>
      </EmptyState>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BlockStack gap="400">
        <InlineStack alignment="space-between">
          <Text variant="headingMd" as="h2">
            Product Compatibility Overview
          </Text>
          {missingProducts.length > 0 && (
            <Badge tone="warning">
              {missingProducts.length} products missing
            </Badge>
          )}
        </InlineStack>

        <Card>
          <ResourceList
            resourceName={{ singular: 'product', plural: 'products' }}
            items={filteredData}
            renderItem={renderItem}
            filterControl={
              <Filters
                queryValue={queryValue}
                filters={[]}
                onQueryChange={setQueryValue}
                onQueryClear={() => setQueryValue('')}
                onClearAll={() => {
                  setQueryValue('');
                }}
              />
            }
            emptyState={
              <EmptyState
                heading="No products match your search"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                imageContained
                className="!max-w-xs mx-auto"
                imageStyle={{ width: 64, height: 64, maxWidth: 64, maxHeight: 64 }}
              >
                <Text as="p">
                  Try adjusting your search terms or filters.
                </Text>
              </EmptyState>
            }
          />
        </Card>
      </BlockStack>
    </motion.div>
  );
};

export default ProductList;