const AddNewThread = require('../../Domains/threads/entities/AddNewThread');

class AddNewThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addNewThread = new AddNewThread(useCasePayload);
    return this._threadRepository.addNewThread(addNewThread);
  }
}

module.exports = AddNewThreadUseCase;
