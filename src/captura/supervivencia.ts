/**
 * Supervivencia: quién está en cancha en cada momento de un set, a partir de las marcas.
 * Misma lógica que el backend (`overtime/src/utils/supervivencia.js`, con tests) y que el panel
 * de análisis. Si cambia una, cambian las tres.
 */
export type TipoEvento = 'out' | 'reingreso' | 'cambio';
export type MotivoOut = 'hit' | 'catch' | 'linea' | 'otro';

export const MOTIVOS: { id: MotivoOut; label: string; atajo: string }[] = [
  { id: 'hit', label: 'Hit', atajo: 'H' },
  { id: 'catch', label: 'Catch', atajo: 'C' },
  { id: 'linea', label: 'Línea', atajo: 'L' },
  { id: 'otro', label: 'Otro', atajo: 'O' },
];

export interface Evento {
  _id?: string;
  t: number;
  tipo: TipoEvento;
  jugador: string;
  equipo: string;
  motivo?: MotivoOut | null;
  por?: string | null;
  entra?: string | null;
}

export interface JugadorAlineado {
  id: string;
  /** id del equipo */
  lado: string;
}

export interface FilaVivo extends JugadorAlineado {
  entra?: boolean;
  /** [desde, hasta|null] en segundos */
  tramos: [number, number | null][];
}

export function lineaDeTiempo(jugadores: JugadorAlineado[], eventos: Evento[], inicio = 0): FilaVivo[] {
  const filas = new Map<string, FilaVivo>(jugadores.map((j) => [j.id, { ...j, tramos: [[inicio, null]] }]));
  for (const e of [...eventos].sort((a, b) => a.t - b.t)) {
    const f = filas.get(e.jugador);
    if (!f) continue;
    const ultimo = f.tramos[f.tramos.length - 1];
    const abierto = ultimo !== undefined && ultimo[1] == null;
    if ((e.tipo === 'out' || e.tipo === 'cambio') && abierto) ultimo[1] = e.t;
    if (e.tipo === 'reingreso' && !abierto) f.tramos.push([e.t, null]);
    if (e.tipo === 'cambio' && e.entra) {
      const ya = filas.get(e.entra);
      if (ya) ya.tramos.push([e.t, null]);
      else filas.set(e.entra, { id: e.entra, lado: f.lado, entra: true, tramos: [[e.t, null]] });
    }
  }
  return Array.from(filas.values());
}

export const estaVivo = (f: FilaVivo, t: number) => f.tramos.some(([a, b]) => t >= a - 1e-6 && (b == null || t < b));

export function vivosPorLado(filas: FilaVivo[], t: number): Record<string, number> {
  const n: Record<string, number> = {};
  for (const f of filas) n[f.lado] = (n[f.lado] ?? 0) + (estaVivo(f, t) ? 1 : 0);
  return n;
}

/** Tras un catch de `lado` en t: quién debería volver (el primero que salió y sigue afuera). */
export function sugerirReingreso(filas: FilaVivo[], lado: string, t: number): string | null {
  let mejor: string | null = null;
  let mt = Infinity;
  for (const f of filas) {
    if (f.lado !== lado || estaVivo(f, t + 1e-3)) continue;
    const salida = f.tramos.filter(([, b]) => b != null && b <= t + 1e-3).pop();
    if (salida && (salida[1] as number) < mt) {
      mt = salida[1] as number;
      mejor = f.id;
    }
  }
  return mejor;
}
