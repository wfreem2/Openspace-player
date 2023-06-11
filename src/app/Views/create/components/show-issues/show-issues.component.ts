import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scene } from 'src/app/Models/Scene';
import { IssueServerity, SceneIssue } from 'src/app/Models/SceneIssue';

@Component({
  selector: 'show-issues',
  templateUrl: './show-issues.component.html',
  styleUrls: ['./show-issues.component.scss']
})
export class ShowIssuesComponent implements OnInit {

  @Input() invalidScenes: SceneIssue[] | null = [] 
  @Output() goToScene = new EventEmitter<Scene>()

  constructor() { }

  ngOnInit(): void { }

  goTo(scene: Scene): void{
    this.goToScene.emit(scene)
  }

  //For DOM
  get IssueSeverity(){
    return IssueServerity
  }
}
