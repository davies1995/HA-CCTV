const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(i,t,s)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!o(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);r?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const n=r.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const n=this.constructor;if(!1===i&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??v)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,_?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,x=w.trustedTypes,S=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,I="?"+A,E=`<${I}>`,M=document,O=()=>M.createComment(""),L=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,T="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,j=/>/g,N=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,P=/"/g,q=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),z=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),B=new WeakMap,F=M.createTreeWalker(M,129);function G(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let r,n=2===e?"<svg>":3===e?"<math>":"",a=U;for(let e=0;e<s;e++){const s=t[e];let o,l,c=-1,d=0;for(;d<s.length&&(a.lastIndex=d,l=a.exec(s),null!==l);)d=a.lastIndex,a===U?"!--"===l[1]?a=D:void 0!==l[1]?a=j:void 0!==l[2]?(q.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=N):void 0!==l[3]&&(a=N):a===N?">"===l[0]?(a=r??U,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?N:'"'===l[3]?P:H):a===P||a===H?a=N:a===D||a===j?a=U:(a=N,r=void 0);const h=a===N&&t[e+1].startsWith("/>")?" ":"";n+=a===U?s+E:c>=0?(i.push(o),s.slice(0,c)+C+s.slice(c)+A+h):s+A+(-2===c?e:h)}return[G(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const a=t.length-1,o=this.parts,[l,c]=K(t,e);if(this.el=Q.createElement(l,s),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&o.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[n++],s=i.getAttribute(t).split(A),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:a[2],strings:s,ctor:"."===a[1]?tt:"?"===a[1]?et:"@"===a[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(A)&&(o.push({type:6,index:r}),i.removeAttribute(t));if(q.test(i.tagName)){const t=i.textContent.split(A),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),F.nextNode(),o.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===I)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(A,t+1));)o.push({type:7,index:r}),t+=A.length-1}r++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===z)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const n=L(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,i)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);F.currentNode=i;let r=F.nextNode(),n=0,a=0,o=s[0];for(;void 0!==o;){if(n===o.index){let e;2===o.type?e=new X(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=s[++a]}n!==o?.index&&(r=F.nextNode(),n++)}return F.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),L(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Z(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new Q(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new X(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(void 0===r)t=J(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==z,n&&(this._$AH=t);else{const i=t;let a,o;for(t=r[0],a=0;a<r.length-1;a++)o=J(this,i[s+a],e,a),o===z&&(o=this._$AH[a]),n||=!L(o)||o!==this._$AH[a],o===V?t=V:t!==V&&(t+=(o??"")+r[a+1]),this._$AH[a]=o}n&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends Y{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??V)===z)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(Q,X),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new X(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ot=nt.litElementPolyfillSupport;ot?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const lt=n`
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

  /* Desktop panel: fill HA content area so the mosaic can use remaining height. */
  @media (min-width: 801px) {
    :host([panel-mode]) {
      height: calc(100dvh - var(--app-header-height, 56px));
      max-height: calc(100dvh - var(--app-header-height, 56px));
      overflow: hidden;
    }
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

  @media (min-width: 801px) {
    .panel-wrap {
      box-sizing: border-box;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 0.75rem;
    }

    .panel-wrap > .top,
    .panel-wrap > .picker,
    .panel-wrap > .settings-panel,
    .panel-wrap > .empty,
    .panel-wrap > .placeholder {
      flex: 0 0 auto;
    }

    .panel-wrap > .layout {
      flex: 1 1 auto;
      min-height: 0;
      height: auto;
      max-height: none;
    }

    .panel-wrap > cctv-detection-timeline,
    .panel-wrap > .recordings {
      flex: 0 1 auto;
      max-height: 24vh;
      overflow: auto;
      margin-top: 0.75rem;
      min-height: 0;
    }

    .panel-wrap > cctv-detection-timeline .timeline {
      margin-top: 0;
    }
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

  .quality-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1rem;
    margin: 0.85rem 0 0.25rem;
    max-width: 960px;
  }

  .quality-row label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .quality-row select {
    font: inherit;
    color: inherit;
    background: var(--cctv-surface);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.35rem 0.55rem;
  }

  .hint {
    font-size: 0.8rem;
    color: var(--cctv-muted);
  }

  .picker {
    margin: 0 0 1rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .picker-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.85rem;
    align-items: baseline;
    margin-bottom: 0.75rem;
  }

  .picker-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.45rem 0.75rem;
  }

  .picker-item {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 0.55rem;
    align-items: center;
    padding: 0.35rem 0.45rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .picker-item input {
    grid-row: 1 / span 2;
  }

  .picker-item.disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .picker-name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .picker-id {
    font-size: 0.75rem;
    color: var(--cctv-muted);
  }

  .layout {
    display: grid;
    gap: 0.75rem;
    width: 100%;
    min-height: min(70vh, 720px);
  }

  .layout-1 {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  .layout-2 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }

  .layout-3 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .layout-3 .layout-tile:nth-child(3) {
    grid-column: 1 / -1;
  }

  .layout-4 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .layout-tile {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .layout-tile .tile-media {
    flex: 1 1 auto;
    min-height: 0;
  }

  .layout-tile cctv-stream-player {
    height: 100%;
    min-height: 180px;
    aspect-ratio: auto;
  }

  .layout-1 .layout-tile cctv-stream-player {
    min-height: min(65vh, 640px);
  }

  /* Desktop: scale every selected tile into the shared mosaic height (no cam-to-cam scroll). */
  @media (min-width: 801px) {
    .panel-wrap .layout {
      min-height: 0;
    }

    .panel-wrap .layout-tile .tile-body {
      padding: 0.45rem 0.65rem 0.55rem;
    }

    .panel-wrap .layout-tile cctv-stream-player,
    .panel-wrap .layout-1 .layout-tile cctv-stream-player {
      min-height: 0;
      height: 100%;
    }
  }

  @media (max-width: 800px) {
    .layout-2,
    .layout-3,
    .layout-4 {
      grid-template-columns: 1fr;
      grid-template-rows: none;
      min-height: 0;
    }

    .layout-3 .layout-tile:nth-child(3) {
      grid-column: auto;
    }
  }

  .sensor-settings {
    margin: 1.25rem 0 0;
    padding: 0.85rem 1rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
    max-width: 960px;
  }

  .sensor-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    align-items: flex-end;
    margin: 0.85rem 0;
  }

  .sensor-filter {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: var(--cctv-muted);
    flex: 1 1 220px;
  }

  .sensor-filter input {
    font: inherit;
    color: inherit;
    background: var(--primary-background-color, #0f1419);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
  }

  .sensor-linked,
  .sensor-candidates {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .sensor-item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    grid-template-rows: auto auto;
    column-gap: 0.55rem;
    row-gap: 0.1rem;
    align-items: center;
    padding: 0.4rem 0.45rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .sensor-item:hover {
    background: rgba(61, 156, 240, 0.08);
  }

  .sensor-item input {
    grid-row: 1 / span 2;
  }

  .sensor-kind {
    grid-row: 1;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--cctv-accent);
  }

  .sensor-name {
    grid-column: 3;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .sensor-state {
    grid-column: 4;
    grid-row: 1 / span 2;
    font-size: 0.75rem;
    color: var(--cctv-muted);
  }

  .sensor-state.on {
    color: var(--cctv-ok);
  }

  .sensor-item .picker-id {
    grid-column: 3;
  }

  .kind-person { color: #5eb1ff; }
  .kind-car { color: #f0b45a; }
  .kind-animal { color: #7dcf8a; }
  .kind-package { color: #c9a0ff; }
  .kind-bicycle { color: #67d5c8; }
  .kind-motion { color: #e6d36a; }
  .kind-other { color: var(--cctv-muted); }

  .timeline {
    margin: 1.25rem 0 0;
    padding: 0.85rem 1rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .timeline-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .timeline-windows {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .timeline-axis {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--cctv-muted);
    margin-bottom: 0.35rem;
  }

  .timeline-rows {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .timeline-row {
    display: grid;
    grid-template-columns: minmax(160px, 240px) 1fr;
    gap: 0.65rem;
    align-items: center;
  }

  .timeline-label {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .timeline-kind {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .timeline-cam {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .timeline-sensor,
  .timeline-total {
    font-size: 0.72rem;
    color: var(--cctv-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .timeline-track {
    position: relative;
    height: 1.15rem;
    border-radius: 6px;
    background:
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.04) 0,
        rgba(255, 255, 255, 0.04) 1px,
        transparent 1px,
        transparent 10%
      ),
      rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  .timeline-flag {
    position: absolute;
    top: 2px;
    bottom: 2px;
    border-radius: 4px;
    background: var(--cctv-accent);
    opacity: 0.9;
    min-width: 3px;
  }

  .timeline-flag.kind-person { background: #5eb1ff; }
  .timeline-flag.kind-car { background: #f0b45a; }
  .timeline-flag.kind-animal { background: #7dcf8a; }
  .timeline-flag.kind-package { background: #c9a0ff; }
  .timeline-flag.kind-bicycle { background: #67d5c8; }
  .timeline-flag.kind-motion { background: #e6d36a; }
  .timeline-flag.kind-other { background: #8b9aab; }

  .timeline-error {
    color: var(--cctv-bad);
    font-size: 0.85rem;
  }

  .timeline-loading {
    margin: 0.5rem 0 0;
  }

  .settings-panel,
  .recordings {
    margin: 1.25rem 0 0;
    padding: 0.85rem 1rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .settings-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem 1.25rem;
    align-items: flex-end;
    margin: 0.75rem 0;
  }

  .settings-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: var(--cctv-muted);
  }

  .settings-field input[type="number"] {
    width: 6rem;
    font: inherit;
    color: inherit;
    background: var(--primary-background-color, #0f1419);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
  }

  .settings-toggle {
    min-width: 220px;
  }

  .settings-panel code {
    font-size: 0.8em;
  }

  .recording-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .recording-item {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem 0.85rem;
    padding: 0.65rem 0.7rem;
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
  }

  .recording-item.active {
    border-color: var(--cctv-accent);
  }

  .recording-meta {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    grid-column: 1 / -1;
  }

  .recording-clips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    grid-column: 1;
  }

  .recording-clip {
    font-size: 0.75rem;
    color: var(--cctv-accent);
    text-decoration: none;
    border: 1px solid var(--cctv-border);
    border-radius: 6px;
    padding: 0.2rem 0.45rem;
  }

  .recording-clip:hover {
    border-color: var(--cctv-accent);
  }

  .recording-item > .btn {
    grid-column: 2;
    grid-row: 2;
    align-self: start;
  }

  @media (max-width: 800px) {
    .timeline-row {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }

    .recording-item {
      grid-template-columns: 1fr;
    }

    .recording-item > .btn {
      grid-column: 1;
      grid-row: auto;
    }
  }

  ha-card {
    overflow: hidden;
  }

  .card-inner {
    padding: 0.25rem 0.25rem 0.75rem;
  }
`,ct=new Set(["unavailable","unknown","none",""]),dt=[{service:"turn_on",label:"Turn on",feature:1},{service:"turn_off",label:"Turn off",feature:1},{service:"toggle",label:"Toggle",feature:1},{service:"snapshot",label:"Snapshot"},{service:"enable_motion_detection",label:"Motion on",attr:"motion_detection",attrValue:!1},{service:"disable_motion_detection",label:"Motion off",attr:"motion_detection",attrValue:!0}];function ht(t,e){const s=e?.attributes??{};return{entityId:t,stateObj:e,state:e?.state??"unknown",name:s.friendly_name||t,brand:s.brand,model:s.model,frontendStreamType:s.frontend_stream_type,supportedFeatures:Number(s.supported_features||0),unavailable:!e||ct.has(String(e.state).trim().toLowerCase())}}function pt(t){return Boolean(2&t?.supportedFeatures)}async function ut(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/capabilities",entity_id:e})}catch{return null}}async function mt(t,e){if(!t?.callWS)return"";const s=await t.callWS({type:"camera/stream",entity_id:e}),i=s?.url||"";return i?"function"==typeof t.hassUrl?t.hassUrl(i):i:""}async function gt(t,e,s,i={}){if(!t?.callService)throw new Error("hass.callService is unavailable");return t.callService("camera",e,{entity_id:s,...i})}function _t(t,e){const s=t?.services?.camera||{},i=Number(e?.supportedFeatures||0),r=e?.stateObj?.attributes||{};return dt.filter(t=>{if(!s[t.service])return!1;if(null!=t.feature&&i&&0===(i&t.feature))return!1;if(t.attr){if(!(t.attr in r))return!1;if(null!=t.attrValue&&Boolean(r[t.attr])!==t.attrValue)return!1}return!0}).map(({service:t,label:e})=>({service:t,label:e}))}function ft(t,e){if(!e)return;const s=new Event("hass-more-info",{bubbles:!0,composed:!0});s.detail={entityId:e},t.dispatchEvent(s)}function yt(t){return t?Array.isArray(t)?t.map(String).map(t=>t.trim()).filter(Boolean):String(t).split(",").map(t=>t.trim()).filter(Boolean):[]}const vt=[{id:"person",label:"Person",tokens:["person","people","human","pedestrian","face"]},{id:"car",label:"Car",tokens:["car","vehicle","automobile","auto"]},{id:"animal",label:"Animal",tokens:["animal","pet","dog","cat","wildlife"]},{id:"package",label:"Package",tokens:["package","parcel","delivery","amazon"]},{id:"bicycle",label:"Bicycle",tokens:["bicycle","bike","cyclist"]},{id:"motion",label:"Motion",tokens:["motion","occupancy","presence","moving"]},{id:"other",label:"Other",tokens:["detection","object","zone"]}],bt=new Set(["binary_sensor","sensor"]),$t=new Set(["on","true","detected","active","1","home"]);function wt(t,e){return e.some(e=>new RegExp(`(^|[_\\s.-])${e}([_\\s.-]|$)`,"i").test(t))}function kt(t,e){const s=`${t} ${e?.attributes?.friendly_name||""}`.toLowerCase();for(const t of vt)if("other"!==t.id&&wt(s,t.tokens))return{id:t.id,label:t.label};return{id:"other",label:"Other"}}function xt(t){if(!t)return!1;const e=String(t.state??"").trim().toLowerCase();if($t.has(e))return!0;const s=Number(e);return Number.isFinite(s)&&s>0}function St(t,e,s){const i=String(t||"").replace(/^camera\./i,"").replace(/_(main|hi|high|primary)$/i,"").toLowerCase();if(!i)return 0;const r=String(e).toLowerCase(),n=String(s?.attributes?.friendly_name||"").toLowerCase(),a=`${r} ${n}`;let o=0;const l=r.replace(/^(binary_sensor|sensor)\./,"");if(l===i||l.startsWith(`${i}_`)?o+=50:l.includes(i)&&(o+=25),n.includes(i.replace(/_/g," "))&&(o+=15),o<=0)return 0;let c=o;return"other"!==kt(e,s).id?c+=20:wt(a,["detection","object","zone","motion","occupancy"])&&(c+=8),r.startsWith("binary_sensor.")&&(c+=5),c}function Ct(t,e,s={}){const i=t?.states||{},r=s.limit??24,n=s.deviceIds,a=n?.get(e),o=[];for(const[t,s]of Object.entries(i)){const i=t.split(".")[0];if(!bt.has(i))continue;let r=St(e,t,s);if(a&&n?.get(t)===a&&(r+=40),r<20)continue;const l=kt(t,s);o.push({entityId:t,name:s?.attributes?.friendly_name||t,kind:l,score:r,state:String(s?.state??"unknown"),active:xt(s)})}return o.sort((t,e)=>e.score-t.score||t.name.localeCompare(e.name)),o.slice(0,r)}function At(t,e){const s=t?.states||{};return(e||[]).map(String).filter(t=>bt.has(t.split(".")[0])).map(t=>{const e=s[t];return{entityId:t,name:e?.attributes?.friendly_name||t,kind:kt(t,e),state:String(e?.state??"unknown"),active:xt(e),missing:!e}})}function It(t){if(!t||"object"!=typeof t||Array.isArray(t))return{};const e={};for(const[s,i]of Object.entries(t))String(s).startsWith("camera.")&&Array.isArray(i)&&(e[s]=[...new Set(i.map(String).filter(t=>bt.has(t.split(".")[0])))].slice(0,16));return e}function Et(t,e,s,i){if(!Array.isArray(t)||!t.length)return[];const r=t.map(t=>{const s=String(t.state??t.s??"").toLowerCase();let r=e;return"number"==typeof t.lu?r=1e3*t.lu:t.last_changed?r=Date.parse(t.last_changed):t.last_updated&&(r=Date.parse(t.last_updated)),{t:r,state:s,active:i(s)}}).filter(t=>Number.isFinite(t.t)).sort((t,e)=>t.t-e.t);if(!r.length)return[];const n=[];let a=null,o=null;const l=r[0];l.t>e&&(o=null);for(const t of r){const i=Math.max(e,Math.min(s,t.t));if(null!==o){if(t.active!==o){if(o&&null!=a){const t=Math.max(a,i);t>a&&n.push({start:a,end:t}),a=null}o=t.active,t.active&&(a=i)}}else o=t.active,t.active&&(a=Math.max(e,t.t<=e?e:i))}return o&&null!=a&&a<s&&n.push({start:a,end:s}),!n.length&&l.active&&l.t<=e&&n.push({start:e,end:s}),n}function Mt(t){const e=Math.max(0,Math.round(t/1e3));if(e<60)return`${e}s`;const s=Math.floor(e/60),i=e%60;if(s<60)return i?`${s}m ${i}s`:`${s}m`;const r=Math.floor(s/60),n=s%60;return n?`${r}h ${n}m`:`${r}h`}function Ot(t){try{return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return""}}const Lt=[{value:"auto",label:"Auto",help:"High for detail, prefer low/substream in the mosaic when available."},{value:"high",label:"High",help:"Main camera entity; prefer WebRTC/HLS."},{value:"balanced",label:"Balanced",help:"Main entity; prefer HA native / WebRTC, then HLS/MJPEG."},{value:"low",label:"Low",help:"Substream entity when available, else MJPEG on the main camera."}],Rt=["_sub","_lq","_low","_fluent","_sd","_substream"],Tt="cctv-dashboard:quality:";function Ut(t){const e=String(t||"auto").toLowerCase();return Lt.some(t=>t.value===e)?e:"auto"}function Dt(t,e){const s=t?.camera_settings||t?.cameras_settings||{},i=s?.[e]||s?.[e?.toLowerCase?.()]||{},r={};return t?.entity&&t.entity===e&&(t.low_entity&&(r.low_entity=t.low_entity),t.high_entity&&(r.high_entity=t.high_entity),t.substream_entity&&(r.substream_entity=t.substream_entity),t.main_entity&&(r.main_entity=t.main_entity)),{...r,...i}}function jt(t,e){try{localStorage.setItem(Tt+t,Ut(e))}catch{}}function Nt(t,e){const s=function(t){try{const e=localStorage.getItem(Tt+t);return e?Ut(e):null}catch{return null}}(e);if(s)return s;const i=Dt(t,e);return i.quality?Ut(i.quality):t?.quality?Ut(t.quality):"auto"}function Ht(t,e,s,i,r="mosaic"){const n=Ut(i),a=Dt(s,e.entityId),o=t?.states||{},l=a.high_entity||a.main_entity||e.entityId,c=a.low_entity||a.substream_entity||function(t,e,s){const i=t?.states||{},r=e.replace(/^camera\./,"");for(const t of s){const e=`camera.${r}${t}`;if(i[e])return e;const s=`camera.${r.replace(/_main$/,"")}${t}`;if(s!==e&&i[s])return s}return""}(t,e.entityId,Rt)||"";let d=e.entityId;return d="high"===n?l:"low"===n?c||l:"auto"===n&&"mosaic"===r&&c?c:l,o[d]||(d=e.entityId),ht(d,o[d])}function Pt(t){return Lt.find(e=>e.value===Ut(t))?.help||""}async function qt(t){if(!t?.callWS)return null;try{const e=await t.callWS({type:"cctv_dashboard/get_settings"});return e&&"object"==typeof e?{...e,sensorLinks:It(e.sensor_links||{})}:null}catch(t){return console.warn("CCTV: failed to load shared config",t),null}}async function Wt(t,e){if(!t?.callWS)return null;const s=It(e);return t.callWS({type:"cctv_dashboard/set_sensor_links",sensor_links:s})}async function zt(t,e){return t?.callWS?t.callWS({type:"cctv_dashboard/set_settings",...e}):null}async function Vt(t,e=40){if(!t?.callWS)return[];try{const s=await t.callWS({type:"cctv_dashboard/list_recordings",limit:e});return s?.sessions||[]}catch(t){return console.warn("CCTV: failed to list recordings",t),[]}}const Bt="cctv_dashboard";async function Ft(t){if(!t?.callWS)return null;try{const e=await t.callWS({type:"frontend/get_user_data",key:Bt}),s=e?.value??e;if(!s||"object"!=typeof s)return null;const i=Array.isArray(s.selectedCameras)?s.selectedCameras.map(String).filter(t=>t.startsWith("camera.")):[];return{selectedCameras:i,legacySensorLinks:s.sensorLinks&&"object"==typeof s.sensorLinks?s.sensorLinks:null}}catch(t){return console.warn("CCTV: failed to load panel user data",t),null}}async function Gt(t,e,s={}){if(!t?.callWS)return;const i=[...new Set(e.map(String).filter(t=>t.startsWith("camera.")))].slice(0,4),r={selectedCameras:i};s.clearLegacySensorLinks;try{await t.callWS({type:"frontend/set_user_data",key:Bt,value:r})}catch(t){throw console.warn("CCTV: failed to save panel selection",t),t}return{selectedCameras:i}}const Kt=100,Qt=50;const Jt=new class{constructor(t=4){this.max=t,this.holders=new Map,this.queue=[]}setMax(t){const e=Math.max(1,Number(t)||4);if(e!==this.max)for(this.max=e,this._drain();this.holders.size>this.max;)this._revokeLowest()}activeCount(){return this.holders.size}has(t){return this.holders.has(t)}request(t,e,{onGrant:s,onRevoke:i}){if(!t)return!1;if(this.holders.has(t)){const s=this.holders.get(t);return s.priority=e,s.onRevoke=i,this.queue=this.queue.filter(e=>e.id!==t),!0}const r=this.queue.find(e=>e.id===t);if(r)return r.priority=e,r.onGrant=s,r.onRevoke=i,this._drain(),this.holders.has(t);if(this.holders.size<this.max)return this.holders.set(t,{priority:e,onRevoke:i}),!0;const n=this._lowestHolder();return n&&e>n.priority?(this._revoke(n.id),this.holders.set(t,{priority:e,onRevoke:i}),!0):(this.queue.push({id:t,priority:e,onGrant:s,onRevoke:i}),this.queue.sort((t,e)=>e.priority-t.priority),!1)}release(t){t&&(this.queue=this.queue.filter(e=>e.id!==t),this.holders.has(t)&&(this.holders.delete(t),this._drain()))}_lowestHolder(){let t=null;for(const[e,s]of this.holders)(!t||s.priority<t.priority)&&(t={id:e,priority:s.priority});return t}_revoke(t){const e=this.holders.get(t);if(e){this.holders.delete(t);try{e.onRevoke?.()}catch(t){console.warn("CCTV stream slot revoke failed",t)}}}_revokeLowest(){const t=this._lowestHolder();t&&this._revoke(t.id)}_drain(){for(;this.holders.size<this.max&&this.queue.length;){const t=this.queue.shift();this.holders.set(t.id,{priority:t.priority,onRevoke:t.onRevoke});try{t.onGrant?.()}catch(e){console.warn("CCTV stream slot grant failed",e),this.holders.delete(t.id)}}}}(4);class Zt extends at{static properties={hass:{attribute:!1},camera:{attribute:!1},config:{attribute:!1},quality:{type:String},context:{type:String},muted:{type:Boolean},controls:{type:Boolean},large:{type:Boolean,reflect:!0},mosaic:{type:Boolean,reflect:!0},eager:{type:Boolean},posterOnly:{type:Boolean,attribute:"poster-only"},_mode:{state:!0},_error:{state:!0},_hlsUrl:{state:!0},_mjpegUrl:{state:!0},_stillUrl:{state:!0},_visible:{state:!0},_slotHeld:{state:!0},_queued:{state:!0}};static styles=n`
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

    /* Desktop mosaic tiles: fill the grid cell instead of enforcing a tall min-height. */
    :host([large][mosaic]) {
      min-height: 0;
      height: 100%;
    }

    @media (min-width: 801px) {
      :host([large][mosaic]) {
        min-height: 0;
      }

      :host([large][mosaic]) .media,
      :host([large][mosaic]) ha-camera-stream,
      :host([large][mosaic]) video,
      :host([large][mosaic]) img {
        min-height: 0;
      }
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

    :host([large][mosaic]) .media,
    :host([large][mosaic]) ha-camera-stream,
    :host([large][mosaic]) video,
    :host([large][mosaic]) img {
      min-height: 0;
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
  `;constructor(){super(),this.config={},this.quality="",this.context="mosaic",this.muted=!0,this.controls=!1,this.large=!1,this.mosaic=!1,this.eager=!1,this.posterOnly=!1,this._mode="loading",this._error="",this._hlsUrl="",this._mjpegUrl="",this._stillUrl="",this._visible=!1,this._slotHeld=!1,this._queued=!1,this._pc=null,this._unsubWebRtc=null,this._sessionId=null,this._startToken=0,this._observer=null,this._slotId="",this._streamCamera=null}connectedCallback(){super.connectedCallback(),this._bindObserver()}disconnectedCallback(){super.disconnectedCallback(),this._unbindObserver(),this._releaseSlot(),this._stopLive()}updated(t){if((t.has("eager")||t.has("posterOnly"))&&this._bindObserver(),(t.has("hass")||t.has("camera")||t.has("config")||t.has("quality")||t.has("context")||t.has("eager")||t.has("posterOnly"))&&this._reconcilePlayback(),t.has("muted")){const t=this.renderRoot?.querySelector("video");t&&(t.muted=this.muted)}}get _effectiveQuality(){return this.quality?this.quality:Nt(this.config,this.camera?.entityId)}get _priority(){return this.eager?Kt:Qt}_bindObserver(){this._unbindObserver(),this.eager||this.posterOnly?this._visible=!0:"undefined"!=typeof IntersectionObserver?(this._observer=new IntersectionObserver(t=>{const e=t.some(t=>t.isIntersecting);e!==this._visible&&(this._visible=e,this._reconcilePlayback())},{root:null,rootMargin:"120px 0px",threshold:.15}),this._observer.observe(this)):this._visible=!0}_unbindObserver(){this._observer&&(this._observer.disconnect(),this._observer=null)}_wantsLive(){return!this.posterOnly&&(!!this.eager||this._visible)}_refreshPosterUrls(t){const e=t||this.camera;if(!this.hass||!e?.stateObj)return this._stillUrl="",void(this._mjpegUrl="");this._stillUrl=function(t,e,s=!0){if(!t||!e?.stateObj)return"";const i=e.stateObj.attributes||{};let r=i.entity_picture;if(!r&&i.access_token&&(r=`/api/camera_proxy/${e.entityId}?token=${i.access_token}`),!r)return"";const n="function"==typeof t.hassUrl?t.hassUrl(r):r;if(!s)return n;const a=n.includes("?")?"&":"?";return`${n}${a}t=${Date.now()}`}(this.hass,e,!0),this._mjpegUrl=function(t,e){const s=e?.stateObj?.attributes?.access_token;if(!t||!e?.entityId||!s)return"";const i=`/api/camera_proxy_stream/${e.entityId}?token=${s}`;return"function"==typeof t.hassUrl?t.hassUrl(i):i}(this.hass,e)}_stopLive(){if(this._startToken+=1,this._unsubWebRtc){try{this._unsubWebRtc()}catch{}this._unsubWebRtc=null}if(this._pc){try{this._pc.close()}catch{}this._pc=null}this._sessionId=null,this._hlsUrl=""}_releaseSlot(){this._slotId&&Jt.release(this._slotId),this._slotHeld=!1,this._queued=!1}_showIdle(t="idle"){this._stopLive(),this._refreshPosterUrls(this._streamCamera||this.camera),this.hass&&this.camera?.stateObj?(this._mode=this._stillUrl?"still":"empty",this._error=this._stillUrl?"":"No preview",this._idleReason=t):this._mode="empty"}_reconcilePlayback(){const t=Number(this.config?.max_streams);if(Number.isFinite(t)&&t>0&&Jt.setMax(t),!this.hass||!this.camera?.stateObj)return this._releaseSlot(),this._stopLive(),this._mode="empty",void(this._playKey="");this._streamCamera=Ht(this.hass,this.camera,this.config,this._effectiveQuality,this.context),this._slotId=this._streamCamera.entityId||this.camera.entityId,this._refreshPosterUrls(this._streamCamera);const e=this._wantsLive(),s=[e?"live":"idle",this._slotId,this._effectiveQuality,this.context,this.eager?"eager":"lazy"].join("|");if(!e)return this._releaseSlot(),this._showIdle("idle"),void(this._playKey=s);if(this._slotHeld&&this._playKey===s&&"loading"!==this._mode&&"empty"!==this._mode&&("still"!==this._mode||!this._queued))return;const i=()=>{this._slotHeld=!0,this._queued=!1,this._playKey=s,this._startLive()},r=()=>{if(this._slotHeld=!1,this._queued=this._wantsLive(),this._playKey="",this._showIdle("queued"),this._wantsLive()){Jt.request(this._slotId,this._priority,{onGrant:i,onRevoke:r})&&i()}};Jt.request(this._slotId,this._priority,{onGrant:i,onRevoke:r})?i():(this._slotHeld=!1,this._queued=!0,this._playKey=s,this._showIdle("queued"))}async _startLive(){this._stopLive();const t=this._startToken;this._error="",this._mode="loading",this._idleReason="";const e=this._streamCamera||this.camera;this._refreshPosterUrls(e);const s=function(t,e="mosaic"){const s=Ut(t);return"low"===s?["mjpeg","ha","webrtc","hls"]:"high"===s?["webrtc","ha","hls","mjpeg"]:"balanced"===s?["ha","webrtc","hls","mjpeg"]:"mosaic"===e?["mjpeg","ha","webrtc","hls"]:["webrtc","ha","hls","mjpeg"]}(this._effectiveQuality,this.context);for(const i of s){if(t!==this._startToken||!this._slotHeld)return;if("ha"===i&&customElements.get("ha-camera-stream"))return void(this._mode="ha");if("webrtc"===i&&"undefined"!=typeof RTCPeerConnection){const s=await ut(this.hass,e.entityId);if(t!==this._startToken||!this._slotHeld)return;const i=s?.frontend_stream_types||[],r=e.frontendStreamType;if(i.includes("web_rtc")||"web_rtc"===r||pt(e)||!i.length)try{if(await this._startWebRtc(t,e),t!==this._startToken||!this._slotHeld)return;return void(this._mode="webrtc")}catch(t){console.warn("CCTV WebRTC failed, falling back",t)}}if("hls"===i)try{const s=await mt(this.hass,e.entityId);if(t!==this._startToken||!this._slotHeld)return;if(s&&this._canPlayHlsNatively())return this._hlsUrl=s,void(this._mode="hls")}catch(t){console.warn("CCTV HLS failed, falling back",t)}if("mjpeg"===i&&this._mjpegUrl)return void(this._mode="mjpeg")}this._mode=this._stillUrl?"still":"empty",this._stillUrl||(this._error="No stream or preview available")}_canPlayHlsNatively(){const t=document.createElement("video");return""!==t.canPlayType("application/vnd.apple.mpegurl")||""!==t.canPlayType("application/x-mpegURL")}async _startWebRtc(t,e){const s=await async function(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/webrtc/get_client_config",entity_id:e})}catch{return null}}(this.hass,e.entityId)||{};if(t!==this._startToken)return;const i=new RTCPeerConnection(s.configuration||{});this._pc=i,i.addTransceiver("video",{direction:"recvonly"});try{i.addTransceiver("audio",{direction:"recvonly"})}catch{}i.ontrack=t=>{const e=this.renderRoot?.querySelector("video#webrtc");if(!e)return;const[s]=t.streams;e.srcObject=s||new MediaStream([t.track]),e.muted=this.muted,e.play?.().catch(()=>{})},i.onicecandidate=t=>{t.candidate&&this._sessionId&&async function(t,e,s,i){t?.callWS&&await t.callWS({type:"camera/webrtc/candidate",entity_id:e,session_id:s,candidate:i})}(this.hass,e.entityId,this._sessionId,t.candidate.toJSON()).catch(()=>{})};const r=await i.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});await i.setLocalDescription(r),this._unsubWebRtc=await function(t,e,s,i){if(!t?.connection?.subscribeMessage)throw new Error("WebSocket connection unavailable");return t.connection.subscribeMessage(i,{type:"camera/webrtc/offer",entity_id:e,offer:s})}(this.hass,e.entityId,r.sdp,async e=>{if(t===this._startToken&&this._pc)if("session"!==e.type)if("answer"!==e.type)if("candidate"===e.type&&e.candidate)try{await this._pc.addIceCandidate(e.candidate)}catch{}else"error"===e.type&&(this._error=e.message||e.code||"WebRTC error",this._mode=this._mjpegUrl?"mjpeg":this._stillUrl?"still":"empty");else await this._pc.setRemoteDescription({type:"answer",sdp:e.answer});else this._sessionId=e.session_id})}render(){if("loading"===this._mode)return W`<div class="placeholder">Connecting…</div>`;if("empty"===this._mode)return W`<div class="error">${this._error||"No preview"}</div>`;let t=this._mode;return this._queued?t="queued":this._slotHeld||"still"!==this._mode||(t=this._idleReason||"idle"),W`
      ${this._renderMedia()}
      <span class="badge">${t}</span>
    `}_renderMedia(){const t=this._streamCamera||this.camera;return"ha"===this._mode?W`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${t.stateObj}
          .muted=${this.muted}
          .controls=${this.controls}
        ></ha-camera-stream>
      `:"webrtc"===this._mode?W`
        <video
          id="webrtc"
          class="media"
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
        ></video>
      `:"hls"===this._mode?W`
        <video
          class="media"
          src=${this._hlsUrl}
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
        ></video>
      `:"mjpeg"===this._mode?W`<img class="media" alt="" src=${this._mjpegUrl} />`:"still"===this._mode?W`<img class="media" alt="" src=${this._stillUrl} />`:V}}customElements.get("cctv-stream-player")||customElements.define("cctv-stream-player",Zt);const Xt=[{value:9e5,label:"15m"},{value:36e5,label:"1h"},{value:216e5,label:"6h"},{value:864e5,label:"24h"}];class Yt extends at{static properties={hass:{attribute:!1},cameras:{attribute:!1},sensorLinks:{attribute:!1},cameraNames:{attribute:!1},_windowMs:{state:!0},_loading:{state:!0},_error:{state:!0},_rows:{state:!0},_now:{state:!0}};createRenderRoot(){return this}constructor(){super(),this.cameras=[],this.sensorLinks={},this.cameraNames={},this._windowMs=36e5,this._loading=!1,this._error="",this._rows=[],this._now=Date.now(),this._timer=null,this._fetchToken=0}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._now=Date.now(),this._refresh()},3e4)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer)}updated(t){(t.has("hass")||t.has("cameras")||t.has("sensorLinks")||t.has("_windowMs"))&&this._refresh()}async _refresh(){const t=this._linkedEntityIds();if(!this.hass||!t.length)return this._rows=[],void(this._error="");const e=++this._fetchToken;this._loading=!0,this._error="";const s=Date.now(),i=s-this._windowMs;try{const r=await async function(t,e,s,i){if(!t?.callWS||!e?.length)return{};try{const r=await t.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:i.toISOString(),entity_ids:e,significant_changes_only:!1,minimal_response:!0,no_attributes:!0});return r&&"object"==typeof r?r:{}}catch(t){return console.warn("CCTV: history fetch failed",t),{}}}(this.hass,t,new Date(i),new Date(s));if(e!==this._fetchToken)return;this._rows=this._buildRows(r,i,s),this._now=s}catch(t){if(e!==this._fetchToken)return;this._error=t?.message||"Could not load detection history",this._rows=this._buildRows({},i,s)}finally{e===this._fetchToken&&(this._loading=!1)}}_linkedEntityIds(){const t=[];for(const e of this.cameras||[])for(const s of this.sensorLinks?.[e]||[])t.push(s);return[...new Set(t)]}_buildRows(t,e,s){const i=new Map;for(const r of this.cameras||[]){const n=At(this.hass,this.sensorLinks?.[r]||[]);for(const a of n){const n=a.kind||{id:"other",label:"Other"},o=t?.[a.entityId]||t?.[a.entityId.toLowerCase()]||[];let l=Et(o,e,s,t=>xt({state:t}));if(a.active&&!a.missing){const t=l[l.length-1];t&&t.end>=s-5e3?t.end=s:o.length||(l=[{start:Math.max(e,s-6e4),end:s}])}let c=i.get(n.id);c||(c={kind:n,raw:[],sensors:new Set,cameras:new Set,active:!1},i.set(n.id,c)),c.raw.push(...l),c.sensors.add(a.entityId),c.cameras.add(r),a.active&&!a.missing&&(c.active=!0)}}const r=new Map(vt.map((t,e)=>[t.id,e]));return[...i.values()].map(t=>{const e=function(t,e=0){if(!Array.isArray(t)||!t.length)return[];const s=t.map(t=>({start:Number(t.start),end:Number(t.end)})).filter(t=>Number.isFinite(t.start)&&Number.isFinite(t.end)&&t.end>t.start).sort((t,e)=>t.start-e.start||t.end-e.end);if(!s.length)return[];const i=[{start:s[0].start,end:s[0].end}];for(let t=1;t<s.length;t+=1){const r=s[t],n=i[i.length-1];r.start<=n.end+e?n.end=Math.max(n.end,r.end):i.push({start:r.start,end:r.end})}return i}(t.raw,1e3),s=[...t.cameras].map(t=>this.cameraNames?.[t]||t);return{kind:t.kind,segments:e,totalMs:e.reduce((t,e)=>t+Math.max(0,e.end-e.start),0),sensorCount:t.sensors.size,cameraNames:s,active:t.active}}).sort((t,e)=>(r.get(t.kind.id)??99)-(r.get(e.kind.id)??99)||t.kind.label.localeCompare(e.kind.label))}_setWindow(t){this._windowMs=t}render(){const t=this._linkedEntityIds().length;return(this.cameras||[]).length?W`
      <section class="timeline" aria-label="Detection timeline">
        <div class="timeline-head">
          <div>
            <strong>Detection timeline</strong>
            <span class="hint">
              ${t?"Grouped by type — overlapping same-type sensors merge into one flag":"Link detection sensors in a camera’s settings to see flags here"}
            </span>
          </div>
          <div class="timeline-windows">
            ${Xt.map(t=>W`
                <button
                  type="button"
                  class="btn ${this._windowMs===t.value?"primary":""}"
                  @click=${()=>this._setWindow(t.value)}
                >
                  ${t.label}
                </button>
              `)}
          </div>
        </div>

        ${this._error?W`<p class="timeline-error">${this._error}</p>`:V}
        ${t?0===this._rows.length?W`<p class="empty">No linked sensors for the current selection.</p>`:W`
                <div class="timeline-axis" aria-hidden="true">
                  <span>${Ot(this._now-this._windowMs)}</span>
                  <span>now ${Ot(this._now)}</span>
                </div>
                <div class="timeline-rows">
                  ${this._rows.map(t=>this._renderRow(t))}
                </div>
                ${this._loading?W`<p class="hint timeline-loading">Refreshing…</p>`:V}
              `:W`<p class="empty">No detection sensors linked yet.</p>`}
      </section>
    `:V}_renderRow(t){const e=vt.find(e=>e.id===t.kind.id)||vt[vt.length-1],s=this._now-this._windowMs,i=Math.max(1,this._windowMs),r=(t.cameraNames||[]).join(", ");return W`
      <div class="timeline-row">
        <div class="timeline-label">
          <span class="timeline-kind kind-${e.id}">${e.label}</span>
          <span class="timeline-cam" title=${r}>
            ${r||"Selected cameras"}
          </span>
          <span class="timeline-sensor">
            ${t.sensorCount} sensor${1===t.sensorCount?"":"s"}
          </span>
          <span class="timeline-total">
            ${t.segments.length?`${t.segments.length} event${1===t.segments.length?"":"s"} · ${Mt(t.totalMs)}`:t.active?"active now":"quiet"}
          </span>
        </div>
        <div class="timeline-track" role="img" aria-label="${e.label} activity">
          ${t.segments.map(t=>{const r=(t.start-s)/i*100,n=Math.max(.4,(t.end-t.start)/i*100),a=`${e.label}: ${Ot(t.start)}–${Ot(t.end)} (${Mt(t.end-t.start)})`;return W`
              <span
                class="timeline-flag kind-${e.id}"
                style="left:${r}%;width:${n}%"
                title=${a}
              ></span>
            `})}
        </div>
      </div>
    `}}customElements.get("cctv-detection-timeline")||customElements.define("cctv-detection-timeline",Yt);class te extends at{static properties={hass:{attribute:!1},config:{attribute:!1},panelMode:{type:Boolean,attribute:"panel-mode"},_detailId:{state:!0},_status:{state:!0},_qualityTick:{state:!0},_visibleIds:{state:!0},_sensorLinks:{state:!0},_pickerOpen:{state:!0},_settingsOpen:{state:!0},_selectionReady:{state:!0},_saving:{state:!0},_sensorFilter:{state:!0},_deviceMapReady:{state:!0},_retentionDays:{state:!0},_recordOnDetection:{state:!0},_sessions:{state:!0},_recordDir:{state:!0}};static styles=lt;constructor(){super(),this.config={},this.panelMode=!1,this._detailId=null,this._status="",this._qualityTick=0,this._visibleIds=[],this._sensorLinks={},this._pickerOpen=!0,this._settingsOpen=!1,this._selectionReady=!1,this._saving=!1,this._sensorFilter="",this._deviceMapReady=!1,this._retentionDays=1,this._recordOnDetection=!0,this._sessions=[],this._recordDir="",this._loadedForUser=null,this._deviceMap=new Map}updated(t){this.panelMode&&(t.has("hass")||t.has("panelMode"))&&this._ensureSelectionLoaded()}async _ensureSelectionLoaded(){const t=this.hass?.user?.id||"default";if(!this.hass||this._loadedForUser===t)return;this._loadedForUser=t,this._selectionReady=!1;const[e,s]=await Promise.all([Ft(this.hass),qt(this.hass)]),i=this._cameras().map(t=>t.entityId);e?.selectedCameras?.length?(this._visibleIds=e.selectedCameras.filter(t=>i.includes(t)).slice(0,this._maxStreams()),this._pickerOpen=0===this._visibleIds.length):(this._visibleIds=[],this._pickerOpen=!0);let r=s?.sensorLinks||{};const n=e?.legacySensorLinks;if(n&&"object"==typeof n&&Object.keys(n).length&&!Object.keys(r).length)try{const t=await Wt(this.hass,n);r=t?.sensor_links?Object.fromEntries(Object.entries(t.sensor_links).map(([t,e])=>[t,e])):n,await Gt(this.hass,this._visibleIds),this._status="Detection sensor links moved to shared settings"}catch(t){console.warn("CCTV: legacy sensor-link migration failed",t),r=n}this._sensorLinks=r,s?(this._retentionDays=Number(s.retention_days)||1,this._recordOnDetection=!1!==s.record_on_detection,this._recordDir=s.record_dir||""):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._selectionReady=!0,this._loadDeviceMap(),this._sessions=await Vt(this.hass)}async _loadDeviceMap(){this.hass&&!this._deviceMapReady&&(this._deviceMap=await async function(t){const e=new Map;if(!t?.callWS)return e;try{const s=await t.callWS({type:"config/entity_registry/list"});if(!Array.isArray(s))return e;for(const t of s)t?.entity_id&&t?.device_id&&e.set(String(t.entity_id),String(t.device_id))}catch(t){console.warn("CCTV: entity registry unavailable for sensor linking",t)}return e}(this.hass),this._deviceMapReady=!0)}async _loadRecordingUi(){if(!this.hass)return;const t=await qt(this.hass);t?(this._retentionDays=Number(t.retention_days)||1,this._recordOnDetection=!1!==t.record_on_detection,this._recordDir=t.record_dir||"",t.sensorLinks&&(this._sensorLinks=t.sensorLinks)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._sessions=await Vt(this.hass)}_cameras(){return function(t,e={}){const s=t?.states??{},i=yt(e.cameras),r=new Set(yt(e.exclude).map(t=>t.toLowerCase()));let n=Object.keys(s).filter(t=>t.startsWith("camera."));if(i.length){const t=new Set(i.map(t=>t.toLowerCase()));n=n.filter(e=>t.has(e.toLowerCase()))}return n=n.filter(t=>!r.has(t.toLowerCase())),n.map(t=>ht(t,s[t])).sort((t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}))}(this.hass,this.config)}_maxStreams(){const t=Number(this.config?.max_streams);return Number.isFinite(t)&&t>0?t:4}_visibleCameras(t){return this._visibleIds.map(e=>t.find(t=>t.entityId===e)).filter(Boolean)}_linksFor(t){return this._sensorLinks?.[t]||[]}async _toggleVisible(t,e){const s=this._maxStreams();let i=[...this._visibleIds];if(e){if(i.includes(t))return;if(i.length>=s)return void(this._status=`Select at most ${s} cameras`);i.push(t)}else i=i.filter(e=>e!==t);this._visibleIds=i,this._detailId&&!i.includes(this._detailId)&&(this._detailId=null),await this._persistSelection(i)}async _persistSelection(t){this._saving=!0;try{const e=await Gt(this.hass,t);e?.selectedCameras&&(this._visibleIds=e.selectedCameras);const s=e?.selectedCameras||t;this._status=s.length?`${s.length} camera${1===s.length?"":"s"} on screen`:"No cameras selected"}catch(t){this._status=t?.message||"Could not save camera selection"}finally{this._saving=!1}}async _persistSensorLinks(t){this._saving=!0,this._sensorLinks=t;try{const e=await Wt(this.hass,t);e?.sensor_links&&(this._sensorLinks=e.sensor_links),this._status="Detection sensors saved for all users"}catch(t){this._status=t?.message||"Could not save detection sensors"}finally{this._saving=!1}}async _setSensorLinked(t,e,s){const i=new Set(this._linksFor(t));s?i.add(e):i.delete(e);const r={...this._sensorLinks,[t]:[...i]};r[t].length||delete r[t],await this._persistSensorLinks(r)}async _applySuggestions(t){const e=Ct(this.hass,t,{deviceIds:this._deviceMap,limit:8});if(!e.length)return void(this._status="No related detection sensors found");const s={...this._sensorLinks,[t]:[...new Set([...this._linksFor(t),...e.map(t=>t.entityId)])].slice(0,16)};await this._persistSensorLinks(s),this._status=`Linked ${e.length} suggested sensor${1===e.length?"":"s"} (all users)`}_openDetail(t){this._detailId=t,this._sensorFilter=""}_back(){this._detailId=null,this._sensorFilter=""}_setQuality(t,e){jt(t,e),this._qualityTick+=1}async _run(t,e){this._status=`Calling ${t}…`;try{await gt(this.hass,t,e),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}async _saveRetentionDays(t){const e=Math.max(1,Math.min(30,Number(t)||1));this._retentionDays=e,this._saving=!0;try{await zt(this.hass,{retention_days:e}),this._status=`Retention set to ${e} day${1===e?"":"s"}`}catch(t){this._status=t?.message||"Could not save retention"}finally{this._saving=!1}}async _toggleRecordOnDetection(t){this._recordOnDetection=t,this._saving=!0;try{await zt(this.hass,{record_on_detection:t}),this._status=t?"Detection recording enabled":"Detection recording paused"}catch(t){this._status=t?.message||"Could not save recording setting"}finally{this._saving=!1}}async _refreshSessions(){this._sessions=await Vt(this.hass),this._status="Recordings refreshed"}async _deleteSession(t){try{await async function(t,e){if(!t?.callWS)return!1;const s=await t.callWS({type:"cctv_dashboard/delete_recording",session_id:e});return Boolean(s?.deleted)}(this.hass,t),this._sessions=await Vt(this.hass),this._status="Recording deleted"}catch(t){this._status=t?.message||"Could not delete recording"}}render(){if(!this.hass)return W`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;this._qualityTick,this._deviceMapReady;const t=this._cameras(),e=this._maxStreams();Jt.setMax(e);const s=this.config?.title||"CCTV";if(this.panelMode&&!this._selectionReady)return W`
        <div class="panel-wrap wrap">
          <p class="placeholder">Loading camera selection…</p>
        </div>
      `;const i=t.find(t=>t.entityId===this._detailId)||null,r=this.panelMode?this._visibleCameras(t):t,n=Object.fromEntries(t.map(t=>[t.entityId,t.name]));return W`
      <div class=${this.panelMode?"panel-wrap wrap":"wrap"}>
        <div class="top">
          <div>
            ${this.panelMode?W`<p class="eyebrow">Home Assistant</p>`:V}
            <h1>${s}</h1>
          </div>
          <div class="top-actions">
            ${this.panelMode?W`
                  <button
                    class="btn"
                    type="button"
                    @click=${()=>this._pickerOpen=!this._pickerOpen}
                  >
                    ${this._pickerOpen?"Hide cameras":"Choose cameras"}
                  </button>
                  <button
                    class="btn"
                    type="button"
                    @click=${()=>{this._settingsOpen=!this._settingsOpen,this._settingsOpen&&this._loadRecordingUi()}}
                  >
                    ${this._settingsOpen?"Hide settings":"Settings"}
                  </button>
                `:V}
            <span class="status">
              ${this._status||(this.panelMode?`${r.length}/${e} selected · ${Jt.activeCount()} live`:`${t.length} camera${1===t.length?"":"s"} · ${Jt.activeCount()}/${e} live`)}
              ${this._saving?" · saving…":""}
            </span>
          </div>
        </div>

        ${this.panelMode&&this._pickerOpen?this._renderPicker(t,e):V}

        ${this.panelMode&&this._settingsOpen?this._renderSettings():V}

        ${i?this._renderDetail(i):this.panelMode?this._renderLayout(r):this._renderCardGrid(t)}

        ${this.panelMode&&!i?W`
              <cctv-detection-timeline
                .hass=${this.hass}
                .cameras=${r.map(t=>t.entityId)}
                .sensorLinks=${this._sensorLinks}
                .cameraNames=${n}
              ></cctv-detection-timeline>
              ${this._renderRecordings()}
            `:V}
      </div>
    `}_renderSettings(){return W`
      <section class="settings-panel" aria-label="CCTV settings">
        <div class="picker-head">
          <strong>Detection recordings</strong>
          <span class="hint">
            When any site-wide linked detection sensor triggers, HA starts saving
            clips for <em>all</em> available cameras until sensors clear.
            Uses <code>camera.record</code> (30s chunks + lookback) with snapshot fallback.
            Sensor links are shared for every HA user; your mosaic selection stays personal.
          </span>
        </div>
        <div class="settings-grid">
          <label class="settings-field">
            Retention (days)
            <input
              type="number"
              min="1"
              max="30"
              .value=${String(this._retentionDays)}
              @change=${t=>this._saveRetentionDays(t.target.value)}
            />
          </label>
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._recordOnDetection}
              @change=${t=>this._toggleRecordOnDetection(t.target.checked)}
            />
            <span class="picker-name">Record on detection</span>
            <span class="picker-id">Default retention is 1 day (24 hours).</span>
          </label>
        </div>
        <p class="hint">
          Storage: ${this._recordDir||"HA media / www /cctv_dashboard/recordings"}.
          Multi-cam continuous video needs a writable media folder and cameras that support streaming;
          otherwise snapshots are saved instead. Also configurable under
          Settings → Devices &amp; services → CCTV Dashboard → Configure.
        </p>
      </section>
    `}_renderRecordings(){const t=this._sessions||[];return W`
      <section class="recordings" aria-label="Detection recordings">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Kept for ${this._retentionDays} day${1===this._retentionDays?"":"s"}, then deleted.
            </span>
          </div>
          <button class="btn" type="button" @click=${()=>this._refreshSessions()}>
            Refresh
          </button>
        </div>
        ${t.length?W`
              <div class="recording-list">
                ${t.map(t=>this._renderSession(t))}
              </div>
            `:W`<p class="empty">No detection recordings yet.</p>`}
      </section>
    `}_renderSession(t){const e=t.started?new Date(t.started).toLocaleString():"—",s=t.active?"recording…":t.ended?new Date(t.ended).toLocaleString():"—",i=t.clips||[];return W`
      <article class="recording-item ${t.active?"active":""}">
        <div class="recording-meta">
          <strong>${t.active?"Live session":"Session"} ${t.session_id}</strong>
          <span class="hint">${e} → ${s} · ${t.mode||"record"} · ${i.length} clip${1===i.length?"":"s"}</span>
          <span class="hint">Triggers: ${(t.trigger_sensors||[]).join(", ")||"—"}</span>
        </div>
        <div class="recording-clips">
          ${i.slice(0,12).map(t=>{const e=(s=this.hass,(i=t.url)?"function"==typeof s?.hassUrl?s.hassUrl(i):i:"");var s,i;return W`
              <a class="recording-clip" href=${e} target="_blank" rel="noopener">
                ${"snapshot"===t.kind?"JPG":"MP4"} · ${(t.camera_id||"").replace("camera.","")}
              </a>
            `})}
          ${i.length>12?W`<span class="hint">+${i.length-12} more</span>`:V}
        </div>
        ${t.active?V:W`
              <button
                class="btn"
                type="button"
                @click=${()=>this._deleteSession(t.session_id)}
              >
                Delete
              </button>
            `}
      </article>
    `}_renderPicker(t,e){return t.length?W`
      <section class="picker" aria-label="Camera selection">
        <div class="picker-head">
          <strong>Visible streams</strong>
          <span class="hint">Select 1–${e}. Layout updates automatically. Saved to your HA profile (per user).</span>
        </div>
        <div class="picker-list">
          ${t.map(t=>{const s=this._visibleIds.includes(t.entityId),i=!s&&this._visibleIds.length>=e,r=this._linksFor(t.entityId).length;return W`
              <label class="picker-item ${i?"disabled":""}">
                <input
                  type="checkbox"
                  .checked=${s}
                  ?disabled=${i}
                  @change=${e=>this._toggleVisible(t.entityId,e.target.checked)}
                />
                <span class="picker-name">${t.name}</span>
                <span class="picker-id">
                  ${t.entityId}${r?` · ${r} sensor${1===r?"":"s"}`:""}
                </span>
              </label>
            `})}
        </div>
      </section>
    `:W`<p class="empty">No camera entities found.</p>`}_renderLayout(t){if(!t.length)return W`
        <p class="empty">
          Select cameras above to start streaming.
          One camera fills the view; two to four split the screen equally (max ${this._maxStreams()}).
        </p>
      `;const e=Math.min(t.length,4);return W`
      <div class="layout layout-${e}" role="list">
        ${t.slice(0,4).map(t=>{const e=Nt(this.config,t.entityId),s=this._linksFor(t.entityId).length;return W`
            <article class="tile layout-tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  large
                  mosaic
                  eager
                  .hass=${this.hass}
                  .camera=${t}
                  .config=${this.config}
                  .quality=${e}
                  context="mosaic"
                  muted
                ></cctv-stream-player>
              </div>
              <button
                type="button"
                class="tile-body tile-open"
                @click=${()=>this._openDetail(t.entityId)}
              >
                <p class="tile-title">${t.name}</p>
                <p class="tile-meta">
                  <span class="dot ${t.state}"></span>${t.state} · ${e}
                  ${s?W` · ${s} detection`:V}
                </p>
              </button>
            </article>
          `})}
      </div>
    `}_renderCardGrid(t){return t.length?W`
      <div class="grid" role="list">
        ${t.map(t=>{const e=Nt(this.config,t.entityId);return W`
            <article class="tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  .hass=${this.hass}
                  .camera=${t}
                  .config=${this.config}
                  .quality=${e}
                  context="mosaic"
                  muted
                ></cctv-stream-player>
              </div>
              <button
                type="button"
                class="tile-body tile-open"
                @click=${()=>this._openDetail(t.entityId)}
              >
                <p class="tile-title">${t.name}</p>
                <p class="tile-meta">
                  <span class="dot ${t.state}"></span>${t.state} · ${e}
                </p>
              </button>
            </article>
          `})}
      </div>
    `:W`<p class="empty">No camera entities found.</p>`}_renderDetail(t){const e=_t(this.hass,t),s=Nt(this.config,t.entityId),i=Ht(this.hass,t,this.config,s,"detail");return W`
      <button class="btn linkish" type="button" @click=${this._back}>
        ← ${this.panelMode?"Back to layout":"All cameras"}
      </button>
      <h2>${t.name}</h2>
      <div class="detail-stage">
        <cctv-stream-player
          large
          eager
          .hass=${this.hass}
          .camera=${t}
          .config=${this.config}
          .quality=${s}
          context="detail"
          .muted=${!1}
          controls
        ></cctv-stream-player>
      </div>
      <div class="quality-row">
        <label>
          Stream quality
          <select
            .value=${s}
            @change=${e=>this._setQuality(t.entityId,e.target.value)}
          >
            ${Lt.map(t=>W`<option value=${t.value}>${t.label}</option>`)}
          </select>
        </label>
        <span class="hint">${Pt(s)}</span>
      </div>
      <dl class="meta">
        <dt>Entity</dt>
        <dd>${t.entityId}</dd>
        <dt>Streaming</dt>
        <dd>${i.entityId}</dd>
        <dt>State</dt>
        <dd>${t.state}</dd>
        <dt>Brand</dt>
        <dd>${t.brand||"—"}</dd>
        <dt>Model</dt>
        <dd>${t.model||"—"}</dd>
      </dl>
      <div class="actions">
        ${e.length?e.map(e=>W`
                <button
                  class="btn primary"
                  type="button"
                  @click=${()=>this._run(e.service,t.entityId)}
                >
                  ${e.label}
                </button>
              `):W`<span class="placeholder">No camera services available</span>`}
        <button
          class="btn"
          type="button"
          @click=${()=>ft(this,t.entityId)}
        >
          More info
        </button>
      </div>
      ${this.panelMode?this._renderSensorSettings(t):V}
    `}_renderSensorSettings(t){const e=this._linksFor(t.entityId),s=At(this.hass,e),i=Ct(this.hass,t.entityId,{deviceIds:this._deviceMap,limit:12}).filter(t=>!e.includes(t.entityId)),r=this._sensorFilter.trim().toLowerCase(),n=r?function(t){const e=t?.states||{};return Object.entries(e).filter(([t,e])=>{const s=t.split(".")[0];return!!bt.has(s)&&("other"!==kt(t,e).id||/detection|object|zone|occupancy|motion/i.test(t))}).map(([t,e])=>({entityId:t,name:e?.attributes?.friendly_name||t,kind:kt(t,e),state:String(e?.state??"unknown"),active:xt(e)})).sort((t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}))}(this.hass).filter(t=>!e.includes(t.entityId)).filter(t=>t.entityId.toLowerCase().includes(r)||t.name.toLowerCase().includes(r)||t.kind.label.toLowerCase().includes(r)).slice(0,40):i;return W`
      <section class="sensor-settings" aria-label="Detection sensors">
        <div class="picker-head">
          <strong>Detection sensors</strong>
          <span class="hint">
            Link person / car / animal / package sensors for the timeline and recordings.
            Associations are <strong>shared for all Home Assistant users</strong> (site-wide).
            Suggestions use name + device heuristics; confirm or pick manually.
          </span>
        </div>

        ${s.length?W`
              <div class="sensor-linked">
                ${s.map(e=>W`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${!0}
                        @change=${s=>this._setSensorLinked(t.entityId,e.entityId,s.target.checked)}
                      />
                      <span class="sensor-kind kind-${e.kind.id}">${e.kind.label}</span>
                      <span class="sensor-name">${e.name}</span>
                      <span class="sensor-state ${e.active?"on":""}">
                        ${e.missing?"missing":e.state}
                      </span>
                      <span class="picker-id">${e.entityId}</span>
                    </label>
                  `)}
              </div>
            `:W`<p class="empty">No sensors linked to this camera yet.</p>`}

        <div class="sensor-tools">
          <button
            class="btn primary"
            type="button"
            @click=${()=>this._applySuggestions(t.entityId)}
          >
            Link suggested sensors
          </button>
          <label class="sensor-filter">
            Search sensors
            <input
              type="search"
              .value=${this._sensorFilter}
              placeholder="person, package, driveway…"
              @input=${t=>this._sensorFilter=t.target.value}
            />
          </label>
        </div>

        ${n.length?W`
              <div class="sensor-candidates">
                <p class="hint">
                  ${r?"Matching sensors":"Suggested associations"}
                </p>
                ${n.map(e=>W`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${!1}
                        @change=${s=>this._setSensorLinked(t.entityId,e.entityId,s.target.checked)}
                      />
                      <span class="sensor-kind kind-${e.kind.id}">${e.kind.label}</span>
                      <span class="sensor-name">${e.name}</span>
                      <span class="sensor-state ${e.active?"on":""}">${e.state}</span>
                      <span class="picker-id">${e.entityId}</span>
                    </label>
                  `)}
              </div>
            `:r?W`<p class="empty">No sensors match “${r}”.</p>`:W`
                <p class="hint">
                  No strong suggestions. Search above to link any binary_sensor/sensor
                  (${vt.map(t=>t.label).join(", ")}).
                </p>
              `}
      </section>
    `}}customElements.get("cctv-view")||customElements.define("cctv-view",te);class ee extends at{static properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1}};createRenderRoot(){return this}get _config(){const t=this.panel?.config||{},{_panel_custom:e,...s}=t;return{title:"CCTV",max_streams:4,quality:"auto",...s}}connectedCallback(){super.connectedCallback(),this.style.display="block",this.style.height="100%"}render(){return W`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        panel-mode
      ></cctv-view>
    `}}customElements.get("cctv-dashboard-panel")||customElements.define("cctv-dashboard-panel",ee);class se extends at{static properties={hass:{attribute:!1},_config:{attribute:!1}};static styles=lt;static getConfigElement(){return null}static getStubConfig(t){const e=Object.keys(t?.states??{}).filter(t=>t.startsWith("camera.")).slice(0,4);return{title:"CCTV",max_streams:4,quality:"auto",...e.length?{cameras:e}:{}}}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");this._config={title:"CCTV",max_streams:4,quality:"auto",...t}}getCardSize(){const t=this._config?.cameras?.length;return t?Math.max(3,2*Math.ceil(t/2)):6}render(){return this._config?W`
      <ha-card>
        <div class="card-inner">
          <cctv-view .hass=${this.hass} .config=${this._config}></cctv-view>
        </div>
      </ha-card>
    `:W``}}customElements.get("cctv-cameras-card")||customElements.define("cctv-cameras-card",se),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-cameras-card"===t.type)||window.customCards.push({type:"cctv-cameras-card",name:"CCTV Cameras",preview:!0,description:"Live stream grid of Home Assistant camera entities with detail view and basic controls.",documentationURL:"https://github.com/davies1995/HA-CCTV"});class ie extends at{static properties={hass:{attribute:!1},_config:{attribute:!1},_status:{state:!0},_qualityTick:{state:!0}};static styles=lt;static getStubConfig(t){return{entity:Object.keys(t?.states??{}).find(t=>t.startsWith("camera."))||"camera.demo",title:"",muted:!0,quality:"auto"}}constructor(){super(),this._status="",this._qualityTick=0}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");if(!t.entity||!String(t.entity).startsWith("camera."))throw new Error("cctv-camera-card requires a camera.* entity");this._config={muted:!0,quality:"auto",max_streams:4,...t,entity:String(t.entity)}}getCardSize(){return 4}_setQuality(t){jt(this._config.entity,t),this._qualityTick+=1}async _run(t){this._status=`Calling ${t}…`;try{await gt(this.hass,t,this._config.entity),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}render(){if(!this._config||!this.hass)return W``;this._qualityTick;const t=this.hass.states?.[this._config.entity],e=ht(this._config.entity,t),s=this._config.title||e.name,i=_t(this.hass,e),r=Nt(this._config,this._config.entity),n=Ht(this.hass,e,this._config,r,"detail");return W`
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
              eager
              .hass=${this.hass}
              .camera=${e}
              .config=${this._config}
              .quality=${r}
              context="detail"
              .muted=${!1!==this._config.muted}
              controls
            ></cctv-stream-player>
          </div>
          <div class="quality-row">
            <label>
              Stream quality
              <select
                .value=${r}
                @change=${t=>this._setQuality(t.target.value)}
              >
                ${Lt.map(t=>W`<option value=${t.value}>${t.label}</option>`)}
              </select>
            </label>
            <span class="hint">${Pt(r)} · using ${n.entityId}</span>
          </div>
          <div class="actions" style="margin-top: 0.75rem">
            ${i.map(t=>W`
                <button
                  class="btn primary"
                  type="button"
                  @click=${()=>this._run(t.service)}
                >
                  ${t.label}
                </button>
              `)}
            <button
              class="btn"
              type="button"
              @click=${()=>ft(this,this._config.entity)}
            >
              More info
            </button>
          </div>
        </div>
      </ha-card>
    `}}customElements.get("cctv-camera-card")||customElements.define("cctv-camera-card",ie),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-camera-card"===t.type)||window.customCards.push({type:"cctv-camera-card",name:"CCTV Camera",preview:!0,description:"Live stream for a single Home Assistant camera entity.",documentationURL:"https://github.com/davies1995/HA-CCTV"});const re="0.5.0";console.info(`%c CCTV-DASHBOARD %c ${re} `,"color: #fff; background: #1b6ea8; font-weight: 700;","color: #1b6ea8; background: #fff; font-weight: 700;");export{re as VERSION};
