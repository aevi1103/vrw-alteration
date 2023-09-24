import { PostgrestError } from "@supabase/supabase-js";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      about: {
        Row: {
          created_at: string;
          data: Json;
          id: number;
        };
        Insert: {
          created_at?: string;
          data: Json;
          id?: number;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: number;
        };
        Relationships: [];
      };
      alteration_items: {
        Row: {
          alteration_id: number;
          created_at: string;
          id: string;
          item_id: string;
          qty: number;
        };
        Insert: {
          alteration_id: number;
          created_at?: string;
          id?: string;
          item_id: string;
          qty: number;
        };
        Update: {
          alteration_id?: number;
          created_at?: string;
          id?: string;
          item_id?: string;
          qty?: number;
        };
        Relationships: [
          {
            foreignKeyName: "alteration_items_alteration_id_fkey";
            columns: ["alteration_id"];
            referencedRelation: "alterations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alteration_items_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          }
        ];
      };
      alteration_services: {
        Row: {
          alteration_item_id: string;
          created_at: string;
          id: number;
          price_id: string;
        };
        Insert: {
          alteration_item_id: string;
          created_at?: string;
          id?: number;
          price_id: string;
        };
        Update: {
          alteration_item_id?: string;
          created_at?: string;
          id?: number;
          price_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alteration_services_alteration_item_id_fkey";
            columns: ["alteration_item_id"];
            referencedRelation: "alteration_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alteration_services_price_id_fkey";
            columns: ["price_id"];
            referencedRelation: "prices";
            referencedColumns: ["id"];
          }
        ];
      };
      alterations: {
        Row: {
          created_at: string;
          created_by: string;
          customer_name: string;
          customer_user_id: string | null;
          id: number;
          paid: boolean;
          remarks: string | null;
          sales_person: string | null;
          ticket_num: number | null;
          updated_at: string | null;
          uuid: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          customer_name: string;
          customer_user_id?: string | null;
          id?: number;
          paid?: boolean;
          remarks?: string | null;
          sales_person?: string | null;
          ticket_num?: number | null;
          updated_at?: string | null;
          uuid?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          customer_name?: string;
          customer_user_id?: string | null;
          id?: number;
          paid?: boolean;
          remarks?: string | null;
          sales_person?: string | null;
          ticket_num?: number | null;
          updated_at?: string | null;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alterations_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alterations_customer_user_id_fkey";
            columns: ["customer_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          category: string | null;
          created_at: string;
          id: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
          created_at: string;
          description: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
        };
        Relationships: [];
      };
      prices: {
        Row: {
          category_id: string;
          created_at: string;
          id: string;
          price: number;
          service: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          id?: string;
          price: number;
          service: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          id?: string;
          price?: number;
          service?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prices_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: {
          created_at: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          role: string;
        };
        Update: {
          created_at?: string;
          role?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_role_fkey";
            columns: ["role"];
            referencedRelation: "roles";
            referencedColumns: ["role"];
          },
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;
