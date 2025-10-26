import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Monitor,
  Smartphone,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { getAnalytics } from '../services/analytics/trackingService';

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
}

interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface AnalyticsData {
  dailyStats: TrafficData[];
  deviceStats: DeviceStats;
  totalVisitors: number;
  totalPageViews: number;
  bounceRate: number;
}

export default function AdminTrafficAnalytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  // Load analytics data
  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const data = await getAnalytics(days);

      if (data && data.success) {
        setAnalyticsData({
          dailyStats: data.dailyStats || [],
          deviceStats: data.deviceStats || {
            desktop: 0,
            mobile: 0,
            tablet: 0,
          },
          totalVisitors: data.totalVisitors || 0,
          totalPageViews: data.totalPageViews || 0,
          bounceRate: data.bounceRate || 0,
        });
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <p className="text-gray-600">Tidak ada data analytics tersedia</p>
        <button
          onClick={loadAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const trafficData = analyticsData.dailyStats;
  const deviceStats = analyticsData.deviceStats;
  const totalVisitors = analyticsData.totalVisitors;
  const totalPageViews = analyticsData.totalPageViews;
  const bounceRate = analyticsData.bounceRate;

  const maxVisitors = Math.max(...trafficData.map((d) => d.visitors), 1);
  const maxPageViews = Math.max(...trafficData.map((d) => d.pageViews), 1);

  const calculateTrend = () => {
    if (trafficData.length < 2) return 0;
    const recent = trafficData
      .slice(-7)
      .reduce((sum, d) => sum + d.visitors, 0);
    const previous = trafficData
      .slice(-14, -7)
      .reduce((sum, d) => sum + d.visitors, 0);
    if (previous === 0) return 0;
    return ((recent - previous) / previous) * 100;
  };

  const trend = calculateTrend();

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Traffic Analytics
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time website traffic dan engagement metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range === "7d"
                ? "7 Hari"
                : range === "30d"
                ? "30 Hari"
                : "90 Hari"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Visitors</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalVisitors.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Page Views</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalPageViews.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
            <p className="text-3xl font-bold text-gray-900">
              {bounceRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Single page sessions</p>
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Visitors & Page Views Trend
        </h3>
        <div className="space-y-6">
          {/* Visitors Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Daily Visitors
              </span>
              <span className="text-sm text-gray-600">
                Peak: {maxVisitors.toLocaleString()}
              </span>
            </div>
            <div className="h-48 flex items-end gap-1">
              {trafficData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer relative group"
                  style={{
                    height: `${(data.visitors / maxVisitors) * 100}%`,
                  }}
                  title={`${data.date}: ${data.visitors} visitors`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {data.date}
                    <br />
                    {data.visitors} visitors
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{trafficData[0]?.date}</span>
              <span>{trafficData[trafficData.length - 1]?.date}</span>
            </div>
          </div>

          {/* Page Views Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Daily Page Views
              </span>
              <span className="text-sm text-gray-600">
                Peak: {maxPageViews.toLocaleString()}
              </span>
            </div>
            <div className="h-48 flex items-end gap-1">
              {trafficData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 bg-green-500 rounded-t-lg hover:bg-green-600 transition-all cursor-pointer relative group"
                  style={{
                    height: `${(data.pageViews / maxPageViews) * 100}%`,
                  }}
                  title={`${data.date}: ${data.pageViews} page views`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {data.date}
                    <br />
                    {data.pageViews} views
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{trafficData[0]?.date}</span>
              <span>{trafficData[trafficData.length - 1]?.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Desktop</p>
              <p className="text-2xl font-bold text-gray-900">
                {deviceStats.desktop}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${deviceStats.desktop}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Mobile</p>
              <p className="text-2xl font-bold text-gray-900">
                {deviceStats.mobile}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${deviceStats.mobile}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Tablet</p>
              <p className="text-2xl font-bold text-gray-900">
                {deviceStats.tablet}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${deviceStats.tablet}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
