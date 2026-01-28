import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // App Title
  'app.title': {
    en: 'FinanceLife',
    es: 'VidaFinanciera',
    fr: 'VieFinancière',
    de: 'FinanzLeben',
    hi: 'वित्तीय जीवन',
    zh: '财务生活',
  },
  
  // Navigation
  'nav.overview': {
    en: 'Overview',
    es: 'Resumen',
    fr: 'Aperçu',
    de: 'Übersicht',
    hi: 'अवलोकन',
    zh: '概览',
  },
  'nav.transactions': {
    en: 'Transactions',
    es: 'Transacciones',
    fr: 'Transactions',
    de: 'Transaktionen',
    hi: 'लेनदेन',
    zh: '交易',
  },
  'nav.goals': {
    en: 'Goals',
    es: 'Objetivos',
    fr: 'Objectifs',
    de: 'Ziele',
    hi: 'लक्ष्य',
    zh: '目标',
  },
  'nav.calculators': {
    en: 'Calculators',
    es: 'Calculadoras',
    fr: 'Calculatrices',
    de: 'Rechner',
    hi: 'कैलकुलेटर',
    zh: '计算器',
  },
  'nav.reports': {
    en: 'Reports',
    es: 'Informes',
    fr: 'Rapports',
    de: 'Berichte',
    hi: 'रिपोर्ट',
    zh: '报告',
  },
  'nav.groups': {
    en: 'Groups',
    es: 'Grupos',
    fr: 'Groupes',
    de: 'Gruppen',
    hi: 'समूह',
    zh: '群组',
  },
  'nav.expenses': {
    en: 'Expenses',
    es: 'Gastos',
    fr: 'Dépenses',
    de: 'Ausgaben',
    hi: 'खर्च',
    zh: '支出',
  },
  'nav.analytics': {
    en: 'Analytics',
    es: 'Analíticas',
    fr: 'Analytique',
    de: 'Analytik',
    hi: 'विश्लेषण',
    zh: '分析',
  },
  
  // Common Actions
  'action.add': {
    en: 'Add',
    es: 'Agregar',
    fr: 'Ajouter',
    de: 'Hinzufügen',
    hi: 'जोड़ें',
    zh: '添加',
  },
  'action.edit': {
    en: 'Edit',
    es: 'Editar',
    fr: 'Modifier',
    de: 'Bearbeiten',
    hi: 'संपादित करें',
    zh: '编辑',
  },
  'action.delete': {
    en: 'Delete',
    es: 'Eliminar',
    fr: 'Supprimer',
    de: 'Löschen',
    hi: 'हटाएं',
    zh: '删除',
  },
  'action.save': {
    en: 'Save',
    es: 'Guardar',
    fr: 'Enregistrer',
    de: 'Speichern',
    hi: 'सहेजें',
    zh: '保存',
  },
  'action.cancel': {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    hi: 'रद्द करें',
    zh: '取消',
  },
  'action.logout': {
    en: 'Logout',
    es: 'Cerrar sesión',
    fr: 'Déconnexion',
    de: 'Abmelden',
    hi: 'लॉग आउट',
    zh: '登出',
  },
  
  // Expense Splitting
  'expense.description': {
    en: 'Description',
    es: 'Descripción',
    fr: 'Description',
    de: 'Beschreibung',
    hi: 'विवरण',
    zh: '描述',
  },
  'expense.amount': {
    en: 'Amount',
    es: 'Monto',
    fr: 'Montant',
    de: 'Betrag',
    hi: 'राशि',
    zh: '金额',
  },
  'expense.paidBy': {
    en: 'Paid By',
    es: 'Pagado por',
    fr: 'Payé par',
    de: 'Bezahlt von',
    hi: 'द्वारा भुगतान',
    zh: '支付者',
  },
  'expense.category': {
    en: 'Category',
    es: 'Categoría',
    fr: 'Catégorie',
    de: 'Kategorie',
    hi: 'श्रेणी',
    zh: '类别',
  },
  'expense.split': {
    en: 'Split',
    es: 'Dividir',
    fr: 'Partager',
    de: 'Aufteilen',
    hi: 'विभाजित',
    zh: '分摊',
  },
  'expense.equal': {
    en: 'Equal',
    es: 'Igual',
    fr: 'Égal',
    de: 'Gleich',
    hi: 'समान',
    zh: '平均',
  },
  'expense.percentage': {
    en: 'Percentage',
    es: 'Porcentaje',
    fr: 'Pourcentage',
    de: 'Prozentsatz',
    hi: 'प्रतिशत',
    zh: '百分比',
  },
  'expense.custom': {
    en: 'Custom',
    es: 'Personalizado',
    fr: 'Personnalisé',
    de: 'Benutzerdefiniert',
    hi: 'कस्टम',
    zh: '自定义',
  },
  
  // Groups
  'group.create': {
    en: 'Create Group',
    es: 'Crear Grupo',
    fr: 'Créer un Groupe',
    de: 'Gruppe Erstellen',
    hi: 'समूह बनाएं',
    zh: '创建群组',
  },
  'group.members': {
    en: 'Members',
    es: 'Miembros',
    fr: 'Membres',
    de: 'Mitglieder',
    hi: 'सदस्य',
    zh: '成员',
  },
  'group.totalExpenses': {
    en: 'Total Expenses',
    es: 'Gastos Totales',
    fr: 'Dépenses Totales',
    de: 'Gesamtausgaben',
    hi: 'कुल खर्च',
    zh: '总支出',
  },
  
  // Debt Settlement
  'debt.settlement': {
    en: 'Debt Settlement',
    es: 'Liquidación de Deudas',
    fr: 'Règlement de Dettes',
    de: 'Schuldenbegleichung',
    hi: 'ऋण निपटान',
    zh: '债务清算',
  },
  'debt.simplify': {
    en: 'Simplify Debts',
    es: 'Simplificar Deudas',
    fr: 'Simplifier les Dettes',
    de: 'Schulden Vereinfachen',
    hi: 'ऋण सरलीकरण',
    zh: '简化债务',
  },
  'debt.owes': {
    en: 'owes',
    es: 'debe',
    fr: 'doit',
    de: 'schuldet',
    hi: 'देनदार',
    zh: '欠款',
  },
  
  // Analytics
  'analytics.title': {
    en: 'Expense Analytics',
    es: 'Analítica de Gastos',
    fr: 'Analytique des Dépenses',
    de: 'Ausgabenanalytik',
    hi: 'खर्च विश्लेषण',
    zh: '支出分析',
  },
  'analytics.byCategory': {
    en: 'Expenses by Category',
    es: 'Gastos por Categoría',
    fr: 'Dépenses par Catégorie',
    de: 'Ausgaben nach Kategorie',
    hi: 'श्रेणी के अनुसार खर्च',
    zh: '按类别支出',
  },
  'analytics.trend': {
    en: 'Spending Trend',
    es: 'Tendencia de Gastos',
    fr: 'Tendance des Dépenses',
    de: 'Ausgabentrend',
    hi: 'खर्च प्रवृत्ति',
    zh: '支出趋势',
  },
  
  // Receipt Scanning
  'receipt.scan': {
    en: 'Scan Receipt',
    es: 'Escanear Recibo',
    fr: 'Scanner le Reçu',
    de: 'Beleg Scannen',
    hi: 'रसीद स्कैन करें',
    zh: '扫描收据',
  },
  'receipt.upload': {
    en: 'Upload Receipt',
    es: 'Subir Recibo',
    fr: 'Télécharger le Reçu',
    de: 'Beleg Hochladen',
    hi: 'रसीद अपलोड करें',
    zh: '上传收据',
  },
  
  // Currencies
  'currency.usd': {
    en: 'US Dollar',
    es: 'Dólar Estadounidense',
    fr: 'Dollar Américain',
    de: 'US-Dollar',
    hi: 'अमेरिकी डॉलर',
    zh: '美元',
  },
  'currency.eur': {
    en: 'Euro',
    es: 'Euro',
    fr: 'Euro',
    de: 'Euro',
    hi: 'यूरो',
    zh: '欧元',
  },
  'currency.inr': {
    en: 'Indian Rupee',
    es: 'Rupia India',
    fr: 'Roupie Indienne',
    de: 'Indische Rupie',
    hi: 'भारतीय रुपया',
    zh: '印度卢比',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('app_language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  // Wrap children in a fragment to prevent prop leakage
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <>{children}</>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  hi: 'हिंदी',
  zh: '中文',
};