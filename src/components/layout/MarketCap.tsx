"use client";
// External libs
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// Internal imports
import { useFetchCrypto } from "../../custom hooks/useFetchCrypto";
// Components
import { SkeletonComponent } from "../shared/SkeletonComponent";

export default function AreaChartComponent() {
  const { data, isLoading, error } = useFetchCrypto();

  if(isLoading) return <SkeletonComponent />
  if(error) return <p className="text-red-500">Error fetching crypto data</p>
  return (
    <>
        <div className="w-full h-64 mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
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
              <Tooltip />
              <Area
                type="monotone"
                dataKey="market_cap"
                stroke="#8b5cf6"
                fill="#6d28d9"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    </>
  );
}
