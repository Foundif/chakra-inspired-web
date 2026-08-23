import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Plans from "./pages/Plans";
import Coverage from "./pages/Coverage";
import Faq from "./pages/Faq";
import Services from "./pages/Services";

import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogTag from "./pages/BlogTag";
import NotFound from "./pages/NotFound";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerAccount from "./pages/CustomerAccount";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./hooks/useAuth";
import AdminAuth from "./pages/admin/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Leads from "./pages/admin/Leads";
import SettingsPage from "./pages/admin/SettingsPage";
import PageEditor from "./pages/admin/PageEditor";
import Pipeline from "./pages/admin/Pipeline";
import Analytics from "./pages/admin/Analytics";
import { ProductsAdmin, CategoriesAdmin, GalleryAdmin, TestimonialsAdmin, ServicesAdmin, BlogAdmin } from "./pages/admin";
import SuperAdmin from "./pages/admin/SuperAdmin";
import MaintenancePage from "./pages/admin/Maintenance";
import Reports from "./pages/admin/Reports";
import Logs from "./pages/admin/Logs";
import NetworkMonitoring from "./pages/admin/NetworkMonitoring";
import { CustomersAdmin, PlansAdmin, ConnectionsAdmin, InvoicesAdmin, PaymentsAdmin, TicketsAdmin, StaffAdmin } from "./pages/admin/resources";
import MaintenanceGate from "./components/MaintenanceGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MaintenanceGate>
          <Routes>
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/super" element={<SuperAdmin />} />
            <Route path="/admin/leads" element={<Leads />} />
            <Route path="/admin/pipeline" element={<Pipeline />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/pages" element={<PageEditor />} />
            <Route path="/admin/products" element={<ProductsAdmin />} />
            <Route path="/admin/categories" element={<CategoriesAdmin />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
            <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/blog" element={<BlogAdmin />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/maintenance" element={<MaintenancePage />} />
            <Route path="/admin/customers" element={<CustomersAdmin />} />
            <Route path="/admin/plans" element={<PlansAdmin />} />
            <Route path="/admin/connections" element={<ConnectionsAdmin />} />
            <Route path="/admin/invoices" element={<InvoicesAdmin />} />
            <Route path="/admin/payments" element={<PaymentsAdmin />} />
            <Route path="/admin/tickets" element={<TicketsAdmin />} />
            <Route path="/admin/staff" element={<StaffAdmin />} />
            <Route path="/admin/network" element={<NetworkMonitoring />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/logs" element={<Logs />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/coverage" element={<Coverage />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/services" element={<Services />} />

                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/customer-login" element={<CustomerLogin />} />
                  <Route path="/account" element={<CustomerAccount />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/tag/:tag" element={<BlogTag />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
          </MaintenanceGate>
        </AuthProvider>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
