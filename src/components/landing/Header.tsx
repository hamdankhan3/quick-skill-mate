import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthReady } from "@/hooks/useAuthReady";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, isReady } = useAuthReady();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-display text-2xl font-bold text-primary">M</span>
          <span className="font-display text-2xl font-bold text-accent">+</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</a>
          <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="/#trust" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Why M+</a>
        </nav>

        <div className="hidden md:flex items-center gap-3 min-w-[180px] justify-end">
          {!isReady ? null : user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/login">Log In</Link></Button>
              <Button asChild><Link to="/signup">Get Started</Link></Button>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 mt-8">
              <a href="/#categories" onClick={() => setOpen(false)} className="text-lg font-medium">Services</a>
              <a href="/#how-it-works" onClick={() => setOpen(false)} className="text-lg font-medium">How It Works</a>
              <a href="/#trust" onClick={() => setOpen(false)} className="text-lg font-medium">Why M+</a>
              <hr className="border-border" />
              {!isReady ? null : user ? (
                <>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>Sign out</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild onClick={() => setOpen(false)}><Link to="/login">Log In</Link></Button>
                  <Button asChild onClick={() => setOpen(false)}><Link to="/signup">Get Started</Link></Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
