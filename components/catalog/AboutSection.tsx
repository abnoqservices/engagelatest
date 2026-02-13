'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AboutSectionProps {
  about: string;
  mission: string;
  vision: string;
}

export default function AboutSection({ about, mission, vision }: AboutSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open "About Us" by default

  const items = [
    { label: "About Us", title: "Our Story", text: about },
    { label: "Mission",   title: "What We Do",   text: mission },
    { label: "Vision",    title: "Our Future",   text: vision },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Who We Are
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Our purpose, values, and long-term aspirations
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`
                  group rounded-2xl  border-slate-200 
                  bg-white overflow-hidden shadow-sm
                  transition-all duration-300
                  ${isOpen ? ' border-amber-200/70' : ' hover:border-amber-100'}
                `}
              >
                {/* Header / Trigger */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-block rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-800">
                      {item.label}
                    </span>
                    <h3 className={`
                      text-xl sm:text-2xl font-semibold transition-colors
                      ${isOpen ? 'text-amber-800' : 'text-slate-900 group-hover:text-amber-700'}
                    `}>
                      {item.title}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`
                      h-6 w-6 text-slate-500 transition-transform duration-300
                      ${isOpen ? 'rotate-180 text-amber-600' : 'group-hover:text-amber-600'}
                    `}
                  />
                </button>

                {/* Content */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="px-6 sm:px-8 pb-7 sm:pb-9 pt-1">
                    {/* Subtle top accent line when open */}
                    {isOpen && (
                      <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-6" />
                    )}

                    <p className="text-slate-700 leading-relaxed text-[15.5px] whitespace-pre-line">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}