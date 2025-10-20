import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // esperar un tick para que el DOM de la nueva ruta esté listo
    setTimeout(() => {
      if (hash) {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) return el.scrollIntoView({ behavior: "smooth" });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }, [pathname, hash]);

  return null;
}