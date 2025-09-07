'use client';

import { HelpCircle, Mail, MessageCircle, Book } from 'lucide-react';

export default function AjudaPage() {
  const faqItems = [
    {
      question: "Como posso adicionar filmes à minha lista?",
      answer: "Clique no ícone de menu (três pontos) em qualquer card de filme e selecione 'Quero Assistir' ou 'Favoritar'."
    },
    {
      question: "Como funciona o sistema de notificações?",
      answer: "Você receberá notificações sobre lançamentos de filmes, séries e animes que estão em suas listas."
    },
    {
      question: "Posso usar o Orbe Nerd offline?",
      answer: "Algumas funcionalidades básicas funcionam offline, mas é necessária conexão para atualizações de conteúdo."
    },
    {
      question: "Como alterar o tema da interface?",
      answer: "Use o botão de alternância de tema no header para alternar entre claro, escuro ou automático."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold orbe-text-primary mb-4">Central de Ajuda</h1>
          <p className="text-lg text-muted-foreground">
            Encontre respostas para suas dúvidas sobre o Orbe Nerd
          </p>
        </div>

        {/* Links Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <Book className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold orbe-text-primary mb-2">Guia do Usuário</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Aprenda a usar todas as funcionalidades
            </p>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Ver Guia
            </button>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold orbe-text-primary mb-2">Chat ao Vivo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fale conosco em tempo real
            </p>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Iniciar Chat
            </button>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold orbe-text-primary mb-2">Contato</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Envie sua dúvida por email
            </p>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Enviar Email
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold orbe-text-primary mb-6">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold orbe-text-primary mb-3">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

