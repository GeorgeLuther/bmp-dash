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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          manager_id: string | null
          parent_department_id: string | null
          sharepoint_url: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          manager_id?: string | null
          parent_department_id?: string | null
          sharepoint_url?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          manager_id?: string | null
          parent_department_id?: string | null
          sharepoint_url?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_departments"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "v_person_departments_current_min"
            referencedColumns: ["department_id"]
          },
        ]
      }
      departments_roles: {
        Row: {
          department_id: string
          id: string
          role_id: string
        }
        Insert: {
          department_id: string
          id?: string
          role_id: string
        }
        Update: {
          department_id?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_departments"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "departments_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_person_departments_current_min"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "departments_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments_subdepartments: {
        Row: {
          department_id: string | null
          id: number
          subdepartment_id: string | null
        }
        Insert: {
          department_id?: string | null
          id?: number
          subdepartment_id?: string | null
        }
        Update: {
          department_id?: string | null
          id?: number
          subdepartment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_subdepartments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_subdepartments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_departments"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "departments_subdepartments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_person_departments_current_min"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "departments_subdepartments_subdepartment_id_fkey"
            columns: ["subdepartment_id"]
            isOneToOne: false
            referencedRelation: "subdepartments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_criticality: {
        Row: {
          definition: string
          id: string
          label: string
          sort_order: number | null
          suggested_review_frequency: number
        }
        Insert: {
          definition: string
          id: string
          label: string
          sort_order?: number | null
          suggested_review_frequency: number
        }
        Update: {
          definition?: string
          id?: string
          label?: string
          sort_order?: number | null
          suggested_review_frequency?: number
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          change_comment: string | null
          content_type: Database["public"]["Enums"]["document_content_types"]
          created_at: string
          created_by: string
          document_id: string
          id: string
          status: Database["public"]["Enums"]["document_approval_statuses"]
          updated_at: string | null
          updated_by: string | null
          version_major: number
          version_minor: number
          version_patch: number
        }
        Insert: {
          change_comment?: string | null
          content_type: Database["public"]["Enums"]["document_content_types"]
          created_at?: string
          created_by: string
          document_id: string
          id?: string
          status: Database["public"]["Enums"]["document_approval_statuses"]
          updated_at?: string | null
          updated_by?: string | null
          version_major?: number
          version_minor?: number
          version_patch?: number
        }
        Update: {
          change_comment?: string | null
          content_type?: Database["public"]["Enums"]["document_content_types"]
          created_at?: string
          created_by?: string
          document_id?: string
          id?: string
          status?: Database["public"]["Enums"]["document_approval_statuses"]
          updated_at?: string | null
          updated_by?: string | null
          version_major?: number
          version_minor?: number
          version_patch?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
        ]
      }
      documents: {
        Row: {
          archived_at: string | null
          created_at: string
          criticality: string | null
          current_published_version_id: string | null
          doc_code: string
          id: string
          is_public: boolean
          resource_format: string
          title: string
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          criticality?: string | null
          current_published_version_id?: string | null
          doc_code: string
          id?: string
          is_public?: boolean
          resource_format: string
          title: string
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          criticality?: string | null
          current_published_version_id?: string | null
          doc_code?: string
          id?: string
          is_public?: boolean
          resource_format?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_criticality_fkey"
            columns: ["criticality"]
            isOneToOne: false
            referencedRelation: "document_criticality"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_current_published_version_id_fkey"
            columns: ["current_published_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_resource_format_fkey"
            columns: ["resource_format"]
            isOneToOne: false
            referencedRelation: "resource_formats"
            referencedColumns: ["id"]
          },
        ]
      }
      documents_approval_events: {
        Row: {
          approval_status: Database["public"]["Enums"]["document_approval_statuses"]
          change_description: string
          created_at: string
          created_by: string
          document_id: string
          file_version_id: string | null
          id: string
          map_version_id: string | null
          tiptap_version_id: string | null
        }
        Insert: {
          approval_status: Database["public"]["Enums"]["document_approval_statuses"]
          change_description: string
          created_at?: string
          created_by: string
          document_id: string
          file_version_id?: string | null
          id?: string
          map_version_id?: string | null
          tiptap_version_id?: string | null
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["document_approval_statuses"]
          change_description?: string
          created_at?: string
          created_by?: string
          document_id?: string
          file_version_id?: string | null
          id?: string
          map_version_id?: string | null
          tiptap_version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_approval_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_approval_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_approval_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "document_approval_events_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents_roles_events: {
        Row: {
          assignment_event_type: Database["public"]["Enums"]["document_assignment_event_types"]
          created_at: string
          created_by: string | null
          description: string | null
          document_id: string
          id: string
          role_id: string
        }
        Insert: {
          assignment_event_type: Database["public"]["Enums"]["document_assignment_event_types"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_id: string
          id?: string
          role_id: string
        }
        Update: {
          assignment_event_type?: Database["public"]["Enums"]["document_assignment_event_types"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_id?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_roles_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_roles_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_roles_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "documents_roles_events_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_roles_events_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      employment_status_history_temp: {
        Row: {
          from_status: string | null
          id: string
          log_date: string | null
          personnel_id: string
          to_status: string | null
        }
        Insert: {
          from_status?: string | null
          id: string
          log_date?: string | null
          personnel_id?: string
          to_status?: string | null
        }
        Update: {
          from_status?: string | null
          id?: string
          log_date?: string | null
          personnel_id?: string
          to_status?: string | null
        }
        Relationships: []
      }
      employment_statuses: {
        Row: {
          bucket: Database["public"]["Enums"]["employment_types"]
          description: string | null
          id: string
          is_active: boolean
          is_employed: boolean
          label: string
          sort_order: number | null
        }
        Insert: {
          bucket: Database["public"]["Enums"]["employment_types"]
          description?: string | null
          id: string
          is_active?: boolean
          is_employed?: boolean
          label: string
          sort_order?: number | null
        }
        Update: {
          bucket?: Database["public"]["Enums"]["employment_types"]
          description?: string | null
          id?: string
          is_active?: boolean
          is_employed?: boolean
          label?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      file_content: {
        Row: {
          file_name: string | null
          mime_type: string | null
          path: string | null
          size_bytes: number | null
          version_id: string
        }
        Insert: {
          file_name?: string | null
          mime_type?: string | null
          path?: string | null
          size_bytes?: number | null
          version_id: string
        }
        Update: {
          file_name?: string | null
          mime_type?: string | null
          path?: string | null
          size_bytes?: number | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_content_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: true
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          description: string | null
          e2_description: string | null
          id: string
          main_photo_link: string | null
          pantone_color: string | null
          sku: string | null
        }
        Insert: {
          description?: string | null
          e2_description?: string | null
          id?: string
          main_photo_link?: string | null
          pantone_color?: string | null
          sku?: string | null
        }
        Update: {
          description?: string | null
          e2_description?: string | null
          id?: string
          main_photo_link?: string | null
          pantone_color?: string | null
          sku?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_po: string | null
          due_at: string | null
          id: string
          item_id: string | null
          job_notes: string | null
          last_synced_at: string | null
          order_quantity: number | null
          ordered_at: string | null
          projected_completion_at: string | null
          sales_agent: string | null
          status: string | null
          total_releases: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_po?: string | null
          due_at?: string | null
          id: string
          item_id?: string | null
          job_notes?: string | null
          last_synced_at?: string | null
          order_quantity?: number | null
          ordered_at?: string | null
          projected_completion_at?: string | null
          sales_agent?: string | null
          status?: string | null
          total_releases?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_po?: string | null
          due_at?: string | null
          id?: string
          item_id?: string | null
          job_notes?: string | null
          last_synced_at?: string | null
          order_quantity?: number | null
          ordered_at?: string | null
          projected_completion_at?: string | null
          sales_agent?: string | null
          status?: string | null
          total_releases?: number | null
        }
        Relationships: []
      }
      map_content: {
        Row: {
          derived_json: Json
          version_id: string
          yjs_snapshot: string
          yjs_state_vector_hash: string
        }
        Insert: {
          derived_json: Json
          version_id: string
          yjs_snapshot: string
          yjs_state_vector_hash: string
        }
        Update: {
          derived_json?: Json
          version_id?: string
          yjs_snapshot?: string
          yjs_state_vector_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_content_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: true
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_clocking: {
        Row: {
          clocking_event_type: Database["public"]["Enums"]["clocking_event_types"]
          id: string
          operation_id: string | null
          time: string
        }
        Insert: {
          clocking_event_type: Database["public"]["Enums"]["clocking_event_types"]
          id?: string
          operation_id?: string | null
          time?: string
        }
        Update: {
          clocking_event_type?: Database["public"]["Enums"]["clocking_event_types"]
          id?: string
          operation_id?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "operation_clocking_operation_id_fkey"
            columns: ["operation_id"]
            isOneToOne: false
            referencedRelation: "operations"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          component: string | null
          created_at: string
          estimated_hours: number | null
          hits: number | null
          id: string
          info: string | null
          nonconforming_count: number | null
          operation_type: string | null
          rates: number | null
          release_id: number | null
          scrap_count: number | null
          sequence_number: number | null
          sort_order: number | null
          times: number | null
          work_area: string | null
        }
        Insert: {
          component?: string | null
          created_at?: string
          estimated_hours?: number | null
          hits?: number | null
          id?: string
          info?: string | null
          nonconforming_count?: number | null
          operation_type?: string | null
          rates?: number | null
          release_id?: number | null
          scrap_count?: number | null
          sequence_number?: number | null
          sort_order?: number | null
          times?: number | null
          work_area?: string | null
        }
        Update: {
          component?: string | null
          created_at?: string
          estimated_hours?: number | null
          hits?: number | null
          id?: string
          info?: string | null
          nonconforming_count?: number | null
          operation_type?: string | null
          rates?: number | null
          release_id?: number | null
          scrap_count?: number | null
          sequence_number?: number | null
          sort_order?: number | null
          times?: number | null
          work_area?: string | null
        }
        Relationships: []
      }
      personnel: {
        Row: {
          agency: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          nfc_id: string | null
          old_id: string | null
          preferred_name: string | null
        }
        Insert: {
          agency?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          nfc_id?: string | null
          old_id?: string | null
          preferred_name?: string | null
        }
        Update: {
          agency?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          nfc_id?: string | null
          old_id?: string | null
          preferred_name?: string | null
        }
        Relationships: []
      }
      personnel_emails: {
        Row: {
          address: string
          create_account: boolean
          created_at: string
          email_type: Database["public"]["Enums"]["email_type"]
          id: string
          is_disabled: boolean
          is_invited: boolean
          is_primary: boolean | null
          is_verified: boolean
          notes: string | null
          personnel_id: string
          send_notifications: boolean
        }
        Insert: {
          address: string
          create_account?: boolean
          created_at?: string
          email_type?: Database["public"]["Enums"]["email_type"]
          id?: string
          is_disabled?: boolean
          is_invited?: boolean
          is_primary?: boolean | null
          is_verified?: boolean
          notes?: string | null
          personnel_id: string
          send_notifications?: boolean
        }
        Update: {
          address?: string
          create_account?: boolean
          created_at?: string
          email_type?: Database["public"]["Enums"]["email_type"]
          id?: string
          is_disabled?: boolean
          is_invited?: boolean
          is_primary?: boolean | null
          is_verified?: boolean
          notes?: string | null
          personnel_id?: string
          send_notifications?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "personnel_emails_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_emails_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_emails_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
        ]
      }
      personnel_employment_events: {
        Row: {
          admin_statement: string | null
          created_at: string
          created_by: string | null
          effective_at: string
          employee_statement: string | null
          employment_status_id: string
          id: string
          personnel_id: string | null
          reason: string | null
          source: string | null
        }
        Insert: {
          admin_statement?: string | null
          created_at?: string
          created_by?: string | null
          effective_at: string
          employee_statement?: string | null
          employment_status_id: string
          id?: string
          personnel_id?: string | null
          reason?: string | null
          source?: string | null
        }
        Update: {
          admin_statement?: string | null
          created_at?: string
          created_by?: string | null
          effective_at?: string
          employee_statement?: string | null
          employment_status_id?: string
          id?: string
          personnel_id?: string | null
          reason?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employment_events_employment_status_id_fkey"
            columns: ["employment_status_id"]
            isOneToOne: false
            referencedRelation: "employment_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_events_employment_status_id_fkey"
            columns: ["employment_status_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["status_id"]
          },
          {
            foreignKeyName: "employment_events_employment_status_id_fkey"
            columns: ["employment_status_id"]
            isOneToOne: false
            referencedRelation: "v_person_employment_current_min"
            referencedColumns: ["status_id"]
          },
          {
            foreignKeyName: "employment_events_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_events_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_events_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "personnel_employment_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_employment_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_employment_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
        ]
      }
      personnel_initial_dates_temp: {
        Row: {
          hired_date: string | null
          id: number
          last_date: string | null
          personnel_id: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          hired_date?: string | null
          id?: number
          last_date?: string | null
          personnel_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          hired_date?: string | null
          id?: number
          last_date?: string | null
          personnel_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      personnel_roles_events: {
        Row: {
          assigned_by: string | null
          audit_note: string | null
          audited_at: string | null
          audited_by: string | null
          created_at: string
          effective_at: string
          event_type_id: string | null
          expires_at: string | null
          id: string
          involvement_id: string | null
          is_audited: boolean | null
          personnel_id: string
          proficiency_id: string | null
          review_at: string | null
          role_id: string
          source: string | null
        }
        Insert: {
          assigned_by?: string | null
          audit_note?: string | null
          audited_at?: string | null
          audited_by?: string | null
          created_at?: string
          effective_at: string
          event_type_id?: string | null
          expires_at?: string | null
          id?: string
          involvement_id?: string | null
          is_audited?: boolean | null
          personnel_id: string
          proficiency_id?: string | null
          review_at?: string | null
          role_id: string
          source?: string | null
        }
        Update: {
          assigned_by?: string | null
          audit_note?: string | null
          audited_at?: string | null
          audited_by?: string | null
          created_at?: string
          effective_at?: string
          event_type_id?: string | null
          expires_at?: string | null
          id?: string
          involvement_id?: string | null
          is_audited?: boolean | null
          personnel_id?: string
          proficiency_id?: string | null
          review_at?: string | null
          role_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "personnel_roles_events_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "personnel_roles_events_audited_by_fkey"
            columns: ["audited_by"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_audited_by_fkey"
            columns: ["audited_by"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_audited_by_fkey"
            columns: ["audited_by"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "personnel_roles_events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "role_event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_involvement_id_fkey"
            columns: ["involvement_id"]
            isOneToOne: false
            referencedRelation: "role_involvements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_proficiency_id_fkey"
            columns: ["proficiency_id"]
            isOneToOne: false
            referencedRelation: "role_proficiencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      personnel_roles_events_comments: {
        Row: {
          author_id: string
          comment_text: string
          created_at: string
          event_id: string
          id: number
          is_private: boolean
          modified_at: string | null
        }
        Insert: {
          author_id: string
          comment_text: string
          created_at?: string
          event_id: string
          id?: number
          is_private: boolean
          modified_at?: string | null
        }
        Update: {
          author_id?: string
          comment_text?: string
          created_at?: string
          event_id?: string
          id?: number
          is_private?: boolean
          modified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personnel_roles_events_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "personnel_roles_events_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "personnel_roles_events"
            referencedColumns: ["id"]
          },
        ]
      }
      release_table_views: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          is_shared: boolean | null
          name: string
          shared_with_roles: string[] | null
          updated_at: string | null
          user_id: string | null
          view_state: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name: string
          shared_with_roles?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          view_state?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name?: string
          shared_with_roles?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          view_state?: Json | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          acceptable_overage: number | null
          air_weld_hours: number | null
          air_weld_order: number | null
          all_brake_hours: number | null
          all_brake_order: number | null
          auxiliary_hours: number | null
          auxiliary_order: number | null
          brake_setups: number | null
          cartons_per_pallet: number | null
          cnc_hours: number | null
          cnc_order: number | null
          coastone_hours: number | null
          coastone_order: number | null
          coil_hours: number | null
          coil_order: number | null
          created_at: string
          date_to_floor: string | null
          date_to_production_manager: string | null
          expedite_notes: string | null
          fourty_ton_hours: number | null
          fourty_ton_order: number | null
          global_hours: number | null
          global_or_vt30: string | null
          global_order: number | null
          has_customer_kit: boolean | null
          hem_and_flat_hours: number | null
          hem_and_flat_order: number | null
          id: string
          item_id: string | null
          job_id: string | null
          kitting_hours: number | null
          large_box_hours: number | null
          large_box_order: number | null
          mig_hours: number | null
          mig_order: number | null
          ms_comments: string | null
          ms_customer_po: string | null
          ms_due_date: string | null
          ms_job_name: string | null
          ms_order_quantity: string | null
          ms_paint_color: string | null
          ms_paint_lbs: number | null
          ms_po_date: string | null
          ms_po_quantity: string | null
          ms_row_index: number | null
          old_kit_locations: string | null
          pack_cell_hours: number | null
          pack_cell_order: number | null
          pack_line_hours: number | null
          pack_line_order: number | null
          pack_machine_rivet_hours: number | null
          pack_machine_rivet_order: number | null
          pack_pop_rivet_hours: number | null
          pack_pop_rivet_order: number | null
          pack_screen_hours: number | null
          pack_screen_order: number | null
          paint_hours: number | null
          paint_order: number | null
          pem_hours: number | null
          pem_order: number | null
          production_complete_at: string | null
          production_manager_notes: string | null
          production_start_at: string | null
          punch_hours: number | null
          punch_order: number | null
          purchasing_status: string | null
          quantity_per_carton: number | null
          quantity_to_make: number | null
          quantity_to_ship: number | null
          quantity_to_stock: number | null
          release_code: string | null
          release_number: number | null
          release_quantity: number | null
          release_status: string | null
          scoop_weld_hours: number | null
          scoop_weld_order: number | null
          seventyfive_ton_hours: number | null
          seventyfive_ton_order: number | null
          shear_hours: number | null
          shear_order: number | null
          shipping_hours: number | null
          shipping_order: number | null
          small_box_hours: number | null
          small_box_order: number | null
          spot_weld_hours: number | null
          spot_weld_order: number | null
          tig_hours: number | null
          tig_order: number | null
          time_weld_hours: number | null
          time_weld_order: number | null
          total_releases: number | null
          vt30_hours: number | null
          vt30_order: number | null
          wash_hours: number | null
          wash_order: number | null
          week_projected: string | null
          weld_hours: number | null
          weld_order: number | null
          weld_rivet_hours: number | null
          weld_rivet_order: number | null
          weld_setups: number | null
        }
        Insert: {
          acceptable_overage?: number | null
          air_weld_hours?: number | null
          air_weld_order?: number | null
          all_brake_hours?: number | null
          all_brake_order?: number | null
          auxiliary_hours?: number | null
          auxiliary_order?: number | null
          brake_setups?: number | null
          cartons_per_pallet?: number | null
          cnc_hours?: number | null
          cnc_order?: number | null
          coastone_hours?: number | null
          coastone_order?: number | null
          coil_hours?: number | null
          coil_order?: number | null
          created_at?: string
          date_to_floor?: string | null
          date_to_production_manager?: string | null
          expedite_notes?: string | null
          fourty_ton_hours?: number | null
          fourty_ton_order?: number | null
          global_hours?: number | null
          global_or_vt30?: string | null
          global_order?: number | null
          has_customer_kit?: boolean | null
          hem_and_flat_hours?: number | null
          hem_and_flat_order?: number | null
          id?: string
          item_id?: string | null
          job_id?: string | null
          kitting_hours?: number | null
          large_box_hours?: number | null
          large_box_order?: number | null
          mig_hours?: number | null
          mig_order?: number | null
          ms_comments?: string | null
          ms_customer_po?: string | null
          ms_due_date?: string | null
          ms_job_name?: string | null
          ms_order_quantity?: string | null
          ms_paint_color?: string | null
          ms_paint_lbs?: number | null
          ms_po_date?: string | null
          ms_po_quantity?: string | null
          ms_row_index?: number | null
          old_kit_locations?: string | null
          pack_cell_hours?: number | null
          pack_cell_order?: number | null
          pack_line_hours?: number | null
          pack_line_order?: number | null
          pack_machine_rivet_hours?: number | null
          pack_machine_rivet_order?: number | null
          pack_pop_rivet_hours?: number | null
          pack_pop_rivet_order?: number | null
          pack_screen_hours?: number | null
          pack_screen_order?: number | null
          paint_hours?: number | null
          paint_order?: number | null
          pem_hours?: number | null
          pem_order?: number | null
          production_complete_at?: string | null
          production_manager_notes?: string | null
          production_start_at?: string | null
          punch_hours?: number | null
          punch_order?: number | null
          purchasing_status?: string | null
          quantity_per_carton?: number | null
          quantity_to_make?: number | null
          quantity_to_ship?: number | null
          quantity_to_stock?: number | null
          release_code?: string | null
          release_number?: number | null
          release_quantity?: number | null
          release_status?: string | null
          scoop_weld_hours?: number | null
          scoop_weld_order?: number | null
          seventyfive_ton_hours?: number | null
          seventyfive_ton_order?: number | null
          shear_hours?: number | null
          shear_order?: number | null
          shipping_hours?: number | null
          shipping_order?: number | null
          small_box_hours?: number | null
          small_box_order?: number | null
          spot_weld_hours?: number | null
          spot_weld_order?: number | null
          tig_hours?: number | null
          tig_order?: number | null
          time_weld_hours?: number | null
          time_weld_order?: number | null
          total_releases?: number | null
          vt30_hours?: number | null
          vt30_order?: number | null
          wash_hours?: number | null
          wash_order?: number | null
          week_projected?: string | null
          weld_hours?: number | null
          weld_order?: number | null
          weld_rivet_hours?: number | null
          weld_rivet_order?: number | null
          weld_setups?: number | null
        }
        Update: {
          acceptable_overage?: number | null
          air_weld_hours?: number | null
          air_weld_order?: number | null
          all_brake_hours?: number | null
          all_brake_order?: number | null
          auxiliary_hours?: number | null
          auxiliary_order?: number | null
          brake_setups?: number | null
          cartons_per_pallet?: number | null
          cnc_hours?: number | null
          cnc_order?: number | null
          coastone_hours?: number | null
          coastone_order?: number | null
          coil_hours?: number | null
          coil_order?: number | null
          created_at?: string
          date_to_floor?: string | null
          date_to_production_manager?: string | null
          expedite_notes?: string | null
          fourty_ton_hours?: number | null
          fourty_ton_order?: number | null
          global_hours?: number | null
          global_or_vt30?: string | null
          global_order?: number | null
          has_customer_kit?: boolean | null
          hem_and_flat_hours?: number | null
          hem_and_flat_order?: number | null
          id?: string
          item_id?: string | null
          job_id?: string | null
          kitting_hours?: number | null
          large_box_hours?: number | null
          large_box_order?: number | null
          mig_hours?: number | null
          mig_order?: number | null
          ms_comments?: string | null
          ms_customer_po?: string | null
          ms_due_date?: string | null
          ms_job_name?: string | null
          ms_order_quantity?: string | null
          ms_paint_color?: string | null
          ms_paint_lbs?: number | null
          ms_po_date?: string | null
          ms_po_quantity?: string | null
          ms_row_index?: number | null
          old_kit_locations?: string | null
          pack_cell_hours?: number | null
          pack_cell_order?: number | null
          pack_line_hours?: number | null
          pack_line_order?: number | null
          pack_machine_rivet_hours?: number | null
          pack_machine_rivet_order?: number | null
          pack_pop_rivet_hours?: number | null
          pack_pop_rivet_order?: number | null
          pack_screen_hours?: number | null
          pack_screen_order?: number | null
          paint_hours?: number | null
          paint_order?: number | null
          pem_hours?: number | null
          pem_order?: number | null
          production_complete_at?: string | null
          production_manager_notes?: string | null
          production_start_at?: string | null
          punch_hours?: number | null
          punch_order?: number | null
          purchasing_status?: string | null
          quantity_per_carton?: number | null
          quantity_to_make?: number | null
          quantity_to_ship?: number | null
          quantity_to_stock?: number | null
          release_code?: string | null
          release_number?: number | null
          release_quantity?: number | null
          release_status?: string | null
          scoop_weld_hours?: number | null
          scoop_weld_order?: number | null
          seventyfive_ton_hours?: number | null
          seventyfive_ton_order?: number | null
          shear_hours?: number | null
          shear_order?: number | null
          shipping_hours?: number | null
          shipping_order?: number | null
          small_box_hours?: number | null
          small_box_order?: number | null
          spot_weld_hours?: number | null
          spot_weld_order?: number | null
          tig_hours?: number | null
          tig_order?: number | null
          time_weld_hours?: number | null
          time_weld_order?: number | null
          total_releases?: number | null
          vt30_hours?: number | null
          vt30_order?: number | null
          wash_hours?: number | null
          wash_order?: number | null
          week_projected?: string | null
          weld_hours?: number | null
          weld_order?: number | null
          weld_rivet_hours?: number | null
          weld_rivet_order?: number | null
          weld_setups?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "releases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_formats: {
        Row: {
          classification_code: string | null
          description: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          classification_code?: string | null
          description: string
          id: string
          label: string
          sort_order: number
        }
        Update: {
          classification_code?: string | null
          description?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      role_event_types: {
        Row: {
          description: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          description: string
          id: string
          label: string
          sort_order: number
        }
        Update: {
          description?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      role_involvements: {
        Row: {
          description: string
          icon_name: string | null
          id: string
          label: string
          sort_order: number | null
        }
        Insert: {
          description: string
          icon_name?: string | null
          id: string
          label: string
          sort_order?: number | null
        }
        Update: {
          description?: string
          icon_name?: string | null
          id?: string
          label?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      role_person_lookup_temp: {
        Row: {
          id: string
          personnel_id: string | null
          role_id: string | null
        }
        Insert: {
          id?: string
          personnel_id?: string | null
          role_id?: string | null
        }
        Update: {
          id?: string
          personnel_id?: string | null
          role_id?: string | null
        }
        Relationships: []
      }
      role_proficiencies: {
        Row: {
          description: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          description: string
          id: string
          label: string
          sort_order: number
        }
        Update: {
          description?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      roles: {
        Row: {
          coverage_goal: number | null
          coverage_minimum: number | null
          created_at: string
          description: string
          id: string
          label: string
          new_id: string | null
        }
        Insert: {
          coverage_goal?: number | null
          coverage_minimum?: number | null
          created_at?: string
          description: string
          id?: string
          label: string
          new_id?: string | null
        }
        Update: {
          coverage_goal?: number | null
          coverage_minimum?: number | null
          created_at?: string
          description?: string
          id?: string
          label?: string
          new_id?: string | null
        }
        Relationships: []
      }
      subdepartments: {
        Row: {
          description: string
          id: string
          label: string
          location_code: string | null
          sharepoint_link: string | null
          sort_order: number | null
        }
        Insert: {
          description: string
          id?: string
          label: string
          location_code?: string | null
          sharepoint_link?: string | null
          sort_order?: number | null
        }
        Update: {
          description?: string
          id?: string
          label?: string
          location_code?: string | null
          sharepoint_link?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      subdepartments_roles: {
        Row: {
          role_id: string
          subdepartment_id: string
        }
        Insert: {
          role_id: string
          subdepartment_id: string
        }
        Update: {
          role_id?: string
          subdepartment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subdepartments_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subdepartments_roles_subdepartment_id_fkey"
            columns: ["subdepartment_id"]
            isOneToOne: false
            referencedRelation: "subdepartments"
            referencedColumns: ["id"]
          },
        ]
      }
      tiptap_content: {
        Row: {
          derived_json: Json
          version_id: string
          yjs_snapshot: string | null
          yjs_state_vector_hash: string | null
        }
        Insert: {
          derived_json: Json
          version_id: string
          yjs_snapshot?: string | null
          yjs_state_vector_hash?: string | null
        }
        Update: {
          derived_json?: Json
          version_id?: string
          yjs_snapshot?: string | null
          yjs_state_vector_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tiptap_content_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: true
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_event_attendees: {
        Row: {
          attendee_id: string
          training_event_id: string
        }
        Insert: {
          attendee_id: string
          training_event_id: string
        }
        Update: {
          attendee_id?: string
          training_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_event_attendees_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_event_attendees_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_event_attendees_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "training_event_attendees_training_event_id_fkey"
            columns: ["training_event_id"]
            isOneToOne: false
            referencedRelation: "training_events"
            referencedColumns: ["id"]
          },
        ]
      }
      training_event_enrollees: {
        Row: {
          enrollee_id: string
          training_event_id: string
        }
        Insert: {
          enrollee_id: string
          training_event_id: string
        }
        Update: {
          enrollee_id?: string
          training_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_event_enrollees_enrollee_id_fkey"
            columns: ["enrollee_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_event_enrollees_enrollee_id_fkey"
            columns: ["enrollee_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_event_enrollees_enrollee_id_fkey"
            columns: ["enrollee_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "training_event_enrollees_training_event_id_fkey"
            columns: ["training_event_id"]
            isOneToOne: false
            referencedRelation: "training_events"
            referencedColumns: ["id"]
          },
        ]
      }
      training_events: {
        Row: {
          created_at: string
          description: string | null
          ended_at: string | null
          event_status: string | null
          id: string
          scheduled_end: string | null
          scheduled_start: string | null
          started_at: string | null
          title: string | null
          training_reason: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          event_status?: string | null
          id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          started_at?: string | null
          title?: string | null
          training_reason?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          event_status?: string | null
          id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          started_at?: string | null
          title?: string | null
          training_reason?: string | null
        }
        Relationships: []
      }
      user_table_views: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_global: boolean
          is_locked: boolean
          name: string
          table_id: string
          updated_at: string
          view_state: Json
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_global?: boolean
          is_locked?: boolean
          name: string
          table_id: string
          updated_at?: string
          view_state: Json
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_global?: boolean
          is_locked?: boolean
          name?: string
          table_id?: string
          updated_at?: string
          view_state?: Json
        }
        Relationships: []
      }
    }
    Views: {
      v_all_personnel: {
        Row: {
          departments: Json | null
          display_name: string | null
          end_at: string | null
          first_hired_at: string | null
          first_name: string | null
          id: string | null
          is_active: boolean | null
          is_employed: boolean | null
          last_name: string | null
          latest_hired_at: string | null
          preferred_name: string | null
          primary_email_address: string | null
          primary_email_type: Database["public"]["Enums"]["email_type"] | null
          record_created_at: string | null
          roles: Json | null
          status_id: string | null
          status_label: string | null
        }
        Relationships: []
      }
      v_current_user_active_roles: {
        Row: {
          assigned_since: string | null
          involvement_id: string | null
          involvement_label: string | null
          proficiency_id: string | null
          proficiency_label: string | null
          role_id: string | null
          role_label: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personnel_roles_events_involvement_id_fkey"
            columns: ["involvement_id"]
            isOneToOne: false
            referencedRelation: "role_involvements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_proficiency_id_fkey"
            columns: ["proficiency_id"]
            isOneToOne: false
            referencedRelation: "role_proficiencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_current_user_context: {
        Row: {
          departments: Json | null
          display_name: string | null
          emails: Json | null
          employment: Json | null
          first_name: string | null
          is_system_admin: boolean | null
          is_top_management: boolean | null
          last_name: string | null
          personnel_id: string | null
          preferred_name: string | null
          roles: Json | null
        }
        Relationships: []
      }
      v_current_user_departments: {
        Row: {
          department_id: string | null
          department_label: string | null
        }
        Relationships: []
      }
      v_person_departments_current_min: {
        Row: {
          department_id: string | null
          department_label: string | null
          personnel_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
        ]
      }
      v_person_employment_current_min: {
        Row: {
          bucket: Database["public"]["Enums"]["employment_types"] | null
          end_at: string | null
          first_hired_at: string | null
          is_active: boolean | null
          is_employed: boolean | null
          latest_hired_at: string | null
          personnel_id: string | null
          status_id: string | null
          status_label: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employment_events_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_events_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_events_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
        ]
      }
      v_person_roles_current_min: {
        Row: {
          assigned_since: string | null
          involvement_id: string | null
          involvement_label: string | null
          personnel_id: string | null
          proficiency_id: string | null
          proficiency_label: string | null
          role_id: string | null
          role_label: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_all_personnel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_assignment_periods_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "v_current_user_context"
            referencedColumns: ["personnel_id"]
          },
          {
            foreignKeyName: "personnel_roles_events_involvement_id_fkey"
            columns: ["involvement_id"]
            isOneToOne: false
            referencedRelation: "role_involvements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_proficiency_id_fkey"
            columns: ["proficiency_id"]
            isOneToOne: false
            referencedRelation: "role_proficiencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personnel_roles_events_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_personnel_without_email: {
        Args: never
        Returns: {
          first_name: string
          id: string
          last_name: string
          preferred_name: string
        }[]
      }
      has_any_role: { Args: { p_labels: string[] }; Returns: boolean }
      has_role: { Args: { p_label: string }; Returns: boolean }
      is_system_admin: { Args: never; Returns: boolean }
      is_top_management: { Args: never; Returns: boolean }
      map_commit: {
        Args: {
          p_comment?: string
          p_derived: Json
          p_document_id: string
          p_update: string
        }
        Returns: undefined
      }
      map_load_latest: { Args: { p_document_id: string }; Returns: string }
    }
    Enums: {
      clocking_event_types: "setup" | "start" | "pause" | "resume" | "complete"
      document_approval_statuses:
        | "draft"
        | "pending_review"
        | "approved"
        | "published"
        | "rejected"
        | "archived"
      document_assignment_event_types: "required" | "suggested" | "removed"
      document_content_types: "tiptap_content" | "map_content" | "file_content"
      email_type:
        | "Work"
        | "Personal"
        | "Shared"
        | "Placeholder"
        | "Archived"
        | "Temporary"
      employment_types:
        | "current"
        | "former"
        | "on_leave"
        | "prospective"
        | "external"
        | "system"
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
      clocking_event_types: ["setup", "start", "pause", "resume", "complete"],
      document_approval_statuses: [
        "draft",
        "pending_review",
        "approved",
        "published",
        "rejected",
        "archived",
      ],
      document_assignment_event_types: ["required", "suggested", "removed"],
      document_content_types: ["tiptap_content", "map_content", "file_content"],
      email_type: [
        "Work",
        "Personal",
        "Shared",
        "Placeholder",
        "Archived",
        "Temporary",
      ],
      employment_types: [
        "current",
        "former",
        "on_leave",
        "prospective",
        "external",
        "system",
      ],
    },
  },
} as const
