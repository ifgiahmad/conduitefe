export interface MsAssessmentAspectScore {
  id: number;
  assessmentAspectId: number;
  score: number;
  scoreDescriptionIna?: string;
  scoreDescriptionEng?: string;
  createdBy?: string;
  createdDate?: string; // Date stored as ISO string
  modifiedBy?: string;
  modifiedDate?: string;
  isDeleted: boolean;
  mode?: string;
  isSelected: boolean;
}
