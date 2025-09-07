'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold orbe-text-primary mb-4">Contato</h1>
          <p className="text-lg text-muted-foreground">
            Entre em contato conosco. Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <div>
            <h2 className="text-2xl font-bold orbe-text-primary mb-6">Fale Conosco</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold orbe-text-primary">Email</h3>
                  <p className="text-muted-foreground">contato@orbenerd.com</p>
                  <p className="text-muted-foreground">suporte@orbenerd.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold orbe-text-primary">Telefone</h3>
                  <p className="text-muted-foreground">+55 (11) 9999-9999</p>
                  <p className="text-sm text-muted-foreground">Segunda a Sexta, 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold orbe-text-primary">Endereço</h3>
                  <p className="text-muted-foreground">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div>
            <h2 className="text-2xl font-bold orbe-text-primary mb-6">Envie uma Mensagem</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium orbe-text-primary mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium orbe-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium orbe-text-primary mb-2">
                  Assunto
                </label>
                <select className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Selecione um assunto</option>
                  <option>Suporte Técnico</option>
                  <option>Sugestão de Conteúdo</option>
                  <option>Reportar Bug</option>
                  <option>Parceria</option>
                  <option>Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium orbe-text-primary mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Descreva sua dúvida ou sugestão..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

