import app from "./src/app.js";

const startServer = () => {
  const port = 3000;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
