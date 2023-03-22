
import helpers from "./src/helpers";
import * as hbs from "hbs";

for(let key in helpers){
    hbs.registerHelper(key, helpers[key]);
}