const express = require("express");
const router = express.Router();
const { database } = require("../config/helpers");

/* GET ALL PRODUCTS */
router.get("/", function (req, res) {
  // Sending Page Query Parameter is mandatory http://localhost:3636/api/products?page=1
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10; // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
    startValue = page * limit - limit; // 0, 10, 20, 30
    endValue = page * limit; // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 10;
  }
  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: `c.id = p.cat_id`,
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.description",
      "p.image",
      "p.id",
    ])
    .slice(startValue, endValue)
    .sort({ id: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods,
        });
      } else {
        res.json({ message: "No products found" });
      }
    })
    .catch((err) => console.log(err));
});

/* GET single products */
router.get("/:prodId", (req, res, next) => {
  let productId = req.params.prodId;
  console.log(productId);

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: `c.id = p.cat_id`,
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.description",
      "p.image",
      "p.images",
      "p.id",
    ])
    .filter({ "p.id": productId })
    .get()
    .then((prod) => {
      if (prod) {
        res.status(200).json(prod);
      } else {
        res.json({
          message: `No products found with product id  ${productId}`,
        });
      }
    })
    .catch((err) => console.log(err));
});

/* GET ALL PRODUCTS FROM ONE PARICULAR CATEGORY */
router.get("/category/:catName", (req, res) => {

  // ดึงข้อมูล
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10; // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
    startValue = page * limit - limit; // 0, 10, 20, 30
    endValue = page * limit; // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 10;
  }


  /* Fetch the eategory name from the url */
  const cat_title = req.params.catName;

  database
    .table("products as p")
    .join([
      {
        table: "categories as c",
        on: `c.id = p.cat_id WHERE c.title LIKE ${cat_title}`
      },
    ])
    .withFields([
      "c.title as category",
      "p.title as name",
      "p.price",
      "p.quantity",
      "p.description",
      "p.image",
      "p.id",
    ])
    .slice(startValue, endValue)
    .sort({ id: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods,
        });
      } else {
        res.json({ message: "No products found" });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
