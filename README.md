# DOCO — Catálogo & Vault de Archivo Streetwear (Spring Boot 3 + Angular 21)

Plataforma de comercio electrónico y catálogo de alta costura streetwear & vintage archival (**DOCO // CULIACÁN, SINALOA, MÉXICO**).

- **Estética:** Brutalista, High-Fashion, Y2K / 90s Heritage, Monochrome + Detalle Carmesí & Esmeralda.
- **Alcance Operativo:** Culiacán, Sinaloa (Entrega local directa y apartado inmediato 1-of-1).
- **Flujo de Venta:** Integración atómica a **WhatsApp Oficial (+52 667 203 3174)** con liquidación protegida (Transferencia SPEI / Depósito OXXO / Efectivo contra entrega). Sin registro de cuentas de comprador ni burocracia de facturación.
- **Seguridad:** Escudo anti-bots, bloqueo de scanners de penetración (sqlmap, path traversal), Rate Limiting por token bucket (Bucket4j), Cloudflare Turnstile CAPTCHA y CORS estricto.

---

## 1. Arquitectura del Proyecto

```
Doco/
├── backend/                      # Spring Boot 3.4.5 (Java 23 / SQLite WAL)
│   ├── src/main/java/com/doco/
│   │   ├── config/               # SecurityConfig, CorsProperties, SqliteDataSourceConfig
│   │   ├── controller/           # CatalogController, CheckoutController, AdminController...
│   │   ├── domain/               # Product, Category, Brand, Order, AppUser
│   │   ├── repository/           # JPA Specs con búsqueda dinámica
│   │   ├── security/             # AntiBotFilter, RateLimitFilter, CaptchaFilter, JWT
│   │   └── service/              # CatalogService, CheckoutService, DataSeedService
│   ├── pom.xml
│   └── Dockerfile                # Multi-stage production container para Render
├── frontend/                     # Angular 21 Standalone Components + Signals
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/             # CartService, CatalogService, SoundFx, WhatsApp, Theme
│   │   │   ├── features/         # home, catalog, product-detail, checkout, auth, admin
│   │   │   └── shared/           # doco-product-card, doco-quick-view, doco-mobile-dock...
│   │   └── environments/         # environment.ts & environment.prod.ts
│   ├── package.json
│   └── vercel.json               # Configuración SPA y headers de seguridad para Vercel
├── render.yaml                   # Blueprint de despliegue en Render (Backend Gratuito)
├── docker-compose.yml
└── README.md
```

---

## 2. Despliegue en Cuentas Gratuitas (Render + Vercel)

### A. Backend en Render (Web Service Gratuito)
1. En [Render.com](https://render.com), crea una cuenta o inicia sesión con GitHub.
2. Haz clic en **New +** → **Web Service**.
3. Conecta tu repositorio de GitHub `NetilloJunior8/Doco`.
4. Elige la opción **Docker**:
   - **Root Directory:** `backend`
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Instance Type:** `Free`
   - **Health Check Path:** `/actuator/health`
5. Configura las siguientes **Environment Variables** en Render:
   - `PORT`: `8080`
   - `SPRING_PROFILE`: `sqlite`
   - `APP_CORS_ORIGINS`: `https://*.vercel.app,http://localhost:4200` *(o tu dominio custom)*
   - `JWT_SECRET`: *(Genera una cadena aleatoria de 64 caracteres)*
   - `CAPTCHA_ENABLED`: `false` *(o `true` si activas Cloudflare Turnstile)*
6. Haz clic en **Deploy Web Service**. Render te dará una URL como `https://doco-backend.onrender.com`.

---

### B. Frontend en Vercel (Hosting Gratuito)
1. En [Vercel.com](https://vercel.com), inicia sesión con GitHub e importa el repositorio `NetilloJunior8/Doco`.
2. Configura los parámetros del proyecto:
   - **Framework Preset:** `Angular`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/doco-catalog-frontend/browser`
3. En `frontend/src/environments/environment.prod.ts`, coloca la URL de tu backend en Render:
   ```typescript
   export const environment = {
     production: true,
     apiBaseUrl: 'https://doco-backend.onrender.com/api/v1', // Reemplazar con tu URL de Render
     captchaEnabled: false,
     turnstileSiteKey: '1x00000000000000000000AA',
     whatsappPhone: '526672033174'
   };
   ```
4. Haz clic en **Deploy**. Vercel configurará automáticamente el enrutamiento SPA mediante [`vercel.json`](file:///d:/vs-code-programas/proyecto%20wero/Doco/frontend/vercel.json).

---

## 3. Ejecución Local (Desarrollo)

### Backend (Spring Boot + SQLite)
```bash
cd backend
mvn test              # Ejecuta suite con 8 pruebas de integración y seguridad
mvn spring-boot:run   # Inicia servidor en http://localhost:8080
```
- Endpoint de verificación: `http://localhost:8080/actuator/health`
- Swagger OpenAPI: `http://localhost:8080/swagger-ui.html`
- Base de datos: `backend/data/doco-catalog.db` (modo WAL de alto rendimiento, cero licencias requeridas).

### Frontend (Angular 21)
```bash
cd frontend
npm install
npm start             # Inicia servidor dev en http://localhost:4200
```

---

## 4. Características Principales de DOCO
- **Dock Inferior Móvil:** Navegación ultra fluida estilo app nativa para smartphones con contador reactivo de bolsa, switch de temas White/Dark y audio FX.
- **Modal de Inspección Rápida ("Vista Rápida"):** Medidor de estado de conservación (ej. `9.5/10`), telemetría de medidas exactas en cm y apartado 1-clic a WhatsApp.
- **Lookbook Interactivo con Hotspots:** Etiquetas interactivas sobre la fotografía nocturna de Culiacán para inspeccionar y comprar prendas directamente.
- **Sin cuentas obligatorias ni facturación:** El flujo de compra es directo y sin fricción mediante la bolsa de compras hacia WhatsApp oficial.
