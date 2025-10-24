"use client";

import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchSingleCrypto } from "../../custom hooks/useFetchHistoryCrypto";
import { SkeletonComponent } from "../shared/SkeletonComponent";

interface Props {
  id: string;
  days?: number;
}

export default function VolumeHistoryChart({ id, days = 7 }: Props) {
  const { data, isLoading, error } = useFetchSingleCrypto(id, days);

  const chartData = useMemo(() => {
    if (!data?.total_volumes) return [];
    return data.total_volumes.map(([timestamp, volume]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      volume,
    }));
  }, [data]);

  return (
    <div className="rounded-xl bg-slate-800 shadow-lg p-6 min-h-[350px] w-full transition-all hover:shadow-xl">
      {isLoading && <SkeletonComponent />}
      {error && <p className="text-red-500 bg-red-200 p-3 rounded">Errore nel caricamento dei dati</p>}

      {!isLoading && !error && chartData.length > 0 && (
        <>
          <h2 className="text-2xl text-violet-400 font-bold mb-2">Volume Storico</h2>
          <h3 className="text-sm text-slate-300 mb-6">
            Volume giornaliero per {id} negli ultimi {days} giorni
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#e2e8f0', fontSize: 13 }} axisLine={{ stroke: "#64748b" }} tickLine={{ stroke: "#475569" }}/>
              <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fill: '#e2e8f0', fontSize: 13 }} axisLine={{ stroke: "#64748b" }} tickLine={{ stroke: "#475569" }}/>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, border: "none" }} labelStyle={{ color: "#e2e8f0", fontWeight: "bold" }} formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="volume" fill="url(#volumeGradient)" radius={[4, 4, 0, 0]} animationDuration={800}/>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
