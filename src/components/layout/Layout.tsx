import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingCTA from "./FloatingCTA";
import { usePageTracker } from "@/hooks/useTracker";

const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  usePageTracker();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Layout;
