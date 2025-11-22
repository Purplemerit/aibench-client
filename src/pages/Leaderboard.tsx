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
import SearchWithDropdown from "@/components/SearchWithDropdown";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useCompare } from "@/contexts/CompareContext";
import LeaderboardSkeleton from "@/components/skeletons/LeaderboardSkeleton";

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
        className="border-0 rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap"
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
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 20;

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
                model.license ||
                (model.openSource === "Yes" ? "Open Source" : "API"),
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
    // Improved search with word matching and word boundaries
    let matchesSearch = searchQuery === "";

    if (!matchesSearch && searchQuery) {
      const searchTerm = searchQuery.toLowerCase().trim();
      const searchWords = searchTerm.split(/\s+/);

      // Check if all search words are present in either model name or organization (case-insensitive)
      matchesSearch = searchWords.every((word) => {
        const wordRegex = new RegExp(
          word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        );
        return (
          wordRegex.test(model.model) || wordRegex.test(model.organization)
        );
      });
    }

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

    // Normalize license for matching - ensure we handle undefined/null
    const normalizedLicense = (model.license || "").toLowerCase().trim();

    const matchesLicense =
      selectedLicense === "all" ||
      (selectedLicense === "api" &&
        (normalizedLicense === "api" ||
          normalizedLicense.includes("proprietary") ||
          normalizedLicense === "")) ||
      (selectedLicense === "open" &&
        (normalizedLicense.includes("open") ||
          normalizedLicense === "open source" ||
          model.license === "Open Source")) ||
      (selectedLicense === "apache" && /apache/i.test(normalizedLicense)) ||
      (selectedLicense === "mit" && /\bmit\b/i.test(normalizedLicense)) ||
      (selectedLicense === "commercial" &&
        /commercial/i.test(normalizedLicense));

    const matchesYear =
      selectedYear === "all" ||
      (model.released && model.released.includes(selectedYear));

    return matchesSearch && matchesCategory && matchesLicense && matchesYear;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const endIndex = startIndex + modelsPerPage;
  const paginatedModels = filteredModels.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLicense, selectedYear]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (loading) {
    return (
      <>
        <Navigation />
        <LeaderboardSkeleton />
        <Footer />
      </>
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

      <main className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              AI Model Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto sm:mx-0">
              Comprehensive rankings of AI models across different modalities
              and benchmarks
            </p>
          </div>

          {/* Filters Card */}
          <div className="w-full border relative bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] dark:border-neutral-800 mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-neutral-950 dark:text-white mb-1">
                Filters
              </h3>
              <p className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#717182] dark:text-gray-400">
                Refine the leaderboard based on your preferences
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-4 sm:mb-6 h-10 sm:h-12">
              <SearchWithDropdown
                placeholder="Search models or organizations..."
                onSearch={setSearchQuery}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 h-7 sm:h-8 text-xs font-semibold rounded-lg border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 transition-all duration-200 ${
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm text-neutral-950 dark:text-white mb-2">
                  License
                </label>
                <Select
                  value={selectedLicense}
                  onValueChange={setSelectedLicense}
                >
                  <SelectTrigger className="bg-[#F6F4FA] dark:bg-[#23232b] border-0 rounded-lg h-9 text-sm">
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
                <label className="block text-xs sm:text-sm text-neutral-950 dark:text-white mb-2">
                  Release Year
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-[#F6F4FA] dark:bg-[#23232b] border-0 rounded-lg h-9 text-sm">
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
          <div className="w-full max-w-6xl mx-auto border relative bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] dark:border-neutral-800 overflow-hidden">
            <div className="pb-0">
              <h3 className="text-sm sm:text-base font-semibold text-neutral-950 dark:text-white mb-1">
                Results ({filteredModels.length} models)
              </h3>
              <p className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#717182] dark:text-gray-400 mb-4 sm:mb-6">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredModels.length)} of{" "}
                {filteredModels.length} models
              </p>
            </div>

            {/* Compare Bucket - Mobile */}
            {compareModels.length > 0 && (
              <div className="md:hidden mb-4">
                <div className="bg-[#F1EBFF] dark:bg-[#23232b] border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 rounded-[10px] px-4 py-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-neutral-950 dark:text-white">
                      Compare ({compareModels.length}/4)
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="text-xs font-semibold text-[#4B00A8] dark:text-purple-400 px-3 py-1 rounded hover:bg-white/50 dark:hover:bg-neutral-900/50 transition"
                        onClick={handleClearAll}
                      >
                        Clear
                      </button>
                      <button
                        className={`px-4 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] rounded-lg hover:opacity-90 text-xs font-semibold text-white ${
                          compareModels.length < 2 ? "opacity-50" : ""
                        }`}
                        disabled={compareModels.length < 2}
                        onClick={handleCompare}
                      >
                        Compare ({compareModels.length})
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {compareModels.map((selectedModel) => (
                      <div
                        key={selectedModel.id}
                        className="flex items-center bg-white dark:bg-neutral-800 rounded-lg px-2 py-1 border border-[#B18BEF] dark:border-[#7c3aed]"
                      >
                        <span className="text-xs font-medium text-[#4B00A8] dark:text-purple-400 mr-1">
                          {selectedModel.model}
                        </span>
                        <button
                          className="text-sm text-[#717182] hover:text-red-500"
                          onClick={() => handleRemoveModel(selectedModel.id)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                    const firstSelectedIndex = paginatedModels.findIndex(
                      (model) => compareModels.some((m) => m.id === model.id)
                    );
                    return paginatedModels.map((model, index) => (
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
                              className={`min-h-[21px] h-auto flex items-center justify-center px-2 py-1 rounded-lg border whitespace-nowrap ${
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

            {/* Mobile Card View */}
            <div className="md:hidden w-full space-y-3">
              {paginatedModels.map((model, index) => (
                <div
                  key={model.rank}
                  className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-[21px] px-2 py-1 flex items-center justify-center rounded-lg ${
                          model.rank === 1
                            ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)]"
                            : "bg-[#F1EBFF] dark:bg-[#232136]"
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold ${
                            model.rank === 1
                              ? "text-white"
                              : "text-[#232136] dark:text-[#C3C2D4]"
                          }`}
                        >
                          #{model.rank}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                        {model.model}
                      </h4>
                    </div>
                    <div
                      className={`h-[21px] px-2 py-1 flex items-center justify-center rounded-lg border ${
                        model.license === "Open Source"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-300 dark:border-gray-700 bg-[#F1EBFF] dark:bg-[#232136]"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          model.license === "Open Source"
                            ? "text-green-600 dark:text-green-400"
                            : "text-neutral-950 dark:text-white"
                        }`}
                      >
                        {model.license}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#717182] dark:text-neutral-400">
                        Organization
                      </span>
                      <span className="text-sm font-medium text-neutral-950 dark:text-white">
                        {model.organization}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#717182] dark:text-neutral-400">
                        Score
                      </span>
                      <span className="text-lg font-bold text-[#4B00A8] dark:text-purple-400">
                        {model.score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#717182] dark:text-neutral-400">
                        Cost
                      </span>
                      <span className="text-sm font-medium text-neutral-950 dark:text-white">
                        {model.cost}
                        {model.cost !== "Free" && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {" "}
                            tokens
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#717182] dark:text-neutral-400">
                        Released
                      </span>
                      <span className="text-sm font-medium text-neutral-950 dark:text-white">
                        {model.released}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/model/${model.id}`)}
                      className="flex-1 h-8 border flex items-center justify-center cursor-pointer transition-all duration-200 bg-white dark:bg-black rounded-lg border-solid border-[rgba(0,0,0,0.10)] hover:bg-gray-50 dark:hover:bg-neutral-800"
                    >
                      <span className="text-xs font-semibold text-neutral-950 dark:text-white">
                        View Details
                      </span>
                    </button>

                    <button
                      className={`flex-1 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg ${
                        isSelected(model.id)
                          ? "bg-[#717182] opacity-80"
                          : "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] hover:opacity-90"
                      }`}
                      disabled={!isSelected(model.id) && !canAddMore}
                      onClick={() => handleCompareClick(model)}
                    >
                      <span className="text-xs font-semibold text-white">
                        {isSelected(model.id) ? "Remove" : "Compare"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="text-sm text-[#717182] dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 h-9 flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className="text-sm font-semibold">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        );
                      })
                      .map((page, idx, arr) => {
                        // Add ellipsis if there's a gap
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-2 h-9 flex items-center text-[#717182] dark:text-gray-400">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                                currentPage === page
                                  ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] text-white"
                                  : "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800"
                              }`}
                            >
                              <span className="text-sm font-semibold">
                                {page}
                              </span>
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 h-9 flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 transition-all duration-200 ${
                      currentPage === totalPages
                        ? "bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className="text-sm font-semibold">Next</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
