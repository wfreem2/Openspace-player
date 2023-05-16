import { SceneGraphNode } from "../Services/openspace.service";
import { NavigationState } from "./NavigationState";

export interface GeoPosition{
    lat: number,
    long: number,
    alt: number,
    node: SceneGraphNode, 
    timestamp: string
    navState?: NavigationState
}