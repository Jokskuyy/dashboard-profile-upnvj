import React from 'react';
import type { DepartmentData } from '../types';

interface DepartmentBarChartProps {
  data: DepartmentData[];
  title?: string;
  onBarClick?: (department: DepartmentData) => void;
  selectedDepartment?: string;
  clickBarText?: string;
}

const DepartmentBarChart: React.FC<DepartmentBarChartProps> = ({
  data,
  title,
  onBarClick,
  selectedDepartment,
  clickBarText
}) => {
  const maxValue = Math.max(...data.map(item => item.professors));
  const sortedData = [...data].sort((a, b) => b.professors - a.professors);

  return (
    <div className="w-full">
      {title && <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>}
      
      <div className="space-y-3">
        {sortedData.map((department) => {
          const percentage = (department.professors / maxValue) * 100;
          const isSelected = selectedDepartment === department.id;
          
          return (
            <div key={department.id} className="group">
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: department.color }}
                  />
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {department.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {department.professors} {department.professors === 1 ? 'dosen' : 'dosen'}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      onBarClick 
                        ? `cursor-pointer hover:opacity-80 ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''}` 
                        : ''
                    }`}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: department.color,
                    }}
                    onClick={() => onBarClick?.(department)}
                    title={onBarClick ? clickBarText : undefined}
                  />
                </div>
                
                {/* Tooltip on hover */}
                {onBarClick && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {department.professors} dosen - {department.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {clickBarText && onBarClick && (
        <p className="text-xs text-gray-500 mt-4 text-center italic">
          {clickBarText}
        </p>
      )}
    </div>
  );
};

export default DepartmentBarChart;