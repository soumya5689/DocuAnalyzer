import HeroIllustration from './components/HeroIllustration';
import { motion } from 'framer-motion';

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center">
        <div className="text-xl font-bold text-purple-600">
          DocuAnalyzer
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-5xl font-bold leading-tight mb-6">
            AI-powered document <br />
            intelligence for{' '}
            <span className="text-purple-600">PDFs & Images</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Upload documents and let AI extract text, images, links,
            generate summaries, and answer questions instantly.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGetStarted}
            className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition"
          >
            Get Started
          </motion.button>

          <div className="flex gap-8 mt-8 text-sm text-gray-600">
            <span>✔ 50,000+ files processed</span>
            <span>✔ Trusted by users</span>
          </div>
        </motion.div>

        {/* RIGHT ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <HeroIllustration className="w-full max-w-lg drop-shadow-2xl" />
        </motion.div>

      </section>
    </div>
  );
}
