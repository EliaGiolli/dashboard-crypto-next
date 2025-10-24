"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Hook personalizzato per fetch storico
import { useFetchSingleCrypto } from "../../custom hooks/useFetchHistoryCrypto";

// Components
import { SkeletonComponent } from "../shared/SkeletonComponent";

export default function MarketCapSingleCrypto({ id }: { id: string }) {
  const { data, isLoading, error } = useFetchSingleCrypto(id, 7);

  const chartData = useMemo(() => {
    if (!data?.market_caps) return [];
    return data.market_caps.map(([timestamp, market_cap]: [number, number]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      market_cap,
    }));
  }, [data]);

  return (
    <div className="rounded-xl bg-slate-800 shadow-lg p-6 min-h-[350px] w-full transition-all hover:shadow-xl">
      {isLoading && <SkeletonComponent />}
      {error && <p className="text-red-500 bg-red-200 p-3 rounded">Errore nel caricamento dei dati</p>}
      
      {!isLoading && !error && chartData.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="marketCapGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#e2e8f0", fontSize: 13 }}
                axisLine={{ stroke: "#64748b" }}
                tickLine={{ stroke: "#475569" }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`}
                tick={{ fill: "#e2e8f0", fontSize: 13 }}
                axisLine={{ stroke: "#64748b" }}
                tickLine={{ stroke: "#475569" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, border: "none" }}
                labelStyle={{ color: "#e2e8f0", fontWeight: "bold" }}
                formatter={(value: number) =>
                  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              />
              <Area
                type="monotone"
                dataKey="market_cap"
                stroke="#8b5cf6"
                fill="url(#marketCapGradient)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}

      {!isLoading && !error && chartData.length === 0 && (
        <p className="text-slate-300 mt-4">Nessun dato disponibile per questa crypto</p>
      )}
    </div>
  );
}
