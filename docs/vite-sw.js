if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const f=e=>s(e,r),l={module:{uri:r},exports:o,require:f};i[r]=Promise.all(n.map((e=>l[e]||f(e)))).then((e=>(t(...e),o)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.244c4546.css",revision:null},{url:"index.html",revision:"704097b9800e64b5ed4c925434dae1ff"},{url:"registerSW.js",revision:"4305f828b9e943e736f9dc8d91e1238f"},{url:"manifest.webmanifest",revision:"aff5785268c210743f09e1ecee662935"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
