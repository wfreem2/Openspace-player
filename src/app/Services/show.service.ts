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
    if(localStorage.getItem('shows')){
      console.log('loading saved show')
      
      try {        
        const shows = JSON.parse(localStorage.getItem('shows')!)
        this._shows.next(shows)
        this.id = this.findUniqueId()
      } 
      catch (error) { console.log('error parsing cookie')  }

    }
  }

  
  getBlankShow(): Show{
    //Ensure unique ids
    this.id = this.findUniqueId()

    return {
      id: this.id,
      title: '',
      scenes: [],
      dateCreated: new Date()
    }
  }

  addShow(show: Show){
    
    if(this._shows.value.some(s => s.id === show.id)){
      //Ensure unique id
      this.id = this.findUniqueId()
    }


    this._shows.value.push(show)
    this._shows.next(this._shows.value)
  }

  removeShowById(id: number){
    this._shows.next(this._shows.value.filter(s => s.id !== id))
    this.saveShow()
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

    this.saveShow()
  }

  private findUniqueId(): number{
    const shows = this._shows.value
    return shows.reduce((id, s) => Math.max(id, s.id), shows[0].id) + 1
  }

  private saveShow(): void{
    localStorage.setItem('shows', JSON.stringify(this._shows.value))
  }
}
