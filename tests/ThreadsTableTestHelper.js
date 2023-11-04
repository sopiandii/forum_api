/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addNewThread({
    id = 'thread-321',
    title = 'some new thread title',
    body = 'some new thread body',
    owner = 'user-321',
    date = new Date('2023-09-24T17:49:42.037Z'),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, owner],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1 = 1');
  },
};

module.exports = ThreadsTableTestHelper;
