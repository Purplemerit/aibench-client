import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ExternalLink, Zap, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useCompare } from "@/contexts/CompareContext";

const categories = [
  "All",
  "Text",
  "Image",
  "Audio",
  "Video",
  "Reasoning",
  "Multi-Modal",
];

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">{score}</span>
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 rounded-full"
          style={{ width: `${(score / 100) * 100}%` }}
        />
      </div>
    </div>
  );
}

function LicenseBadge({ license }: { license: string }) {
  if (license === "API") {
    return (
      <Badge
        className="border-0 rounded-lg px-2 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#F1EBFF", color: "#4B00A8" }}
      >
        API
      </Badge>
    );
  }
  if (license === "Open Source") {
    return (
      <Badge
        className="border-0 rounded-lg px-2 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#D1FADF", color: "#027A48" }}
      >
        Open Source
      </Badge>
    );
  }
  if (license === "Commercial") {
    return (
      <Badge
        className="border-0 rounded-lg px-2 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#D1E9FF", color: "#175CD3" }}
      >
        Commercial
      </Badge>
    );
  }
  return <Badge variant="outline">{license}</Badge>;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <div className="w-7 h-5 bg-gradient-to-b from-brand-500 via-brand-600 to-brand-800 rounded-lg flex items-center justify-center">
        <span className="text-xs font-semibold text-white">#{rank}</span>
      </div>
    );
  }
  return (
    <div className="w-7 h-5 bg-brand-50 rounded-lg flex items-center justify-center">
      <span className="text-xs font-semibold text-brand-900">#{rank}</span>
    </div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const {
    compareModels,
    addModel,
    removeModel,
    clearAll,
    isSelected,
    canAddMore,
  } = useCompare();
  const [modelData, setModelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLicense, setSelectedLicense] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await api.getAllModels({
          limit: 100,
          sortBy: "globalRankPosition",
          order: "asc",
        });

        if (response.success && response.data) {
          // Remove duplicates based on rank position
          const uniqueRanks = new Map();
          response.data
            .filter((model: any) => model.globalRankPosition)
            .sort(
              (a: any, b: any) => a.globalRankPosition - b.globalRankPosition
            )
            .forEach((model: any) => {
              if (!uniqueRanks.has(model.globalRankPosition)) {
                uniqueRanks.set(model.globalRankPosition, model);
              }
            });

          const formattedData = Array.from(uniqueRanks.values()).map(
            (model: any) => ({
              rank: model.globalRankPosition,
              model: model.modelName,
              type: model.modelType?.toLowerCase() || "text",
              organization: model.organization,
              score: model.overallBenchmarkScore || 0,
              cost: model.inputPrice || "Free",
              license:
                model.openSource === "Yes"
                  ? "Open Source"
                  : model.license || "API",
              released: model.releaseDate || "N/A",
              id: model._id,
            })
          );
          setModelData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Add/remove model to/from compare bucket
  const handleCompareClick = (model: any) => {
    if (isSelected(model.id)) {
      removeModel(model.id);
    } else {
      const success = addModel({
        id: model.id,
        rank: model.rank,
        model: model.model,
        organization: model.organization,
        score: model.score,
        type: model.type,
        cost: model.cost,
        license: model.license,
        released: model.released,
      });
      if (!success) {
        alert("You can only compare up to 4 models at once");
      }
    }
  };

  // Remove single model from compare bucket
  const handleRemoveModel = (id: string) => {
    removeModel(id);
  };

  // Filter models based on search, category, license, and year
  const filteredModels = modelData.filter((model) => {
    const matchesSearch =
      searchQuery === "" ||
      model.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.organization.toLowerCase().includes(searchQuery.toLowerCase());

    // Normalize model type for matching
    const normalizedType = model.type.toLowerCase();

    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Text" &&
        (normalizedType === "text" ||
          normalizedType.startsWith("text ") ||
          normalizedType.startsWith("text("))) ||
      (selectedCategory === "Image" &&
        (normalizedType === "image" || normalizedType.includes("image"))) ||
      (selectedCategory === "Audio" &&
        (normalizedType === "audio" || normalizedType.includes("audio"))) ||
      (selectedCategory === "Video" &&
        (normalizedType === "video" || normalizedType.includes("video"))) ||
      (selectedCategory === "Reasoning" &&
        normalizedType.includes("reasoning")) ||
      (selectedCategory === "Multi-Modal" &&
        normalizedType.includes("multimodal"));

    // Normalize license for matching
    const normalizedLicense = model.license.toLowerCase();

    const matchesLicense =
      selectedLicense === "all" ||
      (selectedLicense === "api" &&
        (normalizedLicense === "api" ||
          normalizedLicense.includes("proprietary"))) ||
      (selectedLicense === "open" &&
        (normalizedLicense.includes("open") ||
          model.organization === "Open Source")) ||
      (selectedLicense === "apache" && normalizedLicense.includes("apache")) ||
      (selectedLicense === "mit" && normalizedLicense.includes("mit")) ||
      (selectedLicense === "commercial" &&
        normalizedLicense.includes("commercial"));

    const matchesYear =
      selectedYear === "all" ||
      (model.released && model.released.includes(selectedYear));

    return matchesSearch && matchesCategory && matchesLicense && matchesYear;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Navigation />
        <p className="text-neutral-950 dark:text-white">
          Loading leaderboard...
        </p>
      </div>
    );
  }

  // Clear all
  const handleClearAll = () => clearAll();

  // Navigate to comparison page
  const handleCompare = () => {
    if (compareModels.length >= 2 && compareModels.length <= 4) {
      navigate("/comparison");
    } else {
      alert("Please select 2-4 models to compare");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EBFF] dark:bg-black dark:text-white">
      <Navigation />

      <main className="px-8 py-8 pt-24 max-md:px-4 max-sm:px-2">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
              AI Model Leaderboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive rankings of AI models across different modalities
              and benchmarks
            </p>
          </div>

          {/* Filters Card */}
          <div className="w-full max-w-6xl mx-auto border relative bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] dark:border-neutral-800 mb-8 max-md:p-4 max-sm:p-2">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-neutral-950 dark:text-white mb-1">
                Filters
              </h3>
              <p className="text-base font-normal leading-6 text-[#717182] dark:text-gray-400">
                Refine the leaderboard based on your preferences
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search models or organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-[#F6F4FA] dark:bg-[#23232b] border-0 rounded-lg"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 h-8 text-xs font-semibold rounded-lg border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] text-white"
                      : "bg-[#F1EBFF] dark:bg-[#23232b] text-[#030213] dark:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="flex gap-4 max-md:flex-col">
              <div className="flex-1">
                <label className="block text-sm text-neutral-950 dark:text-white mb-2">
                  License
                </label>
                <Select
                  value={selectedLicense}
                  onValueChange={setSelectedLicense}
                >
                  <SelectTrigger className="bg-[#F6F4FA] dark:bg-[#23232b] border-0 rounded-lg h-9">
                    <SelectValue placeholder="All Licenses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Licenses</SelectItem>
                    <SelectItem value="api">API / Proprietary</SelectItem>
                    <SelectItem value="open">Open Source</SelectItem>
                    <SelectItem value="apache">Apache 2.0</SelectItem>
                    <SelectItem value="mit">MIT</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm text-neutral-950 dark:text-white mb-2">
                  Release Year
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-[#F6F4FA] dark:bg-[#23232b] border-0 rounded-lg h-9">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="w-full max-w-6xl mx-auto border relative bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] dark:border-neutral-800 overflow-hidden max-md:p-4 max-sm:p-2">
            <div className="pb-0">
              <h3 className="text-base font-semibold text-neutral-950 dark:text-white mb-1">
                Results ({filteredModels.length} models)
              </h3>
              <p className="text-base font-normal leading-6 text-[#717182] dark:text-gray-400 mb-6">
                Click column headers to sort
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b-[0.667px] border-b-[rgba(0,0,0,0.10)] border-solid">
                  <tr>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white min-w-[60px] pl-2 text-left">
                      Rank
                    </th>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white min-w-[160px] pl-8 text-left">
                      Model
                    </th>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white min-w-[120px] pl-4 text-left">
                      Organization
                    </th>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white min-w-[80px] pl-3 text-left">
                      Score
                    </th>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white min-w-[100px] pl-3 text-left">
                      Cost
                    </th>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white min-w-[100px] pl-3 text-left">
                      License
                    </th>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white min-w-[100px] text-left pl-8">
                      Released
                    </th>
                    <th className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white flex-1 flex justify-end text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const firstSelectedIndex = filteredModels.findIndex(
                      (model) => compareModels.some((m) => m.id === model.id)
                    );
                    return filteredModels.map((model, index) => (
                      <React.Fragment key={model.rank}>
                        {/* Insert compare bucket row only once, before the first selected model */}
                        {compareModels.length > 0 &&
                          index === firstSelectedIndex && (
                            <tr>
                              <td colSpan={8}>
                                <div className="flex items-center justify-between my-2 bg-[#F1EBFF] dark:bg-[#23232b] border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 rounded-[10px] px-6 py-3">
                                  <div className="flex gap-2 flex-wrap items-center">
                                    <span className="text-sm font-semibold text-neutral-950 dark:text-white mr-2">
                                      Compare Models ({compareModels.length}/4)
                                    </span>
                                    {compareModels.map((selectedModel) => (
                                      <div
                                        key={selectedModel.id}
                                        className="flex items-center bg-white dark:bg-neutral-800 rounded-lg px-3 py-1 mr-1 border border-[#B18BEF] dark:border-[#7c3aed]"
                                      >
                                        <span className="text-xs font-medium text-[#4B00A8] mr-2">
                                          {selectedModel.model}
                                        </span>
                                        <button
                                          className="ml-1 text-xs text-[#717182] hover:text-red-500"
                                          onClick={() =>
                                            handleRemoveModel(selectedModel.id)
                                          }
                                          title="Remove"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <button
                                      className="text-xs font-semibold text-[#4B00A8] px-3 py-1 rounded hover:bg-white dark:hover:bg-neutral-900 border border-transparent hover:border-[#B18BEF] dark:hover:border-[#7c3aed] transition"
                                      onClick={handleClearAll}
                                    >
                                      Clear All
                                    </button>
                                    <button
                                      className={`min-w-[90px] px-5 h-9 flex items-center justify-center cursor-pointer transition-all duration-200 bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] rounded-lg hover:opacity-90 text-sm font-semibold leading-5 text-center text-white${
                                        compareModels.length >= 2 ? " pr-6" : ""
                                      }`}
                                      style={{
                                        minWidth:
                                          compareModels.length > 0 ? 110 : 90,
                                      }}
                                      disabled={compareModels.length < 2}
                                      onClick={handleCompare}
                                    >
                                      Compare
                                      {compareModels.length > 0
                                        ? ` (${compareModels.length})`
                                        : ""}
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        <tr className="border-b-[0.667px] border-b-[rgba(0,0,0,0.10)] dark:border-b-neutral-800 border-solid">
                          <td className="min-w-[60px] pl-2 py-3">
                            <div
                              className={`flex items-center justify-center rounded-lg ${
                                model.rank === 1
                                  ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)]"
                                  : "bg-[#F1EBFF] dark:bg-[#23232b]"
                              }`}
                            >
                              <span
                                className={`text-xs font-semibold leading-4 text-center ${
                                  model.rank === 1
                                    ? "text-white"
                                    : "text-[#030213] dark:text-white"
                                }`}
                              >
                                #{model.rank}
                              </span>
                            </div>
                          </td>
                          <td className="min-w-[160px] pl-8 py-3">
                            <div className="text-sm font-normal leading-5 text-neutral-950 dark:text-white">
                              {model.model}
                            </div>
                          </td>
                          <td className="min-w-[120px] text-sm font-normal leading-5 text-neutral-950 dark:text-white pl-4 py-3">
                            {model.organization}
                          </td>
                          <td className="min-w-[80px] text-sm font-normal leading-5 text-neutral-950 dark:text-white pl-3 py-3">
                            {model.score}
                          </td>
                          <td className="min-w-[100px] pl-3 py-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {model.cost}
                            </div>
                            {model.cost !== "Free" && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                tokens
                              </div>
                            )}
                          </td>
                          <td className="min-w-[100px] py-3 pl-3">
                            <div
                              className={`h-[21px] flex items-center justify-center px-2 py-1 rounded-lg border ${
                                model.license === "Open Source"
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : "border-[rgba(0,0,0,0.10)] dark:border-neutral-800 bg-[#F1EBFF] dark:bg-[#232136]"
                              }`}
                            >
                              <span
                                className={`text-xs font-semibold leading-4 text-center ${
                                  model.license === "Open Source"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-neutral-950 dark:text-white"
                                }`}
                              >
                                {model.license}
                              </span>
                            </div>
                          </td>
                          <td className="min-w-[100px] text-sm font-normal leading-5 text-neutral-950 dark:text-white py-3 pl-8">
                            {model.released}
                          </td>
                          <td className="flex gap-2 justify-end py-3">
                            <button
                              className="w-14 h-8 border flex items-center justify-center cursor-pointer transition-all duration-200 bg-white dark:bg-neutral-800 rounded-lg border-solid border-[rgba(0,0,0,0.10)] dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
                              onClick={() => navigate(`/model/${model.id}`)}
                            >
                              <span className="text-sm font-semibold leading-5 text-center text-neutral-950 dark:text-white">
                                View
                              </span>
                            </button>
                            <button
                              className={`w-[82px] h-8 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg ${
                                isSelected(model.id)
                                  ? "bg-[#717182] opacity-80"
                                  : "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] hover:opacity-90"
                              }`}
                              disabled={!isSelected(model.id) && !canAddMore}
                              onClick={() => handleCompareClick(model)}
                            >
                              <span className="text-sm font-semibold leading-5 text-center text-white">
                                {isSelected(model.id) ? "Remove" : "Compare"}
                              </span>
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
