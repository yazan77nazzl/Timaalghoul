import type { StoryPage, Template } from './renderer';

type C = CanvasRenderingContext2D;
let marble: HTMLImageElement | undefined;
let signature: HTMLImageElement | undefined;
export async function loadPremiumAssets(): Promise<void> {
  await Promise.all([new Promise<void>(resolve => {
    const image = new Image();
    image.onload = () => { marble = image; resolve(); };
    image.onerror = () => resolve();
    image.src = `${import.meta.env.BASE_URL}assets/obsidian-marble.png`;
  }), new Promise<void>(resolve => {
    const image = new Image();
    image.onload = () => { signature = image; resolve(); };
    image.onerror = () => resolve();
    image.src = `${import.meta.env.BASE_URL}assets/mathematics-prive.png`;
  })]);
}
function box(c: C, x: number, y: number, w: number, h: number, color: string | CanvasGradient, r: number | number[] = 0) { c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill(); }
function frame(c: C, x: number, y: number, w: number, h: number, color: string, r: number | number[]=0) {c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.roundRect(x,y,w,h,r);c.stroke();}
function line(c: C,x:number,y:number,x2:number,y2:number,color:string){c.strokeStyle=color;c.lineWidth=1.5;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
function text(c:C,s:string,x:number,y:number,size:number,color:string,serif=true,align:CanvasTextAlign='center',spacing=0){c.direction='ltr';c.textBaseline='alphabetic';c.textAlign=align;c.fillStyle=color;c.font=`500 ${size}px ${serif?'"Cormorant Garamond"':'"DM Sans"'}`;c.letterSpacing=`${spacing}px`;c.fillText(s,x,y);c.letterSpacing='0px';}
function gradient(c:C,a:string,b:string,x=0,y=0,w=1080,h=1920){const g=c.createLinearGradient(x,y,w,h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function portrait(c:C,p:HTMLImageElement|undefined,x:number,y:number,w:number,h:number,accent:string){
  frame(c,x-10,y-10,w+20,h+20,accent,3);
  if(p){const scale=Math.min(w/p.naturalWidth,h/p.naturalHeight);const iw=p.naturalWidth*scale,ih=p.naturalHeight*scale;c.save();c.shadowColor='#00000040';c.shadowBlur=30;c.shadowOffsetY=12;c.drawImage(p,x+(w-iw)/2,y+(h-ih)/2,iw,ih);c.restore();}
  else{frame(c,x+14,y+14,w-28,h-28,accent);text(c,'T',x+w/2,y+h*.59,Math.min(w*.48,190),accent);text(c,'AL GHOUL',x+w/2,y+h*.74,18,accent,false,'center',4);line(c,x+w*.32,y+h*.82,x+w*.68,y+h*.82,accent);}
}
function stone(c:C,opacity=1){if(!marble)return;c.save();c.globalAlpha=opacity;const scale=Math.max(1080/marble.naturalWidth,1920/marble.naturalHeight);const w=marble.naturalWidth*scale,h=marble.naturalHeight*scale;c.drawImage(marble,(1080-w)/2,(1920-h)/2,w,h);c.restore();}
export function drawPremium(c:C,t:Template,page:StoryPage,index:number,count:number,phone:boolean,p?:HTMLImageElement){
  const {id,ink,accent}=t;
  let bodyInk:string=ink;let top=866;let footerInk:string=ink;
  box(c,0,0,1080,1920,t.bg);
  if(id==='premium-math-signature'){
    drawSignature(c,page,index,count,phone,p);
    return;
  }
  if(id==='premium-obsidian'){
    stone(c);box(c,0,0,1080,1920,gradient(c,'#101a1760','#0b1211bd'));
    frame(c,47,47,986,1826,'#b9995b');
    text(c,'THE OBSIDIAN COLLECTION',98,133,17,accent,false,'left',4);
    text(c,'Timaa',94,302,125,ink,true,'left');text(c,'Al Ghoul',94,415,115,ink,true,'left');
    line(c,100,473,420,473,accent);text(c,'MATHEMATICS',101,528,20,ink,false,'left',3);text(c,'TEACHER',101,565,20,ink,false,'left',3);
    text(c,'A lasting',98,662,58,accent,true,'left');text(c,'impression.',98,727,68,accent,true,'left');
    portrait(c,p,648,194,301,509,accent);
    box(c,82,832,916,817,'#111b17ef',23);frame(c,82,832,916,817,accent,23);frame(c,96,846,888,789,'#827454',16);
    text(c,'WORDS OF APPRECIATION',540,808,20,ink,false,'center',4);
  }else if(id==='premium-maison'){
    box(c,0,0,1080,1920,gradient(c,'#633441','#25141f'));stone(c,.12);
    c.strokeStyle='#9d6c70';for(let i=0;i<7;i++){c.beginPath();c.ellipse(540,500,445+i*28,500+i*35,0,Math.PI,Math.PI*2);c.stroke();}
    text(c,'MAISON / TIMAA AL GHOUL',540,116,22,ink,false,'center',4);
    portrait(c,p,344,202,392,493,accent);
    text(c,'The joy of learning.',540,801,92,ink);
    box(c,82,845,916,795,gradient(c,'#f8e8db','#d9b5a9',82,845,998,1640),[75,75,8,8]);frame(c,98,861,884,763,'#f9e3cf',[62,62,5,5]);
    bodyInk='#432531';top=864;
    text(c,'WITH GRATITUDE',540,1696,17,accent,false,'center',5);
  }else if(id==='premium-champagne'){
    box(c,0,0,1080,1920,gradient(c,'#e4cdb0','#947358'));stone(c,.09);
    c.fillStyle='#f1e2ce60';c.beginPath();c.ellipse(120,590,330,790,.28,0,Math.PI*2);c.fill();
    text(c,'TIMAA AL GHOUL',540,123,72,'#3e3026');line(c,98,171,982,171,'#7e6347');
    portrait(c,p,122,251,349,457,'#7d5b3d');
    text(c,'A little',742,383,86,'#473426');text(c,'gratitude.',742,473,87,'#473426');
    text(c,'MATHEMATICS',744,580,19,'#4a382a',false,'center',3);text(c,'TEACHER',744,617,19,'#4a382a',false,'center',3);
    line(c,651,661,837,661,'#856142');
    box(c,79,810,922,845,'#9a77556a',40);box(c,91,828,898,813,gradient(c,'#594434','#30281f',91,828,989,1641),35);frame(c,105,842,870,785,'#dfc29a',25);
    text(c,'IN THEIR OWN WORDS',540,789,18,'#49382a',false,'center',4);top=863;footerInk='#362b22';
  }else if(id==='premium-royal'){
    box(c,0,0,1080,1920,gradient(c,'#1c3d54','#071927'));stone(c,.16);
    for(let j=0;j<6;j++){const d=j*22;line(c,65+d,55,65,55+d,accent);line(c,1015-d,1865,1015,1865-d,accent);}
    frame(c,65,55,950,1810,'#aa8e5e');frame(c,82,72,916,1776,'#47616b');
    text(c,'THE ROYAL MATHEMATICS COLLECTION',540,141,18,ink,false,'center',3);
    portrait(c,p,353,212,374,465,accent);
    for(const x of [174,906]){line(c,x,261,x,666,'#a99269');line(c,x-20,285,x+20,285,accent);line(c,x-20,642,x+20,642,accent);}
    text(c,'Beyond the ordinary.',540,800,86,ink);
    box(c,99,852,882,789,'#0b2232e8');frame(c,99,852,882,789,accent);frame(c,111,864,858,765,'#5f766e');top=867;
  }else if(id==='premium-gallery'){
    box(c,0,0,1080,1920,gradient(c,'#4d594d','#17251f'));stone(c,.26);
    box(c,46,47,988,716,'#17241ff2');
    text(c,'THE PRIVATE GALLERY',92,121,19,accent,false,'left',4);text(c,'01',984,121,21,accent,false,'right');
    line(c,92,153,984,153,'#71806a');
    text(c,'Great',92,327,122,ink,true,'left');text(c,'teaching.',92,442,104,ink,true,'left');
    text(c,'Meaningful',94,552,48,accent,true,'left');text(c,'connections.',94,608,48,accent,true,'left');
    portrait(c,p,620,216,313,449,accent);
    text(c,'REAL STORIES. LASTING CONFIDENCE.',540,804,18,ink,false,'center',3);
    c.save();c.shadowColor='#00000050';c.shadowBlur=30;c.shadowOffsetY=20;box(c,82,846,916,799,'#ded9c8',4);c.restore();
    frame(c,103,867,874,757,'#b9b39d',2);bodyInk='#293b2e';top=869;
  }else{
    box(c,0,0,1080,1920,gradient(c,'#173e3e','#071d23'));stone(c,.12);
    // Golden mathematical notation surrounds the portrait; feedback has its own quiet panel.
    c.save();c.globalAlpha=.16;
    for(let x=40;x<1080;x+=60)line(c,x,0,x,790,'#8cad98');
    for(let y=10;y<790;y+=60)line(c,0,y,1080,y,'#8cad98');
    c.restore();
    text(c,'TIMAA AL GHOUL',540,118,69,ink);
    text(c,'MATHEMATICS TEACHER',540,167,20,accent,false,'center',5);
    portrait(c,p,610,244,332,447,accent);
    text(c,'π',167,343,117,accent);text(c,'∑',345,340,99,accent);text(c,'√',447,344,108,accent);
    text(c,'x² + y² = r²',106,459,53,ink,true,'left');
    text(c,'y = mx + b',106,527,52,accent,true,'left');
    text(c,'a² + b² = c²',106,595,49,ink,true,'left');
    c.strokeStyle=accent;c.lineWidth=2;c.beginPath();c.moveTo(114,714);c.lineTo(254,714);c.lineTo(114,620);c.closePath();c.stroke();
    line(c,114,699,129,699,accent);line(c,129,699,129,714,accent);
    text(c,'a',96,674,22,accent);text(c,'b',184,744,22,accent);text(c,'c',210,660,22,accent);
    text(c,'More than numbers.',662,788,76,ink);
    box(c,82,848,916,800,'#f0e5d0',22);frame(c,82,848,916,800,accent,22);frame(c,99,865,882,766,'#b9a57e',12);
    bodyInk='#143330';top=867;
    text(c,'∞',943,1754,58,accent);text(c,'π ≈ 3.14159',154,1732,25,accent);
  }
  const spacing=page.size*1.72;const start=top+(760-page.lines.length*spacing)/2;
  c.font=`${page.size}px ${page.rtl?'Amiri':'"DM Sans"'}`;c.direction=page.rtl?'rtl':'ltr';c.textAlign='center';c.textBaseline='middle';c.fillStyle=bodyInk;
  page.lines.forEach((s,i)=>c.fillText(s,540,start+spacing*(i+.5)));
  if(id!=='premium-maison')line(c,452,1693,628,1693,id==='premium-champagne'?'#624831':accent);
  text(c,'Timaa Al Ghoul',540,1767,66,footerInk);
  text(c,'MATHEMATICS TEACHER',540,1811,18,id==='premium-champagne'?'#4b3929':accent,false,'center',4);
  if(phone)text(c,'0537859118',540,1857,23,footerInk,false);
  if(count>1)text(c,`${index+1} / ${count}`,969,1898,16,footerInk,false,'right');
}

function drawSignature(c:C,page:StoryPage,index:number,count:number,phone:boolean,p?:HTMLImageElement){
  if(signature){const scale=Math.max(1080/signature.naturalWidth,1920/signature.naturalHeight);const w=signature.naturalWidth*scale,h=signature.naturalHeight*scale;c.drawImage(signature,(1080-w)/2,(1920-h)/2,w,h);}
  const shade=c.createLinearGradient(0,0,640,0);shade.addColorStop(0,'#071014ef');shade.addColorStop(.78,'#071014e0');shade.addColorStop(1,'#07101400');
  c.fillStyle=shade;c.beginPath();c.moveTo(0,0);c.lineTo(638,0);c.bezierCurveTo(478,195,506,552,617,778);c.lineTo(0,820);c.closePath();c.fill();
  c.strokeStyle=gradient(c,'#f5dba0','#947041',510,0,630,790);c.lineWidth=3;c.beginPath();c.moveTo(638,0);c.bezierCurveTo(478,195,506,552,617,778);c.stroke();
  text(c,'THE MATHEMATICS COLLECTION',72,105,17,'#d2b17a',false,'left',3);
  text(c,'TIMAA',68,275,121,'#f2d5a3',true,'left');text(c,'AL GHOUL',71,375,82,'#f2d5a3',true,'left');
  text(c,'MATHEMATICS TEACHER',74,437,18,'#eee7da',false,'left',3);line(c,74,481,304,481,'#d8b27a');
  text(c,'The beauty',77,575,65,'#d8b27a',true,'left');text(c,'of mathematics.',77,648,66,'#d8b27a',true,'left');
  text(c,'x² + y² = r²',81,726,26,'#d7bf94',true,'left');
  // Without a portrait, the original brass sculpture background stays visible.
  if(p)portrait(c,p,629,139,369,503,'#c3a16b');
  c.save();c.shadowColor='#00000090';c.shadowBlur=45;c.shadowOffsetY=24;
  const metal=c.createLinearGradient(96,781,986,1720);metal.addColorStop(0,'#f7dfab');metal.addColorStop(.3,'#ba8845');metal.addColorStop(.6,'#f2d8a2');metal.addColorStop(1,'#92622b');
  box(c,96,781,888,934,metal,[110,110,72,72]);c.restore();
  const vellum=c.createLinearGradient(103,788,980,1708);vellum.addColorStop(0,'#fff5df');vellum.addColorStop(.45,'#f6e9d4');vellum.addColorStop(1,'#d9bd94');
  box(c,103,788,874,920,vellum,[103,103,65,65]);frame(c,111,796,858,904,'#fff8e8',[96,96,57,57]);
  text(c,'“',176,909,146,'#9f773d');text(c,'PARENT & STUDENT FEEDBACK',586,862,31,'#3a2e1e');line(c,511,896,639,896,'#9a7139');
  const spacing=page.size*1.72;const start=924+(760-page.lines.length*spacing)/2;
  c.font=`${page.size}px ${page.rtl?'Amiri':'"DM Sans"'}`;c.direction=page.rtl?'rtl':'ltr';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#28231c';
  page.lines.forEach((s,i)=>c.fillText(s,540,start+spacing*(i+.5)));
  if(phone){box(c,357,1750,665,122,'#101918e8',22);frame(c,357,1750,665,122,'#91774c',22);text(c,'☎',419,1831,42,'#dbb57c',false);text(c,'0537859118',690,1833,62,'#f0ce93');}
  text(c,'EVERY STUDENT HAS A BRIGHTER FUTURE',665,1905,13,'#f1e2c9',false,'center',2);
  if(count>1)text(c,`${index+1} / ${count}`,115,1892,16,'#f1d7aa',false,'left');
}
