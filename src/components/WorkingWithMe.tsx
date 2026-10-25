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
import { motion } from 'motion/react';
import { CardSpread } from './CardSpread';
import { ScrollRevealTitle } from './ScrollRevealTitle';

export function WorkingWithMe() {
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
    {
      num: '03',
      title: 'Complexity is a playground.',
      lead: 'Finding the hidden structure inside dense domains.',
      text: 'I naturally thrive in dense spaces like finance terminals, spatial tools, and developer platforms. I enjoy taking dozens of competing variables and structuring them into clear hierarchy, ensuring power users keep their operational speed without overwhelming newcomers.',
    },
    {
      num: '04',
      title: 'Radical clarity, zero preciousness.',
      lead: 'Design as an ongoing, transparent team dialogue.',
      text: 'Great work requires honest communication and zero ego. I communicate design rationale clearly, document systems thoroughly, and discard my own ideas without hesitation when a better solution emerges from team critique.',
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
    <section id="working-with-me" className="pt-24 pb-24 lg:pt-32 lg:pb-32 flex flex-col gap-28">
      
      {/* PART 1: Working with me */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columns 1-4: Section title "Working with me" sticky until scrolled past */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                Working with me
              </h2>
            </ScrollRevealTitle>

            <div className="hidden lg:block pt-1">
              <CardSpread label="Studio artifacts" />
            </div>
          </div>

          {/* Columns 5-12: Principles editorial */}
          <div className="lg:col-span-8 max-w-3xl space-y-16">
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

      {/* PART 2: Skills & capabilities */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 pt-16 border-t border-neutral-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columns 1-4: Title "Skills & capabilities" sticky until scrolled past */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h3 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                Skills & capabilities
              </h3>
            </ScrollRevealTitle>
          </div>

          {/* Columns 5-12: Skills categories with app icons along exact same line */}
          <div className="lg:col-span-8 max-w-3xl">
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
