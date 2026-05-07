import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  followUser,
  likeBar,
  visitBar,
  getFriendRecommendations,
  getTrendingBars,
  syncUser
} from '../controllers/socialController.js';

const router = Router();

router.post('/sync-user', protect, syncUser);
router.post('/follow', protect, followUser);
router.post('/like', protect, likeBar);
router.post('/visit', protect, visitBar);

router.get('/recommendations/friends', protect, getFriendRecommendations);
router.get('/trending', getTrendingBars);

export default router;