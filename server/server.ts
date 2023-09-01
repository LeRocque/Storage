import express, {
  Express,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import workoutRouter from "./routes/workoutRouter";
import userRouter from "./routes/userRouter";

const app: Express = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/workout", workoutRouter);
app.use("/user", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(path.resolve(), "dist")));
  app.get("/*", function (_req, res) {
    res.sendFile(path.join(path.resolve(), "dist", "index.html"));
  });
}

// Catch-all error handler
app.use("*", (_req, res) => {
  console.log("Catch-All Hit");
  return res.status(404).send("This page can't be found");
});

// Global error handler
app.use((err: ErrorRequestHandler, _req: Request, res: Response) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An unknown error occurred" },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Get err goin' on ${PORT}`);
});
