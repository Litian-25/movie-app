import { useState } from 'react'
import MovieList from './components/MovieList';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch =  async (e) => {
    e.preventDefault();
    if(!searchTerm.trim()) return;

    setLoading(true);

    // OMDB APIから映画データを取得する処理
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`);
    const data = await response.json();

    if (data.Response === "True") {
      // APIが同じimdIDの映画を複数返す場合があるため、重複を排除
      // filterのmovie, index, selfは自分で名付けた、任意の名前
      const uniqueMovies = data.Search.filter((movie, index, resultSearch) =>
        index === resultSearch.findIndex(m => m.imdbID === movie.imdbID)
    );
      setMovieList(uniqueMovies);
    } else {
      setMovieList([]);
    }

    setLoading(false);
  }

  // お気に入り映画の重複確認、重複なしの場合追加
  const addFavorite = (movie) => {
    if (!favorites.find(fav => fav.imdbID === movie.imdbID)) {
      // スプレッド構文で既存の配列に新しい映画を追加
      setFavorites([...favorites, movie]);
    }
  }

  // filterを使用し、お気に入り映画の削除
  const removeFavorite = (movie) => {
    setFavorites(favorites.filter(fav => fav.imdbID !== movie.imdbID));
  }

  return (
    <div className="movieApp">
      <h1>🎬 Movie App</h1>
      {/* 送信ボタンが押された時の、関数呼び出し */ }
      <form onSubmit={handleSearch} className="searchForm">
        
        {/* onChangeで、inputに入力されたtarge.valueをsearchTermに連動させる */ }
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

      {/* 検索時、MovieListコンポーネントにpropsとして映画リスト、ボタンラベル、アクション関数を渡す */ }
      {/* onActionを使用し、クリックイベントが起きるまで実行されないようにしている */ }
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
