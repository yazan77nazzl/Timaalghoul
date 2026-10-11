import type { StoryPage, Template } from './renderer';
import { drawPremium, loadPremiumAssets } from './premium';

type Context = CanvasRenderingContext2D;
let studyBackground: HTMLImageElement | undefined;
export async function loadStoryAssets() {
  const image = new Image();
  await new Promise<void>(resolve => {
    image.onload = () => { studyBackground = image; resolve(); };
    image.onerror = () => resolve();
    image.src = `${import.meta.env.BASE_URL}assets/golden-study-background.png`;
  });
  await loadPremiumAssets();
}
function rect(c: Context, x: number, y: number, w: number, h: number, color: string, radius = 0) { c.fillStyle = color; c.beginPath(); c.roundRect(x, y, w, h, radius); c.fill(); }
function stroke(c: Context, x: number, y: number, w: number, h: number, color: string, radius = 0) { c.strokeStyle = color; c.lineWidth = 2; c.beginPath(); c.roundRect(x, y, w, h, radius); c.stroke(); }
function rule(c: Context, x: number, y: number, x2: number, y2: number, color: string) { c.strokeStyle = color; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke(); }
function type(c: Context, text: string, x: number, y: number, size: number, color: string, serif = true, align: CanvasTextAlign = 'center', spaced = false) { c.direction = 'ltr'; c.textAlign = align; c.textBaseline = 'alphabetic'; c.fillStyle = color; c.font = `500 ${size}px ${serif ? '"Cormorant Garamond"' : '"DM Sans"'}`; c.letterSpacing = spaced ? '4px' : '0px'; c.fillText(text, x, y); c.letterSpacing = '0px'; }
function gold(c: Context, x: number, y: number, w: number, h: number) { const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#a57939'); g.addColorStop(.35, '#f5dfac'); g.addColorStop(.65, '#c5a66a'); g.addColorStop(1, '#8c642d'); return g; }
function star(c: Context, x: number, y: number, r: number, color: string) { c.fillStyle = color; c.beginPath(); c.moveTo(x, y-r); c.quadraticCurveTo(x+r*.17,y-r*.17,x+r,y); c.quadraticCurveTo(x+r*.17,y+r*.17,x,y+r); c.quadraticCurveTo(x-r*.17,y+r*.17,x-r,y); c.quadraticCurveTo(x-r*.17,y-r*.17,x,y-r); c.fill(); }
function leaf(c: Context, x: number, y: number, size: number, color: string, rotation = 0) { c.save(); c.translate(x,y); c.rotate(rotation); c.strokeStyle = color; c.lineWidth = 2; c.beginPath(); c.moveTo(0,0); c.bezierCurveTo(-size*.7,-size*.5,-size*.3,-size,0,-size); c.bezierCurveTo(size*.5,-size*.6,size*.4,-size*.3,0,0); c.stroke(); rule(c,0,0,0,-size,color); c.restore(); }
function botanical(c: Context, x: number, y: number, color: string, flip = false) { c.save(); c.translate(x,y); if(flip)c.scale(-1,1); rule(c,0,0,110,-420,color); for(let i=0;i<6;i++){leaf(c,i*18,-i*68,84,color,-.9);leaf(c,i*18+5,-i*68-25,75,color,.6);} c.restore(); }
function photo(c: Context, image: HTMLImageElement | undefined, x: number, y: number, w: number, h: number, ink: string, accent: string, radius = 0) {
  if (image) {
    // The full original photograph is fitted proportionally; no crop, mask, or filter.
    const scale = Math.min((w-16)/image.naturalWidth,(h-16)/image.naturalHeight);
    const iw = image.naturalWidth*scale, ih = image.naturalHeight*scale;
    c.save(); c.shadowColor = '#00000025'; c.shadowBlur = 28; c.shadowOffsetY = 14;
    rect(c,x+(w-iw)/2-8,y+(h-ih)/2-8,iw+16,ih+16,'#fffaf0'); c.restore();
    c.drawImage(image,x+(w-iw)/2,y+(h-ih)/2,iw,ih);
  } else {
    stroke(c,x,y,w,h,accent,radius);
    type(c,'T',x+w/2,y+h/2+65,210,ink);
    type(c,'AL GHOUL',x+w/2,y+h/2+112,18,accent,false,'center',true);
    star(c,x+w/2,y+70,15,accent);
    rule(c,x+w*.3,y+h-62,x+w*.7,y+h-62,accent);
  }
}
export function drawStory(canvas: HTMLCanvasElement, t: Template, page: StoryPage, index: number, count: number, phone: boolean, portrait?: HTMLImageElement) {
  canvas.width = 1080; canvas.height = 1920;
  const c = canvas.getContext('2d')!;
  const { id, bg, ink, accent } = t;
  rect(c,0,0,1080,1920,bg);
  if (id.startsWith('premium-')) {
    drawPremium(c, t, page, index, count, phone, portrait);
    return;
  }
  if (id.startsWith('golden-')) {
    drawGoldenStory(c, t, page, index, count, phone, portrait);
    return;
  }
  let textInk: string = ink;
  let textTop = 840;
  const area = 760;
  if(id === 'ivory') {
    rect(c,0,0,1080,1920,'#f9f6ee');
    c.fillStyle = gold(c,0,0,1080,1920); c.fillRect(44,44,992,1832); rect(c,47,47,986,1826,'#f9f6ee');
    type(c,'TIMAA AL GHOUL',540,126,24,ink,false,'center',true);
    type(c,'The appreciation edit',540,219,74,ink);
    botanical(c,160,742,'#cbbd9f'); botanical(c,920,742,'#cbbd9f',true);
    photo(c,portrait,333,282,414,496,ink,accent,200);
    rect(c,88,823,904,807,'#ffffff',18); stroke(c,105,840,870,773,'#e5dccb',10);
    type(c,'A NOTE OF GRATITUDE',540,800,18,accent,false,'center',true);
    textTop = 864;
  } else if(id === 'emerald') {
    const g=c.createLinearGradient(0,0,1080,1920);g.addColorStop(0,'#0c3029');g.addColorStop(.6,'#1e5144');g.addColorStop(1,'#092a23');c.fillStyle=g;c.fillRect(0,0,1080,1920);
    stroke(c,54,54,972,1812,'#bda16b',430); stroke(c,71,71,938,1778,'#6e8061',415);
    for(let i=0;i<8;i++){c.strokeStyle='#446451';c.beginPath();c.ellipse(540,470,370+i*23,550+i*12,0,Math.PI,Math.PI*2);c.stroke();}
    type(c,'THE ART OF TEACHING',540,145,20,accent,false,'center',true);
    photo(c,portrait,325,205,430,500,ink,accent,200);
    type(c,'Making a difference.',540,799,76,ink);
    rect(c,91,853,898,778,'#f4efdf',30); textInk='#203e32';textTop=862;
    type(c,'“',163,943,126,'#bca675');star(c,540,1671,14,accent);
  } else if(id === 'rose') {
    rect(c,0,0,1080,1920,'#f0e2df');
    c.fillStyle='#e8d4d0';c.beginPath();c.ellipse(1000,480,560,800,-.3,0,Math.PI*2);c.fill();
    type(c,'Kind words,',105,185,112,ink,true,'left');type(c,'beautiful impact.',105,278,92,ink,true,'left');
    photo(c,portrait,481,329,442,462,ink,accent);
    type(c,'01',144,471,102,accent);rule(c,119,511,355,511,accent);
    type(c,'WITH',120,592,20,accent,false,'left',true);type(c,'APPRECIATION',120,634,20,accent,false,'left',true);
    rect(c,80,829,920,803,'#fffaf6',6);textTop=850;
    botanical(c,1040,1850,'#c49c96',true);
  } else if(id === 'midnight') {
    const g=c.createRadialGradient(650,400,30,540,850,1400);g.addColorStop(0,'#34546c');g.addColorStop(1,'#0b192e');c.fillStyle=g;c.fillRect(0,0,1080,1920);
    for(let i=0;i<37;i++)star(c,(i*157+70)%1080,(i*223+30)%1920,i%7===0?12:3,'#a8bdd0');
    c.strokeStyle='#b5c8d6';c.lineWidth=2;c.beginPath();c.arc(540,405,290,0,Math.PI*2);c.stroke();
    photo(c,portrait,340,171,400,473,ink,'#8facc1');
    type(c,'Bright minds.',540,756,106,'#f0f4f5');type(c,'A WORLD OF POSSIBILITY',540,811,19,'#c2d4df',false,'center',true);
    rect(c,95,851,890,778,'#edf2f4',28);textInk='#24364b';textTop=863;star(c,925,896,19,'#9eafbb');
  } else if(id === 'editorial') {
    rect(c,0,0,1080,1920,'#fcfaf5');rect(c,0,0,1080,28,'#262d28');
    type(c,'THE MATHEMATICS EDIT',93,115,22,ink,false,'left',true);type(c,'VOL. 01',990,115,20,accent,false,'right');rule(c,90,153,990,153,ink);
    type(c,'Real words.',93,279,120,ink,true,'left');type(c,'Real impact.',93,390,120,ink,true,'left');
    rect(c,90,447,900,347,'#d9ddcf');
    photo(c,portrait,591,416,344,400,ink,accent);
    type(c,'A teacher.',127,535,57,ink,true,'left');type(c,'A difference.',127,603,57,ink,true,'left');
    type(c,'A lasting impression.',127,713,25,ink,false,'left');
    rule(c,91,851,990,851,ink);textTop=873;rule(c,91,1650,990,1650,ink);
  } else if(id === 'terracotta') {
    rect(c,0,0,1080,1920,'#efe5d7');rect(c,0,0,1080,790,'#954635');
    for(let i=0;i<9;i++){c.strokeStyle='#bd7b5c';c.lineWidth=1.5;c.beginPath();c.arc(0,0,270+i*52,0,Math.PI/2);c.stroke();}
    type(c,'ROOTED IN CARE',570,149,20,'#f1d1ae',false,'center',true);
    photo(c,portrait,128,232,397,494,'#fff1d9','#ddb38e',190);
    type(c,'Growing',757,378,83,'#fff1df');type(c,'together.',757,461,83,'#fff1df');
    star(c,758,554,25,'#d8ab82');type(c,'ONE LESSON',758,639,17,'#f1d1ae',false,'center',true);type(c,'AT A TIME',758,675,17,'#f1d1ae',false,'center',true);
    rect(c,86,828,908,803,'#fcf7ee',150);textInk='#653d31';textTop=850;
    rule(c,161,1670,919,1670,'#bd9272');
  } else if(id === 'lilac') {
    rect(c,0,0,1080,1920,'#e7e2ec');
    c.save();c.translate(540,973);c.rotate(-.04);c.shadowColor='#64567325';c.shadowBlur=35;rect(c,-458,-879,916,1758,'#d7cddf');c.restore();
    rect(c,86,79,908,1762,'#fffdf9');stroke(c,104,97,872,1726,'#e1d8e7');
    type(c,'A LITTLE LETTER OF THANKS',540,169,18,accent,false,'center',true);
    type(c,'Dear Timaa,',540,292,105,ink);
    photo(c,portrait,339,345,402,457,ink,accent);
    botanical(c,130,787,'#c0afc9');botanical(c,950,787,'#c0afc9',true);
    rule(c,227,841,853,841,'#d9cbe0');textTop=858;
    type(c,'With appreciation,',540,1669,43,accent);
  } else {
    rect(c,0,0,1080,1920,'#171817');
    c.fillStyle=gold(c,0,0,1080,0);c.fillRect(0,0,1080,9);
    stroke(c,47,47,986,1826,'#78623d');
    type(c,'THE SIGNATURE OF EXCELLENCE',540,146,20,'#d8bd82',false,'center',true);
    for(let i=0;i<7;i++){rule(c,82+i*23,300,280+i*23,102,'#4d493d');rule(c,800+i*23,740,998+i*23,542,'#4d493d');}
    photo(c,portrait,310,203,460,526,'#f2e8d4','#bca06a');
    type(c,'In their words.',540,810,99,'#eee0c1');
    const g=c.createLinearGradient(0,854,1080,1614);g.addColorStop(0,'#38342c');g.addColorStop(.5,'#252620');g.addColorStop(1,'#39322b');c.fillStyle=g;c.fillRect(91,854,898,770);stroke(c,91,854,898,770,'#ae9460');textTop=862;
    star(c,540,1668,14,'#cfb47a');
  }
  // Body bounds are identical across templates; headers and photos never compete with feedback.
  const spacing=page.size*1.72;
  const start=textTop+(area-page.lines.length*spacing)/2;
  c.font=`${page.size}px ${page.rtl?'Amiri':'"DM Sans"'}`;c.direction=page.rtl?'rtl':'ltr';c.textAlign='center';c.textBaseline='middle';c.fillStyle=textInk;
  page.lines.forEach((text,i)=>c.fillText(text,540,start+spacing*(i+.5)));
  type(c,'Timaa Al Ghoul',540,1757,69,id==='terracotta'?'#653d31':ink);
  type(c,'MATHEMATICS TEACHER',540,1804,18,id==='terracotta'?'#9c7052':accent,false,'center',true);
  if(phone)type(c,'0537859118',540,1852,23,id==='terracotta'?'#653d31':ink,false);
  if(count>1)type(c,`${index+1} / ${count}`,975,1889,16,accent,false,'right');
}

function drawGoldenStory(c: Context, t: Template, page: StoryPage, index: number, count: number, phone: boolean, portrait?: HTMLImageElement) {
  if (studyBackground) {
    const scale = Math.max(1080 / studyBackground.naturalWidth, 1920 / studyBackground.naturalHeight);
    const w = studyBackground.naturalWidth * scale, h = studyBackground.naturalHeight * scale;
    c.drawImage(studyBackground, (1080-w)/2, (1920-h)/2, w, h);
  }
  const reversed = t.id === 'golden-editorial';
  const centered = t.id === 'golden-legacy';
  c.save();
  if (reversed) { c.translate(1080, 0); c.scale(-1, 1); }
  const shade = c.createLinearGradient(0,0,720,0);
  shade.addColorStop(0,'#08151bf5'); shade.addColorStop(.72,'#08151bf5'); shade.addColorStop(1,'#08151b00');
  c.fillStyle=shade;c.beginPath();c.moveTo(0,0);c.lineTo(632,0);c.bezierCurveTo(435,300,439,575,564,797);c.lineTo(0,875);c.closePath();c.fill();
  c.strokeStyle=gold(c,400,0,220,800);c.lineWidth=5;c.beginPath();c.moveTo(632,0);c.bezierCurveTo(435,300,439,575,564,797);c.stroke();
  c.restore();
  const x = reversed ? 820 : 260;
  if(centered) {
    rect(c,45,45,990,110,'#0b1820bb',15);
    type(c,'TIMAA AL GHOUL',540,116,77,'#edc990');
    photo(c,portrait,327,176,426,501,'#eac593','#c79a5c');
    type(c,'MATHEMATICS TEACHER',540,716,23,'#fff0dc',false,'center',true);
    rule(c,431,751,649,751,'#d9b274');
  } else {
    leaf(c,x-14,111,54,'#d9b274',.8);leaf(c,x+15,111,46,'#d9b274',1.5);
    type(c,'TIMAA',x,265,112,'#edc990');type(c,'AL GHOUL',x,360,78,'#edc990');
    type(c,'MATHEMATICS',x,425,22,'#f7eddf',false,'center',true);type(c,'TEACHER',x,462,22,'#f7eddf',false,'center',true);
    rule(c,x-92,504,x+92,504,'#d9b274');
    type(c,'More than',x,589,59,'#e4bb80');type(c,'just math.',x,657,71,'#e4bb80');
    photo(c,portrait,reversed?50:572,99,455,644,'#eac593','#d1aa73');
  }
  c.save();c.shadowColor='#00000070';c.shadowBlur=35;c.shadowOffsetY=22;
  c.fillStyle=gold(c,78,781,924,900);c.beginPath();c.roundRect(78,781,924,924,100);c.fill();c.restore();
  const ivory=c.createLinearGradient(85,790,980,1680);ivory.addColorStop(0,'#fff4df');ivory.addColorStop(.45,'#f3e5d2');ivory.addColorStop(1,'#dfc4a1');
  c.fillStyle=ivory;c.beginPath();c.roundRect(84,787,912,912,95);c.fill();
  stroke(c,91,794,898,898,'#fff7e3',87);
  type(c,'“',174,901,152,'#a77a3b');type(c,'PARENT & STUDENT FEEDBACK',573,858,31,'#382d20');
  rule(c,505,892,635,892,'#a77a3b');
  // Keep the same measured text width and capacity as every other template.
  const spacing=page.size*1.72;const start=914+(760-page.lines.length*spacing)/2;
  c.font=`${page.size}px ${page.rtl?'Amiri':'"DM Sans"'}`;c.direction=page.rtl?'rtl':'ltr';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#201e1a';
  page.lines.forEach((text,i)=>c.fillText(text,540,start+spacing*(i+.5)));
  // Edge foliage stays outside the feedback's measured column.
  leaf(c,1010,1460,91,'#bf9e68',.65);leaf(c,1040,1533,100,'#bf9e68',-.25);
  rect(c,333,1727,676,165,'#0c181ce8',20);
  if(phone){type(c,'☎',401,1786,39,'#deb87c',false);type(c,'0537859118',679,1788,55,'#edc990');}
  type(c,'EVERY STUDENT',670,1839,17,'#f3eada',false,'center',true);type(c,'HAS A BRIGHTER FUTURE',670,1872,17,'#f3eada',false,'center',true);
  if(count>1)type(c,`${index+1} / ${count}`,979,1910,16,'#e1c291',false,'right');
}
