import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { SceneOptions } from 'src/app/Interfaces/SceneOptions';
import { SceneGraphNode } from 'src/app/Services/openspace.service';
import { SortingType } from 'src/app/Shared/sorting-selector/sorting-selector.component';
import { isElementOrChildClicked, toggleClass } from 'src/app/Utils/utils';

@Component({
  selector: 'scene-options',
  templateUrl: './scene-options.component.html',
  styleUrls: ['./scene-options.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SceneOptionsComponent,
      multi: true
    }
  ]
})

export class SceneOptionsComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChildren('sortOpt') sortOptions!: QueryList<ElementRef>
  @ViewChild('filter') filterMenu!: ElementRef
  @ViewChild('filterBtn') filterBtn!: ElementRef


  sceneOptions!: SceneOptions

  onChange: any = () => {}
  onTouch: any = () => {}
  
  //Unaltered array for searching
  private readonly originalTrails!: TrailOption[]
  private $unsub = new Subject<any>()
  private touched: boolean = false

  trailOptions!: TrailOption[] 
  isFilterShowing: boolean = false
  
  query = new Subject<string>()
  $currSorting = new BehaviorSubject<SortingType>(SortingType.None)
  


  constructor(private renderer: Renderer2) { 

    this.originalTrails = 
    Object.keys(SceneGraphNode)
    .map((node) => {
      return { node: <SceneGraphNode> node , isEnabled: false}
    })

    renderer.listen('window', 'click', this.filterMenuClicked.bind(this))

    this.$currSorting.asObservable()
    .pipe(takeUntil(this.$unsub))
    .subscribe(sorting => this.sort(sorting))

    this.query.asObservable()
    .pipe(
      map(query => query.toLowerCase()),
      switchMap(query => of(this.search(query))),
      takeUntil(this.$unsub)
    )
    .subscribe(options => this.trailOptions = options)
  }

  ngOnInit(): void { }
  ngOnDestroy(): void { this.$unsub.next(undefined) }


  writeValue(obj: any): void {

    if(obj){ 
      this.sceneOptions = obj 

      if(!this.sceneOptions.enabledTrails.length){ 
        //Reset trail options
        this.trailOptions.forEach(o => o.isEnabled = false)
        return
      }

      //Set each matching trail option to enabled 
      this.sceneOptions.enabledTrails.forEach(enabledTrail => {
        const trail = this.trailOptions.find(t => t.node === enabledTrail)
        trail!.isEnabled = true
      })
    }
    else{
      this.sceneOptions = {
        keepRoll: false,
        keepRotation: false,
        keepZoom: false,
        enabledTrails: []
      }
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouch = fn }
  setDisabledState?(isDisabled: boolean): void { }


  private sort(sorting: SortingType): void{
    switch(sorting){
      case SortingType.Ascending:
        this.trailOptions.sort( (a, b) =>{
          if(a.node < b.node){
            return -1
          }

          if(a.node > b.node){
            return 1
          }

          return 0
        })
        break
      
      case SortingType.Descending:
        this.trailOptions.sort( (a, b) =>{
          if(a.node < b.node){
            return 1
          }

          if(a.node > b.node){
            return -1
          }

          return 0
        })
        break

      case SortingType.None:
        this.trailOptions = [...this.originalTrails]
        break
    }
  }

  private search(query: string): TrailOption[] {
    return this.originalTrails.filter(
      opt => opt.node.toLowerCase().includes(query)
    )
  }

  toggleClass(element: any): void{ toggleClass(element, 'collapsed') }

  selectAllTrails(){
    //Only if all the trails are not selected
    if(!this.trailOptions.every(o => o.isEnabled)){
      this.trailOptions.forEach(o => o.isEnabled = true)
      this.onChange(this.sceneOptions)
    }
  }

  deselectAllTrails(){
    //Only if all trails are not deselected
    if(!this.trailOptions.every(o => !o.isEnabled)){
      this.trailOptions.forEach(o => o.isEnabled = false)
      this.onChange(this.sceneOptions)
    }
  }

  selectAllCameraOpts(): void{
    let {keepRoll, keepRotation, keepZoom} = this.sceneOptions

    if(! (keepRoll && keepRotation && keepZoom)){
      this.sceneOptions.keepRoll = true
      this.sceneOptions.keepRotation = true
      this.sceneOptions.keepZoom = true
      this.onChange(this.sceneOptions)
    }
  } 

  deselectAllCameraOpts(): void{
    let {keepRoll, keepRotation, keepZoom} = this.sceneOptions

    if(!(!keepRoll && !keepRotation && !keepZoom)){
      this.sceneOptions.keepRoll = false
      this.sceneOptions.keepRotation = false
      this.sceneOptions.keepZoom = false
      this.onChange(this.sceneOptions)
    }
  }

  selectSort(sorting: SortingType){
    
    if(this.$currSorting.value === sorting){
      this.$currSorting.next(SortingType.None)
      return
    }
    
    this.$currSorting.next(sorting)
  }

  onOptionChecked(): void{
    this.sceneOptions.enabledTrails = 
      this.originalTrails.filter(t => t.isEnabled).map(t => t.node)
                                      
    if(!this.touched){
      this.touched = true
      this.onTouch(this.sceneOptions)
    }

    this.onChange(this.sceneOptions)
  }

  private filterMenuClicked(event: Event){  

    const isFilterMenuClicked = isElementOrChildClicked(this.filterMenu.nativeElement, 
      event.target as HTMLElement)
    const isFilterBtnClicked = isElementOrChildClicked(this.filterBtn.nativeElement, 
      event.target as HTMLElement)
    
    if(!isFilterBtnClicked && !isFilterMenuClicked){
      this.isFilterShowing = false
    }
  }

  get SortingType() { return SortingType }
}


type TrailOption = {node: SceneGraphNode, isEnabled: boolean}