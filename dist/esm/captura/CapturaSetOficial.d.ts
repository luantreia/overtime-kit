import React from 'react';
import type { ApiCaptura, Fetcher } from './api';
/**
 * Captura con video de un set OFICIAL (SetPartido), lista para montar en un modal: carga el
 * partido y su convocatoria (JugadorPartido) y arma reproductor + cámaras + captura.
 * La usan Manager y Organizaciones desde "Gestionar sets". Para el set de una planilla, cada app
 * arma lo suyo con `CapturaSet` (los jugadores salen de los presentes de la planilla).
 *
 * `obtenerTiempo` reemplaza al video como reloj (Overtime-Partido: el reloj en vivo).
 */
export interface CapturaSetOficialProps {
    api: ApiCaptura;
    fetcher: Fetcher;
    partidoId: string;
    setPartidoId: string;
    soloLectura?: boolean;
    obtenerTiempo?: () => number | null;
    /** 'en_vivo' cuando el reloj es el del partido en curso. */
    origen?: 'manual' | 'en_vivo';
    onCambio?: () => void;
}
declare const CapturaSetOficial: React.FC<CapturaSetOficialProps>;
export default CapturaSetOficial;
//# sourceMappingURL=CapturaSetOficial.d.ts.map