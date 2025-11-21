import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useCompare } from "../../contexts/CompareContext";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type TabType = "performance" | "pricing" | "features";

// Model detail interface
interface ModelDetail {
  _id: string;
  modelName: string;
  organization: string;
  overallBenchmarkScore?: number;
  mmluScore?: number;
  humanEvalScore?: number;
  gsm8kScore?: number;
  mathScore?: number;
  clipScore?: number;
  inputPrice?: number;
  outputPrice?: number;
  contextWindow?: string;
  maxOutputTokens?: string;
  imageSupport?: boolean;
  audioSupport?: boolean;
  videoSupport?: boolean;
  apiAvailable?: boolean;
  openSource?: boolean;
}

// ModelCard component
interface ModelCardProps {
  modelId: string;
  name: string;
  company: string;
  score: string;
  type: string;
  released: string;
  cost: string;
  isStarred?: boolean;
  isAPI?: boolean;
  isOpenSource?: boolean;
  isFree?: boolean;
}

const ModelCard: React.FC<ModelCardProps> = ({
  modelId,
  name,
  company,
  score,
  type,
  released,
  cost,
  isStarred = false,
  isAPI = false,
  isOpenSource = false,
  isFree = false,
}) => {
  const navigate = useNavigate();
  return (
    <article className="box-border w-full max-w-md border bg-white dark:bg-neutral-900 p-6 max-md:p-5 max-sm:p-4 rounded-[14px] border-solid border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] flex flex-col justify-between max-md:w-full">
      <header className="flex items-start justify-between mb-4 max-sm:mb-3">
        <div>
          <h3 className="text-neutral-950 dark:text-white text-lg max-sm:text-base font-semibold leading-6 max-sm:leading-5 mb-1 flex items-center gap-2">
            {name}
            {isStarred && (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" class="star-icon" style="box-sizing: border-box; width: 16px; height: 16px"> <path d="M8.66321 1.85999C8.69243 1.80096 8.73756 1.75128 8.79351 1.71654C8.84947 1.6818 8.91402 1.66339 8.97988 1.66339C9.04574 1.66339 9.11029 1.6818 9.16624 1.71654C9.2222 1.75128 9.26733 1.80096 9.29655 1.85999L10.8365 4.97932C10.938 5.18463 11.0878 5.36226 11.273 5.49696C11.4582 5.63165 11.6733 5.7194 11.8999 5.75265L15.3439 6.25665C15.4091 6.26611 15.4704 6.29363 15.5209 6.33612C15.5713 6.3786 15.6088 6.43435 15.6292 6.49706C15.6496 6.55976 15.6521 6.62692 15.6363 6.69094C15.6205 6.75496 15.5871 6.81329 15.5399 6.85932L13.0492 9.28465C12.885 9.44472 12.7621 9.64231 12.6911 9.86041C12.6201 10.0785 12.6033 10.3106 12.6419 10.5367L13.2299 13.9633C13.2414 14.0285 13.2344 14.0957 13.2095 14.1571C13.1847 14.2185 13.1432 14.2717 13.0896 14.3107C13.036 14.3496 12.9725 14.3727 12.9065 14.3773C12.8404 14.3818 12.7743 14.3678 12.7159 14.3367L9.63721 12.718C9.43436 12.6115 9.20866 12.5558 8.97955 12.5558C8.75043 12.5558 8.52473 12.6115 8.32188 12.718L5.24388 14.3367C5.18543 14.3676 5.11948 14.3815 5.05351 14.3768C4.98755 14.3721 4.92422 14.349 4.87074 14.3101C4.81726 14.2712 4.77577 14.2181 4.75098 14.1568C4.7262 14.0955 4.71912 14.0285 4.73054 13.9633L5.31788 10.5373C5.35668 10.3111 5.33987 10.0789 5.2689 9.86069C5.19794 9.64245 5.07495 9.44476 4.91054 9.28465L2.41988 6.85999C2.37227 6.81401 2.33854 6.75558 2.32252 6.69137C2.3065 6.62716 2.30884 6.55973 2.32926 6.49678C2.34969 6.43383 2.38739 6.37788 2.43806 6.33531C2.48874 6.29274 2.55035 6.26525 2.61588 6.25599L6.05921 5.75265C6.28605 5.71965 6.50147 5.63203 6.68693 5.49731C6.8724 5.3626 7.02235 5.18483 7.12388 4.97932L8.66321 1.85999Z" fill="#EFB100" stroke="#EFB100" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
                }}
              />
            )}
          </h3>
          <p className="text-[#717182] dark:text-neutral-400 text-sm max-sm:text-xs font-normal leading-5 max-sm:leading-4">
            {company}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          {isAPI && (
            <div className="inline-flex min-w-[60px] flex-row justify-center items-center text-[#030213] dark:text-purple-200 text-center text-xs font-semibold leading-5 h-[20px] gap-1 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-md border border-purple-200 dark:border-purple-700 shadow-sm">
              <div className="flex items-center gap-1">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="api-icon" style="box-sizing: border-box; width: 16px; height: 16px"> <path d="M8.42969 1.33331V14.6666" stroke="#6E11B0" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11.763 3.33331H6.76302C6.14418 3.33331 5.55069 3.57915 5.11311 4.01673C4.67552 4.45432 4.42969 5.04781 4.42969 5.66665C4.42969 6.28548 4.67552 6.87898 5.11311 7.31656C5.55069 7.75415 6.14418 7.99998 6.76302 7.99998H10.0964C10.7152 7.99998 11.3087 8.24581 11.7463 8.6834C12.1839 9.12098 12.4297 9.71447 12.4297 10.3333C12.4297 10.9522 12.1839 11.5456 11.7463 11.9832C11.3087 12.4208 10.7152 12.6666 10.0964 12.6666H4.42969" stroke="#6E11B0" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
                  }}
                />
                <span className="text-[#6E11B0] dark:text-purple-300 text-center text-xs font-semibold leading-4">
                  API
                </span>
              </div>
            </div>
          )}
          {isOpenSource && (
            <div className="inline-flex min-w-[60px] flex-row justify-center items-center text-[#030213] dark:text-green-200 text-center text-xs font-semibold leading-5 h-[20px] gap-1 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-md border border-green-200 dark:border-green-700 shadow-sm">
              <div className="flex items-center gap-1">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="open-source-icon" style="box-sizing: border-box; width: 16px; height: 16px"> <path d="M4.63965 1.99998V9.99998" stroke="#016630" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.6396 5.99998C13.7442 5.99998 14.6396 5.10455 14.6396 3.99998C14.6396 2.89542 13.7442 1.99998 12.6396 1.99998C11.5351 1.99998 10.6396 2.89542 10.6396 3.99998C10.6396 5.10455 11.5351 5.99998 12.6396 5.99998Z" stroke="#016630" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4.63965 14C5.74422 14 6.63965 13.1046 6.63965 12C6.63965 10.8954 5.74422 9.99998 4.63965 9.99998C3.53508 9.99998 2.63965 10.8954 2.63965 12C2.63965 13.1046 3.53508 14 4.63965 14Z" stroke="#016630" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.6396 5.99998C12.6396 7.59128 12.0075 9.11741 10.8823 10.2426C9.75707 11.3678 8.23095 12 6.63965 12" stroke="#016630" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
                  }}
                />
                <span className="text-[#030213] dark:text-green-200 text-center text-sm font-semibold leading-5">
                  Open Source
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="mb-4 max-sm:mb-3">
        <h4 className="text-[#717182] dark:text-neutral-400 text-xs max-sm:text-[10px] font-normal leading-4 max-sm:leading-3 mb-1.5 max-sm:mb-1">
          Overall Score
        </h4>
        <div className="text-neutral-950 dark:text-white text-xl max-sm:text-lg font-bold leading-7 max-sm:leading-6 mb-2 max-sm:mb-1.5">
          {score}
        </div>
        <div className="w-full h-2 bg-[#ECECF0] dark:bg-neutral-800 rounded-full">
          <div
            className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
            style={{ width: `${parseFloat(score)}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 max-sm:space-y-2 mb-4 max-sm:mb-3">
        <div className="flex justify-between items-center">
          <span className="text-[#717182] dark:text-neutral-400 text-xs max-sm:text-[10px] font-normal leading-4 max-sm:leading-3">
            Type
          </span>
          <span className="text-neutral-950 dark:text-white text-sm max-sm:text-xs font-medium max-sm:font-normal leading-5 max-sm:leading-4 capitalize">
            {type}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#717182] dark:text-neutral-400 text-xs max-sm:text-[10px] font-normal leading-4 max-sm:leading-3">
            Released
          </span>
          <span className="text-neutral-950 dark:text-white text-sm max-sm:text-xs font-medium max-sm:font-normal leading-5 max-sm:leading-4">
            {released}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#717182] dark:text-neutral-400 text-xs max-sm:text-[10px] font-normal leading-4 max-sm:leading-3">
            Cost
          </span>
          {isFree ? (
            <div className="flex w-10 h-[21px] justify-center items-center border px-2 py-[2.67px] rounded-lg border-solid border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] bg-white dark:bg-neutral-900">
              <span className="text-[#00A63E] dark:text-green-300 text-center text-xs font-semibold leading-4">
                Free
              </span>
            </div>
          ) : (
            <span className="text-neutral-950 dark:text-white text-sm max-sm:text-xs font-medium max-sm:font-normal leading-5 max-sm:leading-4">
              {cost}
            </span>
          )}
        </div>
      </div>

      <button
        className="flex w-full justify-center items-center gap-2.5 cursor-pointer border bg-white dark:bg-neutral-900 py-2 px-4 rounded-lg border-solid border-[#6931C9] dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
        onClick={() => navigate(`/model/${modelId}`)}
        type="button"
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" class="view-details-icon" style="box-sizing: border-box; width: 16px; height: 16px"> <path d="M10.7998 2.32999H14.7998V6.32999" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7.46631 9.66332L14.7996 2.32999" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.7998 8.99665V12.9967C12.7998 13.3503 12.6593 13.6894 12.4093 13.9395C12.1592 14.1895 11.8201 14.33 11.4665 14.33H4.13314C3.77952 14.33 3.44038 14.1895 3.19033 13.9395C2.94028 13.6894 2.7998 13.3503 2.7998 12.9967V5.66332C2.7998 5.3097 2.94028 4.97056 3.19033 4.72051C3.44038 4.47046 3.77952 4.32999 4.13314 4.32999H8.13314" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
          }}
        />
        <span className="text-neutral-950 dark:text-white text-sm max-sm:text-xs font-semibold max-sm:font-medium">
          View Details
        </span>
      </button>
    </article>
  );
};

// OverallScores component
interface OverallScoresProps {
  models: ModelDetail[];
}

const OverallScores: React.FC<OverallScoresProps> = ({ models }) => {
  if (!models || models.length === 0) return null;

  const chartData = models.map((model) => ({
    name: model.modelName,
    score: model.overallBenchmarkScore || 0,
    organization: model.organization,
  }));

  const COLORS = ["#FFBE0C", "#49FF71", "#FF4C4C", "#8B5CF6"];

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 max-md:p-4 max-sm:p-3 rounded-[14px] border-solid border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] max-md:w-full overflow-x-auto">
      <header className="mb-4 max-sm:mb-3">
        <h3 className="text-neutral-950 dark:text-white text-xl max-md:text-lg max-sm:text-base font-semibold leading-7 max-sm:leading-6 mb-2 max-sm:mb-1">
          Overall Scores
        </h3>
        <p className="text-[#717182] dark:text-neutral-400 text-sm max-sm:text-xs font-normal leading-5 max-sm:leading-4">
          Composite performance rankings
        </p>
      </header>

      <div className="flex flex-wrap gap-2 max-sm:gap-1.5 mb-4 max-sm:mb-3">
        {models.map((model, index) => (
          <div
            key={model._id}
            className="flex items-center gap-2 max-sm:gap-1.5 bg-[#F6F3FF] dark:bg-zinc-800 px-3 max-sm:px-2 py-2 max-sm:py-1.5 rounded-lg"
          >
            <div
              className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs max-sm:text-[10px] font-medium text-neutral-950 dark:text-neutral-100">
              {model.modelName}
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
        className="max-sm:h-[280px]"
      >
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
          className="max-sm:text-xs"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="opacity-30"
            stroke="#CCCCCC"
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fill: "currentColor", fontSize: 10 }}
            className="text-neutral-950 dark:text-white max-sm:text-[8px]"
          />
          <YAxis
            label={{
              value: "Overall Score",
              angle: -90,
              position: "insideLeft",
              style: { fill: "currentColor", fontSize: 12 },
            }}
            tick={{ fill: "currentColor", fontSize: 10 }}
            className="text-neutral-950 dark:text-white max-sm:text-[8px]"
            domain={[0, 100]}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#000" }}
            formatter={(value: number) => [`${value.toFixed(1)}`, "Score"]}
          />
          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div
        className={`mt-4 max-sm:mt-3 grid grid-cols-1 ${
          models.length === 2
            ? "sm:grid-cols-2"
            : models.length === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2 lg:grid-cols-4"
        } gap-3 max-sm:gap-2`}
      >
        {models.map((model, index) => (
          <div
            key={model._id}
            className="p-4 max-sm:p-3 rounded-lg bg-gray-50 dark:bg-neutral-800"
          >
            <div className="flex items-center gap-2 max-sm:gap-1.5 mb-2 max-sm:mb-1.5">
              <div
                className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <h4 className="text-sm max-sm:text-xs font-semibold text-neutral-950 dark:text-white truncate">
                {model.modelName}
              </h4>
            </div>
            <p className="text-xs max-sm:text-[10px] text-gray-600 dark:text-gray-400 mb-1 truncate">
              {model.organization}
            </p>
            <p
              className="text-2xl max-sm:text-xl font-bold"
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {model.overallBenchmarkScore?.toFixed(1) || "N/A"}
            </p>
            <p className="text-xs max-sm:text-[10px] text-gray-500 dark:text-gray-400">
              Overall Score
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// PerformanceRadar component
interface PerformanceRadarProps {
  models: ModelDetail[];
}

const PerformanceRadar: React.FC<PerformanceRadarProps> = ({ models }) => {
  if (!models || models.length === 0) return null;

  // Calculate average scores for radar visualization
  const avgMMLU =
    models.reduce((sum, m) => sum + (m.mmluScore || 0), 0) / models.length;
  const avgHumanEval =
    models.reduce((sum, m) => sum + (m.humanEvalScore || 0), 0) / models.length;
  const avgGSM8K =
    models.reduce((sum, m) => sum + (m.gsm8kScore || 0), 0) / models.length;
  const avgMATH =
    models.reduce((sum, m) => sum + (m.mathScore || 0), 0) / models.length;

  // Calculate radar chart coordinates
  const centerX = 272.17;
  const centerY = 160.67;
  const maxRadius = 114.4;

  const mmluY = centerY - (avgMMLU / 100) * maxRadius;
  const humanEvalX = centerX + (avgHumanEval / 100) * maxRadius;
  const gsm8kY = centerY + (avgGSM8K / 100) * maxRadius;
  const mathX = centerX - (avgMATH / 100) * maxRadius;

  const dataPath = `M${centerX} ${mmluY}L${humanEvalX} ${centerY}L${centerX} ${gsm8kY}L${mathX} ${centerY}Z`;

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 max-md:p-4 max-sm:p-3 rounded-[14px] border-solid border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] max-md:w-full overflow-x-auto">
      <header className="mb-4 max-sm:mb-3">
        <h3 className="text-neutral-950 dark:text-white text-xl max-md:text-lg max-sm:text-base font-semibold leading-7 max-sm:leading-6 mb-2 max-sm:mb-1">
          Performance Radar
        </h3>
        <p className="text-[#717182] dark:text-neutral-400 text-sm max-sm:text-xs font-normal leading-5 max-sm:leading-4">
          Multi-dimensional performance comparison
        </p>
      </header>
      <div className="mb-4 max-sm:mb-3 w-full overflow-x-auto">
        <svg
          width="100%"
          height="320"
          viewBox="0 0 544 321"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="radar-chart max-sm:h-[250px]"
          style={{
            maxWidth: "100%",
            height: "320px",
            marginBottom: "0",
            display: "block",
            background: "transparent",
          }}
        >
          <style>{`
            @media (prefers-color-scheme: dark) {
              .radar-chart .radar-grid { stroke: #444444 !important; stroke-width: 1 !important; }
              .radar-chart .radar-label { fill: #FFFFFF !important; font-weight: 600 !important; }
              .radar-chart .radar-fill { fill: #B18BEF !important; opacity: 0.4 !important; }
              .radar-chart .radar-stroke { stroke: #B18BEF !important; stroke-width: 2 !important; }
              .radar-chart .radar-point { fill: #B18BEF !important; }
              .radar-chart .radar-value { fill: #B18BEF !important; font-weight: 700 !important; }
            }
            .radar-chart .radar-value { fill: #B18BEF; font-weight: 700; }
          `}</style>
          {/* Grid lines - 4 concentric diamonds */}
          <path
            className="radar-grid"
            d="M272.17 132.07L300.77 160.67L272.17 189.27L243.57 160.67L272.17 132.07Z"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 103.47L329.37 160.67L272.17 217.87L214.97 160.67L272.17 103.47Z"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 74.87L357.97 160.67L272.17 246.47L186.37 160.67L272.17 74.87Z"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 46.27L386.57 160.67L272.17 275.07L157.77 160.67L272.17 46.27Z"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>

          {/* Axis lines */}
          <path
            className="radar-grid"
            d="M272.17 160.67V46.27"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 160.67H386.57"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 160.67V275.07"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 160.67H157.77"
            stroke="#DDDDDD"
            strokeWidth="1"
          ></path>

          {/* Labels */}
          <text
            className="radar-label"
            fill="#808080"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="16"
            fontWeight="600"
            letterSpacing="0em"
          >
            <tspan x="247.506" y="37.5882">
              MMLU
            </tspan>
          </text>
          <text
            className="radar-label"
            fill="#808080"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="16"
            fontWeight="600"
            letterSpacing="0em"
          >
            <tspan x="394.57" y="164.248">
              HumanEval
            </tspan>
          </text>
          <text
            className="radar-label"
            fill="#808080"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="16"
            fontWeight="600"
            letterSpacing="0em"
          >
            <tspan x="243.857" y="290.908">
              GSM8K
            </tspan>
          </text>
          <text
            className="radar-label"
            fill="#808080"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="16"
            fontWeight="600"
            letterSpacing="0em"
          >
            <tspan x="66.5513" y="164.248">
              MATH Score
            </tspan>
          </text>

          {/* Data polygon */}
          <path
            className="radar-fill"
            d={dataPath}
            fill="#B18BEF"
            fillOpacity="0.35"
          ></path>
          <path
            className="radar-stroke"
            d={dataPath}
            stroke="#B18BEF"
            strokeWidth="2"
            fill="none"
          ></path>
          {/* Data points with value labels */}
          <circle
            className="radar-point"
            cx={centerX}
            cy={mmluY}
            r="6"
            fill="#B18BEF"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <text
            className="radar-value"
            fontFamily="Inter"
            fontSize="14"
            textAnchor="middle"
          >
            <tspan x={centerX} y={mmluY - 12}>
              {avgMMLU.toFixed(1)}
            </tspan>
          </text>

          <circle
            className="radar-point"
            cx={humanEvalX}
            cy={centerY}
            r="6"
            fill="#B18BEF"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <text
            className="radar-value"
            fontFamily="Inter"
            fontSize="14"
            textAnchor="start"
          >
            <tspan x={humanEvalX + 12} y={centerY + 5}>
              {avgHumanEval.toFixed(1)}
            </tspan>
          </text>

          <circle
            className="radar-point"
            cx={centerX}
            cy={gsm8kY}
            r="6"
            fill="#B18BEF"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <text
            className="radar-value"
            fontFamily="Inter"
            fontSize="14"
            textAnchor="middle"
          >
            <tspan x={centerX} y={gsm8kY + 20}>
              {avgGSM8K.toFixed(1)}
            </tspan>
          </text>

          <circle
            className="radar-point"
            cx={mathX}
            cy={centerY}
            r="6"
            fill="#B18BEF"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <text
            className="radar-value"
            fontFamily="Inter"
            fontSize="14"
            textAnchor="end"
          >
            <tspan x={mathX - 12} y={centerY + 5}>
              {avgMATH.toFixed(1)}
            </tspan>
          </text>
        </svg>
      </div>

      {/* Score breakdown table */}
      <div className="mb-4 max-sm:mb-3 border-t border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] pt-4 max-sm:pt-3">
        <h4 className="text-neutral-950 dark:text-white text-sm max-sm:text-xs font-semibold mb-3 max-sm:mb-2">
          Individual Scores
        </h4>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 max-sm:gap-2">
          {["MMLU", "HumanEval", "GSM8K", "MATH Score"].map((benchmark) => (
            <div key={benchmark} className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-950 dark:text-white text-xs font-semibold">
                  {benchmark}
                </span>
                <span className="text-[#B18BEF] text-xs font-bold">
                  Avg:{" "}
                  {benchmark === "MMLU"
                    ? avgMMLU.toFixed(1)
                    : benchmark === "HumanEval"
                    ? avgHumanEval.toFixed(1)
                    : benchmark === "GSM8K"
                    ? avgGSM8K.toFixed(1)
                    : avgMATH.toFixed(1)}
                </span>
              </div>
              <div className="space-y-1">
                {models.map((model, index) => {
                  const score =
                    benchmark === "MMLU"
                      ? model.mmluScore
                      : benchmark === "HumanEval"
                      ? model.humanEvalScore
                      : benchmark === "GSM8K"
                      ? model.gsm8kScore
                      : model.mathScore;
                  const colors = ["#FFBE0C", "#49FF71", "#FF4C4C", "#8B5CF6"];

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      ></div>
                      <span className="text-neutral-950 dark:text-white text-xs flex-1 truncate">
                        {model.modelName.length > 12
                          ? model.modelName.substring(0, 12) + "..."
                          : model.modelName}
                      </span>
                      <span className="text-neutral-950 dark:text-white text-xs font-semibold">
                        {score ? score.toFixed(1) : "N/A"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-6 max-sm:h-5 items-start gap-2.5 max-sm:gap-1.5 w-full justify-center flex-wrap overflow-x-auto">
        {models.map((model, index) => {
          const colors = ["#FFBE0C", "#49FF71", "#FF4C4C", "#8B5CF6"];
          return (
            <div
              key={index}
              className="flex h-6 max-sm:h-5 justify-center items-end gap-1 max-sm:gap-0.5 text-neutral-950 dark:text-white text-center text-base max-sm:text-xs font-normal leading-6 max-sm:leading-5 px-0 py-[1.33px] whitespace-nowrap"
            >
              <div
                className="w-3.5 h-3.5 max-sm:w-2.5 max-sm:h-2.5 rounded-sm flex-shrink-0"
                style={{
                  backgroundColor: colors[index % colors.length],
                  opacity: 0.8,
                }}
              ></div>
              <span className="text-neutral-950 dark:text-white text-center text-sm max-sm:text-xs font-normal leading-6 max-sm:leading-5">
                {model.modelName}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// DetailedComparison component
interface DetailedComparisonProps {
  models: ModelDetail[];
}

const DetailedComparison: React.FC<DetailedComparisonProps> = ({ models }) => {
  const [activeTab, setActiveTab] = useState<TabType>("performance");

  if (!models || models.length === 0) return null;

  const performanceData = [
    {
      benchmark: "Overall Score",
      values: models.map(
        (m) => `${(m.overallBenchmarkScore || 0).toFixed(1)}%`
      ),
    },
    {
      benchmark: "MMLU",
      values: models.map((m) =>
        m.mmluScore ? `${m.mmluScore.toFixed(1)}%` : "N/A"
      ),
    },
    {
      benchmark: "HumanEval",
      values: models.map((m) =>
        m.humanEvalScore ? `${m.humanEvalScore.toFixed(1)}%` : "N/A"
      ),
    },
    {
      benchmark: "GSM8K",
      values: models.map((m) =>
        m.gsm8kScore ? `${m.gsm8kScore.toFixed(1)}%` : "N/A"
      ),
    },
    {
      benchmark: "MATH",
      values: models.map((m) =>
        m.mathScore ? `${m.mathScore.toFixed(1)}%` : "N/A"
      ),
    },
    {
      benchmark: "CLIP Score",
      values: models.map((m) =>
        m.clipScore ? `${m.clipScore.toFixed(1)}` : "N/A"
      ),
    },
  ];

  const pricingData = [
    {
      feature: "Input Cost",
      values: models.map((m) =>
        m.inputPrice ? `$${m.inputPrice}/1M tokens` : "Free"
      ),
    },
    {
      feature: "Output Cost",
      values: models.map((m) =>
        m.outputPrice ? `$${m.outputPrice}/1M tokens` : "Free"
      ),
    },
    {
      feature: "Context Window",
      values: models.map((m) => m.contextWindow || "N/A"),
    },
    {
      feature: "Max Output Tokens",
      values: models.map((m) => m.maxOutputTokens || "N/A"),
    },
  ];

  const featuresData = [
    {
      feature: "Image Support",
      values: models.map((m) => (m.imageSupport ? "✓" : "✗")),
    },
    {
      feature: "Audio Support",
      values: models.map((m) => (m.audioSupport ? "✓" : "✗")),
    },
    {
      feature: "Video Support",
      values: models.map((m) => (m.videoSupport ? "✓" : "✗")),
    },
    {
      feature: "API Available",
      values: models.map((m) => (m.apiAvailable ? "✓" : "✗")),
    },
    {
      feature: "Open Source",
      values: models.map((m) => (m.openSource ? "✓" : "✗")),
    },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case "performance":
        return performanceData;
      case "pricing":
        return pricingData;
      case "features":
        return featuresData;
      default:
        return performanceData;
    }
  };

  const getColumnHeader = () => {
    switch (activeTab) {
      case "performance":
        return "Benchmark";
      case "pricing":
        return "Feature";
      case "features":
        return "Feature";
      default:
        return "Benchmark";
    }
  };

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 max-md:p-4 max-sm:p-3 rounded-[14px] border-solid border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] max-md:w-full overflow-x-auto">
      <header className="mb-4 max-sm:mb-3">
        <h3 className="text-neutral-950 dark:text-white text-xl max-md:text-lg max-sm:text-base font-semibold leading-7 max-sm:leading-6 mb-2 max-sm:mb-1">
          Detailed Comparison
        </h3>
        <p className="text-[#717182] dark:text-neutral-400 text-sm max-sm:text-xs font-normal leading-5 max-sm:leading-4">
          Side-by-side feature and performance comparison
        </p>
      </header>

      <div className="w-full h-9 max-sm:h-8 bg-[#F6F3FF] dark:bg-neutral-800 mb-6 max-sm:mb-4 rounded-[14px] p-1 flex gap-1">
        <button
          onClick={() => setActiveTab("performance")}
          className={`flex-1 flex justify-center items-center py-1 rounded-lg transition-colors ${
            activeTab === "performance"
              ? "bg-[#6931C9] text-white dark:bg-purple-700 dark:text-white"
              : "bg-transparent text-[#717182] dark:text-neutral-300 hover:text-[#6931C9] dark:hover:text-purple-400"
          }`}
        >
          <span className="text-center text-sm max-sm:text-xs font-semibold leading-5 max-sm:leading-4">
            Performance
          </span>
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`flex-1 flex justify-center items-center py-1 rounded-lg transition-colors ${
            activeTab === "pricing"
              ? "bg-[#6931C9] text-white dark:bg-purple-700 dark:text-white"
              : "bg-transparent text-[#717182] dark:text-neutral-300 hover:text-[#6931C9] dark:hover:text-purple-400"
          }`}
        >
          <span className="text-center text-sm max-sm:text-xs font-semibold leading-5 max-sm:leading-4">
            Pricing
          </span>
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`flex-1 flex justify-center items-center py-1 rounded-lg transition-colors ${
            activeTab === "features"
              ? "bg-[#6931C9] text-white dark:bg-purple-700 dark:text-white"
              : "bg-transparent text-[#717182] dark:text-neutral-300 hover:text-[#6931C9] dark:hover:text-purple-400"
          }`}
        >
          <span className="text-center text-sm max-sm:text-xs font-semibold leading-5 max-sm:leading-4">
            Features
          </span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
              <th className="text-left text-[#717182] dark:text-neutral-400 text-sm font-semibold leading-5 py-3 whitespace-nowrap pr-4">
                {getColumnHeader()}
              </th>
              {models.map((model, index) => (
                <th
                  key={index}
                  className="text-left text-[#717182] dark:text-neutral-400 text-sm font-semibold leading-5 py-3 whitespace-nowrap px-2"
                >
                  <span className="block max-w-[120px] truncate">
                    {model.modelName}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCurrentData().map((row, index) => (
              <tr
                key={index}
                className={`${
                  index < getCurrentData().length - 1
                    ? "border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]"
                    : ""
                } ${index % 2 === 1 ? "bg-[#F6F3FF] dark:bg-neutral-800" : ""}`}
              >
                <td className="text-neutral-950 dark:text-white text-sm font-normal leading-5 py-3 whitespace-nowrap pr-4">
                  {"benchmark" in row ? row.benchmark : row.feature}
                </td>
                {row.values.map((value, idx) => (
                  <td
                    key={idx}
                    className="text-neutral-950 dark:text-white text-sm font-normal leading-5 py-3 whitespace-nowrap px-2"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden w-full space-y-3">
        {getCurrentData().map((row, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]"
          >
            <h4 className="text-sm font-semibold text-neutral-950 dark:text-white mb-3">
              {"benchmark" in row ? row.benchmark : row.feature}
            </h4>
            <div className="space-y-2">
              {models.map((model, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] last:border-b-0"
                >
                  <span className="text-xs text-[#717182] dark:text-neutral-400 truncate max-w-[50%]">
                    {model.modelName}
                  </span>
                  <span className="text-sm font-medium text-neutral-950 dark:text-white">
                    {row.values[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Main page component
const ModelComparisonPage = () => {
  const navigate = useNavigate();
  const { compareModels } = useCompare();
  const [detailedModels, setDetailedModels] = useState<ModelDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch detailed model data
  useEffect(() => {
    const fetchModelDetails = async () => {
      if (compareModels.length === 0) {
        navigate("/leaderboard");
        return;
      }

      try {
        setLoading(true);
        const response = await api.getAllModels();
        if (response.success) {
          // Filter to get only the selected models with full details
          const modelIds = compareModels.map((m) => m.id);
          const fullModels = response.data.filter((model: ModelDetail) =>
            modelIds.includes(model._id)
          );
          setDetailedModels(fullModels);
        }
      } catch (error) {
        console.error("Failed to fetch model details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelDetails();
  }, [compareModels, navigate]);

  // If no models to compare, redirect to leaderboard
  if (compareModels.length === 0) {
    navigate("/leaderboard");
    return null;
  }

  if (loading) {
    return (
      <div className="box-border min-h-screen bg-white dark:bg-black">
        <Navigation />
        <main className="box-border flex w-full flex-col justify-center items-center min-h-[calc(100vh_-_65px)] bg-[#F6F3FF] dark:bg-neutral-950">
          <p className="text-neutral-950 dark:text-white text-lg">
            Loading comparison data...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="box-border min-h-screen bg-white dark:bg-black">
      <div className="box-border flex w-full min-h-screen flex-col justify-center items-start bg-white dark:bg-black">
        <div className="box-border flex w-full flex-col justify-start items-start bg-white dark:bg-black">
          <Navigation />
          <main className="box-border flex w-full flex-col justify-center items-center min-h-[calc(100vh_-_65px_-_309px)] bg-[#F6F3FF] dark:bg-neutral-950 px-8 py-8 pt-24 max-md:px-4 max-md:py-8 max-sm:px-2 max-sm:py-4">
            <div className="box-border w-full max-w-screen-xl relative">
              {/* Back Button */}
              <button
                className="flex items-center gap-2 text-sm text-neutral-950 dark:text-white font-semibold text-center leading-none px-3 py-2 rounded-lg transition-all duration-200 w-fit group focus:outline-none mb-4
                  hover:bg-[rgba(177,139,239,0.15)] hover:shadow-[0_2px_8px_0_rgba(177,139,239,0.15)]
                  dark:hover:bg-[rgba(177,139,239,0.25)] dark:hover:shadow-[0_2px_8px_0_rgba(177,139,239,0.25)]"
                onClick={() => navigate(-1)}
                type="button"
              >
                <span
                  className="flex items-center transition-transform duration-200 group-hover:-translate-x-1"
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      d="M11.25 15L5.25 9L11.25 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-950 dark:text-white"
                    />
                  </svg>
                </span>
                <span className="transition-colors duration-200 group-hover:underline">
                  Back
                </span>
              </button>

              {/* Page Header */}
              <header className="mb-6 max-md:mb-4">
                <h1 className="text-neutral-950 dark:text-white text-4xl max-md:text-3xl max-sm:text-2xl font-bold leading-10 max-sm:leading-8 mb-2">
                  Model Comparison
                </h1>
                <p className="text-[#717182] dark:text-neutral-400 text-lg max-md:text-base max-sm:text-sm font-normal leading-7 max-sm:leading-6">
                  Side-by-side comparison of {compareModels.length} AI models
                </p>
              </header>

              {/* Model Tags */}
              <div className="flex flex-wrap gap-2 mb-6 max-md:mb-4 max-sm:gap-1.5">
                {compareModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex flex-col justify-center items-center h-[25px] max-sm:h-[22px] text-[#030213] dark:text-white text-center text-sm max-sm:text-xs font-semibold leading-5 max-sm:leading-4 bg-[#ECEEF2] dark:bg-neutral-800 px-2 max-sm:px-1.5 py-[3.33px] rounded-lg"
                  >
                    {model.model}
                  </div>
                ))}
              </div>

              {/* Model Cards Grid */}
              <section
                className={`grid grid-cols-1 ${
                  compareModels.length === 2
                    ? "sm:grid-cols-2"
                    : compareModels.length === 3
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-4"
                } gap-4 max-md:gap-3 mb-8 max-md:mb-6`}
              >
                {compareModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    modelId={model.id}
                    name={model.model}
                    company={model.organization}
                    score={model.score.toString()}
                    type={model.type}
                    released={model.released}
                    cost={model.cost}
                    isStarred={model.rank === 1}
                    isAPI={model.license !== "Open Source"}
                    isOpenSource={model.license === "Open Source"}
                    isFree={model.cost.toLowerCase().includes("free")}
                  />
                ))}
              </section>

              {/* Charts Grid */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-md:gap-3 mb-8 max-md:mb-6">
                <PerformanceRadar models={detailedModels} />
                <OverallScores models={detailedModels} />
              </section>

              {/* Detailed Comparison */}
              <section className="mb-8 max-md:mb-6">
                <DetailedComparison models={detailedModels} />
              </section>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ModelComparisonPage;
//external
