import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Beaker,
  BookOpen,
  Users,
  Trophy,
  Building2,
  MapPin,
  User,
  Package,
} from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getAllAssets } from "../../../utils/staticData";
import type { AssetCategory } from '../../../types';

const AssetsSection: React.FC = () => {
  const { t } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const assetsData = getAllAssets();

  const getIcon = (iconName: string) => {
    const icons = {
      Flask: Beaker,
      BookOpen: BookOpen,
      Users: Users,
      Trophy: Trophy,
      Building2: Building2,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Building2;
    return IconComponent;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      indigo: "bg-indigo-100 text-indigo-600",
    };
    return (
      colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"
    );
  };

  const getBadgeColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
      indigo: "bg-indigo-500 text-white",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500 text-white";
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {t("assetsTitle")}
          </h2>
        </div>
        <p className="text-gray-600 text-sm">{t("assetsSubtitle")}</p>
      </div>

      {/* Assets Categories */}
      <div className="space-y-4">
        {assetsData.map((category: AssetCategory) => {
          const IconComponent = getIcon(category.icon);
          const isExpanded = expandedCategory === category.id;

          return (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full p-4 text-left transition-all duration-200 hover:bg-gray-50 ${
                  isExpanded ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColorClasses(
                        category.color
                      )}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {t(category.id) || category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.count}{" "}
                        {category.count === 1 ? "unit" : "unit"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColorClasses(
                        category.color
                      )}`}
                    >
                      {category.count}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-4">
                    <div className="grid gap-4">
                      {category.details.map((asset) => (
                        <div
                          key={asset.id}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                            {/* Asset Info */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {asset.name}
                              </h4>
                              <p className="text-gray-600 text-sm mb-3">
                                {asset.description}
                              </p>

                              {/* Location */}
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  <span>{asset.building}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{asset.room}</span>
                                </div>
                                {asset.capacity && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{asset.capacity} orang</span>
                                  </div>
                                )}
                              </div>

                              {/* Equipment */}
                              {asset.equipment &&
                                asset.equipment.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-1 mb-2">
                                      <Package className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm font-medium text-gray-700">
                                        {t("equipment")}:
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {asset.equipment.map((item, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>

                            {/* Asset Stats */}
                            <div className="lg:w-48 bg-gray-50 rounded-lg p-4">
                              <div className="space-y-3">
                                <div>
                                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                    {t("building")}
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {asset.building}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                    {t("room")}
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {asset.room}
                                  </div>
                                </div>
                                {asset.capacity && (
                                  <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                      {t("capacity")}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {asset.capacity} orang
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {assetsData.map((category) => (
            <div key={category.id} className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {category.count}
              </div>
              <div className="text-xs text-gray-500">
                {t(category.id) || category.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetsSection;
