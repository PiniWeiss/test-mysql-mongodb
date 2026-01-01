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

export const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await req.mongoConn
      .collection("users")
      .findOne({ username: username });

    if (!user) res.status(404).json({ error: "User not found" });
    if (user.password != password)
      res.status(401).json({ error: "password not matched." });

    delete user._id;
    delete user.password;
    delete user.createdAt;

    res.status(200).json({ msg: "success", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error: " + err.message, data: null });
  }
};
