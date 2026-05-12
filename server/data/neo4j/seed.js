import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import neo4j from 'neo4j-driver';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedNeo4j() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password')
  );

  const session = driver.session();

  try {
    const cypherPath = path.join(__dirname, 'seed.cypher');
    const rawCypher = fs.readFileSync(cypherPath, 'utf8');

    const queries = rawCypher
      .split(';')
      .map(q => q.replace(/\/\/.*$/gm, '').trim())
      .filter(q => q.length > 0);

    console.log(`Found ${queries.length} queries to execute...`);

    await session.executeWrite(async tx => {
      for (const query of queries) {
        await tx.run(query);
      }
    });

    console.log("Neo4j data successfully added!");
  } catch (error) {
    console.error("Neo4j Seeding Error:", error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedNeo4j();