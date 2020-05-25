const express = require("express");
const router = express.Router();
const { database } = require("../config/Helpers");

/* GET ALL ORDERS */
 router.get("/", (req, res) => {
  // orders_details ไปเก็บใน od
  database
    .table("orders_details as od")
    .join([
      // join ข้อมูลกัน
      {
        table: "orders as o", // เอา orders ไปเก็บใน ตัว o
        on: "o.id = od.order_id", // primary key ของ  orders_details เท่ากับ orders ID
      },
      {
        table: "products as p",
        on: "p.id = od.product_id", // primary key
      },
      {
        table: "users as u",
        on: "u.id = o.user_id", // primary key
      },
    ])
    .withFields(["o.id", "p.title", "p.description", "p.price", "u.username", ])
    // .filter({'o.id': orderId})
    .sort({ id: 1 })
    .getAll()
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ message: "No orders found" });
      }
    })
    .catch((err) => console.log(err));
});

router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  database
    .table("orders_details as od")
    .join([
      // join ข้อมูลกัน
      {
        table: "orders as o", // เอา orders ไปเก็บใน ตัว o
        on: "o.id = od.order_id", // primary key ของ  orders_details เท่ากับ orders ID
      },
      {
        table: "products as p",
        on: "p.id = od.product_id", // primary key
      },
      {
        table: "users as u",
        on: "u.id = o.user_id", // primary key
      },
    ])
    .withFields(["o.id", "p.title", "p.description", "p.price", "u.username" , "p.image",
    "od.quantity as quantityOrdered",])
    .filter({ "o.id": orderId })
    .getAll()
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ message: `No orders found with orderId ${orderId}` });
      }
    })
    .catch((err) => console.log(err));
}); 

// GET ALL ORDERS
// router.get("/", (req, res) => {
//   database
//     .table("orders_details as od")
//     .join([
//       {
//         table: "orders as o",
//         on: "o.id = od.order_id",
//       },
//       {
//         table: "products as p",
//         on: "p.id = od.product_id",
//       },
//       {
//         table: "users as u",
//         on: "u.id = o.user_id",
//       },
//     ])
//     .withFields(["o.id", "p.title", "p.description", "p.price", "u.username"])
//     .getAll()
//     .then((orders) => {
//       if (orders.length > 0) {
//         res.json(orders);
//       } else {
//         res.json({ message: "No orders found" });
//       }
//     })
//     .catch((err) => res.json(err));
// });

// Get Single Order
router.get("/:id", async (req, res) => {
  let orderId = req.params.id;
  console.log(orderId);

  database
    .table("orders_details as od")
    .join([
      {
        table: "orders as o",
        on: "o.id = od.order_id",
      },
      {
        table: "products as p",
        on: "p.id = od.product_id",
      },
      {
        table: "users as u",
        on: "u.id = o.user_id",
      },
    ])
    .withFields([
      "o.id",
      "p.title",
      "p.description",
      "p.price",
      "p.image",
      "od.quantity as quantityOrdered",
    ])
    .filter({ "o.id": orderId })
    .getAll()
    .then((orders) => {
      console.log(orders);
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.json({ message: "No orders found" });
      }
    })
    .catch((err) => res.json(err));
});

/*  FLACE A NEW ORDER */
router.post("/new", (req, res) => {
  
  let userId = req.body.userId;
  let products = req.body.products;
    console.log(userId);
    console.log(products);

  if (userId != null && userId > 0 && !isNaN(userId)) {
    database
      .table("orders")
      .insert({
        user_id: userId,
      })
      .then((newOrderId) => {
        if (newOrderId > 0) {
          products.forEach(async (p) => {
            let data = await database
              .table("products")
              .filter({ id: p.id })
              .withFields(["quantity"])
              .get();

            let inCart = parseInt(p.incart);

            // Deduct the number of pieces ordered from the quantity in database
            if (data.quantity > 0) {
              data.quantity = data.quantity - inCart;

              if (data.quantity < 0) {
                data.quantity = 0;
              }
            } else {
              data.quantity = 0;
            }

            // Insert order details w.r.t the newly created order Id
            database
              .table("orders_details")
              .insert({
                order_id: newOrderId,
                product_id: p.id,
                quantity: inCart,
              })
              .then((newId) => {
                database
                  .table("products")
                  .filter({ id: p.id })
                  .update({
                    quantity: data.quantity,
                  })
                  .then((successNum) => {})
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          });
        } else {
          res.json({
            message: `new order failed while adding order details`,
            success: false,
          });
        }
        res.json({
          message: `Order successfully placed with order id ${newOrderId}`,
          seccess: true,
          order_id: newOrderId,
          products: products,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.json({ message: `New order failed`, success: false });
  }
});

// Payment Gateway
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
});

module.exports = router;
