import { GeoPosition } from "./GeoPosition";
import { SceneOptions } from "./SceneOptions";

export interface Scene{
    id: number,
    title: string,
    script?: string
    geoPos: GeoPosition,
    sceneOptions?: SceneOptions,
}