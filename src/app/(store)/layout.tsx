import { Footer } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { WhatsAppFloatButton } from "@/components/store/whatsapp-float-button";
import { getCategories } from "@/lib/queries";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
