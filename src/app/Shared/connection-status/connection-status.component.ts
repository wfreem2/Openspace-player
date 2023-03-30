import { Component, OnInit } from '@angular/core';
import { tap, BehaviorSubject, takeUntil, startWith, map, Observable, catchError, of } from 'rxjs';
import { OpenspaceService } from 'src/app/Services/openspace.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})

export class ConnectionStatusComponent extends BaseComponent implements OnInit {

  readonly $loadingState: Observable<LoadingState> = this.openspaceService.isConnected()
  .pipe(
    map( isConnected => { return { isLoading: false, isConnected: isConnected } }),
    startWith({ isLoading: true, isConnected: false }),
    takeUntil(this.$unsub),
    catchError( () => of({ isLoading: false, isConnected: false }) )
  )

  constructor(private openspaceService: OpenspaceService) { 
    super() 
  }

  ngOnInit(): void { }

}


export type LoadingState = {
  isLoading: boolean,
  isConnected: boolean
}