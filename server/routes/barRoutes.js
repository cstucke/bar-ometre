import { Router } from "express";

import {
  getBarById,
  getBars,
  getBarsByArrondissement,
  getBarsByCity,
  searchBars,
} from "../controllers/barController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getBars));
router.get("/search", asyncHandler(searchBars));
router.post("/search", asyncHandler(searchBars));
router.get("/city/:city", asyncHandler(getBarsByCity));
router.get("/arrondissement/:arrondissement", asyncHandler(getBarsByArrondissement));
router.get("/:id", asyncHandler(getBarById));

export default router;
