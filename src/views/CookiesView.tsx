import React from 'react';
import { COMPANY_INFO } from '../data/content';
import { Cookie, Settings, ShieldCheck } from 'lucide-react';

interface CookiesViewProps {
  onOpenCookieSettings: () => void;
}

export const CookiesView: React.FC<CookiesViewProps> = ({ onOpenCookieSettings }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10 text-slate-800">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0F4C81]">
          <Cookie className="w-4 h-4 text-[#0F4C81]" />
          <span>Transparant Cookiebeheer België</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Cookiebeleid
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Laatst bijgewerkt: 1 januari 2026 · {COMPANY_INFO.legalName}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            1. Wat zijn cookies?
          </h2>
          <p>
            Cookies zijn kleine tekstbestanden die bij een bezoek aan onze website op uw computer of mobiel apparaat worden opgeslagen. Zij zorgen ervoor dat de website naar behoren functioneert, uw voorkeuren onthoudt (zoals het gekozen leenbedrag in de calculator) en helpen ons om de gebruikerservaring te optimaliseren.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            2. Welke soorten cookies gebruiken wij?
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Strikt Noodzakelijke Cookies (Essentieel)</span>
                <span className="text-[10px] bg-blue-100 text-[#0F4C81] font-semibold px-2 py-0.5 rounded font-mono">Altijd actief</span>
              </div>
              <p className="text-xs text-slate-600">
                Deze cookies zijn onmisbaar om u in staat te stellen door de website te navigeren, veilige formulieren in te vullen en misbruik of geautomatiseerde spam te voorkomen. Zonder deze cookies kan de website niet correct functioneren.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">Functionele Cookies</div>
              <p className="text-xs text-slate-600">
                Zorgen voor een verbeterde en gepersonaliseerde werking, zoals het onthouden van uw simulatiekeuzes in de kredietsimulator tijdens uw actieve sessie.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">Analytische Cookies (Geanonimiseerd)</div>
              <p className="text-xs text-slate-600">
                Helpen ons geaggregeerde statistieken te verzamelen over het aantal bezoekers en de meest geraadpleegde pagina’s, zonder dat individuele bezoekers direct identificeerbaar zijn.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            3. Uw cookie-instellingen aanpassen
          </h2>
          <p>
            U kunt uw voorkeuren te allen tijde wijzigen of uw toestemming intrekken via onze interactieve cookie-instellingen:
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenCookieSettings}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/25 transition-colors"
            >
              <Settings className="w-4 h-4 text-sky-300" />
              <span>Cookie-voorkeuren beheren</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
