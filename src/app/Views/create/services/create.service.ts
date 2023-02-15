import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { Scene } from 'src/app/Models/Scene';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  private readonly _sceneUpdate$ = new Subject<Scene>()
  private readonly _currScene$ = new BehaviorSubject<Scene | null>(null)
  private readonly _isSaveDisabled$ = new BehaviorSubject<boolean>(false)
  private readonly _isConfirmShowing$ = new BehaviorSubject<boolean>(false)

  constructor() { }

  public updateCurrentScene(scene: Scene){
    this._sceneUpdate$.next(scene)
  }

  public setCurrentScene(scene: Scene | null){
    this._currScene$.next(scene)
  }

  public setIsSaveDisabled(value: boolean){
    this._isSaveDisabled$.next(value)
  }

  public setIsConfirmShowing(value: boolean){
    this._isConfirmShowing$.next(value)
  }

  public get currScene$(): Observable<Scene | null>{
    return this._currScene$.asObservable()
  }

  public get isSaveDisabled$(): Observable<boolean>{
    return this._isSaveDisabled$.asObservable().pipe( distinctUntilChanged() )
  }

  public get isConfirmShowing$(): Observable<boolean>{
    return this._isConfirmShowing$.asObservable().pipe( distinctUntilChanged() )
  }

  public get currSceneUpdated(): Observable<Scene>{
    return this._sceneUpdate$.asObservable().pipe( distinctUntilChanged() )
  }
}
