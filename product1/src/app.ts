
process.on("uncaughtException", (reason: string, p: any) => {
    // Note: https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
    console.log("Unhandled Rejection at: Promise", p, "reason: ", reason);
})

import * as express from "express";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as path from "path";
import * as parseurl from "parseurl"

const app = express();

const port = process.env["SERVER_PORT"] ? process.env["SERVER_PORT"] : 3000;

app.use(bodyParser.json());

app.use(session({
    secret: `ss:router:layer new '/' +0ms express:router:route new '/pdf/:user' +0ms`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        
    }
}));

// Decided to run on top of heroku, so we'll use experss to serve our files and let heroku front loadbalance our content
app.use(express.static(path.join(__dirname, "../../client")));
// Otherwise express will be shit and advertise itself to the attackers in response headers
// - who tought this was a good idea? REALLY? 
app.disable("x-powered-by");

//app.get("/", (req: express.Request, res: express.Response) => res.json({}));
app.get("/pdf/:user/:style", (req: express.Request, res: express.Response) => res.json({}));
app.post("/pdf/:user", (req: express.Request, res: express.Response) => res.json(req.body.cv));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

 