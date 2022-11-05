import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, delay, Observable, of, Subject } from 'rxjs';
import { ToastNotifcation } from '../Interfaces/ToastNotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private $notifications = new Subject<ToastNotifcation>()
  private $queue = new BehaviorSubject<ToastNotifcation[]>([])
  private readonly LIFETIME = 5000
  
  private $toRemove = new Subject<ToastNotifcation>()

  private id = 0

  constructor() { 
    //Add to queue
    this.$notifications
    .pipe(
      concatMap( (value, index) =>{
        return of(value).pipe(delay(this.$queue.value.length * this.LIFETIME))
      })
    )
    .subscribe(n => {
      this.$toRemove.next(n)

      const queue = this.$queue.value
      queue.push(n)

      this.$queue.next(queue)
      console.log('adding', queue)
    })

    //Remove from queue
    this.$toRemove
    .pipe(
      concatMap( (value, index) =>{
        return of(value).pipe(delay(this.$queue.value.length+1 * this.LIFETIME))
      })
    )
    .subscribe(n => {
      let queue = this.$queue.value
      queue = queue.filter(t => t !== n)

      this.$queue.next(queue)

      console.log( 'removing', queue)
    })
  }


  showNotification(notification: ToastNotifcation): void{
    this.id++
    notification.id = this.id

    this.$notifications.next(notification)
  }

  get notifications(): Observable<ToastNotifcation[]>{
    return this.$queue.asObservable()
  }

  removeNotification(notification: ToastNotifcation): void{
    let queue = this.$queue.value
      queue = queue.filter(t => t !== notification)

    this.$queue.next(queue)
  }

  
}





/* 

  [n1, n2, n3,....]

*/