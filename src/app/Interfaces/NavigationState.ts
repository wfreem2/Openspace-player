import { SceneGraphNode } from "../Services/openspace.service";

export interface NavigationState{
    anchor: SceneGraphNode,
    position: number[],
    up: number[]
}