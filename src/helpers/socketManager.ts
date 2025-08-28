// /* eslint-disable @typescript-eslint/no-explicit-any */
// import jwt from 'jsonwebtoken';
// import { Server, Socket } from 'socket.io';
// import notificationModel from '../app/modules/notification/notification.model';
// import config from '../config';
// // import Notification from '../models/notification.model';

// const SECRET_KEY = config.jwt.jwt_secret as string;

// interface AuthenticatedSocket extends Socket {
//   userId?: string;
// }

// const userSockets: Record<string, Set<string>> = {};
// let ioInstance: Server;

// export const initSocket = (server: any) => {
//   const io = new Server(server, {
//     cors: { origin: '*' },
//   });

//   io.use((socket: AuthenticatedSocket, next) => {
//     const token = socket.handshake.auth?.token;
//     if (!token) return next(new Error('Authentication required'));

//     try {
//       const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
//       socket.userId = decoded.id;
//       next();
//     } catch {
//       next(new Error('Invalid or expired token'));
//     }
//   });

//   io.on('connection', async (socket: AuthenticatedSocket) => {
//     const userId = socket.userId!;
//     console.log(`✅ User ${userId} connected with socket ID: ${socket.id}`);

//     if (!userSockets[userId]) userSockets[userId] = new Set();
//     userSockets[userId].add(socket.id);

//     // Send any unread notifications stored in DB
//     const unread = await notificationModel.find({ userId, isRead: false });
//     if (unread.length > 0) {
//       unread.forEach(notify => {
//         socket.emit(notify.event, notify.data);
//       });
//     }

//     socket.on('disconnect', () => {
//       userSockets[userId]?.delete(socket.id);
//       if (userSockets[userId]?.size === 0) delete userSockets[userId];
//       console.log(`❌ User ${userId} disconnected`);
//     });
//   });

//   ioInstance = io;
//   //? console.log('🚀 Socket.IO initialized with offline notification handling');
// };

// // Function to send a message/notification to a specific user
// export const sendDataToUser = async (
//   userId: string,
//   event: string,
//   data: any
// ) => {
//   const sockets = userSockets[userId];

//   // Always save notification in DB (offline or online)
//   //   await Notification.create({ userId, event, data });

//   // If user is online, send immediately
//   if (sockets) {
//     sockets.forEach(socketId => {
//       ioInstance.to(socketId).emit(event, data);
//     });
//   } else {
//     console.log(`📦 User ${userId} offline — notification saved`);
//   }
// };
