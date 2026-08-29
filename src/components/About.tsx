import React, { useEffect, useRef } from 'react';
import { Lightbulb, Rocket } from 'lucide-react';

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealEls = sectionRef.current?.querySelectorAll('.reveal');
    revealEls?.forEach((el) => observer.observe(el));

    // Light up nodes sequentially
    const nodeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nodes = nodesRef.current?.querySelectorAll('.signal-node');
            nodes?.forEach((node, idx) => {
              setTimeout(() => node.classList.add('lit'), idx * 220);
            });
            nodeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    if (nodesRef.current) nodeObserver.observe(nodesRef.current);

    return () => { observer.disconnect(); nodeObserver.disconnect(); };
  }, []);

  return (
    <section id="signal" ref={sectionRef} className="relative py-24 px-4 bg-signal overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="reveal">
          <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-8">
            The Signal Ignites
          </span>

          <h2 className="font-display text-3xl sm:text-5xl text-smoke uppercase leading-tight mb-6 text-shadow-sm">
            One Day. Every Discipline. One Arena.
          </h2>

          <p className="font-body text-base sm:text-lg text-cream max-w-3xl mx-auto leading-relaxed">
            VYUGAM 2.0 is a one-day arena built for <strong className="text-marigold font-bold">builders, problem-solvers, designers, and presenters.</strong>{' '}
            Five challenge tracks. One relentless clock. Students arrive with half-finished ideas and leave with
            finished momentum — sharper skills, sharper teams, and a result they can point to.
            This isn't a seminar to sit through. It's a signal to answer.
          </p>
        </div>

        {/* About Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left reveal">
          <div className="bg-carbon border-2 border-marigold p-7 shadow-[6px_6px_0_#7A0606] hover:-translate-y-1 hover:shadow-[8px_8px_0_#C1121F] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="w-6 h-6 text-marigold" />
              <h3 className="font-heading font-extrabold text-xl text-marigold uppercase tracking-wider">
                About VYUGAM 2.0
              </h3>
            </div>
            <p className="font-body text-sm sm:text-base text-cream leading-relaxed">
              VYUGAM 2.0 is a premier technical symposium organized by the Department of Information Technology to showcase innovation, creativity, and technical excellence. It brings together students from across institutions to compete, collaborate, and celebrate technological advancement.
            </p>
          </div>

          <div className="bg-carbon border-2 border-marigold p-7 shadow-[6px_6px_0_#7A0606] hover:-translate-y-1 hover:shadow-[8px_8px_0_#C1121F] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="w-6 h-6 text-marigold" />
              <h3 className="font-heading font-extrabold text-xl text-marigold uppercase tracking-wider">
                About IT Department
              </h3>
            </div>
            <p className="font-body text-sm sm:text-base text-cream leading-relaxed">
              The Department of Information Technology at P.A. College of Engineering and Technology is committed to fostering technical expertise and innovation. We provide a platform for students to develop cutting-edge solutions and build industry-ready skills through practical hands-on experiences.
            </p>
          </div>
        </div>

        {/* Signal Nodes */}
        <div ref={nodesRef} className="flex justify-center gap-10 sm:gap-16 mt-14 flex-wrap">
          {['Compete', 'Collaborate', 'Build', 'Ship'].map((label) => (
            <div key={label} className="signal-node flex flex-col items-center gap-2 opacity-[0.35] transition-all duration-500">
              <div className="w-4 h-4 rounded-full bg-carbon border-2 border-marigold transition-all duration-500" />
              <span className="font-mono text-xs uppercase tracking-widest text-mustard">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .signal-node.lit { opacity: 1; }
        .signal-node.lit > div:first-child {
          background: #FF4A12;
          box-shadow: 0 0 16px 4px rgba(255,74,18,0.65);
        }
      `}</style>
    </section>
  );
};
