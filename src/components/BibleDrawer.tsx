import { useState, useEffect, useRef } from 'react';
import { BookOpen, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Metadata for all 66 books of the Bible and their chapter counts
const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 }
];

const TRANSLATIONS = [
  { id: 'web', name: 'World English Bible (WEB)' },
  { id: 'kjv', name: 'King James Version (KJV)' },
  { id: 'bbe', name: 'Bible in Basic English (BBE)' }
];

interface BibleDrawerProps {
  accent: string;
}

interface Verse {
  verse: number;
  text: string;
}

export default function BibleDrawer({ accent }: BibleDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [translation, setTranslation] = useState(() => localStorage.getItem('kple_bible_translation') || 'web');
  const [selectedBook, setSelectedBook] = useState(() => localStorage.getItem('kple_bible_book') || 'John');
  const [selectedChapter, setSelectedChapter] = useState(() => Number(localStorage.getItem('kple_bible_chapter')) || 3);
  
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Get active book object to determine chapter limits
  const activeBook = BIBLE_BOOKS.find(b => b.name === selectedBook) || BIBLE_BOOKS[42]; // Default to John
  const chaptersCount = activeBook.chapters;

  // Persist options
  useEffect(() => {
    localStorage.setItem('kple_bible_translation', translation);
    localStorage.setItem('kple_bible_book', selectedBook);
    localStorage.setItem('kple_bible_chapter', String(selectedChapter));
  }, [translation, selectedBook, selectedChapter]);

  // Fetch verses whenever selectors change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchVerses() {
      setLoading(true);
      setError(null);
      try {
        const query = `${encodeURIComponent(selectedBook)}+${selectedChapter}`;
        const url = `https://bible-api.com/${query}?translation=${translation}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load verses (${response.status})`);
        }
        
        const data = await response.json();
        if (isMounted) {
          if (data.verses && data.verses.length > 0) {
            setVerses(data.verses);
            // Scroll reader panel back to top
            if (textContainerRef.current) {
              textContainerRef.current.scrollTop = 0;
            }
          } else {
            throw new Error('No verses returned for this chapter.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Bible API Error:', err);
          setError(err.message || 'Error connecting to Bible server.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVerses();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedBook, selectedChapter, translation]);

  // Handle book changes (reset chapter to 1 if the current chapter exceeds new book's limit)
  const handleBookChange = (bookName: string) => {
    const targetBook = BIBLE_BOOKS.find(b => b.name === bookName);
    setSelectedBook(bookName);
    if (targetBook && selectedChapter > targetBook.chapters) {
      setSelectedChapter(1);
    }
  };

  // Navigate chapters
  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      // Go to previous book's last chapter
      const currentIdx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook);
      if (currentIdx > 0) {
        const prevBook = BIBLE_BOOKS[currentIdx - 1];
        setSelectedBook(prevBook.name);
        setSelectedChapter(prevBook.chapters);
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < chaptersCount) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      // Go to next book's first chapter
      const currentIdx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook);
      if (currentIdx < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currentIdx + 1];
        setSelectedBook(nextBook.name);
        setSelectedChapter(1);
      }
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#0a0a0a',
          border: `1.5px solid ${accent}`,
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 15px ${accent}40`,
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 12px 35px rgba(0,0,0,0.6), 0 0 20px ${accent}80`;
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.5), 0 0 15px ${accent}40`;
        }}
        title="Open Holy Bible"
        id="kple-bible-fab"
      >
        <BookOpen size={24} style={{ color: accent }} />
      </button>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              width: '100%',
              maxWidth: '440px',
              background: 'rgba(10, 10, 10, 0.85)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              zIndex: 10001,
              boxShadow: '10px 0 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
              fontFamily: "'Outfit', sans-serif"
            }}
            id="kple-bible-drawer"
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 24px 16px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={22} style={{ color: accent }} />
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Holy Bible
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Translation Selection Banner */}
            <div style={{ padding: '16px 24px 8px 24px' }}>
              <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                Translation
              </label>
              <select
                value={translation}
                onChange={e => setTranslation(e.target.value)}
                style={{
                  width: '100%',
                  background: '#161616',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {TRANSLATIONS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Book & Chapter Navigation selectors */}
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '8px 24px 16px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              {/* Book Select */}
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                  Book
                </label>
                <select
                  value={selectedBook}
                  onChange={e => handleBookChange(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#161616',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {BIBLE_BOOKS.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Chapter Select */}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                  Chapter
                </label>
                <select
                  value={selectedChapter}
                  onChange={e => setSelectedChapter(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: '#161616',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {Array.from({ length: chaptersCount }, (_, i) => i + 1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Reading Viewport */}
            <div
              ref={textContainerRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 30px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '16px' }}>
                  <Loader2 size={32} style={{ color: accent, animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Fetching Scripture...
                  </span>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : error ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px', textAlign: 'center', padding: '0 20px' }}>
                  <span style={{ fontSize: '32px' }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: '14px', color: '#ff6b6b' }}>{error}</p>
                  <button
                    onClick={() => setSelectedChapter(selectedChapter)} // trigger refetch
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      fontSize: '11px',
                      background: accent,
                      border: 'none',
                      color: '#000',
                      fontWeight: 800,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div style={{ paddingBottom: '40px' }}>
                  {/* Chapter Header */}
                  <h4 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: 800, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                    {selectedBook} {selectedChapter}
                  </h4>
                  
                  {/* Verse list */}
                  <div style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: '16px',
                    lineHeight: '1.9',
                    color: 'rgba(255,255,255,0.85)',
                    textAlign: 'justify'
                  }}>
                    {verses.map(v => (
                      <span key={v.verse} style={{ marginRight: '6px', display: 'inline' }}>
                        <sup style={{
                          color: accent,
                          fontSize: '10px',
                          fontWeight: 700,
                          marginRight: '4px',
                          position: 'relative',
                          top: '-0.3em'
                        }}>
                          {v.verse}
                        </sup>
                        {v.text.trim()}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: '#060606'
            }}>
              <button
                onClick={handlePrevChapter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {selectedBook} {selectedChapter}
              </span>

              <button
                onClick={handleNextChapter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
