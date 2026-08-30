# ProMatch — Reglas de diseño del deck (derivadas de las 3 slides base)

Complementa `promatch-brand-brief.md` (paleta, tipografía y reglas de contraste ya definidas ahí). Este doc cubre las reglas específicas de las slides: jerarquía de uso del color, layout, el anillo, y el componente de pills. Guía visual completa (con specimens de color/tipografía/componentes): ver el artifact "ProMatch Deck System" publicado en esta sesión.

## Slides analizadas
1. **Índice** (divisoria): panel cream + caja de color, anillo verde lima.
2. **Quienes somos** (contenido): fondo navy, título azul acento, texto + mockup de celular.
3. **Porque elegirnos** (contenido): fondo navy, anillo naranja, pills en tablero de ajedrez azul/cream.

## Jerarquía de uso del color (definida por Natalia)
Tres niveles, cada uno con su propio subconjunto de la paleta — no se mezclan:

- **Fondos** (lienzo completo de la slide): solo dos colores — navy principal `#052c7c` y cream `#fffbf7`. Nada de teal ni de otros colores como fondo de slide.
- **Cajas** (paneles/bloques contenidos dentro de una slide, como el panel de color del índice): entran los verdes. Recomendación: verde lima `#89dd7f` para cajas decorativas — el verde funcional `#56c689` mejor reservarlo para credenciales de "verificado"/"disponible ahora", salvo que una caja puntual quiera comunicar confianza a propósito.
- **Detalles** (anillo, íconos, mini acentos): naranja `#ec5e28`. Nunca como relleno grande de fondo o caja.

Esto resuelve el teal de la slide de índice: ese panel deja de ser un "fondo" nuevo y pasa a ser una **caja verde**, dentro de la regla de fondos de solo navy + cream.

## Convención de mayúscula/minúscula (pendiente de decidir)
"índice" y "porque elegirnos" van en minúscula sostenida; "Quienes somos" va con mayúscula inicial. Recomendación: minúscula sostenida en todos los títulos de sección. Reservar mayúscula para nombres propios como ProMatch.

## El anillo (motivo recurrente)
- Siempre ancla a un borde o esquina y queda parcialmente cortado por el marco de la slide — nunca centrado ni completo.
- Un solo anillo por slide.
- Color: sobre un fondo (navy o cream) el anillo es un "detalle" → naranja, o tono sobre tono para algo más sutil. Sobre una caja verde, puede ir en otro tono de verde.

## Pills
- Forma píldora completa, texto en la fuente redondeada, peso bold.
- Alternancia estricta: relleno azul acento (`#327af3`) + texto blanco, o relleno cream (`#fffbf7`) + texto navy.
- El verde funcional (`#56c689`) reservado para "verificado" — no como relleno decorativo de pill.

## Dos plantillas de layout
- **Divisoria**: panel cream + caja verde (no un fondo nuevo), para portada, índice y cierres de bloque. Un solo anillo en la caja.
- **Contenido**: fondo navy completo, título + texto o pills, imagen/mockup opcional a la derecha. Un anillo (detalle, naranja) sangrando por un borde.

## Checklist antes de armar una slide nueva
1. ¿El fondo de la slide es navy principal o cream — nada más?
2. Si hay una caja dentro de la slide, ¿el verde es lima salvo que quieras señalar "verificado" a propósito?
3. ¿El naranja aparece solo en detalles chicos, nunca como relleno grande?
4. ¿El texto respeta la tabla de contraste (blanco sobre oscuros, navy sobre claros)?
5. ¿El título usa la fuente redondeada y la misma convención de minúscula que el resto?
6. ¿Hay un solo anillo, sangrando por un borde?
7. ¿La slide encaja en "divisoria" o "contenido" — no una tercera composición suelta?
