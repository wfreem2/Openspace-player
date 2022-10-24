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