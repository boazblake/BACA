if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const d=e=>i(e,t),l={module:{uri:t},exports:o,require:d};s[t]=Promise.all(n.map((e=>l[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.2330f3cd.css",revision:null},{url:"assets/index.6236a8dc.js",revision:null},{url:"index.html",revision:"3d58695ba244f2b1d69a98cd6119dc15"},{url:"registerSW.js",revision:"7d07503da0d5922a8efa2d10468b2711"},{url:"fonts/EmojiSymbols-Regular.woff",revision:"ede0909f6a76504a917307f1c106f09c"},{url:"manifest.webmanifest",revision:"2b774b6f623c2038c1c75bac3e2f951b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
