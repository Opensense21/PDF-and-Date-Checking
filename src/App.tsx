/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FileText, 
  Calendar, 
  Compass, 
  Merge, 
  FileUp, 
  Download, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Sun, 
  Moon,
  LayoutDashboard,
  Settings,
  Sparkles,
  Info,
  Eye,
  EyeOff,
  GripVertical,
  History,
  Zap,
  MessageSquare,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import { cn } from './lib/utils';
import { getSolarTerm, castHexagram, HEXAGRAMS, getAllLunarFestivals, getLunarFestivals, getLunarDate, getAuspiciousInfo, getLunarDateDetails, getSolarTermInfo, estimateSolarDate, getWorldHistory, getGregorianHolidays, getKabbalahInsight, getHexagramByLines, HEXAGRAM_NAMES, getBatTuHaLac } from './lib/cultural';
import type { HistoryEvent, BatTuResult } from './lib/cultural';

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const CalendarPicker = ({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (date: Date) => void }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 w-full max-w-[320px]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          <ChevronLeft size={18} className="text-slate-400" />
        </button>
        <span className="font-bold text-slate-800">
          Tháng {viewDate.getMonth() + 1}, {viewDate.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          <ChevronRight size={18} className="text-slate-400" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(i => <div key={`empty-${i}`} />)}
        {days.map(d => {
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          
          const lunar = getLunarDateDetails(date);
          const hasLunarFestival = getLunarFestivals(lunar.day, lunar.month).length > 0;
          const hasGregorianHoliday = getGregorianHolidays(date).length > 0;
          const hasHistory = getWorldHistory(date).length > 0;
          
          return (
            <button
              key={d}
              onClick={() => onSelect(date)}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all group",
                isSelected ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "hover:bg-slate-50 text-slate-600",
                isToday && !isSelected && "border border-brand-primary/30 text-brand-primary"
              )}
            >
              <span className="text-xs font-bold">{d}</span>
              <div className="flex gap-0.5 mt-0.5">
                {hasLunarFestival && <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-red-500")} />}
                {hasGregorianHoliday && <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-indigo-500")} />}
                {hasHistory && <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-amber-500")} />}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Lễ hội Âm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Lễ Dương</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">Lịch sử</span>
        </div>
      </div>
    </div>
  );
};

// --- Types ---
interface PDFFile {
  id: string;
  name: string;
  size: number;
  data: Uint8Array;
  type: 'pdf' | 'docx';
  pageCount: number;
  selectedPages: number[]; // 0-indexed
  previewExpanded: boolean;
  pageRangeInput: string;
}

type Tab = 'dashboard' | 'pdf' | 'cultural' | 'iching' | 'chat' | 'battu';

// --- Constants ---
const THEMES = [
  { 
    id: 'indigo', 
    name: 'Chàm (Indigo)', 
    primary: '#1e1b4b', 
    accent: '#4f46e5', 
    secondary: '#1e1b4b',
    description: 'Màu của sự tĩnh lặng và chiều sâu văn hóa.'
  },
  { 
    id: 'terracotta', 
    name: 'Gốm (Terracotta)', 
    primary: '#9a3412', 
    accent: '#ea580c', 
    secondary: '#431407',
    description: 'Màu của đất nung, gốm sứ truyền thống.'
  },
  { 
    id: 'festival', 
    name: 'Lễ Hội (Red)', 
    primary: '#991b1b', 
    accent: '#dc2626', 
    secondary: '#450a0a',
    description: 'Màu của sự may mắn, rực rỡ ngày hội.'
  },
  { 
    id: 'lotus', 
    name: 'Hoa Sen (Pink)', 
    primary: '#be185d', 
    accent: '#db2777', 
    secondary: '#500724',
    description: 'Màu của quốc hoa, thanh tao và dịu dàng.'
  },
  { 
    id: 'bamboo', 
    name: 'Tre (Green)', 
    primary: '#166534', 
    accent: '#15803d', 
    secondary: '#052e16',
    description: 'Màu của lũy tre làng, kiên cường và sức sống.'
  },
  { 
    id: 'default', 
    name: 'Hiện Đại (Modern)', 
    primary: '#6366f1', 
    accent: '#818cf8', 
    secondary: '#1e1b4b',
    description: 'Màu sắc hiện đại, trẻ trung.'
  }
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" 
        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "group-hover:scale-110 transition-transform")} />
    <span className="font-medium">{label}</span>
  </button>
);

const Thumbnail = ({ pdf, pageNum, isSelected, onToggle }: { pdf: pdfjsLib.PDFDocumentProxy, pageNum: number, isSelected: boolean, onToggle: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let renderTask: any = null;
    let isCancelled = false;

    const renderPage = async () => {
      if (!canvasRef.current || !pdf) return;
      try {
        const page = await pdf.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };
        
        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err.name === 'RenderingCancelledException') {
          // Ignore cancellation errors
          return;
        }
        console.error("Error rendering thumbnail:", err);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdf, pageNum]);

  return (
    <div 
      onClick={onToggle}
      className={cn(
        "relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-2",
        isSelected ? "border-brand-primary ring-4 ring-brand-primary/20 scale-[1.02]" : "border-transparent hover:border-slate-300"
      )}
    >
      <canvas ref={canvasRef} className="max-h-32 w-auto bg-white" />
      <div className={cn(
        "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
        isSelected ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-500"
      )}>
        {pageNum}
      </div>
    </div>
  );
};

const PDFPreviewList = ({ file, onTogglePage }: { file: PDFFile, onTogglePage: (idx: number) => void }) => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPdf = async () => {
      try {
        // Use slice() here once to avoid detaching the original buffer in the state
        const loadingTask = pdfjsLib.getDocument({ data: file.data.slice() });
        const loadedPdf = await loadingTask.promise;
        if (isMounted) {
          setPdf(loadedPdf);
        } else {
          loadedPdf.destroy();
        }
      } catch (err) {
        console.error("Error loading PDF for preview:", err);
      }
    };
    loadPdf();
    
    return () => {
      isMounted = false;
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [file.data]);

  if (!pdf) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading preview...</div>;

  return (
    <div className="p-4">
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={16}
        className="w-full"
      >
        {Array.from({ length: file.pageCount }).map((_, idx) => (
          <SwiperSlide key={idx} style={{ width: 'auto' }}>
            <Thumbnail 
              pdf={pdf} 
              pageNum={idx + 1} 
              isSelected={file.selectedPages.includes(idx)}
              onToggle={() => onTogglePage(idx)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// --- Helper Functions ---
function parseRange(text: string, max: number): number[] {
  if (!text.trim()) return [];
  const pages = new Set<number>();
  const parts = text.split(',');
  parts.forEach(part => {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr.trim());
      const end = parseInt(endStr.trim());
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          if (i > 0 && i <= max) pages.add(i - 1);
        }
      }
    } else {
      const val = parseInt(part.trim());
      if (!isNaN(val) && val > 0 && val <= max) pages.add(val - 1);
    }
  });
  return Array.from(pages).sort((a, b) => a - b);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('app-theme') || 'default');
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputName, setOutputName] = useState(`Workspace_${new Date().toISOString().split('T')[0]}`);
  
  // Cultural State
  const [solarTerm, setSolarTerm] = useState('');
  const [hexagram, setHexagram] = useState<number[] | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Bat Tu State
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [birthHour, setBirthHour] = useState(12);
  const [batTuResult, setBatTuResult] = useState<BatTuResult | null>(null);

  useEffect(() => {
    setSolarTerm(getSolarTerm(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === currentTheme) || THEMES[THEMES.length - 1];
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', theme.primary);
    root.style.setProperty('--brand-accent', theme.accent);
    root.style.setProperty('--brand-secondary', theme.secondary);
    localStorage.setItem('app-theme', currentTheme);
  }, [currentTheme]);

  // --- PDF Handlers ---
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        let pageCount = 0;
        let type: 'pdf' | 'docx' = file.name.endsWith('.docx') ? 'docx' : 'pdf';

        if (type === 'pdf') {
          const pdf = await PDFDocument.load(data);
          pageCount = pdf.getPageCount();
        }

        const newFile: PDFFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          data: data,
          type: type,
          pageCount: pageCount,
          selectedPages: Array.from({ length: pageCount }, (_, i) => i),
          previewExpanded: false,
          pageRangeInput: pageCount > 0 ? `1-${pageCount}` : ''
        };
        setPdfFiles(prev => [...prev, newFile]);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  } as any);

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  };

  const togglePreview = (id: string) => {
    setPdfFiles(prev => prev.map(f => f.id === id ? { ...f, previewExpanded: !f.previewExpanded } : f));
  };

  const handlePageRangeChange = (id: string, value: string) => {
    setPdfFiles(prev => prev.map(f => {
      if (f.id === id) {
        const selected = parseRange(value, f.pageCount);
        return { ...f, pageRangeInput: value, selectedPages: selected };
      }
      return f;
    }));
  };

  const togglePageSelection = (fileId: string, pageIdx: number) => {
    setPdfFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        let newSelected;
        if (f.selectedPages.includes(pageIdx)) {
          newSelected = f.selectedPages.filter(p => p !== pageIdx);
        } else {
          newSelected = [...f.selectedPages, pageIdx].sort((a, b) => a - b);
        }
        const newInput = newSelected.map(p => p + 1).join(', '); // Simple representation
        return { ...f, selectedPages: newSelected, pageRangeInput: newInput };
      }
      return f;
    }));
  };

  const processFiles = async () => {
    if (pdfFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of pdfFiles) {
        if (file.type === 'pdf') {
          const pdf = await PDFDocument.load(file.data);
          const indices = file.selectedPages.length > 0 ? file.selectedPages : pdf.getPageIndices();
          const copiedPages = await mergedPdf.copyPages(pdf, indices);
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.type === 'docx') {
          const result = await mammoth.convertToHtml({ arrayBuffer: file.data.buffer });
          const html = result.value;
          
          const container = document.createElement('div');
          container.style.width = '800px';
          container.style.padding = '40px';
          container.style.background = 'white';
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.innerHTML = html;
          document.body.appendChild(container);

          const canvas = await html2canvas(container);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          const docxPdfBytes = pdf.output('arraybuffer');
          const docxPdf = await PDFDocument.load(docxPdfBytes);
          const copiedPages = await mergedPdf.copyPages(docxPdf, docxPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          
          document.body.removeChild(container);
        }
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${outputName}.pdf`;
      link.click();
    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- I Ching Handlers ---
  const handleCast = () => {
    setHexagram(castHexagram());
  };

  const calculateBatTu = () => {
    setBatTuResult(getBatTuHaLac(birthDate, birthHour));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Thu Opensense</h1>
        </div>

        <nav className="flex-grow space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="PDF & Docs" 
            active={activeTab === 'pdf'} 
            onClick={() => setActiveTab('pdf')} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Cultural Hub" 
            active={activeTab === 'cultural'} 
            onClick={() => setActiveTab('cultural')} 
          />
          <SidebarItem 
            icon={Compass} 
            label="Kinh Dịch" 
            active={activeTab === 'iching'} 
            onClick={() => setActiveTab('iching')} 
          />
          <SidebarItem 
            icon={Zap} 
            label="Bát Tự Hà Lạc" 
            active={activeTab === 'battu'} 
            onClick={() => setActiveTab('battu')} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Palette size={14} />
              <span>Giao diện</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme.id)}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center relative group",
                    currentTheme === theme.id ? "border-brand-primary scale-110 shadow-sm" : "border-transparent hover:border-slate-200"
                  )}
                  title={theme.name}
                  style={{ backgroundColor: theme.primary }}
                >
                  {currentTheme === theme.id && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Info size={14} />
              <span>Current Status</span>
            </div>
            <p className="text-sm text-slate-600 font-medium">Tiết trời: <span className="text-brand-primary">{solarTerm}</span></p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Welcome Card */}
                <div className="col-span-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-3xl p-8 text-white shadow-2xl shadow-brand-primary/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-2">Chào buổi sáng!</h3>
                    <p className="text-white/80 max-w-md mb-4">Hôm nay là {getLunarDate(new Date())}. Tiết trời hiện tại là <span className="font-bold underline">{getSolarTerm(new Date())}</span>.</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-sm">
                      <Sparkles size={16} className="text-amber-300" />
                      <span>Hôm nay là ngày <span className="font-bold">{getAuspiciousInfo(new Date()).type}</span></span>
                    </div>
                  </div>
                  <Sparkles className="absolute right-[-20px] bottom-[-20px] text-white/10 w-64 h-64" />
                </div>

                {/* Quick Stats/Actions */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                    <Merge size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">PDF Tools</h4>
                  <p className="text-slate-500 text-sm mb-4">Merge PDFs and convert DOCX files instantly.</p>
                  <button onClick={() => setActiveTab('pdf')} className="text-brand-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Go to tools <ChevronRight size={16} />
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
                    <Calendar size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Cultural Hub</h4>
                  <p className="text-slate-500 text-sm mb-4">Explore Vietnamese Lunar calendar and Solar terms.</p>
                  <button onClick={() => setActiveTab('cultural')} className="text-brand-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Explore <ChevronRight size={16} />
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
                    <Compass size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Kinh Dịch</h4>
                  <p className="text-slate-500 text-sm mb-4">Cast hexagrams and discover ancient wisdom.</p>
                  <button onClick={() => setActiveTab('iching')} className="text-brand-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Consult <ChevronRight size={16} />
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
                    <Zap size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Bát Tự Hà Lạc</h4>
                  <p className="text-slate-500 text-sm mb-4">Explore your destiny and life path energy.</p>
                  <button onClick={() => setActiveTab('battu')} className="text-brand-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Unlock <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'pdf' && (
              <motion.div
                key="pdf"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div 
                  {...getRootProps()} 
                  className={cn(
                    "border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer",
                    isDragActive ? "border-brand-primary bg-brand-primary/5 scale-[0.99]" : "border-slate-200 hover:border-brand-primary/50 hover:bg-slate-50"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileUp size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Files</h3>
                  <p className="text-slate-500">Drag & drop PDF or DOCX files here, or click to browse</p>
                </div>

                {pdfFiles.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800">Selected Files ({pdfFiles.length})</h4>
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={outputName}
                          onChange={(e) => setOutputName(e.target.value)}
                          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                          placeholder="Output filename"
                        />
                        <button 
                          onClick={processFiles}
                          disabled={isProcessing}
                          className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-accent transition-colors disabled:opacity-50"
                        >
                          {isProcessing ? "Processing..." : <><Download size={18} /> Export PDF</>}
                        </button>
                      </div>
                    </div>
                    <Reorder.Group 
                      axis="y" 
                      values={pdfFiles} 
                      onReorder={setPdfFiles}
                      className="divide-y divide-slate-50"
                    >
                      {pdfFiles.map((file) => (
                        <Reorder.Item 
                          key={file.id} 
                          value={file}
                          className="flex flex-col bg-white"
                        >
                          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-500 transition-colors">
                                <GripVertical size={20} />
                              </div>
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                file.type === 'pdf' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                              )}>
                                <FileText size={20} />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-700">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB • {file.pageCount} pages</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {file.type === 'pdf' && (
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pages</span>
                                  <input 
                                    type="text" 
                                    value={file.pageRangeInput}
                                    onChange={(e) => handlePageRangeChange(file.id, e.target.value)}
                                    className="w-24 bg-transparent text-sm font-bold text-brand-primary focus:outline-none"
                                    placeholder="e.g. 1, 3-5"
                                  />
                                </div>
                              )}
                              
                              <button 
                                onClick={() => togglePreview(file.id)}
                                className={cn(
                                  "p-2 rounded-lg transition-colors",
                                  file.previewExpanded ? "bg-brand-primary/10 text-brand-primary" : "text-slate-300 hover:text-slate-600"
                                )}
                              >
                                {file.previewExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                              
                              <button 
                                onClick={() => removeFile(file.id)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {file.previewExpanded && file.type === 'pdf' && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-slate-50 border-t border-slate-100"
                              >
                                <PDFPreviewList 
                                  file={file} 
                                  onTogglePage={(idx) => togglePageSelection(file.id, idx)} 
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                )}
              </motion.div>
            )}



            {activeTab === 'cultural' && (
              <motion.div
                key="cultural"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="space-y-8">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-slate-800">Âm Lịch & Tiết Khí</h3>
                      <div className="flex items-center gap-3 relative">
                        <div className="relative group">
                          <button 
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-brand-primary/30 transition-all"
                          >
                            <Calendar size={18} className="text-brand-primary" />
                            {selectedDate.toLocaleDateString('vi-VN')}
                          </button>
                          
                          <AnimatePresence>
                            {showCalendar && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setShowCalendar(false)}
                                />
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="absolute top-full right-0 mt-2 z-50"
                                >
                                  <CalendarPicker 
                                    selectedDate={selectedDate} 
                                    onSelect={(date) => {
                                      setSelectedDate(date);
                                      setShowCalendar(false);
                                    }} 
                                  />
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        <button 
                          onClick={() => setSelectedDate(new Date())}
                          className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-bold hover:bg-brand-primary/20 transition-colors"
                        >
                          Hôm nay
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                            <Sun size={32} />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Dương Lịch</p>
                            <p className="text-xl font-bold text-slate-800">{selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                            <Moon size={32} />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Âm Lịch (Ước tính)</p>
                            <p className="text-xl font-bold text-slate-800">{getLunarDate(selectedDate)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Tiết Khí</p>
                        <p className="text-4xl font-black text-brand-primary mb-2">{solarTerm}</p>
                        <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                          {getSolarTermInfo(selectedDate).description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-slate-100">
                      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-brand-primary" />
                        Lịch Vạn Niên Chi Tiết
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Trực</p>
                          <p className="font-bold text-slate-800">{(getAuspiciousInfo(selectedDate) as any).truc}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Sao</p>
                          <p className="font-bold text-slate-800">{(getAuspiciousInfo(selectedDate) as any).sao}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Ngũ Hành</p>
                          <p className="font-bold text-slate-800">{(getAuspiciousInfo(selectedDate) as any).nguHanh}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Hướng Xuất Hành</p>
                          <p className="font-bold text-slate-800">{(getAuspiciousInfo(selectedDate) as any).huongXuatHanh}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-slate-100">
                      <div className={cn("p-6 rounded-3xl border", getAuspiciousInfo(selectedDate).bgColor, "border-opacity-50")}>
                        <div className="flex items-center gap-3 mb-3">
                          <Sparkles className={getAuspiciousInfo(selectedDate).color} size={20} />
                          <h4 className={cn("font-bold text-lg", getAuspiciousInfo(selectedDate).color)}>
                            {getAuspiciousInfo(selectedDate).type}
                          </h4>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {getAuspiciousInfo(selectedDate).description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-amber-500" />
                        Lễ Hội & Ngày Lễ
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Lunar Festivals */}
                        {getLunarFestivals(getLunarDateDetails(selectedDate).day, getLunarDateDetails(selectedDate).month).map((festival, idx) => (
                          <div key={`lunar-${idx}`} className="bg-amber-50 rounded-2xl p-4 border border-amber-100 transition-colors group">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center text-amber-600 font-bold shadow-sm">
                                <span className="text-xs leading-none mb-1">{festival.day}/{festival.month}</span>
                                <span className="text-[10px] uppercase leading-none">Âm</span>
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{festival.name}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{festival.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Gregorian Holidays */}
                        {getGregorianHolidays(selectedDate).map((holiday, idx) => (
                          <div key={`greg-${idx}`} className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 transition-colors group">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center text-indigo-600 font-bold shadow-sm">
                                <span className="text-xs leading-none mb-1">{selectedDate.getDate()}/{selectedDate.getMonth() + 1}</span>
                                <span className="text-[10px] uppercase leading-none">Dương</span>
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{holiday}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">Ngày lễ theo lịch Dương.</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {getLunarFestivals(getLunarDateDetails(selectedDate).day, getLunarDateDetails(selectedDate).month).length === 0 && getGregorianHolidays(selectedDate).length === 0 && (
                          <div className="col-span-full py-8 text-center text-slate-400 italic text-sm">
                            Không có ngày lễ đặc biệt nào trong ngày này.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-12">
                      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <History size={20} className="text-indigo-500" />
                        Ngày Này Năm Xưa (Lịch sử Thế giới)
                      </h4>
                      <div className="space-y-4">
                        {getWorldHistory(selectedDate).map((event, idx) => (
                          <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                            <div className="w-16 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold shadow-sm shrink-0">
                              {event.year}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                                {event.type === 'birth' ? 'Sinh nhật' : event.type === 'death' ? 'Ngày mất' : 'Sự kiện'}
                              </p>
                              <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                                {event.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-12">
                      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Zap size={20} className="text-purple-500" />
                        Kabbalah & Cây Sự Sống (Tree of Life)
                      </h4>
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl shrink-0">
                              <span className="text-5xl font-serif text-purple-300">{getKabbalahInsight(selectedDate).hebrew}</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-purple-300">
                                  Sephirah của ngày
                                </span>
                                <span className={cn("text-xl font-bold", getKabbalahInsight(selectedDate).color)}>
                                  {getKabbalahInsight(selectedDate).name}
                                </span>
                              </div>
                              <h5 className="text-2xl font-bold mb-3">{getKabbalahInsight(selectedDate).meaning}</h5>
                              <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-xl">
                                {getKabbalahInsight(selectedDate).description}
                              </p>
                              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                  <span className="text-xs font-bold text-slate-300">Thuộc tính: {getKabbalahInsight(selectedDate).attribute}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                  <span className="text-xs font-bold text-slate-300">Tầng năng lượng: {getKabbalahInsight(selectedDate).name === 'Malkhut' ? 'Vật chất' : 'Tâm linh'}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                  <p className="text-[10px] font-bold uppercase text-emerald-400 mb-2 tracking-widest">Để tăng cường năng lượng</p>
                                  <p className="text-xs text-slate-300 leading-relaxed italic">
                                    {getKabbalahInsight(selectedDate).toEnhance}
                                  </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                  <p className="text-[10px] font-bold uppercase text-red-400 mb-2 tracking-widest">Cần tránh</p>
                                  <p className="text-xs text-slate-300 leading-relaxed italic">
                                    {getKabbalahInsight(selectedDate).toAvoid}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-slate-100">
                      <h4 className="text-lg font-bold text-slate-800 mb-6">Tất cả Lễ hội Truyền thống</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getAllLunarFestivals().map((festival, idx) => {
                          const solarDate = estimateSolarDate(festival.day, festival.month, selectedDate.getFullYear());
                          return (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-brand-primary/30 transition-colors group">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center text-brand-primary font-bold shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                  <span className="text-xs opacity-60 leading-none mb-1">{festival.day}/{festival.month}</span>
                                  <span className="text-[10px] uppercase leading-none">Âm</span>
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{festival.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                    Dương lịch ước tính: {solarDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}
                                  </p>
                                  <p className="text-xs text-slate-500 leading-relaxed">{festival.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4">Gợi ý từ Thu Opensense</h4>
                    <div className={cn("p-6 rounded-2xl border text-sm leading-relaxed", getAuspiciousInfo(selectedDate).bgColor, "border-opacity-50 text-slate-700")}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={cn("w-2 h-2 rounded-full", getAuspiciousInfo(selectedDate).color.replace('text', 'bg'))} />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Tư vấn phong thủy & Năng suất</span>
                      </div>
                      <p className="mb-4">
                        Ngày <span className="font-bold">{selectedDate.toLocaleDateString('vi-VN')}</span> ({getLunarDate(selectedDate)}) là ngày <span className="font-bold underline">{getAuspiciousInfo(selectedDate).type}</span>. 
                      </p>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center shrink-0">✨</div>
                          <p><strong>Tiết khí:</strong> {getSolarTermInfo(selectedDate).description}</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center shrink-0">☯️</div>
                          <p><strong>Ngũ Hành:</strong> {(getAuspiciousInfo(selectedDate) as any).nguHanh} — <strong>Trực:</strong> {(getAuspiciousInfo(selectedDate) as any).truc} — <strong>Sao:</strong> {(getAuspiciousInfo(selectedDate) as any).sao}</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center shrink-0">🧭</div>
                          <p><strong>Hướng xuất hành:</strong> Nên đi về hướng <span className="font-bold">{(getAuspiciousInfo(selectedDate) as any).huongXuatHanh}</span> để gặp nhiều may mắn và thuận lợi.</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center shrink-0">⏰</div>
                          <div>
                            <p><strong>Giờ tốt:</strong></p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {getAuspiciousInfo(selectedDate).bestHours?.map(h => (
                                <span key={h} className="px-2 py-0.5 bg-white/40 rounded-lg text-[10px] font-bold">{h}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/30 p-3 rounded-xl">
                            <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Nên làm</p>
                            <ul className="list-disc list-inside text-xs space-y-1">
                              {getAuspiciousInfo(selectedDate).suggestedActions?.map(a => <li key={a}>{a}</li>)}
                            </ul>
                          </div>
                          <div className="bg-white/30 p-3 rounded-xl">
                            <p className="text-[10px] font-bold uppercase text-red-600 mb-1">Kiêng kỵ</p>
                            <ul className="list-disc list-inside text-xs space-y-1">
                              {getAuspiciousInfo(selectedDate).avoidActions?.map(a => <li key={a}>{a}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center shrink-0">💼</div>
                          <p><strong>Công việc:</strong> Hãy sử dụng công cụ PDF của chúng tôi để chuẩn bị hồ sơ của bạn một cách thuận lợi nhất. Sắp xếp lại các tệp tin theo thứ tự ưu tiên sẽ giúp bạn quản lý thời gian hiệu quả hơn.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'iching' && (
              <motion.div
                key="iching"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />
                  
                  <div className="mb-10">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                      <Compass size={48} className="text-brand-primary animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-4">Kinh Dịch Chiêm Bốc</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Tập trung tư tưởng vào câu hỏi của bạn và gieo quẻ để nhận được lời khuyên từ cổ nhân.</p>
                  </div>

                  {!hexagram ? (
                    <button 
                      onClick={handleCast}
                      className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      Gieo Quẻ Ngay
                    </button>
                  ) : (
                    <div className="space-y-10">
                      <div className="flex flex-col-reverse items-center gap-4">
                        {hexagram.map((line, i) => (
                          <motion.div 
                            key={i}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="h-4 flex gap-4"
                          >
                            {line % 2 === 0 ? (
                              <>
                                <div className="flex-grow bg-slate-800 rounded-full" />
                                <div className="flex-grow bg-slate-800 rounded-full" />
                              </>
                            ) : (
                              <div className="w-full bg-slate-800 rounded-full" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <div className="mb-6">
                          <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">
                            Lời khuyên từ Thu Giang Nguyễn Duy Cần
                          </span>
                          <h4 className="text-2xl font-bold text-slate-800">
                            Quẻ: {getHexagramByLines(hexagram).name}
                          </h4>
                        </div>
                        
                        <p className="text-lg text-slate-700 font-medium mb-6 leading-relaxed">
                          {getHexagramByLines(hexagram).meaning}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tượng Quẻ (Hình tượng)</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {getHexagramByLines(hexagram).imagery}
                            </p>
                          </div>
                          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Triết lý Dịch Học</p>
                            <p className="text-sm text-indigo-900/70 leading-relaxed italic">
                              "Dịch không phải là để đoán định tương lai một cách cứng nhắc, mà là để thấu hiểu lẽ biến thông của vũ trụ, từ đó giữ tâm thái bình thản trước mọi biến động."
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={() => setHexagram(null)}
                          className="mt-10 text-slate-400 hover:text-slate-600 text-sm font-bold underline transition-colors"
                        >
                          Gieo lại quẻ khác
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Educational Section - Nguyễn Duy Cần Perspective */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Info size={20} className="text-brand-primary" />
                      Kinh Dịch & Thu Giang
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Theo học giả Nguyễn Duy Cần (Thu Giang), Kinh Dịch không đơn thuần là bói toán mà là <strong>"Huyền Giải"</strong> - một phương pháp thấu thị quy luật của vũ trụ và nhân sinh.
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Ông nhấn mạnh vào <strong>"Lý"</strong> (lẽ phải) và <strong>"Tượng"</strong> (hình ảnh) để người học tự chiêm nghiệm, từ đó đạt đến cảnh giới "Vô Vi" - hành động thuận theo tự nhiên.
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <History size={20} className="text-indigo-500" />
                      Tinh Hoa Dịch Học
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Trong tác phẩm <em>"Dịch Học Tinh Hoa"</em>, Nguyễn Duy Cần giải thích rằng Dịch là sự biến đổi vĩnh cửu. Hiểu Dịch là hiểu được lúc nào nên tiến, lúc nào nên thoái.
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Mục đích cuối cùng của việc học Dịch là để rèn luyện nhân cách, trở thành bậc quân tử có tâm thái vững vàng giữa dòng đời vạn biến.
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-amber-500" />
                      Cách Gieo Quẻ (Tham vấn)
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Nguyễn Duy Cần khuyên người tham vấn cần giữ tâm <strong>"Thành"</strong>. Trước khi gieo quẻ, hãy tĩnh tâm, loại bỏ tạp niệm để tần số của tâm thức hòa nhập với tần số của vũ trụ.
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Lời quẻ không phải là định mệnh, mà là một tấm gương phản chiếu nội tâm và hoàn cảnh, giúp ta tìm ra con đường hài hòa nhất.
                    </p>
                  </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                      <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <LayoutDashboard size={20} className="text-purple-500" />
                        Triết lý 64 Quẻ Dịch
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        64 quẻ là 64 tình huống điển hình của cuộc đời, được hình thành từ sự kết hợp của 8 quẻ đơn (Bát quái). Mỗi quẻ mang một thông điệp về thời thế và cách ứng xử.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mt-4">
                        {HEXAGRAM_NAMES.map((name, idx) => (
                          <div key={idx} className="bg-slate-50 py-2 rounded-lg text-center border border-slate-100 group hover:bg-brand-primary hover:border-brand-primary transition-all cursor-help" title={`Quẻ số ${idx + 1}: ${name}`}>
                            <span className="text-[9px] font-bold text-slate-400 group-hover:text-white block leading-none mb-1">{idx + 1}</span>
                            <span className="text-[8px] font-medium text-slate-600 group-hover:text-white truncate px-1 block">{name.split(' ').pop()}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-6 italic text-center">
                        "Dịch là đạo của người quân tử, là nghệ thuật sống hài hòa giữa vạn biến."
                      </p>
                    </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'battu' && (
              <motion.div
                key="battu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center">
                      <Zap size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-800">Bát Tự Hà Lạc</h3>
                      <p className="text-slate-500">Khám phá bản mệnh và năng lượng cuộc đời dựa trên triết lý Dịch học.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Ngày sinh (Dương lịch)</label>
                      <input 
                        type="date" 
                        value={birthDate.toISOString().split('T')[0]}
                        onChange={(e) => setBirthDate(new Date(e.target.value))}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 font-medium"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Giờ sinh (0-23)</label>
                      <select 
                        value={birthHour}
                        onChange={(e) => setBirthHour(parseInt(e.target.value))}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 font-medium"
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i}>{i} giờ</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={calculateBatTu}
                    className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <Sparkles size={24} />
                    Giải Mã Bản Mệnh
                  </button>
                </div>

                {batTuResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="bg-brand-primary rounded-[40px] p-12 text-white shadow-2xl shadow-brand-primary/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Quẻ Bản Mệnh</span>
                            <h4 className="text-4xl font-black">{batTuResult.hexagramName}</h4>
                          </div>
                          <div className="text-6xl opacity-50">{batTuResult.hexagramSymbol}</div>
                        </div>
                        <p className="text-xl text-white/80 font-medium leading-relaxed max-w-2xl">
                          Dựa trên Bát Tự Hà Lạc, cuộc đời bạn mang năng lượng của quẻ <strong>{batTuResult.hexagramName}</strong>. Đây là một hành trình đầy ý nghĩa với những đặc điểm riêng biệt.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                          <Sparkles size={20} />
                        </div>
                        <h5 className="text-2xl font-black text-slate-800">Tam Cát (Ba Trụ Cột May Mắn)</h5>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {batTuResult.fortunePillars.map((pillar, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-brand-primary/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                              <p className="font-bold text-slate-800">{pillar.name}</p>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                pillar.status === 'Mạnh' ? "bg-emerald-100 text-emerald-600" :
                                pillar.status === 'Khá' ? "bg-blue-100 text-blue-600" :
                                pillar.status === 'Trung bình' ? "bg-amber-100 text-amber-600" :
                                "bg-slate-200 text-slate-500"
                              )}>
                                {pillar.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              {pillar.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                          <Zap size={24} />
                        </div>
                        <div>
                          <p className="text-indigo-900 font-bold text-lg mb-1">Tổng Quan Vận Mệnh</p>
                          <p className="text-indigo-700 leading-relaxed">
                            {batTuResult.overallFortune}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Info size={18} className="text-blue-500" />
                          Tính Cách & Bản Chất
                        </h5>
                        <p className="text-slate-600 leading-relaxed">{batTuResult.personality}</p>
                      </div>
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Zap size={18} className="text-amber-500" />
                          Sự Nghiệp & Công Danh
                        </h5>
                        <p className="text-slate-600 leading-relaxed">{batTuResult.career}</p>
                      </div>
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <MessageSquare size={18} className="text-pink-500" />
                          Tình Duyên & Gia Đạo
                        </h5>
                        <p className="text-slate-600 leading-relaxed">{batTuResult.love}</p>
                      </div>
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Sparkles size={18} className="text-purple-500" />
                          Năng Lượng May Mắn
                        </h5>
                        <p className="text-slate-600 leading-relaxed">{batTuResult.luck}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-12 text-white">
                      <h5 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <LayoutDashboard size={24} className="text-brand-primary" />
                        Lời Khuyên & Hướng Phát Triển
                      </h5>
                      <p className="text-lg text-slate-300 leading-relaxed italic mb-8">
                        "{batTuResult.advice}"
                      </p>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-sm text-slate-400">
                        <p><strong>Lưu ý:</strong> Bát Tự Hà Lạc là một hệ thống triết học sâu sắc. Những thông tin trên mang tính chất tham khảo giúp bạn hiểu rõ hơn về tiềm năng của bản thân để từ đó nỗ lực và phát huy tối ưu.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
