import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import addressRoutes from "./routes/address.routes.js";
import ratesRoutes from "./routes/rates.routes.js";
import courierRoutes from "./routes/courier.routes.js";
import packageRoutes from "./routes/package.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import returnsRoutes from "./routes/return.routes.js";
import webhooksRoutes from "./routes/webhooks.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import supportRoutes from "./routes/support.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/rates", ratesRoutes);
app.use("/api/couriers", courierRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/returns", returnsRoutes);
app.use("/api/webhooks", webhooksRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/support", supportRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
