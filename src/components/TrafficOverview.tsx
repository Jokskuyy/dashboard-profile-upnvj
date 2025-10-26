import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DailyData {
  date: string;
  visitors: number;
  pageviews: number;
}

interface TrafficStats {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  dailyStats: DailyData[];
}

const TrafficOverview: React.FC = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<TrafficStats>({
    visitors: 0,
    pageviews: 0,
    bounceRate: 0,
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from analytics server
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.visitors !== undefined && !data.error) {
            console.log('✅ Analytics data loaded:', data);
            
            setStats({
              visitors: data.visitors,
              pageviews: data.pageviews,
              bounceRate: data.bounceRate,
              dailyStats: data.dailyStats || []
            });
            setLoading(false);
            return;
          }
        }
        
        throw new Error('Analytics server not responding');
      } catch (error) {
        console.warn('⚠️ Analytics server offline, using placeholder data');
        
        // Placeholder data when server is offline
        setTimeout(() => {
          setStats({
            visitors: 0,
            pageviews: 0,
            bounceRate: 0,
            dailyStats: []
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

  const translations = {
    id: {
      title: 'Statistik Traffic Website',
      visitors: 'Pengunjung',
      pageviews: 'Tampilan Halaman',
      bounceRate: 'Bounce Rate',
      last7days: 'Data 7 hari terakhir',
      loading: 'Memuat data...',
      note: 'Data analytics diperbarui otomatis setiap 30 detik',
      dailyTrend: 'Tren Traffic Harian',
      noData: 'Belum ada data',
      date: 'Tanggal'
    },
    en: {
      title: 'Website Traffic Statistics',
      visitors: 'Visitors',
      pageviews: 'Page Views',
      bounceRate: 'Bounce Rate',
      last7days: 'Last 7 days data',
      loading: 'Loading data...',
      note: 'Analytics data automatically refreshed every 30 seconds',
      dailyTrend: 'Daily Traffic Trend',
      noData: 'No data yet',
      date: 'Date'
    }
  };

  const t = translations[language];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2C5F2D]">
            {t.title}
          </h2>
          <span className="text-sm text-gray-500">{t.last7days}</span>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Visitors */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-700">{t.visitors}</h3>
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats.visitors.toLocaleString()}</p>
            </div>

            {/* Page Views */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-700">{t.pageviews}</h3>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.pageviews.toLocaleString()}</p>
            </div>

            {/* Bounce Rate */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-yellow-700">{t.bounceRate}</h3>
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-yellow-900">{stats.bounceRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Vertical Bar Chart - Technical Style */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#2C5F2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t.dailyTrend}
            </h3>
            
            {stats.dailyStats && stats.dailyStats.length > 0 ? (
              <div className="space-y-6">
                {/* Chart Grid */}
                <div className="relative h-80 flex items-end justify-between gap-4 border-b-2 border-l-2 border-gray-300 pb-4 pl-4">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-4 w-12 flex flex-col justify-between text-xs text-gray-500 font-mono">
                    {[...Array(5)].map((_, i) => {
                      const maxValue = Math.max(...stats.dailyStats.map(d => Math.max(d.visitors, d.pageviews)));
                      const value = Math.ceil(maxValue * (4 - i) / 4);
                      return (
                        <div key={i} className="text-right pr-2">{value}</div>
                      );
                    })}
                  </div>

                  {/* Grid lines */}
                  <div className="absolute left-14 right-0 top-0 bottom-4 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-gray-200 border-dashed"
                        style={{ top: `${i * 25}%` }}
                      />
                    ))}
                  </div>

                  {/* Bars */}
                  {stats.dailyStats.map((day, index) => {
                    const maxValue = Math.max(...stats.dailyStats.map(d => Math.max(d.visitors, d.pageviews)));
                    const visitorHeight = (day.visitors / maxValue) * 100;
                    const pageviewHeight = (day.pageviews / maxValue) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex gap-1 items-end h-full relative z-10" style={{ paddingLeft: '14px' }}>
                        {/* Visitors Bar */}
                        <div className="flex-1 group relative">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-700 hover:from-blue-700 hover:to-blue-500 shadow-lg"
                            style={{ height: `${visitorHeight}%`, minHeight: day.visitors > 0 ? '4px' : '0' }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                              {day.visitors}
                            </div>
                          </div>
                        </div>
                        
                        {/* Pageviews Bar */}
                        <div className="flex-1 group relative">
                          <div 
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md transition-all duration-700 hover:from-green-700 hover:to-green-500 shadow-lg"
                            style={{ height: `${pageviewHeight}%`, minHeight: day.pageviews > 0 ? '4px' : '0' }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                              {day.pageviews}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between gap-4" style={{ paddingLeft: '56px' }}>
                  {stats.dailyStats.map((day, index) => (
                    <div key={index} className="flex-1 text-center">
                      <div className="text-xs text-gray-600 font-medium">
                        {new Date(day.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded"></div>
                    <span className="text-sm text-gray-700 font-medium">{t.visitors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-t from-green-600 to-green-400 rounded"></div>
                    <span className="text-sm text-gray-700 font-medium">{t.pageviews}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
