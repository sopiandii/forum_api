/* eslint-disable import/no-extraneous-dependencies */
const autoBind = require('auto-bind');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials.user;
    const { threadId } = request.params;
    const { content } = request.payload;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ content, threadId, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const { id: owner } = request.auth.credentials.user;
    const { threadId } = request.params;
    const { commentId } = request.params;

    const payload = {
      commentId, threadId, owner,
    };

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute(payload);

    const response = {
      status: 'success',
    };

    return response;
  }
}

module.exports = CommentsHandler;
