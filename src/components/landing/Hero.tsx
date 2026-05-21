import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            Trusted by 1,000+ customers
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Hire skilled workers.{" "}
            <span className="text-primary">Negotiate.</span>{" "}
            <span className="text-accent">Get it done.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Find electricians, plumbers, mechanics, and more near you. Set your price, negotiate directly, and get quality work done — fast.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
              <Link to="/hire">
                Hire a Worker <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
              <Link to="/offer">Offer Your Services</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
