const AddedNewThread = require('../AddedNewThread');

describe('an AddedNewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-321',
      title: 'some added new thread',
    };

    // Action and Assert
    expect(() => new AddedNewThread(payload)).toThrowError('ADDED_NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 321,
      title: 'some added new thread',
      owner: [],
    };

    // Action and Assert
    expect(() => new AddedNewThread(payload)).toThrowError('ADDED_NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedNewThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-321',
      title: 'some added new thread',
      owner: 'user-321',
    };

    // Action
    const addedNewThread = new AddedNewThread(payload);

    // Assert
    expect(addedNewThread.id).toEqual(payload.id);
    expect(addedNewThread.title).toEqual(payload.title);
    expect(addedNewThread.owner).toEqual(payload.owner);
  });
});
