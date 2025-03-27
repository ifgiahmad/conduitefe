import { createVwCrewConduite, VwCrewConduite } from "./vwcrewconduite";
import { VwCrewConduiteDetail } from "./vwcrewconduitedetail";

export interface TrConduite {
  model: createVwCrewConduite;
  modelDetail: VwCrewConduiteDetail[];
}
