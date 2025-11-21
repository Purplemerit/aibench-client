import React, { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
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
      <label className="text-neutral-950 dark:text-white text-sm font-normal leading-none block mb-3">
        Models to Compare (Max 4 - {selectedCount}/4 selected)
      </label>
      <div className="space-y-[15px] max-h-[400px] overflow-y-auto pr-2">
        {models.map((model) => {
          const isDisabled = !model.selected && selectedCount >= 4;
          return (
            <div
              key={model.id}
              className={`flex items-stretch gap-2 text-sm text-neutral-950 dark:text-white font-normal leading-none ${
                isDisabled ? "opacity-50" : ""
              }`}
            >
              <button
                onClick={() => !isDisabled && onToggleModel(model.id)}
                disabled={isDisabled}
                className={`flex w-[13px] shrink-0 h-[13px] rounded-[3px] border transition-colors ${
                  model.selected
                    ? "bg-[rgba(117,71,207,1)] border-[rgba(117,71,207,1)]"
                    : "bg-white dark:bg-neutral-800 border-[rgba(118,118,118,1)] border-solid"
                } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                aria-checked={model.selected}
                role="checkbox"
                aria-label={`Toggle ${model.name}`}
              />
              <span className="flex-1 text-left break-words">{model.name}</span>
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
  return (
    <aside
      className={`bg-white dark:bg-neutral-900 border flex w-full flex-col mx-auto pt-6 pb-6 px-6 rounded-[14px] border-[rgba(0,0,0,0.1)] border-solid max-md:mt-6 max-md:px-4 max-sm:px-2 ${className}`}
    >
      <div className="flex items-stretch gap-2 text-base text-neutral-950 dark:text-white font-normal leading-none mb-9">
        <svg
          className="w-5 h-5"
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
        <h3 className="basis-auto my-auto">Chart Controls</h3>
      </div>
      <div className="mb-[30px]">
        <label
          htmlFor="benchmark-select"
          className="text-neutral-950 dark:text-white text-sm font-normal leading-none block mb-3"
        >
          Benchmark Type
        </label>
        <div className="relative">
          <select
            id="benchmark-select"
            value={selectedBenchmark}
            onChange={(e) => onBenchmarkChange(e.target.value)}
            className="bg-[rgba(246,243,255,1)] dark:bg-neutral-800 w-full flex items-stretch gap-5 text-sm text-neutral-950 dark:text-white font-normal leading-none justify-between px-3 py-2.5 rounded-lg appearance-none cursor-pointer border border-gray-300 dark:border-gray-600"
          >
            <option value="All">All Models</option>
            {modelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-600 dark:text-gray-400"
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
      className={`bg-white dark:bg-neutral-900 border flex w-full flex-col mx-auto pt-7 pb-8 px-6 rounded-[14px] border-[rgba(0,0,0,0.1)] border-solid max-md:max-w-full max-md:mt-6 max-md:px-4 max-sm:px-2 ${className}`}
    >
      <header className="mb-6">
        <h2 className="text-neutral-950 dark:text-white text-base font-semibold leading-none mb-2">
          Benchmark Overview
        </h2>
        <p className="text-[rgba(113,113,130,1)] text-sm font-normal">
          Compare overall benchmark scores across selected models
        </p>
      </header>

      {selectedModels.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
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
            <p className="text-lg">Select models from the left to compare</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedModels.map((model, index) => (
              <div
                key={model._id}
                className="flex items-center gap-2 bg-[rgba(246,243,255,1)] dark:bg-zinc-800 px-3 py-2 rounded-lg"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-xs font-medium text-neutral-950 dark:text-neutral-100">
                  {model.modelName}
                </span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={120}
                interval={0}
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-neutral-950 dark:text-white"
              />
              <YAxis
                label={{
                  value: "Overall Score",
                  angle: -90,
                  position: "insideLeft",
                }}
                tick={{ fill: "currentColor" }}
                className="text-neutral-950 dark:text-white"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#000" }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedModels.map((model, index) => (
              <div
                key={model._id}
                className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <h4 className="text-sm font-semibold text-neutral-950 dark:text-white truncate">
                    {model.modelName}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {model.organization}
                </p>
                <p className="text-2xl font-bold text-[rgba(117,71,207,1)]">
                  {model.overallBenchmarkScore?.toFixed(1) || "N/A"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
      <div className="bg-[rgba(246,243,255,1)] dark:bg-black min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgba(117,71,207,1)] mx-auto mb-4"></div>
            <p className="text-neutral-950 dark:text-white">
              Loading benchmark data...
            </p>
          </div>
        </div>
        <Footer />
      </div>
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
          <main className="bg-[rgba(246,243,255,1)] dark:bg-black flex w-full flex-col items-stretch pt-24 pb-10 max-md:max-w-full max-md:pb-6">
            <div className="self-center flex w-full max-w-[1216px] flex-col px-4 max-md:max-w-full">
              <header className="mb-[34px]">
                <h1 className="text-neutral-950 dark:text-white text-3xl font-semibold leading-[1.2] mb-[29px]">
                  AI Model Benchmarks
                </h1>
                <p className="text-[rgba(113,113,130,1)] text-base font-normal max-md:max-w-full">
                  Explore and compare AI model performance across various
                  standardized benchmarks. Select up to 4 models to compare.
                </p>
              </header>
              <section className="self-stretch max-md:max-w-full">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                  <div className="w-[24%] max-lg:w-[35%] max-md:w-full max-md:ml-0">
                    <ChartControls
                      selectedBenchmark={selectedBenchmark}
                      onBenchmarkChange={setSelectedBenchmark}
                      modelTypes={modelTypes}
                      models={models}
                      onToggleModel={toggleModel}
                    />
                  </div>
                  <div className="w-[76%] ml-5 max-lg:w-[65%] max-md:w-full max-md:ml-0">
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
