# ProMatch — Mapa completo de la interfaz (v1)

_Documento de referencia con todo lo diseñado hasta ahora. Complementa `promatch-brand-brief.md` (marca) y `promatch-deck-design-rules.md` (reglas visuales del deck)._

---

## 1. Arquitectura general

```
Onboarding (bienvenida, propuesta de valor)
        ↓
Login / Registro único
        ↓
Verificación de identidad (IA)
        ↓
Modo cliente activo (disponible de inmediato)
        ↓ (opcional, desde el perfil, en cualquier momento)
Activar modo prestador
        ↓
Validación fiscal + perfil profesional
        ↓
Modo prestador activo
```

**Decisión clave:** un único usuario, una única cuenta, verificación de identidad una sola vez. El modo prestador es una activación progresiva, no un registro aparte. El switch de rol (tab o toggle en la navegación superior) solo aparece para quienes ya activaron el modo prestador — no tiene sentido mostrarlo antes.

**Estados de confianza que pueden convivir:**
- Identidad verificada, sin modo prestador → ve la app como cliente, sin badges de prestador.
- Identidad verificada + fiscal en revisión → tiene su perfil de prestador armado pero **no aparece en búsquedas** todavía. Estado visual: chip ámbar "En revisión", nunca el verde funcional.
- Identidad verificada + fiscal aprobada → recién ahí badge verde "Profesional Verificado" y aparición en resultados.

---

## 2. Camino cliente ("busco un servicio")

### 2.1 Home cliente
- Buscador libre arriba de todo.
- Grilla de 6 categorías (íconos + label corto): Hogar, Tecnología, Estética, Educación, Cuidados, Salud.
- Sección "Cerca tuyo ahora" (geolocalización en tiempo real).
- Tab bar: buscar, favoritos, mensajes, perfil.

### 2.2 Pantalla de categoría (ej. Hogar)
- Grilla de especialidades como chips con ícono (Plomería, Electricidad, Gas, Cerrajería, Pintura, Carpintería).
- Escape: link "Ver todos los profesionales de [categoría]" para quien no encaja en un chip.
- Sección "Populares cerca tuyo" con 1-2 profesionales destacados como atajo directo al perfil.

### 2.3 Listado filtrado (por especialidad)
- Filtros toggle (no excluyentes): Disponible ahora / Mejor calificado / Más cerca / Precio.
- Orden por defecto: cercanía + disponibilidad combinadas (gana lo rápido sobre lo "mejor").
- Tarjeta de profesional: foto, nombre + check de verificado (ícono, no chip), especialidad, rating + reseñas, distancia, badge verde solo para "Disponible ahora".
- Estado vacío: nunca en blanco — ofrece agendar para más tarde o ampliar el radio.

### 2.4 Perfil del profesional
- Header: foto, nombre + check verificado, especialidad, distancia, rating.
- Badge "Disponible ahora" (único verde funcional de la pantalla).
- "Sobre mí" (bio/experiencia, tono humano).
- Galería de trabajos realizados (opcional, fuerte en categorías visuales).
- Reseñas: extracto + link "ver todas".
- **Sin precio publicado** — se negocia directo en el chat (Transparencia Radical).
- CTA único: "Contactar" (naranja).

### 2.5 Contacto → formulario → chat
1. **¿Ahora o agendado?** — elección de modalidad.
2. **Formulario completo**: chips de motivo específicos de la especialidad (ej. Plomería → "Pérdida de agua", "Destape", "Instalación", "Reparación de canilla" + chip "Otro" con texto libre), descripción opcional, foto opcional. Para "Agendado" se suma selector de fecha/franja horaria cruzado con la disponibilidad del prestador.
3. **Chat con contexto**: el formulario se convierte en la primera tarjeta pineada de la conversación — el prestador ve el pedido armado, no un saludo en blanco.

### 2.6 Estado "buscando profesional" (si no responde a tiempo)
- Solo aplica el conteo regresivo duro a la modalidad "Ahora".
- Si el prestador no responde, la solicitud se **reenvía automáticamente a otro profesional cercano** (tope razonable de intentos, ej. 3-4).
- Pantalla de espera: indicador de actividad (radar), contador "Intento X de N", intento anterior visible pero atenuado, opción siempre visible de "Cancelar búsqueda".
- Si se agotan los intentos: salida clara (agendar para más tarde / ampliar radio), nunca un callejón sin salida.
- Manejo de condición de carrera: si dos prestadores aceptan casi simultáneo, al segundo se le informa con un mensaje amable, no un error genérico.
- Para "Agendado": sin countdown duro, pero recordatorio suave si no hay respuesta pasadas unas horas, y reenvío si se acerca la fecha sin confirmar.

---

## 3. Camino prestador ("ofrezco un servicio")

### 3.1 Home prestador
- Switch de rol arriba de todo (cliente / prestador).
- Toggle de disponibilidad como elemento hero, en verde funcional.
- Sección "Solicitudes nuevas" (tarjetas con badge naranja "Nueva" para lo urgente).
- Bloque de perfil con estado de suscripción.
- Tab bar: buscar, solicitudes, calendario, mensajes, perfil.

### 3.2 Detalle de solicitud entrante
- Datos del cliente (nombre, distancia).
- Si es "Ahora": bloque naranja con conteo regresivo ("08:24 restantes").
- Pedido completo: especialidad, chips de motivo elegidos, descripción, foto.
- Acciones: **Aceptar** (naranja, primario), **Rechazar** (neutro, sin fricción), y para "Agendado" además **Proponer otro horario**.
- Al aceptar: se abre el mismo chat con contexto que ve el cliente.

### 3.3 Perfil profesional editable
Separación clara entre lo que el prestador edita y lo que solo consulta:

**Editable:**
- Foto y datos básicos.
- Especialidades (chips, puede tener más de una).
- Zona de trabajo.
- Horarios habituales (base recurrente, distinta del toggle "disponible ahora" del home).
- Suscripción (plan, vencimiento, gestión de pago).
- Galería de trabajos realizados.

**Solo lectura (estados de confianza):**
- Identidad verificada (check verde).
- Situación fiscal (ámbar "En revisión" → verde cuando se aprueba).
- Calificación y reseñas recibidas.

---

## 4. Decisiones de marca aplicadas transversalmente

- **Verde funcional (`#56c689`)**: exclusivo para "Disponible ahora" y "Profesional Verificado" (o su check equivalente). Nunca como color decorativo ni de acción genérica.
- **Naranja (`#ec5e28`)**: urgencia, inmediatez y CTAs de acción — "Contactar", "Continuar", "Aceptar", el bloque de countdown de "Ahora".
- **Precio**: nunca en el perfil público; se negocia libremente en el chat, coherente con el modelo de cero comisiones y presupuestos directos.
- **Chips**: dos niveles con roles distintos — chips simples de especialidad (filtran búsqueda) vs. chips detallados de motivo (arman el pedido dentro del formulario). Ambos con salida "Otro" a texto libre.
- **Estados vacíos y de espera**: nunca dejan a la persona sin una acción siguiente clara (agendar, ampliar radio, cancelar).

---

## 5. Chat completo y cierre del servicio

### 5.1 Pantalla de chat
- Header: foto + nombre del otro lado, indicador de comportamiento ("Responde rápido") en vez de "en línea" genérico.
- **Tarjeta de contexto pineada** (colapsada) debajo del header — no es un mensaje más del chat, se puede expandir para ver el pedido completo en cualquier momento.
- Burbujas **sin código de color por rol**: lo que envía el usuario actual va en azul acento a la derecha, lo recibido en blanco/borde a la izquierda — el verde funcional no se usa acá, queda intacto para "Disponible"/"Verificado".
- Sin botones de pago ni de "confirmar contratación" — todo lo que pasa en el chat es coordinación libre entre las partes.

### 5.2 Cierre explícito del servicio
- El **prestador** puede marcar "trabajo terminado" desde el menú del chat → esto no cierra nada, solo dispara una tarjeta de confirmación dentro de la conversación.
- El **cliente** confirma ("Sí, calificar servicio") o dice "Todavía no" — la confirmación de cierre es siempre del lado cliente, porque es la única señal confiable de que el servicio se resolvió (no hay pago in-app que lo marque automáticamente).
- El cliente también puede iniciar el cierre por su cuenta en cualquier momento, sin depender de que el prestador lo proponga.

### 5.3 Pantalla de calificación
- Estrellas obligatorias + **etiquetas rápidas** ("Puntual", "Prolijo", "Buena comunicación", "Precio justo") para bajar la fricción de escribir y generar datos estructurados sobre el prestador.
- Comentario libre opcional.
- "Omitir por ahora" siempre disponible — nunca se fuerza la reseña; si se omite, puede dispararse un recordatorio suave a las 24-48hs.
- Después del cierre, el chat pasa a estado archivado/finalizado (input deshabilitado, banner de "Conversación finalizada").

---

## 6. Notificaciones

**Triggers del lado cliente:** el prestador respondió/aceptó, la solicitud se está reenviando (o se agotaron los intentos), el prestador marcó el trabajo como terminado, recordatorio suave para calificar, nuevo mensaje, recordatorio de un servicio agendado próximo.

**Triggers del lado prestador:** nueva solicitud entrante, aviso de que el conteo regresivo está por vencer, nuevo mensaje, resultado de la validación fiscal, nueva reseña recibida, recordatorio de un servicio agendado para hoy, aviso de vencimiento de suscripción.

**Jerarquía visual:** naranja para lo urgente/accionable ya (nueva solicitud "Ahora", countdown por vencer); verde funcional solo cuando la notificación confirma algo verificado/aprobado (ej. "Situación fiscal aprobada"); gris/neutro para lo informativo sin apuro.

**Agrupación:** por recencia (Hoy / Ayer / Esta semana), no por tipo — prioriza lo más reciente sobre categorías.

**Push con acción rápida integrada:** para una solicitud "Ahora", la notificación del sistema trae dos botones inline, **Aceptar** y **Rechazar**, sin necesidad de abrir la app. Tocar el cuerpo del mensaje (no los botones) sí abre la pantalla completa de la solicitud. Aceptar desde la notificación lleva directo al chat con el contexto pineado, igual que aceptar desde la pantalla completa.

---

## 7. Favoritos (lado cliente)

- El corazón para guardar vive en el perfil del profesional (y potencialmente en la tarjeta del listado, para guardar sin entrar al perfil).
- La pantalla de favoritos muestra a cada profesional guardado con su **estado de disponibilidad actual** (mismo badge verde/gris que en el listado) — el valor real de un favorito es saber a quién se puede llamar *ahora mismo* sin repasar cada perfil.
- **"Contactar directo →"** salta el perfil completo para quien ya es de confianza, yendo directo al flujo de Ahora/Agendado.
- Muestra "usado X veces" en vez de fecha de guardado, reforzando la idea de relación construida en el tiempo.
- Estado vacío con link a "Explorar categorías", nunca una pantalla en blanco.

---

## 8. Calendario del prestador

- Selector semanal de 7 días arriba, con un punto naranja bajo los días que tienen una solicitud urgente ("Ahora") pendiente.
- **Franjas celestes de fondo = disponibilidad base** (los horarios habituales configurados en el perfil); **bloques azules sólidos = turnos ya confirmados** con un cliente — distinción visual intencional entre regla general y compromiso concreto.
- Cada turno confirmado muestra cliente + servicio + zona, y toca directo al chat correspondiente.
- Ícono "+" para bloquear manualmente un horario (feriado, ausencia puntual) sin reconfigurar toda la disponibilidad semanal.
- Las solicitudes "Ahora" no viven en el calendario — no tienen horario fijo, se gestionan desde el flujo de solicitudes entrantes.

---

## 9. Suscripción y pago

- **Plan Profesional — $20.000 ARS/mes.**
- La tarjeta del plan refuerza "Transparencia Radical" en el propio momento de pago: mensaje explícito de "Sin comisión por servicio" repetido acá, no solo en el onboarding.
- Chip verde funcional para el estado **"Activa"** — mismo criterio que "Verificado"/"Disponible": es un estado aprobado/vigente.
- Método de pago editable, historial de pagos con descarga de comprobante (clave para uso fiscal/deducciones del prestador).
- "Pausar o cancelar suscripción" siempre visible al final, sin fricción artificial.
- **Estado "Pago pendiente"** (ámbar, mismo lenguaje que "fiscal en revisión"): período de gracia antes de ocultar al prestador de las búsquedas, para no sacarlo de circulación por una falla de pago técnica, pero sin dejarlo aparecer indefinidamente sin pagar.

---

## 10. Pendiente / próximos bloques a diseñar

_(Ninguno crítico identificado por ahora — los bloques principales de ambos caminos y las pantallas transversales quedan cubiertas. Space para lo que surja: onboarding visual detallado, pantalla de ajustes/cuenta, soporte/ayuda, políticas y términos.)_
