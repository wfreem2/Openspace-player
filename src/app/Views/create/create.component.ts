import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  step = 2

  detailsForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl(''),
  })

  scenes: {scene: Scene, id: number}[] = []

  currScene: Scene = 
  { 
    title: '',
    geoPos: {
      lat: 0,
      long: 0,
      alt: 0
    }
  }


  constructor() { }

  ngOnInit(): void { }

  title(){
    return this.detailsForm.get('title')
  }

  desc(){
    return this.detailsForm.get('desc')
  }

  addScene(scene: Scene){

    this.scenes.push({
      id: 1, 
      scene: scene
    })
    
    this.currScene =
    { 
      title: '',
      geoPos: {
        lat: 0,
        long: 0,
        alt: 0
      }
    }

  }

}
