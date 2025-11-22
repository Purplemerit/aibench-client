import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useCompare } from "@/contexts/CompareContext";
import LeaderboardPreviewSkeleton from "./skeletons/LeaderboardPreviewSkeleton";

const LeaderboardPreview = () => {
  const navigate = useNavigate();
  const { addModel, isSelected, canAddMore } = useCompare();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.getLeaderboard(100);
        if (response.success && response.data) {
          // Sort by rank and remove duplicates based on rank position
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

          const formattedData = Array.from(uniqueRanks.values())
            .slice(0, 5)
            .map((model: any) => {
              let category = (model.modelType || "text").toLowerCase();
              // Normalize category names to match filter options
              // Check for multimodal first (most specific)
              if (category.includes("multi") || category.includes("modal")) {
                category = "multimodal";
              } else if (category.includes("reason")) {
                category = "reasoning";
              } else if (category.includes("video")) {
                category = "video";
              } else if (category.includes("audio")) {
                category = "audio";
              } else if (category.includes("image")) {
                category = "image";
              } else {
                category = "text";
              }

              return {
                rank: model.globalRankPosition,
                model: model.modelName,
                category: category,
                organization: model.organization,
                score: model.overallBenchmarkScore || 0,
                license:
                  model.openSource === "Yes"
                    ? "Open Source"
                    : model.license || "API",
                id: model._id,
              };
            });
          setLeaderboardData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // Fallback to default data
        setLeaderboardData(getDefaultData());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getDefaultData = () => [
    {
      rank: 1,
      model: "o1-preview",
      category: "reasoning",
      organization: "OpenAI",
      score: 92.5,
      license: "API",
    },
    {
      rank: 2,
      model: "GPT-4o",
      category: "multimodal",
      organization: "OpenAI",
      score: 91.7,
      license: "API",
    },
    {
      rank: 3,
      model: "Claude 3.5 Sonnet",
      category: "multimodal",
      organization: "Anthropic",
      score: 91.5,
      license: "API",
    },
    {
      rank: 4,
      model: "Llama 3.1 405B",
      category: "text",
      organization: "Meta",
      score: 91.0,
      license: "Open Source",
    },
    {
      rank: 5,
      model: "Midjourney v6",
      category: "image",
      organization: "Midjourney",
      score: 90.1,
      license: "Commercial",
    },
  ];

  if (loading) {
    return <LeaderboardPreviewSkeleton />;
  }

  return (
    <section className="w-full flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16 dark:bg-black">
      <h2 className="text-2xl sm:text-3xl font-semibold leading-7 sm:leading-9 text-neutral-950 dark:text-white text-center mb-3 sm:mb-4 px-2">
        Leaderboard Preview
      </h2>

      <p className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#717182] dark:text-white text-center mb-8 sm:mb-12 md:mb-[60px] px-4">
        Top performing models across different modalities
      </p>

      <div className="w-full max-w-6xl relative bg-white dark:bg-black p-3 sm:p-4 md:p-6 rounded-xl border border-gray-300 dark:border-gray-700">
        <h4 className="text-sm sm:text-base font-semibold leading-4 text-neutral-950 dark:text-white mb-1 sm:mb-2">
          Top Models
        </h4>

        <p className="text-xs sm:text-sm md:text-base font-normal leading-5 sm:leading-6 text-[#717182] dark:text-white mb-4 sm:mb-6 md:mb-8">
          Ranked by overall performance scores
        </p>

        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-x-auto">
          <div className="w-full min-w-[750px]">
            <div className="w-full h-8 sm:h-10 flex items-center border-b border-gray-200 dark:border-gray-700">
              <div className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-neutral-950 dark:text-white min-w-[50px] sm:min-w-[60px] text-center">
                Rank
              </div>
              <div className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-neutral-950 dark:text-white flex-1 text-center">
                Model
              </div>
              <div className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-neutral-950 dark:text-white flex-1 text-center">
                Organization
              </div>
              <div className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-neutral-950 dark:text-white flex-1 text-center">
                Score
              </div>
              <div className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-neutral-950 dark:text-white min-w-[80px] sm:min-w-[100px] text-center">
                License
              </div>
              <div className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-neutral-950 dark:text-white flex-1 flex justify-end">
                Actions
              </div>
            </div>

            <div className="w-full">
              {leaderboardData.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full h-[57px] items-center relative border-b border-gray-200 dark:border-gray-700"
                >
                  <div
                    className={`min-w-[60px] h-[21px] flex items-center justify-center rounded-lg ${
                      item.rank === 1
                        ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)]"
                        : "bg-[#F1EBFF] dark:bg-[#232136]"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold leading-4 text-center ${
                        item.rank === 1
                          ? "text-white"
                          : "text-[#232136] dark:text-[#C3C2D4]"
                      }`}
                    >
                      #{item.rank}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center px-1">
                    <div className="text-sm font-normal leading-5 text-neutral-950 dark:text-white text-center">
                      {item.model}
                    </div>
                  </div>

                  <div className="flex-1 text-sm font-normal leading-5 text-neutral-950 dark:text-white text-center px-1">
                    {item.organization}
                  </div>

                  <div className="flex-1 text-sm font-normal leading-5 text-neutral-950 dark:text-white text-center px-1">
                    {item.score}
                  </div>

                  <div
                    className={`min-w-[100px] h-[21px] flex items-center justify-center px-2 py-1 rounded-lg border ${
                      item.license === "Open Source"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-700 bg-[#F1EBFF] dark:bg-[#232136]"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold leading-4 text-center ${
                        item.license === "Open Source"
                          ? "text-green-600 dark:text-green-400"
                          : "text-neutral-950 dark:text-white"
                      }`}
                    >
                      {item.license}
                    </span>
                  </div>

                  <div className="flex-1 flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/model/${item.id}`)}
                      className="w-14 h-8 border flex items-center justify-center cursor-pointer transition-all duration-200 bg-white dark:bg-black rounded-lg border-solid border-[rgba(0,0,0,0.10)] hover:bg-gray-50 dark:hover:bg-black"
                    >
                      <span className="text-sm font-semibold leading-5 text-center text-neutral-950 dark:text-white">
                        View
                      </span>
                    </button>

                    <button
                      className={`w-[82px] h-8 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg ${
                        isSelected(item.id)
                          ? "bg-[#717182] opacity-80"
                          : "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] hover:opacity-90"
                      }`}
                      disabled={!isSelected(item.id) && !canAddMore}
                      onClick={() => {
                        const success = addModel({
                          id: item.id,
                          rank: item.rank,
                          model: item.model,
                          organization: item.organization,
                          score: item.score,
                          type: item.category,
                          cost: "Free",
                          license: item.license,
                          released: "N/A",
                        });
                        if (!success) {
                          alert("You can only compare up to 4 models at once");
                        }
                      }}
                    >
                      <span className="text-sm font-semibold leading-5 text-center text-white">
                        {isSelected(item.id) ? "Remove" : "Compare"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden w-full space-y-3">
          {leaderboardData.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-[21px] px-2 py-1 flex items-center justify-center rounded-lg ${
                      item.rank === 1
                        ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)]"
                        : "bg-[#F1EBFF] dark:bg-[#232136]"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        item.rank === 1
                          ? "text-white"
                          : "text-[#232136] dark:text-[#C3C2D4]"
                      }`}
                    >
                      #{item.rank}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                    {item.model}
                  </h4>
                </div>
                <div
                  className={`h-[21px] px-2 py-1 flex items-center justify-center rounded-lg border ${
                    item.license === "Open Source"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-700 bg-[#F1EBFF] dark:bg-[#232136]"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      item.license === "Open Source"
                        ? "text-green-600 dark:text-green-400"
                        : "text-neutral-950 dark:text-white"
                    }`}
                  >
                    {item.license}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#717182] dark:text-neutral-400">
                  {item.organization}
                </span>
                <span className="text-lg font-bold text-[#4B00A8] dark:text-purple-400">
                  {item.score}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/model/${item.id}`)}
                  className="flex-1 h-8 border flex items-center justify-center cursor-pointer transition-all duration-200 bg-white dark:bg-black rounded-lg border-solid border-[rgba(0,0,0,0.10)] hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <span className="text-xs font-semibold text-neutral-950 dark:text-white">
                    View Details
                  </span>
                </button>

                <button
                  className={`flex-1 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg ${
                    isSelected(item.id)
                      ? "bg-[#717182] opacity-80"
                      : "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] hover:opacity-90"
                  }`}
                  disabled={!isSelected(item.id) && !canAddMore}
                  onClick={() => {
                    const success = addModel({
                      id: item.id,
                      rank: item.rank,
                      model: item.model,
                      organization: item.organization,
                      score: item.score,
                      type: item.category,
                      cost: "Free",
                      license: item.license,
                      released: "N/A",
                    });
                    if (!success) {
                      alert("You can only compare up to 4 models at once");
                    }
                  }}
                >
                  <span className="text-xs font-semibold text-white">
                    {isSelected(item.id) ? "Remove" : "Compare"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full sm:w-auto h-9 sm:h-10 flex items-center justify-center gap-2 sm:gap-[15.691px] cursor-pointer transition-all duration-200 mt-6 sm:mt-8 md:mt-10 mx-auto bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] rounded-lg hover:opacity-90 px-4 sm:px-6"
          onClick={() => navigate("/leaderboard")}
        >
          <span className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-center text-white whitespace-nowrap">
            View Full Leaderboard
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M3.81323 8.66003H13.1466"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.47998 3.99341L13.1466 8.66008L8.47998 13.3267"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default LeaderboardPreview;
