import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import api from "@/lib/api";

interface PricingModel {
  modelName: string;
  organization: string;
  inputPrice?: number;
  outputPrice?: number;
  modelType: string;
  openSource?: boolean;
  license?: string;
}

// CostCalculator component
interface CostCalculatorProps {
  pricingData: PricingModel[];
}

const CostCalculator: React.FC<CostCalculatorProps> = ({ pricingData }) => {
  const [usagePeriod, setUsagePeriod] = useState("Per Month");
  const [inputTokens, setInputTokens] = useState("10000");
  const [outputTokens, setOutputTokens] = useState("2000");
  const [imagesGenerated, setImagesGenerated] = useState("50");
  const [audioMinutes, setAudioMinutes] = useState("60");
  const [selectedModels, setSelectedModels] = useState<Record<string, boolean>>(
    {}
  );

  // Update selectedModels when pricingData changes
  useEffect(() => {
    const newSelectedModels = pricingData.reduce((acc, model) => {
      acc[model.modelName] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setSelectedModels(newSelectedModels);
  }, [pricingData]);

  const handleModelChange = (model: string, checked: boolean) => {
    setSelectedModels((prev) => ({ ...prev, [model]: checked }));
  };

  return (
    <aside className="box-border w-full max-w-md border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-md:w-full max-md:mb-6 max-sm:p-4">
      <header className="box-border flex items-center gap-2 mb-4">
        <svg
          width="20"
          height="20"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.6696 1.99666H5.6696C4.74912 1.99666 4.00293 2.74285 4.00293 3.66332V16.9967C4.00293 17.9171 4.74912 18.6633 5.6696 18.6633H15.6696C16.5901 18.6633 17.3363 17.9171 17.3363 16.9967V3.66332C17.3363 2.74285 16.5901 1.99666 15.6696 1.99666Z"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.33691 5.32999H14.0036"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.0029 11.9967V15.33"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.0029 8.66331H14.0113"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6699 8.66331H10.6783"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.33691 8.66331H7.34525"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6699 11.9967H10.6783"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.33691 11.9967H7.34525"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6699 15.33H10.6783"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.33691 15.33H7.34525"
            stroke="#0A0A0A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4">
          Cost Calculator
        </h2>
      </header>
      <p className="box-border text-[#717182] text-base font-normal leading-6 mb-6">
        Estimate your monthly costs based on usage
      </p>
      <form className="space-y-4">
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2">
            Usage Period
          </label>
          <Select value={usagePeriod} onValueChange={setUsagePeriod}>
            <SelectTrigger className="box-border w-full h-9 flex items-center justify-between bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Per Month">Per Month</SelectItem>
              <SelectItem value="Per Week">Per Week</SelectItem>
              <SelectItem value="Per Day">Per Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2">
            Input Tokens
          </label>
          <Input
            value={inputTokens}
            onChange={(e) => setInputTokens(e.target.value)}
            type="number"
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1">
            Approximate tokens for prompts/questions
          </p>
        </div>
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2">
            Output Tokens
          </label>
          <Input
            value={outputTokens}
            onChange={(e) => setOutputTokens(e.target.value)}
            type="number"
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1">
            Approximate tokens for responses
          </p>
        </div>
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2">
            Images Generated
          </label>
          <Input
            value={imagesGenerated}
            onChange={(e) => setImagesGenerated(e.target.value)}
            type="number"
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1">
            For image generation models
          </p>
        </div>
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2">
            Audio Minutes
          </label>
          <Input
            value={audioMinutes}
            onChange={(e) => setAudioMinutes(e.target.value)}
            type="number"
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1">
            For audio processing models
          </p>
        </div>
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2">
            Models to Compare
          </label>
          <div className="box-border flex flex-col gap-2 mt-2">
            {Object.entries(selectedModels).map(([model, checked]) => (
              <div key={model} className="box-border flex items-center gap-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(isChecked) =>
                    handleModelChange(model, !!isChecked)
                  }
                  className="w-[13px] h-[13px] rounded-[2.5px] border border-gray-300"
                />
                <label className="box-border text-neutral-950 dark:text-white text-sm font-normal leading-5">
                  {model}
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </aside>
  );
};

// CostComparison component
const CostComparison: React.FC = () => {
  return (
    <section className="box-border w-full max-w-2xl border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-4">
      <header className="mb-6">
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 mb-2">
          Cost Comparison
        </h2>
        <p className="box-border text-[#717182] text-base font-normal leading-6">
          Visual comparison of estimated costs
        </p>
      </header>
      <div className="mt-6">
        <svg
          width="100%"
          height="256"
          viewBox="0 0 752 283"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-64"
        >
          <path
            d="M65.6699 171.67H746.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M65.6699 130.17H746.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M65.6699 88.67H746.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M65.6699 47.17H746.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M65.6699 5.66998H746.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M179.17 5.66998V171.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M406.17 5.66998V171.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M633.17 5.66998V171.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M65.6699 5.66998V171.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path
            d="M746.67 5.66998V171.67"
            stroke="#CCCCCC"
            strokeDasharray="3 3"
          />
          <path d="M65.6699 171.67H746.67" stroke="#666666" />
          <path d="M179.17 177.67V171.67" stroke="#666666" />
          <text
            transform="translate(97.5137 250.748) rotate(-45)"
            fill="#666666"
            fontSize="16"
            fontFamily="Inter"
          >
            <tspan x="0.890625" y="15.3182">
              Gemini 1.5 Pro
            </tspan>
          </text>
          <path d="M406.171 177.67V171.67" stroke="#666666" />
          <text
            transform="translate(359.162 216.1) rotate(-45)"
            fill="#666666"
            fontSize="16"
            fontFamily="Inter"
          >
            <tspan x="0.703125" y="15.3182">
              GPT-4o
            </tspan>
          </text>
          <path d="M633.171 177.67V171.67" stroke="#666666" />
          <text
            transform="translate(528.887 273.376) rotate(-45)"
            fill="#666666"
            fontSize="16"
            fontFamily="Inter"
          >
            <tspan x="0.671875" y="15.3182">
              Claude 3.5 Sonnet
            </tspan>
          </text>
          <path d="M65.6699 5.66998V171.67" stroke="#666666" />
          <path d="M59.6699 171.67H65.6699" stroke="#666666" />
          <text fill="#666666" fontSize="16" fontFamily="Inter">
            <tspan x="47.6699" y="175.248">
              0
            </tspan>
          </text>
          <path d="M59.6699 130.17H65.6699" stroke="#666666" />
          <text fill="#666666" fontSize="16" fontFamily="Inter">
            <tspan x="16.9043" y="133.748">
              0.015
            </tspan>
          </text>
          <path d="M59.6699 88.67H65.6699" stroke="#666666" />
          <text fill="#666666" fontSize="16" fontFamily="Inter">
            <tspan x="23.8887" y="92.2482">
              0.03
            </tspan>
          </text>
          <path d="M59.6699 47.17H65.6699" stroke="#666666" />
          <text fill="#666666" fontSize="16" fontFamily="Inter">
            <tspan x="14.0762" y="50.7482">
              0.045
            </tspan>
          </text>
          <path d="M59.6699 5.66998H65.6699" stroke="#666666" />
          <text fill="#666666" fontSize="16" fontFamily="Inter">
            <tspan x="24.0918" y="16.2482">
              0.06
            </tspan>
          </text>
          <path
            d="M88.3701 109.42H269.37V171.67H88.3701V109.42Z"
            fill="#C4B1FF"
          />
          <path d="M315.37 47.17H496.37V171.67H315.37V47.17Z" fill="#C4B1FF" />
          <path
            d="M542.37 5.66998H723.37V171.67H542.37V5.66998Z"
            fill="#C4B1FF"
          />
        </svg>
      </div>
    </section>
  );
};

// CostEstimates component
interface CostEstimate {
  model: string;
  inputCost: string;
  outputCost: string;
  totalCost: string;
}
interface CostEstimatesProps {
  pricingData: PricingModel[];
}

const CostEstimates: React.FC<CostEstimatesProps> = ({ pricingData }) => {
  // Transform pricing data to estimates format (show first 5 models with pricing)
  const estimates: CostEstimate[] = pricingData
    .filter((model) => model.inputPrice || model.outputPrice)
    .slice(0, 5)
    .map((model) => {
      const inputCost = model.inputPrice
        ? `$${model.inputPrice.toFixed(3)}`
        : "$0.000";
      const outputCost = model.outputPrice
        ? `$${model.outputPrice.toFixed(3)}`
        : "$0.000";
      const totalCost = `$${(
        (model.inputPrice || 0) + (model.outputPrice || 0)
      ).toFixed(3)}`;

      return {
        model: model.modelName,
        inputCost,
        outputCost,
        totalCost,
      };
    });

  return (
    <section className="box-border w-full max-w-2xl border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-4">
      <header className="mb-6">
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 mb-2">
          Cost Estimates
        </h2>
        <p className="box-border text-[#717182] text-base font-normal leading-6">
          Projected costs based on your usage parameters (per 1K tokens)
        </p>
      </header>
      <div className="space-y-4">
        {estimates.length === 0 ? (
          <p className="text-neutral-950 dark:text-white text-center py-4">
            No pricing data available
          </p>
        ) : (
          estimates.map((estimate, index) => (
            <article
              key={index}
              className="box-border w-full border relative p-[17px] rounded-[10px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-4"
            >
              <h3 className="box-border text-neutral-950 dark:text-white text-base font-normal leading-6 mb-1">
                {estimate.model}
              </h3>
              <p className="box-border text-[#717182] text-sm font-normal leading-5">
                Input: {estimate.inputCost} | Output: {estimate.outputCost}
              </p>
              <div className="absolute right-[17px] top-[17px] max-sm:static max-sm:mt-2">
                <div className="box-border text-neutral-950 dark:text-white text-lg font-normal leading-7 text-right max-sm:text-left">
                  {estimate.totalCost}
                </div>
                <div className="box-border text-[#717182] text-sm font-normal leading-5 text-right max-sm:text-left">
                  Per 1K Tokens
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

// PerformanceAnalysis component
const PerformanceAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Cost vs Score");
  const navigate = useNavigate();

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-4">
      <header className="mb-6">
        <div className="box-border flex items-center gap-2 mb-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.0029 5.83325H19.0029V10.8333"
              stroke="#0A0A0A"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.0036 5.83325L11.9202 12.9166L7.75358 8.74992L2.33691 14.1666"
              stroke="#0A0A0A"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4">
            Cost vs Performance Analysis
          </h2>
        </div>
        <p className="box-border text-[#717182] text-base font-normal leading-6">
          Find the best value models based on performance per dollar
        </p>
      </header>
      <div className="box-border flex items-center gap-10 w-fit bg-[#F6F3FF] dark:bg-zinc-900 my-6 p-1 rounded-[14px] max-sm:flex-col max-sm:gap-2 max-sm:w-full">
        <button
          className={`w-[120px] h-9 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg max-sm:w-full max-sm:text-center text-sm font-semibold leading-5 text-center ${
            activeTab === "Cost vs Score"
              ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] text-white"
              : "bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white"
          }`}
          onClick={() => setActiveTab("Cost vs Score")}
        >
          Cost vs Score
        </button>
        <button
          className={`w-[120px] h-9 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg max-sm:w-full max-sm:text-center text-sm font-semibold leading-5 text-center ${
            activeTab === "Detailed Table"
              ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] text-white"
              : "bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white"
          }`}
          onClick={() => setActiveTab("Detailed Table")}
        >
          Detailed Table
        </button>
      </div>
      {activeTab === "Cost vs Score" && (
        <div className="mt-6">
          <svg
            width="100%"
            height="320"
            viewBox="0 0 1168 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-80"
          >
            {/* Horizontal grid lines */}
            <path
              d="M65.6699 285H1162.67"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M65.6699 215H1162.67"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M65.6699 145H1162.67"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M65.6699 74.9999H1162.67"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M65.6699 4.99994H1162.67"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />

            {/* Vertical grid lines */}
            <path
              d="M157.087 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M339.92 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M522.753 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M705.587 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M888.42 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M1071.25 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M65.6699 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />
            <path
              d="M1162.67 4.99994V285"
              stroke="#CCCCCC"
              strokeDasharray="3 3"
            />

            {/* Axis lines */}
            <path d="M65.6699 285H1162.67" stroke="#666666" />

            {/* Y-axis labels */}
            <text
              x="30"
              y="289"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
            >
              0%
            </text>
            <text
              x="20"
              y="219"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
            >
              25%
            </text>
            <text
              x="20"
              y="149"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
            >
              50%
            </text>
            <text x="20" y="79" fill="#666666" fontSize="16" fontFamily="Inter">
              75%
            </text>
            <text x="10" y="19" fill="#666666" fontSize="16" fontFamily="Inter">
              100%
            </text>

            {/* Bars */}
            <rect x="120" y="142" width="63" height="142" fill="#8859FF" />
            <rect x="308" y="72" width="63" height="213" fill="#FF44B4" />
            <rect x="486" y="146" width="63" height="138" fill="#8CCDFF" />
            <rect x="668" y="75" width="63" height="209" fill="#82FF79" />
            <rect x="851" y="215" width="63" height="70" fill="#FFEE51" />
            <rect x="1034" y="75" width="63" height="211" fill="#FF7474" />

            {/* X-axis cost labels under each pillar */}
            <text
              x="120"
              y="310"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
              textAnchor="middle"
              transform="translate(31,0)"
            >
              1.25$/1M
            </text>
            <text
              x="308"
              y="310"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
              textAnchor="middle"
              transform="translate(31,0)"
            >
              2.5$/1M
            </text>
            <text
              x="486"
              y="310"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
              textAnchor="middle"
              transform="translate(31,0)"
            >
              3$/1M
            </text>
            <text
              x="668"
              y="310"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
              textAnchor="middle"
              transform="translate(31,0)"
            >
              10$/1M
            </text>
            <text
              x="851"
              y="310"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
              textAnchor="middle"
              transform="translate(31,0)"
            >
              15$/1M
            </text>
            <text
              x="1034"
              y="310"
              fill="#666666"
              fontSize="16"
              fontFamily="Inter"
              textAnchor="middle"
              transform="translate(31,0)"
            >
              40$/1M
            </text>
          </svg>
        </div>
      )}
      {activeTab === "Detailed Table" && (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Model</th>
                  <th className="text-left p-3">Organization</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Cost per 1M tokens</th>
                  <th className="text-left p-3">Performance Score</th>
                  <th className="text-left p-3">Efficiency</th>
                  <th className="text-left p-3">View</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Gemini 1.5 Pro</td>
                  <td className="p-3">Google</td>
                  <td className="p-3">Multimodal</td>
                  <td className="p-3">$1.25</td>
                  <td className="p-3">85%</td>
                  <td className="p-3">70.2</td>
                  <td className="p-3">
                    <button
                      className="px-4 py-1 rounded bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white border border-[#B18BEF] hover:bg-[#B18BEF] hover:text-white transition-all duration-150"
                      onClick={() => navigate("/viewPage/modelView")}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">GPT-4o</td>
                  <td className="p-3">OpenAI</td>
                  <td className="p-3">Multimodal</td>
                  <td className="p-3">$2.50</td>
                  <td className="p-3">92%</td>
                  <td className="p-3">36.7</td>
                  <td className="p-3">
                    <button
                      className="px-4 py-1 rounded bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white border border-[#B18BEF] hover:bg-[#B18BEF] hover:text-white transition-all duration-150"
                      onClick={() => navigate("/viewPage/modelView")}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Claude 3.5 Sonnet</td>
                  <td className="p-3">Anthropic</td>
                  <td className="p-3">Reasoning</td>
                  <td className="p-3">$3.00</td>
                  <td className="p-3">90%</td>
                  <td className="p-3">30.5</td>
                  <td className="p-3">
                    <button
                      className="px-4 py-1 rounded bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white border border-[#B18BEF] hover:bg-[#B18BEF] hover:text-white transition-all duration-150"
                      onClick={() => navigate("/viewPage/modelView")}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

// PricingInfo component
interface PricingModel {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
}
const PricingInfo: React.FC = () => {
  interface PricingModelInfo {
    icon: JSX.Element;
    title: string;
    description: string;
    features: string[];
    color: string;
  }

  const pricingModels: PricingModelInfo[] = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.6699 1.99658V18.6632"
            stroke="#00C950"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.8366 4.49658H8.58659C7.81304 4.49658 7.07117 4.80387 6.52419 5.35085C5.97721 5.89784 5.66992 6.6397 5.66992 7.41325C5.66992 8.1868 5.97721 8.92866 6.52419 9.47564C7.07117 10.0226 7.81304 10.3299 8.58659 10.3299H12.7533C13.5268 10.3299 14.2687 10.6372 14.8157 11.1842C15.3626 11.7312 15.6699 12.473 15.6699 13.2466C15.6699 14.0201 15.3626 14.762 14.8157 15.309C14.2687 15.856 13.5268 16.1632 12.7533 16.1632H5.66992"
            stroke="#00C950"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Free & Open Source",
      description:
        "Models you can run locally or self-host without API costs. Requires technical setup and compute resources.",
      features: [
        "No usage fees",
        "Self-hosting required",
        "Full control and privacy",
      ],
      color: "#00C950",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5498 1.99658V18.6632"
            stroke="#2B7FFF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.7165 4.49658H8.46647C7.69292 4.49658 6.95106 4.80387 6.40408 5.35085C5.8571 5.89784 5.5498 6.6397 5.5498 7.41325C5.5498 8.1868 5.8571 8.92866 6.40408 9.47564C6.95106 10.0226 7.69292 10.3299 8.46647 10.3299H12.6331C13.4067 10.3299 14.1486 10.6372 14.6955 11.1842C15.2425 11.7312 15.5498 12.473 15.5498 13.2466C15.5498 14.0201 15.2425 14.762 14.6955 15.309C14.1486 15.856 13.4067 16.1632 12.6331 16.1632H5.5498"
            stroke="#2B7FFF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Pay-per-Use API",
      description:
        "Most common model where you pay based on tokens processed, images generated, or minutes of audio.",
      features: [
        "Input/output token pricing",
        "No upfront costs",
        "Scales with usage",
      ],
      color: "#2B7FFF",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.4404 1.99658V18.6632"
            stroke="#AD46FF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.6071 4.49658H8.3571C7.58355 4.49658 6.84168 4.80387 6.2947 5.35085C5.74772 5.89784 5.44043 6.6397 5.44043 7.41325C5.44043 8.1868 5.74772 8.92866 6.2947 9.47564C6.84168 10.0226 7.58355 10.3299 8.3571 10.3299H12.5238C13.2973 10.3299 14.0392 10.6372 14.5862 11.1842C15.1331 11.7312 15.4404 12.473 15.4404 13.2466C15.4404 14.0201 15.1331 14.762 14.5862 15.309C14.0392 15.856 13.2973 16.1632 12.5238 16.1632H5.44043"
            stroke="#AD46FF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Subscription Tiers",
      description:
        "Fixed monthly fees with usage limits or unlimited access for specific use cases.",
      features: ["Predictable costs", "Usage limits", "Volume discounts"],
      color: "#AD46FF",
    },
  ];

  return (
    <section className="box-border w-full border grid grid-cols-1 md:grid-cols-3 gap-10 bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-md:gap-6 max-sm:p-4">
      <header className="col-span-full mb-6">
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 mb-2">
          Understanding AI Model Pricing
        </h2>
        <p className="box-border text-[#717182] text-base font-normal leading-6">
          How different providers structure their pricing models
        </p>
      </header>
      {pricingModels.map((model, index) => (
        <article key={index} className="box-border flex flex-col gap-3">
          <div className="mb-2">{model.icon}</div>
          <h3 className="box-border text-neutral-950 dark:text-white text-base font-normal leading-6">
            {model.title}
          </h3>
          <p className="box-border text-[#717182] text-sm font-normal leading-5 mb-3">
            {model.description}
          </p>
          <ul className="space-y-1">
            {model.features.map((feature, featureIndex) => (
              <li
                key={featureIndex}
                className="box-border text-neutral-950 dark:text-neutral-100 text-xs font-normal leading-4"
              >
                • {feature}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
};

// Main Pricing Page
const Pricing: React.FC = () => {
  const [pricingData, setPricingData] = useState<PricingModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await api.getPricingData();
        if (response.success) {
          setPricingData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch pricing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  return (
    <div className="box-border w-full min-h-screen relative bg-white dark:bg-black">
      <Navigation />
      <main className="box-border w-full min-h-[calc(100vh_-_65px)] bg-[#F6F3FF] dark:bg-black mt-[65px] px-8 py-8 max-md:px-4 max-md:py-8 max-sm:px-2 max-sm:py-4">
        <div className="box-border max-w-screen-xl relative mx-auto">
          <header className="mb-12">
            <h1 className="box-border text-neutral-950 dark:text-white text-3xl font-semibold leading-9 mb-4 max-sm:text-2xl max-sm:leading-[30px]">
              AI Model Pricing & Cost Analysis
            </h1>
            <p className="box-border text-[#717182] text-base font-normal leading-6 max-w-[660px] max-sm:text-sm max-sm:leading-5">
              Compare costs, calculate usage estimates, and find the most
              cost-effective AI models for your needs
            </p>
          </header>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-neutral-950 dark:text-white">
                Loading pricing data...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <CostCalculator pricingData={pricingData} />
                <div className="space-y-6">
                  <CostEstimates pricingData={pricingData} />
                  <CostComparison />
                </div>
              </div>
              <div className="space-y-6">
                <PerformanceAnalysis />
                <PricingInfo />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
