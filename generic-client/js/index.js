import { el, text, mount } from 'redom';
import { ServiceAjax } from './services/ajax'
import { UiGenerator } from './components/uigenerator'



class App {
    constructor () {
        this.el = el('.app',
            this.header = el('div',
                el('h2', 'PoC JSON Renderer')
            ),
            this.content = el('div')
        );
        
        // quick hack as I want to use 99% of front stuff for this PoC for both products
        // TODO This should be known by the implementator of the UI so.. Just reading it from html now so I can use and abuse UI
        const interfaceDescriptionApi = document.getElementById('GET').getAttribute('endpoint');
        
        // TODO this could be read from the metadata on the mock.json but it would mean I would have to code more for this PoC - feeling lazy ;)
        const productSaveApi = document.getElementById('POST').getAttribute('endpoint');
        
        ServiceAjax.GET(interfaceDescriptionApi)
            .then(uiJson => {
                this.content = el('div',
                    this.ui = new UiGenerator(uiJson, app, productSaveApi)
                )
            })
            .catch(console.log)
    }
}

const app = new App();
mount(document.body, app);
