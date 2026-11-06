export type CategoryId = "buah" | "hewan" | "kelas" | "tubuh" | "keluarga";

export interface Category {
  id: CategoryId;
  name: string;
  arabicName: string;
  description: string;
  emoji: string;
  color: string;
  softColor: string;
}

export interface VocabularyItem {
  id: string;
  categoryId: CategoryId;
  arabic: string;
  transliteration: string;
  meaning: string;
  emoji: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "buah",
    name: "Buah-buahan",
    arabicName: "الْفَوَاكِهُ",
    description: "Kenali nama buah yang sering kamu temui.",
    emoji: "🍎",
    color: "#f07867",
    softColor: "#fff0ed"
  },
  {
    id: "hewan",
    name: "Hewan",
    arabicName: "الْحَيَوَانَاتُ",
    description: "Belajar nama hewan di sekitar kita.",
    emoji: "🐱",
    color: "#8b75d7",
    softColor: "#f2efff"
  },
  {
    id: "kelas",
    name: "Benda di kelas",
    arabicName: "أَدَوَاتُ الْفَصْلِ",
    description: "Temukan nama benda yang ada di kelas.",
    emoji: "🎒",
    color: "#e9a23b",
    softColor: "#fff6e7"
  },
  {
    id: "tubuh",
    name: "Anggota tubuh",
    arabicName: "أَعْضَاءُ الْجِسْمِ",
    description: "Kenali bagian-bagian tubuh manusia.",
    emoji: "🙋",
    color: "#4da99a",
    softColor: "#eaf8f4"
  },
  {
    id: "keluarga",
    name: "Keluarga",
    arabicName: "الْأُسْرَةُ",
    description: "Belajar menyebut anggota keluarga.",
    emoji: "👨‍👩‍👧",
    color: "#e17aa8",
    softColor: "#fff0f6"
  }
];

export const vocabulary: VocabularyItem[] = [
  { id: "apple", categoryId: "buah", arabic: "تُفَّاحٌ", transliteration: "Tuffāḥun", meaning: "Apel", emoji: "🍎", image: "/images/vocab/apple.svg" },
  { id: "banana", categoryId: "buah", arabic: "مَوْزٌ", transliteration: "Mawzun", meaning: "Pisang", emoji: "🍌", image: "/images/vocab/banana.svg" },
  { id: "orange", categoryId: "buah", arabic: "بُرْتُقَالٌ", transliteration: "Burtuqālun", meaning: "Jeruk", emoji: "🍊", image: "/images/vocab/orange.svg" },
  { id: "grape", categoryId: "buah", arabic: "عِنَبٌ", transliteration: "‘Inabun", meaning: "Anggur", emoji: "🍇", image: "/images/vocab/grape.svg" },

  { id: "cat", categoryId: "hewan", arabic: "قِطٌّ", transliteration: "Qiṭṭun", meaning: "Kucing", emoji: "🐱", image: "/images/vocab/cat.svg" },
  { id: "dog", categoryId: "hewan", arabic: "كَلْبٌ", transliteration: "Kalbun", meaning: "Anjing", emoji: "🐶", image: "/images/vocab/dog.svg" },
  { id: "cow", categoryId: "hewan", arabic: "بَقَرَةٌ", transliteration: "Baqaratun", meaning: "Sapi", emoji: "🐮", image: "/images/vocab/cow.svg" },
  { id: "rabbit", categoryId: "hewan", arabic: "أَرْنَبٌ", transliteration: "Arnabun", meaning: "Kelinci", emoji: "🐰", image: "/images/vocab/rabbit.svg" },

  { id: "book", categoryId: "kelas", arabic: "كِتَابٌ", transliteration: "Kitābun", meaning: "Buku", emoji: "📘", image: "/images/vocab/book.svg" },
  { id: "pen", categoryId: "kelas", arabic: "قَلَمٌ", transliteration: "Qalamun", meaning: "Pena", emoji: "🖊️", image: "/images/vocab/pen.svg" },
  { id: "eraser", categoryId: "kelas", arabic: "مِمْحَاةٌ", transliteration: "Mimḥātun", meaning: "Penghapus", emoji: "🧽", image: "/images/vocab/eraser.svg" },
  { id: "chair", categoryId: "kelas", arabic: "كُرْسِيٌّ", transliteration: "Kursiyyun", meaning: "Kursi", emoji: "🪑", image: "/images/vocab/chair.svg" },

  { id: "eye", categoryId: "tubuh", arabic: "عَيْنٌ", transliteration: "‘Aynun", meaning: "Mata", emoji: "👁️", image: "/images/vocab/eye.svg" },
  { id: "ear", categoryId: "tubuh", arabic: "أُذُنٌ", transliteration: "Udhunun", meaning: "Telinga", emoji: "👂", image: "/images/vocab/ear.svg" },
  { id: "hand", categoryId: "tubuh", arabic: "يَدٌ", transliteration: "Yadun", meaning: "Tangan", emoji: "✋", image: "/images/vocab/hand.svg" },
  { id: "foot", categoryId: "tubuh", arabic: "قَدَمٌ", transliteration: "Qadamun", meaning: "Kaki", emoji: "🦶", image: "/images/vocab/foot.svg" },

  { id: "father", categoryId: "keluarga", arabic: "أَبٌ", transliteration: "Abun", meaning: "Ayah", emoji: "👨", image: "/images/vocab/father.svg" },
  { id: "mother", categoryId: "keluarga", arabic: "أُمٌّ", transliteration: "Ummun", meaning: "Ibu", emoji: "👩", image: "/images/vocab/mother.svg" },
  { id: "brother", categoryId: "keluarga", arabic: "أَخٌ", transliteration: "Akhun", meaning: "Saudara laki-laki", emoji: "👦", image: "/images/vocab/brother.svg" },
  { id: "sister", categoryId: "keluarga", arabic: "أُخْتٌ", transliteration: "Ukhtun", meaning: "Saudara perempuan", emoji: "👧", image: "/images/vocab/sister.svg" }
];

export function getCategory(id: CategoryId) {
  return categories.find((category) => category.id === id)!;
}

export function getVocabularyByCategory(id: CategoryId) {
  return vocabulary.filter((item) => item.categoryId === id);
}
