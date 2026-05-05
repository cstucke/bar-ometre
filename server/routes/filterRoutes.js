import { Router } from "express";

import { getCities, getFilters, getStatistics } from "../controllers/filterController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getFilters));
router.get("/cities", asyncHandler(getCities));
router.get("/stats", asyncHandler(getStatistics));

export default router;
