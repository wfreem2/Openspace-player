import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() { }

  ngOnInit(): void { }

  title(){
    return this.detailsForm.get('title')
  }

  desc(){
    return this.detailsForm.get('desc')
  }

}
