const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(i,t,s)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!o(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);r?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const n=r.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const n=this.constructor;if(!1===i&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??v)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,_?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,S=w.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+x,U=`<${k}>`,T=document,O=()=>T.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,M="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,N=/>/g,I=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),W=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),z=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,F=T.createTreeWalker(T,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const G=(t,e)=>{const s=t.length-1,i=[];let r,n=2===e?"<svg>":3===e?"<math>":"",a=H;for(let e=0;e<s;e++){const s=t[e];let o,c,l=-1,h=0;for(;h<s.length&&(a.lastIndex=h,c=a.exec(s),null!==c);)h=a.lastIndex,a===H?"!--"===c[1]?a=j:void 0!==c[1]?a=N:void 0!==c[2]?(B.test(c[2])&&(r=RegExp("</"+c[2],"g")),a=I):void 0!==c[3]&&(a=I):a===I?">"===c[0]?(a=r??H,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,o=c[1],a=void 0===c[3]?I:'"'===c[3]?L:W):a===L||a===W?a=I:a===j||a===N?a=H:(a=I,r=void 0);const d=a===I&&t[e+1].startsWith("/>")?" ":"";n+=a===H?s+U:l>=0?(i.push(o),s.slice(0,l)+E+s.slice(l)+x+d):s+x+(-2===l?e:d)}return[J(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const a=t.length-1,o=this.parts,[c,l]=G(t,e);if(this.el=K.createElement(c,s),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&o.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=l[n++],s=i.getAttribute(t).split(x),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:a[2],strings:s,ctor:"."===a[1]?tt:"?"===a[1]?et:"@"===a[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(x)&&(o.push({type:6,index:r}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(x),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),F.nextNode(),o.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===k)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(x,t+1));)o.push({type:7,index:r}),t+=x.length-1}r++}}static createElement(t,e){const s=T.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===z)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const n=P(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=Z(t,r._$AS(t,e.values),r,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);F.currentNode=i;let r=F.nextNode(),n=0,a=0,o=s[0];for(;void 0!==o;){if(n===o.index){let e;2===o.type?e=new X(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=s[++a]}n!==o?.index&&(r=F.nextNode(),n++)}return F.currentNode=T,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),P(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new X(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(void 0===r)t=Z(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==z,n&&(this._$AH=t);else{const i=t;let a,o;for(t=r[0],a=0;a<r.length-1;a++)o=Z(this,i[s+a],e,a),o===z&&(o=this._$AH[a]),n||=!P(o)||o!==this._$AH[a],o===V?t=V:t!==V&&(t+=(o??"")+r[a+1]),this._$AH[a]=o}n&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends Y{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??V)===z)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,X),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new X(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ot=nt.litElementPolyfillSupport;ot?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const ct=n`
  :host {
    display: block;
    color: var(--primary-text-color, #e8eef5);
    font-family: var(--ha-font-family-body, "Segoe UI", "Helvetica Neue", sans-serif);
    --cctv-accent: var(--primary-color, #3d9cf0);
    --cctv-border: var(--divider-color, #2a3542);
    --cctv-muted: var(--secondary-text-color, #8b9aab);
    --cctv-surface: var(--card-background-color, #1a222c);
    --cctv-ok: var(--success-color, #3ecf8e);
    --cctv-bad: var(--error-color, #e35d6a);
  }

  .wrap {
    padding: 1rem 1.25rem 1.5rem;
  }

  .panel-wrap {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 50% at 10% -10%, rgba(61, 156, 240, 0.18) 0%, transparent 55%),
      var(--primary-background-color, #0f1419);
  }

  .top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cctv-muted);
  }

  h1,
  h2 {
    margin: 0.15rem 0 0;
    font-weight: 650;
    letter-spacing: -0.02em;
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .status {
    font-size: 0.85rem;
    color: var(--cctv-muted);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.85rem;
  }

  .tile {
    border: 1px solid var(--cctv-border);
    background: var(--cctv-surface);
    border-radius: 10px;
    overflow: hidden;
    padding: 0;
    color: inherit;
  }

  .tile:hover,
  .tile:focus-within {
    border-color: var(--cctv-accent);
  }

  .tile-open {
    appearance: none;
    border: 0;
    background: transparent;
    width: 100%;
    cursor: pointer;
    text-align: left;
    color: inherit;
    font: inherit;
    padding: 0;
  }

  .tile-open:focus-visible {
    outline: 2px solid var(--cctv-accent);
    outline-offset: -2px;
  }

  .tile-media {
    display: block;
    width: 100%;
  }

  .tile cctv-stream-player,
  .detail-stage cctv-stream-player {
    width: 100%;
  }

  .tile-body {
    padding: 0.7rem 0.85rem 0.85rem;
  }

  .tile-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .tile-meta {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    color: var(--cctv-muted);
  }

  .dot {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    margin-right: 0.35rem;
    background: var(--cctv-muted);
  }

  .dot.on,
  .dot.idle,
  .dot.streaming,
  .dot.recording {
    background: var(--cctv-ok);
  }

  .dot.off,
  .dot.unavailable,
  .dot.unknown {
    background: var(--cctv-bad);
  }

  .btn {
    appearance: none;
    border: 1px solid var(--cctv-border);
    background: var(--cctv-surface);
    color: inherit;
    border-radius: 8px;
    padding: 0.45rem 0.85rem;
    font: inherit;
    cursor: pointer;
  }

  .btn:hover,
  .btn:focus-visible {
    border-color: var(--cctv-accent);
    outline: none;
  }

  .btn.primary {
    border-color: var(--cctv-accent);
  }

  .btn.linkish {
    border: none;
    background: transparent;
    color: var(--cctv-accent);
    padding-left: 0;
    margin-bottom: 0.75rem;
  }

  .empty,
  .placeholder {
    color: var(--cctv-muted);
  }

  .detail-stage {
    margin-top: 0.75rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    overflow: hidden;
    max-width: 960px;
    background: #0a0e13;
  }

  .detail-stage img {
    min-height: 200px;
    object-fit: contain;
  }

  .meta {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem 1rem;
    margin: 1rem 0;
    max-width: 960px;
  }

  .meta dt {
    color: var(--cctv-muted);
  }

  .meta dd {
    margin: 0;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  ha-card {
    overflow: hidden;
  }

  .card-inner {
    padding: 0.25rem 0.25rem 0.75rem;
  }
`,lt=new Set(["unavailable","unknown","none",""]);function ht(t,e){const s=e?.attributes??{};return{entityId:t,stateObj:e,state:e?.state??"unknown",name:s.friendly_name||t,brand:s.brand,model:s.model,frontendStreamType:s.frontend_stream_type,supportedFeatures:Number(s.supported_features||0),unavailable:!e||lt.has(String(e.state).trim().toLowerCase())}}async function dt(t,e,s,i={}){if(!t?.callService)throw new Error("hass.callService is unavailable");return t.callService("camera",e,{entity_id:s,...i})}function pt(t,e){if(!e)return;const s=new Event("hass-more-info",{bubbles:!0,composed:!0});s.detail={entityId:e},t.dispatchEvent(s)}function ut(t){return t?Array.isArray(t)?t.map(String).map(t=>t.trim()).filter(Boolean):String(t).split(",").map(t=>t.trim()).filter(Boolean):[]}class mt extends at{static properties={hass:{attribute:!1},camera:{attribute:!1},muted:{type:Boolean},controls:{type:Boolean},large:{type:Boolean,reflect:!0},posterOnly:{type:Boolean,attribute:"poster-only"},_mode:{state:!0},_error:{state:!0},_hlsUrl:{state:!0},_mjpegUrl:{state:!0},_stillUrl:{state:!0}};static styles=n`
    :host {
      display: block;
      position: relative;
      width: 100%;
      background: #0a0e13;
      aspect-ratio: 16 / 10;
      overflow: hidden;
    }

    :host([large]) {
      aspect-ratio: auto;
      min-height: 220px;
    }

    .media,
    ha-camera-stream,
    video,
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      background: #0a0e13;
      border: 0;
    }

    :host([large]) .media,
    :host([large]) ha-camera-stream,
    :host([large]) video,
    :host([large]) img {
      object-fit: contain;
      min-height: 220px;
    }

    .badge {
      position: absolute;
      left: 0.5rem;
      top: 0.5rem;
      font-size: 0.65rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      pointer-events: none;
    }

    .error,
    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 120px;
      color: var(--secondary-text-color, #8b9aab);
      padding: 0.75rem;
      text-align: center;
      font-size: 0.85rem;
    }
  `;constructor(){super(),this.muted=!0,this.controls=!1,this.large=!1,this.posterOnly=!1,this._mode="loading",this._error="",this._hlsUrl="",this._mjpegUrl="",this._stillUrl="",this._pc=null,this._unsubWebRtc=null,this._sessionId=null,this._startToken=0}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}updated(t){if((t.has("hass")||t.has("camera")||t.has("posterOnly"))&&this._start(),t.has("muted")&&this._pc){const t=this.renderRoot?.querySelector("video");t&&(t.muted=this.muted)}}_teardown(){if(this._startToken+=1,this._unsubWebRtc){try{this._unsubWebRtc()}catch{}this._unsubWebRtc=null}if(this._pc){try{this._pc.close()}catch{}this._pc=null}this._sessionId=null}async _start(){this._teardown();const t=this._startToken;if(this._error="",this._hlsUrl="",this._mjpegUrl="",this._stillUrl="",!this.hass||!this.camera?.stateObj)return void(this._mode="empty");if(this._stillUrl=function(t,e,s=!0){if(!t||!e?.stateObj)return"";const i=e.stateObj.attributes||{};let r=i.entity_picture;if(!r&&i.access_token&&(r=`/api/camera_proxy/${e.entityId}?token=${i.access_token}`),!r)return"";const n="function"==typeof t.hassUrl?t.hassUrl(r):r;if(!s)return n;const a=n.includes("?")?"&":"?";return`${n}${a}t=${Date.now()}`}(this.hass,this.camera,!0),this._mjpegUrl=function(t,e){const s=e?.stateObj?.attributes?.access_token;if(!t||!e?.entityId||!s)return"";const i=`/api/camera_proxy_stream/${e.entityId}?token=${s}`;return"function"==typeof t.hassUrl?t.hassUrl(i):i}(this.hass,this.camera),this.posterOnly)return void(this._mode=this._stillUrl?"still":"empty");if(customElements.get("ha-camera-stream"))return void(this._mode="ha");const e=await async function(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/capabilities",entity_id:e})}catch{return null}}(this.hass,this.camera.entityId);if(t!==this._startToken)return;const s=e?.frontend_stream_types||[],i=this.camera.frontendStreamType,r=s.includes("web_rtc")||"web_rtc"===i,n=s.includes("hls")||"hls"===i||(a=this.camera,Boolean(2&a?.supportedFeatures));var a;if(r&&"undefined"!=typeof RTCPeerConnection)try{if(await this._startWebRtc(t),t!==this._startToken)return;return void(this._mode="webrtc")}catch(t){console.warn("CCTV WebRTC failed, falling back",t)}if(n)try{const e=await async function(t,e){if(!t?.callWS)return"";const s=await t.callWS({type:"camera/stream",entity_id:e}),i=s?.url||"";return i?"function"==typeof t.hassUrl?t.hassUrl(i):i:""}(this.hass,this.camera.entityId);if(t!==this._startToken)return;if(e&&this._canPlayHlsNatively())return this._hlsUrl=e,void(this._mode="hls")}catch(t){console.warn("CCTV HLS failed, falling back",t)}this._mjpegUrl?this._mode="mjpeg":(this._mode=this._stillUrl?"still":"empty",this._stillUrl||(this._error="No stream or preview available"))}_canPlayHlsNatively(){const t=document.createElement("video");return""!==t.canPlayType("application/vnd.apple.mpegurl")||""!==t.canPlayType("application/x-mpegURL")}async _startWebRtc(t){const e=await async function(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/webrtc/get_client_config",entity_id:e})}catch{return null}}(this.hass,this.camera.entityId)||{};if(t!==this._startToken)return;const s=new RTCPeerConnection(e.configuration||{});this._pc=s,s.addTransceiver("video",{direction:"recvonly"});try{s.addTransceiver("audio",{direction:"recvonly"})}catch{}s.ontrack=t=>{const e=this.renderRoot?.querySelector("video#webrtc");if(!e)return;const[s]=t.streams;e.srcObject=s||new MediaStream([t.track]),e.muted=this.muted,e.play?.().catch(()=>{})},s.onicecandidate=t=>{t.candidate&&this._sessionId&&async function(t,e,s,i){t?.callWS&&await t.callWS({type:"camera/webrtc/candidate",entity_id:e,session_id:s,candidate:i})}(this.hass,this.camera.entityId,this._sessionId,t.candidate.toJSON()).catch(()=>{})};const i=await s.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});await s.setLocalDescription(i),this._unsubWebRtc=await function(t,e,s,i){if(!t?.connection?.subscribeMessage)throw new Error("WebSocket connection unavailable");return t.connection.subscribeMessage(i,{type:"camera/webrtc/offer",entity_id:e,offer:s})}(this.hass,this.camera.entityId,i.sdp,async e=>{if(t===this._startToken&&this._pc)if("session"!==e.type)if("answer"!==e.type)if("candidate"===e.type&&e.candidate)try{await this._pc.addIceCandidate(e.candidate)}catch{}else"error"===e.type&&(this._error=e.message||e.code||"WebRTC error",this._mode=this._mjpegUrl?"mjpeg":this._stillUrl?"still":"empty");else await this._pc.setRemoteDescription({type:"answer",sdp:e.answer});else this._sessionId=e.session_id})}render(){return"loading"===this._mode?D`<div class="placeholder">Connecting…</div>`:"empty"===this._mode?D`<div class="error">${this._error||"No preview"}</div>`:D`
      ${this._renderMedia()}
      <span class="badge">${this._mode}</span>
    `}_renderMedia(){return"ha"===this._mode?D`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${this.camera.stateObj}
          .muted=${this.muted}
          .controls=${this.controls}
        ></ha-camera-stream>
      `:"webrtc"===this._mode?D`
        <video
          id="webrtc"
          class="media"
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
        ></video>
      `:"hls"===this._mode?D`
        <video
          class="media"
          src=${this._hlsUrl}
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
        ></video>
      `:"mjpeg"===this._mode?D`<img class="media" alt="" src=${this._mjpegUrl} />`:"still"===this._mode?D`<img class="media" alt="" src=${this._stillUrl} />`:V}}customElements.get("cctv-stream-player")||customElements.define("cctv-stream-player",mt);const ft=[{service:"turn_on",label:"Turn on"},{service:"turn_off",label:"Turn off"},{service:"snapshot",label:"Snapshot"}];class _t extends at{static properties={hass:{attribute:!1},config:{attribute:!1},panelMode:{type:Boolean,attribute:"panel-mode"},_selected:{state:!0},_status:{state:!0}};static styles=ct;constructor(){super(),this.config={},this.panelMode=!1,this._selected=null,this._status=""}_cameras(){return function(t,e={}){const s=t?.states??{},i=ut(e.cameras),r=new Set(ut(e.exclude).map(t=>t.toLowerCase()));let n=Object.keys(s).filter(t=>t.startsWith("camera."));if(i.length){const t=new Set(i.map(t=>t.toLowerCase()));n=n.filter(e=>t.has(e.toLowerCase()))}return n=n.filter(t=>!r.has(t.toLowerCase())),n.map(t=>ht(t,s[t])).sort((t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}))}(this.hass,this.config)}_select(t){this._selected=t}_back(){this._selected=null}async _run(t,e){this._status=`Calling ${t}…`;try{await dt(this.hass,t,e),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}render(){if(!this.hass)return D`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;const t=this._cameras(),e=t.find(t=>t.entityId===this._selected)||null,s=this.config?.title||"CCTV";return D`
      <div class=${this.panelMode?"panel-wrap wrap":"wrap"}>
        <div class="top">
          <div>
            ${this.panelMode?D`<p class="eyebrow">Home Assistant</p>`:V}
            <h1>${s}</h1>
          </div>
          <div class="top-actions">
            <span class="status">
              ${this._status||`${t.length} camera${1===t.length?"":"s"} · live`}
            </span>
          </div>
        </div>

        ${e?this._renderDetail(e):this._renderGrid(t)}
      </div>
    `}_renderGrid(t){return t.length?D`
      <div class="grid" role="list">
        ${t.map(t=>D`
            <article class="tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  .hass=${this.hass}
                  .camera=${t}
                  muted
                ></cctv-stream-player>
              </div>
              <button
                type="button"
                class="tile-body tile-open"
                @click=${()=>this._select(t.entityId)}
              >
                <p class="tile-title">${t.name}</p>
                <p class="tile-meta">
                  <span class="dot ${t.state}"></span>${t.state} · ${t.entityId}
                </p>
              </button>
            </article>
          `)}
      </div>
    `:D`<p class="empty">No camera entities found.</p>`}_renderDetail(t){return D`
      <button class="btn linkish" type="button" @click=${this._back}>← All cameras</button>
      <h2>${t.name}</h2>
      <div class="detail-stage">
        <cctv-stream-player
          large
          .hass=${this.hass}
          .camera=${t}
          .muted=${!1}
          controls
        ></cctv-stream-player>
      </div>
      <dl class="meta">
        <dt>Entity</dt>
        <dd>${t.entityId}</dd>
        <dt>State</dt>
        <dd>${t.state}</dd>
        <dt>Brand</dt>
        <dd>${t.brand||"—"}</dd>
        <dt>Model</dt>
        <dd>${t.model||"—"}</dd>
      </dl>
      <div class="actions">
        ${ft.map(e=>D`
            <button
              class="btn primary"
              type="button"
              @click=${()=>this._run(e.service,t.entityId)}
            >
              ${e.label}
            </button>
          `)}
        <button
          class="btn"
          type="button"
          @click=${()=>pt(this,t.entityId)}
        >
          More info
        </button>
      </div>
    `}}customElements.get("cctv-view")||customElements.define("cctv-view",_t);class gt extends at{static properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1}};createRenderRoot(){return this}get _config(){const t=this.panel?.config||{},{_panel_custom:e,...s}=t;return{title:"CCTV",...s}}render(){return D`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        panel-mode
      ></cctv-view>
    `}}customElements.get("cctv-dashboard-panel")||customElements.define("cctv-dashboard-panel",gt);class yt extends at{static properties={hass:{attribute:!1},_config:{attribute:!1}};static styles=ct;static getConfigElement(){return null}static getStubConfig(t){const e=Object.keys(t?.states??{}).filter(t=>t.startsWith("camera.")).slice(0,4);return{title:"CCTV",...e.length?{cameras:e}:{}}}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");this._config={title:"CCTV",...t}}getCardSize(){const t=this._config?.cameras?.length;return t?Math.max(3,2*Math.ceil(t/2)):6}render(){return this._config?D`
      <ha-card>
        <div class="card-inner">
          <cctv-view .hass=${this.hass} .config=${this._config}></cctv-view>
        </div>
      </ha-card>
    `:D``}}customElements.get("cctv-cameras-card")||customElements.define("cctv-cameras-card",yt),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-cameras-card"===t.type)||window.customCards.push({type:"cctv-cameras-card",name:"CCTV Cameras",preview:!0,description:"Live stream grid of Home Assistant camera entities with detail view and basic controls.",documentationURL:"https://github.com/davies1995/HA-CCTV"});class vt extends at{static properties={hass:{attribute:!1},_config:{attribute:!1},_status:{state:!0}};static styles=ct;static getStubConfig(t){return{entity:Object.keys(t?.states??{}).find(t=>t.startsWith("camera."))||"camera.demo",title:"",muted:!0}}constructor(){super(),this._status=""}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");if(!t.entity||!String(t.entity).startsWith("camera."))throw new Error("cctv-camera-card requires a camera.* entity");this._config={muted:!0,...t,entity:String(t.entity)}}getCardSize(){return 4}async _run(t){this._status=`Calling ${t}…`;try{await dt(this.hass,t,this._config.entity),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}render(){if(!this._config||!this.hass)return D``;const t=this.hass.states?.[this._config.entity],e=ht(this._config.entity,t),s=this._config.title||e.name;return D`
      <ha-card>
        <div class="card-inner">
          <div class="top">
            <div>
              <h2>${s}</h2>
            </div>
            <span class="status">${this._status||e.state}</span>
          </div>
          <div class="detail-stage">
            <cctv-stream-player
              large
              .hass=${this.hass}
              .camera=${e}
              .muted=${!1!==this._config.muted}
              controls
            ></cctv-stream-player>
          </div>
          <div class="actions" style="margin-top: 0.75rem">
            <button class="btn primary" type="button" @click=${()=>this._run("turn_on")}>
              Turn on
            </button>
            <button class="btn primary" type="button" @click=${()=>this._run("turn_off")}>
              Turn off
            </button>
            <button class="btn primary" type="button" @click=${()=>this._run("snapshot")}>
              Snapshot
            </button>
            <button
              class="btn"
              type="button"
              @click=${()=>pt(this,this._config.entity)}
            >
              More info
            </button>
          </div>
        </div>
      </ha-card>
    `}}customElements.get("cctv-camera-card")||customElements.define("cctv-camera-card",vt),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-camera-card"===t.type)||window.customCards.push({type:"cctv-camera-card",name:"CCTV Camera",preview:!0,description:"Live stream for a single Home Assistant camera entity.",documentationURL:"https://github.com/davies1995/HA-CCTV"});const bt="0.1.0";console.info(`%c CCTV-DASHBOARD %c ${bt} `,"color: #fff; background: #1b6ea8; font-weight: 700;","color: #1b6ea8; background: #fff; font-weight: 700;");export{bt as VERSION};
