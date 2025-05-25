"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

const dummyYearData = {
  2020: {
    semester1: {
      gross: 45.2,
      nett: 38.4,
      month: [7.2, 7.8, 8.1, 7.5, 8.2, 6.4],
    },
    semester2: {
      gross: 52.8,
      nett: 44.9,
      month: [8.9, 9.2, 8.7, 9.1, 8.5, 8.4],
    },
  },
  2021: {
    semester1: {
      gross: 48.7,
      nett: 41.2,
      month: [7.8, 8.1, 8.4, 8.0, 8.2, 8.2],
    },
    semester2: {
      gross: 58.3,
      nett: 49.5,
      month: [9.5, 9.8, 9.7, 9.9, 9.8, 9.6],
    },
  },
  2022: {
    semester1: {
      gross: 52.1,
      nett: 44.3,
      month: [8.4, 8.7, 8.9, 8.5, 8.8, 8.8],
    },
    semester2: {
      gross: 61.9,
      nett: 52.6,
      month: [10.1, 10.4, 10.2, 10.5, 10.3, 10.4],
    },
  },
  2023: {
    semester1: {
      gross: 55.8,
      nett: 47.4,
      month: [9.1, 9.3, 9.5, 9.2, 9.4, 9.3],
    },
    semester2: {
      gross: 67.2,
      nett: 57.1,
      month: [11.0, 11.3, 11.1, 11.4, 11.2, 11.2],
    },
  },
  2024: {
    semester1: {
      gross: 59.4,
      nett: 50.5,
      month: [9.7, 9.9, 10.1, 9.8, 10.0, 9.9],
    },
    semester2: {
      gross: 71.8,
      nett: 61.0,
      month: [11.8, 12.1, 11.9, 12.2, 12.0, 11.8],
    },
  },
};

const dummyPrediction2025 = {
  semester1: { gross: 63.2, nett: 53.7 },
  semester2: { gross: 76.5, nett: 65.0 },
};

export default function ArtelisDashboard() {
  const [selectedYear, setSelectedYear] = useState("2024");

  // Calculate statistic
  const allRevenues = Object.values(dummyYearData).flatMap((year) => [
    year.semester1.nett,
    year.semester2.nett,
  ]);
  const avgRevenue =
    allRevenues.reduce((a, b) => a + b, 0) / allRevenues.length;
  const maxRevenue = Math.max(...allRevenues);
  const minRevenue = Math.min(...allRevenues);

  // Trend chart
  const trendData = Object.entries(dummyYearData).flatMap(([year, data]) => [
    {
      period: `${year} S1`,
      gross: data.semester1.gross,
      nett: data.semester1.nett,
    },
    {
      period: `${year} S2`,
      gross: data.semester2.gross,
      nett: data.semester2.nett,
    },
  ]);

  // Add prediction data 2025 to array trendData
  trendData.push(
    {
      period: "2025 S1",
      gross: dummyPrediction2025.semester1.gross,
      nett: dummyPrediction2025.semester1.nett,
      isPrediction: true,
    },
    {
      period: "2025 S2",
      gross: dummyPrediction2025.semester2.gross,
      nett: dummyPrediction2025.semester2.nett,
      isPrediction: true,
    }
  );

  const LineChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map((d) => Math.max(d.gross, d.nett)));
    const chartHeight = 300;
    const chartWidth = 800;
    const padding = 60;

    return (
      <div className="w-full overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight + padding}
          className="border rounded"
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (chartHeight * i) / 4}
              x2={chartWidth - padding}
              y2={padding + (chartHeight * i) / 4}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x={padding - 10}
              y={padding + (chartHeight * i) / 4 + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {(maxValue - (maxValue * i) / 4).toFixed(0)}
            </text>
          ))}

          {/* Lines */}
          <polyline
            points={data
              .map(
                (d, i) =>
                  `${
                    padding +
                    (i * (chartWidth - 2 * padding)) / (data.length - 1)
                  },${
                    padding + chartHeight - (d.gross / maxValue) * chartHeight
                  }`
              )
              .join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray={data.some((d) => d.isPrediction) ? "5,5" : "none"}
          />

          <polyline
            points={data
              .map(
                (d, i) =>
                  `${
                    padding +
                    (i * (chartWidth - 2 * padding)) / (data.length - 1)
                  },${
                    padding + chartHeight - (d.nett / maxValue) * chartHeight
                  }`
              )
              .join(" ")}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray={data.some((d) => d.isPrediction) ? "5,5" : "none"}
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={
                  padding + (i * (chartWidth - 2 * padding)) / (data.length - 1)
                }
                cy={padding + chartHeight - (d.gross / maxValue) * chartHeight}
                r="4"
                fill="#3b82f6"
              />
              <circle
                cx={
                  padding + (i * (chartWidth - 2 * padding)) / (data.length - 1)
                }
                cy={padding + chartHeight - (d.nett / maxValue) * chartHeight}
                r="4"
                fill="#10b981"
              />
            </g>
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={padding + (i * (chartWidth - 2 * padding)) / (data.length - 1)}
              y={chartHeight + padding + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
              transform={`rotate(-45 ${
                padding + (i * (chartWidth - 2 * padding)) / (data.length - 1)
              } ${chartHeight + padding + 20})`}
            >
              {d.period}
            </text>
          ))}
        </svg>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500"></div>
            <span className="text-sm">Pendapatan Kotor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500"></div>
            <span className="text-sm">Pendapatan Bersih</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-gray-400 border-dashed border-t-2"></div>
            <span className="text-sm">Prediksi 2025</span>
          </div>
        </div>
      </div>
    );
  };

  const BarChart = ({ year }: { year: string }) => {
    const data = dummyYearData[year as keyof typeof dummyYearData];
    const maxValue = Math.max(data.semester1.gross, data.semester2.gross);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Semester 1</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Pendapatan Kotor</span>
                <span>Rp {data.semester1.gross.toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{
                    width: `${(data.semester1.gross / maxValue) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pendapatan Bersih</span>
                <span>Rp {data.semester1.nett.toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${(data.semester1.nett / maxValue) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Semester 2</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Pendapatan Kotor</span>
                <span>Rp {data.semester2.gross.toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{
                    width: `${(data.semester2.gross / maxValue) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pendapatan Bersih</span>
                <span>Rp {data.semester2.nett.toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${(data.semester2.nett / maxValue) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Analisis ARTELIS (Alat Rumah Tangga Tenaga Listrik)
          </h1>
          <p className="text-gray-600">
            Analisis Kinerja Penjualan Peralatan Rumah Tangga 2020-2024
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rata-rata Pendapatan
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {avgRevenue.toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Per semester (bersih)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendapatan Tertinggi
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Rp {maxRevenue.toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">2024 Semester 2</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendapatan Terendah
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                Rp {minRevenue.toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">2020 Semester 1</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Prediksi 2025
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                Rp{" "}
                {(
                  dummyPrediction2025.semester1.nett +
                  dummyPrediction2025.semester2.nett
                ).toFixed(1)}
                M
              </div>
              <p className="text-xs text-muted-foreground">
                Total tahun (bersih)
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trend" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trend">Tren Penjualan</TabsTrigger>
            <TabsTrigger value="comparison">Perbandingan Semester</TabsTrigger>
            <TabsTrigger value="prediction">Prediksi & Insight</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tren Pendapatan 2020-2024 & Prediksi 2025</CardTitle>
                <CardDescription>
                  Perbandingan pendapatan kotor dan bersih per semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={trendData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Pendapatan per Tahun</CardTitle>
                <CardDescription>
                  Pilih tahun untuk melihat detail pendapatan per semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(dummyYearData).map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          selectedYear === year
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                  <BarChart year={selectedYear} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prediksi Pendapatan 2025</CardTitle>
                  <CardDescription>
                    Berdasarkan tren historis 2020-2024
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Semester 1 2025:</span>
                      <Badge variant="outline">
                        Rp {dummyPrediction2025.semester1.nett.toFixed(1)}M
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Semester 2 2025:</span>
                      <Badge variant="outline">
                        Rp {dummyPrediction2025.semester2.nett.toFixed(1)}M
                      </Badge>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total 2025:</span>
                      <Badge>
                        Rp{" "}
                        {(
                          dummyPrediction2025.semester1.nett +
                          dummyPrediction2025.semester2.nett
                        ).toFixed(1)}
                        M
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-green-600">
                    ↗ Proyeksi pertumbuhan: +7.2% dari 2024
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>
                    Temuan penting dari analisis data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Tren Positif:</strong> Pertumbuhan konsisten 8-12%
                      per tahun
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Pola Musiman:</strong> Semester 2 selalu
                      outperform semester 1
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Margin Stabil:</strong> Rasio pendapatan
                      bersih/kotor ~85%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <p className="text-gray-600">
          Created by 2502118275 - M. Ardhana Wahyu Nugraha
        </p>
        <p className="text-gray-600">
          Build with React (JavaScript) with Lucide Chart
        </p>
      </div>
    </div>
  );
}
