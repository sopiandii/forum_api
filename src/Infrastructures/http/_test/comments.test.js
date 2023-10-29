const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('end point add comment', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should throw response code 404 when thread not found', async () => {
      // arrange
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {
          content: 'some thread comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found');
    });

    it('should throw response code 401 when no access token', async () => {
      // arrange
      const server = await createServer(container);

      const { userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some thread comment',
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should throw response code 400 when payload dinot contain needed property', async () => {
      // arrange
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: '',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'gagal membuat comment karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should throw response code 201 and persisted comment', async () => {
      // arrange
      const requestPayload = {
        content: 'some thread comment',
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should throw response code 401 when no access token', async () => {
      // arrange
      const server = await createServer(container);

      const { userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';
      const commentId = 'comment-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should throw response code 404 when thread not found', async () => {
      // arrange
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';
      const commentId = 'comment-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-not-found/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comments not found.');
    });

    it('should throw response code 403 when non owner', async () => {
      // arrange
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';
      const commentId = 'comment-321';
      const userId2 = 'user-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });
      await UsersTableTestHelper.addUser({ id: userId2 });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId2 });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Limited access!');
    });

    it('should throw response code 200 and delete comment', async () => {
      // arrange
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-321';
      const commentId = 'comment-321';

      await ThreadsTableTestHelper.addNewThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
