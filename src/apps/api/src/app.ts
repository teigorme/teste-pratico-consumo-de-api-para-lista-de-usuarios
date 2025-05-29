import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/routes";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use("/api", router);
app.get("/", (request, response) => {
  response.status(200).json({ message: "Good Luck" });
});

export default app;
