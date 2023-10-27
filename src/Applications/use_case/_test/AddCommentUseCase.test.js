const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'some thread comment',
      threadId: 'thread-321',
      owner: 'user-321',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-321',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.checkThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-321',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    }));
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(useCasePayload.threadId);
  });
});
