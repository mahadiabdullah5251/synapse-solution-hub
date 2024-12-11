export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due'
export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'enterprise'

export interface Profile {
  id: string
  full_name: string | null
  company_name: string | null
  subscription_tier: SubscriptionTier | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface AnalyticsData {
  id: string
  project_id: string
  metric_name: string
  metric_value: Json
  timestamp: string
}

export interface Workflow {
  id: string
  name: string
  description: string | null
  project_id: string
  workflow_config: Json
  is_active: boolean | null
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  feature_name: string
  usage_count: number
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Profile>
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Subscription>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Project>
      }
      analytics_data: {
        Row: AnalyticsData
        Insert: Omit<AnalyticsData, 'id' | 'timestamp'>
        Update: Partial<AnalyticsData>
      }
      workflows: {
        Row: Workflow
        Insert: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Workflow>
      }
      usage_logs: {
        Row: UsageLog
        Insert: Omit<UsageLog, 'id' | 'created_at'>
        Update: Partial<UsageLog>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_status: SubscriptionStatus
      subscription_tier: SubscriptionTier
    }
  }
}