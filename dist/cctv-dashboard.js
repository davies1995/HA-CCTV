const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const s=this.t;if(t&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=i.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(s,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new a(i,e,s)},n=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,_=m?m.emptyScript:"",g=p.reactiveElementPolyfillSupport,f=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},b=(e,t)=>!o(e,t),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=v){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);a?.call(this,t),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??v}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(t)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),a=e.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=t.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const r=a.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(void 0!==e){const r=this.constructor;if(!1===i&&(a=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??b)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==a||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[f("elementProperties")]=new Map,k[f("finalized")]=new Map,g?.({ReactiveElement:k}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=e=>e,S=w.trustedTypes,x=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,I=`<${M}>`,D=document,P=()=>D.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,E="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,O=/>/g,R=RegExp(`>|${E}(?:([^\\s"'>=/]+)(${E}*=${E}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),q=/'/g,j=/"/g,F=/^(?:script|style|textarea|title)$/i,H=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),G=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),U=new WeakMap,V=D.createTreeWalker(D,129);function Z(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(t):t}const B=(e,t)=>{const s=e.length-1,i=[];let a,r=2===t?"<svg>":3===t?"<math>":"",n=T;for(let t=0;t<s;t++){const s=e[t];let o,c,l=-1,d=0;for(;d<s.length&&(n.lastIndex=d,c=n.exec(s),null!==c);)d=n.lastIndex,n===T?"!--"===c[1]?n=L:void 0!==c[1]?n=O:void 0!==c[2]?(F.test(c[2])&&(a=RegExp("</"+c[2],"g")),n=R):void 0!==c[3]&&(n=R):n===R?">"===c[0]?(n=a??T,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,o=c[1],n=void 0===c[3]?R:'"'===c[3]?j:q):n===j||n===q?n=R:n===L||n===O?n=T:(n=R,a=void 0);const h=n===R&&e[t+1].startsWith("/>")?" ":"";r+=n===T?s+I:l>=0?(i.push(o),s.slice(0,l)+A+s.slice(l)+C+h):s+C+(-2===l?t:h)}return[Z(e,r+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Q{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,r=0;const n=e.length-1,o=this.parts,[c,l]=B(e,t);if(this.el=Q.createElement(c,s),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=V.nextNode())&&o.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(A)){const t=l[r++],s=i.getAttribute(e).split(C),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:a,name:n[2],strings:s,ctor:"."===n[1]?ee:"?"===n[1]?te:"@"===n[1]?se:Y}),i.removeAttribute(e)}else e.startsWith(C)&&(o.push({type:6,index:a}),i.removeAttribute(e));if(F.test(i.tagName)){const e=i.textContent.split(C),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],P()),V.nextNode(),o.push({type:2,index:++a});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===M)o.push({type:2,index:a});else{let e=-1;for(;-1!==(e=i.data.indexOf(C,e+1));)o.push({type:7,index:a}),e+=C.length-1}a++}}static createElement(e,t){const s=D.createElement("template");return s.innerHTML=e,s}}function K(e,t,s=e,i){if(t===G)return t;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const r=z(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(e),a._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(t=K(e,a._$AS(e,t.values),a,i)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??D).importNode(t,!0);V.currentNode=i;let a=V.nextNode(),r=0,n=0,o=s[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new X(a,a.nextSibling,this,e):1===o.type?t=new o.ctor(a,o.name,o.strings,this,e):6===o.type&&(t=new ie(a,this,e)),this._$AV.push(t),o=s[++n]}r!==o?.index&&(a=V.nextNode(),r++)}return V.currentNode=D,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),z(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Q.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new J(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=U.get(e.strings);return void 0===t&&U.set(e.strings,t=new Q(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new X(this.O(P()),this.O(P()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(e,t=this,s,i){const a=this.strings;let r=!1;if(void 0===a)e=K(this,e,t,0),r=!z(e)||e!==this._$AH&&e!==G,r&&(this._$AH=e);else{const i=e;let n,o;for(e=a[0],n=0;n<a.length-1;n++)o=K(this,i[s+n],t,n),o===G&&(o=this._$AH[n]),r||=!z(o)||o!==this._$AH[n],o===W?e=W:e!==W&&(e+=(o??"")+a[n+1]),this._$AH[n]=o}r&&!i&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class te extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class se extends Y{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??W)===G)return;const s=this._$AH,i=e===W&&s!==W||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(Q,X),(w.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;let ne=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let a=i._$litPart$;if(void 0===a){const e=s?.renderBefore??null;i._$litPart$=a=new X(t.insertBefore(P(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};ne._$litElement$=!0,ne.finalized=!0,re.litElementHydrateSupport?.({LitElement:ne});const oe=re.litElementPolyfillSupport;oe?.({LitElement:ne}),(re.litElementVersions??=[]).push("4.2.2");let ce=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const le={},de=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends ce{constructor(){super(...arguments),this.key=W}render(e,t){return this.key=e,t}update(e,[t,s]){return t!==this.key&&(((e,t=le)=>{e._$AH=t})(e),this.key=t),s}}),he=r`
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

  .zone-pages {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0.55rem 0 0.75rem;
  }

  .zone-pages-mosaic {
    margin: 0 0 0.65rem;
  }

  .zone-page {
    min-width: 4.5rem;
  }

  .tile.tv-focusable .tile-media {
    cursor: pointer;
  }

  .tile.tv-hero {
    outline: 1px solid color-mix(in srgb, var(--cctv-accent) 55%, transparent);
  }

  .admin-structure {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--cctv-border);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .recording-total {
    margin-right: 0.25rem;
    color: var(--cctv-muted);
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
  }

  .recording-pager {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    align-items: center;
    justify-content: center;
    margin-top: 0.65rem;
  }

  .recording-page-label {
    color: var(--cctv-muted);
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
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

  /* Group mosaic rows only — do not restyle Settings/kind-filter checkbox rows. */
  .picker-group {
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

  .settings-panel .picker-item.settings-toggle,
  .kind-filter-item {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 0.55rem;
    align-items: start;
  }

  .settings-panel .picker-item.settings-toggle input,
  .kind-filter-item input {
    grid-row: 1 / span 2;
    margin-top: 0.15rem;
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
`,ue=new Set(["unavailable","unknown","none",""]),pe=[{service:"turn_on",label:"Turn on",feature:1},{service:"turn_off",label:"Turn off",feature:1},{service:"toggle",label:"Toggle",feature:1},{service:"snapshot",label:"Snapshot"},{service:"enable_motion_detection",label:"Motion on",attr:"motion_detection",attrValue:!1},{service:"disable_motion_detection",label:"Motion off",attr:"motion_detection",attrValue:!0}];function me(e,t){const s=t?.attributes??{};return{entityId:e,stateObj:t,state:t?.state??"unknown",name:s.friendly_name||e,brand:s.brand,model:s.model,frontendStreamType:s.frontend_stream_type,supportedFeatures:Number(s.supported_features||0),unavailable:!t||ue.has(String(t.state).trim().toLowerCase())}}function _e(e){return Boolean(2&e?.supportedFeatures)}async function ge(e,t){if(!e?.callWS)return null;try{return await e.callWS({type:"camera/capabilities",entity_id:t})}catch{return null}}async function fe(e,t){if(!e?.callWS)return"";const s=await e.callWS({type:"camera/stream",entity_id:t}),i=s?.url||"";return i?"function"==typeof e.hassUrl?e.hassUrl(i):i:""}async function ye(e,t,s,i={}){if(!e?.callService)throw new Error("hass.callService is unavailable");return e.callService("camera",t,{entity_id:s,...i})}function be(e,t){const s=e?.services?.camera||{},i=Number(t?.supportedFeatures||0),a=t?.stateObj?.attributes||{};return pe.filter(e=>{if(!s[e.service])return!1;if(null!=e.feature&&i&&0===(i&e.feature))return!1;if(e.attr){if(!(e.attr in a))return!1;if(null!=e.attrValue&&Boolean(a[e.attr])!==e.attrValue)return!1}return!0}).map(({service:e,label:t})=>({service:e,label:t}))}function ve(e,t){if(!t)return;const s=new Event("hass-more-info",{bubbles:!0,composed:!0});s.detail={entityId:t},e.dispatchEvent(s)}function ke(e){return e?Array.isArray(e)?e.map(String).map(e=>e.trim()).filter(Boolean):String(e).split(",").map(e=>e.trim()).filter(Boolean):[]}const we=[{id:"person",label:"Person",tokens:["person","people","human","pedestrian","face"]},{id:"car",label:"Car",tokens:["car","vehicle","automobile","auto"]},{id:"animal",label:"Animal",tokens:["animal","pet","dog","cat","wildlife"]},{id:"package",label:"Package",tokens:["package","parcel","delivery","amazon"]},{id:"bicycle",label:"Bicycle",tokens:["bicycle","bike","cyclist"]},{id:"motion",label:"Motion",tokens:["motion","occupancy","presence","moving"]},{id:"other",label:"Other",tokens:["detection","object","zone"]}],$e=new Set(["binary_sensor","sensor"]),Se=new Set(["on","true","detected","active","1","home"]);function xe(e,t){return t.some(t=>new RegExp(`(^|[_\\s.-])${t}([_\\s.-]|$)`,"i").test(e))}function Ae(e,t){const s=`${e} ${t?.attributes?.friendly_name||""}`.toLowerCase();for(const e of we)if("other"!==e.id&&xe(s,e.tokens))return{id:e.id,label:e.label};return{id:"other",label:"Other"}}function Ce(e){if(!e)return!1;const t=String(e.state??"").trim().toLowerCase();if(Se.has(t))return!0;const s=Number(t);return Number.isFinite(s)&&s>0}function Me(e,t,s){const i=String(e||"").replace(/^camera\./i,"").replace(/_(main|hi|high|primary)$/i,"").toLowerCase();if(!i)return 0;const a=String(t).toLowerCase(),r=String(s?.attributes?.friendly_name||"").toLowerCase(),n=`${a} ${r}`;let o=0;const c=a.replace(/^(binary_sensor|sensor)\./,"");if(c===i||c.startsWith(`${i}_`)?o+=50:c.includes(i)&&(o+=25),r.includes(i.replace(/_/g," "))&&(o+=15),o<=0)return 0;let l=o;return"other"!==Ae(t,s).id?l+=20:xe(n,["detection","object","zone","motion","occupancy"])&&(l+=8),a.startsWith("binary_sensor.")&&(l+=5),l}function Ie(e,t,s={}){const i=e?.states||{},a=s.limit??24,r=s.deviceIds,n=r?.get(t),o=[];for(const[e,s]of Object.entries(i)){const i=e.split(".")[0];if(!$e.has(i))continue;let a=Me(t,e,s);if(n&&r?.get(e)===n&&(a+=40),a<20)continue;const c=Ae(e,s);o.push({entityId:e,name:s?.attributes?.friendly_name||e,kind:c,score:a,state:String(s?.state??"unknown"),active:Ce(s)})}return o.sort((e,t)=>t.score-e.score||e.name.localeCompare(t.name)),o.slice(0,a)}function De(e){if(!e||"object"!=typeof e||Array.isArray(e))return{};const t={};for(const[s,i]of Object.entries(e))String(s).startsWith("camera.")&&Array.isArray(i)&&(t[s]=[...new Set(i.map(String).filter(e=>$e.has(e.split(".")[0])))].slice(0,16));return t}function Pe(e){return{start:e.start,end:e.end,cameras:[...e.cameras||[]],sensors:[...e.sensors||[]]}}function ze(e,t){const s=new Set(e.cameras);for(const e of t.cameras||[])s.add(e);e.cameras=[...s];const i=new Map((e.sensors||[]).map(e=>[e.entityId,e]));for(const e of t.sensors||[])e?.entityId&&i.set(e.entityId,e);e.sensors=[...i.values()]}function Ne(e){const t=Math.max(0,Math.round(e/1e3));if(t<60)return`${t}s`;const s=Math.floor(t/60),i=t%60;if(s<60)return i?`${s}m ${i}s`:`${s}m`;const a=Math.floor(s/60),r=s%60;return r?`${a}h ${r}m`:`${a}h`}function Ee(e){try{return new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return""}}function Te(e){if(!Array.isArray(e))return[];const t=[],s=new Set;for(const i of e){if(!i||"object"!=typeof i||Array.isArray(i))continue;const e=[];for(const t of i.members||[]){const i=String(t||"");if(i.startsWith("camera.")&&!s.has(i)&&!e.includes(i)&&(s.add(i),e.push(i),e.length>=8))break}if(e.length<2)continue;const a=String(i.id||"").trim(),r=a&&/^[a-zA-Z0-9._-]+$/.test(a)?a.slice(0,64):`grp_${e[0].replace(/^camera\./,"").slice(0,40)}`,n=String(i.name||"").trim().slice(0,64)||e[0].replace(/^camera\./,"").replace(/_/g," ");if(t.push({id:r,name:n,members:e}),t.length>=32)break}return t}function Le(e,t){const s=String(t||"");if(!s.startsWith("camera."))return null;for(const t of e||[])if((t.members||[]).includes(s))return t;return null}function Oe(e,t){const s=Le(e,t);if(s?.members?.length)return[...s.members];const i=String(t||"");return i.startsWith("camera.")?[i]:[]}const Re=["_fluent","_sub","_lq","_low","_sd","_substream"];function qe(e,t){const s=String(e||""),i=[...new Set((t||[]).map(String))].filter(e=>e.startsWith("camera.")&&e!==s),a=[],r=[];for(const e of i){const t=e.replace(/^camera\./,"");Re.some(e=>t.endsWith(e))?a.push(e):r.push(e)}return[...a,...r]}const je=["high_resolution","high_res","_clear","_main"];function Fe(e){const t=[...new Set((e||[]).map(String))].filter(e=>e.startsWith("camera."));if(!t.length)return"";for(const e of je){const s=t.find(t=>t.replace(/^camera\./,"").includes(e));if(s)return s}return t.find(e=>{const t=e.replace(/^camera\./,"");return!Re.some(e=>t.endsWith(e))})||t[0]}function He(e,t){const s={...e||{}};for(const e of t||[]){const t=(e.members||[]).filter(e=>String(e).startsWith("camera."));if(t.length<2)continue;const i=new Set;for(const e of t)for(const t of s[e]||[])t&&i.add(String(t));const a=[...i].slice(0,16);for(const e of t)a.length?s[e]=[...a]:delete s[e]}return s}function Ge(e,t,s){const i=String(s||"");if(!i)return[];const a=[];for(const[t,s]of Object.entries(e||{}))String(t).startsWith("camera.")&&(s||[]).map(String).includes(i)&&a.push(t);const r=new Set;for(const e of a)for(const s of Oe(t,e))r.add(s);return[...r].sort()}function We(e,t){const s=String(t||"");return Te((e||[]).filter(e=>e.id!==s))}const Ue=[{value:"auto",label:"Auto",help:"High for detail, prefer low/substream in the mosaic when available."},{value:"high",label:"High",help:"Main camera entity; prefer WebRTC/HLS."},{value:"balanced",label:"Balanced",help:"Main entity; prefer HA native / WebRTC, then HLS/MJPEG."},{value:"low",label:"Low",help:"Substream entity when available, else MJPEG on the main camera."}],Ve=["_sub","_lq","_low","_fluent","_sd","_substream"],Ze="cctv-dashboard:quality:",Be=new Set(Ue.map(e=>e.value));function Qe(e){const t=String(e||"auto").toLowerCase();return Be.has(t)?t:"auto"}function Ke(e){if(!e||"object"!=typeof e)return{};const t={};for(const[s,i]of Object.entries(e)){if(!String(s).startsWith("camera."))continue;const e=Qe(i);"auto"!==e&&(t[s]=e)}return t}function Je(e,t){const s=e?.camera_settings||e?.cameras_settings||{},i=s?.[t]||s?.[t?.toLowerCase?.()]||{},a={};return e?.entity&&e.entity===t&&(e.low_entity&&(a.low_entity=e.low_entity),e.high_entity&&(a.high_entity=e.high_entity),e.substream_entity&&(a.substream_entity=e.substream_entity),e.main_entity&&(a.main_entity=e.main_entity)),{...a,...i}}function Xe(e){try{const t=localStorage.getItem(Ze+e);return t?Qe(t):null}catch{return null}}function Ye(e,t){try{localStorage.setItem(Ze+e,Qe(t))}catch{}}function et(e,t,s=null,i=null){if(s){const e=function(e,t,s=null){if(!e||"object"!=typeof e)return null;const i=String(t||"");if(e[i])return Qe(e[i]);for(const t of s||[])if(t&&t!==i&&e[t])return Qe(e[t]);return null}(s,t,i);if(e)return e}else{const e=Xe(t);if(e)return e;for(const e of i||[]){if(!e||e===t)continue;const s=Xe(e);if(s)return s}}const a=Je(e,t);return a.quality?Qe(a.quality):e?.quality?Qe(e.quality):"auto"}function tt(e,t,s,i,a="mosaic",r=null){const n=Qe(i),o=Je(s,t.entityId),c=e?.states||{},l=o.high_entity||o.main_entity||t.entityId,d=o.low_entity||o.substream_entity||function(e,t){const s=String(t||""),i=[...new Set((e||[]).map(String))].filter(e=>e.startsWith("camera."));for(const e of Re){const t=i.find(t=>t!==s&&t.replace(/^camera\./,"").endsWith(e));if(t)return t}return i.find(e=>e!==s)||""}(r,t.entityId)||function(e,t,s){const i=e?.states||{},a=t.replace(/^camera\./,"");for(const e of s){const t=`camera.${a}${e}`;if(i[t])return t;const s=`camera.${a.replace(/_main$/,"")}${e}`;if(s!==t&&i[s])return s}return""}(e,t.entityId,Ve)||"";let h=t.entityId;return h="high"===n?l:"low"===n?d||l:"auto"===n&&"mosaic"===a&&d?d:l,c[h]||(h=t.entityId),me(h,c[h])}function st(e){return Ue.find(t=>t.value===Qe(e))?.help||""}const it=16/9,at=[{value:"auto",label:"Auto (detect)",ratio:null},{value:"16:9",label:"16:9 landscape",ratio:16/9},{value:"9:16",label:"9:16 portrait",ratio:9/16},{value:"4:3",label:"4:3 landscape",ratio:4/3},{value:"3:4",label:"3:4 portrait",ratio:3/4},{value:"1:1",label:"1:1 square",ratio:1},{value:"3:2",label:"3:2 landscape",ratio:1.5},{value:"2:3",label:"2:3 portrait",ratio:2/3},{value:"custom",label:"Custom W:H…",ratio:null}],rt=/^(\d+(?:\.\d+)?)[:x×*](\d+(?:\.\d+)?)$/i;function nt(e){let t=String(e||"").trim().toLowerCase().replace(/\s+/g,"").replace(/×/g,"x").replace(/\*/g,"x");if(!t||"auto"===t||"default"===t||"none"===t||"custom"===t)return"auto";if(at.some(e=>e.value===t&&"custom"!==e.value))return t;const s=rt.exec(t);if(!s)return"auto";const i=Number(s[1]),a=Number(s[2]);return!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0||i/a<.05||i/a>20?"auto":Number.isInteger(i)&&Number.isInteger(a)?`${i}:${a}`:`${Number(i.toPrecision(12))}:${Number(a.toPrecision(12))}`}function ot(e){const t=nt(e);if("auto"===t)return null;const s=at.find(e=>e.value===t);if(s?.ratio)return s.ratio;const[i,a]=t.split(":").map(Number);return!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0?null:i/a}function ct(e){const t=nt(e);return"auto"===t||at.some(e=>e.value===t&&"custom"!==e.value)}function lt(e){const t=nt(e);return"auto"===t?"auto":ct(t)?t:"custom"}function dt(e){if(!e||"object"!=typeof e)return{};const t={};for(const[s,i]of Object.entries(e)){if(!String(s).startsWith("camera."))continue;const e=nt(i);"auto"!==e&&(t[s]=e)}return t}function ht(e,t,s=null){if(!e||"object"!=typeof e)return"auto";const i=String(t||"");if(e[i])return nt(e[i]);for(const t of s||[])if(t&&t!==i&&e[t])return nt(e[t]);return"auto"}function ut(e,t,s,i=null){const a=nt(s),r=[...new Set([...i||[],t].map(String).filter(e=>e.startsWith("camera.")))],n={...e||{}};for(const e of r)"auto"===a?delete n[e]:n[e]=a;return dt(n)}function pt(e){const t=Number(e);return!Number.isFinite(t)||t<=.05||t>20?it:t}function mt(e,t,s,i){if(!e.length||t<=0||s<=0)return null;const a=Math.max(0,e.length-1)*i,r=s-a;if(r<=0)return null;const n=e.map(e=>{const s=e.reduce((e,t)=>e+t.aspect,0),a=Math.max(0,e.length-1)*i,r=t-a;return s<=0||r<=0?0:r/s});if(n.some(e=>e<=0))return null;const o=n.reduce((e,t)=>e+t,0),c=Math.min(1,r/o),l=n.map(e=>e*c),d=[];let h=(s-(l.reduce((e,t)=>e+t,0)+a))/2;e.forEach((e,s)=>{const a=l[s],r=e.map(e=>e.aspect*a),n=r.reduce((e,t)=>e+t,0)+Math.max(0,e.length-1)*i;let o=(t-n)/2;e.forEach((e,t)=>{d.push({id:e.id,left:o,top:h,width:r[t],height:a,aspect:e.aspect}),o+=r[t]+i}),h+=a+i});const u=d.reduce((e,t)=>e+t.width*t.height,0);return{cells:d,totalArea:u}}function _t(e,t,s,i){const a=e.map(e=>e.map(e=>({id:e.id,aspect:1/e.aspect}))),r=mt(a,s,t,i);return r?{totalArea:r.totalArea,cells:r.cells.map(e=>({id:e.id,left:e.top,top:e.left,width:e.height,height:e.width,aspect:1/e.aspect}))}:null}function gt(e){const t=Number(e);return Number.isFinite(t)?Math.max(1,Math.min(Math.floor(t),4)):4}function ft(e,t=null,s=null){const i=new Set((t||[]).map(e=>String(e?.id||"")).filter(Boolean)),a=gt(null==s?4:s);if(!Array.isArray(e))return[];const r=[],n=new Set;for(const t of e){if(!t||"object"!=typeof t||Array.isArray(t))continue;const e=[];for(const s of t.group_ids||t.groups||[]){const t=String(s||"").trim();if(t&&!e.includes(t)&&((!i.size||i.has(t))&&(e.push(t),e.length>=a)))break}const s=String(t.id||"").trim(),o=s&&/^[a-zA-Z0-9._-]+$/.test(s)?s.slice(0,64):`zone_${String(t.name||"zone").replace(/[^a-zA-Z0-9._-]+/g,"_").slice(0,40)}`;if(n.has(o))continue;n.add(o);const c=String(t.name||"").trim().slice(0,64)||o.replace(/^zone_/,"").replace(/_/g," ")||"Zone";if(r.push({id:o,name:c,group_ids:e}),r.length>=32)break}return r}function yt(e,t){const s=String(t||"");return s&&(e||[]).find(e=>e.id===s)||null}async function bt(e){if(!e?.callWS)return null;try{const t=await e.callWS({type:"cctv_dashboard/get_settings"});if(!t||"object"!=typeof t)return null;const s=Te(t.stream_groups||[]),i=gt(t.max_cameras_per_zone),a=ft(t.zones||[],s,i),r=He(De(t.sensor_links||{}),s);return{...t,sensorLinks:r,streamGroups:s,zones:a,maxCamerasPerZone:i,forceAspect:dt(t.force_aspect||{}),cameraQuality:Ke(t.camera_quality||{})}}catch(e){return console.warn("CCTV: failed to load shared config",e),null}}async function vt(e,t){if(!e?.callWS)return null;const s=De(t);return e.callWS({type:"cctv_dashboard/set_sensor_links",sensor_links:s})}async function kt(e,t){return e?.callWS?e.callWS({type:"cctv_dashboard/set_settings",...t}):null}async function wt(e,t=200){if(!e?.callWS)return[];try{const s=await e.callWS({type:"cctv_dashboard/list_recordings",limit:t});return s?.sessions||[]}catch(e){return console.warn("CCTV: failed to list recordings",e),[]}}function $t(e,t){return t?"function"==typeof e?.hassUrl?e.hassUrl(t):t:""}function St(e){if(!e)return"";let t=String(e);try{/^https?:\/\//i.test(t)&&(t=new URL(t).pathname)}catch{}t=t.split("?")[0].split("#")[0],t.startsWith("/")||(t=`/${t}`);const s="/cctv_dashboard_recordings/";if(t.startsWith(s)){const e=t.slice(27).split("/").pop();e&&(t=`/api/cctv_dashboard/media/${e}`)}return t}function xt(e){const t="/api/cctv_dashboard/media/",s=[e?.url,e?.path,e?.filePath];for(const e of s){if(!e)continue;let s=String(e);try{/^https?:\/\//i.test(s)&&(s=new URL(s).pathname)}catch{}if(s=s.split("?")[0].split("#")[0],s.includes(t)||s.includes("/cctv_dashboard_recordings/"))return St(s)}for(const e of s){if(!e)continue;const s=String(e).split("?")[0].split("/").pop();if(s&&/\.(mp4|m4v|webm|jpg|jpeg|png|webp)$/i.test(s))return`${t}${s}`}return St(e?.url||e?.path||"")}async function At(e,t,s=3600){if(!t)return"";const i=St(t);if(!i)return"";if(!e?.callWS)throw new Error("Home Assistant WebSocket unavailable for auth/sign_path");const a=await e.callWS({type:"auth/sign_path",path:i,expires:s}),r=a?.path;if("string"!=typeof r||!r.includes("authSig"))throw new Error(`auth/sign_path returned no authSig for ${i}`);return"function"==typeof e.hassUrl?e.hassUrl(r):r}const Ct={person:"#5eb1ff",car:"#f0b45a",animal:"#7dcf8a",package:"#c9a0ff",bicycle:"#67d5c8",motion:"#e6d36a",other:"#8b9aab"};function Mt(e){const t=String(e||"").toLowerCase();return Ct[t]||Ct.other}function It(e,t,s=null){const i=new Set((t||[]).map(String).filter(Boolean));if(!i.size)return[];if(s?.length){const t=new Set;for(const a of i)for(const i of Ge(e,s,a))t.add(i);return[...t]}const a=[];for(const[t,s]of Object.entries(e||{}))String(t).startsWith("camera.")&&(s||[]).some(e=>i.has(String(e)))&&a.push(t);return a}function Dt(e,t,s,i=null,a=null){const r={},n=(e,t)=>{const s=String(e||"");if(!s.startsWith("camera.")||r[s])return;const i=String(t||"other").toLowerCase();r[s]={kindId:i,color:Mt(i)}},o=i?.kind?.id;if(o&&Array.isArray(i?.cameras))for(const e of i.cameras)n(e,o);const c=[...t?.trigger_sensors||[],...(i?.sensors||[]).map(e=>e?.entityId).filter(Boolean)];for(const t of c){const i=Ae(t,e?.states?.[t]);for(const e of It(s,[t],a))n(e,i.id)}return r}function Pt(e){const t=Number(e)||0;return t<1024?`${t} B`:t<1048576?`${(t/1024).toFixed(t<10240?1:0)} KB`:t<1073741824?`${(t/1048576).toFixed(t<10485760?1:0)} MB`:`${(t/1073741824).toFixed(1)} GB`}function zt(e,t){const s=[],i=new Set;for(const a of t||[]){const t=e?.states?.[a],r=Ae(a,t);i.has(r.id)||(i.add(r.id),s.push(r.label))}return s.length?s:["Detection"]}function Nt(e){return Number.isFinite(e?.total_bytes)?Number(e.total_bytes):(e?.clips||[]).reduce((e,t)=>e+(Number(t.size)||0),0)}function Et(e){if(null==e||""===e)return NaN;if("number"==typeof e)return Number.isFinite(e)?e:NaN;if(e instanceof Date)return e.getTime();const t=String(e).trim(),s=t.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/i);if(s){const e=`${s[1]}-${s[2]}-${s[3]}T${s[4]}:${s[5]}:${s[6]}Z`;return Date.parse(e)}return Date.parse(t)}function Tt(e){return!!e&&(!("size"in(e||{})&&Number(e.size)<=0)&&("snapshot"===e.kind||(Number(e.size)>0||!("size"in(e||{})))))}function Lt(e){const t=Array.isArray(e)?e:[],s=t.filter(e=>e&&"snapshot"!==e.kind);return s.length?s:t}function Ot(e){return!!e&&(Nt(e)>0||!e.active&&(e.clips||[]).some(Tt))}function Rt(e,t,s=10){const i=Array.isArray(e)?e:[],a=Math.max(1,Number(s)||10),r=i.length,n=Math.max(1,Math.ceil(r/a)||1),o=Math.min(Math.max(1,Number(t)||1),n),c=(o-1)*a;return{page:o,pageCount:n,pageSize:a,total:r,items:i.slice(c,c+a)}}function qt(e){const t=String(e?.camera_id||"").trim();if(t.startsWith("camera."))return t;const s=String(e?.path||e?.url||"").split("?")[0].split("/").pop();if(!s)return"";const i=s.match(/^(\d{8}T\d{6}Z_[a-f0-9]{8})_(.+)_(\d{3})_(\d{8}T\d{6}Z)\.(?:mp4|jpg|jpeg|webp)$/i);return i?`camera.${i[2]}`:""}function jt(e){const t=new Map;for(const s of e?.clips||[]){const e=qt(s);e&&!t.get(e)&&(Tt(s)&&t.set(e,!0))}const s=Array.isArray(e?.cameras)?e.cameras.map(String).filter(e=>t.has(e)):[];if(s.length){for(const e of t.keys())s.includes(e)||s.push(e);return s}return[...t.keys()]}function Ft(e,t,s=null){const i=new Map;for(const e of t?.clips||[]){const t=qt(e);t&&(i.has(t)||i.set(t,[]),i.get(t).push(e))}let a;if(s&&s.length)a=s.map(String);else{const s=jt(t);a=s.length?s:[...i.keys()].sort((t,s)=>{const i=e?.states?.[t]?.attributes?.friendly_name||t.replace(/^camera\./,""),a=e?.states?.[s]?.attributes?.friendly_name||s.replace(/^camera\./,"");return i.localeCompare(a)})}return a.map(t=>{const s=[...i.get(t)||[]].sort((e,t)=>Number(e.seq||0)-Number(t.seq||0));return{cameraId:t,name:e?.states?.[t]?.attributes?.friendly_name||t.replace(/^camera\./,""),items:Lt(s.filter(Tt)).map(t=>{const s=function(e){const t=Et(e?.started),s=Number(e?.duration),i=Number.isFinite(s)&&s>0?1e3*s:3e4;return{start:t,end:Number.isFinite(t)?t+i:NaN,durationMs:i}}(t),i=String(t.url||"");return{path:i,url:$t(e,i),kind:"snapshot"===t.kind?"snapshot":"video",size:Number(t.size)||0,seq:Number(t.seq)||0,started:t.started,startedMs:s.start,durationMs:s.durationMs,endMs:s.end,fallback_reason:t.fallback_reason||"",filePath:t.path||""}})}})}function Ht(e,t){const s=e?.items||[];if(!s.length||!Number.isFinite(t))return{index:0,seekSec:0};for(let e=0;e<s.length;e+=1){const i=s[e],a=Number(i.startedMs),r=Number(i.endMs);if(Number.isFinite(a)){if(t<a)return{index:e,seekSec:0};if(!Number.isFinite(r)||t<r){return{index:e,seekSec:Math.max(0,(t-a)/1e3)}}}}return{index:Math.max(0,s.length-1),seekSec:0}}const Gt="cctv_dashboard";async function Wt(e){if(!e?.callWS)return null;try{const t=await e.callWS({type:"frontend/get_user_data",key:Gt}),s=t?.value??t;if(!s||"object"!=typeof s)return null;const i=Array.isArray(s.selectedCameras)?s.selectedCameras.map(String).filter(e=>e.startsWith("camera.")):[],a=String(s.selectedZone||"").trim();return{selectedCameras:i,selectedZone:a,legacySensorLinks:s.sensorLinks&&"object"==typeof s.sensorLinks?s.sensorLinks:null}}catch(e){return console.warn("CCTV: failed to load panel user data",e),null}}async function Ut(e,t,s={}){if(!e?.callWS)return;const i=[...new Set(t.map(String).filter(e=>e.startsWith("camera.")))].slice(0,4),a=String(s.selectedZone||"").trim(),r={selectedCameras:i};a&&(r.selectedZone=a),s.clearLegacySensorLinks;try{await e.callWS({type:"frontend/set_user_data",key:Gt,value:r})}catch(e){throw console.warn("CCTV: failed to save panel selection",e),e}return{selectedCameras:i,selectedZone:a}}const Vt=100,Zt=50;const Bt=new class{constructor(e=4){this.max=e,this.holders=new Map,this.queue=[]}setMax(e){const t=Math.max(1,Number(e)||4);if(t!==this.max)for(this.max=t,this._drain();this.holders.size>this.max;)this._revokeLowest()}activeCount(){return this.holders.size}has(e){return this.holders.has(e)}request(e,t,{onGrant:s,onRevoke:i}){if(!e)return!1;if(this.holders.has(e)){const s=this.holders.get(e);return s.priority=t,s.onRevoke=i,this.queue=this.queue.filter(t=>t.id!==e),!0}const a=this.queue.find(t=>t.id===e);if(a)return a.priority=t,a.onGrant=s,a.onRevoke=i,this._drain(),this.holders.has(e);if(this.holders.size<this.max)return this.holders.set(e,{priority:t,onRevoke:i}),!0;const r=this._lowestHolder();return r&&t>r.priority?(this._revoke(r.id),this.holders.set(e,{priority:t,onRevoke:i}),!0):(this.queue.push({id:e,priority:t,onGrant:s,onRevoke:i}),this.queue.sort((e,t)=>t.priority-e.priority),!1)}release(e){e&&(this.queue=this.queue.filter(t=>t.id!==e),this.holders.has(e)&&(this.holders.delete(e),this._drain()))}releaseAll(){this.holders.clear(),this.queue=[]}_lowestHolder(){let e=null;for(const[t,s]of this.holders)(!e||s.priority<e.priority)&&(e={id:t,priority:s.priority});return e}_revoke(e){const t=this.holders.get(e);if(t){this.holders.delete(e);try{t.onRevoke?.()}catch(e){console.warn("CCTV stream slot revoke failed",e)}}}_revokeLowest(){const e=this._lowestHolder();e&&this._revoke(e.id)}_drain(){for(;this.holders.size<this.max&&this.queue.length;){const e=this.queue.shift();this.holders.set(e.id,{priority:e.priority,onRevoke:e.onRevoke});try{e.onGrant?.()}catch(t){console.warn("CCTV stream slot grant failed",t),this.holders.delete(e.id)}}}}(4),Qt="cctv_dashboard:tv_mode",Kt=16/9;function Jt(e=("undefined"!=typeof document?document:null)){let t=56,s=0;try{const i=e?.documentElement;if(i){const e=getComputedStyle(i);t=parseFloat(e.getPropertyValue("--app-header-height"))||t,s=parseFloat(e.getPropertyValue("--cctv-kiosk-inset"))||0}}catch{}return Math.max(0,t+0+0+s+56+12)}function Xt(e){if(!e||"number"!=typeof e.clientWidth)return 0;let t=0;try{if("function"==typeof getComputedStyle){const s=getComputedStyle(e);t=(parseFloat(s.paddingLeft)||0)+(parseFloat(s.paddingRight)||0)}}catch{}return Math.max(0,e.clientWidth-t)}class Yt extends ne{static properties={hass:{attribute:!1},camera:{attribute:!1},config:{attribute:!1},quality:{type:String},context:{type:String},muted:{type:Boolean},controls:{type:Boolean},large:{type:Boolean,reflect:!0},mosaic:{type:Boolean,reflect:!0},eager:{type:Boolean},posterOnly:{type:Boolean,attribute:"poster-only"},active:{type:Boolean},failoverEntityIds:{attribute:!1},groupMembers:{attribute:!1},_mode:{state:!0},_error:{state:!0},_hlsUrl:{state:!0},_mjpegUrl:{state:!0},_stillUrl:{state:!0},_visible:{state:!0},_slotHeld:{state:!0},_queued:{state:!0},_tileAspect:{state:!0},_failoverEntityId:{state:!0}};static styles=r`
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
  `;constructor(){super(),this.config={},this.quality="",this.context="mosaic",this.muted=!0,this.controls=!1,this.large=!1,this.mosaic=!1,this.eager=!1,this.posterOnly=!1,this.active=!0,this.failoverEntityIds=[],this.groupMembers=[],this._mode="loading",this._error="",this._hlsUrl="",this._mjpegUrl="",this._stillUrl="",this._visible=!1,this._slotHeld=!1,this._queued=!1,this._failoverEntityId="",this._failoverTried=new Set,this._pc=null,this._unsubWebRtc=null,this._sessionId=null,this._startToken=0,this._observer=null,this._hostRo=null,this._slotId="",this._streamCamera=null,this._stableStateObj=null,this._tileAspect=0,this._lastEmittedAspect=0}connectedCallback(){super.connectedCallback(),this._bindObserver(),this._bindHostResize(),this._bindDocumentVisibility(),this.active?this._reconcilePlayback():this._unloadCompletely()}disconnectedCallback(){super.disconnectedCallback(),this._unbindObserver(),this._unbindHostResize(),this._unbindDocumentVisibility(),this._unloadCompletely()}_bindDocumentVisibility(){this._unbindDocumentVisibility(),"undefined"!=typeof document&&(this._onDocVisibility=()=>{this.active&&this._reconcilePlayback()},document.addEventListener("visibilitychange",this._onDocVisibility))}_unbindDocumentVisibility(){this._onDocVisibility&&"undefined"!=typeof document&&document.removeEventListener("visibilitychange",this._onDocVisibility),this._onDocVisibility=null}shouldUpdate(e){for(const t of e.keys()){if(t.startsWith("_"))return!0;if(!["hass","camera","config"].includes(t))return!0}return!(!e.has("hass")||!this._cameraHassChanged(e.get("hass"),this.hass))||(!(!e.has("camera")||!this._cameraMeaningful(e.get("camera"),this.camera))||!(!e.has("config")||!this._configMeaningful(e.get("config"),this.config)))}updated(e){if((e.has("eager")||e.has("posterOnly"))&&this._bindObserver(),(e.has("large")||e.has("mosaic"))&&this._bindHostResize(),e.has("active")&&!this.active)return void this._unloadCompletely();const t=e.has("hass")&&this._cameraHassChanged(e.get("hass"),this.hass),s=e.has("camera")&&this._cameraMeaningful(e.get("camera"),this.camera),i=e.has("config")&&this._configMeaningful(e.get("config"),this.config);if((e.has("camera")||e.has("failoverEntityIds")||e.has("groupMembers"))&&(this._failoverTried=new Set,this._failoverEntityId=""),(t||s||i||e.has("quality")||e.has("context")||e.has("eager")||e.has("posterOnly")||e.has("failoverEntityIds")||e.has("groupMembers")||e.has("active")&&this.active)&&this._reconcilePlayback(),e.has("muted")){const e=this.renderRoot?.querySelector("video");e&&(e.muted=this.muted)}(e.has("_mode")||s||e.has("_tileAspect"))&&this.updateComplete.then(()=>{this._probeMediaSize(),this._forceNestedContain()})}_cameraHassChanged(e,t){const s=this._streamCamera?.entityId||this.camera?.entityId;if(!s)return!0;const i=e?.states?.[s],a=t?.states?.[s];if(i===a)return!1;if(!i||!a)return!0;const r=e=>!e||["unavailable","unknown"].includes(String(e.state).trim().toLowerCase());return r(i)!==r(a)||i.attributes?.access_token!==a.attributes?.access_token}_cameraMeaningful(e,t){return e!==t&&(!e||!t||(e.entityId!==t.entityId||Boolean(e.unavailable)!==Boolean(t.unavailable)||e.stateObj?.attributes?.access_token!==t.stateObj?.attributes?.access_token))}_configMeaningful(e,t){return e!==t&&(!e||!t||(e.max_streams!==t.max_streams||e.quality!==t.quality||JSON.stringify(e.camera_settings||null)!==JSON.stringify(t.camera_settings||null)||JSON.stringify(e.cameras_settings||null)!==JSON.stringify(t.cameras_settings||null)))}_bindHostResize(){this._unbindHostResize(),this._updateTileAspect(),"undefined"!=typeof ResizeObserver&&(this._hostRo=new ResizeObserver(()=>this._updateTileAspect()),this._hostRo.observe(this))}_unbindHostResize(){this._hostRo&&(this._hostRo.disconnect(),this._hostRo=null)}_updateTileAspect(){const e=this.clientWidth,t=this.clientHeight;if(!Number.isFinite(e)||!Number.isFinite(t)||e<2||t<2)return;const s=e/t;this._tileAspect&&Math.abs(this._tileAspect-s)<.005||(this._tileAspect=s)}_forceNestedContain(){if(!this.mosaic&&!this.large||"ha"!==this._mode)return;const e=this.renderRoot?.querySelector("ha-camera-stream"),t=e?.shadowRoot;t&&t.querySelectorAll("video, img").forEach(e=>{e.style.objectFit="contain",e.style.objectPosition="center",e.style.width="100%",e.style.height="100%",e.style.maxWidth="100%",e.style.maxHeight="100%"})}get _effectiveQuality(){return this.quality?this.quality:et(this.config,this.camera?.entityId)}get _priority(){return this.eager?Vt:Zt}_bindObserver(){this._unbindObserver(),this.eager||this.posterOnly?this._visible=!0:"undefined"!=typeof IntersectionObserver?(this._observer=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t,this._reconcilePlayback())},{root:null,rootMargin:"120px 0px",threshold:.15}),this._observer.observe(this)):this._visible=!0}_unbindObserver(){this._observer&&(this._observer.disconnect(),this._observer=null)}_wantsLive(){return!!this.active&&(("undefined"==typeof document||!document.hidden)&&(!this.posterOnly&&(!!this.eager||this._visible)))}_refreshPosterUrls(e,{cacheBust:t=!1}={}){const s=e||this.camera;if(!this.hass||!s?.stateObj)return this._stillUrl="",void(this._mjpegUrl="");const i=function(e,t,s=!0){if(!e||!t?.stateObj)return"";const i=t.stateObj.attributes||{};let a=i.entity_picture;if(!a&&i.access_token&&(a=`/api/camera_proxy/${t.entityId}?token=${i.access_token}`),!a)return"";const r="function"==typeof e.hassUrl?e.hassUrl(a):a;if(!s)return r;const n=r.includes("?")?"&":"?";return`${r}${n}t=${Date.now()}`}(this.hass,s,t),a=function(e,t){const s=t?.stateObj?.attributes?.access_token;if(!e||!t?.entityId||!s)return"";const i=`/api/camera_proxy_stream/${t.entityId}?token=${s}`;return"function"==typeof e.hassUrl?e.hassUrl(i):i}(this.hass,s);this._stillUrl!==i&&(this._stillUrl=i),this._mjpegUrl!==a&&(this._mjpegUrl=a)}_syncStableStreamCamera(e){const t=e?.stateObj||null,s=this._stableStateObj,i=e=>!e||["unavailable","unknown"].includes(String(e.state).trim().toLowerCase());!s||!t||s.entity_id!==t.entity_id||s.attributes?.access_token!==t.attributes?.access_token||i(s)!==i(t)?(this._stableStateObj=t,this._streamCamera=e):this._streamCamera||(this._streamCamera=e)}_clearMediaElements(){const e=this.renderRoot;e&&(e.querySelectorAll("video").forEach(e=>{try{e.pause?.();const t=e.srcObject;t&&"function"==typeof t.getTracks&&t.getTracks().forEach(e=>{try{e.stop()}catch{}}),e.srcObject=null,e.removeAttribute("src"),e.load?.()}catch{}}),e.querySelectorAll("img.media").forEach(e=>{try{e.removeAttribute("src"),e.src=""}catch{}}))}_stopLive(){if(this._startToken+=1,this._unsubWebRtc){try{this._unsubWebRtc()}catch{}this._unsubWebRtc=null}if(this._pc){try{this._pc.getSenders?.().forEach(e=>{try{e.track?.stop?.()}catch{}}),this._pc.getReceivers?.().forEach(e=>{try{e.track?.stop?.()}catch{}}),this._pc.close()}catch{}this._pc=null}this._sessionId=null,this._hlsUrl="",this._clearMediaElements()}_releaseSlot(){this._slotId&&Bt.release(this._slotId),this._slotHeld=!1,this._queued=!1}_unloadCompletely(){this._releaseSlot(),this._stopLive(),this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",this._playKey="",this._idleReason="suspended",this._queued=!1,this._stableStateObj=null,this._streamCamera=null,this._failoverEntityId="",this._failoverTried=new Set}_showIdle(e="idle"){if(this._stopLive(),!this.active||"undefined"!=typeof document&&document.hidden)return this._stillUrl="",this._mjpegUrl="",this._mode="empty",this._error="",void(this._idleReason=e);this._refreshPosterUrls(this._streamCamera||this.camera,{cacheBust:!0}),this.hass&&this.camera?.stateObj?(this._mode=this._stillUrl?"still":"empty",this._error=this._stillUrl?"":"No preview",this._idleReason=e):this._mode="empty"}_reconcilePlayback(){if(!this.active||"undefined"!=typeof document&&document.hidden)return void this._unloadCompletely();const e=Number(this.config?.max_streams);if(Number.isFinite(e)&&e>0&&Bt.setMax(e),!this.hass||!this.camera?.stateObj)return this._releaseSlot(),this._stopLive(),this._mode="empty",this._playKey="",void(this._stableStateObj=null);const t=[...new Set([...this.groupMembers||[],...this.failoverEntityIds||[],this.camera?.entityId].filter(Boolean))];if(this._failoverEntityId&&this.hass?.states?.[this._failoverEntityId])this._syncStableStreamCamera(me(this._failoverEntityId,this.hass.states[this._failoverEntityId]));else{const e=tt(this.hass,this.camera,this.config,this._effectiveQuality,this.context,t);this._syncStableStreamCamera(e)}const s=this._streamCamera?.entityId||this.camera.entityId;this._slotId&&s&&this._slotId!==s&&(Bt.release(this._slotId),this._slotHeld=!1,this._queued=!1,this._playKey=""),this._slotId=s;const i=this._wantsLive(),a=[i?"live":"idle",this._slotId,this._effectiveQuality,this.context,this.eager?"eager":"lazy"].join("|");if(!i)return this._releaseSlot(),this._showIdle("idle"),void(this._playKey=a);if(this._slotHeld&&this._playKey===a&&"loading"!==this._mode&&"empty"!==this._mode&&("still"!==this._mode||!this._queued))return;this._refreshPosterUrls(this._streamCamera,{cacheBust:!1});const r=()=>{this._slotHeld=!0,this._queued=!1,this._playKey=a,this._startLive()},n=()=>{if(this._slotHeld=!1,this._queued=this._wantsLive(),this._playKey="",this._showIdle("queued"),this._wantsLive()){Bt.request(this._slotId,this._priority,{onGrant:r,onRevoke:n})&&r()}};Bt.request(this._slotId,this._priority,{onGrant:r,onRevoke:n})?r():(this._slotHeld=!1,this._queued=!0,this._playKey=a,this._showIdle("queued"))}async _startLive(){this._stopLive();const e=this._startToken;this._error="",this._mode="loading",this._idleReason="";const t=this._streamCamera||this.camera;this._refreshPosterUrls(t,{cacheBust:!1});const s=function(e,t="mosaic"){const s=Qe(e);return"low"===s?["mjpeg","ha","webrtc","hls"]:"high"===s?["webrtc","ha","hls","mjpeg"]:"balanced"===s?["ha","webrtc","hls","mjpeg"]:"mosaic"===t?["mjpeg","ha","webrtc","hls"]:["webrtc","ha","hls","mjpeg"]}(this._effectiveQuality,this.context);for(const i of s){if(e!==this._startToken||!this._slotHeld)return;if("ha"===i&&customElements.get("ha-camera-stream"))return void(this._mode="ha");if("webrtc"===i&&"undefined"!=typeof RTCPeerConnection){const s=await ge(this.hass,t.entityId);if(e!==this._startToken||!this._slotHeld)return;const i=s?.frontend_stream_types||[],a=t.frontendStreamType;if(i.includes("web_rtc")||"web_rtc"===a||_e(t)||!i.length)try{if(await this._startWebRtc(e,t),e!==this._startToken||!this._slotHeld)return;return void(this._mode="webrtc")}catch(e){console.warn("CCTV WebRTC failed, falling back",e)}}if("hls"===i)try{const s=await fe(this.hass,t.entityId);if(e!==this._startToken||!this._slotHeld)return;if(s&&this._canPlayHlsNatively())return this._hlsUrl=s,void(this._mode="hls")}catch(e){console.warn("CCTV HLS failed, falling back",e)}if("mjpeg"===i&&this._mjpegUrl)return void(this._mode="mjpeg")}await this._tryGroupFailover(e)||(this._mode=this._stillUrl?"still":"empty",this._stillUrl||(this._error="No stream or preview available"))}async _tryGroupFailover(e){const t=this.camera?.entityId||"",s=[...new Set([...this.failoverEntityIds||[],...this.groupMembers||[]].map(String).filter(e=>e.startsWith("camera.")))].filter(e=>e!==t),i=[],a=[];for(const e of s){const t=e.replace(/^camera\./,"");["_fluent","_sub","_lq","_low","_sd","_substream"].some(e=>t.endsWith(e))?i.push(e):a.push(e)}const r=[...i,...a];this._failoverTried||(this._failoverTried=new Set);const n=this._failoverEntityId||this._streamCamera?.entityId||t;n&&this._failoverTried.add(n);for(const s of r){if(e!==this._startToken||!this._slotHeld)return!1;if(this._failoverTried.has(s))continue;if(!this.hass?.states?.[s])continue;this._failoverTried.add(s);const i=me(s,this.hass.states[s]);if(!i?.stateObj)continue;this._slotId&&this._slotId!==s&&(Bt.release(this._slotId),this._slotHeld=!1),this._failoverEntityId=s,this._streamCamera=i,this._stableStateObj=i.stateObj,this._slotId=s,this._playKey="";if(!Bt.request(s,this._priority,{onGrant:()=>{this._slotHeld=!0,this._queued=!1},onRevoke:()=>{this._slotHeld=!1,this._queued=this._wantsLive(),this._playKey="",this._showIdle("queued")}}))return this._queued=!0,this._showIdle("queued"),!1;if(this._slotHeld=!0,this.dispatchEvent(new CustomEvent("cctv-stream-failover",{detail:{from:t,to:s,groupMembers:this.groupMembers||[]},bubbles:!0,composed:!0})),await this._startLive(),e!==this._startToken)return!1;if("ha"===this._mode||"webrtc"===this._mode||"hls"===this._mode||"mjpeg"===this._mode)return!0}return!1}_canPlayHlsNatively(){const e=document.createElement("video");return""!==e.canPlayType("application/vnd.apple.mpegurl")||""!==e.canPlayType("application/x-mpegURL")}async _startWebRtc(e,t){const s=await async function(e,t){if(!e?.callWS)return null;try{return await e.callWS({type:"camera/webrtc/get_client_config",entity_id:t})}catch{return null}}(this.hass,t.entityId)||{};if(e!==this._startToken)return;const i=new RTCPeerConnection(s.configuration||{});this._pc=i,i.addTransceiver("video",{direction:"recvonly"});try{i.addTransceiver("audio",{direction:"recvonly"})}catch{}i.ontrack=e=>{const t=this.renderRoot?.querySelector("video#webrtc");if(!t)return;const[s]=e.streams;t.srcObject=s||new MediaStream([e.track]),t.muted=this.muted,t.play?.().catch(()=>{})},i.onicecandidate=e=>{e.candidate&&this._sessionId&&async function(e,t,s,i){e?.callWS&&await e.callWS({type:"camera/webrtc/candidate",entity_id:t,session_id:s,candidate:i})}(this.hass,t.entityId,this._sessionId,e.candidate.toJSON()).catch(()=>{})};const a=await i.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});await i.setLocalDescription(a),this._unsubWebRtc=await function(e,t,s,i){if(!e?.connection?.subscribeMessage)throw new Error("WebSocket connection unavailable");return e.connection.subscribeMessage(i,{type:"camera/webrtc/offer",entity_id:t,offer:s})}(this.hass,t.entityId,a.sdp,async t=>{if(e===this._startToken&&this._pc)if("session"!==t.type)if("answer"!==t.type)if("candidate"===t.type&&t.candidate)try{await this._pc.addIceCandidate(t.candidate)}catch{}else"error"===t.type&&(this._error=t.message||t.code||"WebRTC error",this._mode=this._mjpegUrl?"mjpeg":this._stillUrl?"still":"empty");else await this._pc.setRemoteDescription({type:"answer",sdp:t.answer});else this._sessionId=t.session_id})}_emitMediaAspect(e,t){const s=this.camera?.entityId,i=Number(e),a=Number(t);if(!s||!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0)return;const r=i/a;this._lastEmittedAspect&&Math.abs(this._lastEmittedAspect-r)<.01||(this._lastEmittedAspect=r,this.dispatchEvent(new CustomEvent("cctv-media-aspect",{detail:{entityId:s,width:i,height:a,aspect:r},bubbles:!0,composed:!0})))}_probeMediaSize(){const e=this.renderRoot;if(!e)return;const t=e.querySelector("video");if(t)return void(t.videoWidth&&t.videoHeight&&this._emitMediaAspect(t.videoWidth,t.videoHeight));const s=e.querySelector("img.media");if(s&&s.naturalWidth&&s.naturalHeight)return void this._emitMediaAspect(s.naturalWidth,s.naturalHeight);const i=e.querySelector("ha-camera-stream"),a=i?.shadowRoot?.querySelector?.("video");if(a?.videoWidth&&a?.videoHeight)return void this._emitMediaAspect(a.videoWidth,a.videoHeight);const r=i?.shadowRoot?.querySelector?.("img");r?.naturalWidth&&r?.naturalHeight&&this._emitMediaAspect(r.naturalWidth,r.naturalHeight)}render(){if("loading"===this._mode)return H`<div class="placeholder">Connecting…</div>`;if("empty"===this._mode)return H`<div class="error">${this._error||"No preview"}</div>`;let e=this._mode;return this._queued?e="queued":this._slotHeld||"still"!==this._mode?!this._failoverEntityId||this._failoverEntityId===this.camera?.entityId||"ha"!==this._mode&&"webrtc"!==this._mode&&"hls"!==this._mode&&"mjpeg"!==this._mode||(e="failover"):e=this._idleReason||"idle",H`
      ${this._renderMedia()}
      <span class="badge">${e}</span>
    `}_renderMedia(){const e=this._streamCamera||this.camera;if("ha"===this._mode){const t=this.mosaic||this.large?"contain":"cover",s=this._tileAspect>0?this._tileAspect:this.clientWidth>1&&this.clientHeight>1?this.clientWidth/this.clientHeight:void 0,i=this._stableStateObj||e?.stateObj;return H`
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
      `}return"webrtc"===this._mode?H`
        <video
          id="webrtc"
          class="media"
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${e=>this._emitMediaAspect(e.target.videoWidth,e.target.videoHeight)}
        ></video>
      `:"hls"===this._mode?H`
        <video
          class="media"
          src=${this._hlsUrl}
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${e=>this._emitMediaAspect(e.target.videoWidth,e.target.videoHeight)}
        ></video>
      `:"mjpeg"===this._mode?H`
        <img
          class="media"
          alt=""
          src=${this._mjpegUrl}
          @load=${e=>this._emitMediaAspect(e.target.naturalWidth,e.target.naturalHeight)}
        />
      `:"still"===this._mode?H`
        <img
          class="media"
          alt=""
          src=${this._stillUrl}
          @load=${e=>this._emitMediaAspect(e.target.naturalWidth,e.target.naturalHeight)}
        />
      `:W}}customElements.get("cctv-stream-player")||customElements.define("cctv-stream-player",Yt);const es=[{value:9e5,label:"15m"},{value:36e5,label:"1h"},{value:216e5,label:"6h"},{value:864e5,label:"24h"}];class ts extends ne{static properties={hass:{attribute:!1},cameras:{attribute:!1},sensorLinks:{attribute:!1},cameraNames:{attribute:!1},active:{type:Boolean},_windowMs:{state:!0},_loading:{state:!0},_error:{state:!0},_rows:{state:!0},_now:{state:!0},_selected:{state:!0}};createRenderRoot(){return this}constructor(){super(),this.cameras=[],this.sensorLinks={},this.cameraNames={},this.active=!0,this._windowMs=36e5,this._loading=!1,this._error="",this._rows=[],this._now=Date.now(),this._selected=null,this._timer=null,this._fetchToken=0,this._quietRefreshTimer=0,this._lastEntityKey="",this._onVisibility=null}connectedCallback(){super.connectedCallback(),this._onVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._pausePolling():this.active&&this._scheduleQuietRefresh()},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onVisibility),this.active&&this._startPolling()}disconnectedCallback(){super.disconnectedCallback(),this._stopPolling(),this._onVisibility&&"undefined"!=typeof document&&document.removeEventListener("visibilitychange",this._onVisibility)}updated(e){if(e.has("active")&&(this.active?this._startPolling():this._stopPolling()),this.active)return e.has("cameras")||e.has("sensorLinks")||e.has("_windowMs")?(this._selected=null,void this._refresh({showLoading:!0})):void(e.has("hass")&&this._scheduleQuietRefresh())}_startPolling(){this._pausePolling(),this.active&&("undefined"!=typeof document&&document.hidden||(this._timer=window.setInterval(()=>this._scheduleQuietRefresh(),9e4),this._refresh({showLoading:!this._rows.length})))}_pausePolling(){this._timer&&(window.clearInterval(this._timer),this._timer=null),this._quietRefreshTimer&&(window.clearTimeout(this._quietRefreshTimer),this._quietRefreshTimer=0)}_stopPolling(){this._pausePolling(),this._fetchToken+=1,this._loading=!1}_scheduleQuietRefresh(){this.active&&("undefined"!=typeof document&&document.hidden||this._quietRefreshTimer||(this._quietRefreshTimer=window.setTimeout(()=>{this._quietRefreshTimer=0,this._refresh({showLoading:!1})},2500)))}reload(){return this._selected=null,this._refresh({showLoading:!0})}async _refresh(e={}){if(!this.active)return;if("undefined"!=typeof document&&document.hidden)return;const t=Boolean(e.showLoading),s=[...this.cameras||[]],i=`${s.join(",")}|${this._windowMs}`;if(!this.hass)return this._rows=[],this._error="",this._selected=null,void(this._lastEntityKey=i);const a=++this._fetchToken;(t||i!==this._lastEntityKey)&&(this._loading=!0),this._error="";const r=Date.now(),n=r-this._windowMs;try{const e=await async function(e,t={}){if(!e?.callWS)return[];try{const s=await e.callWS({type:"cctv_dashboard/list_detections",start:t.start,end:t.end,cameras:t.cameras,limit:t.limit??500});return s?.events||[]}catch(e){return console.warn("CCTV: failed to list detections",e),[]}}(this.hass,{start:n,end:r,cameras:s.length?s:void 0,limit:500});if(a!==this._fetchToken||!this.active)return;this._lastEntityKey=i,this._rows=this._buildRowsFromEvents(e,n,r),this._now=r,this._syncSelected()}catch(e){if(a!==this._fetchToken||!this.active)return;this._error=e?.message||"Could not load saved detections",this._rows=this._buildRowsFromEvents([],n,r),this._syncSelected()}finally{a===this._fetchToken&&(this._loading=!1)}}_syncSelected(){if(!this._selected)return;const e=this._rows.flatMap(e=>e.events).find(e=>e.id===this._selected.id);this._selected=e||null}_linkedEntityIds(){const e=[];for(const t of this.cameras||[])for(const s of this.sensorLinks?.[t]||[])e.push(s);return[...new Set(e)]}_sensorName(e){return this.hass?.states?.[e]?.attributes?.friendly_name||String(e||"").replace(/^[^.]+\./,"")||e}_buildRowsFromEvents(e,t,s){const i=new Map,a=new Set(this.cameras||[]);for(const r of e||[]){const e=r.kind||"other",n=we.find(t=>t.id===e)||we[we.length-1],o={id:n.id,label:r.kind_label||n.label},c=Date.parse(r.start),l=r.end?Date.parse(r.end):s;if(!Number.isFinite(c))continue;const d=Math.max(t,c),h=Math.min(s,Number.isFinite(l)?l:s);if(h<=d)continue;let u=(r.cameras||[]).map(String);if(a.size&&(u=u.filter(e=>a.has(e)),!u.length&&(r.cameras||[]).length))continue;let p=i.get(o.id);p||(p={kind:o,raw:[],active:!1},i.set(o.id,p)),p.raw.push({start:d,end:h,cameras:u,sensors:r.sensor_id?[{entityId:r.sensor_id,name:this._sensorName(r.sensor_id)}]:[],sourceId:r.id,active:Boolean(r.active||null==r.end)}),(r.active||null==r.end)&&(p.active=!0)}for(const e of this.cameras||[])for(const t of this.sensorLinks?.[e]||[]){const e=this.hass?.states?.[t],s=`${t} ${e?.attributes?.friendly_name||""}`.toLowerCase(),a=we.find(e=>"other"!==e.id&&e.tokens.some(e=>new RegExp(`(^|[_\\s.-])${e}([_\\s.-]|$)`,"i").test(s)))||we[we.length-1];i.has(a.id)||i.set(a.id,{kind:{id:a.id,label:a.label},raw:[],active:!1})}const r=new Map(we.map((e,t)=>[e.id,t]));return[...i.values()].map(e=>{const t=function(e,t=0){if(!Array.isArray(e)||!e.length)return[];const s=e.map(e=>({start:Number(e.start),end:Number(e.end),cameras:Array.isArray(e.cameras)?[...e.cameras]:[],sensors:Array.isArray(e.sensors)?[...e.sensors]:[]})).filter(e=>Number.isFinite(e.start)&&Number.isFinite(e.end)&&e.end>e.start).sort((e,t)=>e.start-t.start||e.end-t.end);if(!s.length)return[];const i=[Pe(s[0])];for(let e=1;e<s.length;e+=1){const a=s[e],r=i[i.length-1];a.start<=r.end+t?(r.end=Math.max(r.end,a.end),ze(r,a)):i.push(Pe(a))}return i}(e.raw,1e3),i=t.map((t,i)=>{const a=t.cameras||[];return{id:t.sourceId||`${e.kind.id}:${t.start}:${t.end}:${i}`,kind:e.kind,start:t.start,end:t.end,durationMs:Math.max(0,t.end-t.start),cameras:a,cameraNames:a.map(e=>this.cameraNames?.[e]||e),sensors:t.sensors||[],active:Boolean(e.active&&t.end>=s-5e3)}});return{kind:e.kind,events:i,totalMs:i.reduce((e,t)=>e+t.durationMs,0),active:e.active}}).filter(e=>e.events.length||e.active||this._linkedEntityIds().length).sort((e,t)=>(r.get(e.kind.id)??99)-(r.get(t.kind.id)??99)||e.kind.label.localeCompare(t.kind.label))}_setWindow(e){this._windowMs=e}_selectEvent(e,t){t?.stopPropagation?.(),this._selected=this._selected?.id===e.id?null:e}_clearSelected(){this._selected=null}_requestPlay(e,t){t?.stopPropagation?.(),this.dispatchEvent(new CustomEvent("cctv-play-detection",{detail:{start:e.start,end:e.end,kind:e.kind,sensors:e.sensors||[],cameras:e.cameras||[]},bubbles:!0,composed:!0}))}_tickMarks(){const e=this._now-this._windowMs,t=this._windowMs<=9e5?4:this._windowMs<=36e5?6:8,s=[];for(let i=0;i<=t;i+=1){const a=e+this._windowMs*i/t;s.push({t:a,label:Ee(a),pct:i/t*100})}return s}render(){const e=this._linkedEntityIds().length;if(!(this.cameras||[]).length)return W;const t=this._now-this._windowMs,s=Math.max(1,this._windowMs),i=this._tickMarks();return H`
      <section class="timeline" aria-label="Detection timeline">
        <div class="timeline-head">
          <div>
            <strong>Detection timeline</strong>
            <span class="hint">
              ${e?"Shared for all users — survives reboot; kept for retention days":"Link detection sensors in a camera’s settings to see events here"}
            </span>
          </div>
          <div class="timeline-windows">
            ${es.map(e=>H`
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

        ${this._error?H`<p class="timeline-error">${this._error}</p>`:W}
        ${e?0===this._rows.length?H`<p class="empty">No linked sensors for the current selection.</p>`:H`
                <div class="timeline-board" @click=${this._clearSelected}>
                  <div class="timeline-ruler" aria-hidden="true">
                    ${i.map(e=>H`
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
                ${this._selected?this._renderDetail(this._selected):H`<p class="hint timeline-hint">Select a highlighted event on the timeline.</p>`}
                ${this._loading?H`<p class="hint timeline-loading">Refreshing…</p>`:W}
              `:H`<p class="empty">No detection sensors linked yet.</p>`}
      </section>
    `}_renderLane(e,t,s){const i=we.find(t=>t.id===e.kind.id)||we[we.length-1];return H`
      <div class="timeline-lane">
        <div class="timeline-lane-label">
          <span class="timeline-kind kind-${i.id}">${i.label}</span>
          <span class="timeline-total">
            ${e.events.length?`${e.events.length} event${1===e.events.length?"":"s"} · ${Ne(e.totalMs)}`:e.active?"active now":"quiet"}
          </span>
        </div>
        <div
          class="timeline-track"
          role="listbox"
          aria-label="${i.label} events"
        >
          ${e.events.map(e=>{const a=(e.start-t)/s*100,r=Math.max(.6,(e.end-e.start)/s*100),n=this._selected?.id===e.id;return H`
              <button
                type="button"
                class="timeline-event kind-${i.id} ${n?"selected":""} ${e.active?"live":""}"
                style="left:${a}%;width:${r}%"
                title="${i.label}: ${Ee(e.start)}–${Ee(e.end)}"
                aria-pressed=${n?"true":"false"}
                @click=${t=>this._selectEvent(e,t)}
              >
                <span class="timeline-event-mark"></span>
              </button>
            `})}
        </div>
      </div>
    `}_renderDetail(e){const t=we.find(t=>t.id===e.kind.id)||we[we.length-1],s=e.cameraNames?.length?e.cameraNames.join(", "):"—",i=e.sensors?.length?e.sensors:[];return H`
      <aside class="timeline-detail" aria-live="polite">
        <div class="timeline-detail-head">
          <span class="timeline-kind kind-${t.id}">${t.label}</span>
          ${e.active?H`<span class="timeline-live-badge">Live</span>`:W}
          <div class="timeline-detail-actions">
            ${e.active?W:H`
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
          <dd>${Ne(e.durationMs)}${e.active?" (ongoing)":""}</dd>
          <dt>Cameras</dt>
          <dd>${s}</dd>
          <dt>Sensors</dt>
          <dd>
            ${i.length?H`
                  <ul class="timeline-detail-sensors">
                    ${i.map(e=>H`
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
    `}}customElements.get("cctv-detection-timeline")||customElements.define("cctv-detection-timeline",ts);class ss extends ne{static properties={hass:{attribute:!1},config:{attribute:!1},panelMode:{type:Boolean,attribute:"panel-mode"},panelUrlPath:{type:String,attribute:"panel-url-path"},_detailId:{state:!0},_status:{state:!0},_qualityTick:{state:!0},_visibleIds:{state:!0},_sensorLinks:{state:!0},_streamGroups:{state:!0},_zones:{state:!0},_selectedZoneId:{state:!0},_manageGroupsOpen:{state:!0},_manageZonesOpen:{state:!0},_groupDraftMembers:{state:!0},_groupDraftName:{state:!0},_groupDraftId:{state:!0},_zoneDraftId:{state:!0},_zoneDraftName:{state:!0},_zoneDraftGroupIds:{state:!0},_maxCamerasPerZone:{state:!0},_tvFocusId:{state:!0},_forceAspect:{state:!0},_savedForceAspect:{state:!0},_cameraQuality:{state:!0},_savedCameraQuality:{state:!0},_customAspectDraft:{state:!0},_prefsDirty:{state:!0},_pickerOpen:{state:!0},_settingsOpen:{state:!0},_selectionReady:{state:!0},_saving:{state:!0},_sensorFilter:{state:!0},_deviceMapReady:{state:!0},_retentionDays:{state:!0},_recordOnDetection:{state:!0},_recordDetectionKinds:{state:!0},_notifyOnDetection:{state:!0},_sessions:{state:!0},_recordingsPage:{state:!0},_recordDir:{state:!0},_recordingDebug:{state:!0},_recordingDebugSummary:{state:!0},_isDesktop:{state:!0},_tvMode:{state:!0},_aspectById:{state:!0},_packStyles:{state:!0},_tvStage:{state:!0},_playback:{state:!0},_panelActive:{state:!0},_liveMountGen:{state:!0},_playbackMountGen:{state:!0}};static styles=he;constructor(){super(),this.config={},this.panelMode=!1,this.panelUrlPath="cctv",this._detailId=null,this._status="",this._qualityTick=0,this._visibleIds=[],this._sensorLinks={},this._streamGroups=[],this._zones=[],this._selectedZoneId="",this._manageGroupsOpen=!1,this._manageZonesOpen=!1,this._groupDraftMembers=[],this._groupDraftName="",this._groupDraftId="",this._zoneDraftId="",this._zoneDraftName="",this._zoneDraftGroupIds=[],this._maxCamerasPerZone=4,this._tvFocusId="",this._forceAspect={},this._savedForceAspect={},this._cameraQuality={},this._savedCameraQuality={},this._customAspectDraft="",this._prefsDirty=!1,this._pickerOpen=!0,this._settingsOpen=!1,this._selectionReady=!1,this._saving=!1,this._sensorFilter="",this._deviceMapReady=!1,this._retentionDays=1,this._recordOnDetection=!0,this._recordDetectionKinds=we.map(e=>e.id),this._notifyOnDetection=!1,this._sessions=[],this._recordingsPage=1,this._recordDir="",this._recordingDebug="",this._recordingDebugSummary="",this._loadedForUser=null,this._isDesktop=!1,this._tvMode=!1,this._aspectById={},this._packStyles={},this._tvStage={width:0,height:0},this._playback=null,this._panelActive=!0,this._liveMountGen=0,this._playbackMountGen=0,this._deviceMap=new Map,this._packObserver=null,this._packObservedEl=null,this._mq=null,this._onMq=null,this._packRaf=0,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._cameraNamesCache={},this._cameraNamesKey="",this._lastHassSig="",this._onDocVisibility=null,this._onLocationChange=null,this._loadToken=0}shouldUpdate(e){if(this.panelMode&&!this._panelActive&&!e.has("_panelActive")&&e.has("hass")&&1===e.size)return!1;if(!e.has("hass"))return!0;if(e.size>1)return!0;const t=e.get("hass"),s=this.hass;return!t||!s||this._hassRelevantChanged(t,s)}_hassRelevantChanged(e,t){const s=this._watchedEntityIds();for(const i of s){const s=e.states?.[i],a=t.states?.[i];if(s!==a){if(!s||!a)return!0;if(s.state!==a.state)return!0;if(s.attributes?.access_token!==a.attributes?.access_token)return!0;if(s.attributes?.friendly_name!==a.attributes?.friendly_name)return!0}}return(e.user?.id||"")!==(t.user?.id||"")}_watchedEntityIds(){const e=new Set(this._visibleIds||[]);if(this._pickerOpen||this._settingsOpen)for(const t of this._cameras())e.add(t.entityId);return e}connectedCallback(){super.connectedCallback(),this._tvMode=function(){try{return"undefined"!=typeof localStorage&&"1"===localStorage.getItem(Qt)}catch{return!1}}(),this._syncTvModeAttr(),"undefined"!=typeof window&&window.matchMedia&&(this._mq=window.matchMedia("(min-width: 801px)"),this._onMq=()=>{this._panelActive&&(this._isDesktop=this._mq.matches,this._refreshTvStage(),this._schedulePack())},this._isDesktop=this._mq.matches,this._mq.addEventListener?this._mq.addEventListener("change",this._onMq):this._mq.addListener(this._onMq)),this._bindTvViewport(),this._bindPanelVisibility(),!this._isCctvLocation()||"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._setPanelActive(!0),this._refreshTvStage()}disconnectedCallback(){super.disconnectedCallback(),this._panelActive&&(this._panelActive=!1,this._suspendResources()),this._unbindTvViewport(),this._unbindPanelVisibility(),this._mq&&this._onMq&&(this._mq.removeEventListener?this._mq.removeEventListener("change",this._onMq):this._mq.removeListener(this._onMq)),this._tearDownObservers()}_syncTvModeAttr(){const e=Boolean(this.panelMode&&this._tvMode);this.toggleAttribute("tv-mode",e)}_bindTvViewport(){"undefined"!=typeof window&&(this._unbindTvViewport(),this._onTvResize=()=>{this._panelActive&&(this._refreshTvStage(),this._schedulePack())},window.addEventListener("resize",this._onTvResize))}_unbindTvViewport(){"undefined"!=typeof window&&this._onTvResize&&(window.removeEventListener("resize",this._onTvResize),this._onTvResize=null)}_refreshTvStage(){if(!this._tvMode||!this.panelMode)return void((this._tvStage?.width||this._tvStage?.height)&&(this._tvStage={width:0,height:0}));const e=Jt(),t=this.renderRoot?.querySelector?.(".panel-wrap"),s=this.renderRoot?.querySelector?.(".layout-pack-tv");let i=Xt(t);i<8&&(i=Xt(s)),i<8&&"number"==typeof this.clientWidth&&(i=Math.max(0,this.clientWidth)),i<8&&"undefined"!=typeof window&&(i=Math.max(0,(Number(window.innerWidth)||0)-256-40));const a="undefined"!=typeof window&&Number(window.innerHeight)||0,{stage:r,offsetTop:n}=function(e,t,s){const i=Math.max(0,Number(e)||0),a=Math.max(0,Number(t)||0),r=Number.isFinite(s)?Number(s):Jt(),n=Math.max(0,a-r),o=i>0?i/Kt:0;return{availW:i,availH:n,offsetTop:Math.max(0,(n-o)/2),stage:{width:i,height:o}}}(i,a,e),o={width:Math.round(r.width),height:Math.round(r.height)};o.width<8?this.style.setProperty("--cctv-tv-chrome",`${e}px`):(o.width===this._tvStage?.width&&o.height===this._tvStage?.height||(this._tvStage=o),this.style.setProperty("--cctv-tv-stage-w",`${o.width}px`),this.style.setProperty("--cctv-tv-stage-h",`${o.height}px`),this.style.setProperty("--cctv-tv-chrome",`${e}px`),this.style.setProperty("--cctv-tv-stage-offset",`${Math.round(n)}px`))}_bindPanelVisibility(){this.panelMode&&(this._unbindPanelVisibility(),this._onDocVisibility=()=>{"undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this.isConnected&&this._isCctvLocation()&&this._setPanelActive(!0)},this._onLocationChange=()=>{this.isConnected&&("undefined"!=typeof document&&document.hidden?this._setPanelActive(!1):this._isCctvLocation()?this._panelActive||this._setPanelActive(!0):this._setPanelActive(!1))},"undefined"!=typeof document&&document.addEventListener("visibilitychange",this._onDocVisibility),"undefined"!=typeof window&&(window.addEventListener("location-changed",this._onLocationChange),window.addEventListener("popstate",this._onLocationChange)))}_unbindPanelVisibility(){this._onDocVisibility&&"undefined"!=typeof document&&(document.removeEventListener("visibilitychange",this._onDocVisibility),this._onDocVisibility=null),this._onLocationChange&&"undefined"!=typeof window&&(window.removeEventListener("location-changed",this._onLocationChange),window.removeEventListener("popstate",this._onLocationChange),this._onLocationChange=null)}_isCctvLocation(){if("undefined"==typeof location)return!0;const e=location.pathname||"",t=(String(this.panelUrlPath||"cctv").trim().replace(/^\/+|\/+$/g,"")||"cctv").replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(?:^|/)${t}(?:/|$)`).test(e)}_setPanelActive(e){const t=Boolean(e);this._panelActive!==t&&(this._panelActive=t,t?(this._status="Suspended — streams unloaded"===this._status?"":this._status,this._schedulePack()):this._suspendResources())}_suspendResources(){this._loadToken+=1,this._teardownPlaybackMedia({clearSrc:!0}),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map,this._tearDownObservers(),this._resetLiveStreamSlots(),this._liveMountGen+=1,this.panelMode&&(this._status="Suspended — streams unloaded")}_tearDownObservers(){this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null),this._packRaf&&(cancelAnimationFrame(this._packRaf),this._packRaf=0)}_unloadStreamPlayers(){const e=this.renderRoot||this;e.querySelectorAll?.("cctv-stream-player").forEach(e=>{try{e.active=!1,e._unloadCompletely?.()}catch{}})}updated(e){(this._panelActive||!this.panelMode||e.has("_panelActive")&&this._panelActive)&&(this.panelMode&&this._panelActive&&(e.has("hass")||e.has("panelMode")||e.has("_panelActive"))&&this._ensureSelectionLoaded(),(e.has("_tvMode")||e.has("panelMode"))&&(this._syncTvModeAttr(),this._refreshTvStage()),this.panelMode&&this._panelActive&&(e.has("_visibleIds")||e.has("_isDesktop")||e.has("_detailId")||e.has("_pickerOpen")||e.has("_settingsOpen")||e.has("_aspectById")||e.has("_forceAspect")||e.has("_playback")||e.has("_tvMode")||e.has("_tvStage")||e.has("_panelActive"))&&(this._schedulePack(),this.updateComplete.then(()=>{this._tvMode&&!this._playback?.playing&&this._refreshTvStage(),this._bindPackObserver()})))}firstUpdated(){this._tvMode&&this.panelMode&&this.updateComplete.then(()=>{this._refreshTvStage(),this._schedulePack(),this._bindPackObserver()})}_bindPackObserver(){const e=this.renderRoot?.querySelector?.(".layout-pack");e?this._packObserver&&this._packObservedEl===e?this._recomputePack():(this._packObserver&&this._packObserver.disconnect(),this._packObservedEl=e,"undefined"!=typeof ResizeObserver?(this._packObserver=new ResizeObserver(()=>this._schedulePack()),this._packObserver.observe(e),this._recomputePack()):this._recomputePack()):this._packObserver&&(this._packObserver.disconnect(),this._packObserver=null,this._packObservedEl=null)}_schedulePack(){this._panelActive&&(this._packRaf&&cancelAnimationFrame(this._packRaf),this._packRaf=requestAnimationFrame(()=>{this._packRaf=0,this._recomputePack()}))}_recomputePack(){if(!this._isDesktop||!this.panelMode||this._detailId)return void(Object.keys(this._packStyles).length&&(this._packStyles={}));this._tvMode&&!this._playback?.playing&&this._refreshTvStage();const e=this.renderRoot?.querySelector?.(".layout-pack");if(!e)return;const t=e.getBoundingClientRect();let s=Math.max(0,t.width),i=Math.max(0,t.height);if(this._tvMode&&this._tvStage?.width>=8&&this._tvStage?.height>=8&&(s=this._tvStage.width,i=this._tvStage.height),s<8||i<8)return;const a=this._layoutCameras(this._cameras()).slice(0,this._mosaicLimit()).map(e=>({id:e.entityId,aspect:this._effectiveAspect(e.entityId)})),r=this._tvMode?(n=a.length,(Number(n)||0)<=2?6:8):10;var n;const o=this._tvMode&&a.length>=3?function(e,t,s,i=8,a=""){const r=(e||[]).map(e=>({id:String(e?.id||""),aspect:Number(e?.aspect)>.05&&Number(e?.aspect)<=20?Number(e.aspect):16/9})).filter(e=>e.id);if(!r.length||t<=1||s<=1)return[];const n=String(a||""),o=r.slice();if(n){const e=o.findIndex(e=>e.id===n);if(e>0){const[t]=o.splice(e,1);o.unshift(t)}}if(1===o.length){const e=o[0];return[{id:e.id,left:0,top:0,width:t,height:s,aspect:e.aspect}]}if(2===o.length){const e=Math.max(0,Number(i)||0),a=(t-e)/2;return o.map((t,i)=>({id:t.id,left:i*(a+e),top:0,width:a,height:s,aspect:t.aspect}))}const c=Math.max(0,Number(i)||0),l=o[0],d=o.slice(1),h=d.length>=3?.34:.36,u=Math.max(120,Math.min(t*h,.42*t)),p=Math.max(1,t-c-u),m=Math.max(0,d.length-1)*c,_=Math.max(1,(s-m)/d.length),g=[{id:l.id,left:0,top:0,width:p,height:s,aspect:l.aspect}];return d.forEach((e,t)=>{g.push({id:e.id,left:p+c,top:t*(_+c),width:u,height:_,aspect:e.aspect})}),g}(a,s,i,r,this._tvFocusId):function(e,t,s,i=10){const a=(e||[]).map(e=>({id:String(e.id),aspect:pt(e.aspect)}));if(!a.length||t<=1||s<=1)return[];let r=null,n=-1;for(const e of function(e){const t=e.length;if(!t)return[];const s=[];return function i(a,r){if(a!==t)for(let s=a+1;s<=t;s+=1)r.push(e.slice(a,s)),i(s,r),r.pop();else s.push(r.map(e=>e.slice()))}(0,[]),s}(a))for(const a of[mt(e,t,s,i),_t(e,t,s,i)])a&&a.totalArea>n&&(n=a.totalArea,r=a.cells);return r||[]}(a,s,i,r),c=function(e,t,s){if(!t||!s)return{};const i={};for(const a of e)i[a.id]=[`left:${a.left/t*100}%`,`top:${a.top/s*100}%`,`width:${a.width/t*100}%`,`height:${a.height/s*100}%`].join(";");return i}(o,s,i);this._packStylesEqual(this._packStyles,c)||(this._packStyles=c)}_effectiveAspect(e){const t=ot(this._forceAspectLabel(e));return pt(t||(this._aspectById[e]||it))}_groupMembers(e){return Oe(this._streamGroups,e)}_forceAspectLabel(e){return ht(this._forceAspect,e,this._groupMembers(e))}_packStylesEqual(e,t){const s=Object.keys(e||{}),i=Object.keys(t||{});if(s.length!==i.length)return!1;for(const i of s)if(e[i]!==t[i])return!1;return!0}_onMediaAspect(e){const t=e?.detail?.entityId,s=pt(e?.detail?.aspect);t&&(ot(this._forceAspect?.[t])||Math.abs((this._aspectById[t]||0)-s)<.01||(this._aspectById={...this._aspectById,[t]:s}))}_onPlaybackMediaSize(e,t,s){const i=Number(t),a=Number(s);!e||!Number.isFinite(i)||!Number.isFinite(a)||i<=0||a<=0||this._onMediaAspect({detail:{entityId:e,aspect:i/a}})}async _ensureSelectionLoaded(){if(!this._panelActive)return;const e=this.hass?.user?.id||"default";if(!this.hass||this._loadedForUser===e)return;this._loadedForUser=e,this._selectionReady=!1;const t=++this._loadToken,[s,i]=await Promise.all([Wt(this.hass),bt(this.hass)]);if(t!==this._loadToken||!this._panelActive)return;const a=this._cameras().map(e=>e.entityId);s?.selectedCameras?.length?(this._visibleIds=s.selectedCameras.filter(e=>a.includes(e)).slice(0,this._mosaicLimit()),this._pickerOpen=0===this._visibleIds.length):(this._visibleIds=[],this._pickerOpen=!0),s?.selectedZone&&(this._selectedZoneId=String(s.selectedZone));let r=i?.sensorLinks||{};const n=s?.legacySensorLinks;if(n&&"object"==typeof n&&Object.keys(n).length&&!Object.keys(r).length)try{const e=await vt(this.hass,n);if(t!==this._loadToken||!this._panelActive)return;r=e?.sensor_links?Object.fromEntries(Object.entries(e.sensor_links).map(([e,t])=>[e,t])):n,await Ut(this.hass,this._visibleIds),this._status="Detection sensor links moved to shared settings"}catch(e){console.warn("CCTV: legacy sensor-link migration failed",e),r=n}this._streamGroups=Te(i?.streamGroups||[]),this._maxCamerasPerZone=gt(i?.maxCamerasPerZone??i?.max_cameras_per_zone),this._zones=ft(i?.zones||[],this._streamGroups,this._maxCamerasPerZone),(this._selectedZoneId&&!yt(this._zones,this._selectedZoneId)&&this._zones[0]||!this._selectedZoneId&&this._zones[0])&&(this._selectedZoneId=this._zones[0].id),this._sensorLinks=He(r,this._streamGroups),i?(this._retentionDays=Number(i.retention_days)||1,this._recordOnDetection=!1!==i.record_on_detection,this._recordDetectionKinds=this._normalizeRecordKinds(i.record_detection_kinds),this._notifyOnDetection=Boolean(i.notify_on_detection),this._recordDir=i.record_dir||"",this._recordingDebug=String(i.recording_debug||""),this._recordingDebugSummary=String(i.recording_debug_summary||""),this._applySharedCameraPrefs(i)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection);const o=this._mosaicLimit();this._visibleIds.length>o&&(this._visibleIds=this._visibleIds.slice(0,o)),!this._tvFocusId&&this._visibleIds[0]&&(this._tvFocusId=this._visibleIds[0]),this._selectionReady=!0,this._loadDeviceMap(),this._sessions?.length||(this._sessions=await wt(this.hass),t===this._loadToken&&this._panelActive)}async _loadDeviceMap(){this.hass&&!this._deviceMapReady&&(this._deviceMap=await async function(e){const t=new Map;if(!e?.callWS)return t;try{const s=await e.callWS({type:"config/entity_registry/list"});if(!Array.isArray(s))return t;for(const e of s)e?.entity_id&&e?.device_id&&t.set(String(e.entity_id),String(e.device_id))}catch(e){console.warn("CCTV: entity registry unavailable for sensor linking",e)}return t}(this.hass),this._deviceMapReady=!0)}async _loadRecordingUi(){if(!this.hass)return;const e=await bt(this.hass);e?(this._retentionDays=Number(e.retention_days)||1,this._recordOnDetection=!1!==e.record_on_detection,this._recordDetectionKinds=this._normalizeRecordKinds(e.record_detection_kinds),this._notifyOnDetection=Boolean(e.notify_on_detection),this._recordDir=e.record_dir||"",this._recordingDebug=String(e.recording_debug||""),this._recordingDebugSummary=String(e.recording_debug_summary||""),null==e.maxCamerasPerZone&&null==e.max_cameras_per_zone||(this._maxCamerasPerZone=gt(e.maxCamerasPerZone??e.max_cameras_per_zone)),e.streamGroups&&(this._streamGroups=Te(e.streamGroups)),e.zones?this._zones=ft(e.zones,this._streamGroups,this._maxCamerasPerZone):e.streamGroups&&(this._zones=ft(this._zones,this._streamGroups,this._maxCamerasPerZone)),e.sensorLinks&&(this._sensorLinks=He(e.sensorLinks,this._streamGroups)),this._prefsDirty||this._applySharedCameraPrefs(e)):this.config?.retention_days&&(this._retentionDays=Number(this.config.retention_days)||1,this._recordOnDetection=!1!==this.config.record_on_detection),this._sessions=await wt(this.hass)}async _copyRecordingDebug(){const e=this._recordingDebug||"No recording session debug yet. Trigger a detection to populate.";try{if(navigator?.clipboard?.writeText)return await navigator.clipboard.writeText(e),void(this._status="Recording debug copied")}catch(e){console.warn("CCTV: clipboard copy failed",e)}this._status="Could not copy — select the debug text manually"}_normalizeRecordKinds(e){const t=new Set(we.map(e=>e.id));if(!Array.isArray(e))return we.map(e=>e.id);const s=[],i=new Set;for(const a of e){const e=String(a||"").trim().toLowerCase();t.has(e)&&!i.has(e)&&(i.add(e),s.push(e))}return s}_applySharedCameraPrefs(e){const t=dt(e?.forceAspect||e?.force_aspect||{}),s=Ke(e?.cameraQuality||e?.camera_quality||{});if(this._forceAspect={...t},this._savedForceAspect={...t},this._cameraQuality={...s},this._savedCameraQuality={...s},this._prefsDirty=!1,this._detailId){const e=ht(t,this._detailId,this._groupMembers(this._detailId));this._customAspectDraft=e&&"auto"!==e&&!ct(e)?e:""}else this._customAspectDraft="";this._qualityTick+=1}_prefsMapsEqual(e,t){const s=e||{},i=t||{},a=new Set([...Object.keys(s),...Object.keys(i)]);for(const e of a)if((s[e]||"")!==(i[e]||""))return!1;return!0}_syncPrefsDirty(){this._prefsDirty=!this._prefsMapsEqual(this._forceAspect,this._savedForceAspect)||!this._prefsMapsEqual(this._cameraQuality,this._savedCameraQuality)}_qualityFor(e){return et(this.config,e,this.panelMode?this._cameraQuality:null,this._groupMembers(e))}_cameras(){return function(e,t={}){const s=e?.states??{},i=ke(t.cameras),a=new Set(ke(t.exclude).map(e=>e.toLowerCase()));let r=Object.keys(s).filter(e=>e.startsWith("camera."));if(i.length){const e=new Set(i.map(e=>e.toLowerCase()));r=r.filter(t=>e.has(t.toLowerCase()))}return r=r.filter(e=>!a.has(e.toLowerCase())),r.map(e=>me(e,s[e])).sort((e,t)=>e.name.localeCompare(t.name,void 0,{sensitivity:"base"}))}(this.hass,this.config)}_maxStreams(){const e=Number(this.config?.max_streams);return Number.isFinite(e)&&e>0?e:4}_mosaicLimit(){const e=this._maxStreams(),t=gt(this._maxCamerasPerZone);return Math.max(1,Math.min(e,t))}_visibleCameras(e){return this._visibleIds.map(t=>e.find(e=>e.entityId===t)).filter(Boolean)}_layoutCameras(e){const t=this._playback?.playing?this._playback.tracks:null;if(!t?.length)return this._visibleCameras(e);const s=new Map(e.map(e=>[e.entityId,e]));return t.map(e=>s.has(e.cameraId)?s.get(e.cameraId):me(e.cameraId,this.hass?.states?.[e.cameraId]))}_resetLiveStreamSlots(){try{Bt.releaseAll()}catch(e){console.warn("CCTV: stream slot reset failed",e)}this._unloadStreamPlayers()}_linksFor(e){return this._sensorLinks?.[e]||[]}_groupFor(e){return Le(this._streamGroups,e)}_applyStreamGroupsResult(e){e&&"object"==typeof e&&(Array.isArray(e.stream_groups)&&(this._streamGroups=Te(e.stream_groups)),Array.isArray(e.zones)&&(this._zones=ft(e.zones,this._streamGroups,this._maxCamerasPerZone)),e.sensor_links&&(this._sensorLinks=He(e.sensor_links,this._streamGroups)))}async _toggleGroupForMosaic(e,t){if(!e?.members?.length)return;if(!t){const t=this._visibleIds.find(t=>e.members.includes(t));return void(t&&await this._toggleVisible(t,!1))}const s=Fe(e.members)||e.members[0];await this._toggleVisible(s,!0),await this._setPickerQuality(s,"balanced")}async _toggleVisible(e,t){const s=this._mosaicLimit();let i=[...this._visibleIds];const a=Le(this._streamGroups,e),r=new Set(a?.members||[]);if(t){if(i.includes(e))return;if(r.size){const t=i.find(e=>r.has(e));if(t)i=i.map(s=>s===t?e:s);else{if(i.length>=s)return void(this._status=`Select at most ${s} cameras`);i.push(e)}}else{if(i.length>=s)return void(this._status=`Select at most ${s} cameras`);i.push(e)}this._tvFocusId||(this._tvFocusId=e)}else i=i.filter(t=>t!==e),this._tvFocusId===e&&(this._tvFocusId=i[0]||"");this._visibleIds=i,this._detailId&&!i.includes(this._detailId)&&(this._detailId=null),this._playback&&this._returnToLive(),await this._persistSelection(i)}async _setPreferredStream(e,t){const s=String(e||""),i=String(t||"");if(!i.startsWith("camera.")||s===i)return;const a=Le(this._streamGroups,s);if(a&&!a.members.includes(i))return;let r=[...this._visibleIds];const n=r.indexOf(s);if(n>=0)r[n]=i;else if(!r.includes(i)){if(r.length>=this._mosaicLimit())return void(this._status=`Select at most ${this._mosaicLimit()} cameras`);r.push(i)}this._tvFocusId===s&&(this._tvFocusId=i),a&&(r=r.filter(e=>e===i||!a.members.includes(e))),this._visibleIds=r,this._playback&&this._returnToLive(),await this._persistSelection(r)}async _persistSelection(e){this._saving=!0;try{const t=await Ut(this.hass,e,{selectedZone:this._selectedZoneId||""});t?.selectedCameras&&(this._visibleIds=t.selectedCameras),null!=t?.selectedZone&&(this._selectedZoneId=t.selectedZone||this._selectedZoneId);const s=t?.selectedCameras||e;this._status=s.length?`${s.length} camera${1===s.length?"":"s"} on screen`:"No cameras selected"}catch(e){this._status=e?.message||"Could not save camera selection"}finally{this._saving=!1}}async _selectZone(e){const t=yt(this._zones,e);this._selectedZoneId=t?.id||String(e||"");let s=[...this._visibleIds];if(t?.group_ids?.length){const e=new Set;for(const s of this._streamGroups||[])if((t.group_ids||[]).includes(s.id))for(const t of s.members||[])e.add(t);s=s.filter(t=>e.has(t))}s=s.slice(0,this._mosaicLimit()),this._tvFocusId&&!s.includes(this._tvFocusId)&&(this._tvFocusId=s[0]||""),this._visibleIds=s,await this._persistSelection(s)}_onTvTileActivate(e){const t=String(e||"");t&&(this._tvMode&&this._tvFocusId!==t?(this._tvFocusId=t,this._schedulePack(),this._status=`Focused ${t.replace(/^camera\./,"")}`):this._openDetail(t))}async _persistSensorLinks(e){this._saving=!0;const t=He(e,this._streamGroups);this._sensorLinks=t;try{const e=await vt(this.hass,t);e?.sensor_links&&(this._sensorLinks=He(e.sensor_links,this._streamGroups)),this._status="Detection sensors saved for all users"}catch(e){this._status=e?.message||"Could not save detection sensors"}finally{this._saving=!1}}_setForceAspect(e,t){const s=this._groupMembers(e);if("custom"===t){const t=this._forceAspectLabel(e);this._customAspectDraft=t&&!ct(t)?t:"1920:2560";const i=nt(this._customAspectDraft);return this._forceAspect=ut(this._forceAspect,e,i,s),this._syncPrefsDirty(),void this._schedulePack()}const i=nt(t);this._forceAspect=ut(this._forceAspect,e,i,s),(ct(i)||"auto"===i)&&(this._customAspectDraft=""),this._syncPrefsDirty(),this._schedulePack()}_setCustomForceAspect(e,t){this._customAspectDraft=t;const s=nt(t);this._forceAspect=ut(this._forceAspect,e,s,this._groupMembers(e)),this._syncPrefsDirty(),this._schedulePack()}async _saveCameraPrefs(){this._saving=!0;try{const e=await async function(e,t){if(!e?.callWS)return null;const s={type:"cctv_dashboard/set_camera_prefs"};return void 0!==t.cameraQuality&&(s.camera_quality=Ke(t.cameraQuality)),void 0!==t.forceAspect&&(s.force_aspect=dt(t.forceAspect)),e.callWS(s)}(this.hass,{cameraQuality:this._cameraQuality,forceAspect:this._forceAspect});e?this._applySharedCameraPrefs({force_aspect:e.force_aspect,camera_quality:e.camera_quality}):(this._savedForceAspect={...this._forceAspect},this._savedCameraQuality={...this._cameraQuality},this._prefsDirty=!1),this._status="Quality & aspect saved for all users",this._schedulePack()}catch(e){this._status=e?.message||"Could not save camera preferences"}finally{this._saving=!1}}async _setSensorLinked(e,t,s){const i=Le(this._streamGroups,e)?.members||[e],a=new Set(this._linksFor(e));s?a.add(t):a.delete(t);const r=[...a],n={...this._sensorLinks};for(const e of i)r.length?n[e]=[...r]:delete n[e];await this._persistSensorLinks(He(n,this._streamGroups))}async _applySuggestions(e){const t=Ie(this.hass,e,{deviceIds:this._deviceMap,limit:8});if(!t.length)return void(this._status="No related detection sensors found");const s=Le(this._streamGroups,e)?.members||[e],i=[...new Set([...this._linksFor(e),...t.map(e=>e.entityId)])].slice(0,16),a={...this._sensorLinks};for(const e of s)a[e]=[...i];await this._persistSensorLinks(He(a,this._streamGroups)),this._status=`Linked ${t.length} suggested sensor${1===t.length?"":"s"} (all users)`}async _persistStreamGroups(e){if(this._isAdmin()){this._saving=!0;try{const t=Te(e),s=He(this._sensorLinks,t),i=await async function(e,t){if(!e?.callWS)return null;const s=Te(t);return e.callWS({type:"cctv_dashboard/set_stream_groups",stream_groups:s})}(this.hass,t);this._applyStreamGroupsResult(i),i?.stream_groups?null==i?.sensor_links&&Object.keys(s).length&&await this._persistSensorLinks(s):(this._streamGroups=t,await this._persistSensorLinks(s)),Array.isArray(i?.zones)?this._zones=ft(i.zones,this._streamGroups,this._maxCamerasPerZone):this._zones=ft(this._zones,this._streamGroups,this._maxCamerasPerZone),this._status="Camera groups saved for all users"}catch(e){this._status=e?.message||"Could not save camera groups"}finally{this._saving=!1}}else this._status="Only Home Assistant admins can edit camera groups"}async _persistZones(e){if(!this._isAdmin())return void(this._status="Only Home Assistant admins can edit zones");this._saving=!0;const t=ft(e,this._streamGroups,this._maxCamerasPerZone);try{const e=await async function(e,t,s=null){if(!e?.callWS)return null;const i=ft(t,null,s);return e.callWS({type:"cctv_dashboard/set_zones",zones:i})}(this.hass,t,this._maxCamerasPerZone);this._zones=ft(e?.zones||t,this._streamGroups,this._maxCamerasPerZone),this._selectedZoneId&&!yt(this._zones,this._selectedZoneId)&&(this._selectedZoneId=this._zones[0]?.id||"",await this._persistSelection(this._visibleIds)),this._status="Zones saved for all users"}catch(e){this._status=e?.message||"Could not save zones"}finally{this._saving=!1}}_syncGroupDraftFromCamera(e){const t=Le(this._streamGroups,e);if(t)return this._groupDraftId=t.id,this._groupDraftMembers=[...t.members],void(this._groupDraftName=t.name||"");this._groupDraftId="",this._groupDraftMembers=e?[e]:[],this._groupDraftName=""}_beginNewGroupDraft(){this._groupDraftId="",this._groupDraftName="",this._groupDraftMembers=[],this._manageGroupsOpen=!0}_editGroupDraft(e){e&&(this._groupDraftId=e.id,this._groupDraftName=e.name||"",this._groupDraftMembers=[...e.members||[]],this._manageGroupsOpen=!0)}_beginNewZoneDraft(){this._zoneDraftId="",this._zoneDraftName="",this._zoneDraftGroupIds=[],this._manageZonesOpen=!0}_editZoneDraft(e){e&&(this._zoneDraftId=e.id,this._zoneDraftName=e.name||"",this._zoneDraftGroupIds=[...e.group_ids||[]],this._manageZonesOpen=!0)}_toggleGroupDraftMember(e,t,s){const i=String(e),a=String(t);let r=[...this._groupDraftMembers||[]];r.includes(i)||r.unshift(i),s?r.includes(a)||r.push(a):(r=r.filter(e=>e!==a),r.includes(i)||r.unshift(i)),this._groupDraftMembers=[...new Set(r)].slice(0,8)}async _saveGroupDraft(e=""){if(!this._isAdmin())return void(this._status="Only Home Assistant admins can edit camera groups");const t=e||this._groupDraftMembers?.[0]||"",s=[...new Set([...t?[t]:[],...this._groupDraftMembers||[]].map(String).filter(e=>e.startsWith("camera.")))].slice(0,8);if(s.length<2)return void(this._status="Add at least one other stream to form a physical camera");const i=this._groupDraftId||Le(this._streamGroups,s[0])?.id||"",a=function(e,t){const s=[...new Set((t.members||[]).map(String).filter(e=>e.startsWith("camera.")))].slice(0,8);if(s.length<2){const s=String(t.id||"");return Te((e||[]).filter(e=>e.id!==s))}const i=String(t.id||"").trim()||`grp_${s[0].replace(/^camera\./,"").slice(0,40)}`,a=String(t.name||"").trim().slice(0,64)||s[0].replace(/^camera\./,"").replace(/_/g," "),r=(e||[]).map(e=>({...e,members:(e.members||[]).filter(e=>!s.includes(e))})).filter(e=>e.members.length>=2&&e.id!==i);return Te([...r,{id:i,name:a,members:s}])}(this._streamGroups,{id:i,name:this._groupDraftName,members:s});await this._persistStreamGroups(a);const r=Le(this._streamGroups,s[0]);r?this._editGroupDraft(r):this._beginNewGroupDraft()}async _saveZoneDraft(){if(!this._isAdmin())return void(this._status="Only Home Assistant admins can edit zones");const e=function(e,t,s=null,i=null){const a=new Set((s||[]).map(e=>String(e?.id||"")).filter(Boolean)),r=gt(null==i?4:i),n=[...new Set((t.group_ids||[]).map(String).filter(e=>e&&(!a.size||a.has(e))))].slice(0,r),o=String(t.id||"").trim()||`zone_${String(t.name||"zone").replace(/[^a-zA-Z0-9._-]+/g,"_").slice(0,40)}`,c=String(t.name||"").trim().slice(0,64)||o.replace(/^zone_/,"").replace(/_/g," ")||"Zone",l=(e||[]).filter(e=>e.id!==o);return ft([...l,{id:o,name:c,group_ids:n}],s,r)}(this._zones,{id:this._zoneDraftId,name:this._zoneDraftName,group_ids:this._zoneDraftGroupIds},this._streamGroups,this._maxCamerasPerZone);await this._persistZones(e);const t=this._zoneDraftId,s=yt(this._zones,t)||this._zones.find(e=>e.name===String(this._zoneDraftName||"").trim())||this._zones.at(-1);s&&this._editZoneDraft(s)}_toggleZoneDraftGroup(e,t){const s=String(e||"");if(!s)return;let i=[...this._zoneDraftGroupIds||[]];const a=this._mosaicLimit();if(t){if(i.includes(s))return;if(i.length>=a)return void(this._status=`At most ${a} cameras per zone`);i.push(s)}else i=i.filter(e=>e!==s);this._zoneDraftGroupIds=i.slice(0,a)}_toggleManageGroupMember(e,t){const s=String(e||"");if(!s.startsWith("camera."))return;let i=[...this._groupDraftMembers||[]];t?i.includes(s)||i.push(s):i=i.filter(e=>e!==s),this._groupDraftMembers=[...new Set(i)].slice(0,8)}async _suggestGroupFromDevice(e){await this._loadDeviceMap();const t=function(e,t={}){const s=String(e||"");if(!s.startsWith("camera."))return[];const i=t.deviceMap;let a=null;if(i instanceof Map?a=i.get(s)||null:i&&"object"==typeof i&&(a=i[s]||null),!a)return[];const r=Le(t.groups,s),n=new Set;for(const e of t.groups||[])if(!r||e.id!==r.id)for(const t of e.members||[])n.add(t);const o=new Set((t.cameras||[]).map(e=>String(e?.entityId||e||"")).filter(e=>e.startsWith("camera."))),c=[],l=i instanceof Map?i.entries():Object.entries(i||{});for(const[e,t]of l){const i=String(e);i.startsWith("camera.")&&i!==s&&String(t)===String(a)&&(n.has(i)||o.size&&!o.has(i)||c.push(i))}return c.sort()}(e,{cameras:this._cameras(),deviceMap:this._deviceMap,groups:this._streamGroups});t.length?(this._groupDraftMembers=[...new Set([e,...this._groupDraftMembers,...t])].slice(0,8),this._groupDraftName||(this._groupDraftName=e.replace(/^camera\./,"").replace(/_high_resolution_channel$/,"").replace(/_/g," ")),this._status=`Suggested ${t.length} stream${1===t.length?"":"s"} from the same device`):this._status="No same-device camera streams found to group"}async _ungroupCamera(e){const t=Le(this._streamGroups,e);t?(await this._persistStreamGroups(We(this._streamGroups,t.id)),this._syncGroupDraftFromCamera(e)):this._status="This stream is not in a group"}_openDetail(e){this._detailId=e,this._sensorFilter="";const t=this._forceAspectLabel(e);this._customAspectDraft=t&&"auto"!==t&&!ct(t)?t:"",this._syncGroupDraftFromCamera(e)}_back(){this._detailId=null,this._sensorFilter="",this._customAspectDraft="",this._groupDraftMembers=[],this._groupDraftName=""}_setQuality(e,t){if(!this.panelMode){const s=this._groupMembers(e);Ye(e,t);for(const i of s)i!==e&&Ye(i,t);return void(this._qualityTick+=1)}this._cameraQuality=function(e,t,s,i=null){const a=Qe(s),r=[...new Set([...i||[],t].map(String).filter(e=>e.startsWith("camera.")))],n={...e||{}};for(const e of r)"auto"===a?delete n[e]:n[e]=a;return Ke(n)}(this._cameraQuality,e,t,this._groupMembers(e)),this._syncPrefsDirty(),this._qualityTick+=1}async _setPickerQuality(e,t){if(this._setQuality(e,t),this.panelMode)try{await this._saveCameraPrefs()}catch(e){this._status=e?.message||"Could not save quality"}}async _setPickerForceAspect(e,t){if(this._setForceAspect(e,t),this.panelMode)try{await this._saveCameraPrefs()}catch(e){this._status=e?.message||"Could not save aspect"}}async _run(e,t){this._status=`Calling ${e}…`;try{await ye(this.hass,e,t),this._status=`${e} ok`}catch(e){this._status=e?.message||String(e)}}async _saveRetentionDays(e){const t=Math.max(1,Math.min(30,Number(e)||1));this._retentionDays=t,this._saving=!0;try{await kt(this.hass,{retention_days:t}),this._status=`Retention set to ${t} day${1===t?"":"s"}`}catch(e){this._status=e?.message||"Could not save retention"}finally{this._saving=!1}}async _saveMaxCamerasPerZone(e){if(!this._isAdmin())return void(this._status="Only Home Assistant admins can set max cameras per zone");const t=gt(e);this._maxCamerasPerZone=t,this._saving=!0;try{const e=await kt(this.hass,{max_cameras_per_zone:t});null!=e?.max_cameras_per_zone&&(this._maxCamerasPerZone=gt(e.max_cameras_per_zone)),Array.isArray(e?.zones)?this._zones=ft(e.zones,this._streamGroups,this._maxCamerasPerZone):this._zones=ft(this._zones,this._streamGroups,this._maxCamerasPerZone);const s=this._mosaicLimit();this._visibleIds.length>s&&(this._visibleIds=this._visibleIds.slice(0,s),await this._persistSelection(this._visibleIds)),(this._zoneDraftGroupIds||[]).length>s&&(this._zoneDraftGroupIds=this._zoneDraftGroupIds.slice(0,s)),this._status=`Max cameras per zone set to ${this._maxCamerasPerZone}`}catch(e){this._status=e?.message||"Could not save max cameras per zone",await this._loadRecordingUi()}finally{this._saving=!1}}async _toggleRecordOnDetection(e){this._recordOnDetection=e,this._saving=!0;try{await kt(this.hass,{record_on_detection:e}),this._status=e?"Detection recording enabled":"Detection recording paused"}catch(e){this._status=e?.message||"Could not save recording setting"}finally{this._saving=!1}}async _toggleNotifyOnDetection(e){this._notifyOnDetection=e,this._saving=!0;try{await async function(e,t){return e?.callWS?e.callWS({type:"cctv_dashboard/set_user_notify",notify_on_detection:Boolean(t)}):null}(this.hass,e),this._status=e?"You will be notified when a detection is recorded (this account only)":"Detection notifications disabled for your account"}catch(e){this._status=e?.message||"Could not save notification preference",await this._loadRecordingUi()}finally{this._saving=!1}}_toggleTvMode(e){this._tvMode=Boolean(e),function(e){try{if("undefined"==typeof localStorage)return;localStorage.setItem(Qt,e?"1":"0")}catch{}}(this._tvMode),this._syncTvModeAttr(),this._tvMode&&(this._pickerOpen=!1,this._settingsOpen=!1),this._refreshTvStage(),this._status=this._tvMode?"TV mode on — 16:9 mosaic fills this display width (saved on this device)":"TV mode off",this._schedulePack(),this.updateComplete.then(()=>this._bindPackObserver())}async _toggleRecordKind(e,t){const s=String(e||""),i=new Set(this._recordDetectionKinds||[]);t?i.add(s):i.delete(s);const a=we.map(e=>e.id).filter(e=>i.has(e));this._recordDetectionKinds=a,this._saving=!0;try{await kt(this.hass,{record_detection_kinds:a});const e=we.filter(e=>a.includes(e.id)).map(e=>e.label);this._status=a.length?`Saving video for: ${e.join(", ")}`:"Video save disabled for all detection types (timeline still logs events)"}catch(e){this._status=e?.message||"Could not save detection-type filter",await this._loadRecordingUi()}finally{this._saving=!1}}async _refreshSessions(){this._sessions=await wt(this.hass),this._setRecordingsPage(this._recordingsPage),this._status="Recordings refreshed"}_refreshTimeline(){const e=this.renderRoot?.querySelector?.("cctv-detection-timeline");e?.reload?.()}_isAdmin(){return Boolean(this.hass?.user?.is_admin)}async _deleteSession(e,t,s=null){if(t?.stopPropagation?.(),t?.preventDefault?.(),!this._isAdmin())return void(this._status="Only Home Assistant admins can delete saved detections");const i=Boolean(s?.active),a=i?"Stop and delete this in-progress recording for all users?":"Delete this saved detection’s recordings for all users?";if("undefined"==typeof window||window.confirm(a))try{const t=await async function(e,t){if(!e?.callWS)return!1;const s=await e.callWS({type:"cctv_dashboard/delete_recording",session_id:t});return Boolean(s?.deleted)}(this.hass,e);this._sessions=await wt(this.hass),this._playback?.session?.session_id===e&&this._returnToLive(),this._status=t?i?"In-progress recording stopped and deleted":"Saved detection deleted for all users":"Recording was already removed"}catch(e){this._status=e?.message||"Could not delete recording"}}_setRecordingsPage(e){const t=this._savedDetectionSessions(),{page:s}=Rt(t,e,10);this._recordingsPage=s}_savedDetectionSessions(){return(this._sessions||[]).filter(e=>e.active||Ot(e))}async _clearAllDetections(e){if(e?.stopPropagation?.(),e?.preventDefault?.(),this._isAdmin()){if("undefined"==typeof window||window.confirm("Delete ALL saved detections and reset the detection timeline for every Home Assistant user? This cannot be undone.")){this._saving=!0;try{const e=await async function(e){return e?.callWS?e.callWS({type:"cctv_dashboard/clear_detections"}):null}(this.hass);this._sessions=await wt(this.hass),this._refreshTimeline(),this._playback&&this._returnToLive();const t=Number(e?.sessions_cleared)||0,s=Number(e?.events_cleared)||0;this._status=`Cleared ${t} recording${1===t?"":"s"} and ${s} timeline event${1===s?"":"s"} for all users`}catch(e){this._status=e?.message||"Could not clear detections"}finally{this._saving=!1}}}else this._status="Only Home Assistant admins can clear saved detections"}async _selectPlaybackSession(e,t=null){if(!Ot(e))return this._status="No playable recording for that detection",!1;const s=zt(this.hass,e.trigger_sensors||[]),i=this._maxStreams(),a=this._visibleIds.slice(0,i),r=function(e,t,s=4){const i=Math.max(1,Number(s)||4),a=jt(e),r=new Set(a),n=(t||[]).map(String).filter(e=>e.startsWith("camera."));if(n.length){const e=n.filter(e=>r.has(e)).slice(0,i);return e.length?{cameraIds:e,usedFallback:!1,reason:""}:{cameraIds:a.slice(0,i),usedFallback:!0,reason:"no-selected-clips"}}return{cameraIds:a.slice(0,i),usedFallback:!0,reason:"empty-selection"}}(e,a,i);if(!r.cameraIds.length)return this._status=a.length?"No playable clips for this detection (files missing or empty)":"No playable clips for this detection — select cameras or wait for recordings",!1;const n=Ft(this.hass,e,r.cameraIds),o=n.some(e=>(e.items||[]).some(e=>"video"===e.kind||"snapshot"===e.kind));if(!o)return this._status="No playable clips for this detection (files missing or empty)",!1;const c=function(e,t=null){const s=Number(t?.start),i=Number(t?.end),a=Et(e?.started),r=Et(e?.ended||e?.started),n=Number.isFinite(s)?s:a;let o=Number.isFinite(i)?i:r;return!Number.isFinite(o)&&Number.isFinite(n)&&(o=n+6e4),Number.isFinite(n)&&Number.isFinite(o)&&o<n&&(o=n),{start:n,end:o}}(e,t);this._detailId=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map;for(const e of n){const t=Ht(e,c.start);this._playbackIndex.set(e.cameraId,t.index),this._playbackSeek.set(e.cameraId,t.seekSec),this._playbackDone.set(e.cameraId,!e.items.length)}this._playback={session:e,labels:s,playing:!1,paused:!1,tracks:n,windowStart:c.start,windowEnd:c.end,eventDetail:t,triggerHighlights:Dt(this.hass,e,this._sensorLinks,t,this._streamGroups)};const l=r.cameraIds.length;return"empty-selection"===r.reason?this._status=`No mosaic selection — playing ${l} camera${1===l?"":"s"} with clips`:"no-selected-clips"===r.reason?this._status=`Selected mosaic cams had no clips — playing ${l} camera${1===l?"":"s"} with recordings`:this._status=`Selected ${s.join(", ")} — Play replaces live mosaic for ${l} cam${1===l?"":"s"}`,this._schedulePack(),!0}async _freshPlaybackSession(e){if(!e?.session_id||!this.hass)return e;try{const t=await wt(this.hass);this._sessions=t;const s=t.find(t=>t.session_id===e.session_id);return s||e}catch(t){return console.warn("CCTV: could not refresh recordings before Play",t),e}}async _playSavedDetection(e,t=null){t?.stopPropagation?.(),t?.preventDefault?.();const s=await this._freshPlaybackSession(e);await this._selectPlaybackSession(s)&&this._playback&&this._playback.session?.session_id===s.session_id&&!this._playback.playing&&await this._startPlayback()}_onPlayDetection(e){const t=e?.detail,s=function(e,t){if(!e?.length||!t)return null;const s=Number(t.start),i=Number(t.end);if(!Number.isFinite(s)||!Number.isFinite(i))return null;const a=new Set((t.sensors||[]).map(e=>e.entityId).filter(Boolean));let r=null,n=-1;for(const t of e){if(t.active)continue;if(!(t.clips||[]).length)continue;const e=Date.parse(t.started),o=Date.parse(t.ended||t.started);if(!Number.isFinite(e)||!Number.isFinite(o))continue;const c=Math.min(i,o)-Math.max(s,e);if(c<=0)continue;let l=c;const d=t.trigger_sensors||[];a.size&&d.some(e=>a.has(e))&&(l+=6e4),l>n&&(n=l,r=t)}return r}(this._sessions||[],t);s?this._selectPlaybackSession(s,t):this._status="No saved recording overlaps that timeline event"}async _startPlayback(){if(!this._playback?.tracks?.length)return;this._status="Signing recording URLs…";try{await async function(e,t){const s=[];for(const i of t||[]){const t=[];for(const a of i.items||[])0!==Number(a.size)||"video"!==a.kind?(t.push(a),s.push((async()=>{null==a.filePath&&a.path&&!String(a.path).includes("/api/")&&(a.filePath=a.path),a.path=xt(a),a.url=await At(e,a.path)})())):console.warn("CCTV: skipping empty video clip",a.path||a.url);i.items=t}return await Promise.all(s),t}(this.hass,this._playback.tracks)}catch(e){return console.warn("CCTV: could not sign playback URLs",e),void(this._status=e?.message||"Could not sign recording URLs (auth/sign_path failed)")}const e=this._playback.tracks.some(e=>(e.items||[]).some(e=>"video"===e.kind||"snapshot"===e.kind));e?(this._resetLiveStreamSlots(),this._playback={...this._playback,playing:!0,paused:!1},this._status=`Playing ${this._playback.labels.join(", ")} (synced)`,this.requestUpdate(),await this.updateComplete,await this._waitForPlaybackMedia(),await this._kickPlaybackVideos()):this._status="No playable clips (files missing or empty)"}async _togglePlaybackPause(){this._playback&&(this._playback.playing?this._playback.paused?await this._resumePlayback():this._pausePlaybackClips():await this._startPlayback())}_pausePlaybackClips(){if(!this._playback?.playing)return;const e=this.renderRoot;e?.querySelectorAll?.("video.playback-media").forEach(e=>{try{e.pause?.()}catch{}}),this._playback={...this._playback,paused:!0},this._status=`Paused ${this._playback.labels.join(", ")}`}async _resumePlayback(){if(!this._playback?.playing)return void await this._startPlayback();this._playback={...this._playback,paused:!1},this._status=`Playing ${this._playback.labels.join(", ")} (synced)`;const{videos:e}=this._playbackMediaEls();e.length?await Promise.all(e.map(async e=>{try{e.muted=!0,e.playsInline=!0,await e.play()}catch(e){console.warn("CCTV resume play() failed",e)}})):await this._kickPlaybackVideos()}async _restartPlayback(){if(!this._playback?.tracks?.length)return;const e=Number(this._playback.windowStart);this._playbackDone=new Map,this._playbackIndex=new Map,this._playbackSeek=new Map;for(const t of this._playback.tracks){const s=Ht(t,e);this._playbackIndex.set(t.cameraId,s.index),this._playbackSeek.set(t.cameraId,s.seekSec),this._playbackDone.set(t.cameraId,!t.items.length)}this._teardownPlaybackMedia({clearSrc:!0}),this._playbackMountGen+=1,this._playback={...this._playback,playing:!0,paused:!1},this._status=`Restarting ${this._playback.labels.join(", ")}…`,this.requestUpdate(),await this.updateComplete,await this._waitForPlaybackMedia(),await this._kickPlaybackVideos(),this._playback?.playing&&!this._playback?.paused&&(this._status=`Playing ${this._playback.labels.join(", ")} (restarted)`)}_returnToLive(){this._teardownPlaybackMedia({clearSrc:!0}),this._playback=null,this._playbackIndex=new Map,this._playbackSeek=new Map,this._playbackDone=new Map;try{Bt.releaseAll()}catch(e){console.warn("CCTV: stream slot reset failed",e)}this._unloadStreamPlayers(),this._liveMountGen+=1,this._status="Live mosaic",this._schedulePack(),this.updateComplete.then(()=>{this._wakeLiveStreamPlayers(),this._tvMode&&this._refreshTvStage()})}_stopPlayback(){this._returnToLive()}_wakeLiveStreamPlayers(){const e=this.renderRoot;e?.querySelectorAll&&e.querySelectorAll("cctv-stream-player").forEach(e=>{try{e.active=!0,e._idleReason="",e._reconcilePlayback?.()}catch{}})}_teardownPlaybackMedia(e={}){const t=!1!==e.clearSrc,s=this.renderRoot;s&&s.querySelectorAll("video.playback-media").forEach(e=>{try{e.pause?.(),t&&(e.removeAttribute("src"),e.load?.())}catch{}})}_playbackMediaEls(){const e=this.renderRoot;return e?.querySelectorAll?{videos:[...e.querySelectorAll("video.playback-media")],snapshots:[...e.querySelectorAll("img.playback-media")],empty:[...e.querySelectorAll(".playback-empty")]}:{videos:[],snapshots:[],empty:[]}}_playbackHasVideoClips(){return(this._playback?.tracks||[]).some(e=>(e.items||[]).some(e=>"video"===e.kind))}async _waitForPlaybackMedia(e={}){const t=Number(e.timeoutMs)>0?Number(e.timeoutMs):2500,s=Date.now()+t;let i=0;for(;this._playback?.playing&&Date.now()<s;){const e=this._playbackMediaEls();if(e.videos.length||e.snapshots.length||e.empty.length)return e;i+=1,i%3==0&&(this.requestUpdate(),await this.updateComplete),await new Promise(e=>requestAnimationFrame(()=>e()))}return this._playbackMediaEls()}async _kickPlaybackVideos(){if(!this._playback?.playing||this._playback?.paused)return;let{videos:e}=this._playbackMediaEls();if(e.length||({videos:e}=await this._waitForPlaybackMedia({timeoutMs:1500})),!e.length){const e=this._playbackMediaEls();return e.snapshots.length&&!this._playbackHasVideoClips()?void(this._status=`Playing ${this._playback.labels.join(", ")} (snapshots)`):!e.empty.length||e.snapshots.length||this._playbackHasVideoClips()?void(this._status="Playback ready but no video elements found"):void(this._status="No recording tiles for the selected cameras")}const t=await Promise.all(e.map(e=>this._startOnePlaybackVideo(e))),s=t.filter(e=>!e.ok);s.length&&s.length===t.length?this._status=`Playback failed to start (${s[0].reason||"media error"})`:s.length&&(this._status=`Playing ${t.length-s.length}/${t.length} cameras`)}_startOnePlaybackVideo(e){const t=e.getAttribute("data-camera")||"",s=Number(this._playbackSeek.get(t))||0,i=this._trackForCamera(t),a=i?this._currentPlaybackItem(i):null;if(e.muted=!0,e.defaultMuted=!0,e.playsInline=!0,e.setAttribute("muted",""),e.setAttribute("playsinline",""),e.setAttribute("webkit-playsinline",""),e.preload="auto","video"===a?.kind&&a.url){const t=e.getAttribute("src")||e.currentSrc||"";if(!t||t!==a.url){e.setAttribute("src",a.url),e.src=a.url;try{e.load?.()}catch{}}}const r=async()=>{try{try{Number.isFinite(s)&&Math.abs((e.currentTime||0)-s)>.05?e.currentTime=s:0===s&&(e.currentTime||0)>.05&&(e.currentTime=0)}catch{}return await e.play(),{ok:!0,cameraId:t}}catch(s){const i=s?.name||s?.message||"play() rejected";console.warn("CCTV playback play() failed",t,s);try{return e.muted=!0,await e.play(),{ok:!0,cameraId:t}}catch(e){return console.warn("CCTV playback retry failed",t,e),{ok:!1,cameraId:t,reason:i}}}};return new Promise(s=>{if(e.readyState>=2)r().then(s);else{e.addEventListener("loadeddata",()=>{r().then(s)},{once:!0}),e.addEventListener("error",()=>{const i=e.error?.code,a=4===i?"unsupported/unauthorized media (check signed URL)":2===i?"network error loading clip":`media error ${i||""}`.trim();console.warn("CCTV playback media error",t,e.error,e.currentSrc),s({ok:!1,cameraId:t,reason:a})},{once:!0});try{e.load()}catch{r().then(s)}}})}_playbackVideoEl(e){const t=String(e).replace(/\\/g,"\\\\").replace(/"/g,'\\"');return this.renderRoot?.querySelector?.(`video.playback-media[data-camera="${t}"]`)}_onPlaybackEnded(e){if(!this._playback?.playing||this._playback?.paused)return;const t=this._playback.tracks.find(t=>t.cameraId===e);if(!t)return;const s=(this._playbackIndex.get(e)||0)+1,i=Number(this._playback.windowEnd);if(s<t.items.length){const a=t.items[s];return Number.isFinite(i)&&Number.isFinite(a.startedMs)&&a.startedMs>=i?void this._markPlaybackCameraDone(e):(this._playbackIndex.set(e,s),this._playbackSeek.set(e,0),"snapshot"===a.kind?void this.requestUpdate():void this._advancePlaybackVideo(e,a))}this._markPlaybackCameraDone(e)}async _advancePlaybackVideo(e,t){const s=this._playbackVideoEl(e);if(s)try{t.path=xt(t),t.url=await At(this.hass,t.path),s.muted=!0,s.playsInline=!0,s.src=t.url,s.load?.(),await this._startOnePlaybackVideo(s)}catch(t){console.warn("CCTV chunk advance failed",e,t),this._markPlaybackCameraDone(e)}else this._markPlaybackCameraDone(e)}_markPlaybackCameraDone(e){this._playbackDone.set(e,!0);const t=(this._playback?.tracks||[]).every(e=>!e.items.length||(!!e.items.every(e=>"snapshot"===e.kind)||this._playbackDone.get(e.cameraId)));t&&this._playback?.playing&&(this._pausePlaybackClips(),this._status=`Finished ${this._playback.labels.join(", ")} — Restart or Back to live`)}_trackForCamera(e){return this._playback?.tracks?.find(t=>t.cameraId===e)||null}_currentPlaybackItem(e){if(!e?.items?.length)return null;const t=Math.min(this._playbackIndex.get(e.cameraId)||0,Math.max(0,e.items.length-1));return e.items[t]||null}_stableCameraNames(e){const t=e.map(e=>`${e.entityId}:${e.name}`).join("|");return t===this._cameraNamesKey||(this._cameraNamesKey=t,this._cameraNamesCache=Object.fromEntries(e.map(e=>[e.entityId,e.name]))),this._cameraNamesCache}render(){if(!this.hass)return H`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;this._qualityTick,this._deviceMapReady;const e=this._cameras(),t=this._maxStreams(),s=this._mosaicLimit();Bt.setMax(t);const i=this.config?.title||"CCTV",a=this._renderZoneTabs();if(this.panelMode&&!this._selectionReady)return H`
        <div class="panel-wrap wrap">
          <p class="placeholder">Loading camera selection…</p>
        </div>
      `;if(this.panelMode&&!this._panelActive)return H`
        <div class="panel-wrap wrap">
          <p class="placeholder">CCTV paused — streams unloaded while you are away.</p>
        </div>
      `;const r=e.find(e=>e.entityId===this._detailId)||null,n=this.panelMode?this._layoutCameras(e):e,o=this._stableCameraNames(e),c=Boolean(this._playback?.playing),l=Boolean(c&&this._playback?.paused),d=this._panelActive,h=[this.panelMode?"panel-wrap wrap":"wrap",this.panelMode&&this._tvMode?"tv-mode":""].filter(Boolean).join(" ");return H`
      <div class=${h}>
        <div class="top ${this._tvMode?"top-tv":""}">
          <div>
            ${this.panelMode&&!this._tvMode?H`<p class="eyebrow">Home Assistant</p>`:W}
            <h1>${i}${this._tvMode?H`<span class="tv-badge">TV</span>`:W}</h1>
          </div>
          <div class="top-actions">
            ${this.panelMode?H`
                  <button
                    class="btn"
                    type="button"
                    @click=${()=>this._pickerOpen=!this._pickerOpen}
                  >
                    ${this._pickerOpen?"Hide cameras":"Cameras & zones"}
                  </button>
                  <button
                    class="btn"
                    type="button"
                    @click=${()=>{this._settingsOpen=!this._settingsOpen,this._settingsOpen&&this._loadRecordingUi()}}
                  >
                    ${this._settingsOpen?"Hide settings":"Settings"}
                  </button>
                `:W}
            <span class="status">
              ${this._status||(this.panelMode?`${n.length}/${s} selected · ${c?l?"paused":"playback":`${Bt.activeCount()} live`}`:`${e.length} camera${1===e.length?"":"s"} · ${Bt.activeCount()} live`)}
              ${this._saving?" · saving…":""}
            </span>
          </div>
        </div>

        ${this.panelMode&&this._pickerOpen?this._renderPicker(e,s):W}

        ${this.panelMode&&this._settingsOpen?this._renderSettings():W}

        ${this.panelMode&&this._playback?this._renderPlaybackBar():W}

        ${this.panelMode&&!r?a:W}

        ${r?this._renderDetail(r,d):this.panelMode?this._renderLayout(n,d):this._renderCardGrid(e)}

        ${this.panelMode&&!r?H`
              <cctv-detection-timeline
                .hass=${this.hass}
                .cameras=${n.map(e=>e.entityId)}
                .sensorLinks=${this._sensorLinks}
                .cameraNames=${o}
                .active=${d}
                @cctv-play-detection=${this._onPlayDetection}
              ></cctv-detection-timeline>
              ${this._renderRecordings()}
            `:W}
      </div>
    `}_renderPlaybackBar(){const e=this._playback;if(!e)return W;const t=e.session?.started?new Date(e.session.started).toLocaleString():"—",s=e.playing&&!e.paused?"Pause":"Play";return H`
      <div class="playback-bar" role="region" aria-label="Detection playback">
        <div class="playback-bar-meta">
          <strong>${e.labels.join(", ")}</strong>
          <span class="hint">${t} · ${Pt(Nt(e.session))}${e.playing&&e.paused?" · paused":""}</span>
        </div>
        <div class="playback-bar-actions">
          <button
            class="btn primary"
            type="button"
            @click=${this._togglePlaybackPause}
          >
            ${s}
          </button>
          ${e.playing?H`
                <button class="btn" type="button" @click=${this._restartPlayback}>
                  Restart
                </button>
              `:W}
          <button class="btn" type="button" @click=${this._returnToLive}>
            Back to live
          </button>
        </div>
      </div>
    `}_renderSettings(){const e=this._recordDetectionKinds||[],t=this._isAdmin(),s=this._mosaicLimit();return H`
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
              @change=${e=>this._saveRetentionDays(e.target.value)}
            />
          </label>
          ${t?H`
                <label class="settings-field">
                  Max cameras per zone
                  <input
                    type="number"
                    min="1"
                    max="4"
                    .value=${String(this._maxCamerasPerZone)}
                    ?disabled=${this._saving}
                    @change=${e=>this._saveMaxCamerasPerZone(e.target.value)}
                  />
                  <span class="hint">
                    Shared · admin. Effective mosaic limit ${s}
                    (also capped by max streams ${this._maxStreams()}).
                  </span>
                </label>
              `:W}
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._recordOnDetection}
              @change=${e=>this._toggleRecordOnDetection(e.target.checked)}
            />
            <span class="picker-name">Record on detection</span>
            <span class="picker-id">Default retention is 1 day (24 hours).</span>
          </label>
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._notifyOnDetection}
              ?disabled=${this._saving}
              @change=${e=>this._toggleNotifyOnDetection(e.target.checked)}
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
              @change=${e=>this._toggleTvMode(e.target.checked)}
            />
            <span class="picker-name">TV mode</span>
            <span class="picker-id">
              Per-device (this browser / kiosk). Fits a 16:9 mosaic above the fold
              (accounts for HA / kiosk chrome); up to ${s} cams fill the stage;
              1–2 cams maximize; tap a feed to promote it to the large hero tile.
              Timeline and Saved detections scroll below.
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
            ${we.map(t=>H`
                <label class="picker-item kind-filter-item">
                  <input
                    type="checkbox"
                    .checked=${e.includes(t.id)}
                    ?disabled=${!this._recordOnDetection||this._saving}
                    @change=${e=>this._toggleRecordKind(t.id,e.target.checked)}
                  />
                  <span class="picker-name">${t.label}</span>
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
          ${this._recordingDebugSummary?H`<p class="hint"><code>${this._recordingDebugSummary}</code></p>`:W}
          <textarea
            class="settings-debug-text"
            readonly
            rows="12"
            .value=${this._recordingDebug||"No recording session debug yet. Trigger a detection to populate."}
          ></textarea>
        </div>
      </section>
    `}_renderRecordings(){const e=this._savedDetectionSessions(),t=e.reduce((e,t)=>e+Nt(t),0),s=Rt(e,this._recordingsPage,10),i=this._isAdmin();return H`
      <section class="recordings" aria-label="Saved detections">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Time, what was detected, and file size. Play starts mosaic
              playback for the visible cameras; click the row to load it first
              (desktop bar still works). Shared for all users; survives reboot;
              kept for ${this._retentionDays} day${1===this._retentionDays?"":"s"}.
              Showing ${10} per page.
              Empty 0&nbsp;B stubs are hidden.
              ${i?" Admins can delete one detection (including stuck in-progress) or clear all for everyone.":""}
            </span>
          </div>
          <div class="recording-toolbar">
            <span class="recording-total" title="Total size of saved detections">
              Total ${Pt(t)}
              ${e.length?H` · ${e.length} detection${1===e.length?"":"s"}`:W}
            </span>
            <button class="btn" type="button" @click=${()=>this._refreshSessions()}>
              Refresh
            </button>
            ${i?H`
                  <button
                    class="btn recording-delete"
                    type="button"
                    ?disabled=${this._saving}
                    title="Delete all saved detections and reset the timeline"
                    @click=${e=>this._clearAllDetections(e)}
                  >
                    Clear all
                  </button>
                `:W}
          </div>
        </div>
        ${e.length?H`
              <div class="recording-list">
                ${s.items.map(e=>this._renderSession(e,i))}
              </div>
              ${s.pageCount>1?H`
                    <div class="recording-pager" role="navigation" aria-label="Saved detections pages">
                      <button
                        class="btn"
                        type="button"
                        ?disabled=${s.page<=1}
                        @click=${()=>this._setRecordingsPage(s.page-1)}
                      >
                        Previous
                      </button>
                      <span class="recording-page-label">
                        Page ${s.page} / ${s.pageCount}
                      </span>
                      <button
                        class="btn"
                        type="button"
                        ?disabled=${s.page>=s.pageCount}
                        @click=${()=>this._setRecordingsPage(s.page+1)}
                      >
                        Next
                      </button>
                    </div>
                  `:W}
            `:H`<p class="empty">No detection recordings yet.</p>`}
      </section>
    `}_renderSession(e,t=!1){const s=e.started?new Date(e.started).toLocaleString():"—",i=zt(this.hass,e.trigger_sensors||[]),a=Pt(Nt(e)),r=this._playback?.session?.session_id===e.session_id,n=Ot(e);return H`
      <div
        class="recording-item ${e.active?"active":""} ${r?"selected":""}"
      >
        <button
          type="button"
          class="recording-select"
          ?disabled=${!n}
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
            ?disabled=${!n}
            @click=${t=>this._playSavedDetection(e,t)}
          >
            Play
          </button>
          ${t?H`
                <button
                  type="button"
                  class="btn recording-delete"
                  title=${e.active?"Stop and delete this in-progress recording":"Delete recordings for all users"}
                  @click=${t=>this._deleteSession(e.session_id,t,e)}
                >
                  Delete
                </button>
              `:W}
        </div>
      </div>
    `}_pickerRows(e){const t=new Map(e.map(e=>[e.entityId,e])),s=this._zones||[],i=yt(s,this._selectedZoneId),a=i?new Set(i.group_ids||[]):null,r=new Set,n=[];for(const e of this._streamGroups||[]){if(a&&!a.has(e.id))continue;for(const t of e.members||[])r.add(t);const s=(e.members||[]).map(e=>t.get(e)||me(e,this.hass?.states?.[e])).filter(Boolean);if(!s.length)continue;const i=this._visibleIds.find(t=>e.members.includes(t))||null;n.push({type:"group",group:e,members:s,selectedId:i})}if(!s.length)for(const t of e)r.has(t.entityId)||(r.add(t.entityId),n.push({type:"camera",cam:t}));return n}_renderZoneTabs(){const e=this._zones||[];return e.length?H`
      <div class="zone-pages zone-pages-mosaic" role="tablist" aria-label="Zones">
        ${e.map(e=>H`
            <button
              type="button"
              class="btn zone-page ${e.id===this._selectedZoneId?"primary":""}"
              role="tab"
              aria-selected=${e.id===this._selectedZoneId}
              @click=${()=>this._selectZone(e.id)}
            >
              ${e.name}
            </button>
          `)}
      </div>
    `:W}_renderPicker(e,t){if(!e.length)return H`<p class="empty">No camera entities found.</p>`;const s=this._isAdmin(),i=this._zones||[],a=this._pickerRows(e);return H`
      <section class="picker" aria-label="Camera selection">
        <div class="picker-head">
          <strong>Choose cameras</strong>
          <span class="hint">
            Select 1–${t} groups for this mosaic. Selecting a group defaults to
            <strong>high-resolution</strong> stream and <strong>balanced</strong> quality.
            Zones and groups are shared; ${s?"admins configure them below.":"only admins can create or edit groups/zones."}
          </span>
        </div>

        ${i.length?this._renderZoneTabs():H`<p class="hint">No zones yet${s?" — create zones below to organize groups.":"."}</p>`}

        <div class="picker-list">
          ${a.length?a.map(e=>{if("group"===e.type){const s=e.selectedId,i=Boolean(s),a=!i&&this._visibleIds.length>=t,r=s||Fe(e.group.members)||e.members[0]?.entityId||"",n=r?this._qualityFor(r):"balanced",o=r?lt(this._forceAspectLabel(r)):"auto",c=r?this._linksFor(r).length:0;return H`
                    <div class="picker-item picker-group ${a?"disabled":""}">
                      <label class="picker-group-main">
                        <input
                          type="checkbox"
                          .checked=${i}
                          ?disabled=${a&&!i}
                          @change=${t=>this._toggleGroupForMosaic(e.group,t.target.checked)}
                        />
                        <span class="picker-name">
                          ${e.group.name}
                          <span class="group-badge">${e.members.length} streams</span>
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
                            @change=${e=>this._setPreferredStream(s||r,e.target.value)}
                          >
                            ${e.members.map(e=>H`<option
                                  value=${e.entityId}
                                  ?selected=${e.entityId===r}
                                >
                                  ${e.name||e.entityId}
                                </option>`)}
                          </select>
                        </label>
                        <label>
                          Quality
                          <select
                            ?disabled=${!i||this._saving}
                            @change=${e=>this._setPickerQuality(r,e.target.value)}
                          >
                            ${Ue.map(e=>H`<option
                                  value=${e.value}
                                  ?selected=${e.value===n}
                                >
                                  ${e.label}
                                </option>`)}
                          </select>
                        </label>
                        <label>
                          Aspect
                          <select
                            ?disabled=${!i||this._saving}
                            @change=${e=>this._setPickerForceAspect(r,e.target.value)}
                          >
                            ${at.map(e=>H`<option
                                  value=${e.value}
                                  ?selected=${e.value===o}
                                >
                                  ${e.label}
                                </option>`)}
                          </select>
                        </label>
                      </div>
                    </div>
                  `}const s=e.cam,i=this._visibleIds.includes(s.entityId),a=!i&&this._visibleIds.length>=t,r=this._linksFor(s.entityId).length,n=this._qualityFor(s.entityId),o=lt(this._forceAspectLabel(s.entityId));return H`
                  <div class="picker-item ${a?"disabled":""}">
                    <label class="picker-group-main">
                      <input
                        type="checkbox"
                        .checked=${i}
                        ?disabled=${a}
                        @change=${e=>this._toggleVisible(s.entityId,e.target.checked)}
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
                          @change=${e=>this._setPickerQuality(s.entityId,e.target.value)}
                        >
                          ${Ue.map(e=>H`<option
                                value=${e.value}
                                ?selected=${e.value===n}
                              >
                                ${e.label}
                              </option>`)}
                        </select>
                      </label>
                      <label>
                        Aspect
                        <select
                          ?disabled=${!i||this._saving}
                          @change=${e=>this._setPickerForceAspect(s.entityId,e.target.value)}
                        >
                          ${at.map(e=>H`<option
                                value=${e.value}
                                ?selected=${e.value===o}
                              >
                                ${e.label}
                              </option>`)}
                        </select>
                      </label>
                    </div>
                  </div>
                `}):H`<p class="empty">No camera groups in this zone.</p>`}
        </div>

        ${s?this._renderAdminGroupsZones(e):W}
      </section>
    `}_renderAdminGroupsZones(e){const t=new Set;for(const e of this._streamGroups||[])for(const s of e.members||[])t.add(s);const s=new Set(this._groupDraftMembers||[]);for(const e of s)t.delete(e);return H`
      <div class="admin-structure">
        <div class="recording-toolbar">
          <button
            class="btn"
            type="button"
            @click=${()=>{this._manageGroupsOpen=!this._manageGroupsOpen,this._manageGroupsOpen&&!this._groupDraftMembers.length&&this._beginNewGroupDraft()}}
          >
            ${this._manageGroupsOpen?"Hide groups":"Manage groups"}
          </button>
          <button
            class="btn"
            type="button"
            @click=${()=>{this._manageZonesOpen=!this._manageZonesOpen,this._manageZonesOpen&&!this._zoneDraftName&&this._beginNewZoneDraft()}}
          >
            ${this._manageZonesOpen?"Hide zones":"Manage zones"}
          </button>
        </div>

        ${this._manageGroupsOpen?H`
              <section class="sensor-settings" aria-label="Manage camera groups">
                <div class="picker-head">
                  <strong>Camera groups</strong>
                  <span class="hint">Admin only · shared for all users. Combine streams into one physical camera.</span>
                </div>
                <div class="picker-list">
                  ${(this._streamGroups||[]).map(e=>H`
                      <div class="picker-item">
                        <span class="picker-name">${e.name}</span>
                        <span class="picker-id">${e.members.join(", ")}</span>
                        <div class="recording-actions">
                          <button class="btn" type="button" @click=${()=>this._editGroupDraft(e)}>
                            Edit
                          </button>
                          <button
                            class="btn recording-delete"
                            type="button"
                            ?disabled=${this._saving}
                            @click=${()=>this._persistStreamGroups(We(this._streamGroups,e.id))}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    `)}
                </div>
                <div class="quality-row">
                  <label>
                    Group name
                    <input
                      type="text"
                      class="aspect-input"
                      placeholder="Driveway"
                      .value=${this._groupDraftName||""}
                      @input=${e=>this._groupDraftName=e.target.value}
                    />
                  </label>
                  <button class="btn" type="button" @click=${()=>this._beginNewGroupDraft()}>
                    New group
                  </button>
                </div>
                <div class="sensor-candidates">
                  <p class="hint">Streams in this group</p>
                  ${e.map(e=>{const i=s.has(e.entityId),a=t.has(e.entityId)&&!i;return H`
                      <label class="sensor-item ${a?"disabled":""}">
                        <input
                          type="checkbox"
                          .checked=${i}
                          ?disabled=${a||this._saving}
                          @change=${t=>this._toggleManageGroupMember(e.entityId,t.target.checked)}
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
                    @click=${()=>this._saveGroupDraft()}
                  >
                    ${this._saving?"Saving…":"Save group"}
                  </button>
                  ${this._groupDraftMembers?.[0]?H`
                        <button
                          class="btn"
                          type="button"
                          ?disabled=${this._saving}
                          @click=${()=>this._suggestGroupFromDevice(this._groupDraftMembers[0])}
                        >
                          Suggest from device
                        </button>
                      `:W}
                </div>
              </section>
            `:W}

        ${this._manageZonesOpen?H`
              <section class="sensor-settings" aria-label="Manage zones">
                <div class="picker-head">
                  <strong>Zones</strong>
                  <span class="hint">Admin only · shared. Assign camera groups to a zone; users switch zones above.</span>
                </div>
                <div class="picker-list">
                  ${(this._zones||[]).map(e=>H`
                      <div class="picker-item">
                        <span class="picker-name">${e.name}</span>
                        <span class="picker-id">${(e.group_ids||[]).length} group(s)</span>
                        <div class="recording-actions">
                          <button class="btn" type="button" @click=${()=>this._editZoneDraft(e)}>
                            Edit
                          </button>
                          <button
                            class="btn recording-delete"
                            type="button"
                            ?disabled=${this._saving}
                            @click=${()=>this._persistZones(function(e,t,s=null,i=null){const a=String(t||"");return ft((e||[]).filter(e=>e.id!==a),s,i)}(this._zones,e.id,this._streamGroups,this._maxCamerasPerZone))}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    `)}
                </div>
                <div class="quality-row">
                  <label>
                    Zone name
                    <input
                      type="text"
                      class="aspect-input"
                      placeholder="Front"
                      .value=${this._zoneDraftName||""}
                      @input=${e=>this._zoneDraftName=e.target.value}
                    />
                  </label>
                  <button class="btn" type="button" @click=${()=>this._beginNewZoneDraft()}>
                    New zone
                  </button>
                </div>
                <div class="sensor-candidates">
                  <p class="hint">
                    Groups in this zone (max ${this._mosaicLimit()})
                  </p>
                  ${(this._streamGroups||[]).map(e=>{const t=(this._zoneDraftGroupIds||[]).includes(e.id),s=!t&&(this._zoneDraftGroupIds||[]).length>=this._mosaicLimit();return H`
                      <label class="sensor-item ${s?"disabled":""}">
                        <input
                          type="checkbox"
                          .checked=${t}
                          ?disabled=${this._saving||s}
                          @change=${t=>this._toggleZoneDraftGroup(e.id,t.target.checked)}
                        />
                        <span class="sensor-name">${e.name}</span>
                        <span class="picker-id">${e.id}</span>
                      </label>
                    `})}
                </div>
                <div class="sensor-tools">
                  <button
                    class="btn primary"
                    type="button"
                    ?disabled=${this._saving}
                    @click=${()=>this._saveZoneDraft()}
                  >
                    ${this._saving?"Saving…":"Save zone"}
                  </button>
                </div>
              </section>
            `:W}
      </div>
    `}_renderLayout(e,t=!0){const s=this._mosaicLimit();if(!e.length)return H`
        <p class="empty">
          Select cameras above to start streaming.
          One camera fills the view; two to ${s} split the screen
          (max ${s}).
        </p>
      `;const i=e.slice(0,s);if(!this._isDesktop){const e=i.length;return H`
        <div class="layout layout-${e}" role="list">
          ${i.map(e=>this._renderLayoutTile(e,!1,t))}
        </div>
      `}const a=this._tvMode&&this._tvStage?.width>=8&&this._tvStage?.height>=8?`width:${this._tvStage.width}px;height:${this._tvStage.height}px;max-width:100%;aspect-ratio:16/9;`:this._tvMode?"width:100%;max-width:100%;aspect-ratio:16/9;":W,r=this._tvMode&&i.length<=2?"layout-pack-maximize":"";return H`
      <div
        class="layout layout-pack ${this._tvMode?"layout-pack-tv":""} ${r}"
        role="list"
        style=${a}
        @cctv-media-aspect=${this._onMediaAspect}
      >
        ${i.map(e=>this._renderLayoutTile(e,!0,t))}
      </div>
    `}_renderLayoutTile(e,t,s=!0){const i=this._qualityFor(e.entityId),a=Oe(this._streamGroups,e.entityId),r=qe(e.entityId,a),n=this._linksFor(e.entityId).length,o=t?this._packStyles?.[e.entityId]:"",c=Boolean(t&&o),l=Boolean(this._playback?.playing),d=Boolean(l&&this._playback?.paused),h=l?this._trackForCamera(e.entityId):null,u=h?this._currentPlaybackItem(h):null,p=ot(this._forceAspectLabel(e.entityId)),m=this._tvMode&&this._tvFocusId===e.entityId&&this._visibleIds.length>=3,_=l&&this._playback?.triggerHighlights?this._playback.triggerHighlights[e.entityId]:null,g=!c&&p?`aspect-ratio:${p}; width:100%;`:W,f=()=>this._tvMode?this._onTvTileActivate(e.entityId):this._openDetail(e.entityId);return H`
      <article
        class="tile layout-tile ${c?"pack-tile":""} ${m?"tv-hero":""} ${this._tvMode&&!l?"tv-focusable":""}"
        role="listitem"
        style=${c?o:W}
      >
        <div
          class="tile-media"
          style=${g}
          @click=${this._tvMode&&!l?f:W}
        >
          ${l?u?"snapshot"===u.kind?de(`${this._playbackMountGen}:${e.entityId}:snap:${u.url}`,H`<img
                      class="playback-media"
                      alt=""
                      src=${u.url}
                      @load=${t=>this._onPlaybackMediaSize(e.entityId,t.target.naturalWidth,t.target.naturalHeight)}
                    />`):de(`${this._playbackMountGen}:${e.entityId}:vid:${u.url}`,H`
                      <video
                        class="playback-media"
                        data-camera=${e.entityId}
                        src=${u.url}
                        ?autoplay=${!d}
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
                    `):H`<div class="playback-empty">No recording for this camera</div>`:de(`${this._liveMountGen}:${e.entityId}`,H`
                  <cctv-stream-player
                    large
                    mosaic
                    eager
                    .active=${s}
                    .hass=${this.hass}
                    .camera=${e}
                    .config=${this.config}
                    .quality=${i}
                    .groupMembers=${a}
                    .failoverEntityIds=${r}
                    context="mosaic"
                    muted
                    @cctv-stream-failover=${e=>{const t=e?.detail?.to;t&&(this._status=`Live failover → ${t.replace(/^camera\./,"")}`)}}
                  ></cctv-stream-player>
                `)}
          ${_?H`<div
                class="trigger-cam-overlay kind-${_.kindId}"
                style=${`--cctv-trigger-color:${_.color}`}
                aria-hidden="true"
              ></div>`:W}
        </div>
        ${l?H`
              <div class="tile-body ${t?"pack-caption":""}">
                <p class="tile-title">${e.name}</p>
                <p class="tile-meta">${d?"Paused":"Playback"}</p>
              </div>
            `:H`
              <button
                type="button"
                class="tile-body tile-open ${t?"pack-caption":""}"
                @click=${f}
              >
                <p class="tile-title">${e.name}</p>
                <p class="tile-meta">
                  <span class="dot ${e.state}"></span>${e.state} · ${i}
                  ${n?H` · ${n} detection`:W}
                  ${m?H` · focus`:W}
                </p>
              </button>
            `}
      </article>
    `}_renderCardGrid(e){return e.length?H`
      <div class="grid" role="list">
        ${e.map(e=>{const t=this._qualityFor(e.entityId);return H`
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
    `:H`<p class="empty">No camera entities found.</p>`}_renderDetail(e,t=!0){const s=be(this.hass,e),i=this._qualityFor(e.entityId),a=tt(this.hass,e,this.config,i,"detail"),r=lt(this._forceAspectLabel(e.entityId)),n=this.panelMode&&("custom"===r||Boolean(this._customAspectDraft)),o=this._customAspectDraft||("custom"===r?this._forceAspectLabel(e.entityId):""),c=this._groupFor(e.entityId),l=this._groupMembers(e.entityId);return H`
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
          .groupMembers=${l}
          .failoverEntityIds=${qe(e.entityId,l)}
          context="detail"
          .muted=${!1}
          controls
        ></cctv-stream-player>
      </div>
      ${c?H`
            <div class="quality-row">
              <label>
                Live stream
                <select
                  @change=${t=>{const s=t.target.value;this._setPreferredStream(e.entityId,s),this._detailId=s,this._syncGroupDraftFromCamera(s)}}
                >
                  ${c.members.map(t=>{const s=this._cameras().find(e=>e.entityId===t)||me(t,this.hass?.states?.[t]);return H`<option
                      value=${t}
                      ?selected=${t===e.entityId}
                    >
                      ${s?.name||t}
                    </option>`})}
                </select>
              </label>
              <span class="hint">Physical group: ${c.name}</span>
            </div>
          `:W}
      <div class="quality-row">
        <label>
          Stream quality
          <select
            @change=${t=>this._setQuality(e.entityId,t.target.value)}
          >
            ${Ue.map(e=>H`<option
                  value=${e.value}
                  ?selected=${e.value===i}
                >
                  ${e.label}
                </option>`)}
          </select>
        </label>
        <span class="hint">${st(i)}</span>
      </div>
      ${this.panelMode?H`
            <div class="quality-row">
              <label>
                Force aspect ratio
                <select
                  @change=${t=>this._setForceAspect(e.entityId,t.target.value)}
                >
                  ${at.map(e=>H`<option
                        value=${e.value}
                        ?selected=${e.value===r}
                      >
                        ${e.label}
                      </option>`)}
                </select>
              </label>
              <span class="hint">Shared for all users.</span>
            </div>
            ${n?H`
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
                `:W}
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
          `:W}
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
        ${s.length?s.map(t=>H`
                <button
                  class="btn primary"
                  type="button"
                  @click=${()=>this._run(t.service,e.entityId)}
                >
                  ${t.label}
                </button>
              `):H`<span class="placeholder">No camera services available</span>`}
        <button
          class="btn"
          type="button"
          @click=${()=>ve(this,e.entityId)}
        >
          More info
        </button>
      </div>
      ${this.panelMode?this._renderSensorSettings(e):W}
    `}_renderSensorSettings(e){const t=this._linksFor(e.entityId),s=function(e,t){const s=e?.states||{};return(t||[]).map(String).filter(e=>$e.has(e.split(".")[0])).map(e=>{const t=s[e];return{entityId:e,name:t?.attributes?.friendly_name||e,kind:Ae(e,t),state:String(t?.state??"unknown"),active:Ce(t),missing:!t}})}(this.hass,t),i=this._groupFor(e.entityId),a=Ie(this.hass,e.entityId,{deviceIds:this._deviceMap,limit:12}).filter(e=>!t.includes(e.entityId)),r=this._sensorFilter.trim().toLowerCase(),n=r?function(e){const t=e?.states||{};return Object.entries(t).filter(([e,t])=>{const s=e.split(".")[0];return!!$e.has(s)&&("other"!==Ae(e,t).id||/detection|object|zone|occupancy|motion/i.test(e))}).map(([e,t])=>({entityId:e,name:t?.attributes?.friendly_name||e,kind:Ae(e,t),state:String(t?.state??"unknown"),active:Ce(t)})).sort((e,t)=>e.name.localeCompare(t.name,void 0,{sensitivity:"base"}))}(this.hass).filter(e=>!t.includes(e.entityId)).filter(e=>e.entityId.toLowerCase().includes(r)||e.name.toLowerCase().includes(r)||e.kind.label.toLowerCase().includes(r)).slice(0,40):a;return H`
      <section class="sensor-settings" aria-label="Detection sensors">
        <div class="picker-head">
          <strong>Detection sensors</strong>
          <span class="hint">
            Link person / car / animal / package sensors for the timeline and recordings.
            Associations are <strong>shared for all Home Assistant users</strong> (site-wide).
            ${i?H` Assigned once for physical camera <strong>${i.name}</strong> (${i.members.length} streams). Manage groups under <strong>Cameras &amp; zones</strong>. `:H` Group streams under <strong>Cameras &amp; zones</strong> (admins) to share sensors. `}
            Suggestions use name + device heuristics; confirm or pick manually.
          </span>
        </div>

        ${s.length?H`
              <div class="sensor-linked">
                ${s.map(t=>H`
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
            `:H`<p class="empty">No sensors linked to this camera yet.</p>`}

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

        ${n.length?H`
              <div class="sensor-candidates">
                <p class="hint">
                  ${r?"Matching sensors":"Suggested associations"}
                </p>
                ${n.map(t=>H`
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
            `:r?H`<p class="empty">No sensors match “${r}”.</p>`:H`
                <p class="hint">
                  No strong suggestions. Search above to link any binary_sensor/sensor
                  (${we.map(e=>e.label).join(", ")}).
                </p>
              `}
      </section>
    `}}customElements.get("cctv-view")||customElements.define("cctv-view",ss);class is extends ne{static properties={hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1}};constructor(){super(),this._stableConfig=null,this._stablePanelConfigRef=null}createRenderRoot(){return this}get _config(){const e=this.panel?.config||{};if(e===this._stablePanelConfigRef&&this._stableConfig)return this._stableConfig;this._stablePanelConfigRef=e;const{_panel_custom:t,...s}=e;return this._stableConfig={title:"CCTV",max_streams:4,quality:"auto",...s},this._stableConfig}connectedCallback(){super.connectedCallback(),this.style.display="block",this.style.height="100%"}disconnectedCallback(){super.disconnectedCallback();const e=this.querySelector?.("cctv-view");if(e)try{e._setPanelActive?.(!1)}catch{}}render(){return H`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        .panelUrlPath=${this.panel?.url_path||"cctv"}
        panel-mode
      ></cctv-view>
    `}}customElements.get("cctv-dashboard-panel")||customElements.define("cctv-dashboard-panel",is);class as extends ne{static properties={hass:{attribute:!1},_config:{attribute:!1}};static styles=he;static getConfigElement(){return null}static getStubConfig(e){const t=Object.keys(e?.states??{}).filter(e=>e.startsWith("camera.")).slice(0,4);return{title:"CCTV",max_streams:4,quality:"auto",...t.length?{cameras:t}:{}}}setConfig(e){if(!e||"object"!=typeof e||Array.isArray(e))throw new Error("Card configuration must be an object");this._config={title:"CCTV",max_streams:4,quality:"auto",...e}}getCardSize(){const e=this._config?.cameras?.length;return e?Math.max(3,2*Math.ceil(e/2)):6}render(){return this._config?H`
      <ha-card>
        <div class="card-inner">
          <cctv-view .hass=${this.hass} .config=${this._config}></cctv-view>
        </div>
      </ha-card>
    `:H``}}customElements.get("cctv-cameras-card")||customElements.define("cctv-cameras-card",as),window.customCards=window.customCards||[],window.customCards.some(e=>"cctv-cameras-card"===e.type)||window.customCards.push({type:"cctv-cameras-card",name:"CCTV Cameras",preview:!0,description:"Live stream grid of Home Assistant camera entities with detail view and basic controls.",documentationURL:"https://github.com/davies1995/HA-CCTV"});class rs extends ne{static properties={hass:{attribute:!1},_config:{attribute:!1},_status:{state:!0},_qualityTick:{state:!0}};static styles=he;static getStubConfig(e){return{entity:Object.keys(e?.states??{}).find(e=>e.startsWith("camera."))||"camera.demo",title:"",muted:!0,quality:"auto"}}constructor(){super(),this._status="",this._qualityTick=0}setConfig(e){if(!e||"object"!=typeof e||Array.isArray(e))throw new Error("Card configuration must be an object");if(!e.entity||!String(e.entity).startsWith("camera."))throw new Error("cctv-camera-card requires a camera.* entity");this._config={muted:!0,quality:"auto",max_streams:4,...e,entity:String(e.entity)}}getCardSize(){return 4}_setQuality(e){Ye(this._config.entity,e),this._qualityTick+=1}async _run(e){this._status=`Calling ${e}…`;try{await ye(this.hass,e,this._config.entity),this._status=`${e} ok`}catch(e){this._status=e?.message||String(e)}}render(){if(!this._config||!this.hass)return H``;this._qualityTick;const e=this.hass.states?.[this._config.entity],t=me(this._config.entity,e),s=this._config.title||t.name,i=be(this.hass,t),a=et(this._config,this._config.entity),r=tt(this.hass,t,this._config,a,"detail");return H`
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
                ${Ue.map(e=>H`<option value=${e.value}>${e.label}</option>`)}
              </select>
            </label>
            <span class="hint">${st(a)} · using ${r.entityId}</span>
          </div>
          <div class="actions" style="margin-top: 0.75rem">
            ${i.map(e=>H`
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
              @click=${()=>ve(this,this._config.entity)}
            >
              More info
            </button>
          </div>
        </div>
      </ha-card>
    `}}customElements.get("cctv-camera-card")||customElements.define("cctv-camera-card",rs),window.customCards=window.customCards||[],window.customCards.some(e=>"cctv-camera-card"===e.type)||window.customCards.push({type:"cctv-camera-card",name:"CCTV Camera",preview:!0,description:"Live stream for a single Home Assistant camera entity.",documentationURL:"https://github.com/davies1995/HA-CCTV"});const ns="0.21.1";console.info(`%c CCTV-DASHBOARD %c ${ns} `,"color: #fff; background: #1b6ea8; font-weight: 700;","color: #1b6ea8; background: #fff; font-weight: 700;");export{ns as VERSION};
