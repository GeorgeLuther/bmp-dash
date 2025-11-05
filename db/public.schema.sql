

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."clocking_event_types" AS ENUM (
    'setup',
    'start',
    'pause',
    'resume',
    'complete'
);


ALTER TYPE "public"."clocking_event_types" OWNER TO "postgres";


COMMENT ON TYPE "public"."clocking_event_types" IS 'defines ';



CREATE TYPE "public"."document_approval_statuses" AS ENUM (
    'draft',
    'pending_review',
    'approved',
    'published',
    'rejected',
    'archived'
);


ALTER TYPE "public"."document_approval_statuses" OWNER TO "postgres";


COMMENT ON TYPE "public"."document_approval_statuses" IS 'defines approval statuses to control document versioning';



CREATE TYPE "public"."document_assignment_event_types" AS ENUM (
    'required',
    'suggested',
    'removed'
);


ALTER TYPE "public"."document_assignment_event_types" OWNER TO "postgres";


COMMENT ON TYPE "public"."document_assignment_event_types" IS 'defines the relationship between a document and a role, etc.';



CREATE TYPE "public"."document_content_types" AS ENUM (
    'tiptap_content',
    'map_content',
    'file_content'
);


ALTER TYPE "public"."document_content_types" OWNER TO "postgres";


COMMENT ON TYPE "public"."document_content_types" IS 'defines the underling data of a document (tiptap,  react flow, file)cp';



CREATE TYPE "public"."email_type" AS ENUM (
    'Work',
    'Personal',
    'Shared',
    'Placeholder',
    'Archived',
    'Temporary'
);


ALTER TYPE "public"."email_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."email_type" IS 'work, personal, shared, placeholder';



CREATE TYPE "public"."employment_types" AS ENUM (
    'current',
    'former',
    'on_leave',
    'prospective',
    'external',
    'system'
);


ALTER TYPE "public"."employment_types" OWNER TO "postgres";


COMMENT ON TYPE "public"."employment_types" IS 'allows us to bucket people based on groups of employment statuses';



CREATE OR REPLACE FUNCTION "public"."get_personnel_without_email"() RETURNS TABLE("id" "uuid", "first_name" "text", "last_name" "text", "preferred_name" "text")
    LANGUAGE "sql"
    AS $$
  select p.id, p.first_name, p.last_name, p.preferred_name
  from personnel p
  left join personnel_emails pe on p.id = pe.personnel_id
  where pe.id is null
  limit 1000;
$$;


ALTER FUNCTION "public"."get_personnel_without_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_top_management"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
with tm as (
  select r.id as role_id
  from public.roles r
  where r.label = 'Top Management'
  limit 1
),
latest as (
  select distinct on (pre.personnel_id, pre.role_id)
         pre.personnel_id, pre.role_id, pre.involvement_id, pre.effective_at
  from public.personnel_roles_events pre
  where pre.personnel_id = auth.uid()
    and pre.event_type_id in ('assigned','adjusted')
    and pre.effective_at <= now()
  order by pre.personnel_id, pre.role_id, pre.effective_at desc
)
select exists (
  select 1
  from latest l
  join tm on tm.role_id = l.role_id
  where l.involvement_id is distinct from 'blocked'
    and not exists (
      select 1
      from public.personnel_roles_events u
      where u.personnel_id = l.personnel_id
        and u.role_id = l.role_id
        and u.event_type_id = 'unassigned'
        and u.effective_at > l.effective_at
        and u.effective_at <= now()
    )
);
$$;


ALTER FUNCTION "public"."is_top_management"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."map_commit"("p_document_id" "uuid", "p_update" "bytea", "p_derived" "jsonb", "p_comment" "text" DEFAULT 'minor commit'::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare
  v_version uuid;
begin
  -- target the latest draft of this document
  select id into v_version
  from public.document_versions
  where document_id = p_document_id
    and status = 'draft'
  order by created_at desc
  limit 1;

  if v_version is null then
    raise exception 'No draft version for document %', p_document_id;
  end if;

  -- upsert the content row for this draft
  update public.map_content
     set yjs_snapshot = p_update,
         derived_json = p_derived
   where version_id = v_version;

  if not found then
    insert into public.map_content(version_id, derived_json, yjs_snapshot, yjs_state_vector_hash)
    values (v_version, p_derived, p_update, '\x');
  end if;

  -- optional: advance minor version and note
  update public.document_versions
     set version_minor = version_minor + 1,
         change_comment = coalesce(p_comment, 'minor commit'),
         updated_at = now()
   where id = v_version;
end;
$$;


ALTER FUNCTION "public"."map_commit"("p_document_id" "uuid", "p_update" "bytea", "p_derived" "jsonb", "p_comment" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."map_load_latest"("p_document_id" "uuid") RETURNS "bytea"
    LANGUAGE "sql" STABLE
    AS $$
  select mc.yjs_snapshot
  from public.document_versions dv
  join public.map_content mc on mc.version_id = dv.id
  where dv.document_id = p_document_id
    and dv.status = 'draft'
  order by dv.created_at desc
  limit 1
$$;


ALTER FUNCTION "public"."map_load_latest"("p_document_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."departments" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text" NOT NULL,
    "description" "text",
    "parent_department_id" "uuid",
    "manager_id" "uuid",
    "sharepoint_url" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sort_order" smallint
);


ALTER TABLE "public"."departments" OWNER TO "postgres";


COMMENT ON TABLE "public"."departments" IS 'High-level process groups in our organization';



CREATE TABLE IF NOT EXISTS "public"."departments_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role_id" "uuid" NOT NULL,
    "department_id" "uuid" NOT NULL
);


ALTER TABLE "public"."departments_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."departments_roles" IS 'lookup associating departments and roles. many to many.';



CREATE TABLE IF NOT EXISTS "public"."departments_subdepartments" (
    "id" bigint NOT NULL,
    "department_id" "uuid",
    "subdepartment_id" "uuid"
);


ALTER TABLE "public"."departments_subdepartments" OWNER TO "postgres";


COMMENT ON TABLE "public"."departments_subdepartments" IS 'Many to many associations between departments and subdepartments. Typically a subdepartment / subprocess exists within a single department / process, but not always.';



ALTER TABLE "public"."departments_subdepartments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."departments_subdepartments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."document_criticality" (
    "id" "text" NOT NULL,
    "label" "text" NOT NULL,
    "definition" "text" NOT NULL,
    "sort_order" smallint,
    "suggested_review_frequency" smallint NOT NULL
);


ALTER TABLE "public"."document_criticality" OWNER TO "postgres";


COMMENT ON TABLE "public"."document_criticality" IS 'defines the prescriptiveness of a policy document';



CREATE TABLE IF NOT EXISTS "public"."document_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "version_major" smallint DEFAULT '0'::smallint NOT NULL,
    "version_minor" smallint DEFAULT '0'::smallint NOT NULL,
    "version_patch" smallint DEFAULT '1'::smallint NOT NULL,
    "content_type" "public"."document_content_types" NOT NULL,
    "change_comment" "text",
    "status" "public"."document_approval_statuses" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


ALTER TABLE "public"."document_versions" OWNER TO "postgres";


COMMENT ON TABLE "public"."document_versions" IS 'version history pointer associating document metadata with specific content';



CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "doc_code" "text" NOT NULL,
    "title" "text" NOT NULL,
    "resource_format" "text" NOT NULL,
    "criticality" "text",
    "current_published_version_id" "uuid",
    "is_public" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "archived_at" timestamp with time zone
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


COMMENT ON TABLE "public"."documents" IS 'stub, stores critical metadata about QMS document resources';



CREATE TABLE IF NOT EXISTS "public"."documents_approval_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "document_id" "uuid" NOT NULL,
    "tiptap_version_id" "uuid",
    "map_version_id" "uuid",
    "file_version_id" "uuid",
    "change_description" "text" NOT NULL,
    "approval_status" "public"."document_approval_statuses" NOT NULL,
    CONSTRAINT "enforce_single_version_type" CHECK (("num_nonnulls"("tiptap_version_id", "map_version_id", "file_version_id") = 1))
);


ALTER TABLE "public"."documents_approval_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."documents_approval_events" IS 'stores records of document status changes';



CREATE TABLE IF NOT EXISTS "public"."documents_roles_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role_id" "uuid" NOT NULL,
    "document_id" "uuid" NOT NULL,
    "assignment_event_type" "public"."document_assignment_event_types" NOT NULL,
    "description" "text",
    "created_by" "uuid"
);


ALTER TABLE "public"."documents_roles_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."documents_roles_events" IS 'lookup table. assign documents to roles.';



CREATE TABLE IF NOT EXISTS "public"."employment_status_history_temp" (
    "personnel_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "from_status" "text",
    "to_status" "text",
    "log_date" timestamp with time zone,
    "id" "uuid" NOT NULL
);


ALTER TABLE "public"."employment_status_history_temp" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employment_statuses" (
    "label" "text" NOT NULL,
    "description" "text",
    "sort_order" smallint,
    "id" "text" NOT NULL,
    "is_employed" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    "bucket" "public"."employment_types" NOT NULL
);


ALTER TABLE "public"."employment_statuses" OWNER TO "postgres";


COMMENT ON TABLE "public"."employment_statuses" IS 'contains types and their metadata such as descriptions';



COMMENT ON COLUMN "public"."employment_statuses"."is_employed" IS 'identified those who are working vs those who are not actively employed';



COMMENT ON COLUMN "public"."employment_statuses"."is_active" IS 'Defines which employment statuses are considered ''in play'' for scheduling, training, etc.';



COMMENT ON COLUMN "public"."employment_statuses"."bucket" IS 'allows sorting into relevant tables';



CREATE TABLE IF NOT EXISTS "public"."file_content" (
    "version_id" "uuid" NOT NULL,
    "path" "text",
    "file_name" "text",
    "mime_type" "text",
    "size_bytes" bigint
);


ALTER TABLE "public"."file_content" OWNER TO "postgres";


COMMENT ON TABLE "public"."file_content" IS 'stores filestore link to data for document versions like pdf and pptx';



CREATE TABLE IF NOT EXISTS "public"."items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sku" "text",
    "description" "text",
    "e2_description" "text",
    "pantone_color" "text",
    "main_photo_link" "text"
);


ALTER TABLE "public"."items" OWNER TO "postgres";


COMMENT ON TABLE "public"."items" IS 'core info on products, parts, components, measuring devices, machines, etc';



CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "text" NOT NULL,
    "customer_po" "text",
    "customer_id" "text",
    "item_id" "uuid" DEFAULT "gen_random_uuid"(),
    "order_quantity" integer,
    "sales_agent" "text",
    "status" "text",
    "ordered_at" timestamp with time zone,
    "due_at" timestamp with time zone,
    "job_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "projected_completion_at" timestamp with time zone,
    "last_synced_at" timestamp with time zone DEFAULT "now"(),
    "total_releases" integer
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


COMMENT ON TABLE "public"."jobs" IS 'customer orders requiring fulfilment. has one or more releases.';



CREATE TABLE IF NOT EXISTS "public"."map_content" (
    "version_id" "uuid" NOT NULL,
    "derived_json" "jsonb" NOT NULL,
    "yjs_snapshot" "bytea" NOT NULL,
    "yjs_state_vector_hash" "bytea" NOT NULL
);


ALTER TABLE "public"."map_content" OWNER TO "postgres";


COMMENT ON TABLE "public"."map_content" IS 'stores react flow map data for document versions';



CREATE TABLE IF NOT EXISTS "public"."operation_clocking" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "operation_id" "uuid" DEFAULT "gen_random_uuid"(),
    "clocking_event_type" "public"."clocking_event_types" NOT NULL
);


ALTER TABLE "public"."operation_clocking" OWNER TO "postgres";


COMMENT ON TABLE "public"."operation_clocking" IS 'record the setup, start, pause, resume, and completion of production operations.';



CREATE TABLE IF NOT EXISTS "public"."operations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "release_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sequence_number" integer,
    "sort_order" integer,
    "work_area" "text",
    "component" "text",
    "operation_type" "text",
    "estimated_hours" real,
    "info" "text",
    "rates" integer,
    "hits" integer,
    "times" integer,
    "nonconforming_count" integer,
    "scrap_count" integer
);


ALTER TABLE "public"."operations" OWNER TO "postgres";


COMMENT ON TABLE "public"."operations" IS 'scheduled production activities';



CREATE TABLE IF NOT EXISTS "public"."personnel" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "old_id" "text",
    "nfc_id" "text",
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "preferred_name" "text",
    "agency" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."personnel" OWNER TO "postgres";


COMMENT ON TABLE "public"."personnel" IS 'contains basic personnel info';



CREATE TABLE IF NOT EXISTS "public"."personnel_emails" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "address" "text" NOT NULL,
    "personnel_id" "uuid" NOT NULL,
    "is_primary" boolean,
    "is_verified" boolean DEFAULT false NOT NULL,
    "notes" "text",
    "send_notifications" boolean DEFAULT false NOT NULL,
    "is_invited" boolean DEFAULT false NOT NULL,
    "email_type" "public"."email_type" DEFAULT 'Placeholder'::"public"."email_type" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "create_account" boolean DEFAULT true NOT NULL,
    "is_disabled" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."personnel_emails" OWNER TO "postgres";


COMMENT ON TABLE "public"."personnel_emails" IS 'stores email addresses associated with personnel';



COMMENT ON COLUMN "public"."personnel_emails"."notes" IS 'for admin notes';



COMMENT ON COLUMN "public"."personnel_emails"."is_invited" IS 'confirmation email sent? authorized to log in with supabase auth?';



COMMENT ON COLUMN "public"."personnel_emails"."email_type" IS 'is this a work email? a placeholder? a personal used as secondary? a shared email for a multi-user account or mass email?';



COMMENT ON COLUMN "public"."personnel_emails"."id" IS 'uuid as primary key for email entries';



CREATE TABLE IF NOT EXISTS "public"."personnel_employment_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "personnel_id" "uuid",
    "employment_status_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reason" "text",
    "admin_statement" "text",
    "employee_statement" "text",
    "effective_at" timestamp with time zone NOT NULL,
    "source" "text",
    "created_by" "uuid"
);


ALTER TABLE "public"."personnel_employment_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."personnel_employment_events" IS 'log changes personnel in employment status';



COMMENT ON COLUMN "public"."personnel_employment_events"."employment_status_id" IS 'reference employment_status.id';



COMMENT ON COLUMN "public"."personnel_employment_events"."effective_at" IS 'logs the actual time that the emploment status officially changed, rather than just when the change was recorded';



COMMENT ON COLUMN "public"."personnel_employment_events"."created_by" IS 'who entered this record';



CREATE TABLE IF NOT EXISTS "public"."personnel_initial_dates_temp" (
    "id" bigint NOT NULL,
    "start_date" timestamp with time zone,
    "hired_date" timestamp with time zone,
    "last_date" timestamp with time zone,
    "personnel_id" "uuid",
    "status" "text"
);


ALTER TABLE "public"."personnel_initial_dates_temp" OWNER TO "postgres";


ALTER TABLE "public"."personnel_initial_dates_temp" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."personnel_initial_dates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."personnel_roles_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "personnel_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL,
    "proficiency_id" "text",
    "event_type_id" "text",
    "effective_at" timestamp with time zone NOT NULL,
    "assigned_by" "uuid",
    "expires_at" timestamp with time zone,
    "review_at" timestamp with time zone,
    "involvement_id" "text",
    "is_audited" boolean,
    "audited_by" "uuid",
    "source" "text",
    "audit_note" "text",
    "audited_at" timestamp with time zone
);


ALTER TABLE "public"."personnel_roles_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."personnel_roles_events" IS 'helper table for role assignment durations';



COMMENT ON COLUMN "public"."personnel_roles_events"."proficiency_id" IS 'associate this event with a proficiency change';



COMMENT ON COLUMN "public"."personnel_roles_events"."event_type_id" IS 'defines the nature of the event, i.e. started, suspended, etc.';



COMMENT ON COLUMN "public"."personnel_roles_events"."effective_at" IS 'defines when the new role becomes official';



COMMENT ON COLUMN "public"."personnel_roles_events"."expires_at" IS 'Define a date when a temporary role assignment is up.';



COMMENT ON COLUMN "public"."personnel_roles_events"."review_at" IS 'Reminder date to review employee role assignment.';



COMMENT ON COLUMN "public"."personnel_roles_events"."involvement_id" IS 'A classification that indicates how and when a person is expected to perform a given role';



COMMENT ON COLUMN "public"."personnel_roles_events"."is_audited" IS 'records with is_audited = TRUE have been reviewed for reasonable accuracy by a manager or HR.';



COMMENT ON COLUMN "public"."personnel_roles_events"."audited_by" IS 'who performed the audit to determine the validity of the record';



COMMENT ON COLUMN "public"."personnel_roles_events"."source" IS 'temporary. identify the source of a record to better understand its validity';



COMMENT ON COLUMN "public"."personnel_roles_events"."audit_note" IS 'allows HR or management to take notes when auditing';



CREATE TABLE IF NOT EXISTS "public"."personnel_roles_events_comments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "author_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "is_private" boolean NOT NULL,
    "modified_at" timestamp with time zone,
    "comment_text" "text" NOT NULL
);


ALTER TABLE "public"."personnel_roles_events_comments" OWNER TO "postgres";


ALTER TABLE "public"."personnel_roles_events_comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."personnel_roles_events_comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."release_table_views" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "is_default" boolean DEFAULT false,
    "view_state" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_shared" boolean DEFAULT false,
    "shared_with_roles" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."release_table_views" OWNER TO "postgres";


COMMENT ON TABLE "public"."release_table_views" IS 'store settings for the release table';



CREATE TABLE IF NOT EXISTS "public"."releases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "release_code" "text",
    "release_number" smallint,
    "total_releases" smallint,
    "job_id" "text",
    "ms_job_name" "text",
    "ms_customer_po" "text",
    "item_id" "uuid",
    "ms_comments" "text",
    "expedite_notes" "text",
    "production_manager_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "release_status" "text",
    "ms_due_date" "date",
    "ms_po_date" "date",
    "purchasing_status" "text",
    "date_to_production_manager" "date",
    "week_projected" "date",
    "date_to_floor" "date",
    "production_start_at" "date",
    "production_complete_at" "date",
    "ms_order_quantity" "text",
    "ms_po_quantity" "text",
    "release_quantity" integer,
    "acceptable_overage" integer,
    "quantity_to_make" integer,
    "quantity_to_stock" integer,
    "quantity_to_ship" integer,
    "quantity_per_carton" smallint,
    "cartons_per_pallet" smallint,
    "has_customer_kit" boolean,
    "old_kit_locations" "text",
    "kitting_hours" real,
    "ms_paint_color" "text",
    "ms_paint_lbs" real,
    "shear_hours" real,
    "punch_hours" real,
    "coil_hours" real,
    "auxiliary_hours" real,
    "pem_hours" real,
    "global_or_vt30" "text",
    "global_hours" real,
    "vt30_hours" real,
    "cnc_hours" real,
    "coastone_hours" real,
    "hem_and_flat_hours" real,
    "seventyfive_ton_hours" real,
    "fourty_ton_hours" real,
    "all_brake_hours" real,
    "brake_setups" real,
    "mig_hours" real,
    "tig_hours" real,
    "weld_rivet_hours" real,
    "small_box_hours" real,
    "large_box_hours" real,
    "scoop_weld_hours" real,
    "time_weld_hours" real,
    "air_weld_hours" real,
    "spot_weld_hours" real,
    "weld_setups" real,
    "weld_hours" real,
    "wash_hours" real,
    "paint_hours" real,
    "pack_line_hours" real,
    "pack_machine_rivet_hours" real,
    "pack_pop_rivet_hours" real,
    "pack_screen_hours" real,
    "pack_cell_hours" real,
    "shipping_hours" real,
    "ms_row_index" integer,
    "shear_order" integer,
    "punch_order" integer,
    "coil_order" integer,
    "auxiliary_order" integer,
    "pem_order" integer,
    "cnc_order" integer,
    "global_order" integer,
    "vt30_order" integer,
    "coastone_order" integer,
    "hem_and_flat_order" integer,
    "seventyfive_ton_order" integer,
    "fourty_ton_order" integer,
    "all_brake_order" integer,
    "mig_order" integer,
    "tig_order" integer,
    "weld_rivet_order" integer,
    "small_box_order" integer,
    "large_box_order" integer,
    "scoop_weld_order" integer,
    "time_weld_order" integer,
    "air_weld_order" integer,
    "spot_weld_order" integer,
    "weld_order" integer,
    "wash_order" integer,
    "paint_order" integer,
    "pack_line_order" integer,
    "pack_machine_rivet_order" integer,
    "pack_pop_rivet_order" integer,
    "pack_screen_order" integer,
    "pack_cell_order" integer,
    "shipping_order" integer
);


ALTER TABLE "public"."releases" OWNER TO "postgres";


COMMENT ON TABLE "public"."releases" IS 'A Release represents a single production run within a job or order. When a customer order (job) is divided into smaller, manageable quantities for production efficiency, called a Release. All Releases that have been scheduled & routed are synced/upserted from the QF-026 Master Schedule to this table. This will soon replace the master schedule entirely and pull directly from job sheet travelers/E2 in tandem with the jobs table.';



CREATE TABLE IF NOT EXISTS "public"."resource_formats" (
    "id" "text" NOT NULL,
    "label" "text" NOT NULL,
    "sort_order" smallint NOT NULL,
    "description" "text" NOT NULL,
    "classification_code" "text"
);


ALTER TABLE "public"."resource_formats" OWNER TO "postgres";


COMMENT ON TABLE "public"."resource_formats" IS 'defines types of documents';



CREATE TABLE IF NOT EXISTS "public"."role_event_types" (
    "id" "text" NOT NULL,
    "label" "text" NOT NULL,
    "description" "text" NOT NULL,
    "sort_order" smallint NOT NULL
);


ALTER TABLE "public"."role_event_types" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_event_types" IS 'Determines the state of a role event such as assigned, unassigned, etc.';



CREATE TABLE IF NOT EXISTS "public"."role_involvements" (
    "id" "text" NOT NULL,
    "label" "text" NOT NULL,
    "description" "text" NOT NULL,
    "sort_order" smallint,
    "icon_name" "text"
);


ALTER TABLE "public"."role_involvements" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_involvements" IS 'A classification that indicates how and when a person is expected to perform a given role';



CREATE TABLE IF NOT EXISTS "public"."role_person_lookup_temp" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "personnel_id" "uuid" DEFAULT "gen_random_uuid"(),
    "role_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."role_person_lookup_temp" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_proficiencies" (
    "id" "text" NOT NULL,
    "label" "text" NOT NULL,
    "sort_order" smallint NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."role_proficiencies" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_proficiencies" IS 'defines progressive levels of demonstrated capability or understanding for a given role, skill, or responsibility';



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text" NOT NULL,
    "description" "text" NOT NULL,
    "coverage_goal" smallint,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "coverage_minimum" smallint,
    "new_id" "text"
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles" IS 'list of roles and associated metadata. used for access control, training, coverage, etc.';



COMMENT ON COLUMN "public"."roles"."coverage_minimum" IS 'Defines the minimum number of personnel who should hold this role.';



CREATE TABLE IF NOT EXISTS "public"."subdepartments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "label" "text" NOT NULL,
    "description" "text" NOT NULL,
    "sharepoint_link" "text",
    "location_code" "text",
    "sort_order" smallint
);


ALTER TABLE "public"."subdepartments" OWNER TO "postgres";


COMMENT ON TABLE "public"."subdepartments" IS 'Subprocess groups in our organization that fulfill a specific set of procedures, work instructions, and operations.';



COMMENT ON COLUMN "public"."subdepartments"."sharepoint_link" IS 'URL to relevant SharePoint site or page.';



CREATE TABLE IF NOT EXISTS "public"."subdepartments_roles" (
    "role_id" "uuid" NOT NULL,
    "subdepartment_id" "uuid" NOT NULL
);


ALTER TABLE "public"."subdepartments_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."subdepartments_roles" IS 'associates roles with subdepartments';



CREATE TABLE IF NOT EXISTS "public"."tiptap_content" (
    "version_id" "uuid" NOT NULL,
    "derived_json" "jsonb" NOT NULL,
    "yjs_snapshot" "bytea",
    "yjs_state_vector_hash" "bytea"
);


ALTER TABLE "public"."tiptap_content" OWNER TO "postgres";


COMMENT ON TABLE "public"."tiptap_content" IS 'stores tiptap data for document versions';



CREATE TABLE IF NOT EXISTS "public"."training_event_attendees" (
    "training_event_id" "uuid" NOT NULL,
    "attendee_id" "uuid" NOT NULL
);


ALTER TABLE "public"."training_event_attendees" OWNER TO "postgres";


COMMENT ON TABLE "public"."training_event_attendees" IS 'record who attended a training event';



CREATE TABLE IF NOT EXISTS "public"."training_event_enrollees" (
    "training_event_id" "uuid" NOT NULL,
    "enrollee_id" "uuid" NOT NULL
);


ALTER TABLE "public"."training_event_enrollees" OWNER TO "postgres";


COMMENT ON TABLE "public"."training_event_enrollees" IS 'assign personnel to attend a training event';



CREATE TABLE IF NOT EXISTS "public"."training_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "description" "text",
    "training_reason" "text",
    "event_status" "text",
    "scheduled_start" timestamp with time zone,
    "scheduled_end" timestamp with time zone,
    "started_at" timestamp with time zone,
    "ended_at" timestamp with time zone
);


ALTER TABLE "public"."training_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."training_events" IS 'record of training events';



CREATE OR REPLACE VIEW "public"."v_person_roles_current_min" WITH ("security_invoker"='on') AS
 WITH "latest_set" AS (
         SELECT DISTINCT ON ("pre"."personnel_id", "pre"."role_id") "pre"."personnel_id",
            "pre"."role_id",
            "pre"."involvement_id",
            "pre"."proficiency_id",
            "pre"."effective_at" AS "assigned_since"
           FROM "public"."personnel_roles_events" "pre"
          WHERE (("pre"."event_type_id" = ANY (ARRAY['assigned'::"text", 'adjusted'::"text"])) AND ("pre"."effective_at" <= "now"()))
          ORDER BY "pre"."personnel_id", "pre"."role_id", "pre"."effective_at" DESC
        ), "still_assigned" AS (
         SELECT "l"."personnel_id",
            "l"."role_id",
            "l"."involvement_id",
            "l"."proficiency_id",
            "l"."assigned_since"
           FROM "latest_set" "l"
          WHERE ((EXISTS ( SELECT 1
                   FROM "public"."personnel_roles_events" "a"
                  WHERE (("a"."personnel_id" = "l"."personnel_id") AND ("a"."role_id" = "l"."role_id") AND ("a"."event_type_id" = 'assigned'::"text") AND ("a"."effective_at" <= "l"."assigned_since")))) AND (NOT (EXISTS ( SELECT 1
                   FROM "public"."personnel_roles_events" "u"
                  WHERE (("u"."personnel_id" = "l"."personnel_id") AND ("u"."role_id" = "l"."role_id") AND ("u"."event_type_id" = 'unassigned'::"text") AND ("u"."effective_at" > "l"."assigned_since") AND ("u"."effective_at" <= "now"()))))) AND ("l"."involvement_id" IS DISTINCT FROM 'blocked'::"text"))
        )
 SELECT "s"."personnel_id",
    "s"."role_id",
    "r"."label" AS "role_label",
    "s"."involvement_id",
    "inv"."label" AS "involvement_label",
    "s"."proficiency_id",
    "prof"."label" AS "proficiency_label",
    "s"."assigned_since"
   FROM ((("still_assigned" "s"
     JOIN "public"."roles" "r" ON (("r"."id" = "s"."role_id")))
     LEFT JOIN "public"."role_involvements" "inv" ON (("inv"."id" = "s"."involvement_id")))
     LEFT JOIN "public"."role_proficiencies" "prof" ON (("prof"."id" = "s"."proficiency_id")));


ALTER TABLE "public"."v_person_roles_current_min" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_person_departments_current_min" WITH ("security_invoker"='on') AS
 SELECT DISTINCT "r"."personnel_id",
    "d"."id" AS "department_id",
    "d"."label" AS "department_label"
   FROM (("public"."v_person_roles_current_min" "r"
     JOIN "public"."departments_roles" "dr" ON (("dr"."role_id" = "r"."role_id")))
     JOIN "public"."departments" "d" ON (("d"."id" = "dr"."department_id")));


ALTER TABLE "public"."v_person_departments_current_min" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_person_employment_current_min" WITH ("security_invoker"='on') AS
 WITH "events_now" AS (
         SELECT "personnel_employment_events"."id",
            "personnel_employment_events"."personnel_id",
            "personnel_employment_events"."employment_status_id",
            "personnel_employment_events"."created_at",
            "personnel_employment_events"."reason",
            "personnel_employment_events"."admin_statement",
            "personnel_employment_events"."employee_statement",
            "personnel_employment_events"."effective_at",
            "personnel_employment_events"."source",
            "personnel_employment_events"."created_by"
           FROM "public"."personnel_employment_events"
          WHERE ("personnel_employment_events"."effective_at" <= "now"())
        ), "latest" AS (
         SELECT DISTINCT ON ("e"."personnel_id") "e"."personnel_id",
            "e"."employment_status_id",
            "e"."effective_at"
           FROM "events_now" "e"
          ORDER BY "e"."personnel_id", "e"."effective_at" DESC
        ), "first_hire" AS (
         SELECT "events_now"."personnel_id",
            "min"("events_now"."effective_at") AS "first_hired_at"
           FROM "events_now"
          WHERE ("events_now"."employment_status_id" = 'hired'::"text")
          GROUP BY "events_now"."personnel_id"
        ), "last_hire" AS (
         SELECT "events_now"."personnel_id",
            "max"("events_now"."effective_at") AS "latest_hired_at"
           FROM "events_now"
          WHERE ("events_now"."employment_status_id" = 'hired'::"text")
          GROUP BY "events_now"."personnel_id"
        ), "last_end" AS (
         SELECT "e"."personnel_id",
            "max"("e"."effective_at") AS "ended_at"
           FROM ("events_now" "e"
             JOIN "public"."employment_statuses" "s_1" ON (("s_1"."id" = "e"."employment_status_id")))
          WHERE (("s_1"."is_employed" = false) AND ("s_1"."is_active" = false))
          GROUP BY "e"."personnel_id"
        )
 SELECT "l"."personnel_id",
    "s"."id" AS "status_id",
    "s"."label" AS "status_label",
    "s"."is_employed",
    "s"."is_active",
    "s"."bucket",
    "fh"."first_hired_at",
    "lh"."latest_hired_at",
        CASE
            WHEN (("s"."is_employed" = false) AND ("s"."is_active" = false)) THEN "le"."ended_at"
            ELSE NULL::timestamp with time zone
        END AS "end_at"
   FROM (((("latest" "l"
     JOIN "public"."employment_statuses" "s" ON (("s"."id" = "l"."employment_status_id")))
     LEFT JOIN "first_hire" "fh" ON (("fh"."personnel_id" = "l"."personnel_id")))
     LEFT JOIN "last_hire" "lh" ON (("lh"."personnel_id" = "l"."personnel_id")))
     LEFT JOIN "last_end" "le" ON (("le"."personnel_id" = "l"."personnel_id")));


ALTER TABLE "public"."v_person_employment_current_min" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_all_personnel" WITH ("security_invoker"='on') AS
 SELECT "p"."id",
    "p"."first_name",
    "p"."last_name",
    "p"."preferred_name",
    COALESCE("p"."preferred_name", "p"."first_name") AS "display_name",
    "emp"."status_id",
    "emp"."status_label",
    "emp"."is_employed",
    "emp"."is_active",
    "emp"."first_hired_at",
    "emp"."latest_hired_at",
    "emp"."end_at",
    "best_email"."address" AS "primary_email_address",
    "best_email"."email_type" AS "primary_email_type",
    COALESCE("roles"."roles", '[]'::"jsonb") AS "roles",
    COALESCE("depts"."departments", '[]'::"jsonb") AS "departments",
    "p"."created_at" AS "record_created_at"
   FROM (((("public"."personnel" "p"
     LEFT JOIN "public"."v_person_employment_current_min" "emp" ON (("emp"."personnel_id" = "p"."id")))
     LEFT JOIN LATERAL ( SELECT "pe"."address",
            "pe"."email_type"
           FROM "public"."personnel_emails" "pe"
          WHERE ("pe"."personnel_id" = "p"."id")
          ORDER BY "pe"."is_primary" DESC, "pe"."created_at" DESC
         LIMIT 1) "best_email" ON (true))
     LEFT JOIN LATERAL ( SELECT "jsonb_agg"("jsonb_build_object"('role_id', "r"."role_id", 'role_label', "r"."role_label", 'involvement_label', "r"."involvement_label", 'proficiency_label', "r"."proficiency_label", 'assigned_since', "r"."assigned_since") ORDER BY "r"."role_label") AS "roles"
           FROM "public"."v_person_roles_current_min" "r"
          WHERE ("r"."personnel_id" = "p"."id")) "roles" ON (true))
     LEFT JOIN LATERAL ( SELECT "jsonb_agg"("jsonb_build_object"('department_id', "d"."department_id", 'department_label', "d"."department_label") ORDER BY "d"."department_label") AS "departments"
           FROM "public"."v_person_departments_current_min" "d"
          WHERE ("d"."personnel_id" = "p"."id")) "depts" ON (true));


ALTER TABLE "public"."v_all_personnel" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_current_user_active_roles" WITH ("security_invoker"='on') AS
 SELECT "r"."role_id",
    "r"."role_label",
    "r"."involvement_id",
    "r"."involvement_label",
    "r"."proficiency_id",
    "r"."proficiency_label",
    "r"."assigned_since"
   FROM "public"."v_person_roles_current_min" "r"
  WHERE ("r"."personnel_id" = "auth"."uid"());


ALTER TABLE "public"."v_current_user_active_roles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_current_user_departments" WITH ("security_invoker"='on') AS
 SELECT DISTINCT "d"."id" AS "department_id",
    "d"."label" AS "department_label"
   FROM (("public"."v_current_user_active_roles" "cur"
     JOIN "public"."departments_roles" "dr" ON (("dr"."role_id" = "cur"."role_id")))
     JOIN "public"."departments" "d" ON (("d"."id" = "dr"."department_id")));


ALTER TABLE "public"."v_current_user_departments" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_current_user_context" WITH ("security_invoker"='on') AS
 SELECT "p"."id" AS "personnel_id",
    COALESCE("p"."preferred_name", "p"."first_name") AS "display_name",
    "p"."first_name",
    "p"."last_name",
    "p"."preferred_name",
    COALESCE(( SELECT "json_agg"("json_build_object"('id', "e"."id", 'address', "e"."address", 'email_type', "e"."email_type", 'is_primary', "e"."is_primary", 'is_verified', "e"."is_verified", 'is_disabled', "e"."is_disabled", 'send_notifications', "e"."send_notifications") ORDER BY "e"."is_primary" DESC, "e"."created_at" DESC) AS "json_agg"
           FROM "public"."personnel_emails" "e"
          WHERE ("e"."personnel_id" = "p"."id")), '[]'::"json") AS "emails",
    COALESCE(( SELECT "json_build_object"('status_id', "emp"."status_id", 'status_label', "emp"."status_label", 'is_employed', "emp"."is_employed", 'is_active', "emp"."is_active") AS "json_build_object"
           FROM "public"."v_person_employment_current_min" "emp"
          WHERE ("emp"."personnel_id" = "p"."id")
         LIMIT 1), '{}'::"json") AS "employment",
    COALESCE(( SELECT "json_agg"("json_build_object"('role_id', "r"."role_id", 'role_label', "r"."role_label", 'involvement_id', "r"."involvement_id", 'involvement_label', "r"."involvement_label", 'proficiency_id', "r"."proficiency_id", 'proficiency_label', "r"."proficiency_label") ORDER BY "r"."role_label") AS "json_agg"
           FROM "public"."v_current_user_active_roles" "r"), '[]'::"json") AS "roles",
    COALESCE(( SELECT "json_agg"("json_build_object"('department_id', "d"."department_id", 'department_label', "d"."department_label") ORDER BY "d"."department_label") AS "json_agg"
           FROM "public"."v_current_user_departments" "d"), '[]'::"json") AS "departments"
   FROM "public"."personnel" "p"
  WHERE ("p"."id" = "auth"."uid"());


ALTER TABLE "public"."v_current_user_context" OWNER TO "postgres";


ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments_roles"
    ADD CONSTRAINT "departments_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments_subdepartments"
    ADD CONSTRAINT "departments_subdepartments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents_approval_events"
    ADD CONSTRAINT "document_approval_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_criticality"
    ADD CONSTRAINT "document_criticality_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_doc_code_key" UNIQUE ("doc_code");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents_roles_events"
    ADD CONSTRAINT "documents_roles_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personnel_employment_events"
    ADD CONSTRAINT "employment_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employment_status_history_temp"
    ADD CONSTRAINT "employment_status_history_temp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employment_statuses"
    ADD CONSTRAINT "employment_statuses_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."employment_statuses"
    ADD CONSTRAINT "employment_statuses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."file_content"
    ADD CONSTRAINT "file_content_pkey" PRIMARY KEY ("version_id");



ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."map_content"
    ADD CONSTRAINT "map_content_pkey" PRIMARY KEY ("version_id");



ALTER TABLE ONLY "public"."operation_clocking"
    ADD CONSTRAINT "operation_clocking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."operations"
    ADD CONSTRAINT "operations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_assignment_periods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personnel_emails"
    ADD CONSTRAINT "personnel_emails_address_key" UNIQUE ("address");



ALTER TABLE ONLY "public"."personnel_emails"
    ADD CONSTRAINT "personnel_emails_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."personnel_emails"
    ADD CONSTRAINT "personnel_emails_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personnel_initial_dates_temp"
    ADD CONSTRAINT "personnel_initial_dates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personnel_roles_events_comments"
    ADD CONSTRAINT "personnel_roles_events_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_proficiencies"
    ADD CONSTRAINT "proficiencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."release_table_views"
    ADD CONSTRAINT "release_views_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."releases"
    ADD CONSTRAINT "releases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resource_formats"
    ADD CONSTRAINT "resource_formats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resource_formats"
    ADD CONSTRAINT "resource_formats_sort_order_key" UNIQUE ("sort_order");



ALTER TABLE ONLY "public"."role_involvements"
    ADD CONSTRAINT "role_assignment_type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_event_types"
    ADD CONSTRAINT "role_event_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_person_lookup_temp"
    ADD CONSTRAINT "role_person_lookup_temp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_label_key" UNIQUE ("label");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subdepartments"
    ADD CONSTRAINT "subdepartments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subdepartments_roles"
    ADD CONSTRAINT "subdepartments_roles_pkey" PRIMARY KEY ("role_id", "subdepartment_id");



ALTER TABLE ONLY "public"."tiptap_content"
    ADD CONSTRAINT "tiptap_content_pkey" PRIMARY KEY ("version_id");



ALTER TABLE ONLY "public"."training_event_attendees"
    ADD CONSTRAINT "training_event_attendees_pkey" PRIMARY KEY ("training_event_id", "attendee_id");



ALTER TABLE ONLY "public"."training_event_enrollees"
    ADD CONSTRAINT "training_event_enrollees_pkey" PRIMARY KEY ("training_event_id", "enrollee_id");



ALTER TABLE ONLY "public"."training_events"
    ADD CONSTRAINT "training_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments_roles"
    ADD CONSTRAINT "uq_department_role" UNIQUE ("department_id", "role_id");



ALTER TABLE ONLY "public"."personnel"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "document_versions_document_id_created_at_idx" ON "public"."document_versions" USING "btree" ("document_id", "created_at" DESC);



CREATE INDEX "document_versions_document_id_status_idx" ON "public"."document_versions" USING "btree" ("document_id", "status");



CREATE INDEX "idx_pe_personnel_id_primary_created_desc" ON "public"."personnel_emails" USING "btree" ("personnel_id", "is_primary" DESC, "created_at" DESC);



CREATE INDEX "idx_personnel_emails_best" ON "public"."personnel_emails" USING "btree" ("personnel_id", "is_primary", "created_at" DESC);



CREATE INDEX "ix_pee_personnel_effective_at_desc" ON "public"."personnel_employment_events" USING "btree" ("personnel_id", "effective_at" DESC);



CREATE INDEX "ix_pee_personnel_hired_events" ON "public"."personnel_employment_events" USING "btree" ("personnel_id", "effective_at") WHERE ("employment_status_id" = 'hired'::"text");



CREATE INDEX "ix_pee_personnel_status_effective_at" ON "public"."personnel_employment_events" USING "btree" ("personnel_id", "employment_status_id", "effective_at" DESC);



CREATE INDEX "ix_pre_person_role_assigned" ON "public"."personnel_roles_events" USING "btree" ("personnel_id", "role_id", "effective_at" DESC) WHERE ("event_type_id" = ANY (ARRAY['assigned'::"text", 'adjusted'::"text"]));



CREATE INDEX "ix_pre_person_role_unassigned" ON "public"."personnel_roles_events" USING "btree" ("personnel_id", "role_id", "effective_at" DESC) WHERE ("event_type_id" = 'unassigned'::"text");



CREATE INDEX "ix_roles_label" ON "public"."roles" USING "btree" ("label");



CREATE INDEX "pre_event_lookup_idx" ON "public"."personnel_roles_events" USING "btree" ("personnel_id", "role_id", "event_type_id", "effective_at");



CREATE UNIQUE INDEX "uq_doc_one_published" ON "public"."document_versions" USING "btree" ("document_id") WHERE ("status" = 'published'::"public"."document_approval_statuses");



CREATE UNIQUE INDEX "uq_doc_semver" ON "public"."document_versions" USING "btree" ("document_id", "version_major", "version_minor", "version_patch");



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "public"."departments"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."departments_roles"
    ADD CONSTRAINT "departments_roles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."departments_roles"
    ADD CONSTRAINT "departments_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."departments_subdepartments"
    ADD CONSTRAINT "departments_subdepartments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."departments_subdepartments"
    ADD CONSTRAINT "departments_subdepartments_subdepartment_id_fkey" FOREIGN KEY ("subdepartment_id") REFERENCES "public"."subdepartments"("id");



ALTER TABLE ONLY "public"."documents_approval_events"
    ADD CONSTRAINT "document_approval_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."documents_approval_events"
    ADD CONSTRAINT "document_approval_events_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_criticality_fkey" FOREIGN KEY ("criticality") REFERENCES "public"."document_criticality"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_current_published_version_id_fkey" FOREIGN KEY ("current_published_version_id") REFERENCES "public"."document_versions"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_resource_format_fkey" FOREIGN KEY ("resource_format") REFERENCES "public"."resource_formats"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."documents_roles_events"
    ADD CONSTRAINT "documents_roles_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."documents_roles_events"
    ADD CONSTRAINT "documents_roles_events_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."documents_roles_events"
    ADD CONSTRAINT "documents_roles_events_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_employment_events"
    ADD CONSTRAINT "employment_events_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "public"."employment_statuses"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_employment_events"
    ADD CONSTRAINT "employment_events_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."file_content"
    ADD CONSTRAINT "file_content_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "public"."document_versions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."map_content"
    ADD CONSTRAINT "map_content_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "public"."document_versions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."operation_clocking"
    ADD CONSTRAINT "operation_clocking_operation_id_fkey" FOREIGN KEY ("operation_id") REFERENCES "public"."operations"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_assignment_periods_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."personnel_emails"
    ADD CONSTRAINT "personnel_emails_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."personnel_employment_events"
    ADD CONSTRAINT "personnel_employment_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_roles_events_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_roles_events_audited_by_fkey" FOREIGN KEY ("audited_by") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events_comments"
    ADD CONSTRAINT "personnel_roles_events_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events_comments"
    ADD CONSTRAINT "personnel_roles_events_comments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."personnel_roles_events"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_roles_events_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "public"."role_event_types"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_roles_events_involvement_id_fkey" FOREIGN KEY ("involvement_id") REFERENCES "public"."role_involvements"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_roles_events_proficiency_id_fkey" FOREIGN KEY ("proficiency_id") REFERENCES "public"."role_proficiencies"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."personnel_roles_events"
    ADD CONSTRAINT "personnel_roles_events_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."release_table_views"
    ADD CONSTRAINT "release_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."releases"
    ADD CONSTRAINT "releases_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."subdepartments_roles"
    ADD CONSTRAINT "subdepartments_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."subdepartments_roles"
    ADD CONSTRAINT "subdepartments_roles_subdepartment_id_fkey" FOREIGN KEY ("subdepartment_id") REFERENCES "public"."subdepartments"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."tiptap_content"
    ADD CONSTRAINT "tiptap_content_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "public"."document_versions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_event_attendees"
    ADD CONSTRAINT "training_event_attendees_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_event_attendees"
    ADD CONSTRAINT "training_event_attendees_training_event_id_fkey" FOREIGN KEY ("training_event_id") REFERENCES "public"."training_events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_event_enrollees"
    ADD CONSTRAINT "training_event_enrollees_enrollee_id_fkey" FOREIGN KEY ("enrollee_id") REFERENCES "public"."personnel"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_event_enrollees"
    ADD CONSTRAINT "training_event_enrollees_training_event_id_fkey" FOREIGN KEY ("training_event_id") REFERENCES "public"."training_events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "All authenticated users can see department-subdepartment relati" ON "public"."departments_subdepartments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can see department_role associations" ON "public"."departments_roles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can see departments" ON "public"."departments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can see employment_statuses" ON "public"."employment_statuses" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can see roles" ON "public"."roles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can their view own personnel record" ON "public"."personnel" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Authenticated users can vie all role_proficiencies" ON "public"."role_proficiencies" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view all role_involvements" ON "public"."role_involvements" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view role_event_types" ON "public"."role_event_types" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view their own employment events" ON "public"."personnel_employment_events" FOR SELECT TO "authenticated" USING (("personnel_id" = "auth"."uid"()));



CREATE POLICY "Authenticated users can view their own role events" ON "public"."personnel_roles_events" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "personnel_id"));



CREATE POLICY "Authors have full access to their own comments" ON "public"."personnel_roles_events_comments" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "author_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "author_id"));



CREATE POLICY "User can view their own email addresses" ON "public"."personnel_emails" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "personnel_id"));



CREATE POLICY "Users can insert/update/delete their own views" ON "public"."release_table_views" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read shared or own views" ON "public"."release_table_views" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("is_shared" = true)));



ALTER TABLE "public"."departments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments_subdepartments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."document_criticality" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."document_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents_approval_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents_roles_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "dv_read_published" ON "public"."document_versions" FOR SELECT TO "authenticated" USING (("status" = 'published'::"public"."document_approval_statuses"));



ALTER TABLE "public"."employment_status_history_temp" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employment_statuses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."file_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."map_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."operation_clocking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."operations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pee_read_top_mgmt" ON "public"."personnel_employment_events" FOR SELECT TO "authenticated" USING ("public"."is_top_management"());



ALTER TABLE "public"."personnel" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."personnel_emails" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "personnel_emails_read_top_mgmt" ON "public"."personnel_emails" FOR SELECT TO "authenticated" USING ("public"."is_top_management"());



ALTER TABLE "public"."personnel_employment_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."personnel_initial_dates_temp" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "personnel_read_top_mgmt" ON "public"."personnel" FOR SELECT TO "authenticated" USING ("public"."is_top_management"());



ALTER TABLE "public"."personnel_roles_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."personnel_roles_events_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pre_read_top_mgmt" ON "public"."personnel_roles_events" FOR SELECT TO "authenticated" USING ("public"."is_top_management"());



ALTER TABLE "public"."release_table_views" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."releases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resource_formats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_event_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_involvements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_person_lookup_temp" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_proficiencies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "service user has full access to releases table" ON "public"."releases" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = 'f35f206e-26e8-42e2-816c-68b2adc05e61'::"uuid")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = 'f35f206e-26e8-42e2-816c-68b2adc05e61'::"uuid"));



ALTER TABLE "public"."subdepartments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subdepartments_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tiptap_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_event_attendees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_event_enrollees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_events" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "authenticated";



GRANT ALL ON FUNCTION "public"."get_personnel_without_email"() TO "service_role";
GRANT ALL ON FUNCTION "public"."get_personnel_without_email"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."is_top_management"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_top_management"() TO "authenticated";



GRANT ALL ON FUNCTION "public"."map_commit"("p_document_id" "uuid", "p_update" "bytea", "p_derived" "jsonb", "p_comment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."map_commit"("p_document_id" "uuid", "p_update" "bytea", "p_derived" "jsonb", "p_comment" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."map_load_latest"("p_document_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."map_load_latest"("p_document_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."departments" TO "authenticated";
GRANT ALL ON TABLE "public"."departments" TO "service_role";



GRANT ALL ON TABLE "public"."departments_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."departments_roles" TO "service_role";



GRANT ALL ON TABLE "public"."departments_subdepartments" TO "authenticated";
GRANT ALL ON TABLE "public"."departments_subdepartments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."departments_subdepartments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."departments_subdepartments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."departments_subdepartments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."document_criticality" TO "authenticated";
GRANT ALL ON TABLE "public"."document_criticality" TO "service_role";



GRANT ALL ON TABLE "public"."document_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."document_versions" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."documents_approval_events" TO "authenticated";
GRANT ALL ON TABLE "public"."documents_approval_events" TO "service_role";



GRANT ALL ON TABLE "public"."documents_roles_events" TO "authenticated";
GRANT ALL ON TABLE "public"."documents_roles_events" TO "service_role";



GRANT ALL ON TABLE "public"."employment_status_history_temp" TO "authenticated";
GRANT ALL ON TABLE "public"."employment_status_history_temp" TO "service_role";



GRANT ALL ON TABLE "public"."employment_statuses" TO "authenticated";
GRANT ALL ON TABLE "public"."employment_statuses" TO "service_role";



GRANT ALL ON TABLE "public"."file_content" TO "authenticated";
GRANT ALL ON TABLE "public"."file_content" TO "service_role";



GRANT ALL ON TABLE "public"."items" TO "authenticated";
GRANT ALL ON TABLE "public"."items" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON TABLE "public"."map_content" TO "authenticated";
GRANT ALL ON TABLE "public"."map_content" TO "service_role";



GRANT ALL ON TABLE "public"."operation_clocking" TO "authenticated";
GRANT ALL ON TABLE "public"."operation_clocking" TO "service_role";



GRANT ALL ON TABLE "public"."operations" TO "authenticated";
GRANT ALL ON TABLE "public"."operations" TO "service_role";



GRANT ALL ON TABLE "public"."personnel" TO "authenticated";
GRANT ALL ON TABLE "public"."personnel" TO "service_role";



GRANT ALL ON TABLE "public"."personnel_emails" TO "authenticated";
GRANT ALL ON TABLE "public"."personnel_emails" TO "service_role";



GRANT ALL ON TABLE "public"."personnel_employment_events" TO "authenticated";
GRANT ALL ON TABLE "public"."personnel_employment_events" TO "service_role";



GRANT ALL ON TABLE "public"."personnel_initial_dates_temp" TO "authenticated";
GRANT ALL ON TABLE "public"."personnel_initial_dates_temp" TO "service_role";



GRANT ALL ON SEQUENCE "public"."personnel_initial_dates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."personnel_initial_dates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."personnel_initial_dates_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."personnel_roles_events" TO "authenticated";
GRANT ALL ON TABLE "public"."personnel_roles_events" TO "service_role";



GRANT ALL ON TABLE "public"."personnel_roles_events_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."personnel_roles_events_comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."personnel_roles_events_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."personnel_roles_events_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."personnel_roles_events_comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."release_table_views" TO "authenticated";
GRANT ALL ON TABLE "public"."release_table_views" TO "service_role";



GRANT ALL ON TABLE "public"."releases" TO "authenticated";
GRANT ALL ON TABLE "public"."releases" TO "service_role";



GRANT ALL ON TABLE "public"."resource_formats" TO "authenticated";
GRANT ALL ON TABLE "public"."resource_formats" TO "service_role";



GRANT ALL ON TABLE "public"."role_event_types" TO "authenticated";
GRANT ALL ON TABLE "public"."role_event_types" TO "service_role";



GRANT ALL ON TABLE "public"."role_involvements" TO "authenticated";
GRANT ALL ON TABLE "public"."role_involvements" TO "service_role";



GRANT ALL ON TABLE "public"."role_person_lookup_temp" TO "authenticated";
GRANT ALL ON TABLE "public"."role_person_lookup_temp" TO "service_role";



GRANT ALL ON TABLE "public"."role_proficiencies" TO "authenticated";
GRANT ALL ON TABLE "public"."role_proficiencies" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."subdepartments" TO "authenticated";
GRANT ALL ON TABLE "public"."subdepartments" TO "service_role";



GRANT ALL ON TABLE "public"."subdepartments_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."subdepartments_roles" TO "service_role";



GRANT ALL ON TABLE "public"."tiptap_content" TO "authenticated";
GRANT ALL ON TABLE "public"."tiptap_content" TO "service_role";



GRANT ALL ON TABLE "public"."training_event_attendees" TO "authenticated";
GRANT ALL ON TABLE "public"."training_event_attendees" TO "service_role";



GRANT ALL ON TABLE "public"."training_event_enrollees" TO "authenticated";
GRANT ALL ON TABLE "public"."training_event_enrollees" TO "service_role";



GRANT ALL ON TABLE "public"."training_events" TO "authenticated";
GRANT ALL ON TABLE "public"."training_events" TO "service_role";



GRANT ALL ON TABLE "public"."v_person_roles_current_min" TO "authenticated";
GRANT ALL ON TABLE "public"."v_person_roles_current_min" TO "service_role";



GRANT ALL ON TABLE "public"."v_person_departments_current_min" TO "authenticated";
GRANT ALL ON TABLE "public"."v_person_departments_current_min" TO "service_role";



GRANT ALL ON TABLE "public"."v_person_employment_current_min" TO "authenticated";
GRANT ALL ON TABLE "public"."v_person_employment_current_min" TO "service_role";



GRANT ALL ON TABLE "public"."v_all_personnel" TO "authenticated";
GRANT ALL ON TABLE "public"."v_all_personnel" TO "service_role";



GRANT ALL ON TABLE "public"."v_current_user_active_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."v_current_user_active_roles" TO "service_role";



GRANT ALL ON TABLE "public"."v_current_user_departments" TO "authenticated";
GRANT ALL ON TABLE "public"."v_current_user_departments" TO "service_role";



GRANT ALL ON TABLE "public"."v_current_user_context" TO "authenticated";
GRANT ALL ON TABLE "public"."v_current_user_context" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;
