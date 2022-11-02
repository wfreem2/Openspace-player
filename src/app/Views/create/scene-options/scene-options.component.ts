import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, map, of, Subject, switchMap } from 'rxjs';
import { SceneOptions } from 'src/app/Interfaces/SceneOptions';
import { Trail, trails } from 'src/app/Services/openspace.service';
import { isChildClicked, toggleClass } from 'src/app/Utils/utils';

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
  private readonly originalTrails: TrailOption[] = trails.map(t => { return { trail: t, isEnabled: false}})

  trailOptions!: TrailOption[] 
  isFilterShowing: boolean = false
  
  $currSorting = new BehaviorSubject<Sorting>('none')
  query = new Subject<string>()

  private touched: boolean = false


  constructor(private renderer: Renderer2) { 
    renderer.listen('window', 'click', this.filterMenuClicked.bind(this))

    this.$currSorting.asObservable()
    .subscribe(sorting => this.sort(sorting))

    this.query.asObservable()
    .pipe(
      map(query => query.toLowerCase()),
      switchMap(query => of(this.search(query)))
    )
    .subscribe(options => this.trailOptions = options)
  }

  writeValue(obj: any): void {

    if(obj){ 
      this.sceneOptions = obj 

      if(!this.sceneOptions.enabledTrails.length){ 
        this.deselectAllTrails() 
        return
      }

      //Set each matching trail option to enabled 
      this.sceneOptions.enabledTrails.forEach(enabledTrail => {
        const trail = this.trailOptions.find(t => t.trail === enabledTrail)
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

  ngOnDestroy(): void {
    this.$currSorting.unsubscribe()
    this.query.unsubscribe()
  }

  ngOnInit(): void { }

  private sort(sorting: Sorting): void{
    switch(sorting){
      case 'asc':
        this.trailOptions.sort( (a, b) =>{
          if(a.trail < b.trail){
            return -1
          }

          if(a.trail > b.trail){
            return 1
          }

          return 0
        })
        break
      
      case 'des':
        this.trailOptions.sort( (a, b) =>{
          if(a.trail < b.trail){
            return 1
          }

          if(a.trail > b.trail){
            return -1
          }

          return 0
        })
        break

      case 'none':
        this.trailOptions = [...this.originalTrails]
        break
    }
  }

  private search(query: string): TrailOption[] {
    return this.originalTrails.filter(
      opt => opt.trail.toLowerCase().includes(query)
    )
  }

  toggleClass(element: any): void{ toggleClass(element, 'collapsed') }

  selectAllTrails(){
    this.trailOptions.forEach(o => o.isEnabled = true)
  }

  deselectAllTrails(){
    this.trailOptions.forEach(o => o.isEnabled = false)
  }

  selectAllCameraOpts(): void{
    this.sceneOptions.keepRoll = true
    this.sceneOptions.keepRotation = true
    this.sceneOptions.keepZoom = true
  }

  deselectAllCameraOpts(): void{
    this.sceneOptions.keepRoll = false
    this.sceneOptions.keepRotation = false
    this.sceneOptions.keepZoom = false
  }

  selectSort(sorting: Sorting){
    
    if(this.$currSorting.value === sorting){
      this.$currSorting.next('none')
      return
    }
    
    this.$currSorting.next(sorting)
  }

  onOptionChecked(): void{
    
    this.sceneOptions.enabledTrails = 
      this.originalTrails.filter(t => t.isEnabled).map(t => t.trail)
                                      
    if(!this.touched){
      this.touched = true
      this.onTouch(this.sceneOptions)
    }

    this.onChange(this.sceneOptions)
  }

  private filterMenuClicked(event: Event){  

    const isFilterMenuClicked = isChildClicked(this.filterMenu.nativeElement, event.target)
    const isFilterBtnClicked = isChildClicked(this.filterBtn.nativeElement, event.target)
    
    if(!isFilterBtnClicked && !isFilterMenuClicked){
      this.isFilterShowing = false
    }
  }

}


type TrailOption = {trail: Trail, isEnabled: boolean}
type Sorting = 'des' | 'asc' | 'none'