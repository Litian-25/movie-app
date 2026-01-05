import { useState, useEffect } from "react";
import {useParams, Link} from "react-router-dom";

const API_KEY = import.meta.env.VITE_API_KEY;

function MovieDetail() {
    const {id} = useParams();
    const[movie, setMovie] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        // 映画の詳細データを取得する非同期関数を宣言
        const fetchMovie = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
            const data = await response.json();
            setMovie(data);
            setLoading(false);
        };

        // 宣言した非同期関数を使用、useEffect時に実行
        fetchMovie();
    }, [id]);
}
