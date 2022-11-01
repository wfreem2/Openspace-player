import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers:  [
    { 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DropdownComponent)
    }
  ]
})


export class DropdownComponent implements OnInit, ControlValueAccessor {

  @Input() items!: any[]
  // @Input() defaultItem?: any


  onChange: any = () => {}
  onTouch: any = () => {}

  selectableItems: SelectableItem[] = []
  selectedItem!: SelectableItem

  isCollapsed: boolean = true
  isTouched: boolean = false

  @Input() disabled: boolean = false

  constructor() { }

  ngOnInit(): void { }

  writeValue(obj: any): void { 
  
    if(!obj){
      this.onDefaultNotProvided()
      this.onChange(this.selectedItem.item)
    }
    else{ this.setItem(obj) }
  }

  registerOnChange(fn: any): void { this.onChange = fn }

  registerOnTouched(fn: any): void { this.onTouch = fn }
 
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled }


  selectItem(item: SelectableItem): void{
    
    this.selectedItem.isSelected = false

    this.selectedItem = item
    this.selectedItem.isSelected = true

    this.onChange(item.item)

    if(!this.isTouched){
      this.onTouch(item.item)
      this.isTouched = true
    }
  } 

  setItem(item: any): void{
    const selectableItem = this.selectableItems.find(i => i.item === item)

    if(selectableItem){
      this.selectItem(selectableItem)
    }
  } 


  private onDefaultNotProvided(): void{
    this.selectableItems = this.items.map(i => {
      return {item: i, isSelected: false}
    })  
    
    //Set the first item as selected by default
    this.selectedItem = this.selectableItems[0]
    this.selectedItem.isSelected = true
  }


/*   private onDefaultProvided(): void{
    //If default item was provided, find it and make isSelected true
    this.selectableItems = this.items.map(i => {
      if(i === this.defaultItem){
        this.selectedItem = {item: i, isSelected: true}
        return this.selectedItem
      }
      
      return {item: i, isSelected: false}
    })

  } */
} 

type SelectableItem = {item: any, isSelected: boolean}