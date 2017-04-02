
export class ServiceAjax {
    static generateHandler (httpRequest, type, url, resolve, reject) {
        return () => {
            try {
                if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status==200) {
                    if (httpRequest.response !== "") {
                        const json = JSON.parse(httpRequest.response)
                        resolve(json.body ? json.body : json)
                    } else {
                        resolve()
                    }
                } else {
                    // TODO track progress?
                    // console.log(`Error with the request ${type} ${url}: ${httpRequest.readyState}`);
                }
            } catch (exception) {
                console.log(`Error with the request ${type}, ${url}. ${exception}`)
                reject()
            }
        }
    }

    static GET (url) {
        return new Promise((resolve, reject) => {
            const httpRequest = new XMLHttpRequest()
            console.log('Making a GET call to ' + url)

            httpRequest.onreadystatechange = ServiceAjax.generateHandler(httpRequest, 'GET', url, resolve, reject)
            httpRequest.open('GET', url)
            httpRequest.send()
        });
    }
    
    static POST (url, json) {
        return new Promise((resolve, reject) => {
            const httpRequest = new XMLHttpRequest()
            console.log('Making a POST call to ' + url)

            const jsonToSend = JSON.stringify(json)
            httpRequest.onreadystatechange = ServiceAjax.generateHandler(httpRequest, 'POST', url, resolve, reject)
            httpRequest.open('POST', url, true)
            httpRequest.setRequestHeader("Content-type", "application/json");
            httpRequest.send(jsonToSend)
        });
    }
}
