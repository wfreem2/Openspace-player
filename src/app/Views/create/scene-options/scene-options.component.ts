import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, map, of, Subject, switchMap } from 'rxjs';
import { Trail, trails } from 'src/app/Services/openspace.service';
import { isChildClicked, toggleClass } from 'src/app/Utils/utils';

@Component({
  selector: 'scene-options',
  templateUrl: './scene-options.component.html',
  styleUrls: ['./scene-options.component.scss'],
})
export class SceneOptionsComponent implements OnInit, OnDestroy {

  @ViewChildren('sortOpt') sortOptions!: QueryList<ElementRef>
  @ViewChild('filter') filterMenu!: ElementRef
  @ViewChild('filterBtn') filterBtn!: ElementRef

  //Unaltered array for searching
  private readonly originalTrails: TrailOption[] = trails.map(t => { return { trail: t, isEnabled: false}})

  trailOptions!: TrailOption[] 
  isFilterShowing: boolean = false
  
  $currSorting = new BehaviorSubject<Sorting>('none')
  query = new Subject<string>()

  constructor(private renderer: Renderer2) { 
    renderer.listen('window', 'click', this.filterMenuClicked.bind(this))

    this.$currSorting.asObservable()
    .subscribe(sorting => this.sort(sorting))

    this.query.asObservable()
    .pipe(switchMap(query => of(this.search(query))))
    .subscribe(options => {
      this.trailOptions = options
    })
  }

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
    return this.originalTrails.filter(opt => opt.trail.includes(query))
  }

  toggleClass(element: any): void{ toggleClass(element, 'collapsed') }

  selectAll(){
    this.trailOptions.forEach(o => o.isEnabled = true)
  }

  deselectAll(){
    this.trailOptions.forEach(o => o.isEnabled = false)
  }

  selectSort(sorting: Sorting){
    
    if(this.$currSorting.value === sorting){
      this.$currSorting.next('none')
      return
    }
    
    this.$currSorting.next(sorting)
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