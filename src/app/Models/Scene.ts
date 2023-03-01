import { GeoPosition } from "./GeoPosition";
import { NavigationState } from "./NavigationState";
import { SceneOptions } from "./SceneOptions";

export interface Scene{
    id: number,
    title: string,
    geoPos: GeoPosition,
    options: SceneOptions,
    navState?: NavigationState,
    script?: string,
    duration?: number,
    time?: any
}