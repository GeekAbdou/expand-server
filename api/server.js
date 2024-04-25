// Import the necessary modules
const jsonServer = require("json-server");
const fs = require("fs");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Apply middlewares
server.use(middlewares);

// Asynchronously read the contents of db.json
fs.readFile("../db.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading db.json:", err);
    return;
  }
  const db = JSON.parse(data);

  // Set up the router with the parsed JSON data
  const router = jsonServer.router(db);

  // Use the router
  server.use(router);

  // Start the server
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
  });
});

// Export the Server API
module.exports = server;
