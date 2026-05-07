import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import neo4jDriver from '../config/neo4j.js';


export async function registerUser(username, email, password) {
    const session = neo4jDriver.session();
    try {
      const checkUser = await session.run(
        `MATCH (u:User {email: $email}) RETURN u`,
        { email }
      );
      if (checkUser.records.length > 0) {
        throw new Error('User already exists with this email');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userId = uuidv4();

      const result = await session.run(
        `CREATE (u:User {
          userId: $userId, 
          username: $username, 
          email: $email, 
          password: $hashedPassword,
          createdAt: datetime()
        }) 
        RETURN u.userId AS userId, u.username AS username`,
        { userId, username, email, hashedPassword }
      );

      const user = result.records[0];
      return this.generateToken(user.get('userId'), user.get('username'));
    } finally {
      await session.close();
    }
};

export async function loginUser(email, password) {
    const session = neo4jDriver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {email: $email}) 
         RETURN u.userId AS userId, u.username AS username, u.password AS password`,
        { email }
      );

      if (result.records.length === 0) {
        throw new Error('Invalid credentials');
      }

      const userRecord = result.records[0];
      const hashedPassword = userRecord.get('password');

      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      return this.generateToken(userRecord.get('userId'), userRecord.get('username'));
    } finally {
      await session.close();
    }
};

export function generateToken(userId, username) {
    return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
};
