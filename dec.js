(function(){
 function b64d(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
 var kb=localStorage.getItem("fao_k"); if(!kb){location.replace(FAO_ENTRY);return;}
 (async function(){ try{
   var key=await crypto.subtle.importKey("raw",b64d(kb),{name:"AES-GCM"},false,["decrypt"]);
   var buf=new Uint8Array(await (await fetch(FAO_ENC,{cache:"no-store"})).arrayBuffer());
   var pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:buf.slice(0,12)},key,buf.slice(12));
   var htmlStr=new TextDecoder().decode(pt);
   document.open();document.write(htmlStr);document.close();
 }catch(e){ localStorage.removeItem("fao_k"); location.replace(FAO_ENTRY); } })();
})();