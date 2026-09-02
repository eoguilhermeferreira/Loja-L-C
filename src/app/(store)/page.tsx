import { BannerCarousel } from "@/components/store/banner-carousel";
import { CategoryGrid } from "@/components/store/category-grid";
import { PromoBanner, PromoSquareBanner } from "@/components/store/promo-banner";
import { ProductSection } from "@/components/store/product-section";
import { Reveal } from "@/components/store/reveal";
import {
  getActiveBanners,
  getCategories,
  getProductsByHomeSection,
} from "@/lib/queries";
import type { Banner } from "@/types/database.types";

const CAMPAIGN_VIDEO_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3DddW0JRUDw0aHbl43U3f1JTg8N/2ffa7644-3cef-4786-8ab5-b0d74526a7e4.mp4";

function toPromoBannerProps(banner: Banner) {
  return {
    imageUrl: banner.image_url,
    eyebrow: banner.eyebrow ?? undefined,
    title: banner.title ?? "",
    description: banner.description ?? undefined,
    buttonLabel: banner.button_label ?? "Ver mais",
    href: banner.button_link ?? "/produtos",
  };
}

export default async function HomePage() {
  const [banners, categories, maisVendidos, novidades, ofertas] = await Promise.all([
    getActiveBanners(),
    getCategories(),
    getProductsByHomeSection("mais_vendidos"),
    getProductsByHomeSection("novidades"),
    getProductsByHomeSection("ofertas"),
  ]);

  const carouselBanners = banners.filter((b) => b.placement === "carousel");
  const promoLeft = banners.find((b) => b.placement === "promo_left");
  const promoRight = banners.find((b) => b.placement === "promo_right");
  const square = banners.find((b) => b.placement === "square");
  const promoWide = banners.find((b) => b.placement === "promo_wide");

  return (
    <>
      <BannerCarousel banners={carouselBanners} videoSrc={CAMPAIGN_VIDEO_URL} />

      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-6 sm:py-8">
        <Reveal>
          <CategoryGrid categories={categories} />
        </Reveal>

        <Reveal>
          <ProductSection title="Mais vendidos" href="/produtos" products={maisVendidos} />
        </Reveal>

        {(promoLeft || promoRight) && (
          <Reveal
            className={
              promoLeft && promoRight ? "grid gap-4 sm:grid-cols-2" : undefined
            }
          >
            {promoLeft && <PromoBanner {...toPromoBannerProps(promoLeft)} />}
            {promoRight && (
              <PromoBanner {...toPromoBannerProps(promoRight)} imageSide="right" />
            )}
          </Reveal>
        )}

        <Reveal>
          <ProductSection title="Novidades" href="/produtos" products={novidades} />
        </Reveal>

        {square && (
          <Reveal>
            <PromoSquareBanner {...toPromoBannerProps(square)} />
          </Reveal>
        )}

        <Reveal>
          <ProductSection title="Ofertas" href="/produtos" products={ofertas} />
        </Reveal>

        {promoWide && (
          <Reveal>
            <PromoBanner {...toPromoBannerProps(promoWide)} />
          </Reveal>
        )}
      </div>
    </>
  );
}
