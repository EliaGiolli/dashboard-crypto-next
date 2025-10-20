"use client";
// External libs
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
// Internal imports
import { useFetchCrypto } from "../../custom hooks/useFetchCrypto";
import { SkeletonComponent } from "../shared/SkeletonComponent";

export default function VolumeBarChart() {
    
  const { data, isLoading, error } = useFetchCrypto();

  if (isLoading) return <SkeletonComponent />;
  if (error) return <p className="text-red-500">Error fetching crypto data</p>;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data || []}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="symbol" 
            tick={{ fill: '#e2e8f0', fontSize: 14 }}
          />
          <YAxis 
            tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`} 
            tick={{ fill: '#e2e8f0', fontSize: 14 }} 
          />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Bar dataKey="total_volume" fill="#6d28d9" /> 
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
