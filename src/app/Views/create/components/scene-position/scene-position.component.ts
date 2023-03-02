import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, filter, map, Subject, Subscription, takeUntil, catchError, throttleTime, switchMap, tap, distinctUntilKeyChanged, of, mergeMap, throwError, from, EMPTY } from 'rxjs';
import { GeoPosition } from 'src/app/Models/GeoPosition';
import { GeoPosForm } from 'src/app/Models/ShowForm';
import { NotificationType } from 'src/app/Models/ToastNotification';
import { NotificationService } from 'src/app/Services/notification.service';
import { OpenspaceService, RenderableType, SceneGraphNode } from 'src/app/Services/openspace.service';
import { BaseComponent } from 'src/app/Shared/base/base.component';

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

export class ScenePositionComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input() isAutoMode: boolean = false
    
  private listener!: Subscription
  private readonly numRegex = /^-?\d*\.?\d*$/
  private readonly $geoPos = new Subject<GeoPosition>()
  
  readonly $isAutoMode = new BehaviorSubject<boolean>(this.isAutoMode)
  readonly pathNavOptions: SceneGraphNode[] = Object.values(SceneGraphNode)

  public $nodeCanHaveGeo = new Subject<boolean>()
  public $isDisconnected = this.openSpaceService.isConnected()
  .pipe( 
    takeUntil(this.$unsub),
    map(isConnected => !isConnected) 
  )  

  geoPosForm = this.fb.group<GeoPosForm>({
    alt: this.fb.control<number>(0.0, [ Validators.required, Validators.pattern(this.numRegex) ]),
    lat: this.fb.control<number>(0.0, [ Validators.required, Validators.pattern(this.numRegex) ]),
    long: this.fb.control<number>(0.0, [ Validators.required, Validators.pattern(this.numRegex) ]),
    node: this.fb.control<SceneGraphNode>(SceneGraphNode.Earth, Validators.required),
  })

  onChange: any = () => {}
  onTouch: any = () => {}
  
  constructor(private openSpaceService: OpenspaceService, private notiService: NotificationService,
      private fb: NonNullableFormBuilder) { 

    super()
    
    this.$isAutoMode.asObservable()
    .pipe(takeUntil(this.$unsub))
    .subscribe(isAuto => {
      this.isAutoMode = isAuto
      
      if(isAuto){ this.geoPosForm.disable() }
      else{ this.geoPosForm.enable() }
      
      this.setGeoListener(isAuto)
    })

    this.$geoPos.asObservable()
    .pipe(
      filter(geoPos => !!geoPos),
      takeUntil(this.$unsub)
    )
    .subscribe(geoPos => {

      this.geoPosForm.setValue({
        alt: geoPos.alt,
        lat: geoPos.lat,
        long: geoPos.long,
        node: geoPos.node
      }, {emitEvent: false})
    })

    this.geoPosForm.valueChanges
    .pipe(
      takeUntil(this.$unsub),
      distinctUntilKeyChanged('node'),
      map(value => value.node!),
      switchMap(node => { 
        return from(this.openSpaceService.getRenderableType(node))
        .pipe( catchError(() =>  EMPTY) )
      }),
      map(renderableType => renderableType === RenderableType.RENDERABLEGLOBE),
      tap(canHaveGeo => this.$nodeCanHaveGeo.next(canHaveGeo)),
    )
    .subscribe({
      next: canHaveGeoPosition => {
       
        if(!canHaveGeoPosition){
          this.geoPosForm.controls.alt.disable()
          this.geoPosForm.controls.lat.disable()
          this.geoPosForm.controls.long.disable()
          
          return
        }
        
        this.geoPosForm.controls.alt.enable()
        this.geoPosForm.controls.lat.enable()
        this.geoPosForm.controls.long.enable()
      },
      error: () => {
        console.log('error');
      }
    })


    this.geoPosForm.valueChanges
    .pipe(
      filter( () => this.lat!.valid && this.long!.valid && this.alt!.valid ),
      map(_=> this.geoPosForm.getRawValue() as GeoPosition),
      takeUntil(this.$unsub),
    )
    .subscribe( v => this.onChange(v) )
  }
  
  get alt(){ return this.geoPosForm.get('alt')! }
  get lat(){ return this.geoPosForm.get('lat')! }
  get long(){ return this.geoPosForm.get('long')! }

  ngOnInit(): void { }

  override ngOnDestroy(): void {
    super.ngOnDestroy()
    this.setGeoListener(false) 
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes['isAutoMode']){
      const { currentValue } = changes['isAutoMode']
      this.$isAutoMode.next(currentValue)
    }
  }

  writeValue(obj: any): void {
   
    if(this.isinstanceofGeoPos(obj)){ this.$geoPos.next(obj) }
  }

  private isinstanceofGeoPos(obj: any): obj is GeoPosition{
    return 'lat' in obj && 'long' in obj && 'alt' in obj && 'node' in obj
  }

  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouch = fn }
  setDisabledState?(isDisabled: boolean): void { }

  private async setGeoListener(isAuto: boolean){

    if(!isAuto && !!this.listener){ 
      this.listener.unsubscribe() 
      return
    }

    this.listener = 
    this.openSpaceService
    .listenCurrentPosition()
    .pipe(
      catchError(_ => {
        this.notiService.showNotification({
          title: "Cannot enable auto mode, Openspace is disconnected", 
          type: NotificationType.ERROR
        })

        this.isAutoMode = false
        this.geoPosForm.enable()

        return this.$geoPos
      }),
      throttleTime(500)
    )
    .subscribe(pos => {
      this.$geoPos.next(pos)
      this.onChange(pos)
    })
  }
}
