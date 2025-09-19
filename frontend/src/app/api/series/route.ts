import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '20', 10);

  try {
    const [series, total] = await prisma.$transaction([
      prisma.serie.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.serie.count(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    const results = series.map(serie => ({
      id: serie.id,
      titulo: serie.titulo_curado,
      sinopse: serie.sinopse,
      poster: serie.poster_curado,
      data_lancamento: serie.data_lancamento_curada,
      avaliacao: serie.avaliacao,
      generos: serie.generos || [],
      plataformas: serie.plataformas_curadas || [],
      numero_temporadas: serie.numero_temporadas,
      numero_episodios: serie.numero_episodios,
      criadores: serie.criadores ? serie.criadores.split(', ') : [], // Assuming comma-separated string
      status: null, // status field is missing in prisma schema
      tipo: 'serie',
    }));

    return NextResponse.json({
      results,
      page,
      total_pages: totalPages,
      total_results: total,
    });
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    return NextResponse.json({ error: 'Erro ao buscar séries' }, { status: 500 });
  }
}
