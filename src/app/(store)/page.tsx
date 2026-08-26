import { BannerCarousel } from "@/components/store/banner-carousel";
import { CategoryGrid } from "@/components/store/category-grid";
import { PromoBanner, PromoSquareBanner } from "@/components/store/promo-banner";
import { ProductSection } from "@/components/store/product-section";
import { Reveal } from "@/components/store/reveal";
import { storeConfig } from "@/config/store";
import {
  getActiveBanners,
  getCategories,
  getProductsByHomeSection,
} from "@/lib/queries";

export default async function HomePage() {
  const [banners, categories, maisVendidos, novidades, ofertas] = await Promise.all([
    getActiveBanners(),
    getCategories(),
    getProductsByHomeSection("mais_vendidos"),
    getProductsByHomeSection("novidades"),
    getProductsByHomeSection("ofertas"),
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-6 sm:py-8">
      <BannerCarousel banners={banners} />

      <Reveal>
        <CategoryGrid categories={categories} />
      </Reveal>

      <Reveal>
        <ProductSection title="Mais vendidos" href="/produtos" products={maisVendidos} />
      </Reveal>

      <Reveal className="grid gap-4 sm:grid-cols-2">
        <PromoBanner
          imageUrl="https://placehold.co/900x700/0e5c4a/f7fbf9?font=montserrat&text=Roupas+Masculinas"
          eyebrow="Para eles"
          title="Estilo que fala por você"
          description="Peças essenciais pra montar looks confiantes no dia a dia."
          buttonLabel="Ver coleção masculina"
          href="/categoria/roupas-masculinas"
        />
        <PromoBanner
          imageUrl="https://placehold.co/900x700/c9a15c/201804?font=montserrat&text=Roupas+Femininas"
          eyebrow="Para elas"
          title="Presenteie quem você ama"
          description="Vestidos, blusas e muito mais pra ela se sentir incrível."
          buttonLabel="Ver coleção feminina"
          href="/categoria/roupas-femininas"
          imageSide="right"
        />
      </Reveal>

      <Reveal>
        <ProductSection title="Novidades" href="/produtos" products={novidades} />
      </Reveal>

      <Reveal>
        <PromoSquareBanner
          imageUrl="https://d8j0ntlcm91z4.cloudfront.net/user_3DddW0JRUDw0aHbl43U3f1JTg8N/hf_20260826_044208_533b0845-2bfc-43b5-bf3c-8c93e0457558.png"
          eyebrow="Edição limitada"
          title="Presenteie alguém que merece se vestir com estilo"
          description="Peças selecionadas que unem conforto e atitude — pra presentear ou se presentear."
          buttonLabel="Ver a coleção"
          href="/produtos"
        />
      </Reveal>

      <Reveal>
        <ProductSection title="Ofertas" href="/produtos" products={ofertas} />
      </Reveal>

      <Reveal>
        <PromoBanner
          imageUrl="https://placehold.co/900x700/3f7d6a/f7fbf9?font=montserrat&text=Fale+Conosco"
          eyebrow="Atendimento"
          title="Ainda com dúvida sobre o tamanho ideal?"
          description="Nosso time responde rapidinho pelo WhatsApp e te ajuda a escolher certo."
          buttonLabel="Chamar no WhatsApp"
          href={`https://wa.me/${storeConfig.contact.whatsapp}`}
        />
      </Reveal>
    </div>
  );
}
