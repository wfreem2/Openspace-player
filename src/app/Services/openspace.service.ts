import { Injectable } from '@angular/core';
import * as api from 'openspace-api-js'
import { BehaviorSubject, interval, mergeMap, Observable } from 'rxjs';
import { GeoPosition } from '../Models/GeoPosition';
import { NavigationState } from '../Models/NavigationState';
import { NotificationType } from '../Models/ToastNotification';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})

export class OpenspaceService {

  private openspace: any
  private nodes: SceneGraphNode[] = Object.values(SceneGraphNode)

  private readonly client = api('localhost', 4682)
  private readonly _isConnected = new BehaviorSubject<boolean>(false)

  constructor(private notiService: NotificationService) {
    this.client.onConnect(async () => await this.onConnect(this.client))
    this.client.onDisconnect(async () => await this.onDisconnect())

    this.client.connect()
  }

  private async onDisconnect(){
    this._isConnected.next(false)

    this.notiService.showNotification({ 
      title: 'Openspace is Disconnected',
      type: NotificationType.WARNING
    })
  }

  private async onConnect(api: any){
    this.openspace = await api.library()
    this._isConnected.next(true)

    this.notiService.showNotification({
      title: 'Openspace is Connected',
      type: NotificationType.SUCCESS
    })
  }

  connect(): void{ this.client.connect() }

  isConnected(): Observable<boolean>{  return this._isConnected.asObservable() }
  
  flyToGeo(lat: Number, long: Number, alt: Number, globe: string='', duration?: number): void{
    
    if(!duration){
      this.openspace.globebrowsing.flyToGeo(globe, lat, long, alt)
      return
    }

    this.openspace.globebrowsing.flyToGeo(globe, lat, long, alt, duration)
  }

  async getCurrentPosition(): Promise<GeoPosition>{
    const pos = await this.openspace.globebrowsing.getGeoPositionForCamera()
    const anchor = await this.getCurrentAnchor()

    return {
      lat: pos[1],
      long: pos[2],
      alt: pos[3],
      node: anchor
    }
  }
  
  flyTo(node: SceneGraphNode): void{ this.openspace.pathnavigation.flyTo(node.toString()) }

  resetAnchor(): void{
    this.openspace.navigation.retargetAnchor()
  }


  async getPropertyValue(): Promise<string>{
    return await this.openspace.getPropertyValue("Scene.Phobos.Renderable.Type")
  }

  listenCurrentPosition(): Observable<GeoPosition>{
    return interval(100)
    .pipe( mergeMap( async () => await this.getCurrentPosition() ) )
  }

  setTrailVisibility(node: SceneGraphNode, isVisible: boolean): void{

    const trail = this.nodeToTrail(node)
    
    this.openspace.setPropertyValueSingle(`Scene.${trail}.Renderable.Enabled`, isVisible) 
  }

  private nodeToTrail(node: SceneGraphNode): string{
    return node in NodeToTrailMap ? NodeToTrailMap[node] : `${node.toString()}Trail`
  }

  private nodeToRenderable(node: SceneGraphNode): string{
    return node in NodeToRenderableMap ? NodeToRenderableMap[node] : node.toString()
  }

  async getRenderableType(node: SceneGraphNode): Promise<RenderableType>{
    const renderable = this.nodeToRenderable(node)

    const type = await this.openspace.getPropertyValue(`Scene.${renderable}.Renderable.Type`)   
    
    return <RenderableType> type['1']
  }

  async getNavigationState(): Promise<NavigationState>{
    return (await this.openspace.navigation.getNavigationState())['1']
  }

  setNavigationState(state: NavigationState){
    this.openspace.navigation.setNavigationState(state)
  }

  disableAllNodeTrails(): void{
    this.nodes.forEach(node => this.setTrailVisibility(node, false))
  }

  enableAllNodeTrails(): void{
    this.nodes.forEach(node => this.setTrailVisibility(node, true))    
  }

  async getCurrentAnchor(): Promise<SceneGraphNode>{
    const anchor: SceneGraphNode = (await this.openspace.getPropertyValue('NavigationHandler.OrbitalNavigator.Anchor'))['1']

    return anchor
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
 Sun="Sun",
 ISS="ISS"
}

interface NodeMap {
  [key: string | SceneGraphNode]: string
}

export const NodeToTrailMap: NodeMap = {
  Sun: "SunOrbit",
  ISS: "ISS_trail"
}

export const NodeToRenderableMap: NodeMap = {
  Sun: "SunOrbit",
  ISS: "ISSModel"
}

export enum RenderableType{
  RENDERABLEMODEL="RenderableModel",
  RENDERABLEGLOBE="RenderableGlobe"
}
