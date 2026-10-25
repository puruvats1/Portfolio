import { Card } from './ui/Card';
import { Pill } from './ui/Pill';

export function Toolkit() {
  return (
    <section className="px-6 sm:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          
          <Card color="white" className="p-8">
            <h3 className="font-display text-xl font-bold mb-6 text-neutral-400">THINK</h3>
            <div className="flex flex-col gap-3">
              <Pill color="grey">Research</Pill>
              <Pill color="grey">Problem framing</Pill>
              <Pill color="grey">Systems thinking</Pill>
              <Pill color="grey">Information architecture</Pill>
              <Pill color="grey">Synthesis</Pill>
            </div>
          </Card>

          <Card color="white" className="p-8">
            <h3 className="font-display text-xl font-bold mb-6 text-neutral-400">DESIGN</h3>
            <div className="flex flex-col gap-3 items-start">
              <Pill color="blue">Interaction</Pill>
              <Pill color="coral">UX</Pill>
              <Pill color="yellow">UI</Pill>
              <Pill color="green">Prototyping</Pill>
              <Pill color="pink">Visual design</Pill>
            </div>
          </Card>

          <Card color="white" className="p-8">
            <h3 className="font-display text-xl font-bold mb-6 text-neutral-400">BUILD</h3>
            <div className="flex flex-col gap-3 items-end">
              <Pill color="ink">Figma</Pill>
              <Pill color="ink">Framer</Pill>
              <Pill color="ink">HTML / CSS</Pill>
              <Pill color="ink">JavaScript</Pill>
              <Pill color="ink">AI-assisted development</Pill>
              <Pill color="ink">No-code tools</Pill>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
