export type PanelProfileDto = {
  id: string;
  userId: string;
  fullName: string;
  displayName: string;
  phone: string;
  occupation: string;
  about: string;
  location: string;
  githubLink: string;
  linkedinLink: string;
  personalWebsiteLink: string;
  contacts: string;
  skills: string;
  image: string;
  bannerImage: string;
  role: string;
  joinDate: string;
};

export type UpsertPanelProfileInput = {
  occupation?: string;
  about?: string;
  location?: string;
  githubLink?: string;
  linkedinLink?: string;
  personalWebsiteLink?: string;
  contacts?: string;
  skills?: string;
  image?: string;
  bannerImage?: string;
};
