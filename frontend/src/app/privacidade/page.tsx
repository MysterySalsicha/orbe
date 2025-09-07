'use client';

import { Shield } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold orbe-text-primary mb-4">Política de Privacidade</h1>
          <p className="text-lg text-muted-foreground">
            Última atualização: Janeiro de 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-muted/50 rounded-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">1. Informações que Coletamos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Coletamos informações que você nos fornece diretamente, como quando cria uma conta, 
                atualiza seu perfil ou entra em contato conosco. Isso inclui nome, email, 
                preferências de conteúdo e histórico de atividades na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">2. Como Usamos suas Informações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usamos suas informações para fornecer e melhorar nossos serviços, personalizar 
                sua experiência, enviar notificações relevantes e comunicar atualizações importantes 
                sobre a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">3. Compartilhamento de Informações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros 
                para fins comerciais. Podemos compartilhar informações apenas quando necessário 
                para fornecer nossos serviços ou quando exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">4. Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usamos cookies e tecnologias similares para melhorar sua experiência, lembrar 
                suas preferências e analisar como você usa nossa plataforma. Você pode controlar 
                o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">5. Segurança dos Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para 
                proteger suas informações pessoais contra acesso não autorizado, alteração, 
                divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">6. Seus Direitos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Você tem o direito de acessar, corrigir, excluir ou portar suas informações 
                pessoais. Também pode optar por não receber comunicações de marketing. 
                Entre em contato conosco para exercer esses direitos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">7. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir 
                os propósitos descritos nesta política, a menos que um período de retenção 
                mais longo seja exigido ou permitido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">8. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                você sobre alterações significativas através da plataforma ou por email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">9. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos 
                suas informações, entre em contato conosco em privacidade@orbenerd.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

