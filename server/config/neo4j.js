import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'neo4j://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

driver.getServerInfo()
  .then(info => console.log('Neo4j connected:', info.address))
  .catch(err => console.error('Neo4j connection error:', err));

export default driver;