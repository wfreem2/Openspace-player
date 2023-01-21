import { Observable } from "rxjs";

export interface CreatorSubMenuItem{
    name: string,
    hotKey: string[],
    callBack(): any,
    isDisabled: Observable<boolean> | boolean
}

export interface CreatorMenuItem{
    name: string,
    subMenus: CreatorSubMenuItem[],
}