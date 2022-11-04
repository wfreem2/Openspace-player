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

  constructor() {
    this.o.onConnect(async () => await this.onConnect(this.o))
    this.o.onDisconnect(async () => await this.onDisconnect())

    this.o.connect()
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
  
  flyToGeo(lat: Number, long: Number, alt: Number, globe: string=''): void{
    this.openspace.globebrowsing.flyToGeo(globe, lat, long, alt)
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
    this.openspace.setPropertyValueSingle(`Scene.${trail}Trail.Renderable.Enabled`, value) 
  }

  async getNavigationState(): Promise<NavigationState>{
    return await this.openspace.navigation.getNavigationState();
  }

  loadNavigationState(state: NavigationState){
    this.openspace.navigation.loadNavigationState(state)
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
