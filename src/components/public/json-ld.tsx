interface LocalBusinessProps {
  name: string;
  phone?: string | null;
  email?: string | null;
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  url: string;
}

export function LocalBusinessJsonLd({
  name,
  phone,
  email,
  street,
  postalCode,
  city,
  url,
}: LocalBusinessProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name,
    url,
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(street && {
      address: {
        "@type": "PostalAddress",
        streetAddress: street,
        postalCode: postalCode || undefined,
        addressLocality: city || undefined,
        addressCountry: "CH",
      },
    }),
    medicalSpecialty: "Physiotherapy",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface PersonListProps {
  practitioners: Array<{
    fullName: string;
    title: string | null;
    slug: string;
  }>;
  url: string;
}

export function PractitionerListJsonLd({ practitioners, url }: PersonListProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: practitioners.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: p.fullName,
        jobTitle: p.title,
        url: `${url}/equipe`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
