'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold orbe-gradient-text mb-2">
              Orbe Nerd
            </h1>
          </Link>
          <p className="text-muted-foreground">
            Crie sua conta para começar
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold orbe-text-primary mb-4">
              Página em Desenvolvimento
            </h2>
            <p className="text-muted-foreground mb-6">
              A funcionalidade de cadastro estará disponível em breve.
            </p>
            <Link
              href="/login"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

