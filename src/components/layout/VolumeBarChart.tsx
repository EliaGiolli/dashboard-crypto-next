"use client";
// External libs
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
// Internal imports
import { useFetchCrypto } from "../../custom hooks/useFetchCrypto";
import { SkeletonComponent } from "../shared/SkeletonComponent";

export default function VolumeBarChart() {
  const { data, isLoading, error } = useFetchCrypto();

  if (isLoading) return <SkeletonComponent />;
  if (error) return <p className="text-red-500 bg-red-200 p-3 rounded">Errore nel caricamento dei dati</p>;

  return (
    <div className="rounded-xl bg-slate-800 shadow-lg p-6 min-h-[300px] w-full transition-all hover:shadow-xl">
      <h2 className="text-2xl text-violet-400 font-bold mb-2">Volume di trading</h2>
      <h3 className="text-md text-slate-300 mb-4">
        Volume totale delle principali criptovalute (ultimi dati)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data || []}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="symbol"
            tick={{ fill: '#e2e8f0', fontSize: 13 }}
            axisLine={{ stroke: "#64748b" }}
            tickLine={{ stroke: "#475569" }}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`}
            tick={{ fill: '#e2e8f0', fontSize: 13 }}
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
          <Bar
            dataKey="total_volume"
            fill="url(#volumeGradient)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
