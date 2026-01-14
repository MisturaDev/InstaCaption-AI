
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Instagram, Hash, AlertCircle, Sun, Moon } from 'lucide-react';
import { CaptionStyle } from './types';
import StyleBadge from './components/StyleBadge';
import CaptionCard from './components/CaptionCard';
import { generateCaptions } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<CaptionStyle>(CaptionStyle.FUNNY);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize state from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('insta-caption-theme');
    return saved === 'dark';
  });

  // Sync state with HTML class and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('insta-caption-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('insta-caption-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic to generate a caption!');
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const captions = await generateCaptions(topic, style);
      setResults(captions);
    } catch (err: any) {
      setError(err.message || 'Failed to generate captions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-[#0f172a] dark:to-[#1e1b4b] transition-colors duration-500">
      
      {/* Theme Toggle */}
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white dark:border-white/20 shadow-sm hover:scale-110 transition-transform cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </div>

      <header className="w-full max-w-2xl mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl shadow-lg rotate-3">
          <Instagram className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold heading-font text-gray-900 dark:text-white tracking-tight mb-4">
          InstaCaptions <span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Elevate your social media game with AI-crafted captions that actually engage.
        </p>
      </header>

      <main className="w-full max-w-2xl space-y-8 pb-20">
        <section className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none transition-all">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                What's your post about?
              </label>
              <div className="relative">
                <input
                  id="topic"
                  type="text"
                  placeholder="Enter your topic, e.g., coffee, travel, fashion…"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`w-full px-5 py-4 bg-white dark:bg-gray-800 border ${error ? 'border-red-300 ring-2 ring-red-50 dark:ring-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white text-lg shadow-inner`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Hash className="w-5 h-5" />
                </div>
              </div>
              {error && (
                <p className="mt-2 text-red-500 dark:text-red-400 text-sm flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" /> {error}
                </p>
              )}
            </div>

            <div title="Choose a caption style: Funny, Casual, Professional">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ml-1">
                Choose a vibe
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(CaptionStyle).map((s) => (
                  <StyleBadge
                    key={s}
                    style={s}
                    isSelected={style === s}
                    onClick={setStyle}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              title="Click to get your caption"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating captions...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Captions
                </>
              )}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          {results.length > 0 && !loading && (
            <div className="flex items-center justify-between mb-2 px-1 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Top AI Captions
              </h2>
              <button 
                onClick={() => handleGenerate()}
                title="Click to get another caption without changing the topic"
                className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate All
              </button>
            </div>
          )}
          
          <div className="space-y-4 min-h-[100px]">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white/40 dark:bg-white/5 border border-white dark:border-white/10 animate-pulse rounded-2xl shadow-sm flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">Curating your caption {i}...</span>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((caption, idx) => (
                  <div key={idx} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                    <CaptionCard text={caption} />
                  </div>
                ))}
              </div>
            ) : (
              !error && (
                <div className="py-12 text-center text-gray-400 dark:text-gray-600">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Your creative journey starts with a topic above.</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto pt-12 text-gray-400 dark:text-gray-500 text-xs text-center">
        <p>© {new Date().getFullYear()} InstaCaptions AI • Powered by Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
