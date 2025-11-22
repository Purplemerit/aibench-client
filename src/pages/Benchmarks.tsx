import React, { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import BenchmarksSkeleton from "@/components/skeletons/BenchmarksSkeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// --- Types ---
interface AIModel {
  _id: string;
  modelName: string;
  modelType: string;
  organization: string;
  overallBenchmarkScore: number;
  mmluscoe?: number;
  humanevalScore?: number;
  gsm8kScore?: number;
  mathScore?: number;
}

interface Model {
  id: string;
  name: string;
  selected: boolean;
  data: AIModel;
}

interface ModelSelectorProps {
  models: Model[];
  onToggleModel: (id: string) => void;
  className?: string;
}

// --- ModelSelector ---
const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  onToggleModel,
  className = "",
}) => {
  const selectedCount = models.filter((m) => m.selected).length;

  return (
    <div className={className}>
      <label className="text-neutral-950 dark:text-white text-[10px] sm:text-xs md:text-sm font-normal leading-tight block mb-2 sm:mb-3">
        Models to Compare (Max 4 - {selectedCount}/4 selected)
      </label>
      <div className="space-y-2 sm:space-y-[15px] max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2">
        {models.map((model) => {
          const isDisabled = !model.selected && selectedCount >= 4;
          return (
            <div
              key={model.id}
              className={`flex items-start gap-2 text-[10px] sm:text-xs md:text-sm text-neutral-950 dark:text-white font-normal leading-tight ${
                isDisabled ? "opacity-50" : ""
              }`}
            >
              <button
                onClick={() => !isDisabled && onToggleModel(model.id)}
                disabled={isDisabled}
                className={`flex w-4 sm:w-[13px] shrink-0 h-4 sm:h-[13px] mt-0.5 rounded-[3px] border transition-colors ${
                  model.selected
                    ? "bg-[rgba(117,71,207,1)] border-[rgba(117,71,207,1)]"
                    : "bg-white dark:bg-neutral-800 border-[rgba(118,118,118,1)] border-solid"
                } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                aria-checked={model.selected}
                role="checkbox"
                aria-label={`Toggle ${model.name}`}
              />
              <span className="flex-1 text-left break-words leading-relaxed">
                {model.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- ChartControls ---
interface ChartControlsProps {
  selectedBenchmark: string;
  onBenchmarkChange: (value: string) => void;
  modelTypes: string[];
  models: Model[];
  onToggleModel: (id: string) => void;
  className?: string;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  selectedBenchmark,
  onBenchmarkChange,
  modelTypes,
  models,
  onToggleModel,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`bg-white dark:bg-neutral-900 border flex w-full flex-col pt-5 sm:pt-6 md:pt-7 pb-5 sm:pb-6 md:pb-7 px-4 sm:px-5 md:px-6 rounded-[14px] border-[rgba(0,0,0,0.1)] border-solid h-full overflow-visible ${className}`}
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-neutral-950 dark:text-white font-normal leading-none mb-5 sm:mb-7 md:mb-9">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="flex-1">Chart Controls</h3>
      </div>
      <div className="mb-4 sm:mb-5 md:mb-[30px]">
        <label
          htmlFor="benchmark-select"
          className="text-neutral-950 dark:text-white text-[10px] sm:text-xs md:text-sm font-normal leading-tight block mb-2 sm:mb-3"
        >
          Benchmark Type
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            className="bg-[rgba(246,243,255,1)] dark:bg-neutral-800 w-full flex items-center gap-2 sm:gap-3 md:gap-5 text-[10px] sm:text-xs md:text-sm text-neutral-950 dark:text-white font-normal leading-tight justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 md:py-3 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 text-left"
          >
            <span>
              {selectedBenchmark === "All" ? "All Models" : selectedBenchmark}
            </span>
            <svg
              className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onBenchmarkChange("All");
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-neutral-950 dark:text-white hover:bg-[rgba(246,243,255,1)] dark:hover:bg-neutral-700 transition-colors"
              >
                All Models
              </button>
              {modelTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onBenchmarkChange(type);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-neutral-950 dark:text-white hover:bg-[rgba(246,243,255,1)] dark:hover:bg-neutral-700 transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ModelSelector models={models} onToggleModel={onToggleModel} />
    </aside>
  );
};

// --- BenchmarkChart ---
interface BenchmarkChartProps {
  selectedModels: AIModel[];
  className?: string;
}

const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  selectedModels,
  className = "",
}) => {
  const chartData = selectedModels.map((model) => ({
    name: model.modelName,
    score: model.overallBenchmarkScore || 0,
    organization: model.organization,
  }));

  const COLORS = [
    "rgba(117,71,207,1)",
    "rgba(43,255,163,1)",
    "rgba(255,154,12,1)",
    "rgba(255,177,239,1)",
  ];

  return (
    <section
      className={`bg-white dark:bg-neutral-900 border flex w-full flex-col pt-5 sm:pt-6 md:pt-7 pb-5 sm:pb-6 md:pb-8 px-4 sm:px-5 md:px-6 rounded-[14px] border-[rgba(0,0,0,0.1)] border-solid ${className}`}
    >
      <header className="mb-4 sm:mb-5 md:mb-6">
        <h2 className="text-neutral-950 dark:text-white text-sm sm:text-base md:text-lg font-semibold leading-tight mb-1.5 sm:mb-2">
          Benchmark Overview
        </h2>
        <p className="text-[rgba(113,113,130,1)] dark:text-neutral-400 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
          Compare overall benchmark scores across selected models
        </p>
      </header>

      {selectedModels.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] sm:h-[300px] md:h-[400px] text-gray-500 dark:text-gray-400">
          <div className="text-center px-4">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              Select models from the controls to compare
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6">
            {selectedModels.map((model, index) => (
              <div
                key={model._id}
                className="flex items-center gap-1 sm:gap-1.5 bg-[rgba(246,243,255,1)] dark:bg-zinc-800 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg"
              >
                <div
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-neutral-950 dark:text-neutral-100">
                  {model.modelName}
                </span>
              </div>
            ))}
          </div>

          {/* Chart View - All Devices */}
          <div className="w-full">
            <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 5,
                    left: -10,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{
                      fill: "currentColor",
                      fontSize: window.innerWidth < 640 ? 8 : 11,
                    }}
                    className="text-neutral-950 dark:text-white"
                  />
                  <YAxis
                    label={{
                      value: "Overall Score",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: window.innerWidth < 640 ? 10 : 12 },
                    }}
                    tick={{
                      fill: "currentColor",
                      fontSize: window.innerWidth < 640 ? 9 : 11,
                    }}
                    className="text-neutral-950 dark:text-white"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#000" }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[8, 8, 0, 0]}
                    barSize={window.innerWidth < 640 ? 30 : 50}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid - All Devices */}
          <div className="grid mt-4 sm:mt-5 md:mt-6 grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {selectedModels.map((model, index) => (
              <div
                key={model._id}
                className="p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-neutral-800"
              >
                <div className="flex items-center gap-1.5 md:gap-2 mb-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <h4 className="text-xs md:text-sm font-semibold text-neutral-950 dark:text-white truncate">
                    {model.modelName}
                  </h4>
                </div>
                <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
                  {model.organization}
                </p>
                <p className="text-xl md:text-2xl font-bold text-[rgba(117,71,207,1)]">
                  {model.overallBenchmarkScore?.toFixed(1) || "N/A"}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                  Overall Score
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

// --- Page Component ---
const BenchmarksPage = () => {
  const [allModels, setAllModels] = useState<AIModel[]>([]);
  const [modelTypes, setModelTypes] = useState<string[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState("All");
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [modelsResponse, typesResponse] = await Promise.all([
          api.getAllModels({
            limit: 100,
            sortBy: "overallBenchmarkScore",
            order: "desc",
          }),
          api.getModelTypes(),
        ]);

        setAllModels(modelsResponse.data);
        setModelTypes(typesResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load benchmark data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and prepare models based on benchmark type
  const filteredModels = useMemo(() => {
    if (selectedBenchmark === "All") {
      return allModels;
    }
    return allModels.filter((model) => model.modelType === selectedBenchmark);
  }, [allModels, selectedBenchmark]);

  // Create Model objects with selection state
  useEffect(() => {
    const modelObjects = filteredModels.map((model, index) => ({
      id: model._id,
      name: model.modelName,
      selected: index < 4, // Auto-select first 4
      data: model,
    }));
    setModels(modelObjects);
  }, [filteredModels]);

  // Toggle model selection
  const toggleModel = (id: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === id ? { ...model, selected: !model.selected } : model
      )
    );
  };

  // Get selected models
  const selectedModels = useMemo(() => {
    return models.filter((m) => m.selected).map((m) => m.data);
  }, [models]);

  if (loading) {
    return (
      <>
        <Navigation />
        <BenchmarksSkeleton />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <div className="bg-[rgba(246,243,255,1)] dark:bg-black min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-xl mb-2">⚠️ {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[rgba(246,243,255,1)] dark:bg-black">
      <div className="bg-white dark:bg-black w-full max-md:max-w-full">
        <div className="bg-white dark:bg-black w-full max-md:max-w-full">
          <Navigation />
          <main className="bg-[rgba(246,243,255,1)] dark:bg-black flex w-full flex-col items-stretch pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 md:pb-10 max-md:max-w-full">
            <div className="self-center flex w-full max-w-[1216px] flex-col px-4 sm:px-6 md:px-8 max-md:max-w-full">
              <header className="mb-8 sm:mb-10 md:mb-12 text-center sm:text-left">
                <h1 className="text-neutral-950 dark:text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-3 sm:mb-4">
                  AI Model Benchmarks
                </h1>
                <p className="text-[rgba(113,113,130,1)] dark:text-neutral-400 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-3xl mx-auto sm:mx-0">
                  Explore and compare AI model performance across various
                  standardized benchmarks. Select up to 4 models to compare.
                </p>
              </header>
              <section className="self-stretch max-md:max-w-full">
                <div className="gap-3 sm:gap-4 md:gap-5 flex flex-col md:flex-row items-stretch">
                  <div className="w-full md:w-[35%] lg:w-[28%] xl:w-[24%]">
                    <ChartControls
                      selectedBenchmark={selectedBenchmark}
                      onBenchmarkChange={setSelectedBenchmark}
                      modelTypes={modelTypes}
                      models={models}
                      onToggleModel={toggleModel}
                    />
                  </div>
                  <div className="w-full md:w-[65%] lg:w-[72%] xl:w-[76%]">
                    <BenchmarkChart selectedModels={selectedModels} />
                  </div>
                </div>
              </section>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default BenchmarksPage;
