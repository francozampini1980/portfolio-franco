# 09 · Pendientes

Regla para Claude Code: **no completar nada de esta lista por su cuenta**. La columna "Mientras tanto" dice cómo construir sin bloquearse. Si algo no está previsto ahí, frenar y preguntar.

| ID | Tema | Quién resuelve | Mientras tanto |
|---|---|---|---|
| P-01 | Plazo de respuesta "48 horas" del mensaje de éxito | Fran | Usar el texto tal cual |
| P-02 | Content definió el bloque "Cómo trabajo" para la home, pero el diseño de Figma no lo incluye | Fran | Cargar los datos (`home_intro`) y **no** mostrarlos |
| P-03 | Principios en la home: Figma usa textos abreviados y el enlace "Ver los principios con ejemplos"; Content no definió ese enlace | Fran / Content | Textos de Content (`philosophy.items[].body`) y el enlace de Figma |
| P-04 | Textos del Lab escritos en Figma ("cómo funciona", descripciones de los agentes y pasos de la home). Falta sumar Handoff a los pasos de la home y definir el estado de Handoff al publicar | Fran / Content | Usar los textos de `copy.json` (origen DISEÑO), con Handoff como "Próximo" |
| P-05 | URL pública de la presentación del benchmark para el Lab | Fran (compartir el deck) | No mostrar el enlace |
| P-06 | Números del encabezado (`stats`) de los casos 1, 3 y 4; Figma solo los define para Búmeran | Fran / Content | `stats` vacío: no se muestra la fila |
| P-07 | Metadatos de `/lab` | Content | `title` "Lab" con el template; `description` = `lab_page.subtitle` |
| P-08 | Mensaje de límite de envíos (429) | Content | Mantener el mensaje actual del repo |
| P-09 | Slug del caso 4 (`gestion-crisis-equipo-upskill`) | Fran | No cambiarlo |
| P-10 | Sobre y Contacto no tienen pantalla en Figma | Fran (revisa en el preview) / Diseño | Construir con los componentes y tokens según 04-pantallas.md |
| P-11 | Revisar que las imágenes actuales de los casos no expongan datos sensibles, ahora que son públicos. Definir si el bucket pasa a público (permitiría cachear la página) | Fran | Mantener la galería y las URLs firmadas; página `force-dynamic` |
| P-12 | El sistema de acceso (contraseña, links, `/acceso`, admin Accesos) y `LogoCarousel` quedan sin uso | Fran | No borrar nada; links viejos siguen funcionando |
| P-13 | Los eventos personalizados de Vercel Web Analytics requieren el plan Pro | Fran | Enviar a Vercel y a GA4 (08-medicion.md) |
| P-14 | Confirmar que Web Analytics mide y tomar una semana de datos "antes" del deploy | Fran / Producto | Construir en una rama con preview; sin merge a `main` hasta su OK |
| P-15 | Glosario en estado PROPUESTO | Fran | Respetar los términos preferidos |
| P-16 | Componentes nuevos sin componente en la librería (píldora, ficha, resumen, índice, navegación, tarjeta de agente) | Design System (v1.3) | Construir en código según 03-componentes.md; después se suman a Figma |
| P-17 | En las capturas de Figma los chips se ven violeta sólido por un problema de render | — | Vale el spec de la librería: fondo violeta al 18% y borde al 40% |
| P-18 | Versión en inglés (H3) y test de 5 segundos (H2) | Research | Fuera de esta etapa |
| P-19 | `cv_profile` y el CV en PDF no se revisaron en Content | Content | Sin cambios |
