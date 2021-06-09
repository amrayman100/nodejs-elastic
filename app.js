const http = require("http");
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });
const department = require("./queries/department");
const orders = require("./queries/orders");
const express = require("express");
const app = express();
const port = 5000;
const winston = require("winston");
const ecsFormat = require("@elastic/ecs-winston-format");

const logger = winston.createLogger({
  format: ecsFormat(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./var/log/logF.log" }),
  ],
});

app.use(express.json());
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/get", async (req, res) => {
  const result = await client
    .get({
      index: "products",
      id: "100",
    })
    .then((data) => {
      res.send(data.body._source);
    })
    .catch((err) => {
      res.send("Not Found");
      console.log(err);
      logger.error("ERROR", { err });
    });
});

app.post("/newProduct", async (req, res) => {
  let newProduct = {
    name: "Microwave",
    price: 64,
    in_stock: 10,
    type: "Appliance",
  };
  console.log(req.body);
  await client
    .index({
      index: "products",
      body: req.body,
    })
    .then((data) => {
      logger.info("INFO - PRODUCT_ADDED ", req.body);
      res.send(data);
    })
    .catch((err) => {
      res.send("error 404");
      console.log(err);
      logger.error("ERROR", { err });
    });
});

app.get("/reviews", async (req, res) => {
  let searchQuery = {
    query: {
      match_all: {},
    },
  };
  let result = await client
    .search({
      index: "reviews",
      body: searchQuery,
    })
    .then((data) => {
      res.send(data.body.hits.hits);
    })
    .catch((err) => {
      res.send("Not Found");
      console.log(err);
      logger.error("ERROR", { err });
    });
});

app.get("/products", async (req, res) => {
  let searchQuery = {
    query: {
      terms: {
        "tags.keyword": ["Soup", "Cake"],
      },
    },
  };
  let result = await client
    .search({
      index: "products",
      body: searchQuery,
    })
    .then((data) => {
      res.send(data.body.hits.hits);
    })
    .catch((err) => {
      res.send("Not Found");
      logger.error("ERROR", { err });
      console.log(err);
    });
});

app.get("/developmentEmployees", async (req, res) => {
  let result = await client
    .search({
      index: "department",
      body: department.developmentEmployees,
      _source: ["name", "age", "gender"],
    })
    .then((data) => {
      res.send(data.body.hits.hits);
    })
    .catch((err) => {
      res.send("Not Found");
      logger.error("ERROR", { err });
      console.log(err);
    });
});

app.get("/orderStats", async (req, res) => {
  let result = await client
    .search({
      index: "order",
      body: orders.orderStats,
    })
    .then((data) => {
      res.send(data.body.aggregations.status_terms);
      logger.info("INFO - PRODUCT_ADDED ", data.body.aggregations.status_terms);
    })
    .catch((err) => {
      logger.error("ERROR", { err });
      res.send("Not Found");
      console.log(err);
    });
});

app.get("/productsSearch", function (req, res) {
  let body = {
    size: 200,
    from: 0,
    query: {
      match: {
        name: {
          query: req.query["q"],
          fuzziness: "auto",
        },
      },
    },
  };
  // perform the actual search passing in the index, the search query and the type
  client
    .search({ index: "products", body: body })
    .then((results) => {
      res.send(results.body.hits.hits);
      logger.info("INFO - PRODUCT_ADDED ", {
        searchTerm: req.query["q"]
      });
    })
    .catch((err) => {
      console.log(err);
      logger.error("ERROR", { err });
      res.send([]);
    });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
