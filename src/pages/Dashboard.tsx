import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Briefcase, HandCoins, LogOut, Plus, Search } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCategory } from "@/lib/categories";
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;
type Offer = Tables<"offers">;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [myOffers, setMyOffers] = useState<(Offer & { jobs: Job | null })[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login?redirect=/dashboard");
        return;
      }
      const uid = session.user.id;

      const [{ data: profile }, { data: roleRows }, { data: jobs }, { data: offers }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", uid).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("jobs").select("*").eq("customer_id", uid).order("created_at", { ascending: false }),
        supabase.from("offers").select("*, jobs(*)").eq("worker_id", uid).order("created_at", { ascending: false }),
      ]);

      setFullName(profile?.full_name ?? session.user.email ?? "");
      setRoles((roleRows ?? []).map((r) => r.role));
      setMyJobs(jobs ?? []);
      setMyOffers((offers as any) ?? []);
      setLoading(false);
    })();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isWorker = roles.includes("worker");
  const isCustomer = roles.includes("customer") || roles.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 bg-secondary/20">
        <div className="container max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Welcome, {fullName.split(" ")[0]}</h1>
              <div className="flex gap-2 mt-2">
                {roles.map((r) => (
                  <Badge key={r} variant="secondary" className="capitalize">{r}</Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {isCustomer && (
              <Button size="lg" className="h-auto py-4 justify-start" asChild>
                <Link to="/hire"><Plus className="h-5 w-5 mr-3" /> Post a new job</Link>
              </Button>
            )}
            {isWorker && (
              <Button size="lg" variant="outline" className="h-auto py-4 justify-start" asChild>
                <Link to="/offer"><Search className="h-5 w-5 mr-3" /> Browse open jobs</Link>
              </Button>
            )}
          </div>

          {isCustomer && (
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Your jobs
              </h2>
              {myJobs.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">
                  You haven't posted any jobs yet. <Link to="/hire" className="text-primary underline">Post one now</Link>.
                </CardContent></Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {myJobs.map((j) => {
                    const cat = getCategory(j.category);
                    return (
                      <Card key={j.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <CardTitle className="text-lg">{j.title}</CardTitle>
                              <CardDescription>{cat?.name} · {j.location}</CardDescription>
                            </div>
                            <Badge variant={j.status === "pending" ? "secondary" : "default"} className="capitalize">{j.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{j.description}</p>
                          <p className="mt-3 text-sm font-medium">${Number(j.offered_price).toFixed(0)}{j.price_type === "hourly" ? "/hr" : ""}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {isWorker && (
            <section>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <HandCoins className="h-5 w-5 text-accent" /> Your offers
              </h2>
              {myOffers.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">
                  No offers sent yet. <Link to="/offer" className="text-primary underline">Browse jobs</Link>.
                </CardContent></Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {myOffers.map((o) => (
                    <Card key={o.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-lg">{o.jobs?.title ?? "Job"}</CardTitle>
                            <CardDescription>{o.jobs?.location}</CardDescription>
                          </div>
                          <Badge variant={o.status === "pending" ? "secondary" : "default"} className="capitalize">{o.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Your offer: <span className="font-medium">${Number(o.offer_price).toFixed(0)}</span></p>
                        {o.message && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{o.message}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
