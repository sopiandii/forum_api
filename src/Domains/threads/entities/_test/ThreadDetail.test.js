const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-321',
      title: 'some thread title',
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 321,
      title: 'some thread title',
      body: 'some thread body',
      date: '24-09-2023',
      username: {},
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-321',
      title: 'some thread title',
      body: 'some thread body',
      date: '24-09-2023',
      username: 'user-321',
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
  });
});
