// api/server.js
const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const rewrite = require("http-rewrite-middleware").getMiddleware;

const handler = (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // For rewriting routes
  const rewriter = rewrite([
    {
      from: "^/api/(.*)$",
      to: "/$1",
    },
    {
      from: "^/product/(.*)/([0-9]+)/show$",
      to: "/$1/$2",
    },
  ]);
  rewriter(req, res, () => {
    // If no match, pass request to JSON Server
    router(req, res);
  });
};

module.exports = handler;
