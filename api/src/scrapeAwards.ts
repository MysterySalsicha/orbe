import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
import axios from 'axios';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

interface AwardEntry {
  nome: string; // Nome do prêmio (ex: Oscar)
  ano: number; // Ano da premiação
  categoria: string; // Categoria (ex: Melhor Filme)
  status: 'vencedor' | 'indicado';
}

interface ScrapedAwardData {
  year: number;
  category: string;
  title: string; // Título da mídia
  status: 'vencedor' | 'indicado';
  mediaType: 'filme' | 'serie' | 'anime' | 'jogo';
}

// --- Funções de Scraping Específicas para cada prêmio ---

const scrapeOscarBestPicture = async (url: string): Promise<ScrapedAwardData[]> => {
  const scrapedAwards: ScrapedAwardData[] = [];
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let currentYear: number | null = null;
    let currentCategory: string | null = null;

    $('table.wikitable tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length === 0) return; 

      let yearCell = $(cells[0]);
      let categoryCell = $(cells[1]);
      let titleCell = $(cells[2]);

      if (yearCell.text().trim() !== '') {
        currentYear = parseInt(yearCell.text().trim().match(/\d{4}/)?.[0] || '');
      }

      if (categoryCell.text().trim() !== '') {
        currentCategory = categoryCell.text().trim();
      }

      const filmTitle = $(cells[2]).text().trim();
      const isWinner = $(cells[2]).find('b').length > 0; 

      if (currentYear && currentCategory && filmTitle) {
        scrapedAwards.push({
          year: currentYear,
          category: currentCategory,
          title: filmTitle,
          status: isWinner ? 'vencedor' : 'indicado',
          mediaType: 'filme',
        });
      }
    });

    logger.info(`Scraping da Wikipedia para Oscar de Melhor Filme concluído. ${scrapedAwards.length} entradas encontradas.`);

  } catch (error) {
    logger.error(`Erro ao fazer scraping da Wikipedia para Oscar de Melhor Filme:`, error);
  }
  return scrapedAwards;
};

const scrapeGoldenGlobeAwards = async (url: string): Promise<ScrapedAwardData[]> => {
  const scrapedAwards: ScrapedAwardData[] = [];
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let currentYear: number | null = null;
    let currentCategory: string | null = null;

    $('table.wikitable tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length === 0) return; 

      let yearCell = $(cells[0]);
      let categoryCell = $(cells[1]);
      let titleCell = $(cells[2]);

      if (yearCell.text().trim() !== '') {
        currentYear = parseInt(yearCell.text().trim().match(/\d{4}/)?.[0] || '');
      }

      if (categoryCell.text().trim() !== '') {
        currentCategory = categoryCell.text().trim();
      }

      const mediaTitle = $(cells[2]).text().trim();
      const isWinner = $(cells[2]).find('b').length > 0; 

      if (currentYear && currentCategory && mediaTitle) {
        scrapedAwards.push({
          year: currentYear,
          category: currentCategory,
          title: mediaTitle,
          status: isWinner ? 'vencedor' : 'indicado',
          mediaType: 'filme', // Assumindo filmes para Globo de Ouro por enquanto
        });
      }
    });

    logger.info(`Scraping da Wikipedia para Globo de Ouro concluído. ${scrapedAwards.length} entradas encontradas.`);

  } catch (error) {
    logger.error(`Erro ao fazer scraping da Wikipedia para Globo de Ouro:`, error);
  }
  return scrapedAwards;
};

const scrapeTheGameAwards = async (url: string): Promise<ScrapedAwardData[]> => {
  const scrapedAwards: ScrapedAwardData[] = [];
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Lógica de scraping para The Game Awards (exemplo simplificado)
    $('div.award-category').each((i, categoryDiv) => {
      const category = $(categoryDiv).find('h3').text().trim();
      const winner = $(categoryDiv).find('.winner').text().trim();
      const nominees = $(categoryDiv).find('.nominee').map((j, el) => $(el).text().trim()).get();
      const year = new Date().getFullYear(); // Assumindo ano atual ou extrair da URL

      if (category && winner) {
        scrapedAwards.push({
          year,
          category,
          title: winner,
          status: 'vencedor',
          mediaType: 'jogo',
        });
        nominees.forEach(nominee => {
          if (nominee !== winner) {
            scrapedAwards.push({
              year,
              category,
              title: nominee,
              status: 'indicado',
              mediaType: 'jogo',
            });
          }
        });
      }
    });

    logger.info(`Scraping para The Game Awards concluído. ${scrapedAwards.length} entradas encontradas.`);

  } catch (error) {
    logger.error(`Erro ao fazer scraping para The Game Awards:`, error);
  }
  return scrapedAwards;
};

// --- Função para encontrar a mídia no banco de dados (busca aproximada) ---

async function findMediaByTitle(title: string, mediaType: 'filme' | 'serie' | 'anime' | 'jogo'): Promise<any | null> {
  const searchTitle = title.toLowerCase();
  let media = null;

  switch (mediaType) {
    case 'filme':
      media = await prisma.filme.findFirst({
        where: {
          OR: [
            { title: { contains: searchTitle, mode: 'insensitive' } },
            { originalTitle: { contains: searchTitle, mode: 'insensitive' } },
          ],
        },
      });
      break;
    case 'serie':
      media = await prisma.serie.findFirst({
        where: {
          OR: [
            { name: { contains: searchTitle, mode: 'insensitive' } },
            { originalName: { contains: searchTitle, mode: 'insensitive' } },
          ],
        },
      });
      break;
    case 'anime':
      media = await prisma.anime.findFirst({
        where: {
          OR: [
            { titleRomaji: { contains: searchTitle, mode: 'insensitive' } },
            { titleEnglish: { contains: searchTitle, mode: 'insensitive' } },
            { titleNative: { contains: searchTitle, mode: 'insensitive' } },
          ],
        },
      });
      break;
    case 'jogo':
      media = await prisma.jogo.findFirst({
        where: {
          name: { contains: searchTitle, mode: 'insensitive' },
        },
      });
      break;
  }
  return media;
}

// --- Função principal do Scraper ---

export async function runAwardScraper() {
  logger.info('Iniciando Web Scraping para Premiações...');

  const allScrapedAwards: ScrapedAwardData[] = [];

  // Oscar para Filmes
  const oscarBestPictureUrl = 'https://pt.wikipedia.org/wiki/Lista_de_vencedores_e_indicados_ao_Oscar_de_melhor_filme';
  allScrapedAwards.push(...await scrapeOscarBestPicture(oscarBestPictureUrl));

  // Globo de Ouro para Filmes e Séries (Exemplo de URL)
  const goldenGlobeUrl = 'https://pt.wikipedia.org/wiki/Globo_de_Ouro_de_melhor_filme_dramático'; // URL de exemplo
  allScrapedAwards.push(...await scrapeGoldenGlobeAwards(goldenGlobeUrl));

  // The Game Awards para Jogos (Exemplo de URL)
  const theGameAwardsUrl = 'https://pt.wikipedia.org/wiki/The_Game_Awards'; // URL de exemplo
  allScrapedAwards.push(...await scrapeTheGameAwards(theGameAwardsUrl));

  for (const awardData of allScrapedAwards) {
    try {
      const media = await findMediaByTitle(awardData.title, awardData.mediaType);

      if (media) {
        let modelToUpdate: any;
        switch (awardData.mediaType) {
          case 'filme': modelToUpdate = prisma.filme; break;
          case 'serie': modelToUpdate = prisma.serie; break;
          case 'anime': modelToUpdate = prisma.anime; break;
          case 'jogo': modelToUpdate = prisma.jogo; break;
          default: continue;
        }

        const currentAwards = (media.premiacoes || []) as AwardEntry[];
        const newAwardEntry: AwardEntry = {
          nome: awardData.category.includes('Oscar') ? 'Oscar' : awardData.category.includes('Globo de Ouro') ? 'Globo de Ouro' : 'The Game Awards',
          ano: awardData.year,
          categoria: awardData.category,
          status: awardData.status,
        };
        
        // Evitar duplicatas
        if (!currentAwards.some(a => a.nome === newAwardEntry.nome && a.ano === newAwardEntry.ano && a.categoria === newAwardEntry.categoria && a.status === newAwardEntry.status)) {
          currentAwards.push(newAwardEntry);
          await modelToUpdate.update({
            where: { id: media.id },
            data: { premiacoes: currentAwards },
          });
          logger.info(`Prêmio "${newAwardEntry.nome}" (${newAwardEntry.categoria}) adicionado a "${awardData.title}".`);
        }
      } else {
        logger.warn(`Mídia "${awardData.title}" (${awardData.mediaType}, ${awardData.year}) não encontrada no banco de dados para adicionar prêmio.`);
      }
    } catch (error) {
      logger.error(`Erro ao processar prêmio para ${awardData.title} (${awardData.year}):`, error);
    }
  }

  logger.info('Web Scraping para Premiações concluído.');
  await prisma.$disconnect();
}

if (require.main === module) {
  runAwardScraper();
}