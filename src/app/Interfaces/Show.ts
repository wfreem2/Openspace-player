import { Scene } from "./Scene";

export interface Show{
    id: number,
    name: string,
    scenes: Scene[],
    dateCreated: Date
}