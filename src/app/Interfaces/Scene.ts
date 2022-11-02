import { PathNavigationOptions } from "../Services/openspace.service";
import { GeoPosition } from "./GeoPosition";
import { SceneOptions } from "./SceneOptions";

export interface Scene{
    id: number,
    title: string,
    geoPos: GeoPosition,
    nodeName?: PathNavigationOptions,
    sceneOptions?: SceneOptions
}