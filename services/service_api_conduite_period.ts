import api from "@/lib/api";
import { ConduitePeriod } from "@/lib/types/conduiteperiod";

export const getPeriod = async (
  month: number,
  year: number
): Promise<ConduitePeriod> => {
  const response = await api.get<ConduitePeriod>(
    `api/crewConduiteNonAuth/getConduitePeriodByMonthYear?month=${month}&year=${year}`
  );
  return response.data;
};
