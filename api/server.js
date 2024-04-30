const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const serviceAccount = require("./serviceAccountKey.json");
require("dotenv").config();
//const jwt = require("jsonwebtoken");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://expandserver-7eb4c-default-rtdb.firebaseio.com",
});

const db = admin.database();
const app = express();
//const SECRET_KEY =
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
// This should be a long, random string stored securely

app.use(cors());
app.use(express.json());
/*
// Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer [TOKEN]

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }
    req.user = user;
    next();
  });
}*/

// Helper Functions for CRUD Operations
function getNodeData(node, res) {
  const nodeRef = db.ref(node);
  nodeRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      res.status(404).send(`${node} not found`);
    }
  });
}

function addNodeData(node, data, res) {
  const nodeRef = db.ref(node);
  nodeRef.push(data, (error) => {
    if (error) {
      res.status(500).send(`Failed to add data to ${node}`);
    } else {
      res.status(201).send(`Data added to ${node} successfully`);
    }
  });
}

function updateNodeData(node, id, data, res) {
  const nodeRef = db.ref(`${node}/${id}`);
  nodeRef.update(data, (error) => {
    if (error) {
      res.status(500).send(`Failed to update data in ${node}`);
    } else {
      res.status(200).send(`Data in ${node} updated successfully`);
    }
  });
}

function deleteNodeData(node, id, res) {
  const nodeRef = db.ref(`${node}/${id}`);
  nodeRef.remove((error) => {
    if (error) {
      res.status(500).send(`Failed to delete data from ${node}`);
    } else {
      res.status(200).send(`Data from ${node} deleted successfully`);
    }
  });
}

// Define API routes dynamically for each node
const nodes = [
  "bestseller",
  "brands",
  "carousel",
  "categories",
  "productCatalog",
  "products",
  "users",
  "wishlist",
];

nodes.forEach((node) => {
  app.get(`/${node}`, (req, res) => getNodeData(node, res));
  app.post(`/${node}`, (req, res) => addNodeData(node, req.body, res));
  app.put(`/${node}/:id`, (req, res) =>
    updateNodeData(node, req.params.id, req.body, res)
  );
  app.delete(`/${node}/:id`, (req, res) =>
    deleteNodeData(node, req.params.id, res)
  );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
