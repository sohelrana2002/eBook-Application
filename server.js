import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDatabase from "./src/config/db.js";

const startServer = async () => {
  await connectDatabase();

  const port = config.port || 3001;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
