import { Component, Input, OnInit } from '@angular/core';
import { Show } from 'src/app/Interfaces/Show';
import { ShowPreviewService } from 'src/app/Services/show-preview.service';

@Component({
  selector: 'shows-list',
  templateUrl: './shows-list.component.html',
  styleUrls: ['./shows-list.component.scss']
})
export class ShowsListComponent implements OnInit {


  @Input() shows?: Show[] = []

  constructor(public showPreviewService: ShowPreviewService) { }

  ngOnInit(): void { }

}
