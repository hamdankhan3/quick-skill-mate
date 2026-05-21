import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Loader2, MapPin, Tag } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CATEGORIES, CategorySlug, getCategory } from "@/lib/categories";
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;

const offerSchema = z.object({
  offer_price: z.coerce.number().positive("Offer must be greater than 0").max(1_000_000),
  message: z.string().trim().max(500).optional(),
});

const OfferServices = () => {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isWorker, setIsWorker] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [filter, setFilter] = useState<CategorySlug | "all">("all");

  const [openJob, setOpenJob] = useState<Job | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login?redirect=/offer");
        return;
      }
      setUserId(session.user.id);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      setIsWorker(!!roles?.some((r) => r.role === "worker"));
      setAuthChecking(false);
    })();
  }, [navigate]);

  useEffect(() => {
    if (authChecking) return;
    (async () => {
      setLoadingJobs(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) toast.error(error.message);
      setJobs(data ?? []);
      setLoadingJobs(false);
    })();
  }, [authChecking]);

  const filtered = useMemo(
    () => (filter === "all" ? jobs : jobs.filter((j) => j.category === filter)),
    [jobs, filter]
  );

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openJob || !userId) return;
    const parsed = offerSchema.safeParse({ offer_price: offerPrice, message: offerMessage });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("offers").insert({
      job_id: openJob.id,
      worker_id: userId,
      offer_price: parsed.data.offer_price,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message.includes("row-level") ? "Only workers can send offers." : error.message);
      return;
    }
    toast.success("Offer sent! The customer will be notified.");
    setOpenJob(null);
    setOfferPrice("");
    setOfferMessage("");
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
        <div className="container max-w-5xl">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Offer Your Services</h1>
              <p className="text-muted-foreground mt-2">Browse open jobs near you and send a competitive offer.</p>
            </div>
            <div className="w-full md:w-64">
              <Label className="text-xs text-muted-foreground">Filter by category</Label>
              <Select value={filter} onValueChange={(v) => setFilter(v as CategorySlug | "all")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isWorker && (
            <Card className="mb-6 border-accent/40 bg-accent/5">
              <CardContent className="py-4 text-sm">
                You're signed in as a customer. To send offers, sign up as a worker.
              </CardContent>
            </Card>
          )}

          {loadingJobs ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No open jobs in this category yet. Check back soon.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((job, i) => {
                const cat = getCategory(job.category);
                const Icon = cat?.icon;
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="h-full hover:border-primary/40 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {Icon && (
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${cat?.color} shrink-0`}>
                                <Icon className="h-5 w-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <CardTitle className="text-lg truncate">{job.title}</CardTitle>
                              <CardDescription className="capitalize">{cat?.name}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            ${Number(job.offered_price).toFixed(0)}{job.price_type === "hourly" ? "/hr" : ""}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                          {job.preferred_time && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(job.preferred_time).toLocaleString()}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{job.price_type}</span>
                        </div>
                        <Button
                          className="w-full"
                          disabled={!isWorker}
                          onClick={() => {
                            setOpenJob(job);
                            setOfferPrice(String(job.offered_price));
                            setOfferMessage("");
                          }}
                        >
                          Send Offer
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={!!openJob} onOpenChange={(o) => !o && setOpenJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send an offer</DialogTitle>
            <DialogDescription>{openJob?.title}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitOffer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offer_price">Your price ($)</Label>
              <Input
                id="offer_price"
                type="number"
                min="1"
                step="0.01"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Customer's offer: ${openJob ? Number(openJob.offered_price).toFixed(2) : ""}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer_message">Message (optional)</Label>
              <Textarea
                id="offer_message"
                rows={4}
                maxLength={500}
                placeholder="Introduce yourself, share your experience..."
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenJob(null)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferServices;
