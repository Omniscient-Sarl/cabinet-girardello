import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod/v4";
import { getSiteSettings } from "@/db/queries";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.email("Adresse e-mail invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = parsed.data;
    const settings = await getSiteSettings();
    const to = settings?.contactDestinationEmail || "info@cabinet-girardello.ch";

    await resend.emails.send({
      from: "Cabinet Girardello <noreply@cabinet-girardello.ch>",
      to,
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      text: [
        `Nom: ${name}`,
        `Email: ${email}`,
        phone ? `Telephone: ${phone}` : null,
        `\nMessage:\n${message}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
