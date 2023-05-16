import { GeoPosition } from "./GeoPosition";
import { SceneOptions } from "./SceneOptions";

export interface Scene{
    id: number,
    title: string,
    geoPos: GeoPosition,
    options: SceneOptions,
    script: string | null,
    transistion: number | null,
}