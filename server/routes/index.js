import { Router } from "express";

import {
  getBarsByArrondissement,
  searchBars,
} from "../controllers/barController.js";
import { getCities, getStatistics } from "../controllers/filterController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import barRoutes from "./barRoutes.js";
import filterRoutes from "./filterRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/bars", barRoutes);
router.use("/filters", filterRoutes);

router.get("/cities", asyncHandler(getCities));
router.get("/stats", asyncHandler(getStatistics));
router.get("/arrondissement/:arrondissement", asyncHandler(getBarsByArrondissement));
router.post("/search", asyncHandler(searchBars));

export default router;
