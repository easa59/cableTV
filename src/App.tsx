/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';
import { ArrowUpRight, Plus, Mail } from 'lucide-react';

const BOOKING_URL = 'https://cal.com/ayyub59/20-minute-intro-call';
const EMAIL_URL = 'mailto:easa59@gmail.com';
const EMAIL_ADDRESS = 'easa59@gmail.com';

// Magnetic Button Component
function MagneticButton({
  children,
  href,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion || !buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.22;
    const y = (clientY - (top + height / 2)) * 0.22;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.5 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center font-medium whitespace-nowrap cursor-pointer transition-shadow ${className}`}
    >
      {children}
    </motion.a>
  );
}

// Fallback Rich Panel for missing images
function RichFallbackPanel({ number, title }: { number: string; title: string }) {
  return (
    <div className="relative w-full h-full min-h-[260px] bg-gradient-to-br from-[#1C2430] via-[#1F2B3B] to-[#E08A1E]/80 flex flex-col justify-between p-8 overflow-hidden rounded-[24px]">
      <div className="film-grain" />
      <div className="relative z-10 flex justify-between items-start">
        <span className="text-xs uppercase tracking-widest text-[#F7F1E6]/70 font-semibold font-sans">
          Cable Cash Flow
        </span>
        <span className="font-serif text-2xl text-[#E08A1E] italic">AK</span>
      </div>

      <div className="relative z-10 my-auto text-center py-4">
        <span className="outline-serif font-serif text-[100px] md:text-[130px] font-normal leading-none block select-none">
          {number}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-sm text-[#F7F1E6]/90 font-medium font-sans">{title}</p>
      </div>
    </div>
  );
}

// Word-by-word lighted up problem sentence
function ProblemWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: any;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const color = useTransform(
    progress,
    range,
    ['rgba(247, 241, 230, 0.25)', 'rgba(247, 241, 230, 1)']
  );

  return (
    <motion.span style={{ opacity, color }} className="inline-block mr-[0.28em] transition-colors">
      {word}
    </motion.span>
  );
}

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const [topBarTheme, setTopBarTheme] = useState<'transparent' | 'cream' | 'ink'>('transparent');
  const [activeTab, setActiveTab] = useState<'without' | 'with'>('without');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showMobileSticky, setShowMobileSticky] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for Top Bar & mobile sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.offsetHeight || 600;

      // Mobile sticky bar appears after hero
      setShowMobileSticky(scrollY > heroHeight - 120);

      // Determine top bar theme based on intersecting dark (ink) sections
      const inkSections = document.querySelectorAll<HTMLElement>('[data-theme="ink"]');
      let isOverInk = false;
      const topBarY = scrollY + 40;

      inkSections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (topBarY >= top && topBarY <= bottom) {
          isOverInk = true;
        }
      });

      if (isOverInk) {
        setTopBarTheme('ink');
      } else if (scrollY > 50) {
        setTopBarTheme('cream');
      } else {
        setTopBarTheme('transparent');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll transforms for the problem sentence
  const { scrollYProgress: problemScroll } = useScroll({
    target: problemRef,
    offset: ['start 85%', 'end 40%'],
  });

  const problemSentence =
    'Every month ends with notebooks on the table, cash counted by hand, phone calls to find out which families paid, and the nagging question of which house still owes.';
  const words = problemSentence.split(' ');

  // Horizontal scroll in pinned section (Desktop)
  const { scrollYProgress: pinnedScroll } = useScroll({
    target: pinnedSectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothPinnedScroll = useSpring(pinnedScroll, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Calculate horizontal shift: 3 cards, shift by ~66% of container
  const horizontalX = useTransform(smoothPinnedScroll, [0, 1], ['0%', '-66.6%']);

  // Vertical fill for How We Start line
  const { scrollYProgress: stepsScroll } = useScroll({
    target: stepsRef,
    offset: ['start 75%', 'end 65%'],
  });
  const stepLineFill = useTransform(stepsScroll, [0, 1], ['0%', '100%']);

  // Parallax for Hero arch photo
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const archParallax = useTransform(heroScroll, [0, 1], ['0px', '45px']);

  const whatISetUpCards = [
    {
      number: '01',
      title: 'Collection form on the phone',
      hasImage: false,
      today: 'Your collection boy writes names in a notebook and cash gets counted at the end of the day.',
      withUs: 'His collection boy fills a form on the phone when cash comes in.',
    },
    {
      number: '02',
      title: 'One page for every house',
      hasImage: true,
      imageSrc: '/work-2.jpg',
      imageAlt: 'Ayyub Khan reviewing the dues board with a business owner',
      today: 'You flip through register pages and call families to check who owes fees.',
      withUs: 'One page shows every house that still owes and how much.',
    },
    {
      number: '03',
      title: 'Weekly messages to families',
      hasImage: false,
      today: 'Families forget due dates and your collection boy has to visit twice.',
      withUs: 'A short weekly message goes out to his families.',
    },
  ];

  const beforeLines = [
    'Waiting for your collection boy to return with paper notes.',
    'Matching cash in hand against crossed-out diary entries.',
    'Calling families during dinner to confirm disputed payments.',
    'Closing the register without knowing if every house paid.',
  ];

  const afterLines = [
    'Looking at your phone to see collections recorded during the day.',
    'Opening one page to see every house that still owes and how much.',
    'Letting the weekly message remind families before your collection boy arrives.',
    'Finishing your evening with your books clear.',
  ];

  const faqItems = [
    {
      q: 'Who is this for?',
      a: 'For business owners in Madurai who collect monthly fees from houses and want every rupee collected and every house accounted for.',
    },
    {
      q: 'What exactly do you set up?',
      a: 'You set him up with one simple fee system. His collection boy fills a form on the phone when cash comes in, one page shows every house that still owes and how much, and a short weekly message goes out to his families.',
    },
    {
      q: 'How long does setup take?',
      a: 'It is agreed on the call.',
    },
    {
      q: 'What does it cost?',
      a: 'Rs 15,000 setup + Rs 4,000 a month. He pays once to set it up and a small sum every month to keep it running.',
    },
    {
      q: 'How do we start?',
      a: 'Book a 20 minute call. We speak, agree the plan for your business, and I set it up.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#1C2430] flex flex-col font-sans selection:bg-[#E08A1E]/25">
      {/* 1. TOP BAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          topBarTheme === 'ink'
            ? 'bg-[#1C2430] text-[#F7F1E6] border-b border-[#F7F1E6]/15 shadow-sm'
            : topBarTheme === 'cream'
            ? 'bg-[#F7F1E6]/95 backdrop-blur-md text-[#1C2430] border-b border-[#1C2430]/10 shadow-xs'
            : 'bg-transparent text-[#1C2430]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          {/* Logo on small cream rounded panel whenever bar sits on ink */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <div
              className={`rounded-xl px-2.5 py-1.5 transition-colors ${
                topBarTheme === 'ink' ? 'bg-[#F7F1E6] shadow-xs' : 'bg-transparent'
              }`}
            >
              <img
                src="/logo.png"
                alt="Cable Cash Flow"
                className="h-8 md:h-9 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#what-i-do"
              className={`hover:opacity-100 transition-opacity whitespace-nowrap ${
                topBarTheme === 'ink' ? 'text-[#F7F1E6]/80 hover:text-[#F7F1E6]' : 'text-[#1C2430]/80 hover:text-[#1C2430]'
              }`}
            >
              What I do
            </a>
            <a
              href="#how-it-works"
              className={`hover:opacity-100 transition-opacity whitespace-nowrap ${
                topBarTheme === 'ink' ? 'text-[#F7F1E6]/80 hover:text-[#F7F1E6]' : 'text-[#1C2430]/80 hover:text-[#1C2430]'
              }`}
            >
              How it works
            </a>
            <a
              href="#about"
              className={`hover:opacity-100 transition-opacity whitespace-nowrap ${
                topBarTheme === 'ink' ? 'text-[#F7F1E6]/80 hover:text-[#F7F1E6]' : 'text-[#1C2430]/80 hover:text-[#1C2430]'
              }`}
            >
              About
            </a>
          </nav>

          {/* Primary CTA Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <MagneticButton
              href={BOOKING_URL}
              className="bg-[#E08A1E] text-[#1C2430] hover:bg-[#d67e15] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors"
            >
              Book a call
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 max-w-6xl mx-auto w-full flex-grow flex items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Column: Headline, Kicker & Action */}
          <div className="md:col-span-7 flex flex-col items-start order-2 md:order-1">
            {/* Marked placeholder for empty Who I help */}
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#1C2430]/85 uppercase">
              <span>For</span>
              <span className="px-2.5 py-0.5 rounded border border-dashed border-[#1C2430]/35 bg-[#1C2430]/5 text-[#1C2430] normal-case tracking-normal font-medium text-sm">
                [cable TV operators]
              </span>
              <span>in Madurai</span>
            </div>

            {/* Headline with key word in italic accent */}
            <h1 className="font-serif text-[44px] sm:text-[56px] lg:text-[76px] xl:text-[84px] leading-[1.02] tracking-tight text-[#1C2430] mb-8 text-balance">
              Every rupee collected, every house{' '}
              <span className="italic text-[#E08A1E] font-normal">accounted</span> for.
            </h1>

            {/* Plain explanatory sentence from What I set up */}
            <p className="text-[17px] md:text-[18px] leading-[1.6] text-[#1C2430]/85 max-w-[62ch] mb-10">
              You get one simple fee system where your collection boy fills a form on the phone when cash
              comes in, one page shows every house that still owes and how much, and a short weekly message
              goes out to your families.
            </p>

            {/* Booking action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <MagneticButton
                href={BOOKING_URL}
                className="bg-[#E08A1E] text-[#1C2430] hover:bg-[#d67e15] px-8 py-4 rounded-full text-base font-semibold shadow-xs"
              >
                Book a 20 minute call
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </MagneticButton>

              <a
                href={EMAIL_URL}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium text-[#1C2430]/80 hover:text-[#1C2430] hover:bg-[#1C2430]/5 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {EMAIL_ADDRESS}
              </a>
            </div>
          </div>

          {/* Right Column: Tall Arch Frame Photo */}
          <div className="md:col-span-5 flex justify-center order-1 md:order-2">
            <motion.div
              style={{ y: shouldReduceMotion ? 0 : archParallax }}
              className="relative w-full max-w-[340px] md:max-w-[380px]"
            >
              {/* Tall Arch: Rounded top, square/soft bottom */}
              <div className="relative w-full aspect-[4/5] rounded-t-[170px] rounded-b-[28px] overflow-hidden border border-[#1C2430]/15 bg-[#1C2430]/5 shadow-sm">
                <img
                  src="/me.jpg"
                  alt="Ayyub Khan, founder of Cable Cash Flow"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Badge Card on its corner */}
              <div className="absolute -bottom-4 right-2 sm:-right-4 bg-[#F7F1E6] border border-[#1C2430]/15 rounded-2xl px-5 py-3.5 shadow-md max-w-[240px]">
                <p className="text-xs uppercase tracking-wider text-[#E08A1E] font-bold mb-0.5 font-sans">
                  Founder
                </p>
                <p className="text-sm font-semibold text-[#1C2430] leading-snug">
                  Ayyub Khan, founder of Cable Cash Flow
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM (Said in one sentence, ink section) */}
      <section
        ref={problemRef}
        data-theme="ink"
        className="relative bg-[#1C2430] text-[#F7F1E6] py-28 md:py-36 px-6 overflow-hidden"
      >
        <div className="film-grain" />
        <div className="relative z-10 max-w-5xl mx-auto text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-[#E08A1E] font-semibold mb-6">
            The problem
          </p>

          <p className="font-serif text-[32px] sm:text-[44px] md:text-[54px] lg:text-[62px] leading-[1.15] tracking-tight">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <ProblemWord
                  key={i}
                  word={word}
                  progress={problemScroll}
                  range={[Math.max(0, start - 0.05), Math.min(1, end + 0.05)]}
                />
              );
            })}
          </p>
        </div>
      </section>

      {/* 4. WHAT I DO (Pinned section on desktop, swipeable on phone) */}
      <section id="what-i-do" className="relative py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#E08A1E] font-semibold mb-2">
                What I set up
              </p>
              <h2 className="font-serif text-[40px] md:text-[56px] text-[#1C2430] leading-none">
                One simple fee system.
              </h2>
            </div>
            <p className="text-sm text-[#1C2430]/70 max-w-sm">
              Three clear parts that connect your collection boy, your register, and your families.
            </p>
          </div>
        </div>

        {/* Laptop Pinned Horizontal Carousel vs Mobile Swipable Stack */}
        {shouldReduceMotion ? (
          // Reduced motion: standard clean grid
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {whatISetUpCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#F7F1E6] border border-[#1C2430]/12 rounded-[28px] overflow-hidden p-6 flex flex-col justify-between"
              >
                <div className="w-full aspect-[16/10] rounded-[20px] overflow-hidden mb-6">
                  {card.hasImage && card.imageSrc ? (
                    <img
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <RichFallbackPanel number={card.number} title={card.title} />
                  )}
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-serif text-3xl text-[#E08A1E]">{card.number}</span>
                    <h3 className="font-serif text-2xl text-[#1C2430]">{card.title}</h3>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-[#1C2430]/10 text-sm">
                    <p className="text-[#1C2430]/70">
                      <strong className="text-[#1C2430] font-semibold">Today:</strong> {card.today}
                    </p>
                    <p className="text-[#1C2430]">
                      <strong className="text-[#E08A1E] font-semibold">With Cable Cash Flow:</strong>{' '}
                      {card.withUs}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* Desktop Pinned Scroll Viewport (hidden on mobile) */}
            <div ref={pinnedSectionRef} className="hidden md:block relative h-[280vh]">
              <div className="sticky top-28 overflow-hidden py-6">
                <motion.div style={{ x: horizontalX }} className="flex gap-8 pl-8 w-max">
                  {whatISetUpCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="w-[68vw] max-w-[840px] bg-[#F7F1E6] border border-[#1C2430]/12 rounded-[28px] overflow-hidden p-8 flex flex-col justify-between shadow-xs shrink-0"
                    >
                      {/* Work picture filling top 60% */}
                      <div className="w-full aspect-[16/9] rounded-[20px] overflow-hidden mb-6 bg-[#1C2430]/5">
                        {card.hasImage && card.imageSrc ? (
                          <img
                            src={card.imageSrc}
                            alt={card.imageAlt}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <RichFallbackPanel number={card.number} title={card.title} />
                        )}
                      </div>

                      {/* Content bottom 40% */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-serif text-3xl font-normal text-[#E08A1E]">
                            {card.number}
                          </span>
                          <h3 className="font-serif text-3xl text-[#1C2430]">{card.title}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#1C2430]/10">
                          <div>
                            <span className="text-xs uppercase font-semibold text-[#1C2430]/50 tracking-wider block mb-1">
                              Today
                            </span>
                            <p className="text-sm text-[#1C2430]/80 leading-relaxed">{card.today}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase font-semibold text-[#E08A1E] tracking-wider block mb-1">
                              With Cable Cash Flow
                            </span>
                            <p className="text-sm font-medium text-[#1C2430] leading-relaxed">
                              {card.withUs}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Mobile swipeable sideways cards */}
            <div className="md:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-6 pt-2 no-scrollbar">
              {whatISetUpCards.map((card, idx) => (
                <div
                  key={idx}
                  className="w-[86vw] shrink-0 snap-center bg-[#F7F1E6] border border-[#1C2430]/12 rounded-[28px] p-6 flex flex-col justify-between shadow-xs"
                >
                  <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-5">
                    {card.hasImage && card.imageSrc ? (
                      <img
                        src={card.imageSrc}
                        alt={card.imageAlt}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <RichFallbackPanel number={card.number} title={card.title} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="font-serif text-2xl text-[#E08A1E]">{card.number}</span>
                      <h3 className="font-serif text-2xl text-[#1C2430]">{card.title}</h3>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-[#1C2430]/10 text-sm">
                      <p className="text-[#1C2430]/75">
                        <strong className="text-[#1C2430] font-semibold">Today:</strong> {card.today}
                      </p>
                      <p className="text-[#1C2430]">
                        <strong className="text-[#E08A1E] font-semibold">
                          With Cable Cash Flow:
                        </strong>{' '}
                        {card.withUs}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. BEFORE AND AFTER (Two-position switch crossfade) */}
      <section className="py-24 md:py-32 bg-[#F7F1E6] border-t border-b border-[#1C2430]/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-[#E08A1E] font-semibold mb-2">
              Your evening
            </p>
            <h2 className="font-serif text-[40px] md:text-[54px] text-[#1C2430] leading-none mb-8">
              What your evening looks like.
            </h2>

            {/* Two-position switch */}
            <div className="inline-flex p-1.5 rounded-full bg-[#1C2430]/5 border border-[#1C2430]/10">
              <button
                type="button"
                onClick={() => setActiveTab('without')}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'without'
                    ? 'bg-[#1C2430] text-[#F7F1E6] shadow-sm'
                    : 'text-[#1C2430]/70 hover:text-[#1C2430]'
                }`}
              >
                Without Cable Cash Flow
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('with')}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'with'
                    ? 'bg-[#E08A1E] text-[#1C2430] shadow-sm'
                    : 'text-[#1C2430]/70 hover:text-[#1C2430]'
                }`}
              >
                With Cable Cash Flow
              </button>
            </div>
          </div>

          {/* Crossfading Lists stacked in the exact same place */}
          <div className="relative min-h-[280px] bg-white/70 border border-[#1C2430]/10 rounded-[28px] p-8 md:p-12 shadow-xs">
            <AnimatePresence mode="wait">
              {activeTab === 'without' ? (
                <motion.ul
                  key="without-list"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {beforeLines.map((line, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 pb-4 border-b border-[#1C2430]/8 last:border-none last:pb-0"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#1C2430]/10 text-[#1C2430] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-[17px] md:text-[18px] text-[#1C2430]/85 leading-snug">
                        {line}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <motion.ul
                  key="with-list"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {afterLines.map((line, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 pb-4 border-b border-[#1C2430]/8 last:border-none last:pb-0"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#E08A1E] text-[#1C2430] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-[17px] md:text-[18px] text-[#1C2430] font-medium leading-snug">
                        {line}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. HOW WE START (Vertical step line filling with accent) */}
      <section id="how-it-works" className="py-24 md:py-32 max-w-4xl mx-auto px-6 w-full">
        <div className="text-center md:text-left mb-16">
          <p className="text-xs uppercase tracking-widest text-[#E08A1E] font-semibold mb-2">
            How we start
          </p>
          <h2 className="font-serif text-[40px] md:text-[54px] text-[#1C2430] leading-tight">
            Three simple steps.
          </h2>
        </div>

        <div ref={stepsRef} className="relative pl-8 md:pl-12">
          {/* Base vertical line */}
          <div className="absolute left-[15px] md:left-[19px] top-4 bottom-4 w-[2px] bg-[#1C2430]/15" />

          {/* Accent filling vertical line on scroll */}
          <motion.div
            style={{ height: shouldReduceMotion ? '100%' : stepLineFill }}
            className="absolute left-[15px] md:left-[19px] top-4 w-[2px] bg-[#E08A1E] origin-top"
          />

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] md:-left-[43px] top-1 w-8 h-8 rounded-full bg-[#F7F1E6] border-2 border-[#E08A1E] flex items-center justify-center font-serif text-sm font-bold text-[#1C2430]">
                1
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#1C2430] mb-2">
                  A 20 minute call
                </h3>
                <p className="text-base text-[#1C2430]/80 max-w-lg leading-relaxed">
                  We speak about how you collect fees in Madurai today, how your collection boy works, and what your register looks like.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] md:-left-[43px] top-1 w-8 h-8 rounded-full bg-[#F7F1E6] border-2 border-[#E08A1E] flex items-center justify-center font-serif text-sm font-bold text-[#1C2430]">
                2
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#1C2430] mb-2">
                  A plan for your{' '}
                  <span className="px-2 py-0.5 rounded border border-dashed border-[#1C2430]/30 text-sm font-sans font-medium text-[#1C2430]">
                    [cable business]
                  </span>
                </h3>
                <p className="text-base text-[#1C2430]/80 max-w-lg leading-relaxed">
                  I prepare the fee system for your houses, your collection boy, and your families.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[31px] md:-left-[43px] top-1 w-8 h-8 rounded-full bg-[#F7F1E6] border-2 border-[#E08A1E] flex items-center justify-center font-serif text-sm font-bold text-[#1C2430]">
                3
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#1C2430] mb-2">
                  I set it up and show your team
                </h3>
                <p className="text-base text-[#1C2430]/80 max-w-lg leading-relaxed mb-6">
                  I put the form on your collection boy's phone, connect your one-page dues board, and make sure your collection is running.
                </p>

                {/* Exact Price line appears once, inside How we start section */}
                <div className="inline-block bg-[#1C2430] text-[#F7F1E6] px-6 py-4 rounded-2xl border border-[#1C2430]">
                  <p className="text-xs uppercase tracking-wider text-[#E08A1E] font-semibold mb-1">
                    Price
                  </p>
                  <p className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
                    Rs 15,000 setup + Rs 4,000 a month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT ME (Written as a short letter) */}
      <section id="about" className="py-24 md:py-32 bg-white/50 border-t border-[#1C2430]/10">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-[#F7F1E6] border border-[#1C2430]/12 rounded-[28px] p-8 md:p-12 shadow-xs">
            {/* Header: Photo and Title */}
            <div className="flex items-center gap-5 mb-8">
              <img
                src="/me.jpg"
                alt="Ayyub Khan"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#E08A1E] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E08A1E] font-semibold mb-1">
                  Founder
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1C2430] leading-tight">
                  A note from Ayyub Khan
                </h2>
              </div>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 text-[19px] leading-[1.65] text-[#1C2430]/90 font-sans mb-8">
              <p>
                I live and work in Madurai. I set up simple fee systems so you know every rupee
                collected and every house accounted for, without notebooks or confusion.
              </p>
              <div className="p-3 bg-[#1C2430]/5 rounded-xl border border-dashed border-[#1C2430]/20 text-sm text-[#1C2430]/75">
                <span className="font-semibold block mb-0.5 text-xs uppercase tracking-wider text-[#1C2430]/90">
                  Note
                </span>
                [About me: Share a few words about your journey in Madurai, why you started Cable Cash Flow, and how you personally work with each client.]
              </div>
            </div>

            {/* Signature in Caveat */}
            <div className="pt-4 border-t border-[#1C2430]/10 flex flex-col items-start gap-6">
              <span className="font-handwriting text-5xl md:text-6xl text-[#E08A1E] leading-none select-none">
                Ayyub
              </span>

              <MagneticButton
                href={BOOKING_URL}
                className="bg-[#1C2430] text-[#F7F1E6] hover:bg-[#283444] px-6 py-3.5 rounded-full text-sm font-semibold transition-colors"
              >
                Book a 20 minute call with Ayyub
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* 8. QUESTIONS (FAQ: five that open and close) */}
      <section className="py-24 md:py-32 max-w-4xl mx-auto px-6 w-full">
        <div className="text-center md:text-left mb-12">
          <p className="text-xs uppercase tracking-widest text-[#E08A1E] font-semibold mb-2">
            Questions
          </p>
          <h2 className="font-serif text-[40px] md:text-[54px] text-[#1C2430] leading-tight">
            Common questions.
          </h2>
        </div>

        <div className="border-t border-[#1C2430]/12">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border-b border-[#1C2430]/12">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-6 flex items-center justify-between text-left gap-6 group cursor-pointer"
                >
                  <span className="font-serif text-[24px] md:text-[28px] text-[#1C2430] group-hover:text-[#E08A1E] transition-colors leading-snug">
                    {item.q}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full border border-[#1C2430]/20 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-45 bg-[#1C2430] text-[#F7F1E6]' : 'text-[#1C2430]'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-base md:text-[17px] text-[#1C2430]/85 leading-relaxed max-w-2xl font-sans">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. FINAL INVITATION (On ink) */}
      <section
        data-theme="ink"
        className="relative bg-[#1C2430] text-[#F7F1E6] py-28 md:py-36 px-6 overflow-hidden text-center"
      >
        <div className="film-grain" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-[#E08A1E] font-semibold mb-4">
            Start today
          </p>
          <h2 className="font-serif text-[44px] sm:text-[56px] md:text-[68px] leading-[1.05] tracking-tight mb-8">
            Let's give your evenings back.
          </h2>

          <MagneticButton
            href={BOOKING_URL}
            className="bg-[#E08A1E] text-[#1C2430] hover:bg-[#d67e15] px-9 py-4 rounded-full text-base font-semibold shadow-md mb-6"
          >
            Book a 20 minute call
          </MagneticButton>

          <a
            href={EMAIL_URL}
            className="inline-flex items-center gap-2 text-sm text-[#F7F1E6]/75 hover:text-[#F7F1E6] transition-colors"
          >
            <Mail className="w-4 h-4 text-[#E08A1E]" />
            {EMAIL_ADDRESS}
          </a>
        </div>
      </section>

      {/* 10. FOOTER (On ink) */}
      <footer
        data-theme="ink"
        className="relative bg-[#1C2430] text-[#F7F1E6] border-t border-[#F7F1E6]/10 py-12 px-6"
      >
        <div className="film-grain" />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            {/* Logo on small cream rounded panel */}
            <div className="bg-[#F7F1E6] px-3 py-1.5 rounded-xl inline-block shadow-xs">
              <img
                src="/logo.png"
                alt="Cable Cash Flow"
                className="h-7 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-sm text-[#F7F1E6]/70">Madurai</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#F7F1E6]/80 font-medium">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E08A1E] transition-colors"
            >
              Book a call
            </a>
            <a href={EMAIL_URL} className="hover:text-[#E08A1E] transition-colors">
              {EMAIL_ADDRESS}
            </a>
          </div>

          <div className="text-xs text-[#F7F1E6]/50">
            © {new Date().getFullYear()} Cable Cash Flow
          </div>
        </div>
      </footer>

      {/* PHONE STICKY BOTTOM BAR (sticks after hero scrolls away, under 60px) */}
      <AnimatePresence>
        {showMobileSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed bottom-4 left-4 right-4 z-40"
          >
            <div className="bg-[#1C2430] p-2 rounded-full shadow-xl border border-[#F7F1E6]/15 flex items-center justify-between pl-4">
              <span className="text-xs font-serif text-[#F7F1E6] truncate mr-2">
                Cable Cash Flow
              </span>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E08A1E] text-[#1C2430] px-5 py-2.5 rounded-full text-xs font-bold tracking-wide shrink-0 active:scale-95 transition-transform"
              >
                Book a 20 minute call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
