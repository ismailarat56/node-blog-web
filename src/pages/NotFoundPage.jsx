import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section>
      <title>Sayfa bulunamadı · Node Blog</title>

      <h1 className="page-title">Sayfa bulunamadı</h1>
      <p>Aradığın adres bu blogda yok.</p>
      <Link to="/">Ana sayfaya dön</Link>
    </section>
  );
}
