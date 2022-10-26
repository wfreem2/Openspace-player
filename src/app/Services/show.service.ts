import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { Show } from '../Interfaces/Show';
import Cookies from 'js-cookie'

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
        const shows = JSON.parse(Cookies.get('shows'))
        this._shows.next(shows)
        this.id = shows.length
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
    this.saveCookie()
  }

  getAllShows(): Observable<Show[]>{
    return this._shows.asObservable()
  }
  
  getShowById(id: number): Show | undefined{
    return this._shows.value.find(s => s.id === id)
  }

  save(show: Show): void{
    const existing = this._shows.value.find(s => s.id === show.id)

    if(!existing){ this.addShow(show); }
    else{ merge(existing, show) }

    console.log(show)

    this.saveCookie()
  }


  private saveCookie(): void{
    const exp = new Date()
          exp.setFullYear(3000)

    Cookies.set('shows', JSON.stringify(this._shows.value))
    Cookies.set('path', '/')
    Cookies.set('expires', exp.toUTCString())
  }
}
