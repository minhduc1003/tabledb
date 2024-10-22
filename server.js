const jsonServer = require("json-server");
const http = require("http");
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());

const rawData = fs.readFileSync("db.json");
const database = JSON.parse(rawData);

app.use(cors());
app.options("*", (_, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// app.use("/api", jsonServer.defaults(), jsonServer.router("db.json"));
app.get("/api/table", (req, res) => {
  const { skip, take } = req.query; // Default take to 10 for better pagination
  let startIndex;
  if (skip == 0) {
    startIndex = 0;
  } else {
    startIndex = (skip - 1) * parseInt(take);
  }
  const endIndex = startIndex + parseInt(take);
  let filteredTable;
  if (skip && take) {
    filteredTable = database.table.rows.slice(startIndex, endIndex);
  } else {
    filteredTable = database.table.rows;
  }
  const data = {
    rows: filteredTable,
    total: database.table.total_count,
  };
  res.json(data);
});

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
