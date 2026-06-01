import SEO from "@/components/SEO";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Categories from "@/components/landing/Categories";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="M Plus — Hire Local Skilled Workers & Offer Services"
        description="Post a job, get offers from trusted local electricians, plumbers, mechanics, painters and more. Negotiate the price, pay cash on completion."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "M Plus",
          url: "https://quick-skill-mate.lovable.app/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://quick-skill-mate.lovable.app/categories?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
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
