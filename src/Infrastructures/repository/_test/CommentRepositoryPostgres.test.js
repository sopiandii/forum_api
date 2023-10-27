const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ username: 'johndoe' });
    await ThreadsTableTestHelper.addNewThread({ id: 'thread-321', owner: 'user-321' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'some thread comment',
        threadId: 'thread-321',
        owner: 'user-321',
      });

      const idGenerator = () => '321';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(addedComment.id);
      expect(comment).toHaveLength(1);
    });

    it('should return added comment object correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'some thread comment',
        threadId: 'thread-321',
        owner: 'user-321',
      });

      const idGenerator = () => '321';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-321',
        content: newComment.content,
        owner: newComment.owner,
      }));
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-321';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment[0].is_delete).toBe(true);
    });

    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-321'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comment by thread id correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentByThreadId('thread-321');

      // Assert
      expect(comment).toStrictEqual([
        {
          id: 'comment-321',
          thread_id: 'thread-321',
          owner: 'user-321',
          content: 'some thread comment',
          date: new Date('2023-09-24T17:49:42.037Z'),
          is_delete: false,
          username: 'johndoe',
        },
      ]);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return AuthorizationError when not own comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-321', 'user-123'))
        .rejects
        .toThrow(AuthorizationError);
    });

    it('should not return AuthorizationError when own comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-321', 'user-321'))
        .resolves
        .not.toThrow(AuthorizationError);
    });
  });

  describe('verifyCommentInThread function', () => {
    it('should return NotFoundError when no comment in thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addNewThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-321 ' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentInThread('comment-321', 'thread-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not return NotFoundError when there is comment in thread', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-321' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentInThread('comment-321', 'thread-321'))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });
});
