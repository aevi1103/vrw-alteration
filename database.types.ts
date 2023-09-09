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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
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
