import api from "@/lib/api";
import { TrConduite } from "@/lib/types/trcrewconduite";
import { AxiosResponse } from "axios";

export const saveTrConduite = async (
  item: Partial<TrConduite>
): Promise<AxiosResponse<TrConduite>> => {
  try {
    console.log(item);
    const response = await api.post<TrConduite>(
      `api/crewConduiteNonAuth/saveConduite`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Conduite", error);
    throw error;
  }
};
