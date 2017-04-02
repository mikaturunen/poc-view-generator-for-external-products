const express = require('express')
const bodyParser = require('body-parser')
const unirest = require('unirest')
const app = express()
const path = require('path')

const host = process.env.HOST_PRODUCT1 ? process.env.HOST_PRODUCT1 : 'localhost'
const port = process.env.PORT_PRODUCT1 ? process.env.PORT_PRODUCT1 : 3000

const hostForProduct2 = process.env.HOST_PRODUCT2 ? process.env.HOST_PRODUCT2 : 'localhost'
const portForProduct2 = process.env.PORT_PRODUCT2 ? process.env.PORT_PRODUCT2 : 3001

app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, '..', 'generic-client', 'public')));
app.use('/services', express.static(path.join(__dirname, '..', 'generic-client', 'public', 'services')));

app.get('/', (req, res) => {
    // NOTE only sending index.html to the root in this PoC 
    res.sendFile(path.join(__dirname, '..', 'generic-client', 'public', 'index-product1.html'))
})

// we could (and should) also generate some sort of session management and/or regognition idea,
// JWT's work really well for this sort of content

// TODO send generated jwt over to product2 so it knows we are actually shouting at it and asking for interface description :)
app.get('/extranet/interface', (req, res) => {
    console.log('Asking external product(s) to send extranet interface descriptions over.')
    // this is the endpoint where we can get/post the interface description from
    unirest
        .post(`http://${hostForProduct2}:${portForProduct2}/extranet/interface/generate`)
        .headers({
            'Accept': 'application/json'
        })
        .send({})
        .end(responseFromProduct2 => {
            console.log('Received extranet descriptions from external product(s).')
            
            res.json(responseFromProduct2)
        })
})

// This is the endpoint we call from product1's front to send json content to product2
// TODO send generated jwt over to product2 so it can validate it being us before accepting content and saving it
app.post('/extranet/product2/save', (req, res) => {
    // TODO we should read the endpoint from the body as it's part of the original json meta data we got in extranet/interface get call from product2, but in this PoC we'll just hard code it for now
    
    // TODO read the actual json properties in front, currently it's just sending over { foo: 'bar' } as a PoC
    
    console.log('Sending changes to external product(s):', req.body)
    unirest
        .post(`http://${hostForProduct2}:${portForProduct2}/extranet/interface/save`)
        .headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
        .send(req.body)
        .end(response => {
            console.log('All changes saved successfully.')
            res.status(200).send()
        })
})

app.listen(port, () => console.log(`product 1 running in port ${port}!`))