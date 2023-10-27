const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkThreadAvailability(useCasePayload.threadId);
    const { content, threadId, owner } = useCasePayload;
    const newComment = new NewComment({
      content,
      threadId,
      owner,
    });

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
