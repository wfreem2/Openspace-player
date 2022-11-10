import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEqual } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, filter, first, map, of, skip, startWith, Subject, switchMap, takeUntil } from 'rxjs';
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

  onChange: any = () => {}
  onTouch: any = () => {}
  
  private $unsub = new Subject<any>()
  private touched: boolean = false
  
  
  sceneOptions!: SceneOptions
  
  query = new Subject<string>()

  isFilterShowing: boolean = false
  $currSorting = new BehaviorSubject<SortingType>(SortingType.None)
  
  optionsForm = new FormGroup({
    keepCameraPosition: new FormControl<boolean>(true),
    enabledTrails: new FormArray<FormGroup<OptionsGrp>>([])
  })

  filteredTrails = new FormArray<FormGroup<OptionsGrp>>([])


  constructor(private renderer: Renderer2) { 
    this.initFormGroup()

    this.$currSorting.asObservable()
    .pipe(takeUntil(this.$unsub))
    .subscribe(sorting => this.sort(sorting))
   
    this.query.asObservable()
    .pipe(
      map(query => query.toLowerCase()),
      switchMap(query => of(this.search(query))),
      takeUntil(this.$unsub),
      map(v => [...v])
    )
    .subscribe( v => this.filteredTrails.controls = v )


    this.optionsForm.valueChanges
    .pipe(
      skip(1),
      filter(v => !!v),
      distinctUntilChanged( (a, b) => isEqual(a, b)),
      map(v => {
        v.enabledTrails =  v.enabledTrails?.filter( t => t.isEnabled)
        return v
      }),
      takeUntil(this.$unsub)
    )
    .subscribe( v => {
      console.log('value', v)
      this.onChange(v)
    })
  }

  private initFormGroup(): void{
    const { enabledTrails } = this.optionsForm.controls

    Object.keys(SceneGraphNode)
    .map(node => { return { node: <SceneGraphNode> node , isEnabled: false} })
    .forEach(t => {
      
      const group = new FormGroup<OptionsGrp>({
        trail: new FormControl(t.node, {nonNullable: true}),
        isEnabled: new FormControl(t.isEnabled, {nonNullable: true})
      })

      enabledTrails.push(group)
    })
  }

  ngOnInit(): void { }
  ngOnDestroy(): void { this.$unsub.next(undefined) }

  writeValue(obj: any): void {
    const options = obj as SceneOptions

    if(!options){ return }

    this.optionsForm.patchValue({
      keepCameraPosition: options.keepCameraPosition,
    })

    const { enabledTrails } = this.optionsForm.controls

    enabledTrails.value.forEach( t => {
      t.isEnabled = options.enabledTrails.find(trail => t.trail === trail) ? true : t.isEnabled 
    })
  }

  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouch = fn }
  setDisabledState?(isDisabled: boolean): void { }


  sort(sorting: SortingType): void{
    const { controls } = this.filteredTrails
    
    switch(sorting){
        case SortingType.Ascending:
          controls.sort( (a, b) =>{

            const firstVal = a.controls['trail'].value
            const secondVal = b.controls['trail'].value

            if(firstVal < secondVal){ return -1 }
            if(firstVal > secondVal){ return 1 }

            return 0
          })
          break
        
        case SortingType.Descending:
          controls.sort( (a, b) =>{
            const firstVal = a.controls['trail'].value
            const secondVal = b.controls['trail'].value

            if(firstVal < secondVal){ return 1 }
            if(firstVal > secondVal){ return -1 }

            return 0
          })
          break

        case SortingType.None:
          this.filteredTrails.controls = [...this.optionsForm.controls.enabledTrails.controls]
          break
    }
  }

  private search(query: string): FormGroup[] {
    const { enabledTrails } = this.optionsForm.controls

    const filtered = enabledTrails.controls.filter(value => {
      const trail: SceneGraphNode = value.controls['trail'].value
      return trail.toLowerCase().includes(query)
    })
    
    return filtered
  }

  toggleClass(element: any): void{ toggleClass(element, 'collapsed') }

  selectAllTrails(){
    const { controls } = this.filteredTrails
    controls.forEach( (t, idx) => {
      if(idx === controls.length-1){
        t.controls['isEnabled'].setValue(true) 
        return
      }

      t.controls['isEnabled'].setValue(true, {emitEvent: false}) 
    })

  }

  deselectAllTrails(){
    const { controls } = this.filteredTrails
    controls.forEach( (t, idx) => {
      if(idx === controls.length - 1){
        t.controls['isEnabled'].setValue(false) 
        return
      }

      t.controls['isEnabled'].setValue(false, {emitEvent: false}) 
    })
  }


  get SortingType() { return SortingType }
}

interface OptionsGrp{
  trail: FormControl<SceneGraphNode>,
  isEnabled: FormControl<boolean>
}


type TrailOption = {node: SceneGraphNode, isEnabled: boolean}