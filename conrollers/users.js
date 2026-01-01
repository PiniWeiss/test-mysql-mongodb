export const createProduct = async (req, res) => {
  try {
    const mongoConn = req.mongoConn;
    const productsCollection = mongoConn.collection("products");

    const now = new Date();

    const newProduct = {
      name: req.body.name,
      description: req.body.description || "",
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      totalOrdersCount: req.body.totalOrdersCount,
      created_at: now,
      updated_at: now,
    };

    const result = await productsCollection.insertOne(newProduct);

    const product = await productsCollection.findOne({
      _id: result.insertedId,
    });
    res.status(201).json({ msg: "success", data: product });
  } catch (err) {
    console.error(err);
    // Handle duplicate key error (unique index violation)
    if (err.code === 11000) {
      return res.status(409).json({
        msg: "error",
        data: null,
        message: "A product with this name already exists",
      });
    }
    res.status(500).json({ msg: "error: " + err.message, data: null });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const mongoConn = req.mongoConn;
    const productsCollection = mongoConn.collection("products");

    let query = {}
    if (category) {
      query = {category:category}
    }
    let productsArr = await productsCollection.find(query).toArray();;

    res.status(200).json({ msg: "success", data: productsArr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error: " + err.message, data: null });
  }
};
