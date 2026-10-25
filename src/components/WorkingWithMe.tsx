import {
  PenTool,
  Code2,
  Terminal,
  GitBranch,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  Cpu,
  Compass,
  Users,
  Eye,
  Play,
  Palette,
} from 'lucide-react';
import { CardSpread } from './CardSpread';
import { ScrollRevealTitle } from './ScrollRevealTitle';

export function WorkingWithMe() {
  // Retaining the two most essential core principles (2 paragraphs removed as requested)
  const principles = [
    {
      num: '01',
      title: 'Why before what, always.',
      lead: 'Understanding root constraints before pushing pixels.',
      text: 'I never jump straight into interface solutions without first dissecting the underlying friction. I ask awkward questions, unpack user mental models, and dig through business and technical constraints. When the "why" is crystal clear, interface patterns become obvious and purposeful.',
    },
    {
      num: '02',
      title: 'Code-informed prototyping.',
      lead: 'Bridging the chasm between static mockups and working code.',
      text: 'Static screens hide the tactile reality that only surfaces when humans touch an interface. Because I build functional prototypes in code, engineering remains aligned from day one. We eliminate guesswork around motion curves, state transitions, and asynchronous latency before reaching production.',
    },
  ];

  const skillCategories = [
    {
      title: 'Interaction & UX',
      skills: [
        { name: 'Design systems', icon: Layers },
        { name: 'State machines', icon: Cpu },
        { name: 'Micro-interactions', icon: Play },
        { name: 'Information architecture', icon: Compass },
      ],
    },
    {
      title: 'Code & Prototyping',
      skills: [
        { name: 'React & TypeScript', icon: Code2 },
        { name: 'Tailwind CSS', icon: Palette },
        { name: 'Framer Motion', icon: Play },
        { name: 'Vite & Next.js', icon: Terminal },
      ],
    },
    {
      title: 'Research & Strategy',
      skills: [
        { name: 'Usability testing', icon: Users },
        { name: 'Contextual inquiry', icon: Eye },
        { name: 'First principles', icon: Compass },
        { name: 'Product scoping', icon: CheckCircle2 },
      ],
    },
    {
      title: 'Everyday Stack',
      skills: [
        { name: 'Figma & FigJam', icon: PenTool },
        { name: 'Cursor & VS Code', icon: Terminal },
        { name: 'Git & GitHub', icon: GitBranch },
        { name: 'Generative AI', icon: Sparkles },
        { name: 'Linear & Notion', icon: BookOpen },
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-28 flex flex-col gap-20 sm:gap-24 lg:gap-28 overflow-visible">
      
      {/* PART 1: Working with me (counted as part of About) */}
      <div id="working-with-me" className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* Columns 1-3: Section title "Working with me" sticky until scrolled past */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                Working with me
              </h2>
            </ScrollRevealTitle>

            <div className="hidden lg:block pt-1 -ml-1">
              <CardSpread label="Studio artifacts" />
            </div>
          </div>

          {/* Columns 4-8: Principles editorial (5 of 8 columns, 2 focused paragraphs) */}
          <div className="lg:col-span-5 max-w-3xl space-y-12 sm:space-y-16">
            {principles.map((p) => (
              <article key={p.num} className="flex flex-col gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold text-neutral-400">
                    {p.num}
                  </span>
                  <h3 className="font-display text-xl font-semibold heading-gradient">
                    {p.title}
                  </h3>
                </div>

                <p className="text-sm font-medium text-neutral-800">
                  {p.lead}
                </p>

                <p className="text-base text-neutral-600 leading-relaxed font-normal">
                  {p.text}
                </p>
              </article>
            ))}

            {/* Mobile card spread display */}
            <div className="lg:hidden mt-8">
              <CardSpread label="Studio artifacts" />
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: Skills & capabilities (The dedicated Skills section) */}
      <div id="skills" className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10 pt-16 border-t border-neutral-200/50 overflow-visible scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* Columns 1-3: Title "Skills & capabilities" sticky until scrolled past */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h3 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                Skills & capabilities
              </h3>
            </ScrollRevealTitle>
          </div>

          {/* Columns 4-8: Skills categories with app icons along exact same line (5 of 8 columns) */}
          <div className="lg:col-span-5 max-w-3xl">
            <div className="grid sm:grid-cols-2 gap-8 text-xs">
              {skillCategories.map((cat) => (
                <div key={cat.title} className="flex flex-col gap-3">
                  <span className="font-semibold text-neutral-900 text-sm">
                    {cat.title}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <span
                          key={skill.name}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100/80 text-neutral-700 text-xs font-normal border border-neutral-200/40"
                        >
                          <Icon size={13} className="text-neutral-500" />
                          <span>{skill.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
