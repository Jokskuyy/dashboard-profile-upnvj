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
  Clock,
  Activity,
  BarChart3,
  MousePointerClick,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getAnalyticsSummary,
  getActiveVisitors,
  getAnalyticsMetrics,
  type AnalyticsSummary,
  type AnalyticsMetric,
} from "../../../services/analytics/umamiService";

interface AnalyticsData {
  summary: AnalyticsSummary;
  activeVisitors: number;
  topPages: AnalyticsMetric[];
  events: AnalyticsMetric[];
}

export default function AdminTrafficAnalytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );

  // Load analytics data from Umami via API proxy
  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch summary, active visitors, top pages, and events in parallel
      const [summary, activeVisitors, topPages, events] = await Promise.all([
        getAnalyticsSummary(timeRange),
        getActiveVisitors(),
        getAnalyticsMetrics("url", timeRange, "10"),
        getAnalyticsMetrics("event", timeRange, "10"),
      ]);

      if (summary) {
        setAnalyticsData({
          summary,
          activeVisitors,
          topPages: topPages || [],
          events: events || [],
        });
      } else {
        setAnalyticsData(null);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      setAnalyticsData(null);
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

  const { summary, activeVisitors, topPages, events } = analyticsData;
  const { dailyStats, deviceStats } = summary;

  // Format data for Recharts
  const chartData = dailyStats.map((day) => {
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        });
      } catch {
        return dateStr;
      }
    };
    return {
      tanggal: formatDate(day.date),
      pengunjung: day.visitors,
      webViews: day.pageViews,
    };
  });

  // Format visit duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

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
            Self-hosted analytics powered by Umami
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Visitors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${summary.trend >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {summary.trend >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {Math.abs(summary.trend).toFixed(1)}%
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Visitors</p>
          <p className="text-3xl font-bold text-gray-900">
            {summary.totalVisitors.toLocaleString()}
          </p>
        </div>

        {/* Page Views */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Page Views</p>
          <p className="text-3xl font-bold text-gray-900">
            {summary.totalPageViews.toLocaleString()}
          </p>
        </div>

        {/* Bounce Rate */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
          <p className="text-3xl font-bold text-gray-900">
            {summary.bounceRate}%
          </p>
        </div>

        {/* Avg Visit Duration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            {activeVisitors > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {activeVisitors} aktif
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">Rata-rata Durasi</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatDuration(summary.avgVisitDuration)}
          </p>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Visitors & Page Views Trend
        </h3>
        {chartData && chartData.length > 0 ? (
          <>
            <div className="w-full h-56 md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="tanggal"
                    stroke="#666"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="pengunjung"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Pengunjung"
                  />
                  <Line
                    type="monotone"
                    dataKey="webViews"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Web Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Data menampilkan traffic website untuk periode yang dipilih</p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p className="text-sm">Tidak ada data untuk ditampilkan</p>
          </div>
        )}
      </div>

      {/* Bottom Section: Device Stats + Top Pages + Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Device Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-gray-600" />
            Device Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Desktop
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {deviceStats.desktop}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${deviceStats.desktop}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Mobile
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {deviceStats.mobile}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${deviceStats.mobile}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Tablet
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {deviceStats.tablet}%
                </span>
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

        {/* Top Pages */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            Top Pages
          </h3>
          {topPages.length > 0 ? (
            <div className="space-y-3">
              {topPages.slice(0, 8).map((page, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span
                    className="text-sm text-gray-700 truncate max-w-[200px]"
                    title={page.x}
                  >
                    {page.x || "/"}
                  </span>
                  <span className="text-sm font-bold text-gray-900 ml-2">
                    {page.y}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Belum ada data</p>
          )}
        </div>

        {/* Custom Events */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-gray-600" />
            Custom Events
          </h3>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.slice(0, 8).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span
                    className="text-sm text-gray-700 truncate max-w-[200px]"
                    title={event.x}
                  >
                    {event.x}
                  </span>
                  <span className="text-sm font-bold text-gray-900 ml-2">
                    {event.y}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Belum ada events</p>
          )}
        </div>
      </div>
    </div>
  );
}
