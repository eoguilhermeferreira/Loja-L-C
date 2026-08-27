import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { storeConfig } from "@/config/store";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-accent">{storeConfig.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{storeConfig.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Institucional</h3>
          <nav className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
            <Link href="/produtos" className="hover:text-accent">Todos os produtos</Link>
            <Link href="/carrinho" className="hover:text-accent">Meu carrinho</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Atendimento</h3>
          <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            <a
              href={`https://wa.me/${storeConfig.contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-accent"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
            <a
              href={`mailto:${storeConfig.contact.email}`}
              className="flex items-center gap-2 hover:text-accent"
            >
              <Mail className="size-4" /> {storeConfig.contact.email}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" /> {storeConfig.address.city} - {storeConfig.address.state}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Redes sociais</h3>
          <a
            href={storeConfig.contact.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
          >
            <InstagramIcon className="size-4" /> Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {storeConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
