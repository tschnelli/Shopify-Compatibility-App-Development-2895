import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useCompatibility } from '../context/CompatibilityContext';
import { motion } from 'framer-motion';

const AnalyticsPanel = () => {
  const { compatibilityData, products, getMissingProducts } = useCompatibility();
  const missingProducts = getMissingProducts();
  const totalProducts = compatibilityData.length;
  const totalCompatibilities = compatibilityData.reduce((sum, item) => sum + item.compatibleProducts.length, 0);
  const averageCompatibilities = totalProducts > 0 ? (totalCompatibilities / totalProducts).toFixed(1) : 0;

  const chartOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'horizontal', bottom: 0 },
    series: [
      {
        name: 'Products',
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '{b}: {c}'
        },
        data: [
          { value: products.length, name: 'Products in Store', itemStyle: { color: '#3b82f6' } },
          { value: missingProducts.length, name: 'Missing Products', itemStyle: { color: '#facc15' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.15)'
          }
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f6f8fa] p-2 sm:p-6 min-h-[600px]"
    >
      {/* Top stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard label="Products" value={totalProducts} sublabel="Total" color="text-blue-900" />
        <StatCard label="Compatibilities" value={totalCompatibilities} sublabel="Total" color="text-blue-900" />
        <StatCard label="Avg. per Product" value={averageCompatibilities} sublabel="" color="text-blue-900" />
      </div>
      {/* Main grid row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col">
          <div className="text-xs font-semibold text-gray-500 mb-1">Compatibility Distribution</div>
          <div className="flex-1 flex items-center justify-center">
            <ReactECharts option={chartOption} style={{ height: '180px', width: '100%' }} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col">
          <div className="text-xs font-semibold text-gray-500 mb-1">Data Quality</div>
          <div className="flex-1 flex flex-col gap-2 mt-2">
            <DataRow label="Products found in store:" value={products.length} valueClass="text-blue-700" />
            <DataRow label="Missing products:" value={missingProducts.length} valueClass={missingProducts.length > 0 ? 'text-yellow-600' : 'text-green-600'} />
            <DataRow label="Data completeness:" value={totalProducts > 0 ? Math.round((products.length / (products.length + missingProducts.length)) * 100) : 0 + '%'} valueClass="" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col">
          <div className="text-xs font-semibold text-gray-500 mb-1">Legend</div>
          <div className="flex-1 flex flex-col gap-2 mt-2 text-xs text-gray-600">
            <LegendRow color="bg-blue-400" label="Products in Store" />
            <LegendRow color="bg-yellow-400" label="Missing Products" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function StatCard({ label, value, sublabel, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
      <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      {sublabel && <div className="text-sm text-gray-500">{sublabel}</div>}
    </div>
  );
}

function DataRow({ label, value, valueClass }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function LegendRow({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-3 h-3 rounded-full ${color}`}></span>
      <span>{label}</span>
    </div>
  );
}

export default AnalyticsPanel;