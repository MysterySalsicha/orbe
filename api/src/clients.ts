import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import https from 'https';
import { MovieDb } from 'moviedb-promise';
import { logger } from './logger';

export const prisma = new PrismaClient();

const insecureAgent = new https.Agent({
  rejectUnauthorized: false,
});

const tmdbApiKey = process.env.TMDB_API_KEY;
logger.info(`TMDB_API_KEY carregada: ${tmdbApiKey ? tmdbApiKey.substring(0, 5) + '...' + tmdbApiKey.substring(tmdbApiKey.length - 5) : 'Não definida'}`);
const igdbClientId = process.env.IGDB_CLIENT_ID;
const igdbClientSecret = process.env.IGDB_CLIENT_SECRET;

// Instantiate moviedb-promise client
const tmdb = new MovieDb(tmdbApiKey || '');

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
  httpsAgent: insecureAgent, // Adicionado para ignorar erros de certificado
});

const anilistApi = axios.create({
  baseURL: 'https://graphql.anilist.co',
});

let igdbAccessToken: string | null = null;
let tmdbMovieGenres: Map<number, string> | null = null;

const getIgdbAccessToken = async () => {
  logger.info(`Tentando obter token IGDB com Client ID: ${igdbClientId ? igdbClientId.substring(0, 5) + '...' + igdbClientId.substring(igdbClientId.length - 5) : 'Não definido'} e Client Secret: ${igdbClientSecret ? igdbClientSecret.substring(0, 5) + '...' + igdbClientSecret.substring(igdbClientSecret.length - 5) : 'Não definido'}`);
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${igdbClientId}&client_secret=${igdbClientSecret}&grant_type=client_credentials`,
      null, // No data in the body
      { httpsAgent: insecureAgent }
    );
    igdbAccessToken = response.data.access_token;
    igdbApi.defaults.headers['Authorization'] = `Bearer ${igdbAccessToken}`;
    logger.info('Token IGDB obtido com sucesso.');
    return igdbAccessToken;
  } catch (error) {
    logger.error('Erro ao obter token de acesso do IGDB:', error instanceof Error ? error.message : error);
    return null;
  }
};

const getTmdbMovieGenres = async (): Promise<Map<number, string>> => {
  if (tmdbMovieGenres) {
    return tmdbMovieGenres;
  }

  try {
    const response = await tmdbApi.get('/genre/movie/list');
    tmdbMovieGenres = new Map<number, string>();
    response.data.genres.forEach((genre: { id: number; name: string }) => {
      tmdbMovieGenres?.set(genre.id, genre.name);
    });
    return tmdbMovieGenres;
  } catch (error) {
    console.error('Erro ao obter gêneros de filmes do TMDB:', error);
    return new Map<number, string>();
  }
};

async function rateLimitedPromiseAll<T>(
  tasks: (() => Promise<T>)[],
  concurrencyLimit: number,
  delayMs: number = 0 // Delay between starting new tasks
): Promise<T[]> {
  const results: T[] = [];
  const runningPromises: Promise<void>[] = [];
  let index = 0;

  const executeTask = async (task: () => Promise<T>, taskIndex: number) => {
    try {
      const result = await task();
      results[taskIndex] = result;
    } catch (error) {
      console.error(`Task ${taskIndex} failed:`, error);
      // Depending on desired behavior, you might re-throw or store the error
    }
  };

  while (index < tasks.length || runningPromises.length > 0) {
    // Start new tasks up to the concurrency limit
    while (index < tasks.length && runningPromises.length < concurrencyLimit) {
      const currentTaskIndex = index;
      const promise = executeTask(tasks[currentTaskIndex], currentTaskIndex).finally(() => {
        // Remove the promise from the running list when it settles
        const i = runningPromises.indexOf(promise);
        if (i > -1) {
          runningPromises.splice(i, 1);
        }
      });
      runningPromises.push(promise);
      index++;

      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    // If no new tasks can be started, wait for at least one running promise to complete
    if (runningPromises.length > 0) {
      await Promise.race(runningPromises);
    } else if (index < tasks.length) {
      // This case should ideally not be reached if logic is correct, but as a fallback
      await new Promise(resolve => setTimeout(resolve, 100)); // Small pause to prevent busy-waiting
    }
  }
  return results;
}

export { tmdb, tmdbApi, igdbApi, anilistApi, getIgdbAccessToken, getTmdbMovieGenres, rateLimitedPromiseAll };