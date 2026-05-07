import { Router } from "express";

import {
  createEventPopup,
  deleteEventPopup,
  generateOpeningTimePopups,
  getActiveEventPopups,
  getEventPopup,
} from "../controllers/eventPopupController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getActiveEventPopups));
router.post("/", asyncHandler(createEventPopup));
router.post("/opening-times/refresh", asyncHandler(generateOpeningTimePopups));
router.get("/:barId/:eventId", asyncHandler(getEventPopup));
router.delete("/:barId/:eventId", asyncHandler(deleteEventPopup));

export default router;
