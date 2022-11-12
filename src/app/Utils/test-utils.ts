
export function testControlValueImplementation(component: any){
    const onChange  = () => { console.log('change') }
    const onTouch  = () => { console.log('touch') }

    component.registerOnChange(onChange)
    component.registerOnTouched(onTouch)

    expect(component.onChange).toEqual(onChange)
    expect(component.onTouch).toEqual(onTouch)
}