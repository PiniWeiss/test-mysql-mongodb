import { ObjectId } from "mongodb";

export const createOrder = async (req, res) => {
  try {
    const mongoConn = req.mongoConn;
    const productsCollection = mongoConn.collection("products");
    const product = await productsCollection.findOne({
      _id: new ObjectId(req.body.productId),
    });
    console.log(product);

    if (!product) res.status(404);
    await productsCollection.updateOne(
      { _id: new ObjectId(req.body.productId) },
      { $inc: { totalOrdersCount: 1 } }
    );
    const now = new Date();

    const newOrder = {
      productId: req.body.productId,
      quantity: req.body.quantity,
      customerName: req.body.customerName,
      totalPrice: quantity * product.price,
      orderDate: now,
    };

    const result = await req.mongoConnConn.query(
      "INSERT INTO orders (productId, quantity, customerName, totalPrice, orderDate) VALUES (?, ?, ?, ?, ?)",
      [
        newOrder.productId,
        newOrder.quantity,
        newOrder.customerName,
        newOrder.totalPrice,
        newOrder.orderDate,
      ]
    );

    const order = await req.mongoConnConn.query(
      "SELECT * FROM orders WHERE id = ?",
      [result[0].insertId]
    );
    console.log("Created successfuly.");

    res.status(201).json({ msg: "success", data: order[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};

export const getOrders = async (req, res) => {
  try {
    let results;

    await req.mongoConnConn.query("SELECT * FROM orders;");

    const ordersArr = results[0];

    res.status(200).json({ msg: "success", data: ordersArr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};
