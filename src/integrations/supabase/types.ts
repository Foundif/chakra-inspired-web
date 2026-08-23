export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_minutes: number | null
          slug: string
          sort_order: number
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_minutes?: number | null
          slug: string
          sort_order?: number
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_minutes?: number | null
          slug?: string
          sort_order?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          short_description: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          short_description?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          short_description?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          account_no: string | null
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          plan_name: string | null
          updated_at: string
        }
        Insert: {
          account_no?: string | null
          address?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          plan_name?: string | null
          updated_at?: string
        }
        Update: {
          account_no?: string | null
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          plan_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          created_at: string
          event: string
          id: string
          page_path: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          page_path: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          page_path?: string
          session_id?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          size_class: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          size_class?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          size_class?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      isp_activity_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: string | null
          entity: string | null
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: string | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: string | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      isp_connections: {
        Row: {
          connection_no: string
          created_at: string
          customer_id: string | null
          expiry_on: string | null
          id: string
          installed_on: string | null
          ip_address: string | null
          notes: string | null
          olt_port: string | null
          plan_id: string | null
          router_mac: string | null
          router_model: string | null
          status: Database["public"]["Enums"]["isp_conn_status"]
          updated_at: string
        }
        Insert: {
          connection_no: string
          created_at?: string
          customer_id?: string | null
          expiry_on?: string | null
          id?: string
          installed_on?: string | null
          ip_address?: string | null
          notes?: string | null
          olt_port?: string | null
          plan_id?: string | null
          router_mac?: string | null
          router_model?: string | null
          status?: Database["public"]["Enums"]["isp_conn_status"]
          updated_at?: string
        }
        Update: {
          connection_no?: string
          created_at?: string
          customer_id?: string | null
          expiry_on?: string | null
          id?: string
          installed_on?: string | null
          ip_address?: string | null
          notes?: string | null
          olt_port?: string | null
          plan_id?: string | null
          router_mac?: string | null
          router_model?: string | null
          status?: Database["public"]["Enums"]["isp_conn_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "isp_connections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "isp_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "isp_connections_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "isp_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      isp_customers: {
        Row: {
          aadhaar_ref: string | null
          address: string | null
          alt_phone: string | null
          area: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          joined_on: string
          notes: string | null
          phone: string
          status: Database["public"]["Enums"]["isp_customer_status"]
          updated_at: string
        }
        Insert: {
          aadhaar_ref?: string | null
          address?: string | null
          alt_phone?: string | null
          area?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          joined_on?: string
          notes?: string | null
          phone: string
          status?: Database["public"]["Enums"]["isp_customer_status"]
          updated_at?: string
        }
        Update: {
          aadhaar_ref?: string | null
          address?: string | null
          alt_phone?: string | null
          area?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          joined_on?: string
          notes?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["isp_customer_status"]
          updated_at?: string
        }
        Relationships: []
      }
      isp_invoices: {
        Row: {
          amount: number
          connection_id: string | null
          created_at: string
          customer_id: string | null
          due_on: string | null
          id: string
          invoice_no: string
          issued_on: string
          notes: string | null
          period_end: string | null
          period_start: string | null
          status: Database["public"]["Enums"]["isp_invoice_status"]
          tax: number
          updated_at: string
        }
        Insert: {
          amount?: number
          connection_id?: string | null
          created_at?: string
          customer_id?: string | null
          due_on?: string | null
          id?: string
          invoice_no: string
          issued_on?: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: Database["public"]["Enums"]["isp_invoice_status"]
          tax?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          connection_id?: string | null
          created_at?: string
          customer_id?: string | null
          due_on?: string | null
          id?: string
          invoice_no?: string
          issued_on?: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: Database["public"]["Enums"]["isp_invoice_status"]
          tax?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "isp_invoices_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "isp_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "isp_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "isp_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      isp_payments: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          id: string
          invoice_id: string | null
          method: string
          paid_on: string
          reference: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string
          paid_on?: string
          reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string
          paid_on?: string
          reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "isp_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "isp_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "isp_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "isp_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      isp_plans: {
        Row: {
          billing_cycle: string
          created_at: string
          data_limit: string
          description: string | null
          id: string
          is_active: boolean
          is_business: boolean
          name: string
          ott_apps: number | null
          price: number
          sort_order: number
          speed_mbps: number
          tv_channels: number | null
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          data_limit?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_business?: boolean
          name: string
          ott_apps?: number | null
          price?: number
          sort_order?: number
          speed_mbps?: number
          tv_channels?: number | null
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          data_limit?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_business?: boolean
          name?: string
          ott_apps?: number | null
          price?: number
          sort_order?: number
          speed_mbps?: number
          tv_channels?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      isp_staff: {
        Row: {
          area: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role_title: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role_title?: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      isp_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["isp_ticket_priority"]
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["isp_ticket_status"]
          subject: string
          ticket_no: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["isp_ticket_priority"]
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["isp_ticket_status"]
          subject: string
          ticket_no: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["isp_ticket_priority"]
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["isp_ticket_status"]
          subject?: string
          ticket_no?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "isp_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "isp_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "isp_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "isp_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          category_id: string | null
          company: string | null
          created_at: string
          email: string | null
          estimated_value: number | null
          expected_close_date: string | null
          id: string
          is_read: boolean
          message: string | null
          name: string
          notes: string | null
          page_path: string | null
          phone: string
          product_interest: string | null
          quantity: string | null
          quote_pdf_url: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          won_at: string | null
        }
        Insert: {
          category_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          name: string
          notes?: string | null
          page_path?: string | null
          phone: string
          product_interest?: string | null
          quantity?: string | null
          quote_pdf_url?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          won_at?: string | null
        }
        Update: {
          category_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          name?: string
          notes?: string | null
          page_path?: string | null
          phone?: string
          product_interest?: string | null
          quantity?: string | null
          quote_pdf_url?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          won_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      page_blocks: {
        Row: {
          block_key: string
          block_type: string
          body: string | null
          created_at: string
          cta_href: string | null
          cta_label: string | null
          extra: Json
          eyebrow: string | null
          id: string
          image_url: string | null
          is_visible: boolean
          page_slug: string
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          block_key: string
          block_type?: string
          body?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          extra?: Json
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          page_slug: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          block_key?: string
          block_type?: string
          body?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          extra?: Json
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          page_slug?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          session_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          id: number
          launch_at: string | null
          maintenance_enabled: boolean
          maintenance_message: string
          maintenance_title: string
          renewal_amc_due: string | null
          renewal_dismissed_at: string | null
          renewal_hosting_due: string | null
          renewal_message: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          launch_at?: string | null
          maintenance_enabled?: boolean
          maintenance_message?: string
          maintenance_title?: string
          renewal_amc_due?: string | null
          renewal_dismissed_at?: string | null
          renewal_hosting_due?: string | null
          renewal_message?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          launch_at?: string | null
          maintenance_enabled?: boolean
          maintenance_message?: string
          maintenance_title?: string
          renewal_amc_due?: string | null
          renewal_dismissed_at?: string | null
          renewal_hosting_due?: string | null
          renewal_message?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          price: number | null
          price_label: string | null
          short_description: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          price?: number | null
          price_label?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          price?: number | null
          price_label?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address_line1: string
          address_line2: string
          city: string
          company_name: string
          email: string
          facebook_url: string | null
          google_maps_url: string | null
          gstin: string | null
          id: number
          indiamart_url: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          phone_primary: string
          phone_secondary: string | null
          tagline: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          address_line1?: string
          address_line2?: string
          city?: string
          company_name?: string
          email?: string
          facebook_url?: string | null
          google_maps_url?: string | null
          gstin?: string | null
          id?: number
          indiamart_url?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone_primary?: string
          phone_secondary?: string | null
          tagline?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string
          city?: string
          company_name?: string
          email?: string
          facebook_url?: string | null
          google_maps_url?: string | null
          gstin?: string | null
          id?: number
          indiamart_url?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone_primary?: string
          phone_secondary?: string | null
          tagline?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          brand: string | null
          client_name: string
          created_at: string
          id: string
          is_active: boolean
          is_logo_only: boolean
          logo_url: string | null
          quote: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          brand?: string | null
          client_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_logo_only?: boolean
          logo_url?: string | null
          quote?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          brand?: string | null
          client_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_logo_only?: boolean
          logo_url?: string | null
          quote?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      claim_super_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user" | "super_admin"
      isp_conn_status: "active" | "suspended" | "disconnected" | "pending"
      isp_customer_status: "active" | "inactive" | "suspended"
      isp_invoice_status: "paid" | "unpaid" | "overdue" | "cancelled"
      isp_ticket_priority: "low" | "medium" | "high" | "urgent"
      isp_ticket_status: "open" | "in_progress" | "resolved" | "closed"
      lead_source:
        | "quote_form"
        | "contact_form"
        | "whatsapp"
        | "indiamart"
        | "phone"
        | "other"
      lead_status: "new" | "contacted" | "qualified" | "won" | "lost"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user", "super_admin"],
      isp_conn_status: ["active", "suspended", "disconnected", "pending"],
      isp_customer_status: ["active", "inactive", "suspended"],
      isp_invoice_status: ["paid", "unpaid", "overdue", "cancelled"],
      isp_ticket_priority: ["low", "medium", "high", "urgent"],
      isp_ticket_status: ["open", "in_progress", "resolved", "closed"],
      lead_source: [
        "quote_form",
        "contact_form",
        "whatsapp",
        "indiamart",
        "phone",
        "other",
      ],
      lead_status: ["new", "contacted", "qualified", "won", "lost"],
    },
  },
} as const
