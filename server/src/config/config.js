import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseURI: process.env.MONGOOSE_STRING_URI,
  errorStackEnv: process.env.NODE_ENV,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallBackURL: process.env.GOOGLE_CALLBACK_URL,
  frontEndBaseURL: process.env.FRONTEND_BASE_URL,
  backEndBaseURL: process.env.BACKEND_BASE_URL,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  groqAPIKey: process.env.GROQ_API_KEY,
};

// ---freeze method used for only read purpose----
export const config = Object.freeze(_config);
