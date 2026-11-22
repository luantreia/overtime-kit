/**
 * Preset de Tailwind del kit.
 *
 * Hace falta por dos motivos, y ninguno es opcional:
 *
 * 1. `content` tiene que incluir el `dist` del kit. Tailwind genera únicamente las clases que
 *    encuentra escritas en los archivos que escanea; si no mira dentro de node_modules, las
 *    clases de `Overlay`, `Button` y compañía no llegan al CSS final y los componentes salen
 *    sin estilo, sin ningún error que lo avise.
 *
 * 2. El breakpoint `boxed` sólo existía en dodgeballmanager. `Overlay` lo usa para decidir
 *    cuándo mostrarse como diálogo centrado y cuándo a pantalla completa. Si la app no lo
 *    define, esas variantes se ignoran y el modal queda a pantalla completa siempre.
 *
 * Uso, en el tailwind.config.js de cada app:
 *
 *   const overtimeKit = require('overtime-kit/tailwind-preset');
 *   module.exports = {
 *     presets: [overtimeKit],
 *     content: ['./src/(asterisco)(asterisco)/(asterisco).{js,jsx,ts,tsx}', ...overtimeKit.content],
 *     theme: { extend: { ... lo propio de la app ... } },
 *   };
 *
 * El `content` del preset NO se hereda solo: Tailwind reemplaza `content`, no lo fusiona. Por eso
 * hay que expandirlo a mano como en el ejemplo.
 */
module.exports = {
  content: ['./node_modules/overtime-kit/dist/**/*.{js,mjs}'],
  theme: {
    extend: {
      screens: {
        /**
         * "Hay lugar para un diálogo con márgenes alrededor". Exige ancho Y alto de sobra a la
         * vez, no sólo ancho: un celular en horizontal supera los 640px de ancho con 350-450px
         * de alto, y tratarlo como escritorio significa mostrar un diálogo centrado con
         * márgenes, regalando altura justo cuando menos sobra.
         */
        boxed: { raw: '(min-width: 640px) and (min-height: 500px)' },
      },
      /**
       * La paleta `brand` que las seis apps ya definen idéntica. Va en el preset para que una app
       * nueva la herede sola; las que ya la tienen en su propio `extend` la pisan con el mismo
       * valor y no cambia nada.
       */
      /**
       * Tamaño mínimo para texto con contenido. Las etiquetas en mayúsculas de 8-10px (`text-[10px]`)
       * eran un estilo repetido en todas las apps y no se leen en un celular al sol. 11px conserva
       * el look de etiqueta; por debajo de esto, sólo decoración.
       */
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px' }],
      },
      colors: {
        /**
         * Gris para texto secundario sobre fondo claro. Es slate-500: 4,8:1 sobre blanco y 4,6:1
         * sobre slate-50, así que pasa AA (4,5:1). Sobre slate-100 o más oscuro ya no alcanza (4,3:1):
         * ahí usar slate-600. `text-slate-400` (2,6:1) y `slate-300` (1,5:1) NO pasan sobre fondo
         * claro: dejarlos sólo para fondos oscuros (slate-800/900), donde sí funcionan, o para
         * íconos puramente decorativos.
         */
        muted: '#64748b',
        brand: {
          50: '#f5f7ff',
          100: '#ebefff',
          200: '#d6deff',
          300: '#b0bfff',
          400: '#7a90ff',
          500: '#3b5dff',
          600: '#2b45db',
          700: '#2135ab',
          800: '#1f3188',
          900: '#1f2c6d',
        },
      },
    },
  },
};
