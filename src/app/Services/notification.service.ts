import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, delay, Observable, of, Subject } from 'rxjs';
import { ToastNotifcation as ToastNotification } from '../Models/ToastNotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private id = 0
  private _queue: ToastNotification[] = []
  private $queue = new BehaviorSubject<ToastNotification[]>([])
  
  private readonly LIFETIME = 5000

  constructor() { }


  showNotification(notification: ToastNotification): void{
    this.id++
    notification.id = this.id

    this._queue.push(notification)
    
    //Immediately show
    if(!this.$queue.value.length){
      this.$queue.next([notification])
      setTimeout( () => this.removeNotification(notification), this.LIFETIME * this._queue.length)
    }
  }

  get notifications(): Observable<ToastNotification[]>{
    return this.$queue.asObservable()
  }

  removeNotification(notification: ToastNotification): void{
    
    const existing = this._queue.find(n => n === notification)

    if(!existing){ return }
    
    this._queue = this._queue.filter(n => n !== notification)

    if(this._queue.length){
      //Immediately show notification if any
      this.checkQueue()
    }
    else{ this.$queue.next([]) }
  } 

  private checkQueue(): void{

    if(this._queue.length){
      const noti = this._queue[0]
      this.$queue.next([noti])
      
      setTimeout( () => this.removeNotification(noti), this.LIFETIME)
    }
  } 
  
  
}