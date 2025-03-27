export interface ConduitePeriod {
  id: number;
  month: number;
  year: number;
  startDate?: Date;
  endDate?: Date;
  createdDate?: Date;
  createdBy?: string;
  modifiedDate?: Date;
  modifiedBy?: string;
  periodName?: string;
}
