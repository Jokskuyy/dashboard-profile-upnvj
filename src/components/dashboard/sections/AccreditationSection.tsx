import React from "react";
import { Award, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAccreditations } from "../../../contexts/DashboardContext";

const AccreditationSection: React.FC = () => {
  const { t } = useLanguage();
  const accreditationData = useAccreditations();

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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 shrink-0" />
            <span className="wrap-break-word">{t("accreditationTitle")}</span>
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{t("accreditationSubtitle")}</p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-xl sm:text-2xl font-bold text-purple-600">
            {accreditationData.filter((acc) => acc.status === "active").length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">{t("active")}</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden max-h-[500px] overflow-y-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 whitespace-nowrap">
                    {t("program")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 whitespace-nowrap">
                    {t("level")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 whitespace-nowrap">
                    {t("accreditor")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 whitespace-nowrap">
                    {t("validUntil")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 whitespace-nowrap">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {accreditationData.map((accreditation) => (
                  <tr key={accreditation.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                      {accreditation.program}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 whitespace-nowrap">
                      {accreditation.level}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 whitespace-nowrap">
                      {accreditation.accreditor}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 whitespace-nowrap">
                      {accreditation.validUntil}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(
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
        </div>
      </div>
    </div>
  );
};

export default AccreditationSection;
