'use client';

import { FileText } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold orbe-text-primary mb-4">Termos de Uso</h1>
          <p className="text-lg text-muted-foreground">
            Última atualização: Janeiro de 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-muted/50 rounded-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e usar o Orbe Nerd, você concorda em cumprir e estar vinculado a estes 
                Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve 
                usar nosso serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Orbe Nerd é uma plataforma de agregação de informações sobre entretenimento, 
                incluindo filmes, séries, animes e jogos. Fornecemos informações, avaliações e 
                ferramentas para organizar seu consumo de mídia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">3. Conta de Usuário</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para acessar certas funcionalidades, você deve criar uma conta. Você é responsável 
                por manter a confidencialidade de suas credenciais e por todas as atividades que 
                ocorrem em sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">4. Uso Aceitável</h2>
              <p className="text-muted-foreground leading-relaxed">
                Você concorda em usar o serviço apenas para fins legais e de acordo com estes 
                termos. É proibido usar o serviço para atividades ilegais, spam, ou qualquer 
                forma de abuso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">5. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todo o conteúdo do Orbe Nerd, incluindo textos, gráficos, logos e software, 
                é propriedade nossa ou de nossos licenciadores e está protegido por leis de 
                direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">6. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Orbe Nerd é fornecido &apos;como está&apos; sem garantias de qualquer tipo. Não nos 
                responsabilizamos por danos diretos, indiretos, incidentais ou consequenciais 
                resultantes do uso do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">7. Modificações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamos o direito de modificar estes termos a qualquer momento. As alterações 
                entrarão em vigor imediatamente após a publicação. O uso continuado do serviço 
                constitui aceitação dos termos modificados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold orbe-text-primary mb-4">8. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco em 
                legal@orbenerd.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

