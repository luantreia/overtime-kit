import React from 'react';
import type { ApiCaptura, GanadorSet, RefSet, TiempoSet } from './api';
import { type VideoPartido } from './reloj';
/**
 * El partido entero sobre el video, como la pestaña Partido del panel de análisis: una línea de
 * tiempo con todos los sets, y para cada uno cuándo empieza, cuándo termina y quién lo ganó.
 * Es el primer paso; los jugadores y las marcas de cada set van después, set por set
 * (`CapturaSet`).
 *
 * No sabe de dónde salen los sets: la app le pasa la lista y cómo crear uno (en una planilla es
 * POST /planillas-equipo/:id/sets; en un partido oficial, /set-partido). Tiempo y ganador se
 * guardan por /api/eventos-set, igual para los dos.
 */
export interface SetDelPartido {
    id: string;
    numeroSet: number;
    ganadorSet: GanadorSet;
    tiempo?: TiempoSet | null;
}
export interface PartidoCompletoProps {
    api: ApiCaptura;
    /** Cámaras con las que se mira el partido. Vacío = no hay video (no se puede marcar tiempo). */
    videos: VideoPartido[];
    /** Dónde se guardan las cámaras si se agregan desde acá. Uno de los dos. */
    destinoCamaras: {
        planillaId: string;
    } | {
        partidoId: string;
    };
    onVideos?: (videos: VideoPartido[]) => void;
    equipos: {
        local: {
            id: string;
            nombre: string;
        };
        visitante: {
            id: string;
            nombre: string;
        };
    };
    sets: SetDelPartido[];
    /** El RefSet de un set de esta lista (planillaSet o setPartido). */
    refDe: (setId: string) => RefSet;
    /** Crea el set N y devuelve su id. */
    crearSet: (numeroSet: number) => Promise<string>;
    /** Después de cualquier cambio: la app recarga `sets`. */
    onCambio: () => void | Promise<void>;
    soloLectura?: boolean;
    className?: string;
}
declare const PartidoCompleto: React.FC<PartidoCompletoProps>;
export default PartidoCompleto;
//# sourceMappingURL=PartidoCompleto.d.ts.map