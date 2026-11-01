(function(){
 function b64d(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
 var kb=localStorage.getItem("fao_k"); if(!kb){location.replace("../index.html");return;}
 var keyP=crypto.subtle.importKey("raw",b64d(kb),{name:"AES-GCM"},false,["decrypt"]);
 async function dec(url){var b=new Uint8Array(await (await fetch(url,{cache:"no-store"})).arrayBuffer());
   var key=await keyP; return await crypto.subtle.decrypt({name:"AES-GCM",iv:b.slice(0,12)},key,b.slice(12));}
 var items=[];
 async function run(){
   var figs=[].slice.call(document.querySelectorAll('img[data-enc]'));
   for(var i=0;i<figs.length;i++){ (function(im,idx){ items.push({im:im}); })(figs[i],i); }
   // 逐次復号（順に表示）
   for(var j=0;j<figs.length;j++){ try{ var pt=await dec(figs[j].getAttribute('data-enc'));
       var url=URL.createObjectURL(new Blob([pt])); figs[j].src=url; figs[j]._u=url; }catch(e){} }
   wireLightbox(figs);
 }
 function wireLightbox(figs){
   var st=document.createElement('style');
   st.textContent='#lb{position:fixed;inset:0;background:rgba(0,0,0,.93);display:none;z-index:50;align-items:center;justify-content:center;flex-direction:column}#lb.open{display:flex}#lb img{max-width:94vw;max-height:84vh;object-fit:contain}#lb .cap{color:#cfd3d8;font-size:13px;margin-top:12px;padding:0 20px;text-align:center}#lb .x{position:absolute;top:16px;right:22px;color:#fff;font-size:30px;cursor:pointer}#lb .nav{position:absolute;top:50%;transform:translateY(-50%);color:#fff;font-size:44px;cursor:pointer;padding:0 18px;opacity:.7}#lb .nav:hover{opacity:1}#lb .prev{left:4px}#lb .next{right:4px}#lb .count{position:absolute;bottom:18px;color:#9aa0a7;font-size:12px}';
   document.head.appendChild(st);
   var lb=document.createElement('div'); lb.id='lb';
   lb.innerHTML='<span class="x">×</span><span class="nav prev">‹</span><img><span class="nav next">›</span><div class="cap"></div><div class="count"></div>';
   document.body.appendChild(lb);
   var img=lb.querySelector('img'),cap=lb.querySelector('.cap'),cnt=lb.querySelector('.count'),i=0;
   function show(){var f=figs[i];img.src=f.currentSrc||f.src;var fc=f.parentNode.querySelector('figcaption');cap.textContent=fc?fc.textContent:'';cnt.textContent=(i+1)+' / '+figs.length;}
   function open(n){i=n;show();lb.classList.add('open');}
   function step(d){i=(i+d+figs.length)%figs.length;show();}
   figs.forEach(function(f,n){f.parentNode.addEventListener('click',function(){open(n);});});
   lb.querySelector('.x').onclick=function(){lb.classList.remove('open');};
   lb.querySelector('.prev').onclick=function(e){e.stopPropagation();step(-1);};
   lb.querySelector('.next').onclick=function(e){e.stopPropagation();step(1);};
   lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('open');});
   document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);});
 }
 if(document.readyState!=='loading')run(); else document.addEventListener('DOMContentLoaded',run);
})();