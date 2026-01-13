
import React, { useState, useCallback } from 'react';
import { Sparkles, Send, RefreshCw, Instagram, Hash } from 'lucide-react';
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

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

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
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6">
      <header className="w-full max-w-2xl mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl shadow-lg rotate-3">
          <Instagram className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold heading-font text-gray-900 tracking-tight mb-4">
          InstaCaptions <span className="text-indigo-600">AI</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Elevate your social media game with AI-crafted captions that actually engage.
        </p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        <section className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/50">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                What's your post about?
              </label>
              <div className="relative">
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g. coffee morning, beach sunset, Monday vibes"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 text-lg shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Hash className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
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
              disabled={loading || !topic.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Magic...
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

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-2 animate-pulse">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <section className="space-y-4">
          {results.length > 0 && !loading && (
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Generated for you
              </h2>
              <button 
                onClick={() => handleGenerate()}
                className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-white/40 border border-white animate-pulse rounded-2xl shadow-sm" />
              ))
            ) : (
              results.map((caption, idx) => (
                <CaptionCard key={idx} text={caption} />
              ))
            )}
          </div>

          {!loading && results.length === 0 && !error && (
            <div className="py-12 text-center text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Your creative journey starts with a topic above.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto pt-12 text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} InstaCaptions AI • Powered by Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
