export type CrewLogin = {
  seafarerCode: string;
  superUser: boolean;
  roleCode?: string;
  vessel?: string;
};

export type CrewRole = {
  superUser: boolean;
  roleCode?: string;
};
