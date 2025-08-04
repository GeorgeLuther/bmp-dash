// Define the Release interface
export interface Release {
  ms_row_index: number;
  //IDENTIFIERS
  id: string; // UUID (column A)
  release_code: string; // calculated
  release_number: number ; // calculated
  total_releases: number; // calculated

  //CORE INFO/ASSOCIATIONS
  job_id: string; // JOB# (column C)
  ms_job_name: string; // JOB (column B)
  ms_customer_po: string; // PO# (column F)

  ms_comments: string; // COMMENTS (column T)
  expedite_notes: string; // EXPEDITE NOTES (column U)

  //DATES / PROGRESS
  ms_due_date: string; // DUE DATE (column J)
  ms_po_date: string; // PO DATE

  //   PURCHASING
  purchasing_status: string; // PURCH (column V)

  //  DESIGN
  // (no mapped fields currently)

  //  PRODUCTION
  date_to_production_manager: string; // traveler to production (column D)
  week_projected: string; // WEEK ENDING, STORED FOR WHOLE BANNER SECTION (column C)
  date_to_floor: string; // date to floor (column D)
  date_production_started: string; // date production started (column E)
  production_complete_at: string; // production completed ???
  //  QUANTITIES
  ms_order_quantity: string; // order qty (column K)
  ms_po_quantity: string; // PO QTY (column H)

  //  KITTING
  has_customer_kit: boolean; // CUST KIT Y/N (column W)
  old_kit_locations: string; // kit locations (column E)
  ms_paint_color: string; // PAINT COLOR / SCREEN COVER (column L)
  ms_paint_lbs: number; // lbs of paint for this release (column M)

  //PROJECTED LABOR (HOURS)
  shear_hours: number; // SHEAR (column X)
  //  PUNCH PRESS AREA
  punch_hours: number; // PRESS ROOM PUNCH (column AA)
  coil_hours: number; // COIL LINE (column AB)
  auxiliary_hours: number; // tap, countersink, grind (column AC)
  pem_hours: number; // PEM HOURS (column AD)
  //  CNC
  global_or_vt30: string; // G/V (column Y)
  cnc_hours: number; // CNC HOURS (column Z)

  //  BRAKE PRESS AREA
  coastone_hours: number; // COAST ONE HRS (column AE)
  hem_and_flat_hours: number; // HEM / FLAT (column AF)
  seventyfive_ton_hours: number; // BRAKE 75 TON PACIFIC (column AG)
  fourty_ton_hours: number; // BRAKE 40 TON PACIFIC (column AH)
  all_brake_hours: number; // BRAKE PRESS HOURS (column AI)
  brake_setups: number; // hours for brake setups (column AJ)
  //  WELDING
  mig_hours: number; // MIG (column AK)
  tig_hours: number; // TIG (column AL)
  weld_hours: number; // ??
  weld_rivet_hours: number; // WELD / RIVET (column AM)
  small_box_hours: number; // SMALL BOX (column AN)
  large_box_hours: number; // LARGE BOX (column AO)
  scoop_weld_hours: number; // SCOOP WELD (column AP)
  time_weld_hours: number; // TIME WELD (column AQ)
  air_weld_hours: number; // AIR WELD (column AR)
  spot_weld_hours: number; // SPOT WELD (column AS)
  weld_setups: number; // weld setups (column AT)
  //  PAINT & PACK
  paint_hours: number; // (column N)
  pack_line_hours: number; // pack line (column R)
  pack_machine_rivet_hours: number; // pack machine rivet (column O)
  pack_pop_rivet_hours: number; // pack pop rivet (column P)
  pack_screen_hours: number; // pack screen (column Q)
  pack_cell_hours: number; // pack cell (column S)
  // shipping
  // (no mapped fields currently)
}