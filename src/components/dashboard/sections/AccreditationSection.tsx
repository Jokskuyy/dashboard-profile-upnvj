import React, { useState } from "react";
import { Award, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAccreditations } from "../../../contexts/DashboardContext";

const AccreditationSection: React.FC = () => {
  const { t } = useLanguage();
  const accreditationData = useAccreditations();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Show 7 items per page
  
  // Calculate pagination
  const totalPages = Math.ceil(accreditationData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = accreditationData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "expired":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "expired":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 shrink-0" />
            <span className="wrap-break-word">{t("accreditationTitle")}</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t("accreditationSubtitle")}
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-xl sm:text-2xl font-bold text-purple-600">
            {accreditationData.filter((acc) => acc.status === "active").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">{t("active")}</p>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-200 bg-gray-50">
              <th className="p-4 font-semibold whitespace-nowrap">
                {t("program")}
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                {t("level")}
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                {t("accreditor")}
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                {t("validUntil")}
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                {t("status")}
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentData.map((accreditation) => (
              <tr
                key={accreditation.id}
                className="group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {accreditation.program}
                </td>
                <td className="p-4 text-gray-600 whitespace-nowrap">
                  {accreditation.level}
                </td>
                <td className="p-4 text-gray-600 whitespace-nowrap">
                  {accreditation.accreditor}
                </td>
                <td className="p-4 text-gray-600 whitespace-nowrap">
                  {accreditation.validUntil}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                      accreditation.status
                    )}`}
                  >
                    {getStatusIcon(accreditation.status)}
                    <span className="ml-1">{t(accreditation.status)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 flex justify-between items-center bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {t("showing")} {startIndex + 1}-{Math.min(endIndex, accreditationData.length)} {t("of")} {accreditationData.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-700 min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccreditationSection;
