const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://expandserver-7eb4c-default-rtdb.firebaseio.com",
});

const db = admin.database();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Function to handle GET request for any node
function getNodeData(node, res) {
  const nodeRef = db.ref(node);
  nodeRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).send(`${node} not found`);
    }
  });
}

// Function to handle POST request for any node
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

// Function to handle PUT request for any node
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

// Function to handle DELETE request for any node
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

// Generic endpoints for all nodes
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
