import api from "@/lib/api";
import { Crewing } from "@/lib/types/crewing";
import { AxiosResponse } from "axios";

export const getCrewing = async (kodePelaut: string): Promise<Crewing> => {
  const response = await api.get<Crewing>(
    `api/crewConduiteNonAuth/crewingByKodePelaut?kodePelaut=${kodePelaut}`
  );
  return response.data;
};
