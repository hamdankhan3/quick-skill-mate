import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <span className="font-display text-xl font-bold text-primary">M</span>
            <span className="font-display text-xl font-bold text-accent">+</span>
            <span className="ml-2 text-sm text-muted-foreground">© 2026 M Plus. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
