import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseURI: process.env.MONGOOSE_STRING_URI,
  errorStackEnv: process.env.NODE_ENV,
};

// ---freeze method used for only read purpose----
export const config = Object.freeze(_config);
