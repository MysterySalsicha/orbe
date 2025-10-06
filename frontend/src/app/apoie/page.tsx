'use client';

import { useState } from 'react';
import { Heart, Coffee, Star, Trophy, Gift, CreditCard, Copy, Check } from 'lucide-react';

export default function ApoiePage() {
  const [copiedPix, setCopiedPix] = useState(false);
  const pixKey = 'orbenerd@exemplo.com';

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const beneficios = [
    {
      icon: <Coffee className="h-6 w-6 text-amber-600" />,
      title: 'Apoiador Básico',
      valor: 'R$ 5,00',
      beneficios: [
        'Badge exclusivo no perfil',
        'Acesso antecipado a novos recursos',
        'Nome na lista de apoiadores'
      ]
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: 'Apoiador Estrela',
      valor: 'R$ 15,00',
      beneficios: [
        'Todos os benefícios do nível Básico',
        'Temas exclusivos para a interface',
        'Sem anúncios na plataforma'
      ]
    },
    {
      icon: <Trophy className="h-6 w-6 text-amber-400" />,
      title: 'Apoiador Premium',
      valor: 'R$ 30,00',
      beneficios: [
        'Todos os benefícios anteriores',
        'Acesso a estatísticas avançadas',
        'Participação em sorteios mensais',
        'Voto em novas funcionalidades'
      ]
    }
  ];

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Em Desenvolvimento</h1>
    </div>
    // <div className="container mx-auto px-4 py-12">
    //   <div className="text-center mb-12">
    //     <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
    //       <Heart className="h-8 w-8 text-rose-500 mr-2" />
    //       Apoie o Orbe Nerd
    //     </h1>
    //     <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
    //       Ajude-nos a manter o Orbe Nerd funcionando e crescendo com sua contribuição.
    //       Cada apoio faz diferença para continuarmos trazendo o melhor conteúdo nerd para você!
    //     </p>
    //   </div>

    //   <div className="grid md:grid-cols-2 gap-12 mb-16">
    //     <div className="bg-card rounded-lg p-8 shadow-md">
    //       <h2 className="text-2xl font-bold mb-4">Por que apoiar?</h2>
    //       <ul className="space-y-4">
    //         <li className="flex items-start">
    //           <Heart className="h-5 w-5 text-rose-500 mr-2 mt-1 flex-shrink-0" />
    //           <span>
    //             <strong className="font-medium">Mantenha o projeto vivo:</strong> Seu apoio ajuda a cobrir custos de servidores, APIs e desenvolvimento.
    //           </span>
    //         </li>
    //         <li className="flex items-start">
    //           <Heart className="h-5 w-5 text-rose-500 mr-2 mt-1 flex-shrink-0" />
    //           <span>
    //             <strong className="font-medium">Novas funcionalidades:</strong> Contribua para que possamos implementar novos recursos e melhorias.
    //           </span>
    //         </li>
    //         <li className="flex items-start">
    //           <Heart className="h-5 w-5 text-rose-500 mr-2 mt-1 flex-shrink-0" />
    //           <span>
    //             <strong className="font-medium">Comunidade independente:</strong> Ajude a manter nossa plataforma livre de anúncios invasivos.
    //           </span>
    //         </li>
    //         <li className="flex items-start">
    //           <Heart className="h-5 w-5 text-rose-500 mr-2 mt-1 flex-shrink-0" />
    //           <span>
    //             <strong className="font-medium">Conteúdo de qualidade:</strong> Apoie a curadoria e organização do melhor conteúdo nerd.
    //           </span>
    //         </li>
    //       </ul>
    //     </div>

    //     <div className="bg-card rounded-lg p-8 shadow-md">
    //       <h2 className="text-2xl font-bold mb-4">Como apoiar</h2>
          
    //       <div className="space-y-6">
    //         <div>
    //           <h3 className="text-xl font-medium mb-2 flex items-center">
    //             <CreditCard className="h-5 w-5 mr-2" />
    //             PIX
    //           </h3>
    //           <div className="bg-muted p-4 rounded-md flex items-center justify-between">
    //             <span className="font-mono">{pixKey}</span>
    //             <button 
    //               onClick={copyPixKey}
    //               className="p-2 hover:bg-background rounded-md transition-colors"
    //               title="Copiar chave PIX"
    //             >
    //               {copiedPix ? (
    //                 <Check className="h-5 w-5 text-green-500" />
    //               ) : (
    //                 <Copy className="h-5 w-5" />
    //               )}
    //             </button>
    //           </div>
    //         </div>

    //         <div>
    //           <h3 className="text-xl font-medium mb-2 flex items-center">
    //             <Gift className="h-5 w-5 mr-2" />
    //             Assinatura mensal
    //           </h3>
    //           <p className="text-muted-foreground mb-2">
    //             Torne-se um apoiador recorrente e desfrute de benefícios exclusivos!
    //           </p>
    //           <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
    //             Assinar mensalmente
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <h2 className="text-3xl font-bold text-center mb-8">Níveis de Apoio</h2>
    //   <div className="grid md:grid-cols-3 gap-6">
    //     {beneficios.map((nivel, index) => (
    //       <div key={index} className="bg-card rounded-lg p-6 shadow-md border border-border hover:border-primary transition-colors">
    //         <div className="flex items-center mb-4">
    //           {nivel.icon}
    //           <h3 className="text-xl font-bold ml-2">{nivel.title}</h3>
    //         </div>
    //         <div className="text-2xl font-bold text-primary mb-4">{nivel.valor}</div>
    //         <ul className="space-y-2">
    //           {nivel.beneficios.map((beneficio, idx) => (
    //             <li key={idx} className="flex items-start">
    //               <Heart className="h-4 w-4 text-rose-500 mr-2 mt-1 flex-shrink-0" />
    //               <span>{beneficio}</span>
    //             </li>
    //           ))}
    //         </ul>
    //         <button className="w-full mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
    //           Tornar-se {nivel.title}
    //         </button>
    //       </div>
    //     ))}
    //   </div>

    //   <div className="mt-16 text-center">
    //     <h2 className="text-2xl font-bold mb-4">Nossos Apoiadores</h2>
    //     <p className="text-muted-foreground mb-8">
    //       Agradecemos a todos que contribuem para manter o Orbe Nerd funcionando!
    //     </p>
    //     <div className="flex flex-wrap justify-center gap-4">
    //       {/* Lista de apoiadores fictícios */}
    //       {['Ana S.', 'Carlos M.', 'Juliana R.', 'Pedro H.', 'Mariana L.', 'Lucas G.'].map((nome, index) => (
    //         <div key={index} className="bg-muted px-4 py-2 rounded-full flex items-center">
    //           <Heart className="h-4 w-4 text-rose-500 mr-2" />
    //           {nome}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>

  );
}