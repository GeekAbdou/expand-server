const jsonServer = require("json-server");
const jsonServerAuth = require("json-server-auth");
const path = require("path");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Apply middlewares
server.use(middlewares);

// Set up the JSON Server router
const router = jsonServer.router(path.join(__dirname, "db.json"));

// Apply json-server-auth middleware
server.db = router.db; // Set server.db before applying json-server-auth
server.use(jsonServerAuth);

// Add URL rewriting middleware
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/products/:resource/:id/show": "/:resource/:id",
  })
);

// Use the router
server.use(router);

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
