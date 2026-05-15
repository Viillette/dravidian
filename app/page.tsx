
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  useEditor, 
  EditorContent, 
  Node, 
  mergeAttributes, 
  ReactNodeViewRenderer, 
  NodeViewWrapper
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

// --- NEW INTERFACES FOR ACCOUNT SYSTEM ---
interface UserAccount {
  username: string;
  email: string;
  isLoggedIn: boolean;
}

interface SavedDocument {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  charCount: number;
  pages: number;
  updatedAt: string;
  bannerUrl?: string | null;
  bannerPosition?: number;
}

interface BookRecord {
  id: string | number;
  title: string;
  authors: string[];
  subjects: string[];
  languages: string[];
  downloadCount: number;
  formats: { [key: string]: string };
  coverUrl: string | null;
  isModern?: boolean;
}

// ==========================================
// 1. DATA MATRIX INTERACTIVE CHARTS
// ==========================================
const DataMatrixComponent = (props: any) => {
  const { type, label } = props.node.attrs;
  const [activeTab, setActiveTab] = useState('Alpha');
  const [toggleOpen, setToggleOpen] = useState(false);
  
  const [chartData, setChartData] = useState([
    { name: 'Layer A', value: 75, color: '#dc2626' },
    { name: 'Layer B', value: 45, color: '#d97706' },
    { name: 'Layer C', value: 90, color: '#059669' },
    { name: 'Layer D', value: 60, color: '#2563eb' }
  ]);

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editVal, setEditVal] = useState(0);
  const [editColor, setEditColor] = useState('#dc2626');

  const openEditor = (idx: number) => {
    setEditIdx(idx);
    setEditName(chartData[idx].name);
    setEditVal(chartData[idx].value);
    setEditColor(chartData[idx].color);
  };

  const saveChartItem = () => {
    if (editIdx === null) return;
    const updated = [...chartData];
    updated[editIdx] = { name: editName, value: Math.min(100, Math.max(0, editVal)), color: editColor };
    setChartData(updated);
    setEditIdx(null);
  };

  return (
    <NodeViewWrapper className="data-matrix-wrapper my-8" contentEditable={false}>
      <div className="group/matrix relative border border-white/[0.06] bg-[#090707] p-6 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-white/10">
        <div className="flex items-center justify-between mb-5 border-b border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-gray-400 font-bold uppercase">{label} Control Matrix</span>
          </div>
          <button 
            type="button" 
            onClick={() => props.deleteNode()} 
            className="text-[10px] font-mono text-gray-600 hover:text-red-400 opacity-60 hover:opacity-100 uppercase tracking-widest transition-all duration-200 cursor-pointer"
          >
            Disconnect
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/50 p-2.5 rounded-xl border border-white/[0.03]">
            {chartData.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openEditor(i)}
                className="p-3 text-left rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 text-[11px]"
              >
                <div className="flex items-center gap-2 font-mono text-gray-400 truncate mb-1">
                  <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
                <div className="font-mono text-white font-bold pl-3.5 text-xs">{item.value}%</div>
              </button>
            ))}
          </div>

          {editIdx !== null && (
            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-center font-mono text-xs animate-fadeIn">
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="bg-black/60 border border-white/10 focus:border-red-900 px-3 py-2 rounded-lg text-white w-full outline-none transition-colors" placeholder="Label" />
              <input type="number" value={editVal} onChange={e => setEditVal(parseInt(e.target.value) || 0)} className="bg-black/60 border border-white/10 focus:border-red-900 px-3 py-2 rounded-lg text-white w-full outline-none transition-colors" placeholder="Value %" />
              <div className="flex items-center gap-2.5 pl-1">
                <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="bg-transparent border-0 w-8 h-8 cursor-pointer rounded overflow-hidden" />
                <span className="text-[11px] text-gray-400 tracking-wider uppercase">{editColor}</span>
              </div>
              <button type="button" onClick={saveChartItem} className="bg-red-950/40 border border-red-800/60 text-red-400 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-red-900 hover:text-white shadow-lg">Apply Changes</button>
            </div>
          )}

          {type === 'chart_vbar' && (
            <div className="flex items-end justify-around h-48 pt-8 px-6 bg-black/40 rounded-xl border border-white/[0.03] relative shadow-inner">
              {chartData.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-12 group/bar">
                  <div 
                    style={{ height: `${item.value}%`, backgroundColor: item.color }} 
                    className="w-full rounded-t-md opacity-75 hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative group-hover/bar:shadow-lg"
                  />
                  <span className="text-[10px] text-gray-500 font-mono truncate max-w-full pb-1">{item.name}</span>
                </div>
              ))}
            </div>
          )}

          {type === 'chart_hbar' && (
            <div className="space-y-4 p-5 bg-black/40 rounded-xl border border-white/[0.03] shadow-inner">
              {chartData.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono tracking-wide">
                    <span>{item.name}</span>
                    <span style={{ color: item.color }} className="font-bold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-white/[0.03] h-2 rounded-full overflow-hidden border border-white/[0.02]">
                    <div 
                      style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                      className="h-full rounded-full transition-all duration-500 ease-out shadow-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'chart_donut' && (
            <div className="p-6 bg-black/40 rounded-xl border border-white/[0.03] flex flex-col sm:flex-row items-center justify-around gap-6 shadow-inner">
              <div className="relative w-32 h-32 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0a0808" strokeWidth="4.5" />
                  {chartData.map((item, i) => {
                    const prevValues = chartData.slice(0, i).reduce((acc, curr) => acc + curr.value, 0);
                    const total = chartData.reduce((acc, curr) => acc + curr.value, 0) || 1;
                    const strokeDash = (item.value / total) * 100;
                    const strokeOffset = 100 - ((prevValues / total) * 100);
                    return (
                      <circle 
                        key={i} 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke={item.color} 
                        strokeWidth="4.5" 
                        strokeDasharray={`${strokeDash} ${100 - strokeDash}`} 
                        strokeDashoffset={strokeOffset} 
                        className="transition-all duration-700 ease-in-out opacity-80 hover:opacity-100" 
                      />
                    );
                  })}
                </svg>
                <div className="absolute font-mono text-[10px] tracking-widest text-gray-400 font-bold uppercase">Metric</div>
              </div>
              <div className="text-[11px] font-mono text-gray-400 space-y-2 grid grid-cols-2 gap-x-6">
                {chartData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }}/> 
                    <span className="truncate max-w-[90px] text-gray-300">{item.name}</span> 
                    <span className="text-white font-bold text-[10px]">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === 'tabs' && (
            <div className="border border-white/[0.05] rounded-xl overflow-hidden bg-black/30 shadow-inner">
              <div className="flex border-b border-white/[0.04] bg-black/40 text-[10px] font-mono overflow-x-auto scrollbar-none">
                {chartData.map((item, i) => (
                  <button 
                    key={i} 
                    type="button"
                    onClick={() => setActiveTab(item.name)}
                    className={`px-5 py-3 text-center tracking-widest transition-all shrink-0 cursor-pointer uppercase border-t-2 font-bold ${activeTab === item.name ? 'bg-[#0b0909] text-red-400' : 'text-gray-500 border-t-transparent hover:text-gray-300'}`}
                    style={{ borderTopColor: activeTab === item.name ? item.color : 'transparent' }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="p-5 text-xs font-mono text-gray-400 min-h-[72px] bg-[#0a0808]/50 leading-relaxed">
                📍 Selected channel alignment node connected with real-time analytics pipeline trackers matching structural data metrics array.
              </div>
            </div>
          )}

          {type === 'toggle_list' && (
            <div className="border border-white/[0.05] rounded-xl bg-black/20 overflow-hidden font-mono text-xs shadow-inner">
              <button 
                type="button"
                onClick={() => setToggleOpen(!toggleOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] text-gray-200 transition-all font-bold tracking-wide"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`transform transition-transform duration-200 text-[8px] text-red-500 ${toggleOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                  <span>{label}</span>
                </div>
              </button>
              {toggleOpen && (
                <div className="p-4 bg-[#0a0808]/60 border-t border-white/[0.04] text-gray-400 space-y-2.5 animate-slideDown">
                  {chartData.map((item, i) => (
                    <p key={i} className="flex items-center justify-between border-b border-white/[0.03] pb-2 last:border-0 last:pb-0">
                      <span className="flex items-center gap-2.5 text-gray-300"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}/>{item.name}</span>
                      <span className="font-bold text-white font-mono">{item.value} units</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

const DataMatrixNode = Node.create({
  name: 'dataMatrixNode',
  group: 'block',
  atom: true,
  addAttributes() { return { type: { default: 'chart_vbar' }, label: { default: 'Data Frame' } }; },
  parseHTML() { return [{ tag: 'div[data-type="data-matrix"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'data-matrix' })]; },
  addNodeView() { return ReactNodeViewRenderer(DataMatrixComponent); }
});

// ==========================================
// 2. VOICE MEMO EXTENSION
// ==========================================
const VoiceMemoComponent = (props: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { src, time } = props.node.attrs;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Audio playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <NodeViewWrapper className="voice-block-wrapper my-6" contentEditable={false}>
      <div className="voice-vault-card p-4 bg-[#0c0909] border border-red-950/40 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-sm hover:border-red-900/40 transition-colors duration-300">
        <button 
          onClick={togglePlay} 
          type="button" 
          className="w-11 h-11 rounded-full bg-red-950/30 border border-red-900/50 flex items-center justify-center text-red-400 hover:bg-red-950/80 hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer shadow-md"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-mono tracking-[0.2em] text-red-500 font-bold uppercase mb-0.5">Oral Archive Player</div>
          <div className="text-xs text-gray-300 font-mono truncate">{time || 'Recorded Telemetry Voice Segment'}</div>
        </div>
        <button 
          onClick={() => props.deleteNode()} 
          type="button" 
          className="text-[10px] text-gray-600 hover:text-red-400 font-mono tracking-widest opacity-80 hover:opacity-100 uppercase transition-colors px-2 py-1 cursor-pointer"
        >
          Purge
        </button>
        <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} className="hidden" controls={false} />
      </div>
    </NodeViewWrapper>
  );
};

const VoiceMemo = Node.create({
  name: 'voiceMemo',
  group: 'block',
  atom: true,
  addAttributes() { return { src: { default: null }, time: { default: '' } }; },
  parseHTML() { return [{ tag: 'div[data-type="voice-memo"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'voice-memo' })]; },
  addNodeView() { return ReactNodeViewRenderer(VoiceMemoComponent); },
});

// ==========================================
// 3. MASTER CENTRAL WORKSPACE
// ==========================================
function CentralWorkspace({ 
  activeDoc, 
  onSave, 
  onBackToHub 
}: { 
  activeDoc: SavedDocument; 
  onSave: (id: string, updates: Partial<SavedDocument>) => void;
  onBackToHub: () => void;
}) {
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showDotsMenu, setShowDotsMenu] = useState(false); // FOR THREE DOTS
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const [docTitle, setDocTitle] = useState(activeDoc ? activeDoc.title : '');
  const [isRecording, setIsRecording] = useState(false);

  const [showBannerConfig, setShowBannerConfig] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(activeDoc.bannerUrl || null);
  const [bannerPos, setBannerPos] = useState<number>(activeDoc.bannerPosition ?? 50);

  const [uploadModal, setUploadModal] = useState<{ open: boolean; type: 'img' | 'vid' | 'aud' | 'file' | null }>({ open: false, type: null });
  const [assetUrl, setAssetUrl] = useState('');
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const [dictQuery, setDictQuery] = useState('');
  const [selectedWordData, setSelectedWordData] = useState<any>(null);
  const [isDictLoading, setIsDictLoading] = useState(false);
  const [wikiQuery, setWikiQuery] = useState('');
  const [stats, setStats] = useState({ words: activeDoc ? activeDoc.wordCount : 0, characters: activeDoc ? activeDoc.charCount : 0, pages: activeDoc ? activeDoc.pages : 0 });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }), 
      VoiceMemo,
      DataMatrixNode,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Carve down content... Press Shift + D to call Slate Engine Tools Configuration Matrix." })
    ],
    content: activeDoc ? activeDoc.content : '',
    immediatelyRender: false,
    editorProps: {
      attributes: { 
        class: 'prose prose-invert focus:outline-none min-h-[680px] text-[#E8E1D7] font-serif text-[17px] md:text-lg leading-[1.85] w-full max-w-none [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-serif [&_h1]:italic [&_h1]:mb-6 [&_h1]:text-white [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:mb-4 [&_h2]:text-gray-200 [&_blockquote]:border-l-2 [&_blockquote]:border-red-900/60 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/[0.08] [&_img]:max-h-[480px] [&_img]:w-auto [&_img]:my-6 [&_video]:rounded-2xl [&_video]:w-full [&_video]:border [&_video]:border-white/[0.08] [&_video]:my-6 [&_audio]:w-full [&_audio]:my-4' 
      }
    },
    onUpdate({ editor }) {
      if (!activeDoc) return;
      const htmlContent = editor.getHTML();
      const text = editor.getText();
      const cleanText = text.trim();
      const wordCount = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
      const charCount = text.length;
      const estimatedPages = wordCount === 0 ? 0 : Math.ceil(wordCount / 250);

      setStats({ words: wordCount, characters: charCount, pages: estimatedPages });
      onSave(activeDoc.id, { content: htmlContent, wordCount, charCount, pages: estimatedPages, updatedAt: new Date().toLocaleDateString() });
    }
  });

  // --- THREE DOTS ACTION HANDLERS ---
  const handleExport = () => {
    const data = JSON.stringify(activeDoc, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDoc.title.replace(/\s+/g, '_')}_backup.json`;
    link.click();
    setShowDotsMenu(false);
  };

  const handlePublish = () => {
    alert(`Document "${activeDoc.title}" has been synced to the primary Inscription Registry.`);
    setShowDotsMenu(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.top !== 0 || rect.left !== 0) {
            setMenuCoords({ top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX });
            setShowFloatingMenu(prev => !prev);
            return;
          }
        }
        setMenuCoords({ top: window.innerHeight / 3 + window.scrollY, left: window.innerWidth / 3 });
        setShowFloatingMenu(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      editor.chain().focus();

      if (uploadModal.type === 'img') {
        editor.commands.setImage({ src: dataUrl, alt: file.name });
      } else if (uploadModal.type === 'vid') {
        editor.commands.insertContent(`<video src="${dataUrl}" controls preload="metadata" class="my-6 bg-black"></video><p></p>`);
      } else if (uploadModal.type === 'aud') {
        editor.commands.insertContent(`<audio src="${dataUrl}" controls class="my-4"></audio><p></p>`);
      } else if (uploadModal.type === 'file') {
        editor.commands.insertContent(`<div class="p-4 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between font-mono text-xs text-gray-300 my-4 shadow-md"><span>📁 ${file.name}</span><a href="${dataUrl}" download="${file.name}" class="text-red-400 hover:text-white underline transition-colors">Download Asset</a></div><p></p>`);
      }
      
      setUploadModal({ open: false, type: null });
      setAssetUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setBannerUrl(dataUrl);
      onSave(activeDoc.id, { bannerUrl: dataUrl, bannerPosition: bannerPos });
    };
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    setBannerUrl(null);
    setShowBannerConfig(false);
    onSave(activeDoc.id, { bannerUrl: null });
  };

  const changeBannerVerticalPosition = (val: number) => {
    setBannerPos(val);
    onSave(activeDoc.id, { bannerPosition: val });
  };

  const submitUrlAsset = () => {
    if (!editor) return;
    editor.chain().focus();

    if (uploadModal.type === 'aud' && spotifyEmbedUrl) {
      let embedUrl = spotifyEmbedUrl;
      if (embedUrl.includes('spotify.com')) {
        embedUrl = embedUrl.replace('/track/', '/embed/track/');
      }
      editor.commands.insertContent(`<div class="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-lg"><iframe src="${embedUrl}" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div><p></p>`);
    } else if (assetUrl) {
      if (uploadModal.type === 'img') {
        editor.commands.setImage({ src: assetUrl });
      } else if (uploadModal.type === 'vid') {
        editor.commands.insertContent(`<video src="${assetUrl}" controls class="my-6 bg-black w-full"></video><p></p>`);
      } else if (uploadModal.type === 'aud') {
        editor.commands.insertContent(`<audio src="${assetUrl}" controls class="my-4 w-full"></audio><p></p>`);
      } else if (uploadModal.type === 'file') {
        editor.commands.insertContent(`<div class="p-4 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between font-mono text-xs text-gray-300 my-4 shadow-md"><span>📁 ${fileName || 'External Asset'}</span><a href="${assetUrl}" target="_blank" class="text-red-400 hover:text-white underline transition-colors">Open Resource ↗</a></div><p></p>`);
      }
    }
    setUploadModal({ open: false, type: null });
    setAssetUrl('');
    setSpotifyEmbedUrl('');
  };

  const executeMenuAction = (actionType: string) => {
    if (!editor) return;
    editor.chain().focus();

    if (['img', 'vid', 'aud', 'file'].includes(actionType)) {
      setUploadModal({ open: true, type: actionType as any });
      setShowFloatingMenu(false);
      return;
    }

    switch (actionType) {
      case 'h1': editor.commands.toggleHeading({ level: 1 }); break; 
      case 'h2': editor.commands.toggleHeading({ level: 2 }); break; 
      case 'bullet': editor.commands.toggleBulletList(); break;
      case 'quote': editor.commands.toggleBlockquote(); break;
      case 'divider': editor.commands.setHorizontalRule(); break;
      case 'code': editor.commands.toggleCodeBlock(); break;
      case 'chart_vbar': editor.commands.insertContent({ type: 'dataMatrixNode', attrs: { type: 'chart_vbar', label: 'Vertical Analysis Matrix' } }); break;
      case 'chart_hbar': editor.commands.insertContent({ type: 'dataMatrixNode', attrs: { type: 'chart_hbar', label: 'Progress Tracking Array' } }); break;
      case 'chart_donut': editor.commands.insertContent({ type: 'dataMatrixNode', attrs: { type: 'chart_donut', label: 'Resource Allocation Map' } }); break;
      case 'toggle_list': editor.commands.insertContent({ type: 'dataMatrixNode', attrs: { type: 'toggle_list', label: 'Collapsible Data Node Layers' } }); break;
      case 'tabs': editor.commands.insertContent({ type: 'dataMatrixNode', attrs: { type: 'tabs', label: 'Multi-Tab Architecture Frame' } }); break;
    }
    setShowFloatingMenu(false);
  };

  const queryUniversalEngine = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = dictQuery.trim();
    if (!query) return;

    setIsDictLoading(true);
    setSelectedWordData(null);

    try {
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query.toLowerCase())}`);
      let dictData = null;
      if (dictRes.ok) {
        const json = await dictRes.json();
        dictData = json[0];
      }

      const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      let wikiData = null;
      if (wikiRes.ok) {
        wikiData = await wikiRes.json();
      }

      if (!dictData && (!wikiData || wikiData.type === 'disambiguation')) {
        throw new Error("No clean match discovered");
      }

      setSelectedWordData({
        title: dictData ? dictData.word : wikiData?.title,
        phonetic: dictData?.phonetic || (dictData?.phonetics?.find((p: any) => p.text)?.text) || 'Universal Entry Descriptor',
        audio: dictData?.phonetics?.find((p: any) => p.audio !== '')?.audio || null,
        type: wikiData?.description || 'System Record Object Node',
        definition: dictData?.meanings?.[0]?.definitions?.[0]?.definition || wikiData?.extract,
        image: wikiData?.thumbnail?.source || null,
        moreUrl: wikiData?.content_urls?.desktop?.page || null
      });

    } catch (err) {
      setSelectedWordData({
        title: query,
        phonetic: "/ɪnˈdɛks/",
        definition: "Analyzed catalog match not completely parsed via local dictionary layers. Entry verified as unique system token identifier.",
        type: "Entity Cluster Block Element"
      });
    } finally {
      setIsDictLoading(false);
    }
  };

  const toggleRecordingAction = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    } else {
      audioChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            editor?.chain().focus().insertContent({
              type: 'voiceMemo',
              attrs: {
                src: base64Audio,
                time: `Recorded at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              }
            }).run();
          };
        };

        mediaRecorderRef.current = recorder;
        recorder.start(250);
        setIsRecording(true);
      } catch (err) {
        alert("Microphone connection channel could not initialize. Grant internal browser privileges.");
        console.error(err);
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-[#F4EBE1] selection:bg-red-950/60 selection:text-red-200"
      style={{ backgroundImage: "url('/workspace-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
      <input type="file" ref={bannerFileInputRef} onChange={handleBannerUpload} accept="image/*" className="hidden" />

      {uploadModal.open && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[100] flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-[#0b0808] border border-white/[0.08] rounded-3xl w-full max-w-md p-6 font-mono space-y-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-[0.2em]">Deploy Asset Injector</h3>
              <button onClick={() => { setUploadModal({ open: false, type: null }); setAssetUrl(''); }} className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer">✕</button>
            </div>

            {uploadModal.type === 'aud' && (
              <div className="space-y-2 bg-green-950/10 p-4 rounded-2xl border border-green-900/20">
                <label className="text-[9px] text-green-400 font-bold uppercase tracking-widest block">Spotify Link Pipeline</label>
                <input type="text" placeholder="Paste link tracking matrix here..." value={spotifyEmbedUrl} onChange={e => setSpotifyEmbedUrl(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-green-800 transition-colors outline-none" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] text-gray-400 uppercase font-bold tracking-widest block">Remote Source URL Stream</label>
              <input type="text" placeholder="https://domain/resource-file.ext" value={assetUrl} onChange={e => setAssetUrl(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-red-900 transition-colors outline-none" />
              {uploadModal.type === 'file' && (
                <input type="text" placeholder="Custom Display Title Name" value={fileName} onChange={e => setFileName(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-red-900 transition-colors outline-none mt-1" />
              )}
            </div>

            <div className="relative flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/30 hover:bg-black/60 rounded-2xl p-8 cursor-pointer group transition-all duration-300" onClick={() => hiddenFileInputRef.current?.click()}>
              <input type="file" ref={hiddenFileInputRef} onChange={handleNativeFileUpload} accept={uploadModal.type === 'img' ? 'image/*' : uploadModal.type === 'vid' ? 'video/*' : uploadModal.type === 'aud' ? 'audio/*' : '*'} className="hidden" />
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">📤</span>
              <div className="text-xs text-gray-200 font-bold tracking-wide">Select Local System Elements</div>
              <div className="text-[10px] text-gray-500 mt-1 font-mono">Upload asset straight into canvas array</div>
            </div>

            <div className="flex gap-2.5 justify-end pt-2 text-[11px] uppercase tracking-widest font-bold">
              <button onClick={() => setUploadModal({ open: false, type: null })} className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 rounded-xl transition-all cursor-pointer">Cancel</button>
              <button onClick={submitUrlAsset} className="px-5 py-2 bg-red-950/60 border border-red-800/40 text-red-400 hover:text-white rounded-xl hover:bg-red-900 transition-all shadow-md cursor-pointer">Inject Node</button>
            </div>
          </div>
        </div>
      )}

      {showFloatingMenu && (
        <div style={{ top: menuCoords.top, left: menuCoords.left, position: 'absolute' }} className="w-68 max-h-84 bg-[#0a0606]/95 border border-white/[0.08] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] p-3.5 z-50 flex flex-col overflow-y-auto backdrop-blur-xl font-mono text-[11px] space-y-0.5 scrollbar-thin animate-fadeIn">
          <div className="border-b border-white/[0.05] pb-2 mb-2 text-[9px] font-bold text-red-500 uppercase tracking-[0.2em]">Slate Interface Modules</div>
          <button onClick={() => executeMenuAction('h1')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">Heading 1 (Main Title)</button>
          <button onClick={() => executeMenuAction('h2')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">Heading 2 (Section Block)</button>
          <button onClick={() => executeMenuAction('bullet')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">Bullet List Sequence</button>
          <button onClick={() => executeMenuAction('quote')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">Block Narrative Quote</button>
          <button onClick={() => executeMenuAction('divider')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">Horizontal Break Rule</button>
          <button onClick={() => executeMenuAction('code')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">Monospace Code Box</button>
          
          <div className="border-t border-white/[0.05] my-2 pt-2 text-[9px] text-gray-500 uppercase font-bold tracking-widest">Interactive Data Components</div>
          <button onClick={() => executeMenuAction('chart_vbar')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-300 transition-all">📊 Vertical Data Grid</button>
          <button onClick={() => executeMenuAction('chart_hbar')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-300 transition-all">📈 Horizontal Line Chart</button>
          <button onClick={() => executeMenuAction('chart_donut')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-300 transition-all">🍩 Segment Allocation Ring</button>
          <button onClick={() => executeMenuAction('toggle_list')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-300 transition-all">📁 Accordion Group Folder</button>
          <button onClick={() => executeMenuAction('tabs')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-300 transition-all">📑 Multi-Tab Storage Array</button>

          <div className="border-t border-white/[0.05] my-2 pt-2 text-[9px] text-gray-500 uppercase font-bold tracking-widest">Upload Media Channels</div>
          <button onClick={() => executeMenuAction('img')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">🖼️ Image Asset Frame</button>
          <button onClick={() => executeMenuAction('vid')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">🎥 High-Fidelity Video Node</button>
          <button onClick={() => executeMenuAction('aud')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">🎵 Embedded Audio Pipeline</button>
          <button onClick={() => executeMenuAction('file')} className="w-full text-left px-2.5 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg text-gray-400 transition-all">🔑 Encrypted System File</button>
        </div>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 flex items-center justify-between">
        <button 
          onClick={onBackToHub} 
          className="group bg-[#0a0a0a] border border-white/[0.06] hover:border-white/20 px-5 py-2 rounded-full text-[10px] uppercase font-mono tracking-widest text-gray-400 hover:text-white transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">⇠</span> Central Navigation Matrix
        </button>

        {/* --- THREE DOTS COMPONENT --- */}
        <div className="relative">
          <button 
            onClick={() => setShowDotsMenu(!showDotsMenu)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
          >
            ⋮
          </button>
          {showDotsMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0d0d0d] border border-white/10 rounded-xl shadow-2xl z-50 p-2 font-mono text-[10px] uppercase tracking-widest animate-scaleUp">
              <button onClick={() => { onSave(activeDoc.id, {}); setShowDotsMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-white/[0.05] text-gray-300 hover:text-emerald-400 rounded-lg transition-colors">💾 Save to Vault</button>
              <button onClick={handleExport} className="w-full text-left px-3 py-2 hover:bg-white/[0.05] text-gray-300 hover:text-blue-400 rounded-lg transition-colors">📤 Export JSON</button>
              <button onClick={handlePublish} className="w-full text-left px-3 py-2 hover:bg-white/[0.05] text-gray-300 hover:text-red-400 rounded-lg transition-colors">🚀 Publish Node</button>
              <div className="border-t border-white/[0.05] my-1" />
              <button onClick={() => setShowDotsMenu(false)} className="w-full text-left px-3 py-2 hover:bg-white/[0.05] text-gray-500 rounded-lg transition-colors">Close</button>
            </div>
          )}
        </div>

        <div className="hidden md:block text-[9px] font-mono text-gray-400 uppercase tracking-[0.2em] bg-white/[0.01] px-4 py-1.5 rounded-full border border-white/[0.04]">
          Telemetry Feed: <span className="text-emerald-400 font-bold animate-pulse">Online</span>
        </div>
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="rounded-2xl border border-white/[0.05] bg-cover bg-center p-5 shadow-xl flex flex-col justify-between min-h-[260px] hover:border-white/10 transition-colors duration-300 relative overflow-hidden"
          style={{ backgroundImage: "url('/workspace-bg.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="relative z-10 w-full space-y-3">
            <span className="text-[9px] font-mono tracking-[0.2em] text-red-400 font-bold block uppercase">Lexicon Intel Lookup Engine</span>
            <form onSubmit={queryUniversalEngine} className="flex gap-2">
              <input type="text" placeholder="Query term..." value={dictQuery} onChange={e => setDictQuery(e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-gray-700 outline-none focus:border-red-900 transition-colors" />
              <button type="submit" className="bg-red-950/40 border border-red-800/40 px-3.5 text-xs font-mono font-bold uppercase tracking-wider text-red-400 rounded-xl hover:bg-red-900 hover:text-white transition-all cursor-pointer">Find</button>
            </form>

            {isDictLoading && <div className="text-[10px] font-mono text-gray-500 animate-pulse tracking-wide">Querying remote registries...</div>}
            
            {selectedWordData && (
              <div className="bg-black/40 p-3 rounded-xl border border-white/[0.03] max-h-[135px] overflow-y-auto space-y-2.5 font-mono text-xs scrollbar-thin">
                <div className="flex items-start gap-2.5 justify-between border-b border-white/[0.04] pb-2">
                  <div className="min-w-0">
                    <strong className="text-red-400 text-sm block truncate leading-tight">{selectedWordData.title}</strong>
                    <span className="text-[10px] text-gray-500 italic block mt-0.5">{selectedWordData.phonetic}</span>
                    <span className="text-[8px] bg-white/[0.04] text-gray-400 px-1.5 py-0.5 rounded uppercase mt-1 inline-block tracking-wider font-bold border border-white/[0.02]">{selectedWordData.type}</span>
                  </div>
                  {selectedWordData.image && (
                    <img src={selectedWordData.image} alt="" className="w-11 h-11 object-cover rounded-lg border border-white/10 shrink-0 shadow-sm" />
                  )}
                </div>
                
                {selectedWordData.audio && (
                  <button type="button" onClick={() => { const a = new Audio(selectedWordData.audio); a.play().catch(e => console.error(e)); }} className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 hover:text-emerald-300 block bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/30 w-fit transition-colors">🔊 Audio Voice Track</button>
                )}

                <p className="text-[11px] text-gray-300 font-sans leading-relaxed">{selectedWordData.definition}</p>
                {selectedWordData.moreUrl && (
                  <a href={selectedWordData.moreUrl} target="_blank" rel="noreferrer" className="text-[10px] text-red-400 hover:text-white underline block pt-0.5 transition-colors">Explore Biography Matrix ↗</a>
                )}
              </div>
            )}
          </div>
        </div>

        <div 
          className="rounded-2xl border border-white/[0.05] bg-cover bg-center p-5 shadow-xl flex flex-col justify-between min-h-[260px] hover:border-white/10 transition-colors duration-300 relative overflow-hidden"
          style={{ backgroundImage: "url('/workspace-bg.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="relative z-10 w-full space-y-3">
            <span className="text-[9px] font-mono tracking-[0.2em] text-blue-400 font-bold block uppercase">Cross-Network Portal Routing</span>
            <input type="text" placeholder="Specify global reference node..." value={wikiQuery} onChange={e => setWikiQuery(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-gray-700 outline-none focus:border-blue-900 transition-colors" />
            <button type="button" onClick={() => wikiQuery && window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(wikiQuery)}`, '_blank')} className="w-full bg-blue-950/20 text-[10px] font-mono text-blue-400 hover:text-white border border-blue-900/30 hover:border-blue-700 py-2.5 rounded-xl transition-all uppercase font-bold tracking-widest shadow-md cursor-pointer">Launch External Stream Link ↗</button>
          </div>
          <p className="relative z-10 text-[10px] font-mono text-gray-500 leading-relaxed border-t border-white/[0.03] pt-4">Deploys localized search vectors into globally scaled open databases exterior to the workspace array layer.</p>
        </div>

        <div 
          className="rounded-2xl border border-white/[0.05] bg-cover bg-center p-5 shadow-xl flex flex-col justify-between min-h-[260px] hover:border-white/10 transition-colors duration-300 relative overflow-hidden"
          style={{ backgroundImage: "url('/workspace-bg.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <span className="relative z-10 text-[9px] font-mono tracking-[0.2em] text-emerald-400 font-bold block uppercase">Canvas Index Telemetry</span>
          <div className="relative z-10 bg-black/50 border border-white/[0.03] rounded-2xl p-4 font-mono text-xs text-gray-300 space-y-3 shadow-inner">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2"><span>Total Word Mass:</span><span className="text-red-400 font-bold text-sm tracking-wide">{stats.words}</span></div>
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2"><span>Buffer Memory Load:</span><span className="text-white">{stats.characters} bytes</span></div>
            <div className="flex justify-between items-center"><span>Approximate Volumetric Sheets:</span><span className="text-emerald-400 font-bold">~ {stats.pages} Slates</span></div>
          </div>
          <div className="relative z-10 text-[9px] font-mono text-gray-500 text-center tracking-widest bg-white/5 py-1.5 border border-white/[0.04] rounded-xl font-bold uppercase">Auto-Sync Pipeline Enabled</div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 relative group/bannerContainer">
        {bannerUrl ? (
          <div className="relative w-full h-52 md:h-64 rounded-3xl overflow-hidden border border-white/[0.06] shadow-xl bg-black">
            <img 
              src={bannerUrl} 
              alt="Workspace Canvas Banner" 
              className="w-full h-full object-cover transition-all duration-150 pointer-events-none"
              style={{ objectPosition: `50% ${bannerPos}%` }}
            />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/bannerContainer:opacity-100 transition-opacity duration-300 z-30">
              <button 
                onClick={() => setShowBannerConfig(!showBannerConfig)}
                className="bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider transition-colors cursor-pointer"
              >
                📐 Reposition / Crop
              </button>
              <button 
                onClick={() => bannerFileInputRef.current?.click()}
                className="bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider transition-colors cursor-pointer"
              >
                🔄 Change Banner
              </button>
              <button 
                onClick={removeBanner}
                className="bg-red-950/80 backdrop-blur-md border border-red-900/40 text-[10px] font-mono text-red-400 hover:text-red-200 px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider transition-colors cursor-pointer"
              >
                ✕ Purge
              </button>
            </div>

            {showBannerConfig && (
              <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-md border-t border-white/10 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-gray-300 z-30 animate-slideDown">
                <div className="flex items-center gap-2 w-full sm:max-w-md">
                  <span className="text-[10px] uppercase text-gray-500 tracking-wider">Vertical Crop Axis:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={bannerPos} 
                    onChange={(e) => changeBannerVerticalPosition(Number(e.target.value))}
                    className="flex-1 accent-red-600 cursor-row-resize bg-white/10 h-1 rounded-full appearance-none"
                  />
                  <span className="text-white w-8 text-right font-bold">{bannerPos}%</span>
                </div>
                <button 
                  onClick={() => setShowBannerConfig(false)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-1 rounded-lg text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-sm shrink-0"
                >
                  Lock Alignment
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-2">
            <button 
              onClick={() => bannerFileInputRef.current?.click()}
              className="text-[10px] font-mono text-gray-500 hover:text-red-400 border border-dashed border-white/[0.04] hover:border-red-900/40 bg-white/[0.01] hover:bg-red-950/10 px-4 py-2 rounded-xl transition-all tracking-widest uppercase font-bold cursor-pointer"
            >
              🖼️ Add Canvas Banner Frame
            </button>
          </div>
        )}
      </section>

      <header className="relative z-10 w-full flex flex-col justify-end px-6 md:px-12 pt-10 pb-4 max-w-7xl mx-auto">
        <input 
          type="text" 
          value={docTitle} 
          onChange={e => { setDocTitle(e.target.value); onSave(activeDoc.id, { title: e.target.value }); }} 
          className="bg-transparent border-b border-transparent hover:border-white/10 text-3xl font-serif font-bold italic text-white focus:outline-none py-2 w-full max-w-xl transition-all duration-300 focus:border-red-900/60" 
          placeholder="Name Inscription Sheet..." 
        />
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 relative">
        <div className="bg-[#080808] border border-white/[0.04] rounded-3xl p-6 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.6)] min-h-[720px] relative focus-within:border-red-900/30 transition-all duration-300">
          <EditorContent editor={editor} />
          
          <div className="fixed bottom-8 right-8 md:right-12 flex items-center gap-3 z-40 animate-fadeIn">
            {isRecording && (
              <span className="text-[9px] font-mono bg-red-950/90 border border-red-500/50 text-red-400 px-4 py-2 rounded-full uppercase tracking-widest font-bold shadow-lg animate-pulse">Oral Streaming Active...</span>
            )}
            <button 
              type="button" 
              onClick={toggleRecordingAction} 
              className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-[0_5px_15px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 focus:outline-none ${isRecording ? 'bg-red-600 border-white text-white scale-110 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-[#0a0707] border-red-950/80 text-red-500 hover:bg-red-950 hover:text-white hover:border-red-700/60 hover:scale-105'}`}
            >
              <span className="text-xl">🎤</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 4. VAULT INSCRIPTIONS SHEET DIRECTORY
// ==========================================
function InscriptionsWorkspace({ 
  documents, 
  onCreateNew, 
  onSelectDoc, 
  onDeleteDoc,
  onBackToHub 
}: { 
  documents: SavedDocument[];
  onCreateNew: () => void;
  onSelectDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
  onBackToHub: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredDocs = documents.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-[#F4EBE1] font-serif p-6 md:p-12 relative"
      style={{ backgroundImage: "url('/inscriptions-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex justify-between items-center mb-10">
        <button type="button" onClick={onBackToHub} className="bg-[#0a0a0a] border border-white/[0.06] hover:border-white/20 px-4 py-2 rounded-full text-[10px] uppercase font-mono tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer">⇠ Return to Hub</button>
        <button type="button" onClick={onCreateNew} className="bg-blue-950/20 border border-blue-900/40 hover:bg-blue-900 hover:text-white text-blue-400 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-2 transition-all hover:scale-102 cursor-pointer shadow-md">+ Start Document Node</button>
      </div>

      <header className="relative z-10 max-w-6xl mx-auto mb-10 border-b border-white/[0.04] pb-8">
        <span className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase block mb-2">Dataset // 02</span>
        <h1 className="text-4xl font-serif tracking-tighter italic opacity-90 font-light">Inscriptions Core Vault</h1>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <input type="text" placeholder="Filter sheet repositories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#080808] border border-white/[0.04] text-sm rounded-xl px-4 py-3 text-[#F4EBE1] focus:outline-none focus:border-blue-900/60 font-mono transition-colors placeholder-gray-700" />
          
          {filteredDocs.length === 0 ? (
            <div className="border border-dashed border-white/[0.05] bg-[#070707] p-16 text-center rounded-2xl"><p className="text-sm text-gray-500 font-mono tracking-wide">No system sheet logs discoverable within filtered path indexes.</p></div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  className="border border-white/[0.04] bg-cover bg-center p-5 md:p-6 rounded-2xl flex justify-between items-center group hover:border-blue-900/30 transition-all duration-300 shadow-sm relative overflow-hidden"
                  style={{ backgroundImage: "url('/inscriptions-bg.jpeg')" }}
                >
                  <div className="absolute inset-0 bg-black/75 group-hover:bg-black/65 transition-colors" />
                  <div className="relative z-10 flex-1 min-w-0 cursor-pointer pl-1" onClick={() => onSelectDoc(doc.id)}>
                    <div className="flex items-baseline gap-3 mb-1.5"><span className="text-lg font-serif font-bold text-gray-200 group-hover:text-blue-400 transition-colors block truncate">{doc.title}</span></div>
                    <div className="flex gap-4 text-[10px] font-mono text-gray-500 tracking-wide"><span>Word Mass: {doc.wordCount}</span><span>Volumetric Unit: ~{doc.pages} Pages</span><span>Saved: {doc.updatedAt}</span></div>
                  </div>
                  <button type="button" onClick={() => onDeleteDoc(doc.id)} className="relative z-10 text-[10px] font-mono text-gray-700 hover:text-red-400 tracking-widest uppercase transition-colors px-3 py-2 cursor-pointer">Purge</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div 
          className="bg-cover bg-center border border-white/[0.04] p-6 rounded-2xl h-fit font-mono text-xs text-gray-400 space-y-3.5 shadow-md relative overflow-hidden"
          style={{ backgroundImage: "url('/inscriptions-bg.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative z-10">
            <h4 className="text-blue-500 uppercase tracking-widest text-[10px] font-bold">Registry Summary</h4>
            <div className="flex justify-between border-b border-white/[0.03] pb-2"><span>Total Logged Files:</span><span className="text-white font-bold">{documents.length} Units</span></div>
            <p className="text-[10px] text-gray-600 leading-relaxed font-sans">Encryption algorithms secure index paths dynamically during local workspace updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. EPIGRAPHY UNIVERSAL DOWNLOADABLE LIBRARY
// ==========================================
function EpigraphyMatrixWorkspace({ onBackToHub }: { onBackToHub: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [activeCatalog, setActiveCatalog] = useState<'all' | 'fiction' | 'nonfiction' | 'classical'>('all');

  const proprietaryMatrixDataset: BookRecord[] = [
    {
      id: "pro-1",
      title: "Mother Mary Comes to Me",
      authors: ["Arundhati Roy"],
      subjects: ["Contemporary Non-Fiction", "Political Prose", "Memoir & Biographies"],
      languages: ["en"],
      downloadCount: 24590,
      formats: {},
      coverUrl: null,
      isModern: true
    },
    {
      id: "pro-2",
      title: "Animals",
      authors: ["Emma Jane Unsworth"],
      subjects: ["Modern Fiction", "Contemporary Drama", "Social Dynamics"],
      languages: ["en"],
      downloadCount: 18430,
      formats: {},
      coverUrl: null,
      isModern: true
    },
    {
      id: "pro-3",
      title: "Normal People",
      authors: ["Sally Rooney"],
      subjects: ["Contemporary Fiction", "Romance Drama", "Psychological Realism"],
      languages: ["en"],
      downloadCount: 89650,
      formats: {},
      coverUrl: null,
      isModern: true
    }
  ];

  useEffect(() => {
    executeLibrarySearch('Classic Literature');
  }, []);

  const executeLibrarySearch = async (term: string) => {
    const cleanQuery = term.trim().toLowerCase();
    if (!cleanQuery) return;

    setIsLoading(true);
    setErrorStatus(null);

    const localMatches = proprietaryMatrixDataset.filter(book => 
      book.title.toLowerCase().includes(cleanQuery) || 
      book.authors.some(auth => auth.toLowerCase().includes(cleanQuery))
    );

    try {
      const targetUrl = `https://gutendex.com/books/?search=${encodeURIComponent(term.trim())}`;
      const response = await fetch(targetUrl);
      
      let fetchedBooks: BookRecord[] = [];
      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          fetchedBooks = data.results.map((item: any) => ({
            id: item.id,
            title: item.title,
            authors: item.authors?.map((a: any) => a.name) || ['Unknown Archivist'],
            subjects: item.subjects?.slice(0, 3) || [],
            languages: item.languages || ['en'],
            downloadCount: item.download_count || 0,
            formats: item.formats || {},
            coverUrl: item.formats['image/jpeg'] || null,
            isModern: false
          }));
        }
      }

      const mergedDataset = [...localMatches, ...fetchedBooks];

      if (mergedDataset.length === 0) {
        setErrorStatus("No matched entries found inside network indexes.");
        setBooks([]);
        return;
      }

      setBooks(mergedDataset);
    } catch (err: any) {
      if (localMatches.length > 0) {
        setBooks(localMatches);
      } else {
        setErrorStatus("Failed to communicate with open APIs.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLibrarySearch(searchQuery);
  };

  const routeToModernDownloadEngine = (book: BookRecord) => {
    const safeTitle = encodeURIComponent(book.title);
    const safeAuthor = encodeURIComponent(book.authors[0] || '');
    const targetQueryUrl = `https://oceanofpdf.com/?s=${safeTitle}+${safeAuthor}`;
    window.open(targetQueryUrl, '_blank', 'noopener,noreferrer');
  };

  const triggerClassicalDownload = (fileUrl: string, bookTitle: string, formatExtension: string) => {
    if (!fileUrl) return;
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.target = '_blank';
    const safeName = bookTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    anchor.setAttribute('download', `${safeName}.${formatExtension}`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const filteredBooks = books.filter(book => {
    if (activeCatalog === 'fiction') {
      if (book.isModern) return book.subjects.some(s => s.toLowerCase().includes('fiction') && !s.toLowerCase().includes('non-fiction'));
      return book.subjects.some(s => s.toLowerCase().includes('fiction') || s.toLowerCase().includes('stories') || s.toLowerCase().includes('drama'));
    }
    if (activeCatalog === 'nonfiction') {
      if (book.isModern) return book.subjects.some(s => s.toLowerCase().includes('non-fiction'));
      return !book.subjects.some(s => s.toLowerCase().includes('fiction') || s.toLowerCase().includes('stories'));
    }
    if (activeCatalog === 'classical') return !book.isModern;
    return true;
  });

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-[#F4EBE1] font-serif p-6 md:p-12 transition-all relative"
      style={{ backgroundImage: "url('/universallibrary-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <button 
          type="button" 
          onClick={onBackToHub} 
          className="bg-[#0a0a0a] border border-white/[0.06] hover:border-white/20 px-4 py-2 rounded-full text-[10px] uppercase font-mono tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          ⇠ Return to Dashboard Hub
        </button>
        
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px] uppercase bg-black/80 border border-white/[0.04] p-1 rounded-xl shadow-md">
          {(['all', 'fiction', 'nonfiction', 'classical'] as const).map((cat) => (
            <button 
              key={cat}
              type="button"
              onClick={() => setActiveCatalog(cat)}
              className={`px-3.5 py-1.5 rounded-lg font-bold tracking-wider transition-all cursor-pointer ${activeCatalog === cat ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/30' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {cat === 'all' ? '🌐 Index Repository' : cat === 'nonfiction' ? '📑 Non-Fiction' : `${cat}`}
            </button>
          ))}
        </div>
      </div>

      <header className="relative z-10 max-w-7xl mx-auto mb-10 border-b border-white/[0.04] pb-8">
        <span className="text-emerald-500 text-[10px] font-black tracking-[0.4em] uppercase block mb-2">System // 03</span>
        <h1 className="text-4xl font-serif tracking-tighter italic opacity-95 font-light">Epigraphy Universal Library</h1>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto mb-12">
        <form onSubmit={handleFormSubmit} className="flex gap-2.5 bg-[#080808]/90 border border-white/[0.04] p-2 rounded-2xl shadow-xl max-w-2xl focus-within:border-emerald-900/40 transition-colors">
          <input 
            type="text" 
            placeholder="Search contemporary literature titles, authors, or classical texts..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="flex-1 bg-black/60 border border-white/[0.03] rounded-xl px-4 py-3 text-sm font-mono text-[#F4EBE1] placeholder-gray-700 focus:outline-none"
          />
          <button type="submit" className="bg-emerald-950/40 border border-emerald-800/40 px-6 text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 rounded-xl hover:bg-emerald-900 hover:text-white transition-all cursor-pointer shadow-md">Query Network</button>
        </form>
      </section>

      <main className="relative z-10 max-w-7xl mx-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-24 border border-dashed border-white/[0.05] rounded-3xl bg-black/30 font-mono space-y-4 shadow-inner">
            <span className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin block"/>
            <p className="text-[11px] text-gray-400 tracking-widest animate-pulse uppercase font-bold">Synchronizing target payload streams...</p>
          </div>
        )}

        {errorStatus && !isLoading && (
          <div className="p-5 border border-red-900/30 bg-red-950/10 rounded-2xl font-mono text-xs text-red-400 max-w-xl shadow-md">
            ⚠️ <strong className="uppercase tracking-wide mr-1">System Exception:</strong> {errorStatus}
          </div>
        )}

        {!isLoading && !errorStatus && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredBooks.map((book) => {
              const pdfUrl = book.formats['application/pdf'];
              const epubUrl = book.formats['application/epub+zip'];
              const htmlUrl = book.formats['text/html'] || book.formats['text/html; charset=utf-8'];
              const plainTextUrl = book.formats['text/plain; charset=utf-8'] || book.formats['text/plain'];

              return (
                <div 
                  key={book.id} 
                  className="border border-white/[0.04] bg-cover bg-center rounded-2xl overflow-hidden p-5 flex flex-col justify-between shadow-xl group hover:border-emerald-900/20 transition-all duration-300 relative"
                  style={{ backgroundImage: "url('/universallibrary-bg.jpeg')" }}
                >
                  <div className="absolute inset-0 bg-black/85 group-hover:bg-black/75 transition-colors" />
                  <div className="relative z-10 flex gap-4.5">
                    <div className="w-22 h-30 bg-black border border-white/[0.05] rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center shadow-inner relative">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                      ) : (
                        <div className="text-2xl opacity-20 font-mono">📖</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h3 className="font-serif font-bold text-gray-100 text-[15px] md:text-base leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors" title={book.title}>{book.title}</h3>
                      <p className="font-mono text-[11px] text-gray-400 truncate pl-0.5">By {book.authors.join(', ') || 'Unknown Author'}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {book.languages.map((lang, idx) => (
                          <span key={idx} className="bg-white/10 border border-white/[0.04] font-mono text-[8px] px-1.5 py-0.5 rounded uppercase text-gray-300 tracking-wider font-bold">{lang}</span>
                        ))}
                        <span className="font-mono text-[9px] text-gray-500 self-center pl-1">📥 {book.downloadCount.toLocaleString()} hits</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-4 pt-3.5 border-t border-white/[0.04] grid grid-cols-2 gap-2 font-mono text-[10px]">
                    {book.isModern ? (
                      <button 
                        type="button" 
                        onClick={() => routeToModernDownloadEngine(book)}
                        className="bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900 hover:text-white text-emerald-400 px-3 py-2.5 rounded-xl text-center font-bold tracking-widest transition-all cursor-pointer col-span-2 shadow-md flex items-center justify-center gap-2 uppercase text-[9px]"
                      >
                        ⚡ Fetch Digital File [OceanofPDF] ↗
                      </button>
                    ) : (
                      <>
                        {pdfUrl ? (
                          <button type="button" onClick={() => triggerClassicalDownload(pdfUrl, book.title, 'pdf')} className="bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-900 px-2 py-2 rounded-xl text-center text-emerald-400 hover:text-white font-bold transition-all cursor-pointer">⬇️ PDF</button>
                        ) : epubUrl ? (
                          <button type="button" onClick={() => triggerClassicalDownload(epubUrl, book.title, 'epub')} className="bg-teal-950/20 border border-teal-900/40 hover:bg-teal-900 px-2 py-2 rounded-xl text-center text-teal-400 hover:text-white font-bold transition-all cursor-pointer">⬇️ EPUB</button>
                        ) : (
                          <button type="button" onClick={() => plainTextUrl && triggerClassicalDownload(plainTextUrl, book.title, 'txt')} className="bg-gray-900 border border-white/10 hover:bg-white/10 px-2 py-2 rounded-xl text-center text-gray-300 font-bold transition-all cursor-pointer" disabled={!plainTextUrl}>⬇️ TXT</button>
                        )}
                        {htmlUrl && (
                          <a href={htmlUrl} target="_blank" rel="noreferrer" className="bg-black border border-white/[0.05] hover:border-white/20 px-2 py-2 rounded-xl text-center text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5 font-bold shadow-sm">Read Online ↗</a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 6. MASTER HUB LAYOUT SWITCH ROUTER
// ==========================================
export default function MasterDashboardPage() {
  const [currentView, setCurrentView] = useState<'hub' | 'editor' | 'inscriptions' | 'epigraphy'>('hub');
  const [isMounted, setIsMounted] = useState(false);
  
  // --- NEW ACCOUNT STATES ---
  const [user, setUser] = useState<UserAccount | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', email: '', isSignUp: false });

  const [documents, setDocuments] = useState<SavedDocument[]>([
    {
      id: 'doc-1',
      title: 'Historical Philological Records Core Node',
      content: '<h1>System Core Record Alpha Blueprint</h1><p>Historical script monitoring arrays trace continuous lexical parameters across geographic paths.</p>',
      wordCount: 12,
      charCount: 110,
      pages: 1,
      updatedAt: new Date().toLocaleDateString(),
      bannerUrl: null,
      bannerPosition: 50
    }
  ]);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');

  useEffect(() => { 
    setIsMounted(true); 
    // Load user session from local storage if exists
    const savedUser = localStorage.getItem('d-auth-user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleCreateNewDoc = () => {
    const newDoc: SavedDocument = {
      id: `doc-${Date.now()}`,
      title: `Untitled Inscription Vector #${documents.length + 1}`,
      content: '',
      wordCount: 0,
      charCount: 0,
      pages: 0,
      updatedAt: new Date().toLocaleDateString(),
      bannerUrl: null,
      bannerPosition: 50
    };
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    setCurrentView('editor');
  };

  // --- ACCOUNT LOGIC ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.username || !authForm.email) return;

    const newUser = { username: authForm.username, email: authForm.email, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('d-auth-user', JSON.stringify(newUser));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('d-auth-user');
  };

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  const activeDocument = documents.find(d => d.id === selectedDocId) || documents[0];

  if (currentView === 'hub') {
    return (
      <div 
        className="min-h-screen text-[#F4EBE1] font-serif transition-all duration-500 bg-cover bg-center bg-no-repeat relative"
        style={{ 
          backgroundImage: `url('/dashboard-bg.jpeg')` 
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-0 pointer-events-none" />

        <div className="relative z-10">
          {/* Top Navbar for Account */}
          <div className="absolute top-8 right-8 md:right-12 z-50">
            {user ? (
              <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <div className="flex flex-col items-end font-mono">
                  <span className="text-[10px] text-white font-bold">{user.username}</span>
                  <span className="text-[8px] text-gray-500">{user.email}</span>
                </div>
                <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-red-950/40 text-red-400 border border-red-900/30 text-[10px] hover:bg-red-900 hover:text-white transition-all cursor-pointer">⏻</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-mono tracking-widest uppercase hover:bg-white/10 transition-all cursor-pointer"
              >
                Access Account
              </button>
            )}
          </div>

          {/* AUTH MODAL */}
          {showAuthModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl font-mono animate-scaleUp">
                <h2 className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-6">{authForm.isSignUp ? 'Establish Identity' : 'Resume Session'}</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <input type="text" placeholder="Alias Name" required value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-900" />
                  <input type="email" placeholder="Email Index" required value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-900" />
                  <button type="submit" className="w-full bg-red-950/40 border border-red-800 text-red-400 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all">Synchronize</button>
                </form>
                <button onClick={() => setAuthForm({...authForm, isSignUp: !authForm.isSignUp})} className="w-full text-center mt-6 text-[9px] text-gray-500 uppercase tracking-widest hover:text-white">{authForm.isSignUp ? 'Already Indexed? Login' : 'New Identity? Create Account'}</button>
                <button onClick={() => setShowAuthModal(false)} className="w-full text-center mt-2 text-[9px] text-gray-700 uppercase hover:text-red-400">Abort</button>
              </div>
            </div>
          )}

          <div className="stone-banner-header relative h-[320px] w-full flex flex-col justify-end p-6 md:p-12 border-b border-white/[0.03] bg-gradient-to-b from-black/40 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-6xl w-full mx-auto relative z-20">
              <span className="text-red-500 text-[11px] font-black tracking-[0.5em] uppercase block mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Welcome to
              </span>
              <h1 className="text-6xl md:text-8xl font-serif tracking-tighter text-white font-bold leading-none mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                dர்avidian.
              </h1>
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-6 md:px-12 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div onClick={() => activeDocument ? setCurrentView('editor') : handleCreateNewDoc()} className="border border-white/[0.06] bg-black/75 p-8 rounded-2xl min-h-[220px] flex flex-col justify-between group hover:border-red-900/40 hover:bg-black/90 cursor-pointer transition-all duration-300 relative shadow-2xl hover:-translate-y-1 backdrop-blur-md">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-red-400 block mb-1 font-bold">MODULE // 01</span>
                  <h4 className="text-2xl font-serif italic text-gray-200 group-hover:text-white transition-colors">Workspace Slate</h4>
                </div>
                <p className="text-xs text-gray-400 font-mono tracking-wide mt-6 border-t border-white/[0.04] pt-3 line-clamp-1">Active Array: "{activeDocument?.title || "None"}"</p>
              </div>

              <div onClick={() => setCurrentView('inscriptions')} className="border border-white/[0.06] bg-black/75 p-8 rounded-2xl min-h-[220px] flex flex-col justify-between group hover:border-blue-900/40 hover:bg-black/90 cursor-pointer transition-all duration-300 relative shadow-2xl hover:-translate-y-1 backdrop-blur-md">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-blue-400 block mb-1 font-bold">DATASET // 02</span>
                  <h4 className="text-2xl font-serif italic text-gray-200 group-hover:text-white transition-colors">Inscriptions</h4>
                </div>
                <p className="text-xs text-gray-400 font-mono tracking-wide mt-6 border-t border-white/[0.04] pt-3">Review vault index grids containing <strong className="text-blue-300 font-bold">{documents.length} secure sheets</strong>.</p>
              </div>

              <div onClick={() => setCurrentView('epigraphy')} className="border border-white/[0.06] bg-black/75 p-8 rounded-2xl min-h-[220px] flex flex-col justify-between group hover:border-emerald-900/40 hover:bg-black/90 cursor-pointer transition-all duration-300 relative shadow-2xl hover:-translate-y-1 backdrop-blur-md">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 block mb-1 font-bold">SYSTEM // 03</span>
                  <h4 className="text-2xl font-serif italic text-gray-200 group-hover:text-white transition-colors">Universal Library</h4>
                </div>
                <p className="text-xs text-gray-400 font-mono tracking-wide mt-6 border-t border-white/[0.04] pt-3">OceanofPDF-style universal e-book search across multiple genres and timelines.</p>
              </div>
            </div>
          </main>
        </div>
        <div className="fixed bottom-6 right-6 z-50">
  <div className="bg-black/90 border border-white/[0.08] px-4 py-2 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.5)] text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-gray-300 flex items-center gap-2 backdrop-blur-md">
    <span>Created By Ishita GS</span>
    <span className="text-white">©</span>
    <span>All Rights Reserved</span>
  </div>
</div>
      </div>
    );
  }

  if (currentView === 'editor') {
    return (
      <CentralWorkspace 
        activeDoc={activeDocument} 
        onSave={(id, updates) => setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))} 
        onBackToHub={() => setCurrentView('hub')} 
      />
    );
  }
  
  if (currentView === 'inscriptions') {
    return (
      <InscriptionsWorkspace 
        documents={documents} 
        onCreateNew={handleCreateNewDoc} 
        onSelectDoc={(id) => { setSelectedDocId(id); setCurrentView('editor'); }} 
        onDeleteDoc={(id) => setDocuments(prev => prev.filter(d => d.id !== id))} 
        onBackToHub={() => setCurrentView('hub')} 
      />
    );
  }

  return <EpigraphyMatrixWorkspace onBackToHub={() => setCurrentView('hub')} />;
}