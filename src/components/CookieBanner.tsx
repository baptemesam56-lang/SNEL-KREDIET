import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings } from 'lucide-react';
import { PageId } from '../types';

interface CookieBannerProps {
  onNavigate: (page: PageId) => void;
  forceOpenSettings?: boolean;
  onCloseSettings?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onNavigate,
  forceOpenSettings = false,
  onCloseSettings,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Cookie states
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [functionalEnabled, setFunctionalEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('snelkrediet_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (forceOpenSettings) {
      setShowSettingsModal(true);
    }
  }, [forceOpenSettings]);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'snelkrediet_cookie_consent',
      JSON.stringify({ necessary: true, analytics: true, functional: true, date: new Date().toISOString() })
    );
    setIsVisible(false);
    setShowSettingsModal(false);
    if (onCloseSettings) onCloseSettings();
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      'snelkrediet_cookie_consent',
      JSON.stringify({ necessary: true, analytics: false, functional: false, date: new Date().toISOString() })
    );
    setIsVisible(false);
    setShowSettingsModal(false);
    if (onCloseSettings) onCloseSettings();
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'snelkrediet_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: analyticsEnabled,
        functional: functionalEnabled,
        date: new Date().toISOString(),
      })
    );
    setIsVisible(false);
    setShowSettingsModal(false);
    if (onCloseSettings) onCloseSettings();
  };

  return (
    <>
      {/* Floating Bottom Banner */}
      {isVisible && !showSettingsModal && (
        <aside
          aria-label="Cookie-toestemming"
          className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 text-white shadow-2xl animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-slate-300">
                <p className="font-semibold text-white">
                  Privacy- en cookie-instellingen bij Snel Krediet
                </p>
                <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
                  Wij gebruiken noodzakelijke cookies om onze website en kredietsimulator veilig en foutloos te laten werken. Met uw toestemming gebruiken we tevens analytische cookies om onze kredietvoorlichting te verbeteren. Wij verkopen nooit uw gegevens.{' '}
                  <button
                    onClick={() => onNavigate('cookies')}
                    className="text-emerald-400 underline hover:text-emerald-300"
                  >
                    Lees ons cookiebeleid
                  </button>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Instellingen</span>
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Enkel noodzakelijke
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
              >
                Alles accepteren
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold font-display">Cookie-voorkeuren beheren</h3>
              </div>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              {/* Category: Essential */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Noodzakelijke cookies</span>
                    <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Verplicht
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Vereist voor basisfunctionaliteiten zoals beveiliging, pagina-navigatie en de goede werking van de kredietsimulator. Kunnen niet worden uitgeschakeld.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-emerald-600 cursor-not-allowed opacity-60 mt-1"
                />
              </div>

              {/* Category: Functional */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">Functionele cookies</div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Onthouden uw simulatiekeuzes (bijvoorbeeld het geselecteerde leenbedrag) zodat u niet opnieuw hoeft te beginnen bij het vernieuwen van de pagina.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={functionalEnabled}
                  onChange={(e) => setFunctionalEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-1"
                />
              </div>

              {/* Category: Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">Analytische cookies</div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Helpen ons begrijpen welke pagina’s en kredietoplossingen het meest bezocht worden, zodat wij onze consumenteninformatie kunnen verfijnen.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Alles weigeren
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Mijn voorkeuren opslaan
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  Alles aanvaarden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
