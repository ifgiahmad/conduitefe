import api from "@/lib/api";
import { MsAssessmentAspect } from "@/lib/types/msassessmentaspect";
import { MsAssessmentAspectScore } from "@/lib/types/msassessmentaspectscore";

export const getAssessmentAspectList = async (): Promise<
  MsAssessmentAspect[]
> => {
  const response = await api.get<MsAssessmentAspect[]>(
    `api/crewConduiteNonAuth/assessmentAspectList`
  );
  return response.data;
};

export const getAssessmentAspectScoreListByAspectId = async (
  id: number
): Promise<MsAssessmentAspectScore[]> => {
  const response = await api.get<MsAssessmentAspectScore[]>(
    `api/crewConduiteNonAuth/getAssessmentAspectScoreListByAspectId?id=${id}`
  );
  return response.data;
};
