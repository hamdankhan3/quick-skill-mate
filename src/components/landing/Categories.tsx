import { motion } from "framer-motion";
import { Wrench, Zap, Droplets, Wind, Paintbrush, SprayCan, Car, HardHat } from "lucide-react";

const categories = [
  { name: "Electrician", icon: Zap, color: "text-yellow-500" },
  { name: "Plumber", icon: Droplets, color: "text-blue-500" },
  { name: "Mechanic", icon: Car, color: "text-red-500" },
  { name: "AC Technician", icon: Wind, color: "text-cyan-500" },
  { name: "Painter", icon: Paintbrush, color: "text-purple-500" },
  { name: "Cleaner", icon: SprayCan, color: "text-green-500" },
  { name: "Handyman", icon: Wrench, color: "text-orange-500" },
  { name: "Construction", icon: HardHat, color: "text-amber-700" },
];

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
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer rounded-xl bg-card border border-border p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <span className="text-sm font-medium">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
