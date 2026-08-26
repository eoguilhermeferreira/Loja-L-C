import { BannerCarousel } from "@/components/store/banner-carousel";
import { CategoryGrid } from "@/components/store/category-grid";
import { ProductSection } from "@/components/store/product-section";
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
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:py-8">
      <BannerCarousel banners={banners} />
      <CategoryGrid categories={categories} />
      <ProductSection title="Mais vendidos" href="/produtos" products={maisVendidos} />
      <ProductSection title="Novidades" href="/produtos" products={novidades} />
      <ProductSection title="Ofertas" href="/produtos" products={ofertas} />
    </div>
  );
}
