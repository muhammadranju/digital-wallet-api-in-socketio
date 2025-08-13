/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';

const SECRET_KEY = config.jwt.jwt_secret as string;

// Extend the Socket type to include userId
interface AuthenticatedSocket extends Socket {
  userId?: string;
}

// Store active socket IDs for each user
const userSockets: Record<string, Set<string>> = {};

// Singleton instance
let ioInstance: Server;

export const initSocket=(server: any) =>{
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`✅ User ${userId} connected with socket ID: ${socket.id}`);

    if (!userSockets[userId]) userSockets[userId] = new Set();
    userSockets[userId].add(socket.id);

    socket.on('disconnect', () => {
      userSockets[userId]?.delete(socket.id);
      if (userSockets[userId]?.size === 0) delete userSockets[userId];
      console.log(`❌ User ${userId} disconnected`);
    });
  });

  ioInstance = io;
  console.log('🚀 Socket.IO initialized');
}

// Function to send a message to a specific user
export const  sendDataToUser=(userId: string, event: string, data: any)=> {
  const sockets = userSockets[userId];
  if (!sockets) return console.log(`⚠️ No active sockets for user ${userId}`);

  sockets.forEach(socketId => {
    ioInstance.to(socketId).emit(event, data);
  });
}
