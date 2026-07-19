import { Locale } from './types';

type Translations = Record<string, string>;

const dictionaries: Record<Locale, Translations> = {
  en: {
    // Header & Info
    'app.title': 'Smart Stadium Operations Co-Pilot',
    'app.subtitle': 'Real-Time Tournament Telemetry Control Center',
    'app.role': 'Venue Security Head & Volunteer Lead Dashboard',
    'app.localTime': 'Venue Local Time',
    'app.capacity': 'Stadium Capacity Limit',
    
    // Status Labels
    'status.nominal': 'Nominal Operations',
    'status.warning': 'Caution Warning',
    'status.alert': 'Critical Alert State',
    'status.title': 'System Status',
    
    // Fields
    'field.zone_id': 'Stadium Zone ID',
    'field.density': 'Crowd Density',
    'field.noise': 'Ambient Noise Level',
    'field.incident': 'Incident Flag',
    'field.incident_active': 'ACTIVE INCIDENT REPORTED',
    'field.incident_none': 'No Incidents Active',
    
    // UI elements
    'ui.presets': 'Scenario Validation Presets',
    'ui.preset_alpha': 'Scenario Alpha: Flawless Operations',
    'ui.preset_beta': 'Scenario Beta: Crowd Bottleneck (>80%)',
    'ui.preset_gamma': 'Scenario Gamma: Malformed Edge Cases',
    'ui.raw_json': 'Raw JSON Telemetry Playground',
    'ui.submit': 'Inject Telemetry Payload',
    'ui.reset': 'Reset Dashboard',
    'ui.validator_errors': 'Telemetry Engine Validation Log',
    'ui.validator_success': 'Payload validation passed cleanly.',
    'ui.xai_header': 'Explainable AI (XAI) Reasoning Trace',
    'ui.alerts_header': 'Security Alert Dispatch Feed',
    'ui.warnings_heading': 'Current Warning Stack',
    'ui.no_alerts': 'No security alerts active in the dispatch feed.',
    'ui.terminal_title': 'Playground Command Shell',
    'ui.xss_alert': 'SECURITY CRITICAL ALERT: Malicious markup or script tags detected in payload. Neutralization protocols applied. Scripts stripped to prevent Cross-Site Scripting (XSS).',
    'ui.waiting_stream': 'Waiting for injection stream...',
    'ui.trace_loading': 'Trace diagnostics loading...',
    'ui.sensor_calibration': 'Sensor Calibration range: 0 - 140 dB',

    // AI analyst panel translations
    'ai.title': 'Gemini AI Situational Analyst',
    'ai.subtitle': 'Powered by Google Gemini · Auto-updates on status transitions',
    'ai.last_updated': 'Last: {time}',
    'ai.reanalyze': '↺ Re-Analyze',
    'ai.analyzing': '⟳ Analyzing...',
    'ai.loading_message': 'Gemini is analyzing telemetry data...',
    'ai.error_title': '⚠ AI Analysis Error',
    'ai.key_hint': 'Add VITE_GEMINI_API_KEY to a .env file and restart the dev server.',
    'ai.waiting': 'Waiting for first telemetry injection to trigger analysis...',
    'ai.actions_header': '⚡ Recommended Actions',
    'ai.tips_header': '👥 Crowd Management',

    // XAI templates
    'reasoning.density_alert': 'At {time}, Zone {zone} density hit {density}%, triggering bottleneck alert protocols.',
    'reasoning.incident_flag': 'At {time}, a critical incident was flagged in Zone {zone}, initiating immediate security response.',
    'reasoning.density_warning': 'At {time}, Zone {zone} density reached {density}%, requiring crowd control monitoring.',
    'reasoning.noise_warning': 'At {time}, ambient noise levels in Zone {zone} reached {noise} dB, triggering loud crowd advisory.',
    'reasoning.nominal': 'At {time}, Zone {zone} density operates at {density}% and ambient noise at {noise} dB. All systems nominal.',
  },
  es: {
    // Header & Info
    'app.title': 'Copiloto de Operaciones Inteligentes del Estadio',
    'app.subtitle': 'Centro de Control de Telemetría del Torneo en Tiempo Real',
    'app.role': 'Tablero del Director de Seguridad del Local y Líder de Voluntarios',
    'app.localTime': 'Hora Local del Local',
    'app.capacity': 'Límite de Capacidad del Estadio',
    
    // Status Labels
    'status.nominal': 'Operaciones Nominales',
    'status.warning': 'Advertencia de Precaución',
    'status.alert': 'Estado de Alerta Crítico',
    'status.title': 'Estado del Sistema',
    
    // Fields
    'field.zone_id': 'ID de Zona del Estadio',
    'field.density': 'Densidad de la Multitud',
    'field.noise': 'Nivel de Ruido Ambiental',
    'field.incident': 'Bandera de Incidente',
    'field.incident_active': 'INCIDENTE ACTIVO REPORTADO',
    'field.incident_none': 'Ningún Incidente Activo',
    
    // UI elements
    'ui.presets': 'Ajustes Preestablecidos de Validación de Escenarios',
    'ui.preset_alpha': 'Escenario Alpha: Operaciones sin Fallos',
    'ui.preset_beta': 'Escenario Beta: Embotellamiento de Multitudes (>80%)',
    'ui.preset_gamma': 'Escenario Gamma: Casos Límite Mal Formados',
    'ui.raw_json': 'Área de Juegos de Telemetría JSON Sin Procesar',
    'ui.submit': 'Inyectar Carga Útil de Telemetría',
    'ui.reset': 'Restablecer Tablero',
    'ui.validator_errors': 'Registro de Validación del Motor de Telemetría',
    'ui.validator_success': 'Validación de carga útil aprobada limpiamente.',
    'ui.xai_header': 'Traza de Razonamiento de IA Explicable (XAI)',
    'ui.alerts_header': 'Canal de Envío de Alertas de Seguridad',
    'ui.warnings_heading': 'Pila de Advertencias Actuales',
    'ui.no_alerts': 'No hay alertas de seguridad activas en el canal de envío.',
    'ui.terminal_title': 'Consola de Comandos de Prueba',
    'ui.xss_alert': 'ALERTA CRÍTICA DE SEGURIDAD: Se detectaron etiquetas de script o marcado malicioso en la carga útil. Protocolos de neutralización aplicados. Scripts eliminados para evitar Cross-Site Scripting (XSS).',
    'ui.waiting_stream': 'Esperando flujo de inyección...',
    'ui.trace_loading': 'Cargando diagnósticos de traza...',
    'ui.sensor_calibration': 'Rango de calibración del sensor: 0 - 140 dB',

    // AI analyst panel translations
    'ai.title': 'Analista de Situación de IA Gemini',
    'ai.subtitle': 'Desarrollado por Google Gemini · Actualizaciones automáticas en transiciones de estado',
    'ai.last_updated': 'Último: {time}',
    'ai.reanalyze': '↺ Volver a analizar',
    'ai.analyzing': '⟳ Analizando...',
    'ai.loading_message': 'Gemini está analizando los datos de telemetría...',
    'ai.error_title': '⚠ Error de análisis de IA',
    'ai.key_hint': 'Agregue VITE_GEMINI_API_KEY a un archivo .env y reinicie el servidor de desarrollo.',
    'ai.waiting': 'Esperando la primera inyección de telemetría para activar el análisis...',
    'ai.actions_header': '⚡ Acciones recomendadas',
    'ai.tips_header': '👥 Gestión de multitudes',

    // XAI templates
    'reasoning.density_alert': 'A las {time}, la densidad de la Zona {zone} alcanzó el {density}%, activando los protocolos de alerta por embotellamiento.',
    'reasoning.incident_flag': 'A las {time}, se reportó un incidente crítico en la Zona {zone}, iniciando una respuesta de seguridad inmediata.',
    'reasoning.density_warning': 'A las {time}, la densidad de la Zona {zone} llegó al {density}%, requiriendo monitoreo de control de multitudes.',
    'reasoning.noise_warning': 'A las {time}, los niveles de ruido ambiental en la Zona {zone} alcanzaron {noise} dB, activando un aviso de multitud ruidosa.',
    'reasoning.nominal': 'A las {time}, la Zona {zone} opera con una densidad del {density}% y ruido ambiental de {noise} dB. Todos los sistemas nominales.',
  },
  fr: {
    // Header & Info
    'app.title': 'Co-Pilote des Opérations du Stade Intelligent',
    'app.subtitle': 'Centre de Contrôle de Télémétrie du Tournoi en Temps Réel',
    'app.role': 'Tableau de Bord du Chef de la Sécurité du Site & Chef des Bénévoles',
    'app.localTime': 'Heure Locale du Site',
    'app.capacity': 'Limite de Capacité du Stade',
    
    // Status Labels
    'status.nominal': 'Opérations Nominales',
    'status.warning': 'Avertissement de Caution',
    'status.alert': 'État d\'Alerte Critique',
    'status.title': 'Statut du Système',
    
    // Fields
    'field.zone_id': 'ID de Zone du Stade',
    'field.density': 'Densité de la Foule',
    'field.noise': 'Niveau de Bruit Ambiant',
    'field.incident': 'Indicateur d\'Incident',
    'field.incident_active': 'INCIDENT ACTIF SIGNALÉ',
    'field.incident_none': 'Aucun Incident Actif',
    
    // UI elements
    'ui.presets': 'Préréglages de Validation des Scénarios',
    'ui.preset_alpha': 'Scénario Alpha: Opérations Parfaites',
    'ui.preset_beta': 'Scénario Bêta: Goulot d\'Étranglement de Foule (>80%)',
    'ui.preset_gamma': 'Scénario Gamma: Cas Limites Mal Formés',
    'ui.raw_json': 'Terrain de Jeu de Télémétrie JSON Brut',
    'ui.submit': 'Injecter la Charge Utile de Télémétrie',
    'ui.reset': 'Réinitialiser le Tableau de Bord',
    'ui.validator_errors': 'Journal de Validation du Moteur de Télémétrie',
    'ui.validator_success': 'La validation de la charge utile a réussi proprement.',
    'ui.xai_header': 'Trace de Raisonnement de l\'IA Expliquable (XAI)',
    'ui.alerts_header': 'Flux d\'Envoi des Alertes de Sécurité',
    'ui.warnings_heading': 'Pile des Avertissements Actuels',
    'ui.no_alerts': 'Aucune alerte de sécurité active dans le flux d\'envoi.',
    'ui.terminal_title': 'Console de Commande de Jeu',
    'ui.xss_alert': 'ALERTE DE SÉCURITÉ CRITIQUE : Balises de script ou balises malveillantes détectées dans la charge utile. Protocoles de neutralisation appliqués. Scripts supprimés pour empêcher le Cross-Site Scripting (XSS).',
    'ui.waiting_stream': 'En attente du flux d\'injection...',
    'ui.trace_loading': 'Chargement des diagnostics de trace...',
    'ui.sensor_calibration': 'Plage de calibrage du capteur: 0 - 140 dB',

    // AI analyst panel translations
    'ai.title': 'Analyste de Situation IA Gemini',
    'ai.subtitle': 'Propulsé par Google Gemini · Mises à jour automatiques sur les transitions d\'état',
    'ai.last_updated': 'Dernier: {time}',
    'ai.reanalyze': '↺ Réanalyser',
    'ai.analyzing': '⟳ Analyse...',
    'ai.loading_message': 'Gemini analyse les données de télémétrie...',
    'ai.error_title': '⚠ Erreur d\'analyse d\'IA',
    'ai.key_hint': 'Ajoutez VITE_GEMINI_API_KEY dans un fichier .env et redémarrez le serveur.',
    'ai.waiting': 'En attente de la première injection de télémétrie pour déclencher l\'analyse...',
    'ai.actions_header': '⚡ Actions recommandées',
    'ai.tips_header': '👥 Gestion des foules',

    // XAI templates
    'reasoning.density_alert': 'À {time}, la densité de la Zone {zone} a atteint {density}%, déclenchant les protocoles d\'alerte de goulot d\'étranglement.',
    'reasoning.incident_flag': 'À {time}, un incident critique a été signalé dans la Zone {zone}, initiant une réponse de sécurité immédiate.',
    'reasoning.density_warning': 'À {time}, la densité de la Zone {zone} a atteint {density}%, nécessitant une surveillance du contrôle des foules.',
    'reasoning.noise_warning': 'À {time}, les niveaux de bruit ambiant dans la Zone {zone} ont atteint {noise} dB, déclenchant un avis de foule bruyante.',
    'reasoning.nominal': 'À {time}, la Zone {zone} fonctionne avec une densité de {density}% et un bruit ambiant de {noise} dB. Tous les systèmes nominaux.',
  },
  ar: {
    // Header & Info
    'app.title': 'مساعد عمليات الاستاد الذكي',
    'app.subtitle': 'مركز التحكم في قياس تورنمنت عن بعد في الوقت الفعلي',
    'app.role': 'لوحة تحكم رئيس أمن الموقع وقائد المتطوعين',
    'app.localTime': 'الوقت المحلي للموقع',
    'app.capacity': 'حد سعة الاستاد',
    
    // Status Labels
    'status.nominal': 'العمليات العادية',
    'status.warning': 'تحذير الحذر',
    'status.alert': 'حالة تنبيه حرجة',
    'status.title': 'حالة النظام',
    
    // Fields
    'field.zone_id': 'معرف منطقة الاستاد',
    'field.density': 'كثافة الحشود',
    'field.noise': 'مستوى الضوضاء المحيطة',
    'field.incident': 'مؤشر الحادث',
    'field.incident_active': 'تم الإبلاغ عن حادث نشط',
    'field.incident_none': 'لا توجد حوادث نشطة',
    
    // UI elements
    'ui.presets': 'تثبيتات التحقق من صحة السيناريو',
    'ui.preset_alpha': 'سيناريو ألفا: عمليات مستقرة مثالية',
    'ui.preset_beta': 'سيناريو بيتا: اختناق الحشود الحرجة (>80%)',
    'ui.preset_gamma': 'سيناريو غاما: حالات الحافة غير الصالحة',
    'ui.raw_json': 'ساحة اللعب لبيانات قياس JSON الخام',
    'ui.submit': 'حقن حمولة بيانات القياس',
    'ui.reset': 'إعادة ضبط لوحة التحكم',
    'ui.validator_errors': 'سجل التحقق من محرك قياس التورنمنت',
    'ui.validator_success': 'تم التحقق من صحة الحمولة بنجاح.',
    'ui.xai_header': 'تتبع منطق الذكاء الاصطناعي القابل للتفسير (XAI)',
    'ui.alerts_header': 'موجز إرسال تنبيهات الأمان',
    'ui.warnings_heading': 'حزمة التحذيرات الحالية',
    'ui.no_alerts': 'لا توجد تنبيهات أمنية نشطة في موجز الإرسال.',
    'ui.terminal_title': 'وحدة تحكم ساحة اللعب',
    'ui.xss_alert': 'تنبيه أمني هام: تم اكتشاف تعليمات برمجية أو علامات برمجية ضارة في الحمولة. تم تطبيق بروتوكولات المعالجة وتجريد النصوص البرمجية لمنع هجمات XSS.',
    'ui.waiting_stream': 'بانتظار تدفق الحقن...',
    'ui.trace_loading': 'جاري تحميل تتبع التشخيص...',
    'ui.sensor_calibration': 'نطاق معايرة المستشعر: 0 - 140 ديسيبل',

    // AI analyst panel translations
    'ai.title': 'محلل الوضع القائم على الذكاء الاصطناعي جيميناي',
    'ai.subtitle': 'بدعم من Google Gemini · تحديث تلقائي عند تغيير حالة النظام',
    'ai.last_updated': 'آخر تحديث: {time}',
    'ai.reanalyze': '↺ إعادة التحليل',
    'ai.analyzing': '⟳ جاري التحليل...',
    'ai.loading_message': 'جيميناي يقوم بتحليل بيانات قياس التورنمنت...',
    'ai.error_title': '⚠ خطأ في تحليل الذكاء الاصطناعي',
    'ai.key_hint': 'أضف VITE_GEMINI_API_KEY في ملف .env ثم أعد تشغيل خادم التطوير.',
    'ai.waiting': 'بانتظار حقن أول بيانات قياس لبدء التحليل...',
    'ai.actions_header': '⚡ الإجراءات الموصى بها',
    'ai.tips_header': '👥 إدارة الحشود',

    // XAI templates
    'reasoning.density_alert': 'في الساعة {time}، وصلت كثافة المنطقة {zone} إلى {density}%، مما أدى إلى تفعيل بروتوكولات تنبيه الاختناق.',
    'reasoning.incident_flag': 'في الساعة {time}، تم الإبلاغ عن حادث خطير في المنطقة {zone}، مما أدى إلى بدء استجابة أمنية فورية.',
    'reasoning.density_warning': 'في الساعة {time}، وصلت كثافة المنطقة {zone} إلى {density}%، مما يتطلب مراقبة التحكم في الحشود.',
    'reasoning.noise_warning': 'في الساعة {time}، وصلت مستويات الضوضاء المحيطة في المنطقة {zone} إلى {noise} ديسيبل، مما أدى إلى إطلاق تنبيه حشود صاخبة.',
    'reasoning.nominal': 'في الساعة {time}، تعمل المنطقة {zone} بكثافة {density}% وضوضاء محيطة تبلغ {noise} ديسيبل. جميع الأنظمة تعمل بشكل طبيعي.',
  },
};

/**
 * Returns localized text string by key, replacing parameters of format {variableName}.
 * Defaults to English translation if key or locale does not exist.
 */
export function translate(key: string, params: Record<string, string | number> = {}, locale: Locale = 'en'): string {
  const dict = dictionaries[locale] || dictionaries.en;
  let text = dict[key] || dictionaries.en[key] || key;

  // Perform parameter interpolation
  Object.entries(params).forEach(([paramKey, paramVal]) => {
    text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
  });

  return text;
}

/**
 * Utility to identify RTL orientation (Arabic in our set)
 */
export function isRTLLocale(locale: Locale): boolean {
  return locale === 'ar';
}
