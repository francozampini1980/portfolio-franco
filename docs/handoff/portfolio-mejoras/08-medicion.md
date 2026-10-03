# 08 · Medición

**Objetivo.** Medir las métricas del brief [PRODUCTO]:
- Tasa home → caso.
- Clics en contacto.
- Mensajes enviados.
- Visitas por página y por fuente, con UTM.

**Herramienta.** Vercel Web Analytics, ya instalado (`<Analytics />` en `src/app/layout.tsx`).
- **Pageviews, referrers, UTM, país y dispositivo:** vienen automáticos, sin código.
- **Eventos:** se envían con `track()` de `@vercel/analytics`. Los eventos personalizados de Vercel requieren el plan Pro (P-13).
- **Copia en GA4:** cada evento se envía también a GA4, con `window.gtag?.('event', nombre, props)`, porque GA4 ya está instalado. Así no se pierde la medición si el plan no incluye eventos. [SUPUESTO]

**Implementación.** Un helper `src/lib/analytics.ts` con `trackEvent(nombre, props)` que llama a los dos. Las propiedades son strings cortos y sin datos personales: nunca nombre, mail ni texto del mensaje. [NORMA privacidad]

| Evento | Cuándo | Propiedades | Para qué |
|---|---|---|---|
| `case_card_click` | clic en una `CaseCard` | `case_slug`; `origin`: `home` \| `casos`; `position`: 1–4 | Tasa home → caso = `case_card_click` con origin=home / pageviews de `/` |
| `cta_contact_click` | clic en "Escribime" o en otro botón que lleve a `/contacto` | `location`: `header` \| `hero` \| `cierre` \| `menu_mobile` | Clics en contacto, por ubicación |
| `contact_channel_click` | clic en el mail o en LinkedIn | `channel`: `mail` \| `linkedin`; `location`: `footer` \| `contacto` \| `experiencia` | Contactos fuera del formulario |
| `contact_form_submit` | respuesta del envío del formulario | `result`: `success` \| `validation_error` \| `server_error` \| `rate_limited` | Mensajes enviados y errores |
| `case_nav_click` | clic en caso anterior o siguiente | `direction`: `prev` \| `next`; `from_slug` | Lectura de más de un caso |
| `cv_download` | clic en "Descargar CV (PDF)" | ninguna | Interés en el perfil |
| `lab_link_click` | clic en "Ver cómo funcionan" (home) o en la presentación (Lab) | `location`: `home` \| `lab` | Interés en el diferencial de agentes |

**Reglas**
- Los eventos de navegación se disparan en el `onClick` del link, sin bloquear la navegación.
- `contact_form_submit` se dispara en el cliente al recibir la respuesta. Si es `validation_error`, se dispara una sola vez por intento de envío.
- **UTM.** Fran usa UTM en cada link que comparte, por ejemplo `?utm_source=linkedin&utm_medium=postulacion`. Vercel las toma solo, sin código. [PRODUCTO]
- **Antes del deploy:**
  - Confirmar en el dashboard de Vercel que Web Analytics registra visitas.
  - Tomar una semana de "antes" (P-14). [PRODUCTO]
