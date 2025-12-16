# GG Accesorios — Frontend Web (React + Vite)

Aplicación web de tienda online para GG Accesorios, desarrollada con React y Vite. Implementa autenticación, catálogo, detalle de producto, carrito, checkout, resumen y resultado de compra. Incluye panel de administración básico y pruebas unitarias.

## Características
- Catálogo y detalle de productos consumiendo API real
- Carrito persistente en `localStorage` con sincronización de UI
- Flujo de compra completo: checkout, resumen y confirmación
- Órdenes del usuario con historial y tolerancia a fallos de red
- Autenticación con JWT y rutas protegidas
- UI responsiva con React-Bootstrap y SCSS
- Pruebas unitarias con Vitest y Testing Library
- Formularios con dropdowns de Región/Comuna y Código Postal restringido a 5 dígitos
- Feedback visual al añadir productos al carrito
- Boleta detallada en compra exitosa con total, neto e IVA (19%)
- Restricciones de pago según método de envío (retiro vs domicilio)
- Panel de administración con edición parcial de usuarios vía `PATCH` y mapeo de `USER`→`CLIENT`
- Fechas de órdenes mostradas usando `fechaPedido` (fallback a `createdAt`)

## Stack
- React, React Router, React-Bootstrap, Vite
- SCSS para estilos
- Vitest, @testing-library/react, jsdom
- ESLint

## Requisitos
- Node.js LTS
- Backend accesible vía `VITE_API_URL` (por defecto `https://apitest-1-95ny.onrender.com`)

## Configuración
- Crear archivo `.env` (opcional):
  - `VITE_API_URL=https://tu-backend`
- El token de sesión se guarda en `localStorage` tras `POST /auth/login`.

## Scripts
- `npm run dev` — desarrollo
- `npm run build` — producción
- `npm run preview` — servir build
- `npm run lint` — ESLint
- `npm run test` — pruebas
- `npm run test:watch` — pruebas en modo watch
- `npm run test:coverage` — cobertura
- `npm run deploy` — despliegue a GitHub Pages (usa `predeploy` → `build`)

## Estructura
- `src/components` — componentes reutilizables (Header, Footer, ProductCard, Forms, Tablas)
- `src/pages` — vistas (Home, Productos, DetalleProducto, Cart, Checkout, Resumen, Success, Failure, Admin, Login, Register, Orders)
- `src/services` — servicios de API (`http`, `auth`, `productos`, `orders`)
- `src/utils` — validaciones
- `src/data` — datos auxiliares (regiones/comunas)
- `src/pruebas` — pruebas unitarias
- `public/images` — assets estáticos

## Rutas Principales
- `/` — Inicio
- `/productos` — Catálogo
- `/productos/:id` — Detalle de producto
- `/cart` — Carrito
- `/checkout` — Checkout
- `/resumen` — Resumen de compra
- `/success` — Compra exitosa (muestra `orderId`)
- `/failure` — Compra fallida (muestra error)
- `/admin` — Panel admin (role `ADMIN`)
- `/login`, `/register` — Autenticación y registro
- `/orders` — Historial de órdenes del usuario

## Integración con API
- `http.js` agrega `Authorization` automáticamente salvo rutas públicas (`GET /productos`, `/imagenes`, `/auth/*`).
- Productos:
  - `GET /productos`, `GET /productos/{id}`
  - `POST /productos` (JSON o multipart)
  - `PUT`/`DELETE /productos/{id}`
- Autenticación:
  - `POST /auth/login`, `POST /auth/register`, `GET /users/me`
- Órdenes:
  - `POST /checkout` crea la orden (checkout)
  - `POST /checkout/{ordenId}/confirm` confirma pago
  - `GET /orders` lista órdenes del usuario; `GET /orders/admin` para admin
  - `PATCH /orders/{id}` edición parcial; si el backend no soporta `PATCH`, se intenta `PUT` como fallback
  - Fallback local: ante error de red, guarda y lee órdenes desde `localStorage`
 - Usuarios (Admin):
  - `PATCH /users/{id}` para edición parcial de email, role y perfil; errores 400/422 devuelven detalle. Alias aceptado: `USER` mapeado a `CLIENT`.

## Flujo de Compra
1. Añadir productos al carrito desde tarjetas o detalle
2. `Cart` gestiona líneas y total
3. `Checkout` prellena datos desde el perfil (si existen), valida datos, región/comuna, código postal (5 dígitos), métodos de envío/pago y tarjeta
   - Reglas de pago:
     - Retiro en tienda → pago en tienda (`local`) obligatorio
     - Envío a domicilio → `tarjeta` o `contraentrega`
4. `Resumen` confirma orden y envía a API
5. `Success` muestra boleta con items, total con IVA, neto sin IVA e IVA (19%); `Failure` muestra error

## Pruebas
- `src/pruebas` contiene pruebas de:
  - Carrito (render, eliminación, total)
  - Header (contador de carrito)
  - HeroCarousel (navegación)
  - ProductCard (render y añadir al carrito)
  - Flujo de checkout y resumen (validaciones, navegación y confirmación)
- Ejecutar: `npm run test`

## Estilos y Responsividad
- SCSS con media queries para móviles
- Grid y componentes de Bootstrap para layouts

## Seguridad y Accesibilidad
- No se exponen secretos en el repositorio
- Formularios con feedback de validación
- Carrusel con roles y atributos ARIA básicos
 - Autenticación con JWT; rutas de escritura requieren token. En panel admin, los cambios de usuarios se envían como parcial (`PATCH`) con envío de solo campos modificados.

## Despliegue
- GitHub Pages:
  - `npm run deploy` (precompila y sube `dist`)
  - Configurar `homepage` en `package.json` si cambia la URL base

## Contribución
- Ejecutar `npm run lint` y `npm run test` antes de PR
- Seguir patrones existentes de componentes y servicios
- Mantener consistencia en modelos (uso de `imagen` vs `imagenUrl` según endpoint)
 - Priorizar `fechaPedido` para mostrar fechas en tablas de órdenes; usar `createdAt` como respaldo.

## Licencia
- Proyecto educativo. Ajustar según necesidad del repositorio.
