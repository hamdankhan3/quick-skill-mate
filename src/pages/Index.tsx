import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Categories from "@/components/landing/Categories";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories />
        <HowItWorks />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
