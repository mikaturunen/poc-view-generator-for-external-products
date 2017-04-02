import { el, text, mount } from 'redom';
import { ServiceAjax } from '../services/ajax'

export class UiGenerator {
    constructor (uiJson, app, saveEndpoint) {
        console.log('Starting to build UI from the JSON:', uiJson)
        
        this.saveEndpoint = saveEndpoint ? saveEndpoint : uiJson.endpoint
        this.generatorForm = el('form')
        mount(app, this.generatorForm)
        uiJson.ui.forEach(uiElementDescription => 
            this.generateElementFromDescription(uiElementDescription)
        )
    }
    
    generateElementFromDescription(uiElementDescription) {
        console.log("Element: ", uiElementDescription)
        
        let element;
        // being lazy and hardwiring from here to the body -- PoC 
        switch (uiElementDescription.html) {
            case "fieldset":
                element = el(uiElementDescription.html, { 
                    legend: uiElementDescription.legend 
                })
                break
            
            case "label":
                element = el(uiElementDescription.html, { 
                        for: uiElementDescription.for 
                    },
                    uiElementDescription.value
                )
                break
            
            case "span":
                element = el(uiElementDescription.html, { 
                    },
                    uiElementDescription.value
                )
                break
                
            case "input":
                if (uiElementDescription.type === 'checkbox') {
                    element = el('div', 
                        el('input', { type: 'checkbox', id: uiElementDescription.id }),
                        el('label.label-inline', { for: uiElementDescription.id }, uiElementDescription.value)
                    )
                } else {
                    element = el(uiElementDescription.html, { 
                        type: uiElementDescription.type
                    })
                }
                break
                
            case "button":
                element = el(uiElementDescription.html, { 
                        type: uiElementDescription.type
                    },
                    uiElementDescription.value 
                )
                
                if (uiElementDescription.meta === 'save') {
                    element.onclick = event => {
                        // TODO read the values for the json from the elements and send them over the product2
                        console.log('save clicked')
                        ServiceAjax.POST(this.saveEndpoint, { foo: 'bar' })
                    }
                }
                break
            
            default:
                console.log("Unsupported element, no support yet implemented for:", uiElementDescription.html, uiElementDescription)
        }
        
        mount(this.generatorForm, element)
        if (uiElementDescription.children) {
            uiElementDescription.children
                .map(childElement => this.generateElementFromDescription(childElement))
                .forEach(childElement => mount(element, childElement))
        }
            
        return element
    }
}

