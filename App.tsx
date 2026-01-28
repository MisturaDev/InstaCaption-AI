
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Instagram, Hash, AlertCircle, Sun, Moon, Trash2, Copy, Check } from 'lucide-react';
import { CaptionStyle } from './types';
import StyleBadge from './components/StyleBadge';
import CaptionCard from './components/CaptionCard';
import { generateCaptions } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<CaptionStyle>(CaptionStyle.FUNNY);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hashtagCopied, setHashtagCopied] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('insta-caption-theme');
    return saved === 'dark';
  });

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

  const handleClearAll = () => {
    setTopic('');
    setStyle(CaptionStyle.FUNNY);
    setResults([]);
    setHashtags([]);
    setError(null);
    setIncludeHashtags(false);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!topic.trim()) {
      setError('Oops! You forgot to enter a topic.');
      setResults([]);
      setHashtags([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { captions, hashtags: generatedHashtags } = await generateCaptions(topic, style, includeHashtags);
      setResults(captions);
      setHashtags(generatedHashtags);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyHashtags = () => {
    const tagString = hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');
    navigator.clipboard.writeText(tagString);
    setHashtagCopied(true);
    setTimeout(() => setHashtagCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-[#0f172a] dark:to-[#1e1b4b] transition-colors duration-500">
      
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
          Craft high-engagement captions and hashtags in seconds.
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
                  disabled={loading}
                  placeholder="Enter your topic, e.g., coffee, travel, fashion…"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`w-full px-5 py-4 bg-white dark:bg-gray-800 border ${error ? 'border-red-300 ring-2 ring-red-50 dark:ring-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white text-lg shadow-inner disabled:opacity-50`}
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
                    onClick={(newStyle) => !loading && setStyle(newStyle)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <button
                type="button"
                onClick={() => !loading && setIncludeHashtags(!includeHashtags)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${includeHashtags ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <span className={`${includeHashtags ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Include relevant hashtags</span>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                title="Click to get your caption"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={loading}
                title="Clear all inputs and results"
                className="px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-6">
          {(results.length > 0 || hashtags.length > 0) && !loading && (
            <div className="flex items-center justify-between mb-2 px-1 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                AI Magic Results
              </h2>
              <button 
                onClick={() => handleGenerate()}
                title="Get another batch without changing settings"
                className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Results
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white/40 dark:bg-white/5 border border-white dark:border-white/10 animate-pulse rounded-2xl flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm font-medium italic">Curating choice #{i}...</span>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="space-y-4">
                  {results.map((caption, idx) => (
                    <div key={idx} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                      <CaptionCard text={caption} />
                    </div>
                  ))}
                </div>

                {hashtags.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                        <Hash className="w-4 h-4" /> Recommended Hashtags
                      </h3>
                      <button 
                        onClick={copyHashtags}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-all"
                      >
                        {hashtagCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-full border border-indigo-100 dark:border-indigo-900/50">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              !error && (
                <div className="py-12 text-center text-gray-400 dark:text-gray-600">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="max-w-[200px] mx-auto leading-relaxed">Your catchy Instagram captions are just a topic away!</p>
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
