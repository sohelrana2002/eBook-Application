import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseURI: process.env.MONGOOSE_STRING_URI,
  errorStackEnv: process.env.NODE_ENV,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};

// ---freeze method used for only read purpose----
export const config = Object.freeze(_config);
