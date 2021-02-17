import prod from "./prod.js";
import dev from "./dev.js";
export let keys;
//zjištění, zda je aplikace ve fázi produkce, či vývoje. Podle toho jso vráceny klíče k různým externím zdrojům.
if (process.env.NODE_ENV === "production") {
   keys = prod;
} else {
   keys = dev;
}
