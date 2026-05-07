// 1. Create Users
MERGE (alice:User {email: 'alice@barometre.com'})
SET alice.userId = 'u_101', 
    alice.username = 'AliceDrinks', 
    alice.createdAt = datetime()

MERGE (bob:User {email: 'bob@barometre.com'})
SET bob.userId = 'u_102', 
    bob.username = 'BobbyTables', 
    bob.createdAt = datetime()

MERGE (charlie:User {email: 'charlie@barometre.com'})
SET charlie.userId = 'u_103', 
    charlie.username = 'CharlieP', 
    charlie.createdAt = datetime()

// 2. Create Bars (Using dummy MongoDB ObjectIDs)
MERGE (bar1:Bar {mongo_id: '65f1a2b3c4d5e6f700000001'})
MERGE (bar2:Bar {mongo_id: '65f1a2b3c4d5e6f700000002'})
MERGE (bar3:Bar {mongo_id: '65f1a2b3c4d5e6f700000003'})

// 3. Create Friend Relationships (Follows)
MERGE (alice)-[:FOLLOWS]->(bob)
MERGE (alice)-[:FOLLOWS]->(charlie)
MERGE (bob)-[:FOLLOWS]->(alice)

// 4. Create Bar Interactions
// Alice likes Bar 1
MERGE (alice)-[:LIKES]->(bar1)

// Bob likes Bar 1 and Visited Bar 2
MERGE (bob)-[:LIKES]->(bar1)
MERGE (bob)-[:VISITED {visitedAt: datetime()}]->(bar2)

// Charlie likes Bar 2 and Bar 3
MERGE (charlie)-[:LIKES]->(bar2)
MERGE (charlie)-[:LIKES]->(bar3)