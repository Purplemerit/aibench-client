import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

interface Model {
  _id: string;
  modelName: string;
  organization: string;
  modelType?: string;
  overallBenchmarkScore?: number;
  globalRankPosition?: number;
  openSource?: string;
}

interface ScoredModel extends Model {
  searchScore: number;
}

interface SearchWithDropdownProps {
  placeholder?: string;
  isDark?: boolean;
  onSearch?: (value: string) => void;
}

const SearchWithDropdown: React.FC<SearchWithDropdownProps> = ({
  placeholder = "Search by model name...",
  isDark = false,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Model[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when search value changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.getAllModels({ limit: 200 });
        if (response.success && response.data) {
          const searchTerm = searchValue.toLowerCase().trim();
          const searchWords = searchTerm.split(/\s+/);

          // Smart filtering with ranking
          const filtered = response.data
            .filter((model: Model) => {
              // Check if all search words are present (case-insensitive)
              return searchWords.every((word) => {
                const wordRegex = new RegExp(
                  word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                  "i"
                );
                return (
                  wordRegex.test(model.modelName || "") ||
                  wordRegex.test(model.organization || "")
                );
              });
            })
            .map((model: Model) => {
              const modelName = model.modelName?.toLowerCase() || "";
              const organization = model.organization?.toLowerCase() || "";

              let score = 0;

              // Exact match gets highest score
              if (modelName === searchTerm || organization === searchTerm) {
                score += 1000;
              }

              // Starts with search term
              if (
                modelName.startsWith(searchTerm) ||
                organization.startsWith(searchTerm)
              ) {
                score += 500;
              }

              // Word boundary match (e.g., "gpt" matches "GPT-4")
              searchWords.forEach((word) => {
                const wordBoundaryRegex = new RegExp(
                  `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
                  "i"
                );
                if (wordBoundaryRegex.test(model.modelName || "")) score += 100;
                if (wordBoundaryRegex.test(model.organization || ""))
                  score += 50;
              });

              // Rank position bonus (higher rank = better)
              if (model.globalRankPosition) {
                score += Math.max(0, 100 - model.globalRankPosition);
              }

              return { ...model, searchScore: score };
            })
            .sort(
              (a: ScoredModel, b: ScoredModel) => b.searchScore - a.searchScore
            )
            .slice(0, 10);

          setSuggestions(filtered);
          setIsOpen(filtered.length > 0);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleModelClick = (modelId: string) => {
    navigate(`/model/${modelId}`);
    setIsOpen(false);
    setSearchValue("");
  };

  return (
    <div ref={dropdownRef} className="w-full h-full relative">
      <div
        className={`w-full h-full flex items-center px-3 sm:px-4 py-3 sm:py-0 rounded-lg transition-colors duration-300 border ${
          isDark
            ? "bg-[#232136] border-[rgba(255,255,255,0.10)]"
            : "bg-white border-[rgba(0,0,0,0.10)] shadow-sm"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 sm:mr-3 flex-shrink-0"
        >
          <path
            d="M14.5401 14.33L11.6467 11.4367"
            stroke="#717182"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.87337 12.9967C10.8189 12.9967 13.2067 10.6089 13.2067 7.66335C13.2067 4.71783 10.8189 2.33002 7.87337 2.33002C4.92785 2.33002 2.54004 4.71783 2.54004 7.66335C2.54004 10.6089 4.92785 12.9967 7.87337 12.9967Z"
            stroke="#717182"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 text-sm sm:text-base font-normal text-[#717182] dark:text-white bg-transparent border-none outline-none placeholder:text-[#717182]"
        />

        {loading && (
          <div className="ml-2">
            <svg
              className="animate-spin h-4 w-4 text-[#717182]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg border overflow-hidden z-50 max-h-[60vh] sm:max-h-96 overflow-y-auto ${
            isDark
              ? "bg-[#232136] border-[rgba(255,255,255,0.10)]"
              : "bg-white border-[rgba(0,0,0,0.10)]"
          }`}
        >
          {suggestions.map((model) => (
            <div
              key={model._id}
              onClick={() => handleModelClick(model._id)}
              className={`p-3 sm:p-4 cursor-pointer transition-colors border-b last:border-b-0 ${
                isDark
                  ? "border-[rgba(255,255,255,0.05)] hover:bg-[rgba(177,139,239,0.15)]"
                  : "border-[rgba(0,0,0,0.05)] hover:bg-[rgba(177,139,239,0.08)]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-xs sm:text-sm font-semibold mb-1 truncate ${
                      isDark ? "text-white" : "text-neutral-950"
                    }`}
                  >
                    {model.modelName}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#717182] dark:text-neutral-400 truncate">
                    {model.organization}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                  {model.globalRankPosition && (
                    <div
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold ${
                        model.globalRankPosition <= 3
                          ? "bg-gradient-to-b from-brand-500 via-brand-600 to-brand-800 text-white"
                          : "bg-brand-50 text-brand-900"
                      }`}
                    >
                      #{model.globalRankPosition}
                    </div>
                  )}

                  {model.modelType && (
                    <div
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium border ${
                        isDark
                          ? "border-[rgba(255,255,255,0.10)] text-white"
                          : "border-[rgba(0,0,0,0.10)] text-neutral-950"
                      }`}
                    >
                      {model.modelType}
                    </div>
                  )}
                </div>
              </div>

              {model.overallBenchmarkScore !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-[#717182] dark:text-neutral-400">
                    Score:
                  </span>
                  <div className="flex-1 max-w-[80px] sm:max-w-[120px] h-1 sm:h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 rounded-full"
                      style={{
                        width: `${Math.min(model.overallBenchmarkScore, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-neutral-950 dark:text-white">
                    {model.overallBenchmarkScore.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWithDropdown;
