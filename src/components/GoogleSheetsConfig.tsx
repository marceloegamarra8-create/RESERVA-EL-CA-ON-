/**
 * @file src/components/GoogleSheetsConfig.tsx
 * @description Panel de enlace con Google Sheets, instrucciones paso a paso
 * y código fuente de Google Apps Script listo para copiar con un clic.
 * Escuela Especial N° 1429 "Dra. Sara Faisal"
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Check,
  Copy,
  ExternalLink,
  Save,
  Send,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Code2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  APPS_SCRIPT_CODE,
  APPS_SCRIPT_INSTRUCTIONS,
} from '../services/appsScriptTemplate';
import { testWebhookConnection } from '../services/sheetsService';
import { getAppConfig, saveAppConfig } from '../services/storage';

interface GoogleSheetsConfigProps {
  onSaved: () => void;
}

export const GoogleSheetsConfig: React.FC<GoogleSheetsConfigProps> = ({ onSaved }) => {
  const currentConfig = getAppConfig();
  const [webhookUrl, setWebhookUrl] = useState(currentConfig.webhookUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppConfig({ webhookUrl: webhookUrl.trim() });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onSaved();
  };

  const handleTestConnection = async () => {
    if (!webhookUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Primero ingresa la URL de tu Webhook para poder probar la conexión.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testWebhookConnection(webhookUrl.trim());
    setIsTesting(false);
    setTestResult(res);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Tarjeta de configuración del Webhook */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Conexión con Google Sheets
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Cada reserva completada en la web impactará en tiempo real en tu planilla de cálculo de Google.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              URL del Webhook de Google Apps Script (Terminada en /exec)
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {webhookUrl ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> URL configurada
                </span>
              ) : (
                'Deja vacío para operar temporalmente en base de datos local del navegador.'
              )}
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar URL</span>
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !webhookUrl.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              {isTesting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                  <span>Probando...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Probar Conexión</span>
                </>
              )}
            </button>

            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 ml-2">
                <Check className="w-4 h-4" /> ¡Configuración guardada!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* GUÍA PASO A PASO */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Instrucciones para Configurar Google Sheets
            </h3>
          </div>
          <a
            href="https://sheets.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
          >
            <span>Ir a Google Sheets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-3.5">
          {APPS_SCRIPT_INSTRUCTIONS.map((item) => (
            <div key={item.step} className="flex items-start gap-3 text-xs sm:text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mt-0.5">
                {item.step}
              </span>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">{item.title}</p>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {item.description}
                </p>
                {item.substeps && (
                  <ul className="mt-1 space-y-1 pl-2 border-l-2 border-sky-200 text-xs text-slate-600">
                    {item.substeps.map((sub, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CÓDIGO DE GOOGLE APPS SCRIPT LISTO PARA COPIAR */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Código Fuente de Google Apps Script (Código.gs)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullCode(!showFullCode)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
            >
              <span>{showFullCode ? 'Colapsar visor' : 'Expandir visor'}</span>
              {showFullCode ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Copia este código y pégalo en el editor de Apps Script de tu planilla. Creará automáticamente los encabezados con el color institucional y registrará cada reserva.
        </p>

        <div className="relative">
          <pre
            className={`bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto transition-all ${
              showFullCode ? 'max-h-[600px]' : 'max-h-48'
            }`}
          >
            <code>{APPS_SCRIPT_CODE}</code>
          </pre>
          {!showFullCode && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900 to-transparent rounded-b-xl pointer-events-none flex items-end justify-center pb-2">
              <span className="text-[11px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
                Haz clic en "Expandir visor" o "Copiar Código" para ver todo
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
