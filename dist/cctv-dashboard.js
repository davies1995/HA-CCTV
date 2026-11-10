const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const s=this.t;if(t&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=i.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(s,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new a(i,e,s)},r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,_=m?m.emptyScript:"",f=p.reactiveElementPolyfillSupport,g=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},b=(e,t)=>!o(e,t),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=v){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);a?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??v}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(t)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),a=e.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=t.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const n=a.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(void 0!==e){const n=this.constructor;if(!1===i&&(a=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??b)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==a||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[g("elementProperties")]=new Map,k[g("finalized")]=new Map,f?.({ReactiveElement:k}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=e=>e,S=w.trustedTypes,x=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,P=`<${M}>`,I=document,E=()=>I.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,O="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,q=/>/g,T=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,U=/"/g,H=/^(?:script|style|textarea|title)$/i,W=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),z=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),V=new WeakMap,B=I.createTreeWalker(I,129);function Q(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(t):t}const K=(e,t)=>{const s=e.length-1,i=[];let a,n=2===t?"<svg>":3===t?"<math>":"",r=L;for(let t=0;t<s;t++){const s=e[t];let o,c,l=-1,d=0;for(;d<s.length&&(r.lastIndex=d,c=r.exec(s),null!==c);)d=r.lastIndex,r===L?"!--"===c[1]?r=D:void 0!==c[1]?r=q:void 0!==c[2]?(H.test(c[2])&&(a=RegExp("</"+c[2],"g")),r=T):void 0!==c[3]&&(r=T):r===T?">"===c[0]?(r=a??L,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,o=c[1],r=void 0===c[3]?T:'"'===c[3]?U:j):r===U||r===j?r=T:r===D||r===q?r=L:(r=T,a=void 0);const h=r===T&&e[t+1].startsWith("/>")?" ":"";n+=r===L?s+P:l>=0?(i.push(o),s.slice(0,l)+A+s.slice(l)+C+h):s+C+(-2===l?t:h)}return[Q(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class G{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,n=0;const r=e.length-1,o=this.parts,[c,l]=K(e,t);if(this.el=G.createElement(c,s),B.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=B.nextNode())&&o.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(A)){const t=l[n++],s=i.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);o.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?ee:"?"===r[1]?te:"@"===r[1]?se:Y}),i.removeAttribute(e)}else e.startsWith(C)&&(o.push({type:6,index:a}),i.removeAttribute(e));if(H.test(i.tagName)){const e=i.textContent.split(C),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],E()),B.nextNode(),o.push({type:2,index:++a});i.append(e[t],E())}}}else if(8===i.nodeType)if(i.data===M)o.push({type:2,index:a});else{let e=-1;for(;-1!==(e=i.data.indexOf(C,e+1));)o.push({type:7,index:a}),e+=C.length-1}a++}}static createElement(e,t){const s=I.createElement("template");return s.innerHTML=e,s}}function J(e,t,s=e,i){if(t===z)return t;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const n=R(t)?void 0:t._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(e),a._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(t=J(e,a._$AS(e,t.values),a,i)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??I).importNode(t,!0);B.currentNode=i;let a=B.nextNode(),n=0,r=0,o=s[0];for(;void 0!==o;){if(n===o.index){let t;2===o.type?t=new X(a,a.nextSibling,this,e):1===o.type?t=new o.ctor(a,o.name,o.strings,this,e):6===o.type&&(t=new ie(a,this,e)),this._$AV.push(t),o=s[++r]}n!==o?.index&&(a=B.nextNode(),n++)}return B.currentNode=I,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),R(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==z&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=G.createElement(Q(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Z(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new G(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new X(this.O(E()),this.O(E()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(e,t=this,s,i){const a=this.strings;let n=!1;if(void 0===a)e=J(this,e,t,0),n=!R(e)||e!==this._$AH&&e!==z,n&&(this._$AH=e);else{const i=e;let r,o;for(e=a[0],r=0;r<a.length-1;r++)o=J(this,i[s+r],t,r),o===z&&(o=this._$AH[r]),n||=!R(o)||o!==this._$AH[r],o===F?e=F:e!==F&&(e+=(o??"")+a[r+1]),this._$AH[r]=o}n&&!i&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class te extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class se extends Y{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??F)===z)return;const s=this._$AH,i=e===F&&s!==F||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==F&&(s===F||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(G,X),(w.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;class re extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let a=i._$litPart$;if(void 0===a){const e=s?.renderBefore??null;i._$litPart$=a=new X(t.insertBefore(E(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}}re._$litElement$=!0,re.finalized=!0,ne.litElementHydrateSupport?.({LitElement:re});const oe=ne.litElementPolyfillSupport;oe?.({LitElement:re}),(ne.litElementVersions??=[]).push("4.2.2");const ce=n`
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

  .settings-panel code {
    font-size: 0.8em;
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
`,le=new Set(["unavailable","unknown","none",""]),de=[{service:"turn_on",label:"Turn on",feature:1},{service:"turn_off",label:"Turn off",feature:1},{service:"toggle",label:"Toggle",feature:1},{service:"snapshot",label:"Snapshot"},{service:"enable_motion_detection",label:"Motion on",attr:"motion_detection",attrValue:!1},{service:"disable_motion_detection",label:"Motion off",attr:"motion_detection",attrValue:!0}];function he(e,t){const s=t?.attributes??{};return{entityId:e,stateObj:t,state:t?.state??"unknown",name:s.friendly_name||e,brand:s.brand,model:s.model,frontendStreamType:s.frontend_stream_type,supportedFeatures:Number(s.supported_features||0),unavailable:!t||le.has(String(t.state).trim().toLowerCase())}}function ue(e){return Boolean(2&e?.supportedFeatures)}async function pe(e,t){if(!e?.callWS)return null;try{return await e.callWS({type:"camera/capabilities",entity_id:t})}catch{return null}}async function me(e,t){if(!e?.callWS)return"";const s=await e.callWS({type:"camera/stream",entity_id:t}),i=s?.url||"";return i?"function"==typeof e.hassUrl?e.hassUrl(i):i:""}async function _e(e,t,s,i={}){if(!e?.callService)throw new Error("hass.callService is unavailable");return e.callService("camera",t,{entity_id:s,...i})}function fe(e,t){const s=e?.services?.camera||{},i=Number(t?.supportedFeatures||0),a=t?.stateObj?.attributes||{};return de.filter(e=>{if(!s[e.service])return!1;if(null!=e.feature&&i&&0===(i&e.feature))return!1;if(e.attr){if(!(e.attr in a))return!1;if(null!=e.attrValue&&Boolean(a[e.attr])!==e.attrValue)return!1}return!0}).map(({service:e,label:t})=>({service:e,label:t}))}function ge(e,t){if(!t)return;const s=new Event("hass-more-info",{bubbles:!0,composed:!0});s.detail={entityId:t},e.dispatchEvent(s)}function ye(e){return e?Array.isArray(e)?e.map(String).map(e=>e.trim()).filter(Boolean):String(e).split(",").map(e=>e.trim()).filter(Boolean):[]}const be=[{id:"person",label:"Person",tokens:["person","people","human","pedestrian","face"]},{id:"car",label:"Car",tokens:["car","vehicle","automobile","auto"]},{id:"animal",label:"Animal",tokens:["animal","pet","dog","cat","wildlife"]},{id:"package",label:"Package",tokens:["package","parcel","delivery","amazon"]},{id:"bicycle",label:"Bicycle",tokens:["bicycle","bike","cyclist"]},{id:"motion",label:"Motion",tokens:["motion","occupancy","presence","moving"]},{id:"other",label:"Other",tokens:["detection","object","zone"]}],ve=new Set(["binary_sensor","sensor"]),ke=new Set(["on","true","detected","active","1","home"]);function we(e,t){return t.some(t=>new RegExp(`(^|[_\\s.-])${t}([_\\s.-]|$)`,"i").test(e))}function $e(e,t){const s=`${e} ${t?.attributes?.friendly_name||""}`.toLowerCase();for(const e of be)if("other"!==e.id&&we(s,e.tokens))return{id:e.id,label:e.label};return{id:"other",label:"Other"}}function Se(e){if(!e)return!1;const t=String(e.state??"").trim().toLowerCase();if(ke.has(t))return!0;const s=Number(t);return Number.isFinite(s)&&s>0}function xe(e,t,s){const i=String(e||"").replace(/^camera\./i,"").replace(/_(main|hi|high|primary)$/i,"").toLowerCase();if(!i)return 0;const a=String(t).toLowerCase(),n=String(s?.attributes?.friendly_name||"").toLowerCase(),r=`${a} ${n}`;let o=0;const c=a.replace(/^(binary_sensor|sensor)\./,"");if(c===i||c.startsWith(`${i}_`)?o+=50:c.includes(i)&&(o+=25),n.includes(i.replace(/_/g," "))&&(o+=15),o<=0)return 0;let l=o;return"other"!==$e(t,s).id?l+=20:we(r,["detection","object","zone","motion","occupancy"])&&(l+=8),a.startsWith("binary_sensor.")&&(l+=5),l}function Ae(e,t,s={}){const i=e?.states||{},a=s.limit??24,n=s.deviceIds,r=n?.get(t),o=[];for(const[e,s]of Object.entries(i)){const i=e.split(".")[0];if(!ve.has(i))continue;let a=xe(t,e,s);if(r&&n?.get(e)===r&&(a+=40),a<20)continue;const c=$e(e,s);o.push({entityId:e,name:s?.attributes?.friendly_name||e,kind:c,score:a,state:String(s?.state??"unknown"),active:Se(s)})}return o.sort((e,t)=>t.score-e.score||e.name.localeCompare(t.name)),o.slice(0,a)}function Ce(e){if(!e||"object"!=typeof e||Array.isArray(e))return{};const t={};for(const[s,i]of Object.entries(e))String(s).startsWith("camera.")&&Array.isArray(i)&&(t[s]=[...new Set(i.map(String).filter(e=>ve.has(e.split(".")[0])))].slice(0,16));return t}function Me(e){return{start:e.start,end:e.end,cameras:[...e.cameras||[]],sensors:[...e.sensors||[]]}}function Pe(e,t){const s=new Set(e.cameras);for(const e of t.cameras||[])s.add(e);e.cameras=[...s];const i=new Map((e.sensors||[]).map(e=>[e.entityId,e]));for(const e of t.sensors||[])e?.entityId&&i.set(e.entityId,e);e.sensors=[...i.values()]}function Ie(e){const t=Math.max(0,Math.round(e/1e3));if(t<60)return`${t}s`;const s=Math.floor(t/60),i=t%60;if(s<60)return i?`${s}m ${i}s`:`${s}m`;const a=Math.floor(s/60),n=s%60;return n?`${a}h ${n}m`:`${a}h`}function Ee(e){try{return new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return""}}const Re=[{value:"auto",label:"Auto",help:"High for detail, prefer low/substream in the mosaic when available."},{value:"high",label:"High",help:"Main camera entity; prefer WebRTC/HLS."},{value:"balanced",label:"Balanced",help:"Main entity; prefer HA native / WebRTC, then HLS/MJPEG."},{value:"low",label:"Low",help:"Substream entity when available, else MJPEG on the main camera."}],Ne=["_sub","_lq","_low","_fluent","_sd","_substream"],Oe="cctv-dashboard:quality:",Le=new Set(Re.map(e=>e.value));function De(e){const t=String(e||"auto").toLowerCase();return Le.has(t)?t:"auto"}function qe(e){if(!e||"object"!=typeof e)return{};const t={};for(const[s,i]of Object.entries(e)){if(!String(s).startsWith("camera."))continue;const e=De(i);"auto"!==e&&(t[s]=e)}return t}function Te(e,t){const s=e?.camera_settings||e?.cameras_settings||{},i=s?.[t]||s?.[t?.toLowerCase?.()]||{},a={};return e?.entity&&e.entity===t&&(e.low_entity&&(a.low_entity=e.low_entity),e.high_entity&&(a.high_entity=e.high_entity),e.substream_entity&&(a.substream_entity=e.substream_entity),e.main_entity&&(a.main_entity=e.main_entity)),{...a,...i}}function je(e,t){try{localStorage.setItem(Oe+e,De(t))}catch{}}function Ue(e,t,s=null){if(s){const e=s[t];if(e)return De(e)}else{const e=function(e){try{const t=localStorage.getItem(Oe+e);return t?De(t):null}catch{return null}}(t);if(e)return e}const i=Te(e,t);return i.quality?De(i.quality):e?.quality?De(e.quality):"auto"}function He(e,t,s,i,a="mosaic"){const n=De(i),r=Te(s,t.entityId),o=e?.states||{},c=r.high_entity||r.main_entity||t.entityId,l=r.low_entity||r.substream_entity||function(e,t,s){const i=e?.states||{},a=t.replace(/^camera\./,"");for(const e of s){const t=`camera.${a}${e}`;if(i[t])return t;const s=`camera.${a.replace(/_main$/,"")}${e}`;if(s!==t&&i[s])return s}return""}(e,t.entityId,Ne)||"";let d=t.entityId;return d="high"===n?c:"low"===n?l||c:"auto"===n&&"mosaic"===a&&l?l:c,o[d]||(d=t.entityId),he(d,o[d])}function We(e){return Re.find(t=>t.value===De(e))?.help||""}const ze=16/9,Fe=[{value:"auto",label:"Auto (detect)",ratio:null},{value:"16:9",label:"16:9 landscape",ratio:16/9},{value:"9:16",label:"9:16 portrait",ratio:9/16},{value:"4:3",label:"4:3 landscape",ratio:4/3},{value:"3:4",label:"3:4 portrait",ratio:3/4},{value:"1:1",label:"1:1 square",ratio:1},{value:"3:2",label:"3:2 landscape",ratio:1.5},{value:"2:3",label:"2:3 portrait",ratio:2/3},{value:"custom",label:"Custom W:H…",ratio:null}],Ve=/^(\d+(?:\.\d+)?)[:x×*](\d+(?:\.\d+)?)$/i;function Be(e){let t=String(e||"").trim().toLowerCase().replace(/\s+/g,"").replace(/×/g,"x").replace(/\*/g,"x");if(!t||"auto"===t||"default"===t||"none"===t||"custom"===t)return"auto";if(Fe.some(e=>e.value===t&&"custom"!==e.value))return t;const s=Ve.exec(t);if(!s)return"auto";const i=Number(s[1]),a=Number(s[2]);return!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0||i/a<.05||i/a>20?"auto":Number.isInteger(i)&&Number.isInteger(a)?`${i}:${a}`:`${Number(i.toPrecision(12))}:${Number(a.toPrecision(12))}`}function Qe(e){const t=Be(e);if("auto"===t)return null;const s=Fe.find(e=>e.value===t);if(s?.ratio)return s.ratio;const[i,a]=t.split(":").map(Number);return!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0?null:i/a}function Ke(e){const t=Be(e);return"auto"===t||Fe.some(e=>e.value===t&&"custom"!==e.value)}function Ge(e){if(!e||"object"!=typeof e)return{};const t={};for(const[s,i]of Object.entries(e)){if(!String(s).startsWith("camera."))continue;const e=Be(i);"auto"!==e&&(t[s]=e)}return t}function Je(e){const t=Number(e);return!Number.isFinite(t)||t<=.05||t>20?ze:t}function Ze(e,t,s,i){if(!e.length||t<=0||s<=0)return null;const a=Math.max(0,e.length-1)*i,n=s-a;if(n<=0)return null;const r=e.map(e=>{const s=e.reduce((e,t)=>e+t.aspect,0),a=Math.max(0,e.length-1)*i,n=t-a;return s<=0||n<=0?0:n/s});if(r.some(e=>e<=0))return null;const o=r.reduce((e,t)=>e+t,0),c=Math.min(1,n/o),l=r.map(e=>e*c),d=[];let h=(s-(l.reduce((e,t)=>e+t,0)+a))/2;e.forEach((e,s)=>{const a=l[s],n=e.map(e=>e.aspect*a),r=n.reduce((e,t)=>e+t,0)+Math.max(0,e.length-1)*i;let o=(t-r)/2;e.forEach((e,t)=>{d.push({id:e.id,left:o,top:h,width:n[t],height:a,aspect:e.aspect}),o+=n[t]+i}),h+=a+i});const u=d.reduce((e,t)=>e+t.width*t.height,0);return{cells:d,totalArea:u}}function Xe(e,t,s,i){const a=e.map(e=>e.map(e=>({id:e.id,aspect:1/e.aspect}))),n=Ze(a,s,t,i);return n?{totalArea:n.totalArea,cells:n.cells.map(e=>({id:e.id,left:e.top,top:e.left,width:e.height,height:e.width,aspect:1/e.aspect}))}:null}async function Ye(e){if(!e?.callWS)return null;try{const t=await e.callWS({type:"cctv_dashboard/get_settings"});return t&&"object"==typeof t?{...t,sensorLinks:Ce(t.sensor_links||{}),forceAspect:Ge(t.force_aspect||{}),cameraQuality:qe(t.camera_quality||{})}:null}catch(e){return console.warn("CCTV: failed to load shared config",e),null}}async function et(e,t){if(!e?.callWS)return null;const s=Ce(t);return e.callWS({type:"cctv_dashboard/set_sensor_links",sensor_links:s})}async function tt(e,t){return e?.callWS?e.callWS({type:"cctv_dashboard/set_settings",...t}):null}async function st(e,t=40){if(!e?.callWS)return[];try{const s=await e.callWS({type:"cctv_dashboard/list_recordings",limit:t});return s?.sessions||[]}catch(e){return console.warn("CCTV: failed to list recordings",e),[]}}function it(e,t){return t?"function"==typeof e?.hassUrl?e.hassUrl(t):t:""}function at(e){if(!e)return"";let t=String(e);try{/^https?:\/\//i.test(t)&&(t=new URL(t).pathname)}catch{}t=t.split("?")[0].split("#")[0],t.startsWith("/")||(t=`/${t}`);const s="/cctv_dashboard_recordings/";if(t.startsWith(s)){const e=t.slice(27).split("/").pop();e&&(t=`/api/cctv_dashboard/media/${e}`)}return t}async function nt(e,t,s=3600){if(!t)return"";const i=at(t);if(!i)return"";if(!e?.callWS)throw new Error("Home Assistant WebSocket unavailable for auth/sign_path");const a=await e.callWS({type:"auth/sign_path",path:i,expires:s}),n=a?.path;if("string"!=typeof n||!n.includes("authSig"))throw new Error(`auth/sign_path returned no authSig for ${i}`);return"function"==typeof e.hassUrl?e.hassUrl(n):n}function rt(e){const t=Number(e)||0;return t<1024?`${t} B`:t<1048576?`${(t/1024).toFixed(t<10240?1:0)} KB`:t<1073741824?`${(t/1048576).toFixed(t<10485760?1:0)} MB`:`${(t/1073741824).toFixed(1)} GB`}function ot(e,t){const s=[],i=new Set;for(const a of t||[]){const t=e?.states?.[a],n=$e(a,t);i.has(n.id)||(i.add(n.id),s.push(n.label))}return s.length?s:["Detection"]}function ct(e){return Number.isFinite(e?.total_bytes)?Number(e.total_bytes):(e?.clips||[]).reduce((e,t)=>e+(Number(t.size)||0),0)}function lt(e){if(null==e||""===e)return NaN;if("number"==typeof e)return Number.isFinite(e)?e:NaN;if(e instanceof Date)return e.getTime();const t=String(e).trim(),s=t.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/i);if(s){const e=`${s[1]}-${s[2]}-${s[3]}T${s[4]}:${s[5]}:${s[6]}Z`;return Date.parse(e)}return Date.parse(t)}function dt(e,t,s=null){const i=new Map;for(const e of t?.clips||[]){const t=String(e.camera_id||"");t&&(i.has(t)||i.set(t,[]),i.get(t).push(e))}const a=s&&s.length?s.map(String):[...i.keys()].sort((t,s)=>{const i=e?.states?.[t]?.attributes?.friendly_name||t.replace(/^camera\./,""),a=e?.states?.[s]?.attributes?.friendly_name||s.replace(/^camera\./,"");return i.localeCompare(a)});return a.map(t=>{const s=[...i.get(t)||[]].sort((e,t)=>Number(e.seq||0)-Number(t.seq||0));return{cameraId:t,name:e?.states?.[t]?.attributes?.friendly_name||t.replace(/^camera\./,""),items:s.filter(e=>"snapshot"===e.kind||(Number(e.size)>0||!("size"in(e||{})))).map(t=>{const s=function(e){const t=lt(e?.started),s=Number(e?.duration),i=Number.isFinite(s)&&s>0?1e3*s:3e4;return{start:t,end:Number.isFinite(t)?t+i:NaN,durationMs:i}}(t),i=String(t.url||"");return{path:i,url:it(e,i),kind:"snapshot"===t.kind?"snapshot":"video",size:Number(t.size)||0,seq:Number(t.seq)||0,started:t.started,startedMs:s.start,durationMs:s.durationMs,endMs:s.end}})}})}function ht(e,t){const s=e?.items||[];if(!s.length||!Number.isFinite(t))return{index:0,seekSec:0};for(let e=0;e<s.length;e+=1){const i=s[e],a=Number(i.startedMs),n=Number(i.endMs);if(Number.isFinite(a)){if(t<a)return{index:e,seekSec:0};if(!Number.isFinite(n)||t<n){return{index:e,seekSec:Math.max(0,(t-a)/1e3)}}}}return{index:Math.max(0,s.length-1),seekSec:0}}const ut="cctv_dashboard";async function pt(e){if(!e?.callWS)return null;try{const t=await e.callWS({type:"frontend/get_user_data",key:ut}),s=t?.value??t;if(!s||"object"!=typeof s)return null;const i=Array.isArray(s.selectedCameras)?s.selectedCameras.map(String).filter(e=>e.startsWith("camera.")):[];return{selectedCameras:i,legacySensorLinks:s.sensorLinks&&"object"==typeof s.sensorLinks?s.sensorLinks:null}}catch(e){return console.warn("CCTV: failed to load panel user data",e),null}}async function mt(e,t,s={}){if(!e?.callWS)return;const i=[...new Set(t.map(String).filter(e=>e.startsWith("camera.")))].slice(0,4),a={selectedCameras:i};s.clearLegacySensorLinks;try{await e.callWS({type:"frontend/set_user_data",key:ut,value:a})}catch(e){throw console.warn("CCTV: failed to save panel selection",e),e}return{selectedCameras:i}}const _t=100,ft=50;const gt=new class{constructor(e=4){this.max=e,this.holders=new Map,this.queue=[]}setMax(e){const t=Math.max(1,Number(e)||4);if(t!==this.max)for(this.max=t,this._drain();this.holders.size>this.max;)this._revokeLowest()}activeCount(){return this.holders.size}has(e){return this.holders.has(e)}request(e,t,{onGrant:s,onRevoke:i}){if(!e)return!1;if(this.holders.has(e)){const s=this.holders.get(e);return s.priority=t,s.onRevoke=i,this.queue=this.queue.filter(t=>t.id!==e),!0}const a=this.queue.find(t=>t.id===e);if(a)return a.priority=t,a.onGrant=s,a.onRevoke=i,this._drain(),this.holders.has(e);if(this.holders.size<this.max)return this.holders.set(e,{priority:t,onRevoke:i}),!0;const n=this._lowestHolder();return n&&t>n.priority?(this._revoke(n.id),this.holders.set(e,{priority:t,onRevoke:i}),!0):(this.queue.push({id:e,priority:t,onGrant:s,onRevoke:i}),this.queue.sort((e,t)=>t.priority-e.priority),!1)}release(e){e&&(this.queue=this.queue.filter(t=>t.id!==e),this.holders.has(e)&&(this.holders.delete(e),this._drain()))}releaseAll(){const e=[...this.holders.keys()];this.queue=[];for(const t of e){const e=this.holders.get(t);this.holders.delete(t);try{e?.onRevoke?.()}catch(e){console.warn("CCTV stream slot revoke failed",e)}}}_lowestHolder(){let e=null;for(const[t,s]of this.holders)(!e||s.priority<e.priority)&&(e={id:t,priority:s.priority});return e}_revoke(e){const t=this.holders.get(e);if(t){this.holders.delete(e);try{t.onRevoke?.()}catch(e){console.warn("CCTV stream slot revoke failed",e)}}}_revokeLowest(){const e=this._lowestHolder();e&&this._revoke(e.id)}_drain(){for(;this.holders.size<this.max&&this.queue.length;){const e=this.queue.shift();this.holders.set(e.id,{priority:e.priority,onRevoke:e.onRevoke});try{e.onGrant?.()}catch(t){console.warn("CCTV stream slot grant failed",t),this.holders.delete(e.id)}}}}(4);class yt extends re{static properties={hass:{attribute:!1},camera:{attribute:!1},config:{attribute:!1},quality:{type:String},context:{type:String},muted:{type:Boolean},controls:{type:Boolean},large:{type:Boolean,reflect:!0},mosaic:{type:Boolean,reflect:!0},eager:{type:Boolean},posterOnly:{type:Boolean,attribute:"poster-only"},active:{type:Boolean},_mode:{state:!0},_error:{state:!0},_hlsUrl:{state:!0},_mjpegUrl:{state:!0},_stillUrl:{state:!0},_visible:{state:!0},_slotHeld:{state:!0},_queued:{state:!0},_tileAspect:{state:!0}};static styles=n`
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
  `;constructor(){super(),this.config={},this.quality="",this.context="mosaic",this.muted=!0,this.controls=!1,this.large=!1,this.mosaic=!1,this.eager=!1,this.posterOnly=!1,this.active=!0,this._mode="loading",this._error="",this._hlsUrl="",this._mjpegUrl="",this._stillUrl="",this._visible=!1,this._slotHeld=!1,this._queued=!1,this._pc=null,this._unsubWebRtc=null,this._sessionId=null,this._startToken=0,this._observer=null,this._hostRo=null,this._slotId="",this._streamCamera=null,this._stableStateObj=null,this._tileAspect=0,this._lastEmittedAspect=0}connectedCallback(){super.connectedCallback(),this._bindObserver(),this._bindHostResize(),this.active?this._reconcilePlayback():this._unloadCompletely()}disconnectedCallback(){super.disconnectedCallback(),this._unbindObserver(),this._unbindHostResize(),this._unloadCompletely()}shouldUpdate(e){for(const t of e.keys()){if(t.startsWith("_"))return!0;if(!["hass","camera","config"].includes(t))return!0}return!(!e.has("hass")||!this._cameraHassChanged(e.get("hass"),this.hass))||(!(!e.has("camera")||!this._cameraMeaningful(e.get("camera"),this.camera))||!(!e.has("config")||!this._configMeaningful(e.get("config"),this.config)))}updated(e){if((e.has("eager")||e.has("posterOnly"))&&this._bindObserver(),(e.has("large")||e.has("mosaic"))&&this._bindHostResize(),e.has("active")&&!this.active)return void this._unloadCompletely();const t=e.has("hass")&&this._cameraHassChanged(e.get("hass"),this.hass),s=e.has("camera")&&this._cameraMeaningful(e.get("camera"),this.camera),i=e.has("config")&&this._configMeaningful(e.get("config"),this.config);if((t||s||i||e.has("quality")||e.has("context")||e.has("eager")||e.has("posterOnly")||e.has("active")&&this.active)&&this._reconcilePlayback(),e.has("muted")){const e=this.renderRoot?.querySelector("video");e&&(e.muted=this.muted)}(e.has("_mode")||s||e.has("_tileAspect"))&&this.updateComplete.then(()=>{this._probeMediaSize(),this._forceNestedContain()})}_cameraHassChanged(e,t){const s=this._streamCamera?.entityId||this.camera?.entityId;if(!s)return!0;const i=e?.states?.[s],a=t?.states?.[s];if(i===a)return!1;if(!i||!a)return!0;const n=e=>!e||["unavailable","unknown"].includes(String(e.state).trim().toLowerCase());return n(i)!==n(a)||i.attributes?.access_token!==a.attributes?.access_token}_cameraMeaningful(e,t){return e!==t&&(!e||!t||(e.entityId!==t.entityId||Boolean(e.unavailable)!==Boolean(t.unavailable)||e.stateObj?.attributes?.access_token!==t.stateObj?.attributes?.access_token))}_configMeaningful(e,t){return e!==t&&(!e||!t||(e.max_streams!==t.max_streams||e.quality!==t.quality||JSON.stringify(e.camera_settings||null)!==JSON.stringify(t.camera_settings||null)||JSON.stringify(e.cameras_settings||null)!==JSON.stringify(t.cameras_settings||null)))}_bindHostResize(){this._unbindHostResize(),this._updateTileAspect(),"undefined"!=typeof ResizeObserver&&(this._hostRo=new ResizeObserver(()=>this._updateTileAspect()),this._hostRo.observe(this))}_unbindHostResize(){this._hostRo&&(this._hostRo.disconnect(),this._hostRo=null)}_updateTileAspect(){const e=this.clientWidth,t=this.clientHeight;if(!Number.isFinite(e)||!Number.isFinite(t)||e<2||t<2)return;const s=e/t;this._tileAspect&&Math.abs(this._tileAspect-s)<.005||(this._tileAspect=s)}_forceNestedContain(){if(!this.mosaic&&!this.large||"ha"!==this._mode)return;const e=this.renderRoot?.querySelector("ha-camera-stream"),t=e?.shadowRoot;t&&t.querySelectorAll("video, img").forEach(e=>{e.style.objectFit="contain",e.style.objectPosition="center",e.style.width="100%",e.style.height="100%",e.style.maxWidth="100%",e.style.maxHeight="100%"})}get _effectiveQuality(){return this.quality?this.quality:Ue(this.config,this.camera?.entityId)}get _priority(){return this.eager?_t:ft}_bindObserver(){this._unbindObserver(),this.eager||this.posterOnly?this._visible=!0:"undefined"!=typeof IntersectionObserver?(this._observer=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t,this._reconcilePlayback())},{root:null,rootMargin:"120px 0px",threshold:.15}),this._observer.observe(this)):this._visible=!0}_unbindObserver(){this._observer&&(this._observer.disconnect(),this._observer=null)}_wantsLive(){return!!this.active&&(("undefined"==typeof document||!document.hidden)&&(!this.posterOnly&&(!!this.eager||this._visible)))}_refreshPosterUrls(e,{cacheBust:t=!1}={}){const s=e||this.camera;if(!this.hass||!s?.stateObj)return this._stillUrl="",void(this._mjpegUrl="");const i=function(e,t,s=!0){if(!e||!t?.stateObj)return"";const i=t.stateObj.attributes||{};let a=i.entity_picture;if(!a&&i.access_token&&(a=`/api/camera_proxy/${t.entityId}?token=${i.access_token}`),!a)return"";const n="function"==typeof e.hassUrl?e.hassUrl(a):a;if(!s)return n;const r=n.includes("?")?"&":"?";return`${n}${r}t=${Date.now()}`}(this.hass,s,t),a=function(e,t){const s=t?.stateObj?.attributes?.access_token;if(!e||!t?.entityId||!s)return"";const i=`/api/camera_proxy_stream/${t.entityId}?token=${s}`;return"function"==typeof e.hassUrl?e.hassUrl(i):i}(this.hass,s);this._stillUrl!==i&&(this._stillUrl=i),this._mjpegUrl!==a&&(this._mjpegUrl=a)}_syncStableStreamCamera(e){const t=e?.stateObj||null,s=this._stableStateObj,i=e=>!e||["unavailable","unknown"].includes(String(e.state).trim().toLowerCase());!s||!t||s.entity_id!==t.entity_id||s.attributes?.access_token!==t.attributes?.access_token||i(s)!==i(t)?(this._stableStateObj=t,this._streamCamera=e):this._streamCamera||(this._streamCamera=e)}_clearMediaElements(){const e=this.renderRoot;e&&(e.querySelectorAll("video").forEach(e=>{try{e.pause?.();const t=e.srcObject;t&&"function"==typeof t.getTracks&&t.getTracks().forEach(e=>{try{e.stop()}catch{}}),e.srcObject=null,e.removeAttribute("src"),e.load?.()}catch{}}),e.querySelectorAll("img.media").forEach(e=>{try{e.removeAttribute("src"),e.src=""}catch{}}))}_stopLive(){if(this._startToken+=1,this._unsubWebRtc){try{this._unsubWebRtc()}catch{}this._unsubWebRtc=null}if(this._pc){try{this._pc.getSenders?.().forEach(e=>{try{e.track?.stop?.()}catch{}}),this._pc.getReceivers?.().forEach(e=>{try{e.track?.stop?.()}catch{}}),this._pc.close()}catch{}this._pc=null}this._sessionId=null,this._hlsUrl="",this._clearMediaElements()}_releaseSlot(){this._slotId&&gt.release(this._slotId),this._slotHeld=!1,this._queued=!1}_unloadCompletely(){this._releaseSlot(),this._stopLive(),this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",this._playKey="",this._idleReason="suspended",this._queued=!1,this._stableStateObj=null,this._streamCamera=null}_showIdle(e="idle"){if(this._stopLive(),!this.active||"undefined"!=typeof document&&document.hidden)return this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",void(this._idleReason=e);this._refreshPosterUrls(this._streamCamera||this.camera,{cacheBust:!0}),this.hass&&this.camera?.stateObj?(this._mode=this._stillUrl?"still":"empty",this._error=this._stillUrl?"":"No preview",this._idleReason=e):this._mode="empty"}_reconcilePlayback(){if(!this.active||"undefined"!=typeof document&&document.hidden)return void this._unloadCompletely();const e=Number(this.config?.max_streams);if(Number.isFinite(e)&&e>0&&gt.setMax(e),!this.hass||!this.camera?.stateObj)return this._releaseSlot(),this._stopLive(),this._mode="empty",this._playKey="",void(this._stableStateObj=null);const t=He(this.hass,this.camera,this.config,this._effectiveQuality,this.context);this._syncStableStreamCamera(t),this._slotId=this._streamCamera?.entityId||this.camera.entityId;const s=this._wantsLive(),i=[s?"live":"idle",this._slotId,this._effectiveQuality,this.context,this.eager?"eager":"lazy"].join("|");if(!s)return this._releaseSlot(),this._showIdle("idle"),void(this._playKey=i);if(this._slotHeld&&this._playKey===i&&"loading"!==this._mode&&"empty"!==this._mode&&("still"!==this._mode||!this._queued))return;this._refreshPosterUrls(this._streamCamera,{cacheBust:!1});const a=()=>{this._slotHeld=!0,this._queued=!1,this._playKey=i,this._startLive()},n=()=>{if(this._slotHeld=!1,this._queued=this._wantsLive(),this._playKey="",this._showIdle("queued"),this._wantsLive()){gt.request(this._slotId,this._priority,{onGrant:a,onRevoke:n})&&a()}};gt.request(this._slotId,this._priority,{onGrant:a,onRevoke:n})?a():(this._slotHeld=!1,this._queued=!0,this._playKey=i,this._showIdle("queued"))}async _startLive(){this._stopLive();const e=this._startToken;this._error="",this._mode="loading",this._idleReason="";const t=this._streamCamera||this.camera;this._refreshPosterUrls(t,{cacheBust:!1});const s=function(e,t="mosaic"){const s=De(e);return"low"===s?["mjpeg","ha","webrtc","hls"]:"high"===s?["webrtc","ha","hls","mjpeg"]:"balanced"===s?["ha","webrtc","hls","mjpeg"]:"mosaic"===t?["mjpeg","ha","webrtc","hls"]:["webrtc","ha","hls","mjpeg"]}(this._effectiveQuality,this.context);for(const i of s){if(e!==this._startToken||!this._slotHeld)return;if("ha"===i&&customElements.get("ha-camera-stream"))return void(this._mode="ha");if("webrtc"===i&&"undefined"!=typeof RTCPeerConnection){const s=await pe(this.hass,t.entityId);if(e!==this._startToken||!this._slotHeld)return;const i=s?.frontend_stream_types||[],a=t.frontendStreamType;if(i.includes("web_rtc")||"web_rtc"===a||ue(t)||!i.length)try{if(await this._startWebRtc(e,t),e!==this._startToken||!this._slotHeld)return;return void(this._mode="webrtc")}catch(e){console.warn("CCTV WebRTC failed, falling back",e)}}if("hls"===i)try{const s=await me(this.hass,t.entityId);if(e!==this._startToken||!this._slotHeld)return;if(s&&this._canPlayHlsNatively())return this._hlsUrl=s,void(this._mode="hls")}catch(e){console.warn("CCTV HLS failed, falling back",e)}if("mjpeg"===i&&this._mjpegUrl)return void(this._mode="mjpeg")}this._mode=this._stillUrl?"still":"empty",this._stillUrl||(this._error="No stream or preview available")}_canPlayHlsNatively(){const e=document.createElement("video");return""!==e.canPlayType("application/vnd.apple.mpegurl")||""!==e.canPlayType("application/x-mpegURL")}async _startWebRtc(e,t){const s=await async function(e,t){if(!e?.callWS)return null;try{return await e.callWS({type:"camera/webrtc/get_client_config",entity_id:t})}catch{return null}}(this.hass,t.entityId)||{};if(e!==this._startToken)return;const i=new RTCPeerConnection(s.configuration||{});this._pc=i,i.addTransceiver("video",{direction:"recvonly"});try{i.addTransceiver("audio",{direction:"recvonly"})}catch{}i.ontrack=e=>{const t=this.renderRoot?.querySelector("video#webrtc");if(!t)return;const[s]=e.streams;t.srcObject=s||new MediaStream([e.track]),t.muted=this.muted,t.play?.().catch(()=>{})},i.onicecandidate=e=>{e.candidate&&this._sessionId&&async function(e,t,s,i){e?.callWS&&await e.callWS({type:"camera/webrtc/candidate",entity_id:t,session_id:s,candidate:i})}(this.hass,t.entityId,this._sessionId,e.candidate.toJSON()).catch(()=>{})};const a=await i.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});await i.setLocalDescription(a),this._unsubWebRtc=await function(e,t,s,i){if(!e?.connection?.subscribeMessage)throw new Error("WebSocket connection unavailable");return e.connection.subscribeMessage(i,{type:"camera/webrtc/offer",entity_id:t,offer:s})}(this.hass,t.entityId,a.sdp,async t=>{if(e===this._startToken&&this._pc)if("session"!==t.type)if("answer"!==t.type)if("candidate"===t.type&&t.candidate)try{await this._pc.addIceCandidate(t.candidate)}catch{}else"error"===t.type&&(this._error=t.message||t.code||"WebRTC error",this._mode=this._mjpegUrl?"mjpeg":this._stillUrl?"still":"empty");else await this._pc.setRemoteDescription({type:"answer",sdp:t.answer});else this._sessionId=t.session_id})}_emitMediaAspect(e,t){const s=this.camera?.entityId,i=Number(e),a=Number(t);if(!s||!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0)return;const n=i/a;this._lastEmittedAspect&&Math.abs(this._lastEmittedAspect-n)<.01||(this._lastEmittedAspect=n,this.dispatchEvent(new CustomEvent("cctv-media-aspect",{detail:{entityId:s,width:i,height:a,aspect:n},bubbles:!0,composed:!0})))}_probeMediaSize(){const e=this.renderRoot;if(!e)return;const t=e.querySelector("video");if(t)return void(t.videoWidth&&t.videoHeight&&this._emitMediaAspect(t.videoWidth,t.videoHeight));const s=e.querySelector("img.media");if(s&&s.naturalWidth&&s.naturalHeight)return void this._emitMediaAspect(s.naturalWidth,s.naturalHeight);const i=e.querySelector("ha-camera-stream"),a=i?.shadowRoot?.querySelector?.("video");if(a?.videoWidth&&a?.videoHeight)return void this._emitMediaAspect(a.videoWidth,a.videoHeight);const n=i?.shadowRoot?.querySelector?.("img");n?.naturalWidth&&n?.naturalHeight&&this._emitMediaAspect(n.naturalWidth,n.naturalHeight)}render(){if("loading"===this._mode)return W`<div class="placeholder">Connecting…</div>`;if("empty"===this._mode)return W`<div class="error">${this._error||"No preview"}</div>`;let e=this._mode;return this._queued?e="queued":this._slotHeld||"still"!==this._mode||(e=this._idleReason||"idle"),W`
      ${this._renderMedia()}
      <span class="badge">${e}</span>
    `}_renderMedia(){const e=this._streamCamera||this.camera;if("ha"===this._mode){const t=this.mosaic||this.large?"contain":"cover",s=this._tileAspect>0?this._tileAspect:this.clientWidth>1&&this.clientHeight>1?this.clientWidth/this.clientHeight:void 0,i=this._stableStateObj||e?.stateObj;return W`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${i}
          .muted=${this.muted}
          .controls=${this.controls}
          .fitMode=${t}
          .aspectRatio=${s}
          @loadeddata=${()=>{this._probeMediaSize(),this._forceNestedContain()}}
        ></ha-camera-stream>
      `}return"webrtc"===this._mode?W`
        <video
          id="webrtc"
          class="media"
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${e=>this._emitMediaAspect(e.target.videoWidth,e.target.videoHeight)}
        ></video>
      `:"hls"===this._mode?W`
        <video
          class="media"
          src=${this._hlsUrl}
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${e=>this._emitMediaAspect(e.target.videoWidth,e.target.videoHeight)}
        ></video>
      `:"mjpeg"===this._mode?W`
        <img
          class="media"
          alt=""
          src=${this._mjpegUrl}
          @load=${e=>this._emitMediaAspect(e.target.naturalWidth,e.target.naturalHeight)}
        />
      `:"still"===this._mode?W`
        <img
          class="media"
          alt=""
          src=${this._stillUrl}
          @load=${e=>this._emitMediaAspect(e.target.naturalWidth,e.target.naturalHeight)}
        />
      `:F}}customElements.get("cctv-stream-player")||customElements.define("cctv-stream-player",yt);const bt=[{value:9e5,label:"15m"},{value:36e5,label:"1h"},{value:216e5,label:"6h"},{value:864e5,label:"24h"}];class vt extends re{static properties={hass:{attribute:!1},cameras:{attribute:!1},sensorLinks:{attribute:!1},cameraNames:{attribute:!1},active:{type:Boolean},_windowMs:{state:!0},_loading:{state:!0},_error:{state:!0},_rows:{state:!0},_now:{state:!0},_selected:{state:!0}};createRenderRoot(){return this}constructor(){super(),this.cameras=[],this.sensorLinks={},this.cameraNames={},this.active=!0,this._windowMs=36e5,this._loading=!1,this._error="",this._rows=[],this._now=Date.now(),this._selected=null,this._timer=null,this._fetchToken=0,this._quietRefreshTimer=0,this._lastEntityKey="",this._onVisibility=null}connectedCallback(){super.connectedCallback(),this._onVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._pausePolling():this.active&&this._scheduleQuietRefresh()},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onVisibility),this.active&&this._startPolling()}disconnectedCallback(){super.disconnectedCallback(),this._stopPolling(),this._onVisibility&&"undefined"!=typeof document&&document.removeEventListener("visibilitychange",this._onVisibility)}updated(e){if(e.has("active")&&(this.active?this._startPolling():this._stopPolling()),this.active)return e.has("cameras")||e.has("sensorLinks")||e.has("_windowMs")?(this._selected=null,void this._refresh({showLoading:!0})):void(e.has("hass")&&this._scheduleQuietRefresh())}_startPolling(){this._pausePolling(),this.active&&("undefined"!=typeof document&&document.hidden||(this._timer=window.setInterval(()=>this._scheduleQuietRefresh(),9e4),this._refresh({showLoading:!this._rows.length})))}_pausePolling(){this._timer&&(window.clearInterval(this._timer),this._timer=null),this._quietRefreshTimer&&(window.clearTimeout(this._quietRefreshTimer),this._quietRefreshTimer=0)}_stopPolling(){this._pausePolling(),this._fetchToken+=1,this._loading=!1}_scheduleQuietRefresh(){this.active&&("undefined"!=typeof document&&document.hidden||this._quietRefreshTimer||(this._quietRefreshTimer=window.setTimeout(()=>{this._quietRefreshTimer=0,this._refresh({showLoading:!1})},2500)))}async _refresh(e={}){if(!this.active)return;if("undefined"!=typeof document&&document.hidden)return;const t=Boolean(e.showLoading),s=[...this.cameras||[]],i=`${s.join(",")}|${this._windowMs}`;if(!this.hass)return this._rows=[],this._error="",this._selected=null,void(this._lastEntityKey=i);const a=++this._fetchToken;(t||i!==this._lastEntityKey)&&(this._loading=!0),this._error="";const n=Date.now(),r=n-this._windowMs;try{const e=await async function(e,t={}){if(!e?.callWS)return[];try{const s=await e.callWS({type:"cctv_dashboard/list_detections",start:t.start,end:t.end,cameras:t.cameras,limit:t.limit??500});return s?.events||[]}catch(e){return console.warn("CCTV: failed to list detections",e),[]}}(this.hass,{start:r,end:n,cameras:s.length?s:void 0,limit:500});if(a!==this._fetchToken||!this.active)return;this._lastEntityKey=i,this._rows=this._buildRowsFromEvents(e,r,n),this._now=n,this._syncSelected()}catch(e){if(a!==this._fetchToken||!this.active)return;this._error=e?.message||"Could not load saved detections",this._rows=this._buildRowsFromEvents([],r,n),this._syncSelected()}finally{a===this._fetchToken&&(this._loading=!1)}}_syncSelected(){if(!this._selected)return;const e=this._rows.flatMap(e=>e.events).find(e=>e.id===this._selected.id);this._selected=e||null}_linkedEntityIds(){const e=[];for(const t of this.cameras||[])for(const s of this.sensorLinks?.[t]||[])e.push(s);return[...new Set(e)]}_sensorName(e){return this.hass?.states?.[e]?.attributes?.friendly_name||String(e||"").replace(/^[^.]+\./,"")||e}_buildRowsFromEvents(e,t,s){const i=new Map,a=new Set(this.cameras||[]);for(const n of e||[]){const e=n.kind||"other",r=be.find(t=>t.id===e)||be[be.length-1],o={id:r.id,label:n.kind_label||r.label},c=Date.parse(n.start),l=n.end?Date.parse(n.end):s;if(!Number.isFinite(c))continue;const d=Math.max(t,c),h=Math.min(s,Number.isFinite(l)?l:s);if(h<=d)continue;let u=(n.cameras||[]).map(String);if(a.size&&(u=u.filter(e=>a.has(e)),!u.length&&(n.cameras||[]).length))continue;let p=i.get(o.id);p||(p={kind:o,raw:[],active:!1},i.set(o.id,p)),p.raw.push({start:d,end:h,cameras:u,sensors:n.sensor_id?[{entityId:n.sensor_id,name:this._sensorName(n.sensor_id)}]:[],sourceId:n.id,active:Boolean(n.active||null==n.end)}),(n.active||null==n.end)&&(p.active=!0)}for(const e of this.cameras||[])for(const t of this.sensorLinks?.[e]||[]){const e=this.hass?.states?.[t],s=`${t} ${e?.attributes?.friendly_name||""}`.toLowerCase(),a=be.find(e=>"other"!==e.id&&e.tokens.some(e=>new RegExp(`(^|[_\\s.-])${e}([_\\s.-]|$)`,"i").test(s)))||be[be.length-1];i.has(a.id)||i.set(a.id,{kind:{id:a.id,label:a.label},raw:[],active:!1})}const n=new Map(be.map((e,t)=>[e.id,t]));return[...i.values()].map(e=>{const t=function(e,t=0){if(!Array.isArray(e)||!e.length)return[];const s=e.map(e=>({start:Number(e.start),end:Number(e.end),cameras:Array.isArray(e.cameras)?[...e.cameras]:[],sensors:Array.isArray(e.sensors)?[...e.sensors]:[]})).filter(e=>Number.isFinite(e.start)&&Number.isFinite(e.end)&&e.end>e.start).sort((e,t)=>e.start-t.start||e.end-t.end);if(!s.length)return[];const i=[Me(s[0])];for(let e=1;e<s.length;e+=1){const a=s[e],n=i[i.length-1];a.start<=n.end+t?(n.end=Math.max(n.end,a.end),Pe(n,a)):i.push(Me(a))}return i}(e.raw,1e3),i=t.map((t,i)=>{const a=t.cameras||[];return{id:t.sourceId||`${e.kind.id}:${t.start}:${t.end}:${i}`,kind:e.kind,start:t.start,end:t.end,durationMs:Math.max(0,t.end-t.start),cameras:a,cameraNames:a.map(e=>this.cameraNames?.[e]||e),sensors:t.sensors||[],active:Boolean(e.active&&t.end>=s-5e3)}});return{kind:e.kind,events:i,totalMs:i.reduce((e,t)=>e+t.durationMs,0),active:e.active}}).filter(e=>e.events.length||e.active||this._linkedEntityIds().length).sort((e,t)=>(n.get(e.kind.id)??99)-(n.get(t.kind.id)??99)||e.kind.label.localeCompare(t.kind.label))}_setWindow(e){this._windowMs=e}_selectEvent(e,t){t?.stopPropagation?.(),this._selected=this._selected?.id===e.id?null:e}_clearSelected(){this._selected=null}_requestPlay(e,t){t?.stopPropagation?.(),this.dispatchEvent(new CustomEvent("cctv-play-detection",{detail:{start:e.start,end:e.end,kind:e.kind,sensors:e.sensors||[],cameras:e.cameras||[]},bubbles:!0,composed:!0}))}_tickMarks(){const e=this._now-this._windowMs,t=this._windowMs<=9e5?4:this._windowMs<=36e5?6:8,s=[];for(let i=0;i<=t;i+=1){const a=e+this._windowMs*i/t;s.push({t:a,label:Ee(a),pct:i/t*100})}return s}render(){const e=this._linkedEntityIds().length;if(!(this.cameras||[]).length)return F;const t=this._now-this._windowMs,s=Math.max(1,this._windowMs),i=this._tickMarks();return W`
      <section class="timeline" aria-label="Detection timeline">
        <div class="timeline-head">
          <div>
            <strong>Detection timeline</strong>
            <span class="hint">
              ${e?"Shared for all users — survives reboot; kept for retention days":"Link detection sensors in a camera’s settings to see events here"}
            </span>
          </div>
          <div class="timeline-windows">
            ${bt.map(e=>W`
                <button
                  type="button"
                  class="btn ${this._windowMs===e.value?"primary":""}"
                  @click=${()=>this._setWindow(e.value)}
                >
                  ${e.label}
                </button>
              `)}
          </div>
        </div>

        ${this._error?W`<p class="timeline-error">${this._error}</p>`:F}
        ${e?0===this._rows.length?W`<p class="empty">No linked sensors for the current selection.</p>`:W`
                <div class="timeline-board" @click=${this._clearSelected}>
                  <div class="timeline-ruler" aria-hidden="true">
                    ${i.map(e=>W`
                        <span class="timeline-tick" style="left:${e.pct}%">
                          <span class="timeline-tick-line"></span>
                          <span class="timeline-tick-label">${e.label}</span>
                        </span>
                      `)}
                  </div>
                  <div class="timeline-lanes">
                    ${this._rows.map(e=>this._renderLane(e,t,s))}
                  </div>
                </div>
                ${this._selected?this._renderDetail(this._selected):W`<p class="hint timeline-hint">Select a highlighted event on the timeline.</p>`}
                ${this._loading?W`<p class="hint timeline-loading">Refreshing…</p>`:F}
              `:W`<p class="empty">No detection sensors linked yet.</p>`}
      </section>
    `}_renderLane(e,t,s){const i=be.find(t=>t.id===e.kind.id)||be[be.length-1];return W`
      <div class="timeline-lane">
        <div class="timeline-lane-label">
          <span class="timeline-kind kind-${i.id}">${i.label}</span>
          <span class="timeline-total">
            ${e.events.length?`${e.events.length} event${1===e.events.length?"":"s"} · ${Ie(e.totalMs)}`:e.active?"active now":"quiet"}
          </span>
        </div>
        <div
          class="timeline-track"
          role="listbox"
          aria-label="${i.label} events"
        >
          ${e.events.map(e=>{const a=(e.start-t)/s*100,n=Math.max(.6,(e.end-e.start)/s*100),r=this._selected?.id===e.id;return W`
              <button
                type="button"
                class="timeline-event kind-${i.id} ${r?"selected":""} ${e.active?"live":""}"
                style="left:${a}%;width:${n}%"
                title="${i.label}: ${Ee(e.start)}–${Ee(e.end)}"
                aria-pressed=${r?"true":"false"}
                @click=${t=>this._selectEvent(e,t)}
              >
                <span class="timeline-event-mark"></span>
              </button>
            `})}
        </div>
      </div>
    `}_renderDetail(e){const t=be.find(t=>t.id===e.kind.id)||be[be.length-1],s=e.cameraNames?.length?e.cameraNames.join(", "):"—",i=e.sensors?.length?e.sensors:[];return W`
      <aside class="timeline-detail" aria-live="polite">
        <div class="timeline-detail-head">
          <span class="timeline-kind kind-${t.id}">${t.label}</span>
          ${e.active?W`<span class="timeline-live-badge">Live</span>`:F}
          <div class="timeline-detail-actions">
            ${e.active?F:W`
                  <button
                    class="btn primary"
                    type="button"
                    @click=${t=>this._requestPlay(e,t)}
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
            ${Ee(e.start)} – ${Ee(e.end)}
            <span class="hint">(${new Date(e.start).toLocaleString()} → ${new Date(e.end).toLocaleString()})</span>
          </dd>
          <dt>Duration</dt>
          <dd>${Ie(e.durationMs)}${e.active?" (ongoing)":""}</dd>
          <dt>Cameras</dt>
          <dd>${s}</dd>
          <dt>Sensors</dt>
          <dd>
            ${i.length?W`
                  <ul class="timeline-detail-sensors">
                    ${i.map(e=>W`
                        <li>
                          <strong>${e.name||e.entityId}</strong>
                          <span class="hint">${e.entityId}</span>
                        </li>
                      `)}
                  </ul>
                `:"—"}
          </dd>
        </dl>
      </aside>
    `}}customElements.get("cctv-detection-timeline")||customElements.define("cctv-detection-timeline",vt);class kt extends re{static properties={hass:{attribute:!1},config:{attribute:!1},panelMode:{type:Boolean,attribute:"panel-mode"},panelUrlPath:{type:String,attribute:"panel-url-path"},_detailId:{state:!0},_status:{state:!0},_qualityTick:{state:!0},_visibleIds:{state:!0},_sensorLinks:{state:!0},_forceAspect:{state:!0},_savedForceAspect:{state:!0},_cameraQuality:{state:!0},_savedCameraQuality:{state:!0},_customAspectDraft:{state:!0},_prefsDirty:{state:!0},_pickerOpen:{state:!0},_settingsOpen:{state:!0},_selectionReady:{state:!0},_saving:{state:!0},_sensorFilter:{state:!0},_deviceMapReady:{state:!0},_retentionDays:{state:!0},_recordOnDetection:{state:!0},_sessions:{state:!0},_recordDir:{state:!0},_isDesktop:{state:!0},_aspectById:{state:!0},_packStyles:{state:!0},_playback:{state:!0},_panelActive:{state:!0}};static styles=ce;constructor(){super(),this.config={},this.panelMode=!1,this.panelUrlPath="cctv",this._detailId=null,this._status="",this._qualityTick=0,this._visibleIds=[],this._sensorLinks={},this._forceAspect={},this._savedForceAspect={},this._cameraQuality={},this._savedCameraQuality={},this._customAspectDraft="",this._prefsDirty=!1,this._pickerOpen=!0,this._settingsOpen=!1,this._selectionReady=!1,this._saving=!1,this._sensorFilter="",this._deviceMapReady=!1,this._retentionDays=1,this._recordOnDetection=!0,this._sessions=[],this._recordDir="",this._loadedForUser=null,this._isDesktop=!1,this._aspectById={},this._packStyles={},this._playback=null,this._panelActive=!0,this._deviceMap=new Map,this._packObserver=null,this._packObservedEl=null,this._mq=null,this._onMq=null,this._packRaf=0,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._cameraNamesCache={},this._cameraNamesKey="",this._lastHassSig="",this._onDocVisibility=null,this._onLocationChange=null,this._loadToken=0}shouldUpdate(e){if(this.panelMode&&!this._panelActive&&!e.has("_panelActive")&&e.has("hass")&&1===e.size)return!1;if(!e.has("hass"))return!0;if(e.size>1)return!0;const t=e.get("hass"),s=this.hass;return!t||!s||this._hassRelevantChanged(t,s)}_hassRelevantChanged(e,t){const s=this._watchedEntityIds();for(const i of s){const s=e.states?.[i],a=t.states?.[i];if(s!==a){if(!s||!a)return!0;if(s.state!==a.state)return!0;if(s.attributes?.access_token!==a.attributes?.access_token)return!0;if(s.attributes?.friendly_name!==a.attributes?.friendly_name)return!0}}return(e.user?.id||"")!==(t.user?.id||"")}_watchedEntityIds(){const e=new Set(this._visibleIds||[]);if(this._pickerOpen||this._settingsOpen)for(const t of this._cameras())e.add(t.entityId);return e}connectedCallback(){super.connectedCallback(),"undefined"!=typeof window&&window.matchMedia&&(this._mq=window.matchMedia("(min-width: 801px)"),this._onMq=()=>{this._panelActive&&(this._isDesktop=this._mq.matches,this._schedulePack())},this._isDesktop=this._mq.matches,this._mq.addEventListener?this._mq.addEventListener("change",this._onMq):this._mq.addListener(this._onMq)),this._bindPanelVisibility(),!this._isCctvLocation()||"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._setPanelActive(!0)}disconnectedCallback(){super.disconnectedCallback(),this._panelActive&&(this._panelActive=!1,this._suspendResources()),this._unbindPanelVisibility(),this._mq&&this._onMq&&(this._mq.removeEventListener?this._mq.removeEventListener("change",this._onMq):this._mq.removeListener(this._onMq)),this._tearDownObservers()}_bindPanelVisibility(){this.panelMode&&(this._unbindPanelVisibility(),this._onDocVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this.isConnected&&this._isCctvLocation()&&this._setPanelActive(!0)},this._onLocationChange=()=>{this.isConnected&&("undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._isCctvLocation()?this._panelActive||this._setPanelActive(!0):this._setPanelActive(!1))},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onDocVisibility),"undefined"!=typeof window&&(window.addEventListener("location-changed",this._onLocationChange),window.addEventListener("popstate",this._onLocationChange)))}_unbindPanelVisibility(){this._onDocVisibility&&"undefined"!=typeof document&&(document.removeEventListener("visibilitychange",this._onDocVisibility),this._onDocVisibility=null),this._onLocationChange&&"undefined"!=typeof window&&(window.removeEventListener("location-changed",this._onLocationChange),window.removeEventListener("popstate",this._onLocationChange),this._onLocationChange=null)}_isCctvLocation(){if("undefined"==typeof location)return!0;const e=location.pathname||"",t=(String(this.panelUrlPath||"cctv").trim().replace(/^\/+|\/+$/g,"")||"cctv").replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(?:^|/)${t}(?:/|$)`).test(e)}_setPanelActive(e){const t=Boolean(e);this._panelActive!==t&&(this._panelActive=t,t?(this._status="Suspended — streams unloaded"===this._status?"":this._status,this._schedulePack()):this._suspendResources())}_suspendResources(){this._loadToken+=1,this._teardownPlaybackMedia(),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._tearDownObservers(),this._unloadStreamPlayers(),this.panelMode&&(this._status="Suspended — streams unloaded")}_tearDownObservers(){this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null),this._packRaf&&(cancelAnimationFrame(this._packRaf),this._packRaf=0)}_unloadStreamPlayers(){const e=this.renderRoot||this;e.querySelectorAll?.("cctv-stream-player").forEach(e=>{try{e.active=!1,e._unloadCompletely?.()}catch{}})}updated(e){(this._panelActive||!this.panelMode||e.has("_panelActive")&&this._panelActive)&&(this.panelMode&&this._panelActive&&(e.has("hass")||e.has("panelMode")||e.has("_panelActive"))&&this._ensureSelectionLoaded(),this.panelMode&&this._panelActive&&(e.has("_visibleIds")||e.has("_isDesktop")||e.has("_detailId")||e.has("_pickerOpen")||e.has("_settingsOpen")||e.has("_aspectById")||e.has("_forceAspect")||e.has("_playback")||e.has("_panelActive"))&&(this._schedulePack(),this.updateComplete.then(()=>this._bindPackObserver())))}_bindPackObserver(){const e=this.renderRoot?.querySelector?.(".layout-pack");e?this._packObserver&&this._packObservedEl===e?this._recomputePack():(this._packObserver&&this._packObserver.disconnect(),this._packObservedEl=e,"undefined"!=typeof ResizeObserver?(this._packObserver=new ResizeObserver(()=>this._schedulePack()),this._packObserver.observe(e),this._recomputePack()):this._recomputePack()):this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null)}_schedulePack(){this._panelActive&&(this._packRaf&&cancelAnimationFrame(this._packRaf),this._packRaf=requestAnimationFrame(()=>{this._packRaf=0,this._recomputePack()}))}_recomputePack(){if(!this._isDesktop||!this.panelMode||this._detailId)return void(Object.keys(this._packStyles).length&&(this._packStyles={}));const e=this.renderRoot?.querySelector?.(".layout-pack");if(!e)return;const t=e.getBoundingClientRect(),s=Math.max(0,t.width),i=Math.max(0,t.height);if(s<8||i<8)return;const a=function(e,t,s,i=10){const a=(e||[]).map(e=>({id:String(e.id),aspect:Je(e.aspect)}));if(!a.length||t<=1||s<=1)return[];let n=null,r=-1;for(const e of function(e){const t=e.length;if(!t)return[];const s=[];return function i(a,n){if(a!==t)for(let s=a+1;s<=t;s+=1)n.push(e.slice(a,s)),i(s,n),n.pop();else s.push(n.map(e=>e.slice()))}(0,[]),s}(a))for(const a of[Ze(e,t,s,i),Xe(e,t,s,i)])a&&a.totalArea>r&&(r=a.totalArea,n=a.cells);return n||[]}(this._visibleCameras(this._cameras()).slice(0,4).map(e=>({id:e.entityId,aspect:this._effectiveAspect(e.entityId)})),s,i,10),n=function(e,t,s){if(!t||!s)return{};const i={};for(const a of e)i[a.id]=[`left:${a.left/t*100}%`,`top:${a.top/s*100}%`,`width:${a.width/t*100}%`,`height:${a.height/s*100}%`].join(";");return i}(a,s,i);this._packStylesEqual(this._packStyles,n)||(this._packStyles=n)}_effectiveAspect(e){const t=Qe(this._forceAspect?.[e]);return Je(t||(this._aspectById[e]||ze))}_forceAspectLabel(e){return Be(this._forceAspect?.[e])}_packStylesEqual(e,t){const s=Object.keys(e||{}),i=Object.keys(t||{});if(s.length!==i.length)return!1;for(const i of s)if(e[i]!==t[i])return!1;return!0}_onMediaAspect(e){const t=e?.detail?.entityId,s=Je(e?.detail?.aspect);t&&(Qe(this._forceAspect?.[t])||Math.abs((this._aspectById[t]||0)-s)<.01||(this._aspectById={...this._aspectById,[t]:s}))}_onPlaybackMediaSize(e,t,s){const i=Number(t),a=Number(s);!e||!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0||this._onMediaAspect({detail:{entityId:e,aspect:i/a}})}async _ensureSelectionLoaded(){if(!this._panelActive)return;const e=this.hass?.user?.id||"default";if(!this.hass||this._loadedForUser===e)return;this._loadedForUser=e,this._selectionReady=!1;const t=++this._loadToken,[s,i]=await Promise.all([pt(this.hass),Ye(this.hass)]);if(t!==this._loadToken||!this._panelActive)return;const a=this._cameras().map(e=>e.entityId);s?.selectedCameras?.length?(this._visibleIds=s.selectedCameras.filter(e=>a.includes(e)).slice(0,this._maxStreams()),this._pickerOpen=0===this._visibleIds.length):(this._visibleIds=[],this._pickerOpen=!0);let n=i?.sensorLinks||{};const r=s?.legacySensorLinks;if(r&&"object"==typeof r&&Object.keys(r).length&&!Object.keys(n).length)try{const e=await et(this.hass,r);if(t!==this._loadToken||!this._panelActive)return;n=e?.sensor_links?Object.fromEntries(Object.entries(e.sensor_links).map(([e,t])=>[e,t])):r,await mt(this.hass,this._visibleIds),this._status="Detection sensor links moved to shared settings"}catch(e){console.warn("CCTV: legacy sensor-link migration failed",e),n=r}this._sensorLinks=n,i?(this._retentionDays=Number(i.retention_days)||1,this._recordOnDetection=!1!==i.record_on_detection,this._recordDir=i.record_dir||"",this._applySharedCameraPrefs(i)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._selectionReady=!0,this._loadDeviceMap(),this._sessions?.length||(this._sessions=await st(this.hass),t===this._loadToken&&this._panelActive)}async _loadDeviceMap(){this.hass&&!this._deviceMapReady&&(this._deviceMap=await async function(e){const t=new Map;if(!e?.callWS)return t;try{const s=await e.callWS({type:"config/entity_registry/list"});if(!Array.isArray(s))return t;for(const e of s)e?.entity_id&&e?.device_id&&t.set(String(e.entity_id),String(e.device_id))}catch(e){console.warn("CCTV: entity registry unavailable for sensor linking",e)}return t}(this.hass),this._deviceMapReady=!0)}async _loadRecordingUi(){if(!this.hass)return;const e=await Ye(this.hass);e?(this._retentionDays=Number(e.retention_days)||1,this._recordOnDetection=!1!==e.record_on_detection,this._recordDir=e.record_dir||"",e.sensorLinks&&(this._sensorLinks=e.sensorLinks),this._prefsDirty||this._applySharedCameraPrefs(e)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._sessions=await st(this.hass)}_applySharedCameraPrefs(e){const t=Ge(e?.forceAspect||e?.force_aspect||{}),s=qe(e?.cameraQuality||e?.camera_quality||{});this._forceAspect={...t},this._savedForceAspect={...t},this._cameraQuality={...s},this._savedCameraQuality={...s},this._prefsDirty=!1,this._customAspectDraft="",this._qualityTick+=1}_prefsMapsEqual(e,t){const s=e||{},i=t||{},a=new Set([...Object.keys(s),...Object.keys(i)]);for(const e of a)if((s[e]||"")!==(i[e]||""))return!1;return!0}_syncPrefsDirty(){this._prefsDirty=!this._prefsMapsEqual(this._forceAspect,this._savedForceAspect)||!this._prefsMapsEqual(this._cameraQuality,this._savedCameraQuality)}_qualityFor(e){return Ue(this.config,e,this.panelMode?this._cameraQuality:null)}_cameras(){return function(e,t={}){const s=e?.states??{},i=ye(t.cameras),a=new Set(ye(t.exclude).map(e=>e.toLowerCase()));let n=Object.keys(s).filter(e=>e.startsWith("camera."));if(i.length){const e=new Set(i.map(e=>e.toLowerCase()));n=n.filter(t=>e.has(t.toLowerCase()))}return n=n.filter(e=>!a.has(e.toLowerCase())),n.map(e=>he(e,s[e])).sort((e,t)=>e.name.localeCompare(t.name,void 0,{sensitivity:"base"}))}(this.hass,this.config)}_maxStreams(){const e=Number(this.config?.max_streams);return Number.isFinite(e)&&e>0?e:4}_visibleCameras(e){return this._visibleIds.map(t=>e.find(e=>e.entityId===t)).filter(Boolean)}_linksFor(e){return this._sensorLinks?.[e]||[]}async _toggleVisible(e,t){const s=this._maxStreams();let i=[...this._visibleIds];if(t){if(i.includes(e))return;if(i.length>=s)return void(this._status=`Select at most ${s} cameras`);i.push(e)}else i=i.filter(t=>t!==e);this._visibleIds=i,this._detailId&&!i.includes(this._detailId)&&(this._detailId=null),await this._persistSelection(i)}async _persistSelection(e){this._saving=!0;try{const t=await mt(this.hass,e);t?.selectedCameras&&(this._visibleIds=t.selectedCameras);const s=t?.selectedCameras||e;this._status=s.length?`${s.length} camera${1===s.length?"":"s"} on screen`:"No cameras selected"}catch(e){this._status=e?.message||"Could not save camera selection"}finally{this._saving=!1}}async _persistSensorLinks(e){this._saving=!0,this._sensorLinks=e;try{const t=await et(this.hass,e);t?.sensor_links&&(this._sensorLinks=t.sensor_links),this._status="Detection sensors saved for all users"}catch(e){this._status=e?.message||"Could not save detection sensors"}finally{this._saving=!1}}_setForceAspect(e,t){if("custom"===t){const t=this._forceAspect?.[e]||"";this._customAspectDraft=t&&!Ke(t)?t:"1920:2560";const s=Be(this._customAspectDraft),i={...this._forceAspect};return"auto"===s?delete i[e]:i[e]=s,this._forceAspect=i,this._syncPrefsDirty(),void this._schedulePack()}const s=Be(t),i={...this._forceAspect};"auto"===s?delete i[e]:i[e]=s,this._forceAspect=i,(Ke(s)||"auto"===s)&&(this._customAspectDraft=""),this._syncPrefsDirty(),this._schedulePack()}_setCustomForceAspect(e,t){this._customAspectDraft=t;const s=Be(t),i={...this._forceAspect};"auto"===s?delete i[e]:i[e]=s,this._forceAspect=i,this._syncPrefsDirty(),this._schedulePack()}async _saveCameraPrefs(){this._saving=!0;try{const e=await async function(e,t){if(!e?.callWS)return null;const s={type:"cctv_dashboard/set_camera_prefs"};return void 0!==t.cameraQuality&&(s.camera_quality=qe(t.cameraQuality)),void 0!==t.forceAspect&&(s.force_aspect=Ge(t.forceAspect)),e.callWS(s)}(this.hass,{cameraQuality:this._cameraQuality,forceAspect:this._forceAspect});e?this._applySharedCameraPrefs({force_aspect:e.force_aspect,camera_quality:e.camera_quality}):(this._savedForceAspect={...this._forceAspect},this._savedCameraQuality={...this._cameraQuality},this._prefsDirty=!1),this._status="Quality & aspect saved for all users",this._schedulePack()}catch(e){this._status=e?.message||"Could not save camera preferences"}finally{this._saving=!1}}async _setSensorLinked(e,t,s){const i=new Set(this._linksFor(e));s?i.add(t):i.delete(t);const a={...this._sensorLinks,[e]:[...i]};a[e].length||delete a[e],await this._persistSensorLinks(a)}async _applySuggestions(e){const t=Ae(this.hass,e,{deviceIds:this._deviceMap,limit:8});if(!t.length)return void(this._status="No related detection sensors found");const s={...this._sensorLinks,[e]:[...new Set([...this._linksFor(e),...t.map(e=>e.entityId)])].slice(0,16)};await this._persistSensorLinks(s),this._status=`Linked ${t.length} suggested sensor${1===t.length?"":"s"} (all users)`}_openDetail(e){this._detailId=e,this._sensorFilter="";const t=this._forceAspect?.[e];this._customAspectDraft=t&&!Ke(t)?t:""}_back(){this._detailId=null,this._sensorFilter="",this._customAspectDraft=""}_setQuality(e,t){if(!this.panelMode)return je(e,t),void(this._qualityTick+=1);const s=String(t||"auto").toLowerCase(),i={...this._cameraQuality};s&&"auto"!==s?i[e]=s:delete i[e],this._cameraQuality=qe(i),this._syncPrefsDirty(),this._qualityTick+=1}async _run(e,t){this._status=`Calling ${e}…`;try{await _e(this.hass,e,t),this._status=`${e} ok`}catch(e){this._status=e?.message||String(e)}}async _saveRetentionDays(e){const t=Math.max(1,Math.min(30,Number(e)||1));this._retentionDays=t,this._saving=!0;try{await tt(this.hass,{retention_days:t}),this._status=`Retention set to ${t} day${1===t?"":"s"}`}catch(e){this._status=e?.message||"Could not save retention"}finally{this._saving=!1}}async _toggleRecordOnDetection(e){this._recordOnDetection=e,this._saving=!0;try{await tt(this.hass,{record_on_detection:e}),this._status=e?"Detection recording enabled":"Detection recording paused"}catch(e){this._status=e?.message||"Could not save recording setting"}finally{this._saving=!1}}async _refreshSessions(){this._sessions=await st(this.hass),this._status="Recordings refreshed"}_isAdmin(){return Boolean(this.hass?.user?.is_admin)}async _deleteSession(e,t){if(t?.stopPropagation?.(),t?.preventDefault?.(),this._isAdmin()){if("undefined"==typeof window||window.confirm("Delete this saved detection’s recordings for all users?"))try{const t=await async function(e,t){if(!e?.callWS)return!1;const s=await e.callWS({type:"cctv_dashboard/delete_recording",session_id:t});return Boolean(s?.deleted)}(this.hass,e);this._sessions=await st(this.hass),this._playback?.session?.session_id===e&&this._stopPlayback(),this._status=t?"Saved detection deleted for all users":"Recording was already removed"}catch(e){this._status=e?.message||"Could not delete recording"}}else this._status="Only Home Assistant admins can delete saved detections"}async _selectPlaybackSession(e,t=null){if(!e||e.active||!(e.clips||[]).length)return this._status="No playable recording for that detection",!1;const s=this._visibleIds.slice(0,this._maxStreams());if(!s.length)return this._status="Select cameras in the mosaic before playing a detection",!1;const i=ot(this.hass,e.trigger_sensors||[]),a=dt(this.hass,e,s),n=a.some(e=>(e.items||[]).some(e=>"video"===e.kind||"snapshot"===e.kind));if(!n)return this._status="No clips for the currently selected mosaic cameras",!1;const r=function(e,t=null){const s=Number(t?.start),i=Number(t?.end),a=lt(e?.started),n=lt(e?.ended||e?.started),r=Number.isFinite(s)?s:a;let o=Number.isFinite(i)?i:n;return!Number.isFinite(o)&&Number.isFinite(r)&&(o=r+6e4),Number.isFinite(r)&&Number.isFinite(o)&&o<r&&(o=r),{start:r,end:o}}(e,t);this._detailId=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map;for(const e of a){const t=ht(e,r.start);this._playbackIndex.set(e.cameraId,t.index),this._playbackSeek.set(e.cameraId,t.seekSec),this._playbackDone.set(e.cameraId,!e.items.length)}return this._playback={session:e,labels:i,playing:!1,tracks:a,windowStart:r.start,windowEnd:r.end,eventDetail:t},this._status=`Selected ${i.join(", ")} — Play replaces live mosaic for ${s.length} cam${1===s.length?"":"s"}`,this._schedulePack(),!0}async _playSavedDetection(e,t=null){t?.stopPropagation?.(),t?.preventDefault?.();await this._selectPlaybackSession(e)&&this._playback&&this._playback.session?.session_id===e.session_id&&!this._playback.playing&&await this._startPlayback()}_onPlayDetection(e){const t=e?.detail,s=function(e,t){if(!e?.length||!t)return null;const s=Number(t.start),i=Number(t.end);if(!Number.isFinite(s)||!Number.isFinite(i))return null;const a=new Set((t.sensors||[]).map(e=>e.entityId).filter(Boolean));let n=null,r=-1;for(const t of e){if(t.active)continue;if(!(t.clips||[]).length)continue;const e=Date.parse(t.started),o=Date.parse(t.ended||t.started);if(!Number.isFinite(e)||!Number.isFinite(o))continue;const c=Math.min(i,o)-Math.max(s,e);if(c<=0)continue;let l=c;const d=t.trigger_sensors||[];a.size&&d.some(e=>a.has(e))&&(l+=6e4),l>r&&(r=l,n=t)}return n}(this._sessions||[],t);s?this._selectPlaybackSession(s,t):this._status="No saved recording overlaps that timeline event"}async _startPlayback(){if(!this._playback?.tracks?.length)return;this._status="Signing recording URLs…";try{await async function(e,t){const s=[];for(const i of t||[]){const t=[];for(const a of i.items||[])0!==Number(a.size)||"video"!==a.kind?(t.push(a),s.push((async()=>{const t=a.path||a.url;a.path=at(t),a.url=await nt(e,a.path)})())):console.warn("CCTV: skipping empty video clip",a.path||a.url);i.items=t}return await Promise.all(s),t}(this.hass,this._playback.tracks)}catch(e){return console.warn("CCTV: could not sign playback URLs",e),void(this._status=e?.message||"Could not sign recording URLs (auth/sign_path failed)")}const e=this._playback.tracks.some(e=>(e.items||[]).some(e=>"video"===e.kind||"snapshot"===e.kind));e?(this._playback={...this._playback,playing:!0},this._status=`Playing ${this._playback.labels.join(", ")} (synced)`,await this.updateComplete,await new Promise(e=>requestAnimationFrame(()=>e())),await this._kickPlaybackVideos()):this._status="No playable clips (files missing or empty)"}_stopPlayback(){this._teardownPlaybackMedia(),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._status="Live mosaic",this._schedulePack()}_pausePlaybackToLive(){this._playback&&(this._teardownPlaybackMedia(),this._playback={...this._playback,playing:!1},this._status="Stopped — back to live mosaic",this._schedulePack())}_teardownPlaybackMedia(){const e=this.renderRoot;e&&e.querySelectorAll("video.playback-media").forEach(e=>{try{e.pause?.(),e.removeAttribute("src"),e.load?.()}catch{}})}async _kickPlaybackVideos(){const e=this.renderRoot;if(!e||!this._playback?.playing)return;const t=[...e.querySelectorAll("video.playback-media")];if(!t.length)return void(this._status="Playback ready but no video elements found");const s=await Promise.all(t.map(e=>this._startOnePlaybackVideo(e))),i=s.filter(e=>!e.ok);i.length&&i.length===s.length?this._status=`Playback failed to start (${i[0].reason||"media error"})`:i.length&&(this._status=`Playing ${s.length-i.length}/${s.length} cameras`)}_startOnePlaybackVideo(e){const t=e.getAttribute("data-camera")||"",s=this._playbackSeek.get(t)||0;e.muted=!0,e.defaultMuted=!0,e.playsInline=!0,e.setAttribute("muted",""),e.setAttribute("playsinline",""),e.setAttribute("webkit-playsinline",""),e.preload="auto";const i=async()=>{try{if(s>0)try{e.currentTime=s}catch{}return await e.play(),{ok:!0,cameraId:t}}catch(s){const i=s?.name||s?.message||"play() rejected";console.warn("CCTV playback play() failed",t,s);try{return e.muted=!0,await e.play(),{ok:!0,cameraId:t}}catch(e){return console.warn("CCTV playback retry failed",t,e),{ok:!1,cameraId:t,reason:i}}}};return new Promise(s=>{if(e.readyState>=2)i().then(s);else{e.addEventListener("loadeddata",()=>{i().then(s)},{once:!0}),e.addEventListener("error",()=>{const i=e.error?.code,a=4===i?"unsupported/unauthorized media (check signed URL)":2===i?"network error loading clip":`media error ${i||""}`.trim();console.warn("CCTV playback media error",t,e.error,e.currentSrc),s({ok:!1,cameraId:t,reason:a})},{once:!0});try{e.load()}catch{i().then(s)}}})}_playbackVideoEl(e){const t=String(e).replace(/\\/g,"\\\\").replace(/"/g,'\\"');return this.renderRoot?.querySelector?.(`video.playback-media[data-camera="${t}"]`)}_onPlaybackEnded(e){if(!this._playback?.playing)return;const t=this._playback.tracks.find(t=>t.cameraId===e);if(!t)return;const s=(this._playbackIndex.get(e)||0)+1,i=Number(this._playback.windowEnd);if(s<t.items.length){const a=t.items[s];return Number.isFinite(i)&&Number.isFinite(a.startedMs)&&a.startedMs>=i?void this._markPlaybackCameraDone(e):(this._playbackIndex.set(e,s),this._playbackSeek.set(e,0),"snapshot"===a.kind?void this.requestUpdate():void this._advancePlaybackVideo(e,a))}this._markPlaybackCameraDone(e)}async _advancePlaybackVideo(e,t){const s=this._playbackVideoEl(e);if(s)try{t.url=await nt(this.hass,t.path||t.url),s.muted=!0,s.playsInline=!0,s.src=t.url,s.load?.(),await this._startOnePlaybackVideo(s)}catch(t){console.warn("CCTV chunk advance failed",e,t),this._markPlaybackCameraDone(e)}else this._markPlaybackCameraDone(e)}_markPlaybackCameraDone(e){this._playbackDone.set(e,!0);const t=(this._playback?.tracks||[]).every(e=>!e.items.length||(!!e.items.every(e=>"snapshot"===e.kind)||this._playbackDone.get(e.cameraId)));t&&this._pausePlaybackToLive()}_trackForCamera(e){return this._playback?.tracks?.find(t=>t.cameraId===e)||null}_currentPlaybackItem(e){if(!e?.items?.length)return null;const t=Math.min(this._playbackIndex.get(e.cameraId)||0,Math.max(0,e.items.length-1));return e.items[t]||null}_stableCameraNames(e){const t=e.map(e=>`${e.entityId}:${e.name}`).join("|");return t===this._cameraNamesKey||(this._cameraNamesKey=t,this._cameraNamesCache=Object.fromEntries(e.map(e=>[e.entityId,e.name]))),this._cameraNamesCache}render(){if(!this.hass)return W`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;this._qualityTick,this._deviceMapReady;const e=this._cameras(),t=this._maxStreams();gt.setMax(t);const s=this.config?.title||"CCTV";if(this.panelMode&&!this._selectionReady)return W`
        <div class="panel-wrap wrap">
          <p class="placeholder">Loading camera selection…</p>
        </div>
      `;if(this.panelMode&&!this._panelActive)return W`
        <div class="panel-wrap wrap">
          <p class="placeholder">CCTV paused — streams unloaded while you are away.</p>
        </div>
      `;const i=e.find(e=>e.entityId===this._detailId)||null,a=this.panelMode?this._visibleCameras(e):e,n=this._stableCameraNames(e),r=Boolean(this._playback?.playing),o=this._panelActive;return W`
      <div class=${this.panelMode?"panel-wrap wrap":"wrap"}>
        <div class="top">
          <div>
            ${this.panelMode?W`<p class="eyebrow">Home Assistant</p>`:F}
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
                `:F}
            <span class="status">
              ${this._status||(this.panelMode?`${a.length}/${t} selected · ${r?"playback":`${gt.activeCount()} live`}`:`${e.length} camera${1===e.length?"":"s"} · ${gt.activeCount()}/${t} live`)}
              ${this._saving?" · saving…":""}
            </span>
          </div>
        </div>

        ${this.panelMode&&this._pickerOpen?this._renderPicker(e,t):F}

        ${this.panelMode&&this._settingsOpen?this._renderSettings():F}

        ${this.panelMode&&this._playback?this._renderPlaybackBar():F}

        ${i?this._renderDetail(i,o):this.panelMode?this._renderLayout(a,o):this._renderCardGrid(e)}

        ${this.panelMode&&!i?W`
              <cctv-detection-timeline
                .hass=${this.hass}
                .cameras=${a.map(e=>e.entityId)}
                .sensorLinks=${this._sensorLinks}
                .cameraNames=${n}
                .active=${o}
                @cctv-play-detection=${this._onPlayDetection}
              ></cctv-detection-timeline>
              ${this._renderRecordings()}
            `:F}
      </div>
    `}_renderPlaybackBar(){const e=this._playback;if(!e)return F;const t=e.session?.started?new Date(e.session.started).toLocaleString():"—";return W`
      <div class="playback-bar" role="region" aria-label="Detection playback">
        <div class="playback-bar-meta">
          <strong>${e.labels.join(", ")}</strong>
          <span class="hint">${t} · ${rt(ct(e.session))}</span>
        </div>
        <div class="playback-bar-actions">
          ${e.playing?W`
                <button class="btn primary" type="button" @click=${this._pausePlaybackToLive}>
                  Stop
                </button>
              `:W`
                <button class="btn primary" type="button" @click=${this._startPlayback}>
                  Play
                </button>
              `}
          <button class="btn" type="button" @click=${this._stopPlayback}>
            Back to live
          </button>
        </div>
      </div>
    `}_renderSettings(){return W`
      <section class="settings-panel" aria-label="CCTV settings">
        <div class="picker-head">
          <strong>Detection recordings</strong>
          <span class="hint">
            When any site-wide linked detection sensor triggers, HA logs the event for
            the shared timeline and (if enabled) saves clips for <em>all</em> available
            cameras until sensors clear. Timeline + saved detections survive reboot and
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
              @change=${e=>this._saveRetentionDays(e.target.value)}
            />
          </label>
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._recordOnDetection}
              @change=${e=>this._toggleRecordOnDetection(e.target.checked)}
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
    `}_renderRecordings(){const e=this._sessions||[],t=this._isAdmin();return W`
      <section class="recordings" aria-label="Saved detections">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Time, what was detected, and file size. Play starts mosaic
              playback for the visible cameras; click the row to load it first
              (desktop bar still works). Shared for all users; survives reboot;
              kept for ${this._retentionDays} day${1===this._retentionDays?"":"s"}.
              ${t?" Admins can delete a detection’s file set for everyone.":""}
            </span>
          </div>
          <button class="btn" type="button" @click=${()=>this._refreshSessions()}>
            Refresh
          </button>
        </div>
        ${e.length?W`
              <div class="recording-list">
                ${e.map(e=>this._renderSession(e,t))}
              </div>
            `:W`<p class="empty">No detection recordings yet.</p>`}
      </section>
    `}_renderSession(e,t=!1){const s=e.started?new Date(e.started).toLocaleString():"—",i=ot(this.hass,e.trigger_sensors||[]),a=rt(ct(e)),n=this._playback?.session?.session_id===e.session_id,r=!e.active&&(e.clips||[]).length;return W`
      <div
        class="recording-item ${e.active?"active":""} ${n?"selected":""}"
      >
        <button
          type="button"
          class="recording-select"
          ?disabled=${!r}
          @click=${()=>this._selectPlaybackSession(e)}
        >
          <div class="recording-meta">
            <span class="recording-when">${s}${e.active?" · recording…":""}</span>
            <span class="recording-detected">${i.join(", ")}</span>
          </div>
          <span class="recording-size">${a}</span>
        </button>
        <div class="recording-actions">
          <button
            type="button"
            class="btn primary recording-play"
            title="Play this detection on the mosaic"
            ?disabled=${!r}
            @click=${t=>this._playSavedDetection(e,t)}
          >
            Play
          </button>
          ${t&&!e.active?W`
                <button
                  type="button"
                  class="btn recording-delete"
                  title="Delete recordings for all users"
                  @click=${t=>this._deleteSession(e.session_id,t)}
                >
                  Delete
                </button>
              `:F}
        </div>
      </div>
    `}_renderPicker(e,t){return e.length?W`
      <section class="picker" aria-label="Camera selection">
        <div class="picker-head">
          <strong>Visible streams</strong>
          <span class="hint">Select 1–${t}. Layout updates automatically. Saved to your HA profile (per user).</span>
        </div>
        <div class="picker-list">
          ${e.map(e=>{const s=this._visibleIds.includes(e.entityId),i=!s&&this._visibleIds.length>=t,a=this._linksFor(e.entityId).length;return W`
              <label class="picker-item ${i?"disabled":""}">
                <input
                  type="checkbox"
                  .checked=${s}
                  ?disabled=${i}
                  @change=${t=>this._toggleVisible(e.entityId,t.target.checked)}
                />
                <span class="picker-name">${e.name}</span>
                <span class="picker-id">
                  ${e.entityId}${a?` · ${a} sensor${1===a?"":"s"}`:""}
                </span>
              </label>
            `})}
        </div>
      </section>
    `:W`<p class="empty">No camera entities found.</p>`}_renderLayout(e,t=!0){if(!e.length)return W`
        <p class="empty">
          Select cameras above to start streaming.
          One camera fills the view; two to four split the screen equally (max ${this._maxStreams()}).
        </p>
      `;const s=e.slice(0,4);if(!this._isDesktop){const e=s.length;return W`
        <div class="layout layout-${e}" role="list">
          ${s.map(e=>this._renderLayoutTile(e,!1,t))}
        </div>
      `}return W`
      <div
        class="layout layout-pack"
        role="list"
        @cctv-media-aspect=${this._onMediaAspect}
      >
        ${s.map(e=>this._renderLayoutTile(e,!0,t))}
      </div>
    `}_renderLayoutTile(e,t,s=!0){const i=this._qualityFor(e.entityId),a=this._linksFor(e.entityId).length,n=t?this._packStyles?.[e.entityId]:"",r=Boolean(t&&n),o=Boolean(this._playback?.playing),c=o?this._trackForCamera(e.entityId):null,l=c?this._currentPlaybackItem(c):null,d=Qe(this._forceAspectLabel(e.entityId));return W`
      <article
        class="tile layout-tile ${r?"pack-tile":""}"
        role="listitem"
        style=${r?n:F}
      >
        <div class="tile-media" style=${!r&&d?`aspect-ratio:${d}; width:100%;`:F}>
          ${o?l?"snapshot"===l.kind?W`<img
                    class="playback-media"
                    alt=""
                    src=${l.url}
                    @load=${t=>this._onPlaybackMediaSize(e.entityId,t.target.naturalWidth,t.target.naturalHeight)}
                  />`:W`
                    <video
                      class="playback-media"
                      data-camera=${e.entityId}
                      src=${l.url}
                      autoplay
                      muted
                      playsinline
                      webkit-playsinline
                      preload="auto"
                      .muted=${!0}
                      .playsInline=${!0}
                      controls
                      @loadedmetadata=${t=>this._onPlaybackMediaSize(e.entityId,t.target.videoWidth,t.target.videoHeight)}
                      @ended=${()=>this._onPlaybackEnded(e.entityId)}
                    ></video>
                  `:W`<div class="playback-empty">No recording for this camera</div>`:W`
                <cctv-stream-player
                  large
                  mosaic
                  eager
                  .active=${s}
                  .hass=${this.hass}
                  .camera=${e}
                  .config=${this.config}
                  .quality=${i}
                  context="mosaic"
                  muted
                ></cctv-stream-player>
              `}
        </div>
        ${o?W`
              <div class="tile-body ${t?"pack-caption":""}">
                <p class="tile-title">${e.name}</p>
                <p class="tile-meta">Playback</p>
              </div>
            `:W`
              <button
                type="button"
                class="tile-body tile-open ${t?"pack-caption":""}"
                @click=${()=>this._openDetail(e.entityId)}
              >
                <p class="tile-title">${e.name}</p>
                <p class="tile-meta">
                  <span class="dot ${e.state}"></span>${e.state} · ${i}
                  ${a?W` · ${a} detection`:F}
                </p>
              </button>
            `}
      </article>
    `}_renderCardGrid(e){return e.length?W`
      <div class="grid" role="list">
        ${e.map(e=>{const t=this._qualityFor(e.entityId);return W`
            <article class="tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  .hass=${this.hass}
                  .camera=${e}
                  .config=${this.config}
                  .quality=${t}
                  context="mosaic"
                  muted
                ></cctv-stream-player>
              </div>
              <button
                type="button"
                class="tile-body tile-open"
                @click=${()=>this._openDetail(e.entityId)}
              >
                <p class="tile-title">${e.name}</p>
                <p class="tile-meta">
                  <span class="dot ${e.state}"></span>${e.state} · ${t}
                </p>
              </button>
            </article>
          `})}
      </div>
    `:W`<p class="empty">No camera entities found.</p>`}_renderDetail(e,t=!0){const s=fe(this.hass,e),i=this._qualityFor(e.entityId),a=He(this.hass,e,this.config,i,"detail"),n=function(e){const t=Be(e);return"auto"===t?"auto":Ke(t)?t:"custom"}(this._forceAspect?.[e.entityId]),r=this.panelMode&&("custom"===n||Boolean(this._customAspectDraft)),o=this._customAspectDraft||("custom"===n?this._forceAspectLabel(e.entityId):"");return W`
      <button class="btn linkish" type="button" @click=${this._back}>
        ← ${this.panelMode?"Back to layout":"All cameras"}
      </button>
      <h2>${e.name}</h2>
      <div class="detail-stage">
        <cctv-stream-player
          large
          eager
          .active=${t}
          .hass=${this.hass}
          .camera=${e}
          .config=${this.config}
          .quality=${i}
          context="detail"
          .muted=${!1}
          controls
        ></cctv-stream-player>
      </div>
      <div class="quality-row">
        <label>
          Stream quality
          <select
            .value=${i}
            @change=${t=>this._setQuality(e.entityId,t.target.value)}
          >
            ${Re.map(e=>W`<option value=${e.value}>${e.label}</option>`)}
          </select>
        </label>
        <span class="hint">${We(i)}</span>
      </div>
      ${this.panelMode?W`
            <div class="quality-row">
              <label>
                Force aspect ratio
                <select
                  .value=${n}
                  @change=${t=>this._setForceAspect(e.entityId,t.target.value)}
                >
                  ${Fe.map(e=>W`<option value=${e.value}>${e.label}</option>`)}
                </select>
              </label>
              <span class="hint">Shared for all users.</span>
            </div>
            ${r?W`
                  <div class="quality-row">
                    <label>
                      Custom W:H
                      <input
                        type="text"
                        class="aspect-input"
                        placeholder="1920:2560"
                        .value=${o}
                        @input=${t=>this._setCustomForceAspect(e.entityId,t.target.value)}
                      />
                    </label>
                    <span class="hint">Examples: 1920:2560, 3:4, 1080x1920</span>
                  </div>
                `:F}
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
          `:F}
      <dl class="meta">
        <dt>Entity</dt>
        <dd>${e.entityId}</dd>
        <dt>Streaming</dt>
        <dd>${a.entityId}</dd>
        <dt>State</dt>
        <dd>${e.state}</dd>
        <dt>Brand</dt>
        <dd>${e.brand||"—"}</dd>
        <dt>Model</dt>
        <dd>${e.model||"—"}</dd>
      </dl>
      <div class="actions">
        ${s.length?s.map(t=>W`
                <button
                  class="btn primary"
                  type="button"
                  @click=${()=>this._run(t.service,e.entityId)}
                >
                  ${t.label}
                </button>
              `):W`<span class="placeholder">No camera services available</span>`}
        <button
          class="btn"
          type="button"
          @click=${()=>ge(this,e.entityId)}
        >
          More info
        </button>
      </div>
      ${this.panelMode?this._renderSensorSettings(e):F}
    `}_renderSensorSettings(e){const t=this._linksFor(e.entityId),s=function(e,t){const s=e?.states||{};return(t||[]).map(String).filter(e=>ve.has(e.split(".")[0])).map(e=>{const t=s[e];return{entityId:e,name:t?.attributes?.friendly_name||e,kind:$e(e,t),state:String(t?.state??"unknown"),active:Se(t),missing:!t}})}(this.hass,t),i=Ae(this.hass,e.entityId,{deviceIds:this._deviceMap,limit:12}).filter(e=>!t.includes(e.entityId)),a=this._sensorFilter.trim().toLowerCase(),n=a?function(e){const t=e?.states||{};return Object.entries(t).filter(([e,t])=>{const s=e.split(".")[0];return!!ve.has(s)&&("other"!==$e(e,t).id||/detection|object|zone|occupancy|motion/i.test(e))}).map(([e,t])=>({entityId:e,name:t?.attributes?.friendly_name||e,kind:$e(e,t),state:String(t?.state??"unknown"),active:Se(t)})).sort((e,t)=>e.name.localeCompare(t.name,void 0,{sensitivity:"base"}))}(this.hass).filter(e=>!t.includes(e.entityId)).filter(e=>e.entityId.toLowerCase().includes(a)||e.name.toLowerCase().includes(a)||e.kind.label.toLowerCase().includes(a)).slice(0,40):i;return W`
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
                ${s.map(t=>W`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${!0}
                        @change=${s=>this._setSensorLinked(e.entityId,t.entityId,s.target.checked)}
                      />
                      <span class="sensor-kind kind-${t.kind.id}">${t.kind.label}</span>
                      <span class="sensor-name">${t.name}</span>
                      <span class="sensor-state ${t.active?"on":""}">
                        ${t.missing?"missing":t.state}
                      </span>
                      <span class="picker-id">${t.entityId}</span>
                    </label>
                  `)}
              </div>
            `:W`<p class="empty">No sensors linked to this camera yet.</p>`}

        <div class="sensor-tools">
          <button
            class="btn primary"
            type="button"
            @click=${()=>this._applySuggestions(e.entityId)}
          >
            Link suggested sensors
          </button>
          <label class="sensor-filter">
            Search sensors
            <input
              type="search"
              .value=${this._sensorFilter}
              placeholder="person, package, driveway…"
              @input=${e=>this._sensorFilter=e.target.value}
            />
          </label>
        </div>

        ${n.length?W`
              <div class="sensor-candidates">
                <p class="hint">
                  ${a?"Matching sensors":"Suggested associations"}
                </p>
                ${n.map(t=>W`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${!1}
                        @change=${s=>this._setSensorLinked(e.entityId,t.entityId,s.target.checked)}
                      />
                      <span class="sensor-kind kind-${t.kind.id}">${t.kind.label}</span>
                      <span class="sensor-name">${t.name}</span>
                      <span class="sensor-state ${t.active?"on":""}">${t.state}</span>
                      <span class="picker-id">${t.entityId}</span>
                    </label>
                  `)}
              </div>
            `:a?W`<p class="empty">No sensors match “${a}”.</p>`:W`
                <p class="hint">
                  No strong suggestions. Search above to link any binary_sensor/sensor
                  (${be.map(e=>e.label).join(", ")}).
                </p>
              `}
      </section>
    `}}customElements.get("cctv-view")||customElements.define("cctv-view",kt);class wt extends re{static properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1}};constructor(){super(),this._stableConfig=null,this._stablePanelConfigRef=null}createRenderRoot(){return this}get _config(){const e=this.panel?.config||{};if(e===this._stablePanelConfigRef&&this._stableConfig)return this._stableConfig;this._stablePanelConfigRef=e;const{_panel_custom:t,...s}=e;return this._stableConfig={title:"CCTV",max_streams:4,quality:"auto",...s},this._stableConfig}connectedCallback(){super.connectedCallback(),this.style.display="block",this.style.height="100%"}disconnectedCallback(){super.disconnectedCallback();const e=this.querySelector?.("cctv-view");if(e)try{e._setPanelActive?.(!1)}catch{}}render(){return W`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        .panelUrlPath=${this.panel?.url_path||"cctv"}
        panel-mode
      ></cctv-view>
    `}}customElements.get("cctv-dashboard-panel")||customElements.define("cctv-dashboard-panel",wt);class $t extends re{static properties={hass:{attribute:!1},_config:{attribute:!1}};static styles=ce;static getConfigElement(){return null}static getStubConfig(e){const t=Object.keys(e?.states??{}).filter(e=>e.startsWith("camera.")).slice(0,4);return{title:"CCTV",max_streams:4,quality:"auto",...t.length?{cameras:t}:{}}}setConfig(e){if(!e||"object"!=typeof e||Array.isArray(e))throw new Error("Card configuration must be an object");this._config={title:"CCTV",max_streams:4,quality:"auto",...e}}getCardSize(){const e=this._config?.cameras?.length;return e?Math.max(3,2*Math.ceil(e/2)):6}render(){return this._config?W`
      <ha-card>
        <div class="card-inner">
          <cctv-view .hass=${this.hass} .config=${this._config}></cctv-view>
        </div>
      </ha-card>
    `:W``}}customElements.get("cctv-cameras-card")||customElements.define("cctv-cameras-card",$t),window.customCards=window.customCards||[],window.customCards.some(e=>"cctv-cameras-card"===e.type)||window.customCards.push({type:"cctv-cameras-card",name:"CCTV Cameras",preview:!0,description:"Live stream grid of Home Assistant camera entities with detail view and basic controls.",documentationURL:"https://github.com/davies1995/HA-CCTV"});class St extends re{static properties={hass:{attribute:!1},_config:{attribute:!1},_status:{state:!0},_qualityTick:{state:!0}};static styles=ce;static getStubConfig(e){return{entity:Object.keys(e?.states??{}).find(e=>e.startsWith("camera."))||"camera.demo",title:"",muted:!0,quality:"auto"}}constructor(){super(),this._status="",this._qualityTick=0}setConfig(e){if(!e||"object"!=typeof e||Array.isArray(e))throw new Error("Card configuration must be an object");if(!e.entity||!String(e.entity).startsWith("camera."))throw new Error("cctv-camera-card requires a camera.* entity");this._config={muted:!0,quality:"auto",max_streams:4,...e,entity:String(e.entity)}}getCardSize(){return 4}_setQuality(e){je(this._config.entity,e),this._qualityTick+=1}async _run(e){this._status=`Calling ${e}…`;try{await _e(this.hass,e,this._config.entity),this._status=`${e} ok`}catch(e){this._status=e?.message||String(e)}}render(){if(!this._config||!this.hass)return W``;this._qualityTick;const e=this.hass.states?.[this._config.entity],t=he(this._config.entity,e),s=this._config.title||t.name,i=fe(this.hass,t),a=Ue(this._config,this._config.entity),n=He(this.hass,t,this._config,a,"detail");return W`
      <ha-card>
        <div class="card-inner">
          <div class="top">
            <div>
              <h2>${s}</h2>
            </div>
            <span class="status">${this._status||t.state}</span>
          </div>
          <div class="detail-stage">
            <cctv-stream-player
              large
              eager
              .hass=${this.hass}
              .camera=${t}
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
                @change=${e=>this._setQuality(e.target.value)}
              >
                ${Re.map(e=>W`<option value=${e.value}>${e.label}</option>`)}
              </select>
            </label>
            <span class="hint">${We(a)} · using ${n.entityId}</span>
          </div>
          <div class="actions" style="margin-top: 0.75rem">
            ${i.map(e=>W`
                <button
                  class="btn primary"
                  type="button"
                  @click=${()=>this._run(e.service)}
                >
                  ${e.label}
                </button>
              `)}
            <button
              class="btn"
              type="button"
              @click=${()=>ge(this,this._config.entity)}
            >
              More info
            </button>
          </div>
        </div>
      </ha-card>
    `}}customElements.get("cctv-camera-card")||customElements.define("cctv-camera-card",St),window.customCards=window.customCards||[],window.customCards.some(e=>"cctv-camera-card"===e.type)||window.customCards.push({type:"cctv-camera-card",name:"CCTV Camera",preview:!0,description:"Live stream for a single Home Assistant camera entity.",documentationURL:"https://github.com/davies1995/HA-CCTV"});const xt="0.13.0";console.info(`%c CCTV-DASHBOARD %c ${xt} `,"color: #fff; background: #1b6ea8; font-weight: 700;","color: #1b6ea8; background: #fff; font-weight: 700;");export{xt as VERSION};
