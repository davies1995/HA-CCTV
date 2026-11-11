const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,_=m?m.emptyScript:"",g=p.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!o(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);a?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),a=t.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const n=a.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const n=this.constructor;if(!1===s&&(a=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??v)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==a||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[f("elementProperties")]=new Map,k[f("finalized")]=new Map,g?.({ReactiveElement:k}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=t=>t,S=w.trustedTypes,x=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,P=`<${M}>`,I=document,E=()=>I.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,R="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,L=/>/g,q=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,H=/"/g,U=/^(?:script|style|textarea|title)$/i,z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),F=new WeakMap,B=I.createTreeWalker(I,129);function Q(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let a,n=2===e?"<svg>":3===e?"<math>":"",r=T;for(let e=0;e<i;e++){const i=t[e];let o,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===T?"!--"===c[1]?r=O:void 0!==c[1]?r=L:void 0!==c[2]?(U.test(c[2])&&(a=RegExp("</"+c[2],"g")),r=q):void 0!==c[3]&&(r=q):r===q?">"===c[0]?(r=a??T,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,o=c[1],r=void 0===c[3]?q:'"'===c[3]?H:j):r===H||r===j?r=q:r===O||r===L?r=T:(r=q,a=void 0);const h=r===q&&t[e+1].startsWith("/>")?" ":"";n+=r===T?i+P:l>=0?(s.push(o),i.slice(0,l)+A+i.slice(l)+C+h):i+C+(-2===l?e:h)}return[Q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,n=0;const r=t.length-1,o=this.parts,[c,l]=K(t,e);if(this.el=G.createElement(c,i),B.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=B.nextNode())&&o.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=l[n++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);o.push({type:1,index:a,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:Y}),s.removeAttribute(t)}else t.startsWith(C)&&(o.push({type:6,index:a}),s.removeAttribute(t));if(U.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],E()),B.nextNode(),o.push({type:2,index:++a});s.append(t[e],E())}}}else if(8===s.nodeType)if(s.data===M)o.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)o.push({type:7,index:a}),t+=C.length-1}a++}}static createElement(t,e){const i=I.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===W)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const n=D(e)?void 0:e._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=J(t,a._$AS(t,e.values),a,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??I).importNode(e,!0);B.currentNode=s;let a=B.nextNode(),n=0,r=0,o=i[0];for(;void 0!==o;){if(n===o.index){let e;2===o.type?e=new X(a,a.nextSibling,this,t):1===o.type?e=new o.ctor(a,o.name,o.strings,this,t):6===o.type&&(e=new st(a,this,t)),this._$AV.push(e),o=i[++r]}n!==o?.index&&(a=B.nextNode(),n++)}return B.currentNode=I,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),D(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new G(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const a of t)s===e.length?e.push(i=new X(this.O(E()),this.O(E()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const a=this.strings;let n=!1;if(void 0===a)t=J(this,t,e,0),n=!D(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let r,o;for(t=a[0],r=0;r<a.length-1;r++)o=J(this,s[i+r],e,r),o===W&&(o=this._$AH[r]),n||=!D(o)||o!==this._$AH[r],o===V?t=V:t!==V&&(t+=(o??"")+a[r+1]),this._$AH[r]=o}n&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends Y{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??V)===W)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(G,X),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;class rt extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new X(e.insertBefore(E(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const ot=nt.litElementPolyfillSupport;ot?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.2");const ct=n`
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

    /* TV mode: page scrolls; full-width 16:9 mosaic above the fold. */
    :host([panel-mode][tv-mode]) {
      height: auto;
      max-height: none;
      min-height: calc(100dvh - var(--app-header-height, 56px));
      overflow-x: hidden;
      overflow-y: auto;
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

    /* TV / kiosk: full-width 16:9 mosaic stage; rest scrolls. */
    .panel-wrap.tv-mode {
      height: auto;
      max-height: none;
      min-height: 0;
      overflow: visible;
      display: flex;
      flex-direction: column;
      padding-top: 0.5rem;
      padding-bottom: 1.25rem;
    }

    .panel-wrap.tv-mode > .top.top-tv {
      margin-bottom: 0.45rem;
    }

    .panel-wrap.tv-mode > .top.top-tv h1 {
      font-size: 1.15rem;
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .panel-wrap.tv-mode .tv-badge {
      display: inline-block;
      font-size: 0.65rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.12rem 0.4rem;
      border-radius: 4px;
      border: 1px solid var(--cctv-border);
      color: var(--cctv-muted);
      font-weight: 600;
    }

    .panel-wrap.tv-mode > .layout.layout-pack-tv {
      flex: 0 0 auto;
      /* 16:9 stage sized to full content width — do not height-limit / shrink width. */
      width: var(--cctv-tv-stage-w, 100%);
      height: var(--cctv-tv-stage-h, auto);
      max-width: 100%;
      aspect-ratio: 16 / 9;
      margin: var(--cctv-tv-stage-offset, 0) auto 0;
      align-self: center;
      box-sizing: border-box;
    }

    .panel-wrap.tv-mode > cctv-detection-timeline,
    .panel-wrap.tv-mode > .recordings {
      flex: 0 0 auto;
      max-height: none;
      overflow: visible;
      margin-top: 1rem;
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

  .quality-row select,
  .quality-row .aspect-input {
    font: inherit;
    color: inherit;
    background: var(--cctv-surface);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.35rem 0.55rem;
  }

  .quality-row .aspect-input {
    min-width: 8.5rem;
    max-width: 12rem;
  }

  .prefs-save-row {
    margin-top: 0.35rem;
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
    background: #0a0e13;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
  }

  .layout-tile cctv-stream-player {
    height: 100%;
    min-height: 0;
    aspect-ratio: auto;
  }

  @media (max-width: 800px) {
    .layout-tile cctv-stream-player {
      min-height: 160px;
    }
  }

  /* Live + playback: fit entire frame inside the tile (letterbox), never crop. */
  .layout-tile .playback-media,
  .layout-tile .tile-media > img.playback-media,
  .layout-tile .tile-media > video.playback-media {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    background: #0a0e13;
  }

  .layout-tile .tile-media > cctv-stream-player {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 0;
    align-self: stretch;
  }

  /*
   * During detection playback: border the camera that triggered the event in
   * the matching type color so attention lands there first.
   */
  .layout-tile.trigger-cam {
    z-index: 3;
    box-shadow:
      inset 0 0 0 3px var(--cctv-trigger-color, var(--cctv-accent)),
      0 0 0 1px rgba(0, 0, 0, 0.45);
  }

  .layout-tile.trigger-cam.kind-person {
    --cctv-trigger-color: #5eb1ff;
  }
  .layout-tile.trigger-cam.kind-car {
    --cctv-trigger-color: #f0b45a;
  }
  .layout-tile.trigger-cam.kind-animal {
    --cctv-trigger-color: #7dcf8a;
  }
  .layout-tile.trigger-cam.kind-package {
    --cctv-trigger-color: #c9a0ff;
  }
  .layout-tile.trigger-cam.kind-bicycle {
    --cctv-trigger-color: #67d5c8;
  }
  .layout-tile.trigger-cam.kind-motion {
    --cctv-trigger-color: #e6d36a;
  }
  .layout-tile.trigger-cam.kind-other {
    --cctv-trigger-color: #8b9aab;
  }

  .layout-1 .layout-tile cctv-stream-player {
    min-height: min(65vh, 640px);
  }

  /* Desktop: aspect-aware packed mosaic fills remaining viewport (no cam-to-cam scroll). */
  @media (min-width: 801px) {
    .panel-wrap .layout {
      min-height: 0;
    }

    .panel-wrap .layout-pack {
      position: relative;
      display: block;
      width: 100%;
      flex: 1 1 auto;
      min-height: 0;
    }

    .panel-wrap .layout-pack .pack-tile {
      position: absolute;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      overflow: hidden;
    }

    .panel-wrap .layout-pack .tile-media {
      flex: 1 1 auto;
      min-height: 0;
      height: 100%;
      /* Keep letterboxing visible when cam aspect ≠ packed cell. */
      background: #0a0e13;
    }

    .panel-wrap .layout-pack .pack-caption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      padding: 0.45rem 0.65rem 0.5rem;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
    }

    .panel-wrap .layout-pack .pack-caption .tile-meta {
      color: rgba(232, 238, 245, 0.82);
    }

    .panel-wrap .layout-pack cctv-stream-player {
      min-height: 0;
      height: 100%;
    }

    /* 1–2 cameras in TV mode: keep captions thinner so tiles use more of the stage. */
    .panel-wrap.tv-mode .layout-pack-maximize .pack-caption {
      padding: 0.3rem 0.55rem 0.35rem;
    }
  }

  /* Mobile: keep the previous stacked mosaic (unchanged from pre-fit behavior). */
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

  .timeline-kind {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .timeline-total {
    font-size: 0.72rem;
    color: var(--cctv-muted);
  }

  .timeline-board {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.35rem 0 0.15rem;
  }

  .timeline-ruler {
    position: relative;
    height: 1.35rem;
    margin-left: min(28%, 9.5rem);
  }

  .timeline-tick {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }

  .timeline-tick-line {
    width: 1px;
    height: 0.45rem;
    background: rgba(255, 255, 255, 0.18);
  }

  .timeline-tick-label {
    font-size: 0.68rem;
    color: var(--cctv-muted);
    white-space: nowrap;
  }

  .timeline-lanes {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .timeline-lane {
    display: grid;
    grid-template-columns: minmax(5.5rem, 28%) 1fr;
    gap: 0.65rem;
    align-items: center;
  }

  .timeline-lane-label {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .timeline-track {
    position: relative;
    height: 1.55rem;
    border-radius: 8px;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.04),
        rgba(255, 255, 255, 0.02)
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 1px,
        transparent 12.5%
      ),
      rgba(0, 0, 0, 0.28);
    overflow: hidden;
  }

  .timeline-event {
    appearance: none;
    position: absolute;
    top: 3px;
    bottom: 3px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 5px;
    background: transparent;
    cursor: pointer;
    min-width: 4px;
  }

  .timeline-event-mark {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--cctv-accent);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
    opacity: 0.92;
  }

  .timeline-event.kind-person .timeline-event-mark { background: #5eb1ff; }
  .timeline-event.kind-car .timeline-event-mark { background: #f0b45a; }
  .timeline-event.kind-animal .timeline-event-mark { background: #7dcf8a; }
  .timeline-event.kind-package .timeline-event-mark { background: #c9a0ff; }
  .timeline-event.kind-bicycle .timeline-event-mark { background: #67d5c8; }
  .timeline-event.kind-motion .timeline-event-mark { background: #e6d36a; }
  .timeline-event.kind-other .timeline-event-mark { background: #8b9aab; }

  .timeline-event:hover .timeline-event-mark,
  .timeline-event:focus-visible .timeline-event-mark {
    outline: 2px solid #fff;
    outline-offset: 1px;
    opacity: 1;
  }

  .timeline-event.selected .timeline-event-mark {
    outline: 2px solid #fff;
    outline-offset: 1px;
    filter: brightness(1.15);
  }

  .timeline-event.live .timeline-event-mark {
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .timeline-hint,
  .timeline-loading {
    margin: 0.55rem 0 0;
  }

  .timeline-detail {
    margin-top: 0.75rem;
    padding: 0.75rem 0.85rem;
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.22);
  }

  .timeline-detail-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    align-items: center;
    margin-bottom: 0.55rem;
  }

  .timeline-detail-actions {
    margin-left: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .timeline-live-badge {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--cctv-ok);
  }

  .timeline-detail-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem 0.85rem;
    margin: 0;
  }

  .timeline-detail-grid dt {
    color: var(--cctv-muted);
    font-size: 0.8rem;
  }

  .timeline-detail-grid dd {
    margin: 0;
    font-size: 0.9rem;
  }

  .timeline-detail-sensors {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .timeline-detail-sensors li {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
  }

  .timeline-error {
    color: var(--cctv-bad);
    font-size: 0.85rem;
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

  .kind-filter {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin: 0.35rem 0 0.75rem;
  }

  .kind-filter-title {
    font-size: 0.92rem;
  }

  .kind-filter-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.85rem;
  }

  .kind-filter-item {
    min-width: 7.5rem;
  }

  .settings-panel code {
    font-size: 0.8em;
  }

  .recording-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: center;
    justify-content: flex-end;
  }

  .recording-list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .recording-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.35rem 0.55rem;
    align-items: center;
    width: 100%;
    padding: 0.35rem 0.45rem 0.35rem 0.35rem;
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    background: transparent;
  }

  .recording-item:hover,
  .recording-item:focus-within {
    border-color: var(--cctv-accent);
  }

  .recording-item.active {
    border-color: var(--cctv-accent);
  }

  .recording-item.selected {
    border-color: var(--cctv-accent);
    background: rgba(61, 156, 240, 0.08);
  }

  .recording-select {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.35rem 0.85rem;
    align-items: center;
    width: 100%;
    min-width: 0;
    text-align: left;
    font: inherit;
    color: inherit;
    cursor: pointer;
    padding: 0.35rem 0.4rem;
    border: 0;
    border-radius: 6px;
    background: transparent;
  }

  .recording-select:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .recording-select:focus-visible {
    outline: 2px solid var(--cctv-accent);
    outline-offset: 1px;
  }

  .recording-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: center;
    justify-content: flex-end;
  }

  .recording-play {
    flex: 0 0 auto;
  }

  .recording-delete {
    flex: 0 0 auto;
    color: var(--cctv-bad);
    border-color: color-mix(in srgb, var(--cctv-bad) 45%, var(--cctv-border));
  }

  .recording-meta {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .recording-when {
    font-size: 0.92rem;
    font-weight: 600;
  }

  .recording-detected {
    font-size: 0.82rem;
    color: var(--cctv-muted);
  }

  .recording-size {
    font-size: 0.8rem;
    color: var(--cctv-muted);
    white-space: nowrap;
  }

  .playback-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem 0.85rem;
    align-items: center;
    margin: 0 0 0.75rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .playback-bar-meta {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
    flex: 1 1 180px;
  }

  .playback-bar-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .playback-media {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    background: #0a0e13;
    display: block;
  }

  .playback-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    color: var(--cctv-muted);
    font-size: 0.85rem;
  }

  @media (max-width: 800px) {
    .timeline-ruler {
      margin-left: 0;
      height: 1.5rem;
    }

    .timeline-lane {
      grid-template-columns: 1fr;
      gap: 0.3rem;
    }

    .recording-item {
      grid-template-columns: 1fr auto;
    }
  }

  ha-card {
    overflow: hidden;
  }

  .card-inner {
    padding: 0.25rem 0.25rem 0.75rem;
  }
`,lt=new Set(["unavailable","unknown","none",""]),dt=[{service:"turn_on",label:"Turn on",feature:1},{service:"turn_off",label:"Turn off",feature:1},{service:"toggle",label:"Toggle",feature:1},{service:"snapshot",label:"Snapshot"},{service:"enable_motion_detection",label:"Motion on",attr:"motion_detection",attrValue:!1},{service:"disable_motion_detection",label:"Motion off",attr:"motion_detection",attrValue:!0}];function ht(t,e){const i=e?.attributes??{};return{entityId:t,stateObj:e,state:e?.state??"unknown",name:i.friendly_name||t,brand:i.brand,model:i.model,frontendStreamType:i.frontend_stream_type,supportedFeatures:Number(i.supported_features||0),unavailable:!e||lt.has(String(e.state).trim().toLowerCase())}}function ut(t){return Boolean(2&t?.supportedFeatures)}async function pt(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/capabilities",entity_id:e})}catch{return null}}async function mt(t,e){if(!t?.callWS)return"";const i=await t.callWS({type:"camera/stream",entity_id:e}),s=i?.url||"";return s?"function"==typeof t.hassUrl?t.hassUrl(s):s:""}async function _t(t,e,i,s={}){if(!t?.callService)throw new Error("hass.callService is unavailable");return t.callService("camera",e,{entity_id:i,...s})}function gt(t,e){const i=t?.services?.camera||{},s=Number(e?.supportedFeatures||0),a=e?.stateObj?.attributes||{};return dt.filter(t=>{if(!i[t.service])return!1;if(null!=t.feature&&s&&0===(s&t.feature))return!1;if(t.attr){if(!(t.attr in a))return!1;if(null!=t.attrValue&&Boolean(a[t.attr])!==t.attrValue)return!1}return!0}).map(({service:t,label:e})=>({service:t,label:e}))}function ft(t,e){if(!e)return;const i=new Event("hass-more-info",{bubbles:!0,composed:!0});i.detail={entityId:e},t.dispatchEvent(i)}function yt(t){return t?Array.isArray(t)?t.map(String).map(t=>t.trim()).filter(Boolean):String(t).split(",").map(t=>t.trim()).filter(Boolean):[]}const vt=[{id:"person",label:"Person",tokens:["person","people","human","pedestrian","face"]},{id:"car",label:"Car",tokens:["car","vehicle","automobile","auto"]},{id:"animal",label:"Animal",tokens:["animal","pet","dog","cat","wildlife"]},{id:"package",label:"Package",tokens:["package","parcel","delivery","amazon"]},{id:"bicycle",label:"Bicycle",tokens:["bicycle","bike","cyclist"]},{id:"motion",label:"Motion",tokens:["motion","occupancy","presence","moving"]},{id:"other",label:"Other",tokens:["detection","object","zone"]}],bt=new Set(["binary_sensor","sensor"]),kt=new Set(["on","true","detected","active","1","home"]);function wt(t,e){return e.some(e=>new RegExp(`(^|[_\\s.-])${e}([_\\s.-]|$)`,"i").test(t))}function $t(t,e){const i=`${t} ${e?.attributes?.friendly_name||""}`.toLowerCase();for(const t of vt)if("other"!==t.id&&wt(i,t.tokens))return{id:t.id,label:t.label};return{id:"other",label:"Other"}}function St(t){if(!t)return!1;const e=String(t.state??"").trim().toLowerCase();if(kt.has(e))return!0;const i=Number(e);return Number.isFinite(i)&&i>0}function xt(t,e,i){const s=String(t||"").replace(/^camera\./i,"").replace(/_(main|hi|high|primary)$/i,"").toLowerCase();if(!s)return 0;const a=String(e).toLowerCase(),n=String(i?.attributes?.friendly_name||"").toLowerCase(),r=`${a} ${n}`;let o=0;const c=a.replace(/^(binary_sensor|sensor)\./,"");if(c===s||c.startsWith(`${s}_`)?o+=50:c.includes(s)&&(o+=25),n.includes(s.replace(/_/g," "))&&(o+=15),o<=0)return 0;let l=o;return"other"!==$t(e,i).id?l+=20:wt(r,["detection","object","zone","motion","occupancy"])&&(l+=8),a.startsWith("binary_sensor.")&&(l+=5),l}function At(t,e,i={}){const s=t?.states||{},a=i.limit??24,n=i.deviceIds,r=n?.get(e),o=[];for(const[t,i]of Object.entries(s)){const s=t.split(".")[0];if(!bt.has(s))continue;let a=xt(e,t,i);if(r&&n?.get(t)===r&&(a+=40),a<20)continue;const c=$t(t,i);o.push({entityId:t,name:i?.attributes?.friendly_name||t,kind:c,score:a,state:String(i?.state??"unknown"),active:St(i)})}return o.sort((t,e)=>e.score-t.score||t.name.localeCompare(e.name)),o.slice(0,a)}function Ct(t){if(!t||"object"!=typeof t||Array.isArray(t))return{};const e={};for(const[i,s]of Object.entries(t))String(i).startsWith("camera.")&&Array.isArray(s)&&(e[i]=[...new Set(s.map(String).filter(t=>bt.has(t.split(".")[0])))].slice(0,16));return e}function Mt(t){return{start:t.start,end:t.end,cameras:[...t.cameras||[]],sensors:[...t.sensors||[]]}}function Pt(t,e){const i=new Set(t.cameras);for(const t of e.cameras||[])i.add(t);t.cameras=[...i];const s=new Map((t.sensors||[]).map(t=>[t.entityId,t]));for(const t of e.sensors||[])t?.entityId&&s.set(t.entityId,t);t.sensors=[...s.values()]}function It(t){const e=Math.max(0,Math.round(t/1e3));if(e<60)return`${e}s`;const i=Math.floor(e/60),s=e%60;if(i<60)return s?`${i}m ${s}s`:`${i}m`;const a=Math.floor(i/60),n=i%60;return n?`${a}h ${n}m`:`${a}h`}function Et(t){try{return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return""}}const Dt=[{value:"auto",label:"Auto",help:"High for detail, prefer low/substream in the mosaic when available."},{value:"high",label:"High",help:"Main camera entity; prefer WebRTC/HLS."},{value:"balanced",label:"Balanced",help:"Main entity; prefer HA native / WebRTC, then HLS/MJPEG."},{value:"low",label:"Low",help:"Substream entity when available, else MJPEG on the main camera."}],Nt=["_sub","_lq","_low","_fluent","_sd","_substream"],Rt="cctv-dashboard:quality:",Tt=new Set(Dt.map(t=>t.value));function Ot(t){const e=String(t||"auto").toLowerCase();return Tt.has(e)?e:"auto"}function Lt(t){if(!t||"object"!=typeof t)return{};const e={};for(const[i,s]of Object.entries(t)){if(!String(i).startsWith("camera."))continue;const t=Ot(s);"auto"!==t&&(e[i]=t)}return e}function qt(t,e){const i=t?.camera_settings||t?.cameras_settings||{},s=i?.[e]||i?.[e?.toLowerCase?.()]||{},a={};return t?.entity&&t.entity===e&&(t.low_entity&&(a.low_entity=t.low_entity),t.high_entity&&(a.high_entity=t.high_entity),t.substream_entity&&(a.substream_entity=t.substream_entity),t.main_entity&&(a.main_entity=t.main_entity)),{...a,...s}}function jt(t,e){try{localStorage.setItem(Rt+t,Ot(e))}catch{}}function Ht(t,e,i=null){if(i){const t=i[e];if(t)return Ot(t)}else{const t=function(t){try{const e=localStorage.getItem(Rt+t);return e?Ot(e):null}catch{return null}}(e);if(t)return t}const s=qt(t,e);return s.quality?Ot(s.quality):t?.quality?Ot(t.quality):"auto"}function Ut(t,e,i,s,a="mosaic"){const n=Ot(s),r=qt(i,e.entityId),o=t?.states||{},c=r.high_entity||r.main_entity||e.entityId,l=r.low_entity||r.substream_entity||function(t,e,i){const s=t?.states||{},a=e.replace(/^camera\./,"");for(const t of i){const e=`camera.${a}${t}`;if(s[e])return e;const i=`camera.${a.replace(/_main$/,"")}${t}`;if(i!==e&&s[i])return i}return""}(t,e.entityId,Nt)||"";let d=e.entityId;return d="high"===n?c:"low"===n?l||c:"auto"===n&&"mosaic"===a&&l?l:c,o[d]||(d=e.entityId),ht(d,o[d])}function zt(t){return Dt.find(e=>e.value===Ot(t))?.help||""}const Wt=16/9,Vt=[{value:"auto",label:"Auto (detect)",ratio:null},{value:"16:9",label:"16:9 landscape",ratio:16/9},{value:"9:16",label:"9:16 portrait",ratio:9/16},{value:"4:3",label:"4:3 landscape",ratio:4/3},{value:"3:4",label:"3:4 portrait",ratio:3/4},{value:"1:1",label:"1:1 square",ratio:1},{value:"3:2",label:"3:2 landscape",ratio:1.5},{value:"2:3",label:"2:3 portrait",ratio:2/3},{value:"custom",label:"Custom W:H…",ratio:null}],Ft=/^(\d+(?:\.\d+)?)[:x×*](\d+(?:\.\d+)?)$/i;function Bt(t){let e=String(t||"").trim().toLowerCase().replace(/\s+/g,"").replace(/×/g,"x").replace(/\*/g,"x");if(!e||"auto"===e||"default"===e||"none"===e||"custom"===e)return"auto";if(Vt.some(t=>t.value===e&&"custom"!==t.value))return e;const i=Ft.exec(e);if(!i)return"auto";const s=Number(i[1]),a=Number(i[2]);return!Number.isFinite(s)||!Number.isFinite(a)||s<=0||a<=0||s/a<.05||s/a>20?"auto":Number.isInteger(s)&&Number.isInteger(a)?`${s}:${a}`:`${Number(s.toPrecision(12))}:${Number(a.toPrecision(12))}`}function Qt(t){const e=Bt(t);if("auto"===e)return null;const i=Vt.find(t=>t.value===e);if(i?.ratio)return i.ratio;const[s,a]=e.split(":").map(Number);return!Number.isFinite(s)||!Number.isFinite(a)||s<=0||a<=0?null:s/a}function Kt(t){const e=Bt(t);return"auto"===e||Vt.some(t=>t.value===e&&"custom"!==t.value)}function Gt(t){if(!t||"object"!=typeof t)return{};const e={};for(const[i,s]of Object.entries(t)){if(!String(i).startsWith("camera."))continue;const t=Bt(s);"auto"!==t&&(e[i]=t)}return e}function Jt(t){const e=Number(t);return!Number.isFinite(e)||e<=.05||e>20?Wt:e}function Zt(t,e,i,s){if(!t.length||e<=0||i<=0)return null;const a=Math.max(0,t.length-1)*s,n=i-a;if(n<=0)return null;const r=t.map(t=>{const i=t.reduce((t,e)=>t+e.aspect,0),a=Math.max(0,t.length-1)*s,n=e-a;return i<=0||n<=0?0:n/i});if(r.some(t=>t<=0))return null;const o=r.reduce((t,e)=>t+e,0),c=Math.min(1,n/o),l=r.map(t=>t*c),d=[];let h=(i-(l.reduce((t,e)=>t+e,0)+a))/2;t.forEach((t,i)=>{const a=l[i],n=t.map(t=>t.aspect*a),r=n.reduce((t,e)=>t+e,0)+Math.max(0,t.length-1)*s;let o=(e-r)/2;t.forEach((t,e)=>{d.push({id:t.id,left:o,top:h,width:n[e],height:a,aspect:t.aspect}),o+=n[e]+s}),h+=a+s});const u=d.reduce((t,e)=>t+e.width*e.height,0);return{cells:d,totalArea:u}}function Xt(t,e,i,s){const a=t.map(t=>t.map(t=>({id:t.id,aspect:1/t.aspect}))),n=Zt(a,i,e,s);return n?{totalArea:n.totalArea,cells:n.cells.map(t=>({id:t.id,left:t.top,top:t.left,width:t.height,height:t.width,aspect:1/t.aspect}))}:null}async function Yt(t){if(!t?.callWS)return null;try{const e=await t.callWS({type:"cctv_dashboard/get_settings"});return e&&"object"==typeof e?{...e,sensorLinks:Ct(e.sensor_links||{}),forceAspect:Gt(e.force_aspect||{}),cameraQuality:Lt(e.camera_quality||{})}:null}catch(t){return console.warn("CCTV: failed to load shared config",t),null}}async function te(t,e){if(!t?.callWS)return null;const i=Ct(e);return t.callWS({type:"cctv_dashboard/set_sensor_links",sensor_links:i})}async function ee(t,e){return t?.callWS?t.callWS({type:"cctv_dashboard/set_settings",...e}):null}async function ie(t,e=40){if(!t?.callWS)return[];try{const i=await t.callWS({type:"cctv_dashboard/list_recordings",limit:e});return i?.sessions||[]}catch(t){return console.warn("CCTV: failed to list recordings",t),[]}}function se(t,e){return e?"function"==typeof t?.hassUrl?t.hassUrl(e):e:""}function ae(t){if(!t)return"";let e=String(t);try{/^https?:\/\//i.test(e)&&(e=new URL(e).pathname)}catch{}e=e.split("?")[0].split("#")[0],e.startsWith("/")||(e=`/${e}`);const i="/cctv_dashboard_recordings/";if(e.startsWith(i)){const t=e.slice(27).split("/").pop();t&&(e=`/api/cctv_dashboard/media/${t}`)}return e}async function ne(t,e,i=3600){if(!e)return"";const s=ae(e);if(!s)return"";if(!t?.callWS)throw new Error("Home Assistant WebSocket unavailable for auth/sign_path");const a=await t.callWS({type:"auth/sign_path",path:s,expires:i}),n=a?.path;if("string"!=typeof n||!n.includes("authSig"))throw new Error(`auth/sign_path returned no authSig for ${s}`);return"function"==typeof t.hassUrl?t.hassUrl(n):n}const re={person:"#5eb1ff",car:"#f0b45a",animal:"#7dcf8a",package:"#c9a0ff",bicycle:"#67d5c8",motion:"#e6d36a",other:"#8b9aab"};function oe(t){const e=String(t||"").toLowerCase();return re[e]||re.other}function ce(t,e){const i=new Set((e||[]).map(String).filter(Boolean));if(!i.size)return[];const s=[];for(const[e,a]of Object.entries(t||{}))String(e).startsWith("camera.")&&(a||[]).some(t=>i.has(String(t)))&&s.push(e);return s}function le(t,e,i,s=null){const a={},n=(t,e)=>{const i=String(t||"");if(!i.startsWith("camera.")||a[i])return;const s=String(e||"other").toLowerCase();a[i]={kindId:s,color:oe(s)}},r=s?.kind?.id;if(r&&Array.isArray(s?.cameras))for(const t of s.cameras)n(t,r);const o=[...e?.trigger_sensors||[],...(s?.sensors||[]).map(t=>t?.entityId).filter(Boolean)];for(const e of o){const s=$t(e,t?.states?.[e]);for(const t of ce(i,[e]))n(t,s.id)}return a}function de(t){const e=Number(t)||0;return e<1024?`${e} B`:e<1048576?`${(e/1024).toFixed(e<10240?1:0)} KB`:e<1073741824?`${(e/1048576).toFixed(e<10485760?1:0)} MB`:`${(e/1073741824).toFixed(1)} GB`}function he(t,e){const i=[],s=new Set;for(const a of e||[]){const e=t?.states?.[a],n=$t(a,e);s.has(n.id)||(s.add(n.id),i.push(n.label))}return i.length?i:["Detection"]}function ue(t){return Number.isFinite(t?.total_bytes)?Number(t.total_bytes):(t?.clips||[]).reduce((t,e)=>t+(Number(e.size)||0),0)}function pe(t){if(null==t||""===t)return NaN;if("number"==typeof t)return Number.isFinite(t)?t:NaN;if(t instanceof Date)return t.getTime();const e=String(t).trim(),i=e.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/i);if(i){const t=`${i[1]}-${i[2]}-${i[3]}T${i[4]}:${i[5]}:${i[6]}Z`;return Date.parse(t)}return Date.parse(e)}function me(t){return!!t&&(!("size"in(t||{})&&Number(t.size)<=0)&&("snapshot"===t.kind||(Number(t.size)>0||!("size"in(t||{})))))}function _e(t){return!(!t||t.active)&&(ue(t)>0||(t.clips||[]).some(me))}function ge(t){const e=String(t?.camera_id||"").trim();if(e.startsWith("camera."))return e;const i=String(t?.path||t?.url||"").split("?")[0].split("/").pop();if(!i)return"";const s=i.match(/^(\d{8}T\d{6}Z_[a-f0-9]{8})_(.+)_(\d{3})_(\d{8}T\d{6}Z)\.(?:mp4|jpg|jpeg|webp)$/i);return s?`camera.${s[2]}`:""}function fe(t){const e=new Map;for(const i of t?.clips||[]){const t=ge(i);t&&!e.get(t)&&(me(i)&&e.set(t,!0))}const i=Array.isArray(t?.cameras)?t.cameras.map(String).filter(t=>e.has(t)):[];if(i.length){for(const t of e.keys())i.includes(t)||i.push(t);return i}return[...e.keys()]}function ye(t,e,i=null){const s=new Map;for(const t of e?.clips||[]){const e=ge(t);e&&(s.has(e)||s.set(e,[]),s.get(e).push(t))}let a;if(i&&i.length)a=i.map(String);else{const i=fe(e);a=i.length?i:[...s.keys()].sort((e,i)=>{const s=t?.states?.[e]?.attributes?.friendly_name||e.replace(/^camera\./,""),a=t?.states?.[i]?.attributes?.friendly_name||i.replace(/^camera\./,"");return s.localeCompare(a)})}return a.map(e=>{const i=[...s.get(e)||[]].sort((t,e)=>Number(t.seq||0)-Number(e.seq||0));return{cameraId:e,name:t?.states?.[e]?.attributes?.friendly_name||e.replace(/^camera\./,""),items:i.filter(me).map(e=>{const i=function(t){const e=pe(t?.started),i=Number(t?.duration),s=Number.isFinite(i)&&i>0?1e3*i:3e4;return{start:e,end:Number.isFinite(e)?e+s:NaN,durationMs:s}}(e),s=String(e.url||"");return{path:s,url:se(t,s),kind:"snapshot"===e.kind?"snapshot":"video",size:Number(e.size)||0,seq:Number(e.seq)||0,started:e.started,startedMs:i.start,durationMs:i.durationMs,endMs:i.end}})}})}function ve(t,e){const i=t?.items||[];if(!i.length||!Number.isFinite(e))return{index:0,seekSec:0};for(let t=0;t<i.length;t+=1){const s=i[t],a=Number(s.startedMs),n=Number(s.endMs);if(Number.isFinite(a)){if(e<a)return{index:t,seekSec:0};if(!Number.isFinite(n)||e<n){return{index:t,seekSec:Math.max(0,(e-a)/1e3)}}}}return{index:Math.max(0,i.length-1),seekSec:0}}const be="cctv_dashboard";async function ke(t){if(!t?.callWS)return null;try{const e=await t.callWS({type:"frontend/get_user_data",key:be}),i=e?.value??e;if(!i||"object"!=typeof i)return null;const s=Array.isArray(i.selectedCameras)?i.selectedCameras.map(String).filter(t=>t.startsWith("camera.")):[];return{selectedCameras:s,legacySensorLinks:i.sensorLinks&&"object"==typeof i.sensorLinks?i.sensorLinks:null}}catch(t){return console.warn("CCTV: failed to load panel user data",t),null}}async function we(t,e,i={}){if(!t?.callWS)return;const s=[...new Set(e.map(String).filter(t=>t.startsWith("camera.")))].slice(0,4),a={selectedCameras:s};i.clearLegacySensorLinks;try{await t.callWS({type:"frontend/set_user_data",key:be,value:a})}catch(t){throw console.warn("CCTV: failed to save panel selection",t),t}return{selectedCameras:s}}const $e=100,Se=50;const xe=new class{constructor(t=4){this.max=t,this.holders=new Map,this.queue=[]}setMax(t){const e=Math.max(1,Number(t)||4);if(e!==this.max)for(this.max=e,this._drain();this.holders.size>this.max;)this._revokeLowest()}activeCount(){return this.holders.size}has(t){return this.holders.has(t)}request(t,e,{onGrant:i,onRevoke:s}){if(!t)return!1;if(this.holders.has(t)){const i=this.holders.get(t);return i.priority=e,i.onRevoke=s,this.queue=this.queue.filter(e=>e.id!==t),!0}const a=this.queue.find(e=>e.id===t);if(a)return a.priority=e,a.onGrant=i,a.onRevoke=s,this._drain(),this.holders.has(t);if(this.holders.size<this.max)return this.holders.set(t,{priority:e,onRevoke:s}),!0;const n=this._lowestHolder();return n&&e>n.priority?(this._revoke(n.id),this.holders.set(t,{priority:e,onRevoke:s}),!0):(this.queue.push({id:t,priority:e,onGrant:i,onRevoke:s}),this.queue.sort((t,e)=>e.priority-t.priority),!1)}release(t){t&&(this.queue=this.queue.filter(e=>e.id!==t),this.holders.has(t)&&(this.holders.delete(t),this._drain()))}releaseAll(){this.holders.clear(),this.queue=[]}_lowestHolder(){let t=null;for(const[e,i]of this.holders)(!t||i.priority<t.priority)&&(t={id:e,priority:i.priority});return t}_revoke(t){const e=this.holders.get(t);if(e){this.holders.delete(t);try{e.onRevoke?.()}catch(t){console.warn("CCTV stream slot revoke failed",t)}}}_revokeLowest(){const t=this._lowestHolder();t&&this._revoke(t.id)}_drain(){for(;this.holders.size<this.max&&this.queue.length;){const t=this.queue.shift();this.holders.set(t.id,{priority:t.priority,onRevoke:t.onRevoke});try{t.onGrant?.()}catch(e){console.warn("CCTV stream slot grant failed",e),this.holders.delete(t.id)}}}}(4),Ae="cctv_dashboard:tv_mode",Ce=16/9;function Me(t=("undefined"!=typeof document?document:null)){let e=56,i=0;try{const s=t?.documentElement;if(s){const t=getComputedStyle(s);e=parseFloat(t.getPropertyValue("--app-header-height"))||e,i=parseFloat(t.getPropertyValue("--cctv-kiosk-inset"))||0}}catch{}return Math.max(0,e+0+0+i+56+12)}function Pe(t){if(!t||"number"!=typeof t.clientWidth)return 0;let e=0;try{if("function"==typeof getComputedStyle){const i=getComputedStyle(t);e=(parseFloat(i.paddingLeft)||0)+(parseFloat(i.paddingRight)||0)}}catch{}return Math.max(0,t.clientWidth-e)}class Ie extends rt{static properties={hass:{attribute:!1},camera:{attribute:!1},config:{attribute:!1},quality:{type:String},context:{type:String},muted:{type:Boolean},controls:{type:Boolean},large:{type:Boolean,reflect:!0},mosaic:{type:Boolean,reflect:!0},eager:{type:Boolean},posterOnly:{type:Boolean,attribute:"poster-only"},active:{type:Boolean},_mode:{state:!0},_error:{state:!0},_hlsUrl:{state:!0},_mjpegUrl:{state:!0},_stillUrl:{state:!0},_visible:{state:!0},_slotHeld:{state:!0},_queued:{state:!0},_tileAspect:{state:!0}};static styles=n`
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
      object-position: center;
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

    /*
     * Mosaic tiles (mixed landscape + doorbell/portrait): always letterbox /
     * pillarbox so the full frame stays visible — never crop with cover.
     */
    :host([large][mosaic]) {
      background: #0a0e13;
    }

    :host([large][mosaic]) .media,
    :host([large][mosaic]) ha-camera-stream,
    :host([large][mosaic]) video,
    :host([large][mosaic]) img {
      min-height: 0;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
    }

    /* HA host is a custom element — force it to fill the tile box. */
    :host([large][mosaic]) ha-camera-stream {
      display: block;
      overflow: hidden;
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
  `;constructor(){super(),this.config={},this.quality="",this.context="mosaic",this.muted=!0,this.controls=!1,this.large=!1,this.mosaic=!1,this.eager=!1,this.posterOnly=!1,this.active=!0,this._mode="loading",this._error="",this._hlsUrl="",this._mjpegUrl="",this._stillUrl="",this._visible=!1,this._slotHeld=!1,this._queued=!1,this._pc=null,this._unsubWebRtc=null,this._sessionId=null,this._startToken=0,this._observer=null,this._hostRo=null,this._slotId="",this._streamCamera=null,this._stableStateObj=null,this._tileAspect=0,this._lastEmittedAspect=0}connectedCallback(){super.connectedCallback(),this._bindObserver(),this._bindHostResize(),this._bindDocumentVisibility(),this.active?this._reconcilePlayback():this._unloadCompletely()}disconnectedCallback(){super.disconnectedCallback(),this._unbindObserver(),this._unbindHostResize(),this._unbindDocumentVisibility(),this._unloadCompletely()}_bindDocumentVisibility(){this._unbindDocumentVisibility(),"undefined"!=typeof document&&(this._onDocVisibility=()=>{this.active&&this._reconcilePlayback()},document.addEventListener("visibilitychange",this._onDocVisibility))}_unbindDocumentVisibility(){this._onDocVisibility&&"undefined"!=typeof document&&document.removeEventListener("visibilitychange",this._onDocVisibility),this._onDocVisibility=null}shouldUpdate(t){for(const e of t.keys()){if(e.startsWith("_"))return!0;if(!["hass","camera","config"].includes(e))return!0}return!(!t.has("hass")||!this._cameraHassChanged(t.get("hass"),this.hass))||(!(!t.has("camera")||!this._cameraMeaningful(t.get("camera"),this.camera))||!(!t.has("config")||!this._configMeaningful(t.get("config"),this.config)))}updated(t){if((t.has("eager")||t.has("posterOnly"))&&this._bindObserver(),(t.has("large")||t.has("mosaic"))&&this._bindHostResize(),t.has("active")&&!this.active)return void this._unloadCompletely();const e=t.has("hass")&&this._cameraHassChanged(t.get("hass"),this.hass),i=t.has("camera")&&this._cameraMeaningful(t.get("camera"),this.camera),s=t.has("config")&&this._configMeaningful(t.get("config"),this.config);if((e||i||s||t.has("quality")||t.has("context")||t.has("eager")||t.has("posterOnly")||t.has("active")&&this.active)&&this._reconcilePlayback(),t.has("muted")){const t=this.renderRoot?.querySelector("video");t&&(t.muted=this.muted)}(t.has("_mode")||i||t.has("_tileAspect"))&&this.updateComplete.then(()=>{this._probeMediaSize(),this._forceNestedContain()})}_cameraHassChanged(t,e){const i=this._streamCamera?.entityId||this.camera?.entityId;if(!i)return!0;const s=t?.states?.[i],a=e?.states?.[i];if(s===a)return!1;if(!s||!a)return!0;const n=t=>!t||["unavailable","unknown"].includes(String(t.state).trim().toLowerCase());return n(s)!==n(a)||s.attributes?.access_token!==a.attributes?.access_token}_cameraMeaningful(t,e){return t!==e&&(!t||!e||(t.entityId!==e.entityId||Boolean(t.unavailable)!==Boolean(e.unavailable)||t.stateObj?.attributes?.access_token!==e.stateObj?.attributes?.access_token))}_configMeaningful(t,e){return t!==e&&(!t||!e||(t.max_streams!==e.max_streams||t.quality!==e.quality||JSON.stringify(t.camera_settings||null)!==JSON.stringify(e.camera_settings||null)||JSON.stringify(t.cameras_settings||null)!==JSON.stringify(e.cameras_settings||null)))}_bindHostResize(){this._unbindHostResize(),this._updateTileAspect(),"undefined"!=typeof ResizeObserver&&(this._hostRo=new ResizeObserver(()=>this._updateTileAspect()),this._hostRo.observe(this))}_unbindHostResize(){this._hostRo&&(this._hostRo.disconnect(),this._hostRo=null)}_updateTileAspect(){const t=this.clientWidth,e=this.clientHeight;if(!Number.isFinite(t)||!Number.isFinite(e)||t<2||e<2)return;const i=t/e;this._tileAspect&&Math.abs(this._tileAspect-i)<.005||(this._tileAspect=i)}_forceNestedContain(){if(!this.mosaic&&!this.large||"ha"!==this._mode)return;const t=this.renderRoot?.querySelector("ha-camera-stream"),e=t?.shadowRoot;e&&e.querySelectorAll("video, img").forEach(t=>{t.style.objectFit="contain",t.style.objectPosition="center",t.style.width="100%",t.style.height="100%",t.style.maxWidth="100%",t.style.maxHeight="100%"})}get _effectiveQuality(){return this.quality?this.quality:Ht(this.config,this.camera?.entityId)}get _priority(){return this.eager?$e:Se}_bindObserver(){this._unbindObserver(),this.eager||this.posterOnly?this._visible=!0:"undefined"!=typeof IntersectionObserver?(this._observer=new IntersectionObserver(t=>{const e=t.some(t=>t.isIntersecting);e!==this._visible&&(this._visible=e,this._reconcilePlayback())},{root:null,rootMargin:"120px 0px",threshold:.15}),this._observer.observe(this)):this._visible=!0}_unbindObserver(){this._observer&&(this._observer.disconnect(),this._observer=null)}_wantsLive(){return!!this.active&&(("undefined"==typeof document||!document.hidden)&&(!this.posterOnly&&(!!this.eager||this._visible)))}_refreshPosterUrls(t,{cacheBust:e=!1}={}){const i=t||this.camera;if(!this.hass||!i?.stateObj)return this._stillUrl="",void(this._mjpegUrl="");const s=function(t,e,i=!0){if(!t||!e?.stateObj)return"";const s=e.stateObj.attributes||{};let a=s.entity_picture;if(!a&&s.access_token&&(a=`/api/camera_proxy/${e.entityId}?token=${s.access_token}`),!a)return"";const n="function"==typeof t.hassUrl?t.hassUrl(a):a;if(!i)return n;const r=n.includes("?")?"&":"?";return`${n}${r}t=${Date.now()}`}(this.hass,i,e),a=function(t,e){const i=e?.stateObj?.attributes?.access_token;if(!t||!e?.entityId||!i)return"";const s=`/api/camera_proxy_stream/${e.entityId}?token=${i}`;return"function"==typeof t.hassUrl?t.hassUrl(s):s}(this.hass,i);this._stillUrl!==s&&(this._stillUrl=s),this._mjpegUrl!==a&&(this._mjpegUrl=a)}_syncStableStreamCamera(t){const e=t?.stateObj||null,i=this._stableStateObj,s=t=>!t||["unavailable","unknown"].includes(String(t.state).trim().toLowerCase());!i||!e||i.entity_id!==e.entity_id||i.attributes?.access_token!==e.attributes?.access_token||s(i)!==s(e)?(this._stableStateObj=e,this._streamCamera=t):this._streamCamera||(this._streamCamera=t)}_clearMediaElements(){const t=this.renderRoot;t&&(t.querySelectorAll("video").forEach(t=>{try{t.pause?.();const e=t.srcObject;e&&"function"==typeof e.getTracks&&e.getTracks().forEach(t=>{try{t.stop()}catch{}}),t.srcObject=null,t.removeAttribute("src"),t.load?.()}catch{}}),t.querySelectorAll("img.media").forEach(t=>{try{t.removeAttribute("src"),t.src=""}catch{}}))}_stopLive(){if(this._startToken+=1,this._unsubWebRtc){try{this._unsubWebRtc()}catch{}this._unsubWebRtc=null}if(this._pc){try{this._pc.getSenders?.().forEach(t=>{try{t.track?.stop?.()}catch{}}),this._pc.getReceivers?.().forEach(t=>{try{t.track?.stop?.()}catch{}}),this._pc.close()}catch{}this._pc=null}this._sessionId=null,this._hlsUrl="",this._clearMediaElements()}_releaseSlot(){this._slotId&&xe.release(this._slotId),this._slotHeld=!1,this._queued=!1}_unloadCompletely(){this._releaseSlot(),this._stopLive(),this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",this._playKey="",this._idleReason="suspended",this._queued=!1,this._stableStateObj=null,this._streamCamera=null}_showIdle(t="idle"){if(this._stopLive(),!this.active||"undefined"!=typeof document&&document.hidden)return this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",void(this._idleReason=t);this._refreshPosterUrls(this._streamCamera||this.camera,{cacheBust:!0}),this.hass&&this.camera?.stateObj?(this._mode=this._stillUrl?"still":"empty",this._error=this._stillUrl?"":"No preview",this._idleReason=t):this._mode="empty"}_reconcilePlayback(){if(!this.active||"undefined"!=typeof document&&document.hidden)return void this._unloadCompletely();const t=Number(this.config?.max_streams);if(Number.isFinite(t)&&t>0&&xe.setMax(t),!this.hass||!this.camera?.stateObj)return this._releaseSlot(),this._stopLive(),this._mode="empty",this._playKey="",void(this._stableStateObj=null);const e=Ut(this.hass,this.camera,this.config,this._effectiveQuality,this.context);this._syncStableStreamCamera(e);const i=this._streamCamera?.entityId||this.camera.entityId;this._slotId&&i&&this._slotId!==i&&(xe.release(this._slotId),this._slotHeld=!1,this._queued=!1,this._playKey=""),this._slotId=i;const s=this._wantsLive(),a=[s?"live":"idle",this._slotId,this._effectiveQuality,this.context,this.eager?"eager":"lazy"].join("|");if(!s)return this._releaseSlot(),this._showIdle("idle"),void(this._playKey=a);if(this._slotHeld&&this._playKey===a&&"loading"!==this._mode&&"empty"!==this._mode&&("still"!==this._mode||!this._queued))return;this._refreshPosterUrls(this._streamCamera,{cacheBust:!1});const n=()=>{this._slotHeld=!0,this._queued=!1,this._playKey=a,this._startLive()},r=()=>{if(this._slotHeld=!1,this._queued=this._wantsLive(),this._playKey="",this._showIdle("queued"),this._wantsLive()){xe.request(this._slotId,this._priority,{onGrant:n,onRevoke:r})&&n()}};xe.request(this._slotId,this._priority,{onGrant:n,onRevoke:r})?n():(this._slotHeld=!1,this._queued=!0,this._playKey=a,this._showIdle("queued"))}async _startLive(){this._stopLive();const t=this._startToken;this._error="",this._mode="loading",this._idleReason="";const e=this._streamCamera||this.camera;this._refreshPosterUrls(e,{cacheBust:!1});const i=function(t,e="mosaic"){const i=Ot(t);return"low"===i?["mjpeg","ha","webrtc","hls"]:"high"===i?["webrtc","ha","hls","mjpeg"]:"balanced"===i?["ha","webrtc","hls","mjpeg"]:"mosaic"===e?["mjpeg","ha","webrtc","hls"]:["webrtc","ha","hls","mjpeg"]}(this._effectiveQuality,this.context);for(const s of i){if(t!==this._startToken||!this._slotHeld)return;if("ha"===s&&customElements.get("ha-camera-stream"))return void(this._mode="ha");if("webrtc"===s&&"undefined"!=typeof RTCPeerConnection){const i=await pt(this.hass,e.entityId);if(t!==this._startToken||!this._slotHeld)return;const s=i?.frontend_stream_types||[],a=e.frontendStreamType;if(s.includes("web_rtc")||"web_rtc"===a||ut(e)||!s.length)try{if(await this._startWebRtc(t,e),t!==this._startToken||!this._slotHeld)return;return void(this._mode="webrtc")}catch(t){console.warn("CCTV WebRTC failed, falling back",t)}}if("hls"===s)try{const i=await mt(this.hass,e.entityId);if(t!==this._startToken||!this._slotHeld)return;if(i&&this._canPlayHlsNatively())return this._hlsUrl=i,void(this._mode="hls")}catch(t){console.warn("CCTV HLS failed, falling back",t)}if("mjpeg"===s&&this._mjpegUrl)return void(this._mode="mjpeg")}this._mode=this._stillUrl?"still":"empty",this._stillUrl||(this._error="No stream or preview available")}_canPlayHlsNatively(){const t=document.createElement("video");return""!==t.canPlayType("application/vnd.apple.mpegurl")||""!==t.canPlayType("application/x-mpegURL")}async _startWebRtc(t,e){const i=await async function(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/webrtc/get_client_config",entity_id:e})}catch{return null}}(this.hass,e.entityId)||{};if(t!==this._startToken)return;const s=new RTCPeerConnection(i.configuration||{});this._pc=s,s.addTransceiver("video",{direction:"recvonly"});try{s.addTransceiver("audio",{direction:"recvonly"})}catch{}s.ontrack=t=>{const e=this.renderRoot?.querySelector("video#webrtc");if(!e)return;const[i]=t.streams;e.srcObject=i||new MediaStream([t.track]),e.muted=this.muted,e.play?.().catch(()=>{})},s.onicecandidate=t=>{t.candidate&&this._sessionId&&async function(t,e,i,s){t?.callWS&&await t.callWS({type:"camera/webrtc/candidate",entity_id:e,session_id:i,candidate:s})}(this.hass,e.entityId,this._sessionId,t.candidate.toJSON()).catch(()=>{})};const a=await s.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});await s.setLocalDescription(a),this._unsubWebRtc=await function(t,e,i,s){if(!t?.connection?.subscribeMessage)throw new Error("WebSocket connection unavailable");return t.connection.subscribeMessage(s,{type:"camera/webrtc/offer",entity_id:e,offer:i})}(this.hass,e.entityId,a.sdp,async e=>{if(t===this._startToken&&this._pc)if("session"!==e.type)if("answer"!==e.type)if("candidate"===e.type&&e.candidate)try{await this._pc.addIceCandidate(e.candidate)}catch{}else"error"===e.type&&(this._error=e.message||e.code||"WebRTC error",this._mode=this._mjpegUrl?"mjpeg":this._stillUrl?"still":"empty");else await this._pc.setRemoteDescription({type:"answer",sdp:e.answer});else this._sessionId=e.session_id})}_emitMediaAspect(t,e){const i=this.camera?.entityId,s=Number(t),a=Number(e);if(!i||!Number.isFinite(s)||!Number.isFinite(a)||s<=0||a<=0)return;const n=s/a;this._lastEmittedAspect&&Math.abs(this._lastEmittedAspect-n)<.01||(this._lastEmittedAspect=n,this.dispatchEvent(new CustomEvent("cctv-media-aspect",{detail:{entityId:i,width:s,height:a,aspect:n},bubbles:!0,composed:!0})))}_probeMediaSize(){const t=this.renderRoot;if(!t)return;const e=t.querySelector("video");if(e)return void(e.videoWidth&&e.videoHeight&&this._emitMediaAspect(e.videoWidth,e.videoHeight));const i=t.querySelector("img.media");if(i&&i.naturalWidth&&i.naturalHeight)return void this._emitMediaAspect(i.naturalWidth,i.naturalHeight);const s=t.querySelector("ha-camera-stream"),a=s?.shadowRoot?.querySelector?.("video");if(a?.videoWidth&&a?.videoHeight)return void this._emitMediaAspect(a.videoWidth,a.videoHeight);const n=s?.shadowRoot?.querySelector?.("img");n?.naturalWidth&&n?.naturalHeight&&this._emitMediaAspect(n.naturalWidth,n.naturalHeight)}render(){if("loading"===this._mode)return z`<div class="placeholder">Connecting…</div>`;if("empty"===this._mode)return z`<div class="error">${this._error||"No preview"}</div>`;let t=this._mode;return this._queued?t="queued":this._slotHeld||"still"!==this._mode||(t=this._idleReason||"idle"),z`
      ${this._renderMedia()}
      <span class="badge">${t}</span>
    `}_renderMedia(){const t=this._streamCamera||this.camera;if("ha"===this._mode){const e=this.mosaic||this.large?"contain":"cover",i=this._tileAspect>0?this._tileAspect:this.clientWidth>1&&this.clientHeight>1?this.clientWidth/this.clientHeight:void 0,s=this._stableStateObj||t?.stateObj;return z`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${s}
          .muted=${this.muted}
          .controls=${this.controls}
          .fitMode=${e}
          .aspectRatio=${i}
          @loadeddata=${()=>{this._probeMediaSize(),this._forceNestedContain()}}
        ></ha-camera-stream>
      `}return"webrtc"===this._mode?z`
        <video
          id="webrtc"
          class="media"
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${t=>this._emitMediaAspect(t.target.videoWidth,t.target.videoHeight)}
        ></video>
      `:"hls"===this._mode?z`
        <video
          class="media"
          src=${this._hlsUrl}
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${t=>this._emitMediaAspect(t.target.videoWidth,t.target.videoHeight)}
        ></video>
      `:"mjpeg"===this._mode?z`
        <img
          class="media"
          alt=""
          src=${this._mjpegUrl}
          @load=${t=>this._emitMediaAspect(t.target.naturalWidth,t.target.naturalHeight)}
        />
      `:"still"===this._mode?z`
        <img
          class="media"
          alt=""
          src=${this._stillUrl}
          @load=${t=>this._emitMediaAspect(t.target.naturalWidth,t.target.naturalHeight)}
        />
      `:V}}customElements.get("cctv-stream-player")||customElements.define("cctv-stream-player",Ie);const Ee=[{value:9e5,label:"15m"},{value:36e5,label:"1h"},{value:216e5,label:"6h"},{value:864e5,label:"24h"}];class De extends rt{static properties={hass:{attribute:!1},cameras:{attribute:!1},sensorLinks:{attribute:!1},cameraNames:{attribute:!1},active:{type:Boolean},_windowMs:{state:!0},_loading:{state:!0},_error:{state:!0},_rows:{state:!0},_now:{state:!0},_selected:{state:!0}};createRenderRoot(){return this}constructor(){super(),this.cameras=[],this.sensorLinks={},this.cameraNames={},this.active=!0,this._windowMs=36e5,this._loading=!1,this._error="",this._rows=[],this._now=Date.now(),this._selected=null,this._timer=null,this._fetchToken=0,this._quietRefreshTimer=0,this._lastEntityKey="",this._onVisibility=null}connectedCallback(){super.connectedCallback(),this._onVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._pausePolling():this.active&&this._scheduleQuietRefresh()},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onVisibility),this.active&&this._startPolling()}disconnectedCallback(){super.disconnectedCallback(),this._stopPolling(),this._onVisibility&&"undefined"!=typeof document&&document.removeEventListener("visibilitychange",this._onVisibility)}updated(t){if(t.has("active")&&(this.active?this._startPolling():this._stopPolling()),this.active)return t.has("cameras")||t.has("sensorLinks")||t.has("_windowMs")?(this._selected=null,void this._refresh({showLoading:!0})):void(t.has("hass")&&this._scheduleQuietRefresh())}_startPolling(){this._pausePolling(),this.active&&("undefined"!=typeof document&&document.hidden||(this._timer=window.setInterval(()=>this._scheduleQuietRefresh(),9e4),this._refresh({showLoading:!this._rows.length})))}_pausePolling(){this._timer&&(window.clearInterval(this._timer),this._timer=null),this._quietRefreshTimer&&(window.clearTimeout(this._quietRefreshTimer),this._quietRefreshTimer=0)}_stopPolling(){this._pausePolling(),this._fetchToken+=1,this._loading=!1}_scheduleQuietRefresh(){this.active&&("undefined"!=typeof document&&document.hidden||this._quietRefreshTimer||(this._quietRefreshTimer=window.setTimeout(()=>{this._quietRefreshTimer=0,this._refresh({showLoading:!1})},2500)))}reload(){return this._selected=null,this._refresh({showLoading:!0})}async _refresh(t={}){if(!this.active)return;if("undefined"!=typeof document&&document.hidden)return;const e=Boolean(t.showLoading),i=[...this.cameras||[]],s=`${i.join(",")}|${this._windowMs}`;if(!this.hass)return this._rows=[],this._error="",this._selected=null,void(this._lastEntityKey=s);const a=++this._fetchToken;(e||s!==this._lastEntityKey)&&(this._loading=!0),this._error="";const n=Date.now(),r=n-this._windowMs;try{const t=await async function(t,e={}){if(!t?.callWS)return[];try{const i=await t.callWS({type:"cctv_dashboard/list_detections",start:e.start,end:e.end,cameras:e.cameras,limit:e.limit??500});return i?.events||[]}catch(t){return console.warn("CCTV: failed to list detections",t),[]}}(this.hass,{start:r,end:n,cameras:i.length?i:void 0,limit:500});if(a!==this._fetchToken||!this.active)return;this._lastEntityKey=s,this._rows=this._buildRowsFromEvents(t,r,n),this._now=n,this._syncSelected()}catch(t){if(a!==this._fetchToken||!this.active)return;this._error=t?.message||"Could not load saved detections",this._rows=this._buildRowsFromEvents([],r,n),this._syncSelected()}finally{a===this._fetchToken&&(this._loading=!1)}}_syncSelected(){if(!this._selected)return;const t=this._rows.flatMap(t=>t.events).find(t=>t.id===this._selected.id);this._selected=t||null}_linkedEntityIds(){const t=[];for(const e of this.cameras||[])for(const i of this.sensorLinks?.[e]||[])t.push(i);return[...new Set(t)]}_sensorName(t){return this.hass?.states?.[t]?.attributes?.friendly_name||String(t||"").replace(/^[^.]+\./,"")||t}_buildRowsFromEvents(t,e,i){const s=new Map,a=new Set(this.cameras||[]);for(const n of t||[]){const t=n.kind||"other",r=vt.find(e=>e.id===t)||vt[vt.length-1],o={id:r.id,label:n.kind_label||r.label},c=Date.parse(n.start),l=n.end?Date.parse(n.end):i;if(!Number.isFinite(c))continue;const d=Math.max(e,c),h=Math.min(i,Number.isFinite(l)?l:i);if(h<=d)continue;let u=(n.cameras||[]).map(String);if(a.size&&(u=u.filter(t=>a.has(t)),!u.length&&(n.cameras||[]).length))continue;let p=s.get(o.id);p||(p={kind:o,raw:[],active:!1},s.set(o.id,p)),p.raw.push({start:d,end:h,cameras:u,sensors:n.sensor_id?[{entityId:n.sensor_id,name:this._sensorName(n.sensor_id)}]:[],sourceId:n.id,active:Boolean(n.active||null==n.end)}),(n.active||null==n.end)&&(p.active=!0)}for(const t of this.cameras||[])for(const e of this.sensorLinks?.[t]||[]){const t=this.hass?.states?.[e],i=`${e} ${t?.attributes?.friendly_name||""}`.toLowerCase(),a=vt.find(t=>"other"!==t.id&&t.tokens.some(t=>new RegExp(`(^|[_\\s.-])${t}([_\\s.-]|$)`,"i").test(i)))||vt[vt.length-1];s.has(a.id)||s.set(a.id,{kind:{id:a.id,label:a.label},raw:[],active:!1})}const n=new Map(vt.map((t,e)=>[t.id,e]));return[...s.values()].map(t=>{const e=function(t,e=0){if(!Array.isArray(t)||!t.length)return[];const i=t.map(t=>({start:Number(t.start),end:Number(t.end),cameras:Array.isArray(t.cameras)?[...t.cameras]:[],sensors:Array.isArray(t.sensors)?[...t.sensors]:[]})).filter(t=>Number.isFinite(t.start)&&Number.isFinite(t.end)&&t.end>t.start).sort((t,e)=>t.start-e.start||t.end-e.end);if(!i.length)return[];const s=[Mt(i[0])];for(let t=1;t<i.length;t+=1){const a=i[t],n=s[s.length-1];a.start<=n.end+e?(n.end=Math.max(n.end,a.end),Pt(n,a)):s.push(Mt(a))}return s}(t.raw,1e3),s=e.map((e,s)=>{const a=e.cameras||[];return{id:e.sourceId||`${t.kind.id}:${e.start}:${e.end}:${s}`,kind:t.kind,start:e.start,end:e.end,durationMs:Math.max(0,e.end-e.start),cameras:a,cameraNames:a.map(t=>this.cameraNames?.[t]||t),sensors:e.sensors||[],active:Boolean(t.active&&e.end>=i-5e3)}});return{kind:t.kind,events:s,totalMs:s.reduce((t,e)=>t+e.durationMs,0),active:t.active}}).filter(t=>t.events.length||t.active||this._linkedEntityIds().length).sort((t,e)=>(n.get(t.kind.id)??99)-(n.get(e.kind.id)??99)||t.kind.label.localeCompare(e.kind.label))}_setWindow(t){this._windowMs=t}_selectEvent(t,e){e?.stopPropagation?.(),this._selected=this._selected?.id===t.id?null:t}_clearSelected(){this._selected=null}_requestPlay(t,e){e?.stopPropagation?.(),this.dispatchEvent(new CustomEvent("cctv-play-detection",{detail:{start:t.start,end:t.end,kind:t.kind,sensors:t.sensors||[],cameras:t.cameras||[]},bubbles:!0,composed:!0}))}_tickMarks(){const t=this._now-this._windowMs,e=this._windowMs<=9e5?4:this._windowMs<=36e5?6:8,i=[];for(let s=0;s<=e;s+=1){const a=t+this._windowMs*s/e;i.push({t:a,label:Et(a),pct:s/e*100})}return i}render(){const t=this._linkedEntityIds().length;if(!(this.cameras||[]).length)return V;const e=this._now-this._windowMs,i=Math.max(1,this._windowMs),s=this._tickMarks();return z`
      <section class="timeline" aria-label="Detection timeline">
        <div class="timeline-head">
          <div>
            <strong>Detection timeline</strong>
            <span class="hint">
              ${t?"Shared for all users — survives reboot; kept for retention days":"Link detection sensors in a camera’s settings to see events here"}
            </span>
          </div>
          <div class="timeline-windows">
            ${Ee.map(t=>z`
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

        ${this._error?z`<p class="timeline-error">${this._error}</p>`:V}
        ${t?0===this._rows.length?z`<p class="empty">No linked sensors for the current selection.</p>`:z`
                <div class="timeline-board" @click=${this._clearSelected}>
                  <div class="timeline-ruler" aria-hidden="true">
                    ${s.map(t=>z`
                        <span class="timeline-tick" style="left:${t.pct}%">
                          <span class="timeline-tick-line"></span>
                          <span class="timeline-tick-label">${t.label}</span>
                        </span>
                      `)}
                  </div>
                  <div class="timeline-lanes">
                    ${this._rows.map(t=>this._renderLane(t,e,i))}
                  </div>
                </div>
                ${this._selected?this._renderDetail(this._selected):z`<p class="hint timeline-hint">Select a highlighted event on the timeline.</p>`}
                ${this._loading?z`<p class="hint timeline-loading">Refreshing…</p>`:V}
              `:z`<p class="empty">No detection sensors linked yet.</p>`}
      </section>
    `}_renderLane(t,e,i){const s=vt.find(e=>e.id===t.kind.id)||vt[vt.length-1];return z`
      <div class="timeline-lane">
        <div class="timeline-lane-label">
          <span class="timeline-kind kind-${s.id}">${s.label}</span>
          <span class="timeline-total">
            ${t.events.length?`${t.events.length} event${1===t.events.length?"":"s"} · ${It(t.totalMs)}`:t.active?"active now":"quiet"}
          </span>
        </div>
        <div
          class="timeline-track"
          role="listbox"
          aria-label="${s.label} events"
        >
          ${t.events.map(t=>{const a=(t.start-e)/i*100,n=Math.max(.6,(t.end-t.start)/i*100),r=this._selected?.id===t.id;return z`
              <button
                type="button"
                class="timeline-event kind-${s.id} ${r?"selected":""} ${t.active?"live":""}"
                style="left:${a}%;width:${n}%"
                title="${s.label}: ${Et(t.start)}–${Et(t.end)}"
                aria-pressed=${r?"true":"false"}
                @click=${e=>this._selectEvent(t,e)}
              >
                <span class="timeline-event-mark"></span>
              </button>
            `})}
        </div>
      </div>
    `}_renderDetail(t){const e=vt.find(e=>e.id===t.kind.id)||vt[vt.length-1],i=t.cameraNames?.length?t.cameraNames.join(", "):"—",s=t.sensors?.length?t.sensors:[];return z`
      <aside class="timeline-detail" aria-live="polite">
        <div class="timeline-detail-head">
          <span class="timeline-kind kind-${e.id}">${e.label}</span>
          ${t.active?z`<span class="timeline-live-badge">Live</span>`:V}
          <div class="timeline-detail-actions">
            ${t.active?V:z`
                  <button
                    class="btn primary"
                    type="button"
                    @click=${e=>this._requestPlay(t,e)}
                  >
                    Play
                  </button>
                `}
            <button class="btn" type="button" @click=${this._clearSelected}>
              Close
            </button>
          </div>
        </div>
        <dl class="timeline-detail-grid">
          <dt>When</dt>
          <dd>
            ${Et(t.start)} – ${Et(t.end)}
            <span class="hint">(${new Date(t.start).toLocaleString()} → ${new Date(t.end).toLocaleString()})</span>
          </dd>
          <dt>Duration</dt>
          <dd>${It(t.durationMs)}${t.active?" (ongoing)":""}</dd>
          <dt>Cameras</dt>
          <dd>${i}</dd>
          <dt>Sensors</dt>
          <dd>
            ${s.length?z`
                  <ul class="timeline-detail-sensors">
                    ${s.map(t=>z`
                        <li>
                          <strong>${t.name||t.entityId}</strong>
                          <span class="hint">${t.entityId}</span>
                        </li>
                      `)}
                  </ul>
                `:"—"}
          </dd>
        </dl>
      </aside>
    `}}customElements.get("cctv-detection-timeline")||customElements.define("cctv-detection-timeline",De);class Ne extends rt{static properties={hass:{attribute:!1},config:{attribute:!1},panelMode:{type:Boolean,attribute:"panel-mode"},panelUrlPath:{type:String,attribute:"panel-url-path"},_detailId:{state:!0},_status:{state:!0},_qualityTick:{state:!0},_visibleIds:{state:!0},_sensorLinks:{state:!0},_forceAspect:{state:!0},_savedForceAspect:{state:!0},_cameraQuality:{state:!0},_savedCameraQuality:{state:!0},_customAspectDraft:{state:!0},_prefsDirty:{state:!0},_pickerOpen:{state:!0},_settingsOpen:{state:!0},_selectionReady:{state:!0},_saving:{state:!0},_sensorFilter:{state:!0},_deviceMapReady:{state:!0},_retentionDays:{state:!0},_recordOnDetection:{state:!0},_recordDetectionKinds:{state:!0},_notifyOnDetection:{state:!0},_sessions:{state:!0},_recordDir:{state:!0},_isDesktop:{state:!0},_tvMode:{state:!0},_aspectById:{state:!0},_packStyles:{state:!0},_tvStage:{state:!0},_playback:{state:!0},_panelActive:{state:!0}};static styles=ct;constructor(){super(),this.config={},this.panelMode=!1,this.panelUrlPath="cctv",this._detailId=null,this._status="",this._qualityTick=0,this._visibleIds=[],this._sensorLinks={},this._forceAspect={},this._savedForceAspect={},this._cameraQuality={},this._savedCameraQuality={},this._customAspectDraft="",this._prefsDirty=!1,this._pickerOpen=!0,this._settingsOpen=!1,this._selectionReady=!1,this._saving=!1,this._sensorFilter="",this._deviceMapReady=!1,this._retentionDays=1,this._recordOnDetection=!0,this._recordDetectionKinds=vt.map(t=>t.id),this._notifyOnDetection=!1,this._sessions=[],this._recordDir="",this._loadedForUser=null,this._isDesktop=!1,this._tvMode=!1,this._aspectById={},this._packStyles={},this._tvStage={width:0,height:0},this._playback=null,this._panelActive=!0,this._deviceMap=new Map,this._packObserver=null,this._packObservedEl=null,this._mq=null,this._onMq=null,this._packRaf=0,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._cameraNamesCache={},this._cameraNamesKey="",this._lastHassSig="",this._onDocVisibility=null,this._onLocationChange=null,this._loadToken=0}shouldUpdate(t){if(this.panelMode&&!this._panelActive&&!t.has("_panelActive")&&t.has("hass")&&1===t.size)return!1;if(!t.has("hass"))return!0;if(t.size>1)return!0;const e=t.get("hass"),i=this.hass;return!e||!i||this._hassRelevantChanged(e,i)}_hassRelevantChanged(t,e){const i=this._watchedEntityIds();for(const s of i){const i=t.states?.[s],a=e.states?.[s];if(i!==a){if(!i||!a)return!0;if(i.state!==a.state)return!0;if(i.attributes?.access_token!==a.attributes?.access_token)return!0;if(i.attributes?.friendly_name!==a.attributes?.friendly_name)return!0}}return(t.user?.id||"")!==(e.user?.id||"")}_watchedEntityIds(){const t=new Set(this._visibleIds||[]);if(this._pickerOpen||this._settingsOpen)for(const e of this._cameras())t.add(e.entityId);return t}connectedCallback(){super.connectedCallback(),this._tvMode=function(){try{return"undefined"!=typeof localStorage&&"1"===localStorage.getItem(Ae)}catch{return!1}}(),this._syncTvModeAttr(),"undefined"!=typeof window&&window.matchMedia&&(this._mq=window.matchMedia("(min-width: 801px)"),this._onMq=()=>{this._panelActive&&(this._isDesktop=this._mq.matches,this._refreshTvStage(),this._schedulePack())},this._isDesktop=this._mq.matches,this._mq.addEventListener?this._mq.addEventListener("change",this._onMq):this._mq.addListener(this._onMq)),this._bindTvViewport(),this._bindPanelVisibility(),!this._isCctvLocation()||"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._setPanelActive(!0),this._refreshTvStage()}disconnectedCallback(){super.disconnectedCallback(),this._panelActive&&(this._panelActive=!1,this._suspendResources()),this._unbindTvViewport(),this._unbindPanelVisibility(),this._mq&&this._onMq&&(this._mq.removeEventListener?this._mq.removeEventListener("change",this._onMq):this._mq.removeListener(this._onMq)),this._tearDownObservers()}_syncTvModeAttr(){const t=Boolean(this.panelMode&&this._tvMode);this.toggleAttribute("tv-mode",t)}_bindTvViewport(){"undefined"!=typeof window&&(this._unbindTvViewport(),this._onTvResize=()=>{this._panelActive&&(this._refreshTvStage(),this._schedulePack())},window.addEventListener("resize",this._onTvResize))}_unbindTvViewport(){"undefined"!=typeof window&&this._onTvResize&&(window.removeEventListener("resize",this._onTvResize),this._onTvResize=null)}_refreshTvStage(){if(!this._tvMode||!this.panelMode)return void((this._tvStage?.width||this._tvStage?.height)&&(this._tvStage={width:0,height:0}));const t=Me(),e=this.renderRoot?.querySelector?.(".panel-wrap"),i=this.renderRoot?.querySelector?.(".layout-pack-tv");let s=Pe(e);s<8&&(s=Pe(i)),s<8&&"number"==typeof this.clientWidth&&(s=Math.max(0,this.clientWidth)),s<8&&"undefined"!=typeof window&&(s=Math.max(0,(Number(window.innerWidth)||0)-256-40));const a="undefined"!=typeof window&&Number(window.innerHeight)||0,{stage:n,offsetTop:r}=function(t,e,i){const s=Math.max(0,Number(t)||0),a=Math.max(0,Number(e)||0),n=Number.isFinite(i)?Number(i):Me(),r=Math.max(0,a-n),o=s>0?s/Ce:0;return{availW:s,availH:r,offsetTop:Math.max(0,(r-o)/2),stage:{width:s,height:o}}}(s,a,t),o={width:Math.round(n.width),height:Math.round(n.height)};o.width<8?this.style.setProperty("--cctv-tv-chrome",`${t}px`):(o.width===this._tvStage?.width&&o.height===this._tvStage?.height||(this._tvStage=o),this.style.setProperty("--cctv-tv-stage-w",`${o.width}px`),this.style.setProperty("--cctv-tv-stage-h",`${o.height}px`),this.style.setProperty("--cctv-tv-chrome",`${t}px`),this.style.setProperty("--cctv-tv-stage-offset",`${Math.round(r)}px`))}_bindPanelVisibility(){this.panelMode&&(this._unbindPanelVisibility(),this._onDocVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this.isConnected&&this._isCctvLocation()&&this._setPanelActive(!0)},this._onLocationChange=()=>{this.isConnected&&("undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._isCctvLocation()?this._panelActive||this._setPanelActive(!0):this._setPanelActive(!1))},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onDocVisibility),"undefined"!=typeof window&&(window.addEventListener("location-changed",this._onLocationChange),window.addEventListener("popstate",this._onLocationChange)))}_unbindPanelVisibility(){this._onDocVisibility&&"undefined"!=typeof document&&(document.removeEventListener("visibilitychange",this._onDocVisibility),this._onDocVisibility=null),this._onLocationChange&&"undefined"!=typeof window&&(window.removeEventListener("location-changed",this._onLocationChange),window.removeEventListener("popstate",this._onLocationChange),this._onLocationChange=null)}_isCctvLocation(){if("undefined"==typeof location)return!0;const t=location.pathname||"",e=(String(this.panelUrlPath||"cctv").trim().replace(/^\/+|\/+$/g,"")||"cctv").replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(?:^|/)${e}(?:/|$)`).test(t)}_setPanelActive(t){const e=Boolean(t);this._panelActive!==e&&(this._panelActive=e,e?(this._status="Suspended — streams unloaded"===this._status?"":this._status,this._schedulePack()):this._suspendResources())}_suspendResources(){this._loadToken+=1,this._teardownPlaybackMedia(),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._tearDownObservers(),this._resetLiveStreamSlots(),this.panelMode&&(this._status="Suspended — streams unloaded")}_tearDownObservers(){this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null),this._packRaf&&(cancelAnimationFrame(this._packRaf),this._packRaf=0)}_unloadStreamPlayers(){const t=this.renderRoot||this;t.querySelectorAll?.("cctv-stream-player").forEach(t=>{try{t.active=!1,t._unloadCompletely?.()}catch{}})}updated(t){(this._panelActive||!this.panelMode||t.has("_panelActive")&&this._panelActive)&&(this.panelMode&&this._panelActive&&(t.has("hass")||t.has("panelMode")||t.has("_panelActive"))&&this._ensureSelectionLoaded(),(t.has("_tvMode")||t.has("panelMode"))&&(this._syncTvModeAttr(),this._refreshTvStage()),this.panelMode&&this._panelActive&&(t.has("_visibleIds")||t.has("_isDesktop")||t.has("_detailId")||t.has("_pickerOpen")||t.has("_settingsOpen")||t.has("_aspectById")||t.has("_forceAspect")||t.has("_playback")||t.has("_tvMode")||t.has("_tvStage")||t.has("_panelActive"))&&(this._schedulePack(),this.updateComplete.then(()=>{this._tvMode&&this._refreshTvStage(),this._bindPackObserver()})))}firstUpdated(){this._tvMode&&this.panelMode&&this.updateComplete.then(()=>{this._refreshTvStage(),this._schedulePack(),this._bindPackObserver()})}_bindPackObserver(){const t=this.renderRoot?.querySelector?.(".layout-pack");t?this._packObserver&&this._packObservedEl===t?this._recomputePack():(this._packObserver&&this._packObserver.disconnect(),this._packObservedEl=t,"undefined"!=typeof ResizeObserver?(this._packObserver=new ResizeObserver(()=>this._schedulePack()),this._packObserver.observe(t),this._recomputePack()):this._recomputePack()):this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null)}_schedulePack(){this._panelActive&&(this._packRaf&&cancelAnimationFrame(this._packRaf),this._packRaf=requestAnimationFrame(()=>{this._packRaf=0,this._recomputePack()}))}_recomputePack(){if(!this._isDesktop||!this.panelMode||this._detailId)return void(Object.keys(this._packStyles).length&&(this._packStyles={}));this._tvMode&&this._refreshTvStage();const t=this.renderRoot?.querySelector?.(".layout-pack");if(!t)return;const e=t.getBoundingClientRect();let i=Math.max(0,e.width),s=Math.max(0,e.height);if(this._tvMode&&this._tvStage?.width>=8&&this._tvStage?.height>=8&&(i=this._tvStage.width,s=this._tvStage.height),i<8||s<8)return;const a=this._layoutCameras(this._cameras()).slice(0,4).map(t=>({id:t.entityId,aspect:this._effectiveAspect(t.entityId)}));var n;const r=function(t,e,i,s=10){const a=(t||[]).map(t=>({id:String(t.id),aspect:Jt(t.aspect)}));if(!a.length||e<=1||i<=1)return[];let n=null,r=-1;for(const t of function(t){const e=t.length;if(!e)return[];const i=[];return function s(a,n){if(a!==e)for(let i=a+1;i<=e;i+=1)n.push(t.slice(a,i)),s(i,n),n.pop();else i.push(n.map(t=>t.slice()))}(0,[]),i}(a))for(const a of[Zt(t,e,i,s),Xt(t,e,i,s)])a&&a.totalArea>r&&(r=a.totalArea,n=a.cells);return n||[]}(a,i,s,this._tvMode?(n=a.length,(Number(n)||0)<=2?6:8):10),o=function(t,e,i){if(!e||!i)return{};const s={};for(const a of t)s[a.id]=[`left:${a.left/e*100}%`,`top:${a.top/i*100}%`,`width:${a.width/e*100}%`,`height:${a.height/i*100}%`].join(";");return s}(r,i,s);this._packStylesEqual(this._packStyles,o)||(this._packStyles=o)}_effectiveAspect(t){const e=Qt(this._forceAspect?.[t]);return Jt(e||(this._aspectById[t]||Wt))}_forceAspectLabel(t){return Bt(this._forceAspect?.[t])}_packStylesEqual(t,e){const i=Object.keys(t||{}),s=Object.keys(e||{});if(i.length!==s.length)return!1;for(const s of i)if(t[s]!==e[s])return!1;return!0}_onMediaAspect(t){const e=t?.detail?.entityId,i=Jt(t?.detail?.aspect);e&&(Qt(this._forceAspect?.[e])||Math.abs((this._aspectById[e]||0)-i)<.01||(this._aspectById={...this._aspectById,[e]:i}))}_onPlaybackMediaSize(t,e,i){const s=Number(e),a=Number(i);!t||!Number.isFinite(s)||!Number.isFinite(a)||s<=0||a<=0||this._onMediaAspect({detail:{entityId:t,aspect:s/a}})}async _ensureSelectionLoaded(){if(!this._panelActive)return;const t=this.hass?.user?.id||"default";if(!this.hass||this._loadedForUser===t)return;this._loadedForUser=t,this._selectionReady=!1;const e=++this._loadToken,[i,s]=await Promise.all([ke(this.hass),Yt(this.hass)]);if(e!==this._loadToken||!this._panelActive)return;const a=this._cameras().map(t=>t.entityId);i?.selectedCameras?.length?(this._visibleIds=i.selectedCameras.filter(t=>a.includes(t)).slice(0,this._maxStreams()),this._pickerOpen=0===this._visibleIds.length):(this._visibleIds=[],this._pickerOpen=!0);let n=s?.sensorLinks||{};const r=i?.legacySensorLinks;if(r&&"object"==typeof r&&Object.keys(r).length&&!Object.keys(n).length)try{const t=await te(this.hass,r);if(e!==this._loadToken||!this._panelActive)return;n=t?.sensor_links?Object.fromEntries(Object.entries(t.sensor_links).map(([t,e])=>[t,e])):r,await we(this.hass,this._visibleIds),this._status="Detection sensor links moved to shared settings"}catch(t){console.warn("CCTV: legacy sensor-link migration failed",t),n=r}this._sensorLinks=n,s?(this._retentionDays=Number(s.retention_days)||1,this._recordOnDetection=!1!==s.record_on_detection,this._recordDetectionKinds=this._normalizeRecordKinds(s.record_detection_kinds),this._notifyOnDetection=Boolean(s.notify_on_detection),this._recordDir=s.record_dir||"",this._applySharedCameraPrefs(s)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._selectionReady=!0,this._loadDeviceMap(),this._sessions?.length||(this._sessions=await ie(this.hass),e===this._loadToken&&this._panelActive)}async _loadDeviceMap(){this.hass&&!this._deviceMapReady&&(this._deviceMap=await async function(t){const e=new Map;if(!t?.callWS)return e;try{const i=await t.callWS({type:"config/entity_registry/list"});if(!Array.isArray(i))return e;for(const t of i)t?.entity_id&&t?.device_id&&e.set(String(t.entity_id),String(t.device_id))}catch(t){console.warn("CCTV: entity registry unavailable for sensor linking",t)}return e}(this.hass),this._deviceMapReady=!0)}async _loadRecordingUi(){if(!this.hass)return;const t=await Yt(this.hass);t?(this._retentionDays=Number(t.retention_days)||1,this._recordOnDetection=!1!==t.record_on_detection,this._recordDetectionKinds=this._normalizeRecordKinds(t.record_detection_kinds),this._notifyOnDetection=Boolean(t.notify_on_detection),this._recordDir=t.record_dir||"",t.sensorLinks&&(this._sensorLinks=t.sensorLinks),this._prefsDirty||this._applySharedCameraPrefs(t)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._sessions=await ie(this.hass)}_normalizeRecordKinds(t){const e=new Set(vt.map(t=>t.id));if(!Array.isArray(t))return vt.map(t=>t.id);const i=[],s=new Set;for(const a of t){const t=String(a||"").trim().toLowerCase();e.has(t)&&!s.has(t)&&(s.add(t),i.push(t))}return i}_applySharedCameraPrefs(t){const e=Gt(t?.forceAspect||t?.force_aspect||{}),i=Lt(t?.cameraQuality||t?.camera_quality||{});this._forceAspect={...e},this._savedForceAspect={...e},this._cameraQuality={...i},this._savedCameraQuality={...i},this._prefsDirty=!1,this._customAspectDraft="",this._qualityTick+=1}_prefsMapsEqual(t,e){const i=t||{},s=e||{},a=new Set([...Object.keys(i),...Object.keys(s)]);for(const t of a)if((i[t]||"")!==(s[t]||""))return!1;return!0}_syncPrefsDirty(){this._prefsDirty=!this._prefsMapsEqual(this._forceAspect,this._savedForceAspect)||!this._prefsMapsEqual(this._cameraQuality,this._savedCameraQuality)}_qualityFor(t){return Ht(this.config,t,this.panelMode?this._cameraQuality:null)}_cameras(){return function(t,e={}){const i=t?.states??{},s=yt(e.cameras),a=new Set(yt(e.exclude).map(t=>t.toLowerCase()));let n=Object.keys(i).filter(t=>t.startsWith("camera."));if(s.length){const t=new Set(s.map(t=>t.toLowerCase()));n=n.filter(e=>t.has(e.toLowerCase()))}return n=n.filter(t=>!a.has(t.toLowerCase())),n.map(t=>ht(t,i[t])).sort((t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}))}(this.hass,this.config)}_maxStreams(){const t=Number(this.config?.max_streams);return Number.isFinite(t)&&t>0?t:4}_visibleCameras(t){return this._visibleIds.map(e=>t.find(t=>t.entityId===e)).filter(Boolean)}_layoutCameras(t){const e=this._playback?.playing?this._playback.tracks:null;if(!e?.length)return this._visibleCameras(t);const i=new Map(t.map(t=>[t.entityId,t]));return e.map(t=>i.has(t.cameraId)?i.get(t.cameraId):ht(t.cameraId,this.hass?.states?.[t.cameraId]))}_resetLiveStreamSlots(){try{xe.releaseAll()}catch(t){console.warn("CCTV: stream slot reset failed",t)}this._unloadStreamPlayers()}_linksFor(t){return this._sensorLinks?.[t]||[]}async _toggleVisible(t,e){const i=this._maxStreams();let s=[...this._visibleIds];if(e){if(s.includes(t))return;if(s.length>=i)return void(this._status=`Select at most ${i} cameras`);s.push(t)}else s=s.filter(e=>e!==t);this._visibleIds=s,this._detailId&&!s.includes(this._detailId)&&(this._detailId=null),await this._persistSelection(s)}async _persistSelection(t){this._saving=!0;try{const e=await we(this.hass,t);e?.selectedCameras&&(this._visibleIds=e.selectedCameras);const i=e?.selectedCameras||t;this._status=i.length?`${i.length} camera${1===i.length?"":"s"} on screen`:"No cameras selected"}catch(t){this._status=t?.message||"Could not save camera selection"}finally{this._saving=!1}}async _persistSensorLinks(t){this._saving=!0,this._sensorLinks=t;try{const e=await te(this.hass,t);e?.sensor_links&&(this._sensorLinks=e.sensor_links),this._status="Detection sensors saved for all users"}catch(t){this._status=t?.message||"Could not save detection sensors"}finally{this._saving=!1}}_setForceAspect(t,e){if("custom"===e){const e=this._forceAspect?.[t]||"";this._customAspectDraft=e&&!Kt(e)?e:"1920:2560";const i=Bt(this._customAspectDraft),s={...this._forceAspect};return"auto"===i?delete s[t]:s[t]=i,this._forceAspect=s,this._syncPrefsDirty(),void this._schedulePack()}const i=Bt(e),s={...this._forceAspect};"auto"===i?delete s[t]:s[t]=i,this._forceAspect=s,(Kt(i)||"auto"===i)&&(this._customAspectDraft=""),this._syncPrefsDirty(),this._schedulePack()}_setCustomForceAspect(t,e){this._customAspectDraft=e;const i=Bt(e),s={...this._forceAspect};"auto"===i?delete s[t]:s[t]=i,this._forceAspect=s,this._syncPrefsDirty(),this._schedulePack()}async _saveCameraPrefs(){this._saving=!0;try{const t=await async function(t,e){if(!t?.callWS)return null;const i={type:"cctv_dashboard/set_camera_prefs"};return void 0!==e.cameraQuality&&(i.camera_quality=Lt(e.cameraQuality)),void 0!==e.forceAspect&&(i.force_aspect=Gt(e.forceAspect)),t.callWS(i)}(this.hass,{cameraQuality:this._cameraQuality,forceAspect:this._forceAspect});t?this._applySharedCameraPrefs({force_aspect:t.force_aspect,camera_quality:t.camera_quality}):(this._savedForceAspect={...this._forceAspect},this._savedCameraQuality={...this._cameraQuality},this._prefsDirty=!1),this._status="Quality & aspect saved for all users",this._schedulePack()}catch(t){this._status=t?.message||"Could not save camera preferences"}finally{this._saving=!1}}async _setSensorLinked(t,e,i){const s=new Set(this._linksFor(t));i?s.add(e):s.delete(e);const a={...this._sensorLinks,[t]:[...s]};a[t].length||delete a[t],await this._persistSensorLinks(a)}async _applySuggestions(t){const e=At(this.hass,t,{deviceIds:this._deviceMap,limit:8});if(!e.length)return void(this._status="No related detection sensors found");const i={...this._sensorLinks,[t]:[...new Set([...this._linksFor(t),...e.map(t=>t.entityId)])].slice(0,16)};await this._persistSensorLinks(i),this._status=`Linked ${e.length} suggested sensor${1===e.length?"":"s"} (all users)`}_openDetail(t){this._detailId=t,this._sensorFilter="";const e=this._forceAspect?.[t];this._customAspectDraft=e&&!Kt(e)?e:""}_back(){this._detailId=null,this._sensorFilter="",this._customAspectDraft=""}_setQuality(t,e){if(!this.panelMode)return jt(t,e),void(this._qualityTick+=1);const i=String(e||"auto").toLowerCase(),s={...this._cameraQuality};i&&"auto"!==i?s[t]=i:delete s[t],this._cameraQuality=Lt(s),this._syncPrefsDirty(),this._qualityTick+=1}async _run(t,e){this._status=`Calling ${t}…`;try{await _t(this.hass,t,e),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}async _saveRetentionDays(t){const e=Math.max(1,Math.min(30,Number(t)||1));this._retentionDays=e,this._saving=!0;try{await ee(this.hass,{retention_days:e}),this._status=`Retention set to ${e} day${1===e?"":"s"}`}catch(t){this._status=t?.message||"Could not save retention"}finally{this._saving=!1}}async _toggleRecordOnDetection(t){this._recordOnDetection=t,this._saving=!0;try{await ee(this.hass,{record_on_detection:t}),this._status=t?"Detection recording enabled":"Detection recording paused"}catch(t){this._status=t?.message||"Could not save recording setting"}finally{this._saving=!1}}async _toggleNotifyOnDetection(t){this._notifyOnDetection=t,this._saving=!0;try{await async function(t,e){return t?.callWS?t.callWS({type:"cctv_dashboard/set_user_notify",notify_on_detection:Boolean(e)}):null}(this.hass,t),this._status=t?"You will be notified when a detection is recorded (this account only)":"Detection notifications disabled for your account"}catch(t){this._status=t?.message||"Could not save notification preference",await this._loadRecordingUi()}finally{this._saving=!1}}_toggleTvMode(t){this._tvMode=Boolean(t),function(t){try{if("undefined"==typeof localStorage)return;localStorage.setItem(Ae,t?"1":"0")}catch{}}(this._tvMode),this._syncTvModeAttr(),this._tvMode&&(this._pickerOpen=!1,this._settingsOpen=!1),this._refreshTvStage(),this._status=this._tvMode?"TV mode on — 16:9 mosaic fills this display width (saved on this device)":"TV mode off",this._schedulePack(),this.updateComplete.then(()=>this._bindPackObserver())}async _toggleRecordKind(t,e){const i=String(t||""),s=new Set(this._recordDetectionKinds||[]);e?s.add(i):s.delete(i);const a=vt.map(t=>t.id).filter(t=>s.has(t));this._recordDetectionKinds=a,this._saving=!0;try{await ee(this.hass,{record_detection_kinds:a});const t=vt.filter(t=>a.includes(t.id)).map(t=>t.label);this._status=a.length?`Saving video for: ${t.join(", ")}`:"Video save disabled for all detection types (timeline still logs events)"}catch(t){this._status=t?.message||"Could not save detection-type filter",await this._loadRecordingUi()}finally{this._saving=!1}}async _refreshSessions(){this._sessions=await ie(this.hass),this._status="Recordings refreshed"}_refreshTimeline(){const t=this.renderRoot?.querySelector?.("cctv-detection-timeline");t?.reload?.()}_isAdmin(){return Boolean(this.hass?.user?.is_admin)}async _deleteSession(t,e){if(e?.stopPropagation?.(),e?.preventDefault?.(),this._isAdmin()){if("undefined"==typeof window||window.confirm("Delete this saved detection’s recordings for all users?"))try{const e=await async function(t,e){if(!t?.callWS)return!1;const i=await t.callWS({type:"cctv_dashboard/delete_recording",session_id:e});return Boolean(i?.deleted)}(this.hass,t);this._sessions=await ie(this.hass),this._playback?.session?.session_id===t&&this._stopPlayback(),this._status=e?"Saved detection deleted for all users":"Recording was already removed"}catch(t){this._status=t?.message||"Could not delete recording"}}else this._status="Only Home Assistant admins can delete saved detections"}async _clearAllDetections(t){if(t?.stopPropagation?.(),t?.preventDefault?.(),this._isAdmin()){if("undefined"==typeof window||window.confirm("Delete ALL saved detections and reset the detection timeline for every Home Assistant user? This cannot be undone.")){this._saving=!0;try{const t=await async function(t){return t?.callWS?t.callWS({type:"cctv_dashboard/clear_detections"}):null}(this.hass);this._sessions=await ie(this.hass),this._refreshTimeline(),this._playback&&this._stopPlayback();const e=Number(t?.sessions_cleared)||0,i=Number(t?.events_cleared)||0;this._status=`Cleared ${e} recording${1===e?"":"s"} and ${i} timeline event${1===i?"":"s"} for all users`}catch(t){this._status=t?.message||"Could not clear detections"}finally{this._saving=!1}}}else this._status="Only Home Assistant admins can clear saved detections"}async _selectPlaybackSession(t,e=null){if(!_e(t))return this._status="No playable recording for that detection",!1;const i=he(this.hass,t.trigger_sensors||[]),s=this._maxStreams(),a=this._visibleIds.slice(0,s),n=function(t,e,i=4){const s=Math.max(1,Number(i)||4),a=fe(t),n=new Set(a),r=(e||[]).map(String).filter(t=>t.startsWith("camera."));if(r.length){const t=r.filter(t=>n.has(t)).slice(0,s);return t.length?{cameraIds:t,usedFallback:!1,reason:""}:{cameraIds:a.slice(0,s),usedFallback:!0,reason:"no-selected-clips"}}return{cameraIds:a.slice(0,s),usedFallback:!0,reason:"empty-selection"}}(t,a,s);if(!n.cameraIds.length)return this._status=a.length?"No playable clips for this detection (files missing or empty)":"No playable clips for this detection — select cameras or wait for recordings",!1;const r=ye(this.hass,t,n.cameraIds),o=r.some(t=>(t.items||[]).some(t=>"video"===t.kind||"snapshot"===t.kind));if(!o)return this._status="No playable clips for this detection (files missing or empty)",!1;const c=function(t,e=null){const i=Number(e?.start),s=Number(e?.end),a=pe(t?.started),n=pe(t?.ended||t?.started),r=Number.isFinite(i)?i:a;let o=Number.isFinite(s)?s:n;return!Number.isFinite(o)&&Number.isFinite(r)&&(o=r+6e4),Number.isFinite(r)&&Number.isFinite(o)&&o<r&&(o=r),{start:r,end:o}}(t,e);this._detailId=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map;for(const t of r){const e=ve(t,c.start);this._playbackIndex.set(t.cameraId,e.index),this._playbackSeek.set(t.cameraId,e.seekSec),this._playbackDone.set(t.cameraId,!t.items.length)}this._playback={session:t,labels:i,playing:!1,tracks:r,windowStart:c.start,windowEnd:c.end,eventDetail:e,triggerHighlights:le(this.hass,t,this._sensorLinks,e)};const l=n.cameraIds.length;return"empty-selection"===n.reason?this._status=`No mosaic selection — playing ${l} camera${1===l?"":"s"} with clips`:"no-selected-clips"===n.reason?this._status=`Selected mosaic cams had no clips — playing ${l} camera${1===l?"":"s"} with recordings`:this._status=`Selected ${i.join(", ")} — Play replaces live mosaic for ${l} cam${1===l?"":"s"}`,this._schedulePack(),!0}async _freshPlaybackSession(t){if(!t?.session_id||!this.hass)return t;try{const e=await ie(this.hass);this._sessions=e;const i=e.find(e=>e.session_id===t.session_id);return i||t}catch(e){return console.warn("CCTV: could not refresh recordings before Play",e),t}}async _playSavedDetection(t,e=null){e?.stopPropagation?.(),e?.preventDefault?.();const i=await this._freshPlaybackSession(t);await this._selectPlaybackSession(i)&&this._playback&&this._playback.session?.session_id===i.session_id&&!this._playback.playing&&await this._startPlayback()}_onPlayDetection(t){const e=t?.detail,i=function(t,e){if(!t?.length||!e)return null;const i=Number(e.start),s=Number(e.end);if(!Number.isFinite(i)||!Number.isFinite(s))return null;const a=new Set((e.sensors||[]).map(t=>t.entityId).filter(Boolean));let n=null,r=-1;for(const e of t){if(e.active)continue;if(!(e.clips||[]).length)continue;const t=Date.parse(e.started),o=Date.parse(e.ended||e.started);if(!Number.isFinite(t)||!Number.isFinite(o))continue;const c=Math.min(s,o)-Math.max(i,t);if(c<=0)continue;let l=c;const d=e.trigger_sensors||[];a.size&&d.some(t=>a.has(t))&&(l+=6e4),l>r&&(r=l,n=e)}return n}(this._sessions||[],e);i?this._selectPlaybackSession(i,e):this._status="No saved recording overlaps that timeline event"}async _startPlayback(){if(!this._playback?.tracks?.length)return;this._status="Signing recording URLs…";try{await async function(t,e){const i=[];for(const s of e||[]){const e=[];for(const a of s.items||[])0!==Number(a.size)||"video"!==a.kind?(e.push(a),i.push((async()=>{const e=a.path||a.url;a.path=ae(e),a.url=await ne(t,a.path)})())):console.warn("CCTV: skipping empty video clip",a.path||a.url);s.items=e}return await Promise.all(i),e}(this.hass,this._playback.tracks)}catch(t){return console.warn("CCTV: could not sign playback URLs",t),void(this._status=t?.message||"Could not sign recording URLs (auth/sign_path failed)")}const t=this._playback.tracks.some(t=>(t.items||[]).some(t=>"video"===t.kind||"snapshot"===t.kind));t?(this._resetLiveStreamSlots(),this._playback={...this._playback,playing:!0},this._status=`Playing ${this._playback.labels.join(", ")} (synced)`,await this.updateComplete,await new Promise(t=>requestAnimationFrame(()=>t())),await this._kickPlaybackVideos()):this._status="No playable clips (files missing or empty)"}_stopPlayback(){this._teardownPlaybackMedia(),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._resetLiveStreamSlots(),this._status="Live mosaic",this._schedulePack()}_pausePlaybackToLive(){this._playback&&(this._teardownPlaybackMedia(),this._playback={...this._playback,playing:!1},this._resetLiveStreamSlots(),this._status="Stopped — back to live mosaic",this._schedulePack())}_teardownPlaybackMedia(){const t=this.renderRoot;t&&t.querySelectorAll("video.playback-media").forEach(t=>{try{t.pause?.(),t.removeAttribute("src"),t.load?.()}catch{}})}async _kickPlaybackVideos(){const t=this.renderRoot;if(!t||!this._playback?.playing)return;const e=[...t.querySelectorAll("video.playback-media")];if(!e.length)return void(this._status="Playback ready but no video elements found");const i=await Promise.all(e.map(t=>this._startOnePlaybackVideo(t))),s=i.filter(t=>!t.ok);s.length&&s.length===i.length?this._status=`Playback failed to start (${s[0].reason||"media error"})`:s.length&&(this._status=`Playing ${i.length-s.length}/${i.length} cameras`)}_startOnePlaybackVideo(t){const e=t.getAttribute("data-camera")||"",i=this._playbackSeek.get(e)||0;t.muted=!0,t.defaultMuted=!0,t.playsInline=!0,t.setAttribute("muted",""),t.setAttribute("playsinline",""),t.setAttribute("webkit-playsinline",""),t.preload="auto";const s=async()=>{try{if(i>0)try{t.currentTime=i}catch{}return await t.play(),{ok:!0,cameraId:e}}catch(i){const s=i?.name||i?.message||"play() rejected";console.warn("CCTV playback play() failed",e,i);try{return t.muted=!0,await t.play(),{ok:!0,cameraId:e}}catch(t){return console.warn("CCTV playback retry failed",e,t),{ok:!1,cameraId:e,reason:s}}}};return new Promise(i=>{if(t.readyState>=2)s().then(i);else{t.addEventListener("loadeddata",()=>{s().then(i)},{once:!0}),t.addEventListener("error",()=>{const s=t.error?.code,a=4===s?"unsupported/unauthorized media (check signed URL)":2===s?"network error loading clip":`media error ${s||""}`.trim();console.warn("CCTV playback media error",e,t.error,t.currentSrc),i({ok:!1,cameraId:e,reason:a})},{once:!0});try{t.load()}catch{s().then(i)}}})}_playbackVideoEl(t){const e=String(t).replace(/\\/g,"\\\\").replace(/"/g,'\\"');return this.renderRoot?.querySelector?.(`video.playback-media[data-camera="${e}"]`)}_onPlaybackEnded(t){if(!this._playback?.playing)return;const e=this._playback.tracks.find(e=>e.cameraId===t);if(!e)return;const i=(this._playbackIndex.get(t)||0)+1,s=Number(this._playback.windowEnd);if(i<e.items.length){const a=e.items[i];return Number.isFinite(s)&&Number.isFinite(a.startedMs)&&a.startedMs>=s?void this._markPlaybackCameraDone(t):(this._playbackIndex.set(t,i),this._playbackSeek.set(t,0),"snapshot"===a.kind?void this.requestUpdate():void this._advancePlaybackVideo(t,a))}this._markPlaybackCameraDone(t)}async _advancePlaybackVideo(t,e){const i=this._playbackVideoEl(t);if(i)try{e.url=await ne(this.hass,e.path||e.url),i.muted=!0,i.playsInline=!0,i.src=e.url,i.load?.(),await this._startOnePlaybackVideo(i)}catch(e){console.warn("CCTV chunk advance failed",t,e),this._markPlaybackCameraDone(t)}else this._markPlaybackCameraDone(t)}_markPlaybackCameraDone(t){this._playbackDone.set(t,!0);const e=(this._playback?.tracks||[]).every(t=>!t.items.length||(!!t.items.every(t=>"snapshot"===t.kind)||this._playbackDone.get(t.cameraId)));e&&this._pausePlaybackToLive()}_trackForCamera(t){return this._playback?.tracks?.find(e=>e.cameraId===t)||null}_currentPlaybackItem(t){if(!t?.items?.length)return null;const e=Math.min(this._playbackIndex.get(t.cameraId)||0,Math.max(0,t.items.length-1));return t.items[e]||null}_stableCameraNames(t){const e=t.map(t=>`${t.entityId}:${t.name}`).join("|");return e===this._cameraNamesKey||(this._cameraNamesKey=e,this._cameraNamesCache=Object.fromEntries(t.map(t=>[t.entityId,t.name]))),this._cameraNamesCache}render(){if(!this.hass)return z`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;this._qualityTick,this._deviceMapReady;const t=this._cameras(),e=this._maxStreams();xe.setMax(e);const i=this.config?.title||"CCTV";if(this.panelMode&&!this._selectionReady)return z`
        <div class="panel-wrap wrap">
          <p class="placeholder">Loading camera selection…</p>
        </div>
      `;if(this.panelMode&&!this._panelActive)return z`
        <div class="panel-wrap wrap">
          <p class="placeholder">CCTV paused — streams unloaded while you are away.</p>
        </div>
      `;const s=t.find(t=>t.entityId===this._detailId)||null,a=this.panelMode?this._layoutCameras(t):t,n=this._stableCameraNames(t),r=Boolean(this._playback?.playing),o=this._panelActive,c=[this.panelMode?"panel-wrap wrap":"wrap",this.panelMode&&this._tvMode?"tv-mode":""].filter(Boolean).join(" ");return z`
      <div class=${c}>
        <div class="top ${this._tvMode?"top-tv":""}">
          <div>
            ${this.panelMode&&!this._tvMode?z`<p class="eyebrow">Home Assistant</p>`:V}
            <h1>${i}${this._tvMode?z`<span class="tv-badge">TV</span>`:V}</h1>
          </div>
          <div class="top-actions">
            ${this.panelMode?z`
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
              ${this._status||(this.panelMode?`${a.length}/${e} selected · ${r?"playback":`${xe.activeCount()} live`}`:`${t.length} camera${1===t.length?"":"s"} · ${xe.activeCount()}/${e} live`)}
              ${this._saving?" · saving…":""}
            </span>
          </div>
        </div>

        ${this.panelMode&&this._pickerOpen?this._renderPicker(t,e):V}

        ${this.panelMode&&this._settingsOpen?this._renderSettings():V}

        ${this.panelMode&&this._playback?this._renderPlaybackBar():V}

        ${s?this._renderDetail(s,o):this.panelMode?this._renderLayout(a,o):this._renderCardGrid(t)}

        ${this.panelMode&&!s?z`
              <cctv-detection-timeline
                .hass=${this.hass}
                .cameras=${a.map(t=>t.entityId)}
                .sensorLinks=${this._sensorLinks}
                .cameraNames=${n}
                .active=${o}
                @cctv-play-detection=${this._onPlayDetection}
              ></cctv-detection-timeline>
              ${this._renderRecordings()}
            `:V}
      </div>
    `}_renderPlaybackBar(){const t=this._playback;if(!t)return V;const e=t.session?.started?new Date(t.session.started).toLocaleString():"—";return z`
      <div class="playback-bar" role="region" aria-label="Detection playback">
        <div class="playback-bar-meta">
          <strong>${t.labels.join(", ")}</strong>
          <span class="hint">${e} · ${de(ue(t.session))}</span>
        </div>
        <div class="playback-bar-actions">
          ${t.playing?z`
                <button class="btn primary" type="button" @click=${this._pausePlaybackToLive}>
                  Stop
                </button>
              `:z`
                <button class="btn primary" type="button" @click=${this._startPlayback}>
                  Play
                </button>
              `}
          <button class="btn" type="button" @click=${this._stopPlayback}>
            Back to live
          </button>
        </div>
      </div>
    `}_renderSettings(){const t=this._recordDetectionKinds||[];return z`
      <section class="settings-panel" aria-label="CCTV settings">
        <div class="picker-head">
          <strong>Detection recordings</strong>
          <span class="hint">
            When any site-wide linked detection sensor triggers, HA logs the event for
            the shared timeline and (if enabled) saves clips for <em>all</em> available
            cameras until sensors clear. Choose which detection types save video — shared
            for all users. Timeline + saved detections survive reboot and
            are purged only after retention days. Uses <code>camera.record</code>
            (30s chunks + lookback) with snapshot fallback. Mosaic selection stays personal.
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
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._notifyOnDetection}
              ?disabled=${this._saving}
              @change=${t=>this._toggleNotifyOnDetection(t.target.checked)}
            />
            <span class="picker-name">Notify me when recorded</span>
            <span class="picker-id">
              Per-user. Sends type + duration to your Companion app (or HA notification).
              Only fires when a clip with media was saved.
            </span>
          </label>
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._tvMode}
              ?disabled=${this._saving}
              @change=${t=>this._toggleTvMode(t.target.checked)}
            />
            <span class="picker-name">TV mode</span>
            <span class="picker-id">
              Per-device (this browser / kiosk). Full-width 16:9 mosaic above the fold
              (accounts for HA / kiosk chrome); up to 4 cams fill the stage; 1–2 cams
              maximize. Timeline and Saved detections scroll below.
            </span>
          </label>
        </div>
        <div class="kind-filter" role="group" aria-label="Detection types that save video">
          <strong class="kind-filter-title">Save video for</strong>
          <span class="hint">
            Unchecked types still appear on the timeline, but do not start a recording.
            Shared for all Home Assistant users.
          </span>
          <div class="kind-filter-list">
            ${vt.map(e=>z`
                <label class="picker-item kind-filter-item">
                  <input
                    type="checkbox"
                    .checked=${t.includes(e.id)}
                    ?disabled=${!this._recordOnDetection||this._saving}
                    @change=${t=>this._toggleRecordKind(e.id,t.target.checked)}
                  />
                  <span class="picker-name">${e.label}</span>
                </label>
              `)}
          </div>
        </div>
        <p class="hint">
          Storage: ${this._recordDir||"HA media / www /cctv_dashboard/recordings"}.
          Multi-cam continuous video needs a writable media folder and cameras that support streaming;
          otherwise snapshots are saved instead. Also configurable under
          Settings → Devices &amp; services → CCTV Dashboard → Configure.
        </p>
      </section>
    `}_renderRecordings(){const t=(this._sessions||[]).filter(t=>t.active||_e(t)),e=this._isAdmin();return z`
      <section class="recordings" aria-label="Saved detections">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Time, what was detected, and file size. Play starts mosaic
              playback for the visible cameras; click the row to load it first
              (desktop bar still works). Shared for all users; survives reboot;
              kept for ${this._retentionDays} day${1===this._retentionDays?"":"s"}.
              Empty 0&nbsp;B stubs are hidden.
              ${e?" Admins can delete one detection or clear all for everyone.":""}
            </span>
          </div>
          <div class="recording-toolbar">
            <button class="btn" type="button" @click=${()=>this._refreshSessions()}>
              Refresh
            </button>
            ${e?z`
                  <button
                    class="btn recording-delete"
                    type="button"
                    ?disabled=${this._saving}
                    title="Delete all saved detections and reset the timeline"
                    @click=${t=>this._clearAllDetections(t)}
                  >
                    Clear all
                  </button>
                `:V}
          </div>
        </div>
        ${t.length?z`
              <div class="recording-list">
                ${t.map(t=>this._renderSession(t,e))}
              </div>
            `:z`<p class="empty">No detection recordings yet.</p>`}
      </section>
    `}_renderSession(t,e=!1){const i=t.started?new Date(t.started).toLocaleString():"—",s=he(this.hass,t.trigger_sensors||[]),a=de(ue(t)),n=this._playback?.session?.session_id===t.session_id,r=_e(t);return z`
      <div
        class="recording-item ${t.active?"active":""} ${n?"selected":""}"
      >
        <button
          type="button"
          class="recording-select"
          ?disabled=${!r}
          @click=${()=>this._selectPlaybackSession(t)}
        >
          <div class="recording-meta">
            <span class="recording-when">${i}${t.active?" · recording…":""}</span>
            <span class="recording-detected">${s.join(", ")}</span>
          </div>
          <span class="recording-size">${a}</span>
        </button>
        <div class="recording-actions">
          <button
            type="button"
            class="btn primary recording-play"
            title="Play this detection on the mosaic"
            ?disabled=${!r}
            @click=${e=>this._playSavedDetection(t,e)}
          >
            Play
          </button>
          ${e&&!t.active?z`
                <button
                  type="button"
                  class="btn recording-delete"
                  title="Delete recordings for all users"
                  @click=${e=>this._deleteSession(t.session_id,e)}
                >
                  Delete
                </button>
              `:V}
        </div>
      </div>
    `}_renderPicker(t,e){return t.length?z`
      <section class="picker" aria-label="Camera selection">
        <div class="picker-head">
          <strong>Visible streams</strong>
          <span class="hint">Select 1–${e}. Layout updates automatically. Saved to your HA profile (per user).</span>
        </div>
        <div class="picker-list">
          ${t.map(t=>{const i=this._visibleIds.includes(t.entityId),s=!i&&this._visibleIds.length>=e,a=this._linksFor(t.entityId).length;return z`
              <label class="picker-item ${s?"disabled":""}">
                <input
                  type="checkbox"
                  .checked=${i}
                  ?disabled=${s}
                  @change=${e=>this._toggleVisible(t.entityId,e.target.checked)}
                />
                <span class="picker-name">${t.name}</span>
                <span class="picker-id">
                  ${t.entityId}${a?` · ${a} sensor${1===a?"":"s"}`:""}
                </span>
              </label>
            `})}
        </div>
      </section>
    `:z`<p class="empty">No camera entities found.</p>`}_renderLayout(t,e=!0){if(!t.length)return z`
        <p class="empty">
          Select cameras above to start streaming.
          One camera fills the view; two to four split the screen equally (max ${this._maxStreams()}).
        </p>
      `;const i=t.slice(0,4);if(!this._isDesktop){const t=i.length;return z`
        <div class="layout layout-${t}" role="list">
          ${i.map(t=>this._renderLayoutTile(t,!1,e))}
        </div>
      `}const s=this._tvMode&&this._tvStage?.width>=8&&this._tvStage?.height>=8?`width:${this._tvStage.width}px;height:${this._tvStage.height}px;max-width:100%;aspect-ratio:16/9;`:this._tvMode?"width:100%;max-width:100%;aspect-ratio:16/9;":V,a=this._tvMode&&i.length<=2?"layout-pack-maximize":"";return z`
      <div
        class="layout layout-pack ${this._tvMode?"layout-pack-tv":""} ${a}"
        role="list"
        style=${s}
        @cctv-media-aspect=${this._onMediaAspect}
      >
        ${i.map(t=>this._renderLayoutTile(t,!0,e))}
      </div>
    `}_renderLayoutTile(t,e,i=!0){const s=this._qualityFor(t.entityId),a=this._linksFor(t.entityId).length,n=e?this._packStyles?.[t.entityId]:"",r=Boolean(e&&n),o=Boolean(this._playback?.playing),c=o?this._trackForCamera(t.entityId):null,l=c?this._currentPlaybackItem(c):null,d=Qt(this._forceAspectLabel(t.entityId)),h=o&&this._playback?.triggerHighlights?this._playback.triggerHighlights[t.entityId]:null,u=h?`trigger-cam kind-${h.kindId}`:"",p=h?`--cctv-trigger-color:${h.color};`:"",m=!r&&d?`aspect-ratio:${d}; width:100%;`:V,_=[r?n:"",p].filter(Boolean).join(";");return z`
      <article
        class="tile layout-tile ${r?"pack-tile":""} ${u}"
        role="listitem"
        style=${_||V}
      >
        <div class="tile-media" style=${m}>
          ${o?l?"snapshot"===l.kind?z`<img
                    class="playback-media"
                    alt=""
                    src=${l.url}
                    @load=${e=>this._onPlaybackMediaSize(t.entityId,e.target.naturalWidth,e.target.naturalHeight)}
                  />`:z`
                    <video
                      class="playback-media"
                      data-camera=${t.entityId}
                      src=${l.url}
                      autoplay
                      muted
                      playsinline
                      webkit-playsinline
                      preload="auto"
                      .muted=${!0}
                      .playsInline=${!0}
                      controls
                      @loadedmetadata=${e=>this._onPlaybackMediaSize(t.entityId,e.target.videoWidth,e.target.videoHeight)}
                      @ended=${()=>this._onPlaybackEnded(t.entityId)}
                    ></video>
                  `:z`<div class="playback-empty">No recording for this camera</div>`:z`
                <cctv-stream-player
                  large
                  mosaic
                  eager
                  .active=${i}
                  .hass=${this.hass}
                  .camera=${t}
                  .config=${this.config}
                  .quality=${s}
                  context="mosaic"
                  muted
                ></cctv-stream-player>
              `}
        </div>
        ${o?z`
              <div class="tile-body ${e?"pack-caption":""}">
                <p class="tile-title">${t.name}</p>
                <p class="tile-meta">Playback</p>
              </div>
            `:z`
              <button
                type="button"
                class="tile-body tile-open ${e?"pack-caption":""}"
                @click=${()=>this._openDetail(t.entityId)}
              >
                <p class="tile-title">${t.name}</p>
                <p class="tile-meta">
                  <span class="dot ${t.state}"></span>${t.state} · ${s}
                  ${a?z` · ${a} detection`:V}
                </p>
              </button>
            `}
      </article>
    `}_renderCardGrid(t){return t.length?z`
      <div class="grid" role="list">
        ${t.map(t=>{const e=this._qualityFor(t.entityId);return z`
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
    `:z`<p class="empty">No camera entities found.</p>`}_renderDetail(t,e=!0){const i=gt(this.hass,t),s=this._qualityFor(t.entityId),a=Ut(this.hass,t,this.config,s,"detail"),n=function(t){const e=Bt(t);return"auto"===e?"auto":Kt(e)?e:"custom"}(this._forceAspect?.[t.entityId]),r=this.panelMode&&("custom"===n||Boolean(this._customAspectDraft)),o=this._customAspectDraft||("custom"===n?this._forceAspectLabel(t.entityId):"");return z`
      <button class="btn linkish" type="button" @click=${this._back}>
        ← ${this.panelMode?"Back to layout":"All cameras"}
      </button>
      <h2>${t.name}</h2>
      <div class="detail-stage">
        <cctv-stream-player
          large
          eager
          .active=${e}
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
            ${Dt.map(t=>z`<option value=${t.value}>${t.label}</option>`)}
          </select>
        </label>
        <span class="hint">${zt(s)}</span>
      </div>
      ${this.panelMode?z`
            <div class="quality-row">
              <label>
                Force aspect ratio
                <select
                  .value=${n}
                  @change=${e=>this._setForceAspect(t.entityId,e.target.value)}
                >
                  ${Vt.map(t=>z`<option value=${t.value}>${t.label}</option>`)}
                </select>
              </label>
              <span class="hint">Shared for all users.</span>
            </div>
            ${r?z`
                  <div class="quality-row">
                    <label>
                      Custom W:H
                      <input
                        type="text"
                        class="aspect-input"
                        placeholder="1920:2560"
                        .value=${o}
                        @input=${e=>this._setCustomForceAspect(t.entityId,e.target.value)}
                      />
                    </label>
                    <span class="hint">Examples: 1920:2560, 3:4, 1080x1920</span>
                  </div>
                `:V}
            <div class="quality-row prefs-save-row">
              <button
                class="btn primary"
                type="button"
                ?disabled=${this._saving||!this._prefsDirty}
                @click=${()=>this._saveCameraPrefs()}
              >
                ${this._saving?"Saving…":"Save quality & aspect"}
              </button>
              <span class="hint">
                ${this._prefsDirty?"Unsaved changes — writes shared settings for all users.":"No unsaved changes."}
              </span>
            </div>
          `:V}
      <dl class="meta">
        <dt>Entity</dt>
        <dd>${t.entityId}</dd>
        <dt>Streaming</dt>
        <dd>${a.entityId}</dd>
        <dt>State</dt>
        <dd>${t.state}</dd>
        <dt>Brand</dt>
        <dd>${t.brand||"—"}</dd>
        <dt>Model</dt>
        <dd>${t.model||"—"}</dd>
      </dl>
      <div class="actions">
        ${i.length?i.map(e=>z`
                <button
                  class="btn primary"
                  type="button"
                  @click=${()=>this._run(e.service,t.entityId)}
                >
                  ${e.label}
                </button>
              `):z`<span class="placeholder">No camera services available</span>`}
        <button
          class="btn"
          type="button"
          @click=${()=>ft(this,t.entityId)}
        >
          More info
        </button>
      </div>
      ${this.panelMode?this._renderSensorSettings(t):V}
    `}_renderSensorSettings(t){const e=this._linksFor(t.entityId),i=function(t,e){const i=t?.states||{};return(e||[]).map(String).filter(t=>bt.has(t.split(".")[0])).map(t=>{const e=i[t];return{entityId:t,name:e?.attributes?.friendly_name||t,kind:$t(t,e),state:String(e?.state??"unknown"),active:St(e),missing:!e}})}(this.hass,e),s=At(this.hass,t.entityId,{deviceIds:this._deviceMap,limit:12}).filter(t=>!e.includes(t.entityId)),a=this._sensorFilter.trim().toLowerCase(),n=a?function(t){const e=t?.states||{};return Object.entries(e).filter(([t,e])=>{const i=t.split(".")[0];return!!bt.has(i)&&("other"!==$t(t,e).id||/detection|object|zone|occupancy|motion/i.test(t))}).map(([t,e])=>({entityId:t,name:e?.attributes?.friendly_name||t,kind:$t(t,e),state:String(e?.state??"unknown"),active:St(e)})).sort((t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}))}(this.hass).filter(t=>!e.includes(t.entityId)).filter(t=>t.entityId.toLowerCase().includes(a)||t.name.toLowerCase().includes(a)||t.kind.label.toLowerCase().includes(a)).slice(0,40):s;return z`
      <section class="sensor-settings" aria-label="Detection sensors">
        <div class="picker-head">
          <strong>Detection sensors</strong>
          <span class="hint">
            Link person / car / animal / package sensors for the timeline and recordings.
            Associations are <strong>shared for all Home Assistant users</strong> (site-wide).
            Suggestions use name + device heuristics; confirm or pick manually.
          </span>
        </div>

        ${i.length?z`
              <div class="sensor-linked">
                ${i.map(e=>z`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${!0}
                        @change=${i=>this._setSensorLinked(t.entityId,e.entityId,i.target.checked)}
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
            `:z`<p class="empty">No sensors linked to this camera yet.</p>`}

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

        ${n.length?z`
              <div class="sensor-candidates">
                <p class="hint">
                  ${a?"Matching sensors":"Suggested associations"}
                </p>
                ${n.map(e=>z`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${!1}
                        @change=${i=>this._setSensorLinked(t.entityId,e.entityId,i.target.checked)}
                      />
                      <span class="sensor-kind kind-${e.kind.id}">${e.kind.label}</span>
                      <span class="sensor-name">${e.name}</span>
                      <span class="sensor-state ${e.active?"on":""}">${e.state}</span>
                      <span class="picker-id">${e.entityId}</span>
                    </label>
                  `)}
              </div>
            `:a?z`<p class="empty">No sensors match “${a}”.</p>`:z`
                <p class="hint">
                  No strong suggestions. Search above to link any binary_sensor/sensor
                  (${vt.map(t=>t.label).join(", ")}).
                </p>
              `}
      </section>
    `}}customElements.get("cctv-view")||customElements.define("cctv-view",Ne);class Re extends rt{static properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1}};constructor(){super(),this._stableConfig=null,this._stablePanelConfigRef=null}createRenderRoot(){return this}get _config(){const t=this.panel?.config||{};if(t===this._stablePanelConfigRef&&this._stableConfig)return this._stableConfig;this._stablePanelConfigRef=t;const{_panel_custom:e,...i}=t;return this._stableConfig={title:"CCTV",max_streams:4,quality:"auto",...i},this._stableConfig}connectedCallback(){super.connectedCallback(),this.style.display="block",this.style.height="100%"}disconnectedCallback(){super.disconnectedCallback();const t=this.querySelector?.("cctv-view");if(t)try{t._setPanelActive?.(!1)}catch{}}render(){return z`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        .panelUrlPath=${this.panel?.url_path||"cctv"}
        panel-mode
      ></cctv-view>
    `}}customElements.get("cctv-dashboard-panel")||customElements.define("cctv-dashboard-panel",Re);class Te extends rt{static properties={hass:{attribute:!1},_config:{attribute:!1}};static styles=ct;static getConfigElement(){return null}static getStubConfig(t){const e=Object.keys(t?.states??{}).filter(t=>t.startsWith("camera.")).slice(0,4);return{title:"CCTV",max_streams:4,quality:"auto",...e.length?{cameras:e}:{}}}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");this._config={title:"CCTV",max_streams:4,quality:"auto",...t}}getCardSize(){const t=this._config?.cameras?.length;return t?Math.max(3,2*Math.ceil(t/2)):6}render(){return this._config?z`
      <ha-card>
        <div class="card-inner">
          <cctv-view .hass=${this.hass} .config=${this._config}></cctv-view>
        </div>
      </ha-card>
    `:z``}}customElements.get("cctv-cameras-card")||customElements.define("cctv-cameras-card",Te),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-cameras-card"===t.type)||window.customCards.push({type:"cctv-cameras-card",name:"CCTV Cameras",preview:!0,description:"Live stream grid of Home Assistant camera entities with detail view and basic controls.",documentationURL:"https://github.com/davies1995/HA-CCTV"});class Oe extends rt{static properties={hass:{attribute:!1},_config:{attribute:!1},_status:{state:!0},_qualityTick:{state:!0}};static styles=ct;static getStubConfig(t){return{entity:Object.keys(t?.states??{}).find(t=>t.startsWith("camera."))||"camera.demo",title:"",muted:!0,quality:"auto"}}constructor(){super(),this._status="",this._qualityTick=0}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");if(!t.entity||!String(t.entity).startsWith("camera."))throw new Error("cctv-camera-card requires a camera.* entity");this._config={muted:!0,quality:"auto",max_streams:4,...t,entity:String(t.entity)}}getCardSize(){return 4}_setQuality(t){jt(this._config.entity,t),this._qualityTick+=1}async _run(t){this._status=`Calling ${t}…`;try{await _t(this.hass,t,this._config.entity),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}render(){if(!this._config||!this.hass)return z``;this._qualityTick;const t=this.hass.states?.[this._config.entity],e=ht(this._config.entity,t),i=this._config.title||e.name,s=gt(this.hass,e),a=Ht(this._config,this._config.entity),n=Ut(this.hass,e,this._config,a,"detail");return z`
      <ha-card>
        <div class="card-inner">
          <div class="top">
            <div>
              <h2>${i}</h2>
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
              .quality=${a}
              context="detail"
              .muted=${!1!==this._config.muted}
              controls
            ></cctv-stream-player>
          </div>
          <div class="quality-row">
            <label>
              Stream quality
              <select
                .value=${a}
                @change=${t=>this._setQuality(t.target.value)}
              >
                ${Dt.map(t=>z`<option value=${t.value}>${t.label}</option>`)}
              </select>
            </label>
            <span class="hint">${zt(a)} · using ${n.entityId}</span>
          </div>
          <div class="actions" style="margin-top: 0.75rem">
            ${s.map(t=>z`
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
    `}}customElements.get("cctv-camera-card")||customElements.define("cctv-camera-card",Oe),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-camera-card"===t.type)||window.customCards.push({type:"cctv-camera-card",name:"CCTV Camera",preview:!0,description:"Live stream for a single Home Assistant camera entity.",documentationURL:"https://github.com/davies1995/HA-CCTV"});const Le="0.17.1";console.info(`%c CCTV-DASHBOARD %c ${Le} `,"color: #fff; background: #1b6ea8; font-weight: 700;","color: #1b6ea8; background: #fff; font-weight: 700;");export{Le as VERSION};
