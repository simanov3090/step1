import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/app/components/product-detail-actions";
import { formatPrice, menu, menuDetails, menuPhoto } from "@/data/menu";

type ProductPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return menu.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = menu.find((item) => item.id === id);
  if (!product) return { title: "Блюдо не найдено — Вкусно Суши" };
  return {
    title: `${product.name} — Вкусно Суши`,
    description: `${product.description}. ${formatPrice(product.price)}. Состав и вес порции.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = menu.find((item) => item.id === id);
  if (!product) notFound();
  const details = menuDetails[product.id];
  if (!details) notFound();

  return (
    <main className="product-page">
      <div className="product-page-glow" />
      <div className="product-detail-shell">
        <Link className="product-back" href="/#catalog">← <span>К меню</span></Link>
        <div className="product-detail-grid">
          <figure className="product-detail-visual scroll-reveal">
            <div className="product-detail-image" role="img" aria-label={product.name} style={{ backgroundImage: `linear-gradient(180deg, rgba(8,8,8,.02), rgba(8,8,8,.2)), url("${menuPhoto(product.image, 1500)}")` }} />
            <span className="product-detail-index">ВКУСНО СУШИ <i /> {product.category.toUpperCase()}</span>
          </figure>
          <article className="product-detail-copy scroll-reveal">
            <span className="product-detail-category"><i /> {product.category.toUpperCase()}</span>
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            <div className="product-detail-price"><strong>{formatPrice(product.price)}</strong><span>{details.pieces} ШТ. <i /> {details.weight} Г</span></div>
            <div className="product-composition">
              <div className="composition-heading"><h2>Состав</h2><span>НА ПОРЦИЮ</span></div>
              {details.ingredients.map((ingredient) => <div className="ingredient-row" key={ingredient.name}><span>{ingredient.name}</span><span>{ingredient.grams} г</span></div>)}
              <div className="ingredient-row ingredient-total"><strong>Вес порции</strong><strong>{details.weight} г</strong></div>
            </div>
            <div className="product-story"><span>О ВКУСЕ</span><p>{details.story}</p></div>
            <ProductDetailActions product={product} />
          </article>
        </div>
      </div>
    </main>
  );
}