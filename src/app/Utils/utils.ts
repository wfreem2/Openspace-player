export function toggleClass(el: HTMLElement, className: string){
    switch(el.classList.contains(className)){
        case true:
            el.classList.remove(className)
            break
        case false:
            el.classList.add(className)
            break
    }
}


export function isChildClicked(e: HTMLElement, clickedElement: EventTarget | null): boolean{
    
    if(e === clickedElement){ return true }
    
    for(var i = 0; i < e.childNodes.length; i++){
      let c = e.childNodes[i]

      if(isChildClicked(<HTMLElement> c, clickedElement)) 
        return true 
    }
    
    return false
  }