import "dotenv/config";
import App from "./app";

import { UserController } from "./ressources/user/user.controller";
import { EmailController } from "./ressources/emails/email.controller";

const app = new App(
  [new UserController(), new EmailController()],
  Number(process.env.PORT)
);

app.listen();
