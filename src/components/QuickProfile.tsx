import { Card } from './ui/Card';
import { Pill } from './ui/Pill';

export function QuickProfile() {
  return (
    <section className="px-6 sm:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          
          <Card color="yellow" className="flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">Currently</div>
            <div>
              <div className="font-display text-xl font-bold mb-1">B.Des</div>
              <div className="text-neutral-700">IDC, IIT Bombay</div>
            </div>
          </Card>

          <Card color="blue" className="flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">Experience</div>
            <div>
              <div className="font-display text-xl font-bold mb-1 leading-tight">Interaction Design Intern</div>
              <div className="text-neutral-700">D. E. Shaw & Co.</div>
            </div>
          </Card>

          <Card color="green" className="flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">Interested In</div>
            <div className="flex flex-wrap gap-2">
              <Pill color="white" className="!px-3 !py-1 text-[10px]">Products</Pill>
              <Pill color="white" className="!px-3 !py-1 text-[10px]">Systems</Pill>
              <Pill color="white" className="!px-3 !py-1 text-[10px]">Interactions</Pill>
            </div>
          </Card>

          <Card color="pink" className="flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">I Like</div>
            <div className="flex flex-col gap-2">
              <span className="font-medium">Complex problems</span>
              <span className="font-medium">Good details</span>
              <span className="font-medium">Building things</span>
            </div>
          </Card>

          <Card color="grey" className="flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">I Use</div>
            <div className="flex flex-wrap gap-2">
              <Pill color="white" className="!px-3 !py-1 text-[10px]">Figma</Pill>
              <Pill color="white" className="!px-3 !py-1 text-[10px]">Code</Pill>
              <Pill color="white" className="!px-3 !py-1 text-[10px]">AI</Pill>
              <Pill color="white" className="!px-3 !py-1 text-[10px]">Prototyping</Pill>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
