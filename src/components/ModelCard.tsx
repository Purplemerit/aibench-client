import React from "react";
import { useNavigate } from "react-router-dom";

interface ModelCardProps {
  title: string;
  organization: string;
  description: string;
  score: number;
  maxScore?: number;
  badge: {
    type: "api" | "open-source";
    label: string;
  };
  capabilities: string[];
  icon: React.ReactNode;
  featured?: boolean;
  modelId?: string;
  isSelected?: boolean;
  onCompareToggle?: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
  title,
  organization,
  description,
  score,
  maxScore = 100,
  badge,
  capabilities,
  icon,
  featured = false,
  modelId,
  isSelected = false,
  onCompareToggle,
}) => {
  const navigate = useNavigate();
  const progressWidth = (score / maxScore) * 100;

  const badgeColors = {
    api: "bg-[#B388F4] text-[#4A0FAE]",
    "open-source": "bg-green-100 text-[#016630]",
  };

  const badgeIcons = {
    api: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.08984 1.33002V11.33"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.58984 2.83002H4.83984C4.37571 2.83002 3.9306 3.01439 3.60241 3.34258C3.27422 3.67077 3.08984 4.11589 3.08984 4.58002C3.08984 5.04415 3.27422 5.48927 3.60241 5.81745C3.9306 6.14564 4.37571 6.33002 4.83984 6.33002H7.33984C7.80397 6.33002 8.24909 6.51439 8.57728 6.84258C8.90547 7.17077 9.08984 7.61589 9.08984 8.08002C9.08984 8.54415 8.90547 8.98927 8.57728 9.31745C8.24909 9.64564 7.80397 9.83002 7.33984 9.83002H3.08984"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "open-source": (
      <svg
        width="12"
        height="12"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.63989 1.83002V7.83002"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.63989 4.83002C10.4683 4.83002 11.1399 4.15844 11.1399 3.33002C11.1399 2.50159 10.4683 1.83002 9.63989 1.83002C8.81147 1.83002 8.13989 2.50159 8.13989 3.33002C8.13989 4.15844 8.81147 4.83002 9.63989 4.83002Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.63989 10.83C4.46832 10.83 5.13989 10.1584 5.13989 9.33002C5.13989 8.50159 4.46832 7.83002 3.63989 7.83002C2.81147 7.83002 2.13989 8.50159 2.13989 9.33002C2.13989 10.1584 2.81147 10.83 3.63989 10.83Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.63989 4.83002C9.63989 6.02349 9.16579 7.16808 8.32187 8.012C7.47796 8.85591 6.33337 9.33002 5.13989 9.33002"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-start w-full">
      <div className="mb-2">{icon}</div>

      <div className="w-full max-w-[368px] mx-auto h-auto min-h-[337px] relative bg-white dark:bg-black p-5 sm:p-[25px] rounded-xl border border-gray-300 dark:border-gray-700 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-base sm:text-lg font-semibold leading-6 sm:leading-7 text-neutral-950 dark:text-white pr-8">
            {title}
          </h4>

          {featured && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-[31px] right-[25px]"
            >
              <path
                d="M8.66321 2.20001C8.69243 2.14099 8.73756 2.0913 8.79351 2.05656C8.84947 2.02183 8.91402 2.00342 8.97988 2.00342C9.04574 2.00342 9.11029 2.02183 9.16624 2.05656C9.2222 2.0913 9.26733 2.14099 9.29655 2.20001L10.8365 5.31935C10.938 5.52466 11.0878 5.70229 11.273 5.83698C11.4582 5.97168 11.6733 6.05942 11.8999 6.09268L15.3439 6.59668C15.4091 6.60614 15.4704 6.63366 15.5209 6.67615C15.5713 6.71863 15.6088 6.77438 15.6292 6.83708C15.6496 6.89979 15.6521 6.96695 15.6363 7.03097C15.6205 7.09499 15.5871 7.15332 15.5399 7.19935L13.0492 9.62468C12.885 9.78475 12.7621 9.98234 12.6911 10.2004C12.6201 10.4185 12.6033 10.6506 12.6419 10.8767L13.2299 14.3033C13.2414 14.3686 13.2344 14.4357 13.2095 14.4971C13.1847 14.5586 13.1432 14.6118 13.0896 14.6507C13.036 14.6896 12.9725 14.7127 12.9065 14.7173C12.8404 14.7219 12.7743 14.7078 12.7159 14.6767L9.63721 13.058C9.43436 12.9515 9.20866 12.8958 8.97955 12.8958C8.75043 12.8958 8.52473 12.9515 8.32188 13.058L5.24388 14.6767C5.18543 14.7076 5.11948 14.7215 5.05351 14.7169C4.98755 14.7122 4.92422 14.6891 4.87074 14.6502C4.81726 14.6113 4.77577 14.5581 4.75098 14.4968C4.7262 14.4355 4.71912 14.3685 4.73054 14.3033L5.31788 10.8773C5.35668 10.6512 5.33987 10.4189 5.2689 10.2007C5.19794 9.98248 5.07495 9.78478 4.91054 9.62468L2.41988 7.20001C2.37227 7.15404 2.33854 7.09561 2.32252 7.0314C2.3065 6.96718 2.30884 6.89976 2.32926 6.83681C2.34969 6.77386 2.38739 6.71791 2.43806 6.67534C2.48874 6.63276 2.55035 6.60528 2.61588 6.59601L6.05921 6.09268C6.28605 6.05968 6.50147 5.97205 6.68693 5.83734C6.8724 5.70263 7.02235 5.52486 7.12388 5.31935L8.66321 2.20001Z"
                fill="#EFB100"
                stroke="#EFB100"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <p className="text-base font-normal leading-6 text-[#717182] dark:text-white mb-5">
          {organization}
        </p>

        <div
          className={`absolute h-[21px] flex items-center gap-1 px-[8.66px] py-[2.66px] rounded-lg right-5 sm:right-[25px] top-5 sm:top-[25px] ${
            badgeColors[badge.type]
          }`}
        >
          {badgeIcons[badge.type]}
          <span className="text-xs font-semibold leading-4">{badge.label}</span>
        </div>

        <div className="mb-5 flex-grow">
          <p className="text-sm font-normal leading-5 text-[#717182] dark:text-white line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-normal leading-5 text-[#717182] dark:text-white">
              Overall Score
            </span>
            <span className="text-sm font-semibold leading-5 text-neutral-950 dark:text-white">
              {score}
            </span>
          </div>
        </div>

        <div className="w-full h-2 relative bg-[#F6F3FF] dark:bg-black mb-4 rounded-full">
          <div
            className="h-2 bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] rounded-full border border-[#8A4DDF]"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="flex gap-1 flex-wrap mb-6">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="h-[21px] border flex items-center px-[8.66px] py-[2.66px] rounded-lg border-solid border-[#F6F3FF] dark:border-black"
            >
              <span className="text-xs font-semibold leading-4 text-neutral-950 dark:text-white text-center">
                {capability}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto w-full">
          <button
            onClick={() => modelId && navigate(`/model/${modelId}`)}
            className="flex-1 h-8 border flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer transition-all duration-200 bg-white dark:bg-black rounded-lg border-solid border-[#6931C9] hover:bg-gray-50 dark:hover:bg-black"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-4 sm:h-4"
            >
              <path
                d="M10.0598 2H14.0598V6"
                stroke="#212121"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.72656 9.33333L14.0599 2"
                stroke="#212121"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0598 8.66667V12.6667C12.0598 13.0203 11.9193 13.3594 11.6693 13.6095C11.4192 13.8595 11.0801 14 10.7265 14H3.39315C3.03953 14 2.70039 13.8595 2.45034 13.6095C2.20029 13.3594 2.05981 13.0203 2.05981 12.6667V5.33333C2.05981 4.97971 2.20029 4.64057 2.45034 4.39052C2.70039 4.14048 3.03953 4 3.39315 4H7.39315"
                stroke="#212121"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs sm:text-sm font-semibold leading-5 text-center text-[#212121] dark:text-white">
              Details
            </span>
          </button>

          <button
            onClick={onCompareToggle}
            className={`flex-1 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg ${
              isSelected
                ? "bg-green-500 hover:bg-green-600"
                : "bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] hover:opacity-90"
            }`}
          >
            <span className="text-xs sm:text-sm font-semibold leading-5 text-center text-white">
              {isSelected ? "Selected" : "Compare"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
