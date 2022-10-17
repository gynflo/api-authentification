import "dotenv/config";
import App from "./app";

import { UserController } from "./ressources/user/user.controller";

const app = new App([new UserController()], Number(process.env.PORT));

app.listen();
