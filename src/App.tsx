import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Volume2, House, Brain, Puzzle, Trophy, Star, ChevronRight,
  CheckCircle2, RotateCcw, Sparkles, Menu, X, GraduationCap, Target,
  Headphones, ArrowRight, PartyPopper, Heart, BookMarked, CircleHelp
} from "lucide-react";
import {
  categories, vocabulary, getCategory, getVocabularyByCategory,
  type CategoryId, type VocabularyItem
} from "./data/vocabulary";

type Tab = "home" | "materials" | "quiz" | "matching";

interface Progress {
  points: number;
  completedCategories: CategoryId[];
  bestQuizScore: number;
  quizzesPlayed: number;
  matchingPlayed: number;
}

const STORAGE_KEY = "mufradatku-progress-v1";

const defaultProgress: Progress = {
  points: 0,
  completedCategories: [],
  bestQuizScore: 0,
  quizzesPlayed: 0,
  matchingPlayed: 0
};

function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...defaultProgress,
      ...parsed,
      completedCategories: Array.isArray(parsed.completedCategories)
        ? parsed.completedCategories.filter((id): id is CategoryId =>
            categories.some((category) => category.id === id))
        : []
    };
  } catch {
    return defaultProgress;
  }
}

function shuffle<T,>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function speakArabic(text: string) {
  if (!("speechSynthesis" in window)) {
    window.alert("Fitur audio belum didukung oleh browser ini. Kamu tetap bisa membaca cara pengucapannya.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.78;
  utterance.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("ar"));
  if (arabicVoice) utterance.voice = arabicVoice;
  window.speechSynthesis.speak(utterance);
}

function AudioButton({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <button
      className={compact ? "audio-button audio-button--compact" : "audio-button"}
      type="button"
      onClick={() => speakArabic(text)}
      aria-label={`Dengarkan pengucapan ${text}`}
      title="Dengarkan pengucapan"
    >
      <Volume2 size={compact ? 16 : 18} />
      {!compact && <span>Dengarkan</span>}
    </button>
  );
}

function Header({ activeTab, onNavigate }: { activeTab: Tab; onNavigate: (tab: Tab) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems: { id: Tab; label: string; icon: typeof House }[] = [
    { id: "home", label: "Beranda", icon: House },
    { id: "materials", label: "Materi", icon: BookOpen },
    { id: "quiz", label: "Kuis", icon: Brain },
    { id: "matching", label: "Permainan", icon: Puzzle }
  ];

  const navigate = (tab: Tab) => {
    onNavigate(tab);
    setMobileOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate("home")} type="button" aria-label="MufradatKu, ke beranda">
          <span className="brand-mark"><BookOpen size={23} strokeWidth={2.5} /></span>
          <span className="brand-copy">
            <strong>MufradatKu</strong>
            <small>Belajar jadi menyenangkan!</small>
          </span>
        </button>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-link ${activeTab === id ? "active" : ""}`} onClick={() => navigate(id)} type="button">
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="header-right">
          <span className="grade-pill"><GraduationCap size={15} /> Kelas 3 SD</span>
          <button className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} type="button" aria-label="Buka menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Navigasi mobile">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`mobile-nav-link ${activeTab === id ? "active" : ""}`} onClick={() => navigate(id)} type="button">
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function HomePage({
  progress,
  onNavigate,
  onChooseCategory
}: {
  progress: Progress;
  onNavigate: (tab: Tab) => void;
  onChooseCategory: (id: CategoryId) => void;
}) {
  const nextCategory = categories.find((category) => !progress.completedCategories.includes(category.id)) ?? categories[0];

  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker"><Sparkles size={15} /> Petualangan Bahasa Arab dimulai!</span>
          <h1>أَهْلًا وَسَهْلًا<br /><span>Halo, teman belajar!</span></h1>
          <p>Yuk, kenali kosakata Bahasa Arab lewat gambar, suara, kuis, dan permainan seru.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => { onChooseCategory(nextCategory.id); onNavigate("materials"); }} type="button">
              Mulai belajar <ArrowRight size={18} />
            </button>
            <button className="button button-light" onClick={() => onNavigate("quiz")} type="button">
              Coba kuis <Brain size={17} />
            </button>
          </div>
          <div className="hero-mini-stats">
            <span><Star size={16} fill="currentColor" /> {progress.points} poin terkumpul</span>
            <span><CheckCircle2 size={16} /> {progress.completedCategories.length}/5 tema selesai</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi buku dan bintang">
          <div className="hero-sun" />
          <div className="float-chip chip-one">مَرْحَبًا</div>
          <div className="float-chip chip-two">⭐</div>
          <div className="hero-book">
            <div className="book-page book-page-left"><span>ب</span><small>بِسْمِ اللهِ</small></div>
            <div className="book-page book-page-right"><span>ا</span><small>هَيَّا نَتَعَلَّمُ</small></div>
          </div>
          <div className="hero-pencil">✏️</div>
          <div className="hero-sparkle sparkle-one">✦</div>
          <div className="hero-sparkle sparkle-two">✧</div>
        </div>
      </section>

      <section className="welcome-row">
        <div>
          <span className="eyebrow">Ruang belajar kamu</span>
          <h2>Mau belajar apa hari ini?</h2>
          <p>Pilih kegiatan yang kamu suka. Belajar sedikit demi sedikit, ya!</p>
        </div>
        <div className="welcome-badge"><span>🌈</span><strong>Belajar itu seru!</strong></div>
      </section>

      <section className="feature-grid">
        <button className="feature-card feature-peach" onClick={() => onNavigate("materials")} type="button">
          <span className="feature-icon"><BookOpen size={26} /></span>
          <span className="feature-text"><strong>Belajar Kosakata</strong><small>Lihat gambar, baca kata, dan dengarkan suaranya.</small></span>
          <ChevronRight size={20} className="feature-arrow" />
        </button>
        <button className="feature-card feature-purple" onClick={() => onNavigate("quiz")} type="button">
          <span className="feature-icon"><Brain size={26} /></span>
          <span className="feature-text"><strong>Kuis Tebak Arti</strong><small>Uji ingatanmu dengan pertanyaan pilihan ganda.</small></span>
          <ChevronRight size={20} className="feature-arrow" />
        </button>
        <button className="feature-card feature-mint" onClick={() => onNavigate("matching")} type="button">
          <span className="feature-icon"><Puzzle size={26} /></span>
          <span className="feature-text"><strong>Permainan Pasangan</strong><small>Cocokkan kata Bahasa Arab dengan artinya.</small></span>
          <ChevronRight size={20} className="feature-arrow" />
        </button>
      </section>

      <section className="content-section">
        <div className="section-topline">
          <SectionHeading eyebrow="Pilih tema" title="Ayo, jelajahi kosakata!" description="Ada banyak kata baru yang bisa kamu pelajari." />
          <button className="text-link" onClick={() => onNavigate("materials")} type="button">Lihat semua <ChevronRight size={16} /></button>
        </div>
        <div className="category-grid">
          {categories.map((category) => {
            const completed = progress.completedCategories.includes(category.id);
            const count = getVocabularyByCategory(category.id).length;
            return (
              <button
                key={category.id}
                className="category-card"
                onClick={() => { onChooseCategory(category.id); onNavigate("materials"); }}
                type="button"
              >
                <span className="category-emoji" style={{ backgroundColor: category.softColor }}>{category.emoji}</span>
                <span className="category-info">
                  <strong>{category.name}</strong>
                  <span className="arabic-small" dir="rtl">{category.arabicName}</span>
                  <small>{count} kosakata</small>
                </span>
                <span className="category-status" style={{ color: category.color }}>{completed ? <CheckCircle2 size={19} /> : <ChevronRight size={19} />}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="progress-panel">
        <div className="progress-panel-icon"><Trophy size={25} /></div>
        <div className="progress-panel-copy">
          <strong>Perjalanan belajarmu</strong>
          <span>Kamu sudah menyelesaikan {progress.completedCategories.length} dari 5 tema.</span>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${(progress.completedCategories.length / categories.length) * 100}%` }} /></div>
        </div>
        <div className="progress-panel-score"><strong>{progress.points}</strong><small>total poin</small></div>
      </section>
    </div>
  );
}

function MaterialsPage({
  selectedCategory,
  onSelectCategory,
  progress,
  onComplete
}: {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  progress: Progress;
  onComplete: (id: CategoryId) => void;
}) {
  const category = getCategory(selectedCategory);
  const words = getVocabularyByCategory(selectedCategory);
  const completed = progress.completedCategories.includes(selectedCategory);

  return (
    <div className="page-content">
      <SectionHeading eyebrow="Materi pembelajaran" title="Belajar kosakata" description="Pilih tema, lihat gambarnya, lalu dengarkan cara membacanya." />
      <div className="category-tabs" role="tablist" aria-label="Pilih tema kosakata">
        {categories.map((item) => (
          <button key={item.id} className={`category-tab ${selectedCategory === item.id ? "active" : ""}`} onClick={() => onSelectCategory(item.id)} type="button">
            <span>{item.emoji}</span>{item.name}
          </button>
        ))}
      </div>

      <div className="lesson-banner" style={{ backgroundColor: category.softColor, borderColor: category.color }}>
        <div className="lesson-banner-icon">{category.emoji}</div>
        <div className="lesson-banner-copy">
          <span className="eyebrow">Tema pilihanmu</span>
          <h3>{category.name}</h3>
          <p className="arabic-medium" dir="rtl">{category.arabicName}</p>
          <small>{category.description}</small>
        </div>
        <div className="lesson-count"><strong>{words.length}</strong><span>kosakata</span></div>
      </div>

      <div className="word-grid">
        {words.map((item, index) => (
          <VocabularyCard key={item.id} item={item} index={index + 1} />
        ))}
      </div>

      <div className="lesson-finish">
        <div>
          <strong>{completed ? "Hebat! Tema ini sudah kamu selesaikan." : "Sudah mengenal semua kosakata?"}</strong>
          <span>{completed ? "Kamu boleh belajar tema lain atau mengulanginya." : "Tandai tema ini selesai setelah kamu mempelajarinya."}</span>
        </div>
        <button className={`button ${completed ? "button-success" : "button-primary"}`} onClick={() => onComplete(selectedCategory)} type="button" disabled={completed}>
          {completed ? <><CheckCircle2 size={17} /> Selesai dipelajari</> : <>Tandai selesai <Star size={17} /></>}
        </button>
      </div>
    </div>
  );
}

function VocabularyCard({ item, index }: { item: VocabularyItem; index: number }) {
  return (
    <article className="word-card">
      <div className="word-card-top"><span className="word-number">#{String(index).padStart(2, "0")}</span><AudioButton text={item.arabic} compact /></div>
      <div className="word-picture"><img src={item.image} alt={`Ilustrasi ${item.meaning}`} loading="lazy" /></div>
      <div className="word-details">
        <h3 className="arabic-word" dir="rtl" lang="ar">{item.arabic}</h3>
        <span className="transliteration">{item.transliteration}</span>
        <strong className="word-meaning">{item.meaning}</strong>
      </div>
    </article>
  );
}

interface QuizQuestion {
  item: VocabularyItem;
  options: VocabularyItem[];
}

function createQuizQuestions(): QuizQuestion[] {
  const selected = shuffle(vocabulary).slice(0, 5);
  return selected.map((item) => ({
    item,
    options: shuffle([item, ...shuffle(vocabulary.filter((word) => word.id !== item.id)).slice(0, 3)])
  }));
}

function QuizPage({ onComplete }: { onComplete: (correct: number, total: number) => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = () => {
    setQuestions(createQuizQuestions());
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setFinished(false);
  };

  const current = questions[questionIndex];
  const isCorrect = current && selectedAnswer === current.item.id;

  const chooseAnswer = (id: string) => {
    if (selectedAnswer || !current) return;
    setSelectedAnswer(id);
    if (id === current.item.id) setCorrectCount((count) => count + 1);
  };

  const nextQuestion = () => {
    if (!current || !selectedAnswer) return;
    if (questionIndex === questions.length - 1) {
      const finalCorrect = correctCount;
      setFinished(true);
      onComplete(finalCorrect, questions.length);
    } else {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="page-content narrow-page">
        <SectionHeading eyebrow="Tantangan seru" title="Kuis tebak arti" description="Seberapa banyak kosakata Bahasa Arab yang sudah kamu ingat?" />
        <div className="activity-intro quiz-intro">
          <div className="activity-illustration">🧠</div>
          <span className="activity-tag">5 pertanyaan • Pilihan ganda</span>
          <h3>Siap menguji ingatanmu?</h3>
          <p>Pilih arti Bahasa Indonesia yang paling tepat dari kosakata Bahasa Arab yang muncul. Setiap jawaban benar mendapat 10 poin.</p>
          <button className="button button-primary button-large" onClick={startQuiz} type="button">Mulai kuis <ArrowRight size={18} /></button>
        </div>
        <div className="tip-box"><Sparkles size={18} /><span>Tips: pelajari materi kosakata terlebih dahulu agar kamu lebih percaya diri!</span></div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="page-content narrow-page">
        <div className="result-card">
          <div className="result-confetti">🎉</div>
          <span className="eyebrow">Kuis selesai</span>
          <h2>{percentage >= 80 ? "Masyaallah, hebat sekali!" : percentage >= 60 ? "Bagus! Terus berlatih, ya!" : "Jangan menyerah, yuk coba lagi!"}</h2>
          <div className="result-score-circle"><strong>{correctCount * 10}</strong><span>poin</span></div>
          <p>Kamu menjawab <strong>{correctCount} dari {questions.length}</strong> pertanyaan dengan benar.</p>
          <div className="result-stats">
            <div><CheckCircle2 size={19} /><strong>{correctCount}</strong><small>Benar</small></div>
            <div><Target size={19} /><strong>{questions.length - correctCount}</strong><small>Perlu latihan</small></div>
            <div><Trophy size={19} /><strong>{percentage}%</strong><small>Nilai</small></div>
          </div>
          <button className="button button-primary button-large" onClick={startQuiz} type="button"><RotateCcw size={17} /> Main lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content narrow-page">
      <div className="quiz-top">
        <div><span className="eyebrow">Kuis kosakata</span><h2>Yuk, tebak artinya!</h2></div>
        <span className="question-counter">Soal {questionIndex + 1} dari {questions.length}</span>
      </div>
      <div className="quiz-progress"><div style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
      <div className="quiz-question-card">
        <span className="question-label">Apa arti dari kata berikut?</span>
        <div className="quiz-word-picture"><img src={current.item.image} alt={`Ilustrasi ${current.item.meaning}`} /></div>
        <h3 className="arabic-word quiz-arabic" dir="rtl" lang="ar">{current.item.arabic}</h3>
        <span className="transliteration">{current.item.transliteration}</span>
        <AudioButton text={current.item.arabic} />
      </div>
      <div className="answer-list">
        {current.options.map((option, index) => {
          const chosen = selectedAnswer === option.id;
          const correct = option.id === current.item.id;
          let stateClass = "";
          if (selectedAnswer && correct) stateClass = "answer-correct";
          else if (chosen && !correct) stateClass = "answer-wrong";
          return (
            <button key={option.id} className={`answer-option ${stateClass}`} onClick={() => chooseAnswer(option.id)} disabled={Boolean(selectedAnswer)} type="button">
              <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option.meaning}</span>
              {selectedAnswer && correct && <CheckCircle2 size={19} />}
              {chosen && !correct && <X size={19} />}
            </button>
          );
        })}
      </div>
      {selectedAnswer && (
        <div className={`answer-feedback ${isCorrect ? "feedback-correct" : "feedback-wrong"}`}>
          {isCorrect ? <CheckCircle2 size={20} /> : <CircleHelp size={20} />}
          <div><strong>{isCorrect ? "Jawabanmu benar!" : "Belum tepat, tidak apa-apa!"}</strong><span>{current.item.arabic} berarti {current.item.meaning}. Yuk, lanjut!</span></div>
        </div>
      )}
      <button className="button button-primary button-full" onClick={nextQuestion} disabled={!selectedAnswer} type="button">
        {questionIndex === questions.length - 1 ? "Lihat hasil" : "Soal berikutnya"} <ChevronRight size={18} />
      </button>
    </div>
  );
}

interface MatchPair {
  item: VocabularyItem;
}

function MatchingPage({ onComplete }: { onComplete: () => void }) {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startGame = () => {
    const nextPairs = shuffle(vocabulary).slice(0, 5).map((item) => ({ item }));
    setPairs(nextPairs);
    setSelectedWord(null);
    setSelectedMeaning(null);
    setMatchedIds([]);
    setWrongPair([]);
    setMistakes(0);
    setCompleted(false);
  };

  const attemptMatch = (wordId: string, meaningId: string) => {
    if (wordId === meaningId) {
      const nextMatched = [...matchedIds, wordId];
      setMatchedIds(nextMatched);
      setSelectedWord(null);
      setSelectedMeaning(null);
      if (nextMatched.length === pairs.length) {
        setCompleted(true);
        onComplete();
      }
    } else {
      setMistakes((count) => count + 1);
      setWrongPair([wordId, meaningId]);
      window.setTimeout(() => {
        setWrongPair([]);
        setSelectedWord(null);
        setSelectedMeaning(null);
      }, 700);
    }
  };

  const chooseWord = (id: string) => {
    if (matchedIds.includes(id) || wrongPair.length) return;
    if (selectedWord === id) {
      setSelectedWord(null);
      return;
    }
    if (selectedMeaning) {
      attemptMatch(id, selectedMeaning);
    } else {
      setSelectedWord(id);
    }
  };

  const chooseMeaning = (id: string) => {
    if (matchedIds.includes(id) || wrongPair.length) return;
    if (selectedMeaning === id) {
      setSelectedMeaning(null);
      return;
    }
    if (selectedWord) {
      attemptMatch(selectedWord, id);
    } else {
      setSelectedMeaning(id);
    }
  };

  const wordItems = useMemo(() => shuffle(pairs.map((pair) => pair.item)), [pairs]);
  const meaningItems = useMemo(() => shuffle(pairs.map((pair) => pair.item)), [pairs]);

  if (pairs.length === 0) {
    return (
      <div className="page-content narrow-page">
        <SectionHeading eyebrow="Permainan interaktif" title="Pasangkan kata dan arti" description="Ayo cari pasangan yang cocok. Pilih satu kata Arab dan satu arti Bahasa Indonesia." />
        <div className="activity-intro matching-intro">
          <div className="activity-illustration">🧩</div>
          <span className="activity-tag">5 pasangan kata</span>
          <h3>Temukan semua pasangannya!</h3>
          <p>Pilih kartu di sebelah kiri, lalu pilih arti yang sesuai di sebelah kanan. Kamu tidak perlu menarik kartu, cukup ketuk saja.</p>
          <button className="button button-primary button-large" onClick={startGame} type="button">Mulai bermain <ArrowRight size={18} /></button>
        </div>
        <div className="tip-box"><Heart size={18} /><span>Tenang saja, kalau salah kamu bisa mencoba lagi. Yang penting terus belajar!</span></div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="page-content narrow-page">
        <div className="result-card matching-result">
          <div className="result-confetti">🏆</div>
          <span className="eyebrow">Permainan selesai</span>
          <h2>Hebat! Semua pasangan ditemukan!</h2>
          <div className="result-score-circle"><strong>5/5</strong><span>pasangan</span></div>
          <p>Kamu menyelesaikan permainan dengan {mistakes} kali percobaan yang belum cocok.</p>
          <button className="button button-primary button-large" onClick={startGame} type="button"><RotateCcw size={17} /> Main lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="quiz-top">
        <div><span className="eyebrow">Permainan mencocokkan</span><h2>Cari pasangan yang tepat!</h2></div>
        <span className="question-counter">{matchedIds.length}/{pairs.length} cocok</span>
      </div>
      <div className="quiz-progress"><div style={{ width: `${(matchedIds.length / pairs.length) * 100}%` }} /></div>
      <div className="matching-instruction"><Puzzle size={19} /><span>Pilih kata Bahasa Arab, lalu pilih arti yang sesuai.</span></div>
      <div className="matching-board">
        <div className="matching-column">
          <h3><span>ا</span> Bahasa Arab</h3>
          {wordItems.map((item) => {
            const matched = matchedIds.includes(item.id);
            const selected = selectedWord === item.id;
            const wrong = wrongPair.includes(item.id);
            return (
              <button key={item.id} className={`match-option ${selected ? "selected" : ""} ${matched ? "matched" : ""} ${wrong ? "wrong" : ""}`} onClick={() => chooseWord(item.id)} disabled={matched} type="button">
                <span className="match-emoji">{item.emoji}</span><span className="arabic-match" dir="rtl">{item.arabic}</span>
                {matched && <CheckCircle2 size={17} />}
              </button>
            );
          })}
        </div>
        <div className="matching-column">
          <h3><span>✓</span> Artinya</h3>
          {meaningItems.map((item) => {
            const matched = matchedIds.includes(item.id);
            const selected = selectedMeaning === item.id;
            const wrong = wrongPair.includes(item.id);
            return (
              <button key={item.id} className={`match-option ${selected ? "selected" : ""} ${matched ? "matched" : ""} ${wrong ? "wrong" : ""}`} onClick={() => chooseMeaning(item.id)} disabled={matched} type="button">
                <span className="meaning-match">{item.meaning}</span>
                {matched && <CheckCircle2 size={17} />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="matching-footer"><span><CheckCircle2 size={16} /> {matchedIds.length} pasangan benar</span><span><Target size={16} /> {mistakes} percobaan belum cocok</span></div>
      <button className="button button-light button-full" onClick={startGame} type="button"><RotateCcw size={16} /> Acak dan mulai ulang</button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><span className="brand-mark"><BookOpen size={19} /></span><strong>MufradatKu</strong></div>
      <p>Belajar kosakata Bahasa Arab jadi lebih mudah dan menyenangkan.</p>
      <span className="footer-note">Dibuat untuk teman-teman hebat kelas 3 SD ✨</span>
    </footer>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("buah");
  const [progress, setProgress] = useState<Progress>(readProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeCategory = (id: CategoryId) => {
    setProgress((previous) => {
      if (previous.completedCategories.includes(id)) return previous;
      return {
        ...previous,
        completedCategories: [...previous.completedCategories, id],
        points: previous.points + 10
      };
    });
  };

  const completeQuiz = (correct: number, total: number) => {
    setProgress((previous) => ({
      ...previous,
      points: previous.points + correct * 10,
      quizzesPlayed: previous.quizzesPlayed + 1,
      bestQuizScore: Math.max(previous.bestQuizScore, Math.round((correct / total) * 100))
    }));
  };

  const completeMatching = () => {
    setProgress((previous) => ({
      ...previous,
      points: previous.points + 20,
      matchingPlayed: previous.matchingPlayed + 1
    }));
  };

  const resetProgress = () => {
    if (window.confirm("Yakin ingin menghapus semua progres dan poin belajar di perangkat ini?")) {
      setProgress(defaultProgress);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="app-shell">
      <Header activeTab={activeTab} onNavigate={setActiveTab} />
      <main>
        {activeTab === "home" && <HomePage progress={progress} onNavigate={setActiveTab} onChooseCategory={setSelectedCategory} />}
        {activeTab === "materials" && <MaterialsPage selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} progress={progress} onComplete={completeCategory} />}
        {activeTab === "quiz" && <QuizPage onComplete={completeQuiz} />}
        {activeTab === "matching" && <MatchingPage onComplete={completeMatching} />}
      </main>
      <Footer />
      <button className="reset-progress" onClick={resetProgress} type="button" title="Reset progres belajar">
        <RotateCcw size={14} /><span>Reset progres</span>
      </button>
    </div>
  );
}
