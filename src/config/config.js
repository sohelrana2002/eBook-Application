import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseURI: process.env.MONGOOSE_STRING_URI,
};

// ---freeze method used for only read purpose----
export const config = Object.freeze(_config);
