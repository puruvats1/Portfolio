export function Experience() {
  const experiences = [
    {
      company: 'D. E. Shaw & Co.',
      role: 'Interaction Design Intern',
      year: '2026',
      description: null,
    },
    {
      company: 'IDC, IIT Bombay',
      role: 'Internship Coordinator',
      year: '2025–26',
      description: 'Worked with a 24-person team coordinating internships for 2,000+ students and relationships across 250+ companies and 50+ universities.',
    },
    {
      company: 'Mood Indigo, IIT Bombay',
      role: 'Creatives Coordinator',
      year: '2024',
      description: 'Conceptualized and designed visual communication across the festival and its digital touchpoints.',
    },
  ];

  return (
    <section id="experience" className="px-6 sm:px-12 py-24 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-16">Where I've been</h2>

        <div className="flex flex-col relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-neutral-100">
          {experiences.map((exp, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-12 last:mb-0">
              
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-pastel-blue text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 z-10"></div>
              
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-12 md:ml-0 md:group-even:pr-12 md:group-odd:pl-12">
                <div className="flex flex-col gap-1 mb-2">
                  <h3 className="font-display text-2xl font-bold text-ink">{exp.company}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-neutral-500 uppercase tracking-wide">
                    <span>{exp.role}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                    <span>{exp.year}</span>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-neutral-600 mt-3 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
