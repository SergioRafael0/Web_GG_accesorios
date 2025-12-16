import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <section id="home" className="hero container">
          <div className="hero-grid">
            <div className="hero-text">
              <h1>GG Accesorios</h1>
              <p className="tag">Tu tienda de accesorios gaming</p>
              <HeroCarousel />
              <Link className="btn-primary" to="/productos">
                Ver productos
              </Link>
            </div>
            <div
              className="hero-media"
              aria-hidden="true"
            >
              <Link to="/productos/35">
                <img
                  src="/images/SinFondo4.png"
                  alt="Monitor"
                  style={{ width: "80%", borderRadius: 12, objectFit: "cover", display: "block", maxWidth: "100%", height: "auto" }}
                />
              </Link>
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

        <section id="nosotros" className="about container" style={{ backgroundColor: "var(--accent)", color: "#fff", padding: "2rem", borderRadius: "var(--radius)", marginTop: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ color: "#fff" }}>Nosotros</h2>
          <div className="about-grid">
            <p>
              En GG Accesorios, nuestra pasión por el gaming nos impulsa a ofrecerte solo lo mejor. Nos dedicamos a seleccionar meticulosamente cada producto de nuestro catálogo, asegurándonos de que cumpla con los más altos estándares de calidad y rendimiento que todo gamer merece. Desde teclados mecánicos de última generación hasta sillas ergonómicas diseñadas para largas sesiones de juego, nuestro objetivo es potenciar tu experiencia y llevar tu setup al siguiente nivel. Entendemos que cada jugador es único, por eso ofrecemos una amplia variedad de accesorios que se adaptan a tu estilo y necesidades. Más que una tienda, somos una comunidad comprometida con el mundo gaming, brindando asesoría experta y un servicio al cliente excepcional para que encuentres exactamente lo que buscas. ¡Únete a la familia GG Accesorios y equipate para la victoria!
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
    </div>
  );
}
