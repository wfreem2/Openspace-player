import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from 'src/app/Services/openspace.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isConnected!: boolean

  constructor(openSpaceService: OpenspaceService) { 
    
    openSpaceService._isConnected.subscribe(status =>{
      this.isConnected = status
    })
  }

  ngOnInit(): void {
  }

}
