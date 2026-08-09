import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Compass,
  Flame,
  GitBranch,
  ListChecks,
  Rocket,
  Sparkles,
  Target,
  Wand2,
} from 'lucide-react';
import GlowBackdrop from './ui/GlowBackdrop';
import Card from './ui/Card';
import { button } from '../lib/styles';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const HOW_IT_WORKS = [
  {
    icon: Wand2,
    title: 'Describe Your Idea',
    body: 'Input your project concept and let our AI understand your vision.',
  },
  {
    icon: Compass,
    title: 'Get AI-Generated Questions',
    body: 'Clarify and refine your project with smart, targeted suggestions.',
  },
  {
    icon: Target,
    title: 'Track Progress',
    body: 'Use gamified streak tracking to stay motivated and achieve goals.',
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-powered project ideation',
    body: 'Generate creative project ideas and get AI guidance to develop them fully.',
  },
  {
    icon: Flame,
    title: 'Gamified streak tracking',
    body: 'Stay motivated with visual progress tracking similar to GitHub contribution graphs.',
  },
  {
    icon: ListChecks,
    title: 'Custom refinement questions',
    body: 'Get intelligent questions that help clarify and improve your project concept.',
  },
  {
    icon: GitBranch,
    title: 'GitHub-synced roadmaps',
    body: 'Every project ships with its own repo, and progress checks read straight from your commits.',
  },
];

const HeroMockup = () => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotate: -2 }}
    whileInView={{ opacity: 1, y: 0, rotate: -2 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className="relative w-full max-w-md mx-auto"
  >
    <div className="absolute -inset-4 bg-orange-500/10 blur-2xl rounded-3xl" />
    <div className="relative bg-ink/90 border border-white-smoke/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white-smoke/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <span className="ml-3 font-josefin text-xs text-white-smoke/50">recipe-finder / roadmap</span>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <p className="font-josefin font-bold text-white-smoke">Module 1 · Project Setup</p>
          <div className="mt-2 space-y-2">
            {[
              { label: 'Scaffold React + Vite app', done: true },
              { label: 'Connect GitHub repository', done: true },
              { label: 'Set up API client', done: false },
            ].map((task) => (
              <div key={task.label} className="flex items-center gap-2 text-sm font-josefin">
                {task.done ? (
                  <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
                ) : (
                  <CircleDot size={16} className="text-white-smoke/30 shrink-0" />
                )}
                <span className={task.done ? 'text-white-smoke/50 line-through' : 'text-white-smoke/90'}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-3 border-t border-white-smoke/10">
          <div className="flex justify-between text-xs font-josefin text-white-smoke/50 mb-1.5">
            <span>Project progress</span>
            <span>66%</span>
          </div>
          <div className="h-1.5 w-full bg-white-smoke/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '66%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="bg-rich-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <GlowBackdrop />
        <div className="relative max-w-screen-xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 font-josefin text-sm text-orange-400 mb-6">
              <Sparkles size={14} />
              AI-guided project roadmaps
            </span>
            <h1 className="font-k95 text-white-smoke text-4xl md:text-6xl mb-5 leading-tight">
              Turn your ideas into{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                shipped projects
              </span>
            </h1>
            <p className="font-josefin text-white-smoke/80 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
              Profectus helps students and developers refine project ideas with AI-generated questions,
              structured tasks, and goal tracking — synced straight to GitHub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link to="/login" className={button({ variant: 'primary', size: 'lg', className: 'w-full sm:w-auto' })}>
                Get Started for Free
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className={button({ variant: 'secondary', size: 'lg', className: 'w-full sm:w-auto' })}
              >
                See how it works
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-josefin text-white-smoke/50">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-orange-500" />
                Free to use
              </span>
              <span className="flex items-center gap-1.5">
                <GitBranch size={15} className="text-orange-500" />
                Powered by GitHub
              </span>
              <span className="flex items-center gap-1.5">
                <Rocket size={15} className="text-orange-500" />
                AI-assisted roadmaps
              </span>
            </div>
          </motion.div>

          <HeroMockup />
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-ink/60 py-16 md:py-20 border-y border-white-smoke/8">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-k95 text-white-smoke text-3xl md:text-4xl mb-3">How It Works</h2>
            <p className="font-josefin text-white-smoke/60 max-w-xl mx-auto">
              From vague idea to a tracked, shippable plan in three steps.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative w-20 h-20 bg-rich-black border border-orange-500/20 rounded-full flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-orange-500" strokeWidth={1.75} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-rich-black text-xs font-bold font-josefin flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-josefin font-bold text-white-smoke text-xl mb-3">{step.title}</h3>
                <p className="font-josefin text-white-smoke/70">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-k95 text-white-smoke text-3xl md:text-4xl mb-3">Features</h2>
            <p className="font-josefin text-white-smoke/60 max-w-xl mx-auto">
              Everything you need to go from idea to a project you actually finish.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <Card
                key={feature.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500/15 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <feature.icon className="w-6 h-6 text-orange-500" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-josefin font-bold text-white-smoke text-xl">{feature.title}</h3>
                </div>
                <p className="font-josefin text-white-smoke/70 ml-16">{feature.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-16 md:py-20 bg-ink/80 border-t border-white-smoke/8 overflow-hidden">
        <GlowBackdrop className="opacity-70" />
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="relative max-w-screen-xl mx-auto px-4 text-center"
        >
          <h2 className="font-k95 text-white-smoke text-2xl md:text-4xl mb-6">
            Ready to start your project journey?
          </h2>
          <Link to="/login" className={button({ variant: 'primary', size: 'lg' })}>
            Create Your First Project
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
