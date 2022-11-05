import { Injectable } from '@angular/core';
import * as api from 'openspace-api-js'
import { BehaviorSubject, interval, map, mergeMap, Observable } from 'rxjs';
import { GeoPosition } from '../Interfaces/GeoPosition';
import { NavigationState } from '../Interfaces/NavigationState';
import { Scene } from '../Interfaces/Scene';

@Injectable({
  providedIn: 'root'
})

export class OpenspaceService {

  openspace: any
  _isConnected = new BehaviorSubject<boolean>(false)
  o = api('localhost', 4682)
  private nodes!: SceneGraphNode[]

  private isAllTrailsDisabled: boolean = false
  private isAllTrailsEnabled: boolean = false

  constructor() {
    this.o.onConnect(async () => await this.onConnect(this.o))
    this.o.onDisconnect(async () => await this.onDisconnect())

    this.o.connect()

    this.nodes = Object.keys(SceneGraphNode).map(n => <SceneGraphNode> n)
  }

  private async onDisconnect(){
    this._isConnected.next(false)
  }

  private async onConnect(api: any){
    this.openspace = await api.library()
    this._isConnected.next(true)
  }

  isConnected(): Observable<boolean>{
    return this._isConnected.asObservable()
  }
  
  flyToGeo(lat: Number, long: Number, alt: Number, globe: string='', duration?: number): void{
    if(!duration){
      this.openspace.globebrowsing.flyToGeo(globe, lat, long, alt)
    }
    else{
      this.openspace.globebrowsing.flyToGeo(globe, lat, long, alt, duration)
    }
  }


  async getCurrentPosition(): Promise<GeoPosition>{

    const pos = await this.openspace.globebrowsing.getGeoPositionForCamera()
    const anchor = await this.getCurrentAnchor()

    return {
      lat: pos[1],
      long: pos[2],
      alt: pos[3],
      nodeName: anchor
    }
  } 
  
  flyTo(path: SceneGraphNode){
    this.openspace.pathnavigation.flyTo(path.toString())
  }

  listenCurrentPosition(): Observable<GeoPosition>{
    return interval(100)
    .pipe(
      mergeMap(async _ => await this.getCurrentPosition())
    )
  }

  setTrail(trail: SceneGraphNode, value: boolean): void{
    if(value === true){ this.isAllTrailsDisabled = false}
    else{ this.isAllTrailsEnabled = false }

    if(trail === SceneGraphNode.Sun){ //Sun does not have trail option
      this.openspace.setPropertyValueSingle("Scene.SunOrbit.Renderable.Enabled", value)
      return
    }

    this.openspace.setPropertyValueSingle(`Scene.${trail}Trail.Renderable.Enabled`, value) 
  }

  async getNavigationState(): Promise<NavigationState>{
    return (await this.openspace.navigation.getNavigationState())['1']
  }

  setNavigationState(state: NavigationState){
    this.openspace.navigation.setNavigationState(state)
  }

  public disableAllNodeTrails(): void{
    if(!this.isAllTrailsDisabled){
      this.nodes.forEach(node => this.setTrail(node, false))
    }
    
    this.isAllTrailsDisabled = true
  }

  public enableAllNodeTrails(): void{
    if(!this.isAllTrailsEnabled){
      this.nodes.forEach(node => this.setTrail(node, true))    
    }

    this.isAllTrailsEnabled =  true
  }

  async getCurrentAnchor(): Promise<SceneGraphNode>{
    const anchor = (await this.openspace.getPropertyValue('NavigationHandler.OrbitalNavigator.Anchor'))['1']

    return <SceneGraphNode> anchor
  }
}

export enum SceneGraphNode{  
 Mercury="Mercury", 
 Venus="Venus", 
 Earth="Earth", 
 Mars="Mars", 
 Jupiter="Jupiter", 
 Saturn="Saturn", 
 Uranus="Uranus", 
 Neptune="Neptune", 
 Moon="Moon", 
 Phobos="Phobos", 
 Deimos="Deimos", 
 Callisto="Callisto", 
 Europa="Europa", 
 Ganymede="Ganymede", 
 Io="Io", 
 Dione="Dione", 
 Enceladus="Enceladus", 
 Hyperion="Hyperion", 
 Iapetus="Iapetus", 
 Mimas="Mimas", 
 Rhea="Rhea", 
 Tethys="Tethys", 
 Titan="Titan", 
 PlutoBarycenter="PlutoBarycenter", 
 PlutoBarycentric="PlutoBarycentric", 
 CharonBarycentric="CharonBarycentric", 
 Hydra="Hydra", 
 Kerberos="Kerberos", 
 Nix="Nix", 
 Styx="Styx",
 Sun="Sun"
}
