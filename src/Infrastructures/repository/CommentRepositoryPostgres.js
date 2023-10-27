const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(commentPayload) {
    const { content, threadId, owner } = commentPayload;
    const commentId = `comment-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO comments(id, content, thread_id, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [commentId, content, threadId, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comments not found.');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.*, users.username FROM comments
              INNER JOIN users ON comments.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY comments.date ASC`,
      values: [threadId],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new AuthorizationError('Limited access!');
    }
  }

  async verifyCommentInThread(commentId, threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Comments not found.');
    }
  }
}

module.exports = CommentRepositoryPostgres;
