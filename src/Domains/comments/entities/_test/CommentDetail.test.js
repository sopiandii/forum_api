const CommentDetail = require('../CommentDetail');

describe('CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-321',
      username: 'janedoe',
      content: 'some thread comment',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 321,
      username: 'janedoe',
      date: '24-09-2023',
      content: 'some thread comment',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-321',
      username: 'janedoe',
      date: '24-09-2023',
      content: 'some thread comment',
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
  });
});
