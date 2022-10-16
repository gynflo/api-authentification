import "dotenv/config";
import App from "./app";

console.log(process.env.PORT);

const app = new App(Number(process.env.PORT));

app.listen();
