import { Scene } from "./Scene";

export interface SceneIssue{
    scene: Scene,
    issues: {
        control: string,
        errorMsg: string,
        severityLevel: IssueServerity
    }[]
}

export enum IssueServerity{
    WARNING="Warning",
    ERROR="Error"
}