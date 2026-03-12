import React from "react";
import Banner from "../components/home/Banner";
import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import Testinmonials from "../components/home/Testinmonials";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div>
      <Banner />
      <HeroSection />
      <FeatureSection />
      <Testinmonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
