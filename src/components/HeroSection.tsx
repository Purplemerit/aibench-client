import React, { useEffect, useState } from "react";
import SearchWithDropdown from "./SearchWithDropdown";
import CategoryFilter from "./CategoryFilter";

const HeroSection = () => {
  const categories = [
    "All",
    "Text",
    "Image",
    "Audio",
    "Video",
    "Reasoning",
    "Multi-Modal",
  ];

  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" && document.body.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark"));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  const handleCategoryChange = (category: string) => {
    console.log("Category:", category);
  };

  return (
    <section
      className="w-full min-h-[400px] md:min-h-[450px] lg:min-h-[500px] h-auto flex flex-col items-center justify-center mt-[65px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16"
      style={
        isDark
          ? { backgroundColor: "#000" }
          : {
              backgroundImage:
                "url('https://api.builder.io/api/v1/image/assets/TEMP/d3493e73b42d3cb1b32aa3c6bbb80f34174df5f0?width=2880')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight sm:leading-[44px] md:leading-[52px] lg:leading-[60px] tracking-tight md:tracking-[-1.5px] text-center max-w-[932px] mb-4 sm:mb-5 md:mb-6 px-2">
        <span className="text-neutral-950 dark:text-white">Compare </span>
        <span className="bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] bg-clip-text text-transparent">
          AI Models{" "}
        </span>
        <span className="text-neutral-950 dark:text-white">
          Across Modalities
        </span>
      </h1>

      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-5 sm:leading-6 md:leading-7 text-[#717182] dark:text-gray-300 text-center max-w-[90%] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[670px] mb-6 sm:mb-8 md:mb-10 px-2">
        Data-driven, transparent benchmarks for text, image, audio, and
        multimodal AI models
      </p>

      <div className="w-full max-w-[672px] h-12 sm:h-14 md:h-14 px-4 sm:px-6 md:px-0">
        <SearchWithDropdown onSearch={handleSearch} isDark={isDark} />
      </div>
    </section>
  );
};

export default HeroSection;
