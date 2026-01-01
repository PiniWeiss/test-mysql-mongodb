import { ObjectId } from "mongodb";

export const createUser = async (req, res) => {
  try {
    const mongoConn = req.mongoConn;
    const { body } = req;
    const usersCollection = mongoConn.collection("users");

    const now = new Date();

    const allUsers = usersCollection.find().toArray;

    const newUser = {
      username: body.username,
      password: body.password,
      createdAt: now,
    };

    const result = await usersCollection.insertOne(newUser);

    const user = await usersCollection.findOne({
      _id: result.insertedId,
    });
    res.status(201).json({ msg: "success", data: user });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({
        msg: "error",
        data: null,
        message: "A user with this username already exists",
      });
    }
    res.status(500).json({ msg: "error: " + err.message, data: null });
  }
};
