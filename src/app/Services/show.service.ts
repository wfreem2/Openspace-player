import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { Show } from '../Interfaces/Show';

@Injectable({
  providedIn: 'root'
})

export class ShowService {

  private id: number = 0
  private _shows = new BehaviorSubject<Show[]>([])

  constructor() {
    if(document.cookie){
      console.log('loading saved show')
      
      try {
        const { shows }  = JSON.parse(document.cookie)
        this._shows.next(shows)
      } 
      catch (error) { console.log('error parsing cookie')  }

    }
  }

  getBlankShow(): Show{
    this.id++
    
    return {
      id: this.id,
      title: '',
      scenes: [],
      dateCreated: new Date()
    }
  }

  addShow(show: Show){
    this._shows.value.push(show)
    this._shows.next(this._shows.value)
  }

  removeShowById(id: number){
    this._shows.next(this._shows.value.filter(s => s.id !== id))
  }

  getAllShows(): Observable<Show[]>{
    return this._shows.asObservable()
  }
  
  getShowById(id: number): Show | undefined{
    return this._shows.value.find(s => s.id === id)
  }

  save(show: Show): void{
    const existing = this._shows.value.find(s => s.id === show.id)

    if(!existing){ 
      this.addShow(show);
      return 
    }

    merge(existing, show)

    
    document.cookie = JSON.stringify({shows: this._shows.value})
    document.cookie += ';path=/'
  }

}
