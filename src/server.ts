/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import colors from 'colors';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { seedSuperAdmin } from './DB/seedAdmin';
// import { errorLogger, logger } from './shared/logger';
import { getServerIPs } from './util/getServerIPs';
import dotenv from 'dotenv';
dotenv.config();

//uncaught exception
// eslint-disable-next-line no-unused-vars
process.on('uncaughtException', _error => {
  // errorLogger.error('UnhandledException Detected', error);
  process.exit(1);
});
let server: any;
async function main() {
  try {
    mongoose.connect(config.database_url as string);
    // logger.info(colors.green('🚀 Database connected successfully'));

    //Seed Super Admin after database connection is successful
    await seedSuperAdmin();

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    server = app.listen(port, () => {
      console.log(
        `♻️  Application listening on http://${getServerIPs()}:${config.port}`
      );
      // logger.info(
      //   colors.yellow(
      //     `♻️  Application listening on http://${getServerIPs()}:${config.port}`
      //   )
      // );
    });

    //socket
    // const io = new Server(server, {
    //   pingTimeout: 60000,
    //   cors: {
    //     origin: '*',
    //   },
    // });
    // // socketHelper.socket(io);
    // initSocket(server);
    // //@ts-ignore
    // global.io = io;
  } catch (error) {
    console.log(error);
    console.log(colors.red('🤢 Failed to connect Database'));
    // errorLogger.error(colors.red('🤢 Failed to connect Database'));
  }

  //handle UnhandledRejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log('UnhandledRejection Detected', error);
        // errorLogger.error('UnhandledRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

//SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM IS RECEIVE');
  // logger.info('SIGTERM IS RECEIVE');
  if (server) {
    server.close();
  }
});
