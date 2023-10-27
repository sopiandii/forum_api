const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'jwt_token',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadDetailByIdHandler,
  },
]);

module.exports = routes;
