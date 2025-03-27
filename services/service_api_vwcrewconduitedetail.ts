import api from "@/lib/api";
import { VwCrewConduiteDetail } from "@/lib/types/vwcrewconduitedetail";

export const getCrewConduiteDetailList = async (
  headerId: number
): Promise<VwCrewConduiteDetail[]> => {
  const response = await api.get<VwCrewConduiteDetail[]>(
    `api/crewConduiteNonAuth/crewConduiteDetailList?headerId=${headerId}`
  );
  return response.data;
};
