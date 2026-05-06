import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import "dotenv/config";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Clearing tables...");
  await db.delete(schema.pageSections);
  await db.delete(schema.pages);
  await db.delete(schema.blogPosts);
  await db.delete(schema.galleryImages);
  await db.delete(schema.practitioners);
  await db.delete(schema.media);
  await db.delete(schema.siteSettings);

  // --- Site settings ---
  console.log("Seeding site_settings...");
  await db.insert(schema.siteSettings).values({
    cabinetName: "Cabinet Girardello",
    tagline: "Cabinet de physiotherapie a Morges",
    phone: "+41 XX XXX XX XX", // TODO: real phone
    email: "info@cabinet-girardello.ch", // TODO: real email
    addressStreet: "Rue de Couvaloup 16",
    addressPostalCode: "1110",
    addressCity: "Morges",
    openingHoursText: "Lundi - Vendredi : 8h - 19h\nSamedi sur rendez-vous",
    footerDescription:
      "Cabinet de physiotherapie a Morges. Notre equipe vous accompagne dans votre reeducation et votre bien-etre.",
    contactDestinationEmail: "info@cabinet-girardello.ch", // TODO: real email
  });

  // --- Practitioners ---
  console.log("Seeding practitioners...");
  await db.insert(schema.practitioners).values([
    {
      slug: "mme-girardello",
      displayOrder: 1,
      fullName: "Mme Girardello", // TODO: real first name
      title: "Physiotherapeute, fondatrice",
      photoUrl: null,
      bioShort:
        "Fondatrice du cabinet, elle accompagne ses patients avec une approche personnalisee et bienveillante.",
      bioLong: `Mme Girardello est la fondatrice du Cabinet Girardello, installe au coeur de Morges. Passionnee par la physiotherapie, elle met son experience au service de ses patients avec une approche humaine et personnalisee.

Son approche therapeutique repose sur une prise en charge globale du patient, combinant les techniques manuelles et les exercices adaptes pour favoriser une recuperation optimale.

Elle prend en charge une grande variete de pathologies musculosquelettiques et accompagne ses patients dans leur parcours de reeducation avec professionnalisme et bienveillance.`,
      // TODO: complete bio with real information
      qualifications: [],
      specialties: ["Physiotherapie generale"],
      published: true,
    },
    {
      slug: "praticien-2",
      displayOrder: 2,
      fullName: "Praticien (nom a completer)", // TODO
      title: "Physiotherapeute",
      photoUrl: null,
      bioShort:
        "Physiotherapeute au Cabinet Girardello, il/elle apporte son expertise au service de vos soins.",
      // TODO: replace with real bio
      bioLong: `Ce praticien rejoint l'equipe du Cabinet Girardello et apporte son expertise en physiotherapie generale.

Il/Elle prend en charge les patients pour une variete de traitements et travaille en etroite collaboration avec le reste de l'equipe pour assurer une prise en charge optimale.`,
      // TODO: complete with real information
      qualifications: [],
      specialties: ["Physiotherapie generale"],
      published: true,
    },
    {
      slug: "arnaud-canadas",
      displayOrder: 3,
      fullName: "Arnaud Canadas",
      title: "Physiotherapeute specialise en reeducation vestibulaire",
      photoUrl:
        "https://hwm94uz8yo.ufs.sh/f/sTv2ZKfHw3Nmvmbfx016oOQ7aYk8xhdCRsbIzJvtiEGDrVZe",
      photoAlt: "Arnaud Canadas, physiotherapeute specialise en reeducation vestibulaire",
      bioShort:
        "Specialise dans le traitement des vertiges et troubles de l'equilibre, Arnaud recoit aussi sur son site dedie physio-vertige.ch.",
      bioLong: `Arnaud Canadas est physiotherapeute specialise en reeducation vestibulaire. Il prend en charge les patients souffrant de vertiges, troubles de l'equilibre et autres pathologies vestibulaires.

Grace a ses nombreuses formations specialisees, il propose une prise en charge experte et adaptee a chaque patient. Son approche combine techniques manuelles specifiques et exercices de reeducation pour restaurer l'equilibre et reduire les symptomes.

Pour la reeducation vestibulaire, consultez aussi son site dedie [physio-vertige.ch](https://physio-vertige.ch).`,
      qualifications: [
        "Diplome en physiotherapie (2020)",
        "Formation specialisee en dry needling (2020)",
        "Master en douleur chronique (2021)",
        "Formation VIRE vertiges (2021)",
        "Formation continue en troubles de l'equilibre et vertiges",
        "Diplome universitaire de prise en charge clinique, paraclinique et therapeutique des vertiges — Universite de Reims (2025)",
      ],
      specialties: [
        "Reeducation vestibulaire",
        "VPPB",
        "Troubles de l'equilibre",
      ],
      externalSiteUrl: "https://physio-vertige.ch",
      externalSiteLabel: "Site dedie — Reeducation vestibulaire",
      published: true,
    },
  ]);

  // --- Pages ---
  console.log("Seeding pages...");

  // Home
  const [homePage] = await db
    .insert(schema.pages)
    .values({
      slug: "home",
      title: "Accueil",
      metaTitle: "Cabinet Girardello — Physiotherapie a Morges",
      metaDescription:
        "Cabinet de physiotherapie a Morges. Notre equipe de physiotherapeutes vous accompagne dans votre reeducation et votre bien-etre.",
      status: "published",
    })
    .returning({ id: schema.pages.id });

  await db.insert(schema.pageSections).values([
    {
      pageId: homePage.id,
      order: 0,
      type: "hero",
      content: {
        h1: "Cabinet Girardello",
        subtitle: "Physiotherapie a Morges",
        body: "Notre equipe de physiotherapeutes vous accueille a Morges pour vous accompagner dans votre parcours de soins, reeducation et bien-etre.",
        cta_label: "Prendre rendez-vous",
        cta_url: "/contact",
      },
    },
    {
      pageId: homePage.id,
      order: 1,
      type: "intro_physio",
      content: {
        eyebrow: "Notre metier",
        h2: "Qu'est-ce que la physiotherapie ?",
        body: `La physiotherapie est une discipline de sante qui vise a restaurer, maintenir et ameliorer la mobilite, la fonction et le bien-etre des patients. Elle s'appuie sur des techniques manuelles, des exercices therapeutiques et des conseils personnalises.

Au Cabinet Girardello, nous prenons en charge une grande variete de pathologies : douleurs musculosquelettiques, reeducation post-operatoire, troubles de l'equilibre, douleurs chroniques, et bien plus encore.

Notre approche se veut globale et centree sur le patient. Chaque traitement est adapte a vos besoins specifiques pour vous aider a retrouver une qualite de vie optimale.`,
      },
    },
    {
      pageId: homePage.id,
      order: 2,
      type: "team_preview",
      content: {
        eyebrow: "L'equipe",
        h2: "Nos physiotherapeutes",
        intro: "Trois physiotherapeutes passionnes a votre service, chacun avec ses specialites et son expertise.",
      },
    },
    {
      pageId: homePage.id,
      order: 3,
      type: "gallery_grid",
      content: {
        eyebrow: "Nos locaux",
        h2: "Notre cabinet",
        intro: "Situe au coeur de Morges, notre cabinet dispose d'equipements modernes dans un cadre accueillant.",
      },
    },
    {
      pageId: homePage.id,
      order: 4,
      type: "contact_form_section",
      content: {
        eyebrow: "Nous ecrire",
        h2: "Contactez-nous",
        body: "Une question ? Besoin d'un rendez-vous ? N'hesitez pas a nous ecrire via le formulaire ci-dessous.",
      },
    },
    {
      pageId: homePage.id,
      order: 5,
      type: "cta_fullwidth",
      content: {
        h2: "Prenez rendez-vous",
        body: "Notre cabinet vous accueille du lundi au vendredi. N'hesitez pas a nous contacter.",
        cta_label: "Prendre rendez-vous",
        cta_url: "/contact",
      },
    },
  ]);

  // Equipe
  const [equipePage] = await db
    .insert(schema.pages)
    .values({
      slug: "equipe",
      title: "Notre equipe",
      metaTitle: "Notre equipe de physiotherapeutes | Cabinet Girardello",
      metaDescription:
        "Decouvrez l'equipe de physiotherapeutes du Cabinet Girardello a Morges.",
      status: "published",
    })
    .returning({ id: schema.pages.id });

  await db.insert(schema.pageSections).values([
    {
      pageId: equipePage.id,
      order: 0,
      type: "team_member_card",
      content: {
        eyebrow: "L'equipe",
        h1: "Nos physiotherapeutes",
        intro: "Trois physiotherapeutes passionnes et qualifies vous accueillent au Cabinet Girardello a Morges.",
      },
    },
  ]);

  // Contact
  const [contactPage] = await db
    .insert(schema.pages)
    .values({
      slug: "contact",
      title: "Contact",
      metaTitle: "Contact | Cabinet Girardello",
      metaDescription:
        "Contactez le Cabinet Girardello a Morges. Prenez rendez-vous avec nos physiotherapeutes.",
      status: "published",
    })
    .returning({ id: schema.pages.id });

  await db.insert(schema.pageSections).values([
    {
      pageId: contactPage.id,
      order: 0,
      type: "contact_hero",
      content: {
        eyebrow: "Contact",
        h1: "Contactez-nous",
        intro: "N'hesitez pas a nous contacter pour toute question ou pour prendre rendez-vous.",
      },
    },
  ]);

  // Blog
  await db.insert(schema.pages).values({
    slug: "blog",
    title: "Blog",
    metaTitle: "Blog | Cabinet Girardello",
    metaDescription:
      "Articles et conseils en physiotherapie par l'equipe du Cabinet Girardello a Morges.",
    status: "published",
  });

  // Mentions legales
  const [mentionsPage] = await db
    .insert(schema.pages)
    .values({
      slug: "mentions-legales",
      title: "Mentions legales",
      metaTitle: "Mentions legales | Cabinet Girardello",
      status: "published",
    })
    .returning({ id: schema.pages.id });

  await db.insert(schema.pageSections).values([
    {
      pageId: mentionsPage.id,
      order: 0,
      type: "markdown_body",
      content: {
        body: `## Editeur du site

**Cabinet Girardello**
Rue de Couvaloup 16
1110 Morges, Suisse

Email : info@cabinet-girardello.ch

## Hebergement

Ce site est heberge par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.

## Propriete intellectuelle

L'ensemble du contenu de ce site (textes, images, logos) est la propriete exclusive du Cabinet Girardello, sauf mention contraire. Toute reproduction est interdite sans autorisation prealable.

## Donnees personnelles

Les informations recueillies via le formulaire de contact sont utilisees uniquement pour repondre a votre demande. Consultez notre [politique de confidentialite](/politique-de-confidentialite) pour plus de details.`,
      },
    },
  ]);

  // Politique de confidentialite
  const [privacyPage] = await db
    .insert(schema.pages)
    .values({
      slug: "politique-de-confidentialite",
      title: "Politique de confidentialite",
      metaTitle: "Politique de confidentialite | Cabinet Girardello",
      status: "published",
    })
    .returning({ id: schema.pages.id });

  await db.insert(schema.pageSections).values([
    {
      pageId: privacyPage.id,
      order: 0,
      type: "markdown_body",
      content: {
        body: `## Introduction

Le Cabinet Girardello s'engage a proteger la vie privee des visiteurs de son site internet. Cette politique de confidentialite explique comment nous collectons, utilisons et protegeons vos donnees personnelles.

## Donnees collectees

Nous collectons uniquement les donnees que vous nous transmettez volontairement via le formulaire de contact : nom, adresse e-mail, numero de telephone (facultatif) et message.

## Utilisation des donnees

Vos donnees sont utilisees uniquement pour :
- Repondre a votre demande de contact
- Vous recontacter si necessaire pour la prise de rendez-vous

## Conservation des donnees

Vos donnees de contact sont conservees pour la duree necessaire au traitement de votre demande, puis supprimees.

## Vos droits

Conformement a la loi federale sur la protection des donnees (LPD), vous disposez d'un droit d'acces, de rectification et de suppression de vos donnees. Contactez-nous a info@cabinet-girardello.ch.

## Cookies

Ce site utilise des cookies techniques necessaires a son fonctionnement. Aucun cookie publicitaire n'est utilise.

## Contact

Pour toute question relative a cette politique, contactez-nous a info@cabinet-girardello.ch.`,
      },
    },
  ]);

  console.log("Seed complete!");
}

seed().catch(console.error);
