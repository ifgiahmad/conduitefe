import { z } from "zod";

export interface VwCrewConduiteDetail {
  code?: string;
  namaLengkap?: string;
  seafarerCode?: string;
  lvl?: string;
  department?: string;
  trailerVessel?: string;
  roleCodeAssessor?: string;
  aspectTypeIna?: string;
  aspectTypeEng?: string;
  aspectIna?: string;
  aspectEng?: string;
  aspectDescIna?: string;
  aspectDescEng?: string;
  score?: number;
  scoreDescriptionIna?: string;
  scoreDescriptionEng?: string;
  scoreDescriptionAssessor?: string;
  assessedBy?: string;
  month: number;
  year: number;
  nik?: string;
  crewingId: number;
  headerId: number;
  detailId: number;
  aspectId: number;
  mode?: string;
}

/* export const createVwCrewConduiteDetailZod = z.object({
  score: z.number().optional(),
  scoreDescriptionIna: z.string().optional(),
  scoreDescriptionEng: z.string().optional(),
  scoreDescriptionAssessor: z.string().optional(),
  crewingId: z.number().optional(),
  detailId: z.number().optional(),
  aspectId: z.number().optional(),
}); */

export const createVwCrewConduiteDetailZod = z.object({
  code: z.string().optional(),
  namaLengkap: z.string().optional(),
  seafarerCode: z.string().optional(),
  lvl: z.string().optional(),
  department: z.string().optional(),
  trailerVessel: z.string().optional(),
  roleCodeAssessor: z.string().optional(),
  aspectTypeIna: z.string().optional(),
  aspectTypeEng: z.string().optional(),
  aspectIna: z.string().optional(),
  aspectEng: z.string().optional(),
  aspectDescIna: z.string().optional(),
  aspectDescEng: z.string().optional(),
  score: z.number().optional(),
  scoreDescriptionIna: z.string().optional(),
  scoreDescriptionEng: z.string().optional(),
  scoreDescriptionAssessor: z.string().optional(),
  assessedBy: z.string().optional(),
  detailId: z.number().optional(),
  aspectId: z.number().optional(),
  mode: z.string().optional(),
  crewingId: z.number().optional(),
  headerId: z.number().optional(),
  month: z.number().optional(),
  year: z.number().optional(),
  periodeId: z.number().optional(),
});

export type createVwCrewConduiteDetail = z.infer<
  typeof createVwCrewConduiteDetailZod
>;
