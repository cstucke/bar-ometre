import { Router } from "express";

import {
  getBarsByArrondissement,
  searchBars,
} from "../controllers/barController.js";
import { getCities, getStatistics } from "../controllers/filterController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import barRoutes from "./barRoutes.js";
import eventPopupRoutes from "./eventPopupRoutes.js";
import filterRoutes from "./filterRoutes.js";
import healthRoutes from "./healthRoutes.js";
import socialRoutes from "./socialRoutes.js";
import authRoutes from './authRoutes.js';

const router = Router();

router.use("/health", healthRoutes);
router.use("/bars", barRoutes);
router.use("/event-popups", eventPopupRoutes);
router.use("/filters", filterRoutes);
router.use("/social", socialRoutes);
router.use("/auth", authRoutes);

router.get("/cities", asyncHandler(getCities));
router.get("/stats", asyncHandler(getStatistics));
router.get("/arrondissement/:arrondissement", asyncHandler(getBarsByArrondissement));
router.post("/search", asyncHandler(searchBars));

export default router;
