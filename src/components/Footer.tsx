import React from "react";

const Footer = () => {
  const footerSections = [
    {
      title: "AIBench",
      description:
        "Transparent AI model comparisons and benchmarks for better decision making.",
      isMain: true,
    },
    {
      title: "Resources",
      links: ["Documentation", "Benchmarks", "Pricing Guide"],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Privacy Policy"],
    },
    {
      title: "Connect",
      links: ["GitHub", "Twitter", "Discord"],
    },
  ];

  return (
    <footer className="w-full bg-[#F6F3FF] dark:bg-[#232136] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 md:pb-12 border-t-[0.667px] border-t-[rgba(0,0,0,0.10)] border-solid">
      <div className="w-full max-w-screen-xl relative mx-auto">
        {/* Mobile Layout: All sections stacked */}
        <div className="grid grid-cols-1 sm:hidden gap-6 mb-6">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-sm font-normal leading-5 text-neutral-950 dark:text-white mb-3">
                {section.title}
              </h4>

              {section.isMain ? (
                <p className="text-xs font-normal leading-4 text-[#717182] dark:text-white">
                  {section.description}
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {section.links?.map((link, linkIndex) => (
                    <button
                      key={linkIndex}
                      className="text-sm font-semibold leading-5 text-[#717182] dark:text-white cursor-pointer transition-colors duration-200 hover:text-neutral-950 dark:hover:text-white text-left"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tablet & Desktop Layout: 2 columns on tablet, 4 on desktop */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-6 sm:mb-8">
          {/* AIBench - takes full row on tablet, 1 col on desktop */}
          <div className="sm:col-span-2 lg:col-span-1 sm:order-1">
            <h4 className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-neutral-950 dark:text-white mb-3 sm:mb-4">
              AIBench
            </h4>
            <p className="text-xs sm:text-sm font-normal leading-4 sm:leading-5 text-[#717182] dark:text-white">
              Transparent AI model comparisons and benchmarks for better
              decision making.
            </p>
          </div>

          {/* Resources - left side second row on tablet */}
          <div className="sm:order-2">
            <h4 className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-neutral-950 dark:text-white mb-3 sm:mb-4">
              Resources
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {["Documentation", "Benchmarks", "Pricing Guide"].map(
                (link, linkIndex) => (
                  <button
                    key={linkIndex}
                    className="text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-[#717182] dark:text-white cursor-pointer transition-colors duration-200 hover:text-neutral-950 dark:hover:text-white text-left"
                  >
                    {link}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Company - right side second row on tablet */}
          <div className="sm:order-3">
            <h4 className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-neutral-950 dark:text-white mb-3 sm:mb-4">
              Company
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {["About Us", "Contact", "Privacy Policy"].map(
                (link, linkIndex) => (
                  <button
                    key={linkIndex}
                    className="text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-[#717182] dark:text-white cursor-pointer transition-colors duration-200 hover:text-neutral-950 dark:hover:text-white text-left"
                  >
                    {link}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Connect - third row on tablet, 4th column on desktop */}
          <div className="sm:col-span-2 lg:col-span-1 sm:order-4">
            <h4 className="text-sm sm:text-base font-normal leading-5 sm:leading-6 text-neutral-950 dark:text-white mb-3 sm:mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {["GitHub", "Twitter", "Discord"].map((link, linkIndex) => (
                <button
                  key={linkIndex}
                  className="text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-[#717182] dark:text-white cursor-pointer transition-colors duration-200 hover:text-neutral-950 dark:hover:text-white text-left"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-center pt-6 sm:pt-8 border-t-[0.667px] border-t-[rgba(0,0,0,0.10)] border-solid">
          <p className="text-xs sm:text-sm font-normal leading-4 sm:leading-5 text-[#717182] dark:text-white text-center">
            © 2024 AIBench. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
