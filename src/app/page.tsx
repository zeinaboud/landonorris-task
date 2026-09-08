import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Intro from "./components/intro/Intro";

const page = () => {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Hero />
      <Navbar />
      <Intro />
    </main>
  );
};

export default page;
