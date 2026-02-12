import { motion } from "framer-motion";
import { ClipboardList, MessageSquare, Handshake, Star } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Post Your Job",
    description: "Describe the work you need, set your budget, and choose a time.",
  },
  {
    icon: MessageSquare,
    title: "Get Offers",
    description: "Nearby workers respond with their price. Negotiate directly.",
  },
  {
    icon: Handshake,
    title: "Hire & Track",
    description: "Accept an offer, track progress, and get the job done.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Leave a review to help the community find great workers.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mt-3 text-muted-foreground text-lg">Get quality work done in 4 simple steps</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="absolute -top-2 -right-2 md:right-auto md:-top-2 md:-left-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
