const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddNewThread = require('../../../Domains/threads/entities/AddNewThread');
const AddedNewThread = require('../../../Domains/threads/entities/AddedNewThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ username: 'johndoe' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addNewThread function', () => {
    it('should persist new thread', async () => {
      // Arrange

      const newThread = new AddNewThread({
        // id: 'thread-321',
        title: 'some new thread',
        body: 'some new thread body',
        owner: 'user-321',
      });
      const fakeIdGenerator = () => '321';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addNewThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-321');
      expect(threads).toHaveLength(1);
    });

    it('should return added new thread', async () => {
      // Arrange

      const newThread = new AddNewThread({
        // id: 'thread-321',
        title: 'some new thread',
        body: 'some new thread body',
        owner: 'user-321',
      });
      const fakeIdGenerator = () => '321';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedNewThread = await threadRepositoryPostgres.addNewThread(newThread);

      // Assert
      expect(addedNewThread).toStrictEqual(new AddedNewThread({
        id: 'thread-321',
        title: newThread.title,
        owner: newThread.owner,
      }));
    });
  });

  describe('get thread detail', () => {
    it('should get thread detail', async () => {
      // Arrange
      await ThreadsTableTestHelper.addNewThread({
        id: 'thread-321',
        title: 'some thread title',
        body: 'some thread body',
        date: new Date('2023-09-24T17:49:42.037Z'),
        owner: 'user-321',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadDetailById('thread-321');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-321',
        title: 'some thread title',
        body: 'some thread body',
        date: new Date('2023-09-24T17:49:42.037Z'),
        username: 'johndoe',
      });
    });

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.getThreadDetailById('thread-321'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('check thread availability', () => {
    it('should throw NotFoundError whet thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkThreadAvailability('thread-321'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addNewThread({ id: 'thread-321' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkThreadAvailability('thread-321'))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });
});
