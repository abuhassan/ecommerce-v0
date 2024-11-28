import { register } from "ts-node";
import { fileURLToPath } from "url";
import { dirname } from "path";

register();

const __dirname = dirname(fileURLToPath(import.meta.url));
import(`${__dirname}/seed.ts`);
