import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const Categories = () => {
  return (
    <section id="categories" className="py-20 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">Service Categories</h2>
          <p className="mt-3 text-muted-foreground text-lg">Find the right professional for any job</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="group block rounded-xl bg-card border border-border p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full"
              >
                <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View all categories <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
