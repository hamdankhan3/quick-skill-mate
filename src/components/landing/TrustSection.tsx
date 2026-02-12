import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, Users } from "lucide-react";

const features = [
  { icon: Shield, title: "Verified Workers", desc: "Every worker is reviewed and rated by real customers." },
  { icon: DollarSign, title: "Fair Pricing", desc: "You set the price. Workers can negotiate. No hidden fees." },
  { icon: Clock, title: "Fast Response", desc: "Get offers from nearby workers within minutes." },
  { icon: Users, title: "Growing Community", desc: "Join thousands of satisfied customers and skilled workers." },
];

const TrustSection = () => {
  return (
    <section id="trust" className="py-20 bg-primary/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">Why Choose M+</h2>
          <p className="mt-3 text-muted-foreground text-lg">Built on trust, transparency, and quality</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-card border border-border p-6"
            >
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
