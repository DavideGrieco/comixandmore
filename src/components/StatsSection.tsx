'use client';
import { useEffect, useRef, useState } from 'react';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

const STATS: StatItem[] = [
  { label: 'Giochi da Tavolo', value: 100, suffix: '+' },
  { label: 'Anni di Attività', value: 5, suffix: '+' },
  { label: 'Eventi Annuali', value: 50, suffix: '+' },
];

export default function StatsSection() {
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0));
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const start = performance.now();

    function update() {
      const now = performance.now();
      const progress = Math.min(1, (now - start) / duration);
      setCounts(STATS.map((s) => Math.floor(s.value * progress)));
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }, [visible]);

  return (
    <section ref={sectionRef} className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center" data-aos="fade-up">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-5xl font-extrabold text-brand-yellow">
                {counts[i]}
                {stat.suffix}
              </p>
              <p className="text-lg text-gray-200 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
