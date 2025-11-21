import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModelCard from "./ModelCard";
import { api } from "@/lib/api";
import { useCompare } from "@/contexts/CompareContext";

const FeaturedModels = () => {
  const navigate = useNavigate();
  const { compareModels, addModel, removeModel, clearAll, isSelected } =
    useCompare();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedModels = async () => {
      try {
        const response = await api.getFeaturedModels();
        if (response.success && response.data) {
          const allModels = response.data;

          // Separate models by category
          const topRated = allModels
            .sort(
              (a: any, b: any) =>
                (b.overallBenchmarkScore || 0) - (a.overallBenchmarkScore || 0)
            )
            .slice(0, 5); // Top 5 highest rated

          const openSource = allModels.filter(
            (m: any) => m.openSource === "Yes"
          );

          const costEffective = allModels.filter((m: any) => {
            const price = m.inputPrice || "";
            return (
              price.toLowerCase().includes("free") ||
              price === "Free" ||
              price === ""
            );
          });

          // Randomly select one from each category
          const recommended =
            topRated[Math.floor(Math.random() * Math.min(topRated.length, 5))];
          const openSourceModel =
            openSource.length > 0
              ? openSource[Math.floor(Math.random() * openSource.length)]
              : topRated[1];
          const costEffectiveModel =
            costEffective.length > 0
              ? costEffective[Math.floor(Math.random() * costEffective.length)]
              : topRated[2];

          // Map API data to component format
          const formattedModels = [
            {
              model: recommended,
              categoryTitle: "Recommended",
              icon: recommendedIcon,
            },
            {
              model: openSourceModel,
              categoryTitle: "Open Source",
              icon: openSourceIcon,
            },
            {
              model: costEffectiveModel,
              categoryTitle: "Cost Effective",
              icon: costEffectiveIcon,
            },
          ].map((item, index) => ({
            title: item.model.modelName,
            organization: item.model.organization,
            description:
              item.model.specialFeatures ||
              `${item.model.modelType} model with advanced capabilities`,
            score: item.model.overallBenchmarkScore || 0,
            badge: {
              type: item.model.openSource === "Yes" ? "open-source" : "api",
              label: item.model.openSource === "Yes" ? "Open Source" : "API",
            },
            capabilities: [
              item.model.modelType,
              item.model.imageSupport === "Yes" ? "Vision" : null,
              item.model.audioSupport === "Yes" ? "Audio" : null,
              "Code",
            ]
              .filter(Boolean)
              .slice(0, 3)
              .concat(["+more"]),
            icon: item.icon,
            categoryTitle: item.categoryTitle,
            featured: index === 0,
            modelId: item.model._id,
            // Add data needed for comparison
            rank: index + 1,
            type: item.model.modelType || "N/A",
            cost: item.model.inputPrice
              ? `$${item.model.inputPrice}/1M tokens`
              : "Free",
            license: item.model.openSource === "Yes" ? "Open Source" : "API",
            released: item.model.releaseDate || "N/A",
          }));

          setModels(formattedModels);
        }
      } catch (error) {
        console.error("Error fetching featured models:", error);
        // Fallback to default data
        setModels(getDefaultModels());
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedModels();
  }, []);

  const getIconByCategory = (index: number) => {
    const icons = [recommendedIcon, openSourceIcon, costEffectiveIcon];
    return icons[index] || recommendedIcon;
  };

  const getCategoryTitle = (index: number) => {
    const titles = ["Recommended", "Open Source", "Cost Effective"];
    return titles[index] || "Featured";
  };

  const getDefaultModels = () => [
    {
      title: "GPT-4o",
      organization: "OpenAI",
      description:
        "Advanced multimodal model with vision, text, and audio capabilities",
      score: 91.7,
      badge: { type: "api" as const, label: "API" },
      capabilities: ["Text Generation", "Vision", "Code", "+2 more"],
      icon: recommendedIcon,
      featured: true,
      categoryTitle: "Recommended",
    },
    {
      title: "Llama 3.1 405B",
      organization: "Meta",
      description:
        "Largest open-source language model with exceptional performance",
      score: 91.0,
      badge: { type: "open-source" as const, label: "Open Source" },
      capabilities: ["Text Generation", "Code", "Math", "+2 more"],
      icon: openSourceIcon,
      categoryTitle: "Open Source",
    },
    {
      title: "Gemini 1.5 Pro",
      organization: "Google",
      description:
        "Multimodal model with long context and efficient processing",
      score: 87.7,
      badge: { type: "api" as const, label: "API" },
      capabilities: ["Text Generation", "Vision", "Audio", "+2 more"],
      icon: costEffectiveIcon,
      categoryTitle: "Cost Effective",
    },
  ];

  const recommendedIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-2"
    >
      <path
        d="M13.0274 10.7417L14.2899 17.8467C14.3041 17.9303 14.2923 18.0163 14.2563 18.0931C14.2202 18.1699 14.1616 18.2339 14.0882 18.2765C14.0148 18.3191 13.9302 18.3382 13.8456 18.3314C13.761 18.3246 13.6805 18.2921 13.6149 18.2383L10.6316 15.9992C10.4876 15.8916 10.3126 15.8334 10.1328 15.8334C9.95306 15.8334 9.77811 15.8916 9.63409 15.9992L6.64575 18.2375C6.58019 18.2912 6.4998 18.3236 6.41533 18.3305C6.33086 18.3373 6.24631 18.3182 6.17297 18.2757C6.09963 18.2333 6.04098 18.1694 6.00485 18.0928C5.96872 18.0161 5.95683 17.9303 5.97075 17.8467L7.23242 10.7417"
        stroke="#EFB100"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1299 11.6667C12.8913 11.6667 15.1299 9.42808 15.1299 6.66666C15.1299 3.90523 12.8913 1.66666 10.1299 1.66666C7.36846 1.66666 5.12988 3.90523 5.12988 6.66666C5.12988 9.42808 7.36846 11.6667 10.1299 11.6667Z"
        stroke="#EFB100"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const openSourceIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-2"
    >
      <path
        d="M13.8433 5.83334H18.8433V10.8333"
        stroke="#00C950"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8434 5.83334L11.7601 12.9167L7.59342 8.75001L2.17676 14.1667"
        stroke="#00C950"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const costEffectiveIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-2"
    >
      <path
        d="M10.52 1.66666V18.3333"
        stroke="#2B7FFF"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6867 4.16666H8.43669C7.66314 4.16666 6.92127 4.47395 6.37429 5.02093C5.82731 5.56791 5.52002 6.30978 5.52002 7.08332C5.52002 7.85687 5.82731 8.59874 6.37429 9.14572C6.92127 9.6927 7.66314 9.99999 8.43669 9.99999H12.6034C13.3769 9.99999 14.1188 10.3073 14.6657 10.8543C15.2127 11.4012 15.52 12.1431 15.52 12.9167C15.52 13.6902 15.2127 14.4321 14.6657 14.9791C14.1188 15.526 13.3769 15.8333 12.6034 15.8333H5.52002"
        stroke="#2B7FFF"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (loading) {
    return (
      <section className="w-full flex flex-col items-center bg-[#F6F3FF] dark:bg-[#232136] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="w-full max-w-screen-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold leading-8 sm:leading-9 text-neutral-950 dark:text-white text-center mb-4">
            Featured Models
          </h2>
          <p className="text-center text-[#717182] dark:text-white">
            Loading...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col items-center bg-[#F6F3FF] dark:bg-[#232136] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="w-full max-w-screen-xl">
        <h2 className="text-2xl sm:text-3xl font-semibold leading-7 sm:leading-9 text-neutral-950 dark:text-white text-center mb-3 sm:mb-4 px-2">
          Featured Models
        </h2>

        <p className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-[#717182] dark:text-white text-center mb-8 sm:mb-12 md:mb-16 lg:mb-[76px] px-4">
          Discover the best AI models across different categories and use cases
        </p>

        <div className="flex gap-4 sm:gap-5 md:gap-6 justify-center items-stretch flex-col lg:flex-row lg:items-start w-full">
          {models.map((model, index) => (
            <div
              key={index}
              className="flex flex-col items-start w-full lg:max-w-md"
            >
              <h3 className="text-base sm:text-lg font-normal leading-6 sm:leading-7 text-neutral-950 dark:text-white mb-3 sm:mb-4">
                {model.categoryTitle}
              </h3>
              <ModelCard
                {...model}
                isSelected={isSelected(model.modelId)}
                onCompareToggle={() => {
                  if (isSelected(model.modelId)) {
                    removeModel(model.modelId);
                  } else {
                    const success = addModel({
                      id: model.modelId,
                      rank: model.rank,
                      model: model.title,
                      organization: model.organization,
                      score: model.score,
                      type: model.type,
                      cost: model.cost,
                      license: model.license,
                      released: model.released,
                    });
                    if (!success) {
                      alert("You can only compare up to 3 models at a time.");
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Compare Bucket */}
        {compareModels.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 sm:mt-8 bg-[#F1EBFF] dark:bg-[#23232b] border border-[rgba(0,0,0,0.10)] dark:border-neutral-800 rounded-[10px] px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-4">
            <div className="flex gap-2 flex-wrap items-center w-full sm:w-auto">
              <span className="text-xs sm:text-sm font-semibold text-neutral-950 dark:text-white mr-1 sm:mr-2">
                Compare Models ({compareModels.length}/3)
              </span>
              {compareModels.map((selectedModel) => (
                <div
                  key={selectedModel.id}
                  className="flex items-center bg-white dark:bg-neutral-800 rounded-lg px-2 sm:px-3 py-1 border border-[#B18BEF] dark:border-[#7c3aed]"
                >
                  <span className="text-xs font-medium text-[#4B00A8] dark:text-purple-400 mr-1 sm:mr-2 truncate max-w-[120px] sm:max-w-none">
                    {selectedModel.model}
                  </span>
                  <button
                    className="ml-1 text-sm sm:text-xs text-[#717182] hover:text-red-500"
                    onClick={() => removeModel(selectedModel.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
              <button
                className="text-xs sm:text-sm font-semibold text-[#4B00A8] dark:text-purple-400 px-3 py-2 sm:py-1 rounded hover:bg-white dark:hover:bg-neutral-900 border border-transparent hover:border-[#B18BEF] dark:hover:border-[#7c3aed] transition"
                onClick={clearAll}
              >
                Clear All
              </button>
              <button
                className="min-w-[100px] sm:min-w-[110px] px-4 sm:px-5 h-9 flex items-center justify-center cursor-pointer transition-all duration-200 bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] rounded-lg hover:opacity-90 text-xs sm:text-sm font-semibold leading-5 text-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={compareModels.length < 2}
                onClick={() => navigate("/comparison")}
              >
                Compare
                {compareModels.length > 0 ? ` (${compareModels.length})` : ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedModels;
