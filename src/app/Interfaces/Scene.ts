import { GeoPosition } from "./GeoPosition";

export interface Scene{
    id: number,
    title: string,
    nodeName?: string
    geoPos: GeoPosition,
    travelMethod: 'pathNav' | 'flyTo'
}