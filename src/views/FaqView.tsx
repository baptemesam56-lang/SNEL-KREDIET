import React, { useState, useMemo } from 'react';
import { PageId } from '../types';
import { FAQ_LIST } from '../data/content';
import { Search, HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

interface FaqViewProps {
  onNavigate: (page: PageId) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const categories = useMemo(() => {
    const cats = Array.from(new Set(FAQ_LIST.map((f) => f.category)));
    return ['all', ...cats];
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const faqSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_LIST.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }), []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Schema.org FAQPage JSON-LD Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
          Kenniscentrum & Vragen
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Veelgestelde vragen over leningen in België
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Vind duidelijke en betrouwbare antwoorden op al uw vragen over het aanvragen van een lening, de Belgische regelgeving en onze werkwijze.
        </p>
      </div>

      {/* Search Bar & Filter Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek een vraag of onderwerp (bijv. JKP, vervroegde terugbetaling, CKP)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0F4C81] text-white shadow-sm font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Alle categorieën' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
            Geen vragen gevonden voor uw zoekopdracht. Neem gerust rechtstreeks contact met ons op.
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = !!openItems[index];
            return (
              <div
                key={faq.question}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-[#0F4C81] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still have questions card */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center space-y-3">
        <MessageCircle className="w-8 h-8 text-[#0F4C81] mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 font-display">
          Staat uw specifieke vraag er niet tussen?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Onze adviseurs helpen u graag verder met persoonlijk en discreet advies op maat van uw situatie.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/25 transition-colors"
          >
            Neem contact met ons op
          </button>
        </div>
      </div>
    </div>
  );
};
