(function(){
 function b64d(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
 var kb=localStorage.getItem("fao_k"); if(!kb){location.replace("../index.html");return;}
 var keyP=crypto.subtle.importKey("raw",b64d(kb),{name:"AES-GCM"},false,["decrypt"]);
 async function decAB(url){var b=new Uint8Array(await (await fetch(url,{cache:"no-store"})).arrayBuffer());
   var key=await keyP; return await crypto.subtle.decrypt({name:"AES-GCM",iv:b.slice(0,12)},key,b.slice(12));}
 function extOf(ab){var b=new Uint8Array(ab,0,4);
   if(b[0]==0xFF&&b[1]==0xD8)return "jpg"; if(b[0]==0x89&&b[1]==0x50)return "png";
   if(b[0]==0x52&&b[1]==0x49)return "webp"; return "jpg";}
 function mimeOf(e){return e=="png"?"image/png":(e=="webp"?"image/webp":"image/jpeg");}
 function sani(s){return (s||"image").replace(/[\\/:*?"<>|]+/g,"").replace(/\s+/g,"_").slice(0,90)||"image";}
 var DL=[];           // {name, blob, url}
 function run(){ _run().catch(function(e){if(window.console&&console.warn)console.warn(e);}); }
 async function _run(){
   var figs=[].slice.call(document.querySelectorAll('img[data-enc]'));
   for(var j=0;j<figs.length;j++){ try{
     var ab=await decAB(figs[j].getAttribute('data-enc'));
     var ext=extOf(ab), blob=new Blob([ab],{type:mimeOf(ext)}), url=URL.createObjectURL(blob);
     figs[j].src=url;
     var fc=figs[j].parentNode.querySelector('figcaption');
     var item={name:sani(fc?fc.textContent:"image"+(j+1))+"."+ext, blob:blob, url:url};
     DL.push(item); figs[j]._dl=item;
   }catch(e){} }
   addDownload(figs); wireLightbox(figs);
 }
 function save(item){ var a=document.createElement('a'); a.href=item.url; a.download=item.name;
   document.body.appendChild(a); a.click(); a.remove(); }
 async function saveAll(btn){ var o=btn.textContent; btn.disabled=true;
   for(var i=0;i<DL.length;i++){ save(DL[i]); btn.textContent="ダウンロード中… "+(i+1)+"/"+DL.length;
     await new Promise(function(r){setTimeout(r,500);}); }
   btn.textContent=o; btn.disabled=false; }
 function addDownload(figs){
   var host=document.querySelector('header .wrap')||document.querySelector('header')||document.body;
   var b=document.createElement('button');
   b.textContent="⬇ 高画質で全てダウンロード ("+figs.length+"枚)";
   b.setAttribute('style',"margin-top:14px;display:inline-flex;align-items:center;gap:6px;background:#c7a15a;color:#1c1c1e;border:0;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit");
   b.onclick=function(){ saveAll(b); };
   host.appendChild(b);
   figs.forEach(function(f){ var fig=f.parentNode; fig.style.position="relative";
     var d=document.createElement('button'); d.textContent="⬇ 高画質";
     d.setAttribute('style',"position:absolute;top:8px;right:8px;z-index:3;background:rgba(0,0,0,.62);color:#fff;border:0;border-radius:6px;padding:5px 9px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit");
     d.onclick=function(e){ e.stopPropagation(); if(f._dl)save(f._dl); };
     fig.appendChild(d);
   });
 }
 function wireLightbox(figs){
   var st=document.createElement('style');
   st.textContent='#lb{position:fixed;inset:0;background:rgba(0,0,0,.93);display:none;z-index:50;align-items:center;justify-content:center;flex-direction:column}#lb.open{display:flex}#lb img{max-width:94vw;max-height:80vh;object-fit:contain}#lb .cap{color:#cfd3d8;font-size:13px;margin-top:10px;padding:0 20px;text-align:center}#lb .dl{margin-top:10px;background:#c7a15a;color:#1c1c1e;border:0;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}#lb .x{position:absolute;top:16px;right:22px;color:#fff;font-size:30px;cursor:pointer}#lb .nav{position:absolute;top:50%;transform:translateY(-50%);color:#fff;font-size:44px;cursor:pointer;padding:0 18px;opacity:.7}#lb .nav:hover{opacity:1}#lb .prev{left:4px}#lb .next{right:4px}#lb .count{position:absolute;bottom:18px;color:#9aa0a7;font-size:12px}';
   document.head.appendChild(st);
   var lb=document.createElement('div'); lb.id='lb';
   lb.innerHTML='<span class="x">×</span><span class="nav prev">‹</span><img><span class="nav next">›</span><div class="cap"></div><button class="dl">⬇ 高画質ダウンロード</button><div class="count"></div>';
   document.body.appendChild(lb);
   var img=lb.querySelector('img'),cap=lb.querySelector('.cap'),cnt=lb.querySelector('.count'),dl=lb.querySelector('.dl'),i=0;
   function show(){var f=figs[i];img.src=f.currentSrc||f.src;var fc=f.parentNode.querySelector('figcaption');cap.textContent=fc?fc.textContent:'';cnt.textContent=(i+1)+' / '+figs.length;}
   function open(n){i=n;show();lb.classList.add('open');}
   function step(d){i=(i+d+figs.length)%figs.length;show();}
   figs.forEach(function(f,n){f.parentNode.addEventListener('click',function(){open(n);});});
   dl.onclick=function(e){e.stopPropagation(); if(figs[i]._dl)save(figs[i]._dl);};
   lb.querySelector('.x').onclick=function(){lb.classList.remove('open');};
   lb.querySelector('.prev').onclick=function(e){e.stopPropagation();step(-1);};
   lb.querySelector('.next').onclick=function(e){e.stopPropagation();step(1);};
   lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('open');});
   document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);});
 }
 if(document.readyState!=='loading')run(); else document.addEventListener('DOMContentLoaded',run);
})();
