import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chapter, Comic } from '../types';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useSpring } from 'motion/react';
import { List, ArrowLeft, ArrowRight, Settings, BookOpen } from 'lucide-react';
import { handleApiError } from '../utils';
import { isChapterDownloaded, getOfflineChapterRecord, getOfflineImageUrls } from '../services/offlineStorage';
import { api } from '../services/api';

export default function Reader() {
  const { comicId, chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [comic, setComic] = useState<Comic | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showControls, setShowControls] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchData = async () => {
      if (!comicId || !chapterId) return;
      setLoading(true);
      setErrorMessage('');
      try {
        const isOffline = await isChapterDownloaded(chapterId, comicId);
        if (isOffline) {
          const offlineRecord = await getOfflineChapterRecord(comicId, chapterId);
          if (offlineRecord) {
            setComic(offlineRecord.comic);
            setChapter(offlineRecord.chapter);
            setImages(await getOfflineImageUrls(offlineRecord.chapter));
            setLoading(false);

            if (user && navigator.onLine) {
              api.saveHistory(comicId, chapterId).catch((err) => handleApiError(err, `history/${comicId}/${chapterId}`));
            }
            return;
          }
        }

        const [comicData, chData] = await Promise.all([
          api.comic(comicId),
          api.chapter(comicId, chapterId),
        ]);
        setComic(comicData);
        setChapter(chData);

        if (user) {
          await api.saveHistory(comicId, chapterId);
        }
        
        if (chData) {
           if (isOffline) {
              const offlineUrls = await getOfflineImageUrls(chData);
              setImages(offlineUrls);
           } else {
              setImages(chData.pages?.map((page) => page.streamUrl) || chData.images);
           }
        }
        
      } catch (err) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setErrorMessage('This chapter is not available offline. Download it before disconnecting.');
        } else {
          setErrorMessage(err instanceof Error ? err.message : 'Unable to load chapter.');
        }
        handleApiError(err, `read/${comicId}/${chapterId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [comicId, chapterId, user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
    </div>
  );
  if (!chapter) return (
    <div className="min-h-screen -mx-6 -mt-8 flex items-center justify-center bg-zinc-900 px-8 text-center text-white">
      <div>
        <BookOpen size={48} className="mx-auto mb-4 text-white/40" />
        <p className="text-sm font-semibold">{errorMessage || 'Chapter not found'}</p>
        <button onClick={() => navigate('/downloads')} className="mt-6 rounded-xl bg-white/10 px-5 py-3 text-xs font-bold">
          Open Downloads
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-900 min-h-screen -mx-6 -mt-8 relative" onClick={() => setShowControls(!showControls)}>
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-pastel-pink z-[100] origin-left" style={{ scaleX }} />

      {/* Top Bar */}
      <motion.div 
        animate={{ y: showControls ? 0 : -100 }}
        className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md p-6 z-[90] flex items-center gap-4 border-b border-white/10"
      >
        <button onClick={() => navigate(`/comic/${comicId}`)} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-sm truncate">{comic?.title}</h2>
          <p className="text-white/60 text-[10px] uppercase tracking-wider">Chapter {chapter.number}: {chapter.title}</p>
        </div>
        <button className="text-white">
          <Settings size={20} />
        </button>
      </motion.div>

      {/* Images */}
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`Page ${idx + 1}`} 
              className="w-full h-auto select-none"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ))
        ) : (
          <div className="py-40 text-center text-white/50 space-y-4">
            <BookOpen size={48} className="mx-auto" />
            <p>No pages found for this chapter.</p>
          </div>
        )}
      </div>

      {/* Bottom Bar Controls */}
      <motion.div 
        animate={{ y: showControls ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-8 z-[90] flex justify-between items-center border-t border-white/10"
      >
        <button className="text-white/60 disabled:opacity-20 flex flex-col items-center gap-1">
          <ArrowLeft size={20} />
          <span className="text-[10px] uppercase font-bold">Prev</span>
        </button>
        
        <button className="bg-white/10 text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
          <List size={16} /> Chapters
        </button>

        <button className="text-white/60 disabled:opacity-20 flex flex-col items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-[10px] uppercase font-bold">Next</span>
        </button>
      </motion.div>
    </div>
  );
}
