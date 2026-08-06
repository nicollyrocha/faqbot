import express = require("express");

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "API running" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});