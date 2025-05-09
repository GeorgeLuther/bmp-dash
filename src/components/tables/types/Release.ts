// Define the Release interface
export interface Release {
  jobName: string;
  jobNumber: string;
  releaseCode: string;
  releaseNumber: number | string;
  totalReleases: number | string;
  customerPO: string;

  poQty: string;
  blanketQty: string;

  comments: string;
  expediteNotes: string;

  travelerToProduction: string;
  dueDate: string;
  weekEnding: string;

  kitLocations: string;
  kitStatus: string;
  customerKit: string;

  shearHours: string;
  cncHours: string;
  punchPressHours: string;
  coilLineHours: string;
  pemHours: string;
  brakeHours: string;
  brakeSetups: string;

  weldRivetHours: string;
  weldSecondaryOps: string;
  migHours: string;
  tigHours: string;
  timeWeldHours: string;
  airWeldHours: string;
  smallBoxWeldHours: string;
  largeBoxWeldHours: string;
  scoopWeldHours: string;
  weldSetups: string;

  paintColor: string;
  powderLbs: string;

  paintHours: string;
  packRiveterHours: string;
  packPopRivetHours: string;
  packScreenHours: string;
  packLineHours: string;
  packCellHours: string;
}
