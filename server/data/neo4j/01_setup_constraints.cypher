// 1. User IDs are make unique and indexed for fast lookups
CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.userId IS UNIQUE;

// 2. Bar Mongo IDs are make unique and indexed
CREATE CONSTRAINT bar_mongo_id_unique IF NOT EXISTS FOR (b:Bar) REQUIRE b.mongo_id IS UNIQUE;

// 3. Create an index on the username for a faster text searching
CREATE INDEX user_username_index IF NOT EXISTS FOR (u:User) ON (u.username);