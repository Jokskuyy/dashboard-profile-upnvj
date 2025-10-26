import React from "react";
import type { ProgramData } from "../../types";

interface ProgramBarChartProps {
  data: ProgramData[];
  title?: string;
  onBarClick?: (program: ProgramData) => void;
  selectedProgram?: string;
  clickBarText?: string;
}

const ProgramBarChart: React.FC<ProgramBarChartProps> = ({
  data,
  title,
  onBarClick,
  selectedProgram,
  clickBarText,
}) => {
  const maxValue = Math.max(...data.map((item) => item.students));
  const sortedData = [...data].sort((a, b) => b.students - a.students);

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
      )}

      <div className="space-y-3">
        {sortedData.map((program) => {
          const percentage = (program.students / maxValue) * 100;
          const isSelected = selectedProgram === program.id;

          return (
            <div key={program.id} className="group">
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: program.color }}
                  />
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {program.name}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                    {program.level}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {program.students.toLocaleString()}
                </span>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      onBarClick
                        ? `cursor-pointer hover:opacity-80 ${
                            isSelected
                              ? "ring-2 ring-offset-1 ring-blue-500"
                              : ""
                          }`
                        : ""
                    }`}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: program.color,
                    }}
                    onClick={() => onBarClick?.(program)}
                    title={onBarClick ? clickBarText : undefined}
                  />
                </div>

                {/* Tooltip on hover */}
                {onBarClick && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {program.students.toLocaleString()} mahasiswa
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

export default ProgramBarChart;
