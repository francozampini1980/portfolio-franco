-- Carga de contenido del handoff portfolio-mejoras.
-- Generado por scripts/gen-contenido-sql.mjs desde copy.json (cms). No editar a mano.
-- Requiere haber aplicado antes 20261003_portfolio_mejoras.sql.
begin;

-- ---------------- case_studies (update por slug) ----------------
update public.case_studies set
  client_label     = $cp$E-commerce · Medición de experiencia$cp$,
  title            = $cp$La voz del cliente como criterio de priorización$cp$,
  highlights       = $cp$["Datos de NPS, CSAT y CES en 14 discoveries","Más de 1 año de datos"]$cp$::jsonb,
  summary_role     = $cp$Owner del proyecto$cp$,
  summary_company  = $cp$Frávega$cp$,
  summary_period   = $cp$4 meses$cp$,
  summary_team     = $cp$Proyecto individual$cp$,
  summary_problem  = $cp$No había ninguna medición de la experiencia de compra y entrega; las decisiones se tomaban sobre supuestos.$cp$,
  summary_decision = $cp$Medir con NPS, CSAT y CES en dos momentos clave, con herramientas propias e IA, sin esperar un equipo de desarrollo.$cp$,
  summary_result   = $cp$Los datos guiaron decisiones en 14 discoveries y hoy son un insumo formal para priorizar en Producto.$cp$,
  stats            = $cp$[]$cp$::jsonb,
  challenge_title  = $cp$El desafío$cp$,
  challenge_body   = $cp$<p>Antes de este proyecto, la única interacción medida con el cliente era la resolución de casos de atención, es decir, el contacto ante un problema. No había medición de la experiencia de compra y entrega, ni un reporte que mostrara su evolución.</p><p>Eso generaba dos problemas:</p><ul><li>Para UX y Producto: cada iniciativa necesitaba una encuesta o una entrevista desde cero, sin línea de base.</li><li>Para el resto de la organización: muchas decisiones se apoyaban en supuestos que nadie había validado.</li></ul><p>Había dos resistencias:</p><ul><li>Técnica: no había un equipo de desarrollo dedicado.</li><li>Cultural: Producto y Negocio no estaban acostumbrados a recibir críticas directas de los usuarios.</li></ul>$cp$,
  role_title       = $cp$Mi aporte$cp$,
  role_body        = $cp$<ul><li>Rol: owner directo, de la planificación y el diseño metodológico a la ejecución técnica. Lo hice solo.</li><li>Alcance: dos puntos de medición en producción, después de la compra y después de la entrega.</li><li>Impacto: el dato pasó a ser insumo formal de la priorización de Producto.</li></ul>$cp$,
  decisions_title  = $cp$Decisiones clave$cp$,
  decisions_body   = $cp$<ul><li>Elegí métricas estándar (NPS, CSAT y CES) para que todos las entendieran, y definí el resto de las preguntas con datos: durante el primer mes probamos distintos temas y nos quedamos con los más mencionados, más ejes clave del e-commerce como costos de envío, cupones y promociones.</li><li>Resolví la parte técnica con los recursos disponibles: generé con IA el módulo de encuesta en Next.js, con resultados en Google Sheets, y automaticé el análisis de los comentarios abiertos. La encuesta posterior a la compra se integra al sitio con Hotjar y la posterior a la entrega usa los mails existentes.</li><li>Definí el momento de cada encuesta según lo que vive el cliente: después de la compra, con el proceso de búsqueda y elección fresco; después de la entrega, cuando ya pasó la espera y el contacto con el transportista.</li><li>Armé un espacio para explicar la metodología, el origen de los datos y la frecuencia de los reportes. Eso convirtió la resistencia inicial en confianza en el proceso.</li></ul>$cp$,
  impact_title     = $cp$Resultados$cp$,
  impact_body      = $cp$<ul><li>Los datos de las encuestas guiaron decisiones en 14 discoveries, como el rediseño de la card de producto o la experiencia de carga de cupones.</li><li>Más de un año de datos de la encuesta posterior a la compra y 5 meses de la posterior a la entrega.</li><li>Las mejoras en el seguimiento del pedido en Postventa se reflejaron en una mejora de NPS y CSAT posteriores a la entrega.</li></ul>$cp$,
  learnings_title  = $cp$Aprendizajes$cp$,
  learnings_body   = $cp$<p>Aprendí a trabajar con grandes volúmenes de datos y a relacionarme con otros equipos desde la evidencia.</p><p>Si lo empezara hoy, apuntaría desde el inicio a un sistema integrado de voz del cliente que cubra todo el ciclo de vida.</p><p>Próximo paso: llevar la medición a la experiencia en sucursales.</p>$cp$,
  updated_at       = now()
where slug = $cp$metricas-de-experiencia$cp$;

update public.case_studies set
  client_label     = $cp$Design system · Consistencia$cp$,
  title            = $cp$Búmeran: de librería de Figma a estándar de código$cp$,
  highlights       = $cp$["x2 velocidad de desarrollo","-35% errores de front","39 organismos en uso"]$cp$::jsonb,
  summary_role     = $cp$Líder del proceso, coordinando UX, design system, ingeniería y producto$cp$,
  summary_company  = $cp$Frávega$cp$,
  summary_period   = $cp$1 año$cp$,
  summary_team     = $cp$4 product designers, 1 líder de UI y 2 diseñadoras UI$cp$,
  summary_problem  = $cp$Interfaz inconsistente y componentes que se codificaban varias veces.$cp$,
  summary_decision = $cp$Usar un refactor técnico como oportunidad para que Búmeran fuera el estándar de todos los desarrollos nuevos.$cp$,
  summary_result   = $cp$Velocidad x2 en desarrollo, -35% de errores de front y 39 organismos en uso.$cp$,
  stats            = $cp$[{"value":"x2","label":"velocidad de los equipos de desarrollo"},{"value":"-35%","label":"errores de front"},{"value":"39","label":"organismos en uso en el e-commerce"}]$cp$::jsonb,
  challenge_title  = $cp$El desafío$cp$,
  challenge_body   = $cp$<ul><li>Inconsistencia: la interfaz era visualmente inconsistente y desactualizada, y eso afectaba la percepción de la marca y la usabilidad.</li><li>Retrabajo: sin componentes centralizados, el mismo componente se diseñaba y codificaba varias veces.</li><li>Oportunidad: un refactor técnico planificado abría una ventana corta para adoptar el design system de forma obligatoria y rápida.</li></ul>$cp$,
  role_title       = $cp$Mi aporte$cp$,
  role_body        = $cp$<ul><li>Rol: lideré la transformación y acompañé a la líder de UI en su primer rol de liderazgo, ayudándola a decidir cuándo delegar y cuándo no.</li><li>Alcance: todos los desarrollos nuevos del e-commerce.</li></ul>$cp$,
  decisions_title  = $cp$Decisiones clave$cp$,
  decisions_body   = $cp$<ul><li>Cambié el alcance de "componente primitivo" a "organismo orientado a tareas": por ejemplo, una sola card de producto que se adapta a listado, destacado, ficha, vitrina o carrito, en lugar de una versión por pantalla.</li><li>Tracé el límite entre desarrollos nuevos y evolutivos: Búmeran es estándar solo para los nuevos, porque en los evolutivos, ya en producción y con plazos cortos, construir componentes desde cero hubiera encarecido el trabajo.</li><li>Organicé al equipo de UX para construir en paralelo: documentación estándar, un set de organismos por integrante, un espacio semanal de dudas y un circuito de calidad donde Búmeran diseña, desarrollo construye el componente en código y UX audita la implementación.</li><li>Negocié con arquitectura y desarrollo los tokens y la estructura técnica, con prioridad en calidad, consistencia y accesibilidad, y sumé al equipo de SEO para que los componentes también mejoraran ese frente.</li></ul>$cp$,
  impact_title     = $cp$Resultados$cp$,
  impact_body      = $cp$<ul><li>39 organismos en uso en la home, el listado y la ficha de producto, y las landings del CMS. Header y footer impactan en todos los flujos.</li><li>Velocidad x2 en los equipos de desarrollo y -35% de errores de front.</li><li>Todos los componentes cumplen nivel AA de accesibilidad y respetan la estructura SEO.</li><li>Otros equipos, como Postventa, ya reutilizan componentes, y un canal de ayuda sostiene la adopción con calidad.</li></ul>$cp$,
  learnings_title  = $cp$Aprendizajes$cp$,
  learnings_body   = $cp$<p>Cuando lidero a través de alguien con más expertise técnico que yo, mi rol es organizar y priorizar: destrabar conflictos, negociar entre equipos y dar espacio para que esa persona lidere con su criterio.</p><p>Si lo empezara hoy, acordaría entregables concretos desde el principio y definiría mejor el rol de cada disciplina.</p><p>Próximo paso: extender Búmeran a las aplicaciones.</p>$cp$,
  updated_at       = now()
where slug = $cp$design-system$cp$;

update public.case_studies set
  client_label     = $cp$Comunicaciones · Journey map$cp$,
  title            = $cp$Mails que explican el envío y bajan los llamados$cp$,
  highlights       = $cp$["-20% llamados al centro de atención en 2 meses","-5% menciones negativas sobre la atención"]$cp$::jsonb,
  summary_role     = $cp$Líder del diseño, con ownership del contenido y la implementación$cp$,
  summary_company  = $cp$Frávega$cp$,
  summary_period   = $cp$4 meses$cp$,
  summary_team     = $cp$1 product designer y 1 UI designer$cp$,
  summary_problem  = $cp$Los mails de una misma secuencia se contradecían y generaban llamados para preguntar por el envío.$cp$,
  summary_decision = $cp$Mapear todo el journey, definir una estructura única para los mails y priorizar por grupos.$cp$,
  summary_result   = $cp$-20% de llamados al centro de atención en 2 meses.$cp$,
  stats            = $cp$[]$cp$::jsonb,
  challenge_title  = $cp$El desafío$cp$,
  challenge_body   = $cp$<p>Cada equipo cargaba sus propios mails y disparadores en la plataforma de comunicaciones, sin ver el resto del journey. No había mails duplicados, pero sí inconsistencias: un mail decía una cosa y el siguiente la contradecía.</p><p>Atención al Cliente detectó que una parte importante de los llamados era para saber cuándo llegaba el pedido o si ya se podía retirar.</p><p>Mapear fue más complejo de lo previsto: sin documentación ni un responsable único del journey, el equipo dio el relevamiento por terminado tres veces y cada vez aparecieron casos nuevos.</p>$cp$,
  role_title       = $cp$Mi aporte$cp$,
  role_body        = $cp$<ul><li>Rol: lideré el diseño con ownership directo del contenido y su implementación.</li><li>Alcance: todo el journey de comunicaciones del e-commerce, coordinado con Atención al Cliente y Shipping.</li></ul>$cp$,
  decisions_title  = $cp$Decisiones clave$cp$,
  decisions_body   = $cp$<ul><li>Mapeé el journey como un árbol de decisión, con una rama por situación: pago, confirmación, despacho, retiro en sucursal, entrega a domicilio, demoras, devoluciones y garantías. Así aparecieron dependencias que una lista no mostraba.</li><li>Construí una herramienta de IA para auditar contenido y diseño, entrenada con el manual de voz y tono, el glosario de la marca y buenas prácticas de contenido. Revisa un mail en su contexto dentro del journey y devuelve feedback con una propuesta concreta.</li><li>Definí una estructura para todo mail transaccional: la novedad, la acción, un momento de empatía, el acceso a postventa y el footer.</li><li>Negocié con Shipping que priorizara la iniciativa el trimestre siguiente, con el ahorro proyectado en llamados como argumento.</li><li>Implementamos por grupos de mails y no uno por uno: primero el flujo estándar, de la confirmación a la entrega, y después reprogramaciones, errores de pago y gestiones.</li></ul>$cp$,
  impact_title     = $cp$Resultados$cp$,
  impact_body      = $cp$<ul><li>-15% de llamados al centro de atención el primer mes y -20% acumulado al segundo.</li><li>-5% de menciones negativas sobre la atención en las encuestas de satisfacción.</li><li>2 mails redundantes menos y el 100% de las comunicaciones mapeadas implementadas.</li></ul>$cp$,
  learnings_title  = $cp$Aprendizajes$cp$,
  learnings_body   = $cp$<p>No hay que subestimar la complejidad: lo que parecía un template terminó requiriendo tres relevamientos y coordinación con los sistemas de Shipping. La IA resolvió una tarea clave, el contenido, en un equipo sin especialistas dedicados.</p><p>Si lo empezara hoy, convocaría desde el inicio a todos los equipos involucrados para descubrir las dependencias antes.</p>$cp$,
  updated_at       = now()
where slug = $cp$comunicaciones$cp$;

update public.case_studies set
  client_label     = $cp$Gestión de equipo · Upskilling$cp$,
  title            = $cp$Sostener el discovery con un equipo más chico$cp$,
  highlights       = $cp$["8 product designers con habilidades de research"]$cp$::jsonb,
  summary_role     = $cp$UX Manager$cp$,
  summary_company  = null,
  summary_period   = $cp$Mediados de 2025$cp$,
  summary_team     = $cp$8 personas$cp$,
  summary_problem  = $cp$Una reducción del equipo ponía en riesgo la capacidad de entrega y la moral.$cp$,
  summary_decision = $cp$Formar a los product designers en research, automatizar parte del contenido con IA y aplanar la estructura.$cp$,
  summary_result   = $cp$El equipo sostuvo la operación y el discovery con 8 personas.$cp$,
  stats            = $cp$[]$cp$::jsonb,
  challenge_title  = $cp$El desafío$cp$,
  challenge_body   = $cp$<p>El equipo de UX se redujo y perdió roles especializados, entre ellos research y content. Había dos riesgos: no poder sostener las entregas y que se resintiera la moral del equipo que quedaba.</p>$cp$,
  role_title       = $cp$Mi aporte$cp$,
  role_body        = $cp$<ul><li>Rol: redefiní roles y estructura, y sostuve al equipo durante la transición.</li><li>Alcance: todo el equipo de UX.</li></ul>$cp$,
  decisions_title  = $cp$Decisiones clave$cp$,
  decisions_body   = $cp$<ul><li>Formé a los product designers en research para que llevaran los discoveries de punta a punta. Elegí perfiles más completos antes que la especialización pura, para que la voz del usuario siguiera presente sin un equipo de research dedicado.</li><li>Implementé una IA basada en el manual de voz y tono para revisar el contenido de interfaz. Cubrió parte del trabajo de content y aceleró el plan de sistematizar los contenidos como ya hacíamos con los componentes.</li><li>Armé una estructura más plana, con menos jerarquías y personas senior capaces de moverse entre proyectos, para decidir más rápido sin perder calidad.</li></ul>$cp$,
  impact_title     = $cp$Resultados$cp$,
  impact_body      = $cp$<ul><li>El equipo sostuvo la operación y la capacidad de discovery.</li><li>8 product designers con habilidades de research que gestionan el discovery de principio a fin.</li><li>Contenido de interfaz revisado con IA.</li></ul>$cp$,
  learnings_title  = $cp$Aprendizajes$cp$,
  learnings_body   = $cp$<p>En una crisis, el equipo necesita claridad antes que soluciones: qué cambia, qué se mantiene y qué se espera de cada persona.</p><p>Si lo volviera a vivir, comunicaría la nueva estructura y los roles desde el primer día, y le pondría objetivos y plazos concretos a la formación en research, en lugar de ajustarla sobre la marcha.</p>$cp$,
  updated_at       = now()
where slug = $cp$gestion-crisis-equipo-upskill$cp$;

-- ---------------- experiences (update por order_index) ----------------
update public.experiences set
  company    = $cp$Frávega Tech$cp$,
  role       = $cp$UX Manager$cp$,
  date_from  = $cp$Enero 2025$cp$,
  date_to    = $cp$actualidad$cp$,
  team_label = $cp$Equipo de hasta 14 personas.$cp$,
  body       = $cp$<p>Una de las cadenas de retail de electrodomésticos, tecnología y hogar más grandes de Argentina.</p><p>Lidero el equipo de UX (leads, product designers, content, research y design system) y coordino la experiencia de cuatro áreas: e-commerce, marketplace, Frávega Pay (billetera y créditos) y la app de sucursales.</p><ul><li>Reconstruir el rol de UX y su articulación con el resto de la empresa.</li><li>Hacer crecer al equipo y su madurez.</li><li>Llevar al equipo el foco y los programas estratégicos de la empresa.</li></ul>$cp$,
  updated_at = now()
where order_index = 0;

update public.experiences set
  company    = $cp$Payway$cp$,
  role       = $cp$UX Manager$cp$,
  date_from  = $cp$Diciembre 2021$cp$,
  date_to    = $cp$Enero 2025$cp$,
  team_label = $cp$Equipo de hasta 24 personas.$cp$,
  body       = $cp$<p>Soluciones de cobro para comercios de todos los tamaños, en canales digitales y presenciales.</p><p>Lideré el equipo de UX (leads, product designers, content, research y design system) y coordiné la experiencia de cuatro factories: Merchant Services, Online Payments, Instore Payments y Financial Services.</p><ul><li>Definir los ejes estratégicos de UX y sus disciplinas.</li><li>Armar roadmaps de largo plazo.</li><li>Hacer crecer al equipo y su madurez.</li><li>Llevar al equipo el foco y los programas estratégicos de Prisma.</li><li>Coordinar actividades de team building.</li><li>Coordinar research generativo y propuestas de valor de nuevos productos para los equipos de negocio.</li><li>Coordinar con los heads de las factories los esfuerzos de los equipos.</li><li>Reportar al directorio el estado de los ejes estratégicos.</li></ul>$cp$,
  updated_at = now()
where order_index = 1;

update public.experiences set
  company    = $cp$Mercado Pago$cp$,
  role       = $cp$UX Design Supervisor$cp$,
  date_from  = $cp$Abril 2020$cp$,
  date_to    = $cp$Diciembre 2021$cp$,
  team_label = $cp$Equipo de hasta 4 personas.$cp$,
  body       = $cp$<p>Plataforma de pagos líder en Latinoamérica.</p><p>Lideré el equipo de UX de Growth Tooling: programas de rewards, flujo de donaciones y cupones de descuento, con foco en retención y adquisición de usuarios.</p><ul><li>Liderar equipos de diseño y contenido.</li><li>Cuidar la calidad y los tiempos de las entregas.</li><li>Promover la cultura de la empresa.</li><li>Acompañar el desarrollo del equipo.</li><li>Entregar experiencias de punta a punta con diseño centrado en las personas.</li><li>Planificar y entregar productos junto a desarrollo y producto.</li></ul>$cp$,
  updated_at = now()
where order_index = 2;

update public.experiences set
  company    = $cp$Despegar.com$cp$,
  role       = $cp$UX Lead$cp$,
  date_from  = $cp$Marzo 2017$cp$,
  date_to    = $cp$Abril 2020$cp$,
  team_label = $cp$Equipo de hasta 5 personas.$cp$,
  body       = $cp$<p>Principal agencia de viajes online de Latinoamérica.</p><p>Trabajé con los equipos de hoteles, checkout y venta de productos combinados.</p><ul><li>Liderar equipos de diseño, research y contenido.</li><li>Entregar experiencias de punta a punta con diseño centrado en las personas.</li><li>Planificar y entregar productos junto a desarrollo y producto.</li></ul>$cp$,
  updated_at = now()
where order_index = 3;

update public.experiences set
  company    = $cp$Despegar.com$cp$,
  role       = $cp$UX Senior Designer$cp$,
  date_from  = $cp$Septiembre 2014$cp$,
  date_to    = $cp$Marzo 2017$cp$,
  team_label = null,
  body       = $cp$<ul><li>Coordinar workshops y dinámicas de diseño colaborativo.</li><li>Prototipar y diseñar flujos.</li><li>Hacer tests de usabilidad.</li></ul>$cp$,
  updated_at = now()
where order_index = 4;

update public.experiences set
  company    = $cp$Insite LATAM$cp$,
  role       = $cp$Director de arte$cp$,
  date_from  = $cp$Diciembre 2012$cp$,
  date_to    = $cp$Agosto 2014$cp$,
  team_label = null,
  body       = $cp$<p>Agencia de contenidos digitales para empresas como Mercado Libre, Cablevisión, HP y Fox.</p><p>Campañas con sitios, juegos online, landings, banners y mails.</p><ul><li>Crear campañas.</li><li>Coordinar a los equipos de diseño.</li></ul>$cp$,
  updated_at = now()
where order_index = 5;

-- ---------------- site_content (upsert con merge de jsonb) ----------------
-- data = data || nuevo: conserva claves que copy.json no define (portrait, linkedin, cv_profile).
insert into public.site_content (key, data, updated_at)
values ($cp$home_hero$cp$, $cp${"eyebrow":"UX Manager · 12 años liderando equipos","title":"Lidero equipos de UX que mueven métricas de negocio.","subtitle":"Lideré equipos de UX en Frávega, Payway, Mercado Pago y Despegar. Hoy construyo agentes de IA para que la mejora continua sea un sistema, no un proyecto.","availability":"Busco mi próximo rol como Head o Director de Diseño, en la región o remoto.","primary_cta_label":"Ver casos","primary_cta_href":"/casos","secondary_cta_label":"Escribime","secondary_cta_href":"/contacto","portrait_alt":"Franco Zampini","stats":[{"value":"12 años","label":"liderando equipos de UX"},{"value":"16 años","label":"en productos digitales"},{"value":"-20%","label":"llamados al centro de atención tras rediseñar los mails transaccionales"},{"value":"x2","label":"velocidad de los equipos de desarrollo con el design system"}]}$cp$::jsonb, now())
on conflict (key) do update
  set data = public.site_content.data || excluded.data, updated_at = now();

insert into public.site_content (key, data, updated_at)
values ($cp$home_lab$cp$, $cp${"eyebrow":"Lab","title":"Agentes de UX","body":"Construyo agentes de IA que hacen benchmark, research y content con el rigor de un equipo, en horas en lugar de semanas. Esta versión del portfolio se mejoró con ellos.","link_label":"Ver cómo funcionan","link_href":"/lab","card_eyebrow":"Caso real: este portfolio","steps":[{"title":"Producto","body":"Armó la base y las métricas a medir"},{"title":"Benchmark","body":"Comparó 5 portfolios de líderes"},{"title":"Content","body":"Definió la voz y reescribió el sitio"},{"title":"Design system","body":"Convirtió el sitio en tokens y componentes"},{"title":"Diseño","body":"Esta propuesta"}]}$cp$::jsonb, now())
on conflict (key) do update
  set data = public.site_content.data || excluded.data, updated_at = now();

insert into public.site_content (key, data, updated_at)
values ($cp$lab_page$cp$, $cp${"eyebrow":"Lab","title":"Agentes de UX","subtitle":"Un set de agentes de IA que hacen benchmark, research, content, diseño y handoff con el rigor de un equipo, conectados entre sí.","how":[{"title":"Guían con preguntas","body":"Cada agente pregunta lo necesario para hacer su tarea con método."},{"title":"Dejan todo en una carpeta","body":"Los entregables quedan en Drive y Figma, con fuente y fecha."},{"title":"Se pasan el contexto","body":"Cada agente retoma lo que hizo el anterior."}],"case_eyebrow":"Caso real","case_title":"Esta versión del portfolio","agents":[{"number":"01","title":"Producto","body":"Armó la base del producto y la lista de métricas a medir.","status":"Hecho"},{"number":"02","title":"Benchmark","body":"Comparó 5 portfolios de líderes de diseño.","status":"Hecho"},{"number":"03","title":"Content","body":"Definió la voz y reescribió todos los textos del sitio.","status":"Hecho"},{"number":"04","title":"Design system","body":"Convirtió el sitio en tokens y componentes en Figma.","status":"Hecho"},{"number":"05","title":"Diseño","body":"Armó esta propuesta en desktop y mobile.","status":"Hecho"},{"number":"06","title":"Handoff","body":"Paquete para construirlo con Claude Code.","status":"Próximo"}],"link_label":"Ver la presentación del benchmark","link_href":null}$cp$::jsonb, now())
on conflict (key) do update
  set data = public.site_content.data || excluded.data, updated_at = now();

insert into public.site_content (key, data, updated_at)
values ($cp$philosophy$cp$, $cp${"eyebrow":"Cómo lidero","title":"Cuatro principios","items":[{"title":"Design engineering","body":"Promuevo equipos donde diseño, desarrollo y producto trabajan con un lenguaje común y design systems en código. Menos handoffs, entregas más rápidas y más personas que pueden contribuir al diseño.","about_body":"Los límites entre las disciplinas que construyen productos son cada vez más difusos. Promuevo equipos donde diseño, desarrollo y producto trabajan con un lenguaje común y design systems en código. Menos handoffs, entregas más rápidas y más personas que pueden contribuir al diseño.","example":"En la práctica: Búmeran pasó de librería de Figma a estándar de código para todos los desarrollos nuevos."},{"title":"Mejora continua automatizada","body":"La IA permite hacer benchmark, research, contenidos y validación en días. Construyo herramientas y agentes que convierten la mejora continua en un sistema permanente, sin bajar la calidad.","about_body":"La IA permite hacer benchmark, research, contenidos y validación con usuarios en días, no en semanas. Construyo herramientas y agentes que convierten la mejora continua en un sistema permanente, sin bajar la calidad.","example":"En la práctica: una herramienta de IA que audita el contenido de los mails transaccionales y los agentes de UX del Lab."},{"title":"Diseño en toda la organización","body":"UX articula las necesidades del negocio, los tiempos de producto y las capacidades técnicas, y da el marco para que más personas diseñen con calidad.","about_body":"Toda la organización puede pensar y crear pantallas, flujos y productos con procesos colaborativos. UX articula las necesidades del negocio, los tiempos de producto y las capacidades técnicas, y da el marco para que más personas diseñen con calidad.","example":"En la práctica: en Búmeran cada integrante de UX construyó su propio set de organismos, con un circuito de calidad compartido."},{"title":"Desarrollo de personas","body":"Los mejores productos salen de equipos motivados, diversos y escuchados. Doy dirección y visibilidad al trabajo del equipo y acompaño el crecimiento de cada persona.","about_body":"Los mejores productos salen de equipos motivados, diversos y escuchados. Doy dirección y visibilidad al trabajo del equipo, y acompaño el crecimiento de cada persona con mentoría y feedback continuo.","example":"En la práctica: acompañé a la líder de UI del design system en su primer rol de liderazgo."}]}$cp$::jsonb, now())
on conflict (key) do update
  set data = public.site_content.data || excluded.data, updated_at = now();

insert into public.site_content (key, data, updated_at)
values ($cp$about$cp$, $cp${"eyebrow":"Filosofía de liderazgo","title":"Diseñar la experiencia también es diseñar el equipo.","body":"Lidero con cuatro principios. Cada uno tiene un ejemplo concreto de mi trabajo."}$cp$::jsonb, now())
on conflict (key) do update
  set data = public.site_content.data || excluded.data, updated_at = now();

insert into public.site_content (key, data, updated_at)
values ($cp$home_intro$cp$, $cp${"title":"De diseñar flujos a diseñar equipos","link_label":"Cómo lidero","body":"<p><strong>Liderazgo:</strong> 12 años liderando equipos multidisciplinarios de UX, de hasta 24 personas: leads, product designers, content, research y design system. Acompaño a cada persona con dirección clara, mentoría y feedback continuo.</p><p><strong>Producto:</strong> 16 años resolviendo experiencias de punta a punta en e-commerce, pagos, cobros presenciales y digitales, y turismo.</p>"}$cp$::jsonb, now())
on conflict (key) do update
  set data = public.site_content.data || excluded.data, updated_at = now();

insert into public.site_content (key, data, updated_at)
values ($cp$contact$cp$, $cp${"eyebrow":"Contacto","title":"Conversemos","body":"Busco mi próximo rol como Head o Director de Diseño, en la región o remoto. Si tenés una búsqueda o estás armando un equipo de UX, escribime.","email":"francozampini@gmail.com"}$cp$::jsonb, now())
on conflict (key) do update
  set data = public.site_content.data || excluded.data, updated_at = now();

commit;
