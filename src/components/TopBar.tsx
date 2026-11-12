import React from 'react';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/content';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#0A1F3D] text-slate-200 text-xs border-b border-blue-950/80 hidden md:block py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Left: Indicator & Hours */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-blue-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Kredietadvies & Informatie België</span>
          </div>
          <span className="text-blue-900 hidden md:inline">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{COMPANY_INFO.openingHours}</span>
          </div>
        </div>

        {/* Right: Contact & Location */}
        <div className="flex items-center gap-4 text-slate-200">
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>{COMPANY_INFO.email}</span>
          </a>
          <span className="text-blue-900">|</span>
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 hover:text-sky-300 font-bold transition-colors text-white"
          >
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span>{COMPANY_INFO.phone}</span>
          </a>
          <span className="text-blue-900 hidden lg:inline">|</span>
          <div className="hidden lg:flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Brussel, België</span>
          </div>
        </div>
      </div>
    </div>
  );
};
