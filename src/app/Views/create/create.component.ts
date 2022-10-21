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

  
  currScene: Scene = 
  { 
    id: 1,
    title: 'eqeqe',
    geoPos: {
      lat: 0,
      long: 0,
      alt: 0
    }
  }
  
  scenes: Scene[] = [this.currScene]

  constructor() { }

  ngOnInit(): void { }

  title(){
    return this.detailsForm.get('title')
  }

  desc(){
    return this.detailsForm.get('desc')
  }

  addScene(scene: Scene){

    this.scenes.push(scene)
    
    this.currScene =
    { 
      id: 1,
      title: '',
      geoPos: {
        lat: 0,
        long: 0,
        alt: 0
      }
    }

  }


  toggleCollapse(el: HTMLDivElement){
    if(el.classList.contains('collapsed')){
      el.classList.remove('collapsed')
    }
    else{
      el.classList.add('collapsed')
    }
    
    console.log(el)
  }

}
