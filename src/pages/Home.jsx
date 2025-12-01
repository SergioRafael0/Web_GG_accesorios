import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import ContactForm from "../components/ContactForm";
import { getProductos } from "../services/productos";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProductos();
        if (mounted) {
          setProductos(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch {
        setProductos([]);
        setError("No se pudo cargar productos");
      } finally {
        if (mounted) setCargando(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const destacados = productos.slice(0, 4);

  return (
    <div className="text-white">
      <main>
        <section id="home" className="hero container">
          <div className="hero-grid">
            <div className="hero-text">
              <h1>GG Accesorios</h1>
              <p className="tag">Tu tienda de accesorios gaming</p>
              <HeroCarousel />
              <a className="btn-primary" href="/productos">
                Ver productos
              </a>
            </div>
            <div
              className="hero-media"
              aria-hidden="true"
            >
              <img
                src="/images/SinFondo4.png"
                alt=""
                style={{ width: "80%", borderRadius: 12, objectFit: "cover", display: "block", maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </section>

        <section id="destacados" className="products container">
          <h2>Destacados</h2>
          <p className="lead">Explora nuestra selección</p>
          <div className="product-grid">
            {cargando && (
              <p className="text-muted">Cargando destacados...</p>
            )}
            {!cargando && error && (
              <p className="text-danger">No se pudo cargar productos</p>
            )}
            {!cargando && !error && destacados.length > 0 && (
              destacados.map((p) => <ProductCard key={p.id} {...p} />)
            )}
            {!cargando && !error && destacados.length === 0 && (
              <p className="text-muted">No hay productos disponibles</p>
            )}
          </div>
        </section>

        <section id="nosotros" className="about container">
          <h2>Nosotros</h2>
          <div className="about-grid">
            <p>
              En GG Accesorios creemos que el gaming es más que un pasatiempo...
            </p>
            <ul>
              <li>Envíos a todo Chile</li>
              <li>Garantía de 1 año</li>
              <li>Soporte técnico</li>
            </ul>
          </div>
        </section>

        <section id="contacto" className="contact container">
          <h2>Contacto</h2>
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
