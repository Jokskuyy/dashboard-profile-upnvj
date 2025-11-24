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
import { getAnalytics } from "../../../services/analytics/trackingService";

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
      console.log("Loading analytics for", days, "days...");

      const data = await getAnalytics(days);

      console.log("Analytics data received:", data);
      console.log("Success?", data?.success);
      console.log("Daily stats:", data?.dailyStats);
      console.log("Total visitors:", data?.totalVisitors);
      console.log("Total page views:", data?.totalPageViews);

      if (data && data.success) {
        const analyticsResult = {
          dailyStats: data.dailyStats || [],
          deviceStats: data.deviceStats || {
            desktop: 0,
            mobile: 0,
            tablet: 0,
          },
          totalVisitors: data.totalVisitors || 0,
          totalPageViews: data.totalPageViews || 0,
        };

        console.log("Setting analytics data:", analyticsResult);
        setAnalyticsData(analyticsResult);
      } else {
        console.log("No data or not successful:", data);
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

  const trafficData = analyticsData.dailyStats;
  const deviceStats = analyticsData.deviceStats;
  const totalVisitors = analyticsData.totalVisitors;
  const totalPageViews = analyticsData.totalPageViews;

  

  // Format data for Recharts
  const chartData = trafficData.map((day) => {
    // Format date safely
    const formatDate = (dateStr: string) => {
      try {
        if (/^\d{1,2}\s\w{3}$/.test(dateStr)) {
          return dateStr;
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return dateStr;
        }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
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
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
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
