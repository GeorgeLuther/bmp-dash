//src/features/scheduling/releaseTable/components/table/ReleaseTable.columns.ts
import { MRT_ColumnDef } from "material-react-table";
import { Release } from "../../types/Release.types";

export const releaseColumns: MRT_ColumnDef<Release>[] = [
  { accessorKey: "ms_row_index",               header: "Row Index" },
  { accessorKey: "id",                         header: "UUID" },
  { accessorKey: "release_code",               header: "Release Code" },
  { accessorKey: "release_number",             header: "Release #" },
  { accessorKey: "total_releases",             header: "Total Releases" },

  { accessorKey: "job_id",                     header: "Job #" },
  { accessorKey: "ms_job_name",                header: "Job Name (Master Schedule)" },
  { accessorKey: "ms_customer_po",             header: "Customer PO (Master Schedule)" },

  { accessorKey: "ms_comments",                header: "Comments (Master Schedule)" },
  { accessorKey: "expedite_notes",             header: "Expedite Notes" },

  { accessorKey: "ms_due_date",                header: "Due Date (Master Schedule)" },
  { accessorKey: "ms_po_date",                 header: "PO Date (Master Schedule)" },

  { accessorKey: "purchasing_status",          header: "Purchasing Status" },

  { accessorKey: "date_to_production_manager", header: "Traveler To Production" },
  { accessorKey: "week_projected",             header: "Week Projected", enableGrouping: true, },

  { accessorKey: "ms_order_quantity",          header: "Order Qty (Master Schedule)" },
  { accessorKey: "ms_po_quantity",             header: "PO Qty (Master Schedule)" },

  {
    accessorKey: "has_customer_kit",
    header: "Customer Kit?",
    Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
  },
  { accessorKey: "old_kit_locations",          header: "Kit Locations" },

  { accessorKey: "ms_paint_color",             header: "Paint Color" },
  { accessorKey: "ms_paint_lbs",               header: "Paint Lbs" },

  { accessorKey: "shear_hours",                header: "Shear Hours" },
  { accessorKey: "punch_hours",                header: "Punch Press Hours" },
  { accessorKey: "coil_hours",                 header: "Coil Line Hours" },
  { accessorKey: "auxiliary_hours",            header: "Auxiliary Hours" },
  { accessorKey: "pem_hours",                  header: "PEM Hours" },

  { accessorKey: "global_or_vt30",             header: "G/V (CNC Type)" },
  { accessorKey: "cnc_hours",                  header: "CNC Hours" },

  { accessorKey: "coastone_hours",             header: "Coast One Hrs" },
  { accessorKey: "hem_and_flat_hours",         header: "Hem/Flat Hrs" },
  { accessorKey: "seventyfive_ton_hours",      header: "75-Ton Hrs" },
  { accessorKey: "fourty_ton_hours",           header: "40-Ton Hrs" },
  { accessorKey: "all_brake_hours",            header: "All Brake Hrs" },
  { accessorKey: "brake_setups",               header: "Brake Setups" },

  { accessorKey: "mig_hours",                  header: "MIG Hours" },
  { accessorKey: "tig_hours",                  header: "TIG Hours" },
  { accessorKey: "weld_rivet_hours",           header: "Weld/Rivet Hrs" },
  { accessorKey: "small_box_hours",            header: "Small Box Hrs" },
  { accessorKey: "large_box_hours",            header: "Large Box Hrs" },
  { accessorKey: "scoop_weld_hours",           header: "Scoop Weld Hrs" },
  { accessorKey: "time_weld_hours",            header: "Time Weld Hrs" },
  { accessorKey: "air_weld_hours",             header: "Air Weld Hrs" },
  { accessorKey: "spot_weld_hours",            header: "Spot Weld Hrs" },
  { accessorKey: "weld_setups",                header: "Weld Setups" },

  { accessorKey: "paint_hours",                header: "Paint Hours" },
  { accessorKey: "pack_line_hours",            header: "Pack Line Hrs" },
  { accessorKey: "pack_machine_rivet_hours",   header: "Pack Machine Rivet Hrs" },
  { accessorKey: "pack_pop_rivet_hours",       header: "Pack Pop Rivet Hrs" },
  { accessorKey: "pack_screen_hours",          header: "Pack Screen Hrs" },
  { accessorKey: "pack_cell_hours",            header: "Pack Cell Hrs" },
];
