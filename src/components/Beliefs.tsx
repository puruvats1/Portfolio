import { Card } from './ui/Card';

export function Beliefs() {
  const beliefs = [
    {
      title: 'Why before what',
      description: 'I like understanding the underlying problem before deciding what to make.',
      color: 'blue' as const,
    },
    {
      title: 'Complexity ≠ Confusion',
      description: 'I enjoy messy problems. The goal is to find the structure inside them.',
      color: 'yellow' as const,
    },
    {
      title: 'Make to understand',
      description: 'Some ideas only become clear once you start building them.',
      color: 'pink' as const,
    },
    {
      title: 'Details matter',
      description: 'Small interactions often determine whether something feels considered.',
      color: 'soft-green' as const,
    },
    {
      title: 'Design × Engineering',
      description: 'I like staying close to implementation and understanding how an idea behaves when it becomes real.',
      color: 'lavender' as const,
    },
  ];

  return (
    <section id="beliefs" className="px-6 sm:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-12">Things I believe</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beliefs.map((belief, index) => (
            <Card key={index} color={belief.color === 'soft-green' ? 'green' : belief.color} className="p-8 sm:p-10 flex flex-col justify-between aspect-[4/3] group cursor-default">
              <h3 className="font-display text-2xl font-bold mb-8 uppercase tracking-wide group-hover:scale-105 origin-left transition-transform duration-300">{belief.title}</h3>
              <p className="text-lg text-neutral-800 leading-relaxed max-w-sm">
                {belief.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
