export async function createMessage(req, res) {
  try {
    const { username, password, message, cipherType } = req.body;

    const user = await req.mongoConn
      .collection("users")
      .findOne({ username: username });

    if (!user) res.status(404).json({ error: "User not found" });
    if (user.password != password)
      res.status(401).json({ error: "password not matched." });

    let encryptedText;
    if (cipherType === "reverse") {
      encryptedText = message.split("").reverse().join("").toUpperCase();
    }

    const result = await req.mysqlConn.execute(
      "INSERT INTO messages (username, cipher_type, encrypted_text) VALUES (?, ?, ?)",
      [username, cipherType, encryptedText]
    );

    await req.mongoConn
      .collection("users")
      .updateOne(
        { username: username },
        { $inc: { encryptedMessagesCount: 1 } }
      );
    const newMessage = await req.mysqlConn.execute(
      "SELECT * FROM messages WHERE id=?",
      [result[0].insertId]
    );

    delete newMessage[0][0].username;
    delete newMessage[0][0].inserted_at;

    res.status(201).json({
      message: "Message created successfuly.",
      data: newMessage[0][0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
}

export async function getDecryptMessage(req, res) {
  try {
    const { username, password, messageId } = req.body;
    const intMessageId = parseInt(messageId);

    const user = await req.mongoConn
      .collection("users")
      .findOne({ username: username });

    const message = await req.mysqlConn.execute(
      "SELECT * FROM messages WHERE id=?",
      [intMessageId]
    );

    if (!message[0][0]) res.status(404).json({ error: "Message not found" });
    if (!user) res.status(404).json({ error: "User not found" });
    if (user.password != password)
      res.status(401).json({ error: "password not matched." });

    const decryptedText = message[0][0].encrypted_text
      .split("")
      .reverse()
      .join("")
      .toLowerCase();

    res.status(200).json({
      id: intMessageId,
      decryptedText: decryptedText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
}
