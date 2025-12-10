// propsを分割して受け取る
function MovieCard({ movie, actionLabel, onAction }) {
  return (
    <div className="movieCard">
        {/* 映画ポスターURL, 及び映画のポスターが無い場合の代替URLをsrcで指定 */ }
        <img
         src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x220?text=No+Image"}
         alt={movie.Title}
        />
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
        <button onClick={onAction}>{actionLabel}</button>
    </div>
  );
};

export default MovieCard;