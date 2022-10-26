import { PathNavigationOptions } from "../Services/openspace.service";
import { GeoPosition } from "./GeoPosition";

export interface Scene{
    id: number,
    title: string,
    geoPos: GeoPosition,
    nodeName?: PathNavigationOptions,
    travelMethod: 'pathNav' | 'flyTo'
}