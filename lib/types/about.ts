export type AboutSection = {
  text: string;
  heading: string;
};

export type AboutDetails = {
  title: string;
  sections: AboutSection[];
};

export type AboutRecord = {
  id: string;
  created_at: string;
  data: AboutDetails;
};
