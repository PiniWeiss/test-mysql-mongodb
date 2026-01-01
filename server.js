import express from "express";
import morgan from "morgan";
import { getMysqlConn, initSqlDb } from "./utils/mysql.js";
import { initMongoDb, getMongoConn } from "./utils/mongodb.js";
import messages from "./routes/messages.js"
import users from "./routes/users.js"

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(morgan("dev"));

app.use((req, res, next) => {
  req.mysqlConn = getMysqlConn;
  req.mongoConn = getMongoConn;
  next();
});

app.use("/api/auth", users)
app.use("/api/users", users)
app.use("/api/messages", messages)

process.on("SIGINT", async () => {
  await initConnection.end();
  console.log("Mysql Connection Close");
});

app.listen(PORT, () => {
  initMongoDb();
  initSqlDb();
  console.log(`Server is running on port ${PORT}...`);
});