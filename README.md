# overtime-kit

Primitivas de UI compartidas por las seis apps de Overtime (Public, Admin, Organizaciones,
dodgeballmanager, Manager y Partido).

Existe porque las seis apps son repos git independientes sin workspaces, así que el kit compartido
se venía propagando **copiando archivos a mano**. Sin un origen único, cada copia absorbió los
arreglos de su app y ninguno de los de las demás: `ui/Modal` llegó a tener 3 versiones distintas
sobre 6 copias, `PartidoCard` 5 sobre 6.

## Instalación

```bash
npm install github:<usuario>/overtime-kit#v0.7.0
```

Se instala por URL de git y no por registry: no hace falta cuenta de npm ni token de auth en
Vercel/Render, y cada app pinea su propio tag, así que una puede quedarse atrás sin romperse.

El `dist/` está versionado a propósito — ver el comentario en `.gitignore`.

### Paso obligatorio: Tailwind

Sin esto los componentes salen **sin estilos y sin ningún error que lo avise**. Tailwind sólo
genera las clases que encuentra escritas en los archivos que escanea, y por defecto no mira dentro
de `node_modules`.

```js
// tailwind.config.js de cada app
const overtimeKit = require('overtime-kit/tailwind-preset');

module.exports = {
  presets: [overtimeKit],
  // OJO: Tailwind reemplaza `content`, no lo fusiona. Hay que expandirlo a mano.
  content: ['./src/**/*.{js,jsx,ts,tsx}', ...overtimeKit.content],
  theme: { extend: { /* lo propio de la app */ } },
  plugins: [/* los de la app */],
};
```

El preset aporta además el breakpoint `boxed` —que `Overlay` usa para decidir cuándo mostrarse a
pantalla completa— y la paleta `brand`, que hasta ahora cada app repetía en su config.

Desde v0.7.0 también fija `darkMode: 'class'`: el modo oscuro sólo se activa si la app pone la
clase `dark` en `<html>`, nunca por el tema del sistema operativo.

### Paso obligatorio (v0.7.0+): base.css

```ts
// src/index.tsx de cada app, antes que el CSS propio
import 'overtime-kit/base.css';
```

Carga Inter y fija fondo y color de texto base. Sin esto cada app cae a la fuente del sistema
operativo y se ve distinta según el dispositivo.

### Convención de color

Los componentes del kit usan `slate` para grises y `brand` para el acento. No usar `gray` ni
`blue`/`indigo` en código nuevo de las apps: son la causa de que las apps "no se vieran iguales".

## Qué hay

### `Overlay` — la primitiva de capa

Reemplaza a `ui/Modal`, `ModalBase`, `ConfirmModal` y a los 27 overlays `fixed inset-0` escritos a
mano. Cuatro presentaciones, todas con portal, trampa de foco, Escape, bloqueo de scroll y apilado
de z-index:

| `presentacion`  | para qué |
|---|---|
| `modal`         | diálogo centrado. El caso general. |
| `panel`         | panel lateral. Gestión larga sin perder de vista el listado de atrás. |
| `hoja`          | hoja inferior. La forma correcta en teléfono. |
| `confirmacion`  | diálogo chico, sin X: la salida son los botones del pie. |

```tsx
import { Overlay } from 'overtime-kit';

<Overlay
  isOpen={abierto}
  onClose={cerrar}
  presentacion="panel"
  title="Plantilla · Freestyle"
  subtitle="11 jugadores inscriptos"
  footer={<button onClick={guardar}>Guardar</button>}
>
  {contenido}
</Overlay>
```

`Overlay` junta arreglos que estaban repartidos y ninguna app tenía todos:

- **Apilado de z-index** (venía de Public) — un modal abierto desde otro ya no queda por debajo.
- **Escape sólo en la capa de arriba** (dodgeballmanager) — antes cancelar una confirmación cerraba
  también la pantalla de atrás.
- **Scroll del body liberado recién al cerrar la última capa** (dodgeballmanager).
- **Pantalla completa en mobile con área segura y alturas en `dvh`** (dodgeballmanager) — incluye el
  caso del celular en horizontal, que por ancho parece escritorio y por alto no lo es.
- **Botón de cerrar de 44px** (dodgeballmanager), el mínimo táctil.
- **Pie que no scrollea**, para que "Guardar" no quede a varias pantallas de distancia.

### Puentes de compatibilidad

`Modal`, `ModalBase` y `ConfirmModal` tienen **exactamente la misma API** que las copias que hoy
viven en cada app, implementados sobre `Overlay`. Migrar una pantalla es cambiar el import, o
directamente convertir el archivo local en un re-export:

```ts
// src/shared/components/ModalBase/ModalBase.tsx
export { ModalBase as default } from 'overtime-kit';
export type { ModalBaseProps } from 'overtime-kit';
```

Así ninguna de las pantallas que lo importan necesita tocarse. Están marcados `@deprecated`: son un
puente, no el destino.

### Controles

`Button`, `Badge`, `Input`, `Select`, `Textarea`, `Toggle`, `Card`, `Table`, `Spinner`,
`EmptyState`, `ErrorMessage`. Estos ya estaban **idénticos byte a byte** en las cinco apps que los
tenían: acá sólo dejan de estar duplicados.

### `Tabs` — pestañas

Reemplaza las tiras de pestañas escritas a mano (había en 5 de las 6 apps, y sólo una tenía
`role="tab"`). Trae el patrón de teclado de WAI-ARIA: ← → recorren, Home/End van a los extremos,
Tab entra a la pestaña activa y sale.

**Es controlado a propósito**: no decide dónde vive la pestaña activa. En una página va en la URL,
para que se pueda linkear, recargar y volver con "atrás". Adentro de un modal es estado local.

```tsx
import { Tabs, TabPanel } from 'overtime-kit';

// Página: la pestaña en ?tab=
const tab = searchParams.get('tab') ?? 'estructura';
<Tabs
  aria-label="Secciones de la competencia"
  idBase="competencia"
  items={[{ id: 'general', label: 'General' }, { id: 'estructura', label: 'Temporadas/Fases' }]}
  value={tab}
  onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
/>
{tab === 'general' && <TabPanel idBase="competencia" id="general">…</TabPanel>}

// Modal o toggle de vista: estado local
<Tabs aria-label="Vista" variante="segmentado" size="sm" items={vistas} value={vista} onChange={setVista} />
```

| `variante`   | para qué |
|---|---|
| `pildora`    | navegación de página. Por defecto. |
| `segmentado` | pocas opciones que se reparten el ancho, o alternar vistas (Lista / Calendario). |
| `subrayado`  | listados densos, estilo panel de admin. |

`TabPanel` es opcional: solo conecta el panel con su pestaña para el lector de pantalla
(`aria-controls` / `aria-labelledby`). Se renderiza solo el de la pestaña activa.

## Desarrollo

```bash
npm install
npm run typecheck
npm run build      # compila dist/cjs + dist/esm
```

El build es dual a propósito. `dist/esm` es lo que webpack usa para hacer tree-shaking: con sólo
CommonJS, una app que únicamente usa `Modal` se llevaba igual todo el kit —incluido `@heroicons`
por culpa de `ErrorMessage`— y eran 92 kB gzip de más. Con ESM + `sideEffects: false`, el costo
medido de adoptar el kit en Overtime-Partido fue **+0,9 kB de JS y +1,3 kB de CSS**.

`dist/cjs` queda para Jest, que en react-scripts no transpila `node_modules`.

### Publicar una versión

```bash
npm run build
git add -A && git commit -m "..."
git tag v0.2.0 && git push origin main --tags
```

El `dist/` va commiteado, así que **acordate de correr `npm run build` antes de taguear**: npm no
compila nada al clonar un repo sin script `prepare`, y un tag con el dist viejo se instala sin
error y sirve código viejo.

Después, en cada app: `npm install github:<usuario>/overtime-kit#v0.2.0`.
