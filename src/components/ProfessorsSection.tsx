import React, { useState } from "react";
import { Users, BarChart3, ArrowLeft, BookOpen } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  professorsData,
  getProfessorsByFaculty,
  getDepartmentsByFacultyId,
} from "../utils/staticData";
import FacultyBarChart from "./FacultyBarChart";
import DepartmentBarChart from "./DepartmentBarChart";
import type { DepartmentData } from "../types";

const ProfessorsSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const facultyData = getProfessorsByFaculty();

  const selectedFacultyData = selectedFaculty
    ? facultyData.find((f) => f.id === selectedFaculty)
    : null;

  const departmentsData = selectedFaculty
    ? getDepartmentsByFacultyId(selectedFaculty)
    : [];

  const selectedDepartmentData = selectedDepartment
    ? departmentsData.find((d) => d.id === selectedDepartment)
    : null;

  const handleBarClick = (faculty: any) => {
    setSelectedFaculty(faculty.id);
    setSelectedDepartment(null); // Reset department selection
  };

  const handleDepartmentClick = (department: DepartmentData) => {
    setSelectedDepartment(department.id);
  };

  const handleBackToChart = () => {
    if (selectedDepartment) {
      setSelectedDepartment(null); // Go back to department view
    } else {
      setSelectedFaculty(null); // Go back to faculty overview
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            {selectedDepartmentData
              ? selectedDepartmentData.name
              : selectedFacultyData
              ? selectedFacultyData.name
              : t("professorsTitle")}
          </h3>
          <p className="text-gray-600 mt-1">
            {selectedDepartmentData
              ? `${selectedDepartmentData.professors} ${t(
                  "professorsInDepartment"
                )}`
              : selectedFacultyData
              ? `${selectedFacultyData.count} ${t("professorsInFaculty")}`
              : t("professorsSubtitle")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            {selectedDepartmentData
              ? selectedDepartmentData.professors
              : selectedFacultyData
              ? selectedFacultyData.count
              : professorsData.length}
          </p>
          <p className="text-sm text-gray-500">{t("totalProfessors")}</p>
        </div>
      </div>

      {!selectedFaculty ? (
        // Faculty Bar Chart View
        <div>
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("professorDistribution")}
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
      ) : !selectedDepartment ? (
        // Department Bar Chart View
        <div>
          <button
            onClick={handleBackToChart}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToChart")}
          </button>

          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("departmentDistribution")}
            </span>
          </div>
          <DepartmentBarChart
            data={departmentsData}
            title=""
            onBarClick={handleDepartmentClick}
            selectedDepartment={selectedDepartment || undefined}
            clickBarText={t("clickBarForDepartmentDetail")}
          />
        </div>
      ) : (
        // Department Detail View
        <div>
          <button
            onClick={handleBackToChart}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToProfessorChart")}
          </button>

          {/* Department Detail Cards */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              {selectedDepartmentData?.name}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="border rounded-lg p-4 bg-white"
                style={{
                  borderColor: `${selectedDepartmentData?.color}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users
                      className="w-4 h-4 mr-2"
                      style={{ color: selectedDepartmentData?.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("professors")}
                    </span>
                  </div>
                  <span
                    className="text-lg font-bold"
                    style={{ color: selectedDepartmentData?.color }}
                  >
                    {selectedDepartmentData?.professors}
                  </span>
                </div>
              </div>
              <div
                className="border rounded-lg p-4 bg-white"
                style={{
                  borderColor: `${selectedDepartmentData?.color}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users
                      className="w-4 h-4 mr-2"
                      style={{ color: selectedDepartmentData?.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("faculty")}
                    </span>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: selectedDepartmentData?.color }}
                  >
                    {selectedFacultyData?.shortName}
                  </span>
                </div>
              </div>
            </div>
            {selectedDepartmentData?.description && (
              <div
                className="mt-4 p-4 bg-white rounded-lg border"
                style={{ borderColor: `${selectedDepartmentData?.color}40` }}
              >
                <p className="text-sm text-gray-600">
                  {selectedDepartmentData.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorsSection;
