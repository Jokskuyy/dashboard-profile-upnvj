import React, { useState } from "react";
import {
  GraduationCap,
  Users,
  BarChart3,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getTotalStats,
  getStudentsByFaculty,
  getProgramsByFacultyId,
} from "../utils/staticData";
import FacultyBarChart from "./FacultyBarChart";
import ProgramBarChart from "./ProgramBarChart";
import type { ProgramData } from "../types";

const StudentsSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const totalStats = getTotalStats();
  const facultyData = getStudentsByFaculty();

  const selectedFacultyData = selectedFaculty
    ? facultyData.find((f) => f.id === selectedFaculty)
    : null;

  const programsData = selectedFaculty
    ? getProgramsByFacultyId(selectedFaculty)
    : [];

  const selectedProgramData = selectedProgram
    ? programsData.find((p) => p.id === selectedProgram)
    : null;

  const handleBarClick = (faculty: any) => {
    setSelectedFaculty(faculty.id);
    setSelectedProgram(null); // Reset program selection
  };

  const handleProgramClick = (program: ProgramData) => {
    setSelectedProgram(program.id);
  };

  const handleBackToChart = () => {
    if (selectedProgram) {
      setSelectedProgram(null); // Go back to faculty programs view
    } else {
      setSelectedFaculty(null); // Go back to faculty overview
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-green-600" />
            {selectedProgramData
              ? selectedProgramData.name
              : selectedFacultyData
              ? selectedFacultyData.name
              : t("studentsTitle")}
          </h3>
          <p className="text-gray-600 mt-1">
            {selectedProgramData
              ? `${selectedProgramData.students?.toLocaleString()} ${t(
                  "studentsInProgram"
                )}`
              : selectedFacultyData
              ? `${selectedFacultyData.count?.toLocaleString()} ${t(
                  "studentsInFaculty"
                )}`
              : t("studentsSubtitle")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {selectedProgramData
              ? selectedProgramData.students?.toLocaleString()
              : selectedFacultyData
              ? selectedFacultyData.count?.toLocaleString()
              : totalStats.totalStudents.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{t("totalStudents")}</p>
        </div>
      </div>

      {!selectedFaculty ? (
        // Faculty Bar Chart View
        <div>
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("studentDistribution")}
            </span>
          </div>
          <FacultyBarChart
            data={facultyData}
            title=""
            onBarClick={handleBarClick}
            selectedFaculty={selectedFaculty || undefined}
            clickBarText={t("clickBarForDetail")}
          />
        </div>
      ) : !selectedProgram ? (
        // Program Bar Chart View
        <div>
          <button
            onClick={handleBackToChart}
            className="flex items-center text-green-600 hover:text-green-800 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToChart")}
          </button>

          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("programDistribution")}
            </span>
          </div>
          <ProgramBarChart
            data={programsData}
            title=""
            onBarClick={handleProgramClick}
            selectedProgram={selectedProgram || undefined}
            clickBarText={t("clickBarForProgramDetail")}
          />
        </div>
      ) : (
        // Program Detail View
        <div>
          <button
            onClick={handleBackToChart}
            className="flex items-center text-green-600 hover:text-green-800 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToFacultyChart")}
          </button>

          {/* Program Detail Cards */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-600" />
              {selectedProgramData?.name}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="border rounded-lg p-4 bg-white"
                style={{
                  borderColor: `${selectedProgramData?.color}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: selectedProgramData?.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("level")}
                    </span>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: selectedProgramData?.color }}
                  >
                    {selectedProgramData?.level}
                  </span>
                </div>
              </div>
              <div
                className="border rounded-lg p-4 bg-white"
                style={{
                  borderColor: `${selectedProgramData?.color}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users
                      className="w-4 h-4 mr-2"
                      style={{ color: selectedProgramData?.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("students")}
                    </span>
                  </div>
                  <span
                    className="text-lg font-bold"
                    style={{ color: selectedProgramData?.color }}
                  >
                    {selectedProgramData?.students?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div
                className="border rounded-lg p-4 bg-white"
                style={{
                  borderColor: `${selectedProgramData?.color}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap
                      className="w-4 h-4 mr-2"
                      style={{ color: selectedProgramData?.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("faculty")}
                    </span>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: selectedProgramData?.color }}
                  >
                    {selectedFacultyData?.shortName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsSection;
