import { Component, OnInit } from '@angular/core';
import { tap, BehaviorSubject, startWith } from 'rxjs';
import { OpenspaceService } from 'src/app/Services/openspace.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})

export class ConnectionStatusComponent extends BaseComponent implements OnInit {

  public $loading = new BehaviorSubject<boolean>(true)

  public $isConnected = this.openspaceService.isConnected()
  .pipe( 
    tap( () => { 
      console.log('done');
      
      this.$loading.next(false) 
      this.$loading.complete()
    })
  )


  constructor(private openspaceService: OpenspaceService) { 
    super() 
  }

  ngOnInit(): void { }

}
