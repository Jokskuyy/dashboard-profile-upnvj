import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchDashboardData,
  fetchFaculties,
  getTotalStats,
} from "../services/api/dataService";
import type { DashboardData, FacultyInfo } from "../services/api/dataService";

interface DashboardContextType {
  data: DashboardData | null;
  faculties: FacultyInfo[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [faculties, setFaculties] = useState<FacultyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, facultiesData] = await Promise.all([
        fetchDashboardData(),
        fetchFaculties(),
      ]);
      setData(dashboardData);
      setFaculties(facultiesData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Gagal memuat data. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = useMemo(
    () => ({
      data,
      faculties,
      loading,
      error,
      reload: loadData,
    }),
    [data, faculties, loading, error, loadData]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

// Helper hooks for specific data
export const useAssets = () => {
  const { data } = useDashboard();
  return data?.assets || [];
};

export const usePrograms = () => {
  const { data } = useDashboard();
  return data?.programs || [];
};

export const useDepartments = () => {
  const { data } = useDashboard();
  return data?.departments || [];
};

export const useStats = () => {
  const { data } = useDashboard();
  return data ? getTotalStats(data) : null;
};
