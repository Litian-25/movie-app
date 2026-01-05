const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// PostgreSQL接続
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// お気に入り一覧取得（Read）
app.get('/api/favorites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM favorites ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// お気に入り追加（Create）
app.post('/api/favorites', async (req, res) => {
  const { imdbID, title, year, poster } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO favorites (imdb_id, title, year, poster) VALUES ($1, $2, $3, $4) RETURNING *',
      [imdbID, title, year, poster]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// お気に入り削除（Delete）
app.delete('/api/favorites/:imdbID', async (req, res) => {
  const { imdbID } = req.params;
  try {
    await pool.query('DELETE FROM favorites WHERE imdb_id = $1', [imdbID]);
    res.json({ message: '削除しました' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});