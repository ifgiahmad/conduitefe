import api from "@/lib/api";
import { Crewing } from "@/lib/types/crewing";
import { VwConduite } from "@/lib/types/vwconduite";

export const getConduite = async (
  kodePelaut: string
): Promise<VwConduite[]> => {
  const response = await api.get<VwConduite[]>(
    `api/crewConduiteNonAuth/conduiteList?kodePelaut=${kodePelaut}`
  );
  console.log(response);
  return response.data;
};
