import React, { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
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
      className={`w-full min-h-[400px] max-md:min-h-[300px] h-auto flex flex-col items-center justify-center mt-[65px] px-20 max-md:px-10 max-sm:px-4 max-sm:text-center`}
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
      <h1 className="text-6xl font-semibold leading-[60px] tracking-[-1.5px] text-center max-w-[932px] mb-[15px] max-md:text-5xl max-md:leading-[52px] max-sm:text-4xl max-sm:leading-10">
        <span className="text-neutral-950 dark:text-white">Compare </span>
        <span className="bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] bg-clip-text text-transparent">
          AI Models{" "}
        </span>
        <span className="text-neutral-950 dark:text-white">
          Across Modalities
        </span>
      </h1>

      <p className="text-xl font-normal leading-7 text-[#717182] dark:text-gray-300 text-center max-w-[670px] mb-10 max-md:text-lg max-md:leading-6 max-sm:text-base max-sm:leading-5">
        Data-driven, transparent benchmarks for text, image, audio, and
        multimodal AI models
      </p>

      <div className="w-[672px] h-12 mb-6 max-md:w-full max-md:max-w-[500px] max-sm:w-full">
        <SearchInput onSearch={handleSearch} isDark={isDark} />
      </div>
    </section>
  );
};

export default HeroSection;
