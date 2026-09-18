export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const ui = {
  fr: {
    "meta.description":
      "Neurovex Technologies accompagne les entreprises de Marrakech dans leur transformation numérique : bureautique, informatique et télécommunications.",

    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.blog": "Blog",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.langSwitch": "EN",

    "footer.cta.title": "Prêt à démarrer votre transformation numérique ?",
    "footer.cta.button": "Contactez-nous",
    "footer.description":
      "Votre point de convergence bureautique, informatique et télécommunications à Marrakech. Proximité humaine et expertise technique au service de votre entreprise.",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits réservés.",

    "hero.title.line1": "Votre partenaire",
    "hero.title.line2": "technologique à Marrakech",
    "hero.title.line3": "proximité, expertise, confiance",
    "hero.title.mobile": "Votre partenaire technologique à Marrakech",
    "hero.description":
      "Neurovex accompagne les entreprises dans leur transformation numérique : bureautique, informatique et télécommunications, avec un service réactif et des solutions sur mesure.",
    "hero.cta.services": "Découvrir nos services",
    "hero.cta.contact": "Nous contacter",

    "mission.title": "Notre mission",
    "mission.description":
      "Accompagner les entreprises de Marrakech dans leur transformation numérique, avec proximité et expertise, dans les domaines de la bureautique, de l'informatique et des télécommunications.",
    "mission.items": [
      {
        title: "Service client",
        description:
          "La priorité de nos équipes est de vous offrir un service réactif de qualité.",
      },
      {
        title: "Expertise",
        description:
          "Nos experts métiers sont à votre écoute pour vous apporter des solutions sur mesure et adaptées à vos besoins.",
      },
      {
        title: "Proximité",
        description:
          "Nos implantations sur la région nous permettent de répondre à toutes vos demandes et garantissent une relation de confiance durable.",
      },
    ],

    "services.heading": "Nos services",
    "services.seeAll": "Voir tous nos services →",
    "services.learnMore": "En savoir plus",
    "services.subtitle":
      "Un point de convergence entre bureautique, informatique et télécommunications, pour accompagner votre entreprise à chaque étape.",
    "services.cta.title": "Un projet en tête ?",
    "services.cta.description":
      "Parlons de vos besoins et construisons ensemble la solution adaptée à votre entreprise.",
    "services.cta.button": "Demander un devis",
    "services.items": [
      {
        id: "informatique",
        video: "/videos/services/informatique.mp4",
        title: "Solutions Informatique",
        color: "#2FAEEA",
        description:
          "Postes de travail, serveurs, infrastructures réseau et sécurité : nous concevons et maintenons un parc informatique fiable et évolutif pour votre entreprise.",
        features: [
          "Fourniture et installation de postes de travail et serveurs",
          "Mise en place et sécurisation de réseaux d'entreprise",
          "Sauvegarde et protection des données",
          "Audit et conseil en infrastructure IT",
        ],
      },
      {
        id: "bureautique",
        video: "/videos/services/bureautique.mp4",
        title: "Bureautique & Équipement",
        color: "#6260E8",
        description:
          "Imprimantes, copieurs et mobilier de bureau technologique : des équipements adaptés à votre activité, livrés et installés avec un service de proximité.",
        features: [
          "Vente et location d'imprimantes et copieurs",
          "Contrats de consommables et de suivi",
          "Équipement de salles de réunion",
          "Installation et mise en service sur site",
        ],
      },
      {
        id: "telecommunications",
        video: "/videos/services/telecommunications.mp4",
        title: "Télécommunications",
        color: "#292D33",
        description:
          "Téléphonie IP, connectivité et infrastructure réseau : nous déployons des solutions de communication performantes et évolutives pour vos équipes.",
        features: [
          "Téléphonie IP et standards téléphoniques",
          "Connectivité et liaisons internet professionnelles",
          "Câblage et infrastructure réseau",
          "Solutions de visioconférence",
        ],
      },
      {
        id: "support",
        video: "/videos/services/support.mp4",
        title: "Support & Maintenance",
        color: "#1090C7",
        description:
          "Une assistance technique réactive et des contrats de service sur mesure, pour garantir la continuité de votre activité à tout moment.",
        features: [
          "Assistance technique réactive",
          "Contrats de maintenance préventive",
          "Intervention sur site ou à distance",
          "Suivi et reporting régulier",
        ],
      },
    ],

    "about.title": "Qui sommes-nous ?",
    "about.processLink": "Notre processus",
    "about.description":
      "À Marrakech, chez Neurovex, nos techniciens et conseillers experts représentent notre plus grande force. En tant que point de convergence des domaines de la bureautique, de l'informatique et des télécommunications, nos équipes techniques et commerciales bénéficient d'une formation continue sur les derniers matériels et logiciels.",
    "about.description2":
      "Cette exigence constante est dédiée à améliorer les services que nous offrons aux utilisateurs de votre entreprise. La proximité humaine est au cœur de notre engagement pour répondre aux besoins spécifiques de nos clients.",

    "process.heading": "Comment nous travaillons",
    "process.subtitle": "Notre processus",
    "process.steps": [
      {
        number: "01",
        title: "Découverte",
        description:
          "Analyse approfondie de vos besoins, objectifs et contraintes pour construire une feuille de route claire.",
      },
      {
        number: "02",
        title: "Conception",
        description:
          "Design de la solution technique, architecture système et planification détaillée du projet.",
      },
      {
        number: "03",
        title: "Développement",
        description:
          "Réalisation avec des méthodologies agiles, tests continus et points de suivi réguliers.",
      },
      {
        number: "04",
        title: "Livraison",
        description:
          "Déploiement, formation des équipes et support post-livraison pour assurer votre succès.",
      },
    ],

    "faq.heading": "FAQ",
    "faq.subtitle": "Voici les questions les plus fréquentes.",
    "faq.subtitle2":
      "Pour toute autre question, n'hésitez pas à nous contacter.",
    "faq.items": [
      {
        label: "Qui est Neurovex Technologies ?",
        answer:
          "Neurovex est une entreprise basée à Marrakech, spécialisée dans la bureautique, l'informatique et les télécommunications. Nous accompagnons les entreprises de la région dans leur transformation numérique avec des solutions sur mesure.",
      },
      {
        label: "Quels services proposez-vous ?",
        answer:
          'Nous proposons des solutions informatiques (postes de travail, serveurs, réseaux, sécurité), des équipements bureautiques (imprimantes, copieurs), des solutions de télécommunications (téléphonie IP, connectivité), ainsi qu\'un support et une maintenance réactifs. Retrouvez le détail dans notre <a href="/services">page Services</a>.',
      },
      {
        label: "Intervenez-vous en dehors de Marrakech ?",
        answer:
          'Nos équipes sont implantées dans la région de Marrakech et interviennent principalement auprès des entreprises locales. <a href="/contact">Contactez-nous</a> pour vérifier notre disponibilité pour votre projet.',
      },
      {
        label: "Comment se déroule un projet avec Neurovex ?",
        answer:
          'Notre processus se déroule en 4 étapes : découverte de vos besoins, conception de la solution, développement avec des méthodologies agiles, et livraison avec formation et support post-déploiement. Plus de détails sur notre <a href="/services">page Services</a>.',
      },
      {
        label: "Proposez-vous des contrats de maintenance ?",
        answer:
          "Oui, nous proposons des contrats de support et de maintenance adaptés à la taille et aux besoins de votre entreprise, avec un service client réactif.",
      },
      {
        label: "Comment obtenir un devis ?",
        answer:
          'Le moyen le plus rapide est de nous contacter directement par téléphone, email, ou via notre <a href="/contact">page Contact</a>. Nous reviendrons vers vous avec une proposition adaptée à vos besoins.',
      },
    ],

    "testimonials.heading": "Témoignages",

    "contact.title": "Contactez-nous",
    "contact.subtitle":
      "Une question, un projet ? Notre équipe à Marrakech vous répond rapidement.",
    "contact.card.address": "Adresse",
    "contact.card.phone": "Téléphone",
    "contact.card.email": "Email",
    "contact.hours.heading": "Horaires",
    "contact.hours.description":
      "Notre équipe est disponible du lundi au vendredi pour répondre à vos demandes et vous accompagner dans vos projets. Pour toute urgence technique, contactez-nous directement par téléphone.",
    "contact.meta.description":
      "Contactez Neurovex Technologies à Marrakech pour vos projets de bureautique, informatique et télécommunications.",

    "services.meta.description":
      "Solutions informatique, bureautique et télécommunications pour les entreprises de Marrakech.",

    "notFound.description": "Cette page n'existe pas.",
    "notFound.text":
      "Cette page n'existe pas. Le lien suivi est peut-être obsolète ou l'URL est incorrecte.",
    "notFound.backHome": "Retour à l'accueil",

    "blog.previousArticle": "Article précédent",
    "blog.nextArticle": "Article suivant",
    "blog.shareArticle": "Partager l'article :",
    "blog.title": "Blog",
  },

  en: {
    "meta.description":
      "Neurovex Technologies helps businesses in Marrakech with their digital transformation: office equipment, IT, and telecommunications.",

    "nav.home": "Home",
    "nav.services": "Services",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.langSwitch": "FR",

    "footer.cta.title": "Ready to start your digital transformation?",
    "footer.cta.button": "Contact us",
    "footer.description":
      "Your single point of contact for office equipment, IT, and telecommunications in Marrakech. Human proximity and technical expertise at the service of your business.",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",

    "hero.title.line1": "Your technology",
    "hero.title.line2": "partner in Marrakech",
    "hero.title.line3": "proximity, expertise, trust",
    "hero.title.mobile": "Your technology partner in Marrakech",
    "hero.description":
      "Neurovex helps businesses with their digital transformation: office equipment, IT, and telecommunications, with responsive service and tailor-made solutions.",
    "hero.cta.services": "Discover our services",
    "hero.cta.contact": "Contact us",

    "mission.title": "Our mission",
    "mission.description":
      "Helping businesses in Marrakech with their digital transformation, with proximity and expertise, in the fields of office equipment, IT, and telecommunications.",
    "mission.items": [
      {
        title: "Customer service",
        description:
          "Our teams' priority is to offer you responsive, quality service.",
      },
      {
        title: "Expertise",
        description:
          "Our subject-matter experts listen closely to provide tailor-made solutions suited to your needs.",
      },
      {
        title: "Proximity",
        description:
          "Our local presence in the region lets us respond to all your requests and guarantees a lasting relationship of trust.",
      },
    ],

    "services.heading": "Our services",
    "services.seeAll": "See all our services →",
    "services.learnMore": "Learn more",
    "services.subtitle":
      "A single point of contact for office equipment, IT, and telecommunications, supporting your business at every stage.",
    "services.cta.title": "Have a project in mind?",
    "services.cta.description":
      "Let's talk about your needs and build the right solution for your business together.",
    "services.cta.button": "Request a quote",
    "services.items": [
      {
        id: "informatique",
        video: "/videos/services/informatique.mp4",
        title: "IT Solutions",
        color: "#2FAEEA",
        description:
          "Workstations, servers, network infrastructure and security: we design and maintain a reliable, scalable IT setup for your business.",
        features: [
          "Supply and installation of workstations and servers",
          "Setting up and securing business networks",
          "Data backup and protection",
          "IT infrastructure audit and consulting",
        ],
      },
      {
        id: "bureautique",
        video: "/videos/services/bureautique.mp4",
        title: "Office Equipment",
        color: "#6260E8",
        description:
          "Printers, copiers and technology office furniture: equipment suited to your business, delivered and installed with a local, personal service.",
        features: [
          "Sale and rental of printers and copiers",
          "Supplies and follow-up contracts",
          "Meeting room equipment",
          "On-site installation and setup",
        ],
      },
      {
        id: "telecommunications",
        video: "/videos/services/telecommunications.mp4",
        title: "Telecommunications",
        color: "#292D33",
        description:
          "IP telephony, connectivity and network infrastructure: we deploy powerful, scalable communication solutions for your teams.",
        features: [
          "IP telephony and phone systems",
          "Business internet connectivity and links",
          "Cabling and network infrastructure",
          "Video conferencing solutions",
        ],
      },
      {
        id: "support",
        video: "/videos/services/support.mp4",
        title: "Support & Maintenance",
        color: "#1090C7",
        description:
          "Responsive technical support and tailor-made service contracts, to keep your business running at all times.",
        features: [
          "Responsive technical support",
          "Preventive maintenance contracts",
          "On-site or remote intervention",
          "Regular monitoring and reporting",
        ],
      },
    ],

    "about.title": "Who we are",
    "about.processLink": "Our process",
    "about.description":
      "In Marrakech, at Neurovex, our expert technicians and advisors are our greatest strength. As a single point of contact for office equipment, IT, and telecommunications, our technical and sales teams receive ongoing training on the latest hardware and software.",
    "about.description2":
      "This constant commitment is dedicated to improving the services we offer to your company's users. Human proximity is at the heart of our commitment to meeting the specific needs of our clients.",

    "process.heading": "How we work",
    "process.subtitle": "Our process",
    "process.steps": [
      {
        number: "01",
        title: "Discovery",
        description:
          "In-depth analysis of your needs, goals and constraints to build a clear roadmap.",
      },
      {
        number: "02",
        title: "Design",
        description:
          "Design of the technical solution, system architecture and detailed project planning.",
      },
      {
        number: "03",
        title: "Development",
        description:
          "Delivery using agile methodologies, continuous testing and regular check-ins.",
      },
      {
        number: "04",
        title: "Delivery",
        description:
          "Deployment, team training and post-delivery support to ensure your success.",
      },
    ],

    "faq.heading": "FAQ",
    "faq.subtitle": "Here are the most frequently asked questions.",
    "faq.subtitle2": "For any other question, feel free to contact us.",
    "faq.items": [
      {
        label: "Who is Neurovex Technologies?",
        answer:
          "Neurovex is a company based in Marrakech, specializing in office equipment, IT, and telecommunications. We help businesses in the region with their digital transformation through tailor-made solutions.",
      },
      {
        label: "What services do you offer?",
        answer:
          'We offer IT solutions (workstations, servers, networks, security), office equipment (printers, copiers), telecommunications solutions (IP telephony, connectivity), as well as responsive support and maintenance. Find the details on our <a href="/en/services">Services page</a>.',
      },
      {
        label: "Do you work outside of Marrakech?",
        answer:
          'Our teams are based in the Marrakech region and mainly work with local businesses. <a href="/en/contact">Contact us</a> to check our availability for your project.',
      },
      {
        label: "How does a project with Neurovex work?",
        answer:
          'Our process has 4 steps: discovering your needs, designing the solution, development using agile methodologies, and delivery with training and post-deployment support. More details on our <a href="/en/services">Services page</a>.',
      },
      {
        label: "Do you offer maintenance contracts?",
        answer:
          "Yes, we offer support and maintenance contracts tailored to the size and needs of your business, with responsive customer service.",
      },
      {
        label: "How do I get a quote?",
        answer:
          'The fastest way is to contact us directly by phone, email, or via our <a href="/en/contact">Contact page</a>. We\'ll get back to you with a proposal tailored to your needs.',
      },
    ],

    "testimonials.heading": "Testimonials",

    "contact.title": "Contact us",
    "contact.subtitle":
      "A question, a project? Our team in Marrakech will get back to you quickly.",
    "contact.card.address": "Address",
    "contact.card.phone": "Phone",
    "contact.card.email": "Email",
    "contact.hours.heading": "Hours",
    "contact.hours.description":
      "Our team is available Monday to Friday to answer your requests and support you with your projects. For any technical emergency, contact us directly by phone.",
    "contact.meta.description":
      "Contact Neurovex Technologies in Marrakech for your office equipment, IT, and telecommunications projects.",

    "services.meta.description":
      "IT, office equipment, and telecommunications solutions for businesses in Marrakech.",

    "notFound.description": "This page doesn't exist.",
    "notFound.text":
      "This page doesn't exist. The link you followed may be outdated, or the URL may be incorrect.",
    "notFound.backHome": "Back to home",

    "blog.previousArticle": "Previous Article",
    "blog.nextArticle": "Next Article",
    "blog.shareArticle": "Share article:",
    "blog.title": "Blog",
  },
} as const;
