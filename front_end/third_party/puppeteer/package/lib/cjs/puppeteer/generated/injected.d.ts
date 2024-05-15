/**
 * JavaScript code that provides the puppeteer utilities. See the
 * [README](https://github.com/puppeteer/puppeteer/blob/main/src/injected/README.md)
 * for injection for more information.
 *
 * @internal
 */
export declare const source = "\"use strict\";var v=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var ne=Object.getOwnPropertyNames;var oe=Object.prototype.hasOwnProperty;var u=(t,e)=>{for(var n in e)v(t,n,{get:e[n],enumerable:!0})},se=(t,e,n,r)=>{if(e&&typeof e==\"object\"||typeof e==\"function\")for(let o of ne(e))!oe.call(t,o)&&o!==n&&v(t,o,{get:()=>e[o],enumerable:!(r=re(e,o))||r.enumerable});return t};var ie=t=>se(v({},\"__esModule\",{value:!0}),t);var Re={};u(Re,{default:()=>ke});module.exports=ie(Re);var C=class extends Error{constructor(e,n){super(e,n),this.name=this.constructor.name}get[Symbol.toStringTag](){return this.constructor.name}},b=class extends C{};var f=class t{static create(e){return new t(e)}static async race(e){let n=new Set;try{let r=e.map(o=>o instanceof t?(o.#s&&n.add(o),o.valueOrThrow()):o);return await Promise.race(r)}finally{for(let r of n)r.reject(new Error(\"Timeout cleared\"))}}#e=!1;#r=!1;#n;#t;#o=new Promise(e=>{this.#t=e});#s;#l;constructor(e){e&&e.timeout>0&&(this.#l=new b(e.message),this.#s=setTimeout(()=>{this.reject(this.#l)},e.timeout))}#a(e){clearTimeout(this.#s),this.#n=e,this.#t()}resolve(e){this.#r||this.#e||(this.#e=!0,this.#a(e))}reject(e){this.#r||this.#e||(this.#r=!0,this.#a(e))}resolved(){return this.#e}finished(){return this.#e||this.#r}value(){return this.#n}#i;valueOrThrow(){return this.#i||(this.#i=(async()=>{if(await this.#o,this.#r)throw this.#n;return this.#n})()),this.#i}};var X=new Map,z=t=>{let e=X.get(t);return e||(e=new Function(`return ${t}`)(),X.set(t,e),e)};var k={};u(k,{ariaQuerySelector:()=>le,ariaQuerySelectorAll:()=>I});var le=(t,e)=>globalThis.__ariaQuerySelector(t,e),I=async function*(t,e){yield*await globalThis.__ariaQuerySelectorAll(t,e)};var M={};u(M,{customQuerySelectors:()=>O});var R=class{#e=new Map;register(e,n){if(!n.queryOne&&n.queryAll){let r=n.queryAll;n.queryOne=(o,i)=>{for(let s of r(o,i))return s;return null}}else if(n.queryOne&&!n.queryAll){let r=n.queryOne;n.queryAll=(o,i)=>{let s=r(o,i);return s?[s]:[]}}else if(!n.queryOne||!n.queryAll)throw new Error(\"At least one query method must be defined.\");this.#e.set(e,{querySelector:n.queryOne,querySelectorAll:n.queryAll})}unregister(e){this.#e.delete(e)}get(e){return this.#e.get(e)}clear(){this.#e.clear()}},O=new R;var q={};u(q,{pierceQuerySelector:()=>ae,pierceQuerySelectorAll:()=>ce});var ae=(t,e)=>{let n=null,r=o=>{let i=document.createTreeWalker(o,NodeFilter.SHOW_ELEMENT);do{let s=i.currentNode;s.shadowRoot&&r(s.shadowRoot),!(s instanceof ShadowRoot)&&s!==o&&!n&&s.matches(e)&&(n=s)}while(!n&&i.nextNode())};return t instanceof Document&&(t=t.documentElement),r(t),n},ce=(t,e)=>{let n=[],r=o=>{let i=document.createTreeWalker(o,NodeFilter.SHOW_ELEMENT);do{let s=i.currentNode;s.shadowRoot&&r(s.shadowRoot),!(s instanceof ShadowRoot)&&s!==o&&s.matches(e)&&n.push(s)}while(i.nextNode())};return t instanceof Document&&(t=t.documentElement),r(t),n};var m=(t,e)=>{if(!t)throw new Error(e)};var T=class{#e;#r;#n;#t;constructor(e,n){this.#e=e,this.#r=n}async start(){let e=this.#t=f.create(),n=await this.#e();if(n){e.resolve(n);return}this.#n=new MutationObserver(async()=>{let r=await this.#e();r&&(e.resolve(r),await this.stop())}),this.#n.observe(this.#r,{childList:!0,subtree:!0,attributes:!0})}async stop(){m(this.#t,\"Polling never started.\"),this.#t.finished()||this.#t.reject(new Error(\"Polling stopped\")),this.#n&&(this.#n.disconnect(),this.#n=void 0)}result(){return m(this.#t,\"Polling never started.\"),this.#t.valueOrThrow()}},E=class{#e;#r;constructor(e){this.#e=e}async start(){let e=this.#r=f.create(),n=await this.#e();if(n){e.resolve(n);return}let r=async()=>{if(e.finished())return;let o=await this.#e();if(!o){window.requestAnimationFrame(r);return}e.resolve(o),await this.stop()};window.requestAnimationFrame(r)}async stop(){m(this.#r,\"Polling never started.\"),this.#r.finished()||this.#r.reject(new Error(\"Polling stopped\"))}result(){return m(this.#r,\"Polling never started.\"),this.#r.valueOrThrow()}},P=class{#e;#r;#n;#t;constructor(e,n){this.#e=e,this.#r=n}async start(){let e=this.#t=f.create(),n=await this.#e();if(n){e.resolve(n);return}this.#n=setInterval(async()=>{let r=await this.#e();r&&(e.resolve(r),await this.stop())},this.#r)}async stop(){m(this.#t,\"Polling never started.\"),this.#t.finished()||this.#t.reject(new Error(\"Polling stopped\")),this.#n&&(clearInterval(this.#n),this.#n=void 0)}result(){return m(this.#t,\"Polling never started.\"),this.#t.valueOrThrow()}};var F={};u(F,{pQuerySelector:()=>Ce,pQuerySelectorAll:()=>te});var c=class{static async*map(e,n){for await(let r of e)yield await n(r)}static async*flatMap(e,n){for await(let r of e)yield*n(r)}static async collect(e){let n=[];for await(let r of e)n.push(r);return n}static async first(e){for await(let n of e)return n}};var p={attribute:/\\[\\s*(?:(?<namespace>\\*|[-\\w\\P{ASCII}]*)\\|)?(?<name>[-\\w\\P{ASCII}]+)\\s*(?:(?<operator>\\W?=)\\s*(?<value>.+?)\\s*(\\s(?<caseSensitive>[iIsS]))?\\s*)?\\]/gu,id:/#(?<name>[-\\w\\P{ASCII}]+)/gu,class:/\\.(?<name>[-\\w\\P{ASCII}]+)/gu,comma:/\\s*,\\s*/g,combinator:/\\s*[\\s>+~]\\s*/g,\"pseudo-element\":/::(?<name>[-\\w\\P{ASCII}]+)(?:\\((?<argument>\u00B6*)\\))?/gu,\"pseudo-class\":/:(?<name>[-\\w\\P{ASCII}]+)(?:\\((?<argument>\u00B6*)\\))?/gu,universal:/(?:(?<namespace>\\*|[-\\w\\P{ASCII}]*)\\|)?\\*/gu,type:/(?:(?<namespace>\\*|[-\\w\\P{ASCII}]*)\\|)?(?<name>[-\\w\\P{ASCII}]+)/gu},ue=new Set([\"combinator\",\"comma\"]);var fe=t=>{switch(t){case\"pseudo-element\":case\"pseudo-class\":return new RegExp(p[t].source.replace(\"(?<argument>\\xB6*)\",\"(?<argument>.*)\"),\"gu\");default:return p[t]}};function de(t,e){let n=0,r=\"\";for(;e<t.length;e++){let o=t[e];switch(o){case\"(\":++n;break;case\")\":--n;break}if(r+=o,n===0)return r}return r}function me(t,e=p){if(!t)return[];let n=[t];for(let[o,i]of Object.entries(e))for(let s=0;s<n.length;s++){let l=n[s];if(typeof l!=\"string\")continue;i.lastIndex=0;let a=i.exec(l);if(!a)continue;let h=a.index-1,d=[],V=a[0],H=l.slice(0,h+1);H&&d.push(H),d.push({...a.groups,type:o,content:V});let B=l.slice(h+V.length+1);B&&d.push(B),n.splice(s,1,...d)}let r=0;for(let o of n)switch(typeof o){case\"string\":throw new Error(`Unexpected sequence ${o} found at index ${r}`);case\"object\":r+=o.content.length,o.pos=[r-o.content.length,r],ue.has(o.type)&&(o.content=o.content.trim()||\" \");break}return n}var he=/(['\"])([^\\\\\\n]+?)\\1/g,pe=/\\\\./g;function G(t,e=p){if(t=t.trim(),t===\"\")return[];let n=[];t=t.replace(pe,(i,s)=>(n.push({value:i,offset:s}),\"\\uE000\".repeat(i.length))),t=t.replace(he,(i,s,l,a)=>(n.push({value:i,offset:a}),`${s}${\"\\uE001\".repeat(l.length)}${s}`));{let i=0,s;for(;(s=t.indexOf(\"(\",i))>-1;){let l=de(t,s);n.push({value:l,offset:s}),t=`${t.substring(0,s)}(${\"\\xB6\".repeat(l.length-2)})${t.substring(s+l.length)}`,i=s+l.length}}let r=me(t,e),o=new Set;for(let i of n.reverse())for(let s of r){let{offset:l,value:a}=i;if(!(s.pos[0]<=l&&l+a.length<=s.pos[1]))continue;let{content:h}=s,d=l-s.pos[0];s.content=h.slice(0,d)+a+h.slice(d+a.length),s.content!==h&&o.add(s)}for(let i of o){let s=fe(i.type);if(!s)throw new Error(`Unknown token type: ${i.type}`);s.lastIndex=0;let l=s.exec(i.content);if(!l)throw new Error(`Unable to parse content for ${i.type}: ${i.content}`);Object.assign(i,l.groups)}return r}function*x(t,e){switch(t.type){case\"list\":for(let n of t.list)yield*x(n,t);break;case\"complex\":yield*x(t.left,t),yield*x(t.right,t);break;case\"compound\":yield*t.list.map(n=>[n,t]);break;default:yield[t,e]}}function y(t){let e;return Array.isArray(t)?e=t:e=[...x(t)].map(([n])=>n),e.map(n=>n.content).join(\"\")}p.combinator=/\\s*(>>>>?|[\\s>+~])\\s*/g;var ye=/\\\\[\\s\\S]/g,ge=t=>t.length<=1?t:((t[0]==='\"'||t[0]===\"'\")&&t.endsWith(t[0])&&(t=t.slice(1,-1)),t.replace(ye,e=>e[1]));function K(t){let e=!0,n=G(t);if(n.length===0)return[[],e];let r=[],o=[r],i=[o],s=[];for(let l of n){switch(l.type){case\"combinator\":switch(l.content){case\">>>\":e=!1,s.length&&(r.push(y(s)),s.splice(0)),r=[],o.push(\">>>\"),o.push(r);continue;case\">>>>\":e=!1,s.length&&(r.push(y(s)),s.splice(0)),r=[],o.push(\">>>>\"),o.push(r);continue}break;case\"pseudo-element\":if(!l.name.startsWith(\"-p-\"))break;e=!1,s.length&&(r.push(y(s)),s.splice(0)),r.push({name:l.name.slice(3),value:ge(l.argument??\"\")});continue;case\"comma\":s.length&&(r.push(y(s)),s.splice(0)),r=[],o=[r],i.push(o);continue}s.push(l)}return s.length&&r.push(y(s)),[i,e]}var _={};u(_,{textQuerySelectorAll:()=>S});var we=new Set([\"checkbox\",\"image\",\"radio\"]),Se=t=>t instanceof HTMLSelectElement||t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement&&!we.has(t.type),be=new Set([\"SCRIPT\",\"STYLE\"]),w=t=>!be.has(t.nodeName)&&!document.head?.contains(t),D=new WeakMap,J=t=>{for(;t;)D.delete(t),t instanceof ShadowRoot?t=t.host:t=t.parentNode},Y=new WeakSet,Te=new MutationObserver(t=>{for(let e of t)J(e.target)}),g=t=>{let e=D.get(t);if(e||(e={full:\"\",immediate:[]},!w(t)))return e;let n=\"\";if(Se(t))e.full=t.value,e.immediate.push(t.value),t.addEventListener(\"input\",r=>{J(r.target)},{once:!0,capture:!0});else{for(let r=t.firstChild;r;r=r.nextSibling){if(r.nodeType===Node.TEXT_NODE){e.full+=r.nodeValue??\"\",n+=r.nodeValue??\"\";continue}n&&e.immediate.push(n),n=\"\",r.nodeType===Node.ELEMENT_NODE&&(e.full+=g(r).full)}n&&e.immediate.push(n),t instanceof Element&&t.shadowRoot&&(e.full+=g(t.shadowRoot).full),Y.has(t)||(Te.observe(t,{childList:!0,characterData:!0,subtree:!0}),Y.add(t))}return D.set(t,e),e};var S=function*(t,e){let n=!1;for(let r of t.childNodes)if(r instanceof Element&&w(r)){let o;r.shadowRoot?o=S(r.shadowRoot,e):o=S(r,e);for(let i of o)yield i,n=!0}n||t instanceof Element&&w(t)&&g(t).full.includes(e)&&(yield t)};var L={};u(L,{checkVisibility:()=>Pe,pierce:()=>N,pierceAll:()=>Q});var Ee=[\"hidden\",\"collapse\"],Pe=(t,e)=>{if(!t)return e===!1;if(e===void 0)return t;let n=t.nodeType===Node.TEXT_NODE?t.parentElement:t,r=window.getComputedStyle(n),o=r&&!Ee.includes(r.visibility)&&!xe(n);return e===o?t:!1};function xe(t){let e=t.getBoundingClientRect();return e.width===0||e.height===0}var Ne=t=>\"shadowRoot\"in t&&t.shadowRoot instanceof ShadowRoot;function*N(t){Ne(t)?yield t.shadowRoot:yield t}function*Q(t){t=N(t).next().value,yield t;let e=[document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT)];for(let n of e){let r;for(;r=n.nextNode();)r.shadowRoot&&(yield r.shadowRoot,e.push(document.createTreeWalker(r.shadowRoot,NodeFilter.SHOW_ELEMENT)))}}var j={};u(j,{xpathQuerySelectorAll:()=>$});var $=function*(t,e,n=-1){let o=(t.ownerDocument||document).evaluate(e,t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE),i=[],s;for(;(s=o.iterateNext())&&(i.push(s),!(n&&i.length===n)););for(let l=0;l<i.length;l++)s=i[l],yield s,delete i[l]};var Ae=/[-\\w\\P{ASCII}*]/,Z=t=>\"querySelectorAll\"in t,A=class extends Error{constructor(e,n){super(`${e} is not a valid selector: ${n}`)}},U=class{#e;#r;#n=[];#t=void 0;elements;constructor(e,n,r){this.elements=[e],this.#e=n,this.#r=r,this.#o()}async run(){if(typeof this.#t==\"string\")switch(this.#t.trimStart()){case\":scope\":this.#o();break}for(;this.#t!==void 0;this.#o()){let e=this.#t,n=this.#e;typeof e==\"string\"?e[0]&&Ae.test(e[0])?this.elements=c.flatMap(this.elements,async function*(r){Z(r)&&(yield*r.querySelectorAll(e))}):this.elements=c.flatMap(this.elements,async function*(r){if(!r.parentElement){if(!Z(r))return;yield*r.querySelectorAll(e);return}let o=0;for(let i of r.parentElement.children)if(++o,i===r)break;yield*r.parentElement.querySelectorAll(`:scope>:nth-child(${o})${e}`)}):this.elements=c.flatMap(this.elements,async function*(r){switch(e.name){case\"text\":yield*S(r,e.value);break;case\"xpath\":yield*$(r,e.value);break;case\"aria\":yield*I(r,e.value);break;default:let o=O.get(e.name);if(!o)throw new A(n,`Unknown selector type: ${e.name}`);yield*o.querySelectorAll(r,e.value)}})}}#o(){if(this.#n.length!==0){this.#t=this.#n.shift();return}if(this.#r.length===0){this.#t=void 0;return}let e=this.#r.shift();switch(e){case\">>>>\":{this.elements=c.flatMap(this.elements,N),this.#o();break}case\">>>\":{this.elements=c.flatMap(this.elements,Q),this.#o();break}default:this.#n=e,this.#o();break}}},W=class{#e=new WeakMap;calculate(e,n=[]){if(e===null)return n;e instanceof ShadowRoot&&(e=e.host);let r=this.#e.get(e);if(r)return[...r,...n];let o=0;for(let s=e.previousSibling;s;s=s.previousSibling)++o;let i=this.calculate(e.parentNode,[o]);return this.#e.set(e,i),[...i,...n]}},ee=(t,e)=>{if(t.length+e.length===0)return 0;let[n=-1,...r]=t,[o=-1,...i]=e;return n===o?ee(r,i):n<o?-1:1},ve=async function*(t){let e=new Set;for await(let r of t)e.add(r);let n=new W;yield*[...e.values()].map(r=>[r,n.calculate(r)]).sort(([,r],[,o])=>ee(r,o)).map(([r])=>r)},te=function(t,e){let n,r;try{[n,r]=K(e)}catch{return t.querySelectorAll(e)}if(r)return t.querySelectorAll(e);if(n.some(o=>{let i=0;return o.some(s=>(typeof s==\"string\"?++i:i=0,i>1))}))throw new A(e,\"Multiple deep combinators found in sequence.\");return ve(c.flatMap(n,o=>{let i=new U(t,e,o);return i.run(),i.elements}))},Ce=async function(t,e){for await(let n of te(t,e))return n;return null};var Ie=Object.freeze({...k,...M,...q,...F,..._,...L,...j,Deferred:f,createFunction:z,createTextContent:g,IntervalPoller:P,isSuitableNodeForTextMatching:w,MutationPoller:T,RAFPoller:E}),ke=Ie;\n/**\n * @license\n * Copyright 2018 Google Inc.\n * SPDX-License-Identifier: Apache-2.0\n */\n/**\n * @license\n * Copyright 2024 Google Inc.\n * SPDX-License-Identifier: Apache-2.0\n */\n/**\n * @license\n * Copyright 2023 Google Inc.\n * SPDX-License-Identifier: Apache-2.0\n */\n/**\n * @license\n * Copyright 2022 Google Inc.\n * SPDX-License-Identifier: Apache-2.0\n */\n/**\n * @license\n * Copyright 2020 Google Inc.\n * SPDX-License-Identifier: Apache-2.0\n */\n";
//# sourceMappingURL=injected.d.ts.map