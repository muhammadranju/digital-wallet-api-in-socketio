import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { logger } from '../shared/logger';

type AuthenticatedSocket = {
  user?: { id: string; role: string };
} & Socket;
const socket = (io: Server) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(colors.blue('A user connected'));

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
