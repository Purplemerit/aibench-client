import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "./ui/sheet";
import { Menu } from "lucide-react";

const Navigation = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.body.classList.contains("dark");
  });
  const isMobile = useIsMobile();

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;

      // Create shredder effect overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      `;

      document.body.appendChild(overlay);

      // Create vertical strips like a paper shredder
      const stripCount = 40;
      const stripWidth = window.innerWidth / stripCount;

      for (let i = 0; i < stripCount; i++) {
        const strip = document.createElement("div");
        const delay = i * 15; // Staggered shredding effect
        const randomDuration = 600 + Math.random() * 300; // Varying speeds

        strip.style.cssText = `
          position: absolute;
          left: ${i * stripWidth}px;
          top: 0;
          width: ${stripWidth}px;
          height: 100%;
          background: ${
            next ? "rgba(0, 0, 0, 0.98)" : "rgba(255, 255, 255, 0.98)"
          };
          transform: translateY(-100%) scaleY(0);
          transform-origin: top;
          animation: shredFall ${randomDuration}ms ease-in-out forwards;
          animation-delay: ${delay}ms;
          box-shadow: ${
            i % 2 === 0
              ? "inset -1px 0 2px rgba(0,0,0,0.1)"
              : "inset 1px 0 2px rgba(0,0,0,0.1)"
          };
        `;

        overlay.appendChild(strip);
      }

      // Add keyframe animation for shredding effect
      if (!document.querySelector("#shred-animation-style")) {
        const style = document.createElement("style");
        style.id = "shred-animation-style";
        style.textContent = `
          @keyframes shredFall {
            0% {
              transform: translateY(-100%) scaleY(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            40% {
              transform: translateY(0) scaleY(1);
            }
            60% {
              transform: translateY(0) scaleY(1);
              opacity: 1;
            }
            100% {
              transform: translateY(100%) scaleY(0.8);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Toggle dark mode class during the animation
      setTimeout(() => {
        if (next) {
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark");
        }
      }, 400);

      // Clean up overlay
      setTimeout(() => {
        overlay.remove();
      }, 1400);

      return next;
    });
  };

  // Nav links as a component for reuse
  const NavLinks = () => (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `text-base font-normal leading-6 cursor-pointer transition-colors duration-200
          ${
            isDarkMode
              ? isActive
                ? "text-white font-bold underline underline-offset-8 decoration-purple-400"
                : "text-gray-400 hover:text-white"
              : isActive
              ? "text-neutral-950 font-semibold underline underline-offset-8 decoration-purple-600"
              : "text-[#717182] hover:text-neutral-950"
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `text-base font-normal leading-6 cursor-pointer transition-colors duration-200
          ${
            isDarkMode
              ? isActive
                ? "text-white font-bold underline underline-offset-8 decoration-purple-400"
                : "text-gray-400 hover:text-white"
              : isActive
              ? "text-neutral-950 font-semibold underline underline-offset-8 decoration-purple-600"
              : "text-[#717182] hover:text-neutral-950"
          }`
        }
      >
        Leaderboard
      </NavLink>
      <NavLink
        to="/benchmarks"
        className={({ isActive }) =>
          `text-base font-normal leading-6 cursor-pointer transition-colors duration-200
          ${
            isDarkMode
              ? isActive
                ? "text-white font-bold underline underline-offset-8 decoration-purple-400"
                : "text-gray-400 hover:text-white"
              : isActive
              ? "text-neutral-950 font-semibold underline underline-offset-8 decoration-purple-600"
              : "text-[#717182] hover:text-neutral-950"
          }`
        }
      >
        Benchmarks
      </NavLink>
      <NavLink
        to="/pricing"
        className={({ isActive }) =>
          `text-base font-normal leading-6 cursor-pointer transition-colors duration-200
          ${
            isDarkMode
              ? isActive
                ? "text-white font-bold underline underline-offset-8 decoration-purple-400"
                : "text-gray-400 hover:text-white"
              : isActive
              ? "text-neutral-950 font-semibold underline underline-offset-8 decoration-purple-600"
              : "text-[#717182] hover:text-neutral-950"
          }`
        }
      >
        Pricing
      </NavLink>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 box-border flex items-center w-full h-16 px-20 py-4 max-md:px-10 max-sm:px-5 bg-white dark:bg-black text-neutral-950 dark:text-white border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center z-10">
        <div className="box-border w-8 h-8 flex items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] mr-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33325 11.6667C3.17555 11.6672 3.02094 11.623 2.88737 11.5391C2.75381 11.4553 2.64677 11.3353 2.5787 11.193C2.51063 11.0508 2.48432 10.8921 2.50283 10.7355C2.52133 10.5789 2.5839 10.4308 2.68325 10.3083L10.9332 1.80833C10.9951 1.73689 11.0795 1.68862 11.1724 1.67144C11.2653 1.65425 11.3613 1.66917 11.4447 1.71375C11.528 1.75832 11.5937 1.82991 11.631 1.91675C11.6683 2.00359 11.675 2.10053 11.6499 2.19166L10.0499 7.20833C10.0027 7.3346 9.98689 7.47043 10.0037 7.60417C10.0206 7.7379 10.0696 7.86556 10.1467 7.97618C10.2237 8.0868 10.3264 8.17709 10.446 8.23929C10.5656 8.3015 10.6984 8.33377 10.8332 8.33333H16.6666C16.8243 8.33279 16.9789 8.37701 17.1124 8.46084C17.246 8.54468 17.3531 8.6647 17.4211 8.80695C17.4892 8.94919 17.5155 9.10784 17.497 9.26444C17.4785 9.42105 17.4159 9.56919 17.3166 9.69166L9.06658 18.1917C9.00469 18.2631 8.92036 18.3114 8.82743 18.3285C8.73449 18.3457 8.63848 18.3308 8.55514 18.2862C8.4718 18.2417 8.40609 18.1701 8.3688 18.0832C8.33151 17.9964 8.32485 17.8995 8.34991 17.8083L9.94991 12.7917C9.99709 12.6654 10.0129 12.5296 9.99609 12.3958C9.97924 12.2621 9.9302 12.1344 9.85317 12.0238C9.77614 11.9132 9.67343 11.8229 9.55385 11.7607C9.43426 11.6985 9.30137 11.6662 9.16658 11.6667H3.33325Z"
              stroke={isDarkMode ? "#000" : "white"}
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-lg font-normal leading-7 ml-2 text-neutral-950 dark:text-white">
          AIBench
        </div>
      </div>

      {/* Desktop nav links */}
      {!isMobile && (
        <div className="flex items-center justify-center w-full absolute left-0 top-0 h-full pointer-events-none">
          <div className="flex items-center gap-6 pointer-events-auto">
            <NavLinks />
          </div>
        </div>
      )}

      {/* Dark mode toggle and hamburger menu */}
      <div className="ml-auto flex items-center gap-3 z-10">
        {/* Dark mode toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className={`relative flex items-center focus:outline-none w-20 h-10 rounded-full p-1 transition-colors duration-300
            max-md:w-14 max-md:h-8 max-md:p-1
            ${isDarkMode ? "bg-[#232136]" : "bg-[#F1EBFF] dark:bg-black"}`}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {/* Sliding indicator */}
            <div
              className={`absolute w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-300
              max-md:w-6 max-md:h-6
              ${
                isDarkMode
                  ? "bg-gray-800 left-1 transform translate-x-10 max-md:translate-x-6"
                  : "bg-white dark:bg-black left-1 transform translate-x-0"
              }`}
            >
              {isDarkMode ? (
                <svg
                  className="w-4 h-4 max-md:w-3 max-md:h-3"
                  fill="none"
                  stroke="yellow"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 max-md:w-3 max-md:h-3"
                  fill="none"
                  stroke="orange"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
                  />
                </svg>
              )}
            </div>

            {/* Text labels */}
            <div className="flex w-full justify-between px-2">
              <span
                className={`text-xs font-semibold transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-neutral-950"
                }`}
              >
                L
              </span>
              <span
                className={`text-xs font-semibold transition-colors duration-300 ${
                  isDarkMode ? "text-yellow-200" : "text-gray-400"
                }`}
              >
                D
              </span>
            </div>
          </button>
        </div>

        {/* Mobile hamburger menu */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent"
                aria-label="Open navigation menu"
                type="button"
              >
                <Menu className="w-7 h-7" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex flex-col gap-6 pt-6 w-64"
            >
              <span className="sr-only">
                <SheetTitle>Menu</SheetTitle>
              </span>
              {/* Logo and Brand Name */}
              <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="box-border w-8 h-8 flex items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,_#B18BEF_0%,_#4B00A8_100%)] mr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.33325 11.6667C3.17555 11.6672 3.02094 11.623 2.88737 11.5391C2.75381 11.4553 2.64677 11.3353 2.5787 11.193C2.51063 11.0508 2.48432 10.8921 2.50283 10.7355C2.52133 10.5789 2.5839 10.4308 2.68325 10.3083L10.9332 1.80833C10.9951 1.73689 11.0795 1.68862 11.1724 1.67144C11.2653 1.65425 11.3613 1.66917 11.4447 1.71375C11.528 1.75832 11.5937 1.82991 11.631 1.91675C11.6683 2.00359 11.675 2.10053 11.6499 2.19166L10.0499 7.20833C10.0027 7.3346 9.98689 7.47043 10.0037 7.60417C10.0206 7.7379 10.0696 7.86556 10.1467 7.97618C10.2237 8.0868 10.3264 8.17709 10.446 8.23929C10.5656 8.3015 10.6984 8.33377 10.8332 8.33333H16.6666C16.8243 8.33279 16.9789 8.37701 17.1124 8.46084C17.246 8.54468 17.3531 8.6647 17.4211 8.80695C17.4892 8.94919 17.5155 9.10784 17.497 9.26444C17.4785 9.42105 17.4159 9.56919 17.3166 9.69166L9.06658 18.1917C9.00469 18.2631 8.92036 18.3114 8.82743 18.3285C8.73449 18.3457 8.63848 18.3308 8.55514 18.2862C8.4718 18.2417 8.40609 18.1701 8.3688 18.0832C8.33151 17.9964 8.32485 17.8995 8.34991 17.8083L9.94991 12.7917C9.99709 12.6654 10.0129 12.5296 9.99609 12.3958C9.97924 12.2621 9.9302 12.1344 9.85317 12.0238C9.77614 11.9132 9.67343 11.8229 9.55385 11.7607C9.43426 11.6985 9.30137 11.6662 9.16658 11.6667H3.33325Z"
                      stroke={isDarkMode ? "#000" : "white"}
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-lg font-semibold leading-7 ml-2 text-neutral-950 dark:text-white">
                  AIBench
                </div>
              </div>
              <NavLinks />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
