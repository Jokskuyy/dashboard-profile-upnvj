import React, { useEffect, useState } from "react";
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
import { useLanguage } from "../../contexts/LanguageContext";
import { getAnalytics } from "../../services/analytics/trackingService";

interface DailyData {
  date: string;
  visitors: number;
  pageviews: number;
}

interface TrafficStats {
  visitors: number;
  pageviews: number;
  dailyStats: DailyData[];
}

const TrafficOverview: React.FC = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<TrafficStats>({
    visitors: 0,
    pageviews: 0,
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from Supabase
    const fetchStats = async () => {
      try {
        console.log("Fetching analytics from Supabase...");

        const data = await getAnalytics(14); // Last 14 days

        if (data && data.success) {
          console.log("Analytics data loaded from Supabase:", data);

          // Transform dailyStats to match interface
          const dailyStats = (data.dailyStats || []).map((day: any) => ({
            date: day.date,
            visitors: day.visitors,
            pageviews: day.pageViews, // Note: API returns pageViews, we need pageviews
          }));

          setStats({
            visitors: data.totalVisitors || 0,
            pageviews: data.totalPageViews || 0,
            dailyStats,
          });
        } else {
          console.warn("No analytics data available");
          setStats({
            visitors: 0,
            pageviews: 0,
            dailyStats: [],
          });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        // Placeholder data on error
        setStats({
          visitors: 0,
          pageviews: 0,
          dailyStats: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const translations = {
    id: {
      title: "Statistik Traffic Website",
      visitors: "Pengunjung",
      pageviews: "Tampilan Halaman",
      last7days: "Data 14 hari terakhir",
      loading: "Memuat data...",
      note: "Data analytics diperbarui otomatis setiap 30 detik",
      dailyTrend: "Tren Traffic Harian",
      noData: "Belum ada data",
      date: "Tanggal",
    },
    en: {
      title: "Website Traffic Statistics",
      visitors: "Visitors",
      pageviews: "Page Views",
      last7days: "Last 14 days data",
      loading: "Loading data...",
      note: "Analytics data automatically refreshed every 30 seconds",
      dailyTrend: "Daily Traffic Trend",
      noData: "No data yet",
      date: "Date",
    },
  };

  const t = translations[language];

  // Calculate totals and averages
  const totalVisitors = stats.visitors;
  const totalPageViews = stats.pageviews;
  const avgVisitors =
    stats.dailyStats.length > 0
      ? Math.round(totalVisitors / stats.dailyStats.length)
      : 0;
  const avgPageViews =
    stats.dailyStats.length > 0
      ? Math.round(totalPageViews / stats.dailyStats.length)
      : 0;

  // Format data for Recharts
  const chartData = stats.dailyStats.map((day) => {
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
        return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
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
      webViews: day.pageviews,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2C5F2D]">{t.title}</h2>
          <span className="text-sm text-gray-500">{t.last7days}</span>
        </div>
      </div>

      {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-start gap-2">
            <svg
            className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-blue-800">{t.note}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F2D]"></div>
          <span className="ml-3 text-gray-600">{t.loading}</span>
        </div>
      ) : (
        <>
          {/* Stats Cards - responsive (2 cols on small, 4 on md+) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Total Visitors */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">
                {language === "id" ? "Total Pengunjung" : "Total Visitors"}
              </p>
              <p className="text-3xl font-bold">
                {totalVisitors.toLocaleString()}
              </p>
            </div>

            {/* Total Page Views */}
            <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">
                {language === "id" ? "Total Web Views" : "Total Web Views"}
              </p>
              <p className="text-3xl font-bold">
                {totalPageViews.toLocaleString()}
              </p>
            </div>

            {/* Average Visitors */}
            <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">
                {language === "id" ? "Rata-rata Pengunjung" : "Avg Visitors"}
              </p>
              <p className="text-3xl font-bold">
                {avgVisitors.toLocaleString()}
              </p>
            </div>

            {/* Average Page Views */}
            <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-1">
                {language === "id" ? "Rata-rata Views" : "Avg Views"}
              </p>
              <p className="text-3xl font-bold">
                {avgPageViews.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recharts Line Chart */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#2C5F2D]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              {t.dailyTrend}
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
                      name={language === "id" ? "Pengunjung" : "Visitors"}
                    />
                    <Line
                      type="monotone"
                      dataKey="webViews"
                      stroke="#a855f7"
                      strokeWidth={3}
                      dot={{ fill: "#a855f7", r: 3 }}
                      activeDot={{ r: 5 }}
                      name={language === "id" ? "Web Views" : "Web Views"}
                    />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>
                    {language === "id"
                      ? "Data menampilkan traffic website selama 14 hari terakhir"
                      : "Data shows website traffic for the last 14 days"}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-sm">{t.noData}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrafficOverview;
