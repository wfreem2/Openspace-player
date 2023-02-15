import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Show } from 'src/app/Models/Show';
import { ShowPreviewService } from 'src/app/Views/home/show-preview.service';

@Component({
  selector: 'shows-list',
  templateUrl: './shows-list.component.html',
  styleUrls: ['./shows-list.component.scss']
})
export class ShowsListComponent implements OnInit {


  @Input() shows?: Show[] = []
  @Output() cardClicked = new EventEmitter<Show>()

  constructor(public showPreviewService: ShowPreviewService) { }

  ngOnInit(): void { }

}
