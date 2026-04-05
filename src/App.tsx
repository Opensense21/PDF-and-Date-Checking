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
  Sun, 
  Moon,
  LayoutDashboard,
  Settings,
  Sparkles,
  Info,
  Eye,
  EyeOff,
  GripVertical
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
import { getSolarTerm, castHexagram, HEXAGRAMS, getAllLunarFestivals, getLunarFestivals, getLunarDate, getAuspiciousInfo, getLunarDateDetails } from './lib/cultural';

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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

type Tab = 'dashboard' | 'pdf' | 'cultural' | 'iching';

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
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputName, setOutputName] = useState(`Workspace_${new Date().toISOString().split('T')[0]}`);
  
  // Cultural State
  const [solarTerm, setSolarTerm] = useState('');
  const [hexagram, setHexagram] = useState<number[] | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setSolarTerm(getSolarTerm(selectedDate));
  }, [selectedDate]);

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
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
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
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-slate-800">Âm Lịch & Tiết Khí</h3>
                      <div className="flex items-center gap-3">
                        <input 
                          type="date" 
                          value={selectedDate.toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                          className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                        />
                        <button 
                          onClick={() => setSelectedDate(new Date())}
                          className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-bold hover:bg-brand-primary/20 transition-colors"
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
                        <p className="text-xs text-slate-500 italic">"{getSolarTerm(selectedDate)}"</p>
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
                        Lễ Hội & Ngày Lễ Truyền Thống
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getAllLunarFestivals().map((festival, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-brand-primary/30 transition-colors group">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary font-bold shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                {festival.day}/{festival.month}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{festival.name}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{festival.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4">Gợi ý từ Thu Opensense</h4>
                    <div className={cn("p-4 rounded-2xl border text-sm leading-relaxed", getAuspiciousInfo(selectedDate).bgColor, "border-opacity-50 text-slate-700")}>
                      Ngày <span className="font-bold">{selectedDate.toLocaleDateString('vi-VN')}</span> ({getLunarDate(selectedDate)}) là ngày <span className="font-bold">{getAuspiciousInfo(selectedDate).type}</span>. 
                      Trong tiết <span className="font-bold">{solarTerm}</span>, {getAuspiciousInfo(selectedDate).description}
                      Hãy sử dụng công cụ PDF của chúng tôi để chuẩn bị hồ sơ của bạn một cách thuận lợi nhất!
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-brand-secondary rounded-3xl p-6 text-white overflow-hidden relative">
                    <h4 className="font-bold mb-4 relative z-10">24 Tiết Khí</h4>
                    <div className="space-y-3 relative z-10">
                      {['Lập Xuân', 'Vũ Thủy', 'Kinh Trập', 'Xuân Phân'].map((term, i) => (
                        <div key={term} className={cn(
                          "flex items-center justify-between p-3 rounded-xl transition-colors",
                          term === solarTerm ? "bg-white/20 border border-white/30" : "hover:bg-white/5"
                        )}>
                          <span className="font-medium">{term}</span>
                          <span className="text-xs opacity-50">Tháng {i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Calendar size={18} className="text-brand-primary" />
                      Lịch Tháng Âm
                    </h4>
                    <div className="grid grid-cols-7 gap-1">
                      {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                        <div key={day} className="text-center text-[8px] font-bold text-slate-400 uppercase py-1">{day}</div>
                      ))}
                      {Array.from({ length: 30 }).map((_, i) => {
                        const day = i + 1;
                        const festivals = getLunarFestivals(day, 2); // Demo month
                        return (
                          <div key={i} className={cn(
                            "aspect-square rounded-lg border flex flex-col items-center justify-center relative group transition-all",
                            day === 15 ? "bg-brand-primary/5 border-brand-primary/20" : "border-slate-50 hover:border-brand-primary/30"
                          )}>
                            <span className={cn("text-[10px] font-bold", day === 15 ? "text-brand-primary" : "text-slate-600")}>{day}</span>
                            {festivals.length > 0 && (
                              <div className="absolute bottom-0.5 w-0.5 h-0.5 bg-amber-500 rounded-full" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[8px] text-slate-400 italic text-center leading-tight">
                      * Ước tính cho tháng hiện tại. Các chấm vàng biểu thị ngày lễ hội.
                    </p>
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
                        <h4 className="text-2xl font-bold text-brand-primary mb-2">
                          Quẻ: {HEXAGRAMS[hexagram.reduce((a, b) => a + b, 0) % HEXAGRAMS.length].name}
                        </h4>
                        <p className="text-slate-600 italic mb-4">
                          "{HEXAGRAMS[hexagram.reduce((a, b) => a + b, 0) % HEXAGRAMS.length].meaning}"
                        </p>
                        
                        {HEXAGRAMS[hexagram.reduce((a, b) => a + b, 0) % HEXAGRAMS.length].imagery && (
                          <div className="mt-6 pt-6 border-t border-slate-200 text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Hình tượng (Tượng quẻ)</p>
                            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                              {HEXAGRAMS[hexagram.reduce((a, b) => a + b, 0) % HEXAGRAMS.length].imagery}
                            </p>
                          </div>
                        )}

                        <button 
                          onClick={() => setHexagram(null)}
                          className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-bold underline"
                        >
                          Gieo lại quẻ khác
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
