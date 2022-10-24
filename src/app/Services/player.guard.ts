import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ShowService } from './show.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerGuard implements CanActivate {
  constructor(private showService: ShowService){ }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const id: number = parseInt(route.params['id'])

      if(!Number.isNaN(id) || !!this.showService.getShowById(id)){
         return true 
      }
      
      return false
  }
  
}
