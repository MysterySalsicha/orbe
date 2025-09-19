import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '20', 10);

  try {
    const [animes, total] = await prisma.$transaction([
      prisma.anime.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.anime.count(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    const results = animes.map(anime => ({
      id: anime.id,
      titulo: anime.titulo_curado,
      sinopse: anime.sinopse,
      poster: anime.poster_curado,
      data_lancamento: anime.data_lancamento_curada,
      avaliacao: anime.avaliacao,
      generos: anime.generos || [],
      plataformas: anime.plataformas_curadas || [],
      fonte: anime.fonte,
      estudio: anime.estudio,
      status_dublagem: anime.status_dublagem,
      numero_episodios: anime.numero_episodios,
      proximo_episodio: anime.proximo_episodio,
      mal_link: null, // Missing from schema
      trailer_url: null, // Missing from schema
      tags: [], // Missing from schema
      staff: [], // Missing from schema
      personagens: [], // Missing from schema
      tipo: 'anime',
    }));

    return NextResponse.json({
      results,
      page,
      total_pages: totalPages,
      total_results: total,
    });
  } catch (error) {
    console.error('Erro ao buscar animes:', error);
    return NextResponse.json({ error: 'Erro ao buscar animes' }, { status: 500 });
  }
}
