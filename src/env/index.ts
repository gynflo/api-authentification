import fs from "fs";
import path from "path";

export const key = fs.readFileSync(path.join(__dirname, "./keys/jwtRS256.key"));
export const keyPub = fs.readFileSync(
  path.join(__dirname, "./keys/jwtRS256.key.pub")
);
