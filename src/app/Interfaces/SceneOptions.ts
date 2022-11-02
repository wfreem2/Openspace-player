import { Trail } from "../Services/openspace.service";

export interface SceneOptions{
    keepRoll: boolean,
    keepRotation: boolean,
    keepZoom: boolean,
    enabledTrails: Trail[],
}