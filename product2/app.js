const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mock = require('./mock.json')
const path = require('path')

const host = process.env.HOST_PRODUCT2 ? process.env.HOST_PRODUCT2 : 'localhost'
const port = process.env.PORT_PRODUCT2 ? process.env.PORT_PRODUCT2 : 3001

const generateInterface = () => {
    // the endpoint where the content should be posted when someone wants to save it
    mock.endpoint = `${host}:${port}/extranet/interface/save`
    return mock
}

app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, '..', 'generic-client', 'public')));
app.use('/services', express.static(path.join(__dirname, '..', 'generic-client', 'public', 'services')));

app.get('/', (req, res) => {
    // NOTE only sending index.html to the root in this PoC 
    res.sendFile(path.join(__dirname, '..', 'generic-client', 'public', 'index-product2.html'))
})

// internal api for this product, for easier ui generation for the product itself - externals would post to same API
// and provide identification details
app.get('/extranet/interface/generate', (req, res) => {
    res.json(generateInterface())
})



// The APIs below we would offer outside of this product -- with apache, nginx or whatever

// we could (and should) also generate some sort of session management and/or regognition idea,
// JWT's work really well for this sort of content
// TODO validate jwt, session or hmac - what ever the method is
// TODO generate the interface and send it over
app.post('/extranet/interface/generate', (req, res) => {
    console.log('X requested extranet interface description.')
    res.json(generateInterface())
})


// This is the endpoint we would post to in this example from our client to move details to the server side of product2 and have them saved 
    
// TODO validate jwt, session or hmac - what ever the method is
// TODO save json/content that was posted 
app.post('/extranet/interface/save', (req, res) => {
    // print it for now -- this was saved from product1, yay
    console.log('X saved changes in extranet:')
    console.log(req.body)
    res.json(200).send()
})

app.listen(port, () => console.log(`product 2 running in port ${port}!`))