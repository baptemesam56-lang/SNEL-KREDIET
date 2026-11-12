import React, { useState } from 'react';
import { ColorTheme } from '../types';
import { THEMES } from '../utils/theme';
import { Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const themeList: ColorTheme[] = ['luminous-blue', 'royal-navy', 'emerald-gold'];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/90 hover:bg-white text-slate-800 border-slate-300"
        title="Verander de visuele stijl en kleuren van de website"
        aria-label="Kleurthema wijzigen"
      >
        <Palette className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">Kleurstijl:</span>
        <span className="font-bold text-slate-900">{THEMES[currentTheme].badge}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-2xl border border-slate-200 p-2 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              Kies een visuele stijl
            </div>
            <div className="space-y-1 mt-1">
              {themeList.map((t) => {
                const cfg = THEMES[t];
                const isSelected = currentTheme === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onSelectTheme(t);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-100 font-bold text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: cfg.primaryColor }}
                      />
                      <div>
                        <div className="font-semibold">{cfg.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{cfg.badge}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
