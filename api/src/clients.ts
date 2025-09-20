
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const tmdbApiKey = process.env.TMDB_API_KEY;
const igdbClientId = process.env.IGDB_CLIENT_ID;
const igdbClientSecret = process.env.IGDB_CLIENT_SECRET;

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: tmdbApiKey,
    language: 'pt-BR',
  },
});

const igdbApi = axios.create({
  baseURL: 'https://api.igdb.com/v4',
  headers: {
    'Client-ID': igdbClientId,
  },
});

const anilistApi = axios.create({
  baseURL: 'https://graphql.anilist.co',
});

let igdbAccessToken: string | null = null;

const getIgdbAccessToken = async () => {
  if (igdbAccessToken) {
    return igdbAccessToken;
  }

  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${igdbClientId}&client_secret=${igdbClientSecret}&grant_type=client_credentials`
    );
    igdbAccessToken = response.data.access_token;
    igdbApi.defaults.headers['Authorization'] = `Bearer ${igdbAccessToken}`;
    return igdbAccessToken;
  } catch (error) {
    console.error('Erro ao obter token de acesso do IGDB:', error);
    return null;
  }
};

export { tmdbApi, igdbApi, anilistApi, getIgdbAccessToken };
