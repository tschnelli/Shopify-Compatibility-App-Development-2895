import React from 'react';
import {
  Card,
  FormLayout,
  Checkbox,
  TextField,
  Select,
  Text,
  Box,
  BlockStack,
  Banner
} from '@shopify/polaris';
import { motion } from 'framer-motion';
import { useCompatibility } from '../context/CompatibilityContext';

const SettingsPanel = () => {
  const { settings, updateSettings } = useCompatibility();

  const positionOptions = [
    { label: 'Above product description', value: 'above-description' },
    { label: 'Below product description', value: 'below-description' },
    { label: 'In product tabs', value: 'product-tabs' },
    { label: 'Custom position', value: 'custom' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2" className="text-blue-900 font-bold text-xl mb-2 flex items-center gap-2">
          <span>App Settings</span>
        </Text>

        <Card>
          <Box padding="400">
            <FormLayout>
              <Text variant="headingMd" as="h3" className="text-blue-800 font-semibold text-lg flex items-center gap-2 mt-2 mb-1">
                <span>Widget Display</span>
              </Text>
              
              <Checkbox
                label="Enable compatibility widget on product pages"
                checked={settings.enableWidget}
                onChange={(checked) => updateSettings({ enableWidget: checked })}
                helpText="Show the compatibility list to customers on product pages"
              />

              <TextField
                label={<span className="text-blue-900">Widget title</span>}
                value={settings.widgetTitle}
                onChange={(value) => updateSettings({ widgetTitle: value })}
                helpText="The heading displayed above the compatibility list"
              />

              <Select
                label={<span className="text-blue-900">Widget position</span>}
                options={positionOptions}
                value={settings.widgetPosition}
                onChange={(value) => updateSettings({ widgetPosition: value })}
                helpText="Where to display the compatibility widget on product pages"
              />
            </FormLayout>
          </Box>
        </Card>

        <Card>
          <Box padding="400">
            <FormLayout>
              <Text variant="headingMd" as="h3" className="text-blue-800 font-semibold text-lg flex items-center gap-2 mt-2 mb-1">
                <span>Product Handling</span>
              </Text>
              
              <Checkbox
                label={<span className="text-blue-900">Show products not found in store</span>}
                checked={settings.showMissingProducts}
                onChange={(checked) => updateSettings({ showMissingProducts: checked })}
                helpText="Display compatibility products even if they don't exist in your store (without links)"
              />
            </FormLayout>
          </Box>
        </Card>

        <Banner
          title={<span className="text-blue-800 font-semibold flex items-center gap-2">Widget Integration</span>}
          tone="info"
        >
          <Text as="p">
            To display the compatibility widget on your product pages, add the following code to your product template:
          </Text>
          <Box padding="200" background="bg-surface-secondary" borderRadius="200">
            <Text variant="bodySm" fontWeight="regular" as="code">
              {`<div id="compatibility-widget" data-product-id="{{ product.id }}"></div>
<script src="https://your-app.com/widget.js"></script>`}
            </Text>
          </Box>
        </Banner>
      </BlockStack>
    </motion.div>
  );
};

export default SettingsPanel;