/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-321', content = 'some thread comment', owner = 'user-321', thread_id = 'thread-321', date = new Date('2023-09-24T17:49:42.037Z'),
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, owner, thread_id, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, thread_id, date],
    };
    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  // async deleteCommentById(id) {
  //   const query = {
  //     text: 'DELETE FROM comments WHERE id = $1',
  //     values: [id],
  //   };

  //   await pool.query(query);
  // },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1 = 1');
  },
};

module.exports = CommentsTableTestHelper;
