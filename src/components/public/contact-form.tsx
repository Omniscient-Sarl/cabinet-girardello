"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de l'envoi");
      }

      toast.success("Message envoye avec succes !");
      form.reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de l'envoi du message"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input id="name" name="name" required minLength={2} placeholder="Votre nom" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="votre@email.ch"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telephone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+41 XX XXX XX XX" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Decrivez votre demande..."
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-sage hover:bg-sage-dark">
        {loading ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
