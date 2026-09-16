import type { FormsSubmissions, Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://neurovex.com/", // replace this with your deployed domain
  author: "Neurovex Technologies",
  profile: "https://neurovex.com/",
  desc: "Neurovex Technologies accompagne les entreprises de Marrakech dans leur transformation numérique : bureautique, informatique et télécommunications.",
  title: "Neurovex Technologies",
  ogImage: "favicon.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "fr", // html lang code. Set this empty and default will be "en"
  langTag: ["fr-FR"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const COMPANY = {
  name: "Neurovex Technologies",
  address: "MAG 1 AFAQ 1 N° 336 SAADA, Marrakech, Maroc",
  phone: "+212 6 88 03 84 24",
  phoneHref: "+212688038424",
  email: "contact@neurovex.com",
};

export const SOCIALS: SocialObjects = {
  facebook: {
    href: "https://www.facebook.com/profile.php?id=61593997156410",
    linkTitle: "Neurovex sur Facebook",
    active: true,
  },
  linkedin: {
    href: "https://www.linkedin.com/company/neurovex-technologies/",
    linkTitle: "Neurovex sur LinkedIn",
    active: true,
  },
};

export const FORMS_SUBMISSIONS: FormsSubmissions[] = [];
