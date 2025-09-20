import React from 'react';

interface FacultyData {
  id: string;
  shortName: string;
  name: string;
  color: string;
  count: number;
}

interface FacultyBarChartProps {
  data: FacultyData[];
  title: string;
  onBarClick: (facultyData: FacultyData) => void;
  selectedFaculty?: string;
}

const FacultyBarChart: React.FC<FacultyBarChartProps> = ({ 
  data, 
  title, 
  onBarClick, 
  selectedFaculty 
}) => {
  const maxCount = Math.max(...data.map(d => d.count));
  const chartHeight = 280;
  
  // Generate Y-axis scale
  const yAxisSteps = 5;
  const stepValue = Math.ceil(maxCount / yAxisSteps);
  const yAxisValues = Array.from({ length: yAxisSteps + 1 }, (_, i) => i * stepValue);
  
  return (
    <div className="space-y-4">
      {title && <h4 className="text-lg font-semibold text-gray-800">{title}</h4>}
      
      {/* Chart Container */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex">
          {/* Y-Axis */}
          <div className="flex flex-col justify-between mr-4" style={{ height: chartHeight }}>
            {yAxisValues.reverse().map((value, index) => (
              <div key={index} className="text-xs text-gray-500 text-right w-8">
                {value}
              </div>
            ))}
          </div>
          
          {/* Chart Area */}
          <div className="flex-1">
            {/* Horizontal Grid Lines */}
            <div className="relative" style={{ height: chartHeight }}>
              {yAxisValues.map((_, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-gray-200"
                  style={{ 
                    top: `${(index / (yAxisValues.length - 1)) * 100}%`,
                    transform: 'translateY(-50%)'
                  }}
                />
              ))}
              
              {/* Bars Container */}
              <div className="absolute inset-0 flex items-end px-4">
                {data.map((faculty, index) => {
                  const barHeight = (faculty.count / maxCount) * (chartHeight - 20);
                  const isSelected = selectedFaculty === faculty.id;
                  const barWidth = 50;
                  const totalBars = data.length;
                  
                  return (
                    <div 
                      key={faculty.id} 
                      className="absolute flex flex-col items-center group"
                      style={{ 
                        left: `${(index + 0.5) / totalBars * 100}%`,
                        transform: 'translateX(-50%)',
                        bottom: 0
                      }}
                    >
                      {/* Bar */}
                      <button
                        onClick={() => onBarClick(faculty)}
                        className={`relative transition-all duration-300 rounded-t-lg border-2 border-transparent hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isSelected 
                            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105' 
                            : 'hover:shadow-md'
                        }`}
                        style={{
                          width: `${barWidth}px`,
                          height: `${barHeight}px`,
                          backgroundColor: faculty.color,
                          minHeight: '4px'
                        }}
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>
                        
                        {/* Value label on bar */}
                        {barHeight > 30 && (
                          <div className="absolute inset-x-0 top-2 text-white text-xs font-bold text-center">
                            {faculty.count}
                          </div>
                        )}
                        
                        {/* Hover tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {faculty.name}: {faculty.count}
                          </div>
                          <div className="w-2 h-2 bg-gray-800 transform rotate-45 mx-auto -mt-1"></div>
                        </div>
                      </button>
                      
                      {/* Value label below bar (if bar is too short) */}
                      {barHeight <= 30 && (
                        <div className="text-xs font-semibold text-gray-700 mt-1">
                          {faculty.count}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* X-Axis Labels */}
            <div className="flex mt-4 px-4 relative" style={{ minHeight: '60px' }}>
              {data.map((faculty, index) => {
                const totalBars = data.length;
                return (
                  <div 
                    key={faculty.id} 
                    className="absolute text-center"
                    style={{ 
                      left: `${(index + 0.5) / totalBars * 100}%`,
                      transform: 'translateX(-50%)',
                      width: '80px'
                    }}
                  >
                    <div className="text-sm font-medium text-gray-700">
                      {faculty.shortName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 leading-tight">
                      {faculty.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Klik pada bar untuk melihat detail fakultas
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyBarChart;
