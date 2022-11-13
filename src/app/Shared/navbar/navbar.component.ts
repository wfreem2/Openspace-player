import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from 'src/app/Services/openspace.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isConnected!: boolean
  connecting:boolean = false

  constructor(private openSpaceService: OpenspaceService) { 
    
    openSpaceService.isConnected()
    .subscribe(status => this.isConnected = status)
  }

  ngOnInit(): void {}

  connect(): void { this.openSpaceService.connect() }

}
