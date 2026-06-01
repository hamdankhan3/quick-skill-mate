import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/categories";

const CategoriesPage = () => {
  const [query, setQuery] = useState("");
  const filtered = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.tagline.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="All Service Categories — Electricians, Plumbers & More | M Plus"
        description="Browse 8 service categories on M Plus. Find trusted local electricians, plumbers, mechanics, painters, cleaners and more near you."
        path="/categories"
      />
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-br from-primary/5 via-transparent to-accent/5 py-14">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Service <span className="text-primary">Categories</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Browse trusted local pros across every skill. Tap a category to see workers near you.
              </p>
              <div className="mt-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services..."
                  className="pl-9 h-11"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="group block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all h-full"
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-secondary ${cat.color} group-hover:scale-110 transition-transform`}>
                      <cat.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold">{cat.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{cat.tagline}</p>
                    <div className="mt-5 inline-flex items-center text-sm font-medium text-primary">
                      View workers <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No categories match "{query}".</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
