import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * Ultra-luxury cinematic hero section (frontend-only, static content).
 * Reusable: customize via props, or use defaults.
 */
export default function HeroSection({
  brand = 'Beach Point Luxe Resort',
  navLinks = [
    { label: 'Suites', href: '/rooms' },
    { label: 'Dining', href: '/restaurant' },
    { label: 'Booking', href: '/booking' }
  ],
  headline = (
    <>
      Sunset Luxury,
      <span className="block">Oceanfront Serenity</span>
    </>
  ),
  subheading = 'A 5-star coastal escape curated for quiet, beautiful time.',
  primaryCta = { label: 'Book Your Stay', href: '/booking' },
  secondaryCta = { label: 'Explore Luxury', href: '/rooms' },
  backgroundImageUrl = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=2400&auto=format&fit=crop&q=70'
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Cinematic parallax: background moves subtly slower than scroll.
  const bgY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 70]);
  const bgYSmooth = useSpring(bgY, { stiffness: 60, damping: 22, mass: 0.9 });

  const easing = [0.16, 1, 0.3, 1]; // cinematic easeOutQuint-ish

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 1.1, ease: easing, staggerChildren: 0.12, delayChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: easing } }
  };

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden bg-black">
      {/* Parallax Background */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ y: bgYSmooth }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-[1.08]"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        {/* Cinematic color grade + vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.85)]" />
      </motion.div>

      {/* Transparent Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <a
              href="/"
              className="text-white/90 hover:text-white transition-colors"
            >
              <span className="font-heading font-semibold tracking-wide">{brand}</span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <a
              href={primaryCta.href}
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur-md hover:bg-white/15 hover:text-white transition-colors"
            >
              Reserve
            </a>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex items-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="w-full max-w-3xl"
            >
              {/* Subheading (letter spaced) */}
              <motion.p
                variants={fadeUp}
                className="text-xs sm:text-sm tracking-[0.45em] uppercase text-white/75"
              >
                5-Star Beach Resort • Sunset Collection
              </motion.p>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="mt-6 font-heading font-bold text-white leading-[0.92] text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
              >
                {headline}
              </motion.h1>

              {/* Minimal premium body */}
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl"
              >
                {subheading}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4">
                {/* Gold primary */}
                <a
                  href={primaryCta.href}
                  className="group relative inline-flex items-center justify-center rounded-full px-7 py-4 font-medium text-[15px] text-black bg-[#D6B56D] shadow-[0_20px_60px_rgba(214,181,109,0.28)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99]"
                >
                  <span className="relative z-10">{primaryCta.label}</span>
                  <span className="relative z-10 ml-2 opacity-80">→</span>
                  {/* glow */}
                  <span className="pointer-events-none absolute -inset-1 rounded-full bg-[#D6B56D] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-35" />
                </a>

                {/* Outline secondary */}
                <a
                  href={secondaryCta.href}
                  className="group relative inline-flex items-center justify-center rounded-full px-7 py-4 font-medium text-[15px] text-white border border-white/35 bg-white/5 backdrop-blur-md transition-transform duration-300 hover:scale-[1.03] hover:border-[#D6B56D]/60"
                >
                  <span className="relative z-10">{secondaryCta.label}</span>
                  <span className="relative z-10 ml-2 opacity-80">→</span>
                  {/* subtle gold sheen */}
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_20%_10%,rgba(214,181,109,0.22),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1.0, ease: easing }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
          transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: easing }}
          className="w-7 h-11 rounded-full border border-white/45 flex items-start justify-center p-2"
        >
          <motion.div
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: easing }}
            className="w-1 h-3 rounded-full bg-[#D6B56D]"
          />
        </motion.div>
        <div className="mt-3 text-[11px] tracking-[0.35em] uppercase text-white/55 text-center">
          Scroll
        </div>
      </motion.div>
    </section>
  );
}


