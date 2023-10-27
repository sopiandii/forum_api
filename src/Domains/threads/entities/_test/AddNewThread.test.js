const AddNewThread = require('../AddNewThread');

describe('an AddNewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'some new thread',
    };

    // Action and Assert
    expect(() => new AddNewThread(payload)).toThrowError('ADD_NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      // id: 12345,
      title: 123,
      body: true,
      owner: {},
    };

    // Action and Assert
    expect(() => new AddNewThread(payload)).toThrowError('ADD_NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddNewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'some new thread',
      body: 'some new thread body',
      owner: 'user-321',
    };

    // Action
    const addNewThread = new AddNewThread(payload);

    // Assert
    expect(addNewThread.title).toEqual(payload.title);
    expect(addNewThread.body).toEqual(payload.body);
    expect(addNewThread.owner).toEqual(payload.owner);
  });
});
