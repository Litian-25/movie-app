import MovieCard from "./MovieCard";

function MovieList({ movies, actionLabel, onAction }){
    return (
      <div className="movieList">
        {/* mapを使用し、映画のリストを取得→表示 */ }
        {movies.map((movie) => (
            <MovieCard 
                key={movie.imdbID}
                movie={movie}
                actionLabel={actionLabel}
                onAction={() => onAction(movie)}
            />
        ))}
      </div>
    );  
};

export default MovieList;