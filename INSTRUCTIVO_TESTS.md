# Instructivo de Pruebas Unitarias - Lógica de Negocio

Este documento describe las 21 pruebas unitarias implementadas en archivos individuales para validar cada aspecto de la lógica de negocio. Estas pruebas cubren desde la autenticación hasta la gestión de órdenes en modo offline.

## Archivos de Pruebas

Las pruebas se han dividido en 4 archivos para mayor claridad y modularidad:

1.  `src/pruebas/AuthService.test.jsx` (Autenticación)
2.  `src/pruebas/ProductosService.test.jsx` (Productos)
3.  `src/pruebas/CartService.test.jsx` (Carrito)
4.  `src/pruebas/OrdenesService.test.jsx` (Órdenes y Modo Offline)

## Cómo Ejecutar las Pruebas

Para correr todas las pruebas juntas:
```bash
npm test src/pruebas/
```

Para correr un archivo específico:
```bash
npm test src/pruebas/AuthService.test.jsx
```

## Detalle de Casos de Prueba

### 1. Autenticación (`AuthService.test.jsx`)
*   **Caso 1:** Iniciar sesión debe llamar a la API y guardar las credenciales localmente.
*   **Caso 2:** Registrar usuario debe enviar los datos correctos a la API.
*   **Caso 3:** Cerrar sesión debe eliminar el token y usuario del almacenamiento local.
*   **Caso 4:** Obtener perfil (me) debe consultar el endpoint de usuario actual.
*   **Caso 5:** Actualizar perfil debe enviar solo los datos modificados (PATCH).

### 2. Productos (`ProductosService.test.jsx`)
*   **Caso 6:** Obtener productos debe consultar el listado general.
*   **Caso 7:** Obtener producto por ID debe normalizar la URL de la imagen.
*   **Caso 8:** Obtener producto por ID debe retornar null si no existe.
*   **Caso 9:** Crear producto debe enviar los datos mediante POST.
*   **Caso 10:** Actualizar producto debe usar PUT con el ID específico.
*   **Caso 11:** Eliminar producto debe usar DELETE con el ID específico.

### 3. Carrito (`CartService.test.jsx`)
*   **Caso 12:** Obtener carrito debe consultar el endpoint del carrito.
*   **Caso 13:** Agregar ítem debe enviar ID de producto y cantidad.
*   **Caso 14:** Actualizar ítem debe enviar la nueva cantidad.
*   **Caso 15:** Eliminar ítem debe borrar el producto específico.

### 4. Órdenes y Modo Offline (`OrdenesService.test.jsx`)
*   **Caso 16:** Crear orden (Online) debe usar la API si hay red.
*   **Caso 17:** Crear orden (Offline) debe guardar en localStorage si falla la red.
*   **Caso 18:** Confirmar pago (Online) debe notificar a la API.
*   **Caso 19:** Confirmar pago (Offline) debe actualizar el estado localmente.
*   **Caso 20:** Obtener orden por ID (Offline) debe buscar en localStorage si falla la API.
*   **Caso 21:** Obtener orden inexistente (Offline) debe retornar null correctamente.
