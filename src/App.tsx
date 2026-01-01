import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Category, SectionName, Selections, HelpData, AppData, Theme, MultiFormatPrompts } from './types';
import { generateNewPromptValues } from './services/geminiService';

// --- MOCK DATA ---
const MOCK_DATA: AppData = {
  CHARACTER: [
    { name: 'Art Style', values: ['Studio Ghibli', 'Cyberpunk Dystopia', 'Art Nouveau', 'Impressionistic'], src: { sheet: 'CHARACTER', col: 2, rowStart: 2 } },
    { name: 'Hair Style', values: ['Long Wavy Hair', 'Silver Pixie Cut', 'Braided Crown', 'Fiery Mohawk'], src: { sheet: 'CHARACTER', col: 2, rowStart: 6 } },
    { name: 'Eye Color', values: ['Emerald Green', 'Sapphire Blue', 'Molten Gold', 'Heterochromia'], src: { sheet: 'CHARACTER', col: 2, rowStart: 10 } },
  ],
  SCENE: [
    { name: 'Setting', values: ['Floating Islands', 'Ancient Library', 'Neon-lit Megacity', 'Enchanted Forest'], src: { sheet: 'SCENE', col: 2, rowStart: 2 } },
    { name: 'Time of Day', values: ['Golden Hour', 'Blue Hour', 'Midnight', 'Dawn'], src: { sheet: 'SCENE', col: 2, rowStart: 6 } },
    { name: 'Weather', values: ['Gentle Rain', 'Rolling Fog', 'Auroral Display', 'Meteor Shower'], src: { sheet: 'SCENE', col: 2, rowStart: 10 } },
  ],
  CAMERA: [
    { name: 'Shot Type', values: ['Extreme Close-Up', 'Medium Shot', 'Long Shot', 'Dutch Angle'], src: { sheet: 'CAMERA', col: 2, rowStart: 2 } },
    { name: 'Lens', values: ['85mm f/1.4', '24mm Wide Angle', 'Macro Lens', 'Fisheye Lens'], src: { sheet: 'CAMERA', col: 2, rowStart: 6 } },
    { name: 'Lighting', values: ['Rim Lighting', 'Chiaroscuro', 'Volumetric Lighting', 'Neon Glow'], src: { sheet: 'CAMERA', col: 2, rowStart: 10 } },
  ],
};

const MOCK_HELP: HelpData = {
  CHARACTER: { 'art style': 'The overall visual style of the character.', 'hair style': 'The character\'s hairstyle.', 'eye color': 'The color of the character\'s eyes.' },
  SCENE: { 'setting': 'The location or environment of the scene.', 'time of day': 'The time of day, affecting light and mood.', 'weather': 'The weather conditions in the scene.' },
  CAMERA: { 'shot type': 'The camera framing for the subject.', 'lens': 'The type of camera lens used.', 'lighting': 'The lighting setup for the scene.' },
};

// --- THEMES ---
const THEMES: Theme[] = [
    { name: 'Neon', className: 'theme-neon', properties: { '--bg-primary': '#0a0e27', '--bg-secondary': '#1a1f3a', '--bg-tertiary': '#2a2f4a', '--text-primary': '#ffffff', '--text-secondary': '#a0aec0', '--accent-1': '#00f5ff', '--accent-2': '#ff00ff', '--accent-3': '#ff6b6b', '--accent-4': '#4ade80' } },
    { name: 'Dark', className: 'theme-dark', properties: { '--bg-primary': '#0f172a', '--bg-secondary': '#1e293b', '--bg-tertiary': '#334155', '--text-primary': '#e5e7eb', '--text-secondary': '#9ca3af', '--accent-1': '#3b82f6', '--accent-2': '#8b5cf6', '--accent-3': '#ec4899', '--accent-4': '#10b981' } },
    { name: 'Pastel', className: 'theme-pastel', properties: { '--bg-primary': '#fef3e2', '--bg-secondary': '#fff5ee', '--bg-tertiary': '#f8d7da', '--text-primary': '#5a4a42', '--text-secondary': '#8a7a72', '--accent-1': '#b4a7d6', '--accent-2': '#d6a7c7', '--accent-3': '#f4c2c2', '--accent-4': '#b8e0d2' } },
    { name: 'Ocean', className: 'theme-ocean', properties: { '--bg-primary': '#0c1e3e', '--bg-secondary': '#1a2f5e', '--bg-tertiary': '#2a4f7e', '--text-primary': '#e0f2fe', '--text-secondary': '#7dd3fc', '--accent-1': '#06b6d4', '--accent-2': '#3b82f6', '--accent-3': '#8b5cf6', '--accent-4': '#10b981' } },
    { name: 'Sunset', className: 'theme-sunset', properties: { '--bg-primary': '#2d1b1e', '--bg-secondary': '#4d2b2e', '--bg-tertiary': '#6d3b3e', '--text-primary': '#ffe4e1', '--text-secondary': '#ffb4a2', '--accent-1': '#ff6b6b', '--accent-2': '#ff8787', '--accent-3': '#ffa07a', '--accent-4': '#ffb347' } },
    { name: 'Forest', className: 'theme-forest', properties: { '--bg-primary': '#1a2e1a', '--bg-secondary': '#2a3e2a', '--bg-tertiary': '#3a4e3a', '--text-primary': '#e8f5e9', '--text-secondary': '#a5d6a7', '--accent-1': '#4caf50', '--accent-2': '#66bb6a', '--accent-3': '#81c784', '--accent-4': '#9ccc65' } },
    { name: 'Candy', className: 'theme-candy', properties: { '--bg-primary': '#fff0f5', '--bg-secondary': '#ffe4e9', '--bg-tertiary': '#ffd8e3', '--text-primary': '#4a0e4e', '--text-secondary': '#8b008b', '--accent-1': '#ff69b4', '--accent-2': '#ff1493', '--accent-3': '#ff6ec7', '--accent-4': '#ff85d1' } },
];

// --- CUSTOM HOOKS ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const useSounds = (enabled: boolean) => {
    const play = useCallback((type: 'click' | 'success' | 'error' | 'tab' | 'generate') => {
        if (!enabled) return;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if(!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const configs = {
          click: { freq: 800, duration: 50 },
          success: { freq: 1000, duration: 100 },
          error: { freq: 400, duration: 150 },
          tab: { freq: 600, duration: 40 },
          generate: { freq: 1200, duration: 80 }
        };

        const config = configs[type] || configs.click;
        oscillator.frequency.value = config.freq;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration / 1000);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + config.duration / 1000);
    }, [enabled]);

    return { play };
};


// --- HELPER COMPONENTS ---
const Tooltip: React.FC = () => (
    <div id="tooltip" className="fixed z-50 hidden px-3 py-2 text-sm font-medium text-[color:var(--text-primary)] bg-[color:var(--bg-primary)] rounded-lg shadow-sm opacity-0 transition-opacity duration-300 border-2 border-[color:var(--accent-2)]">
        Tooltip content
    </div>
);

const Confetti: React.FC<{show: boolean}> = ({ show }) => {
    if (!show) return null;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
            {Array.from({ length: 50 }).map((_, i) => (
                <div
                    key={i}
                    className="confetti"
                    style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        animationDuration: `${Math.random() * 2 + 2}s`,
                        animationDelay: `${Math.random() * 0.5}s`,
                    }}
                />
            ))}
        </div>
    );
};


// --- MODAL COMPONENTS ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] animate-fade-in" onClick={onClose}>
            <div className="bg-[color:var(--bg-secondary)] border-2 border-[color:var(--accent-2)] rounded-2xl shadow-lg w-full max-w-lg p-6 animate-bounce-in relative" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-center mb-6 text-[color:var(--text-primary)]">{title}</h2>
                {children}
                <button onClick={onClose} className="absolute top-4 right-4 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};


// --- APP COMPONENT ---
export default function App() {
  const [appData, setAppData] = useState<AppData>(MOCK_DATA);
  const [helpData] = useState<HelpData>(MOCK_HELP);
  const [activeSection, setActiveSection] = useState<SectionName>('CHARACTER');
  
  const [selections, setSelections] = useLocalStorage<Selections>('ai-art-prompt-selections', { character: {}, scene: {}, camera: {} });
  const [theme, setTheme] = useLocalStorage<Theme>('ai-art-prompt-theme', THEMES[0]);
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('ai-art-prompt-sound', true);
  
  const { play: playSound } = useSounds(soundEnabled);
  
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('Ready to create amazing art! 🎨✨');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isThemeModalOpen, setThemeModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isMultiFormatModalOpen, setMultiFormatModalOpen] = useState(false);
  const [multiFormatPrompts, setMultiFormatPrompts] = useState<MultiFormatPrompts | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    Object.entries(theme.properties).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);
  
  const selectionCount = useMemo(() => {
    return Object.values(selections).reduce((acc: number, section: Record<string, string>) => 
      acc + Object.values(section).filter(Boolean).length, 0
    );
  }, [selections]);

  const handleSelectionChange = (section: SectionName, category: string, value: string) => {
    playSound('click');
    setSelections(prev => ({
      ...prev,
      [section.toLowerCase()]: {
        ...prev[section.toLowerCase() as keyof Selections],
        [category]: value,
      },
    }));
  };

  const generatePrompt = useCallback(() => {
    playSound('generate');
    setIsLoading(true);
    setStatus('Generating your amazing prompt... ⚡');

    setTimeout(() => {
      const parts: string[] = [];
      Object.values(selections.character).filter(Boolean).forEach((v: string) => parts.push(v));
      Object.values(selections.scene).filter(Boolean).forEach((v: string) => parts.push(v));
      Object.values(selections.camera).filter(Boolean).forEach((v: string) => parts.push(v));

      if (parts.length === 0) {
        setPrompt('✨ Please make some selections first to generate your prompt! 🎨');
        setStatus('Please make selections first! ⚠️');
      } else {
        const generated = parts.join(', ');
        setPrompt(generated);
        setStatus('Prompt generated successfully! 🎉');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setIsLoading(false);
    }, 500);
  }, [selections, playSound]);

  const generateMultiFormatPrompts = useCallback(() => {
    const parts: string[] = [];
    Object.values(selections.character).filter(Boolean).forEach((v: string) => parts.push(v));
    Object.values(selections.scene).filter(Boolean).forEach((v: string) => parts.push(v));
    Object.values(selections.camera).filter(Boolean).forEach((v: string) => parts.push(v));

    if (parts.length === 0) {
        setStatus('Please make selections first! ⚠️');
        return;
    }

    const formats: MultiFormatPrompts = {
      narrative: `In this captivating scene, we witness ${parts.slice(0, 3).join(' featuring ')}. The composition reveals ${parts.slice(3, 6).join(' with ')}. ${parts.slice(6).join(', creating ')} brings this vision to life.`,
      technical: ['👤 CHARACTER:', ...Object.entries(selections.character).filter(([,v]) => v).map(([k, v]) => `  • ${k}: ${v}`), '', '🎬 SCENE:', ...Object.entries(selections.scene).filter(([,v]) => v).map(([k, v]) => `  • ${k}: ${v}`), '', '📸 CAMERA:', ...Object.entries(selections.camera).filter(([,v]) => v).map(([k, v]) => `  • ${k}: ${v}`)].join('\n'),
      poetic: `A vision unfolds...\n\n${parts.slice(0, 2).join(' dancing with ')},\n${parts.slice(2, 4).join(' embracing ')},\n${parts.slice(4, 6).join(' whispering ')},\n${parts.slice(6).join(' illuminating ')}\n\n...captured in timeless beauty.`,
      bulletPoint: `🎨 AI ART PROMPT - QUICK REFERENCE\n\n📊 Summary: ${Object.values(selections.character).filter(Boolean).length} character, ${Object.values(selections.scene).filter(Boolean).length} scene, ${Object.values(selections.camera).filter(Boolean).length} camera elements\n\n📋 Full Prompt Elements:\n${parts.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}`,
    };
    
    setMultiFormatPrompts(formats);
    setMultiFormatModalOpen(true);
  }, [selections]);

  const clearAllSelections = () => {
    if (window.confirm('🗑️ Are you sure you want to clear ALL selections across all sections?')) {
        playSound('click');
        setSelections({ character: {}, scene: {}, camera: {} });
        setPrompt('');
        setStatus('All selections cleared! 🗑️✅');
    }
  };
  
  const handleImport = async (targetSheet: SectionName) => {
    playSound('click');
    setIsLoading(true);
    setStatus(`Importing new data for ${targetSheet}... 📥`);

    const newValues = await generateNewPromptValues(targetSheet);
    
    setAppData(prevData => {
        const targetSectionData = prevData[targetSheet];
        const updatedSectionData = [...targetSectionData];
        let newRowsAdded = 0;
        let duplicatesSkipped = 0;

        // For simplicity, let's add the new values to the first category of the section.
        if (updatedSectionData.length > 0) {
            const firstCategory = updatedSectionData[0];
            const existingValues = new Set(firstCategory.values.map(v => v.toLowerCase()));
            const uniqueNewValues: string[] = [];
            
            newValues.forEach(val => {
                if (!existingValues.has(val.toLowerCase())) {
                    uniqueNewValues.push(val);
                    newRowsAdded++;
                } else {
                    duplicatesSkipped++;
                }
            });

            firstCategory.values.push(...uniqueNewValues);
        }
        
        setStatus(`Import complete! Added ${newRowsAdded} new entries, skipped ${duplicatesSkipped} duplicates 🎉`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        return { ...prevData, [targetSheet]: updatedSectionData };
    });

    setIsLoading(false);
    setImportModalOpen(false);
  };
  
  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    playSound('success');
    setStatus(`${type} copied to clipboard! 📋✅`);
  };

  const currentCategories: Category[] = appData[activeSection] || [];
  const currentHelp = helpData[activeSection] || {};
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const showTooltip = (e: React.MouseEvent, text: string) => {
    if (tooltipRef.current) {
        tooltipRef.current.innerHTML = text;
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = `${e.clientX + 15}px`;
        tooltipRef.current.style.top = `${e.clientY + 15}px`;
        setTimeout(() => {
          if (tooltipRef.current) tooltipRef.current.style.opacity = '1';
        }, 10);
    }
  };

  const hideTooltip = () => {
      if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
          setTimeout(() => {
              if (tooltipRef.current) tooltipRef.current.style.display = 'none';
          }, 300);
      }
  };

  return (
    <div className="bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] min-h-screen p-2 sm:p-5 transition-colors duration-500">
      <Confetti show={showConfetti} />
      <div ref={tooltipRef} className="fixed z-50 px-3 py-2 text-sm font-medium text-[color:var(--text-primary)] bg-[color:var(--bg-primary)] rounded-lg shadow-sm opacity-0 transition-opacity duration-300 border-2 border-[color:var(--accent-2)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto bg-[color:var(--bg-secondary)] border-2 border-[color:var(--accent-2)] rounded-3xl p-4 sm:p-6 shadow-2xl shadow-[color:var(--accent-3)]/20 animate-bounce-in">
        {/* Header */}
        <header className="p-4 bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-3)] animate-rainbow-gradient rounded-2xl mb-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black text-white drop-shadow-lg animate-float">🎨 AI Prompt Builder v5.0 ✨</h1>
          <div className="flex flex-wrap gap-2 justify-center">
             <button onClick={() => { playSound('click'); setThemeModalOpen(true); }} className="px-4 py-2 text-sm font-bold text-white bg-[color:var(--accent-4)] rounded-full hover:scale-105 transition-transform">🎨 Themes</button>
             <button onClick={() => { playSound('click'); setImportModalOpen(true); }} className="px-4 py-2 text-sm font-bold text-white bg-green-500 rounded-full hover:scale-105 transition-transform">📥 Import</button>
             <button onClick={clearAllSelections} className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-full hover:scale-105 transition-transform">🗑️ Clear All</button>
          </div>
        </header>

        {/* Status Bar */}
        <div className="px-5 py-3 bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-3)] animate-rainbow-gradient rounded-xl mb-5 font-semibold text-white shadow-md flex items-center gap-3">
          {isLoading && <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
          <span>{status}</span>
        </div>

        {/* Main Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Panel: Selections */}
            <section className="bg-[color:var(--bg-tertiary)] border-2 border-[color:var(--accent-2)] rounded-2xl p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                    {(['CHARACTER', 'SCENE', 'CAMERA'] as SectionName[]).map(sec => (
                        <button key={sec} onClick={() => { playSound('tab'); setActiveSection(sec); }} className={`px-4 py-2 text-sm font-bold rounded-full border-2 transition-all ${activeSection === sec ? 'bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-2)] text-white border-transparent scale-105' : 'bg-[color:var(--bg-secondary)] border-[color:var(--accent-2)] text-[color:var(--accent-2)] hover:bg-[color:var(--bg-tertiary)]'}`}>
                            {sec.charAt(0) + sec.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                    {currentCategories.map(cat => (
                        <div key={cat.name} className="p-3 bg-[color:var(--bg-secondary)] border-2 border-[color:var(--accent-2)] rounded-lg grid grid-cols-[1fr,auto] gap-2 items-center">
                            <label className="font-semibold text-sm text-[color:var(--accent-4)] flex items-center gap-2">
                                {cat.name}
                                <span className="cursor-help" onMouseEnter={(e) => showTooltip(e, `Source: ${cat.src.sheet}`)} onMouseLeave={hideTooltip}>ℹ️</span>
                                <span className="cursor-help" onMouseEnter={(e) => showTooltip(e, currentHelp[cat.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()] || 'No help available.')} onMouseLeave={hideTooltip}>?</span>
                            </label>
                            <select value={selections[activeSection.toLowerCase() as keyof Selections][cat.name] || ''} onChange={e => handleSelectionChange(activeSection, cat.name, e.target.value)} className="w-full bg-[color:var(--bg-primary)] border-2 border-[color:var(--accent-2)] text-[color:var(--text-primary)] p-2 rounded-md text-sm">
                                <option value="">-- Select --</option>
                                {cat.values.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Right Panel: Prompt */}
            <section className="bg-[color:var(--bg-tertiary)] border-2 border-[color:var(--accent-2)] rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-3)] animate-rainbow-gradient rounded-lg text-white font-bold">
                    <h2>✨ Generated Prompt</h2>
                    <span className="px-3 py-1 bg-black/20 rounded-full text-sm">Selections: {selectionCount}</span>
                </div>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="✨ Select creative options and click Generate!" className="w-full flex-grow bg-[color:var(--bg-primary)] border-2 border-[color:var(--accent-2)] rounded-lg p-3 text-sm font-mono resize-none"></textarea>
                <div className="flex flex-wrap gap-2 justify-end">
                    <button onClick={generatePrompt} className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-2)] rounded-full hover:scale-105 transition-transform">⚡ Generate</button>
                    <button onClick={generateMultiFormatPrompts} className="px-5 py-2 text-sm font-bold text-white bg-purple-600 rounded-full hover:scale-105 transition-transform">📜 Multi-Format</button>
                    <button onClick={() => handleCopyToClipboard(prompt, 'Prompt')} className="px-5 py-2 text-sm font-bold text-[color:var(--text-primary)] bg-[color:var(--bg-secondary)] rounded-full hover:scale-105 transition-transform">📋 Copy</button>
                </div>
            </section>
        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={isThemeModalOpen} onClose={() => setThemeModalOpen(false)} title="🎨 Choose Your Theme">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
            {THEMES.map(t => (
                <button key={t.name} onClick={() => { playSound('click'); setTheme(t); }} className={`p-4 rounded-lg font-bold border-2 ${theme.name === t.name ? 'border-[color:var(--accent-4)] scale-105' : 'border-transparent'}`} style={{background: t.properties['--bg-primary'], color: t.properties['--text-primary']}}>
                    {t.name}
                </button>
            ))}
        </div>
        <div onClick={() => { playSound('click'); setSoundEnabled(s => !s); }} className="mt-4 p-3 bg-[color:var(--bg-tertiary)] rounded-lg flex justify-between items-center cursor-pointer">
            <span className="font-semibold">🔊 Sound Effects</span>
            <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${soundEnabled ? 'bg-[color:var(--accent-4)] justify-end' : 'bg-gray-500 justify-start'}`}>
                <div className="w-5 h-5 bg-white rounded-full m-0.5"></div>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isImportModalOpen} onClose={() => setImportModalOpen(false)} title="📥 Import AI Data">
          <div className="p-4 bg-[color:var(--bg-tertiary)] rounded-lg my-4 text-sm text-[color:var(--text-secondary)]">
              <h4 className="font-bold text-base text-[color:var(--accent-4)] mb-2">📋 How it works:</h4>
              <p>This feature uses the Gemini API to generate new, creative options and add them to your lists!</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Select which section to add ideas to.</li>
                  <li>Click Import to call the AI.</li>
                  <li>The dashboard updates instantly with new values!</li>
              </ul>
          </div>
          <div className="flex flex-col gap-4 items-center">
              <select id="import-target-select" defaultValue="" className="w-full bg-[color:var(--bg-primary)] border-2 border-[color:var(--accent-2)] text-[color:var(--text-primary)] p-2 rounded-md text-sm">
                  <option value="" disabled>-- Choose Destination --</option>
                  <option value="CHARACTER">👤 Character</option>
                  <option value="SCENE">🎬 Scene</option>
                  <option value="CAMERA">📸 Camera</option>
              </select>
              <button onClick={() => {
                  const select = document.getElementById('import-target-select') as HTMLSelectElement;
                  if (select.value) {
                      handleImport(select.value as SectionName);
                  } else {
                      alert('Please select a destination first.');
                  }
              }} className="px-5 py-2 w-full text-sm font-bold text-white bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-2)] rounded-full hover:scale-105 transition-transform">🚀 Start Import</button>
          </div>
      </Modal>
      
      <Modal isOpen={isMultiFormatModalOpen} onClose={() => setMultiFormatModalOpen(false)} title="📜 Multi-Format Prompts">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
          {multiFormatPrompts && (Object.entries(multiFormatPrompts) as [keyof MultiFormatPrompts, string][]).map(([key, value]) => {
            return (
              <div key={key} className="p-3 bg-[color:var(--bg-tertiary)] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold capitalize text-[color:var(--accent-4)]">{key}</h3>
                  <button onClick={() => handleCopyToClipboard(value, `${key} prompt`)} className="px-3 py-1 text-xs font-bold text-[color:var(--text-primary)] bg-[color:var(--bg-secondary)] rounded-full hover:scale-105 transition-transform">📋 Copy</button>
                </div>
                <textarea readOnly value={value} className="w-full h-32 bg-[color:var(--bg-primary)] border-2 border-[color:var(--accent-2)] rounded-md p-2 text-xs font-mono resize-y"></textarea>
              </div>
            );
          })}
        </div>
      </Modal>

    </div>
  );
}