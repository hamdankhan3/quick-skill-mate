import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CATEGORIES, CategorySlug } from "@/lib/categories";

const jobSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters").max(120),
  description: z.string().trim().min(15, "Please describe the job in more detail").max(2000),
  category: z.enum([
    "electrician", "plumber", "mechanic", "ac_technician",
    "painter", "cleaner", "handyman", "construction",
  ]),
  location: z.string().trim().min(3, "Location is required").max(200),
  price_type: z.enum(["fixed", "hourly"]),
  offered_price: z.coerce.number().positive("Price must be greater than 0").max(1_000_000),
  preferred_time: z.string().optional(),
});

const HireWorkers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [authChecking, setAuthChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategorySlug>(
    (searchParams.get("category") as CategorySlug) || "electrician"
  );
  const [location, setLocation] = useState("");
  const [priceType, setPriceType] = useState<"fixed" | "hourly">("fixed");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login?redirect=/hire");
      } else {
        setUserId(session.user.id);
        setAuthChecking(false);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = jobSchema.safeParse({
      title, description, category, location,
      price_type: priceType, offered_price: offeredPrice, preferred_time: preferredTime,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!userId) return;
    setSubmitting(true);
    const { error } = await supabase.from("jobs").insert({
      customer_id: userId,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      location: parsed.data.location,
      price_type: parsed.data.price_type,
      offered_price: parsed.data.offered_price,
      preferred_time: parsed.data.preferred_time ? new Date(parsed.data.preferred_time).toISOString() : null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message.includes("row-level") ? "Only customers can post jobs. Sign up as a customer." : error.message);
      return;
    }
    toast.success("Job posted! Workers can now send offers.");
    navigate("/offer");
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 bg-secondary/20">
        <div className="container max-w-2xl">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-3xl">Hire a Worker</CardTitle>
                <CardDescription>Describe your job. Skilled pros nearby will send you offers.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job title</Label>
                    <Input id="title" placeholder="e.g. Fix leaking kitchen sink" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as CategorySlug)}>
                      <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Describe the work</Label>
                    <Textarea id="description" rows={5} maxLength={2000} placeholder="Share details, materials, access info..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Area, city or address" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={200} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_type">Pricing</Label>
                      <Select value={priceType} onValueChange={(v) => setPriceType(v as "fixed" | "hourly")}>
                        <SelectTrigger id="price_type"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed price</SelectItem>
                          <SelectItem value="hourly">Hourly rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Your offer ($)</Label>
                      <Input id="price" type="number" min="1" step="0.01" placeholder="50" value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred time (optional)</Label>
                    <Input id="time" type="datetime-local" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? "Posting..." : "Post Job"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Payment is cash on completion. M Plus tracks a 10% platform fee.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HireWorkers;
