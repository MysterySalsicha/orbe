import time
import logging
import schedule

from .sync_modulos.sync_filmes import sync_filmes
from .sync_modulos.sync_series import sync_series
from .sync_modulos.sync_animes import sync_animes
from .sync_modulos.sync_jogos import sync_jogos

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("data_sync.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("data_sync")

def run_sync():
    """Executa todas as sincronizações e loga um resumo."""
    logger.info("Iniciando processo de sincronização completa...")
    
    novos_filmes, filmes_atualizados = sync_filmes()
    logger.info(f"Resumo Filmes: {novos_filmes} novos, {filmes_atualizados} atualizados.")
    time.sleep(5)
    
    novas_series, series_atualizadas = sync_series()
    logger.info(f"Resumo Séries: {novas_series} novas, {series_atualizadas} atualizadas.")
    time.sleep(5)
    
    novos_animes, animes_atualizados = sync_animes()
    logger.info(f"Resumo Animes: {novos_animes} novos, {animes_atualizados} atualizados.")
    time.sleep(5)
    
    novos_jogos, jogos_atualizados = sync_jogos()
    logger.info(f"Resumo Jogos: {novos_jogos} novos, {jogos_atualizados} atualizados.")
    
    logger.info("Processo de sincronização completa finalizado.")

def setup_schedule():
    """Configura o agendamento das sincronizações"""
    schedule.every().day.at("03:00").do(run_sync)
    schedule.every().day.at("09:00").do(sync_filmes)
    schedule.every().day.at("15:00").do(sync_series)
    schedule.every().day.at("21:00").do(sync_animes)
    schedule.every().day.at("00:00").do(sync_jogos)
    logger.info("Agendamento de sincronização configurado")

def main():
    """Função principal"""
    logger.info("Iniciando serviço de sincronização de dados")
    run_sync()
    setup_schedule()
    logger.info("Iniciando loop de agendamento")
    while True:
        try:
            schedule.run_pending()
            time.sleep(60)
        except KeyboardInterrupt:
            logger.info("Serviço de sincronização interrompido pelo usuário")
            break
        except Exception as e:
            logger.error(f"Erro no loop principal: {e}")
            time.sleep(300)

if __name__ == "__main__":
    main()