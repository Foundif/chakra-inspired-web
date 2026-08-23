import CrudPage from "./CrudPage";
import BulkImageUpload from "@/components/admin/BulkImageUpload";
import { supabase } from "@/integrations/supabase/client";

export const ProductsAdmin = () => (
  <CrudPage title="Products" description="Manage product listings, images and prices." table="products"
    fields={[
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug", placeholder: "url-friendly-id" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "category_id", label: "Category", type: "select", optionsTable: { table: "categories", valueKey: "id", labelKey: "title" } },
      { key: "short_description", label: "Short description" },
      { key: "description", label: "Full description", type: "textarea" },
      { key: "price", label: "Price", type: "number" },
      { key: "price_label", label: "Price label", placeholder: "e.g. starting from / per 1000" },
      { key: "is_featured", label: "Featured", type: "boolean" },
      { key: "is_active", label: "Active", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ]}
    defaults={{ is_active: true, is_featured: false, sort_order: 0 }}
  />
);

export const CategoriesAdmin = () => (
  <CrudPage title="Product Categories" description="These cards appear in the Products page and Home product grid." table="categories"
    fields={[
      { key: "title", label: "Name" },
      { key: "slug", label: "Slug (URL)" },
      { key: "image_url", label: "Card image", type: "image" },
      { key: "short_description", label: "Short description" },
      { key: "cta_label", label: "CTA label", placeholder: "e.g. Discover" },
      { key: "cta_href", label: "CTA link", placeholder: "/products/your-slug or https://…" },
      { key: "icon", label: "Icon name (lucide)" },
      { key: "is_active", label: "Active", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ]}
    defaults={{ is_active: true, sort_order: 0 }}
  />
);

export { default as GalleryAdmin } from "./GalleryAdmin";


export const TestimonialsAdmin = () => (
  <CrudPage title="Testimonials & Client Logos" description="Used in the Trusted-by carousel and testimonial sections." table="testimonials"
    topBanner={
      <BulkImageUpload
        folder="testimonials"
        label="Bulk upload client logos"
        onUploaded={async (url, file) => {
          const base = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
          await supabase.from("testimonials").insert({
            client_name: base || "Client",
            brand: base,
            logo_url: url,
            is_logo_only: true,
            is_active: true,
            sort_order: 0,
          });
        }}
      />
    }
    fields={[
      { key: "client_name", label: "Client name" },
      { key: "brand", label: "Brand / company" },
      { key: "logo_url", label: "Logo URL", type: "image" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "is_logo_only", label: "Logo only (skip quote)", type: "boolean" },
      { key: "is_active", label: "Active", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ]}
    defaults={{ is_active: true, is_logo_only: false, sort_order: 0 }}
  />
);


export const ServicesAdmin = () => (
  <CrudPage title="Services" table="services"
    fields={[
      { key: "title", label: "Title" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon name (lucide)" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "is_active", label: "Active", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ]}
    defaults={{ is_active: true, sort_order: 0 }}
  />
);

export const BlogAdmin = () => (
  <CrudPage title="Blog Posts" description="Create, edit and publish blog posts. Changes go live instantly." table="blog_posts" orderBy="published_at"
    fields={[
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug", placeholder: "url-friendly-id" },
      { key: "cover_url", label: "Cover image", type: "image" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content", label: "Content", type: "rich" },
      { key: "meta_title", label: "SEO title" },
      { key: "meta_description", label: "SEO description", type: "textarea" },
      { key: "author", label: "Author" },
      { key: "reading_minutes", label: "Reading minutes", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
      { key: "published_at", label: "Publish date (YYYY-MM-DD)", placeholder: "2026-05-07" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ]}
    defaults={{ is_published: false, reading_minutes: 5, sort_order: 0, author: "Sri Kanish Enterprises" }}
  />
);