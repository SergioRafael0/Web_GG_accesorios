import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel() {
  const slides = [
    { id: 0, img: "/images/Silla_gamer_negra.webp", caption: "Silla Gamer Negra — Ergonomía y estilo", link: "/productos/12" },
    { id: 1, img: "/images/Luces_Led_escritorio.webp", caption: "Monitor LG 24 — 80hz", link: "/productos/7" },
    { id: 2, img: "/images/Teclado-3.webp", caption: "Mouse Logitech — Personalizable y ergonómico", link: "/productos/4" }
  ];
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const autoplayInterval = 4500;
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % slides.length), autoplayInterval);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="carousel" id="carousel" aria-label="Carrusel de productos destacados">
      <div className="slides">
        {slides.map((s, i) => (
          <div key={s.id} className={`slide ${i === current ? "active" : ""}`} data-index={i} id={`slide-${i}`}>
            <Link to={s.link} style={{ display: 'block', width: '100%', height: '100%' }}>
              <img src={s.img} alt={s.caption} onError={(e)=> e.currentTarget.src='https://picsum.photos/seed/gg'+i+'/800/450'} />
              <div className="slide-caption">{s.caption}</div>
            </Link>
          </div>
        ))}
      </div>
      <button className="carousel-btn prev" aria-label="Anterior" onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}>❮</button>
      <button className="carousel-btn next" aria-label="Siguiente" onClick={() => setCurrent(c => (c + 1) % slides.length)}>❯</button>
      <div className="carousel-dots" role="tablist" aria-label="Navegación de diapositivas">
        {slides.map((_, i) => (
          <button key={i} className={`dot ${i === current ? "active" : ""}`} data-slide={i} aria-selected={i===current} role="tab" aria-controls={`slide-${i}`} onClick={()=>setCurrent(i)} />
        ))}
      </div>
    </div>
  );
}