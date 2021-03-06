# Proof of concept

 Lasting UI level integration for several existing projects that are maintained by different groups.
 
 Product 1 and product 2 are existing products that have different teams that are not in daily interaction together and they develop their products separately. Wanting to offer services from product 2 in product 1's UI, we integrate against product 2's extranet interface description API.
 
 The api generates a description of what the UI should look like in JSON format. This will allow the product 1 to only create one integration and a simple renderer that will programmatically iterate over the interface description, render it and send the responses back that the end customer has done to product 2 from product 1's domain.
 
 This way we can easily white label the product 2 into product 1's domain. This will also minimize the integration and bug hunting as it's always machine read and will allow for easy change management and all new features will automatically be enabled on the UI when product 2 finishes them.
 
 The only obvious drawback from this method is that the product1 cannot make any super elaborate and dynamic interfaces from the machine read interface description but that's totally acceptable at this point as the main focus is on the quality of the integration and delivering the basic functionality to the customer from clean and functional interfaces.
 
## Running

Both products in this PoC are just minimal node.js applications that require a node.js >= 6.1.0 to be installed. 

```bash
#terminal1
cd product1
npm install
node app.js

#terminal2
cd product2
npm install
node app.js
``` 

Navigate to `localhost:3000` to open up Product 1 and have it call for Product 2's JSON interface description and render UI based on it. Navigate to `localhost:3001` to open up Product 2 and have it use the same JSON interface description to render the UI. 

The PoC also contains a generic-view renderer built with `RE:DOM` (while I was playing with the PoC I decided to test out a new framework :smile:). Both of the products use the same renderer as I was lazy. Nothing special there, really. Just loads the UI JSON with a single REST call and renders view based on it. Would be even better to do it on server side to allow cache's to properly cache the view (if we want to optimize it).

## Mockshot

Product1 is showing both it's own UI and the UI from Product2. Product2 is only showing its own UI.

Based on the rough idea from [product2/mock.json](https://github.com/mikaturunen/poc-view-generator-for-external-products/blob/master/product2/interface-mock.json).

![mockshot](https://raw.githubusercontent.com/mikaturunen/poc-view-generator-for-external-products/master/generic-client/screen1.png)

---

![mockshot](https://raw.githubusercontent.com/mikaturunen/poc-view-generator-for-external-products/master/generic-client/screen2.png)

