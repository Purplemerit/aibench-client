// Only keep one import for React and Navigation/Footer
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

// Model interface
interface Model {
  id?: string;
  modelName?: string;
  organization?: string;
  releaseDate?: string;
  parameters?: string;
  modelType?: string;
  openSource?: string;
  license?: string;
  contextWindow?: string;
  maxOutputTokens?: string;
  aPiAvailable?: string;
  inputPricePerM1Tokens?: string;
  outputPricePerM1Tokens?: string;
  mMlUScore?: string;
  humanEvalScore?: string;
  gSm8KScore?: string;
  mAthScore?: string;
  codingLanguages?: string;
  naturalLanguages?: string;
  trainingDataCutoff?: string;
  specialFeatures?: string;
  truthfulQaScore?: string;
  aRcScore?: string;
  hellaSwagScore?: string;
  winograndeScore?: string;
  bBhScore?: string;
  imageSupport?: string;
  audioSupport?: string;
  videoSupport?: string;
  biasScore?: string;
  toxicityScore?: string;
  factualityScore?: string;
  latencyMs?: string;
  throughputTokensSec?: string;
  gPuRequirements?: string;
  memoryFootprintGb?: string;
  recommendedVramGb?: string;
  trainingDatasetSize?: string;
  fIdScore?: string;
  cLipScore?: string;
  mOsScore?: string;
  overallBenchmarkScore?: number;
  globalRankScore?: number;
  qualityRating?: string;
  speedRating?: string;
  priceRating?: string;
  deploymentComplexity?: string;
  recommendedUseCases?: string;
  trainingDatasetNames?: string;
  modelSizeOnDisk?: string;
  ecosystemSupport?: string;
  llMRankScore?: number;
  benchmarkEvalDate?: string;
  aPiEndpoint?: string;
  langChainSupport?: string;
  llamaIndexSupport?: string;
  safetyCertifications?: string;
  modelTier?: string;
  [key: string]: string | number | undefined;
}

// Inline ModelHeader
interface ModelHeaderProps {
  model: Model;
}

const ModelHeader: React.FC<ModelHeaderProps> = ({ model }) => {
  const navigate = useNavigate();

  if (!model) return null;

  return (
    <section className="flex flex-col items-stretch max-md:max-w-full dark:bg-neutral-900 mt-20">
      <button
        className="flex items-center gap-2 text-sm text-neutral-950 dark:text-white font-semibold text-center leading-none ml-0 px-3 py-2 rounded-lg transition-all duration-200 w-fit group focus:outline-none
          hover:bg-[rgba(177,139,239,0.15)] hover:shadow-[0_2px_8px_0_rgba(177,139,239,0.15)]
          dark:hover:bg-[rgba(177,139,239,0.25)] dark:hover:shadow-[0_2px_8px_0_rgba(177,139,239,0.25)]"
        onClick={() => navigate(-1)}
        type="button"
      >
        <span
          className="flex items-center transition-transform duration-200 group-hover:-translate-x-1"
          aria-hidden="true"
        >
          {/* Arrow SVG with color adaptation */}
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
      <div className="flex w-full items-stretch gap-5 flex-wrap justify-between mt-[34px] max-md:max-w-full">
        <div className="flex flex-col items-stretch whitespace-nowrap">
          <h1 className="text-neutral-950 dark:text-white text-3xl font-semibold leading-[1.2]">
            {model.modelName}
          </h1>
          <div className="flex items-stretch gap-[17px] mt-2">
            <div className="text-[rgba(113,113,130,1)] dark:text-white text-base font-normal grow">
              {model.organization}
            </div>
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/c7a1c35dc36315f508a4b2a4810cd39fbc514b3f?placeholderIfAbsent=true"
              alt={`${model.organization} Logo`}
              className="aspect-[2.67] object-contain w-14 shrink-0 rounded-lg"
            />
            <div className="border flex flex-col overflow-hidden items-stretch text-xs text-neutral-950 dark:text-white font-semibold text-center leading-none justify-center px-2.5 py-[5px] rounded-lg border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid">
              <div>{model.openSource === "Yes" ? "Open Source" : "Paid"}</div>
            </div>
            <div className="border flex flex-col overflow-hidden items-stretch text-xs text-neutral-950 dark:text-white font-semibold text-center leading-none justify-center px-2.5 py-[5px] rounded-lg border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid">
              <div>{model.modelType || "Text"}</div>
            </div>
          </div>
        </div>
        <div className="flex items-stretch gap-3 text-sm font-semibold text-center leading-none my-auto">
          <button className="bg-white dark:bg-neutral-900 border flex items-stretch gap-4 text-neutral-950 dark:text-white px-[13px] py-2.5 rounded-lg border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid hover:bg-gray-50 transition-colors">
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/e11eb3dd84d6396ef367ed03e41bf1618201bca2?placeholderIfAbsent=true"
              alt="Documentation icon"
              className="aspect-[1] object-contain w-4 shrink-0"
            />
            <div className="my-auto">Official Docs</div>
          </button>
          <button className="flex flex-col items-stretch justify-center px-4 py-[11px] rounded-lg bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] hover:opacity-90 transition-all duration-200 text-white font-semibold">
            <div>Add to Compare</div>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 border flex flex-col text-lg text-neutral-950 dark:text-white font-normal leading-loose justify-center mt-[34px] px-[25px] py-[30px] rounded-[14px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:max-w-full max-md:px-5">
        <div className="max-md:max-w-full">
          {model.specialFeatures ||
            model.modelType ||
            "Advanced AI model with cutting-edge capabilities"}
        </div>
      </div>
    </section>
  );
};

// PerformanceRadar (from modelComparison.tsx)
interface PerformanceRadarProps {
  model: Model;
}

const PerformanceRadar: React.FC<PerformanceRadarProps> = ({ model }) => {
  if (!model) return null;

  // Calculate normalized scores (0-100 scale)
  const mmluScore = parseFloat(model.mMlUScore || "0");
  const humanEvalScore = parseFloat(model.humanEvalScore || "0");
  const gsm8kScore = parseFloat(model.gSm8KScore || "0");
  const mathScore = parseFloat(model.mAthScore || "0");

  // For radar chart positioning (the scores need to be converted to coordinates)
  // Center point is at (272.17, 160.67)
  // Max distance from center is ~114.4 (to reach the outer edge)
  const centerX = 272.17;
  const centerY = 160.67;
  const maxRadius = 114.4;

  // Calculate positions for 4 axes (MMLU: top, HumanEval: right, GSM8K: bottom, MATH/CLIP: left)
  const mmluY = centerY - (mmluScore / 100) * maxRadius;
  const humanEvalX = centerX + (humanEvalScore / 100) * maxRadius;
  const gsm8kY = centerY + (gsm8kScore / 100) * maxRadius;
  const mathX = centerX - (mathScore / 100) * maxRadius;

  // Create path for the data polygon
  const dataPath = `M${centerX} ${mmluY}L${humanEvalX} ${centerY}L${centerX} ${gsm8kY}L${mathX} ${centerY}Z`;

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] dark:border-[rgba(255,255,255,0.10)] max-md:w-full max-sm:p-4 overflow-x-auto">
      <header className="mb-6">
        <h3 className="text-neutral-950 dark:text-white text-xl font-semibold leading-7 mb-2">
          Performance Radar
        </h3>
        <p className="text-[#717182] dark:text-neutral-400 text-sm font-normal leading-5">
          Multi-dimensional performance comparison
        </p>
      </header>
      <div className="mb-6 w-full overflow-x-auto">
        <svg
          width="100%"
          height="320"
          viewBox="0 0 544 321"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="radar-chart"
          style={{
            maxWidth: "100%",
            height: "320px",
            marginBottom: "24px",
            display: "block",
            background: "transparent",
          }}
        >
          <style>{`
            @media (prefers-color-scheme: dark) {
              .radar-chart .radar-grid { stroke: #444444 !important; stroke-width: 1.5 !important; }
              .radar-chart .radar-label { fill: #FFFFFF !important; font-weight: 600 !important; }
              .radar-chart .radar-fill { fill: #B18BEF !important; opacity: 0.4 !important; }
              .radar-chart .radar-stroke { stroke: #B18BEF !important; stroke-width: 3 !important; }
              .radar-chart .radar-point { fill: #B18BEF !important; }
            }
          `}</style>
          {/* Grid lines - 4 concentric diamonds */}
          <path
            className="radar-grid"
            d="M272.17 132.07L300.77 160.67L272.17 189.27L243.57 160.67L272.17 132.07Z"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 103.47L329.37 160.67L272.17 217.87L214.97 160.67L272.17 103.47Z"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 74.87L357.97 160.67L272.17 246.47L186.37 160.67L272.17 74.87Z"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 46.27L386.57 160.67L272.17 275.07L157.77 160.67L272.17 46.27Z"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>

          {/* Axis lines */}
          <path
            className="radar-grid"
            d="M272.17 160.67V46.27"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 160.67H386.57"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 160.67V275.07"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>
          <path
            className="radar-grid"
            d="M272.17 160.67H157.77"
            stroke="#DDDDDD"
            strokeWidth="1.5"
          ></path>

          {/* Labels */}
          <text
            className="radar-label"
            fill="#808080"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="16"
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
            strokeWidth="3"
            fill="none"
          ></path>
          {/* Data points for better visibility */}
          <circle
            className="radar-point"
            cx={centerX}
            cy={mmluY}
            r="5"
            fill="#B18BEF"
          />
          <circle
            className="radar-point"
            cx={humanEvalX}
            cy={centerY}
            r="5"
            fill="#B18BEF"
          />
          <circle
            className="radar-point"
            cx={centerX}
            cy={gsm8kY}
            r="5"
            fill="#B18BEF"
          />
          <circle
            className="radar-point"
            cx={mathX}
            cy={centerY}
            r="5"
            fill="#B18BEF"
          />
        </svg>
      </div>
      <div className="flex h-6 items-start gap-2.5 w-full justify-center flex-wrap overflow-x-auto">
        <div className="flex h-6 justify-center items-end gap-1 text-neutral-950 dark:text-white text-center text-base font-normal leading-6 px-0 py-[1.33px] whitespace-nowrap">
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#B18BEF",
              opacity: "0.8",
            }}
          ></div>
          <span className="text-neutral-950 dark:text-white text-center text-base font-normal leading-6">
            {model.modelName}
          </span>
        </div>
      </div>
    </section>
  );
};

// Inline PerformanceOverview
interface PerformanceOverviewProps {
  model: Model;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ model }) => {
  return (
    <section className="bg-white dark:bg-neutral-900 border pt-7 pb-[40px] px-[25px] rounded-[14px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:max-w-full max-md:pb-[40px] max-md:px-5">
      <h2 className="text-neutral-950 dark:text-white font-semibold leading-none">
        Performance Overview
      </h2>
      <p className="text-[rgba(113,113,130,1)] dark:text-white mt-3.5 mb-6">
        Benchmark scores across different evaluation metrics
      </p>
      <PerformanceRadar model={model} />
    </section>
  );
};

// Inline BenchmarkTable
interface BenchmarkData {
  name: string;
  score: string;
  description: string;
}

interface BenchmarkTableProps {
  model: Model;
}

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ model }) => {
  if (!model) return null;

  const benchmarkData: BenchmarkData[] = [
    {
      name: "MMLU",
      score: model.mMlUScore ? `${model.mMlUScore}%` : "N/A",
      description: "Massive Multitask Language Understanding",
    },
    {
      name: "HumanEval",
      score: model.humanEvalScore ? `${model.humanEvalScore}%` : "N/A",
      description: "Code generation capabilities",
    },
    {
      name: "GSM8K",
      score: model.gSm8KScore ? `${model.gSm8KScore}%` : "N/A",
      description: "Grade school mathematics",
    },
    {
      name: "MATH",
      score: model.mAthScore ? `${model.mAthScore}%` : "N/A",
      description: "Advanced mathematics problems",
    },
    {
      name: "ARC",
      score: model.aRcScore ? `${model.aRcScore}%` : "N/A",
      description: "AI2 Reasoning Challenge",
    },
    {
      name: "HellaSwag",
      score: model.hellaSwagScore ? `${model.hellaSwagScore}%` : "N/A",
      description: "Commonsense reasoning",
    },
  ].filter((b) => b.score !== "N/A");

  return (
    <section className="bg-white dark:bg-neutral-900 border flex w-full flex-col items-stretch text-sm font-normal mt-8 px-[25px] py-8 rounded-[14px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:max-w-full max-md:px-5">
      <h2 className="text-neutral-950 dark:text-white text-base font-semibold leading-none">
        Detailed Benchmarks
      </h2>
      <p className="text-[rgba(113,113,130,1)] dark:text-white text-base mt-3.5">
        Individual benchmark scores and explanations
      </p>

      <div className="overflow-x-auto">
        <table className="w-full mt-[25px]">
          <thead>
            <tr className="flex items-stretch gap-[40px_58px] text-neutral-950 dark:text-white font-semibold whitespace-nowrap leading-none px-2 py-[13px] max-md:max-w-full">
              <th className="text-left">Benchmark</th>
              <th className="text-left">Score</th>
              <th className="text-left grow shrink w-[480px] max-md:max-w-full">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {benchmarkData.map((benchmark) => (
              <tr
                key={benchmark.name}
                className="flex w-full items-stretch gap-[40px_100px] leading-none flex-wrap pl-2 pr-20 py-3 max-md:max-w-full max-md:pr-5"
              >
                <td className="text-neutral-950 dark:text-white">
                  {benchmark.name}
                </td>
                <td className="flex items-stretch gap-[40px_56px]">
                  <div className="text-neutral-950 dark:text-white">
                    {benchmark.score}
                  </div>
                  <div className="text-[rgba(113,113,130,1)] dark:text-white basis-auto grow shrink">
                    {benchmark.description}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// Inline ModelInfo
interface ModelInfoProps {
  model: Model;
}

const ModelInfo: React.FC<ModelInfoProps> = ({ model }) => {
  if (!model) return null;

  const overallScore =
    model.overallBenchmarkScore || model.globalRankScore || 0;

  return (
    <section className="bg-white dark:bg-neutral-900 border flex w-full flex-col px-[25px] py-[29px] rounded-[14px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:px-5">
      <h2 className="text-neutral-950 dark:text-white text-base font-semibold leading-none">
        Model Information
      </h2>

      <div className="mt-[39px]">
        <h3 className="text-neutral-950 dark:text-white text-sm font-semibold leading-none">
          Released
        </h3>
        <p className="text-neutral-950 dark:text-white text-base font-normal mt-[13px]">
          {model.releaseDate
            ? new Date(model.releaseDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"}
        </p>
      </div>

      <div className="mt-[26px]">
        <h3 className="text-neutral-950 dark:text-white text-sm font-semibold leading-none">
          Type
        </h3>
        <p className="text-neutral-950 dark:text-white text-base font-normal mt-2.5">
          {model.modelType || "N/A"}
        </p>
      </div>

      {model.parameters && (
        <div className="mt-[26px]">
          <h3 className="text-neutral-950 dark:text-white text-sm font-semibold leading-none">
            Parameters
          </h3>
          <p className="text-neutral-950 dark:text-white text-base font-normal mt-2.5">
            {model.parameters}
          </p>
        </div>
      )}

      <div className="mt-[26px]">
        <h3 className="text-neutral-950 dark:text-white text-sm font-semibold leading-none">
          Overall Score
        </h3>
        <div className="self-stretch flex items-stretch gap-[11px] mt-[15px]">
          <div className="text-neutral-950 dark:text-white text-2xl font-normal leading-none grow">
            {overallScore.toFixed(1)}
          </div>
          <div className="bg-[rgba(236,236,240,1)] dark:bg-neutral-900 grow shrink-0 basis-0 w-fit my-auto rounded-[22369600px] h-2">
            <div
              className="bg-[rgba(3,2,19,1)] dark:bg-white flex shrink-0 h-2 rounded-[22369600px]"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Inline PricingCard
interface PricingCardProps {
  model: Model;
}

const PricingCard: React.FC<PricingCardProps> = ({ model }) => {
  if (!model) return null;

  const inputPrice = model.inputPricePerM1Tokens;
  const outputPrice = model.outputPricePerM1Tokens;
  const isFree =
    model.openSource === "Yes" || inputPrice === "Free (self-hosted)";

  return (
    <section className="bg-white dark:bg-neutral-900 border flex w-full flex-col items-stretch font-semibold mt-6 px-[25px] py-[27px] rounded-[14px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:px-5">
      <h2 className="text-neutral-950 dark:text-white text-base leading-none">
        Pricing
      </h2>
      <p className="text-[rgba(113,113,130,1)] dark:text-white text-base font-normal mt-2.5">
        {isFree
          ? "Open source - Self-hosted"
          : "Cost information for API usage"}
      </p>

      <div className="flex items-stretch gap-4 font-normal text-center mt-[25px]">
        <div className="border flex flex-col items-stretch flex-1 pt-6 pb-[37px] px-[18px] rounded-[10px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid">
          <div className="text-neutral-950 dark:text-white text-2xl leading-none self-center">
            {isFree ? "Free" : inputPrice || "N/A"}
          </div>
          <div className="text-[rgba(113,113,130,1)] dark:text-white text-sm leading-none mt-[9px]">
            {isFree ? "Self-hosted" : "per 1M input tokens"}
          </div>
        </div>
        <div className="border flex flex-col items-center flex-1 px-8 py-[23px] rounded-[10px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:px-5">
          <div className="text-neutral-950 dark:text-white text-2xl leading-none">
            {isFree ? "Free" : outputPrice || "N/A"}
          </div>
          <div className="text-[rgba(113,113,130,1)] dark:text-white text-sm leading-5 mt-[9px]">
            {isFree ? "Self-hosted" : "per 1M output tokens"}
          </div>
        </div>
      </div>

      {model.license && (
        <div className="mt-4 text-center">
          <p className="text-[rgba(113,113,130,1)] dark:text-white text-sm">
            License: <span className="font-semibold">{model.license}</span>
          </p>
        </div>
      )}
    </section>
  );
};

// Inline CapabilitiesSection
interface CapabilitiesSectionProps {
  model: Model;
}

const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ model }) => {
  if (!model) return null;

  const capabilities: string[] = [];

  // Add capabilities based on model data
  if (model.imageSupport === "Yes") capabilities.push("Vision");
  if (model.audioSupport === "Yes") capabilities.push("Audio");
  if (model.videoSupport === "Yes") capabilities.push("Video");
  if (model.humanEvalScore && parseFloat(model.humanEvalScore) > 50)
    capabilities.push("Code Generation");
  if (model.gSm8KScore && parseFloat(model.gSm8KScore) > 50)
    capabilities.push("Mathematics");
  if (model.mMlUScore && parseFloat(model.mMlUScore) > 50)
    capabilities.push("General Knowledge");
  if (model.modelType?.toLowerCase().includes("reasoning"))
    capabilities.push("Deep Reasoning");
  if (model.specialFeatures?.toLowerCase().includes("rag"))
    capabilities.push("RAG Optimized");
  if (model.naturalLanguages?.includes("Multilingual"))
    capabilities.push("Multilingual");

  if (capabilities.length === 0) {
    capabilities.push("Text Generation", "General Purpose");
  }

  return (
    <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 mt-6">
      <h2 className="text-lg font-normal text-neutral-900 dark:text-white mb-6">
        Capabilities
      </h2>

      <div className="flex flex-wrap gap-3">
        {capabilities.map((capability, index) => (
          <div
            key={index}
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3 bg-white dark:bg-neutral-800 text-center"
          >
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {capability}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

// Main page component
const Index = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModel = async () => {
      if (!id) {
        navigate("/leaderboard");
        return;
      }

      try {
        setLoading(true);
        const response = await api.getModelById(id);
        if (response.success && response.data) {
          setModel(response.data);
        } else {
          navigate("/leaderboard");
        }
      } catch (error) {
        console.error("Error fetching model:", error);
        navigate("/leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-neutral-950 dark:text-white text-xl">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!model) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-900 w-full max-md:max-w-full">
        <div className="bg-white dark:bg-neutral-900 w-full max-md:max-w-full">
          <Navigation />

          <main className="bg-[rgba(246,243,255,1)] dark:bg-neutral-900 flex w-full flex-col items-stretch justify-center px-20 py-[37px] max-md:max-w-full max-md:px-5">
            <div className="flex flex-col items-stretch max-md:max-w-full">
              <ModelHeader model={model} />

              <div className="mt-8 max-md:max-w-full">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                  <div className="w-[68%] max-md:w-full max-md:ml-0">
                    <div className="w-full max-md:max-w-full max-md:mt-8">
                      <PerformanceOverview model={model} />
                      <BenchmarkTable model={model} />
                    </div>
                  </div>
                  <div className="w-[32%] ml-5 max-md:w-full max-md:ml-0">
                    <div className="w-full max-md:mt-8">
                      <ModelInfo model={model} />
                      <PricingCard model={model} />
                      <CapabilitiesSection model={model} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Dynamic Capabilities Graph - full width below cards */}
              <section className="bg-white dark:bg-neutral-900 border flex flex-col text-base mt-8 px-[25px] py-[26px] rounded-[14px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:max-w-full max-md:px-5">
                <h2 className="text-neutral-950 dark:text-white font-semibold leading-none">
                  Performance Metrics
                </h2>
                <p className="text-[rgba(113,113,130,1)] dark:text-white font-normal mt-[11px] mb-6">
                  Key performance indicators and quality scores
                </p>

                {/* Box Plot Chart - Single Graph with All Metrics */}
                <div className="border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] rounded-xl p-6 bg-white dark:bg-neutral-900">
                  {(() => {
                    // Prepare data for all available metrics
                    const metrics = [];

                    if (model.biasScore) {
                      metrics.push({
                        name: "Bias",
                        value: parseFloat(model.biasScore),
                        min: 50,
                        q1: 60,
                        median: 70,
                        q3: 80,
                        max: 90,
                        color: "#10B981", // green
                        bgColor: "from-green-500 to-emerald-500",
                      });
                    }

                    if (model.toxicityScore) {
                      metrics.push({
                        name: "Toxicity",
                        value: parseFloat(model.toxicityScore),
                        min: 70,
                        q1: 80,
                        median: 85,
                        q3: 92,
                        max: 98,
                        color: "#F59E0B", // orange
                        bgColor: "from-yellow-500 to-orange-500",
                      });
                    }

                    if (model.factualityScore) {
                      metrics.push({
                        name: "Factuality",
                        value: parseFloat(model.factualityScore),
                        min: 60,
                        q1: 75,
                        median: 82,
                        q3: 90,
                        max: 97,
                        color: "#3B82F6", // blue
                        bgColor: "from-blue-500 to-indigo-500",
                      });
                    }

                    if (model.truthfulQaScore) {
                      metrics.push({
                        name: "TruthfulQA",
                        value: parseFloat(model.truthfulQaScore),
                        min: 55,
                        q1: 68,
                        median: 75,
                        q3: 85,
                        max: 95,
                        color: "#A855F7", // purple
                        bgColor: "from-purple-500 to-pink-500",
                      });
                    }

                    if (metrics.length === 0) return null;

                    const chartHeight = 400;
                    const chartWidth = 100; // percentage
                    const boxWidth = 60; // pixels
                    const spacing = 100 / (metrics.length + 1); // percentage

                    return (
                      <>
                        <div className="mb-6">
                          <h3 className="text-neutral-950 dark:text-white text-lg font-semibold mb-1">
                            Performance Distribution
                          </h3>
                          <p className="text-[rgba(113,113,130,1)] dark:text-neutral-400 text-sm">
                            Box plot showing score distribution with quartiles
                            and current values
                          </p>
                        </div>

                        <div
                          className="relative"
                          style={{ height: `${chartHeight}px` }}
                        >
                          {/* Y-axis labels */}
                          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-[rgba(113,113,130,1)] dark:text-neutral-400 pr-2">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                          </div>

                          {/* Chart area */}
                          <div className="ml-12 h-full relative border-l-2 border-b-2 border-gray-300 dark:border-neutral-600">
                            {/* Horizontal grid lines */}
                            {[0, 25, 50, 75, 100].map((value) => (
                              <div
                                key={value}
                                className="absolute w-full border-t border-gray-200 dark:border-neutral-700"
                                style={{ bottom: `${value}%` }}
                              />
                            ))}

                            {/* Box plots for each metric */}
                            {metrics.map((metric, index) => {
                              const xPosition = spacing * (index + 1);
                              return (
                                <div
                                  key={metric.name}
                                  className="absolute"
                                  style={{
                                    left: `${xPosition}%`,
                                    transform: "translateX(-50%)",
                                    bottom: 0,
                                    height: "100%",
                                    width: `${boxWidth}px`,
                                  }}
                                >
                                  {/* Whisker line (min to max) */}
                                  <div
                                    className="absolute left-1/2 transform -translate-x-1/2 bg-gray-400 dark:bg-neutral-500"
                                    style={{
                                      width: "2px",
                                      bottom: `${metric.min}%`,
                                      height: `${metric.max - metric.min}%`,
                                    }}
                                  />

                                  {/* Upper whisker cap */}
                                  <div
                                    className="absolute left-1/4 right-1/4 bg-gray-400 dark:bg-neutral-500"
                                    style={{
                                      bottom: `${metric.max}%`,
                                      height: "2px",
                                    }}
                                  />

                                  {/* Lower whisker cap */}
                                  <div
                                    className="absolute left-1/4 right-1/4 bg-gray-400 dark:bg-neutral-500"
                                    style={{
                                      bottom: `${metric.min}%`,
                                      height: "2px",
                                    }}
                                  />

                                  {/* Box (Q1 to Q3) */}
                                  <div
                                    className={`absolute left-0 right-0 bg-gradient-to-t ${metric.bgColor} opacity-70 border-2 rounded`}
                                    style={{
                                      bottom: `${metric.q1}%`,
                                      height: `${metric.q3 - metric.q1}%`,
                                      borderColor: metric.color,
                                    }}
                                  />

                                  {/* Median line */}
                                  <div
                                    className="absolute left-0 right-0 bg-gray-900 dark:bg-white"
                                    style={{
                                      bottom: `${metric.median}%`,
                                      height: "3px",
                                      zIndex: 10,
                                    }}
                                  />

                                  {/* Current value dot */}
                                  <div
                                    className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-white dark:border-neutral-900 shadow-lg z-20"
                                    style={{
                                      bottom: `${metric.value}%`,
                                      width: "14px",
                                      height: "14px",
                                      backgroundColor: metric.color,
                                    }}
                                  />

                                  {/* Value label */}
                                  <div
                                    className="absolute left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-950 dark:text-white bg-white dark:bg-neutral-800 px-2 py-1 rounded shadow-md z-20"
                                    style={{
                                      bottom: `${metric.value + 5}%`,
                                    }}
                                  >
                                    {metric.value.toFixed(1)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* X-axis labels */}
                          <div className="ml-12 mt-2 relative">
                            <div className="flex justify-around text-center">
                              {metrics.map((metric) => (
                                <div
                                  key={metric.name}
                                  className="flex flex-col items-center"
                                >
                                  <div
                                    className="w-4 h-4 rounded mb-1"
                                    style={{ backgroundColor: metric.color }}
                                  />
                                  <span className="text-sm font-semibold text-neutral-950 dark:text-white">
                                    {metric.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 pt-4 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)]">
                          <div className="flex flex-wrap gap-4 text-xs text-[rgba(113,113,130,1)] dark:text-neutral-400">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gray-400" />
                              <span>Min/Max (whiskers)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-70 border border-blue-500 rounded" />
                              <span>Q1-Q3 (box)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-0.5 bg-gray-900 dark:bg-white" />
                              <span>Median</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                              <span>Current Score</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Additional Scores if available */}
                {(model.fIdScore || model.cLipScore || model.mOsScore) && (
                  <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)]">
                    <h3 className="text-neutral-950 dark:text-white font-semibold text-sm mb-4">
                      Multimodal Scores
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {model.fIdScore && (
                        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                          <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                            {model.fIdScore}
                          </span>
                          <span className="text-sm text-[rgba(113,113,130,1)] dark:text-neutral-400 mt-1">
                            FID Score
                          </span>
                          <span className="text-xs text-[rgba(113,113,130,1)] dark:text-neutral-400 text-center mt-1">
                            Image quality
                          </span>
                        </div>
                      )}
                      {model.cLipScore && (
                        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                          <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                            {model.cLipScore}
                          </span>
                          <span className="text-sm text-[rgba(113,113,130,1)] dark:text-neutral-400 mt-1">
                            CLIP Score
                          </span>
                          <span className="text-xs text-[rgba(113,113,130,1)] dark:text-neutral-400 text-center mt-1">
                            Image-text alignment
                          </span>
                        </div>
                      )}
                      {model.mOsScore && (
                        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                          <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                            {model.mOsScore}
                          </span>
                          <span className="text-sm text-[rgba(113,113,130,1)] dark:text-neutral-400 mt-1">
                            MOS Score
                          </span>
                          <span className="text-xs text-[rgba(113,113,130,1)] dark:text-neutral-400 text-center mt-1">
                            Audio quality
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Technical Specifications */}
              <section className="bg-white dark:bg-neutral-900 border flex flex-col text-base mt-8 px-[25px] py-[26px] rounded-[14px] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)] border-solid max-md:max-w-full max-md:px-5">
                <h2 className="text-neutral-950 dark:text-white font-semibold leading-none">
                  Technical Specifications
                </h2>
                <p className="text-[rgba(113,113,130,1)] dark:text-white font-normal mt-[11px] mb-6">
                  Deployment requirements and performance characteristics
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {model.contextWindow && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Context Window
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.contextWindow}
                      </span>
                    </div>
                  )}

                  {model.maxOutputTokens && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Max Output Tokens
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.maxOutputTokens}
                      </span>
                    </div>
                  )}

                  {model.latencyMs && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Latency
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.latencyMs} ms
                      </span>
                    </div>
                  )}

                  {model.throughputTokensSec && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Throughput
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.throughputTokensSec} tokens/sec
                      </span>
                    </div>
                  )}

                  {model.gPuRequirements && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        GPU Requirements
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.gPuRequirements}
                      </span>
                    </div>
                  )}

                  {model.memoryFootprintGb && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Memory Footprint
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.memoryFootprintGb} GB
                      </span>
                    </div>
                  )}

                  {model.recommendedVramGb && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Recommended VRAM
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.recommendedVramGb} GB
                      </span>
                    </div>
                  )}

                  {model.modelSizeOnDisk && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Model Size on Disk
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.modelSizeOnDisk}
                      </span>
                    </div>
                  )}

                  {model.trainingDatasetSize && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-[rgba(113,113,130,1)] dark:text-neutral-400">
                        Training Dataset Size
                      </span>
                      <span className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {model.trainingDatasetSize}
                      </span>
                    </div>
                  )}
                </div>

                {/* Ecosystem Support */}
                {model.ecosystemSupport && (
                  <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.10)]">
                    <h3 className="text-neutral-950 dark:text-white font-semibold text-sm mb-3">
                      Ecosystem Support
                    </h3>
                    <p className="text-neutral-950 dark:text-white text-base">
                      {model.ecosystemSupport}
                    </p>
                  </div>
                )}

                {/* Training Dataset */}
                {model.trainingDatasetNames && (
                  <div className="mt-4">
                    <h3 className="text-neutral-950 dark:text-white font-semibold text-sm mb-3">
                      Training Datasets
                    </h3>
                    <p className="text-neutral-950 dark:text-white text-base">
                      {model.trainingDatasetNames}
                    </p>
                  </div>
                )}
              </section>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
