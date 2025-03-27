export interface MsAssessmentAspect {
  id: number;
  vslSize?: string;
  position?: string;
  aspectNo?: number;
  aspectTypeIna?: string;
  aspectTypeEng?: string;
  aspectIna?: string;
  aspectEng?: string;
  aspectDescIna?: string;
  aspectDescEng?: string;
  createdBy?: string;
  createdDate?: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
  isDeleted: boolean;
}
