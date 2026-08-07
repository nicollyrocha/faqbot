import express from "express";
import cors from "cors";

import faqRoutes from "./routes/faqRoutes";
import chatRoutes from "./routes/chatRoutes";
import interactionRoutes from "./routes/interactionRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", faqRoutes);
app.use("/chat", chatRoutes);
app.use("/", interactionRoutes);

app.use(errorHandler);

export default app;