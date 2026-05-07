import socialService from '../services/socialService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getBarsByIds } from '../services/barService.js';

export const syncUser = asyncHandler(async (req, res) => {
  const { userId, username } = req.body;
  await socialService.syncUser(userId, username);
  res.status(200).json({ success: true, message: 'User synced to Neo4j' });
});

export const followUser = asyncHandler(async (req, res) => {
  const { followerId, followeeId } = req.body;
  await socialService.followUser(followerId, followeeId);
  res.status(200).json({ success: true, message: 'User followed successfully' });
});

export const likeBar = asyncHandler(async (req, res) => {
  const { userId, mongoId } = req.body;
  await socialService.likeBar(userId, mongoId);
  res.status(200).json({ success: true, message: 'Bar liked successfully' });
});

export const visitBar = asyncHandler(async (req, res) => {
  const { userId, mongoId } = req.body;
  await socialService.visitBar(userId, mongoId);
  res.status(200).json({ success: true, message: 'Visit logged successfully' });
});

export const getFriendRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user.userId; 
  const barIds = await socialService.getFriendRecommendations(userId);
  const fullBars = await getBarsByIds(barIds);
  res.status(200).json({ success: true, data: fullBars });
});

export const getTrendingBars = asyncHandler(async (req, res) => {
  const barIds = await socialService.getTrendingBars();
  const fullBars = await getBarsByIds(barIds);
  res.status(200).json({ success: true, data: fullBars });
});