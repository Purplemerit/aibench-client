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
  inputPrice?: number | string;
  outputPrice?: number | string;
  modelType: string;
  openSource?: boolean;
  license?: string;
}

interface DetailedModel {
  _id: string;
  modelName: string;
  organization: string;
  inputPrice?: number | string;
  outputPrice?: number | string;
  modelType: string;
  overallBenchmarkScore?: number;
  openSource?: string;
  license?: string;
}

// CostCalculator component
interface CostCalculatorProps {
  pricingData: PricingModel[];
  selectedModels: string[];
  onModelSelectionChange: (models: string[]) => void;
  onCalculate: (
    inputTokens: number,
    outputTokens: number,
    imagesGenerated: number,
    audioMinutes: number,
    usagePeriod: string
  ) => void;
}

const CostCalculator: React.FC<CostCalculatorProps> = ({
  pricingData,
  selectedModels,
  onModelSelectionChange,
  onCalculate,
}) => {
  const [usagePeriod, setUsagePeriod] = useState("Per Month");
  const [inputTokens, setInputTokens] = useState("10000");
  const [outputTokens, setOutputTokens] = useState("2000");
  const [imagesGenerated, setImagesGenerated] = useState("50");
  const [audioMinutes, setAudioMinutes] = useState("60");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "organization" | "cost">(
    "name"
  );

  const handleModelChange = (modelName: string, checked: boolean) => {
    if (checked) {
      // Limit to 3 selections
      if (selectedModels.length < 3) {
        onModelSelectionChange([...selectedModels, modelName]);
      }
    } else {
      onModelSelectionChange(selectedModels.filter((m) => m !== modelName));
    }
  };

  const handleClearFilter = () => {
    setSearchFilter("");
    setSortBy("name");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(
      parseFloat(inputTokens) || 0,
      parseFloat(outputTokens) || 0,
      parseFloat(imagesGenerated) || 0,
      parseFloat(audioMinutes) || 0,
      usagePeriod
    );
  };

  // Get models with pricing data (0 is valid for free models)
  const availableModels = pricingData
    .filter(
      (model) =>
        (model.inputPrice !== null && model.inputPrice !== undefined) ||
        (model.outputPrice !== null && model.outputPrice !== undefined)
    )
    .filter((model) => {
      if (!searchFilter) return true;
      const search = searchFilter.toLowerCase();
      return (
        model.modelName.toLowerCase().includes(search) ||
        model.organization.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.modelName.localeCompare(b.modelName);
        case "organization":
          return a.organization.localeCompare(b.organization);
        case "cost": {
          const costA =
            (typeof a.inputPrice === "number" ? a.inputPrice : 0) +
            (typeof a.outputPrice === "number" ? a.outputPrice : 0);
          const costB =
            (typeof b.inputPrice === "number" ? b.inputPrice : 0) +
            (typeof b.outputPrice === "number" ? b.outputPrice : 0);
          return costA - costB;
        }
        default:
          return 0;
      }
    });

  return (
    <aside className="box-border w-full max-w-md border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] xl:max-w-md max-xl:max-w-full max-sm:p-4">
      <header className="box-border flex items-center gap-2 mb-4 max-sm:gap-1.5">
        <svg
          className="max-sm:w-4 max-sm:h-4"
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
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 max-sm:text-sm">
          Cost Calculator
        </h2>
      </header>
      <p className="box-border text-[#717182] text-base font-normal leading-6 mb-6 max-sm:text-sm max-sm:leading-5 max-sm:mb-4">
        Estimate your monthly costs based on usage
      </p>
      <form className="space-y-4">
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2 max-sm:text-xs">
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
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg max-sm:h-8 max-sm:text-sm"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1 max-sm:text-[10px]">
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
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg max-sm:h-8 max-sm:text-sm"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1 max-sm:text-[10px]">
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
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg max-sm:h-8 max-sm:text-sm"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1 max-sm:text-[10px]">
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
            className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg max-sm:h-8 max-sm:text-sm"
          />
          <p className="box-border text-[#717182] text-xs font-normal leading-4 mt-1 max-sm:text-[10px]">
            For audio processing models
          </p>
        </div>
        <div>
          <label className="box-border text-neutral-950 dark:text-white text-sm font-semibold leading-[14px] block mb-2 max-sm:text-xs">
            Models to Compare (Select up to 3)
          </label>
          {selectedModels.length >= 3 && (
            <p className="box-border text-orange-600 dark:text-orange-400 text-xs font-normal leading-4 mb-2 max-sm:text-[10px]">
              Maximum 3 models can be selected
            </p>
          )}

          {/* Filter and Sort Controls */}
          <div className="space-y-2 mb-3 max-sm:space-y-1.5">
            <Input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search models or organizations..."
              className="box-border w-full h-9 flex items-center bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg text-sm max-sm:h-8 max-sm:text-xs"
            />
            <div className="flex gap-2 max-sm:gap-1.5">
              <Select
                value={sortBy}
                onValueChange={(value: "name" | "organization" | "cost") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="box-border flex-1 h-9 flex items-center justify-between bg-[#F6F3FF] dark:bg-zinc-900 px-3 py-2 rounded-lg text-sm max-sm:h-8 max-sm:text-xs max-sm:px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="organization">
                    Sort by Organization
                  </SelectItem>
                  <SelectItem value="cost">Sort by Cost</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={handleClearFilter}
                className="px-3 py-1 text-xs bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white rounded-lg hover:bg-[#B18BEF] hover:text-white transition-all duration-150 max-sm:px-2 max-sm:text-[10px]"
                type="button"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="box-border flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto pr-2 max-sm:max-h-48 max-sm:gap-1.5">
            {availableModels.length === 0 ? (
              <p className="text-neutral-950 dark:text-white text-sm max-sm:text-xs">
                No pricing data available
              </p>
            ) : (
              availableModels.map((model) => (
                <div
                  key={model.modelName}
                  className="box-border flex items-center gap-2 max-sm:gap-1.5"
                >
                  <Checkbox
                    checked={selectedModels.includes(model.modelName)}
                    onCheckedChange={(isChecked) =>
                      handleModelChange(model.modelName, !!isChecked)
                    }
                    disabled={
                      !selectedModels.includes(model.modelName) &&
                      selectedModels.length >= 3
                    }
                    className="w-[13px] h-[13px] rounded-[2.5px] border border-gray-300 max-sm:w-3 max-sm:h-3"
                  />
                  <label className="box-border text-neutral-950 dark:text-white text-sm font-normal leading-5 max-sm:text-xs max-sm:leading-4">
                    {model.modelName}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full mt-6 px-4 py-3 bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed max-sm:mt-4 max-sm:py-2 max-sm:text-sm"
          disabled={selectedModels.length === 0}
        >
          Calculate Costs
        </button>
      </form>
    </aside>
  );
};

// CostComparison component
interface CostComparisonProps {
  pricingData: PricingModel[];
  selectedModels: string[];
  calculatedCosts: {
    [modelName: string]: {
      inputCost: number;
      outputCost: number;
      totalCost: number;
    };
  };
}

const CostComparison: React.FC<CostComparisonProps> = ({
  pricingData,
  selectedModels,
  calculatedCosts,
}) => {
  // Filter to get data for selected models
  const selectedPricingData = pricingData.filter((model) =>
    selectedModels.includes(model.modelName)
  );

  // Calculate max cost for scaling
  const maxCost = Math.max(
    ...selectedPricingData.map((model) => {
      const calculated = calculatedCosts[model.modelName];

      if (calculated) {
        // Use calculated total cost
        return calculated.totalCost;
      } else {
        // Use base pricing
        const input =
          typeof model.inputPrice === "number"
            ? model.inputPrice
            : model.inputPrice
            ? parseFloat(String(model.inputPrice))
            : 0;
        const output =
          typeof model.outputPrice === "number"
            ? model.outputPrice
            : model.outputPrice
            ? parseFloat(String(model.outputPrice))
            : 0;
        return (isNaN(input) ? 0 : input) + (isNaN(output) ? 0 : output);
      }
    }),
    1
  );

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-4">
      <header className="mb-6 max-sm:mb-4">
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 mb-2 max-sm:text-sm">
          Cost Comparison
        </h2>
        <p className="box-border text-[#717182] text-base font-normal leading-6 max-sm:text-sm max-sm:leading-5">
          {Object.keys(calculatedCosts).length > 0
            ? "Total cost comparison for your usage"
            : "Base pricing comparison per 1K tokens"}
          Visual comparison of estimated costs (per 1M tokens)
        </p>
      </header>
      <div className="mt-6">
        {selectedPricingData.length === 0 ? (
          <p className="text-neutral-950 dark:text-white text-center py-12 max-sm:py-8 max-sm:text-sm">
            Select up to 3 models to compare costs
          </p>
        ) : (
          <div className="relative pt-4 pb-2">
            {/* Y-axis label */}
            <div className="absolute -left-2 top-4 bottom-12 flex items-center max-sm:-left-1">
              <span className="text-xs text-neutral-600 dark:text-neutral-400 -rotate-90 whitespace-nowrap max-sm:text-[10px]">
                Cost ($)
              </span>
            </div>

            {/* Chart area */}
            <div className="ml-10 mr-4 max-sm:ml-8 max-sm:mr-2">
              {/* Y-axis scale */}
              <div
                className="flex flex-col-reverse justify-between absolute left-10 top-4 text-xs text-neutral-600 dark:text-neutral-400 max-sm:left-8 max-sm:text-[10px]"
                style={{ height: "400px" }}
              >
                <span>${0}</span>
                <span>${(maxCost * 0.25).toFixed(2)}</span>
                <span>${(maxCost * 0.5).toFixed(2)}</span>
                <span>${(maxCost * 0.75).toFixed(2)}</span>
                <span>${maxCost.toFixed(2)}</span>
              </div>

              {/* Single unified graph with all models */}
              <div className="ml-12 pb-12 max-sm:ml-10 max-sm:pb-8">
                <div
                  className="flex items-end justify-around gap-4 border-b-2 border-neutral-300 dark:border-neutral-700 max-md:gap-3 max-sm:gap-2"
                  style={{ height: "400px" }}
                >
                  {selectedPricingData.map((model, index) => {
                    const calculated = calculatedCosts[model.modelName];

                    let totalCost: number;
                    if (calculated) {
                      // Use calculated total cost
                      totalCost = calculated.totalCost;
                    } else {
                      // Use base pricing
                      const inputCost =
                        typeof model.inputPrice === "number"
                          ? model.inputPrice
                          : model.inputPrice
                          ? parseFloat(String(model.inputPrice))
                          : 0;
                      const outputCost =
                        typeof model.outputPrice === "number"
                          ? model.outputPrice
                          : model.outputPrice
                          ? parseFloat(String(model.outputPrice))
                          : 0;
                      totalCost =
                        (isNaN(inputCost) ? 0 : inputCost) +
                        (isNaN(outputCost) ? 0 : outputCost);
                    }

                    const barHeight = (totalCost / maxCost) * 380; // 380px max height
                    const colors = ["#8859FF", "#FF44B4", "#44D7B6"];

                    return (
                      <div
                        key={model.modelName}
                        className="flex flex-col items-center flex-1 max-w-[100px] max-md:max-w-[90px] max-sm:max-w-[70px]"
                      >
                        <div className="w-full flex items-end justify-center h-full">
                          <div className="relative w-full group">
                            <div
                              className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                              style={{
                                height: `${Math.max(barHeight, 10)}px`,
                                backgroundColor: colors[index % colors.length],
                              }}
                            >
                              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-neutral-950 dark:text-white whitespace-nowrap max-sm:text-[10px] max-sm:-top-6">
                                ${totalCost.toFixed(3)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full mt-2 max-sm:mt-1.5">
                          <p className="text-[11px] text-center text-neutral-950 dark:text-white font-medium truncate max-md:text-[10px] max-sm:text-[9px]">
                            {model.modelName}
                          </p>
                          <p className="text-[9px] text-center text-neutral-500 dark:text-neutral-400 truncate max-sm:text-[8px]">
                            {model.organization}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis label */}
                <div className="text-center mt-3 max-sm:mt-2">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 max-sm:text-[10px]">
                    AI Models
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
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
  selectedModels: string[];
  calculatedCosts: {
    [modelName: string]: {
      inputCost: number;
      outputCost: number;
      totalCost: number;
    };
  };
}

const CostEstimates: React.FC<CostEstimatesProps> = ({
  pricingData,
  selectedModels,
  calculatedCosts,
}) => {
  // Transform pricing data to estimates format for selected models
  const estimates: CostEstimate[] = pricingData
    .filter((model) => selectedModels.includes(model.modelName))
    .map((model) => {
      const calculated = calculatedCosts[model.modelName];

      if (calculated) {
        // Use calculated costs based on user input
        return {
          model: model.modelName,
          inputCost: `$${calculated.inputCost.toFixed(4)}`,
          outputCost: `$${calculated.outputCost.toFixed(4)}`,
          totalCost: `$${calculated.totalCost.toFixed(4)}`,
        };
      } else {
        // Show base pricing per 1K tokens
        const inputPrice =
          typeof model.inputPrice === "number" ? model.inputPrice : 0;
        const outputPrice =
          typeof model.outputPrice === "number" ? model.outputPrice : 0;

        return {
          model: model.modelName,
          inputCost: `$${inputPrice.toFixed(4)}`,
          outputCost: `$${outputPrice.toFixed(4)}`,
          totalCost: `$${(inputPrice + outputPrice).toFixed(4)}`,
        };
      }
    });

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-4">
      <header className="mb-6 max-sm:mb-4">
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 mb-2 max-sm:text-sm">
          Cost Estimates
        </h2>
        <p className="box-border text-[#717182] text-base font-normal leading-6 max-sm:text-sm max-sm:leading-5">
          {Object.keys(calculatedCosts).length > 0
            ? "Calculated costs based on your usage"
            : "Base pricing per 1K tokens (click Calculate Costs to see estimates)"}
        </p>
      </header>
      <div className="space-y-4">
        {estimates.length === 0 ? (
          <p className="text-neutral-950 dark:text-white text-center py-4 max-sm:py-3 max-sm:text-sm">
            Select models to see cost estimates
          </p>
        ) : (
          estimates.map((estimate, index) => (
            <article
              key={index}
              className="box-border w-full border relative p-[17px] rounded-[10px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-3"
            >
              <h3 className="box-border text-neutral-950 dark:text-white text-base font-normal leading-6 mb-1 max-sm:text-sm max-sm:mb-0.5">
                {estimate.model}
              </h3>
              <p className="box-border text-[#717182] text-sm font-normal leading-5 max-sm:text-xs">
                Input: {estimate.inputCost} | Output: {estimate.outputCost}
              </p>
              <div className="absolute right-[17px] top-[17px] max-sm:static max-sm:mt-2 max-sm:right-3 max-sm:top-3">
                <div className="box-border text-neutral-950 dark:text-white text-lg font-normal leading-7 text-right max-sm:text-left max-sm:text-base max-sm:leading-6">
                  {estimate.totalCost}
                </div>
                <div className="box-border text-[#717182] text-sm font-normal leading-5 text-right max-sm:text-left max-sm:text-xs">
                  {Object.keys(calculatedCosts).length > 0
                    ? "Total Cost"
                    : "Per 1K Tokens"}
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
interface PerformanceAnalysisProps {
  pricingData: PricingModel[];
  selectedModels: string[];
}

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({
  pricingData,
  selectedModels,
}) => {
  const [activeTab, setActiveTab] = useState("Cost vs Score");
  const navigate = useNavigate();

  // Get data for selected models with full information
  const [detailedModels, setDetailedModels] = useState<DetailedModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetailedData = async () => {
      if (selectedModels.length === 0) return;

      try {
        setLoading(true);
        const response = await api.getAllModels({
          limit: 100,
          search: selectedModels.join("|"),
        });

        if (response.success && response.data) {
          const filtered = response.data.filter((model: DetailedModel) =>
            selectedModels.includes(model.modelName)
          );
          setDetailedModels(filtered);
        }
      } catch (error) {
        console.error("Error fetching detailed model data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedData();
  }, [selectedModels]);

  // Calculate efficiency (score per dollar for 1M tokens)
  const getEfficiency = (model: DetailedModel) => {
    // Helper to parse price strings
    const parsePriceString = (price: string | number | undefined): number => {
      if (typeof price === "number") return price;
      if (!price || typeof price !== "string") return 0;

      const trimmed = price.trim();

      // Check for free models
      if (
        trimmed.toLowerCase().includes("free") ||
        trimmed.toLowerCase().includes("self-hosted")
      ) {
        return 0;
      }

      // Remove $ and extract first number
      const cleaned = trimmed.replace(/\$/g, "");
      const match = cleaned.match(/(\d+\.?\d*)/);

      if (match) {
        const parsed = parseFloat(match[1]);
        return isNaN(parsed) ? 0 : parsed;
      }

      return 0;
    };

    const inputPrice = parsePriceString(model.inputPrice);
    const outputPrice = parsePriceString(model.outputPrice);

    // Convert to cost per 1M tokens
    const totalCost = (inputPrice + outputPrice) * 1000;
    const score = model.overallBenchmarkScore || 0;

    if (totalCost === 0) return "N/A";
    return (score / totalCost).toFixed(1);
  };

  // Get cost per 1M tokens (prices in DB are per 1K tokens)
  const getTotalCost = (model: DetailedModel) => {
    // Helper to parse price strings
    const parsePriceString = (price: string | number | undefined): number => {
      if (typeof price === "number") return price;
      if (!price || typeof price !== "string") return 0;

      const trimmed = price.trim();

      // Check for free models
      if (
        trimmed.toLowerCase().includes("free") ||
        trimmed.toLowerCase().includes("self-hosted")
      ) {
        return 0;
      }

      // Remove $ and extract first number
      const cleaned = trimmed.replace(/\$/g, "");
      const match = cleaned.match(/(\d+\.?\d*)/);

      if (match) {
        const parsed = parseFloat(match[1]);
        return isNaN(parsed) ? 0 : parsed;
      }

      return 0;
    };

    const inputPrice = parsePriceString(model.inputPrice);
    const outputPrice = parsePriceString(model.outputPrice);

    // Multiply by 1000 to convert from per 1K tokens to per 1M tokens
    return (inputPrice + outputPrice) * 1000;
  };

  return (
    <section className="box-border w-full border bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-sm:p-4">
      <header className="mb-6 max-sm:mb-4">
        <div className="box-border flex items-center gap-2 mb-4 max-sm:gap-1.5 max-sm:mb-3">
          <svg
            className="max-sm:w-4 max-sm:h-4"
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
          <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 max-sm:text-sm">
            Cost vs Performance Analysis
          </h2>
        </div>
        <p className="box-border text-[#717182] text-base font-normal leading-6 max-sm:text-sm max-sm:leading-5">
          Find the best value models based on performance per dollar
        </p>
      </header>
      <div className="box-border flex items-center gap-10 w-fit bg-[#F6F3FF] dark:bg-zinc-900 my-6 p-1 rounded-[14px] max-md:flex-col max-md:gap-2 max-md:w-full max-sm:my-4">
        <button
          className={`w-[120px] h-9 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg max-md:w-full max-md:text-center text-sm font-semibold leading-5 text-center max-sm:h-8 max-sm:text-xs ${
            activeTab === "Cost vs Score"
              ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] text-white"
              : "bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white"
          }`}
          onClick={() => setActiveTab("Cost vs Score")}
        >
          Cost vs Score
        </button>
        <button
          className={`w-[120px] h-9 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg max-md:w-full max-md:text-center text-sm font-semibold leading-5 text-center max-sm:h-8 max-sm:text-xs ${
            activeTab === "Detailed Table"
              ? "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] text-white"
              : "bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white"
          }`}
          onClick={() => setActiveTab("Detailed Table")}
        >
          Detailed Table
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 max-sm:py-8">
          <p className="text-neutral-950 dark:text-white max-sm:text-sm">
            Loading analysis...
          </p>
        </div>
      ) : selectedModels.length === 0 ? (
        <div className="text-center py-12 max-sm:py-8">
          <p className="text-neutral-950 dark:text-white max-sm:text-sm">
            Select models to see performance analysis
          </p>
        </div>
      ) : (
        <>
          {activeTab === "Cost vs Score" && (
            <div className="mt-6 relative pb-4 overflow-hidden max-sm:mt-4">
              {/* Y-axis label (Score) */}
              <div className="absolute -left-2 top-0 bottom-20 flex items-center max-sm:-left-1">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 -rotate-90 whitespace-nowrap max-sm:text-[10px]">
                  Benchmark Score
                </span>
              </div>

              {/* Chart area */}
              <div className="ml-10 mr-4 max-sm:ml-8 max-sm:mr-2">
                {/* Y-axis scale */}
                <div
                  className="flex flex-col-reverse justify-between absolute left-10 top-0 text-xs text-neutral-600 dark:text-neutral-400 max-sm:left-8 max-sm:text-[10px]"
                  style={{ height: "240px" }}
                >
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>

                {/* Single unified graph with all models */}
                <div className="ml-12 pb-20 max-sm:ml-10 max-sm:pb-16">
                  <div
                    className="flex items-end justify-around gap-4 border-b-2 border-neutral-300 dark:border-neutral-700 max-sm:gap-2"
                    style={{ height: "240px" }}
                  >
                    {detailedModels.map((model, index) => {
                      const totalCost = getTotalCost(model);
                      const score = model.overallBenchmarkScore || 0;
                      const barHeight = (score / 100) * 220; // 220px max height
                      const colors = ["#8859FF", "#FF44B4", "#44D7B6"];

                      return (
                        <div
                          key={model._id}
                          className="flex flex-col items-center flex-1 max-w-[120px] max-sm:max-w-[70px]"
                        >
                          <div className="w-full flex items-end justify-center h-full">
                            <div className="relative w-full group">
                              <div
                                className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                                style={{
                                  height: `${Math.max(barHeight, 10)}px`,
                                  backgroundColor:
                                    colors[index % colors.length],
                                }}
                              >
                                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-neutral-950 dark:text-white whitespace-nowrap max-sm:text-[10px] max-sm:-top-6">
                                  {score.toFixed(1)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-3 max-sm:mt-1.5">
                            <p className="text-xs text-center text-neutral-950 dark:text-white font-medium truncate max-sm:text-[9px]">
                              {model.modelName}
                            </p>
                            <p className="text-[10px] text-center text-neutral-500 dark:text-neutral-400 truncate max-sm:text-[8px]">
                              ${totalCost.toFixed(2)}/1M
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis label */}
                  <div className="text-center mt-3 max-sm:mt-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 max-sm:text-[10px]">
                      AI Models (Cost per 1M tokens shown below)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Detailed Table" && (
            <div className="mt-6 max-sm:mt-4">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b dark:border-neutral-700">
                      <th className="text-left p-3 text-neutral-950 dark:text-white text-sm">
                        Model
                      </th>
                      <th className="text-left p-3 text-neutral-950 dark:text-white text-sm">
                        Organization
                      </th>
                      <th className="text-left p-3 text-neutral-950 dark:text-white text-sm">
                        Type
                      </th>
                      <th className="text-left p-3 text-neutral-950 dark:text-white text-sm">
                        Cost per 1M tokens
                      </th>
                      <th className="text-left p-3 text-neutral-950 dark:text-white text-sm">
                        Performance Score
                      </th>
                      <th className="text-left p-3 text-neutral-950 dark:text-white text-sm">
                        Efficiency
                      </th>
                      <th className="text-left p-3 text-neutral-950 dark:text-white text-sm">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedModels.map((model) => (
                      <tr
                        key={model._id}
                        className="border-b dark:border-neutral-700"
                      >
                        <td className="p-3 text-neutral-950 dark:text-white text-sm">
                          {model.modelName}
                        </td>
                        <td className="p-3 text-neutral-600 dark:text-neutral-400 text-sm">
                          {model.organization}
                        </td>
                        <td className="p-3 text-neutral-600 dark:text-neutral-400 text-sm">
                          {model.modelType}
                        </td>
                        <td className="p-3 text-neutral-950 dark:text-white font-semibold text-sm">
                          {getTotalCost(model) === 0
                            ? "Free"
                            : `$${getTotalCost(model).toFixed(2)}`}
                        </td>
                        <td className="p-3 text-neutral-950 dark:text-white text-sm">
                          {(model.overallBenchmarkScore || 0).toFixed(1)}%
                        </td>
                        <td className="p-3 text-neutral-950 dark:text-white text-sm">
                          {getEfficiency(model)}
                        </td>
                        <td className="p-3">
                          <button
                            className="px-4 py-1 rounded bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white border border-[#B18BEF] hover:bg-[#B18BEF] hover:text-white transition-all duration-150 text-sm"
                            onClick={() => navigate(`/model/${model._id}`)}
                            type="button"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 max-sm:space-y-3">
                {detailedModels.map((model) => (
                  <div
                    key={model._id}
                    className="box-border border bg-white dark:bg-neutral-950 p-4 rounded-lg border-solid border-[rgba(0,0,0,0.10)] dark:border-neutral-800 max-sm:p-3"
                  >
                    <div className="flex flex-col gap-3 max-sm:gap-2">
                      {/* Model Name and View Button */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-neutral-950 dark:text-white mb-1 truncate max-sm:text-sm">
                            {model.modelName}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-sm:text-xs">
                            {model.organization}
                          </p>
                        </div>
                        <button
                          className="px-4 py-1.5 rounded bg-[#F1EBFF] text-[#4B00A8] dark:bg-[#23232b] dark:text-white border border-[#B18BEF] hover:bg-[#B18BEF] hover:text-white transition-all duration-150 text-sm whitespace-nowrap max-sm:text-xs max-sm:px-3 max-sm:py-1"
                          onClick={() => navigate(`/model/${model._id}`)}
                          type="button"
                        >
                          View
                        </button>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 max-sm:gap-2">
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 max-sm:text-[10px]">
                            Type
                          </p>
                          <p className="text-sm font-medium text-neutral-950 dark:text-white truncate max-sm:text-xs">
                            {model.modelType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 max-sm:text-[10px]">
                            Cost per 1M tokens
                          </p>
                          <p className="text-sm font-semibold text-neutral-950 dark:text-white max-sm:text-xs">
                            {getTotalCost(model) === 0
                              ? "Free"
                              : `$${getTotalCost(model).toFixed(2)}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 max-sm:text-[10px]">
                            Performance Score
                          </p>
                          <p className="text-sm font-medium text-neutral-950 dark:text-white max-sm:text-xs">
                            {(model.overallBenchmarkScore || 0).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 max-sm:text-[10px]">
                            Efficiency
                          </p>
                          <p className="text-sm font-medium text-neutral-950 dark:text-white max-sm:text-xs">
                            {getEfficiency(model)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

// PricingInfo component
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
    <section className="box-border w-full border grid grid-cols-1 md:grid-cols-3 gap-10 bg-white dark:bg-neutral-900 p-6 rounded-[14px] border-solid border-[rgba(0,0,0,0.10)] max-md:gap-6 max-sm:p-4 max-sm:gap-4">
      <header className="col-span-full mb-6 max-sm:mb-4">
        <h2 className="box-border text-neutral-950 dark:text-white text-base font-semibold leading-4 mb-2 max-sm:text-sm">
          Understanding AI Model Pricing
        </h2>
        <p className="box-border text-[#717182] text-base font-normal leading-6 max-sm:text-sm max-sm:leading-5">
          How different providers structure their pricing models
        </p>
      </header>
      {pricingModels.map((model, index) => (
        <article
          key={index}
          className="box-border flex flex-col gap-3 max-sm:gap-2"
        >
          <div className="mb-2 max-sm:mb-1 max-sm:scale-90 max-sm:origin-left">
            {model.icon}
          </div>
          <h3 className="box-border text-neutral-950 dark:text-white text-base font-normal leading-6 max-sm:text-sm max-sm:leading-5">
            {model.title}
          </h3>
          <p className="box-border text-[#717182] text-sm font-normal leading-5 mb-3 max-sm:text-xs max-sm:mb-2">
            {model.description}
          </p>
          <ul className="space-y-1 max-sm:space-y-0.5">
            {model.features.map((feature, featureIndex) => (
              <li
                key={featureIndex}
                className="box-border text-neutral-950 dark:text-neutral-100 text-xs font-normal leading-4 max-sm:text-[10px] max-sm:leading-3"
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
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [calculatedCosts, setCalculatedCosts] = useState<{
    [modelName: string]: {
      inputCost: number;
      outputCost: number;
      totalCost: number;
    };
  }>({});

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await api.getPricingData();

        if (response.success) {
          setPricingData(response.data);

          // Auto-select first 3 models sorted by name (default sort)
          const modelsWithPricing = response.data
            .filter(
              (model: PricingModel) =>
                (model.inputPrice !== null && model.inputPrice !== undefined) ||
                (model.outputPrice !== null && model.outputPrice !== undefined)
            )
            .sort((a: PricingModel, b: PricingModel) =>
              a.modelName.localeCompare(b.modelName)
            );

          const initialSelection = modelsWithPricing
            .slice(0, 3)
            .map((m: PricingModel) => m.modelName);
          setSelectedModels(initialSelection);
        }
      } catch (error) {
        console.error("Failed to fetch pricing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  const handleModelSelectionChange = (models: string[]) => {
    setSelectedModels(models);
  };

  const handleCalculate = (
    inputTokens: number,
    outputTokens: number,
    imagesGenerated: number,
    audioMinutes: number,
    usagePeriod: string
  ) => {
    // Calculate period multiplier
    let periodMultiplier = 1;
    switch (usagePeriod) {
      case "Per Day":
        periodMultiplier = 30; // Approximate month
        break;
      case "Per Week":
        periodMultiplier = 4; // Approximate month
        break;
      case "Per Month":
      default:
        periodMultiplier = 1;
        break;
    }

    const costs: typeof calculatedCosts = {};

    selectedModels.forEach((modelName) => {
      const model = pricingData.find((m) => m.modelName === modelName);
      if (!model) return;

      const inputPrice =
        typeof model.inputPrice === "number" ? model.inputPrice : 0;
      const outputPrice =
        typeof model.outputPrice === "number" ? model.outputPrice : 0;

      // Calculate costs based on usage
      // Prices are typically per 1K tokens, so divide by 1000
      const inputCost = (inputTokens / 1000) * inputPrice * periodMultiplier;
      const outputCost = (outputTokens / 1000) * outputPrice * periodMultiplier;

      // Image generation cost (assuming $0.02 per image for DALL-E style models)
      // Adjust based on model type if needed
      const imageCost = model.modelType?.toLowerCase().includes("image")
        ? imagesGenerated * 0.02 * periodMultiplier
        : 0;

      // Audio processing cost (assuming $0.006 per minute for audio models)
      // Adjust based on model type if needed
      const audioCost = model.modelType?.toLowerCase().includes("audio")
        ? audioMinutes * 0.006 * periodMultiplier
        : 0;

      const totalCost = inputCost + outputCost + imageCost + audioCost;

      costs[modelName] = {
        inputCost: inputCost + imageCost + audioCost,
        outputCost,
        totalCost,
      };
    });

    setCalculatedCosts(costs);
  };

  return (
    <div className="box-border w-full min-h-screen relative bg-white dark:bg-black">
      <Navigation />
      <main className="box-border w-full min-h-[calc(100vh_-_65px)] bg-[#F6F3FF] dark:bg-black mt-[65px] px-8 py-8 max-md:px-4 max-md:py-8 max-sm:px-2 max-sm:py-4">
        <div className="box-border max-w-screen-xl relative mx-auto">
          <header className="mb-12 max-md:mb-8 max-sm:mb-6">
            <h1 className="box-border text-neutral-950 dark:text-white text-3xl font-semibold leading-9 mb-4 max-md:text-2xl max-md:leading-8 max-sm:text-xl max-sm:leading-7 max-sm:mb-3">
              AI Model Pricing & Cost Analysis
            </h1>
            <p className="box-border text-[#717182] text-base font-normal leading-6 max-w-[660px] max-md:text-sm max-md:leading-5 max-sm:text-xs">
              Compare costs, calculate usage estimates, and find the most
              cost-effective AI models for your needs
            </p>
          </header>
          {loading ? (
            <div className="text-center py-12 max-sm:py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4 max-sm:h-8 max-sm:w-8 max-sm:mb-3"></div>
              <p className="text-neutral-950 dark:text-white text-lg max-sm:text-base">
                Loading pricing data...
              </p>
            </div>
          ) : pricingData.length === 0 ? (
            <div className="box-border bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center max-md:p-8 max-sm:p-6">
              <svg
                className="mx-auto h-16 w-16 text-neutral-400 mb-4 max-sm:h-12 max-sm:w-12 max-sm:mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-neutral-950 dark:text-white mb-3 max-md:text-xl max-sm:text-lg max-sm:mb-2">
                No Pricing Data Available
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-4 max-sm:text-sm max-sm:mb-3">
                No models with pricing information were found in the database.
                This could be because:
              </p>
              <ul className="text-left text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6 space-y-2 max-sm:text-sm max-sm:space-y-1.5 max-sm:mb-4">
                <li>
                  • The database hasn't been populated with pricing data yet
                </li>
                <li>• All pricing data is stored as non-numeric values</li>
                <li>• There's a connection issue with the backend</li>
              </ul>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 max-sm:text-xs">
                Check the browser console and server logs for more details
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-4 mb-4">
                <CostCalculator
                  pricingData={pricingData}
                  selectedModels={selectedModels}
                  onModelSelectionChange={handleModelSelectionChange}
                  onCalculate={handleCalculate}
                />
                <div className="space-y-3">
                  <CostEstimates
                    pricingData={pricingData}
                    selectedModels={selectedModels}
                    calculatedCosts={calculatedCosts}
                  />
                  <CostComparison
                    pricingData={pricingData}
                    selectedModels={selectedModels}
                    calculatedCosts={calculatedCosts}
                  />
                </div>
              </div>
              <div className="space-y-4 mt-3">
                <PerformanceAnalysis
                  pricingData={pricingData}
                  selectedModels={selectedModels}
                />
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
