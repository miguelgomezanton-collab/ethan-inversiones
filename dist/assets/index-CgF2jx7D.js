const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dashboard-BSqotbnQ.js","assets/userdata-DXI1eA65.js","assets/home-CwSdlfYm.js","assets/macro-data-CGVdt8ED.js","assets/ciclo-B2WvYTj7.js","assets/liquidez-BbYA1zj5.js","assets/polmon-B-WxBb1x.js","assets/inflacion-O_0Az3Cd.js","assets/sentimiento-BgIW4RtX.js","assets/radar-BKYWMHkp.js","assets/calendario-C0LpokW2.js","assets/inversor-eEDX4vNF.js","assets/timeline-rentSPxZ.js","assets/alertas-DriAwUF3.js","assets/etf-screener-DDoOjnl8.js","assets/rv-sectores-ivks5Keo.js","assets/rv-sp500-BhRTrp-v.js","assets/rv-watchlist-DP_fqtOn.js","assets/correcciones-DyBii3I4.js","assets/rf-screener-PcAQosvN.js","assets/rf-watchlist-DJToNf1A.js","assets/com-screener-dvlZPCCd.js","assets/com-watchlist-BJUrJc9G.js","assets/sectores-Bjb3buIs.js","assets/sp500-td2h5Fne.js","assets/watchlist-GkDA_ndt.js","assets/fondo-e1XpMiFO.js","assets/cartera-BPeCCQHa.js","assets/metricas-DeuTqcFD.js","assets/motor-DglfR_QW.js","assets/vitacora-C6cIBg_-.js","assets/smart-money-DGZWmhDV.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const of="modulepreload",af=function(n){return"/"+n},pc={},q=function(e,t,r){let i=Promise.resolve();if(t&&t.length>0){let a=function(d){return Promise.all(d.map(p=>Promise.resolve(p).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),l=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));i=a(t.map(d=>{if(d=af(d),d in pc)return;pc[d]=!0;const p=d.endsWith(".css"),g=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${g}`))return;const E=document.createElement("link");if(E.rel=p?"stylesheet":of,p||(E.as="script"),E.crossOrigin="",E.href=d,l&&E.setAttribute("nonce",l),document.head.appendChild(E),p)return new Promise((S,C)=>{E.addEventListener("load",S),E.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(a){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=a,window.dispatchEvent(u),!u.defaultPrevented)throw a}return i.then(a=>{for(const u of a||[])u.status==="rejected"&&s(u.reason);return e().catch(s)})},cf=()=>{};var mc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ku=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},uf=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],a=n[t++],u=n[t++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=n[t++],a=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Qu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],a=i+1<n.length,u=a?n[i+1]:0,l=i+2<n.length,d=l?n[i+2]:0,p=s>>2,g=(s&3)<<4|u>>4;let E=(u&15)<<2|d>>6,S=d&63;l||(S=64,a||(E=64)),r.push(t[p],t[g],t[E],t[S])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Ku(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):uf(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],u=i<n.length?t[n.charAt(i)]:0;++i;const d=i<n.length?t[n.charAt(i)]:64;++i;const g=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||u==null||d==null||g==null)throw new lf;const E=s<<2|u>>4;if(r.push(E),d!==64){const S=u<<4&240|d>>2;if(r.push(S),g!==64){const C=d<<6&192|g;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class lf extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const hf=function(n){const e=Ku(n);return Qu.encodeByteArray(e,!0)},ai=function(n){return hf(n).replace(/\./g,"")},Ju=function(n){try{return Qu.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function df(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ff=()=>df().__FIREBASE_DEFAULTS__,pf=()=>{if(typeof process>"u"||typeof mc>"u")return;const n=mc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},mf=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ju(n[1]);return e&&JSON.parse(e)},Pi=()=>{try{return cf()||ff()||pf()||mf()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Yu=n=>{var e,t;return(t=(e=Pi())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},gf=n=>{const e=Yu(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Xu=()=>{var n;return(n=Pi())===null||n===void 0?void 0:n.config},Zu=n=>{var e;return(e=Pi())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _n(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function el(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yf(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[ai(JSON.stringify(t)),ai(JSON.stringify(a)),""].join(".")}const Qn={};function Ef(){const n={prod:[],emulator:[]};for(const e of Object.keys(Qn))Qn[e]?n.emulator.push(e):n.prod.push(e);return n}function vf(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let gc=!1;function tl(n,e){if(typeof window>"u"||typeof document>"u"||!_n(window.location.host)||Qn[n]===e||Qn[n]||gc)return;Qn[n]=e;function t(E){return`__firebase__banner__${E}`}const r="__firebase__banner",s=Ef().prod.length>0;function a(){const E=document.getElementById(r);E&&E.remove()}function u(E){E.style.display="flex",E.style.background="#7faaf0",E.style.position="fixed",E.style.bottom="5px",E.style.left="5px",E.style.padding=".5em",E.style.borderRadius="5px",E.style.alignItems="center"}function l(E,S){E.setAttribute("width","24"),E.setAttribute("id",S),E.setAttribute("height","24"),E.setAttribute("viewBox","0 0 24 24"),E.setAttribute("fill","none"),E.style.marginLeft="-6px"}function d(){const E=document.createElement("span");return E.style.cursor="pointer",E.style.marginLeft="16px",E.style.fontSize="24px",E.innerHTML=" &times;",E.onclick=()=>{gc=!0,a()},E}function p(E,S){E.setAttribute("id",S),E.innerText="Learn more",E.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",E.setAttribute("target","__blank"),E.style.paddingLeft="5px",E.style.textDecoration="underline"}function g(){const E=vf(r),S=t("text"),C=document.getElementById(S)||document.createElement("span"),O=t("learnmore"),V=document.getElementById(O)||document.createElement("a"),H=t("preprendIcon"),B=document.getElementById(H)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(E.created){const z=E.element;u(z),p(V,O);const te=d();l(B,H),z.append(B,C,V,te),document.body.appendChild(z)}s?(C.innerText="Preview backend disconnected.",B.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(B.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,C.innerText="Preview backend running in this workspace."),C.setAttribute("id",S)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",g):g()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Tf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ae())}function If(){var n;const e=(n=Pi())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function wf(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Af(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Rf(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function bf(){const n=Ae();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Sf(){return!If()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Pf(){try{return typeof indexedDB=="object"}catch{return!1}}function Cf(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kf="FirebaseError";class st extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=kf,Object.setPrototypeOf(this,st.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,fr.prototype.create)}}class fr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Vf(s,r):"Error",u=`${this.serviceName}: ${a} (${i}).`;return new st(i,u,r)}}function Vf(n,e){return n.replace(Df,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const Df=/\{\$([^}]+)}/g;function Nf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function qt(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],a=e[i];if(_c(s)&&_c(a)){if(!qt(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function _c(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function $n(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Hn(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Of(n,e){const t=new Lf(n,e);return t.subscribe.bind(t)}class Lf{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Mf(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=Is),i.error===void 0&&(i.error=Is),i.complete===void 0&&(i.complete=Is);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Mf(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Is(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(n){return n&&n._delegate?n._delegate:n}class $t{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xf{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new _f;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Uf(e))try{this.getOrInitializeService({instanceIdentifier:Ft})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Ft){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ft){return this.instances.has(e)}getOptions(e=Ft){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(s);r===u&&a.resolve(i)}return i}onInit(e,t){var r;const i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ff(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Ft){return this.component?this.component.multipleInstances?e:Ft:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ff(n){return n===Ft?void 0:n}function Uf(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bf{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new xf(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var W;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(W||(W={}));const jf={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},qf=W.INFO,$f={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},Hf=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=$f[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class fo{constructor(e){this.name=e,this._logLevel=qf,this._logHandler=Hf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in W))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?jf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...e),this._logHandler(this,W.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...e),this._logHandler(this,W.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,W.INFO,...e),this._logHandler(this,W.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,W.WARN,...e),this._logHandler(this,W.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...e),this._logHandler(this,W.ERROR,...e)}}const zf=(n,e)=>e.some(t=>n instanceof t);let yc,Ec;function Wf(){return yc||(yc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Gf(){return Ec||(Ec=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const nl=new WeakMap,Us=new WeakMap,rl=new WeakMap,ws=new WeakMap,po=new WeakMap;function Kf(n){const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",a)},s=()=>{t(_t(n.result)),i()},a=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&nl.set(t,n)}).catch(()=>{}),po.set(e,n),e}function Qf(n){if(Us.has(n))return;const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",a),n.removeEventListener("abort",a)},s=()=>{t(),i()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",a),n.addEventListener("abort",a)});Us.set(n,e)}let Bs={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Us.get(n);if(e==="objectStoreNames")return n.objectStoreNames||rl.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return _t(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Jf(n){Bs=n(Bs)}function Yf(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(As(this),e,...t);return rl.set(r,e.sort?e.sort():[e]),_t(r)}:Gf().includes(n)?function(...e){return n.apply(As(this),e),_t(nl.get(this))}:function(...e){return _t(n.apply(As(this),e))}}function Xf(n){return typeof n=="function"?Yf(n):(n instanceof IDBTransaction&&Qf(n),zf(n,Wf())?new Proxy(n,Bs):n)}function _t(n){if(n instanceof IDBRequest)return Kf(n);if(ws.has(n))return ws.get(n);const e=Xf(n);return e!==n&&(ws.set(n,e),po.set(e,n)),e}const As=n=>po.get(n);function Zf(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(n,e),u=_t(a);return r&&a.addEventListener("upgradeneeded",l=>{r(_t(a.result),l.oldVersion,l.newVersion,_t(a.transaction),l)}),t&&a.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),u.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const ep=["get","getKey","getAll","getAllKeys","count"],tp=["put","add","delete","clear"],Rs=new Map;function vc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Rs.get(e))return Rs.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,i=tp.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||ep.includes(t)))return;const s=async function(a,...u){const l=this.transaction(a,i?"readwrite":"readonly");let d=l.store;return r&&(d=d.index(u.shift())),(await Promise.all([d[t](...u),i&&l.done]))[0]};return Rs.set(e,s),s}Jf(n=>({...n,get:(e,t,r)=>vc(e,t)||n.get(e,t,r),has:(e,t)=>!!vc(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(rp(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function rp(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const js="@firebase/app",Tc="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt=new fo("@firebase/app"),ip="@firebase/app-compat",sp="@firebase/analytics-compat",op="@firebase/analytics",ap="@firebase/app-check-compat",cp="@firebase/app-check",up="@firebase/auth",lp="@firebase/auth-compat",hp="@firebase/database",dp="@firebase/data-connect",fp="@firebase/database-compat",pp="@firebase/functions",mp="@firebase/functions-compat",gp="@firebase/installations",_p="@firebase/installations-compat",yp="@firebase/messaging",Ep="@firebase/messaging-compat",vp="@firebase/performance",Tp="@firebase/performance-compat",Ip="@firebase/remote-config",wp="@firebase/remote-config-compat",Ap="@firebase/storage",Rp="@firebase/storage-compat",bp="@firebase/firestore",Sp="@firebase/ai",Pp="@firebase/firestore-compat",Cp="firebase",kp="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qs="[DEFAULT]",Vp={[js]:"fire-core",[ip]:"fire-core-compat",[op]:"fire-analytics",[sp]:"fire-analytics-compat",[cp]:"fire-app-check",[ap]:"fire-app-check-compat",[up]:"fire-auth",[lp]:"fire-auth-compat",[hp]:"fire-rtdb",[dp]:"fire-data-connect",[fp]:"fire-rtdb-compat",[pp]:"fire-fn",[mp]:"fire-fn-compat",[gp]:"fire-iid",[_p]:"fire-iid-compat",[yp]:"fire-fcm",[Ep]:"fire-fcm-compat",[vp]:"fire-perf",[Tp]:"fire-perf-compat",[Ip]:"fire-rc",[wp]:"fire-rc-compat",[Ap]:"fire-gcs",[Rp]:"fire-gcs-compat",[bp]:"fire-fst",[Pp]:"fire-fst-compat",[Sp]:"fire-vertex","fire-js":"fire-js",[Cp]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ci=new Map,Dp=new Map,$s=new Map;function Ic(n,e){try{n.container.addComponent(e)}catch(t){tt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ln(n){const e=n.name;if($s.has(e))return tt.debug(`There were multiple attempts to register component ${e}.`),!1;$s.set(e,n);for(const t of ci.values())Ic(t,n);for(const t of Dp.values())Ic(t,n);return!0}function mo(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Le(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Np={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},yt=new fr("app","Firebase",Np);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Op{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new $t("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw yt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yn=kp;function il(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:qs,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw yt.create("bad-app-name",{appName:String(i)});if(t||(t=Xu()),!t)throw yt.create("no-options");const s=ci.get(i);if(s){if(qt(t,s.options)&&qt(r,s.config))return s;throw yt.create("duplicate-app",{appName:i})}const a=new Bf(i);for(const l of $s.values())a.addComponent(l);const u=new Op(t,r,a);return ci.set(i,u),u}function sl(n=qs){const e=ci.get(n);if(!e&&n===qs&&Xu())return il();if(!e)throw yt.create("no-app",{appName:n});return e}function Et(n,e,t){var r;let i=(r=Vp[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const u=[`Unable to register library "${i}" with version "${e}":`];s&&u.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&u.push("and"),a&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),tt.warn(u.join(" "));return}ln(new $t(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lp="firebase-heartbeat-database",Mp=1,nr="firebase-heartbeat-store";let bs=null;function ol(){return bs||(bs=Zf(Lp,Mp,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(nr)}catch(t){console.warn(t)}}}}).catch(n=>{throw yt.create("idb-open",{originalErrorMessage:n.message})})),bs}async function xp(n){try{const t=(await ol()).transaction(nr),r=await t.objectStore(nr).get(al(n));return await t.done,r}catch(e){if(e instanceof st)tt.warn(e.message);else{const t=yt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});tt.warn(t.message)}}}async function wc(n,e){try{const r=(await ol()).transaction(nr,"readwrite");await r.objectStore(nr).put(e,al(n)),await r.done}catch(t){if(t instanceof st)tt.warn(t.message);else{const r=yt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});tt.warn(r.message)}}}function al(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fp=1024,Up=30;class Bp{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new qp(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Ac();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Up){const a=$p(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){tt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Ac(),{heartbeatsToSend:r,unsentEntries:i}=jp(this._heartbeatsCache.heartbeats),s=ai(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return tt.warn(t),""}}}function Ac(){return new Date().toISOString().substring(0,10)}function jp(n,e=Fp){const t=[];let r=n.slice();for(const i of n){const s=t.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Rc(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Rc(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class qp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Pf()?Cf().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await xp(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return wc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return wc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Rc(n){return ai(JSON.stringify({version:2,heartbeats:n})).length}function $p(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hp(n){ln(new $t("platform-logger",e=>new np(e),"PRIVATE")),ln(new $t("heartbeat",e=>new Bp(e),"PRIVATE")),Et(js,Tc,n),Et(js,Tc,"esm2017"),Et("fire-js","")}Hp("");function go(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(n);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(n,r[i])&&(t[r[i]]=n[r[i]]);return t}function cl(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const zp=cl,ul=new fr("auth","Firebase",cl());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ui=new fo("@firebase/auth");function Wp(n,...e){ui.logLevel<=W.WARN&&ui.warn(`Auth (${yn}): ${n}`,...e)}function Yr(n,...e){ui.logLevel<=W.ERROR&&ui.error(`Auth (${yn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(n,...e){throw _o(n,...e)}function je(n,...e){return _o(n,...e)}function ll(n,e,t){const r=Object.assign(Object.assign({},zp()),{[e]:t});return new fr("auth","Firebase",r).create(e,{appName:n.name})}function vt(n){return ll(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function _o(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return ul.create(n,...e)}function M(n,e,...t){if(!n)throw _o(e,...t)}function Ye(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Yr(e),new Error(e)}function nt(n,e){n||Ye(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hs(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Gp(){return bc()==="http:"||bc()==="https:"}function bc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kp(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Gp()||Af()||"connection"in navigator)?navigator.onLine:!0}function Qp(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t){this.shortDelay=e,this.longDelay=t,nt(t>e,"Short delay should be less than long delay!"),this.isMobile=Tf()||Rf()}get(){return Kp()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yo(n,e){nt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ye("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ye("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ye("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jp={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yp=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Xp=new mr(3e4,6e4);function Gt(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Vt(n,e,t,r,i={}){return dl(n,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const u=pr(Object.assign({key:n.config.apiKey},a)).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:l},s);return wf()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&_n(n.emulatorConfig.host)&&(d.credentials="include"),hl.fetch()(await fl(n,n.config.apiHost,t,u),d)})}async function dl(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},Jp),e);try{const i=new em(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw $r(n,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const u=s.ok?a.errorMessage:a.error.message,[l,d]=u.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw $r(n,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw $r(n,"email-already-in-use",a);if(l==="USER_DISABLED")throw $r(n,"user-disabled",a);const p=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw ll(n,p,d);Fe(n,p)}}catch(i){if(i instanceof st)throw i;Fe(n,"network-request-failed",{message:String(i)})}}async function Ci(n,e,t,r,i={}){const s=await Vt(n,e,t,r,i);return"mfaPendingCredential"in s&&Fe(n,"multi-factor-auth-required",{_serverResponse:s}),s}async function fl(n,e,t,r){const i=`${e}${t}?${r}`,s=n,a=s.config.emulator?yo(n.config,i):`${n.config.apiScheme}://${i}`;return Yp.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Zp(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class em{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(je(this.auth,"network-request-failed")),Xp.get())})}}function $r(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=je(n,e,r);return i.customData._tokenResponse=t,i}function Sc(n){return n!==void 0&&n.enterprise!==void 0}class tm{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Zp(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function nm(n,e){return Vt(n,"GET","/v2/recaptchaConfig",Gt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rm(n,e){return Vt(n,"POST","/v1/accounts:delete",e)}async function li(n,e){return Vt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jn(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function im(n,e=!1){const t=he(n),r=await t.getIdToken(e),i=Eo(r);M(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Jn(Ss(i.auth_time)),issuedAtTime:Jn(Ss(i.iat)),expirationTime:Jn(Ss(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Ss(n){return Number(n)*1e3}function Eo(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Yr("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ju(t);return i?JSON.parse(i):(Yr("Failed to decode base64 JWT payload"),null)}catch(i){return Yr("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Pc(n){const e=Eo(n);return M(e,"internal-error"),M(typeof e.exp<"u","internal-error"),M(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof st&&sm(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function sm({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class om{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Jn(this.lastLoginAt),this.creationTime=Jn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hi(n){var e;const t=n.auth,r=await n.getIdToken(),i=await rr(n,li(t,{idToken:r}));M(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?pl(s.providerUserInfo):[],u=cm(n.providerData,a),l=n.isAnonymous,d=!(n.email&&s.passwordHash)&&!(u!=null&&u.length),p=l?d:!1,g={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:u,metadata:new zs(s.createdAt,s.lastLoginAt),isAnonymous:p};Object.assign(n,g)}async function am(n){const e=he(n);await hi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function cm(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function pl(n){return n.map(e=>{var{providerId:t}=e,r=go(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function um(n,e){const t=await dl(n,{},async()=>{const r=pr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,a=await fl(n,i,"/v1/token",`key=${s}`),u=await n._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:u,body:r};return n.emulatorConfig&&_n(n.emulatorConfig.host)&&(l.credentials="include"),hl.fetch()(a,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function lm(n,e){return Vt(n,"POST","/v2/accounts:revokeToken",Gt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){M(e.idToken,"internal-error"),M(typeof e.idToken<"u","internal-error"),M(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Pc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){M(e.length!==0,"internal-error");const t=Pc(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(M(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await um(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,a=new on;return r&&(M(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(M(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(M(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new on,this.toJSON())}_performRefresh(){return Ye("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(n,e){M(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Me{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=go(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new om(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new zs(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await rr(this,this.stsTokenManager.getToken(this.auth,e));return M(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return im(this,e)}reload(){return am(this)}_assign(e){this!==e&&(M(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Me(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){M(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await hi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Le(this.auth.app))return Promise.reject(vt(this.auth));const e=await this.getIdToken();return await rr(this,rm(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,a,u,l,d,p;const g=(r=t.displayName)!==null&&r!==void 0?r:void 0,E=(i=t.email)!==null&&i!==void 0?i:void 0,S=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,C=(a=t.photoURL)!==null&&a!==void 0?a:void 0,O=(u=t.tenantId)!==null&&u!==void 0?u:void 0,V=(l=t._redirectEventId)!==null&&l!==void 0?l:void 0,H=(d=t.createdAt)!==null&&d!==void 0?d:void 0,B=(p=t.lastLoginAt)!==null&&p!==void 0?p:void 0,{uid:z,emailVerified:te,isAnonymous:De,providerData:se,stsTokenManager:T}=t;M(z&&T,e,"internal-error");const m=on.fromJSON(this.name,T);M(typeof z=="string",e,"internal-error"),ht(g,e.name),ht(E,e.name),M(typeof te=="boolean",e,"internal-error"),M(typeof De=="boolean",e,"internal-error"),ht(S,e.name),ht(C,e.name),ht(O,e.name),ht(V,e.name),ht(H,e.name),ht(B,e.name);const y=new Me({uid:z,auth:e,email:E,emailVerified:te,displayName:g,isAnonymous:De,photoURL:C,phoneNumber:S,tenantId:O,stsTokenManager:m,createdAt:H,lastLoginAt:B});return se&&Array.isArray(se)&&(y.providerData=se.map(v=>Object.assign({},v))),V&&(y._redirectEventId=V),y}static async _fromIdTokenResponse(e,t,r=!1){const i=new on;i.updateFromServerResponse(t);const s=new Me({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await hi(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];M(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?pl(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),u=new on;u.updateFromIdToken(r);const l=new Me({uid:i.localId,auth:e,stsTokenManager:u,isAnonymous:a}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new zs(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,d),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cc=new Map;function Xe(n){nt(n instanceof Function,"Expected a class definition");let e=Cc.get(n);return e?(nt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Cc.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ml.type="NONE";const kc=ml;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xr(n,e,t){return`firebase:${n}:${e}:${t}`}class an{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Xr(this.userKey,i.apiKey,s),this.fullPersistenceKey=Xr("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await li(this.auth,{idToken:e}).catch(()=>{});return t?Me._fromGetAccountInfoResponse(this.auth,t,e):null}return Me._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new an(Xe(kc),e,r);const i=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=i[0]||Xe(kc);const a=Xr(r,e.config.apiKey,e.name);let u=null;for(const d of t)try{const p=await d._get(a);if(p){let g;if(typeof p=="string"){const E=await li(e,{idToken:p}).catch(()=>{});if(!E)break;g=await Me._fromGetAccountInfoResponse(e,E,p)}else g=Me._fromJSON(e,p);d!==s&&(u=g),s=d;break}}catch{}const l=i.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new an(s,e,r):(s=l[0],u&&await s._set(a,u.toJSON()),await Promise.all(t.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new an(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vc(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(El(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(gl(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Tl(e))return"Blackberry";if(Il(e))return"Webos";if(_l(e))return"Safari";if((e.includes("chrome/")||yl(e))&&!e.includes("edge/"))return"Chrome";if(vl(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function gl(n=Ae()){return/firefox\//i.test(n)}function _l(n=Ae()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function yl(n=Ae()){return/crios\//i.test(n)}function El(n=Ae()){return/iemobile/i.test(n)}function vl(n=Ae()){return/android/i.test(n)}function Tl(n=Ae()){return/blackberry/i.test(n)}function Il(n=Ae()){return/webos/i.test(n)}function vo(n=Ae()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function hm(n=Ae()){var e;return vo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function dm(){return bf()&&document.documentMode===10}function wl(n=Ae()){return vo(n)||vl(n)||Il(n)||Tl(n)||/windows phone/i.test(n)||El(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Al(n,e=[]){let t;switch(n){case"Browser":t=Vc(Ae());break;case"Worker":t=`${Vc(Ae())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${yn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((a,u)=>{try{const l=e(s);a(l)}catch(l){u(l)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pm(n,e={}){return Vt(n,"GET","/v2/passwordPolicy",Gt(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mm=6;class gm{constructor(e){var t,r,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:mm,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,a,u;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(t=l.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),l.isValid&&(l.isValid=(r=l.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(i=l.containsLowercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsUppercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(a=l.containsNumericCharacter)!==null&&a!==void 0?a:!0),l.isValid&&(l.isValid=(u=l.containsNonAlphanumericCharacter)!==null&&u!==void 0?u:!0),l}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _m{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Dc(this),this.idTokenSubscription=new Dc(this),this.beforeStateQueue=new fm(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ul,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Xe(t)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await an.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await li(this,{idToken:e}),r=await Me._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Le(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,u=i==null?void 0:i._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===u)&&(l!=null&&l.user)&&(i=l.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return M(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await hi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Qp()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Le(this.app))return Promise.reject(vt(this));const t=e?he(e):null;return t&&M(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&M(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Le(this.app)?Promise.reject(vt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Le(this.app)?Promise.reject(vt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Xe(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await pm(this),t=new gm(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new fr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await lm(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Xe(e)||this._popupRedirectResolver;M(t,this,"argument-error"),this.redirectPersistenceManager=await an.create(this,[Xe(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(M(u,this,"internal-error"),u.then(()=>{a||s(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return M(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Al(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;if(Le(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&Wp(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function En(n){return he(n)}class Dc{constructor(e){this.auth=e,this.observer=null,this.addObserver=Of(t=>this.observer=t)}get next(){return M(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ki={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ym(n){ki=n}function Rl(n){return ki.loadJS(n)}function Em(){return ki.recaptchaEnterpriseScript}function vm(){return ki.gapiScript}function Tm(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class Im{constructor(){this.enterprise=new wm}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class wm{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const Am="recaptcha-enterprise",bl="NO_RECAPTCHA";class Rm{constructor(e){this.type=Am,this.auth=En(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,u)=>{nm(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const d=new tm(l);return s.tenantId==null?s._agentRecaptchaConfig=d:s._tenantRecaptchaConfigs[s.tenantId]=d,a(d.siteKey)}}).catch(l=>{u(l)})})}function i(s,a,u){const l=window.grecaptcha;Sc(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(d=>{a(d)}).catch(()=>{a(bl)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Im().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(u=>{if(!t&&Sc(window.grecaptcha))i(u,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Em();l.length!==0&&(l+=u),Rl(l).then(()=>{i(u,s,a)}).catch(d=>{a(d)})}}).catch(u=>{a(u)})})}}async function Nc(n,e,t,r=!1,i=!1){const s=new Rm(n);let a;if(i)a=bl;else try{a=await s.verify(t)}catch{a=await s.verify(t,!0)}const u=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const l=u.phoneEnrollmentInfo.phoneNumber,d=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:d,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const l=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return r?Object.assign(u,{captchaResp:a}):Object.assign(u,{captchaResponse:a}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function Oc(n,e,t,r,i){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Nc(n,e,t,t==="getOobCode");return r(n,a)}else return r(n,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await Nc(n,e,t,t==="getOobCode");return r(n,u)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bm(n,e){const t=mo(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(qt(s,e??{}))return i;Fe(i,"already-initialized")}return t.initialize({options:e})}function Sm(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Xe);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Pm(n,e,t){const r=En(n);M(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Sl(e),{host:a,port:u}=Cm(e),l=u===null?"":`:${u}`,d={url:`${s}//${a}${l}/`},p=Object.freeze({host:a,port:u,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){M(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),M(qt(d,r.config.emulator)&&qt(p,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=d,r.emulatorConfig=p,r.settings.appVerificationDisabledForTesting=!0,_n(a)?(el(`${s}//${a}${l}`),tl("Auth",!0)):km()}function Sl(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Cm(n){const e=Sl(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Lc(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Lc(a)}}}function Lc(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function km(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ye("not implemented")}_getIdTokenResponse(e){return Ye("not implemented")}_linkToIdToken(e,t){return Ye("not implemented")}_getReauthenticationResolver(e){return Ye("not implemented")}}async function Vm(n,e){return Vt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dm(n,e){return Ci(n,"POST","/v1/accounts:signInWithPassword",Gt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nm(n,e){return Ci(n,"POST","/v1/accounts:signInWithEmailLink",Gt(n,e))}async function Om(n,e){return Ci(n,"POST","/v1/accounts:signInWithEmailLink",Gt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir extends To{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new ir(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new ir(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oc(e,t,"signInWithPassword",Dm);case"emailLink":return Nm(e,{email:this._email,oobCode:this._password});default:Fe(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oc(e,r,"signUpPassword",Vm);case"emailLink":return Om(e,{idToken:t,email:this._email,oobCode:this._password});default:Fe(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cn(n,e){return Ci(n,"POST","/v1/accounts:signInWithIdp",Gt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lm="http://localhost";class Ht extends To{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ht(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Fe("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=go(t,["providerId","signInMethod"]);if(!r||!i)return null;const a=new Ht(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return cn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,cn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,cn(e,t)}buildRequest(){const e={requestUri:Lm,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=pr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mm(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function xm(n){const e=$n(Hn(n)).link,t=e?$n(Hn(e)).deep_link_id:null,r=$n(Hn(n)).deep_link_id;return(r?$n(Hn(r)).link:null)||r||t||e||n}class Io{constructor(e){var t,r,i,s,a,u;const l=$n(Hn(e)),d=(t=l.apiKey)!==null&&t!==void 0?t:null,p=(r=l.oobCode)!==null&&r!==void 0?r:null,g=Mm((i=l.mode)!==null&&i!==void 0?i:null);M(d&&p&&g,"argument-error"),this.apiKey=d,this.operation=g,this.code=p,this.continueUrl=(s=l.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(a=l.lang)!==null&&a!==void 0?a:null,this.tenantId=(u=l.tenantId)!==null&&u!==void 0?u:null}static parseLink(e){const t=xm(e);try{return new Io(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(){this.providerId=vn.PROVIDER_ID}static credential(e,t){return ir._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Io.parseLink(t);return M(r,"argument-error"),ir._fromEmailAndCode(e,r.code,r.tenantId)}}vn.PROVIDER_ID="password";vn.EMAIL_PASSWORD_SIGN_IN_METHOD="password";vn.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr extends Pl{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt extends gr{constructor(){super("facebook.com")}static credential(e){return Ht._fromParams({providerId:dt.PROVIDER_ID,signInMethod:dt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return dt.credentialFromTaggedObject(e)}static credentialFromError(e){return dt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return dt.credential(e.oauthAccessToken)}catch{return null}}}dt.FACEBOOK_SIGN_IN_METHOD="facebook.com";dt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft extends gr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ht._fromParams({providerId:ft.PROVIDER_ID,signInMethod:ft.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ft.credentialFromTaggedObject(e)}static credentialFromError(e){return ft.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return ft.credential(t,r)}catch{return null}}}ft.GOOGLE_SIGN_IN_METHOD="google.com";ft.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt extends gr{constructor(){super("github.com")}static credential(e){return Ht._fromParams({providerId:pt.PROVIDER_ID,signInMethod:pt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return pt.credentialFromTaggedObject(e)}static credentialFromError(e){return pt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return pt.credential(e.oauthAccessToken)}catch{return null}}}pt.GITHUB_SIGN_IN_METHOD="github.com";pt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt extends gr{constructor(){super("twitter.com")}static credential(e,t){return Ht._fromParams({providerId:mt.PROVIDER_ID,signInMethod:mt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return mt.credentialFromTaggedObject(e)}static credentialFromError(e){return mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return mt.credential(t,r)}catch{return null}}}mt.TWITTER_SIGN_IN_METHOD="twitter.com";mt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await Me._fromIdTokenResponse(e,r,i),a=Mc(r);return new hn({user:s,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=Mc(r);return new hn({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function Mc(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di extends st{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,di.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new di(e,t,r,i)}}function Cl(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?di._fromErrorAndOperation(n,s,e,r):s})}async function Fm(n,e,t=!1){const r=await rr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return hn._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Um(n,e,t=!1){const{auth:r}=n;if(Le(r.app))return Promise.reject(vt(r));const i="reauthenticate";try{const s=await rr(n,Cl(r,i,e,n),t);M(s.idToken,r,"internal-error");const a=Eo(s.idToken);M(a,r,"internal-error");const{sub:u}=a;return M(n.uid===u,r,"user-mismatch"),hn._forOperation(n,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Fe(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kl(n,e,t=!1){if(Le(n.app))return Promise.reject(vt(n));const r="signIn",i=await Cl(n,r,e),s=await hn._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}async function Bm(n,e){return kl(En(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jm(n){const e=En(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function qm(n,e,t){return Le(n.app)?Promise.reject(vt(n)):Bm(he(n),vn.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&jm(n),r})}function $m(n,e,t,r){return he(n).onIdTokenChanged(e,t,r)}function Hm(n,e,t){return he(n).beforeAuthStateChanged(e,t)}function zm(n,e,t,r){return he(n).onAuthStateChanged(e,t,r)}function Wm(n){return he(n).signOut()}const fi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(fi,"1"),this.storage.removeItem(fi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gm=1e3,Km=10;class Dl extends Vl{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=wl(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,l)=>{this.notifyListeners(a,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);dm()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Km):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Gm)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Dl.type="LOCAL";const Qm=Dl;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl extends Vl{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Nl.type="SESSION";const Ol=Nl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jm(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new Vi(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const u=Array.from(a).map(async d=>d(t.origin,s)),l=await Jm(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Vi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ym{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((u,l)=>{const d=wo("",20);i.port1.start();const p=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(g){const E=g;if(E.data.eventId===d)switch(E.data.status){case"ack":clearTimeout(p),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),u(E.data.response);break;default:clearTimeout(p),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qe(){return window}function Xm(n){qe().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ll(){return typeof qe().WorkerGlobalScope<"u"&&typeof qe().importScripts=="function"}async function Zm(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function eg(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function tg(){return Ll()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml="firebaseLocalStorageDb",ng=1,pi="firebaseLocalStorage",xl="fbase_key";class _r{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Di(n,e){return n.transaction([pi],e?"readwrite":"readonly").objectStore(pi)}function rg(){const n=indexedDB.deleteDatabase(Ml);return new _r(n).toPromise()}function Ws(){const n=indexedDB.open(Ml,ng);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(pi,{keyPath:xl})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(pi)?e(r):(r.close(),await rg(),e(await Ws()))})})}async function xc(n,e,t){const r=Di(n,!0).put({[xl]:e,value:t});return new _r(r).toPromise()}async function ig(n,e){const t=Di(n,!1).get(e),r=await new _r(t).toPromise();return r===void 0?null:r.value}function Fc(n,e){const t=Di(n,!0).delete(e);return new _r(t).toPromise()}const sg=800,og=3;class Fl{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Ws(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>og)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Ll()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Vi._getInstance(tg()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Zm(),!this.activeServiceWorker)return;this.sender=new Ym(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||eg()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Ws();return await xc(e,fi,"1"),await Fc(e,fi),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>xc(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>ig(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Fc(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Di(i,!1).getAll();return new _r(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),sg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Fl.type="LOCAL";const ag=Fl;new mr(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cg(n,e){return e?Xe(e):(M(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ao extends To{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return cn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return cn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return cn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function ug(n){return kl(n.auth,new Ao(n),n.bypassAuthState)}function lg(n){const{auth:e,user:t}=n;return M(t,e,"internal-error"),Um(t,new Ao(n),n.bypassAuthState)}async function hg(n){const{auth:e,user:t}=n;return M(t,e,"internal-error"),Fm(t,new Ao(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:a,type:u}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(l))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return ug;case"linkViaPopup":case"linkViaRedirect":return hg;case"reauthViaPopup":case"reauthViaRedirect":return lg;default:Fe(this.auth,"internal-error")}}resolve(e){nt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){nt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dg=new mr(2e3,1e4);class sn extends Ul{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,sn.currentPopupAction&&sn.currentPopupAction.cancel(),sn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return M(e,this.auth,"internal-error"),e}async onExecution(){nt(this.filter.length===1,"Popup operations only handle one event");const e=wo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(je(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(je(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,sn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(je(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,dg.get())};e()}}sn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fg="pendingRedirect",Zr=new Map;class pg extends Ul{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Zr.get(this.auth._key());if(!e){try{const r=await mg(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Zr.set(this.auth._key(),e)}return this.bypassAuthState||Zr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function mg(n,e){const t=yg(e),r=_g(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}function gg(n,e){Zr.set(n._key(),e)}function _g(n){return Xe(n._redirectPersistence)}function yg(n){return Xr(fg,n.config.apiKey,n.name)}async function Eg(n,e,t=!1){if(Le(n.app))return Promise.reject(vt(n));const r=En(n),i=cg(r,e),a=await new pg(r,i,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vg=600*1e3;class Tg{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Ig(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Bl(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(je(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=vg&&this.cachedEventUids.clear(),this.cachedEventUids.has(Uc(e))}saveEventToCache(e){this.cachedEventUids.add(Uc(e)),this.lastProcessedEventTime=Date.now()}}function Uc(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Bl({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Ig(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Bl(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wg(n,e={}){return Vt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ag=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Rg=/^https?/;async function bg(n){if(n.config.emulator)return;const{authorizedDomains:e}=await wg(n);for(const t of e)try{if(Sg(t))return}catch{}Fe(n,"unauthorized-domain")}function Sg(n){const e=Hs(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Rg.test(t))return!1;if(Ag.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pg=new mr(3e4,6e4);function Bc(){const n=qe().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Cg(n){return new Promise((e,t)=>{var r,i,s;function a(){Bc(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Bc(),t(je(n,"network-request-failed"))},timeout:Pg.get()})}if(!((i=(r=qe().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=qe().gapi)===null||s===void 0)&&s.load)a();else{const u=Tm("iframefcb");return qe()[u]=()=>{gapi.load?a():t(je(n,"network-request-failed"))},Rl(`${vm()}?onload=${u}`).catch(l=>t(l))}}).catch(e=>{throw ei=null,e})}let ei=null;function kg(n){return ei=ei||Cg(n),ei}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vg=new mr(5e3,15e3),Dg="__/auth/iframe",Ng="emulator/auth/iframe",Og={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Lg=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Mg(n){const e=n.config;M(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?yo(e,Ng):`https://${n.config.authDomain}/${Dg}`,r={apiKey:e.apiKey,appName:n.name,v:yn},i=Lg.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${pr(r).slice(1)}`}async function xg(n){const e=await kg(n),t=qe().gapi;return M(t,n,"internal-error"),e.open({where:document.body,url:Mg(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Og,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=je(n,"network-request-failed"),u=qe().setTimeout(()=>{s(a)},Vg.get());function l(){qe().clearTimeout(u),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fg={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ug=500,Bg=600,jg="_blank",qg="http://localhost";class jc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function $g(n,e,t,r=Ug,i=Bg){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const l=Object.assign(Object.assign({},Fg),{width:r.toString(),height:i.toString(),top:s,left:a}),d=Ae().toLowerCase();t&&(u=yl(d)?jg:t),gl(d)&&(e=e||qg,l.scrollbars="yes");const p=Object.entries(l).reduce((E,[S,C])=>`${E}${S}=${C},`,"");if(hm(d)&&u!=="_self")return Hg(e||"",u),new jc(null);const g=window.open(e||"",u,p);M(g,n,"popup-blocked");try{g.focus()}catch{}return new jc(g)}function Hg(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zg="__/auth/handler",Wg="emulator/auth/handler",Gg=encodeURIComponent("fac");async function qc(n,e,t,r,i,s){M(n.config.authDomain,n,"auth-domain-config-required"),M(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:yn,eventId:i};if(e instanceof Pl){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Nf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,g]of Object.entries({}))a[p]=g}if(e instanceof gr){const p=e.getScopes().filter(g=>g!=="");p.length>0&&(a.scopes=p.join(","))}n.tenantId&&(a.tid=n.tenantId);const u=a;for(const p of Object.keys(u))u[p]===void 0&&delete u[p];const l=await n._getAppCheckToken(),d=l?`#${Gg}=${encodeURIComponent(l)}`:"";return`${Kg(n)}?${pr(u).slice(1)}${d}`}function Kg({config:n}){return n.emulator?yo(n,Wg):`https://${n.authDomain}/${zg}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ps="webStorageSupport";class Qg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ol,this._completeRedirectFn=Eg,this._overrideRedirectResult=gg}async _openPopup(e,t,r,i){var s;nt((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await qc(e,t,r,Hs(),i);return $g(e,a,wo())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await qc(e,t,r,Hs(),i);return Xm(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(nt(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await xg(e),r=new Tg(e);return t.register("authEvent",i=>(M(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ps,{type:Ps},i=>{var s;const a=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Ps];a!==void 0&&t(!!a),Fe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=bg(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return wl()||_l()||vo()}}const Jg=Qg;var $c="@firebase/auth",Hc="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yg{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){M(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xg(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Zg(n){ln(new $t("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=r.options;M(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Al(n)},d=new _m(r,i,s,l);return Sm(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),ln(new $t("auth-internal",e=>{const t=En(e.getProvider("auth").getImmediate());return(r=>new Yg(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Et($c,Hc,Xg(n)),Et($c,Hc,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e_=300,t_=Zu("authIdTokenMaxAge")||e_;let zc=null;const n_=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>t_)return;const i=t==null?void 0:t.token;zc!==i&&(zc=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function r_(n=sl()){const e=mo(n,"auth");if(e.isInitialized())return e.getImmediate();const t=bm(n,{popupRedirectResolver:Jg,persistence:[ag,Qm,Ol]}),r=Zu("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=n_(s.toString());Hm(t,a,()=>a(t.currentUser)),$m(t,u=>a(u))}}const i=Yu("auth");return i&&Pm(t,`http://${i}`),t}function i_(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}ym({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=je("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",i_().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Zg("Browser");var s_="firebase",o_="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Et(s_,o_,"app");var Wc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Tt,jl;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,m){function y(){}y.prototype=m.prototype,T.D=m.prototype,T.prototype=new y,T.prototype.constructor=T,T.C=function(v,I,A){for(var _=Array(arguments.length-2),Ke=2;Ke<arguments.length;Ke++)_[Ke-2]=arguments[Ke];return m.prototype[I].apply(v,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(T,m,y){y||(y=0);var v=Array(16);if(typeof m=="string")for(var I=0;16>I;++I)v[I]=m.charCodeAt(y++)|m.charCodeAt(y++)<<8|m.charCodeAt(y++)<<16|m.charCodeAt(y++)<<24;else for(I=0;16>I;++I)v[I]=m[y++]|m[y++]<<8|m[y++]<<16|m[y++]<<24;m=T.g[0],y=T.g[1],I=T.g[2];var A=T.g[3],_=m+(A^y&(I^A))+v[0]+3614090360&4294967295;m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[1]+3905402710&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[2]+606105819&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[3]+3250441966&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(A^y&(I^A))+v[4]+4118548399&4294967295,m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[5]+1200080426&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[6]+2821735955&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[7]+4249261313&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(A^y&(I^A))+v[8]+1770035416&4294967295,m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[9]+2336552879&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[10]+4294925233&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[11]+2304563134&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(A^y&(I^A))+v[12]+1804603682&4294967295,m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[13]+4254626195&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[14]+2792965006&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[15]+1236535329&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(I^A&(y^I))+v[1]+4129170786&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[6]+3225465664&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[11]+643717713&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[0]+3921069994&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^A&(y^I))+v[5]+3593408605&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[10]+38016083&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[15]+3634488961&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[4]+3889429448&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^A&(y^I))+v[9]+568446438&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[14]+3275163606&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[3]+4107603335&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[8]+1163531501&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^A&(y^I))+v[13]+2850285829&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[2]+4243563512&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[7]+1735328473&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[12]+2368359562&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(y^I^A)+v[5]+4294588738&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[8]+2272392833&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[11]+1839030562&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[14]+4259657740&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^A)+v[1]+2763975236&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[4]+1272893353&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[7]+4139469664&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[10]+3200236656&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^A)+v[13]+681279174&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[0]+3936430074&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[3]+3572445317&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[6]+76029189&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^A)+v[9]+3654602809&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[12]+3873151461&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[15]+530742520&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[2]+3299628645&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(I^(y|~A))+v[0]+4096336452&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[7]+1126891415&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[14]+2878612391&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[5]+4237533241&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~A))+v[12]+1700485571&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[3]+2399980690&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[10]+4293915773&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[1]+2240044497&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~A))+v[8]+1873313359&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[15]+4264355552&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[6]+2734768916&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[13]+1309151649&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~A))+v[4]+4149444226&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[11]+3174756917&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[2]+718787259&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[9]+3951481745&4294967295,T.g[0]=T.g[0]+m&4294967295,T.g[1]=T.g[1]+(I+(_<<21&4294967295|_>>>11))&4294967295,T.g[2]=T.g[2]+I&4294967295,T.g[3]=T.g[3]+A&4294967295}r.prototype.u=function(T,m){m===void 0&&(m=T.length);for(var y=m-this.blockSize,v=this.B,I=this.h,A=0;A<m;){if(I==0)for(;A<=y;)i(this,T,A),A+=this.blockSize;if(typeof T=="string"){for(;A<m;)if(v[I++]=T.charCodeAt(A++),I==this.blockSize){i(this,v),I=0;break}}else for(;A<m;)if(v[I++]=T[A++],I==this.blockSize){i(this,v),I=0;break}}this.h=I,this.o+=m},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var m=1;m<T.length-8;++m)T[m]=0;var y=8*this.o;for(m=T.length-8;m<T.length;++m)T[m]=y&255,y/=256;for(this.u(T),T=Array(16),m=y=0;4>m;++m)for(var v=0;32>v;v+=8)T[y++]=this.g[m]>>>v&255;return T};function s(T,m){var y=u;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=m(T)}function a(T,m){this.h=m;for(var y=[],v=!0,I=T.length-1;0<=I;I--){var A=T[I]|0;v&&A==m||(y[I]=A,v=!1)}this.g=y}var u={};function l(T){return-128<=T&&128>T?s(T,function(m){return new a([m|0],0>m?-1:0)}):new a([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return g;if(0>T)return V(d(-T));for(var m=[],y=1,v=0;T>=y;v++)m[v]=T/y|0,y*=4294967296;return new a(m,0)}function p(T,m){if(T.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(T.charAt(0)=="-")return V(p(T.substring(1),m));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(m,8)),v=g,I=0;I<T.length;I+=8){var A=Math.min(8,T.length-I),_=parseInt(T.substring(I,I+A),m);8>A?(A=d(Math.pow(m,A)),v=v.j(A).add(d(_))):(v=v.j(y),v=v.add(d(_)))}return v}var g=l(0),E=l(1),S=l(16777216);n=a.prototype,n.m=function(){if(O(this))return-V(this).m();for(var T=0,m=1,y=0;y<this.g.length;y++){var v=this.i(y);T+=(0<=v?v:4294967296+v)*m,m*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(C(this))return"0";if(O(this))return"-"+V(this).toString(T);for(var m=d(Math.pow(T,6)),y=this,v="";;){var I=te(y,m).g;y=H(y,I.j(m));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(T);if(y=I,C(y))return A+v;for(;6>A.length;)A="0"+A;v=A+v}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function C(T){if(T.h!=0)return!1;for(var m=0;m<T.g.length;m++)if(T.g[m]!=0)return!1;return!0}function O(T){return T.h==-1}n.l=function(T){return T=H(this,T),O(T)?-1:C(T)?0:1};function V(T){for(var m=T.g.length,y=[],v=0;v<m;v++)y[v]=~T.g[v];return new a(y,~T.h).add(E)}n.abs=function(){return O(this)?V(this):this},n.add=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0,I=0;I<=m;I++){var A=v+(this.i(I)&65535)+(T.i(I)&65535),_=(A>>>16)+(this.i(I)>>>16)+(T.i(I)>>>16);v=_>>>16,A&=65535,_&=65535,y[I]=_<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function H(T,m){return T.add(V(m))}n.j=function(T){if(C(this)||C(T))return g;if(O(this))return O(T)?V(this).j(V(T)):V(V(this).j(T));if(O(T))return V(this.j(V(T)));if(0>this.l(S)&&0>T.l(S))return d(this.m()*T.m());for(var m=this.g.length+T.g.length,y=[],v=0;v<2*m;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(var I=0;I<T.g.length;I++){var A=this.i(v)>>>16,_=this.i(v)&65535,Ke=T.i(I)>>>16,bn=T.i(I)&65535;y[2*v+2*I]+=_*bn,B(y,2*v+2*I),y[2*v+2*I+1]+=A*bn,B(y,2*v+2*I+1),y[2*v+2*I+1]+=_*Ke,B(y,2*v+2*I+1),y[2*v+2*I+2]+=A*Ke,B(y,2*v+2*I+2)}for(v=0;v<m;v++)y[v]=y[2*v+1]<<16|y[2*v];for(v=m;v<2*m;v++)y[v]=0;return new a(y,0)};function B(T,m){for(;(T[m]&65535)!=T[m];)T[m+1]+=T[m]>>>16,T[m]&=65535,m++}function z(T,m){this.g=T,this.h=m}function te(T,m){if(C(m))throw Error("division by zero");if(C(T))return new z(g,g);if(O(T))return m=te(V(T),m),new z(V(m.g),V(m.h));if(O(m))return m=te(T,V(m)),new z(V(m.g),m.h);if(30<T.g.length){if(O(T)||O(m))throw Error("slowDivide_ only works with positive integers.");for(var y=E,v=m;0>=v.l(T);)y=De(y),v=De(v);var I=se(y,1),A=se(v,1);for(v=se(v,2),y=se(y,2);!C(v);){var _=A.add(v);0>=_.l(T)&&(I=I.add(y),A=_),v=se(v,1),y=se(y,1)}return m=H(T,I.j(m)),new z(I,m)}for(I=g;0<=T.l(m);){for(y=Math.max(1,Math.floor(T.m()/m.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),A=d(y),_=A.j(m);O(_)||0<_.l(T);)y-=v,A=d(y),_=A.j(m);C(A)&&(A=E),I=I.add(A),T=H(T,_)}return new z(I,T)}n.A=function(T){return te(this,T).h},n.and=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)&T.i(v);return new a(y,this.h&T.h)},n.or=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)|T.i(v);return new a(y,this.h|T.h)},n.xor=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)^T.i(v);return new a(y,this.h^T.h)};function De(T){for(var m=T.g.length+1,y=[],v=0;v<m;v++)y[v]=T.i(v)<<1|T.i(v-1)>>>31;return new a(y,T.h)}function se(T,m){var y=m>>5;m%=32;for(var v=T.g.length-y,I=[],A=0;A<v;A++)I[A]=0<m?T.i(A+y)>>>m|T.i(A+y+1)<<32-m:T.i(A+y);return new a(I,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,jl=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=p,Tt=a}).apply(typeof Wc<"u"?Wc:typeof self<"u"?self:typeof window<"u"?window:{});var Hr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ql,zn,$l,ti,Gs,Hl,zl,Wl;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,c,h){return o==Array.prototype||o==Object.prototype||(o[c]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Hr=="object"&&Hr];for(var c=0;c<o.length;++c){var h=o[c];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function i(o,c){if(c)e:{var h=r;o=o.split(".");for(var f=0;f<o.length-1;f++){var w=o[f];if(!(w in h))break e;h=h[w]}o=o[o.length-1],f=h[o],c=c(f),c!=f&&c!=null&&e(h,o,{configurable:!0,writable:!0,value:c})}}function s(o,c){o instanceof String&&(o+="");var h=0,f=!1,w={next:function(){if(!f&&h<o.length){var R=h++;return{value:c(R,o[R]),done:!1}}return f=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}i("Array.prototype.values",function(o){return o||function(){return s(this,function(c,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},u=this||self;function l(o){var c=typeof o;return c=c!="object"?c:o?Array.isArray(o)?"array":c:"null",c=="array"||c=="object"&&typeof o.length=="number"}function d(o){var c=typeof o;return c=="object"&&o!=null||c=="function"}function p(o,c,h){return o.call.apply(o.bind,arguments)}function g(o,c,h){if(!o)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,f),o.apply(c,w)}}return function(){return o.apply(c,arguments)}}function E(o,c,h){return E=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?p:g,E.apply(null,arguments)}function S(o,c){var h=Array.prototype.slice.call(arguments,1);return function(){var f=h.slice();return f.push.apply(f,arguments),o.apply(this,f)}}function C(o,c){function h(){}h.prototype=c.prototype,o.aa=c.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(f,w,R){for(var k=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)k[Y-2]=arguments[Y];return c.prototype[w].apply(f,k)}}function O(o){const c=o.length;if(0<c){const h=Array(c);for(let f=0;f<c;f++)h[f]=o[f];return h}return[]}function V(o,c){for(let h=1;h<arguments.length;h++){const f=arguments[h];if(l(f)){const w=o.length||0,R=f.length||0;o.length=w+R;for(let k=0;k<R;k++)o[w+k]=f[k]}else o.push(f)}}class H{constructor(c,h){this.i=c,this.j=h,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function B(o){return/^[\s\xa0]*$/.test(o)}function z(){var o=u.navigator;return o&&(o=o.userAgent)?o:""}function te(o){return te[" "](o),o}te[" "]=function(){};var De=z().indexOf("Gecko")!=-1&&!(z().toLowerCase().indexOf("webkit")!=-1&&z().indexOf("Edge")==-1)&&!(z().indexOf("Trident")!=-1||z().indexOf("MSIE")!=-1)&&z().indexOf("Edge")==-1;function se(o,c,h){for(const f in o)c.call(h,o[f],f,o)}function T(o,c){for(const h in o)c.call(void 0,o[h],h,o)}function m(o){const c={};for(const h in o)c[h]=o[h];return c}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(o,c){let h,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(h in f)o[h]=f[h];for(let R=0;R<y.length;R++)h=y[R],Object.prototype.hasOwnProperty.call(f,h)&&(o[h]=f[h])}}function I(o){var c=1;o=o.split(":");const h=[];for(;0<c&&o.length;)h.push(o.shift()),c--;return o.length&&h.push(o.join(":")),h}function A(o){u.setTimeout(()=>{throw o},0)}function _(){var o=Xi;let c=null;return o.g&&(c=o.g,o.g=o.g.next,o.g||(o.h=null),c.next=null),c}class Ke{constructor(){this.h=this.g=null}add(c,h){const f=bn.get();f.set(c,h),this.h?this.h.next=f:this.g=f,this.h=f}}var bn=new H(()=>new Ad,o=>o.reset());class Ad{constructor(){this.next=this.g=this.h=null}set(c,h){this.h=c,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Sn,Pn=!1,Xi=new Ke,pa=()=>{const o=u.Promise.resolve(void 0);Sn=()=>{o.then(Rd)}};var Rd=()=>{for(var o;o=_();){try{o.h.call(o.g)}catch(h){A(h)}var c=bn;c.j(o),100>c.h&&(c.h++,o.next=c.g,c.g=o)}Pn=!1};function at(){this.s=this.s,this.C=this.C}at.prototype.s=!1,at.prototype.ma=function(){this.s||(this.s=!0,this.N())},at.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function _e(o,c){this.type=o,this.g=this.target=c,this.defaultPrevented=!1}_e.prototype.h=function(){this.defaultPrevented=!0};var bd=(function(){if(!u.addEventListener||!Object.defineProperty)return!1;var o=!1,c=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};u.addEventListener("test",h,c),u.removeEventListener("test",h,c)}catch{}return o})();function Cn(o,c){if(_e.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,f=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=c,c=o.relatedTarget){if(De){e:{try{te(c.nodeName);var w=!0;break e}catch{}w=!1}w||(c=null)}}else h=="mouseover"?c=o.fromElement:h=="mouseout"&&(c=o.toElement);this.relatedTarget=c,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Sd[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Cn.aa.h.call(this)}}C(Cn,_e);var Sd={2:"touch",3:"pen",4:"mouse"};Cn.prototype.h=function(){Cn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Ar="closure_listenable_"+(1e6*Math.random()|0),Pd=0;function Cd(o,c,h,f,w){this.listener=o,this.proxy=null,this.src=c,this.type=h,this.capture=!!f,this.ha=w,this.key=++Pd,this.da=this.fa=!1}function Rr(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function br(o){this.src=o,this.g={},this.h=0}br.prototype.add=function(o,c,h,f,w){var R=o.toString();o=this.g[R],o||(o=this.g[R]=[],this.h++);var k=es(o,c,f,w);return-1<k?(c=o[k],h||(c.fa=!1)):(c=new Cd(c,this.src,R,!!f,w),c.fa=h,o.push(c)),c};function Zi(o,c){var h=c.type;if(h in o.g){var f=o.g[h],w=Array.prototype.indexOf.call(f,c,void 0),R;(R=0<=w)&&Array.prototype.splice.call(f,w,1),R&&(Rr(c),o.g[h].length==0&&(delete o.g[h],o.h--))}}function es(o,c,h,f){for(var w=0;w<o.length;++w){var R=o[w];if(!R.da&&R.listener==c&&R.capture==!!h&&R.ha==f)return w}return-1}var ts="closure_lm_"+(1e6*Math.random()|0),ns={};function ma(o,c,h,f,w){if(Array.isArray(c)){for(var R=0;R<c.length;R++)ma(o,c[R],h,f,w);return null}return h=ya(h),o&&o[Ar]?o.K(c,h,d(f)?!!f.capture:!1,w):kd(o,c,h,!1,f,w)}function kd(o,c,h,f,w,R){if(!c)throw Error("Invalid event type");var k=d(w)?!!w.capture:!!w,Y=is(o);if(Y||(o[ts]=Y=new br(o)),h=Y.add(c,h,f,k,R),h.proxy)return h;if(f=Vd(),h.proxy=f,f.src=o,f.listener=h,o.addEventListener)bd||(w=k),w===void 0&&(w=!1),o.addEventListener(c.toString(),f,w);else if(o.attachEvent)o.attachEvent(_a(c.toString()),f);else if(o.addListener&&o.removeListener)o.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Vd(){function o(h){return c.call(o.src,o.listener,h)}const c=Dd;return o}function ga(o,c,h,f,w){if(Array.isArray(c))for(var R=0;R<c.length;R++)ga(o,c[R],h,f,w);else f=d(f)?!!f.capture:!!f,h=ya(h),o&&o[Ar]?(o=o.i,c=String(c).toString(),c in o.g&&(R=o.g[c],h=es(R,h,f,w),-1<h&&(Rr(R[h]),Array.prototype.splice.call(R,h,1),R.length==0&&(delete o.g[c],o.h--)))):o&&(o=is(o))&&(c=o.g[c.toString()],o=-1,c&&(o=es(c,h,f,w)),(h=-1<o?c[o]:null)&&rs(h))}function rs(o){if(typeof o!="number"&&o&&!o.da){var c=o.src;if(c&&c[Ar])Zi(c.i,o);else{var h=o.type,f=o.proxy;c.removeEventListener?c.removeEventListener(h,f,o.capture):c.detachEvent?c.detachEvent(_a(h),f):c.addListener&&c.removeListener&&c.removeListener(f),(h=is(c))?(Zi(h,o),h.h==0&&(h.src=null,c[ts]=null)):Rr(o)}}}function _a(o){return o in ns?ns[o]:ns[o]="on"+o}function Dd(o,c){if(o.da)o=!0;else{c=new Cn(c,this);var h=o.listener,f=o.ha||o.src;o.fa&&rs(o),o=h.call(f,c)}return o}function is(o){return o=o[ts],o instanceof br?o:null}var ss="__closure_events_fn_"+(1e9*Math.random()>>>0);function ya(o){return typeof o=="function"?o:(o[ss]||(o[ss]=function(c){return o.handleEvent(c)}),o[ss])}function ye(){at.call(this),this.i=new br(this),this.M=this,this.F=null}C(ye,at),ye.prototype[Ar]=!0,ye.prototype.removeEventListener=function(o,c,h,f){ga(this,o,c,h,f)};function Re(o,c){var h,f=o.F;if(f)for(h=[];f;f=f.F)h.push(f);if(o=o.M,f=c.type||c,typeof c=="string")c=new _e(c,o);else if(c instanceof _e)c.target=c.target||o;else{var w=c;c=new _e(f,o),v(c,w)}if(w=!0,h)for(var R=h.length-1;0<=R;R--){var k=c.g=h[R];w=Sr(k,f,!0,c)&&w}if(k=c.g=o,w=Sr(k,f,!0,c)&&w,w=Sr(k,f,!1,c)&&w,h)for(R=0;R<h.length;R++)k=c.g=h[R],w=Sr(k,f,!1,c)&&w}ye.prototype.N=function(){if(ye.aa.N.call(this),this.i){var o=this.i,c;for(c in o.g){for(var h=o.g[c],f=0;f<h.length;f++)Rr(h[f]);delete o.g[c],o.h--}}this.F=null},ye.prototype.K=function(o,c,h,f){return this.i.add(String(o),c,!1,h,f)},ye.prototype.L=function(o,c,h,f){return this.i.add(String(o),c,!0,h,f)};function Sr(o,c,h,f){if(c=o.i.g[String(c)],!c)return!0;c=c.concat();for(var w=!0,R=0;R<c.length;++R){var k=c[R];if(k&&!k.da&&k.capture==h){var Y=k.listener,fe=k.ha||k.src;k.fa&&Zi(o.i,k),w=Y.call(fe,f)!==!1&&w}}return w&&!f.defaultPrevented}function Ea(o,c,h){if(typeof o=="function")h&&(o=E(o,h));else if(o&&typeof o.handleEvent=="function")o=E(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:u.setTimeout(o,c||0)}function va(o){o.g=Ea(()=>{o.g=null,o.i&&(o.i=!1,va(o))},o.l);const c=o.h;o.h=null,o.m.apply(null,c)}class Nd extends at{constructor(c,h){super(),this.m=c,this.l=h,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:va(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function kn(o){at.call(this),this.h=o,this.g={}}C(kn,at);var Ta=[];function Ia(o){se(o.g,function(c,h){this.g.hasOwnProperty(h)&&rs(c)},o),o.g={}}kn.prototype.N=function(){kn.aa.N.call(this),Ia(this)},kn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var os=u.JSON.stringify,Od=u.JSON.parse,Ld=class{stringify(o){return u.JSON.stringify(o,void 0)}parse(o){return u.JSON.parse(o,void 0)}};function as(){}as.prototype.h=null;function wa(o){return o.h||(o.h=o.i())}function Aa(){}var Vn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function cs(){_e.call(this,"d")}C(cs,_e);function us(){_e.call(this,"c")}C(us,_e);var Ot={},Ra=null;function Pr(){return Ra=Ra||new ye}Ot.La="serverreachability";function ba(o){_e.call(this,Ot.La,o)}C(ba,_e);function Dn(o){const c=Pr();Re(c,new ba(c))}Ot.STAT_EVENT="statevent";function Sa(o,c){_e.call(this,Ot.STAT_EVENT,o),this.stat=c}C(Sa,_e);function be(o){const c=Pr();Re(c,new Sa(c,o))}Ot.Ma="timingevent";function Pa(o,c){_e.call(this,Ot.Ma,o),this.size=c}C(Pa,_e);function Nn(o,c){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){o()},c)}function On(){this.g=!0}On.prototype.xa=function(){this.g=!1};function Md(o,c,h,f,w,R){o.info(function(){if(o.g)if(R)for(var k="",Y=R.split("&"),fe=0;fe<Y.length;fe++){var Q=Y[fe].split("=");if(1<Q.length){var Ee=Q[0];Q=Q[1];var ve=Ee.split("_");k=2<=ve.length&&ve[1]=="type"?k+(Ee+"="+Q+"&"):k+(Ee+"=redacted&")}}else k=null;else k=R;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+c+`
`+h+`
`+k})}function xd(o,c,h,f,w,R,k){o.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+c+`
`+h+`
`+R+" "+k})}function Jt(o,c,h,f){o.info(function(){return"XMLHTTP TEXT ("+c+"): "+Ud(o,h)+(f?" "+f:"")})}function Fd(o,c){o.info(function(){return"TIMEOUT: "+c})}On.prototype.info=function(){};function Ud(o,c){if(!o.g)return c;if(!c)return null;try{var h=JSON.parse(c);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var f=h[o];if(!(2>f.length)){var w=f[1];if(Array.isArray(w)&&!(1>w.length)){var R=w[0];if(R!="noop"&&R!="stop"&&R!="close")for(var k=1;k<w.length;k++)w[k]=""}}}}return os(h)}catch{return c}}var Cr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ca={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ls;function kr(){}C(kr,as),kr.prototype.g=function(){return new XMLHttpRequest},kr.prototype.i=function(){return{}},ls=new kr;function ct(o,c,h,f){this.j=o,this.i=c,this.l=h,this.R=f||1,this.U=new kn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ka}function ka(){this.i=null,this.g="",this.h=!1}var Va={},hs={};function ds(o,c,h){o.L=1,o.v=Or(Qe(c)),o.m=h,o.P=!0,Da(o,null)}function Da(o,c){o.F=Date.now(),Vr(o),o.A=Qe(o.v);var h=o.A,f=o.R;Array.isArray(f)||(f=[String(f)]),Wa(h.i,"t",f),o.C=0,h=o.j.J,o.h=new ka,o.g=lc(o.j,h?c:null,!o.m),0<o.O&&(o.M=new Nd(E(o.Y,o,o.g),o.O)),c=o.U,h=o.g,f=o.ca;var w="readystatechange";Array.isArray(w)||(w&&(Ta[0]=w.toString()),w=Ta);for(var R=0;R<w.length;R++){var k=ma(h,w[R],f||c.handleEvent,!1,c.h||c);if(!k)break;c.g[k.key]=k}c=o.H?m(o.H):{},o.m?(o.u||(o.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,c)):(o.u="GET",o.g.ea(o.A,o.u,null,c)),Dn(),Md(o.i,o.u,o.A,o.l,o.R,o.m)}ct.prototype.ca=function(o){o=o.target;const c=this.M;c&&Je(o)==3?c.j():this.Y(o)},ct.prototype.Y=function(o){try{if(o==this.g)e:{const ve=Je(this.g);var c=this.g.Ba();const Zt=this.g.Z();if(!(3>ve)&&(ve!=3||this.g&&(this.h.h||this.g.oa()||Za(this.g)))){this.J||ve!=4||c==7||(c==8||0>=Zt?Dn(3):Dn(2)),fs(this);var h=this.g.Z();this.X=h;t:if(Na(this)){var f=Za(this.g);o="";var w=f.length,R=Je(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Lt(this),Ln(this);var k="";break t}this.h.i=new u.TextDecoder}for(c=0;c<w;c++)this.h.h=!0,o+=this.h.i.decode(f[c],{stream:!(R&&c==w-1)});f.length=0,this.h.g+=o,this.C=0,k=this.h.g}else k=this.g.oa();if(this.o=h==200,xd(this.i,this.u,this.A,this.l,this.R,ve,h),this.o){if(this.T&&!this.K){t:{if(this.g){var Y,fe=this.g;if((Y=fe.g?fe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!B(Y)){var Q=Y;break t}}Q=null}if(h=Q)Jt(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ps(this,h);else{this.o=!1,this.s=3,be(12),Lt(this),Ln(this);break e}}if(this.P){h=!0;let Oe;for(;!this.J&&this.C<k.length;)if(Oe=Bd(this,k),Oe==hs){ve==4&&(this.s=4,be(14),h=!1),Jt(this.i,this.l,null,"[Incomplete Response]");break}else if(Oe==Va){this.s=4,be(15),Jt(this.i,this.l,k,"[Invalid Chunk]"),h=!1;break}else Jt(this.i,this.l,Oe,null),ps(this,Oe);if(Na(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ve!=4||k.length!=0||this.h.h||(this.s=1,be(16),h=!1),this.o=this.o&&h,!h)Jt(this.i,this.l,k,"[Invalid Chunked Response]"),Lt(this),Ln(this);else if(0<k.length&&!this.W){this.W=!0;var Ee=this.j;Ee.g==this&&Ee.ba&&!Ee.M&&(Ee.j.info("Great, no buffering proxy detected. Bytes received: "+k.length),vs(Ee),Ee.M=!0,be(11))}}else Jt(this.i,this.l,k,null),ps(this,k);ve==4&&Lt(this),this.o&&!this.J&&(ve==4?oc(this.j,this):(this.o=!1,Vr(this)))}else rf(this.g),h==400&&0<k.indexOf("Unknown SID")?(this.s=3,be(12)):(this.s=0,be(13)),Lt(this),Ln(this)}}}catch{}finally{}};function Na(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Bd(o,c){var h=o.C,f=c.indexOf(`
`,h);return f==-1?hs:(h=Number(c.substring(h,f)),isNaN(h)?Va:(f+=1,f+h>c.length?hs:(c=c.slice(f,f+h),o.C=f+h,c)))}ct.prototype.cancel=function(){this.J=!0,Lt(this)};function Vr(o){o.S=Date.now()+o.I,Oa(o,o.I)}function Oa(o,c){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Nn(E(o.ba,o),c)}function fs(o){o.B&&(u.clearTimeout(o.B),o.B=null)}ct.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Fd(this.i,this.A),this.L!=2&&(Dn(),be(17)),Lt(this),this.s=2,Ln(this)):Oa(this,this.S-o)};function Ln(o){o.j.G==0||o.J||oc(o.j,o)}function Lt(o){fs(o);var c=o.M;c&&typeof c.ma=="function"&&c.ma(),o.M=null,Ia(o.U),o.g&&(c=o.g,o.g=null,c.abort(),c.ma())}function ps(o,c){try{var h=o.j;if(h.G!=0&&(h.g==o||ms(h.h,o))){if(!o.K&&ms(h.h,o)&&h.G==3){try{var f=h.Da.g.parse(c)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Br(h),Fr(h);else break e;Es(h),be(18)}}else h.za=w[1],0<h.za-h.T&&37500>w[2]&&h.F&&h.v==0&&!h.C&&(h.C=Nn(E(h.Za,h),6e3));if(1>=xa(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else xt(h,11)}else if((o.K||h.g==o)&&Br(h),!B(c))for(w=h.Da.g.parse(c),c=0;c<w.length;c++){let Q=w[c];if(h.T=Q[0],Q=Q[1],h.G==2)if(Q[0]=="c"){h.K=Q[1],h.ia=Q[2];const Ee=Q[3];Ee!=null&&(h.la=Ee,h.j.info("VER="+h.la));const ve=Q[4];ve!=null&&(h.Aa=ve,h.j.info("SVER="+h.Aa));const Zt=Q[5];Zt!=null&&typeof Zt=="number"&&0<Zt&&(f=1.5*Zt,h.L=f,h.j.info("backChannelRequestTimeoutMs_="+f)),f=h;const Oe=o.g;if(Oe){const qr=Oe.g?Oe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(qr){var R=f.h;R.g||qr.indexOf("spdy")==-1&&qr.indexOf("quic")==-1&&qr.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(gs(R,R.h),R.h=null))}if(f.D){const Ts=Oe.g?Oe.g.getResponseHeader("X-HTTP-Session-Id"):null;Ts&&(f.ya=Ts,Z(f.I,f.D,Ts))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),f=h;var k=o;if(f.qa=uc(f,f.J?f.ia:null,f.W),k.K){Fa(f.h,k);var Y=k,fe=f.L;fe&&(Y.I=fe),Y.B&&(fs(Y),Vr(Y)),f.g=k}else ic(f);0<h.i.length&&Ur(h)}else Q[0]!="stop"&&Q[0]!="close"||xt(h,7);else h.G==3&&(Q[0]=="stop"||Q[0]=="close"?Q[0]=="stop"?xt(h,7):ys(h):Q[0]!="noop"&&h.l&&h.l.ta(Q),h.v=0)}}Dn(4)}catch{}}var jd=class{constructor(o,c){this.g=o,this.map=c}};function La(o){this.l=o||10,u.PerformanceNavigationTiming?(o=u.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ma(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function xa(o){return o.h?1:o.g?o.g.size:0}function ms(o,c){return o.h?o.h==c:o.g?o.g.has(c):!1}function gs(o,c){o.g?o.g.add(c):o.h=c}function Fa(o,c){o.h&&o.h==c?o.h=null:o.g&&o.g.has(c)&&o.g.delete(c)}La.prototype.cancel=function(){if(this.i=Ua(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Ua(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let c=o.i;for(const h of o.g.values())c=c.concat(h.D);return c}return O(o.i)}function qd(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(l(o)){for(var c=[],h=o.length,f=0;f<h;f++)c.push(o[f]);return c}c=[],h=0;for(f in o)c[h++]=o[f];return c}function $d(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(l(o)||typeof o=="string"){var c=[];o=o.length;for(var h=0;h<o;h++)c.push(h);return c}c=[],h=0;for(const f in o)c[h++]=f;return c}}}function Ba(o,c){if(o.forEach&&typeof o.forEach=="function")o.forEach(c,void 0);else if(l(o)||typeof o=="string")Array.prototype.forEach.call(o,c,void 0);else for(var h=$d(o),f=qd(o),w=f.length,R=0;R<w;R++)c.call(void 0,f[R],h&&h[R],o)}var ja=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Hd(o,c){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var f=o[h].indexOf("="),w=null;if(0<=f){var R=o[h].substring(0,f);w=o[h].substring(f+1)}else R=o[h];c(R,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function Mt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Mt){this.h=o.h,Dr(this,o.j),this.o=o.o,this.g=o.g,Nr(this,o.s),this.l=o.l;var c=o.i,h=new Fn;h.i=c.i,c.g&&(h.g=new Map(c.g),h.h=c.h),qa(this,h),this.m=o.m}else o&&(c=String(o).match(ja))?(this.h=!1,Dr(this,c[1]||"",!0),this.o=Mn(c[2]||""),this.g=Mn(c[3]||"",!0),Nr(this,c[4]),this.l=Mn(c[5]||"",!0),qa(this,c[6]||"",!0),this.m=Mn(c[7]||"")):(this.h=!1,this.i=new Fn(null,this.h))}Mt.prototype.toString=function(){var o=[],c=this.j;c&&o.push(xn(c,$a,!0),":");var h=this.g;return(h||c=="file")&&(o.push("//"),(c=this.o)&&o.push(xn(c,$a,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(xn(h,h.charAt(0)=="/"?Gd:Wd,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",xn(h,Qd)),o.join("")};function Qe(o){return new Mt(o)}function Dr(o,c,h){o.j=h?Mn(c,!0):c,o.j&&(o.j=o.j.replace(/:$/,""))}function Nr(o,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);o.s=c}else o.s=null}function qa(o,c,h){c instanceof Fn?(o.i=c,Jd(o.i,o.h)):(h||(c=xn(c,Kd)),o.i=new Fn(c,o.h))}function Z(o,c,h){o.i.set(c,h)}function Or(o){return Z(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Mn(o,c){return o?c?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function xn(o,c,h){return typeof o=="string"?(o=encodeURI(o).replace(c,zd),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function zd(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var $a=/[#\/\?@]/g,Wd=/[#\?:]/g,Gd=/[#\?]/g,Kd=/[#\?@]/g,Qd=/#/g;function Fn(o,c){this.h=this.g=null,this.i=o||null,this.j=!!c}function ut(o){o.g||(o.g=new Map,o.h=0,o.i&&Hd(o.i,function(c,h){o.add(decodeURIComponent(c.replace(/\+/g," ")),h)}))}n=Fn.prototype,n.add=function(o,c){ut(this),this.i=null,o=Yt(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(c),this.h+=1,this};function Ha(o,c){ut(o),c=Yt(o,c),o.g.has(c)&&(o.i=null,o.h-=o.g.get(c).length,o.g.delete(c))}function za(o,c){return ut(o),c=Yt(o,c),o.g.has(c)}n.forEach=function(o,c){ut(this),this.g.forEach(function(h,f){h.forEach(function(w){o.call(c,w,f,this)},this)},this)},n.na=function(){ut(this);const o=Array.from(this.g.values()),c=Array.from(this.g.keys()),h=[];for(let f=0;f<c.length;f++){const w=o[f];for(let R=0;R<w.length;R++)h.push(c[f])}return h},n.V=function(o){ut(this);let c=[];if(typeof o=="string")za(this,o)&&(c=c.concat(this.g.get(Yt(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)c=c.concat(o[h])}return c},n.set=function(o,c){return ut(this),this.i=null,o=Yt(this,o),za(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[c]),this.h+=1,this},n.get=function(o,c){return o?(o=this.V(o),0<o.length?String(o[0]):c):c};function Wa(o,c,h){Ha(o,c),0<h.length&&(o.i=null,o.g.set(Yt(o,c),O(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],c=Array.from(this.g.keys());for(var h=0;h<c.length;h++){var f=c[h];const R=encodeURIComponent(String(f)),k=this.V(f);for(f=0;f<k.length;f++){var w=R;k[f]!==""&&(w+="="+encodeURIComponent(String(k[f]))),o.push(w)}}return this.i=o.join("&")};function Yt(o,c){return c=String(c),o.j&&(c=c.toLowerCase()),c}function Jd(o,c){c&&!o.j&&(ut(o),o.i=null,o.g.forEach(function(h,f){var w=f.toLowerCase();f!=w&&(Ha(this,f),Wa(this,w,h))},o)),o.j=c}function Yd(o,c){const h=new On;if(u.Image){const f=new Image;f.onload=S(lt,h,"TestLoadImage: loaded",!0,c,f),f.onerror=S(lt,h,"TestLoadImage: error",!1,c,f),f.onabort=S(lt,h,"TestLoadImage: abort",!1,c,f),f.ontimeout=S(lt,h,"TestLoadImage: timeout",!1,c,f),u.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=o}else c(!1)}function Xd(o,c){const h=new On,f=new AbortController,w=setTimeout(()=>{f.abort(),lt(h,"TestPingServer: timeout",!1,c)},1e4);fetch(o,{signal:f.signal}).then(R=>{clearTimeout(w),R.ok?lt(h,"TestPingServer: ok",!0,c):lt(h,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),lt(h,"TestPingServer: error",!1,c)})}function lt(o,c,h,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(h)}catch{}}function Zd(){this.g=new Ld}function ef(o,c,h){const f=h||"";try{Ba(o,function(w,R){let k=w;d(w)&&(k=os(w)),c.push(f+R+"="+encodeURIComponent(k))})}catch(w){throw c.push(f+"type="+encodeURIComponent("_badmap")),w}}function Lr(o){this.l=o.Ub||null,this.j=o.eb||!1}C(Lr,as),Lr.prototype.g=function(){return new Mr(this.l,this.j)},Lr.prototype.i=(function(o){return function(){return o}})({});function Mr(o,c){ye.call(this),this.D=o,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(Mr,ye),n=Mr.prototype,n.open=function(o,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=c,this.readyState=1,Bn(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(c.body=o),(this.D||u).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Un(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Bn(this)),this.g&&(this.readyState=3,Bn(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ga(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ga(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var c=o.value?o.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!o.done}))&&(this.response=this.responseText+=c)}o.done?Un(this):Bn(this),this.readyState==3&&Ga(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,Un(this))},n.Qa=function(o){this.g&&(this.response=o,Un(this))},n.ga=function(){this.g&&Un(this)};function Un(o){o.readyState=4,o.l=null,o.j=null,o.v=null,Bn(o)}n.setRequestHeader=function(o,c){this.u.append(o,c)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],c=this.h.entries();for(var h=c.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=c.next();return o.join(`\r
`)};function Bn(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Mr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Ka(o){let c="";return se(o,function(h,f){c+=f,c+=":",c+=h,c+=`\r
`}),c}function _s(o,c,h){e:{for(f in h){var f=!1;break e}f=!0}f||(h=Ka(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):Z(o,c,h))}function re(o){ye.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(re,ye);var tf=/^https?$/i,nf=["POST","PUT"];n=re.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,c,h,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);c=c?c.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ls.g(),this.v=this.o?wa(this.o):wa(ls),this.g.onreadystatechange=E(this.Ea,this);try{this.B=!0,this.g.open(c,String(o),!0),this.B=!1}catch(R){Qa(this,R);return}if(o=h||"",h=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)h.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const R of f.keys())h.set(R,f.get(R));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(h.keys()).find(R=>R.toLowerCase()=="content-type"),w=u.FormData&&o instanceof u.FormData,!(0<=Array.prototype.indexOf.call(nf,c,void 0))||f||w||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,k]of h)this.g.setRequestHeader(R,k);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Xa(this),this.u=!0,this.g.send(o),this.u=!1}catch(R){Qa(this,R)}};function Qa(o,c){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=c,o.m=5,Ja(o),xr(o)}function Ja(o){o.A||(o.A=!0,Re(o,"complete"),Re(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Re(this,"complete"),Re(this,"abort"),xr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),xr(this,!0)),re.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Ya(this):this.bb())},n.bb=function(){Ya(this)};function Ya(o){if(o.h&&typeof a<"u"&&(!o.v[1]||Je(o)!=4||o.Z()!=2)){if(o.u&&Je(o)==4)Ea(o.Ea,0,o);else if(Re(o,"readystatechange"),Je(o)==4){o.h=!1;try{const k=o.Z();e:switch(k){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var h;if(!(h=c)){var f;if(f=k===0){var w=String(o.D).match(ja)[1]||null;!w&&u.self&&u.self.location&&(w=u.self.location.protocol.slice(0,-1)),f=!tf.test(w?w.toLowerCase():"")}h=f}if(h)Re(o,"complete"),Re(o,"success");else{o.m=6;try{var R=2<Je(o)?o.g.statusText:""}catch{R=""}o.l=R+" ["+o.Z()+"]",Ja(o)}}finally{xr(o)}}}}function xr(o,c){if(o.g){Xa(o);const h=o.g,f=o.v[0]?()=>{}:null;o.g=null,o.v=null,c||Re(o,"ready");try{h.onreadystatechange=f}catch{}}}function Xa(o){o.I&&(u.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function Je(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<Je(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var c=this.g.responseText;return o&&c.indexOf(o)==0&&(c=c.substring(o.length)),Od(c)}};function Za(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function rf(o){const c={};o=(o.g&&2<=Je(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<o.length;f++){if(B(o[f]))continue;var h=I(o[f]);const w=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const R=c[w]||[];c[w]=R,R.push(h)}T(c,function(f){return f.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function jn(o,c,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||c}function ec(o){this.Aa=0,this.i=[],this.j=new On,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=jn("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=jn("baseRetryDelayMs",5e3,o),this.cb=jn("retryDelaySeedMs",1e4,o),this.Wa=jn("forwardChannelMaxRetries",2,o),this.wa=jn("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new La(o&&o.concurrentRequestLimit),this.Da=new Zd,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=ec.prototype,n.la=8,n.G=1,n.connect=function(o,c,h,f){be(0),this.W=o,this.H=c||{},h&&f!==void 0&&(this.H.OSID=h,this.H.OAID=f),this.F=this.X,this.I=uc(this,null,this.W),Ur(this)};function ys(o){if(tc(o),o.G==3){var c=o.U++,h=Qe(o.I);if(Z(h,"SID",o.K),Z(h,"RID",c),Z(h,"TYPE","terminate"),qn(o,h),c=new ct(o,o.j,c),c.L=2,c.v=Or(Qe(h)),h=!1,u.navigator&&u.navigator.sendBeacon)try{h=u.navigator.sendBeacon(c.v.toString(),"")}catch{}!h&&u.Image&&(new Image().src=c.v,h=!0),h||(c.g=lc(c.j,null),c.g.ea(c.v)),c.F=Date.now(),Vr(c)}cc(o)}function Fr(o){o.g&&(vs(o),o.g.cancel(),o.g=null)}function tc(o){Fr(o),o.u&&(u.clearTimeout(o.u),o.u=null),Br(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&u.clearTimeout(o.s),o.s=null)}function Ur(o){if(!Ma(o.h)&&!o.s){o.s=!0;var c=o.Ga;Sn||pa(),Pn||(Sn(),Pn=!0),Xi.add(c,o),o.B=0}}function sf(o,c){return xa(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=c.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Nn(E(o.Ga,o,c),ac(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const w=new ct(this,this.j,o);let R=this.o;if(this.S&&(R?(R=m(R),v(R,this.S)):R=this.S),this.m!==null||this.O||(w.H=R,R=null),this.P)e:{for(var c=0,h=0;h<this.i.length;h++){t:{var f=this.i[h];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(c+=f,4096<c){c=h;break e}if(c===4096||h===this.i.length-1){c=h+1;break e}}c=1e3}else c=1e3;c=rc(this,w,c),h=Qe(this.I),Z(h,"RID",o),Z(h,"CVER",22),this.D&&Z(h,"X-HTTP-Session-Id",this.D),qn(this,h),R&&(this.O?c="headers="+encodeURIComponent(String(Ka(R)))+"&"+c:this.m&&_s(h,this.m,R)),gs(this.h,w),this.Ua&&Z(h,"TYPE","init"),this.P?(Z(h,"$req",c),Z(h,"SID","null"),w.T=!0,ds(w,h,null)):ds(w,h,c),this.G=2}}else this.G==3&&(o?nc(this,o):this.i.length==0||Ma(this.h)||nc(this))};function nc(o,c){var h;c?h=c.l:h=o.U++;const f=Qe(o.I);Z(f,"SID",o.K),Z(f,"RID",h),Z(f,"AID",o.T),qn(o,f),o.m&&o.o&&_s(f,o.m,o.o),h=new ct(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),c&&(o.i=c.D.concat(o.i)),c=rc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),gs(o.h,h),ds(h,f,c)}function qn(o,c){o.H&&se(o.H,function(h,f){Z(c,f,h)}),o.l&&Ba({},function(h,f){Z(c,f,h)})}function rc(o,c,h){h=Math.min(o.i.length,h);var f=o.l?E(o.l.Na,o.l,o):null;e:{var w=o.i;let R=-1;for(;;){const k=["count="+h];R==-1?0<h?(R=w[0].g,k.push("ofs="+R)):R=0:k.push("ofs="+R);let Y=!0;for(let fe=0;fe<h;fe++){let Q=w[fe].g;const Ee=w[fe].map;if(Q-=R,0>Q)R=Math.max(0,w[fe].g-100),Y=!1;else try{ef(Ee,k,"req"+Q+"_")}catch{f&&f(Ee)}}if(Y){f=k.join("&");break e}}}return o=o.i.splice(0,h),c.D=o,f}function ic(o){if(!o.g&&!o.u){o.Y=1;var c=o.Fa;Sn||pa(),Pn||(Sn(),Pn=!0),Xi.add(c,o),o.v=0}}function Es(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Nn(E(o.Fa,o),ac(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,sc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Nn(E(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,be(10),Fr(this),sc(this))};function vs(o){o.A!=null&&(u.clearTimeout(o.A),o.A=null)}function sc(o){o.g=new ct(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var c=Qe(o.qa);Z(c,"RID","rpc"),Z(c,"SID",o.K),Z(c,"AID",o.T),Z(c,"CI",o.F?"0":"1"),!o.F&&o.ja&&Z(c,"TO",o.ja),Z(c,"TYPE","xmlhttp"),qn(o,c),o.m&&o.o&&_s(c,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=Or(Qe(c)),h.m=null,h.P=!0,Da(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Fr(this),Es(this),be(19))};function Br(o){o.C!=null&&(u.clearTimeout(o.C),o.C=null)}function oc(o,c){var h=null;if(o.g==c){Br(o),vs(o),o.g=null;var f=2}else if(ms(o.h,c))h=c.D,Fa(o.h,c),f=1;else return;if(o.G!=0){if(c.o)if(f==1){h=c.m?c.m.length:0,c=Date.now()-c.F;var w=o.B;f=Pr(),Re(f,new Pa(f,h)),Ur(o)}else ic(o);else if(w=c.s,w==3||w==0&&0<c.X||!(f==1&&sf(o,c)||f==2&&Es(o)))switch(h&&0<h.length&&(c=o.h,c.i=c.i.concat(h)),w){case 1:xt(o,5);break;case 4:xt(o,10);break;case 3:xt(o,6);break;default:xt(o,2)}}}function ac(o,c){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*c}function xt(o,c){if(o.j.info("Error code "+c),c==2){var h=E(o.fb,o),f=o.Xa;const w=!f;f=new Mt(f||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||Dr(f,"https"),Or(f),w?Yd(f.toString(),h):Xd(f.toString(),h)}else be(2);o.G=0,o.l&&o.l.sa(c),cc(o),tc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),be(2)):(this.j.info("Failed to ping google.com"),be(1))};function cc(o){if(o.G=0,o.ka=[],o.l){const c=Ua(o.h);(c.length!=0||o.i.length!=0)&&(V(o.ka,c),V(o.ka,o.i),o.h.i.length=0,O(o.i),o.i.length=0),o.l.ra()}}function uc(o,c,h){var f=h instanceof Mt?Qe(h):new Mt(h);if(f.g!="")c&&(f.g=c+"."+f.g),Nr(f,f.s);else{var w=u.location;f=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;var R=new Mt(null);f&&Dr(R,f),c&&(R.g=c),w&&Nr(R,w),h&&(R.l=h),f=R}return h=o.D,c=o.ya,h&&c&&Z(f,h,c),Z(f,"VER",o.la),qn(o,f),f}function lc(o,c,h){if(c&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=o.Ca&&!o.pa?new re(new Lr({eb:h})):new re(o.pa),c.Ha(o.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function hc(){}n=hc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function jr(){}jr.prototype.g=function(o,c){return new Ce(o,c)};function Ce(o,c){ye.call(this),this.g=new ec(c),this.l=o,this.h=c&&c.messageUrlParams||null,o=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(o?o["X-WebChannel-Content-Type"]=c.messageContentType:o={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(o?o["X-WebChannel-Client-Profile"]=c.va:o={"X-WebChannel-Client-Profile":c.va}),this.g.S=o,(o=c&&c.Sb)&&!B(o)&&(this.g.m=o),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!B(c)&&(this.g.D=c,o=this.h,o!==null&&c in o&&(o=this.h,c in o&&delete o[c])),this.j=new Xt(this)}C(Ce,ye),Ce.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ce.prototype.close=function(){ys(this.g)},Ce.prototype.o=function(o){var c=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=os(o),o=h);c.i.push(new jd(c.Ya++,o)),c.G==3&&Ur(c)},Ce.prototype.N=function(){this.g.l=null,delete this.j,ys(this.g),delete this.g,Ce.aa.N.call(this)};function dc(o){cs.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var c=o.__sm__;if(c){e:{for(const h in c){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,c=c!==null&&o in c?c[o]:void 0),this.data=c}else this.data=o}C(dc,cs);function fc(){us.call(this),this.status=1}C(fc,us);function Xt(o){this.g=o}C(Xt,hc),Xt.prototype.ua=function(){Re(this.g,"a")},Xt.prototype.ta=function(o){Re(this.g,new dc(o))},Xt.prototype.sa=function(o){Re(this.g,new fc)},Xt.prototype.ra=function(){Re(this.g,"b")},jr.prototype.createWebChannel=jr.prototype.g,Ce.prototype.send=Ce.prototype.o,Ce.prototype.open=Ce.prototype.m,Ce.prototype.close=Ce.prototype.close,Wl=function(){return new jr},zl=function(){return Pr()},Hl=Ot,Gs={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Cr.NO_ERROR=0,Cr.TIMEOUT=8,Cr.HTTP_ERROR=6,ti=Cr,Ca.COMPLETE="complete",$l=Ca,Aa.EventType=Vn,Vn.OPEN="a",Vn.CLOSE="b",Vn.ERROR="c",Vn.MESSAGE="d",ye.prototype.listen=ye.prototype.K,zn=Aa,re.prototype.listenOnce=re.prototype.L,re.prototype.getLastError=re.prototype.Ka,re.prototype.getLastErrorCode=re.prototype.Ba,re.prototype.getStatus=re.prototype.Z,re.prototype.getResponseJson=re.prototype.Oa,re.prototype.getResponseText=re.prototype.oa,re.prototype.send=re.prototype.ea,re.prototype.setWithCredentials=re.prototype.Ha,ql=re}).apply(typeof Hr<"u"?Hr:typeof self<"u"?self:typeof window<"u"?window:{});const Gc="@firebase/firestore",Kc="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ie.UNAUTHENTICATED=new Ie(null),Ie.GOOGLE_CREDENTIALS=new Ie("google-credentials-uid"),Ie.FIRST_PARTY=new Ie("first-party-uid"),Ie.MOCK_USER=new Ie("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Tn="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zt=new fo("@firebase/firestore");function en(){return zt.logLevel}function N(n,...e){if(zt.logLevel<=W.DEBUG){const t=e.map(Ro);zt.debug(`Firestore (${Tn}): ${n}`,...t)}}function rt(n,...e){if(zt.logLevel<=W.ERROR){const t=e.map(Ro);zt.error(`Firestore (${Tn}): ${n}`,...t)}}function wt(n,...e){if(zt.logLevel<=W.WARN){const t=e.map(Ro);zt.warn(`Firestore (${Tn}): ${n}`,...t)}}function Ro(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Gl(n,r,t)}function Gl(n,e,t){let r=`FIRESTORE (${Tn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw rt(r),new Error(r)}function J(n,e,t,r){let i="Unexpected state";typeof t=="string"?i=t:r=t,n||Gl(e,i,r)}function U(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class D extends st{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kl{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class a_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ie.UNAUTHENTICATED)))}shutdown(){}}class c_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class u_{constructor(e){this.t=e,this.currentUser=Ie.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){J(this.o===void 0,42304);let r=this.i;const i=l=>this.i!==r?(r=this.i,t(l)):Promise.resolve();let s=new et;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new et,e.enqueueRetryable((()=>i(this.currentUser)))};const a=()=>{const l=s;e.enqueueRetryable((async()=>{await l.promise,await i(this.currentUser)}))},u=l=>{N("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((l=>u(l))),setTimeout((()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?u(l):(N("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new et)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(N("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(J(typeof r.accessToken=="string",31837,{l:r}),new Kl(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return J(e===null||typeof e=="string",2055,{h:e}),new Ie(e)}}class l_{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Ie.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class h_{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new l_(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Ie.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Qc{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class d_{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Le(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){J(this.o===void 0,3512);const r=s=>{s.error!=null&&N("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.m;return this.m=s.token,N("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable((()=>r(s)))};const i=s=>{N("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((s=>i(s))),setTimeout((()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):N("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Qc(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(J(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Qc(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f_(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ql(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=f_(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%62))}return r}}function j(n,e){return n<e?-1:n>e?1:0}function Ks(n,e){let t=0;for(;t<n.length&&t<e.length;){const r=n.codePointAt(t),i=e.codePointAt(t);if(r!==i){if(r<128&&i<128)return j(r,i);{const s=Ql(),a=p_(s.encode(Jc(n,t)),s.encode(Jc(e,t)));return a!==0?a:j(r,i)}}t+=r>65535?2:1}return j(n.length,e.length)}function Jc(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function p_(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return j(n[t],e[t]);return j(n.length,e.length)}function dn(n,e,t){return n.length===e.length&&n.every(((r,i)=>t(r,e[i])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yc="__name__";class Be{constructor(e,t,r){t===void 0?t=0:t>e.length&&x(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&x(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Be.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Be?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=Be.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return j(e.length,t.length)}static compareSegments(e,t){const r=Be.isNumericId(e),i=Be.isNumericId(t);return r&&!i?-1:!r&&i?1:r&&i?Be.extractNumericId(e).compare(Be.extractNumericId(t)):Ks(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Tt.fromString(e.substring(4,e.length-2))}}class X extends Be{construct(e,t,r){return new X(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new D(b.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((i=>i.length>0)))}return new X(t)}static emptyPath(){return new X([])}}const m_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class me extends Be{construct(e,t,r){return new me(e,t,r)}static isValidIdentifier(e){return m_.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),me.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Yc}static keyField(){return new me([Yc])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new D(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;i<e.length;){const u=e[i];if(u==="\\"){if(i+1===e.length)throw new D(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new D(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=l,i+=2}else u==="`"?(a=!a,i++):u!=="."||a?(r+=u,i++):(s(),i++)}if(s(),a)throw new D(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new me(t)}static emptyPath(){return new me([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(X.fromString(e))}static fromName(e){return new L(X.fromString(e).popFirst(5))}static empty(){return new L(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&X.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return X.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new X(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jl(n,e,t){if(!t)throw new D(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function g_(n,e,t,r){if(e===!0&&r===!0)throw new D(b.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Xc(n){if(!L.isDocumentKey(n))throw new D(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Zc(n){if(L.isDocumentKey(n))throw new D(b.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Yl(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ni(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":x(12329,{type:typeof n})}function Ve(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new D(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ni(n);throw new D(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(n,e){const t={typeString:n};return e&&(t.value=e),t}function yr(n,e){if(!Yl(n))throw new D(b.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(i&&typeof a!==i){t=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&a!==s.value){t=`Expected '${r}' field to equal '${s.value}'`;break}}if(t)throw new D(b.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eu=-62135596800,tu=1e6;class ee{static now(){return ee.fromMillis(Date.now())}static fromDate(e){return ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*tu);return new ee(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<eu)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/tu}_compareTo(e){return this.seconds===e.seconds?j(this.nanoseconds,e.nanoseconds):j(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(yr(e,ee._jsonSchema))return new ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-eu;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ee._jsonSchemaVersion="firestore/timestamp/1.0",ee._jsonSchema={type:ue("string",ee._jsonSchemaVersion),seconds:ue("number"),nanoseconds:ue("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{static fromTimestamp(e){return new F(e)}static min(){return new F(new ee(0,0))}static max(){return new F(new ee(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sr=-1;function __(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=F.fromTimestamp(r===1e9?new ee(t+1,0):new ee(t,r));return new At(i,L.empty(),e)}function y_(n){return new At(n.readTime,n.key,sr)}class At{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new At(F.min(),L.empty(),sr)}static max(){return new At(F.max(),L.empty(),sr)}}function E_(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:j(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class T_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function In(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==v_)throw n;N("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&x(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P(((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):P.reject(t)}static resolve(e){return new P(((t,r)=>{t(e)}))}static reject(e){return new P(((t,r)=>{r(e)}))}static waitFor(e){return new P(((t,r)=>{let i=0,s=0,a=!1;e.forEach((u=>{++i,u.next((()=>{++s,a&&s===i&&t()}),(l=>r(l)))})),a=!0,s===i&&t()}))}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next((i=>i?P.resolve(i):r()));return t}static forEach(e,t){const r=[];return e.forEach(((i,s)=>{r.push(t.call(this,i,s))})),this.waitFor(r)}static mapArray(e,t){return new P(((r,i)=>{const s=e.length,a=new Array(s);let u=0;for(let l=0;l<s;l++){const d=l;t(e[d]).next((p=>{a[d]=p,++u,u===s&&r(a)}),(p=>i(p)))}}))}static doWhile(e,t){return new P(((r,i)=>{const s=()=>{e()===!0?t().next((()=>{s()}),i):r()};s()}))}}function I_(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function wn(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this._e(r),this.ae=r=>t.writeSequenceNumber(r))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Oi.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const So=-1;function Li(n){return n==null}function mi(n){return n===0&&1/n==-1/0}function w_(n){return typeof n=="number"&&Number.isInteger(n)&&!mi(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xl="";function A_(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=nu(e)),e=R_(n.get(t),e);return nu(e)}function R_(n,e){let t=e;const r=n.length;for(let i=0;i<r;i++){const s=n.charAt(i);switch(s){case"\0":t+="";break;case Xl:t+="";break;default:t+=s}}return t}function nu(n){return n+Xl+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ru(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Dt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Zl(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(e,t){this.comparator=e,this.root=t||pe.EMPTY}insert(e,t){return new ne(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,pe.BLACK,null,null))}remove(e){return new ne(this.comparator,this.root.remove(e,this.comparator).copy(null,null,pe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new zr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new zr(this.root,e,this.comparator,!1)}getReverseIterator(){return new zr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new zr(this.root,e,this.comparator,!0)}}class zr{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class pe{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??pe.RED,this.left=i??pe.EMPTY,this.right=s??pe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new pe(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return pe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return pe.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,pe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,pe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw x(43730,{key:this.key,value:this.value});if(this.right.isRed())throw x(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw x(27949);return e+(this.isRed()?0:1)}}pe.EMPTY=null,pe.RED=!0,pe.BLACK=!1;pe.EMPTY=new class{constructor(){this.size=0}get key(){throw x(57766)}get value(){throw x(16141)}get color(){throw x(16727)}get left(){throw x(29726)}get right(){throw x(36894)}copy(e,t,r,i,s){return this}insert(e,t,r){return new pe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(e){this.comparator=e,this.data=new ne(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new iu(this.data.getIterator())}getIteratorFrom(e){return new iu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof le)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new le(this.comparator);return t.data=e,t}}class iu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.fields=e,e.sort(me.comparator)}static empty(){return new ke([])}unionWith(e){let t=new le(me.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new ke(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return dn(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new eh("Invalid base64 string: "+s):s}})(e);return new ge(t)}static fromUint8Array(e){const t=(function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s})(e);return new ge(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return j(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ge.EMPTY_BYTE_STRING=new ge("");const b_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Rt(n){if(J(!!n,39018),typeof n=="string"){let e=0;const t=b_.exec(n);if(J(!!t,46558,{timestamp:n}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:oe(n.seconds),nanos:oe(n.nanos)}}function oe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function bt(n){return typeof n=="string"?ge.fromBase64String(n):ge.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const th="server_timestamp",nh="__type__",rh="__previous_value__",ih="__local_write_time__";function Po(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[nh])===null||t===void 0?void 0:t.stringValue)===th}function Mi(n){const e=n.mapValue.fields[rh];return Po(e)?Mi(e):e}function or(n){const e=Rt(n.mapValue.fields[ih].timestampValue);return new ee(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S_{constructor(e,t,r,i,s,a,u,l,d,p){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=l,this.useFetchStreams=d,this.isUsingEmulator=p}}const gi="(default)";class ar{constructor(e,t){this.projectId=e,this.database=t||gi}static empty(){return new ar("","")}get isDefaultDatabase(){return this.database===gi}isEqual(e){return e instanceof ar&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sh="__type__",P_="__max__",Wr={mapValue:{}},oh="__vector__",_i="value";function St(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Po(n)?4:k_(n)?9007199254740991:C_(n)?10:11:x(28295,{value:n})}function Ge(n,e){if(n===e)return!0;const t=St(n);if(t!==St(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return or(n).isEqual(or(e));case 3:return(function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=Rt(i.timestampValue),u=Rt(s.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,s){return bt(i.bytesValue).isEqual(bt(s.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,s){return oe(i.geoPointValue.latitude)===oe(s.geoPointValue.latitude)&&oe(i.geoPointValue.longitude)===oe(s.geoPointValue.longitude)})(n,e);case 2:return(function(i,s){if("integerValue"in i&&"integerValue"in s)return oe(i.integerValue)===oe(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=oe(i.doubleValue),u=oe(s.doubleValue);return a===u?mi(a)===mi(u):isNaN(a)&&isNaN(u)}return!1})(n,e);case 9:return dn(n.arrayValue.values||[],e.arrayValue.values||[],Ge);case 10:case 11:return(function(i,s){const a=i.mapValue.fields||{},u=s.mapValue.fields||{};if(ru(a)!==ru(u))return!1;for(const l in a)if(a.hasOwnProperty(l)&&(u[l]===void 0||!Ge(a[l],u[l])))return!1;return!0})(n,e);default:return x(52216,{left:n})}}function cr(n,e){return(n.values||[]).find((t=>Ge(t,e)))!==void 0}function fn(n,e){if(n===e)return 0;const t=St(n),r=St(e);if(t!==r)return j(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return j(n.booleanValue,e.booleanValue);case 2:return(function(s,a){const u=oe(s.integerValue||s.doubleValue),l=oe(a.integerValue||a.doubleValue);return u<l?-1:u>l?1:u===l?0:isNaN(u)?isNaN(l)?0:-1:1})(n,e);case 3:return su(n.timestampValue,e.timestampValue);case 4:return su(or(n),or(e));case 5:return Ks(n.stringValue,e.stringValue);case 6:return(function(s,a){const u=bt(s),l=bt(a);return u.compareTo(l)})(n.bytesValue,e.bytesValue);case 7:return(function(s,a){const u=s.split("/"),l=a.split("/");for(let d=0;d<u.length&&d<l.length;d++){const p=j(u[d],l[d]);if(p!==0)return p}return j(u.length,l.length)})(n.referenceValue,e.referenceValue);case 8:return(function(s,a){const u=j(oe(s.latitude),oe(a.latitude));return u!==0?u:j(oe(s.longitude),oe(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return ou(n.arrayValue,e.arrayValue);case 10:return(function(s,a){var u,l,d,p;const g=s.fields||{},E=a.fields||{},S=(u=g[_i])===null||u===void 0?void 0:u.arrayValue,C=(l=E[_i])===null||l===void 0?void 0:l.arrayValue,O=j(((d=S==null?void 0:S.values)===null||d===void 0?void 0:d.length)||0,((p=C==null?void 0:C.values)===null||p===void 0?void 0:p.length)||0);return O!==0?O:ou(S,C)})(n.mapValue,e.mapValue);case 11:return(function(s,a){if(s===Wr.mapValue&&a===Wr.mapValue)return 0;if(s===Wr.mapValue)return 1;if(a===Wr.mapValue)return-1;const u=s.fields||{},l=Object.keys(u),d=a.fields||{},p=Object.keys(d);l.sort(),p.sort();for(let g=0;g<l.length&&g<p.length;++g){const E=Ks(l[g],p[g]);if(E!==0)return E;const S=fn(u[l[g]],d[p[g]]);if(S!==0)return S}return j(l.length,p.length)})(n.mapValue,e.mapValue);default:throw x(23264,{le:t})}}function su(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return j(n,e);const t=Rt(n),r=Rt(e),i=j(t.seconds,r.seconds);return i!==0?i:j(t.nanos,r.nanos)}function ou(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=fn(t[i],r[i]);if(s)return s}return j(t.length,r.length)}function pn(n){return Qs(n)}function Qs(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=Rt(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return bt(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return L.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",i=!0;for(const s of t.values||[])i?i=!1:r+=",",r+=Qs(s);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const a of r)s?s=!1:i+=",",i+=`${a}:${Qs(t.fields[a])}`;return i+"}"})(n.mapValue):x(61005,{value:n})}function ni(n){switch(St(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Mi(n);return e?16+ni(e):16;case 5:return 2*n.stringValue.length;case 6:return bt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((i,s)=>i+ni(s)),0)})(n.arrayValue);case 10:case 11:return(function(r){let i=0;return Dt(r.fields,((s,a)=>{i+=s.length+ni(a)})),i})(n.mapValue);default:throw x(13486,{value:n})}}function au(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Js(n){return!!n&&"integerValue"in n}function Co(n){return!!n&&"arrayValue"in n}function cu(n){return!!n&&"nullValue"in n}function uu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ri(n){return!!n&&"mapValue"in n}function C_(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[sh])===null||t===void 0?void 0:t.stringValue)===oh}function Yn(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Dt(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=Yn(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Yn(n.arrayValue.values[t]);return e}return Object.assign({},n)}function k_(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===P_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e){this.value=e}static empty(){return new Pe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!ri(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Yn(t)}setAll(e){let t=me.emptyPath(),r={},i=[];e.forEach(((a,u)=>{if(!t.isImmediateParentOf(u)){const l=this.getFieldsMap(t);this.applyChanges(l,r,i),r={},i=[],t=u.popLast()}a?r[u.lastSegment()]=Yn(a):i.push(u.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());ri(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ge(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];ri(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){Dt(t,((i,s)=>e[i]=s));for(const i of r)delete e[i]}clone(){return new Pe(Yn(this.value))}}function ah(n){const e=[];return Dt(n.fields,((t,r)=>{const i=new me([t]);if(ri(r)){const s=ah(r.mapValue).fields;if(s.length===0)e.push(i);else for(const a of s)e.push(i.child(a))}else e.push(i)})),new ke(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e,t,r,i,s,a,u){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=a,this.documentState=u}static newInvalidDocument(e){return new we(e,0,F.min(),F.min(),F.min(),Pe.empty(),0)}static newFoundDocument(e,t,r,i){return new we(e,1,t,F.min(),r,i,0)}static newNoDocument(e,t){return new we(e,2,t,F.min(),F.min(),Pe.empty(),0)}static newUnknownDocument(e,t){return new we(e,3,t,F.min(),F.min(),Pe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(F.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Pe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Pe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=F.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof we&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new we(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(e,t){this.position=e,this.inclusive=t}}function lu(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){const s=e[i],a=n.position[i];if(s.field.isKeyField()?r=L.comparator(L.fromName(a.referenceValue),t.key):r=fn(a,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function hu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ge(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(e,t="asc"){this.field=e,this.dir=t}}function V_(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ch{}class ce extends ch{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new N_(e,t,r):t==="array-contains"?new M_(e,r):t==="in"?new x_(e,r):t==="not-in"?new F_(e,r):t==="array-contains-any"?new U_(e,r):new ce(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new O_(e,r):new L_(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(fn(t,this.value)):t!==null&&St(this.value)===St(t)&&this.matchesComparison(fn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return x(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ue extends ch{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new Ue(e,t)}matches(e){return uh(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function uh(n){return n.op==="and"}function lh(n){return D_(n)&&uh(n)}function D_(n){for(const e of n.filters)if(e instanceof Ue)return!1;return!0}function Ys(n){if(n instanceof ce)return n.field.canonicalString()+n.op.toString()+pn(n.value);if(lh(n))return n.filters.map((e=>Ys(e))).join(",");{const e=n.filters.map((t=>Ys(t))).join(",");return`${n.op}(${e})`}}function hh(n,e){return n instanceof ce?(function(r,i){return i instanceof ce&&r.op===i.op&&r.field.isEqual(i.field)&&Ge(r.value,i.value)})(n,e):n instanceof Ue?(function(r,i){return i instanceof Ue&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce(((s,a,u)=>s&&hh(a,i.filters[u])),!0):!1})(n,e):void x(19439)}function dh(n){return n instanceof ce?(function(t){return`${t.field.canonicalString()} ${t.op} ${pn(t.value)}`})(n):n instanceof Ue?(function(t){return t.op.toString()+" {"+t.getFilters().map(dh).join(" ,")+"}"})(n):"Filter"}class N_ extends ce{constructor(e,t,r){super(e,t,r),this.key=L.fromName(r.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class O_ extends ce{constructor(e,t){super(e,"in",t),this.keys=fh("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class L_ extends ce{constructor(e,t){super(e,"not-in",t),this.keys=fh("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function fh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((r=>L.fromName(r.referenceValue)))}class M_ extends ce{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Co(t)&&cr(t.arrayValue,this.value)}}class x_ extends ce{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&cr(this.value.arrayValue,t)}}class F_ extends ce{constructor(e,t){super(e,"not-in",t)}matches(e){if(cr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!cr(this.value.arrayValue,t)}}class U_ extends ce{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Co(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>cr(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e,t=null,r=[],i=[],s=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=a,this.endAt=u,this.Pe=null}}function du(n,e=null,t=[],r=[],i=null,s=null,a=null){return new B_(n,e,t,r,i,s,a)}function ko(n){const e=U(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>Ys(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(s){return s.field.canonicalString()+s.dir})(r))).join(","),Li(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>pn(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>pn(r))).join(",")),e.Pe=t}return e.Pe}function Vo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!V_(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!hh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!hu(n.startAt,e.startAt)&&hu(n.endAt,e.endAt)}function Xs(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(e,t=null,r=[],i=[],s=null,a="F",u=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=a,this.startAt=u,this.endAt=l,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function j_(n,e,t,r,i,s,a,u){return new An(n,e,t,r,i,s,a,u)}function xi(n){return new An(n)}function fu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function ph(n){return n.collectionGroup!==null}function Xn(n){const e=U(n);if(e.Te===null){e.Te=[];const t=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new le(me.comparator);return a.filters.forEach((l=>{l.getFlattenedFilters().forEach((d=>{d.isInequality()&&(u=u.add(d.field))}))})),u})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.Te.push(new ur(s,r))})),t.has(me.keyField().canonicalString())||e.Te.push(new ur(me.keyField(),r))}return e.Te}function $e(n){const e=U(n);return e.Ie||(e.Ie=q_(e,Xn(n))),e.Ie}function q_(n,e){if(n.limitType==="F")return du(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((i=>{const s=i.dir==="desc"?"asc":"desc";return new ur(i.field,s)}));const t=n.endAt?new yi(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new yi(n.startAt.position,n.startAt.inclusive):null;return du(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Zs(n,e){const t=n.filters.concat([e]);return new An(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Ei(n,e,t){return new An(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Fi(n,e){return Vo($e(n),$e(e))&&n.limitType===e.limitType}function mh(n){return`${ko($e(n))}|lt:${n.limitType}`}function tn(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((i=>dh(i))).join(", ")}]`),Li(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((i=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(i))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((i=>pn(i))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((i=>pn(i))).join(",")),`Target(${r})`})($e(n))}; limitType=${n.limitType})`}function Ui(n,e){return e.isFoundDocument()&&(function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):L.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)})(n,e)&&(function(r,i){for(const s of Xn(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0})(n,e)&&(function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0})(n,e)&&(function(r,i){return!(r.startAt&&!(function(a,u,l){const d=lu(a,u,l);return a.inclusive?d<=0:d<0})(r.startAt,Xn(r),i)||r.endAt&&!(function(a,u,l){const d=lu(a,u,l);return a.inclusive?d>=0:d>0})(r.endAt,Xn(r),i))})(n,e)}function $_(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function gh(n){return(e,t)=>{let r=!1;for(const i of Xn(n)){const s=H_(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function H_(n,e,t){const r=n.field.isKeyField()?L.comparator(e.key,t.key):(function(s,a,u){const l=a.data.field(s),d=u.data.field(s);return l!==null&&d!==null?fn(l,d):x(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return x(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Dt(this.inner,((t,r)=>{for(const[i,s]of r)e(i,s)}))}isEmpty(){return Zl(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z_=new ne(L.comparator);function it(){return z_}const _h=new ne(L.comparator);function Wn(...n){let e=_h;for(const t of n)e=e.insert(t.key,t);return e}function yh(n){let e=_h;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Ut(){return Zn()}function Eh(){return Zn()}function Zn(){return new Kt((n=>n.toString()),((n,e)=>n.isEqual(e)))}const W_=new ne(L.comparator),G_=new le(L.comparator);function G(...n){let e=G_;for(const t of n)e=e.add(t);return e}const K_=new le(j);function Q_(){return K_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Do(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:mi(e)?"-0":e}}function vh(n){return{integerValue:""+n}}function J_(n,e){return w_(e)?vh(e):Do(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(){this._=void 0}}function Y_(n,e,t){return n instanceof lr?(function(i,s){const a={fields:{[nh]:{stringValue:th},[ih]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Po(s)&&(s=Mi(s)),s&&(a.fields[rh]=s),{mapValue:a}})(t,e):n instanceof hr?Ih(n,e):n instanceof dr?wh(n,e):(function(i,s){const a=Th(i,s),u=pu(a)+pu(i.Ee);return Js(a)&&Js(i.Ee)?vh(u):Do(i.serializer,u)})(n,e)}function X_(n,e,t){return n instanceof hr?Ih(n,e):n instanceof dr?wh(n,e):t}function Th(n,e){return n instanceof vi?(function(r){return Js(r)||(function(s){return!!s&&"doubleValue"in s})(r)})(e)?e:{integerValue:0}:null}class lr extends Bi{}class hr extends Bi{constructor(e){super(),this.elements=e}}function Ih(n,e){const t=Ah(e);for(const r of n.elements)t.some((i=>Ge(i,r)))||t.push(r);return{arrayValue:{values:t}}}class dr extends Bi{constructor(e){super(),this.elements=e}}function wh(n,e){let t=Ah(e);for(const r of n.elements)t=t.filter((i=>!Ge(i,r)));return{arrayValue:{values:t}}}class vi extends Bi{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function pu(n){return oe(n.integerValue||n.doubleValue)}function Ah(n){return Co(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(e,t){this.field=e,this.transform=t}}function ey(n,e){return n.field.isEqual(e.field)&&(function(r,i){return r instanceof hr&&i instanceof hr||r instanceof dr&&i instanceof dr?dn(r.elements,i.elements,Ge):r instanceof vi&&i instanceof vi?Ge(r.Ee,i.Ee):r instanceof lr&&i instanceof lr})(n.transform,e.transform)}class ty{constructor(e,t){this.version=e,this.transformResults=t}}class xe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new xe}static exists(e){return new xe(void 0,e)}static updateTime(e){return new xe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ii(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ji{}function Rh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Sh(n.key,xe.none()):new Er(n.key,n.data,xe.none());{const t=n.data,r=Pe.empty();let i=new le(me.comparator);for(let s of e.fields)if(!i.has(s)){let a=t.field(s);a===null&&s.length>1&&(s=s.popLast(),a=t.field(s)),a===null?r.delete(s):r.set(s,a),i=i.add(s)}return new Nt(n.key,r,new ke(i.toArray()),xe.none())}}function ny(n,e,t){n instanceof Er?(function(i,s,a){const u=i.value.clone(),l=gu(i.fieldTransforms,s,a.transformResults);u.setAll(l),s.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):n instanceof Nt?(function(i,s,a){if(!ii(i.precondition,s))return void s.convertToUnknownDocument(a.version);const u=gu(i.fieldTransforms,s,a.transformResults),l=s.data;l.setAll(bh(i)),l.setAll(u),s.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):(function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function er(n,e,t,r){return n instanceof Er?(function(s,a,u,l){if(!ii(s.precondition,a))return u;const d=s.value.clone(),p=_u(s.fieldTransforms,l,a);return d.setAll(p),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null})(n,e,t,r):n instanceof Nt?(function(s,a,u,l){if(!ii(s.precondition,a))return u;const d=_u(s.fieldTransforms,l,a),p=a.data;return p.setAll(bh(s)),p.setAll(d),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),u===null?null:u.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map((g=>g.field)))})(n,e,t,r):(function(s,a,u){return ii(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u})(n,e,t)}function ry(n,e){let t=null;for(const r of n.fieldTransforms){const i=e.data.field(r.field),s=Th(r.transform,i||null);s!=null&&(t===null&&(t=Pe.empty()),t.set(r.field,s))}return t||null}function mu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&dn(r,i,((s,a)=>ey(s,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Er extends ji{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Nt extends ji{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function bh(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function gu(n,e,t){const r=new Map;J(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let i=0;i<t.length;i++){const s=n[i],a=s.transform,u=e.data.field(s.field);r.set(s.field,X_(a,u,t[i]))}return r}function _u(n,e,t){const r=new Map;for(const i of n){const s=i.transform,a=t.data.field(i.field);r.set(i.field,Y_(s,a,e))}return r}class Sh extends ji{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class iy extends ji{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&ny(s,e,r[i])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=er(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=er(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Eh();return this.mutations.forEach((i=>{const s=e.get(i.key),a=s.overlayedDocument;let u=this.applyToLocalView(a,s.mutatedFields);u=t.has(i.key)?null:u;const l=Rh(a,u);l!==null&&r.set(i.key,l),a.isValidDocument()||a.convertToNoDocument(F.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),G())}isEqual(e){return this.batchId===e.batchId&&dn(this.mutations,e.mutations,((t,r)=>mu(t,r)))&&dn(this.baseMutations,e.baseMutations,((t,r)=>mu(t,r)))}}class No{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){J(e.mutations.length===r.length,58842,{Ve:e.mutations.length,me:r.length});let i=(function(){return W_})();const s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,r[a].version);return new No(e,t,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oy{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ay{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ae,K;function cy(n){switch(n){case b.OK:return x(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return x(15467,{code:n})}}function Ph(n){if(n===void 0)return rt("GRPC error has no .code"),b.UNKNOWN;switch(n){case ae.OK:return b.OK;case ae.CANCELLED:return b.CANCELLED;case ae.UNKNOWN:return b.UNKNOWN;case ae.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case ae.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case ae.INTERNAL:return b.INTERNAL;case ae.UNAVAILABLE:return b.UNAVAILABLE;case ae.UNAUTHENTICATED:return b.UNAUTHENTICATED;case ae.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case ae.NOT_FOUND:return b.NOT_FOUND;case ae.ALREADY_EXISTS:return b.ALREADY_EXISTS;case ae.PERMISSION_DENIED:return b.PERMISSION_DENIED;case ae.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case ae.ABORTED:return b.ABORTED;case ae.OUT_OF_RANGE:return b.OUT_OF_RANGE;case ae.UNIMPLEMENTED:return b.UNIMPLEMENTED;case ae.DATA_LOSS:return b.DATA_LOSS;default:return x(39323,{code:n})}}(K=ae||(ae={}))[K.OK=0]="OK",K[K.CANCELLED=1]="CANCELLED",K[K.UNKNOWN=2]="UNKNOWN",K[K.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",K[K.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",K[K.NOT_FOUND=5]="NOT_FOUND",K[K.ALREADY_EXISTS=6]="ALREADY_EXISTS",K[K.PERMISSION_DENIED=7]="PERMISSION_DENIED",K[K.UNAUTHENTICATED=16]="UNAUTHENTICATED",K[K.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",K[K.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",K[K.ABORTED=10]="ABORTED",K[K.OUT_OF_RANGE=11]="OUT_OF_RANGE",K[K.UNIMPLEMENTED=12]="UNIMPLEMENTED",K[K.INTERNAL=13]="INTERNAL",K[K.UNAVAILABLE=14]="UNAVAILABLE",K[K.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uy=new Tt([4294967295,4294967295],0);function yu(n){const e=Ql().encode(n),t=new jl;return t.update(e),new Uint8Array(t.digest())}function Eu(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Tt([t,r],0),new Tt([i,s],0)]}class Oo{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Gn(`Invalid padding: ${t}`);if(r<0)throw new Gn(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Gn(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Gn(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Tt.fromNumber(this.fe)}pe(e,t,r){let i=e.add(t.multiply(Tt.fromNumber(r)));return i.compare(uy)===1&&(i=new Tt([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=yu(e),[r,i]=Eu(t);for(let s=0;s<this.hashCount;s++){const a=this.pe(r,i,s);if(!this.ye(a))return!1}return!0}static create(e,t,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),a=new Oo(s,i,t);return r.forEach((u=>a.insert(u))),a}insert(e){if(this.fe===0)return;const t=yu(e),[r,i]=Eu(t);for(let s=0;s<this.hashCount;s++){const a=this.pe(r,i,s);this.we(a)}}we(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Gn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(e,t,r,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const i=new Map;return i.set(e,vr.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new qi(F.min(),i,new ne(j),it(),G())}}class vr{constructor(e,t,r,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new vr(r,t,G(),G(),G())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e,t,r,i){this.Se=e,this.removedTargetIds=t,this.key=r,this.be=i}}class Ch{constructor(e,t){this.targetId=e,this.De=t}}class kh{constructor(e,t,r=ge.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=i}}class vu{constructor(){this.ve=0,this.Ce=Tu(),this.Fe=ge.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=G(),t=G(),r=G();return this.Ce.forEach(((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:r=r.add(i);break;default:x(38017,{changeType:s})}})),new vr(this.Fe,this.Me,e,t,r)}ke(){this.xe=!1,this.Ce=Tu()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,J(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class ly{constructor(e){this.We=e,this.Ge=new Map,this.ze=it(),this.je=Gr(),this.Je=Gr(),this.He=new ne(j)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const r=this.tt(t);switch(e.state){case 0:this.nt(t)&&r.Be(e.resumeToken);break;case 1:r.Ue(),r.Oe||r.ke(),r.Be(e.resumeToken);break;case 2:r.Ue(),r.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(r.Ke(),r.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),r.Be(e.resumeToken));break;default:x(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((r,i)=>{this.nt(i)&&t(i)}))}it(e){const t=e.targetId,r=e.De.count,i=this.st(t);if(i){const s=i.target;if(Xs(s))if(r===0){const a=new L(s.path);this.Xe(t,a,we.newNoDocument(a,F.min()))}else J(r===1,20013,{expectedCount:r});else{const a=this.ot(t);if(a!==r){const u=this._t(e),l=u?this.ut(u,e,a):1;if(l!==0){this.rt(t);const d=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,d)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=t;let a,u;try{a=bt(r).toUint8Array()}catch(l){if(l instanceof eh)return wt("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{u=new Oo(a,i,s)}catch(l){return wt(l instanceof Gn?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return u.fe===0?null:u}ut(e,t,r){return t.De.count===r-this.ht(e,t.targetId)?0:2}ht(e,t){const r=this.We.getRemoteKeysForTarget(t);let i=0;return r.forEach((s=>{const a=this.We.lt(),u=`projects/${a.projectId}/databases/${a.database}/documents/${s.path.canonicalString()}`;e.mightContain(u)||(this.Xe(t,s,null),i++)})),i}Pt(e){const t=new Map;this.Ge.forEach(((s,a)=>{const u=this.st(a);if(u){if(s.current&&Xs(u.target)){const l=new L(u.target.path);this.Tt(l).has(a)||this.It(a,l)||this.Xe(a,l,we.newNoDocument(l,e))}s.Ne&&(t.set(a,s.Le()),s.ke())}}));let r=G();this.Je.forEach(((s,a)=>{let u=!0;a.forEachWhile((l=>{const d=this.st(l);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)})),u&&(r=r.add(s))})),this.ze.forEach(((s,a)=>a.setReadTime(e)));const i=new qi(e,t,this.He,this.ze,r);return this.ze=it(),this.je=Gr(),this.Je=Gr(),this.He=new ne(j),i}Ze(e,t){if(!this.nt(e))return;const r=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,r),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,r){if(!this.nt(e))return;const i=this.tt(e);this.It(e,t)?i.qe(t,1):i.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),r&&(this.ze=this.ze.insert(t,r))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new vu,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new le(j),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new le(j),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||N("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new vu),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Gr(){return new ne(L.comparator)}function Tu(){return new ne(L.comparator)}const hy={asc:"ASCENDING",desc:"DESCENDING"},dy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},fy={and:"AND",or:"OR"};class py{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function eo(n,e){return n.useProto3Json||Li(e)?e:{value:e}}function Ti(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Vh(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function my(n,e){return Ti(n,e.toTimestamp())}function He(n){return J(!!n,49232),F.fromTimestamp((function(t){const r=Rt(t);return new ee(r.seconds,r.nanos)})(n))}function Lo(n,e){return to(n,e).canonicalString()}function to(n,e){const t=(function(i){return new X(["projects",i.projectId,"databases",i.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Dh(n){const e=X.fromString(n);return J(xh(e),10190,{key:e.toString()}),e}function no(n,e){return Lo(n.databaseId,e.path)}function Cs(n,e){const t=Dh(e);if(t.get(1)!==n.databaseId.projectId)throw new D(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new D(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(Oh(t))}function Nh(n,e){return Lo(n.databaseId,e)}function gy(n){const e=Dh(n);return e.length===4?X.emptyPath():Oh(e)}function ro(n){return new X(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Oh(n){return J(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Iu(n,e,t){return{name:no(n,e),fields:t.value.mapValue.fields}}function _y(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:x(39313,{state:d})})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=(function(d,p){return d.useProto3Json?(J(p===void 0||typeof p=="string",58123),ge.fromBase64String(p||"")):(J(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),ge.fromUint8Array(p||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,u=a&&(function(d){const p=d.code===void 0?b.UNKNOWN:Ph(d.code);return new D(p,d.message||"")})(a);t=new kh(r,i,s,u||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=Cs(n,r.document.name),s=He(r.document.updateTime),a=r.document.createTime?He(r.document.createTime):F.min(),u=new Pe({mapValue:{fields:r.document.fields}}),l=we.newFoundDocument(i,s,a,u),d=r.targetIds||[],p=r.removedTargetIds||[];t=new si(d,p,l.key,l)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=Cs(n,r.document),s=r.readTime?He(r.readTime):F.min(),a=we.newNoDocument(i,s),u=r.removedTargetIds||[];t=new si([],u,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=Cs(n,r.document),s=r.removedTargetIds||[];t=new si([],s,i,null)}else{if(!("filter"in e))return x(11601,{At:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,a=new ay(i,s),u=r.targetId;t=new Ch(u,a)}}return t}function yy(n,e){let t;if(e instanceof Er)t={update:Iu(n,e.key,e.value)};else if(e instanceof Sh)t={delete:no(n,e.key)};else if(e instanceof Nt)t={update:Iu(n,e.key,e.data),updateMask:Sy(e.fieldMask)};else{if(!(e instanceof iy))return x(16599,{Rt:e.type});t={verify:no(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(s,a){const u=a.transform;if(u instanceof lr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof hr)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof dr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof vi)return{fieldPath:a.field.canonicalString(),increment:u.Ee};throw x(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(i,s){return s.updateTime!==void 0?{updateTime:my(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:x(27497)})(n,e.precondition)),t}function Ey(n,e){return n&&n.length>0?(J(e!==void 0,14353),n.map((t=>(function(i,s){let a=i.updateTime?He(i.updateTime):He(s);return a.isEqual(F.min())&&(a=He(s)),new ty(a,i.transformResults||[])})(t,e)))):[]}function vy(n,e){return{documents:[Nh(n,e.path)]}}function Ty(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Nh(n,i);const s=(function(d){if(d.length!==0)return Mh(Ue.create(d,"and"))})(e.filters);s&&(t.structuredQuery.where=s);const a=(function(d){if(d.length!==0)return d.map((p=>(function(E){return{field:nn(E.field),direction:Ay(E.dir)}})(p)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const u=eo(n,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=(function(d){return{before:d.inclusive,values:d.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(d){return{before:!d.inclusive,values:d.position}})(e.endAt)),{Vt:t,parent:i}}function Iy(n){let e=gy(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let i=null;if(r>0){J(r===1,65062);const p=t.from[0];p.allDescendants?i=p.collectionId:e=e.child(p.collectionId)}let s=[];t.where&&(s=(function(g){const E=Lh(g);return E instanceof Ue&&lh(E)?E.getFilters():[E]})(t.where));let a=[];t.orderBy&&(a=(function(g){return g.map((E=>(function(C){return new ur(rn(C.field),(function(V){switch(V){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(C.direction))})(E)))})(t.orderBy));let u=null;t.limit&&(u=(function(g){let E;return E=typeof g=="object"?g.value:g,Li(E)?null:E})(t.limit));let l=null;t.startAt&&(l=(function(g){const E=!!g.before,S=g.values||[];return new yi(S,E)})(t.startAt));let d=null;return t.endAt&&(d=(function(g){const E=!g.before,S=g.values||[];return new yi(S,E)})(t.endAt)),j_(e,i,a,s,u,"F",l,d)}function wy(n,e){const t=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return x(28987,{purpose:i})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Lh(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=rn(t.unaryFilter.field);return ce.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=rn(t.unaryFilter.field);return ce.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=rn(t.unaryFilter.field);return ce.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=rn(t.unaryFilter.field);return ce.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return x(61313);default:return x(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ce.create(rn(t.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return x(58110);default:return x(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Ue.create(t.compositeFilter.filters.map((r=>Lh(r))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return x(1026)}})(t.compositeFilter.op))})(n):x(30097,{filter:n})}function Ay(n){return hy[n]}function Ry(n){return dy[n]}function by(n){return fy[n]}function nn(n){return{fieldPath:n.canonicalString()}}function rn(n){return me.fromServerFormat(n.fieldPath)}function Mh(n){return n instanceof ce?(function(t){if(t.op==="=="){if(uu(t.value))return{unaryFilter:{field:nn(t.field),op:"IS_NAN"}};if(cu(t.value))return{unaryFilter:{field:nn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(uu(t.value))return{unaryFilter:{field:nn(t.field),op:"IS_NOT_NAN"}};if(cu(t.value))return{unaryFilter:{field:nn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:nn(t.field),op:Ry(t.op),value:t.value}}})(n):n instanceof Ue?(function(t){const r=t.getFilters().map((i=>Mh(i)));return r.length===1?r[0]:{compositeFilter:{op:by(t.op),filters:r}}})(n):x(54877,{filter:n})}function Sy(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function xh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e,t,r,i,s=F.min(),a=F.min(),u=ge.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=l}withSequenceNumber(e){return new gt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new gt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new gt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new gt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(e){this.gt=e}}function Cy(n){const e=Iy({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ei(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ky{constructor(){this.Dn=new Vy}addToCollectionParentIndex(e,t){return this.Dn.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(At.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(At.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class Vy{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new le(X.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new le(X.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wu={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Fh=41943040;class Se{static withCacheSize(e){return new Se(e,Se.DEFAULT_COLLECTION_PERCENTILE,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Se.DEFAULT_COLLECTION_PERCENTILE=10,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Se.DEFAULT=new Se(Fh,Se.DEFAULT_COLLECTION_PERCENTILE,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Se.DISABLED=new Se(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new mn(0)}static ur(){return new mn(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Au="LruGarbageCollector",Dy=1048576;function Ru([n,e],[t,r]){const i=j(n,t);return i===0?j(e,r):i}class Ny{constructor(e){this.Tr=e,this.buffer=new le(Ru),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Ru(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Oy{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){N(Au,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){wn(t)?N(Au,"Ignoring IndexedDB error during garbage collection: ",t):await In(t)}await this.Rr(3e5)}))}}class Ly{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return P.resolve(Oi.ue);const r=new Ny(t);return this.Vr.forEachTarget(e,(i=>r.Er(i.sequenceNumber))).next((()=>this.Vr.gr(e,(i=>r.Er(i))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.Vr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(N("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(wu)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(N("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),wu):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let r,i,s,a,u,l,d;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((g=>(g>this.params.maximumSequenceNumbersToCollect?(N("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),i=this.params.maximumSequenceNumbersToCollect):i=g,a=Date.now(),this.nthSequenceNumber(e,i)))).next((g=>(r=g,u=Date.now(),this.removeTargets(e,r,t)))).next((g=>(s=g,l=Date.now(),this.removeOrphanedDocuments(e,r)))).next((g=>(d=Date.now(),en()<=W.DEBUG&&N("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${i} in `+(u-a)+`ms
	Removed ${s} targets in `+(l-u)+`ms
	Removed ${g} documents in `+(d-l)+`ms
Total Duration: ${d-p}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:g}))))}}function My(n,e){return new Ly(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xy{constructor(){this.changes=new Kt((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,we.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uy{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((i=>(r=i,this.remoteDocumentCache.getEntry(e,t)))).next((i=>(r!==null&&er(r.mutation,i,ke.empty(),ee.now()),i)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,G()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=G()){const i=Ut();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,r).next((s=>{let a=Wn();return s.forEach(((u,l)=>{a=a.insert(u,l.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=Ut();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,G())))}populateOverlays(e,t,r){const i=[];return r.forEach((s=>{t.has(s)||i.push(s)})),this.documentOverlayCache.getOverlays(e,i).next((s=>{s.forEach(((a,u)=>{t.set(a,u)}))}))}computeViews(e,t,r,i){let s=it();const a=Zn(),u=(function(){return Zn()})();return t.forEach(((l,d)=>{const p=r.get(d.key);i.has(d.key)&&(p===void 0||p.mutation instanceof Nt)?s=s.insert(d.key,d):p!==void 0?(a.set(d.key,p.mutation.getFieldMask()),er(p.mutation,d,p.mutation.getFieldMask(),ee.now())):a.set(d.key,ke.empty())})),this.recalculateAndSaveOverlays(e,s).next((l=>(l.forEach(((d,p)=>a.set(d,p))),t.forEach(((d,p)=>{var g;return u.set(d,new Fy(p,(g=a.get(d))!==null&&g!==void 0?g:null))})),u)))}recalculateAndSaveOverlays(e,t){const r=Zn();let i=new ne(((a,u)=>a-u)),s=G();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const u of a)u.keys().forEach((l=>{const d=t.get(l);if(d===null)return;let p=r.get(l)||ke.empty();p=u.applyToLocalView(d,p),r.set(l,p);const g=(i.get(u.batchId)||G()).add(l);i=i.insert(u.batchId,g)}))})).next((()=>{const a=[],u=i.getReverseIterator();for(;u.hasNext();){const l=u.getNext(),d=l.key,p=l.value,g=Eh();p.forEach((E=>{if(!s.has(E)){const S=Rh(t.get(E),r.get(E));S!==null&&g.set(E,S),s=s.add(E)}})),a.push(this.documentOverlayCache.saveOverlays(e,d,g))}return P.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,i){return(function(a){return L.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ph(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next((s=>{const a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):P.resolve(Ut());let u=sr,l=s;return a.next((d=>P.forEach(d,((p,g)=>(u<g.largestBatchId&&(u=g.largestBatchId),s.get(p)?P.resolve():this.remoteDocumentCache.getEntry(e,p).next((E=>{l=l.insert(p,E)}))))).next((()=>this.populateOverlays(e,d,s))).next((()=>this.computeViews(e,l,d,G()))).next((p=>({batchId:u,changes:yh(p)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next((r=>{let i=Wn();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){const s=t.collectionGroup;let a=Wn();return this.indexManager.getCollectionParents(e,s).next((u=>P.forEach(u,(l=>{const d=(function(g,E){return new An(E,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)})(t,l.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,r,i).next((p=>{p.forEach(((g,E)=>{a=a.insert(g,E)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i)))).next((a=>{s.forEach(((l,d)=>{const p=d.getKey();a.get(p)===null&&(a=a.insert(p,we.newInvalidDocument(p)))}));let u=Wn();return a.forEach(((l,d)=>{const p=s.get(l);p!==void 0&&er(p.mutation,d,ke.empty(),ee.now()),Ui(t,d)&&(u=u.insert(l,d))})),u}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return P.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(i){return{id:i.id,version:i.version,createTime:He(i.createTime)}})(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(i){return{name:i.name,query:Cy(i.bundledQuery),readTime:He(i.readTime)}})(t)),P.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{constructor(){this.overlays=new ne(L.comparator),this.kr=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Ut();return P.forEach(t,(i=>this.getOverlay(e,i).next((s=>{s!==null&&r.set(i,s)})))).next((()=>r))}saveOverlays(e,t,r){return r.forEach(((i,s)=>{this.wt(e,t,s)})),P.resolve()}removeOverlaysForBatchId(e,t,r){const i=this.kr.get(r);return i!==void 0&&(i.forEach((s=>this.overlays=this.overlays.remove(s))),this.kr.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const i=Ut(),s=t.length+1,a=new L(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const l=u.getNext().value,d=l.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===s&&l.largestBatchId>r&&i.set(l.getKey(),l)}return P.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new ne(((d,p)=>d-p));const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let p=s.get(d.largestBatchId);p===null&&(p=Ut(),s=s.insert(d.largestBatchId,p)),p.set(d.getKey(),d)}}const u=Ut(),l=s.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach(((d,p)=>u.set(d,p))),!(u.size()>=i)););return P.resolve(u)}wt(e,t,r){const i=this.overlays.get(r.key);if(i!==null){const a=this.kr.get(i.largestBatchId).delete(r.key);this.kr.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new oy(t,r));let s=this.kr.get(t);s===void 0&&(s=G(),this.kr.set(t,s)),this.kr.set(t,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{constructor(){this.sessionToken=ge.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{constructor(){this.qr=new le(de.Qr),this.$r=new le(de.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const r=new de(e,t);this.qr=this.qr.add(r),this.$r=this.$r.add(r)}Kr(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Wr(new de(e,t))}Gr(e,t){e.forEach((r=>this.removeReference(r,t)))}zr(e){const t=new L(new X([])),r=new de(t,e),i=new de(t,e+1),s=[];return this.$r.forEachInRange([r,i],(a=>{this.Wr(a),s.push(a.key)})),s}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new L(new X([])),r=new de(t,e),i=new de(t,e+1);let s=G();return this.$r.forEachInRange([r,i],(a=>{s=s.add(a.key)})),s}containsKey(e){const t=new de(e,0),r=this.qr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class de{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return L.comparator(e.key,t.key)||j(e.Hr,t.Hr)}static Ur(e,t){return j(e.Hr,t.Hr)||L.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $y{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new le(de.Qr)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new sy(s,t,r,i);this.mutationQueue.push(a);for(const u of i)this.Yr=this.Yr.add(new de(u.key,s)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=this.Xr(r),s=i<0?0:i;return P.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?So:this.er-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new de(t,0),i=new de(t,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([r,i],(a=>{const u=this.Zr(a.Hr);s.push(u)})),P.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new le(j);return t.forEach((i=>{const s=new de(i,0),a=new de(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,a],(u=>{r=r.add(u.Hr)}))})),P.resolve(this.ei(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1;let s=r;L.isDocumentKey(s)||(s=s.child(""));const a=new de(new L(s),0);let u=new le(j);return this.Yr.forEachWhile((l=>{const d=l.key.path;return!!r.isPrefixOf(d)&&(d.length===i&&(u=u.add(l.Hr)),!0)}),a),P.resolve(this.ei(u))}ei(e){const t=[];return e.forEach((r=>{const i=this.Zr(r);i!==null&&t.push(i)})),t}removeMutationBatch(e,t){J(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Yr;return P.forEach(t.mutations,(i=>{const s=new de(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Yr=r}))}rr(e){}containsKey(e,t){const r=new de(t,0),i=this.Yr.firstAfterOrEqual(r);return P.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(e){this.ni=e,this.docs=(function(){return new ne(L.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,i=this.docs.get(r),s=i?i.size:0,a=this.ni(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():we.newInvalidDocument(t))}getEntries(e,t){let r=it();return t.forEach((i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():we.newInvalidDocument(i))})),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=it();const a=t.path,u=new L(a.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){const{key:d,value:{document:p}}=l.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||E_(y_(p),r)<=0||(i.has(p.key)||Ui(t,p))&&(s=s.insert(p.key,p.mutableCopy()))}return P.resolve(s)}getAllFromCollectionGroup(e,t,r,i){x(9500)}ri(e,t){return P.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new zy(this)}getSize(e){return P.resolve(this.size)}}class zy extends xy{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((r,i)=>{i.isValidDocument()?t.push(this.Or.addEntry(e,i)):this.Or.removeEntry(r)})),P.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(e){this.persistence=e,this.ii=new Kt((t=>ko(t)),Vo),this.lastRemoteSnapshotVersion=F.min(),this.highestTargetId=0,this.si=0,this.oi=new Mo,this.targetCount=0,this._i=mn.ar()}forEachTarget(e,t){return this.ii.forEach(((r,i)=>t(i))),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.si&&(this.si=t),P.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new mn(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.hr(t),P.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let i=0;const s=[];return this.ii.forEach(((a,u)=>{u.sequenceNumber<=t&&r.get(u.targetId)===null&&(this.ii.delete(a),s.push(this.removeMatchingKeysForTargetId(e,u.targetId)),i++)})),P.waitFor(s).next((()=>i))}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.ii.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.oi.Kr(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.oi.Gr(t,r);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach((a=>{s.push(i.markPotentiallyOrphaned(e,a))})),P.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.oi.Jr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uh{constructor(e,t){this.ai={},this.overlays={},this.ui=new Oi(0),this.ci=!1,this.ci=!0,this.li=new qy,this.referenceDelegate=e(this),this.hi=new Wy(this),this.indexManager=new ky,this.remoteDocumentCache=(function(i){return new Hy(i)})((r=>this.referenceDelegate.Pi(r))),this.serializer=new Py(t),this.Ti=new By(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new jy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.ai[e.toKey()];return r||(r=new $y(t,this.referenceDelegate),this.ai[e.toKey()]=r),r}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,r){N("MemoryPersistence","Starting transaction:",e);const i=new Gy(this.ui.next());return this.referenceDelegate.Ii(),r(i).next((s=>this.referenceDelegate.di(i).next((()=>s)))).toPromise().then((s=>(i.raiseOnCommittedEvent(),s)))}Ei(e,t){return P.or(Object.values(this.ai).map((r=>()=>r.containsKey(e,t))))}}class Gy extends T_{constructor(e){super(),this.currentSequenceNumber=e}}class xo{constructor(e){this.persistence=e,this.Ai=new Mo,this.Ri=null}static Vi(e){return new xo(e)}get mi(){if(this.Ri)return this.Ri;throw x(60996)}addReference(e,t,r){return this.Ai.addReference(r,t),this.mi.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Ai.removeReference(r,t),this.mi.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),P.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((i=>this.mi.add(i.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((i=>{i.forEach((s=>this.mi.add(s.toString())))})).next((()=>r.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.mi,(r=>{const i=L.fromPath(r);return this.fi(e,i).next((s=>{s||t.removeEntry(i,F.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((r=>{r?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return P.or([()=>P.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Ii{constructor(e,t){this.persistence=e,this.gi=new Kt((r=>A_(r.path)),((r,i)=>r.isEqual(i))),this.garbageCollector=My(this,t)}static Vi(e,t){return new Ii(e,t)}Ii(){}di(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((i=>r+i))))}yr(e){let t=0;return this.gr(e,(r=>{t++})).next((()=>t))}gr(e,t){return P.forEach(this.gi,((r,i)=>this.Sr(e,r,i).next((s=>s?P.resolve():t(i)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ri(e,(a=>this.Sr(e,a,t).next((u=>{u||(r++,s.removeEntry(a,F.min()))})))).next((()=>s.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),P.resolve()}removeReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),P.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ni(e.data.value)),t}Sr(e,t,r){return P.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.gi.get(t);return P.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.Is=r,this.ds=i}static Es(e,t){let r=G(),i=G();for(const s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Fo(e,t.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return Sf()?8:I_(Ae())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,r,i){const s={result:null};return this.ps(e,t).next((a=>{s.result=a})).next((()=>{if(!s.result)return this.ys(e,t,i,r).next((a=>{s.result=a}))})).next((()=>{if(s.result)return;const a=new Ky;return this.ws(e,t,a).next((u=>{if(s.result=u,this.Rs)return this.Ss(e,t,a,u.size)}))})).next((()=>s.result))}Ss(e,t,r,i){return r.documentReadCount<this.Vs?(en()<=W.DEBUG&&N("QueryEngine","SDK will not create cache indexes for query:",tn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),P.resolve()):(en()<=W.DEBUG&&N("QueryEngine","Query:",tn(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.fs*i?(en()<=W.DEBUG&&N("QueryEngine","The SDK decides to create cache indexes for query:",tn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,$e(t))):P.resolve())}ps(e,t){if(fu(t))return P.resolve(null);let r=$e(t);return this.indexManager.getIndexType(e,r).next((i=>i===0?null:(t.limit!==null&&i===1&&(t=Ei(t,null,"F"),r=$e(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next((s=>{const a=G(...s);return this.gs.getDocuments(e,a).next((u=>this.indexManager.getMinOffset(e,r).next((l=>{const d=this.bs(t,u);return this.Ds(t,d,a,l.readTime)?this.ps(e,Ei(t,null,"F")):this.vs(e,d,t,l)}))))})))))}ys(e,t,r,i){return fu(t)||i.isEqual(F.min())?P.resolve(null):this.gs.getDocuments(e,r).next((s=>{const a=this.bs(t,s);return this.Ds(t,a,r,i)?P.resolve(null):(en()<=W.DEBUG&&N("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),tn(t)),this.vs(e,a,t,__(i,sr)).next((u=>u)))}))}bs(e,t){let r=new le(gh(e));return t.forEach(((i,s)=>{Ui(e,s)&&(r=r.add(s))})),r}Ds(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ws(e,t,r){return en()<=W.DEBUG&&N("QueryEngine","Using full collection scan to execute query:",tn(t)),this.gs.getDocumentsMatchingQuery(e,t,At.min(),r)}vs(e,t,r,i){return this.gs.getDocumentsMatchingQuery(e,r,i).next((s=>(t.forEach((a=>{s=s.insert(a.key,a)})),s)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uo="LocalStore",Jy=3e8;class Yy{constructor(e,t,r,i){this.persistence=e,this.Cs=t,this.serializer=i,this.Fs=new ne(j),this.Ms=new Kt((s=>ko(s)),Vo),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(r)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Uy(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function Xy(n,e,t,r){return new Yy(n,e,t,r)}async function Bh(n,e){const t=U(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next((s=>(i=s,t.Ns(e),t.mutationQueue.getAllMutationBatches(r)))).next((s=>{const a=[],u=[];let l=G();for(const d of i){a.push(d.batchId);for(const p of d.mutations)l=l.add(p.key)}for(const d of s){u.push(d.batchId);for(const p of d.mutations)l=l.add(p.key)}return t.localDocuments.getDocuments(r,l).next((d=>({Bs:d,removedBatchIds:a,addedBatchIds:u})))}))}))}function Zy(n,e){const t=U(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const i=e.batch.keys(),s=t.Os.newChangeBuffer({trackRemovals:!0});return(function(u,l,d,p){const g=d.batch,E=g.keys();let S=P.resolve();return E.forEach((C=>{S=S.next((()=>p.getEntry(l,C))).next((O=>{const V=d.docVersions.get(C);J(V!==null,48541),O.version.compareTo(V)<0&&(g.applyToRemoteDocument(O,d),O.isValidDocument()&&(O.setReadTime(d.commitVersion),p.addEntry(O)))}))})),S.next((()=>u.mutationQueue.removeMutationBatch(l,g)))})(t,r,e,s).next((()=>s.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(u){let l=G();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(l=l.add(u.batch.mutations[d].key));return l})(e)))).next((()=>t.localDocuments.getDocuments(r,i)))}))}function jh(n){const e=U(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function eE(n,e){const t=U(n),r=e.snapshotVersion;let i=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(s=>{const a=t.Os.newChangeBuffer({trackRemovals:!0});i=t.Fs;const u=[];e.targetChanges.forEach(((p,g)=>{const E=i.get(g);if(!E)return;u.push(t.hi.removeMatchingKeys(s,p.removedDocuments,g).next((()=>t.hi.addMatchingKeys(s,p.addedDocuments,g))));let S=E.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(g)!==null?S=S.withResumeToken(ge.EMPTY_BYTE_STRING,F.min()).withLastLimboFreeSnapshotVersion(F.min()):p.resumeToken.approximateByteSize()>0&&(S=S.withResumeToken(p.resumeToken,r)),i=i.insert(g,S),(function(O,V,H){return O.resumeToken.approximateByteSize()===0||V.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=Jy?!0:H.addedDocuments.size+H.modifiedDocuments.size+H.removedDocuments.size>0})(E,S,p)&&u.push(t.hi.updateTargetData(s,S))}));let l=it(),d=G();if(e.documentUpdates.forEach((p=>{e.resolvedLimboDocuments.has(p)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(s,p))})),u.push(tE(s,a,e.documentUpdates).next((p=>{l=p.Ls,d=p.ks}))),!r.isEqual(F.min())){const p=t.hi.getLastRemoteSnapshotVersion(s).next((g=>t.hi.setTargetsMetadata(s,s.currentSequenceNumber,r)));u.push(p)}return P.waitFor(u).next((()=>a.apply(s))).next((()=>t.localDocuments.getLocalViewOfDocuments(s,l,d))).next((()=>l))})).then((s=>(t.Fs=i,s)))}function tE(n,e,t){let r=G(),i=G();return t.forEach((s=>r=r.add(s))),e.getEntries(n,r).next((s=>{let a=it();return t.forEach(((u,l)=>{const d=s.get(u);l.isFoundDocument()!==d.isFoundDocument()&&(i=i.add(u)),l.isNoDocument()&&l.version.isEqual(F.min())?(e.removeEntry(u,l.readTime),a=a.insert(u,l)):!d.isValidDocument()||l.version.compareTo(d.version)>0||l.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(l),a=a.insert(u,l)):N(Uo,"Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",l.version)})),{Ls:a,ks:i}}))}function nE(n,e){const t=U(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=So),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function rE(n,e){const t=U(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let i;return t.hi.getTargetData(r,e).next((s=>s?(i=s,P.resolve(i)):t.hi.allocateTargetId(r).next((a=>(i=new gt(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.hi.addTargetData(r,i).next((()=>i)))))))})).then((r=>{const i=t.Fs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(r.targetId,r),t.Ms.set(e,r.targetId)),r}))}async function io(n,e,t){const r=U(n),i=r.Fs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",s,(a=>r.persistence.referenceDelegate.removeTarget(a,i)))}catch(a){if(!wn(a))throw a;N(Uo,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Fs=r.Fs.remove(e),r.Ms.delete(i.target)}function bu(n,e,t){const r=U(n);let i=F.min(),s=G();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(l,d,p){const g=U(l),E=g.Ms.get(p);return E!==void 0?P.resolve(g.Fs.get(E)):g.hi.getTargetData(d,p)})(r,a,$e(e)).next((u=>{if(u)return i=u.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(a,u.targetId).next((l=>{s=l}))})).next((()=>r.Cs.getDocumentsMatchingQuery(a,e,t?i:F.min(),t?s:G()))).next((u=>(iE(r,$_(e),u),{documents:u,qs:s})))))}function iE(n,e,t){let r=n.xs.get(e)||F.min();t.forEach(((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)})),n.xs.set(e,r)}class Su{constructor(){this.activeTargetIds=Q_()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class sE{constructor(){this.Fo=new Su,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,r){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Su,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oE{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pu="ConnectivityMonitor";class Cu{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){N(Pu,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){N(Pu,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Kr=null;function so(){return Kr===null?Kr=(function(){return 268435456+Math.round(2147483648*Math.random())})():Kr++,"0x"+Kr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ks="RestConnection",aE={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class cE{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.Ko=this.databaseId.database===gi?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,t,r,i,s){const a=so(),u=this.Go(e,t.toUriEncodedString());N(ks,`Sending RPC '${e}' ${a}:`,u,r);const l={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(l,i,s);const{host:d}=new URL(u),p=_n(d);return this.jo(e,u,l,r,p).then((g=>(N(ks,`Received RPC '${e}' ${a}: `,g),g)),(g=>{throw wt(ks,`RPC '${e}' ${a} failed with error: `,g,"url: ",u,"request:",r),g}))}Jo(e,t,r,i,s,a){return this.Wo(e,t,r,i,s)}zo(e,t,r){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Tn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((i,s)=>e[s]=i)),r&&r.headers.forEach(((i,s)=>e[s]=i))}Go(e,t){const r=aE[e];return`${this.$o}/v1/${t}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uE{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Te="WebChannelConnection";class lE extends cE{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,r,i,s){const a=so();return new Promise(((u,l)=>{const d=new ql;d.setWithCredentials(!0),d.listenOnce($l.COMPLETE,(()=>{try{switch(d.getLastErrorCode()){case ti.NO_ERROR:const g=d.getResponseJson();N(Te,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(g)),u(g);break;case ti.TIMEOUT:N(Te,`RPC '${e}' ${a} timed out`),l(new D(b.DEADLINE_EXCEEDED,"Request time out"));break;case ti.HTTP_ERROR:const E=d.getStatus();if(N(Te,`RPC '${e}' ${a} failed with status:`,E,"response text:",d.getResponseText()),E>0){let S=d.getResponseJson();Array.isArray(S)&&(S=S[0]);const C=S==null?void 0:S.error;if(C&&C.status&&C.message){const O=(function(H){const B=H.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(B)>=0?B:b.UNKNOWN})(C.status);l(new D(O,C.message))}else l(new D(b.UNKNOWN,"Server responded with status "+d.getStatus()))}else l(new D(b.UNAVAILABLE,"Connection failed."));break;default:x(9055,{c_:e,streamId:a,l_:d.getLastErrorCode(),h_:d.getLastError()})}}finally{N(Te,`RPC '${e}' ${a} completed.`)}}));const p=JSON.stringify(i);N(Te,`RPC '${e}' ${a} sending request:`,i),d.send(t,"POST",p,r,15)}))}P_(e,t,r){const i=so(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Wl(),u=zl(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(l.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(l.useFetchStreams=!0),this.zo(l.initMessageHeaders,t,r),l.encodeInitMessageHeaders=!0;const p=s.join("");N(Te,`Creating RPC '${e}' stream ${i}: ${p}`,l);const g=a.createWebChannel(p,l);this.T_(g);let E=!1,S=!1;const C=new uE({Ho:V=>{S?N(Te,`Not sending because RPC '${e}' stream ${i} is closed:`,V):(E||(N(Te,`Opening RPC '${e}' stream ${i} transport.`),g.open(),E=!0),N(Te,`RPC '${e}' stream ${i} sending:`,V),g.send(V))},Yo:()=>g.close()}),O=(V,H,B)=>{V.listen(H,(z=>{try{B(z)}catch(te){setTimeout((()=>{throw te}),0)}}))};return O(g,zn.EventType.OPEN,(()=>{S||(N(Te,`RPC '${e}' stream ${i} transport opened.`),C.s_())})),O(g,zn.EventType.CLOSE,(()=>{S||(S=!0,N(Te,`RPC '${e}' stream ${i} transport closed`),C.__(),this.I_(g))})),O(g,zn.EventType.ERROR,(V=>{S||(S=!0,wt(Te,`RPC '${e}' stream ${i} transport errored. Name:`,V.name,"Message:",V.message),C.__(new D(b.UNAVAILABLE,"The operation could not be completed")))})),O(g,zn.EventType.MESSAGE,(V=>{var H;if(!S){const B=V.data[0];J(!!B,16349);const z=B,te=(z==null?void 0:z.error)||((H=z[0])===null||H===void 0?void 0:H.error);if(te){N(Te,`RPC '${e}' stream ${i} received error:`,te);const De=te.status;let se=(function(y){const v=ae[y];if(v!==void 0)return Ph(v)})(De),T=te.message;se===void 0&&(se=b.INTERNAL,T="Unknown error status: "+De+" with message "+te.message),S=!0,C.__(new D(se,T)),g.close()}else N(Te,`RPC '${e}' stream ${i} received:`,B),C.a_(B)}})),O(u,Hl.STAT_EVENT,(V=>{V.stat===Gs.PROXY?N(Te,`RPC '${e}' stream ${i} detected buffering proxy`):V.stat===Gs.NOPROXY&&N(Te,`RPC '${e}' stream ${i} detected no buffering proxy`)})),setTimeout((()=>{C.o_()}),0),C}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function Vs(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $i(n){return new py(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qh{constructor(e,t,r=1e3,i=1.5,s=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=i,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),i=Math.max(0,t-r);i>0&&N("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ku="PersistentStream";class $h{constructor(e,t,r,i,s,a,u,l){this.Fi=e,this.w_=r,this.S_=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=l,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new qh(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===b.RESOURCE_EXHAUSTED?(rt(t.toString()),rt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,i])=>{this.b_===t&&this.W_(r,i)}),(r=>{e((()=>{const i=new D(b.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(i)}))}))}W_(e,t){const r=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{r((()=>this.listener.Zo()))})),this.stream.e_((()=>{r((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((i=>{r((()=>this.G_(i)))})),this.stream.onMessage((i=>{r((()=>++this.C_==1?this.j_(i):this.onNext(i)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return N(ku,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(N(ku,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class hE extends $h{constructor(e,t,r,i,s,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=_y(this.serializer,e),r=(function(s){if(!("targetChange"in s))return F.min();const a=s.targetChange;return a.targetIds&&a.targetIds.length?F.min():a.readTime?He(a.readTime):F.min()})(e);return this.listener.J_(t,r)}H_(e){const t={};t.database=ro(this.serializer),t.addTarget=(function(s,a){let u;const l=a.target;if(u=Xs(l)?{documents:vy(s,l)}:{query:Ty(s,l).Vt},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=Vh(s,a.resumeToken);const d=eo(s,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(F.min())>0){u.readTime=Ti(s,a.snapshotVersion.toTimestamp());const d=eo(s,a.expectedCount);d!==null&&(u.expectedCount=d)}return u})(this.serializer,e);const r=wy(this.serializer,e);r&&(t.labels=r),this.k_(t)}Y_(e){const t={};t.database=ro(this.serializer),t.removeTarget=e,this.k_(t)}}class dE extends $h{constructor(e,t,r,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return J(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,J(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){J(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=Ey(e.writeResults,e.commitTime),r=He(e.commitTime);return this.listener.ta(r,t)}na(){const e={};e.database=ro(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>yy(this.serializer,r)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fE{}class pE extends fE{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new D(b.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,r,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,a])=>this.connection.Wo(e,to(t,r),i,s,a))).catch((s=>{throw s.name==="FirebaseError"?(s.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new D(b.UNKNOWN,s.toString())}))}Jo(e,t,r,i,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,u])=>this.connection.Jo(e,to(t,r),i,a,u,s))).catch((a=>{throw a.name==="FirebaseError"?(a.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new D(b.UNKNOWN,a.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class mE{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(rt(t),this._a=!1):N("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wt="RemoteStore";class gE{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo((a=>{r.enqueueAndForget((async()=>{Qt(this)&&(N(Wt,"Restarting streams for network reachability change."),await(async function(l){const d=U(l);d.Ia.add(4),await Tr(d),d.Aa.set("Unknown"),d.Ia.delete(4),await Hi(d)})(this))}))})),this.Aa=new mE(r,i)}}async function Hi(n){if(Qt(n))for(const e of n.da)await e(!0)}async function Tr(n){for(const e of n.da)await e(!1)}function Hh(n,e){const t=U(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),$o(t)?qo(t):Rn(t).x_()&&jo(t,e))}function Bo(n,e){const t=U(n),r=Rn(t);t.Ta.delete(e),r.x_()&&zh(t,e),t.Ta.size===0&&(r.x_()?r.B_():Qt(t)&&t.Aa.set("Unknown"))}function jo(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(F.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Rn(n).H_(e)}function zh(n,e){n.Ra.$e(e),Rn(n).Y_(e)}function qo(n){n.Ra=new ly({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),Rn(n).start(),n.Aa.aa()}function $o(n){return Qt(n)&&!Rn(n).M_()&&n.Ta.size>0}function Qt(n){return U(n).Ia.size===0}function Wh(n){n.Ra=void 0}async function _E(n){n.Aa.set("Online")}async function yE(n){n.Ta.forEach(((e,t)=>{jo(n,e)}))}async function EE(n,e){Wh(n),$o(n)?(n.Aa.la(e),qo(n)):n.Aa.set("Unknown")}async function vE(n,e,t){if(n.Aa.set("Online"),e instanceof kh&&e.state===2&&e.cause)try{await(async function(i,s){const a=s.cause;for(const u of s.targetIds)i.Ta.has(u)&&(await i.remoteSyncer.rejectListen(u,a),i.Ta.delete(u),i.Ra.removeTarget(u))})(n,e)}catch(r){N(Wt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await wi(n,r)}else if(e instanceof si?n.Ra.Ye(e):e instanceof Ch?n.Ra.it(e):n.Ra.et(e),!t.isEqual(F.min()))try{const r=await jh(n.localStore);t.compareTo(r)>=0&&await(function(s,a){const u=s.Ra.Pt(a);return u.targetChanges.forEach(((l,d)=>{if(l.resumeToken.approximateByteSize()>0){const p=s.Ta.get(d);p&&s.Ta.set(d,p.withResumeToken(l.resumeToken,a))}})),u.targetMismatches.forEach(((l,d)=>{const p=s.Ta.get(l);if(!p)return;s.Ta.set(l,p.withResumeToken(ge.EMPTY_BYTE_STRING,p.snapshotVersion)),zh(s,l);const g=new gt(p.target,l,d,p.sequenceNumber);jo(s,g)})),s.remoteSyncer.applyRemoteEvent(u)})(n,t)}catch(r){N(Wt,"Failed to raise snapshot:",r),await wi(n,r)}}async function wi(n,e,t){if(!wn(e))throw e;n.Ia.add(1),await Tr(n),n.Aa.set("Offline"),t||(t=()=>jh(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{N(Wt,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await Hi(n)}))}function Gh(n,e){return e().catch((t=>wi(n,t,e)))}async function zi(n){const e=U(n),t=Pt(e);let r=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:So;for(;TE(e);)try{const i=await nE(e.localStore,r);if(i===null){e.Pa.length===0&&t.B_();break}r=i.batchId,IE(e,i)}catch(i){await wi(e,i)}Kh(e)&&Qh(e)}function TE(n){return Qt(n)&&n.Pa.length<10}function IE(n,e){n.Pa.push(e);const t=Pt(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function Kh(n){return Qt(n)&&!Pt(n).M_()&&n.Pa.length>0}function Qh(n){Pt(n).start()}async function wE(n){Pt(n).na()}async function AE(n){const e=Pt(n);for(const t of n.Pa)e.X_(t.mutations)}async function RE(n,e,t){const r=n.Pa.shift(),i=No.from(r,e,t);await Gh(n,(()=>n.remoteSyncer.applySuccessfulWrite(i))),await zi(n)}async function bE(n,e){e&&Pt(n).Z_&&await(async function(r,i){if((function(a){return cy(a)&&a!==b.ABORTED})(i.code)){const s=r.Pa.shift();Pt(r).N_(),await Gh(r,(()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i))),await zi(r)}})(n,e),Kh(n)&&Qh(n)}async function Vu(n,e){const t=U(n);t.asyncQueue.verifyOperationInProgress(),N(Wt,"RemoteStore received new credentials");const r=Qt(t);t.Ia.add(3),await Tr(t),r&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Hi(t)}async function SE(n,e){const t=U(n);e?(t.Ia.delete(2),await Hi(t)):e||(t.Ia.add(2),await Tr(t),t.Aa.set("Unknown"))}function Rn(n){return n.Va||(n.Va=(function(t,r,i){const s=U(t);return s.ia(),new hE(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(n.datastore,n.asyncQueue,{Zo:_E.bind(null,n),e_:yE.bind(null,n),n_:EE.bind(null,n),J_:vE.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),$o(n)?qo(n):n.Aa.set("Unknown")):(await n.Va.stop(),Wh(n))}))),n.Va}function Pt(n){return n.ma||(n.ma=(function(t,r,i){const s=U(t);return s.ia(),new dE(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:wE.bind(null,n),n_:bE.bind(null,n),ea:AE.bind(null,n),ta:RE.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await zi(n)):(await n.ma.stop(),n.Pa.length>0&&(N(Wt,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new et,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const a=Date.now()+r,u=new Ho(e,t,a,i,s);return u.start(r),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function zo(n,e){if(rt("AsyncQueue",`${e}: ${n}`),wn(n))return new D(b.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un{static emptySet(e){return new un(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||L.comparator(t.key,r.key):(t,r)=>L.comparator(t.key,r.key),this.keyedMap=Wn(),this.sortedSet=new ne(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof un)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new un;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Du{constructor(){this.fa=new ne(L.comparator)}track(e){const t=e.doc.key,r=this.fa.get(t);r?e.type!==0&&r.type===3?this.fa=this.fa.insert(t,e):e.type===3&&r.type!==1?this.fa=this.fa.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.fa=this.fa.remove(t):e.type===1&&r.type===2?this.fa=this.fa.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):x(63341,{At:e,ga:r}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,r)=>{e.push(r)})),e}}class gn{constructor(e,t,r,i,s,a,u,l,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=l,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,i,s){const a=[];return t.forEach((u=>{a.push({type:0,doc:u})})),new gn(e,t,un.emptySet(t),a,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Fi(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==r[i].type||!t[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PE{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class CE{constructor(){this.queries=Nu(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,r){const i=U(t),s=i.queries;i.queries=Nu(),s.forEach(((a,u)=>{for(const l of u.wa)l.onError(r)}))})(this,new D(b.ABORTED,"Firestore shutting down"))}}function Nu(){return new Kt((n=>mh(n)),Fi)}async function Wo(n,e){const t=U(n);let r=3;const i=e.query;let s=t.queries.get(i);s?!s.Sa()&&e.ba()&&(r=2):(s=new PE,r=e.ba()?0:1);try{switch(r){case 0:s.ya=await t.onListen(i,!0);break;case 1:s.ya=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const u=zo(a,`Initialization of query '${tn(e.query)}' failed`);return void e.onError(u)}t.queries.set(i,s),s.wa.push(e),e.va(t.onlineState),s.ya&&e.Ca(s.ya)&&Ko(t)}async function Go(n,e){const t=U(n),r=e.query;let i=3;const s=t.queries.get(r);if(s){const a=s.wa.indexOf(e);a>=0&&(s.wa.splice(a,1),s.wa.length===0?i=e.ba()?0:1:!s.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function kE(n,e){const t=U(n);let r=!1;for(const i of e){const s=i.query,a=t.queries.get(s);if(a){for(const u of a.wa)u.Ca(i)&&(r=!0);a.ya=i}}r&&Ko(t)}function VE(n,e,t){const r=U(n),i=r.queries.get(e);if(i)for(const s of i.wa)s.onError(t);r.queries.delete(e)}function Ko(n){n.Da.forEach((e=>{e.next()}))}var oo,Ou;(Ou=oo||(oo={})).Fa="default",Ou.Cache="cache";class Qo{constructor(e,t,r){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=r||{}}Ca(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new gn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const r=t!=="Offline";return(!this.options.ka||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=gn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==oo.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jh{constructor(e){this.key=e}}class Yh{constructor(e){this.key=e}}class DE{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=G(),this.mutatedKeys=G(),this.Xa=gh(e),this.eu=new un(this.Xa)}get tu(){return this.Ha}nu(e,t){const r=t?t.ru:new Du,i=t?t.eu:this.eu;let s=t?t.mutatedKeys:this.mutatedKeys,a=i,u=!1;const l=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,d=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((p,g)=>{const E=i.get(p),S=Ui(this.query,g)?g:null,C=!!E&&this.mutatedKeys.has(E.key),O=!!S&&(S.hasLocalMutations||this.mutatedKeys.has(S.key)&&S.hasCommittedMutations);let V=!1;E&&S?E.data.isEqual(S.data)?C!==O&&(r.track({type:3,doc:S}),V=!0):this.iu(E,S)||(r.track({type:2,doc:S}),V=!0,(l&&this.Xa(S,l)>0||d&&this.Xa(S,d)<0)&&(u=!0)):!E&&S?(r.track({type:0,doc:S}),V=!0):E&&!S&&(r.track({type:1,doc:E}),V=!0,(l||d)&&(u=!0)),V&&(S?(a=a.add(S),s=O?s.add(p):s.delete(p)):(a=a.delete(p),s=s.delete(p)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const p=this.query.limitType==="F"?a.last():a.first();a=a.delete(p.key),s=s.delete(p.key),r.track({type:1,doc:p})}return{eu:a,ru:r,Ds:u,mutatedKeys:s}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,i){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const a=e.ru.pa();a.sort(((p,g)=>(function(S,C){const O=V=>{switch(V){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return x(20277,{At:V})}};return O(S)-O(C)})(p.type,g.type)||this.Xa(p.doc,g.doc))),this.su(r),i=i!=null&&i;const u=t&&!i?this.ou():[],l=this.Za.size===0&&this.current&&!i?1:0,d=l!==this.Ya;return this.Ya=l,a.length!==0||d?{snapshot:new gn(this.query,e.eu,s,a,e.mutatedKeys,l===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),_u:u}:{_u:u}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Du,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=G(),this.eu.forEach((r=>{this.au(r.key)&&(this.Za=this.Za.add(r.key))}));const t=[];return e.forEach((r=>{this.Za.has(r)||t.push(new Yh(r))})),this.Za.forEach((r=>{e.has(r)||t.push(new Jh(r))})),t}uu(e){this.Ha=e.qs,this.Za=G();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return gn.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Jo="SyncEngine";class NE{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class OE{constructor(e){this.key=e,this.lu=!1}}class LE{constructor(e,t,r,i,s,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.hu={},this.Pu=new Kt((u=>mh(u)),Fi),this.Tu=new Map,this.Iu=new Set,this.du=new ne(L.comparator),this.Eu=new Map,this.Au=new Mo,this.Ru={},this.Vu=new Map,this.mu=mn.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function ME(n,e,t=!0){const r=rd(n);let i;const s=r.Pu.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await Xh(r,e,t,!0),i}async function xE(n,e){const t=rd(n);await Xh(t,e,!0,!1)}async function Xh(n,e,t,r){const i=await rE(n.localStore,$e(e)),s=i.targetId,a=n.sharedClientState.addLocalQueryTarget(s,t);let u;return r&&(u=await FE(n,e,s,a==="current",i.resumeToken)),n.isPrimaryClient&&t&&Hh(n.remoteStore,i),u}async function FE(n,e,t,r,i){n.gu=(g,E,S)=>(async function(O,V,H,B){let z=V.view.nu(H);z.Ds&&(z=await bu(O.localStore,V.query,!1).then((({documents:T})=>V.view.nu(T,z))));const te=B&&B.targetChanges.get(V.targetId),De=B&&B.targetMismatches.get(V.targetId)!=null,se=V.view.applyChanges(z,O.isPrimaryClient,te,De);return Mu(O,V.targetId,se._u),se.snapshot})(n,g,E,S);const s=await bu(n.localStore,e,!0),a=new DE(e,s.qs),u=a.nu(s.documents),l=vr.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",i),d=a.applyChanges(u,n.isPrimaryClient,l);Mu(n,t,d._u);const p=new NE(e,t,a);return n.Pu.set(e,p),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),d.snapshot}async function UE(n,e,t){const r=U(n),i=r.Pu.get(e),s=r.Tu.get(i.targetId);if(s.length>1)return r.Tu.set(i.targetId,s.filter((a=>!Fi(a,e)))),void r.Pu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await io(r.localStore,i.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(i.targetId),t&&Bo(r.remoteStore,i.targetId),ao(r,i.targetId)})).catch(In)):(ao(r,i.targetId),await io(r.localStore,i.targetId,!0))}async function BE(n,e){const t=U(n),r=t.Pu.get(e),i=t.Tu.get(r.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Bo(t.remoteStore,r.targetId))}async function jE(n,e,t){const r=KE(n);try{const i=await(function(a,u){const l=U(a),d=ee.now(),p=u.reduce(((S,C)=>S.add(C.key)),G());let g,E;return l.persistence.runTransaction("Locally write mutations","readwrite",(S=>{let C=it(),O=G();return l.Os.getEntries(S,p).next((V=>{C=V,C.forEach(((H,B)=>{B.isValidDocument()||(O=O.add(H))}))})).next((()=>l.localDocuments.getOverlayedDocuments(S,C))).next((V=>{g=V;const H=[];for(const B of u){const z=ry(B,g.get(B.key).overlayedDocument);z!=null&&H.push(new Nt(B.key,z,ah(z.value.mapValue),xe.exists(!0)))}return l.mutationQueue.addMutationBatch(S,d,H,u)})).next((V=>{E=V;const H=V.applyToLocalDocumentSet(g,O);return l.documentOverlayCache.saveOverlays(S,V.batchId,H)}))})).then((()=>({batchId:E.batchId,changes:yh(g)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),(function(a,u,l){let d=a.Ru[a.currentUser.toKey()];d||(d=new ne(j)),d=d.insert(u,l),a.Ru[a.currentUser.toKey()]=d})(r,i.batchId,t),await Ir(r,i.changes),await zi(r.remoteStore)}catch(i){const s=zo(i,"Failed to persist write");t.reject(s)}}async function Zh(n,e){const t=U(n);try{const r=await eE(t.localStore,e);e.targetChanges.forEach(((i,s)=>{const a=t.Eu.get(s);a&&(J(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?a.lu=!0:i.modifiedDocuments.size>0?J(a.lu,14607):i.removedDocuments.size>0&&(J(a.lu,42227),a.lu=!1))})),await Ir(t,r,e)}catch(r){await In(r)}}function Lu(n,e,t){const r=U(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const i=[];r.Pu.forEach(((s,a)=>{const u=a.view.va(e);u.snapshot&&i.push(u.snapshot)})),(function(a,u){const l=U(a);l.onlineState=u;let d=!1;l.queries.forEach(((p,g)=>{for(const E of g.wa)E.va(u)&&(d=!0)})),d&&Ko(l)})(r.eventManager,e),i.length&&r.hu.J_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function qE(n,e,t){const r=U(n);r.sharedClientState.updateQueryState(e,"rejected",t);const i=r.Eu.get(e),s=i&&i.key;if(s){let a=new ne(L.comparator);a=a.insert(s,we.newNoDocument(s,F.min()));const u=G().add(s),l=new qi(F.min(),new Map,new ne(j),a,u);await Zh(r,l),r.du=r.du.remove(s),r.Eu.delete(e),Yo(r)}else await io(r.localStore,e,!1).then((()=>ao(r,e,t))).catch(In)}async function $E(n,e){const t=U(n),r=e.batch.batchId;try{const i=await Zy(t.localStore,e);td(t,r,null),ed(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Ir(t,i)}catch(i){await In(i)}}async function HE(n,e,t){const r=U(n);try{const i=await(function(a,u){const l=U(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let p;return l.mutationQueue.lookupMutationBatch(d,u).next((g=>(J(g!==null,37113),p=g.keys(),l.mutationQueue.removeMutationBatch(d,g)))).next((()=>l.mutationQueue.performConsistencyCheck(d))).next((()=>l.documentOverlayCache.removeOverlaysForBatchId(d,p,u))).next((()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,p))).next((()=>l.localDocuments.getDocuments(d,p)))}))})(r.localStore,e);td(r,e,t),ed(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Ir(r,i)}catch(i){await In(i)}}function ed(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function td(n,e,t){const r=U(n);let i=r.Ru[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.Ru[r.currentUser.toKey()]=i}}function ao(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Tu.get(e))n.Pu.delete(r),t&&n.hu.pu(r,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((r=>{n.Au.containsKey(r)||nd(n,r)}))}function nd(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(Bo(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),Yo(n))}function Mu(n,e,t){for(const r of t)r instanceof Jh?(n.Au.addReference(r.key,e),zE(n,r)):r instanceof Yh?(N(Jo,"Document no longer in limbo: "+r.key),n.Au.removeReference(r.key,e),n.Au.containsKey(r.key)||nd(n,r.key)):x(19791,{yu:r})}function zE(n,e){const t=e.key,r=t.path.canonicalString();n.du.get(t)||n.Iu.has(r)||(N(Jo,"New document in limbo: "+t),n.Iu.add(r),Yo(n))}function Yo(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new L(X.fromString(e)),r=n.mu.next();n.Eu.set(r,new OE(t)),n.du=n.du.insert(t,r),Hh(n.remoteStore,new gt($e(xi(t.path)),r,"TargetPurposeLimboResolution",Oi.ue))}}async function Ir(n,e,t){const r=U(n),i=[],s=[],a=[];r.Pu.isEmpty()||(r.Pu.forEach(((u,l)=>{a.push(r.gu(l,e,t).then((d=>{var p;if((d||t)&&r.isPrimaryClient){const g=d?!d.fromCache:(p=t==null?void 0:t.targetChanges.get(l.targetId))===null||p===void 0?void 0:p.current;r.sharedClientState.updateQueryState(l.targetId,g?"current":"not-current")}if(d){i.push(d);const g=Fo.Es(l.targetId,d);s.push(g)}})))})),await Promise.all(a),r.hu.J_(i),await(async function(l,d){const p=U(l);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",(g=>P.forEach(d,(E=>P.forEach(E.Is,(S=>p.persistence.referenceDelegate.addReference(g,E.targetId,S))).next((()=>P.forEach(E.ds,(S=>p.persistence.referenceDelegate.removeReference(g,E.targetId,S)))))))))}catch(g){if(!wn(g))throw g;N(Uo,"Failed to update sequence numbers: "+g)}for(const g of d){const E=g.targetId;if(!g.fromCache){const S=p.Fs.get(E),C=S.snapshotVersion,O=S.withLastLimboFreeSnapshotVersion(C);p.Fs=p.Fs.insert(E,O)}}})(r.localStore,s))}async function WE(n,e){const t=U(n);if(!t.currentUser.isEqual(e)){N(Jo,"User change. New user:",e.toKey());const r=await Bh(t.localStore,e);t.currentUser=e,(function(s,a){s.Vu.forEach((u=>{u.forEach((l=>{l.reject(new D(b.CANCELLED,a))}))})),s.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Ir(t,r.Bs)}}function GE(n,e){const t=U(n),r=t.Eu.get(e);if(r&&r.lu)return G().add(r.key);{let i=G();const s=t.Tu.get(e);if(!s)return i;for(const a of s){const u=t.Pu.get(a);i=i.unionWith(u.view.tu)}return i}}function rd(n){const e=U(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Zh.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=GE.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=qE.bind(null,e),e.hu.J_=kE.bind(null,e.eventManager),e.hu.pu=VE.bind(null,e.eventManager),e}function KE(n){const e=U(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=$E.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=HE.bind(null,e),e}class Ai{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=$i(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return Xy(this.persistence,new Qy,e.initialUser,this.serializer)}Du(e){return new Uh(xo.Vi,this.serializer)}bu(e){return new sE}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ai.provider={build:()=>new Ai};class QE extends Ai{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){J(this.persistence.referenceDelegate instanceof Ii,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new Oy(r,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?Se.withCacheSize(this.cacheSizeBytes):Se.DEFAULT;return new Uh((r=>Ii.Vi(r,t)),this.serializer)}}class co{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Lu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=WE.bind(null,this.syncEngine),await SE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new CE})()}createDatastore(e){const t=$i(e.databaseInfo.databaseId),r=(function(s){return new lE(s)})(e.databaseInfo);return(function(s,a,u,l){return new pE(s,a,u,l)})(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,i,s,a,u){return new gE(r,i,s,a,u)})(this.localStore,this.datastore,e.asyncQueue,(t=>Lu(this.syncEngine,t,0)),(function(){return Cu.C()?new Cu:new oE})())}createSyncEngine(e,t){return(function(i,s,a,u,l,d,p){const g=new LE(i,s,a,u,l,d);return p&&(g.fu=!0),g})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(i){const s=U(i);N(Wt,"RemoteStore shutting down."),s.Ia.add(5),await Tr(s),s.Ea.shutdown(),s.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}co.provider={build:()=>new co};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):rt("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ct="FirestoreClient";class JE{constructor(e,t,r,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=i,this.user=Ie.UNAUTHENTICATED,this.clientId=bo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,(async a=>{N(Ct,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(N(Ct,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new et;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=zo(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function Ds(n,e){n.asyncQueue.verifyOperationInProgress(),N(Ct,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async i=>{r.isEqual(i)||(await Bh(e.localStore,i),r=i)})),e.persistence.setDatabaseDeletedListener((()=>{wt("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{N("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((i=>{wt("Terminating Firestore due to IndexedDb database deletion failed",i)}))})),n._offlineComponents=e}async function xu(n,e){n.asyncQueue.verifyOperationInProgress();const t=await YE(n);N(Ct,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Vu(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,i)=>Vu(e.remoteStore,i))),n._onlineComponents=e}async function YE(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){N(Ct,"Using user provided OfflineComponentProvider");try{await Ds(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(i){return i.name==="FirebaseError"?i.code===b.FAILED_PRECONDITION||i.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11})(t))throw t;wt("Error using user provided cache. Falling back to memory cache: "+t),await Ds(n,new Ai)}}else N(Ct,"Using default OfflineComponentProvider"),await Ds(n,new QE(void 0));return n._offlineComponents}async function id(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(N(Ct,"Using user provided OnlineComponentProvider"),await xu(n,n._uninitializedComponentsProvider._online)):(N(Ct,"Using default OnlineComponentProvider"),await xu(n,new co))),n._onlineComponents}function XE(n){return id(n).then((e=>e.syncEngine))}async function Ri(n){const e=await id(n),t=e.eventManager;return t.onListen=ME.bind(null,e.syncEngine),t.onUnlisten=UE.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=xE.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=BE.bind(null,e.syncEngine),t}function ZE(n,e,t={}){const r=new et;return n.asyncQueue.enqueueAndForget((async()=>(function(s,a,u,l,d){const p=new Xo({next:E=>{p.Ou(),a.enqueueAndForget((()=>Go(s,g)));const S=E.docs.has(u);!S&&E.fromCache?d.reject(new D(b.UNAVAILABLE,"Failed to get document because the client is offline.")):S&&E.fromCache&&l&&l.source==="server"?d.reject(new D(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(E)},error:E=>d.reject(E)}),g=new Qo(xi(u.path),p,{includeMetadataChanges:!0,ka:!0});return Wo(s,g)})(await Ri(n),n.asyncQueue,e,t,r))),r.promise}function ev(n,e,t={}){const r=new et;return n.asyncQueue.enqueueAndForget((async()=>(function(s,a,u,l,d){const p=new Xo({next:E=>{p.Ou(),a.enqueueAndForget((()=>Go(s,g))),E.fromCache&&l.source==="server"?d.reject(new D(b.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(E)},error:E=>d.reject(E)}),g=new Qo(u,p,{includeMetadataChanges:!0,ka:!0});return Wo(s,g)})(await Ri(n),n.asyncQueue,e,t,r))),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fu=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const od="firestore.googleapis.com",Uu=!0;class Bu{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new D(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=od,this.ssl=Uu}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Uu;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Fh;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Dy)throw new D(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}g_("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=sd((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,i){return r.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Wi{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Bu({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new D(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Bu(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new a_;switch(r.type){case"firstParty":return new h_(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new D(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Fu.get(t);r&&(N("ComponentProvider","Removing Datastore"),Fu.delete(t),r.terminate())})(this),Promise.resolve()}}function tv(n,e,t,r={}){var i;n=Ve(n,Wi);const s=_n(e),a=n._getSettings(),u=Object.assign(Object.assign({},a),{emulatorOptions:n._getEmulatorOptions()}),l=`${e}:${t}`;s&&(el(`https://${l}`),tl("Firestore",!0)),a.host!==od&&a.host!==l&&wt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const d=Object.assign(Object.assign({},a),{host:l,ssl:s,emulatorOptions:r});if(!qt(d,u)&&(n._setSettings(d),r.mockUserToken)){let p,g;if(typeof r.mockUserToken=="string")p=r.mockUserToken,g=Ie.MOCK_USER;else{p=yf(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const E=r.mockUserToken.sub||r.mockUserToken.user_id;if(!E)throw new D(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");g=new Ie(E)}n._authCredentials=new c_(new Kl(p,g))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new ot(this.firestore,e,this._query)}}class ie{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new It(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ie(this.firestore,e,this._key)}toJSON(){return{type:ie._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(yr(t,ie._jsonSchema))return new ie(e,r||null,new L(X.fromString(t.referencePath)))}}ie._jsonSchemaVersion="firestore/documentReference/1.0",ie._jsonSchema={type:ue("string",ie._jsonSchemaVersion),referencePath:ue("string")};class It extends ot{constructor(e,t,r){super(e,t,xi(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ie(this.firestore,null,new L(e))}withConverter(e){return new It(this.firestore,e,this._path)}}function Ns(n,e,...t){if(n=he(n),Jl("collection","path",e),n instanceof Wi){const r=X.fromString(e,...t);return Zc(r),new It(n,null,r)}{if(!(n instanceof ie||n instanceof It))throw new D(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return Zc(r),new It(n.firestore,null,r)}}function nv(n,e,...t){if(n=he(n),arguments.length===1&&(e=bo.newId()),Jl("doc","path",e),n instanceof Wi){const r=X.fromString(e,...t);return Xc(r),new ie(n,null,new L(r))}{if(!(n instanceof ie||n instanceof It))throw new D(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return Xc(r),new ie(n.firestore,n instanceof It?n.converter:null,new L(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ju="AsyncQueue";class qu{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new qh(this,"async_queue_retry"),this.oc=()=>{const r=Vs();r&&N(ju,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const t=Vs();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Vs();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new et;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!wn(e))throw e;N(ju,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((r=>{throw this.tc=r,this.nc=!1,rt("INTERNAL UNHANDLED ERROR: ",$u(r)),r})).then((r=>(this.nc=!1,r))))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const i=Ho.createAndSchedule(this,e,t,r,(s=>this.lc(s)));return this.ec.push(i),i}ac(){this.tc&&x(47125,{hc:$u(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function $u(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hu(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1})(n,["next","error","complete"])}class kt extends Wi{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new qu,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new qu(e),this._firestoreClient=void 0,await e}}}function rv(n,e){const t=typeof n=="object"?n:sl(),r=typeof n=="string"?n:gi,i=mo(t,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=gf("firestore");s&&tv(i,...s)}return i}function Gi(n){if(n._terminated)throw new D(b.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||iv(n),n._firestoreClient}function iv(n){var e,t,r;const i=n._freezeSettings(),s=(function(u,l,d,p){return new S_(u,l,d,p.host,p.ssl,p.experimentalForceLongPolling,p.experimentalAutoDetectLongPolling,sd(p.experimentalLongPollingOptions),p.useFetchStreams,p.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new JE(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&(function(u){const l=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(l),_online:l}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ne(ge.fromBase64String(e))}catch(t){throw new D(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ne(ge.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ne._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(yr(e,Ne._jsonSchema))return Ne.fromBase64String(e.bytes)}}Ne._jsonSchemaVersion="firestore/bytes/1.0",Ne._jsonSchema={type:ue("string",Ne._jsonSchemaVersion),bytes:ue("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new D(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new me(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new D(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new D(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return j(this._lat,e._lat)||j(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ze._jsonSchemaVersion}}static fromJSON(e){if(yr(e,ze._jsonSchema))return new ze(e.latitude,e.longitude)}}ze._jsonSchemaVersion="firestore/geoPoint/1.0",ze._jsonSchema={type:ue("string",ze._jsonSchemaVersion),latitude:ue("number"),longitude:ue("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0})(this._values,e._values)}toJSON(){return{type:We._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(yr(e,We._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new We(e.vectorValues);throw new D(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}We._jsonSchemaVersion="firestore/vectorValue/1.0",We._jsonSchema={type:ue("string",We._jsonSchemaVersion),vectorValues:ue("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sv=/^__.*__$/;class ov{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Nt(e,this.data,this.fieldMask,t,this.fieldTransforms):new Er(e,this.data,t,this.fieldTransforms)}}class ad{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Nt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function cd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw x(40011,{Ec:n})}}class Zo{constructor(e,t,r,i,s,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Zo(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:r,mc:!1});return i.fc(e),i}gc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:r,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return bi(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(cd(this.Ec)&&sv.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class av{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||$i(e)}Dc(e,t,r,i=!1){return new Zo({Ec:e,methodName:t,bc:r,path:me.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ji(n){const e=n._freezeSettings(),t=$i(n._databaseId);return new av(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ud(n,e,t,r,i,s={}){const a=n.Dc(s.merge||s.mergeFields?2:0,e,t,i);ta("Data must be an object, but it was:",a,r);const u=ld(r,a);let l,d;if(s.merge)l=new ke(a.fieldMask),d=a.fieldTransforms;else if(s.mergeFields){const p=[];for(const g of s.mergeFields){const E=uo(e,g,t);if(!a.contains(E))throw new D(b.INVALID_ARGUMENT,`Field '${E}' is specified in your field mask but missing from your input data.`);dd(p,E)||p.push(E)}l=new ke(p),d=a.fieldTransforms.filter((g=>l.covers(g.field)))}else l=null,d=a.fieldTransforms;return new ov(new Pe(u),l,d)}class Yi extends Qi{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Yi}}class ea extends Qi{_toFieldTransform(e){return new Z_(e.path,new lr)}isEqual(e){return e instanceof ea}}function cv(n,e,t,r){const i=n.Dc(1,e,t);ta("Data must be an object, but it was:",i,r);const s=[],a=Pe.empty();Dt(r,((l,d)=>{const p=na(e,l,t);d=he(d);const g=i.gc(p);if(d instanceof Yi)s.push(p);else{const E=wr(d,g);E!=null&&(s.push(p),a.set(p,E))}}));const u=new ke(s);return new ad(a,u,i.fieldTransforms)}function uv(n,e,t,r,i,s){const a=n.Dc(1,e,t),u=[uo(e,r,t)],l=[i];if(s.length%2!=0)throw new D(b.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let E=0;E<s.length;E+=2)u.push(uo(e,s[E])),l.push(s[E+1]);const d=[],p=Pe.empty();for(let E=u.length-1;E>=0;--E)if(!dd(d,u[E])){const S=u[E];let C=l[E];C=he(C);const O=a.gc(S);if(C instanceof Yi)d.push(S);else{const V=wr(C,O);V!=null&&(d.push(S),p.set(S,V))}}const g=new ke(d);return new ad(p,g,a.fieldTransforms)}function lv(n,e,t,r=!1){return wr(t,n.Dc(r?4:3,e))}function wr(n,e){if(hd(n=he(n)))return ta("Unsupported field value:",e,n),ld(n,e);if(n instanceof Qi)return(function(r,i){if(!cd(i.Ec))throw i.wc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(r,i){const s=[];let a=0;for(const u of r){let l=wr(u,i.yc(a));l==null&&(l={nullValue:"NULL_VALUE"}),s.push(l),a++}return{arrayValue:{values:s}}})(n,e)}return(function(r,i){if((r=he(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return J_(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=ee.fromDate(r);return{timestampValue:Ti(i.serializer,s)}}if(r instanceof ee){const s=new ee(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ti(i.serializer,s)}}if(r instanceof ze)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Ne)return{bytesValue:Vh(i.serializer,r._byteString)};if(r instanceof ie){const s=i.databaseId,a=r.firestore._databaseId;if(!a.isEqual(s))throw i.wc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Lo(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof We)return(function(a,u){return{mapValue:{fields:{[sh]:{stringValue:oh},[_i]:{arrayValue:{values:a.toArray().map((d=>{if(typeof d!="number")throw u.wc("VectorValues must only contain numeric values.");return Do(u.serializer,d)}))}}}}}})(r,i);throw i.wc(`Unsupported field value: ${Ni(r)}`)})(n,e)}function ld(n,e){const t={};return Zl(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Dt(n,((r,i)=>{const s=wr(i,e.Vc(r));s!=null&&(t[r]=s)})),{mapValue:{fields:t}}}function hd(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ee||n instanceof ze||n instanceof Ne||n instanceof ie||n instanceof Qi||n instanceof We)}function ta(n,e,t){if(!hd(t)||!Yl(t)){const r=Ni(t);throw r==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+r)}}function uo(n,e,t){if((e=he(e))instanceof Ki)return e._internalPath;if(typeof e=="string")return na(n,e);throw bi("Field path arguments must be of type string or ",n,!1,void 0,t)}const hv=new RegExp("[~\\*/\\[\\]]");function na(n,e,t){if(e.search(hv)>=0)throw bi(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Ki(...e.split("."))._internalPath}catch{throw bi(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function bi(n,e,t,r,i){const s=r&&!r.isEmpty(),a=i!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${r}`),a&&(l+=` in document ${i}`),l+=")"),new D(b.INVALID_ARGUMENT,u+n+l)}function dd(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ie(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new dv(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ra("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class dv extends fd{data(){return super.data()}}function ra(n,e){return typeof e=="string"?na(n,e):e instanceof Ki?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pd(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new D(b.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ia{}class sa extends ia{}function Os(n,e,...t){let r=[];e instanceof ia&&r.push(e),r=r.concat(t),(function(s){const a=s.filter((l=>l instanceof aa)).length,u=s.filter((l=>l instanceof oa)).length;if(a>1||a>0&&u>0)throw new D(b.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const i of r)n=i._apply(n);return n}class oa extends sa{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new oa(e,t,r)}_apply(e){const t=this._parse(e);return md(e._query,t),new ot(e.firestore,e.converter,Zs(e._query,t))}_parse(e){const t=Ji(e.firestore);return(function(s,a,u,l,d,p,g){let E;if(d.isKeyField()){if(p==="array-contains"||p==="array-contains-any")throw new D(b.INVALID_ARGUMENT,`Invalid Query. You can't perform '${p}' queries on documentId().`);if(p==="in"||p==="not-in"){Wu(g,p);const C=[];for(const O of g)C.push(zu(l,s,O));E={arrayValue:{values:C}}}else E=zu(l,s,g)}else p!=="in"&&p!=="not-in"&&p!=="array-contains-any"||Wu(g,p),E=lv(u,a,g,p==="in"||p==="not-in");return ce.create(d,p,E)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class aa extends ia{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new aa(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:Ue.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(i,s){let a=i;const u=s.getFlattenedFilters();for(const l of u)md(a,l),a=Zs(a,l)})(e._query,t),new ot(e.firestore,e.converter,Zs(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ca extends sa{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new ca(e,t)}_apply(e){const t=(function(i,s,a){if(i.startAt!==null)throw new D(b.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new D(b.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ur(s,a)})(e._query,this._field,this._direction);return new ot(e.firestore,e.converter,(function(i,s){const a=i.explicitOrderBy.concat([s]);return new An(i.path,i.collectionGroup,a,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)})(e._query,t))}}function Ls(n,e="asc"){const t=e,r=ra("orderBy",n);return ca._create(r,t)}class ua extends sa{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new ua(e,t,r)}_apply(e){return new ot(e.firestore,e.converter,Ei(e._query,this._limit,this._limitType))}}function Mv(n){return ua._create("limit",n,"F")}function zu(n,e,t){if(typeof(t=he(t))=="string"){if(t==="")throw new D(b.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!ph(e)&&t.indexOf("/")!==-1)throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(X.fromString(t));if(!L.isDocumentKey(r))throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return au(n,new L(r))}if(t instanceof ie)return au(n,t._key);throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ni(t)}.`)}function Wu(n,e){if(!Array.isArray(n)||n.length===0)throw new D(b.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function md(n,e){const t=(function(i,s){for(const a of i)for(const u of a.getFlattenedFilters())if(s.indexOf(u.op)>=0)return u.op;return null})(n.filters,(function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new D(b.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new D(b.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class fv{convertValue(e,t="none"){switch(St(e)){case 0:return null;case 1:return e.booleanValue;case 2:return oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(bt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw x(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Dt(e,((i,s)=>{r[i]=this.convertValue(s,t)})),r}convertVectorValue(e){var t,r,i;const s=(i=(r=(t=e.fields)===null||t===void 0?void 0:t[_i].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map((a=>oe(a.doubleValue)));return new We(s)}convertGeoPoint(e){return new ze(oe(e.latitude),oe(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Mi(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(or(e));default:return null}}convertTimestamp(e){const t=Rt(e);return new ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=X.fromString(e);J(xh(r),9688,{name:e});const i=new ar(r.get(1),r.get(3)),s=new L(r.popFirst(5));return i.isEqual(t)||rt(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gd(n,e,t){let r;return r=n?n.toFirestore(e):e,r}class Kn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Bt extends fd{constructor(e,t,r,i,s,a){super(e,t,r,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new oi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(ra("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Bt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Bt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Bt._jsonSchema={type:ue("string",Bt._jsonSchemaVersion),bundleSource:ue("string","DocumentSnapshot"),bundleName:ue("string"),bundle:ue("string")};class oi extends Bt{data(e={}){return super.data(e)}}class jt{constructor(e,t,r,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Kn(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new oi(this._firestore,this._userDataWriter,r.key,r,new Kn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new D(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(i,s){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map((u=>{const l=new oi(i._firestore,i._userDataWriter,u.doc.key,u.doc,new Kn(i._snapshot.mutatedKeys.has(u.doc.key),i._snapshot.fromCache),i.query.converter);return u.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}}))}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((u=>s||u.type!==3)).map((u=>{const l=new oi(i._firestore,i._userDataWriter,u.doc.key,u.doc,new Kn(i._snapshot.mutatedKeys.has(u.doc.key),i._snapshot.fromCache),i.query.converter);let d=-1,p=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),p=a.indexOf(u.doc.key)),{type:pv(u.type),doc:l,oldIndex:d,newIndex:p}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=jt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=bo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],i=[];return this.docs.forEach((s=>{s._document!==null&&(t.push(s._document),r.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function pv(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return x(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xv(n){n=Ve(n,ie);const e=Ve(n.firestore,kt);return ZE(Gi(e),n._key).then((t=>_d(e,n,t)))}jt._jsonSchemaVersion="firestore/querySnapshot/1.0",jt._jsonSchema={type:ue("string",jt._jsonSchemaVersion),bundleSource:ue("string","QuerySnapshot"),bundleName:ue("string"),bundle:ue("string")};class la extends fv{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ne(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ie(this.firestore,null,t)}}function Fv(n){n=Ve(n,ot);const e=Ve(n.firestore,kt),t=Gi(e),r=new la(e);return pd(n._query),ev(t,n._query).then((i=>new jt(e,r,n,i)))}function Uv(n,e,t){n=Ve(n,ie);const r=Ve(n.firestore,kt),i=gd(n.converter,e);return ha(r,[ud(Ji(r),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,xe.none())])}function Bv(n,e,t,...r){n=Ve(n,ie);const i=Ve(n.firestore,kt),s=Ji(i);let a;return a=typeof(e=he(e))=="string"||e instanceof Ki?uv(s,"updateDoc",n._key,e,t,r):cv(s,"updateDoc",n._key,e),ha(i,[a.toMutation(n._key,xe.exists(!0))])}function jv(n,e){const t=Ve(n.firestore,kt),r=nv(n),i=gd(n.converter,e);return ha(t,[ud(Ji(n.firestore),"addDoc",r._key,i,n.converter!==null,{}).toMutation(r._key,xe.exists(!1))]).then((()=>r))}function Ms(n,...e){var t,r,i;n=he(n);let s={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||Hu(e[a])||(s=e[a++]);const u={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Hu(e[a])){const g=e[a];e[a]=(t=g.next)===null||t===void 0?void 0:t.bind(g),e[a+1]=(r=g.error)===null||r===void 0?void 0:r.bind(g),e[a+2]=(i=g.complete)===null||i===void 0?void 0:i.bind(g)}let l,d,p;if(n instanceof ie)d=Ve(n.firestore,kt),p=xi(n._key.path),l={next:g=>{e[a]&&e[a](_d(d,n,g))},error:e[a+1],complete:e[a+2]};else{const g=Ve(n,ot);d=Ve(g.firestore,kt),p=g._query;const E=new la(d);l={next:S=>{e[a]&&e[a](new jt(d,E,g,S))},error:e[a+1],complete:e[a+2]},pd(n._query)}return(function(E,S,C,O){const V=new Xo(O),H=new Qo(S,V,C);return E.asyncQueue.enqueueAndForget((async()=>Wo(await Ri(E),H))),()=>{V.Ou(),E.asyncQueue.enqueueAndForget((async()=>Go(await Ri(E),H)))}})(Gi(d),p,u,l)}function ha(n,e){return(function(r,i){const s=new et;return r.asyncQueue.enqueueAndForget((async()=>jE(await XE(r),i,s))),s.promise})(Gi(n),e)}function _d(n,e,t){const r=t.docs.get(e._key),i=new la(n);return new Bt(n,i,e._key,r,new Kn(t.hasPendingWrites,t.fromCache),e.converter)}function qv(){return new ea("serverTimestamp")}(function(e,t=!0){(function(i){Tn=i})(yn),ln(new $t("firestore",((r,{instanceIdentifier:i,options:s})=>{const a=r.getProvider("app").getImmediate(),u=new kt(new u_(r.getProvider("auth-internal")),new d_(a,r.getProvider("app-check-internal")),(function(d,p){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new D(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ar(d.options.projectId,p)})(a,i),a);return s=Object.assign({useFetchStreams:t},s),u._setSettings(s),u}),"PUBLIC").setMultipleInstances(!0)),Et(Gc,Kc,e),Et(Gc,Kc,"esm2017")})();const mv={apiKey:"AIzaSyAzrfzTKENoU034Y-OfBtywu9jmzFFmfZo",authDomain:"ethan-mercados.firebaseapp.com",projectId:"ethan-mercados",storageBucket:"ethan-mercados.firebasestorage.app",messagingSenderId:"404598567416",appId:"1:404598567416:web:3443fd5af436b9489d660d"},yd=il(mv),da=r_(yd),xs=rv(yd);let Si=null;const Ed=[];function gv(n){Ed.push(n),Si!==void 0&&n(Si)}zm(da,n=>{Si=n,Ed.forEach(e=>e(n))});function vd(){return Si}async function _v(n,e){try{return await qm(da,n,e),{ok:!0}}catch(t){return{ok:!1,error:Ev(t.code)}}}async function yv(){await Wm(da)}function Ev(n){return{"auth/invalid-email":"Email inválido.","auth/user-disabled":"Usuario deshabilitado.","auth/user-not-found":"Usuario o contraseña incorrectos.","auth/wrong-password":"Usuario o contraseña incorrectos.","auth/invalid-credential":"Usuario o contraseña incorrectos.","auth/too-many-requests":"Demasiados intentos. Inténtalo más tarde.","auth/network-request-failed":"Error de red. Comprueba tu conexión."}[n]||"Error al iniciar sesión."}const Ze={operaciones:{alcista:[],bajista:[]},vitacora:[],watchlists:{alcistaRV:[],alcistaRF:[],alcistaCommodities:[],bajista:[]},macro:null,ready:!1},vv=new Set,tr=[];function Qr(){vv.forEach(n=>n(Ze))}function Fs(...n){const e=vd();if(!e)throw new Error("No hay usuario autenticado");return["users",e.uid,...n]}function Tv(){if(Td(),!vd())return;const e=Os(Ns(xs,...Fs("operaciones_alcista")),Ls("fechaEntrada","desc"));tr.push(Ms(e,i=>{Ze.operaciones.alcista=i.docs.map(s=>({id:s.id,...s.data()})),Qr()}));const t=Os(Ns(xs,...Fs("operaciones_bajista")),Ls("fecha","desc"));tr.push(Ms(t,i=>{Ze.operaciones.bajista=i.docs.map(s=>({id:s.id,...s.data()})),Qr()}));const r=Os(Ns(xs,...Fs("vitacora")),Ls("fecha","desc"));tr.push(Ms(r,i=>{Ze.vitacora=i.docs.map(s=>({id:s.id,...s.data()})),Qr()})),Ze.ready=!0,Qr()}function Td(){tr.forEach(n=>n()),tr.length=0,Ze.operaciones.alcista=[],Ze.operaciones.bajista=[],Ze.vitacora=[],Ze.ready=!1}const Id={},lo={};let ho=null,Jr=null,wd=null;function $(n,e){Id[n]=e}function Iv(n){wd=n}async function fa(n){const e=Id[n];if(!e){console.error(`ETHAN router: página "${n}" no registrada`);return}if(Jr){try{Jr()}catch(i){console.warn("Error en destroy() del módulo anterior",i)}Jr=null}ho=n,wv(e),Av(n),wd.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-crumb">${e.crumb}</div>
        <div class="page-title">${e.title}</div>
      </div>
      <div class="page-actions" id="page-actions-slot"></div>
    </div>
    <div class="page-body" id="page-body-slot">
      <div class="module-loading">
        <div class="loader-ring"></div>
      </div>
    </div>
  `;const t=document.getElementById("page-body-slot"),r=document.getElementById("page-actions-slot");try{const i=await e.loader(),s=!!lo[n];console.log(`[Router] Cargando ${n}, savedState: ${s}`);const a=await i.render(t,{actionsSlot:r,savedState:lo[n]});a&&typeof a.destroy=="function"&&(Jr=a.destroy)}catch(i){console.error(`Error al cargar el módulo "${n}":`,i),t.innerHTML=`
      <div class="empty">
        <div class="empty-icon">⚠</div>
        <div class="empty-title">Error al cargar el módulo</div>
        <div class="empty-desc">${i.message||i}</div>
      </div>
    `}}function $v(n,e){lo[n]=e,console.log(`[Router] Estado guardado para ${n}:`,Object.keys(e||{}))}function wv(n){const e=document.getElementById("status-module");e&&(e.innerHTML=n.crumb.replace(/›/g,">").toUpperCase()),ho&&history.replaceState(null,"",`#${ho}`)}function Av(n){document.querySelectorAll(".mod[data-page]").forEach(e=>{e.classList.toggle("active",e.dataset.page===n)})}$("dashboard",{crumb:"ETHAN <span>›</span> Dashboard",title:"Dashboard",loader:()=>q(()=>import("./dashboard-BSqotbnQ.js"),__vite__mapDeps([0,1]))});$("macro-home",{crumb:"ETHAN Macro <span>›</span> Dashboard",title:"ETHAN Macro · Dashboard",loader:()=>q(()=>import("./home-CwSdlfYm.js"),__vite__mapDeps([2,3]))});$("macro-ciclo",{crumb:"ETHAN Macro <span>›</span> Ciclo Económico",title:"Ciclo Económico",loader:()=>q(()=>import("./ciclo-B2WvYTj7.js"),__vite__mapDeps([4,3]))});$("macro-liquidez",{crumb:"ETHAN Macro <span>›</span> Liquidez",title:"Liquidez Global",loader:()=>q(()=>import("./liquidez-BbYA1zj5.js"),__vite__mapDeps([5,3]))});$("macro-polmon",{crumb:"ETHAN Macro <span>›</span> Política Monetaria",title:"Política Monetaria",loader:()=>q(()=>import("./polmon-B-WxBb1x.js"),__vite__mapDeps([6,3]))});$("macro-inflacion",{crumb:"ETHAN Macro <span>›</span> Inflación",title:"Inflación",loader:()=>q(()=>import("./inflacion-O_0Az3Cd.js"),__vite__mapDeps([7,3]))});$("macro-sentimiento",{crumb:"ETHAN Macro <span>›</span> Sentimiento",title:"Sentimiento de Mercado",loader:()=>q(()=>import("./sentimiento-BgIW4RtX.js"),__vite__mapDeps([8,3]))});$("macro-radar",{crumb:"ETHAN Macro <span>›</span> Radar de Riesgos",title:"ETHAN Risk Radar",loader:()=>q(()=>import("./radar-BKYWMHkp.js"),__vite__mapDeps([9,3]))});$("macro-calendario",{crumb:"ETHAN Macro <span>›</span> Calendario",title:"Calendario Macro",loader:()=>q(()=>import("./calendario-C0LpokW2.js"),__vite__mapDeps([10,3]))});$("macro-inversor",{crumb:"ETHAN Macro <span>›</span> Modo Inversor",title:"Modo Inversor",loader:()=>q(()=>import("./inversor-eEDX4vNF.js"),__vite__mapDeps([11,3,1]))});$("lab-timeline",{crumb:"ETHAN R-Lab <span>›</span> Timeline & Analogías",title:"ETHAN R-Lab · Timeline & Analogías",loader:()=>q(()=>import("./timeline-rentSPxZ.js"),__vite__mapDeps([12,3]))});$("lab-correlaciones",{crumb:"ETHAN R-Lab <span>›</span> Correlaciones Históricas",title:"ETHAN R-Lab · Correlaciones",loader:()=>q(()=>import("./correlaciones-B_UR6Mze.js"),[])});$("lab-radar",{crumb:"ETHAN R-Lab <span>›</span> RISK_RADAR_V1 Validation",title:"ETHAN R-Lab · Risk Radar Validation",loader:()=>q(()=>import("./radar-BKYWMHkp.js"),__vite__mapDeps([9,3]))});$("lab-trading",{crumb:"ETHAN R-Lab <span>›</span> Trading R-Lab",title:"ETHAN R-Lab · Trading R-Lab",loader:()=>q(()=>import("./trading-rlab-CqP_ahbx.js"),[])});$("lab-macro-rlab",{crumb:"ETHAN R-Lab <span>›</span> Macro R-Lab",title:"ETHAN R-Lab · Macro R-Lab",loader:()=>q(()=>import("./macro-rlab-C_t4IxOd.js"),[])});$("alc-alertas",{crumb:"2. Alcista <span>›</span> Alertas",title:"Alertas · Cambios en Watchlist",loader:()=>q(()=>import("./alertas-DriAwUF3.js"),__vite__mapDeps([13,1]))});$("alc-etf-screener",{crumb:"2. Alcista <span>›</span> 2.1 Renta Variable <span>›</span> Screener ETFs",title:"Screener · ETFs RV",loader:()=>q(()=>import("./etf-screener-DDoOjnl8.js"),__vite__mapDeps([14,1]))});$("alc-rv-analisis",{crumb:"2. Alcista <span>›</span> 2.1 Renta Variable <span>›</span> Análisis",title:"Análisis Técnico",loader:()=>q(()=>import("./rv-analisis-DjJwcV98.js"),[])});$("alc-rv-sectores",{crumb:"2. Alcista <span>›</span> 2.1 Renta Variable <span>›</span> Screener Sectores",title:"Screener de Sectores",loader:()=>q(()=>import("./rv-sectores-ivks5Keo.js"),__vite__mapDeps([15,1]))});$("alc-rv-sp500",{crumb:"2. Alcista <span>›</span> 2.1 Renta Variable <span>›</span> Screener SP500 – NYSE",title:"Screener SP500 / NYSE",loader:()=>q(()=>import("./rv-sp500-BhRTrp-v.js"),__vite__mapDeps([16,1]))});$("alc-rv-watchlist",{crumb:"2. Alcista <span>›</span> 2.1 Renta Variable <span>›</span> Watchlist",title:"Watchlist · Renta Variable",loader:()=>q(()=>import("./rv-watchlist-DP_fqtOn.js"),__vite__mapDeps([17,1]))});$("alc-rv-correcciones",{crumb:"2. Alcista <span>›</span> 2.1 Renta Variable <span>›</span> Correcciones",title:"Watchlist de Correcciones",loader:()=>q(()=>import("./correcciones-DyBii3I4.js"),__vite__mapDeps([18,1]))});$("alc-rf-screener",{crumb:"2. Alcista <span>›</span> 2.2 Renta Fija <span>›</span> Screener",title:"Screener · Renta Fija",loader:()=>q(()=>import("./rf-screener-PcAQosvN.js"),__vite__mapDeps([19,1]))});$("alc-rf-watchlist",{crumb:"2. Alcista <span>›</span> 2.2 Renta Fija <span>›</span> Watchlist",title:"Watchlist · Renta Fija",loader:()=>q(()=>import("./rf-watchlist-DJToNf1A.js"),__vite__mapDeps([20,1]))});$("alc-com-screener",{crumb:"2. Alcista <span>›</span> 2.3 Commodities <span>›</span> Screener",title:"Screener · Commodities",loader:()=>q(()=>import("./com-screener-dvlZPCCd.js"),__vite__mapDeps([21,1]))});$("alc-com-watchlist",{crumb:"2. Alcista <span>›</span> 2.3 Commodities <span>›</span> Watchlist",title:"Watchlist · Commodities",loader:()=>q(()=>import("./com-watchlist-BJUrJc9G.js"),__vite__mapDeps([22,1]))});$("baj-analisis",{crumb:"3. Bajista <span>›</span> Análisis",title:"Bajista · Análisis Técnico",loader:()=>q(()=>import("./analisis-B9DTMiz7.js"),[])});$("baj-sectores",{crumb:"3. Bajista <span>›</span> 3.1 Screener Sectores",title:"Screener de Sectores · Bajista",loader:()=>q(()=>import("./sectores-Bjb3buIs.js"),__vite__mapDeps([23,1]))});$("baj-sp500",{crumb:"3. Bajista <span>›</span> 3.2 Screener SP500 – NYSE",title:"Screener SP500 / NYSE · Bajista",loader:()=>q(()=>import("./sp500-td2h5Fne.js"),__vite__mapDeps([24,1]))});$("baj-watchlist",{crumb:"3. Bajista <span>›</span> 3.3 Watchlist",title:"Watchlist · Bajista",loader:()=>q(()=>import("./watchlist-GkDA_ndt.js"),__vite__mapDeps([25,1]))});$("car-fondo",{crumb:"4. Cartera <span>›</span> 4.1 Fondo ETHAN",title:"Fondo ETHAN",loader:()=>q(()=>import("./fondo-e1XpMiFO.js"),__vite__mapDeps([26,1]))});$("car-cartera",{crumb:"4. Cartera <span>›</span> 4.2 Posiciones",title:"Posiciones",loader:()=>q(()=>import("./cartera-BPeCCQHa.js"),__vite__mapDeps([27,1]))});$("car-metricas",{crumb:"4. Cartera <span>›</span> 4.3 Métricas",title:"Métricas de Trading",loader:()=>q(()=>import("./metricas-DeuTqcFD.js"),__vite__mapDeps([28,1]))});$("car-motor",{crumb:"4. Cartera <span>›</span> ETHAN Motor",title:"ETHAN Motor",loader:()=>q(()=>import("./motor-DglfR_QW.js"),__vite__mapDeps([29,1]))});$("car-backtest",{crumb:"4. Cartera <span>›</span> 4.7 Backtesting",title:"Backtesting",loader:()=>q(()=>import("./backtest-C9Nn2LAU.js"),[])});$("car-vitacora",{crumb:"4. Cartera <span>›</span> 4.8 Bitácora",title:"Bitácora",loader:()=>q(()=>import("./vitacora-C6cIBg_-.js"),__vite__mapDeps([30,1]))});$("fund-analisis",{crumb:"5. Fundamentales",title:"ETHAN Fundamentales",loader:()=>q(()=>import("./analisis-BLyu6c84.js"),[])});$("smart-money",{crumb:"Smart Money <span>›</span> Insider Trading · Short Interest · Institucional",title:"Smart Money Intelligence",loader:()=>q(()=>import("./smart-money-DGZWmhDV.js"),__vite__mapDeps([31,1]))});$("cava",{crumb:"José Luis Cava <span>›</span> Análisis Diario",title:"Cava · Análisis Técnico Diario",loader:()=>q(()=>import("./cava-DBgtXScT.js"),[])});function Rv(){document.querySelectorAll("[data-toggle-grp]").forEach(n=>{n.addEventListener("click",()=>{const e=n.closest(".grp"),t=e.classList.contains("open");document.querySelectorAll(".grp").forEach(r=>r.classList.remove("open")),t||e.classList.add("open")})}),document.querySelectorAll("[data-toggle-sub]").forEach(n=>{n.addEventListener("click",e=>{e.stopPropagation();const t=n.closest(".sub"),r=t.classList.contains("open");t.closest(".grp").querySelectorAll(".sub").forEach(s=>s.classList.remove("open")),r||t.classList.add("open")})}),document.querySelectorAll(".mod[data-page]").forEach(n=>{n.addEventListener("click",()=>fa(n.dataset.page))})}function bv(){var i,s;let n=!1;const e=document.getElementById("app"),t=document.getElementById("sb-toggle-btn"),r=()=>{n=!n,e.classList.toggle("collapsed",n),t.textContent=n?"▷":"◁"};t.addEventListener("click",r),(i=document.getElementById("toggle-sidebar-btn"))==null||i.addEventListener("click",r),(s=document.getElementById("h-brand-home"))==null||s.addEventListener("click",()=>fa("dashboard"))}function Sv(){const n=document.getElementById("clock"),e=()=>{n.textContent=new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit",second:"2-digit"})};e(),setInterval(e,1e3)}const Pv=[{yf:"SPY",label:"SPY"},{yf:"QQQ",label:"QQQ"},{yf:"%5EVIX",label:"VIX"},{yf:"GC%3DF",label:"GC=F"},{yf:"%5ETNX",label:"10Y"},{yf:"DX-Y.NYB",label:"DXY"},{yf:"%5EGSPC",label:"SP500"},{yf:"%5EIXIC",label:"NASDAQ"},{yf:"CL%3DF",label:"OIL"},{yf:"BTC-USD",label:"BTC"}],Cv=[n=>`https://corsproxy.io/?${encodeURIComponent(n)}`,n=>`https://api.allorigins.win/raw?url=${encodeURIComponent(n)}`];async function Gu(n){var t,r,i;const e=`https://query1.finance.yahoo.com/v8/finance/chart/${n}?interval=1d&range=2d`;for(const s of Cv)try{const l=(i=(r=(t=(await(await fetch(s(e),{signal:(()=>{const E=new AbortController;return setTimeout(()=>E.abort(),5e3),E.signal})()})).json()).chart)==null?void 0:t.result)==null?void 0:r[0])==null?void 0:i.meta;if(!l)continue;const d=l.regularMarketPrice,p=l.previousClose||l.chartPreviousClose,g=p?(d-p)/p*100:null;return{price:d,change:g}}catch{}return null}function kv(n,e,t=!1){const r=e?e.price<10?e.price.toFixed(3):e.price<1e3?e.price.toFixed(2):e.price.toFixed(1):"—",i=(e==null?void 0:e.change)!=null?(e.change>=0?"+":"")+e.change.toFixed(2)+"%":"—",s=(e==null?void 0:e.change)!=null?e.change>=0?"up":"down":"";return`<div class="ticker-item">
    <span class="t-sym ${t?"cartera":""}">${n}</span>
    <span class="t-val">${r}</span>
    <span class="t-chg ${s}">${i}</span>
  </div>`}async function Vv(){const n=document.getElementById("tape-track");if(!n)return;let e=[];try{e=await UserData.get("ethan_positions")||[]}catch{}const t=e.filter(u=>u.ticker).map(u=>({yf:u.ticker,label:u.ticker,isCartera:!0})),r=[...Pv.map(u=>({...u,isCartera:!1})),...t.length?[null]:[],...t],i=u=>{const l=r.map(g=>g===null?'<div class="ticker-item separator">◆ CARTERA</div>':kv(g.label,u[g.label]||null,g.isCartera)).join("");n.innerHTML=l+l;const d=r.filter(g=>g!==null).length,p=Math.max(30,d*4);n.style.animationDuration=p+"s"};i({});const s={},a=r.filter(u=>u!==null).map(async u=>{const l=await Gu(u.yf);l&&(s[u.label]=l)});await Promise.all(a),i(s),setInterval(async()=>{const u=r.filter(l=>l!==null).map(async l=>{const d=await Gu(l.yf);d&&(s[l.label]=d)});await Promise.all(u),i(s)},6e4)}function Dv(){const n=document.getElementById("login-form"),e=document.getElementById("login-error"),t=document.getElementById("login-submit");n.addEventListener("submit",async r=>{r.preventDefault();const i=document.getElementById("login-email").value.trim(),s=document.getElementById("login-pass").value;t.disabled=!0,t.textContent="Accediendo…",e.textContent="";const a=await _v(i,s);a.ok||(e.textContent=a.error,t.disabled=!1,t.textContent="Acceder a la plataforma")}),document.getElementById("logout-btn").addEventListener("click",()=>yv())}function Nv(n){document.getElementById("login-screen").classList.add("hidden"),setTimeout(()=>{document.getElementById("login-screen").style.display="none"},700),document.getElementById("app").classList.add("active"),document.getElementById("h-user-email").textContent=n.email,document.getElementById("sb-username").textContent=n.email.split("@")[0],document.getElementById("sb-avatar").textContent=n.email[0].toUpperCase(),Iv(document.getElementById("main")),Tv(),Vv(),fa("dashboard")}function Ov(){document.getElementById("login-screen").style.display="flex",document.getElementById("login-screen").classList.remove("hidden"),document.getElementById("app").classList.remove("active"),Td()}Rv();bv();Dv();Sv();gv(n=>{n?Nv(n):Ov()});document.addEventListener("keydown",n=>{if(document.getElementById("app").classList.contains("active")&&n.altKey&&n.key>="1"&&n.key<="5"){n.preventDefault();const t=document.querySelectorAll(".grp")[+n.key-1];t&&t.querySelector("[data-toggle-grp]").click()}});export{q as _,Uv as a,xs as b,vd as c,nv as d,da as e,Ns as f,xv as g,Ls as h,Fv as i,jv as j,qv as k,Mv as l,fa as n,Ms as o,Os as q,$v as s,Bv as u};
