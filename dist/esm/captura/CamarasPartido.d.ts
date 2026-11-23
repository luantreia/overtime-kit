import React from 'react';
import type { ApiCaptura } from './api';
import { type VideoPartido } from './reloj';
/**
 * Las cámaras (videos) de un partido: agregar otra, alinearla, sacarla.
 *
 * Alinear = decir el mismo momento en las dos: "el silbato del set 1 está en 3:12 de la
 * principal y en 0:41 de esta". De ahí sale d (segundo de partido = segundo de cámara + d).
 * Un d por cámara alcanza para videos sin cortes; los relojes con tramos (cortes, reanudaciones)
 * llegan desde el panel de análisis.
 */
export interface CamarasPartidoProps {
    api: ApiCaptura;
    /** Dónde se guardan: las cámaras del partido... */
    partidoId?: string;
    /** ...o las propias de una planilla (no toca el partido). Uno de los dos. */
    planillaId?: string;
    videos: VideoPartido[];
    onGuardado?: (videos: VideoPartido[]) => void;
    soloLectura?: boolean;
}
declare const CamarasPartido: React.FC<CamarasPartidoProps>;
export default CamarasPartido;
//# sourceMappingURL=CamarasPartido.d.ts.map