"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  FileText,
  Users,
  Image as ImageIcon,
  BookOpen,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: Home },
  { href: "/admin/site-settings", label: "Parametres du site", icon: Settings },
  { href: "/admin/pages", label: "Pages & Sections", icon: FileText },
  { href: "/admin/practitioners", label: "Praticiens", icon: Users },
  { href: "/admin/gallery", label: "Galerie", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/media", label: "Medias", icon: Upload },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-white md:block">
      <div className="p-4">
        <Link href="/" className="font-heading text-sm font-bold text-sage-dark">
          Cabinet Girardello
        </Link>
        <p className="text-xs text-muted-foreground">Administration</p>
      </div>
      <nav className="space-y-0.5 px-2">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === href
                ? "bg-sage/10 font-medium text-sage-dark"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
