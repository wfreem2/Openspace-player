import { SceneGraphNode } from "../Services/openspace.service";

export interface NavigationState{
    Anchor: SceneGraphNode,
    Position: number[],
    Up: number[],
    Pitch: number,
    Yaw: number
}