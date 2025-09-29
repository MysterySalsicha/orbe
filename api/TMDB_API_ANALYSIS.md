# Análise da Documentação da API TMDB para Filmes no Brasil

Este documento serve como um guia consolidado para entender e utilizar a API do The Movie Database (TMDB) com foco na obtenção de dados relevantes para filmes no Brasil, incluindo títulos em português e informações detalhadas de lançamento. O objetivo é fornecer um recurso de consulta rápida, evitando a necessidade de revisitar a documentação oficial da TMDB repetidamente para dados específicos.

---

## 1. Introdução

A API do TMDB é uma ferramenta poderosa para acessar uma vasta quantidade de informações sobre filmes, séries de TV, pessoas e muito mais. Esta análise se concentra nos aspectos mais relevantes para o seu projeto, especificamente na sincronização de filmes com foco no mercado brasileiro.

---

## 2. Autenticação

Para acessar a API do TMDB, é necessário obter uma chave de API (API Key).

*   **Obtenção da API Key:** Registre-se no site do TMDB (themoviedb.org) e gere uma API Key na seção de configurações da sua conta.
*   **Uso:** A API Key deve ser incluída em todas as requisições. Geralmente, é passada como um parâmetro de query (`api_key=YOUR_API_KEY`) ou como um cabeçalho de autorização, dependendo da biblioteca que você está usando.

    *No seu projeto, a `TMDB_API_KEY` é carregada de um arquivo `.env` e utilizada pela biblioteca `moviedb-promise` ou diretamente via `axios` (`tmdbApi`).*

---

## 3. Convenções Gerais e Parâmetros Comuns

A maioria dos endpoints da TMDB aceita parâmetros comuns que são cruciais para a localização e filtragem.

### `language` (ISO 639-1)

*   **Propósito:** Controla o idioma dos campos textuais (título, sinopse, tagline, etc.) retornados pela API.
*   **Formato:** Código ISO 639-1 (ex: `en-US`, `pt-BR`, `es-ES`).
*   **Comportamento:**
    *   Se uma tradução para o idioma solicitado (`pt-BR`) estiver disponível na base de dados da TMDB, o campo `title` (e outros campos textuais) será retornado nesse idioma.
    *   Se a tradução específica não estiver disponível, a TMDB pode retornar o valor no idioma original ou em um idioma padrão (geralmente `en-US`).
*   **Exemplo:** `language=pt-BR`

### `region` (ISO 3166-1)

*   **Propósito:** Filtra os resultados para incluir apenas itens que possuem uma data de lançamento no país especificado. Também afeta a ordem de alguns resultados e a disponibilidade de provedores de streaming.
*   **Formato:** Código ISO 3166-1 (ex: `US`, `BR`, `GB`).
*   **Exemplo:** `region=BR`

---

## 4. Endpoints Chave para Descoberta e Detalhes de Filmes

### 4.1. `/discover/movie` - Descoberta de Filmes

Este endpoint é ideal para encontrar filmes com base em vários critérios, como datas de lançamento, gêneros e tipos de lançamento.

*   **URL Base:** `https://api.themoviedb.org/3/discover/movie`
*   **Parâmetros Importantes:**
    *   `api_key` (obrigatório): Sua chave de API.
    *   `language` (opcional): `pt-BR` para títulos e sinopses em português.
    *   `region` (opcional): `BR` para filtrar filmes com lançamento no Brasil.
    *   `sort_by` (opcional): Como ordenar os resultados (ex: `primary_release_date.asc`, `popularity.desc`).
    *   `primary_release_date.gte` / `primary_release_date.lte`: Filtra filmes com data de lançamento primária dentro de um intervalo.
    *   `with_genres`: Filtra por IDs de gênero (separados por vírgula).
    *   `without_genres`: Exclui filmes com IDs de gênero específicos.
    *   `with_release_type`: **Crucial para o seu caso.** Filtra por tipos de lançamento.
        *   **Valores Relevantes para o Brasil (Cinema/Streaming):**
            *   `2`: Theatrical (limited) - Lançamento limitado em cinema.
            *   `3`: Theatrical (wide) - Lançamento amplo em cinema.
            *   `4`: Digital - Lançamento digital (streaming, VOD).
        *   **Uso:** Combine os tipos com `|` (OR) ou `,` (AND). Para cinema ou streaming, use `2|3|4`.
    *   `page`: Número da página dos resultados.
    *   `vote_count.gte` / `vote_average.gte`: Filtra por número mínimo de votos ou média de votos (pode ajudar a excluir conteúdo de baixa relevância).

*   **Exemplo de Requisição (com `axios`):**
    ```typescript
    tmdbApi.get('/discover/movie', {
      params: {
        api_key: YOUR_API_KEY,
        language: 'pt-BR',
        region: 'BR',
        'primary_release_date.gte': '2023-01-01',
        'primary_release_date.lte': '2023-01-31',
        sort_by: 'primary_release_date.asc',
        with_release_type: '2|3|4', // Apenas cinema ou digital no Brasil
        page: 1,
      },
    });
    ```

### 4.2. `/movie/{movie_id}` - Detalhes de um Filme

Retorna informações detalhadas sobre um filme específico.

*   **URL Base:** `https://api.themoviedb.org/3/movie/{movie_id}`
*   **Parâmetros Importantes:**
    *   `api_key` (obrigatório).
    *   `language` (opcional): `pt-BR` para detalhes localizados.
    *   `append_to_response` (opcional): Permite incluir dados de outros endpoints na mesma requisição, economizando chamadas.
        *   **Valores Relevantes:** `credits`, `videos`, `watch/providers`, `release_dates`, `translations`.
*   **Campos de Resposta Relevantes:**
    *   `id`: ID do filme no TMDB.
    *   `title`: Título localizado (se `language=pt-BR` e disponível).
    *   `original_title`: Título original.
    *   `overview`: Sinopse localizada.
    *   `release_date`: Data de lançamento primária (pode não ser a do Brasil).
    *   `genres`: Array de objetos de gênero (`id`, `name`).
    *   `poster_path`, `backdrop_path`: Caminhos para imagens.
    *   `runtime`: Duração em minutos.
    *   `imdb_id`: ID no IMDb.
    *   `vote_average`, `vote_count`, `popularity`.

### 4.3. `/movie/{movie_id}/release_dates` - Datas de Lançamento Detalhadas

Fornece informações detalhadas sobre as datas de lançamento de um filme em diferentes países e tipos.

*   **URL Base:** `https://api.themoviedb.org/3/movie/{movie_id}/release_dates`
*   **Parâmetros Importantes:**
    *   `api_key` (obrigatório).
*   **Estrutura da Resposta:**
    Um array `results`, onde cada objeto representa um país (`iso_3166_1`). Dentro de cada país, há um array `release_dates` com objetos contendo:
    *   `iso_3166_1`: Código do país (ex: `BR`).
    *   `release_dates`: Array de objetos de lançamento:
        *   `certification`: Classificação indicativa.
        *   `type`: **Tipo de lançamento.**
            *   `1`: Premiere
            *   `2`: Theatrical (limited)
            *   `3`: Theatrical (wide)
            *   `4`: Digital
            *   `5`: Physical
            *   `6`: TV
        *   `release_date`: Data e hora do lançamento.
        *   `note`: Notas adicionais.

### 4.4. `/movie/{movie_id}/watch/providers` - Onde Assistir

Retorna informações sobre provedores de streaming, aluguel e compra para um filme em diferentes regiões.

*   **URL Base:** `https://api.themoviedb.org/3/movie/{movie_id}/watch/providers`
*   **Parâmetros Importantes:**
    *   `api_key` (obrigatório).
*   **Estrutura da Resposta:**
    Um objeto `results` onde as chaves são códigos de país (ex: `BR`). Dentro de cada país, há objetos para `flatrate` (streaming), `rent` (aluguel) e `buy` (compra), cada um contendo um array de provedores.
*   **Uso:** Pode ser usado para verificar se um filme está disponível em plataformas específicas no Brasil.

### 4.5. `/movie/{movie_id}/translations` - Traduções Disponíveis

Lista todas as traduções de título, sinopse e tagline que foram criadas para um filme.

*   **URL Base:** `https://api.themoviedb.org/3/movie/{movie_id}/translations`
*   **Parâmetros Importantes:**
    *   `api_key` (obrigatório).
*   **Estrutura da Resposta:**
    Um array `translations`, onde cada objeto representa uma tradução e inclui um objeto `data` com `title`, `overview`, `homepage` traduzidos.

---

## 5. Localização de Títulos e Conteúdo (pt-BR)

### 5.1. Uso do Parâmetro `language=pt-BR`

*   **Como funciona:** Ao incluir `language=pt-BR` em suas requisições (especialmente para `/discover/movie` e `/movie/{movie_id}`), você instrui a TMDB a priorizar o retorno de dados textuais (como `title`, `overview`, `tagline`) em português do Brasil.
*   **`title` vs. `original_title`:**
    *   `title`: Conterá o título localizado para `pt-BR` *se essa tradução estiver disponível na base de dados da TMDB*.
    *   `original_title`: Sempre conterá o título no idioma original do filme.
*   **Cenário "Guerreiras do K-Pop":** Se a TMDB tiver "Guerreiras do K-Pop" cadastrado como a tradução `pt-BR` para "KPop Demon Hunters", seu script receberá "Guerreiras do K-Pop" no campo `title` ao usar `language=pt-BR`. Caso contrário, receberá o título original ou outro título padrão.
*   **Recomendação:** Sempre use `language=pt-BR` para obter a melhor localização possível.

### 5.2. Como a TMDB lida com a ausência de tradução `pt-BR`

*   A TMDB é uma base de dados colaborativa. A existência de traduções `pt-BR` depende das contribuições da comunidade.
*   Se uma tradução `pt-BR` não existir para um campo específico, a API geralmente fará um fallback para o idioma original ou para `en-US`.
*   É uma boa prática sempre verificar o `original_title` para referência e, se o `title` localizado não for satisfatório, considerar a possibilidade de que a tradução `pt-BR` não esteja disponível na TMDB.

---

## 6. Informações de Lançamento no Brasil

### 6.1. Uso do Parâmetro `region=BR`

*   **Em `/discover/movie`:** Usar `region=BR` filtra os resultados para incluir apenas filmes que possuem *algum* tipo de lançamento no Brasil. Isso é um bom ponto de partida.
*   **Em `/movie/{movie_id}/watch/providers`:** Usar `watch_region=BR` (ou o código `BR` na resposta) garante que você veja os provedores de streaming/aluguel/compra disponíveis especificamente no Brasil.

### 6.2. Tipos de Lançamento (`release_type`) e sua Relevância

O campo `type` dentro do array `release_dates` (obtido via `/movie/{movie_id}/release_dates` ou `append_to_response=release_dates`) é fundamental para determinar a relevância do lançamento.

*   **Tipos de Lançamento e Significado:**
    *   `1`: Premiere (Estreia)
    *   `2`: Theatrical (limited) - Lançamento limitado em cinema.
    *   `3`: Theatrical (wide) - Lançamento amplo em cinema.
    *   `4`: Digital - Lançamento digital (VOD, streaming).
    *   `5`: Physical - Lançamento físico (DVD, Blu-ray).
    *   `6`: TV - Lançamento na TV.
*   **Para o seu projeto (Cinema ou Streaming no Brasil):**
    *   Você deve priorizar os tipos `2`, `3` (cinema) e `4` (digital).
    *   O parâmetro `with_release_type: '2|3|4'` em `/discover/movie` é a forma mais eficiente de pré-filtrar esses filmes diretamente na API.

### 6.3. Como Interpretar os Dados de `release_dates` para o Brasil

*   Após obter os `release_dates` para um filme, você deve iterar sobre o array `results` e encontrar o objeto onde `iso_3166_1 === 'BR'`.
*   Dentro desse objeto, o array `release_dates` conterá todas as datas de lançamento para o Brasil.
*   Sua lógica atual de priorizar `type` 3, depois 2, e depois 4 é uma excelente forma de encontrar a data de lançamento mais relevante para cinema/digital no Brasil.

---

## 7. Filtragem de Conteúdo Indesejado

Mesmo com os filtros da API, a TMDB pode categorizar certos conteúdos (como shows de música, eventos, vídeos infantis) como "filmes". A filtragem adicional no seu código é essencial.

### 7.1. Estratégias Baseadas em Gêneros

*   **Identificação:** Use o campo `genres` retornado por `/movie/{movie_id}`.
*   **Exemplo de Gêneros a Excluir:** "Documentário", "Música", "Família", "Kids".
*   **Implementação:** Verifique se o array de gêneros do filme contém algum dos gêneros indesejados.

### 7.2. Estratégias Baseadas em Palavras-chave no Título

*   **Identificação:** Use o campo `title` (localizado) ou `original_title`.
*   **Exemplo de Palavras-chave a Excluir:** "Lollapalooza", "Concerto", "Show", "ABC", "Alfabeto", "Crianças", "Diana e Roma".
*   **Implementação:** Verifique se o título do filme (em minúsculas) contém alguma das palavras-chave indesejadas. Esta é uma abordagem mais "bruta" mas eficaz para conteúdos que podem não ter gêneros claros.

### 7.3. Uso de `with_release_type` (Reiteração)

*   Conforme detalhado na seção 4.1, o parâmetro `with_release_type: '2|3|4'` em `/discover/movie` é a primeira linha de defesa para garantir que você só receba filmes com tipos de lançamento relevantes para cinema ou digital no Brasil.

---

## 8. Considerações e Limitações

*   **Natureza Colaborativa da TMDB:** Os dados são mantidos por uma comunidade global. Isso significa que a disponibilidade e a precisão das traduções e informações de lançamento podem variar. Nem todo filme terá uma tradução `pt-BR` ou todas as datas de lançamento detalhadas.
*   **Rate Limits:** A API do TMDB possui limites de requisição. É crucial implementar atrasos (`delay`) entre as chamadas para evitar ser bloqueado. Seu script já faz isso.
*   **Disponibilidade de Dados:** Nem todos os filmes terão todas as informações (ex: `genres` pode estar vazio, `release_dates` para `BR` pode não existir). Seu código deve ser robusto para lidar com esses casos.
*   **Definição de "Filme":** A TMDB tem uma definição ampla de "filme" que pode incluir documentários, concertos, eventos e vídeos curtos. A filtragem no seu código é essencial para refinar essa definição para as suas necessidades.

---

Este documento deve servir como um recurso valioso para entender e otimizar a integração da API do TMDB no seu projeto, com foco nos requisitos do mercado brasileiro.
