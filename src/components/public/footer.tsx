import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="font-heading text-lg font-bold text-sage-dark">
              Cabinet Girardello
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Cabinet de physiotherapie a Morges. Notre equipe vous accompagne
              dans votre reeducation et votre bien-etre.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-sage-dark">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/equipe" className="text-muted-foreground hover:text-sage-dark">
                  Equipe
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-sage-dark">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Informations
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-muted-foreground hover:text-sage-dark"
                >
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="text-muted-foreground hover:text-sage-dark"
                >
                  Politique de confidentialite
                </Link>
              </li>
              <li>
                <a
                  href="https://physio-vertige.ch"
                  target="_blank"
                  rel="external noopener"
                  className="text-muted-foreground hover:text-sage-dark"
                >
                  Physio-Vertige.ch — Reeducation vestibulaire
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Cabinet Girardello. Tous droits reserves.
          <p className="mt-2 text-muted-foreground/70">
            Développé par{" "}
            <a
              href="https://omniscient.swiss"
              target="_blank"
              rel="external noopener"
              className="underline transition-colors hover:text-foreground"
            >
              Omniscient Sàrl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
