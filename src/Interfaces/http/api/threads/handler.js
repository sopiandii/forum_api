/* eslint-disable import/no-extraneous-dependencies */
const autoBind = require('auto-bind');
const AddNewThreadUseCase = require('../../../../Applications/use_case/AddNewThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials.user;
    const addNewThreadUseCase = this._container.getInstance(AddNewThreadUseCase.name);
    const addedThread = await addNewThreadUseCase.execute({ ...request.payload, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailByIdHandler(request) {
    const { threadId } = request.params;
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const thread = await getThreadDetailUseCase.execute({ threadId });

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
