import { SceneGraphNode } from "../Services/openspace.service";

export interface GeoPosition{
    lat: number,
    long: number,
    alt: number,
    nodeName: SceneGraphNode
}