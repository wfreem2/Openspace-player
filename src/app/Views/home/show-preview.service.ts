import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Show } from '../../Models/Show';

@Injectable({
  providedIn: 'root'
})

export class ShowPreviewService { 

  private _currentShow = new Subject<Show>()

  constructor() { }

  previewShow(show: Show){
    this._currentShow.next(show)
  }

  currentShow(): Observable<Show>{
    return this._currentShow.asObservable()
  }

}
