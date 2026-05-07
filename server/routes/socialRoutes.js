import { Router } from 'express';
import {
  syncUser,
  followUser,
  likeBar,
  visitBar,
  getFriendRecommendations,
  getTrendingBars
} from '../controllers/socialController.js';

const router = Router();

router.post('/sync-user', syncUser);
router.post('/follow', followUser);
router.post('/like', likeBar);
router.post('/visit', visitBar);

router.get('/recommendations/friends/:userId', getFriendRecommendations);
router.get('/trending', getTrendingBars);

export default router;