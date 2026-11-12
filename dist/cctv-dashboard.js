const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(i,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,_=m?m.emptyScript:"",g=p.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!o(t,e),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:a}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);a?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),a=t.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const r=a.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,a){if(void 0!==t){const r=this.constructor;if(!1===i&&(a=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??b)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:a},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==a||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[f("elementProperties")]=new Map,k[f("finalized")]=new Map,g?.({ReactiveElement:k}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=t=>t,S=w.trustedTypes,x=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,I=`<${M}>`,P=document,D=()=>P.createComment(""),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,N="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,O=/>/g,q=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,H=/"/g,W=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),U=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),V=new WeakMap,B=P.createTreeWalker(P,129);function G(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const Q=(t,e)=>{const s=t.length-1,i=[];let a,r=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<s;e++){const s=t[e];let o,c,l=-1,d=0;for(;d<s.length&&(n.lastIndex=d,c=n.exec(s),null!==c);)d=n.lastIndex,n===R?"!--"===c[1]?n=L:void 0!==c[1]?n=O:void 0!==c[2]?(W.test(c[2])&&(a=RegExp("</"+c[2],"g")),n=q):void 0!==c[3]&&(n=q):n===q?">"===c[0]?(n=a??R,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,o=c[1],n=void 0===c[3]?q:'"'===c[3]?H:j):n===H||n===j?n=q:n===L||n===O?n=R:(n=q,a=void 0);const h=n===q&&t[e+1].startsWith("/>")?" ":"";r+=n===R?s+I:l>=0?(i.push(o),s.slice(0,l)+A+s.slice(l)+C+h):s+C+(-2===l?e:h)}return[G(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,r=0;const n=t.length-1,o=this.parts,[c,l]=Q(t,e);if(this.el=K.createElement(c,s),B.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=B.nextNode())&&o.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(A)){const e=l[r++],s=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:a,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(C)&&(o.push({type:6,index:a}),i.removeAttribute(t));if(W.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],D()),B.nextNode(),o.push({type:2,index:++a});i.append(t[e],D())}}}else if(8===i.nodeType)if(i.data===M)o.push({type:2,index:a});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)o.push({type:7,index:a}),t+=C.length-1}a++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===U)return e;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const r=E(e)?void 0:e._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(t),a._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(e=J(t,a._$AS(t,e.values),a,i)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);B.currentNode=i;let a=B.nextNode(),r=0,n=0,o=s[0];for(;void 0!==o;){if(r===o.index){let e;2===o.type?e=new X(a,a.nextSibling,this,t):1===o.type?e=new o.ctor(a,o.name,o.strings,this,t):6===o.type&&(e=new it(a,this,t)),this._$AV.push(e),o=s[++n]}r!==o?.index&&(a=B.nextNode(),r++)}return B.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),E(t)?t===z||null==t||""===t?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==U&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==z&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Z(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const a of t)i===e.length?e.push(s=new X(this.O(D()),this.O(D()),this,this.options)):s=e[i],s._$AI(a),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,a){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=z}_$AI(t,e=this,s,i){const a=this.strings;let r=!1;if(void 0===a)t=J(this,t,e,0),r=!E(t)||t!==this._$AH&&t!==U,r&&(this._$AH=t);else{const i=t;let n,o;for(t=a[0],n=0;n<a.length-1;n++)o=J(this,i[s+n],e,n),o===U&&(o=this._$AH[n]),r||=!E(o)||o!==this._$AH[n],o===z?t=z:t!==z&&(t+=(o??"")+a[n+1]),this._$AH[n]=o}r&&!i&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class st extends Y{constructor(t,e,s,i,a){super(t,e,s,i,a),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??z)===U)return;const s=this._$AH,i=t===z&&s!==z||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==z&&(s===z||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(K,X),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;let nt=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let a=i._$litPart$;if(void 0===a){const t=s?.renderBefore??null;i._$litPart$=a=new X(e.insertBefore(D(),t),t,void 0,s??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ot=rt.litElementPolyfillSupport;ot?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.2");let ct=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const lt={},dt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ct{constructor(){super(...arguments),this.key=z}render(t,e){return this.key=t,e}update(t,[e,s]){return e!==this.key&&(((t,e=lt)=>{t._$AH=e})(t),this.key=e),s}}),ht=r`
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
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    background: #0a0e13;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
  }

  /*
   * Trigger-cam highlight during detection playback: pointer-events none overlay
   * only — never rewrite tile class/style or video src/kick.
   */
  .layout-tile .trigger-cam-overlay {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: 3px solid var(--cctv-trigger-color, var(--cctv-accent));
    pointer-events: none;
    z-index: 2;
  }

  .layout-tile .trigger-cam-overlay.kind-person {
    --cctv-trigger-color: #5eb1ff;
  }
  .layout-tile .trigger-cam-overlay.kind-car {
    --cctv-trigger-color: #f0b45a;
  }
  .layout-tile .trigger-cam-overlay.kind-animal {
    --cctv-trigger-color: #7dcf8a;
  }
  .layout-tile .trigger-cam-overlay.kind-package {
    --cctv-trigger-color: #c9a0ff;
  }
  .layout-tile .trigger-cam-overlay.kind-bicycle {
    --cctv-trigger-color: #67d5c8;
  }
  .layout-tile .trigger-cam-overlay.kind-motion {
    --cctv-trigger-color: #e6d36a;
  }
  .layout-tile .trigger-cam-overlay.kind-other {
    --cctv-trigger-color: #8b9aab;
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

  .settings-debug {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--cctv-border);
  }

  .settings-debug .picker-head {
    margin-bottom: 0.35rem;
  }

  .settings-debug-text {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 0.5rem;
    font: 0.75rem/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    color: var(--primary-text-color, #e8eef5);
    background: var(--primary-background-color, #0f1419);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.55rem 0.65rem;
    resize: vertical;
    white-space: pre;
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

  .group-badge {
    display: inline-block;
    margin-left: 0.35rem;
    padding: 0.05rem 0.4rem;
    border-radius: 4px;
    border: 1px solid var(--cctv-border);
    background: color-mix(in srgb, var(--cctv-accent) 16%, transparent);
    color: var(--cctv-muted);
    font-size: 0.72rem;
    font-weight: 600;
    vertical-align: middle;
  }

  .picker-group,
  .picker-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    align-items: stretch;
  }

  .picker-group-main {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
  }

  .picker-stream-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem 0.75rem;
    margin-left: 1.55rem;
  }

  .picker-stream-controls label {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    font-size: 0.78rem;
    color: var(--cctv-muted);
  }

  .picker-stream-controls select {
    min-width: 10rem;
    max-width: 100%;
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
`,ut=new Set(["unavailable","unknown","none",""]),pt=[{service:"turn_on",label:"Turn on",feature:1},{service:"turn_off",label:"Turn off",feature:1},{service:"toggle",label:"Toggle",feature:1},{service:"snapshot",label:"Snapshot"},{service:"enable_motion_detection",label:"Motion on",attr:"motion_detection",attrValue:!1},{service:"disable_motion_detection",label:"Motion off",attr:"motion_detection",attrValue:!0}];function mt(t,e){const s=e?.attributes??{};return{entityId:t,stateObj:e,state:e?.state??"unknown",name:s.friendly_name||t,brand:s.brand,model:s.model,frontendStreamType:s.frontend_stream_type,supportedFeatures:Number(s.supported_features||0),unavailable:!e||ut.has(String(e.state).trim().toLowerCase())}}function _t(t){return Boolean(2&t?.supportedFeatures)}async function gt(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/capabilities",entity_id:e})}catch{return null}}async function ft(t,e){if(!t?.callWS)return"";const s=await t.callWS({type:"camera/stream",entity_id:e}),i=s?.url||"";return i?"function"==typeof t.hassUrl?t.hassUrl(i):i:""}async function yt(t,e,s,i={}){if(!t?.callService)throw new Error("hass.callService is unavailable");return t.callService("camera",e,{entity_id:s,...i})}function bt(t,e){const s=t?.services?.camera||{},i=Number(e?.supportedFeatures||0),a=e?.stateObj?.attributes||{};return pt.filter(t=>{if(!s[t.service])return!1;if(null!=t.feature&&i&&0===(i&t.feature))return!1;if(t.attr){if(!(t.attr in a))return!1;if(null!=t.attrValue&&Boolean(a[t.attr])!==t.attrValue)return!1}return!0}).map(({service:t,label:e})=>({service:t,label:e}))}function vt(t,e){if(!e)return;const s=new Event("hass-more-info",{bubbles:!0,composed:!0});s.detail={entityId:e},t.dispatchEvent(s)}function kt(t){return t?Array.isArray(t)?t.map(String).map(t=>t.trim()).filter(Boolean):String(t).split(",").map(t=>t.trim()).filter(Boolean):[]}const wt=[{id:"person",label:"Person",tokens:["person","people","human","pedestrian","face"]},{id:"car",label:"Car",tokens:["car","vehicle","automobile","auto"]},{id:"animal",label:"Animal",tokens:["animal","pet","dog","cat","wildlife"]},{id:"package",label:"Package",tokens:["package","parcel","delivery","amazon"]},{id:"bicycle",label:"Bicycle",tokens:["bicycle","bike","cyclist"]},{id:"motion",label:"Motion",tokens:["motion","occupancy","presence","moving"]},{id:"other",label:"Other",tokens:["detection","object","zone"]}],$t=new Set(["binary_sensor","sensor"]),St=new Set(["on","true","detected","active","1","home"]);function xt(t,e){return e.some(e=>new RegExp(`(^|[_\\s.-])${e}([_\\s.-]|$)`,"i").test(t))}function At(t,e){const s=`${t} ${e?.attributes?.friendly_name||""}`.toLowerCase();for(const t of wt)if("other"!==t.id&&xt(s,t.tokens))return{id:t.id,label:t.label};return{id:"other",label:"Other"}}function Ct(t){if(!t)return!1;const e=String(t.state??"").trim().toLowerCase();if(St.has(e))return!0;const s=Number(e);return Number.isFinite(s)&&s>0}function Mt(t,e,s){const i=String(t||"").replace(/^camera\./i,"").replace(/_(main|hi|high|primary)$/i,"").toLowerCase();if(!i)return 0;const a=String(e).toLowerCase(),r=String(s?.attributes?.friendly_name||"").toLowerCase(),n=`${a} ${r}`;let o=0;const c=a.replace(/^(binary_sensor|sensor)\./,"");if(c===i||c.startsWith(`${i}_`)?o+=50:c.includes(i)&&(o+=25),r.includes(i.replace(/_/g," "))&&(o+=15),o<=0)return 0;let l=o;return"other"!==At(e,s).id?l+=20:xt(n,["detection","object","zone","motion","occupancy"])&&(l+=8),a.startsWith("binary_sensor.")&&(l+=5),l}function It(t,e,s={}){const i=t?.states||{},a=s.limit??24,r=s.deviceIds,n=r?.get(e),o=[];for(const[t,s]of Object.entries(i)){const i=t.split(".")[0];if(!$t.has(i))continue;let a=Mt(e,t,s);if(n&&r?.get(t)===n&&(a+=40),a<20)continue;const c=At(t,s);o.push({entityId:t,name:s?.attributes?.friendly_name||t,kind:c,score:a,state:String(s?.state??"unknown"),active:Ct(s)})}return o.sort((t,e)=>e.score-t.score||t.name.localeCompare(e.name)),o.slice(0,a)}function Pt(t){if(!t||"object"!=typeof t||Array.isArray(t))return{};const e={};for(const[s,i]of Object.entries(t))String(s).startsWith("camera.")&&Array.isArray(i)&&(e[s]=[...new Set(i.map(String).filter(t=>$t.has(t.split(".")[0])))].slice(0,16));return e}function Dt(t){return{start:t.start,end:t.end,cameras:[...t.cameras||[]],sensors:[...t.sensors||[]]}}function Et(t,e){const s=new Set(t.cameras);for(const t of e.cameras||[])s.add(t);t.cameras=[...s];const i=new Map((t.sensors||[]).map(t=>[t.entityId,t]));for(const t of e.sensors||[])t?.entityId&&i.set(t.entityId,t);t.sensors=[...i.values()]}function Tt(t){const e=Math.max(0,Math.round(t/1e3));if(e<60)return`${e}s`;const s=Math.floor(e/60),i=e%60;if(s<60)return i?`${s}m ${i}s`:`${s}m`;const a=Math.floor(s/60),r=s%60;return r?`${a}h ${r}m`:`${a}h`}function Nt(t){try{return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return""}}function Rt(t){if(!Array.isArray(t))return[];const e=[],s=new Set;for(const i of t){if(!i||"object"!=typeof i||Array.isArray(i))continue;const t=[];for(const e of i.members||[]){const i=String(e||"");if(i.startsWith("camera.")&&!s.has(i)&&!t.includes(i)&&(s.add(i),t.push(i),t.length>=8))break}if(t.length<2)continue;const a=String(i.id||"").trim(),r=a&&/^[a-zA-Z0-9._-]+$/.test(a)?a.slice(0,64):`grp_${t[0].replace(/^camera\./,"").slice(0,40)}`,n=String(i.name||"").trim().slice(0,64)||t[0].replace(/^camera\./,"").replace(/_/g," ");if(e.push({id:r,name:n,members:t}),e.length>=32)break}return e}function Lt(t,e){const s=String(e||"");if(!s.startsWith("camera."))return null;for(const e of t||[])if((e.members||[]).includes(s))return e;return null}function Ot(t,e){const s=Lt(t,e);if(s?.members?.length)return[...s.members];const i=String(e||"");return i.startsWith("camera.")?[i]:[]}const qt=["_fluent","_sub","_lq","_low","_sd","_substream"];function jt(t,e){const s=String(t||""),i=[...new Set((e||[]).map(String))].filter(t=>t.startsWith("camera.")&&t!==s),a=[],r=[];for(const t of i){const e=t.replace(/^camera\./,"");qt.some(t=>e.endsWith(t))?a.push(t):r.push(t)}return[...a,...r]}function Ht(t,e){const s={...t||{}};for(const t of e||[]){const e=(t.members||[]).filter(t=>String(t).startsWith("camera."));if(e.length<2)continue;const i=new Set;for(const t of e)for(const e of s[t]||[])e&&i.add(String(e));const a=[...i].slice(0,16);for(const t of e)a.length?s[t]=[...a]:delete s[t]}return s}function Wt(t,e,s){const i=String(s||"");if(!i)return[];const a=[];for(const[e,s]of Object.entries(t||{}))String(e).startsWith("camera.")&&(s||[]).map(String).includes(i)&&a.push(e);const r=new Set;for(const t of a)for(const s of Ot(e,t))r.add(s);return[...r].sort()}const Ft=[{value:"auto",label:"Auto",help:"High for detail, prefer low/substream in the mosaic when available."},{value:"high",label:"High",help:"Main camera entity; prefer WebRTC/HLS."},{value:"balanced",label:"Balanced",help:"Main entity; prefer HA native / WebRTC, then HLS/MJPEG."},{value:"low",label:"Low",help:"Substream entity when available, else MJPEG on the main camera."}],Ut=["_sub","_lq","_low","_fluent","_sd","_substream"],zt="cctv-dashboard:quality:",Vt=new Set(Ft.map(t=>t.value));function Bt(t){const e=String(t||"auto").toLowerCase();return Vt.has(e)?e:"auto"}function Gt(t){if(!t||"object"!=typeof t)return{};const e={};for(const[s,i]of Object.entries(t)){if(!String(s).startsWith("camera."))continue;const t=Bt(i);"auto"!==t&&(e[s]=t)}return e}function Qt(t,e){const s=t?.camera_settings||t?.cameras_settings||{},i=s?.[e]||s?.[e?.toLowerCase?.()]||{},a={};return t?.entity&&t.entity===e&&(t.low_entity&&(a.low_entity=t.low_entity),t.high_entity&&(a.high_entity=t.high_entity),t.substream_entity&&(a.substream_entity=t.substream_entity),t.main_entity&&(a.main_entity=t.main_entity)),{...a,...i}}function Kt(t){try{const e=localStorage.getItem(zt+t);return e?Bt(e):null}catch{return null}}function Jt(t,e){try{localStorage.setItem(zt+t,Bt(e))}catch{}}function Zt(t,e,s=null,i=null){if(s){const t=function(t,e,s=null){if(!t||"object"!=typeof t)return null;const i=String(e||"");if(t[i])return Bt(t[i]);for(const e of s||[])if(e&&e!==i&&t[e])return Bt(t[e]);return null}(s,e,i);if(t)return t}else{const t=Kt(e);if(t)return t;for(const t of i||[]){if(!t||t===e)continue;const s=Kt(t);if(s)return s}}const a=Qt(t,e);return a.quality?Bt(a.quality):t?.quality?Bt(t.quality):"auto"}function Xt(t,e,s,i,a="mosaic",r=null){const n=Bt(i),o=Qt(s,e.entityId),c=t?.states||{},l=o.high_entity||o.main_entity||e.entityId,d=o.low_entity||o.substream_entity||function(t,e){const s=String(e||""),i=[...new Set((t||[]).map(String))].filter(t=>t.startsWith("camera."));for(const t of qt){const e=i.find(e=>e!==s&&e.replace(/^camera\./,"").endsWith(t));if(e)return e}return i.find(t=>t!==s)||""}(r,e.entityId)||function(t,e,s){const i=t?.states||{},a=e.replace(/^camera\./,"");for(const t of s){const e=`camera.${a}${t}`;if(i[e])return e;const s=`camera.${a.replace(/_main$/,"")}${t}`;if(s!==e&&i[s])return s}return""}(t,e.entityId,Ut)||"";let h=e.entityId;return h="high"===n?l:"low"===n?d||l:"auto"===n&&"mosaic"===a&&d?d:l,c[h]||(h=e.entityId),mt(h,c[h])}function Yt(t){return Ft.find(e=>e.value===Bt(t))?.help||""}const te=16/9,ee=[{value:"auto",label:"Auto (detect)",ratio:null},{value:"16:9",label:"16:9 landscape",ratio:16/9},{value:"9:16",label:"9:16 portrait",ratio:9/16},{value:"4:3",label:"4:3 landscape",ratio:4/3},{value:"3:4",label:"3:4 portrait",ratio:3/4},{value:"1:1",label:"1:1 square",ratio:1},{value:"3:2",label:"3:2 landscape",ratio:1.5},{value:"2:3",label:"2:3 portrait",ratio:2/3},{value:"custom",label:"Custom W:H…",ratio:null}],se=/^(\d+(?:\.\d+)?)[:x×*](\d+(?:\.\d+)?)$/i;function ie(t){let e=String(t||"").trim().toLowerCase().replace(/\s+/g,"").replace(/×/g,"x").replace(/\*/g,"x");if(!e||"auto"===e||"default"===e||"none"===e||"custom"===e)return"auto";if(ee.some(t=>t.value===e&&"custom"!==t.value))return e;const s=se.exec(e);if(!s)return"auto";const i=Number(s[1]),a=Number(s[2]);return!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0||i/a<.05||i/a>20?"auto":Number.isInteger(i)&&Number.isInteger(a)?`${i}:${a}`:`${Number(i.toPrecision(12))}:${Number(a.toPrecision(12))}`}function ae(t){const e=ie(t);if("auto"===e)return null;const s=ee.find(t=>t.value===e);if(s?.ratio)return s.ratio;const[i,a]=e.split(":").map(Number);return!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0?null:i/a}function re(t){const e=ie(t);return"auto"===e||ee.some(t=>t.value===e&&"custom"!==t.value)}function ne(t){const e=ie(t);return"auto"===e?"auto":re(e)?e:"custom"}function oe(t){if(!t||"object"!=typeof t)return{};const e={};for(const[s,i]of Object.entries(t)){if(!String(s).startsWith("camera."))continue;const t=ie(i);"auto"!==t&&(e[s]=t)}return e}function ce(t,e,s=null){if(!t||"object"!=typeof t)return"auto";const i=String(e||"");if(t[i])return ie(t[i]);for(const e of s||[])if(e&&e!==i&&t[e])return ie(t[e]);return"auto"}function le(t,e,s,i=null){const a=ie(s),r=[...new Set([...i||[],e].map(String).filter(t=>t.startsWith("camera.")))],n={...t||{}};for(const t of r)"auto"===a?delete n[t]:n[t]=a;return oe(n)}function de(t){const e=Number(t);return!Number.isFinite(e)||e<=.05||e>20?te:e}function he(t,e,s,i){if(!t.length||e<=0||s<=0)return null;const a=Math.max(0,t.length-1)*i,r=s-a;if(r<=0)return null;const n=t.map(t=>{const s=t.reduce((t,e)=>t+e.aspect,0),a=Math.max(0,t.length-1)*i,r=e-a;return s<=0||r<=0?0:r/s});if(n.some(t=>t<=0))return null;const o=n.reduce((t,e)=>t+e,0),c=Math.min(1,r/o),l=n.map(t=>t*c),d=[];let h=(s-(l.reduce((t,e)=>t+e,0)+a))/2;t.forEach((t,s)=>{const a=l[s],r=t.map(t=>t.aspect*a),n=r.reduce((t,e)=>t+e,0)+Math.max(0,t.length-1)*i;let o=(e-n)/2;t.forEach((t,e)=>{d.push({id:t.id,left:o,top:h,width:r[e],height:a,aspect:t.aspect}),o+=r[e]+i}),h+=a+i});const u=d.reduce((t,e)=>t+e.width*e.height,0);return{cells:d,totalArea:u}}function ue(t,e,s,i){const a=t.map(t=>t.map(t=>({id:t.id,aspect:1/t.aspect}))),r=he(a,s,e,i);return r?{totalArea:r.totalArea,cells:r.cells.map(t=>({id:t.id,left:t.top,top:t.left,width:t.height,height:t.width,aspect:1/t.aspect}))}:null}async function pe(t){if(!t?.callWS)return null;try{const e=await t.callWS({type:"cctv_dashboard/get_settings"});if(!e||"object"!=typeof e)return null;const s=Rt(e.stream_groups||[]),i=Ht(Pt(e.sensor_links||{}),s);return{...e,sensorLinks:i,streamGroups:s,forceAspect:oe(e.force_aspect||{}),cameraQuality:Gt(e.camera_quality||{})}}catch(t){return console.warn("CCTV: failed to load shared config",t),null}}async function me(t,e){if(!t?.callWS)return null;const s=Pt(e);return t.callWS({type:"cctv_dashboard/set_sensor_links",sensor_links:s})}async function _e(t,e){return t?.callWS?t.callWS({type:"cctv_dashboard/set_settings",...e}):null}async function ge(t,e=40){if(!t?.callWS)return[];try{const s=await t.callWS({type:"cctv_dashboard/list_recordings",limit:e});return s?.sessions||[]}catch(t){return console.warn("CCTV: failed to list recordings",t),[]}}function fe(t,e){return e?"function"==typeof t?.hassUrl?t.hassUrl(e):e:""}function ye(t){if(!t)return"";let e=String(t);try{/^https?:\/\//i.test(e)&&(e=new URL(e).pathname)}catch{}e=e.split("?")[0].split("#")[0],e.startsWith("/")||(e=`/${e}`);const s="/cctv_dashboard_recordings/";if(e.startsWith(s)){const t=e.slice(27).split("/").pop();t&&(e=`/api/cctv_dashboard/media/${t}`)}return e}function be(t){const e="/api/cctv_dashboard/media/",s=[t?.url,t?.path,t?.filePath];for(const t of s){if(!t)continue;let s=String(t);try{/^https?:\/\//i.test(s)&&(s=new URL(s).pathname)}catch{}if(s=s.split("?")[0].split("#")[0],s.includes(e)||s.includes("/cctv_dashboard_recordings/"))return ye(s)}for(const t of s){if(!t)continue;const s=String(t).split("?")[0].split("/").pop();if(s&&/\.(mp4|m4v|webm|jpg|jpeg|png|webp)$/i.test(s))return`${e}${s}`}return ye(t?.url||t?.path||"")}async function ve(t,e,s=3600){if(!e)return"";const i=ye(e);if(!i)return"";if(!t?.callWS)throw new Error("Home Assistant WebSocket unavailable for auth/sign_path");const a=await t.callWS({type:"auth/sign_path",path:i,expires:s}),r=a?.path;if("string"!=typeof r||!r.includes("authSig"))throw new Error(`auth/sign_path returned no authSig for ${i}`);return"function"==typeof t.hassUrl?t.hassUrl(r):r}const ke={person:"#5eb1ff",car:"#f0b45a",animal:"#7dcf8a",package:"#c9a0ff",bicycle:"#67d5c8",motion:"#e6d36a",other:"#8b9aab"};function we(t){const e=String(t||"").toLowerCase();return ke[e]||ke.other}function $e(t,e,s=null){const i=new Set((e||[]).map(String).filter(Boolean));if(!i.size)return[];if(s?.length){const e=new Set;for(const a of i)for(const i of Wt(t,s,a))e.add(i);return[...e]}const a=[];for(const[e,s]of Object.entries(t||{}))String(e).startsWith("camera.")&&(s||[]).some(t=>i.has(String(t)))&&a.push(e);return a}function Se(t,e,s,i=null,a=null){const r={},n=(t,e)=>{const s=String(t||"");if(!s.startsWith("camera.")||r[s])return;const i=String(e||"other").toLowerCase();r[s]={kindId:i,color:we(i)}},o=i?.kind?.id;if(o&&Array.isArray(i?.cameras))for(const t of i.cameras)n(t,o);const c=[...e?.trigger_sensors||[],...(i?.sensors||[]).map(t=>t?.entityId).filter(Boolean)];for(const e of c){const i=At(e,t?.states?.[e]);for(const t of $e(s,[e],a))n(t,i.id)}return r}function xe(t){const e=Number(t)||0;return e<1024?`${e} B`:e<1048576?`${(e/1024).toFixed(e<10240?1:0)} KB`:e<1073741824?`${(e/1048576).toFixed(e<10485760?1:0)} MB`:`${(e/1073741824).toFixed(1)} GB`}function Ae(t,e){const s=[],i=new Set;for(const a of e||[]){const e=t?.states?.[a],r=At(a,e);i.has(r.id)||(i.add(r.id),s.push(r.label))}return s.length?s:["Detection"]}function Ce(t){return Number.isFinite(t?.total_bytes)?Number(t.total_bytes):(t?.clips||[]).reduce((t,e)=>t+(Number(e.size)||0),0)}function Me(t){if(null==t||""===t)return NaN;if("number"==typeof t)return Number.isFinite(t)?t:NaN;if(t instanceof Date)return t.getTime();const e=String(t).trim(),s=e.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/i);if(s){const t=`${s[1]}-${s[2]}-${s[3]}T${s[4]}:${s[5]}:${s[6]}Z`;return Date.parse(t)}return Date.parse(e)}function Ie(t){return!!t&&(!("size"in(t||{})&&Number(t.size)<=0)&&("snapshot"===t.kind||(Number(t.size)>0||!("size"in(t||{})))))}function Pe(t){const e=Array.isArray(t)?t:[],s=e.filter(t=>t&&"snapshot"!==t.kind);return s.length?s:e}function De(t){return!(!t||t.active)&&(Ce(t)>0||(t.clips||[]).some(Ie))}function Ee(t){const e=String(t?.camera_id||"").trim();if(e.startsWith("camera."))return e;const s=String(t?.path||t?.url||"").split("?")[0].split("/").pop();if(!s)return"";const i=s.match(/^(\d{8}T\d{6}Z_[a-f0-9]{8})_(.+)_(\d{3})_(\d{8}T\d{6}Z)\.(?:mp4|jpg|jpeg|webp)$/i);return i?`camera.${i[2]}`:""}function Te(t){const e=new Map;for(const s of t?.clips||[]){const t=Ee(s);t&&!e.get(t)&&(Ie(s)&&e.set(t,!0))}const s=Array.isArray(t?.cameras)?t.cameras.map(String).filter(t=>e.has(t)):[];if(s.length){for(const t of e.keys())s.includes(t)||s.push(t);return s}return[...e.keys()]}function Ne(t,e,s=null){const i=new Map;for(const t of e?.clips||[]){const e=Ee(t);e&&(i.has(e)||i.set(e,[]),i.get(e).push(t))}let a;if(s&&s.length)a=s.map(String);else{const s=Te(e);a=s.length?s:[...i.keys()].sort((e,s)=>{const i=t?.states?.[e]?.attributes?.friendly_name||e.replace(/^camera\./,""),a=t?.states?.[s]?.attributes?.friendly_name||s.replace(/^camera\./,"");return i.localeCompare(a)})}return a.map(e=>{const s=[...i.get(e)||[]].sort((t,e)=>Number(t.seq||0)-Number(e.seq||0));return{cameraId:e,name:t?.states?.[e]?.attributes?.friendly_name||e.replace(/^camera\./,""),items:Pe(s.filter(Ie)).map(e=>{const s=function(t){const e=Me(t?.started),s=Number(t?.duration),i=Number.isFinite(s)&&s>0?1e3*s:3e4;return{start:e,end:Number.isFinite(e)?e+i:NaN,durationMs:i}}(e),i=String(e.url||"");return{path:i,url:fe(t,i),kind:"snapshot"===e.kind?"snapshot":"video",size:Number(e.size)||0,seq:Number(e.seq)||0,started:e.started,startedMs:s.start,durationMs:s.durationMs,endMs:s.end,fallback_reason:e.fallback_reason||"",filePath:e.path||""}})}})}function Re(t,e){const s=t?.items||[];if(!s.length||!Number.isFinite(e))return{index:0,seekSec:0};for(let t=0;t<s.length;t+=1){const i=s[t],a=Number(i.startedMs),r=Number(i.endMs);if(Number.isFinite(a)){if(e<a)return{index:t,seekSec:0};if(!Number.isFinite(r)||e<r){return{index:t,seekSec:Math.max(0,(e-a)/1e3)}}}}return{index:Math.max(0,s.length-1),seekSec:0}}const Le="cctv_dashboard";async function Oe(t){if(!t?.callWS)return null;try{const e=await t.callWS({type:"frontend/get_user_data",key:Le}),s=e?.value??e;if(!s||"object"!=typeof s)return null;const i=Array.isArray(s.selectedCameras)?s.selectedCameras.map(String).filter(t=>t.startsWith("camera.")):[];return{selectedCameras:i,legacySensorLinks:s.sensorLinks&&"object"==typeof s.sensorLinks?s.sensorLinks:null}}catch(t){return console.warn("CCTV: failed to load panel user data",t),null}}async function qe(t,e,s={}){if(!t?.callWS)return;const i=[...new Set(e.map(String).filter(t=>t.startsWith("camera.")))].slice(0,4),a={selectedCameras:i};s.clearLegacySensorLinks;try{await t.callWS({type:"frontend/set_user_data",key:Le,value:a})}catch(t){throw console.warn("CCTV: failed to save panel selection",t),t}return{selectedCameras:i}}const je=100,He=50;const We=new class{constructor(t=4){this.max=t,this.holders=new Map,this.queue=[]}setMax(t){const e=Math.max(1,Number(t)||4);if(e!==this.max)for(this.max=e,this._drain();this.holders.size>this.max;)this._revokeLowest()}activeCount(){return this.holders.size}has(t){return this.holders.has(t)}request(t,e,{onGrant:s,onRevoke:i}){if(!t)return!1;if(this.holders.has(t)){const s=this.holders.get(t);return s.priority=e,s.onRevoke=i,this.queue=this.queue.filter(e=>e.id!==t),!0}const a=this.queue.find(e=>e.id===t);if(a)return a.priority=e,a.onGrant=s,a.onRevoke=i,this._drain(),this.holders.has(t);if(this.holders.size<this.max)return this.holders.set(t,{priority:e,onRevoke:i}),!0;const r=this._lowestHolder();return r&&e>r.priority?(this._revoke(r.id),this.holders.set(t,{priority:e,onRevoke:i}),!0):(this.queue.push({id:t,priority:e,onGrant:s,onRevoke:i}),this.queue.sort((t,e)=>e.priority-t.priority),!1)}release(t){t&&(this.queue=this.queue.filter(e=>e.id!==t),this.holders.has(t)&&(this.holders.delete(t),this._drain()))}releaseAll(){this.holders.clear(),this.queue=[]}_lowestHolder(){let t=null;for(const[e,s]of this.holders)(!t||s.priority<t.priority)&&(t={id:e,priority:s.priority});return t}_revoke(t){const e=this.holders.get(t);if(e){this.holders.delete(t);try{e.onRevoke?.()}catch(t){console.warn("CCTV stream slot revoke failed",t)}}}_revokeLowest(){const t=this._lowestHolder();t&&this._revoke(t.id)}_drain(){for(;this.holders.size<this.max&&this.queue.length;){const t=this.queue.shift();this.holders.set(t.id,{priority:t.priority,onRevoke:t.onRevoke});try{t.onGrant?.()}catch(e){console.warn("CCTV stream slot grant failed",e),this.holders.delete(t.id)}}}}(4),Fe="cctv_dashboard:tv_mode",Ue=16/9;function ze(t=("undefined"!=typeof document?document:null)){let e=56,s=0;try{const i=t?.documentElement;if(i){const t=getComputedStyle(i);e=parseFloat(t.getPropertyValue("--app-header-height"))||e,s=parseFloat(t.getPropertyValue("--cctv-kiosk-inset"))||0}}catch{}return Math.max(0,e+0+0+s+56+12)}function Ve(t){if(!t||"number"!=typeof t.clientWidth)return 0;let e=0;try{if("function"==typeof getComputedStyle){const s=getComputedStyle(t);e=(parseFloat(s.paddingLeft)||0)+(parseFloat(s.paddingRight)||0)}}catch{}return Math.max(0,t.clientWidth-e)}class Be extends nt{static properties={hass:{attribute:!1},camera:{attribute:!1},config:{attribute:!1},quality:{type:String},context:{type:String},muted:{type:Boolean},controls:{type:Boolean},large:{type:Boolean,reflect:!0},mosaic:{type:Boolean,reflect:!0},eager:{type:Boolean},posterOnly:{type:Boolean,attribute:"poster-only"},active:{type:Boolean},failoverEntityIds:{attribute:!1},groupMembers:{attribute:!1},_mode:{state:!0},_error:{state:!0},_hlsUrl:{state:!0},_mjpegUrl:{state:!0},_stillUrl:{state:!0},_visible:{state:!0},_slotHeld:{state:!0},_queued:{state:!0},_tileAspect:{state:!0},_failoverEntityId:{state:!0}};static styles=r`
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
  `;constructor(){super(),this.config={},this.quality="",this.context="mosaic",this.muted=!0,this.controls=!1,this.large=!1,this.mosaic=!1,this.eager=!1,this.posterOnly=!1,this.active=!0,this.failoverEntityIds=[],this.groupMembers=[],this._mode="loading",this._error="",this._hlsUrl="",this._mjpegUrl="",this._stillUrl="",this._visible=!1,this._slotHeld=!1,this._queued=!1,this._failoverEntityId="",this._failoverTried=new Set,this._pc=null,this._unsubWebRtc=null,this._sessionId=null,this._startToken=0,this._observer=null,this._hostRo=null,this._slotId="",this._streamCamera=null,this._stableStateObj=null,this._tileAspect=0,this._lastEmittedAspect=0}connectedCallback(){super.connectedCallback(),this._bindObserver(),this._bindHostResize(),this._bindDocumentVisibility(),this.active?this._reconcilePlayback():this._unloadCompletely()}disconnectedCallback(){super.disconnectedCallback(),this._unbindObserver(),this._unbindHostResize(),this._unbindDocumentVisibility(),this._unloadCompletely()}_bindDocumentVisibility(){this._unbindDocumentVisibility(),"undefined"!=typeof document&&(this._onDocVisibility=()=>{this.active&&this._reconcilePlayback()},document.addEventListener("visibilitychange",this._onDocVisibility))}_unbindDocumentVisibility(){this._onDocVisibility&&"undefined"!=typeof document&&document.removeEventListener("visibilitychange",this._onDocVisibility),this._onDocVisibility=null}shouldUpdate(t){for(const e of t.keys()){if(e.startsWith("_"))return!0;if(!["hass","camera","config"].includes(e))return!0}return!(!t.has("hass")||!this._cameraHassChanged(t.get("hass"),this.hass))||(!(!t.has("camera")||!this._cameraMeaningful(t.get("camera"),this.camera))||!(!t.has("config")||!this._configMeaningful(t.get("config"),this.config)))}updated(t){if((t.has("eager")||t.has("posterOnly"))&&this._bindObserver(),(t.has("large")||t.has("mosaic"))&&this._bindHostResize(),t.has("active")&&!this.active)return void this._unloadCompletely();const e=t.has("hass")&&this._cameraHassChanged(t.get("hass"),this.hass),s=t.has("camera")&&this._cameraMeaningful(t.get("camera"),this.camera),i=t.has("config")&&this._configMeaningful(t.get("config"),this.config);if((t.has("camera")||t.has("failoverEntityIds")||t.has("groupMembers"))&&(this._failoverTried=new Set,this._failoverEntityId=""),(e||s||i||t.has("quality")||t.has("context")||t.has("eager")||t.has("posterOnly")||t.has("failoverEntityIds")||t.has("groupMembers")||t.has("active")&&this.active)&&this._reconcilePlayback(),t.has("muted")){const t=this.renderRoot?.querySelector("video");t&&(t.muted=this.muted)}(t.has("_mode")||s||t.has("_tileAspect"))&&this.updateComplete.then(()=>{this._probeMediaSize(),this._forceNestedContain()})}_cameraHassChanged(t,e){const s=this._streamCamera?.entityId||this.camera?.entityId;if(!s)return!0;const i=t?.states?.[s],a=e?.states?.[s];if(i===a)return!1;if(!i||!a)return!0;const r=t=>!t||["unavailable","unknown"].includes(String(t.state).trim().toLowerCase());return r(i)!==r(a)||i.attributes?.access_token!==a.attributes?.access_token}_cameraMeaningful(t,e){return t!==e&&(!t||!e||(t.entityId!==e.entityId||Boolean(t.unavailable)!==Boolean(e.unavailable)||t.stateObj?.attributes?.access_token!==e.stateObj?.attributes?.access_token))}_configMeaningful(t,e){return t!==e&&(!t||!e||(t.max_streams!==e.max_streams||t.quality!==e.quality||JSON.stringify(t.camera_settings||null)!==JSON.stringify(e.camera_settings||null)||JSON.stringify(t.cameras_settings||null)!==JSON.stringify(e.cameras_settings||null)))}_bindHostResize(){this._unbindHostResize(),this._updateTileAspect(),"undefined"!=typeof ResizeObserver&&(this._hostRo=new ResizeObserver(()=>this._updateTileAspect()),this._hostRo.observe(this))}_unbindHostResize(){this._hostRo&&(this._hostRo.disconnect(),this._hostRo=null)}_updateTileAspect(){const t=this.clientWidth,e=this.clientHeight;if(!Number.isFinite(t)||!Number.isFinite(e)||t<2||e<2)return;const s=t/e;this._tileAspect&&Math.abs(this._tileAspect-s)<.005||(this._tileAspect=s)}_forceNestedContain(){if(!this.mosaic&&!this.large||"ha"!==this._mode)return;const t=this.renderRoot?.querySelector("ha-camera-stream"),e=t?.shadowRoot;e&&e.querySelectorAll("video, img").forEach(t=>{t.style.objectFit="contain",t.style.objectPosition="center",t.style.width="100%",t.style.height="100%",t.style.maxWidth="100%",t.style.maxHeight="100%"})}get _effectiveQuality(){return this.quality?this.quality:Zt(this.config,this.camera?.entityId)}get _priority(){return this.eager?je:He}_bindObserver(){this._unbindObserver(),this.eager||this.posterOnly?this._visible=!0:"undefined"!=typeof IntersectionObserver?(this._observer=new IntersectionObserver(t=>{const e=t.some(t=>t.isIntersecting);e!==this._visible&&(this._visible=e,this._reconcilePlayback())},{root:null,rootMargin:"120px 0px",threshold:.15}),this._observer.observe(this)):this._visible=!0}_unbindObserver(){this._observer&&(this._observer.disconnect(),this._observer=null)}_wantsLive(){return!!this.active&&(("undefined"==typeof document||!document.hidden)&&(!this.posterOnly&&(!!this.eager||this._visible)))}_refreshPosterUrls(t,{cacheBust:e=!1}={}){const s=t||this.camera;if(!this.hass||!s?.stateObj)return this._stillUrl="",void(this._mjpegUrl="");const i=function(t,e,s=!0){if(!t||!e?.stateObj)return"";const i=e.stateObj.attributes||{};let a=i.entity_picture;if(!a&&i.access_token&&(a=`/api/camera_proxy/${e.entityId}?token=${i.access_token}`),!a)return"";const r="function"==typeof t.hassUrl?t.hassUrl(a):a;if(!s)return r;const n=r.includes("?")?"&":"?";return`${r}${n}t=${Date.now()}`}(this.hass,s,e),a=function(t,e){const s=e?.stateObj?.attributes?.access_token;if(!t||!e?.entityId||!s)return"";const i=`/api/camera_proxy_stream/${e.entityId}?token=${s}`;return"function"==typeof t.hassUrl?t.hassUrl(i):i}(this.hass,s);this._stillUrl!==i&&(this._stillUrl=i),this._mjpegUrl!==a&&(this._mjpegUrl=a)}_syncStableStreamCamera(t){const e=t?.stateObj||null,s=this._stableStateObj,i=t=>!t||["unavailable","unknown"].includes(String(t.state).trim().toLowerCase());!s||!e||s.entity_id!==e.entity_id||s.attributes?.access_token!==e.attributes?.access_token||i(s)!==i(e)?(this._stableStateObj=e,this._streamCamera=t):this._streamCamera||(this._streamCamera=t)}_clearMediaElements(){const t=this.renderRoot;t&&(t.querySelectorAll("video").forEach(t=>{try{t.pause?.();const e=t.srcObject;e&&"function"==typeof e.getTracks&&e.getTracks().forEach(t=>{try{t.stop()}catch{}}),t.srcObject=null,t.removeAttribute("src"),t.load?.()}catch{}}),t.querySelectorAll("img.media").forEach(t=>{try{t.removeAttribute("src"),t.src=""}catch{}}))}_stopLive(){if(this._startToken+=1,this._unsubWebRtc){try{this._unsubWebRtc()}catch{}this._unsubWebRtc=null}if(this._pc){try{this._pc.getSenders?.().forEach(t=>{try{t.track?.stop?.()}catch{}}),this._pc.getReceivers?.().forEach(t=>{try{t.track?.stop?.()}catch{}}),this._pc.close()}catch{}this._pc=null}this._sessionId=null,this._hlsUrl="",this._clearMediaElements()}_releaseSlot(){this._slotId&&We.release(this._slotId),this._slotHeld=!1,this._queued=!1}_unloadCompletely(){this._releaseSlot(),this._stopLive(),this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",this._playKey="",this._idleReason="suspended",this._queued=!1,this._stableStateObj=null,this._streamCamera=null,this._failoverEntityId="",this._failoverTried=new Set}_showIdle(t="idle"){if(this._stopLive(),!this.active||"undefined"!=typeof document&&document.hidden)return this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",void(this._idleReason=t);this._refreshPosterUrls(this._streamCamera||this.camera,{cacheBust:!0}),this.hass&&this.camera?.stateObj?(this._mode=this._stillUrl?"still":"empty",this._error=this._stillUrl?"":"No preview",this._idleReason=t):this._mode="empty"}_reconcilePlayback(){if(!this.active||"undefined"!=typeof document&&document.hidden)return void this._unloadCompletely();const t=Number(this.config?.max_streams);if(Number.isFinite(t)&&t>0&&We.setMax(t),!this.hass||!this.camera?.stateObj)return this._releaseSlot(),this._stopLive(),this._mode="empty",this._playKey="",void(this._stableStateObj=null);const e=[...new Set([...this.groupMembers||[],...this.failoverEntityIds||[],this.camera?.entityId].filter(Boolean))];if(this._failoverEntityId&&this.hass?.states?.[this._failoverEntityId])this._syncStableStreamCamera(mt(this._failoverEntityId,this.hass.states[this._failoverEntityId]));else{const t=Xt(this.hass,this.camera,this.config,this._effectiveQuality,this.context,e);this._syncStableStreamCamera(t)}const s=this._streamCamera?.entityId||this.camera.entityId;this._slotId&&s&&this._slotId!==s&&(We.release(this._slotId),this._slotHeld=!1,this._queued=!1,this._playKey=""),this._slotId=s;const i=this._wantsLive(),a=[i?"live":"idle",this._slotId,this._effectiveQuality,this.context,this.eager?"eager":"lazy"].join("|");if(!i)return this._releaseSlot(),this._showIdle("idle"),void(this._playKey=a);if(this._slotHeld&&this._playKey===a&&"loading"!==this._mode&&"empty"!==this._mode&&("still"!==this._mode||!this._queued))return;this._refreshPosterUrls(this._streamCamera,{cacheBust:!1});const r=()=>{this._slotHeld=!0,this._queued=!1,this._playKey=a,this._startLive()},n=()=>{if(this._slotHeld=!1,this._queued=this._wantsLive(),this._playKey="",this._showIdle("queued"),this._wantsLive()){We.request(this._slotId,this._priority,{onGrant:r,onRevoke:n})&&r()}};We.request(this._slotId,this._priority,{onGrant:r,onRevoke:n})?r():(this._slotHeld=!1,this._queued=!0,this._playKey=a,this._showIdle("queued"))}async _startLive(){this._stopLive();const t=this._startToken;this._error="",this._mode="loading",this._idleReason="";const e=this._streamCamera||this.camera;this._refreshPosterUrls(e,{cacheBust:!1});const s=function(t,e="mosaic"){const s=Bt(t);return"low"===s?["mjpeg","ha","webrtc","hls"]:"high"===s?["webrtc","ha","hls","mjpeg"]:"balanced"===s?["ha","webrtc","hls","mjpeg"]:"mosaic"===e?["mjpeg","ha","webrtc","hls"]:["webrtc","ha","hls","mjpeg"]}(this._effectiveQuality,this.context);for(const i of s){if(t!==this._startToken||!this._slotHeld)return;if("ha"===i&&customElements.get("ha-camera-stream"))return void(this._mode="ha");if("webrtc"===i&&"undefined"!=typeof RTCPeerConnection){const s=await gt(this.hass,e.entityId);if(t!==this._startToken||!this._slotHeld)return;const i=s?.frontend_stream_types||[],a=e.frontendStreamType;if(i.includes("web_rtc")||"web_rtc"===a||_t(e)||!i.length)try{if(await this._startWebRtc(t,e),t!==this._startToken||!this._slotHeld)return;return void(this._mode="webrtc")}catch(t){console.warn("CCTV WebRTC failed, falling back",t)}}if("hls"===i)try{const s=await ft(this.hass,e.entityId);if(t!==this._startToken||!this._slotHeld)return;if(s&&this._canPlayHlsNatively())return this._hlsUrl=s,void(this._mode="hls")}catch(t){console.warn("CCTV HLS failed, falling back",t)}if("mjpeg"===i&&this._mjpegUrl)return void(this._mode="mjpeg")}await this._tryGroupFailover(t)||(this._mode=this._stillUrl?"still":"empty",this._stillUrl||(this._error="No stream or preview available"))}async _tryGroupFailover(t){const e=this.camera?.entityId||"",s=[...new Set([...this.failoverEntityIds||[],...this.groupMembers||[]].map(String).filter(t=>t.startsWith("camera.")))].filter(t=>t!==e),i=[],a=[];for(const t of s){const e=t.replace(/^camera\./,"");["_fluent","_sub","_lq","_low","_sd","_substream"].some(t=>e.endsWith(t))?i.push(t):a.push(t)}const r=[...i,...a];this._failoverTried||(this._failoverTried=new Set);const n=this._failoverEntityId||this._streamCamera?.entityId||e;n&&this._failoverTried.add(n);for(const s of r){if(t!==this._startToken||!this._slotHeld)return!1;if(this._failoverTried.has(s))continue;if(!this.hass?.states?.[s])continue;this._failoverTried.add(s);const i=mt(s,this.hass.states[s]);if(!i?.stateObj)continue;this._slotId&&this._slotId!==s&&(We.release(this._slotId),this._slotHeld=!1),this._failoverEntityId=s,this._streamCamera=i,this._stableStateObj=i.stateObj,this._slotId=s,this._playKey="";if(!We.request(s,this._priority,{onGrant:()=>{this._slotHeld=!0,this._queued=!1},onRevoke:()=>{this._slotHeld=!1,this._queued=this._wantsLive(),this._playKey="",this._showIdle("queued")}}))return this._queued=!0,this._showIdle("queued"),!1;if(this._slotHeld=!0,this.dispatchEvent(new CustomEvent("cctv-stream-failover",{detail:{from:e,to:s,groupMembers:this.groupMembers||[]},bubbles:!0,composed:!0})),await this._startLive(),t!==this._startToken)return!1;if("ha"===this._mode||"webrtc"===this._mode||"hls"===this._mode||"mjpeg"===this._mode)return!0}return!1}_canPlayHlsNatively(){const t=document.createElement("video");return""!==t.canPlayType("application/vnd.apple.mpegurl")||""!==t.canPlayType("application/x-mpegURL")}async _startWebRtc(t,e){const s=await async function(t,e){if(!t?.callWS)return null;try{return await t.callWS({type:"camera/webrtc/get_client_config",entity_id:e})}catch{return null}}(this.hass,e.entityId)||{};if(t!==this._startToken)return;const i=new RTCPeerConnection(s.configuration||{});this._pc=i,i.addTransceiver("video",{direction:"recvonly"});try{i.addTransceiver("audio",{direction:"recvonly"})}catch{}i.ontrack=t=>{const e=this.renderRoot?.querySelector("video#webrtc");if(!e)return;const[s]=t.streams;e.srcObject=s||new MediaStream([t.track]),e.muted=this.muted,e.play?.().catch(()=>{})},i.onicecandidate=t=>{t.candidate&&this._sessionId&&async function(t,e,s,i){t?.callWS&&await t.callWS({type:"camera/webrtc/candidate",entity_id:e,session_id:s,candidate:i})}(this.hass,e.entityId,this._sessionId,t.candidate.toJSON()).catch(()=>{})};const a=await i.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});await i.setLocalDescription(a),this._unsubWebRtc=await function(t,e,s,i){if(!t?.connection?.subscribeMessage)throw new Error("WebSocket connection unavailable");return t.connection.subscribeMessage(i,{type:"camera/webrtc/offer",entity_id:e,offer:s})}(this.hass,e.entityId,a.sdp,async e=>{if(t===this._startToken&&this._pc)if("session"!==e.type)if("answer"!==e.type)if("candidate"===e.type&&e.candidate)try{await this._pc.addIceCandidate(e.candidate)}catch{}else"error"===e.type&&(this._error=e.message||e.code||"WebRTC error",this._mode=this._mjpegUrl?"mjpeg":this._stillUrl?"still":"empty");else await this._pc.setRemoteDescription({type:"answer",sdp:e.answer});else this._sessionId=e.session_id})}_emitMediaAspect(t,e){const s=this.camera?.entityId,i=Number(t),a=Number(e);if(!s||!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0)return;const r=i/a;this._lastEmittedAspect&&Math.abs(this._lastEmittedAspect-r)<.01||(this._lastEmittedAspect=r,this.dispatchEvent(new CustomEvent("cctv-media-aspect",{detail:{entityId:s,width:i,height:a,aspect:r},bubbles:!0,composed:!0})))}_probeMediaSize(){const t=this.renderRoot;if(!t)return;const e=t.querySelector("video");if(e)return void(e.videoWidth&&e.videoHeight&&this._emitMediaAspect(e.videoWidth,e.videoHeight));const s=t.querySelector("img.media");if(s&&s.naturalWidth&&s.naturalHeight)return void this._emitMediaAspect(s.naturalWidth,s.naturalHeight);const i=t.querySelector("ha-camera-stream"),a=i?.shadowRoot?.querySelector?.("video");if(a?.videoWidth&&a?.videoHeight)return void this._emitMediaAspect(a.videoWidth,a.videoHeight);const r=i?.shadowRoot?.querySelector?.("img");r?.naturalWidth&&r?.naturalHeight&&this._emitMediaAspect(r.naturalWidth,r.naturalHeight)}render(){if("loading"===this._mode)return F`<div class="placeholder">Connecting…</div>`;if("empty"===this._mode)return F`<div class="error">${this._error||"No preview"}</div>`;let t=this._mode;return this._queued?t="queued":this._slotHeld||"still"!==this._mode?!this._failoverEntityId||this._failoverEntityId===this.camera?.entityId||"ha"!==this._mode&&"webrtc"!==this._mode&&"hls"!==this._mode&&"mjpeg"!==this._mode||(t="failover"):t=this._idleReason||"idle",F`
      ${this._renderMedia()}
      <span class="badge">${t}</span>
    `}_renderMedia(){const t=this._streamCamera||this.camera;if("ha"===this._mode){const e=this.mosaic||this.large?"contain":"cover",s=this._tileAspect>0?this._tileAspect:this.clientWidth>1&&this.clientHeight>1?this.clientWidth/this.clientHeight:void 0,i=this._stableStateObj||t?.stateObj;return F`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${i}
          .muted=${this.muted}
          .controls=${this.controls}
          .fitMode=${e}
          .aspectRatio=${s}
          @loadeddata=${()=>{this._probeMediaSize(),this._forceNestedContain()}}
        ></ha-camera-stream>
      `}return"webrtc"===this._mode?F`
        <video
          id="webrtc"
          class="media"
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${t=>this._emitMediaAspect(t.target.videoWidth,t.target.videoHeight)}
        ></video>
      `:"hls"===this._mode?F`
        <video
          class="media"
          src=${this._hlsUrl}
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${t=>this._emitMediaAspect(t.target.videoWidth,t.target.videoHeight)}
        ></video>
      `:"mjpeg"===this._mode?F`
        <img
          class="media"
          alt=""
          src=${this._mjpegUrl}
          @load=${t=>this._emitMediaAspect(t.target.naturalWidth,t.target.naturalHeight)}
        />
      `:"still"===this._mode?F`
        <img
          class="media"
          alt=""
          src=${this._stillUrl}
          @load=${t=>this._emitMediaAspect(t.target.naturalWidth,t.target.naturalHeight)}
        />
      `:z}}customElements.get("cctv-stream-player")||customElements.define("cctv-stream-player",Be);const Ge=[{value:9e5,label:"15m"},{value:36e5,label:"1h"},{value:216e5,label:"6h"},{value:864e5,label:"24h"}];class Qe extends nt{static properties={hass:{attribute:!1},cameras:{attribute:!1},sensorLinks:{attribute:!1},cameraNames:{attribute:!1},active:{type:Boolean},_windowMs:{state:!0},_loading:{state:!0},_error:{state:!0},_rows:{state:!0},_now:{state:!0},_selected:{state:!0}};createRenderRoot(){return this}constructor(){super(),this.cameras=[],this.sensorLinks={},this.cameraNames={},this.active=!0,this._windowMs=36e5,this._loading=!1,this._error="",this._rows=[],this._now=Date.now(),this._selected=null,this._timer=null,this._fetchToken=0,this._quietRefreshTimer=0,this._lastEntityKey="",this._onVisibility=null}connectedCallback(){super.connectedCallback(),this._onVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._pausePolling():this.active&&this._scheduleQuietRefresh()},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onVisibility),this.active&&this._startPolling()}disconnectedCallback(){super.disconnectedCallback(),this._stopPolling(),this._onVisibility&&"undefined"!=typeof document&&document.removeEventListener("visibilitychange",this._onVisibility)}updated(t){if(t.has("active")&&(this.active?this._startPolling():this._stopPolling()),this.active)return t.has("cameras")||t.has("sensorLinks")||t.has("_windowMs")?(this._selected=null,void this._refresh({showLoading:!0})):void(t.has("hass")&&this._scheduleQuietRefresh())}_startPolling(){this._pausePolling(),this.active&&("undefined"!=typeof document&&document.hidden||(this._timer=window.setInterval(()=>this._scheduleQuietRefresh(),9e4),this._refresh({showLoading:!this._rows.length})))}_pausePolling(){this._timer&&(window.clearInterval(this._timer),this._timer=null),this._quietRefreshTimer&&(window.clearTimeout(this._quietRefreshTimer),this._quietRefreshTimer=0)}_stopPolling(){this._pausePolling(),this._fetchToken+=1,this._loading=!1}_scheduleQuietRefresh(){this.active&&("undefined"!=typeof document&&document.hidden||this._quietRefreshTimer||(this._quietRefreshTimer=window.setTimeout(()=>{this._quietRefreshTimer=0,this._refresh({showLoading:!1})},2500)))}reload(){return this._selected=null,this._refresh({showLoading:!0})}async _refresh(t={}){if(!this.active)return;if("undefined"!=typeof document&&document.hidden)return;const e=Boolean(t.showLoading),s=[...this.cameras||[]],i=`${s.join(",")}|${this._windowMs}`;if(!this.hass)return this._rows=[],this._error="",this._selected=null,void(this._lastEntityKey=i);const a=++this._fetchToken;(e||i!==this._lastEntityKey)&&(this._loading=!0),this._error="";const r=Date.now(),n=r-this._windowMs;try{const t=await async function(t,e={}){if(!t?.callWS)return[];try{const s=await t.callWS({type:"cctv_dashboard/list_detections",start:e.start,end:e.end,cameras:e.cameras,limit:e.limit??500});return s?.events||[]}catch(t){return console.warn("CCTV: failed to list detections",t),[]}}(this.hass,{start:n,end:r,cameras:s.length?s:void 0,limit:500});if(a!==this._fetchToken||!this.active)return;this._lastEntityKey=i,this._rows=this._buildRowsFromEvents(t,n,r),this._now=r,this._syncSelected()}catch(t){if(a!==this._fetchToken||!this.active)return;this._error=t?.message||"Could not load saved detections",this._rows=this._buildRowsFromEvents([],n,r),this._syncSelected()}finally{a===this._fetchToken&&(this._loading=!1)}}_syncSelected(){if(!this._selected)return;const t=this._rows.flatMap(t=>t.events).find(t=>t.id===this._selected.id);this._selected=t||null}_linkedEntityIds(){const t=[];for(const e of this.cameras||[])for(const s of this.sensorLinks?.[e]||[])t.push(s);return[...new Set(t)]}_sensorName(t){return this.hass?.states?.[t]?.attributes?.friendly_name||String(t||"").replace(/^[^.]+\./,"")||t}_buildRowsFromEvents(t,e,s){const i=new Map,a=new Set(this.cameras||[]);for(const r of t||[]){const t=r.kind||"other",n=wt.find(e=>e.id===t)||wt[wt.length-1],o={id:n.id,label:r.kind_label||n.label},c=Date.parse(r.start),l=r.end?Date.parse(r.end):s;if(!Number.isFinite(c))continue;const d=Math.max(e,c),h=Math.min(s,Number.isFinite(l)?l:s);if(h<=d)continue;let u=(r.cameras||[]).map(String);if(a.size&&(u=u.filter(t=>a.has(t)),!u.length&&(r.cameras||[]).length))continue;let p=i.get(o.id);p||(p={kind:o,raw:[],active:!1},i.set(o.id,p)),p.raw.push({start:d,end:h,cameras:u,sensors:r.sensor_id?[{entityId:r.sensor_id,name:this._sensorName(r.sensor_id)}]:[],sourceId:r.id,active:Boolean(r.active||null==r.end)}),(r.active||null==r.end)&&(p.active=!0)}for(const t of this.cameras||[])for(const e of this.sensorLinks?.[t]||[]){const t=this.hass?.states?.[e],s=`${e} ${t?.attributes?.friendly_name||""}`.toLowerCase(),a=wt.find(t=>"other"!==t.id&&t.tokens.some(t=>new RegExp(`(^|[_\\s.-])${t}([_\\s.-]|$)`,"i").test(s)))||wt[wt.length-1];i.has(a.id)||i.set(a.id,{kind:{id:a.id,label:a.label},raw:[],active:!1})}const r=new Map(wt.map((t,e)=>[t.id,e]));return[...i.values()].map(t=>{const e=function(t,e=0){if(!Array.isArray(t)||!t.length)return[];const s=t.map(t=>({start:Number(t.start),end:Number(t.end),cameras:Array.isArray(t.cameras)?[...t.cameras]:[],sensors:Array.isArray(t.sensors)?[...t.sensors]:[]})).filter(t=>Number.isFinite(t.start)&&Number.isFinite(t.end)&&t.end>t.start).sort((t,e)=>t.start-e.start||t.end-e.end);if(!s.length)return[];const i=[Dt(s[0])];for(let t=1;t<s.length;t+=1){const a=s[t],r=i[i.length-1];a.start<=r.end+e?(r.end=Math.max(r.end,a.end),Et(r,a)):i.push(Dt(a))}return i}(t.raw,1e3),i=e.map((e,i)=>{const a=e.cameras||[];return{id:e.sourceId||`${t.kind.id}:${e.start}:${e.end}:${i}`,kind:t.kind,start:e.start,end:e.end,durationMs:Math.max(0,e.end-e.start),cameras:a,cameraNames:a.map(t=>this.cameraNames?.[t]||t),sensors:e.sensors||[],active:Boolean(t.active&&e.end>=s-5e3)}});return{kind:t.kind,events:i,totalMs:i.reduce((t,e)=>t+e.durationMs,0),active:t.active}}).filter(t=>t.events.length||t.active||this._linkedEntityIds().length).sort((t,e)=>(r.get(t.kind.id)??99)-(r.get(e.kind.id)??99)||t.kind.label.localeCompare(e.kind.label))}_setWindow(t){this._windowMs=t}_selectEvent(t,e){e?.stopPropagation?.(),this._selected=this._selected?.id===t.id?null:t}_clearSelected(){this._selected=null}_requestPlay(t,e){e?.stopPropagation?.(),this.dispatchEvent(new CustomEvent("cctv-play-detection",{detail:{start:t.start,end:t.end,kind:t.kind,sensors:t.sensors||[],cameras:t.cameras||[]},bubbles:!0,composed:!0}))}_tickMarks(){const t=this._now-this._windowMs,e=this._windowMs<=9e5?4:this._windowMs<=36e5?6:8,s=[];for(let i=0;i<=e;i+=1){const a=t+this._windowMs*i/e;s.push({t:a,label:Nt(a),pct:i/e*100})}return s}render(){const t=this._linkedEntityIds().length;if(!(this.cameras||[]).length)return z;const e=this._now-this._windowMs,s=Math.max(1,this._windowMs),i=this._tickMarks();return F`
      <section class="timeline" aria-label="Detection timeline">
        <div class="timeline-head">
          <div>
            <strong>Detection timeline</strong>
            <span class="hint">
              ${t?"Shared for all users — survives reboot; kept for retention days":"Link detection sensors in a camera’s settings to see events here"}
            </span>
          </div>
          <div class="timeline-windows">
            ${Ge.map(t=>F`
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

        ${this._error?F`<p class="timeline-error">${this._error}</p>`:z}
        ${t?0===this._rows.length?F`<p class="empty">No linked sensors for the current selection.</p>`:F`
                <div class="timeline-board" @click=${this._clearSelected}>
                  <div class="timeline-ruler" aria-hidden="true">
                    ${i.map(t=>F`
                        <span class="timeline-tick" style="left:${t.pct}%">
                          <span class="timeline-tick-line"></span>
                          <span class="timeline-tick-label">${t.label}</span>
                        </span>
                      `)}
                  </div>
                  <div class="timeline-lanes">
                    ${this._rows.map(t=>this._renderLane(t,e,s))}
                  </div>
                </div>
                ${this._selected?this._renderDetail(this._selected):F`<p class="hint timeline-hint">Select a highlighted event on the timeline.</p>`}
                ${this._loading?F`<p class="hint timeline-loading">Refreshing…</p>`:z}
              `:F`<p class="empty">No detection sensors linked yet.</p>`}
      </section>
    `}_renderLane(t,e,s){const i=wt.find(e=>e.id===t.kind.id)||wt[wt.length-1];return F`
      <div class="timeline-lane">
        <div class="timeline-lane-label">
          <span class="timeline-kind kind-${i.id}">${i.label}</span>
          <span class="timeline-total">
            ${t.events.length?`${t.events.length} event${1===t.events.length?"":"s"} · ${Tt(t.totalMs)}`:t.active?"active now":"quiet"}
          </span>
        </div>
        <div
          class="timeline-track"
          role="listbox"
          aria-label="${i.label} events"
        >
          ${t.events.map(t=>{const a=(t.start-e)/s*100,r=Math.max(.6,(t.end-t.start)/s*100),n=this._selected?.id===t.id;return F`
              <button
                type="button"
                class="timeline-event kind-${i.id} ${n?"selected":""} ${t.active?"live":""}"
                style="left:${a}%;width:${r}%"
                title="${i.label}: ${Nt(t.start)}–${Nt(t.end)}"
                aria-pressed=${n?"true":"false"}
                @click=${e=>this._selectEvent(t,e)}
              >
                <span class="timeline-event-mark"></span>
              </button>
            `})}
        </div>
      </div>
    `}_renderDetail(t){const e=wt.find(e=>e.id===t.kind.id)||wt[wt.length-1],s=t.cameraNames?.length?t.cameraNames.join(", "):"—",i=t.sensors?.length?t.sensors:[];return F`
      <aside class="timeline-detail" aria-live="polite">
        <div class="timeline-detail-head">
          <span class="timeline-kind kind-${e.id}">${e.label}</span>
          ${t.active?F`<span class="timeline-live-badge">Live</span>`:z}
          <div class="timeline-detail-actions">
            ${t.active?z:F`
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
            ${Nt(t.start)} – ${Nt(t.end)}
            <span class="hint">(${new Date(t.start).toLocaleString()} → ${new Date(t.end).toLocaleString()})</span>
          </dd>
          <dt>Duration</dt>
          <dd>${Tt(t.durationMs)}${t.active?" (ongoing)":""}</dd>
          <dt>Cameras</dt>
          <dd>${s}</dd>
          <dt>Sensors</dt>
          <dd>
            ${i.length?F`
                  <ul class="timeline-detail-sensors">
                    ${i.map(t=>F`
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
    `}}customElements.get("cctv-detection-timeline")||customElements.define("cctv-detection-timeline",Qe);class Ke extends nt{static properties={hass:{attribute:!1},config:{attribute:!1},panelMode:{type:Boolean,attribute:"panel-mode"},panelUrlPath:{type:String,attribute:"panel-url-path"},_detailId:{state:!0},_status:{state:!0},_qualityTick:{state:!0},_visibleIds:{state:!0},_sensorLinks:{state:!0},_streamGroups:{state:!0},_groupDraftMembers:{state:!0},_groupDraftName:{state:!0},_forceAspect:{state:!0},_savedForceAspect:{state:!0},_cameraQuality:{state:!0},_savedCameraQuality:{state:!0},_customAspectDraft:{state:!0},_prefsDirty:{state:!0},_pickerOpen:{state:!0},_settingsOpen:{state:!0},_selectionReady:{state:!0},_saving:{state:!0},_sensorFilter:{state:!0},_deviceMapReady:{state:!0},_retentionDays:{state:!0},_recordOnDetection:{state:!0},_recordDetectionKinds:{state:!0},_notifyOnDetection:{state:!0},_sessions:{state:!0},_recordDir:{state:!0},_recordingDebug:{state:!0},_recordingDebugSummary:{state:!0},_isDesktop:{state:!0},_tvMode:{state:!0},_aspectById:{state:!0},_packStyles:{state:!0},_tvStage:{state:!0},_playback:{state:!0},_panelActive:{state:!0},_liveMountGen:{state:!0},_playbackMountGen:{state:!0}};static styles=ht;constructor(){super(),this.config={},this.panelMode=!1,this.panelUrlPath="cctv",this._detailId=null,this._status="",this._qualityTick=0,this._visibleIds=[],this._sensorLinks={},this._streamGroups=[],this._groupDraftMembers=[],this._groupDraftName="",this._forceAspect={},this._savedForceAspect={},this._cameraQuality={},this._savedCameraQuality={},this._customAspectDraft="",this._prefsDirty=!1,this._pickerOpen=!0,this._settingsOpen=!1,this._selectionReady=!1,this._saving=!1,this._sensorFilter="",this._deviceMapReady=!1,this._retentionDays=1,this._recordOnDetection=!0,this._recordDetectionKinds=wt.map(t=>t.id),this._notifyOnDetection=!1,this._sessions=[],this._recordDir="",this._recordingDebug="",this._recordingDebugSummary="",this._loadedForUser=null,this._isDesktop=!1,this._tvMode=!1,this._aspectById={},this._packStyles={},this._tvStage={width:0,height:0},this._playback=null,this._panelActive=!0,this._liveMountGen=0,this._playbackMountGen=0,this._deviceMap=new Map,this._packObserver=null,this._packObservedEl=null,this._mq=null,this._onMq=null,this._packRaf=0,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._cameraNamesCache={},this._cameraNamesKey="",this._lastHassSig="",this._onDocVisibility=null,this._onLocationChange=null,this._loadToken=0}shouldUpdate(t){if(this.panelMode&&!this._panelActive&&!t.has("_panelActive")&&t.has("hass")&&1===t.size)return!1;if(!t.has("hass"))return!0;if(t.size>1)return!0;const e=t.get("hass"),s=this.hass;return!e||!s||this._hassRelevantChanged(e,s)}_hassRelevantChanged(t,e){const s=this._watchedEntityIds();for(const i of s){const s=t.states?.[i],a=e.states?.[i];if(s!==a){if(!s||!a)return!0;if(s.state!==a.state)return!0;if(s.attributes?.access_token!==a.attributes?.access_token)return!0;if(s.attributes?.friendly_name!==a.attributes?.friendly_name)return!0}}return(t.user?.id||"")!==(e.user?.id||"")}_watchedEntityIds(){const t=new Set(this._visibleIds||[]);if(this._pickerOpen||this._settingsOpen)for(const e of this._cameras())t.add(e.entityId);return t}connectedCallback(){super.connectedCallback(),this._tvMode=function(){try{return"undefined"!=typeof localStorage&&"1"===localStorage.getItem(Fe)}catch{return!1}}(),this._syncTvModeAttr(),"undefined"!=typeof window&&window.matchMedia&&(this._mq=window.matchMedia("(min-width: 801px)"),this._onMq=()=>{this._panelActive&&(this._isDesktop=this._mq.matches,this._refreshTvStage(),this._schedulePack())},this._isDesktop=this._mq.matches,this._mq.addEventListener?this._mq.addEventListener("change",this._onMq):this._mq.addListener(this._onMq)),this._bindTvViewport(),this._bindPanelVisibility(),!this._isCctvLocation()||"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._setPanelActive(!0),this._refreshTvStage()}disconnectedCallback(){super.disconnectedCallback(),this._panelActive&&(this._panelActive=!1,this._suspendResources()),this._unbindTvViewport(),this._unbindPanelVisibility(),this._mq&&this._onMq&&(this._mq.removeEventListener?this._mq.removeEventListener("change",this._onMq):this._mq.removeListener(this._onMq)),this._tearDownObservers()}_syncTvModeAttr(){const t=Boolean(this.panelMode&&this._tvMode);this.toggleAttribute("tv-mode",t)}_bindTvViewport(){"undefined"!=typeof window&&(this._unbindTvViewport(),this._onTvResize=()=>{this._panelActive&&(this._refreshTvStage(),this._schedulePack())},window.addEventListener("resize",this._onTvResize))}_unbindTvViewport(){"undefined"!=typeof window&&this._onTvResize&&(window.removeEventListener("resize",this._onTvResize),this._onTvResize=null)}_refreshTvStage(){if(!this._tvMode||!this.panelMode)return void((this._tvStage?.width||this._tvStage?.height)&&(this._tvStage={width:0,height:0}));const t=ze(),e=this.renderRoot?.querySelector?.(".panel-wrap"),s=this.renderRoot?.querySelector?.(".layout-pack-tv");let i=Ve(e);i<8&&(i=Ve(s)),i<8&&"number"==typeof this.clientWidth&&(i=Math.max(0,this.clientWidth)),i<8&&"undefined"!=typeof window&&(i=Math.max(0,(Number(window.innerWidth)||0)-256-40));const a="undefined"!=typeof window&&Number(window.innerHeight)||0,{stage:r,offsetTop:n}=function(t,e,s){const i=Math.max(0,Number(t)||0),a=Math.max(0,Number(e)||0),r=Number.isFinite(s)?Number(s):ze(),n=Math.max(0,a-r),o=i>0?i/Ue:0;return{availW:i,availH:n,offsetTop:Math.max(0,(n-o)/2),stage:{width:i,height:o}}}(i,a,t),o={width:Math.round(r.width),height:Math.round(r.height)};o.width<8?this.style.setProperty("--cctv-tv-chrome",`${t}px`):(o.width===this._tvStage?.width&&o.height===this._tvStage?.height||(this._tvStage=o),this.style.setProperty("--cctv-tv-stage-w",`${o.width}px`),this.style.setProperty("--cctv-tv-stage-h",`${o.height}px`),this.style.setProperty("--cctv-tv-chrome",`${t}px`),this.style.setProperty("--cctv-tv-stage-offset",`${Math.round(n)}px`))}_bindPanelVisibility(){this.panelMode&&(this._unbindPanelVisibility(),this._onDocVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this.isConnected&&this._isCctvLocation()&&this._setPanelActive(!0)},this._onLocationChange=()=>{this.isConnected&&("undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._isCctvLocation()?this._panelActive||this._setPanelActive(!0):this._setPanelActive(!1))},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onDocVisibility),"undefined"!=typeof window&&(window.addEventListener("location-changed",this._onLocationChange),window.addEventListener("popstate",this._onLocationChange)))}_unbindPanelVisibility(){this._onDocVisibility&&"undefined"!=typeof document&&(document.removeEventListener("visibilitychange",this._onDocVisibility),this._onDocVisibility=null),this._onLocationChange&&"undefined"!=typeof window&&(window.removeEventListener("location-changed",this._onLocationChange),window.removeEventListener("popstate",this._onLocationChange),this._onLocationChange=null)}_isCctvLocation(){if("undefined"==typeof location)return!0;const t=location.pathname||"",e=(String(this.panelUrlPath||"cctv").trim().replace(/^\/+|\/+$/g,"")||"cctv").replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(?:^|/)${e}(?:/|$)`).test(t)}_setPanelActive(t){const e=Boolean(t);this._panelActive!==e&&(this._panelActive=e,e?(this._status="Suspended — streams unloaded"===this._status?"":this._status,this._schedulePack()):this._suspendResources())}_suspendResources(){this._loadToken+=1,this._teardownPlaybackMedia({clearSrc:!0}),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._tearDownObservers(),this._resetLiveStreamSlots(),this._liveMountGen+=1,this.panelMode&&(this._status="Suspended — streams unloaded")}_tearDownObservers(){this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null),this._packRaf&&(cancelAnimationFrame(this._packRaf),this._packRaf=0)}_unloadStreamPlayers(){const t=this.renderRoot||this;t.querySelectorAll?.("cctv-stream-player").forEach(t=>{try{t.active=!1,t._unloadCompletely?.()}catch{}})}updated(t){(this._panelActive||!this.panelMode||t.has("_panelActive")&&this._panelActive)&&(this.panelMode&&this._panelActive&&(t.has("hass")||t.has("panelMode")||t.has("_panelActive"))&&this._ensureSelectionLoaded(),(t.has("_tvMode")||t.has("panelMode"))&&(this._syncTvModeAttr(),this._refreshTvStage()),this.panelMode&&this._panelActive&&(t.has("_visibleIds")||t.has("_isDesktop")||t.has("_detailId")||t.has("_pickerOpen")||t.has("_settingsOpen")||t.has("_aspectById")||t.has("_forceAspect")||t.has("_playback")||t.has("_tvMode")||t.has("_tvStage")||t.has("_panelActive"))&&(this._schedulePack(),this.updateComplete.then(()=>{this._tvMode&&!this._playback?.playing&&this._refreshTvStage(),this._bindPackObserver()})))}firstUpdated(){this._tvMode&&this.panelMode&&this.updateComplete.then(()=>{this._refreshTvStage(),this._schedulePack(),this._bindPackObserver()})}_bindPackObserver(){const t=this.renderRoot?.querySelector?.(".layout-pack");t?this._packObserver&&this._packObservedEl===t?this._recomputePack():(this._packObserver&&this._packObserver.disconnect(),this._packObservedEl=t,"undefined"!=typeof ResizeObserver?(this._packObserver=new ResizeObserver(()=>this._schedulePack()),this._packObserver.observe(t),this._recomputePack()):this._recomputePack()):this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null)}_schedulePack(){this._panelActive&&(this._packRaf&&cancelAnimationFrame(this._packRaf),this._packRaf=requestAnimationFrame(()=>{this._packRaf=0,this._recomputePack()}))}_recomputePack(){if(!this._isDesktop||!this.panelMode||this._detailId)return void(Object.keys(this._packStyles).length&&(this._packStyles={}));this._tvMode&&!this._playback?.playing&&this._refreshTvStage();const t=this.renderRoot?.querySelector?.(".layout-pack");if(!t)return;const e=t.getBoundingClientRect();let s=Math.max(0,e.width),i=Math.max(0,e.height);if(this._tvMode&&this._tvStage?.width>=8&&this._tvStage?.height>=8&&(s=this._tvStage.width,i=this._tvStage.height),s<8||i<8)return;const a=this._layoutCameras(this._cameras()).slice(0,4).map(t=>({id:t.entityId,aspect:this._effectiveAspect(t.entityId)}));var r;const n=function(t,e,s,i=10){const a=(t||[]).map(t=>({id:String(t.id),aspect:de(t.aspect)}));if(!a.length||e<=1||s<=1)return[];let r=null,n=-1;for(const t of function(t){const e=t.length;if(!e)return[];const s=[];return function i(a,r){if(a!==e)for(let s=a+1;s<=e;s+=1)r.push(t.slice(a,s)),i(s,r),r.pop();else s.push(r.map(t=>t.slice()))}(0,[]),s}(a))for(const a of[he(t,e,s,i),ue(t,e,s,i)])a&&a.totalArea>n&&(n=a.totalArea,r=a.cells);return r||[]}(a,s,i,this._tvMode?(r=a.length,(Number(r)||0)<=2?6:8):10),o=function(t,e,s){if(!e||!s)return{};const i={};for(const a of t)i[a.id]=[`left:${a.left/e*100}%`,`top:${a.top/s*100}%`,`width:${a.width/e*100}%`,`height:${a.height/s*100}%`].join(";");return i}(n,s,i);this._packStylesEqual(this._packStyles,o)||(this._packStyles=o)}_effectiveAspect(t){const e=ae(this._forceAspectLabel(t));return de(e||(this._aspectById[t]||te))}_groupMembers(t){return Ot(this._streamGroups,t)}_forceAspectLabel(t){return ce(this._forceAspect,t,this._groupMembers(t))}_packStylesEqual(t,e){const s=Object.keys(t||{}),i=Object.keys(e||{});if(s.length!==i.length)return!1;for(const i of s)if(t[i]!==e[i])return!1;return!0}_onMediaAspect(t){const e=t?.detail?.entityId,s=de(t?.detail?.aspect);e&&(ae(this._forceAspect?.[e])||Math.abs((this._aspectById[e]||0)-s)<.01||(this._aspectById={...this._aspectById,[e]:s}))}_onPlaybackMediaSize(t,e,s){const i=Number(e),a=Number(s);!t||!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0||this._onMediaAspect({detail:{entityId:t,aspect:i/a}})}async _ensureSelectionLoaded(){if(!this._panelActive)return;const t=this.hass?.user?.id||"default";if(!this.hass||this._loadedForUser===t)return;this._loadedForUser=t,this._selectionReady=!1;const e=++this._loadToken,[s,i]=await Promise.all([Oe(this.hass),pe(this.hass)]);if(e!==this._loadToken||!this._panelActive)return;const a=this._cameras().map(t=>t.entityId);s?.selectedCameras?.length?(this._visibleIds=s.selectedCameras.filter(t=>a.includes(t)).slice(0,this._maxStreams()),this._pickerOpen=0===this._visibleIds.length):(this._visibleIds=[],this._pickerOpen=!0);let r=i?.sensorLinks||{};const n=s?.legacySensorLinks;if(n&&"object"==typeof n&&Object.keys(n).length&&!Object.keys(r).length)try{const t=await me(this.hass,n);if(e!==this._loadToken||!this._panelActive)return;r=t?.sensor_links?Object.fromEntries(Object.entries(t.sensor_links).map(([t,e])=>[t,e])):n,await qe(this.hass,this._visibleIds),this._status="Detection sensor links moved to shared settings"}catch(t){console.warn("CCTV: legacy sensor-link migration failed",t),r=n}this._streamGroups=Rt(i?.streamGroups||[]),this._sensorLinks=Ht(r,this._streamGroups),i?(this._retentionDays=Number(i.retention_days)||1,this._recordOnDetection=!1!==i.record_on_detection,this._recordDetectionKinds=this._normalizeRecordKinds(i.record_detection_kinds),this._notifyOnDetection=Boolean(i.notify_on_detection),this._recordDir=i.record_dir||"",this._recordingDebug=String(i.recording_debug||""),this._recordingDebugSummary=String(i.recording_debug_summary||""),this._applySharedCameraPrefs(i)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._selectionReady=!0,this._loadDeviceMap(),this._sessions?.length||(this._sessions=await ge(this.hass),e===this._loadToken&&this._panelActive)}async _loadDeviceMap(){this.hass&&!this._deviceMapReady&&(this._deviceMap=await async function(t){const e=new Map;if(!t?.callWS)return e;try{const s=await t.callWS({type:"config/entity_registry/list"});if(!Array.isArray(s))return e;for(const t of s)t?.entity_id&&t?.device_id&&e.set(String(t.entity_id),String(t.device_id))}catch(t){console.warn("CCTV: entity registry unavailable for sensor linking",t)}return e}(this.hass),this._deviceMapReady=!0)}async _loadRecordingUi(){if(!this.hass)return;const t=await pe(this.hass);t?(this._retentionDays=Number(t.retention_days)||1,this._recordOnDetection=!1!==t.record_on_detection,this._recordDetectionKinds=this._normalizeRecordKinds(t.record_detection_kinds),this._notifyOnDetection=Boolean(t.notify_on_detection),this._recordDir=t.record_dir||"",this._recordingDebug=String(t.recording_debug||""),this._recordingDebugSummary=String(t.recording_debug_summary||""),t.streamGroups&&(this._streamGroups=Rt(t.streamGroups)),t.sensorLinks&&(this._sensorLinks=Ht(t.sensorLinks,this._streamGroups)),this._prefsDirty||this._applySharedCameraPrefs(t)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._sessions=await ge(this.hass)}async _copyRecordingDebug(){const t=this._recordingDebug||"No recording session debug yet. Trigger a detection to populate.";try{if(navigator?.clipboard?.writeText)return await navigator.clipboard.writeText(t),void(this._status="Recording debug copied")}catch(t){console.warn("CCTV: clipboard copy failed",t)}this._status="Could not copy — select the debug text manually"}_normalizeRecordKinds(t){const e=new Set(wt.map(t=>t.id));if(!Array.isArray(t))return wt.map(t=>t.id);const s=[],i=new Set;for(const a of t){const t=String(a||"").trim().toLowerCase();e.has(t)&&!i.has(t)&&(i.add(t),s.push(t))}return s}_applySharedCameraPrefs(t){const e=oe(t?.forceAspect||t?.force_aspect||{}),s=Gt(t?.cameraQuality||t?.camera_quality||{});if(this._forceAspect={...e},this._savedForceAspect={...e},this._cameraQuality={...s},this._savedCameraQuality={...s},this._prefsDirty=!1,this._detailId){const t=ce(e,this._detailId,this._groupMembers(this._detailId));this._customAspectDraft=t&&"auto"!==t&&!re(t)?t:""}else this._customAspectDraft="";this._qualityTick+=1}_prefsMapsEqual(t,e){const s=t||{},i=e||{},a=new Set([...Object.keys(s),...Object.keys(i)]);for(const t of a)if((s[t]||"")!==(i[t]||""))return!1;return!0}_syncPrefsDirty(){this._prefsDirty=!this._prefsMapsEqual(this._forceAspect,this._savedForceAspect)||!this._prefsMapsEqual(this._cameraQuality,this._savedCameraQuality)}_qualityFor(t){return Zt(this.config,t,this.panelMode?this._cameraQuality:null,this._groupMembers(t))}_cameras(){return function(t,e={}){const s=t?.states??{},i=kt(e.cameras),a=new Set(kt(e.exclude).map(t=>t.toLowerCase()));let r=Object.keys(s).filter(t=>t.startsWith("camera."));if(i.length){const t=new Set(i.map(t=>t.toLowerCase()));r=r.filter(e=>t.has(e.toLowerCase()))}return r=r.filter(t=>!a.has(t.toLowerCase())),r.map(t=>mt(t,s[t])).sort((t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}))}(this.hass,this.config)}_maxStreams(){const t=Number(this.config?.max_streams);return Number.isFinite(t)&&t>0?t:4}_visibleCameras(t){return this._visibleIds.map(e=>t.find(t=>t.entityId===e)).filter(Boolean)}_layoutCameras(t){const e=this._playback?.playing?this._playback.tracks:null;if(!e?.length)return this._visibleCameras(t);const s=new Map(t.map(t=>[t.entityId,t]));return e.map(t=>s.has(t.cameraId)?s.get(t.cameraId):mt(t.cameraId,this.hass?.states?.[t.cameraId]))}_resetLiveStreamSlots(){try{We.releaseAll()}catch(t){console.warn("CCTV: stream slot reset failed",t)}this._unloadStreamPlayers()}_linksFor(t){return this._sensorLinks?.[t]||[]}_groupFor(t){return Lt(this._streamGroups,t)}_applyStreamGroupsResult(t){t&&"object"==typeof t&&(Array.isArray(t.stream_groups)&&(this._streamGroups=Rt(t.stream_groups)),t.sensor_links&&(this._sensorLinks=Ht(t.sensor_links,this._streamGroups)))}async _toggleVisible(t,e){const s=this._maxStreams();let i=[...this._visibleIds];const a=Lt(this._streamGroups,t),r=new Set(a?.members||[]);if(e){if(i.includes(t))return;if(r.size){const e=i.find(t=>r.has(t));if(e)i=i.map(s=>s===e?t:s);else{if(i.length>=s)return void(this._status=`Select at most ${s} cameras`);i.push(t)}}else{if(i.length>=s)return void(this._status=`Select at most ${s} cameras`);i.push(t)}}else i=i.filter(e=>e!==t);this._visibleIds=i,this._detailId&&!i.includes(this._detailId)&&(this._detailId=null),this._playback&&this._returnToLive(),await this._persistSelection(i)}async _setPreferredStream(t,e){const s=String(t||""),i=String(e||"");if(!i.startsWith("camera.")||s===i)return;const a=Lt(this._streamGroups,s);if(a&&!a.members.includes(i))return;let r=[...this._visibleIds];const n=r.indexOf(s);if(n>=0)r[n]=i;else if(!r.includes(i)){if(r.length>=this._maxStreams())return void(this._status=`Select at most ${this._maxStreams()} cameras`);r.push(i)}a&&(r=r.filter(t=>t===i||!a.members.includes(t))),this._visibleIds=r,this._playback&&this._returnToLive(),await this._persistSelection(r)}async _persistSelection(t){this._saving=!0;try{const e=await qe(this.hass,t);e?.selectedCameras&&(this._visibleIds=e.selectedCameras);const s=e?.selectedCameras||t;this._status=s.length?`${s.length} camera${1===s.length?"":"s"} on screen`:"No cameras selected"}catch(t){this._status=t?.message||"Could not save camera selection"}finally{this._saving=!1}}async _persistSensorLinks(t){this._saving=!0;const e=Ht(t,this._streamGroups);this._sensorLinks=e;try{const t=await me(this.hass,e);t?.sensor_links&&(this._sensorLinks=Ht(t.sensor_links,this._streamGroups)),this._status="Detection sensors saved for all users"}catch(t){this._status=t?.message||"Could not save detection sensors"}finally{this._saving=!1}}_setForceAspect(t,e){const s=this._groupMembers(t);if("custom"===e){const e=this._forceAspectLabel(t);this._customAspectDraft=e&&!re(e)?e:"1920:2560";const i=ie(this._customAspectDraft);return this._forceAspect=le(this._forceAspect,t,i,s),this._syncPrefsDirty(),void this._schedulePack()}const i=ie(e);this._forceAspect=le(this._forceAspect,t,i,s),(re(i)||"auto"===i)&&(this._customAspectDraft=""),this._syncPrefsDirty(),this._schedulePack()}_setCustomForceAspect(t,e){this._customAspectDraft=e;const s=ie(e);this._forceAspect=le(this._forceAspect,t,s,this._groupMembers(t)),this._syncPrefsDirty(),this._schedulePack()}async _saveCameraPrefs(){this._saving=!0;try{const t=await async function(t,e){if(!t?.callWS)return null;const s={type:"cctv_dashboard/set_camera_prefs"};return void 0!==e.cameraQuality&&(s.camera_quality=Gt(e.cameraQuality)),void 0!==e.forceAspect&&(s.force_aspect=oe(e.forceAspect)),t.callWS(s)}(this.hass,{cameraQuality:this._cameraQuality,forceAspect:this._forceAspect});t?this._applySharedCameraPrefs({force_aspect:t.force_aspect,camera_quality:t.camera_quality}):(this._savedForceAspect={...this._forceAspect},this._savedCameraQuality={...this._cameraQuality},this._prefsDirty=!1),this._status="Quality & aspect saved for all users",this._schedulePack()}catch(t){this._status=t?.message||"Could not save camera preferences"}finally{this._saving=!1}}async _setSensorLinked(t,e,s){const i=Lt(this._streamGroups,t)?.members||[t],a=new Set(this._linksFor(t));s?a.add(e):a.delete(e);const r=[...a],n={...this._sensorLinks};for(const t of i)r.length?n[t]=[...r]:delete n[t];await this._persistSensorLinks(Ht(n,this._streamGroups))}async _applySuggestions(t){const e=It(this.hass,t,{deviceIds:this._deviceMap,limit:8});if(!e.length)return void(this._status="No related detection sensors found");const s=Lt(this._streamGroups,t)?.members||[t],i=[...new Set([...this._linksFor(t),...e.map(t=>t.entityId)])].slice(0,16),a={...this._sensorLinks};for(const t of s)a[t]=[...i];await this._persistSensorLinks(Ht(a,this._streamGroups)),this._status=`Linked ${e.length} suggested sensor${1===e.length?"":"s"} (all users)`}async _persistStreamGroups(t){this._saving=!0;try{const e=Rt(t),s=Ht(this._sensorLinks,e),i=await async function(t,e){if(!t?.callWS)return null;const s=Rt(e);return t.callWS({type:"cctv_dashboard/set_stream_groups",stream_groups:s})}(this.hass,e);this._applyStreamGroupsResult(i),i?.stream_groups?null==i?.sensor_links&&Object.keys(s).length&&await this._persistSensorLinks(s):(this._streamGroups=e,await this._persistSensorLinks(s)),this._status="Stream groups saved for all users"}catch(t){this._status=t?.message||"Could not save stream groups"}finally{this._saving=!1}}_syncGroupDraftFromCamera(t){const e=Lt(this._streamGroups,t);if(e)return this._groupDraftMembers=[...e.members],void(this._groupDraftName=e.name||"");this._groupDraftMembers=[t],this._groupDraftName=""}_toggleGroupDraftMember(t,e,s){const i=String(t),a=String(e);let r=[...this._groupDraftMembers||[]];r.includes(i)||r.unshift(i),s?r.includes(a)||r.push(a):(r=r.filter(t=>t!==a),r.includes(i)||r.unshift(i)),this._groupDraftMembers=[...new Set(r)].slice(0,8)}async _saveGroupDraft(t){const e=[...new Set([t,...this._groupDraftMembers||[]])].filter(t=>String(t).startsWith("camera.")).slice(0,8);if(e.length<2)return void(this._status="Add at least one other stream to form a physical camera");const s=Lt(this._streamGroups,t),i=function(t,e){const s=[...new Set((e.members||[]).map(String).filter(t=>t.startsWith("camera.")))].slice(0,8);if(s.length<2){const s=String(e.id||"");return Rt((t||[]).filter(t=>t.id!==s))}const i=String(e.id||"").trim()||`grp_${s[0].replace(/^camera\./,"").slice(0,40)}`,a=String(e.name||"").trim().slice(0,64)||s[0].replace(/^camera\./,"").replace(/_/g," "),r=(t||[]).map(t=>({...t,members:(t.members||[]).filter(t=>!s.includes(t))})).filter(t=>t.members.length>=2&&t.id!==i);return Rt([...r,{id:i,name:a,members:s}])}(this._streamGroups,{id:s?.id,name:this._groupDraftName,members:e});await this._persistStreamGroups(i),this._syncGroupDraftFromCamera(t)}async _suggestGroupFromDevice(t){await this._loadDeviceMap();const e=function(t,e={}){const s=String(t||"");if(!s.startsWith("camera."))return[];const i=e.deviceMap;let a=null;if(i instanceof Map?a=i.get(s)||null:i&&"object"==typeof i&&(a=i[s]||null),!a)return[];const r=Lt(e.groups,s),n=new Set;for(const t of e.groups||[])if(!r||t.id!==r.id)for(const e of t.members||[])n.add(e);const o=new Set((e.cameras||[]).map(t=>String(t?.entityId||t||"")).filter(t=>t.startsWith("camera."))),c=[],l=i instanceof Map?i.entries():Object.entries(i||{});for(const[t,e]of l){const i=String(t);i.startsWith("camera.")&&i!==s&&String(e)===String(a)&&(n.has(i)||o.size&&!o.has(i)||c.push(i))}return c.sort()}(t,{cameras:this._cameras(),deviceMap:this._deviceMap,groups:this._streamGroups});e.length?(this._groupDraftMembers=[...new Set([t,...this._groupDraftMembers,...e])].slice(0,8),this._groupDraftName||(this._groupDraftName=t.replace(/^camera\./,"").replace(/_high_resolution_channel$/,"").replace(/_/g," ")),this._status=`Suggested ${e.length} stream${1===e.length?"":"s"} from the same device`):this._status="No same-device camera streams found to group"}async _ungroupCamera(t){const e=Lt(this._streamGroups,t);e?(await this._persistStreamGroups(function(t,e){const s=String(e||"");return Rt((t||[]).filter(t=>t.id!==s))}(this._streamGroups,e.id)),this._syncGroupDraftFromCamera(t)):this._status="This stream is not in a group"}_openDetail(t){this._detailId=t,this._sensorFilter="";const e=this._forceAspectLabel(t);this._customAspectDraft=e&&"auto"!==e&&!re(e)?e:"",this._syncGroupDraftFromCamera(t)}_back(){this._detailId=null,this._sensorFilter="",this._customAspectDraft="",this._groupDraftMembers=[],this._groupDraftName=""}_setQuality(t,e){if(!this.panelMode){const s=this._groupMembers(t);Jt(t,e);for(const i of s)i!==t&&Jt(i,e);return void(this._qualityTick+=1)}this._cameraQuality=function(t,e,s,i=null){const a=Bt(s),r=[...new Set([...i||[],e].map(String).filter(t=>t.startsWith("camera.")))],n={...t||{}};for(const t of r)"auto"===a?delete n[t]:n[t]=a;return Gt(n)}(this._cameraQuality,t,e,this._groupMembers(t)),this._syncPrefsDirty(),this._qualityTick+=1}async _setPickerQuality(t,e){if(this._setQuality(t,e),this.panelMode)try{await this._saveCameraPrefs()}catch(t){this._status=t?.message||"Could not save quality"}}async _setPickerForceAspect(t,e){if(this._setForceAspect(t,e),this.panelMode)try{await this._saveCameraPrefs()}catch(t){this._status=t?.message||"Could not save aspect"}}async _run(t,e){this._status=`Calling ${t}…`;try{await yt(this.hass,t,e),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}async _saveRetentionDays(t){const e=Math.max(1,Math.min(30,Number(t)||1));this._retentionDays=e,this._saving=!0;try{await _e(this.hass,{retention_days:e}),this._status=`Retention set to ${e} day${1===e?"":"s"}`}catch(t){this._status=t?.message||"Could not save retention"}finally{this._saving=!1}}async _toggleRecordOnDetection(t){this._recordOnDetection=t,this._saving=!0;try{await _e(this.hass,{record_on_detection:t}),this._status=t?"Detection recording enabled":"Detection recording paused"}catch(t){this._status=t?.message||"Could not save recording setting"}finally{this._saving=!1}}async _toggleNotifyOnDetection(t){this._notifyOnDetection=t,this._saving=!0;try{await async function(t,e){return t?.callWS?t.callWS({type:"cctv_dashboard/set_user_notify",notify_on_detection:Boolean(e)}):null}(this.hass,t),this._status=t?"You will be notified when a detection is recorded (this account only)":"Detection notifications disabled for your account"}catch(t){this._status=t?.message||"Could not save notification preference",await this._loadRecordingUi()}finally{this._saving=!1}}_toggleTvMode(t){this._tvMode=Boolean(t),function(t){try{if("undefined"==typeof localStorage)return;localStorage.setItem(Fe,t?"1":"0")}catch{}}(this._tvMode),this._syncTvModeAttr(),this._tvMode&&(this._pickerOpen=!1,this._settingsOpen=!1),this._refreshTvStage(),this._status=this._tvMode?"TV mode on — 16:9 mosaic fills this display width (saved on this device)":"TV mode off",this._schedulePack(),this.updateComplete.then(()=>this._bindPackObserver())}async _toggleRecordKind(t,e){const s=String(t||""),i=new Set(this._recordDetectionKinds||[]);e?i.add(s):i.delete(s);const a=wt.map(t=>t.id).filter(t=>i.has(t));this._recordDetectionKinds=a,this._saving=!0;try{await _e(this.hass,{record_detection_kinds:a});const t=wt.filter(t=>a.includes(t.id)).map(t=>t.label);this._status=a.length?`Saving video for: ${t.join(", ")}`:"Video save disabled for all detection types (timeline still logs events)"}catch(t){this._status=t?.message||"Could not save detection-type filter",await this._loadRecordingUi()}finally{this._saving=!1}}async _refreshSessions(){this._sessions=await ge(this.hass),this._status="Recordings refreshed"}_refreshTimeline(){const t=this.renderRoot?.querySelector?.("cctv-detection-timeline");t?.reload?.()}_isAdmin(){return Boolean(this.hass?.user?.is_admin)}async _deleteSession(t,e){if(e?.stopPropagation?.(),e?.preventDefault?.(),this._isAdmin()){if("undefined"==typeof window||window.confirm("Delete this saved detection’s recordings for all users?"))try{const e=await async function(t,e){if(!t?.callWS)return!1;const s=await t.callWS({type:"cctv_dashboard/delete_recording",session_id:e});return Boolean(s?.deleted)}(this.hass,t);this._sessions=await ge(this.hass),this._playback?.session?.session_id===t&&this._returnToLive(),this._status=e?"Saved detection deleted for all users":"Recording was already removed"}catch(t){this._status=t?.message||"Could not delete recording"}}else this._status="Only Home Assistant admins can delete saved detections"}async _clearAllDetections(t){if(t?.stopPropagation?.(),t?.preventDefault?.(),this._isAdmin()){if("undefined"==typeof window||window.confirm("Delete ALL saved detections and reset the detection timeline for every Home Assistant user? This cannot be undone.")){this._saving=!0;try{const t=await async function(t){return t?.callWS?t.callWS({type:"cctv_dashboard/clear_detections"}):null}(this.hass);this._sessions=await ge(this.hass),this._refreshTimeline(),this._playback&&this._returnToLive();const e=Number(t?.sessions_cleared)||0,s=Number(t?.events_cleared)||0;this._status=`Cleared ${e} recording${1===e?"":"s"} and ${s} timeline event${1===s?"":"s"} for all users`}catch(t){this._status=t?.message||"Could not clear detections"}finally{this._saving=!1}}}else this._status="Only Home Assistant admins can clear saved detections"}async _selectPlaybackSession(t,e=null){if(!De(t))return this._status="No playable recording for that detection",!1;const s=Ae(this.hass,t.trigger_sensors||[]),i=this._maxStreams(),a=this._visibleIds.slice(0,i),r=function(t,e,s=4){const i=Math.max(1,Number(s)||4),a=Te(t),r=new Set(a),n=(e||[]).map(String).filter(t=>t.startsWith("camera."));if(n.length){const t=n.filter(t=>r.has(t)).slice(0,i);return t.length?{cameraIds:t,usedFallback:!1,reason:""}:{cameraIds:a.slice(0,i),usedFallback:!0,reason:"no-selected-clips"}}return{cameraIds:a.slice(0,i),usedFallback:!0,reason:"empty-selection"}}(t,a,i);if(!r.cameraIds.length)return this._status=a.length?"No playable clips for this detection (files missing or empty)":"No playable clips for this detection — select cameras or wait for recordings",!1;const n=Ne(this.hass,t,r.cameraIds),o=n.some(t=>(t.items||[]).some(t=>"video"===t.kind||"snapshot"===t.kind));if(!o)return this._status="No playable clips for this detection (files missing or empty)",!1;const c=function(t,e=null){const s=Number(e?.start),i=Number(e?.end),a=Me(t?.started),r=Me(t?.ended||t?.started),n=Number.isFinite(s)?s:a;let o=Number.isFinite(i)?i:r;return!Number.isFinite(o)&&Number.isFinite(n)&&(o=n+6e4),Number.isFinite(n)&&Number.isFinite(o)&&o<n&&(o=n),{start:n,end:o}}(t,e);this._detailId=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map;for(const t of n){const e=Re(t,c.start);this._playbackIndex.set(t.cameraId,e.index),this._playbackSeek.set(t.cameraId,e.seekSec),this._playbackDone.set(t.cameraId,!t.items.length)}this._playback={session:t,labels:s,playing:!1,paused:!1,tracks:n,windowStart:c.start,windowEnd:c.end,eventDetail:e,triggerHighlights:Se(this.hass,t,this._sensorLinks,e,this._streamGroups)};const l=r.cameraIds.length;return"empty-selection"===r.reason?this._status=`No mosaic selection — playing ${l} camera${1===l?"":"s"} with clips`:"no-selected-clips"===r.reason?this._status=`Selected mosaic cams had no clips — playing ${l} camera${1===l?"":"s"} with recordings`:this._status=`Selected ${s.join(", ")} — Play replaces live mosaic for ${l} cam${1===l?"":"s"}`,this._schedulePack(),!0}async _freshPlaybackSession(t){if(!t?.session_id||!this.hass)return t;try{const e=await ge(this.hass);this._sessions=e;const s=e.find(e=>e.session_id===t.session_id);return s||t}catch(e){return console.warn("CCTV: could not refresh recordings before Play",e),t}}async _playSavedDetection(t,e=null){e?.stopPropagation?.(),e?.preventDefault?.();const s=await this._freshPlaybackSession(t);await this._selectPlaybackSession(s)&&this._playback&&this._playback.session?.session_id===s.session_id&&!this._playback.playing&&await this._startPlayback()}_onPlayDetection(t){const e=t?.detail,s=function(t,e){if(!t?.length||!e)return null;const s=Number(e.start),i=Number(e.end);if(!Number.isFinite(s)||!Number.isFinite(i))return null;const a=new Set((e.sensors||[]).map(t=>t.entityId).filter(Boolean));let r=null,n=-1;for(const e of t){if(e.active)continue;if(!(e.clips||[]).length)continue;const t=Date.parse(e.started),o=Date.parse(e.ended||e.started);if(!Number.isFinite(t)||!Number.isFinite(o))continue;const c=Math.min(i,o)-Math.max(s,t);if(c<=0)continue;let l=c;const d=e.trigger_sensors||[];a.size&&d.some(t=>a.has(t))&&(l+=6e4),l>n&&(n=l,r=e)}return r}(this._sessions||[],e);s?this._selectPlaybackSession(s,e):this._status="No saved recording overlaps that timeline event"}async _startPlayback(){if(!this._playback?.tracks?.length)return;this._status="Signing recording URLs…";try{await async function(t,e){const s=[];for(const i of e||[]){const e=[];for(const a of i.items||[])0!==Number(a.size)||"video"!==a.kind?(e.push(a),s.push((async()=>{null==a.filePath&&a.path&&!String(a.path).includes("/api/")&&(a.filePath=a.path),a.path=be(a),a.url=await ve(t,a.path)})())):console.warn("CCTV: skipping empty video clip",a.path||a.url);i.items=e}return await Promise.all(s),e}(this.hass,this._playback.tracks)}catch(t){return console.warn("CCTV: could not sign playback URLs",t),void(this._status=t?.message||"Could not sign recording URLs (auth/sign_path failed)")}const t=this._playback.tracks.some(t=>(t.items||[]).some(t=>"video"===t.kind||"snapshot"===t.kind));t?(this._resetLiveStreamSlots(),this._playback={...this._playback,playing:!0,paused:!1},this._status=`Playing ${this._playback.labels.join(", ")} (synced)`,this.requestUpdate(),await this.updateComplete,await this._waitForPlaybackMedia(),await this._kickPlaybackVideos()):this._status="No playable clips (files missing or empty)"}async _togglePlaybackPause(){this._playback&&(this._playback.playing?this._playback.paused?await this._resumePlayback():this._pausePlaybackClips():await this._startPlayback())}_pausePlaybackClips(){if(!this._playback?.playing)return;const t=this.renderRoot;t?.querySelectorAll?.("video.playback-media").forEach(t=>{try{t.pause?.()}catch{}}),this._playback={...this._playback,paused:!0},this._status=`Paused ${this._playback.labels.join(", ")}`}async _resumePlayback(){if(!this._playback?.playing)return void await this._startPlayback();this._playback={...this._playback,paused:!1},this._status=`Playing ${this._playback.labels.join(", ")} (synced)`;const{videos:t}=this._playbackMediaEls();t.length?await Promise.all(t.map(async t=>{try{t.muted=!0,t.playsInline=!0,await t.play()}catch(t){console.warn("CCTV resume play() failed",t)}})):await this._kickPlaybackVideos()}async _restartPlayback(){if(!this._playback?.tracks?.length)return;const t=Number(this._playback.windowStart);this._playbackDone=new Map,this._playbackIndex=new Map,this._playbackSeek=new Map;for(const e of this._playback.tracks){const s=Re(e,t);this._playbackIndex.set(e.cameraId,s.index),this._playbackSeek.set(e.cameraId,s.seekSec),this._playbackDone.set(e.cameraId,!e.items.length)}this._teardownPlaybackMedia({clearSrc:!0}),this._playbackMountGen+=1,this._playback={...this._playback,playing:!0,paused:!1},this._status=`Restarting ${this._playback.labels.join(", ")}…`,this.requestUpdate(),await this.updateComplete,await this._waitForPlaybackMedia(),await this._kickPlaybackVideos(),this._playback?.playing&&!this._playback?.paused&&(this._status=`Playing ${this._playback.labels.join(", ")} (restarted)`)}_returnToLive(){this._teardownPlaybackMedia({clearSrc:!0}),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map;try{We.releaseAll()}catch(t){console.warn("CCTV: stream slot reset failed",t)}this._unloadStreamPlayers(),this._liveMountGen+=1,this._status="Live mosaic",this._schedulePack(),this.updateComplete.then(()=>{this._wakeLiveStreamPlayers(),this._tvMode&&this._refreshTvStage()})}_stopPlayback(){this._returnToLive()}_wakeLiveStreamPlayers(){const t=this.renderRoot;t?.querySelectorAll&&t.querySelectorAll("cctv-stream-player").forEach(t=>{try{t.active=!0,t._idleReason="",t._reconcilePlayback?.()}catch{}})}_teardownPlaybackMedia(t={}){const e=!1!==t.clearSrc,s=this.renderRoot;s&&s.querySelectorAll("video.playback-media").forEach(t=>{try{t.pause?.(),e&&(t.removeAttribute("src"),t.load?.())}catch{}})}_playbackMediaEls(){const t=this.renderRoot;return t?.querySelectorAll?{videos:[...t.querySelectorAll("video.playback-media")],snapshots:[...t.querySelectorAll("img.playback-media")],empty:[...t.querySelectorAll(".playback-empty")]}:{videos:[],snapshots:[],empty:[]}}_playbackHasVideoClips(){return(this._playback?.tracks||[]).some(t=>(t.items||[]).some(t=>"video"===t.kind))}async _waitForPlaybackMedia(t={}){const e=Number(t.timeoutMs)>0?Number(t.timeoutMs):2500,s=Date.now()+e;let i=0;for(;this._playback?.playing&&Date.now()<s;){const t=this._playbackMediaEls();if(t.videos.length||t.snapshots.length||t.empty.length)return t;i+=1,i%3==0&&(this.requestUpdate(),await this.updateComplete),await new Promise(t=>requestAnimationFrame(()=>t()))}return this._playbackMediaEls()}async _kickPlaybackVideos(){if(!this._playback?.playing||this._playback?.paused)return;let{videos:t}=this._playbackMediaEls();if(t.length||({videos:t}=await this._waitForPlaybackMedia({timeoutMs:1500})),!t.length){const t=this._playbackMediaEls();return t.snapshots.length&&!this._playbackHasVideoClips()?void(this._status=`Playing ${this._playback.labels.join(", ")} (snapshots)`):!t.empty.length||t.snapshots.length||this._playbackHasVideoClips()?void(this._status="Playback ready but no video elements found"):void(this._status="No recording tiles for the selected cameras")}const e=await Promise.all(t.map(t=>this._startOnePlaybackVideo(t))),s=e.filter(t=>!t.ok);s.length&&s.length===e.length?this._status=`Playback failed to start (${s[0].reason||"media error"})`:s.length&&(this._status=`Playing ${e.length-s.length}/${e.length} cameras`)}_startOnePlaybackVideo(t){const e=t.getAttribute("data-camera")||"",s=Number(this._playbackSeek.get(e))||0,i=this._trackForCamera(e),a=i?this._currentPlaybackItem(i):null;if(t.muted=!0,t.defaultMuted=!0,t.playsInline=!0,t.setAttribute("muted",""),t.setAttribute("playsinline",""),t.setAttribute("webkit-playsinline",""),t.preload="auto","video"===a?.kind&&a.url){const e=t.getAttribute("src")||t.currentSrc||"";if(!e||e!==a.url){t.setAttribute("src",a.url),t.src=a.url;try{t.load?.()}catch{}}}const r=async()=>{try{try{Number.isFinite(s)&&Math.abs((t.currentTime||0)-s)>.05?t.currentTime=s:0===s&&(t.currentTime||0)>.05&&(t.currentTime=0)}catch{}return await t.play(),{ok:!0,cameraId:e}}catch(s){const i=s?.name||s?.message||"play() rejected";console.warn("CCTV playback play() failed",e,s);try{return t.muted=!0,await t.play(),{ok:!0,cameraId:e}}catch(t){return console.warn("CCTV playback retry failed",e,t),{ok:!1,cameraId:e,reason:i}}}};return new Promise(s=>{if(t.readyState>=2)r().then(s);else{t.addEventListener("loadeddata",()=>{r().then(s)},{once:!0}),t.addEventListener("error",()=>{const i=t.error?.code,a=4===i?"unsupported/unauthorized media (check signed URL)":2===i?"network error loading clip":`media error ${i||""}`.trim();console.warn("CCTV playback media error",e,t.error,t.currentSrc),s({ok:!1,cameraId:e,reason:a})},{once:!0});try{t.load()}catch{r().then(s)}}})}_playbackVideoEl(t){const e=String(t).replace(/\\/g,"\\\\").replace(/"/g,'\\"');return this.renderRoot?.querySelector?.(`video.playback-media[data-camera="${e}"]`)}_onPlaybackEnded(t){if(!this._playback?.playing||this._playback?.paused)return;const e=this._playback.tracks.find(e=>e.cameraId===t);if(!e)return;const s=(this._playbackIndex.get(t)||0)+1,i=Number(this._playback.windowEnd);if(s<e.items.length){const a=e.items[s];return Number.isFinite(i)&&Number.isFinite(a.startedMs)&&a.startedMs>=i?void this._markPlaybackCameraDone(t):(this._playbackIndex.set(t,s),this._playbackSeek.set(t,0),"snapshot"===a.kind?void this.requestUpdate():void this._advancePlaybackVideo(t,a))}this._markPlaybackCameraDone(t)}async _advancePlaybackVideo(t,e){const s=this._playbackVideoEl(t);if(s)try{e.path=be(e),e.url=await ve(this.hass,e.path),s.muted=!0,s.playsInline=!0,s.src=e.url,s.load?.(),await this._startOnePlaybackVideo(s)}catch(e){console.warn("CCTV chunk advance failed",t,e),this._markPlaybackCameraDone(t)}else this._markPlaybackCameraDone(t)}_markPlaybackCameraDone(t){this._playbackDone.set(t,!0);const e=(this._playback?.tracks||[]).every(t=>!t.items.length||(!!t.items.every(t=>"snapshot"===t.kind)||this._playbackDone.get(t.cameraId)));e&&this._playback?.playing&&(this._pausePlaybackClips(),this._status=`Finished ${this._playback.labels.join(", ")} — Restart or Back to live`)}_trackForCamera(t){return this._playback?.tracks?.find(e=>e.cameraId===t)||null}_currentPlaybackItem(t){if(!t?.items?.length)return null;const e=Math.min(this._playbackIndex.get(t.cameraId)||0,Math.max(0,t.items.length-1));return t.items[e]||null}_stableCameraNames(t){const e=t.map(t=>`${t.entityId}:${t.name}`).join("|");return e===this._cameraNamesKey||(this._cameraNamesKey=e,this._cameraNamesCache=Object.fromEntries(t.map(t=>[t.entityId,t.name]))),this._cameraNamesCache}render(){if(!this.hass)return F`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;this._qualityTick,this._deviceMapReady;const t=this._cameras(),e=this._maxStreams();We.setMax(e);const s=this.config?.title||"CCTV";if(this.panelMode&&!this._selectionReady)return F`
        <div class="panel-wrap wrap">
          <p class="placeholder">Loading camera selection…</p>
        </div>
      `;if(this.panelMode&&!this._panelActive)return F`
        <div class="panel-wrap wrap">
          <p class="placeholder">CCTV paused — streams unloaded while you are away.</p>
        </div>
      `;const i=t.find(t=>t.entityId===this._detailId)||null,a=this.panelMode?this._layoutCameras(t):t,r=this._stableCameraNames(t),n=Boolean(this._playback?.playing),o=Boolean(n&&this._playback?.paused),c=this._panelActive,l=[this.panelMode?"panel-wrap wrap":"wrap",this.panelMode&&this._tvMode?"tv-mode":""].filter(Boolean).join(" ");return F`
      <div class=${l}>
        <div class="top ${this._tvMode?"top-tv":""}">
          <div>
            ${this.panelMode&&!this._tvMode?F`<p class="eyebrow">Home Assistant</p>`:z}
            <h1>${s}${this._tvMode?F`<span class="tv-badge">TV</span>`:z}</h1>
          </div>
          <div class="top-actions">
            ${this.panelMode?F`
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
                `:z}
            <span class="status">
              ${this._status||(this.panelMode?`${a.length}/${e} selected · ${n?o?"paused":"playback":`${We.activeCount()} live`}`:`${t.length} camera${1===t.length?"":"s"} · ${We.activeCount()} live`)}
              ${this._saving?" · saving…":""}
            </span>
          </div>
        </div>

        ${this.panelMode&&this._pickerOpen?this._renderPicker(t,e):z}

        ${this.panelMode&&this._settingsOpen?this._renderSettings():z}

        ${this.panelMode&&this._playback?this._renderPlaybackBar():z}

        ${i?this._renderDetail(i,c):this.panelMode?this._renderLayout(a,c):this._renderCardGrid(t)}

        ${this.panelMode&&!i?F`
              <cctv-detection-timeline
                .hass=${this.hass}
                .cameras=${a.map(t=>t.entityId)}
                .sensorLinks=${this._sensorLinks}
                .cameraNames=${r}
                .active=${c}
                @cctv-play-detection=${this._onPlayDetection}
              ></cctv-detection-timeline>
              ${this._renderRecordings()}
            `:z}
      </div>
    `}_renderPlaybackBar(){const t=this._playback;if(!t)return z;const e=t.session?.started?new Date(t.session.started).toLocaleString():"—",s=t.playing&&!t.paused?"Pause":"Play";return F`
      <div class="playback-bar" role="region" aria-label="Detection playback">
        <div class="playback-bar-meta">
          <strong>${t.labels.join(", ")}</strong>
          <span class="hint">${e} · ${xe(Ce(t.session))}${t.playing&&t.paused?" · paused":""}</span>
        </div>
        <div class="playback-bar-actions">
          <button
            class="btn primary"
            type="button"
            @click=${this._togglePlaybackPause}
          >
            ${s}
          </button>
          ${t.playing?F`
                <button class="btn" type="button" @click=${this._restartPlayback}>
                  Restart
                </button>
              `:z}
          <button class="btn" type="button" @click=${this._returnToLive}>
            Back to live
          </button>
        </div>
      </div>
    `}_renderSettings(){const t=this._recordDetectionKinds||[];return F`
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
              Per-device (this browser / kiosk). Fits a 16:9 mosaic above the fold
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
            ${wt.map(e=>F`
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
        <div class="settings-debug" aria-label="Recording debug">
          <div class="picker-head">
            <strong>Recording debug</strong>
            <button class="btn" type="button" @click=${this._copyRecordingDebug}>
              Copy
            </button>
          </div>
          <span class="hint">
            Settings-only. Last session clip kinds/sizes/paths/URLs and why
            <code>camera.record</code> fell back to snapshot. Also available as
            <code>sensor.cctv_dashboard_recording_debug</code> (attribute
            <code>debug_text</code>) — not shown on the main mosaic.
          </span>
          ${this._recordingDebugSummary?F`<p class="hint"><code>${this._recordingDebugSummary}</code></p>`:z}
          <textarea
            class="settings-debug-text"
            readonly
            rows="12"
            .value=${this._recordingDebug||"No recording session debug yet. Trigger a detection to populate."}
          ></textarea>
        </div>
      </section>
    `}_renderRecordings(){const t=(this._sessions||[]).filter(t=>t.active||De(t)),e=this._isAdmin();return F`
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
            ${e?F`
                  <button
                    class="btn recording-delete"
                    type="button"
                    ?disabled=${this._saving}
                    title="Delete all saved detections and reset the timeline"
                    @click=${t=>this._clearAllDetections(t)}
                  >
                    Clear all
                  </button>
                `:z}
          </div>
        </div>
        ${t.length?F`
              <div class="recording-list">
                ${t.map(t=>this._renderSession(t,e))}
              </div>
            `:F`<p class="empty">No detection recordings yet.</p>`}
      </section>
    `}_renderSession(t,e=!1){const s=t.started?new Date(t.started).toLocaleString():"—",i=Ae(this.hass,t.trigger_sensors||[]),a=xe(Ce(t)),r=this._playback?.session?.session_id===t.session_id,n=De(t);return F`
      <div
        class="recording-item ${t.active?"active":""} ${r?"selected":""}"
      >
        <button
          type="button"
          class="recording-select"
          ?disabled=${!n}
          @click=${()=>this._selectPlaybackSession(t)}
        >
          <div class="recording-meta">
            <span class="recording-when">${s}${t.active?" · recording…":""}</span>
            <span class="recording-detected">${i.join(", ")}</span>
          </div>
          <span class="recording-size">${a}</span>
        </button>
        <div class="recording-actions">
          <button
            type="button"
            class="btn primary recording-play"
            title="Play this detection on the mosaic"
            ?disabled=${!n}
            @click=${e=>this._playSavedDetection(t,e)}
          >
            Play
          </button>
          ${e&&!t.active?F`
                <button
                  type="button"
                  class="btn recording-delete"
                  title="Delete recordings for all users"
                  @click=${e=>this._deleteSession(t.session_id,e)}
                >
                  Delete
                </button>
              `:z}
        </div>
      </div>
    `}_pickerRows(t){const e=new Map(t.map(t=>[t.entityId,t])),s=new Set,i=[];for(const a of t){if(s.has(a.entityId))continue;const t=this._groupFor(a.entityId);if(t){for(const e of t.members)s.add(e);const a=t.members.map(t=>e.get(t)||mt(t,this.hass?.states?.[t])).filter(Boolean),r=this._visibleIds.find(e=>t.members.includes(e))||null;i.push({type:"group",group:t,members:a,selectedId:r})}else s.add(a.entityId),i.push({type:"camera",cam:a})}return i}_renderPicker(t,e){if(!t.length)return F`<p class="empty">No camera entities found.</p>`;const s=this._pickerRows(t);return F`
      <section class="picker" aria-label="Camera selection">
        <div class="picker-head">
          <strong>Visible streams</strong>
          <span class="hint">
            Select 1–${e}. For grouped physical cameras, pick which stream and quality.
            Live failover uses another group stream if the preferred one fails.
            Selection is per user; sensors/groups stay shared.
          </span>
        </div>
        <div class="picker-list">
          ${s.map(t=>{if("group"===t.type){const s=t.selectedId,i=Boolean(s),a=!i&&this._visibleIds.length>=e,r=s||t.members[0]?.entityId||"",n=r?this._qualityFor(r):"auto",o=r?ne(this._forceAspectLabel(r)):"auto",c=r?this._linksFor(r).length:0;return F`
                <div class="picker-item picker-group ${a?"disabled":""}">
                  <label class="picker-group-main">
                    <input
                      type="checkbox"
                      .checked=${i}
                      ?disabled=${a&&!i}
                      @change=${e=>this._toggleVisible(r||t.members[0]?.entityId,e.target.checked)}
                    />
                    <span class="picker-name">
                      ${t.group.name}
                      <span class="group-badge">${t.members.length} streams</span>
                    </span>
                  </label>
                  <span class="picker-id">
                    ${c?`${c} sensor${1===c?"":"s"} shared`:"No sensors linked yet"}
                    · quality ${n} · aspect ${o}
                  </span>
                  <div class="picker-stream-controls">
                    <label>
                      Stream
                      <select
                        ?disabled=${!i||this._saving}
                        @change=${t=>this._setPreferredStream(s||r,t.target.value)}
                      >
                        ${t.members.map(t=>F`<option
                              value=${t.entityId}
                              ?selected=${t.entityId===r}
                            >
                              ${t.name||t.entityId}
                            </option>`)}
                      </select>
                    </label>
                    <label>
                      Quality
                      <select
                        ?disabled=${!i||this._saving}
                        @change=${t=>this._setPickerQuality(r,t.target.value)}
                      >
                        ${Ft.map(t=>F`<option
                              value=${t.value}
                              ?selected=${t.value===n}
                            >
                              ${t.label}
                            </option>`)}
                      </select>
                    </label>
                    <label>
                      Aspect
                      <select
                        ?disabled=${!i||this._saving}
                        @change=${t=>this._setPickerForceAspect(r,t.target.value)}
                      >
                        ${ee.map(t=>F`<option
                              value=${t.value}
                              ?selected=${t.value===o}
                            >
                              ${t.label}
                            </option>`)}
                      </select>
                    </label>
                  </div>
                </div>
              `}const s=t.cam,i=this._visibleIds.includes(s.entityId),a=!i&&this._visibleIds.length>=e,r=this._linksFor(s.entityId).length,n=this._qualityFor(s.entityId),o=ne(this._forceAspectLabel(s.entityId));return F`
              <div class="picker-item ${a?"disabled":""}">
                <label class="picker-group-main">
                  <input
                    type="checkbox"
                    .checked=${i}
                    ?disabled=${a}
                    @change=${t=>this._toggleVisible(s.entityId,t.target.checked)}
                  />
                  <span class="picker-name">${s.name}</span>
                </label>
                <span class="picker-id">
                  ${s.entityId}${r?` · ${r} sensor${1===r?"":"s"}`:""}
                  · quality ${n} · aspect ${o}
                </span>
                <div class="picker-stream-controls">
                  <label>
                    Quality
                    <select
                      ?disabled=${!i||this._saving}
                      @change=${t=>this._setPickerQuality(s.entityId,t.target.value)}
                    >
                      ${Ft.map(t=>F`<option
                            value=${t.value}
                            ?selected=${t.value===n}
                          >
                            ${t.label}
                          </option>`)}
                    </select>
                  </label>
                  <label>
                    Aspect
                    <select
                      ?disabled=${!i||this._saving}
                      @change=${t=>this._setPickerForceAspect(s.entityId,t.target.value)}
                    >
                      ${ee.map(t=>F`<option
                            value=${t.value}
                            ?selected=${t.value===o}
                          >
                            ${t.label}
                          </option>`)}
                    </select>
                  </label>
                </div>
              </div>
            `})}
        </div>
      </section>
    `}_renderLayout(t,e=!0){if(!t.length)return F`
        <p class="empty">
          Select cameras above to start streaming.
          One camera fills the view; two to four split the screen equally (max ${this._maxStreams()}).
        </p>
      `;const s=t.slice(0,4);if(!this._isDesktop){const t=s.length;return F`
        <div class="layout layout-${t}" role="list">
          ${s.map(t=>this._renderLayoutTile(t,!1,e))}
        </div>
      `}const i=this._tvMode&&this._tvStage?.width>=8&&this._tvStage?.height>=8?`width:${this._tvStage.width}px;height:${this._tvStage.height}px;max-width:100%;aspect-ratio:16/9;`:this._tvMode?"width:100%;max-width:100%;aspect-ratio:16/9;":z,a=this._tvMode&&s.length<=2?"layout-pack-maximize":"";return F`
      <div
        class="layout layout-pack ${this._tvMode?"layout-pack-tv":""} ${a}"
        role="list"
        style=${i}
        @cctv-media-aspect=${this._onMediaAspect}
      >
        ${s.map(t=>this._renderLayoutTile(t,!0,e))}
      </div>
    `}_renderLayoutTile(t,e,s=!0){const i=this._qualityFor(t.entityId),a=Ot(this._streamGroups,t.entityId),r=jt(t.entityId,a),n=this._linksFor(t.entityId).length,o=e?this._packStyles?.[t.entityId]:"",c=Boolean(e&&o),l=Boolean(this._playback?.playing),d=Boolean(l&&this._playback?.paused),h=l?this._trackForCamera(t.entityId):null,u=h?this._currentPlaybackItem(h):null,p=ae(this._forceAspectLabel(t.entityId)),m=l&&this._playback?.triggerHighlights?this._playback.triggerHighlights[t.entityId]:null;return F`
      <article
        class="tile layout-tile ${c?"pack-tile":""}"
        role="listitem"
        style=${c?o:z}
      >
        <div class="tile-media" style=${!c&&p?`aspect-ratio:${p}; width:100%;`:z}>
          ${l?u?"snapshot"===u.kind?dt(`${this._playbackMountGen}:${t.entityId}:snap:${u.url}`,F`<img
                      class="playback-media"
                      alt=""
                      src=${u.url}
                      @load=${e=>this._onPlaybackMediaSize(t.entityId,e.target.naturalWidth,e.target.naturalHeight)}
                    />`):dt(`${this._playbackMountGen}:${t.entityId}:vid:${u.url}`,F`
                      <video
                        class="playback-media"
                        data-camera=${t.entityId}
                        src=${u.url}
                        ?autoplay=${!d}
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
                    `):F`<div class="playback-empty">No recording for this camera</div>`:dt(`${this._liveMountGen}:${t.entityId}`,F`
                  <cctv-stream-player
                    large
                    mosaic
                    eager
                    .active=${s}
                    .hass=${this.hass}
                    .camera=${t}
                    .config=${this.config}
                    .quality=${i}
                    .groupMembers=${a}
                    .failoverEntityIds=${r}
                    context="mosaic"
                    muted
                    @cctv-stream-failover=${t=>{const e=t?.detail?.to;e&&(this._status=`Live failover → ${e.replace(/^camera\./,"")}`)}}
                  ></cctv-stream-player>
                `)}
          ${m?F`<div
                class="trigger-cam-overlay kind-${m.kindId}"
                style=${`--cctv-trigger-color:${m.color}`}
                aria-hidden="true"
              ></div>`:z}
        </div>
        ${l?F`
              <div class="tile-body ${e?"pack-caption":""}">
                <p class="tile-title">${t.name}</p>
                <p class="tile-meta">${d?"Paused":"Playback"}</p>
              </div>
            `:F`
              <button
                type="button"
                class="tile-body tile-open ${e?"pack-caption":""}"
                @click=${()=>this._openDetail(t.entityId)}
              >
                <p class="tile-title">${t.name}</p>
                <p class="tile-meta">
                  <span class="dot ${t.state}"></span>${t.state} · ${i}
                  ${n?F` · ${n} detection`:z}
                </p>
              </button>
            `}
      </article>
    `}_renderCardGrid(t){return t.length?F`
      <div class="grid" role="list">
        ${t.map(t=>{const e=this._qualityFor(t.entityId);return F`
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
    `:F`<p class="empty">No camera entities found.</p>`}_renderDetail(t,e=!0){const s=bt(this.hass,t),i=this._qualityFor(t.entityId),a=Xt(this.hass,t,this.config,i,"detail"),r=ne(this._forceAspectLabel(t.entityId)),n=this.panelMode&&("custom"===r||Boolean(this._customAspectDraft)),o=this._customAspectDraft||("custom"===r?this._forceAspectLabel(t.entityId):""),c=this._groupFor(t.entityId),l=this._groupMembers(t.entityId);return F`
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
          .quality=${i}
          .groupMembers=${l}
          .failoverEntityIds=${jt(t.entityId,l)}
          context="detail"
          .muted=${!1}
          controls
        ></cctv-stream-player>
      </div>
      ${c?F`
            <div class="quality-row">
              <label>
                Live stream
                <select
                  @change=${e=>{const s=e.target.value;this._setPreferredStream(t.entityId,s),this._detailId=s,this._syncGroupDraftFromCamera(s)}}
                >
                  ${c.members.map(e=>{const s=this._cameras().find(t=>t.entityId===e)||mt(e,this.hass?.states?.[e]);return F`<option
                      value=${e}
                      ?selected=${e===t.entityId}
                    >
                      ${s?.name||e}
                    </option>`})}
                </select>
              </label>
              <span class="hint">Physical group: ${c.name}</span>
            </div>
          `:z}
      <div class="quality-row">
        <label>
          Stream quality
          <select
            @change=${e=>this._setQuality(t.entityId,e.target.value)}
          >
            ${Ft.map(t=>F`<option
                  value=${t.value}
                  ?selected=${t.value===i}
                >
                  ${t.label}
                </option>`)}
          </select>
        </label>
        <span class="hint">${Yt(i)}</span>
      </div>
      ${this.panelMode?F`
            <div class="quality-row">
              <label>
                Force aspect ratio
                <select
                  @change=${e=>this._setForceAspect(t.entityId,e.target.value)}
                >
                  ${ee.map(t=>F`<option
                        value=${t.value}
                        ?selected=${t.value===r}
                      >
                        ${t.label}
                      </option>`)}
                </select>
              </label>
              <span class="hint">Shared for all users.</span>
            </div>
            ${n?F`
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
                `:z}
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
          `:z}
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
        ${s.length?s.map(e=>F`
                <button
                  class="btn primary"
                  type="button"
                  @click=${()=>this._run(e.service,t.entityId)}
                >
                  ${e.label}
                </button>
              `):F`<span class="placeholder">No camera services available</span>`}
        <button
          class="btn"
          type="button"
          @click=${()=>vt(this,t.entityId)}
        >
          More info
        </button>
      </div>
      ${this.panelMode?this._renderStreamGroupSettings(t):z}
      ${this.panelMode?this._renderSensorSettings(t):z}
    `}_renderStreamGroupSettings(t){const e=this._groupFor(t.entityId),s=new Set(this._groupDraftMembers||[t.entityId]);s.has(t.entityId)||s.add(t.entityId);const i=this._cameras(),a=new Set;for(const t of this._streamGroups||[])if(!e||t.id!==e.id)for(const e of t.members||[])a.add(e);const r=i.filter(e=>e.entityId===t.entityId||!a.has(e.entityId));return F`
      <section class="sensor-settings" aria-label="Physical camera stream group">
        <div class="picker-head">
          <strong>Physical camera (stream group)</strong>
          <span class="hint">
            Combine high-res + fluent (or other) <code>camera.*</code> streams into one physical camera.
            Detection sensors are assigned once and apply to <strong>all streams in the group</strong>
            (shared for all users). Mosaic still selects which stream(s) to show live.
          </span>
        </div>
        <div class="quality-row">
          <label>
            Group name
            <input
              type="text"
              class="aspect-input"
              placeholder="Driveway"
              .value=${this._groupDraftName||""}
              @input=${t=>this._groupDraftName=t.target.value}
            />
          </label>
          <span class="hint">${e?`Saved as ${e.id}`:"Not grouped yet"}</span>
        </div>
        <div class="sensor-candidates">
          <p class="hint">Streams in this physical camera</p>
          ${r.map(e=>{const i=s.has(e.entityId),a=e.entityId===t.entityId;return F`
              <label class="sensor-item ${a?"disabled":""}">
                <input
                  type="checkbox"
                  .checked=${i}
                  ?disabled=${a||this._saving}
                  @change=${s=>this._toggleGroupDraftMember(t.entityId,e.entityId,s.target.checked)}
                />
                <span class="sensor-name">${e.name}</span>
                <span class="picker-id">${e.entityId}</span>
              </label>
            `})}
        </div>
        <div class="sensor-tools">
          <button
            class="btn primary"
            type="button"
            ?disabled=${this._saving}
            @click=${()=>this._saveGroupDraft(t.entityId)}
          >
            ${this._saving?"Saving…":"Save stream group"}
          </button>
          <button
            class="btn"
            type="button"
            ?disabled=${this._saving}
            @click=${()=>this._suggestGroupFromDevice(t.entityId)}
          >
            Suggest from device
          </button>
          ${e?F`
                <button
                  class="btn"
                  type="button"
                  ?disabled=${this._saving}
                  @click=${()=>this._ungroupCamera(t.entityId)}
                >
                  Ungroup
                </button>
              `:z}
        </div>
      </section>
    `}_renderSensorSettings(t){const e=this._linksFor(t.entityId),s=function(t,e){const s=t?.states||{};return(e||[]).map(String).filter(t=>$t.has(t.split(".")[0])).map(t=>{const e=s[t];return{entityId:t,name:e?.attributes?.friendly_name||t,kind:At(t,e),state:String(e?.state??"unknown"),active:Ct(e),missing:!e}})}(this.hass,e),i=this._groupFor(t.entityId),a=It(this.hass,t.entityId,{deviceIds:this._deviceMap,limit:12}).filter(t=>!e.includes(t.entityId)),r=this._sensorFilter.trim().toLowerCase(),n=r?function(t){const e=t?.states||{};return Object.entries(e).filter(([t,e])=>{const s=t.split(".")[0];return!!$t.has(s)&&("other"!==At(t,e).id||/detection|object|zone|occupancy|motion/i.test(t))}).map(([t,e])=>({entityId:t,name:e?.attributes?.friendly_name||t,kind:At(t,e),state:String(e?.state??"unknown"),active:Ct(e)})).sort((t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}))}(this.hass).filter(t=>!e.includes(t.entityId)).filter(t=>t.entityId.toLowerCase().includes(r)||t.name.toLowerCase().includes(r)||t.kind.label.toLowerCase().includes(r)).slice(0,40):a;return F`
      <section class="sensor-settings" aria-label="Detection sensors">
        <div class="picker-head">
          <strong>Detection sensors</strong>
          <span class="hint">
            Link person / car / animal / package sensors for the timeline and recordings.
            Associations are <strong>shared for all Home Assistant users</strong> (site-wide).
            ${i?F` Assigned once for physical camera <strong>${i.name}</strong> (${i.members.length} streams). `:z}
            Suggestions use name + device heuristics; confirm or pick manually.
          </span>
        </div>

        ${s.length?F`
              <div class="sensor-linked">
                ${s.map(e=>F`
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
            `:F`<p class="empty">No sensors linked to this camera yet.</p>`}

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

        ${n.length?F`
              <div class="sensor-candidates">
                <p class="hint">
                  ${r?"Matching sensors":"Suggested associations"}
                </p>
                ${n.map(e=>F`
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
            `:r?F`<p class="empty">No sensors match “${r}”.</p>`:F`
                <p class="hint">
                  No strong suggestions. Search above to link any binary_sensor/sensor
                  (${wt.map(t=>t.label).join(", ")}).
                </p>
              `}
      </section>
    `}}customElements.get("cctv-view")||customElements.define("cctv-view",Ke);class Je extends nt{static properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1}};constructor(){super(),this._stableConfig=null,this._stablePanelConfigRef=null}createRenderRoot(){return this}get _config(){const t=this.panel?.config||{};if(t===this._stablePanelConfigRef&&this._stableConfig)return this._stableConfig;this._stablePanelConfigRef=t;const{_panel_custom:e,...s}=t;return this._stableConfig={title:"CCTV",max_streams:4,quality:"auto",...s},this._stableConfig}connectedCallback(){super.connectedCallback(),this.style.display="block",this.style.height="100%"}disconnectedCallback(){super.disconnectedCallback();const t=this.querySelector?.("cctv-view");if(t)try{t._setPanelActive?.(!1)}catch{}}render(){return F`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        .panelUrlPath=${this.panel?.url_path||"cctv"}
        panel-mode
      ></cctv-view>
    `}}customElements.get("cctv-dashboard-panel")||customElements.define("cctv-dashboard-panel",Je);class Ze extends nt{static properties={hass:{attribute:!1},_config:{attribute:!1}};static styles=ht;static getConfigElement(){return null}static getStubConfig(t){const e=Object.keys(t?.states??{}).filter(t=>t.startsWith("camera.")).slice(0,4);return{title:"CCTV",max_streams:4,quality:"auto",...e.length?{cameras:e}:{}}}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");this._config={title:"CCTV",max_streams:4,quality:"auto",...t}}getCardSize(){const t=this._config?.cameras?.length;return t?Math.max(3,2*Math.ceil(t/2)):6}render(){return this._config?F`
      <ha-card>
        <div class="card-inner">
          <cctv-view .hass=${this.hass} .config=${this._config}></cctv-view>
        </div>
      </ha-card>
    `:F``}}customElements.get("cctv-cameras-card")||customElements.define("cctv-cameras-card",Ze),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-cameras-card"===t.type)||window.customCards.push({type:"cctv-cameras-card",name:"CCTV Cameras",preview:!0,description:"Live stream grid of Home Assistant camera entities with detail view and basic controls.",documentationURL:"https://github.com/davies1995/HA-CCTV"});class Xe extends nt{static properties={hass:{attribute:!1},_config:{attribute:!1},_status:{state:!0},_qualityTick:{state:!0}};static styles=ht;static getStubConfig(t){return{entity:Object.keys(t?.states??{}).find(t=>t.startsWith("camera."))||"camera.demo",title:"",muted:!0,quality:"auto"}}constructor(){super(),this._status="",this._qualityTick=0}setConfig(t){if(!t||"object"!=typeof t||Array.isArray(t))throw new Error("Card configuration must be an object");if(!t.entity||!String(t.entity).startsWith("camera."))throw new Error("cctv-camera-card requires a camera.* entity");this._config={muted:!0,quality:"auto",max_streams:4,...t,entity:String(t.entity)}}getCardSize(){return 4}_setQuality(t){Jt(this._config.entity,t),this._qualityTick+=1}async _run(t){this._status=`Calling ${t}…`;try{await yt(this.hass,t,this._config.entity),this._status=`${t} ok`}catch(t){this._status=t?.message||String(t)}}render(){if(!this._config||!this.hass)return F``;this._qualityTick;const t=this.hass.states?.[this._config.entity],e=mt(this._config.entity,t),s=this._config.title||e.name,i=bt(this.hass,e),a=Zt(this._config,this._config.entity),r=Xt(this.hass,e,this._config,a,"detail");return F`
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
                ${Ft.map(t=>F`<option value=${t.value}>${t.label}</option>`)}
              </select>
            </label>
            <span class="hint">${Yt(a)} · using ${r.entityId}</span>
          </div>
          <div class="actions" style="margin-top: 0.75rem">
            ${i.map(t=>F`
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
              @click=${()=>vt(this,this._config.entity)}
            >
              More info
            </button>
          </div>
        </div>
      </ha-card>
    `}}customElements.get("cctv-camera-card")||customElements.define("cctv-camera-card",Xe),window.customCards=window.customCards||[],window.customCards.some(t=>"cctv-camera-card"===t.type)||window.customCards.push({type:"cctv-camera-card",name:"CCTV Camera",preview:!0,description:"Live stream for a single Home Assistant camera entity.",documentationURL:"https://github.com/davies1995/HA-CCTV"});const Ye="0.20.2";console.info(`%c CCTV-DASHBOARD %c ${Ye} `,"color: #fff; background: #1b6ea8; font-weight: 700;","color: #1b6ea8; background: #fff; font-weight: 700;");export{Ye as VERSION};
