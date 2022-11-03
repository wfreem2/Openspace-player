import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, filter, map, Subject, Subscription, takeUntil } from 'rxjs';
import { GeoPosition } from 'src/app/Interfaces/GeoPosition';
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service';

@Component({
  selector: 'scene-position',
  templateUrl: './scene-position.component.html',
  styleUrls: ['./scene-position.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ScenePositionComponent,
      multi: true
    }
  ]
})

export class ScenePositionComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {


  private $unSub = new Subject<any>()
  
  @Input() geoPosition!:GeoPosition
  @Input() isAutoMode: boolean = true
  
  pathNavOptions: SceneGraphNode[] = []
  
  readonly $isAutoMode = new BehaviorSubject<boolean>(this.isAutoMode)
  
  private listener!: Subscription
  private readonly $geoPos = new Subject<GeoPosition>()

  onChange: any = () => {}
  onTouch: any = () => {}
  
  constructor(private openSpaceService: OpenspaceService) { 
  

    this.pathNavOptions = Object.values(SceneGraphNode)
    
    this.$isAutoMode.asObservable()
    .pipe(takeUntil(this.$unSub))
    .subscribe(isAuto => {
      this.isAutoMode = isAuto

      if(isAuto){ this.listenGeo() } 
      else{ this.stopListening() }
    })

    this.$geoPos.asObservable()
    .pipe(
      map(geoPos => !!geoPos ? 
        geoPos : 
        { lat: 0, long: 0, alt: 0, nodeName: SceneGraphNode.Mercury }
      ),
      takeUntil(this.$unSub)
    )
    .subscribe(geoPos => this.geoPosition = geoPos)
  }
  
  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.$unSub.next(undefined)
    this.stopListening() 
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes['isAutoMode']){
      const { currentValue } = changes['isAutoMode']
      this.$isAutoMode.next(currentValue)
    }
  }

  writeValue(obj: any): void { this.$geoPos.next(obj) }

  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouch = fn }
  setDisabledState?(isDisabled: boolean): void { }

  onValueChange(): void{ this.onChange(this.geoPosition) }

  clear(): void{
    this.geoPosition = {
       alt: 0,
       lat: 0,
       long: 0
    }
  }

  async listenGeo(){
    this.listener = 
    this.openSpaceService
    .listenCurrentPosition()
    .subscribe({
      next: pos => this.geoPosition = pos,
      error: _ => console.log('error with openspace')
    })
  }

  stopListening(){ 
    if(this.listener)
      this.listener.unsubscribe() 
  }
}
