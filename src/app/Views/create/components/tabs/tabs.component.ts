import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterContentInit {

  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>

  constructor() { }
  ngOnInit(): void { }

  ngAfterContentInit(): void {
    let activeTabs = this.tabs.filter(t=> t.isActive)
    
    //Set first tab to active by default
    if(!activeTabs.length) { this.selectTab(this.tabs.first) }
  }

  

  selectTab(tab: TabComponent){
    this.tabs.forEach(tab => tab.isActive = false)
    tab.isActive = true
  }
}
