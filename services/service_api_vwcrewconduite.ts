import api from "@/lib/api";
import { VwCrewConduite } from "@/lib/types/vwcrewconduite";

export const getCrewConduiteByCrwIdMonthYearList = async (
  crewId: number,
  month: number,
  year: number,
  role: string
): Promise<VwCrewConduite[]> => {
  const response = await api.get<VwCrewConduite[]>(
    `api/crewConduiteNonAuth/getCrewConduiteByCrwIdMonthYearList?crewId=${crewId}&month=${month}&year=${year}&role=${role}`
  );
  return response.data;
};
