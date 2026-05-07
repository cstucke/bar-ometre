// Clear existing data (WARNING: ONLY DO THIS IN DEVELOPMENT)
// MATCH (n) DETACH DELETE n;

// Create dummy users
MERGE (alice:User {userId: 'u_101', username: 'alice_in_paris'})
MERGE (bob:User {userId: 'u_102', username: 'bobby_tables'})
MERGE (charlie:User {userId: 'u_103', username: 'charlie_drinks'})

// Create dummy bars (Using random Mongo Object IDs)
MERGE (bar1:Bar {mongo_id: '65f1a2b3c4d5e6f700000001'})
MERGE (bar2:Bar {mongo_id: '65f1a2b3c4d5e6f700000002'})
MERGE (bar3:Bar {mongo_id: '65f1a2b3c4d5e6f700000003'})

// Create social connections
MERGE (alice)-[:FOLLOWS]->(bob)
MERGE (alice)-[:FOLLOWS]->(charlie)

// Create interactions
MERGE (bob)-[:LIKES]->(bar1)
MERGE (bob)-[:VISITED]->(bar2)
MERGE (charlie)-[:LIKES]->(bar2)
MERGE (charlie)-[:LIKES]->(bar3)