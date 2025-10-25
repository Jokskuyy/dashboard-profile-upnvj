import React, { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface TrafficStats {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: number;
}

const TrafficOverview: React.FC = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<TrafficStats>({
    visitors: 0,
    pageviews: 0,
    bounceRate: 0,
    avgDuration: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from analytics server
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/stats");

        if (response.ok) {
          const data = await response.json();

          if (data.visitors !== undefined && !data.error) {
            console.log("✅ Analytics data loaded:", data);

            setStats({
              visitors: data.visitors,
              pageviews: data.pageviews,
              bounceRate: data.bounceRate,
              avgDuration: data.avgDuration,
            });
            setLoading(false);
            return;
          }
        }

        throw new Error("Analytics server not responding");
      } catch (error) {
        console.warn("⚠️ Analytics server offline, using placeholder data");

        // Placeholder data when server is offline
        setTimeout(() => {
          setStats({
            visitors: 0,
            pageviews: 0,
            bounceRate: 0,
            avgDuration: 0,
          });
          setLoading(false);
        }, 500);
      }
    };

    fetchStats();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const translations = {
    id: {
      title: "Statistik Traffic Website",
      visitors: "Pengunjung",
      pageviews: "Tampilan Halaman",
      bounceRate: "Bounce Rate",
      avgDuration: "Durasi Rata-rata",
      last7days: "Data 7 hari terakhir",
      loading: "Memuat data...",
      note: "Data analytics diperbarui otomatis setiap 30 detik",
    },
    en: {
      title: "Website Traffic Statistics",
      visitors: "Visitors",
      pageviews: "Page Views",
      bounceRate: "Bounce Rate",
      avgDuration: "Avg. Duration",
      last7days: "Last 7 days data",
      loading: "Loading data...",
      note: "Analytics data automatically refreshed every 30 seconds",
    },
  };

  const t = translations[language];

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
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Visitors */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-700">
                {t.visitors}
              </h3>
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {stats.visitors.toLocaleString()}
            </p>
          </div>

          {/* Page Views */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-700">
                {t.pageviews}
              </h3>
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-green-900">
              {stats.pageviews.toLocaleString()}
            </p>
          </div>

          {/* Bounce Rate */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-yellow-700">
                {t.bounceRate}
              </h3>
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-yellow-900">
              {stats.bounceRate.toFixed(1)}%
            </p>
          </div>

          {/* Avg Duration */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-700">
                {t.avgDuration}
              </h3>
              <svg
                className="w-8 h-8 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {formatDuration(stats.avgDuration)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficOverview;
