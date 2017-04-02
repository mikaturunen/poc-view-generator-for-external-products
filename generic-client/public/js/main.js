(function () {
'use strict';

var HASH = '#'.charCodeAt(0);
var DOT = '.'.charCodeAt(0);

function createElement (query, ns) {
  var tag;
  var id;
  var className;

  var mode = 0;
  var start = 0;

  for (var i = 0; i <= query.length; i++) {
    var char = query.charCodeAt(i);

    if (char === HASH || char === DOT || !char) {
      if (mode === 0) {
        if (i === 0) {
          tag = 'div';
        } else if (!char) {
          tag = query;
        } else {
          tag = query.substring(start, i);
        }
      } else {
        var slice = query.substring(start, i);

        if (mode === 1) {
          id = slice;
        } else if (className) {
          className += ' ' + slice;
        } else {
          className = slice;
        }
      }

      start = i + 1;

      if (char === HASH) {
        mode = 1;
      } else {
        mode = 2;
      }
    }
  }

  var element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (className) {
    element.className = className;
  }

  return element;
}

function text (content) {
  return document.createTextNode(content);
}

function mount (parent, child, before) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  if (childEl.__redom_list) {
    childEl = childEl.el;
  }

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (child !== childEl) {
    childEl.__redom_view = child;
  }
  if (child.isMounted) {
    child.remount && child.remount();
  } else {
    child.mount && child.mount();
  }
  if (before) {
    parentEl.insertBefore(childEl, before.el || before);
  } else {
    parentEl.appendChild(childEl);
  }
  if (child.isMounted) {
    child.remounted && child.remounted();
  } else {
    child.isMounted = true;
    child.mounted && child.mounted();
  }
}

function unmount (parent, child) {
  var parentEl = parent.el || parent;
  var childEl = child.el || child;

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  child.unmount && child.unmount();

  parentEl.removeChild(childEl);

  child.isMounted = false;
  child.unmounted && child.unmounted();
}

var elcache = {};

function el (query) {
  var arguments$1 = arguments;

  var element;

  if (typeof query === 'string') {
    element = (elcache[query] || (elcache[query] = createElement(query))).cloneNode(false);
  } else if (query && query.nodeType) {
    element = query.cloneNode(false);
  } else {
    throw new Error('At least one argument required');
  }

  var empty = true;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments$1[i];

    if (!arg) {
      continue;
    }

    // support middleware
    if (typeof arg === 'function') {
      arg(element);
    } else if (typeof arg === 'string' || typeof arg === 'number') {
      if (empty) {
        empty = false;
        element.textContent = arg;
      } else {
        element.appendChild(text(arg));
      }
    } else if (arg.nodeType || (arg.el && arg.el.nodeType)) {
      empty = false;
      mount(element, arg);
    } else if (arg.length) {
      empty = false;
      for (var j = 0; j < arg.length; j++) {
        mount(element, arg[j]);
      }
    } else if (typeof arg === 'object') {
      for (var key in arg) {
        var value = arg[key];

        if (key === 'style') {
          if (typeof value === 'string') {
            element.setAttribute(key, value);
          } else {
            for (var cssKey in value) {
              element.style[cssKey] = value[cssKey];
            }
          }
        } else if (key in element || typeof value === 'function') {
          element[key] = value;
        } else {
          element.setAttribute(key, value);
        }
      }
    }
  }

  return element;
}

el.extend = function (query) {
  var clone = (elcache[query] || (elcache[query] = createElement(query)));

  return el.bind(this, clone);
};

function setChildren (parent, children) {
  var parentEl = parent.el || parent;
  var traverse = parentEl.firstChild;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];

    if (!child) {
      continue;
    }

    var childEl = child.el || child;

    if (childEl === traverse) {
      traverse = traverse.nextSibling;
      continue;
    }

    mount(parent, child, traverse);
  }

  while (traverse) {
    var next = traverse.nextSibling;

    unmount(parent, traverse);

    traverse = next;
  }
}

var Router = function Router (parent, Views) {
  this.el = typeof parent === 'string' ? el(parent) : parent;
  this.Views = Views;
};
Router.prototype.update = function update (route, data) {
  if (route !== this.route) {
    var Views = this.Views;
    var View = Views[route];

    this.view = View && new View();
    this.route = route;

    setChildren(this.el, [ this.view ]);
  }
  this.view && this.view.update && this.view.update(data);
};

var ServiceAjax = function ServiceAjax () {};

ServiceAjax.generateHandler = function generateHandler (httpRequest, type, url, resolve, reject) {
    return function () {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status==200) {
                if (httpRequest.response !== "") {
                    var json = JSON.parse(httpRequest.response);
                    resolve(json.body ? json.body : json);
                } else {
                    resolve();
                }
            } else {
                // TODO track progress?
                // console.log(`Error with the request ${type} ${url}: ${httpRequest.readyState}`);
            }
        } catch (exception) {
            console.log(("Error with the request " + type + ", " + url + ". " + exception));
            reject();
        }
    }
};

ServiceAjax.GET = function GET (url) {
    return new Promise(function (resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        console.log('Making a GET call to ' + url);

        httpRequest.onreadystatechange = ServiceAjax.generateHandler(httpRequest, 'GET', url, resolve, reject);
        httpRequest.open('GET', url);
        httpRequest.send();
    });
};
    
ServiceAjax.POST = function POST (url, json) {
    return new Promise(function (resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        console.log('Making a POST call to ' + url);

        var jsonToSend = JSON.stringify(json);
        httpRequest.onreadystatechange = ServiceAjax.generateHandler(httpRequest, 'POST', url, resolve, reject);
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(jsonToSend);
    });
};

var UiGenerator = function UiGenerator (uiJson, app, saveEndpoint) {
    var this$1 = this;

    console.log('Starting to build UI from the JSON:', uiJson);
        
    this.saveEndpoint = saveEndpoint ? saveEndpoint : uiJson.endpoint;
    this.generatorForm = el('form');
    mount(app, this.generatorForm);
    uiJson.ui.forEach(function (uiElementDescription) { return this$1.generateElementFromDescription(uiElementDescription); }
    );
};
    
UiGenerator.prototype.generateElementFromDescription = function generateElementFromDescription (uiElementDescription) {
        var this$1 = this;

    console.log("Element: ", uiElementDescription);
        
    var element;
    // being lazy and hardwiring from here to the body -- PoC 
    switch (uiElementDescription.html) {
        case "fieldset":
            element = el(uiElementDescription.html, { 
                legend: uiElementDescription.legend 
            });
            break
            
        case "label":
            element = el(uiElementDescription.html, { 
                    for: uiElementDescription.for 
                },
                uiElementDescription.value
            );
            break
            
        case "span":
            element = el(uiElementDescription.html, { 
                },
                uiElementDescription.value
            );
            break
                
        case "input":
            if (uiElementDescription.type === 'checkbox') {
                element = el('div', 
                    el('input', { type: 'checkbox', id: uiElementDescription.id }),
                    el('label.label-inline', { for: uiElementDescription.id }, uiElementDescription.value)
                );
            } else {
                element = el(uiElementDescription.html, { 
                    type: uiElementDescription.type
                });
            }
            break
                
        case "button":
            element = el(uiElementDescription.html, { 
                    type: uiElementDescription.type
                },
                uiElementDescription.value 
            );
                
            if (uiElementDescription.meta === 'save') {
                element.onclick = function (event) {
                    // TODO read the values for the json from the elements and send them over the product2
                    console.log('save clicked');
                    ServiceAjax.POST(this$1.saveEndpoint, { foo: 'bar' });
                };
            }
            break
            
        default:
            console.log("Unsupported element, no support yet implemented for:", uiElementDescription.html, uiElementDescription);
    }
        
    mount(this.generatorForm, element);
    if (uiElementDescription.children) {
        uiElementDescription.children
            .map(function (childElement) { return this$1.generateElementFromDescription(childElement); })
            .forEach(function (childElement) { return mount(element, childElement); });
    }
            
    return element
};

var App = function App () {
    var this$1 = this;

    this.el = el('.app',
        this.header = el('div',
            el('h2', 'PoC JSON Renderer')
        ),
        this.content = el('div')
    );
        
    // quick hack as I want to use 99% of front stuff for this PoC for both products
    // TODO This should be known by the implementator of the UI so.. Just reading it from html now so I can use and abuse UI
    var interfaceDescriptionApi = document.getElementById('GET').getAttribute('endpoint');
        
    // TODO this could be read from the metadata on the mock.json but it would mean I would have to code more for this PoC - feeling lazy ;)
    var productSaveApi = document.getElementById('POST').getAttribute('endpoint');
        
    ServiceAjax.GET(interfaceDescriptionApi)
        .then(function (uiJson) {
            this$1.content = el('div',
                this$1.ui = new UiGenerator(uiJson, app, productSaveApi)
            );
        })
        .catch(console.log);
};

var app = new App();
mount(document.body, app);

}());
