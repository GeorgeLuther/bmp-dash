import { MRT_TableState } from "material-react-table";

export type ReleaseTableView = {
 id: string;
  user_id: string;
  name: string;
  description?: string;
  view_state: Partial<MRT_TableState<any>>;
  is_shared?: boolean;
};
