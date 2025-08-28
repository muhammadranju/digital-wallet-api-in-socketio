// import colors from 'colors';
// import { Server, Socket } from 'socket.io';
// import { logger } from '../shared/logger';
// import { handleWalletSocketAction } from './socketActions';

// type AuthenticatedSocket = Socket & {
//   user?: { id: string; role: string; socket: string };
// };

// const socket = (io: Server) => {
//   io.on('connection', (socket: AuthenticatedSocket) => {
//     logger.info(colors.blue('A user connected'));
//     const userSid = socket.id;

//     socket.on('add-money', data =>
//       handleWalletSocketAction(socket, userSid, 'add-money-notify', data)
//     );

//     socket.on('withdraw', data =>
//       handleWalletSocketAction(socket, userSid, 'withdraw-notify', data)
//     );

//     socket.on('send-money', data =>
//       handleWalletSocketAction(socket, userSid, 'send-money-notify', data)
//     );

//     socket.on('disconnect', () => {
//       logger.info(colors.red('A user disconnected'));
//     });
//   });
// };

// export const socketHelper = { socket };
