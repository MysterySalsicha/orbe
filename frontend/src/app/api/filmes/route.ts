import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '20', 10);

  try {
    const [filmes, total] = await prisma.$transaction([
      prisma.filme.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.filme.count(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    const results = filmes.map(filme => ({
      id: filme.id,
      titulo: filme.titulo_curado,
      sinopse: filme.sinopse,
      poster: filme.poster_curado,
      data_lancamento: filme.data_lancamento_curada,
      avaliacao: filme.avaliacao,
      generos: filme.generos || [],
      plataformas: filme.plataformas_curadas || [],
      em_cartaz: filme.em_cartaz,
      em_prevenda: filme.em_prevenda,
      duracao: filme.duracao,
      direcao: filme.direcao,
      roteiro: filme.roteiro,
      tipo: 'filme',
    }));

    return NextResponse.json({
      results,
      page,
      total_pages: totalPages,
      total_results: total,
    });
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return NextResponse.json({ error: 'Erro ao buscar filmes' }, { status: 500 });
  }
}
