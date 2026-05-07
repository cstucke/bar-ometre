import socialService from '../services/socialService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const syncUser = asyncHandler(async (req, res) => {
  const { userId, username } = req.body;
  await socialService.syncUser(userId, username);
  res.status(200).json({ success: true, message: 'User synced to Neo4j' });
});

const followUser = asyncHandler(async (req, res) => {
  const { followerId, followeeId } = req.body;
  await socialService.followUser(followerId, followeeId);
  res.status(200).json({ success: true, message: 'User followed successfully' });
});

const likeBar = asyncHandler(async (req, res) => {
  const { userId, mongoId } = req.body;
  await socialService.likeBar(userId, mongoId);
  res.status(200).json({ success: true, message: 'Bar liked successfully' });
});

const visitBar = asyncHandler(async (req, res) => {
  const { userId, mongoId } = req.body;
  await socialService.visitBar(userId, mongoId);
  res.status(200).json({ success: true, message: 'Visit logged successfully' });
});

const getFriendRecommendations = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const barIds = await socialService.getFriendRecommendations(userId);
  res.status(200).json({ success: true, data: barIds });
});

const getTrendingBars = asyncHandler(async (req, res) => {
  const barIds = await socialService.getTrendingBars();
  res.status(200).json({ success: true, data: barIds });
});

export {
  syncUser,
  followUser,
  likeBar,
  visitBar,
  getFriendRecommendations,
  getTrendingBars
};