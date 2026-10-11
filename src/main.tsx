import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDownToLine, ArrowRight, Check, ChevronLeft, ChevronRight, ImagePlus, Sparkles } from 'lucide-react';
import '@fontsource/amiri/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './style.css';
import { loadFonts, paginate, sample, templates } from './renderer';
import { drawStory, loadStoryAssets } from './art';
import type { StoryPage, Template } from './renderer';

function Story({ template, page, index, count, phone, portrait, thumbnail = false }: {template: Template; page: StoryPage; index: number; count: number; phone: boolean; portrait?: HTMLImageElement; thumbnail?: boolean}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) drawStory(ref.current, template, page, index, count, phone, portrait); }, [template, page, index, count, phone, portrait]);
  return <canvas ref={ref} className={thumbnail ? 'thumbnail' : 'story'} aria-label={`${template.name}, story ${index + 1} of ${count}`} role="img" />;
}
function App() {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(18);
  const [ready, setReady] = useState(false);
  const [phone, setPhone] = useState(true);
  const [portrait, setPortrait] = useState<HTMLImageElement>();
  const [showPortrait, setShowPortrait] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([loadFonts(), loadStoryAssets()]).then(() => setReady(true)).catch(() => setError('Fonts could not load. Please refresh and try again.')); const image = new Image(); image.onload = () => setPortrait(image); image.src = `${import.meta.env.BASE_URL}assets/teacher-portrait.jpg`; }, []);
  const pages = useMemo(() => ready ? paginate(text.trim() || sample) : [], [ready, text]);
  const thumbnailPage = useMemo(() => ready ? paginate(sample)[0] : undefined, [ready]);
  const current = Math.min(pageIndex, pages.length - 1);
  const activePortrait = showPortrait ? portrait : undefined;
  async function download() {
    if (!ready || !text.trim()) return;
    setDownloading(true); setError('');
    try {
      await loadFonts();
      for (let i = 0; i < pages.length; i++) {
        // Export the actual displayed bitmap for the visible page. This also avoids
        // browser rasterization rounding on fine decorative strokes when redrawn.
        const visible = i === current ? document.querySelector<HTMLCanvasElement>('canvas.story') : null;
        const canvas = visible ?? document.createElement('canvas');
        if (!visible) drawStory(canvas, templates[selected], pages[i], i, pages.length, phone, activePortrait);
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('PNG export failed')), 'image/png'));
        const url = URL.createObjectURL(blob); const link = document.createElement('a');
        link.href = url; link.download = `Timaa-Al-Ghoul-${templates[selected].id}${pages.length > 1 ? `-${i + 1}` : ''}.png`;
        document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
      }
    } catch { setError('Could not download the image. Please try again.'); }
    finally { setDownloading(false); }
  }
  function choosePortrait(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file); const image = new Image();
    image.onload = () => { setPortrait(image); setShowPortrait(true); URL.revokeObjectURL(url); setError(''); };
    image.onerror = () => { URL.revokeObjectURL(url); setError('Please choose a supported JPG, PNG, or WebP photograph.'); };
    image.src = url;
  }
  return <div className="app-shell">
    <header className="flex items-center justify-between"><a className="brand" href="./"><span className="monogram">T<span>AG</span></span><span>Timaa Al Ghoul<small>MATHEMATICS TEACHER</small></span></a><span className="studio-tag"><span /> FEEDBACK STUDIO</span></header>
    <main>
      <div className="intro"><div className="eyebrow"><Sparkles size={14} /> A LITTLE APPRECIATION. BEAUTIFULLY SHARED.</div><h1>Kind words. <em>Beautiful stories.</em></h1><p>Turn meaningful feedback into something worth sharing.</p></div>
      <div className="workspace">
        <section className="editor">
          <div className="section-title"><span className="step">01</span><h2>Paste your feedback</h2><span className="hint">Arabic or English</span></div>
          <textarea aria-label="Feedback" dir="auto" value={text} onChange={e => { setText(e.target.value); setPageIndex(0); }} placeholder={'الصقي كلماتهم الجميلة هنا…\nPaste their kind words here…'} />
          <div className="textarea-footer"><button className="text-button" onClick={() => { setText(sample); setPageIndex(0); }}>Try an example <ArrowRight size={13}/></button><span>{text.length.toLocaleString()} characters</span></div>
          <div className="section-title templates-title"><span className="step">02</span><h2>Choose a feeling</h2><span className="hint">{templates.length} curated designs</span></div>
          <div className="template-grid">{templates.map((template, i) => <button key={template.id} className={`template-option ${selected === i ? 'selected' : ''}`} onClick={() => { setSelected(i); setPageIndex(0); }} aria-pressed={selected === i} aria-label={template.name}>
            <div className="mini-card" style={{background: template.bg}}>{thumbnailPage && <Story template={template} page={thumbnailPage} index={0} count={1} phone={phone} portrait={activePortrait} thumbnail/>}{selected === i && <span className="selected-badge"><Check size={11}/></span>}</div><strong>{template.name}</strong><span>{template.mood}</span>
          </button>)}</div>
          <div className="options"><label><input type="checkbox" checked={phone} onChange={e => setPhone(e.target.checked)}/> Include phone number</label>{portrait ? <label><input type="checkbox" checked={showPortrait} onChange={e => setShowPortrait(e.target.checked)}/> Include portrait</label> : <label className="portrait-upload"><ImagePlus size={15}/> Add teacher portrait<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => choosePortrait(e.target.files?.[0])}/></label>}</div>
          <button className="download-button" onClick={download} disabled={!ready || !text.trim() || downloading}><ArrowDownToLine size={18}/>{downloading ? 'Preparing your stories…' : pages.length > 1 ? `Download ${pages.length} PNG images` : 'Download PNG'}<ArrowRight size={17}/></button>
          <div className="export-note">1080 × 1920 px <span>·</span> Full-quality PNG <span>·</span> Ready for Instagram</div>
          {pages.length > 1 && <p className="pagination-note">Your feedback continues across {pages.length} Stories. All text is included. Your browser may ask to allow multiple downloads.</p>}
          {error && <p role="alert" className="error">{error}</p>}
        </section>
        <section className="preview-panel"><div className="preview-heading"><span className="eyebrow">YOUR STORY</span><span className="live-tag"><span/> Live preview</span></div><div className="preview-frame">{ready && pages[current] ? <Story template={templates[selected]} page={pages[current]} index={current} count={pages.length} phone={phone} portrait={activePortrait}/> : <div className="loading">Preparing your canvas…</div>}</div>
          <div className="preview-caption"><span>{templates[selected].name}</span><span>9:16 / INSTAGRAM STORY</span></div>
          {pages.length > 1 && <nav className="page-controls" aria-label="Story pages"><button aria-label="Previous story" disabled={current === 0} onClick={() => setPageIndex(current - 1)}><ChevronLeft size={18}/></button><span>Story {current + 1} of {pages.length}</span><button aria-label="Next story" disabled={current === pages.length - 1} onClick={() => setPageIndex(current + 1)}><ChevronRight size={18}/></button></nav>}
          {!text.trim() && <p className="sample-note">An example, until you add your own words.</p>}
        </section>
      </div>
    </main><footer><span>Made for Timaa. Inspired by her students.</span><span>Your words stay on your device.</span></footer>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
