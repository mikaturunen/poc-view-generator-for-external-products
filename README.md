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

## Mockshot

![mockshot](https://raw.githubusercontent.com/mikaturunen/poc-view-generator-for-external-products/master/generic-client/screenshot.jpeg)

