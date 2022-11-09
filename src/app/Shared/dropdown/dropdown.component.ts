import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { isElementOrChildClicked } from 'src/app/Utils/utils';
import { SortingType } from '../sorting-selector/sorting-selector.component';

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


export class DropdownComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() items!: any[]
  
  @ViewChild('selector', {read: ElementRef}) set content(content: ElementRef){
    if(content){ this.sortingSelector = content }
  }
  
  private sortingSelector!: ElementRef

  onChange: any = () => {}
  onTouch: any = () => {}
  
  filteredSelectableItems: SelectableItem[] = []
  selectableItems: SelectableItem[] = []
  selectedItem!: SelectableItem
  
  isCollapsed: boolean = true
  isTouched: boolean = false
  isDisabled: boolean = false
  
  query = new Subject<string>()
  private $unSub = new Subject<any>()

  constructor(private hostRef: ElementRef, private render: Renderer2) { 
    // render.listen('window', 'click', this.onHostClick.bind(this))`

    this.query.asObservable()
    .pipe(
      takeUntil(this.$unSub),
      map(query => query.toLowerCase()),
      switchMap(query => of(this.search(query))),
    )
    .subscribe(items => this.filteredSelectableItems = items)
  }

  private onHostClick(event: Event){
    
    const hostClicked = isElementOrChildClicked(this.hostRef.nativeElement, 
      event.target as HTMLElement)
      
    const selectorClicked = isElementOrChildClicked(this.sortingSelector.nativeElement, 
      event.target as HTMLElement)
        
    if(!hostClicked && !selectorClicked){ this.isCollapsed = true}
  }

  ngOnDestroy(): void { this.$unSub.next(undefined) }

  ngOnInit(): void { 
    this.selectableItems = this.items.map(i => {
      return {item: i, isSelected: false}
    }) 

    this.onDefaultNotProvided()
    this.filteredSelectableItems = [...this.selectableItems]
  }

  writeValue(obj: any): void { 
    if(!obj){
      this.onDefaultNotProvided()
      this.onChange(this.selectedItem.item)
    }
    else{ this.setItem(obj) }
  }

  
  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouch = fn }
  setDisabledState?(isDisabled: boolean): void { this.isDisabled = isDisabled }
 

  private search(query: any): SelectableItem[] {
    return this.selectableItems.filter(
      i => i.item.toString().toLowerCase().includes(query)
    )
  }

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

  private setItem(item: any): void{
    const selectableItem = this.selectableItems.find(i => i.item === item)
    
    if(selectableItem){
      
      if(this.selectedItem){ this.selectedItem.isSelected = false }

      selectableItem.isSelected = true
      this.selectedItem = selectableItem
    }
    else{
      throw new Error(`Provided item: ${item} does not exist`)
    }
  } 

  onSortSelected(sortingType: SortingType): void{

    switch(sortingType){
      case SortingType.None:
        this.filteredSelectableItems = [...this.selectableItems]
        break
      case SortingType.Ascending:
        this.filteredSelectableItems.sort( (a, b) =>{
          if(a.item.toString() < b.item.toString()){
            return -1
          }

          if(a.item.toString() > b.item.toString()){
            return 1
          }

          return 0
        })
        break

      case SortingType.Descending:
        this.filteredSelectableItems.sort( (a, b) =>{
          if(a.item.toString() < b.item.toString()){
            return 1
          }

          if(a.item.toString() > b.item.toString()){
            return -1
          }

          return 0
        })
        break
    }


  }

  moveToTop(item: SelectableItem){
    this.filteredSelectableItems = this.selectableItems.filter(i => i !== item)
    this.filteredSelectableItems.unshift(item)
  }

  private onDefaultNotProvided(): void{   
    //Set the first item as selected by default
    this.selectedItem = this.selectableItems[0]
    this.selectedItem.isSelected = true
  }
}

type SelectableItem = {item: any, isSelected: boolean}


