import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'http://10.10.7.101:5000/api/v1',
};

const outputFile = './swagger-output.json';
const routes = [
  './app/modules/auth/auth.route.ts',
  './app/modules/transaction/transaction.routes.ts',
  './app/modules/user/user.route.ts',
  './app/modules/wallets/wallets.routes.ts',
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
