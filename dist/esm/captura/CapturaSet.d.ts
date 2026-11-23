import React from 'react';
import type { ApiCaptura, EstadoSet, RefSet } from './api';
/**
 * Captura de un set "como en el panel de análisis": cuándo empieza y termina, quiénes arrancan,
 * y cada out (motivo, quién lo sacó) o reingreso, con la línea de vivos del set.
 *
 * El tiempo sale del video (`obtenerTiempo`, normalmente `ReproductorPartido`) o, sin video, de
 * un cronómetro propio del set. Igual para un set oficial o el de una planilla (`refSet`).
 */
export interface EquipoCaptura {
    id: string;
    nombre: string;
}
export interface JugadorCaptura {
    id: string;
    nombre: string;
    numero?: number | null;
    equipo: string;
}
export interface CapturaSetProps {
    api: ApiCaptura;
    refSet: RefSet;
    equipos: EquipoCaptura[];
    /** Candidatos (presentes del partido o de la planilla), de los dos equipos. */
    jugadores: JugadorCaptura[];
    /** Segundo de partido actual del video. Sin esto, se usa un cronómetro. */
    obtenerTiempo?: () => number | null;
    /** Llevar el video a un segundo de partido (al tocar una marca). */
    irA?: (segPartido: number) => void;
    soloLectura?: boolean;
    /** Se llama después de cada cambio guardado (p. ej. para refrescar estadísticas). */
    onCambio?: (estado: EstadoSet) => void;
    className?: string;
}
declare const CapturaSet: React.FC<CapturaSetProps>;
export default CapturaSet;
//# sourceMappingURL=CapturaSet.d.ts.map