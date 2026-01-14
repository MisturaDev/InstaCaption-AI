
import React, { useState } from 'react';
import { Sparkles, RefreshCw, Instagram, Hash, AlertCircle } from 'lucide-react';
import { CaptionStyle } from './types';
import StyleBadge from './components/StyleBadge';
import CaptionCard from './components/CaptionCard';
import { generateCaption } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<CaptionStyle>(CaptionStyle.FUNNY);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // 1. Input Validation
    if (!topic.trim()) {
      setError('Please enter a topic to generate a caption!');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const caption = await generateCaption(topic, style);
      setResult(caption);
    } catch (err: any) {
      setError(err.message || 'Failed to generate caption. Please try again.');
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
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null); // Clear error when user types
                  }}
                  className={`w-full px-5 py-4 bg-white border ${error ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 text-lg shadow-inner`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Hash className="w-5 h-5" />
                </div>
              </div>
              {error && (
                <p className="mt-2 text-red-500 text-sm flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" /> {error}
                </p>
              )}
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

            {/* 2. Loading state button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating caption...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Caption
                </>
              )}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          {/* 3. Single caption output & 4. Regenerate option */}
          {result && !loading && (
            <div className="flex items-center justify-between mb-2 px-1 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Your AI Caption
              </h2>
              <button 
                onClick={() => handleGenerate()}
                className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </div>
          )}
          
          <div className="min-h-[100px]">
            {loading ? (
              <div className="h-32 bg-white/40 border border-white animate-pulse rounded-2xl shadow-sm flex items-center justify-center">
                <span className="text-gray-400 text-sm font-medium">Drafting something catchy...</span>
              </div>
            ) : result ? (
              <div className="animate-in zoom-in-95 duration-300">
                <CaptionCard text={result} />
              </div>
            ) : (
              !error && (
                <div className="py-12 text-center text-gray-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Your creative journey starts with a topic above.</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto pt-12 text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} InstaCaptions AI • Powered by Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
