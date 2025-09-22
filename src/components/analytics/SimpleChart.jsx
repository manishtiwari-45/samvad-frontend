import React from 'react';

const SimpleBarChart = ({ data, title, color = '#3B82F6' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-24 text-sm text-gray-600 truncate" title={item.name}>
              {item.name}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-3 relative">
              <div
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <div className="w-12 text-sm font-medium text-gray-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleLineChart = ({ data, title, color = '#10B981' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0">
            <div>
              <div className="font-medium text-gray-900">{item.name}</div>
              {item.date && (
                <div className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-semibold" style={{ color }}>
                {item.value}
              </div>
              {item.subtitle && (
                <div className="text-sm text-gray-500">{item.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { SimpleBarChart, SimpleLineChart };
