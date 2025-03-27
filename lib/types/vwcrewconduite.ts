import { z } from "zod";

export interface VwCrewConduite {
  id: number;
  periodId: number;
  crewingId: number;
  seafarerCode?: string;
  vessel?: string;
  position?: string;
  roleCodeAssessor?: string;
  totalScore: number;
  description?: string;
  assessedBy?: string;
  createdBy?: string;
  createdDate?: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
  isDeleted: boolean;
  namaLengkap?: string;
  nik?: string;
  month: number;
  year: number;
  monthString?: string;
}

export const createVwCrewConduiteZod = z.object({
  periodId: z.number().min(1, "Period Required"),
  crewingId: z.number().min(1, "Crewing Id Required"),
  seafarerCode: z.string().min(1, "Seafarer Code Required"),
  vessel: z.string().optional(),
  description: z.string().optional(),
  position: z.string().optional(),
  roleCodeAssessor: z.string().optional(),
  mode: z.string().optional(),
  role: z.string().optional(),
  id: z.number().optional(),
  totalScore: z.number().optional(),
  namaLengkap: z.string().optional(),
  nik: z.string().optional(),
  month: z.number().optional(),
  year: z.number().optional(),
});

export type createVwCrewConduite = z.infer<typeof createVwCrewConduiteZod>;
