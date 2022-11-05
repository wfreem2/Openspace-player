import { GeoPosition } from "./GeoPosition";
import { NavigationState } from "./NavigationState";
import { SceneOptions } from "./SceneOptions";

export interface Scene{
    id: number,
    title: string,
    script?: string
    geoPos: GeoPosition,
    sceneOptions?: SceneOptions,
    navState?: NavigationState
}