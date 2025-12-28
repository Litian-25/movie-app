import { useState, useEffect } from 'react'
import MovieList from './components/MovieList';

const API_KEY = import.meta.env.VITE_API_KEY;
// バックエンドAPIのURL（Express サーバー）
const API_URL = 'http://localhost:3001/api';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // ページ読み込み時にDBからお気に入りを取得（CRUD の Read）
  // 空の依存配列 [] = 最初の1回だけ実行
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // GETリクエスト（デフォルト）でお気に入り一覧を取得
        const response = await fetch(`${API_URL}/favorites`);
        const data = await response.json();
        
        // DBのカラム名（スネークケース）をフロント用（キャメルケース）に変換
        // 例: imdb_id → imdbID, title → Title
        const formatted = data.map(fav => ({
          imdbID: fav.imdb_id,
          Title: fav.title,
          Year: fav.year,
          Poster: fav.poster
        }));
        setFavorites(formatted);
      } catch (err) {
        // エラーが起きたらコンソールに表示（開発者ツールで確認できる）
        console.error('お気に入り取得エラー:', err);
      }
    };
    fetchFavorites();
  }, []);

  // 映画検索（OMDB API）
  const handleSearch = async (e) => {
    e.preventDefault();
    if(!searchTerm.trim()) return;

    setLoading(true);

    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`);
    const data = await response.json();

    if (data.Response === "True") {
      // 重複除去
      const uniqueMovies = data.Search.filter((movie, index, self) =>
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      );
      setMovieList(uniqueMovies);
    } else {
      setMovieList([]);
    }

    setLoading(false);
  }

  // お気に入り追加（CRUD の Create）
  const addFavorite = async (movie) => {
    // 既に追加済みなら何もしない
    if (favorites.find(fav => fav.imdbID === movie.imdbID)) return;

    try {
      // POSTリクエストでDBにデータを追加
      await fetch(`${API_URL}/favorites`, {
        method: 'POST',  // データを新規作成する時はPOST
        headers: { 'Content-Type': 'application/json' },  // JSONを送ることを伝える
        body: JSON.stringify({  // オブジェクトをJSON文字列に変換して送信
          imdbID: movie.imdbID,
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster
        })
      });
      // 成功したらフロント側のstateも更新
      setFavorites([...favorites, movie]);
    } catch (err) {
      console.error('お気に入り追加エラー:', err);
    }
  }

  // お気に入り削除（CRUD の Delete）
  const removeFavorite = async (movie) => {
    try {
      // DELETEリクエストでDBからデータを削除
      // URLに削除したいIDを含める（例: /api/favorites/tt1234567）
      await fetch(`${API_URL}/favorites/${movie.imdbID}`, {
        method: 'DELETE'  // データを削除する時はDELETE
      });
      // 成功したらフロント側のstateも更新
      setFavorites(favorites.filter(fav => fav.imdbID !== movie.imdbID));
    } catch (err) {
      console.error('お気に入り削除エラー:', err);
    }
  }

  return (
    <div className="movieApp">
      <h1>🎬 Movie App</h1>
      <form onSubmit={handleSearch} className="searchForm">
        <input
          type="text"
          placeholder="映画を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">検索</button>
      </form>

      {loading && <p>検索中...</p>}

      <h2>検索結果</h2>
      <MovieList 
        movies={movieList} 
        actionLabel="❤️お気に入りに追加" 
        onAction={addFavorite} 
      />

      <h2>❤️お気に入り({favorites.length})</h2>
      <MovieList 
        movies={favorites} 
        actionLabel="🗑️お気に入りから削除" 
        onAction={removeFavorite} 
      />
    </div>
  )
}

export default App;