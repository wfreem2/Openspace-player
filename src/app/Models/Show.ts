import { Scene } from "./Scene";

export interface Show{
    id: number,
    title: string,
    scenes: Scene[],
    dateCreated: Date,
    isStarred: boolean
}