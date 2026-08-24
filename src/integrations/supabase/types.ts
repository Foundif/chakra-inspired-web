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
          slug: string | null
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
          slug?: string | null
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
          slug?: string | null
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
          slug: string | null
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
          slug?: string | null
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
          slug?: string | null
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
          page_path: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          page_path?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          page_path?: string | null
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
          activated_on: string | null
          created_at: string
          customer_id: string
          id: string
          mac_address: string | null
          olt_port: string | null
          ont_serial: string | null
          plan_id: string | null
          router_model: string | null
          router_serial: string | null
          static_ip: string | null
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          activated_on?: string | null
          created_at?: string
          customer_id: string
          id?: string
          mac_address?: string | null
          olt_port?: string | null
          ont_serial?: string | null
          plan_id?: string | null
          router_model?: string | null
          router_serial?: string | null
          static_ip?: string | null
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          activated_on?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          mac_address?: string | null
          olt_port?: string | null
          ont_serial?: string | null
          plan_id?: string | null
          router_model?: string | null
          router_serial?: string | null
          static_ip?: string | null
          status?: Database["public"]["Enums"]["connection_status"]
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
          address: string | null
          area: string | null
          created_at: string
          customer_code: string | null
          email: string | null
          full_name: string
          id: string
          joined_on: string
          notes: string | null
          phone: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          area?: string | null
          created_at?: string
          customer_code?: string | null
          email?: string | null
          full_name: string
          id?: string
          joined_on?: string
          notes?: string | null
          phone: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          area?: string | null
          created_at?: string
          customer_code?: string | null
          email?: string | null
          full_name?: string
          id?: string
          joined_on?: string
          notes?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: []
      }
      isp_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          notes: string | null
          spent_on: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          spent_on?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          spent_on?: string
        }
        Relationships: []
      }
      isp_invoices: {
        Row: {
          amount: number
          connection_id: string | null
          created_at: string
          customer_id: string
          due_date: string | null
          id: string
          invoice_no: string | null
          period_end: string | null
          period_start: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          tax_amount: number
          updated_at: string
        }
        Insert: {
          amount?: number
          connection_id?: string | null
          created_at?: string
          customer_id: string
          due_date?: string | null
          id?: string
          invoice_no?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          tax_amount?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          connection_id?: string | null
          created_at?: string
          customer_id?: string
          due_date?: string | null
          id?: string
          invoice_no?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          tax_amount?: number
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
          customer_id: string
          id: string
          invoice_id: string | null
          method: Database["public"]["Enums"]["payment_method"]
          paid_at: string
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          id?: string
          invoice_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          id?: string
          invoice_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string
          reference?: string | null
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
          data_limit_gb: number | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          speed_mbps: number
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          data_limit_gb?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price: number
          speed_mbps: number
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          data_limit_gb?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          speed_mbps?: number
          updated_at?: string
        }
        Relationships: []
      }
      isp_staff: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      isp_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          connection_id: string | null
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_no: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          connection_id?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_no?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          connection_id?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          ticket_no?: string | null
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
            foreignKeyName: "isp_tickets_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "isp_connections"
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
          company: string | null
          created_at: string
          email: string | null
          estimated_value: number | null
          expected_close_date: string | null
          id: string
          is_read: boolean
          message: string | null
          name: string
          page_path: string | null
          phone: string | null
          product_interest: string | null
          quantity: string | null
          quote_pdf_url: string | null
          source: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          won_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          name: string
          page_path?: string | null
          phone?: string | null
          product_interest?: string | null
          quantity?: string | null
          quote_pdf_url?: string | null
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          won_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          name?: string
          page_path?: string | null
          phone?: string | null
          product_interest?: string | null
          quantity?: string | null
          quote_pdf_url?: string | null
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          won_at?: string | null
        }
        Relationships: []
      }
      page_blocks: {
        Row: {
          block_key: string
          block_type: string
          body: string | null
          created_at: string
          cta_href: string | null
          cta_label: string | null
          extra: Json | null
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
          extra?: Json | null
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          page_slug?: string
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
          extra?: Json | null
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
          page_path: string | null
          referrer: string | null
          session_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string | null
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
          maintenance_message: string | null
          maintenance_title: string | null
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
          maintenance_message?: string | null
          maintenance_title?: string | null
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
          maintenance_message?: string | null
          maintenance_title?: string | null
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
          slug: string | null
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
          slug?: string | null
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
          slug?: string | null
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
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string | null
          email: string | null
          facebook_url: string | null
          google_maps_url: string | null
          gstin: string | null
          id: number
          indiamart_url: string | null
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          phone_primary: string | null
          phone_secondary: string | null
          tagline: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          email?: string | null
          facebook_url?: string | null
          google_maps_url?: string | null
          gstin?: string | null
          id?: number
          indiamart_url?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          email?: string | null
          facebook_url?: string | null
          google_maps_url?: string | null
          gstin?: string | null
          id?: number
          indiamart_url?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          brand: string | null
          client_name: string | null
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
          brand?: string | null
          client_name?: string | null
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
          brand?: string | null
          client_name?: string | null
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
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "moderator" | "user" | "super_admin"
      connection_status: "lead" | "active" | "suspended" | "closed"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      payment_method:
        | "cash"
        | "upi"
        | "card"
        | "netbanking"
        | "cheque"
        | "other"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
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
      app_role: ["admin", "moderator", "user", "super_admin"],
      connection_status: ["lead", "active", "suspended", "closed"],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      payment_method: ["cash", "upi", "card", "netbanking", "cheque", "other"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
