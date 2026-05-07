import neo4jDriver from '../config/neo4j.js';

class SocialService {
  async syncUser(userId, username) {
    const session = neo4jDriver.session();
    try {
      await session.run(
        `MERGE (u:User {userId: $userId}) SET u.username = $username RETURN u`,
        { userId, username }
      );
    } finally {
      await session.close();
    }
  }

  async followUser(followerId, followeeId) {
    const session = neo4jDriver.session();
    try {
      await session.run(
        `MATCH (u1:User {userId: $followerId}), (u2:User {userId: $followeeId})
         MERGE (u1)-[:FOLLOWS]->(u2)`,
        { followerId, followeeId }
      );
    } finally {
      await session.close();
    }
  }

  async likeBar(userId, mongoId) {
    const session = neo4jDriver.session();
    try {
      await session.run(
        `MATCH (u:User {userId: $userId})
         MERGE (b:Bar {mongo_id: $mongoId})
         MERGE (u)-[:LIKES]->(b)`,
        { userId, mongoId }
      );
    } finally {
      await session.close();
    }
  }

  async visitBar(userId, mongoId) {
    const session = neo4jDriver.session();
    try {
      await session.run(
        `MATCH (u:User {userId: $userId})
         MERGE (b:Bar {mongo_id: $mongoId})
         MERGE (u)-[v:VISITED]->(b)
         ON CREATE SET v.visitedAt = datetime()`,
        { userId, mongoId }
      );
    } finally {
      await session.close();
    }
  }

  async getFriendRecommendations(userId) {
    const session = neo4jDriver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {userId: $userId})-[:FOLLOWS]->(friend:User)-[:LIKES|VISITED]->(b:Bar)
         WHERE NOT (u)-[:LIKES|VISITED]->(b)
         RETURN b.mongo_id AS barId, count(friend) AS score
         ORDER BY score DESC LIMIT 10`,
        { userId }
      );
      return result.records.map(record => record.get('barId'));
    } finally {
      await session.close();
    }
  }

  async getTrendingBars() {
    const session = neo4jDriver.session();
    try {
      const result = await session.run(
        `MATCH (b:Bar)<-[r:LIKES|VISITED]-()
         RETURN b.mongo_id AS barId, count(r) AS score
         ORDER BY score DESC LIMIT 10`
      );
      return result.records.map(record => record.get('barId'));
    } finally {
      await session.close();
    }
  }
}

export default new SocialService();