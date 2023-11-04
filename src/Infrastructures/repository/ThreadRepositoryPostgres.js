const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedNewThread = require('../../Domains/threads/entities/AddedNewThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewThread(threadPayload) {
    const { title, body, owner } = threadPayload;
    const threadId = `thread-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO threads(id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [threadId, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedNewThread(result.rows[0]);
  }

  async getThreadDetailById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
              FROM threads
              INNER JOIN users ON threads.owner = users.id
              WHERE threads.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }
    return result.rows[0];
  }

  async checkThreadAvailability(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
