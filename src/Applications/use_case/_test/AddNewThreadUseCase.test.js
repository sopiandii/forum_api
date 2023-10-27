const AddNewThread = require('../../../Domains/threads/entities/AddNewThread');
const AddedNewThread = require('../../../Domains/threads/entities/AddedNewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddNewThreadUseCase = require('../AddNewThreadUseCase');

describe('AddNewThreadUseCase', () => {
  it('should orchestrating the add new thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'some new thread title',
      body: 'some new thread body',
      owner: 'user-321',
    };
    const mockAddedThread = new AddedNewThread({
      id: 'thread-321',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addNewThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddNewThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedNewThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedNewThread).toStrictEqual(new AddedNewThread({
      id: 'thread-321',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.addNewThread).toBeCalledWith(new AddNewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
