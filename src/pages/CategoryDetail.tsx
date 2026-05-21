import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, MapPin, Star } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategory, CATEGORIES } from "@/lib/categories";

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const cat = slug ? getCategory(slug) : undefined;

  if (!cat) return <Navigate to="/categories" replace />;
  const Icon = cat.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-br from-primary/5 via-transparent to-accent/5 py-12">
          <div className="container">
            <Link to="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4 mr-1" /> All categories
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border ${cat.color}`}>
                <Icon className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-4xl md:text-5xl font-bold">{cat.name}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{cat.tagline}</p>
              </div>
              <Button size="lg" asChild>
                <Link to="/signup">Post a Job</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-semibold mb-3">About this service</h2>
                <p className="text-muted-foreground leading-relaxed">{cat.description}</p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Common jobs</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {cat.commonJobs.map((job) => (
                    <div key={job} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm font-medium">{job}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Available workers</h2>
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
                  <p className="text-muted-foreground">
                    Worker listings will appear here once pros sign up in your area.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/signup">Be the first {cat.name.toLowerCase()} to join</Link>
                  </Button>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">How M+ works</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li><span className="text-foreground font-medium">1.</span> Post your job & price</li>
                  <li><span className="text-foreground font-medium">2.</span> Get offers from nearby pros</li>
                  <li><span className="text-foreground font-medium">3.</span> Chat, negotiate, hire</li>
                  <li><span className="text-foreground font-medium">4.</span> Pay cash, rate the work</li>
                </ol>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">Why choose M+</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><Star className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Verified reviews</li>
                  <li className="flex gap-2"><MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Local workers near you</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Transparent pricing</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-border py-12 bg-secondary/30">
          <div className="container">
            <h2 className="font-display text-2xl font-semibold mb-6">Explore other services</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  to={`/categories/${c.slug}`}
                  className="group rounded-xl border border-border bg-card p-4 text-center hover:border-primary/40 transition-all"
                >
                  <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${c.color}`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{c.name}</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Badge variant="secondary">8 categories available</Badge>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetail;
