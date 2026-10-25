import { motion } from 'motion/react';
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
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { GreyWords } from './ui/GreyWords';

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
      <div id="working-with-me" className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10 overflow-visible scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* Columns 1-3: Section title "Working with me" and "it's in the works" illustration */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                Working with me
              </h2>
            </ScrollRevealTitle>

            {/* "it's in the works" illustration replacing the previous image */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="w-full max-w-[280px] sm:max-w-[320px] select-none pt-1"
            >
              <img
                src="/its_in_the_works.png"
                alt="It's in the works :P"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                loading="eager"
              />
            </motion.div>
          </div>

          {/* Columns 4-8: Principles with rectangular grey shapes instead of words (5 of 8 columns) */}
          <div className="lg:col-span-5 max-w-3xl space-y-12 sm:space-y-16">
            {principles.map((p) => (
              <article key={p.num} className="flex flex-col gap-3.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold text-neutral-400">
                    {p.num}
                  </span>
                  <GreyWords
                    text={p.title}
                    height="h-5"
                    roundness="rounded-[4px]"
                    color="bg-neutral-300"
                  />
                </div>

                <GreyWords
                  text={p.lead}
                  height="h-4"
                  roundness="rounded-[3px]"
                  color="bg-neutral-300/80"
                />

                <GreyWords
                  text={p.text}
                  height="h-3.5"
                  roundness="rounded-[3px]"
                  color="bg-neutral-200/90"
                />
              </article>
            ))}
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
