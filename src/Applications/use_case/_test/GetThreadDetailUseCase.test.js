const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-321';

    const threadDetail = new ThreadDetail({
      id: 'thread-321',
      title: 'some thread title',
      body: 'some thread body',
      date: '24-09-2023',
      username: 'user-321',
    });

    let commentDetail = [new CommentDetail({
      id: 'comment-321',
      username: 'user-321',
      content: 'some thread comment',
      date: '24-09-2023',
      is_delete: false,
    })];

    commentDetail = commentDetail
      .map(({ is_delete: Boolean, ...otherProperties }) => otherProperties);

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-321',
          username: 'user-321',
          content: 'some thread comment',
          date: '24-09-2023',
          thread_id: 'thread-321',
          is_delete: false,
        },
      ]));

    mockThreadRepository.getThreadDetailById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        {
          id: 'thread-321',
          title: 'some thread title',
          body: 'some thread body',
          date: '24-09-2023',
          username: 'user-321',
        },
      ));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadWithComments = await getThreadDetailUseCase.execute({ threadId });

    // Assert
    expect(threadWithComments).toEqual({ ...threadDetail, comments: commentDetail });
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(threadId);
  });

  it('should not show deleted comments', async () => {
    // Arrange
    const threadId = 'thread-321';

    const threadDetail = new ThreadDetail({
      id: 'thread-321',
      title: 'some thread title',
      body: 'some thread body',
      date: '24-09-2023',
      username: 'user-321',
    });

    let commentDetail = [new CommentDetail({
      id: 'comment-321',
      username: 'user-321',
      content: '**komentar telah dihapus**',
      date: '24-09-2023',
      is_delete: true,
    })];

    commentDetail = commentDetail
      .map(({ is_delete: Boolean, ...otherProperties }) => otherProperties);

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-321',
          username: 'user-321',
          content: '**komentar telah dihapus**',
          date: '24-09-2023',
          thread_id: 'thread-321',
          is_delete: true,
        },
      ]));

    mockThreadRepository.getThreadDetailById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        {
          id: 'thread-321',
          title: 'some thread title',
          body: 'some thread body',
          date: '24-09-2023',
          username: 'user-321',
        },
      ));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadWithComments = await getThreadDetailUseCase.execute({ threadId });

    // Assert
    expect(threadWithComments).toEqual(({ ...threadDetail, comments: commentDetail }));
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(threadId);
  });

  it('should handle the case when no comments are found', async () => {
    // Arrange
    const threadId = 'thread-321';

    const threadDetail = new ThreadDetail({
      id: 'thread-321',
      title: 'some thread title',
      body: 'some thread body',
      date: '24-09-2023',
      username: 'user-321',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock return value of getCommentByThreadId to simulate no comments found
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => []);

    mockThreadRepository.getThreadDetailById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        {
          id: 'thread-321',
          title: 'some thread title',
          body: 'some thread body',
          date: '24-09-2023',
          username: 'user-321',
        },
      ));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadWithComments = await getThreadDetailUseCase.execute({ threadId });

    // Assert
    expect(threadWithComments).toEqual({ ...threadDetail, comments: [] });
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(threadId);
  });
});
