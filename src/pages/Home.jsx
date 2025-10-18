import React from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/productos.json";

export default function Home() {
  return (
    <>
      {/* 🔹 Hero Section */}
      <section id="home" className="py-5 text-center bg-dark text-white">
        <div className="container">
          <h1 className="display-4 fw-bold">GG Accesorios</h1>
          <p className="lead mb-4">
            Tu tienda de accesorios gaming con estilo anime y otaku
          </p>
          <img
            src="/images/SinFondo4.png"
            alt="GG Accesorios Hero"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxWidth: "80%" }}
          />
        </div>
      </section>

      {/* 🔹 Productos destacados */}
      <section id="destacados" className="py-5 bg-secondary bg-opacity-10">
        <div className="container">
          <h2 className="text-center mb-5">Productos Destacados</h2>
          <div className="row">
            {products.map((p) => (
              <div key={p.id} className="col-md-4 mb-4">
                <ProductCard {...p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Nosotros */}
      <section id="nosotros" className="py-5 text-center bg-dark text-white">
        <div className="container">
          <h2 className="mb-4">Sobre Nosotros</h2>
          <p className="lead">
            En <strong>GG Accesorios</strong> somos gamers apasionados. Vendemos
            muebles, sillas, teclados, auriculares y más, con el mejor diseño y
            funcionalidad. Nuestra misión es llevar tu setup al siguiente nivel.
          </p>
        </div>
      </section>

      {/* 🔹 Contacto */}
      <section id="contacto" className="py-5 bg-secondary bg-opacity-10">
        <div className="container">
          <h2 className="text-center mb-4">Contáctanos</h2>
          <form className="mx-auto" style={{ maxWidth: "600px" }}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Tu nombre"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="correo"
                placeholder="nombre@ejemplo.com"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label">
                Mensaje
              </label>
              <textarea
                className="form-control"
                id="mensaje"
                rows="4"
                placeholder="Escribe tu mensaje..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
    </>
  );
}