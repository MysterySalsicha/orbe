import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '20', 10);

  try {
    const [jogos, total] = await prisma.$transaction([
      prisma.jogo.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.jogo.count(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    const results = jogos.map(jogo => ({
      id: jogo.id,
      titulo: jogo.titulo_curado,
      sinopse: jogo.sinopse,
      poster: jogo.poster_curado,
      data_lancamento: jogo.data_lancamento_curada,
      avaliacao: jogo.avaliacao,
      generos: jogo.generos || [],
      plataformas: jogo.plataformas_curadas || [],
      desenvolvedores: jogo.desenvolvedores ? jogo.desenvolvedores.split(', ') : [],
      publicadoras: jogo.publicadoras ? jogo.publicadoras.split(', ') : [],
      lojas_digitais: {}, // Missing from schema
      tipo: 'jogo',
    }));

    return NextResponse.json({
      results,
      page,
      total_pages: totalPages,
      total_results: total,
    });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return NextResponse.json({ error: 'Erro ao buscar jogos' }, { status: 500 });
  }
}
