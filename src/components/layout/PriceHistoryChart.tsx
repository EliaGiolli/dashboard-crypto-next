"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchSingleCrypto } from "../../custom hooks/useFetchHistoryCrypto";
import { SkeletonComponent } from "../shared/SkeletonComponent";

interface Props {
  id: string;
  days?: number;
}

export default function PriceHistoryChart({ id, days = 7 }: Props) {
  const { data, isLoading, error } = useFetchSingleCrypto(id, days);
  console.log('data retrieved?', data)

  const chartData = useMemo(() => {
    if (!data?.prices) return [];
    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price,
    }));
  }, [data]);

  return (
    <div className="rounded-xl bg-slate-800 shadow-lg p-6 min-h-[350px] w-full transition-all hover:shadow-xl">
      {isLoading && <SkeletonComponent />}
      {error && <p className="text-red-500 bg-red-200 p-3 rounded">Errore nel caricamento dei dati</p>}

      {!isLoading && !error && chartData.length > 0 && (
        <>
          <h2 className="text-2xl text-violet-400 font-bold mb-2">Prezzo Storico</h2>
          <h3 className="text-sm text-slate-300 mb-6">
            Prezzo giornaliero per {id} negli ultimi {days} giorni
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#e2e8f0', fontSize: 13 }} axisLine={{ stroke: "#64748b" }} tickLine={{ stroke: "#475569" }}/>
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fill: '#e2e8f0', fontSize: 13 }} axisLine={{ stroke: "#64748b" }} tickLine={{ stroke: "#475569" }}/>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, border: "none" }} labelStyle={{ color: "#e2e8f0", fontWeight: "bold" }} formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#priceGradient)" fillOpacity={0.7}/>
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
