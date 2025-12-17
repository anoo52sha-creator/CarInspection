import Hero from "../components/Hero";
import SearchBox from "../components/SearchBox";
import Features from "../components/Features";
import Navbar from "../components/Navbar";

import Pricing from "../components/Pricing";

export default function Home() {
  return (
    <main className="bg-[#020617] min-h-screen">
      <Navbar />
      <Hero />
      <SearchBox />
      <Features />
      <Pricing />
    </main>
  );
}
