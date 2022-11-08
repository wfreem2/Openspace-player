import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, delay, Observable, of, Subject } from 'rxjs';
import { ToastNotifcation as ToastNotification } from '../Interfaces/ToastNotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private $queue = new BehaviorSubject<ToastNotification[]>([])
  private readonly LIFETIME = 5000
  
  private queue: ToastNotification[] = []


  private id = 0

  constructor() { }


  showNotification(notification: ToastNotification): void{
    this.id++
    notification.id = this.id

    this.queue.push(notification)
    
    //Immediately show
    if(!this.$queue.value.length){
      this.$queue.next([notification])
      setTimeout( () => this.removeNotification(notification), this.LIFETIME * this.queue.length)
    }
  }

  get notifications(): Observable<ToastNotification[]>{
    return this.$queue.asObservable()
  }

  removeNotification(notification: ToastNotification): void{
    
    const existing = this.queue.find(n => n === notification)

    if(!existing){ return }
    
    this.queue = this.queue.filter(n => n !== notification)

    if(this.queue.length){
      //Immediately show notification if any
      this.checkQueue()
    }
    else{ this.$queue.next([]) }
  } 

  private checkQueue(): void{

    if(this.queue.length){
      const noti = this.queue[0]
      this.$queue.next([noti])
      
      setTimeout( () => this.removeNotification(noti), this.LIFETIME)
    }
  } 
  
  
}