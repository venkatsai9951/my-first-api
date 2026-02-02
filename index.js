const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
const API_KEY = "my-secret-key-123";

// Dummy data
const users = [
  { id: 101, name: "Naga", email: "naga@example.com" },
  { id: 102, name: "Kriti", email: "kriti@example.com" },
];
const authenticate = (req, res, next) => {
  const userKey = req.headers["x-api-key"];
  if (userKey == API_KEY) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized acces or no api key found" });
  }
};

//these are the changes that i have made on the test branch

// GET /users?id=101
// these are the changes im making in master
// these are the changes im making in testbranch2
app.get("/users", authenticate, (req, res) => {
  const userId = parseInt(req.query.id);
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});
app.post("/users", authenticate, (req, res) => {
  const newUser = req.body;
  if (!newUser.id || !newUser.name || !newUser.email) {
    return res
      .status(400)
      .json({ error: "Missing required fields (id,name,email) " });
  }
  const exits = users.some((u) => u.id === newUser.id);
  if (exits) {
    return res
      .status(409)
      .json({ error: "User id already exits in the database" });
  }
  users.push(newUser);
  res
    .status(201)
    .json({ message: "new user has been created", user: newUser.id });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
