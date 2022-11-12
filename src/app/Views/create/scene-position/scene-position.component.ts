import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { tap, BehaviorSubject, filter, map, Subject, Subscription, takeUntil, catchError, of } from 'rxjs';
import { GeoPosition } from 'src/app/Interfaces/GeoPosition';
import { GeoPosForm } from 'src/app/Interfaces/ShowForm';
import { NotificationType } from 'src/app/Interfaces/ToastNotification';
import { NotificationService } from 'src/app/Services/notification.service';
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
  @Input() isAutoMode: boolean = false
  
  
  private listener!: Subscription
  private $unSub = new Subject<any>()
  private readonly $geoPos = new Subject<GeoPosition>()
  private readonly numRegex = /^-?\d*\.?\d*$/
  
  readonly $isAutoMode = new BehaviorSubject<boolean>(this.isAutoMode)
  readonly pathNavOptions: SceneGraphNode[] = Object.values(SceneGraphNode)

  geoPosForm = new FormGroup<GeoPosForm>({
    alt: new FormControl<number>(0.0, [ Validators.required, Validators.pattern(this.numRegex) ]),
    lat: new FormControl<number>(0.0, [ Validators.required, Validators.pattern(this.numRegex) ]),
    long: new FormControl<number>(0.0, [ Validators.required, Validators.pattern(this.numRegex) ]),
    nodeName: new FormControl<SceneGraphNode>(SceneGraphNode.Earth, Validators.required),
  })

  onChange: any = () => {}
  onTouch: any = () => {}
  
  constructor(private openSpaceService: OpenspaceService, private notiService: NotificationService) { 

    this.$isAutoMode.asObservable()
    .pipe(takeUntil(this.$unSub))
    .subscribe(isAuto => {
      this.isAutoMode = isAuto
      this.setGeoListener(isAuto)
        
      if(isAuto){ this.geoPosForm.disable() }
      else{ this.geoPosForm.enable() }
    })

    this.$geoPos.asObservable()
    .pipe(
      filter(geoPos => !!geoPos),
      takeUntil(this.$unSub)
    )
    .subscribe(geoPos => {
      this.geoPosForm.setValue({
        alt: geoPos.alt,
        lat: geoPos.lat,
        long: geoPos.long,
        nodeName: geoPos.nodeName
      }, {emitEvent: false})
    })
      
    this.geoPosForm.valueChanges
    .pipe(
      filter( () => this.lat!.valid && this.long!.valid && this.alt!.valid ),
      map(_=> this.geoPosForm.getRawValue() as GeoPosition),
    )
    .subscribe(v => this.onChange(v))  
  }
  
  get alt(){ return this.geoPosForm.get('alt') }
  get lat(){ return this.geoPosForm.get('lat') }
  get long(){ return this.geoPosForm.get('long') }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.$unSub.next(undefined)
    this.setGeoListener(false) 
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes['isAutoMode']){
      const { currentValue } = changes['isAutoMode']
      this.$isAutoMode.next(currentValue)
    }
  }

  writeValue(obj: any): void {
    const geoPos = obj as GeoPosition

    if(this.isinstanceofGeoPos(geoPos)){ this.$geoPos.next(geoPos) }
  }

  private isinstanceofGeoPos(obj: any): obj is GeoPosition{
    return 'lat' in obj && 'long' in obj && 'alt' in obj && 'nodeName' in obj
  }

  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouch = fn }
  setDisabledState?(isDisabled: boolean): void { }

  clear(): void {
    this.geoPosForm.reset()
  }

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
        console.log('err')
        this.notiService.showNotification({title: "Cannot enable auto mode, Openspace is disconnected", type: NotificationType.ERROR})

        this.isAutoMode = false
        this.geoPosForm.enable()

        return this.$geoPos
      })
    )
    .subscribe(pos => this.$geoPos.next(pos))
  }
}
