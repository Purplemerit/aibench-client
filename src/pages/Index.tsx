import React from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedModels from "@/components/FeaturedModels";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600&display=swap"
      />

      <main className="pt-16">
        <HeroSection />
        <FeaturedModels />
        <LeaderboardPreview />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
