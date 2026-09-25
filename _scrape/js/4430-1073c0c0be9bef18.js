"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4430],{3648:(e,t,i)=>{i.d(t,{_:()=>a});function a(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}},5379:(e,t,i)=>{i.d(t,{D:()=>d,N:()=>u});var a=i(12115),r=(e,t,i,a,r,s,n,o)=>{let l=document.documentElement,d=["light","dark"];function u(t){var i;(Array.isArray(e)?e:[e]).forEach(e=>{let i="class"===e,a=i&&s?r.map(e=>s[e]||e):r;i?(l.classList.remove(...a),l.classList.add(s&&s[t]?s[t]:t)):l.setAttribute(e,t)}),i=t,o&&d.includes(i)&&(l.style.colorScheme=i)}if(a)u(a);else try{let e=localStorage.getItem(t)||i,a=n&&"system"===e?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e;u(a)}catch(e){}},s=["light","dark"],n="(prefers-color-scheme: dark)",o=a.createContext(void 0),l={setTheme:e=>{},themes:[]},d=()=>{var e;return null!=(e=a.useContext(o))?e:l},u=e=>a.useContext(o)?a.createElement(a.Fragment,null,e.children):a.createElement(c,{...e}),h=["light","dark"],c=e=>{let{forcedTheme:t,disableTransitionOnChange:i=!1,enableSystem:r=!0,enableColorScheme:l=!0,storageKey:d="theme",themes:u=h,defaultTheme:c=r?"system":"light",attribute:b="data-theme",value:g,children:f,nonce:A,scriptProps:_}=e,[T,y]=a.useState(()=>p(d,c)),[I,w]=a.useState(()=>"system"===T?v():T),S=g?Object.values(g):u,k=a.useCallback(e=>{let t=e;if(!t)return;"system"===e&&r&&(t=v());let a=g?g[t]:t,n=i?E(A):null,o=document.documentElement,d=e=>{"class"===e?(o.classList.remove(...S),a&&o.classList.add(a)):e.startsWith("data-")&&(a?o.setAttribute(e,a):o.removeAttribute(e))};if(Array.isArray(b)?b.forEach(d):d(b),l){let e=s.includes(c)?c:null,i=s.includes(t)?t:e;o.style.colorScheme=i}null==n||n()},[A]),L=a.useCallback(e=>{let t="function"==typeof e?e(T):e;y(t);try{localStorage.setItem(d,t)}catch(e){}},[T]),M=a.useCallback(e=>{w(v(e)),"system"===T&&r&&!t&&k("system")},[T,t]);a.useEffect(()=>{let e=window.matchMedia(n);return e.addListener(M),M(e),()=>e.removeListener(M)},[M]),a.useEffect(()=>{let e=e=>{e.key===d&&(e.newValue?y(e.newValue):L(c))};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[L]),a.useEffect(()=>{k(null!=t?t:T)},[t,T]);let R=a.useMemo(()=>({theme:T,setTheme:L,forcedTheme:t,resolvedTheme:"system"===T?I:T,themes:r?[...u,"system"]:u,systemTheme:r?I:void 0}),[T,L,t,I,r,u]);return a.createElement(o.Provider,{value:R},a.createElement(m,{forcedTheme:t,storageKey:d,attribute:b,enableSystem:r,enableColorScheme:l,defaultTheme:c,value:g,themes:u,nonce:A,scriptProps:_}),f)},m=a.memo(e=>{let{forcedTheme:t,storageKey:i,attribute:s,enableSystem:n,enableColorScheme:o,defaultTheme:l,value:d,themes:u,nonce:h,scriptProps:c}=e,m=JSON.stringify([s,i,l,t,u,d,n,o]).slice(1,-1);return a.createElement("script",{...c,suppressHydrationWarning:!0,nonce:"",dangerouslySetInnerHTML:{__html:"(".concat(r.toString(),")(").concat(m,")")}})}),p=(e,t)=>{let i;try{i=localStorage.getItem(e)||void 0}catch(e){}return i||t},E=e=>{let t=document.createElement("style");return e&&t.setAttribute("nonce",e),t.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(t),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(t)},1)}},v=e=>(e||(e=window.matchMedia(n)),e.matches?"dark":"light")},26497:(e,t,i)=>{i.d(t,{N:()=>f});var a=i(95155),r=i(12115),s=i(60296),n=i(94416),o=i(86553),l=i(59686),d=i(81402),u=i(53127);function h(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class c extends r.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=t.offsetParent,i=(0,d.s)(e)&&e.offsetWidth||0,a=this.props.sizeRef.current;a.height=t.offsetHeight||0,a.width=t.offsetWidth||0,a.top=t.offsetTop,a.left=t.offsetLeft,a.right=i-a.width-a.left}return null}componentDidUpdate(){}render(){return this.props.children}}function m(e){let{children:t,isPresent:i,anchorX:s,root:n}=e,o=(0,r.useId)(),l=(0,r.useRef)(null),d=(0,r.useRef)({width:0,height:0,top:0,left:0,right:0}),{nonce:m}=(0,r.useContext)(u.Q),p=function(...e){return r.useCallback(function(...e){return t=>{let i=!1,a=e.map(e=>{let a=h(e,t);return i||"function"!=typeof a||(i=!0),a});if(i)return()=>{for(let t=0;t<a.length;t++){let i=a[t];"function"==typeof i?i():h(e[t],null)}}}}(...e),e)}(l,null==t?void 0:t.ref);return(0,r.useInsertionEffect)(()=>{let{width:e,height:t,top:a,left:r,right:u}=d.current;if(i||!l.current||!e||!t)return;l.current.dataset.motionPopId=o;let h=document.createElement("style");m&&(h.nonce=m);let c=null!=n?n:document.head;return c.appendChild(h),h.sheet&&h.sheet.insertRule('\n          [data-motion-pop-id="'.concat(o,'"] {\n            position: absolute !important;\n            width: ').concat(e,"px !important;\n            height: ").concat(t,"px !important;\n            ").concat("left"===s?"left: ".concat(r):"right: ".concat(u),"px !important;\n            top: ").concat(a,"px !important;\n          }\n        ")),()=>{c.contains(h)&&c.removeChild(h)}},[i]),(0,a.jsx)(c,{isPresent:i,childRef:l,sizeRef:d,children:r.cloneElement(t,{ref:p})})}let p=e=>{let{children:t,initial:i,isPresent:s,onExitComplete:o,custom:d,presenceAffectsLayout:u,mode:h,anchorX:c,root:p}=e,v=(0,n.M)(E),b=(0,r.useId)(),g=!0,f=(0,r.useMemo)(()=>(g=!1,{id:b,initial:i,isPresent:s,custom:d,onExitComplete:e=>{for(let t of(v.set(e,!0),v.values()))if(!t)return;o&&o()},register:e=>(v.set(e,!1),()=>v.delete(e))}),[s,v,o]);return u&&g&&(f={...f}),(0,r.useMemo)(()=>{v.forEach((e,t)=>v.set(t,!1))},[s]),r.useEffect(()=>{s||v.size||!o||o()},[s]),"popLayout"===h&&(t=(0,a.jsx)(m,{isPresent:s,anchorX:c,root:p,children:t})),(0,a.jsx)(l.t.Provider,{value:f,children:t})};function E(){return new Map}var v=i(75601);let b=e=>e.key||"";function g(e){let t=[];return r.Children.forEach(e,e=>{(0,r.isValidElement)(e)&&t.push(e)}),t}let f=e=>{let{children:t,custom:i,initial:l=!0,onExitComplete:d,presenceAffectsLayout:u=!0,mode:h="sync",propagate:c=!1,anchorX:m="left",root:E}=e,[f,A]=(0,v.xQ)(c),_=(0,r.useMemo)(()=>g(t),[t]),T=c&&!f?[]:_.map(b),y=(0,r.useRef)(!0),I=(0,r.useRef)(_),w=(0,n.M)(()=>new Map),[S,k]=(0,r.useState)(_),[L,M]=(0,r.useState)(_);(0,o.E)(()=>{y.current=!1,I.current=_;for(let e=0;e<L.length;e++){let t=b(L[e]);T.includes(t)?w.delete(t):!0!==w.get(t)&&w.set(t,!1)}},[L,T.length,T.join("-")]);let R=[];if(_!==S){let e=[..._];for(let t=0;t<L.length;t++){let i=L[t],a=b(i);T.includes(a)||(e.splice(t,0,i),R.push(i))}return"wait"===h&&R.length&&(e=R),M(g(e)),k(_),null}let{forceRender:D}=(0,r.useContext)(s.L);return(0,a.jsx)(a.Fragment,{children:L.map(e=>{let t=b(e),r=(!c||!!f)&&(_===L||T.includes(t));return(0,a.jsx)(p,{isPresent:r,initial:(!y.current||!!l)&&void 0,custom:i,presenceAffectsLayout:u,mode:h,root:E,onExitComplete:r?void 0:()=>{if(!w.has(t))return;w.set(t,!0);let e=!0;w.forEach(t=>{t||(e=!1)}),e&&(null==D||D(),M(I.current),c&&(null==A||A()),d&&d())},anchorX:m,children:e},t)})})}},33327:(e,t,i)=>{i.d(t,{z:()=>h});var a=i(33182),r=i(49752),s=i(73934);function n(e){return"number"==typeof e?e:parseFloat(e)}var o=i(12115),l=i(53127),d=i(53350),u=i(68);function h(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{isStatic:i}=(0,o.useContext)(l.Q),h=()=>(0,a.S)(e)?e.get():e;if(i)return(0,u.G)(h);let c=(0,d.d)(h());return(0,o.useInsertionEffect)(()=>(function(e,t,i){let o,l=e.get(),d=null,u=l,h="string"==typeof l?l.replace(/[\d.-]/g,""):void 0,c=()=>{d&&(d.stop(),d=null)},m=()=>{c(),d=new r.s({keyframes:[n(e.get()),n(u)],velocity:e.getVelocity(),type:"spring",restDelta:.001,restSpeed:.01,...i,onUpdate:o})};if(e.attach((e,t)=>{u=e,o=e=>{var i,a;return t((i=e,(a=h)?i+a:i))},s.Gt.postRender(m)},c),(0,a.S)(t)){let i=t.on("change",t=>{var i,a;return e.set((i=t,(a=h)?i+a:i))}),a=e.on("destroy",i);return()=>{i(),a()}}return c})(c,e,t),[c,JSON.stringify(t)]),c}},56341:(e,t,i)=>{i.d(t,{A:()=>n});var a=i(12115);function r(){return(r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var a in i)({}).hasOwnProperty.call(i,a)&&(e[a]=i[a])}return e}).apply(null,arguments)}var s=["id","volume","playbackRate","soundEnabled","interrupt","onload"];let n=function(e,t){var n=void 0===t?{}:t,o=n.volume,l=void 0===o?1:o,d=n.playbackRate,u=void 0===d?1:d,h=n.soundEnabled,c=void 0===h||h,m=n.interrupt,p=void 0!==m&&m,E=n.onload,v=function(e,t){if(null==e)return{};var i={};for(var a in e)if(({}).hasOwnProperty.call(e,a)){if(-1!==t.indexOf(a))continue;i[a]=e[a]}return i}(n,s),b=a.useRef(null),g=a.useRef(!1),f=a.useState(null),A=f[0],_=f[1],T=a.useState(null),y=T[0],I=T[1],w=function(){"function"==typeof E&&E.call(this),g.current&&_(1e3*this.duration()),I(this)};(0,a.useEffect)(function(){return i.e(5366).then(i.t.bind(i,25366,23)).then(function(t){if(!g.current){var i;b.current=null!=(i=t.Howl)?i:t.default.Howl,g.current=!0,new b.current(r({src:Array.isArray(e)?e:[e],volume:l,rate:u,onload:w},v))}}),function(){g.current=!1}},[]),a.useEffect(function(){b.current&&y&&I(new b.current(r({src:Array.isArray(e)?e:[e],volume:l,onload:w},v)))},[JSON.stringify(e)]),a.useEffect(function(){y&&(y.volume(l),v.sprite||y.rate(u))},[y,l,u]);var S=a.useCallback(function(e){void 0===e&&(e={}),y&&(c||e.forceSoundEnabled)&&(p&&y.stop(),e.playbackRate&&y.rate(e.playbackRate),y.play(e.id))},[y,c,p]),k=a.useCallback(function(e){y&&y.stop(e)},[y]),L=a.useCallback(function(e){y&&y.pause(e)},[y]);return[S,{sound:y,stop:k,pause:L,duration:A}]}},60619:(e,t,i)=>{i.d(t,{E:()=>s});var a=i(33182),r=i(60938);function s(e){for(var t=arguments.length,i=Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s];let n=e.length;return(0,r.j)(i.filter(a.S),function(){let t="";for(let r=0;r<n;r++){t+=e[r];let s=i[r];s&&(t+=(0,a.S)(s)?s.get():s)}return t})}},69150:(e,t,i)=>{let a,r;i.d(t,{Ph:()=>sL,xX:()=>sk,aH:()=>sM,nN:()=>sR,td:()=>sD});var s,n,o,l,d,u,h,c,m,p,E,v,b,g,f,A,_,T,y,I,w,S,k,L,M,R,D,C,O,N,x,P,U,V,H,W,F,$,B,K,G,q,Q,Y,j,z,Z,X,J,ee,et,ei,ea,er,es,en,eo,el,ed,eu,eh,ec,em,ep,eE,ev,eb,eg,ef,eA,e_,eT,ey,eI,ew,eS,ek,eL,eM,eR,eD,eC,eO,eN,ex,eP,eU,eV,eH,eW,eF,e$,eB,eK,eG,eq,eQ,eY,ej,ez,eZ,eX,eJ,e0,e1,e2,e5,e3,e4,e7,e8,e6,e9,te,tt,ti,ta,tr,ts,tn,to,tl,td,tu,th,tc,tm,tp,tE,tv,tb,tg,tf,tA,t_,tT,ty,tI,tw,tS,tk=i(12115);let tL=new Set(["style","children","ref","key","suppressContentEditableWarning","suppressHydrationWarning","dangerouslySetInnerHTML"]),tM={className:"class",htmlFor:"for"};function tR(e){return e.toLowerCase()}function tD(e){return"boolean"==typeof e?e?"":void 0:"function"==typeof e?void 0:"object"!=typeof e||null===e?e:void 0}function tC({react:e,tagName:t,elementClass:i,events:a,displayName:r,defaultProps:s,toAttributeName:n=tR,toAttributeValue:o=tD}){let l=Number.parseInt(e.version)>=19,d=e.forwardRef((r,d)=>{let u=e.useRef(null),h=e.useRef(new Map),c={},m={},p={},E={};for(let[e,t]of Object.entries(r)){if(tL.has(e)){p[e]=t;continue}let a=n(tM[e]??e);if(i.prototype&&e in i.prototype&&!(e in(globalThis.HTMLElement?.prototype??{}))&&!i.observedAttributes?.some(e=>e===a)){E[e]=t;continue}if(e.startsWith("on")){c[e]=t;continue}let r=o(t);a&&null!=r&&(m[a]=String(r),l||(p[a]=r)),a&&l&&(r!==tD(t)?p[a]=r:p[a]=t)}if("undefined"!=typeof window){for(let t in c){let i=c[t],r=t.endsWith("Capture"),s=(a?.[t]??t.slice(2).toLowerCase()).slice(0,r?-7:void 0);e.useLayoutEffect(()=>{let e=u?.current;if(e&&"function"==typeof i)return e.addEventListener(s,i,r),()=>{e.removeEventListener(s,i,r)}},[u?.current,i])}e.useLayoutEffect(()=>{if(null===u.current)return;let e=new Map;for(let t in E)tO(u.current,t,E[t]),h.current.delete(t),e.set(t,E[t]);for(let[e,t]of h.current)tO(u.current,e,void 0);h.current=e})}if("undefined"==typeof window&&i?.getTemplateHTML&&i?.shadowRootOptions){let{mode:t,delegatesFocus:a}=i.shadowRootOptions;p.children=[e.createElement("template",{shadowrootmode:t,shadowrootdelegatesfocus:a,dangerouslySetInnerHTML:{__html:i.getTemplateHTML(m,r)},key:"ce-la-react-ssr-template-shadow-root"}),p.children]}return e.createElement(t,{...s,...p,ref:e.useCallback(e=>{u.current=e,"function"==typeof d?d(e):null!==d&&(d.current=e)},[d])},p.children)});return d.displayName=r??i.name,d}function tO(e,t,i){e[t]=i,null==i&&t in(globalThis.HTMLElement?.prototype??{})&&e.removeAttribute(t)}let tN={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},tx={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},tP={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},tU=Object.entries(tP),tV=tU.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{}),tH=tU.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"});Object.entries(tH).reduce((e,[t,i])=>{let a=tV[t];return a&&(e[i]=a),e},{userinactivechange:"userinactive"});let tW=Object.entries(tV).reduce((e,[t,i])=>{let a=tH[t];return a&&(e[i]=a),e},{userinactive:"userinactivechange"}),tF={SUBTITLES:"subtitles",CAPTIONS:"captions",CHAPTERS:"chapters",METADATA:"metadata"},t$={DISABLED:"disabled",SHOWING:"showing"},tB={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},tK={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},tG={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},tq={FULLSCREEN:"fullscreen"};function tQ(e){if(e){let{id:t,width:i,height:a}=e;return[t,i,a].filter(e=>null!=e).join(":")}}function tY(e){if(e){let{id:t,kind:i,language:a,label:r}=e;return[t,i,a,r].filter(e=>null!=e).join(":")}}function tj(e){return"number"==typeof e&&!Number.isNaN(e)&&Number.isFinite(e)}let tz=e=>new Promise(t=>setTimeout(t,e)),tZ=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],tX=e=>{if(!tj(e))return"";let t=Math.abs(e),i=t!==e,a=new Date(0,0,0,0,0,t,0),r=[a.getHours(),a.getMinutes(),a.getSeconds()].map((e,t)=>e&&((e,t)=>{let i=1===e?tZ[t].singular:tZ[t].plural;return`${e} ${i}`})(e,t)).filter(e=>e).join(", ");return`${r}${i?" remaining":""}`};function tJ(e,t){let i=!1;e<0&&(i=!0,e=0-e);let a=Math.floor((e=e<0?0:e)%60),r=Math.floor(e/60%60),s=Math.floor(e/3600),n=Math.floor(t/60%60),o=Math.floor(t/3600);return(isNaN(e)||e===1/0)&&(s=r=a="0"),r=(((s=s>0||o>0?s+":":"")||n>=10)&&r<10?"0"+r:r)+":",(i?"-":"")+s+r+(a=a<10?"0"+a:a)}Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});let t0={en:{"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it."}},t1=(null==(s=globalThis.navigator)?void 0:s.language)||"en",t2=(e,t={})=>(e=>{var t,i,a;let[r]=t1.split("-");return(null==(t=t0[t1])?void 0:t[e])||(null==(i=t0[r])?void 0:i[e])||(null==(a=t0.en)?void 0:a[e])||e})(e).replace(/\{(\w+)\}/g,(e,i)=>i in t?String(t[i]):`{${i}}`);class t5{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}class t3 extends t5{}class t4 extends t3{constructor(){super(...arguments),this.role=null}}class t7{observe(){}unobserve(){}disconnect(){}}let t8={createElement:function(){return new t6.HTMLElement},createElementNS:function(){return new t6.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent:e=>!1},t6={ResizeObserver:t7,document:t8,Node:t3,Element:t4,HTMLElement:class extends t4{constructor(){super(...arguments),this.innerHTML=""}get content(){return new t6.DocumentFragment}},DocumentFragment:class extends t5{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem:e=>null,setItem(e,t){},removeItem(e){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia:e=>({matches:!1,media:e}),DOMParser:class{parseFromString(e,t){return{body:{textContent:e}}}}},t9="global"in globalThis&&(null==globalThis?void 0:globalThis.global)===globalThis||"undefined"==typeof window||void 0===window.customElements,ie=Object.keys(t6).every(e=>e in globalThis),it=t9&&!ie?t6:globalThis,ii=t9&&!ie?t8:globalThis.document,ia=new WeakMap,ir=e=>{let t=ia.get(e);return t||ia.set(e,t=new Set),t},is=new it.ResizeObserver(e=>{for(let t of e)for(let e of ir(t.target))e(t)});function io(e,t){ir(e).add(t),is.observe(e)}function il(e,t){let i=ir(e);i.delete(t),i.size||is.unobserve(e)}function id(e){let t={};for(let i of e)t[i.name]=i.value;return t}let iu=(e,t,i=".value")=>{let a=e.querySelector(i);a&&(a.textContent=t)},ih=(e,t)=>((e,t)=>{let i=`slot[name="${t}"]`,a=e.shadowRoot.querySelector(i);return a?a.children:[]})(e,t)[0],ic=(e,t)=>!!e&&!!t&&(null!=e&&!!e.contains(t)||ic(e,t.getRootNode().host)),im=(e,t)=>{if(!e)return null;let i=e.closest(t);return i||im(e.getRootNode().host,t)};function ip(e,{depth:t=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(e.checkVisibility)return e.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=e;for(;r&&t>0;){let e=getComputedStyle(r);if(i&&"0"===e.opacity||a&&"hidden"===e.visibility||"none"===e.display)return!1;r=r.parentElement,t--}return!0}function iE(e,t){let i=function(e,t){var i,a;let r;for(r of null!=(i=e.querySelectorAll("style:not([media])"))?i:[]){let e;try{e=null==(a=r.sheet)?void 0:a.cssRules}catch{continue}for(let i of null!=e?e:[])if(t(i.selectorText))return i}}(e,e=>e===t);return i||iv(e,t)}function iv(e,t){var i,a;let r=null!=(i=e.querySelectorAll("style:not([media])"))?i:[],s=null==r?void 0:r[r.length-1];return(null==s?void 0:s.sheet)?(null==s||s.sheet.insertRule(`${t}{}`,s.sheet.cssRules.length),null==(a=s.sheet.cssRules)?void 0:a[s.sheet.cssRules.length-1]):(console.warn("Media Chrome: No style sheet found on style tag of",e),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}})}function ib(e,t,i=NaN){let a=e.getAttribute(t);return null!=a?+a:i}function ig(e,t,i){let a=+i;if(null==i||Number.isNaN(a)){e.hasAttribute(t)&&e.removeAttribute(t);return}ib(e,t,void 0)!==a&&e.setAttribute(t,`${a}`)}function iA(e,t){return e.hasAttribute(t)}function i_(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}iA(e,t)!=i&&e.toggleAttribute(t,i)}function iT(e,t,i=null){var a;return null!=(a=e.getAttribute(t))?a:i}function iy(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}let a=`${i}`;iT(e,t,void 0)!==a&&e.setAttribute(t,a)}var iI=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iw=(e,t,i)=>(iI(e,t,"read from private field"),i?i.call(e):t.get(e)),iS=(e,t,i,a)=>(iI(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class ik extends it.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,n,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tx.MEDIA_CONTROLLER,tV.MEDIA_PAUSED]}attributeChangedCallback(e,t,i){var a,r,s,o,l;e===tx.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=iw(this,n))?void 0:a.unassociateElement)||r.call(a,this),iS(this,n,null)),i&&this.isConnected&&(iS(this,n,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(l=null==(o=iw(this,n))?void 0:o.associateElement)||l.call(o,this)))}connectedCallback(){var e,t,i,a;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),iS(this,n,function(e){var t;let i=e.getAttribute(tx.MEDIA_CONTROLLER);return i?null==(t=e.getRootNode())?void 0:t.getElementById(i):im(e,"media-controller")}(this)),this.getAttribute(tx.MEDIA_CONTROLLER)&&(null==(t=null==(e=iw(this,n))?void 0:e.associateElement)||t.call(e,this)),null==(i=iw(this,n))||i.addEventListener("pointerdown",this),null==(a=iw(this,n))||a.addEventListener("click",this)}disconnectedCallback(){var e,t,i,a;this.getAttribute(tx.MEDIA_CONTROLLER)&&(null==(t=null==(e=iw(this,n))?void 0:e.unassociateElement)||t.call(e,this)),null==(i=iw(this,n))||i.removeEventListener("pointerdown",this),null==(a=iw(this,n))||a.removeEventListener("click",this),iS(this,n,null)}handleEvent(e){var t;let i=null==(t=e.composedPath())?void 0:t[0];if(["video","media-controller"].includes(null==i?void 0:i.localName)){if("pointerdown"===e.type)this._pointerType=e.pointerType;else if("click"===e.type){let{clientX:t,clientY:i}=e,{left:a,top:r,width:s,height:n}=this.getBoundingClientRect(),o=t-a,l=i-r;if(o<0||l<0||o>s||l>n||0===s&&0===n)return;let d=this._pointerType||"mouse";if(this._pointerType=void 0,d===tB.TOUCH)return void this.handleTap(e);if(d===tB.MOUSE||d===tB.PEN)return void this.handleMouseClick(e)}}}get mediaPaused(){return iA(this,tV.MEDIA_PAUSED)}set mediaPaused(e){i_(this,tV.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let t=this.mediaPaused?tN.MEDIA_PLAY_REQUEST:tN.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new it.CustomEvent(t,{composed:!0,bubbles:!0}))}}n=new WeakMap,ik.shadowRootOptions={mode:"open"},ik.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `},it.customElements.get("media-gesture-receiver")||it.customElements.define("media-gesture-receiver",ik);var iL=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iM=(e,t,i)=>(iL(e,t,"read from private field"),i?i.call(e):t.get(e)),iR=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iD=(e,t,i,a)=>(iL(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),iC=(e,t,i)=>(iL(e,t,"access private method"),i);let iO={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive",AUTOHIDE_OVER_CONTROLS:"autohideovercontrols"},iN=Object.values(tV);function ix(e,t){var i,a,r;if(!e.isConnected)return;let s=Object.fromEntries((null!=(i=e.getAttribute(iO.BREAKPOINTS))?i:"sm:384 md:576 lg:768 xl:960").split(/\s+/).map(e=>e.split(":"))),n=(a=s,r=t,Object.keys(a).filter(e=>r>=parseInt(a[e]))),o=!1;if(Object.keys(s).forEach(t=>{if(n.includes(t)){e.hasAttribute(`breakpoint${t}`)||(e.setAttribute(`breakpoint${t}`,""),o=!0);return}e.hasAttribute(`breakpoint${t}`)&&(e.removeAttribute(`breakpoint${t}`),o=!0)}),o){let t=new CustomEvent(tH.BREAKPOINTS_CHANGE,{detail:n});e.dispatchEvent(t)}e.breakpointsComputed||(e.breakpointsComputed=!0,e.dispatchEvent(new CustomEvent(tH.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}class iP extends it.HTMLElement{constructor(){if(super(),iR(this,c),iR(this,v),iR(this,g),iR(this,A),iR(this,T),iR(this,I),iR(this,o,0),iR(this,l,null),iR(this,d,null),iR(this,u,void 0),this.breakpointsComputed=!1,iR(this,h,new MutationObserver(iC(this,c,m).bind(this))),iR(this,p,!1),iR(this,E,e=>{iM(this,p)||(setTimeout(()=>{!function(e){ix(e.target,e.contentRect.width)}(e),iD(this,p,!1)},0),iD(this,p,!0))}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}let e=this.querySelector(":scope > slot[slot=media]");e&&e.addEventListener("slotchange",()=>{if(!e.assignedElements({flatten:!0}).length){iM(this,l)&&this.mediaUnsetCallback(iM(this,l));return}this.handleMediaUpdated(this.media)})}static get observedAttributes(){return[iO.AUTOHIDE,iO.GESTURES_DISABLED].concat(iN).filter(e=>![tV.MEDIA_RENDITION_LIST,tV.MEDIA_AUDIO_TRACK_LIST,tV.MEDIA_CHAPTERS_CUES,tV.MEDIA_WIDTH,tV.MEDIA_HEIGHT,tV.MEDIA_ERROR,tV.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,t,i){e.toLowerCase()==iO.AUTOHIDE&&(this.autohide=i)}get media(){let e=this.querySelector(":scope > [slot=media]");return(null==e?void 0:e.nodeName)=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(iD(this,l,e),e.localName.includes("-")&&await it.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;iM(this,h).observe(this,{childList:!0,subtree:!0}),io(this,iM(this,E));let t=null!=this.getAttribute(iO.AUDIO)?t2("audio player"):t2("video player");this.setAttribute("role","region"),this.setAttribute("aria-label",t),this.handleMediaUpdated(this.media),this.setAttribute(iO.USER_INACTIVE,""),ix(this,this.getBoundingClientRect().width),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),null==(e=it.window)||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;iM(this,h).disconnect(),il(this,iM(this,E)),this.media&&this.mediaUnsetCallback(this.media),null==(e=it.window)||e.removeEventListener("mouseup",this)}mediaSetCallback(e){}mediaUnsetCallback(e){iD(this,l,null)}handleEvent(e){switch(e.type){case"pointerdown":iD(this,o,e.timeStamp);break;case"pointermove":iC(this,v,b).call(this,e);break;case"pointerup":iC(this,g,f).call(this,e);break;case"mouseleave":iC(this,A,_).call(this);break;case"mouseup":this.removeAttribute(iO.KEYBOARD_CONTROL);break;case"keyup":iC(this,I,w).call(this),this.setAttribute(iO.KEYBOARD_CONTROL,"")}}set autohide(e){let t=Number(e);iD(this,u,isNaN(t)?0:t)}get autohide(){return(void 0===iM(this,u)?2:iM(this,u)).toString()}get breakpoints(){return iT(this,iO.BREAKPOINTS)}set breakpoints(e){iy(this,iO.BREAKPOINTS,e)}get audio(){return iA(this,iO.AUDIO)}set audio(e){i_(this,iO.AUDIO,e)}get gesturesDisabled(){return iA(this,iO.GESTURES_DISABLED)}set gesturesDisabled(e){i_(this,iO.GESTURES_DISABLED,e)}get keyboardControl(){return iA(this,iO.KEYBOARD_CONTROL)}set keyboardControl(e){i_(this,iO.KEYBOARD_CONTROL,e)}get noAutohide(){return iA(this,iO.NO_AUTOHIDE)}set noAutohide(e){i_(this,iO.NO_AUTOHIDE,e)}get autohideOverControls(){return iA(this,iO.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){i_(this,iO.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return iA(this,iO.USER_INACTIVE)}set userInteractive(e){i_(this,iO.USER_INACTIVE,e)}}o=new WeakMap,l=new WeakMap,d=new WeakMap,u=new WeakMap,h=new WeakMap,c=new WeakSet,m=function(e){let t=this.media;for(let i of e)if("childList"===i.type){for(let e of i.removedNodes){if("media"!=e.slot||i.target!=this)continue;let a=i.previousSibling&&i.previousSibling.previousElementSibling;if(a&&t){let t="media"!==a.slot;for(;null!==(a=a.previousSibling);)"media"==a.slot&&(t=!1);t&&this.mediaUnsetCallback(e)}else this.mediaUnsetCallback(e)}if(t)for(let e of i.addedNodes)e===t&&this.handleMediaUpdated(t)}},p=new WeakMap,E=new WeakMap,v=new WeakSet,b=function(e){if("mouse"!==e.pointerType&&e.timeStamp-iM(this,o)<250)return;iC(this,T,y).call(this),clearTimeout(iM(this,d));let t=this.hasAttribute(iO.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(e.target)||t)&&iC(this,I,w).call(this)},g=new WeakSet,f=function(e){if("touch"===e.pointerType){let t=!this.hasAttribute(iO.USER_INACTIVE);[this,this.media].includes(e.target)&&t?iC(this,A,_).call(this):iC(this,I,w).call(this)}else e.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(null==e?void 0:e.localName))&&iC(this,I,w).call(this)},A=new WeakSet,_=function(){if(0>iM(this,u)||this.hasAttribute(iO.USER_INACTIVE))return;this.setAttribute(iO.USER_INACTIVE,"");let e=new it.CustomEvent(tH.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(e)},T=new WeakSet,y=function(){if(!this.hasAttribute(iO.USER_INACTIVE))return;this.removeAttribute(iO.USER_INACTIVE);let e=new it.CustomEvent(tH.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(e)},I=new WeakSet,w=function(){iC(this,T,y).call(this),clearTimeout(iM(this,d));let e=parseInt(this.autohide);e<0||iD(this,d,setTimeout(()=>{iC(this,A,_).call(this)},1e3*e))},iP.shadowRootOptions={mode:"open"},iP.getTemplateHTML=function(e){return`
    <style>
      
      :host([${tV.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${iO.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${iO.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${iO.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${iO.AUDIO}])[${iO.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${iO.AUDIO}])[${iO.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${iO.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${iO.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${iO.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${iO.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${iO.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${iO.USER_INACTIVE}]:not([${tV.MEDIA_PAUSED}]):not([${tV.MEDIA_IS_AIRPLAYING}]):not([${tV.MEDIA_IS_CASTING}]):not([${iO.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${iO.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${iO.USER_INACTIVE}]:not([${iO.NO_AUTOHIDE}]):not([${tV.MEDIA_PAUSED}]):not([${tV.MEDIA_IS_CASTING}]):not([${iO.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${iO.USER_INACTIVE}][${iO.AUTOHIDE_OVER_CONTROLS}]:not([${iO.NO_AUTOHIDE}]):not([${tV.MEDIA_PAUSED}]):not([${tV.MEDIA_IS_CASTING}]):not([${iO.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${iO.AUDIO}])[${tV.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${ik.shadowRootOptions.mode}">
          ${ik.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `},it.customElements.get("media-container")||it.customElements.define("media-container",iP);var iU=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iV=(e,t,i)=>(iU(e,t,"read from private field"),i?i.call(e):t.get(e)),iH=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iW=(e,t,i,a)=>(iU(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class iF{constructor(e,t,{defaultValue:i}={defaultValue:void 0}){iH(this,R),iH(this,S,void 0),iH(this,k,void 0),iH(this,L,void 0),iH(this,M,new Set),iW(this,S,e),iW(this,k,t),iW(this,L,new Set(i))}[Symbol.iterator](){return iV(this,R,D).values()}get length(){return iV(this,R,D).size}get value(){var e;return null!=(e=[...iV(this,R,D)].join(" "))?e:""}set value(e){var t;e!==this.value&&(iW(this,M,new Set),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return[...iV(this,R,D)][e]}values(){return iV(this,R,D).values()}forEach(e,t){iV(this,R,D).forEach(e,t)}add(...e){var t,i;e.forEach(e=>iV(this,M).add(e)),(""!==this.value||(null==(t=iV(this,S))?void 0:t.hasAttribute(`${iV(this,k)}`)))&&(null==(i=iV(this,S))||i.setAttribute(`${iV(this,k)}`,`${this.value}`))}remove(...e){var t;e.forEach(e=>iV(this,M).delete(e)),null==(t=iV(this,S))||t.setAttribute(`${iV(this,k)}`,`${this.value}`)}contains(e){return iV(this,R,D).has(e)}toggle(e,t){if(void 0!==t)if(t)return this.add(e),!0;else return this.remove(e),!1;return this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){return this.remove(e),this.add(t),e===t}}S=new WeakMap,k=new WeakMap,L=new WeakMap,M=new WeakMap,R=new WeakSet,D=function(){return iV(this,M).size?iV(this,M):iV(this,L)};let i$=(e="")=>{let[t,i,a]=e.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:"cc"===t?tF.CAPTIONS:tF.SUBTITLES,language:i,label:r}},iB=(e="",t={})=>((e="")=>e.split(/\s+/))(e).map(e=>{let i=i$(e);return{...t,...i}}),iK=e=>e?Array.isArray(e)?e.map(e=>"string"==typeof e?i$(e):e):"string"==typeof e?iB(e):[e]:[],iG=({kind:e,label:t,language:i}={kind:"subtitles"})=>t?`${"captions"===e?"cc":"sb"}:${i}:${encodeURIComponent(t)}`:i,iq=(e=[])=>Array.prototype.map.call(e,iG).join(" "),iQ=e=>{let t=Object.entries(e).map(([e,t])=>i=>i[e]===t);return e=>t.every(t=>t(e))},iY=(e,t=[],i=[])=>{let a=iK(i).map(iQ);Array.from(t).filter(e=>a.some(t=>t(e))).forEach(t=>{t.mode=e})},ij=(e,t=()=>!0)=>{if(!(null==e?void 0:e.textTracks))return[];let i="function"==typeof t?t:iQ(t);return Array.from(e.textTracks).filter(i)},iz="exitFullscreen"in ii?"exitFullscreen":"webkitExitFullscreen"in ii?"webkitExitFullscreen":"webkitCancelFullScreen"in ii?"webkitCancelFullScreen":void 0,iZ="fullscreenElement"in ii?"fullscreenElement":"webkitFullscreenElement"in ii?"webkitFullscreenElement":void 0,iX="fullscreenEnabled"in ii?"fullscreenEnabled":"webkitFullscreenEnabled"in ii?"webkitFullscreenEnabled":void 0,iJ=()=>{var e;return a||(a=null==(e=null==ii?void 0:ii.createElement)?void 0:e.call(ii,"video"))},i0=async(e=iJ())=>{if(!e)return!1;let t=e.volume;e.volume=t/2+.1;let i=new AbortController,a=await Promise.race([i1(e,i.signal),i2(e,t)]);return i.abort(),a},i1=(e,t)=>new Promise(i=>{e.addEventListener("volumechange",()=>i(!0),{signal:t})}),i2=async(e,t)=>{for(let i=0;i<10;i++){if(e.volume===t)return!1;await tz(10)}return e.volume!==t},i5=/.*Version\/.*Safari\/.*/.test(it.navigator.userAgent),i3=(e=iJ())=>(!it.matchMedia("(display-mode: standalone)").matches||!i5)&&"function"==typeof(null==e?void 0:e.requestPictureInPicture),i4=(e=iJ())=>(e=>{let{documentElement:t,media:i}=e;return!!(null==t?void 0:t[iX])||i&&"webkitSupportsFullscreen"in i})({documentElement:ii,media:e}),i7=i4(),i8=i3(),i6=!!it.WebKitPlaybackTargetAvailabilityEvent,i9=!!it.chrome,ae=e=>ij(e.media,e=>[tF.SUBTITLES,tF.CAPTIONS].includes(e.kind)).sort((e,t)=>e.kind>=t.kind?1:-1),at=e=>ij(e.media,e=>e.mode===t$.SHOWING&&[tF.SUBTITLES,tF.CAPTIONS].includes(e.kind)),ai=(e,t)=>{let i=ae(e),a=at(e),r=!!a.length;if(i.length){if(!1===t||r&&!0!==t)iY(t$.DISABLED,i,a);else if(!0===t||!r&&!1!==t){let t=i[0],{options:r}=e;if(!(null==r?void 0:r.noSubtitlesLangPref)){let e=globalThis.localStorage.getItem("media-chrome-pref-subtitles-lang"),a=e?[e,...globalThis.navigator.languages]:globalThis.navigator.languages,r=i.filter(e=>a.some(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))).sort((e,t)=>a.findIndex(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))-a.findIndex(e=>t.language.toLowerCase().startsWith(e.split("-")[0])));r[0]&&(t=r[0])}let{language:s,label:n,kind:o}=t;iY(t$.DISABLED,i,a),iY(t$.SHOWING,i,[{language:s,label:n,kind:o}])}}},aa=(e,t)=>e===t||null!=e&&null!=t&&typeof e==typeof t&&(!!("number"==typeof e&&Number.isNaN(e)&&Number.isNaN(t))||"object"==typeof e&&(Array.isArray(e)?ar(e,t):Object.entries(e).every(([e,i])=>e in t&&aa(i,t[e])))),ar=(e,t)=>{let i=Array.isArray(e),a=Array.isArray(t);return i===a&&(!i&&!a||e.length===t.length&&e.every((e,i)=>aa(e,t[i])))},as=Object.values(tG),an=i0().then(e=>r=e),ao=async(...e)=>{await Promise.all(e.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof it.HTMLElement))return;let t=e.localName;if(!t.includes("-"))return;let i=it.customElements.get(t);i&&e instanceof i||(await it.customElements.whenDefined(t),it.customElements.upgrade(e))}))},al=new it.DOMParser,ad={mediaError:{get(e,t){let{media:i}=e;if((null==t?void 0:t.type)!=="playing")return null==i?void 0:i.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(e,t){var i;let{media:a}=e;if((null==t?void 0:t.type)!=="playing")return null==(i=null==a?void 0:a.error)?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(e,t){var i,a;let{media:r}=e;if((null==t?void 0:t.type)!=="playing")return null!=(a=null==(i=null==r?void 0:r.error)?void 0:i.message)?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoWidth)?t:0},mediaEvents:["resize"]},mediaHeight:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoHeight)?t:0},mediaEvents:["resize"]},mediaPaused:{get(e){var t;let{media:i}=e;return null==(t=null==i?void 0:i.paused)||t},set(e,t){var i;let{media:a}=t;a&&(e?a.pause():null==(i=a.play())||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(e,t){let{media:i}=e;return!!i&&(t?"playing"===t.type:!i.paused)},mediaEvents:["playing","emptied"]},mediaEnded:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.ended)&&t},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.playbackRate)?t:1},set(e,t){let{media:i}=t;i&&Number.isFinite(+e)&&(i.playbackRate=+e)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.muted)&&t},set(e,t){let{media:i,options:{noMutedPref:a}={}}=t;if(i){i.muted=e;try{let t=null!==it.localStorage.getItem("media-chrome-pref-muted"),r=i.hasAttribute("muted");if(a){t&&it.localStorage.removeItem("media-chrome-pref-muted");return}if(r&&!t)return;it.localStorage.setItem("media-chrome-pref-muted",e?"true":"false")}catch(e){console.debug("Error setting muted pref",e)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noMutedPref:i}}=t,{media:a}=t;if(a&&!a.muted&&!i)try{let i="true"===it.localStorage.getItem("media-chrome-pref-muted");ad.mediaMuted.set(i,t),e(i)}catch(e){console.debug("Error getting muted pref",e)}}]},mediaLoop:{get(e){let{media:t}=e;return null==t?void 0:t.loop},set(e,t){let{media:i}=t;i&&(i.loop=e)},mediaEvents:["medialooprequest"]},mediaVolume:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.volume)?t:1},set(e,t){let{media:i,options:{noVolumePref:a}={}}=t;if(i){try{null==e?it.localStorage.removeItem("media-chrome-pref-volume"):i.hasAttribute("muted")||a||it.localStorage.setItem("media-chrome-pref-volume",e.toString())}catch(e){console.debug("Error setting volume pref",e)}Number.isFinite(+e)&&(i.volume=+e)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noVolumePref:i}}=t;if(!i)try{let{media:i}=t;if(!i)return;let a=it.localStorage.getItem("media-chrome-pref-volume");if(null==a)return;ad.mediaVolume.set(+a,t),e(+a)}catch(e){console.debug("Error getting volume pref",e)}}]},mediaVolumeLevel:{get(e){let{media:t}=e;return void 0===(null==t?void 0:t.volume)?"high":t.muted||0===t.volume?"off":t.volume<.5?"low":t.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.currentTime)?t:0},set(e,t){let{media:i}=t;i&&tj(e)&&(i.currentTime=e)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(e){let{media:t,options:{defaultDuration:i}={}}=e;return i&&(!t||!t.duration||Number.isNaN(t.duration)||!Number.isFinite(t.duration))?i:Number.isFinite(null==t?void 0:t.duration)?t.duration:NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(e){let{media:t}=e;return(null==t?void 0:t.readyState)<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(e){var t;let{media:i}=e;if(!(null==(t=null==i?void 0:i.seekable)?void 0:t.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(a||r)return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(e){var t;let{media:i}=e,a=null!=(t=null==i?void 0:i.buffered)?t:[];return Array.from(a).map((e,t)=>[Number(a.start(t).toFixed(3)),Number(a.end(t).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(e){let{media:t,options:{defaultStreamType:i}={}}=e,a=[tG.LIVE,tG.ON_DEMAND].includes(i)?i:void 0;if(!t)return a;let{streamType:r}=t;if(as.includes(r))return r===tG.UNKNOWN?a:r;let s=t.duration;return s===1/0?tG.LIVE:Number.isFinite(s)?tG.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(e){let{media:t}=e;if(!t)return NaN;let{targetLiveWindow:i}=t,a=ad.mediaStreamType.get(e);return(null==i||Number.isNaN(i))&&a===tG.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(e){let{media:t,options:{liveEdgeOffset:i=10}={}}=e;if(!t)return!1;if("number"==typeof t.liveEdgeStart)return!Number.isNaN(t.liveEdgeStart)&&t.currentTime>=t.liveEdgeStart;if(ad.mediaStreamType.get(e)!==tG.LIVE)return!1;let a=t.seekable;if(!a)return!0;if(!a.length)return!1;let r=a.end(a.length-1)-i;return t.currentTime>=r},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get:e=>ae(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get:e=>at(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i,a;let{media:r,options:s}=t;if(!r)return;let n=e=>{var i;s.defaultSubtitles&&(e&&![tF.CAPTIONS,tF.SUBTITLES].includes(null==(i=null==e?void 0:e.track)?void 0:i.kind)||ai(t,!0))};return r.addEventListener("loadstart",n),null==(i=r.textTracks)||i.addEventListener("addtrack",n),null==(a=r.textTracks)||a.addEventListener("removetrack",n),()=>{var e,t;r.removeEventListener("loadstart",n),null==(e=r.textTracks)||e.removeEventListener("addtrack",n),null==(t=r.textTracks)||t.removeEventListener("removetrack",n)}}]},mediaChaptersCues:{get(e){var t;let{media:i}=e;if(!i)return[];let[a]=ij(i,{kind:tF.CHAPTERS});return Array.from(null!=(t=null==a?void 0:a.cues)?t:[]).map(({text:e,startTime:t,endTime:i})=>({text:e&&al.parseFromString(e,"text/html").body.textContent||e,startTime:t,endTime:i}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(!a)return;let r=a.querySelector('track[kind="chapters"][default][src]'),s=null==(i=a.shadowRoot)?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return null==r||r.addEventListener("load",e),null==s||s.addEventListener("load",e),()=>{null==r||r.removeEventListener("load",e),null==s||s.removeEventListener("load",e)}}]},mediaIsPip:{get(e){var t,i;let{media:a,documentElement:r}=e;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return!!(null==(t=a.localName)?void 0:t.includes("-"))&&ic(a,r.pictureInPictureElement);if(r.pictureInPictureElement.localName.includes("-")){let e=r.pictureInPictureElement.shadowRoot;for(;null==e?void 0:e.pictureInPictureElement;){if(e.pictureInPictureElement===a)return!0;e=null==(i=e.pictureInPictureElement)?void 0:i.shadowRoot}}return!1},set(e,t){let{media:i}=t;if(i)if(e){if(!ii.pictureInPictureEnabled)return void console.warn("MediaChrome: Picture-in-picture is not enabled");if(!i.requestPictureInPicture)return void console.warn("MediaChrome: The current media does not support picture-in-picture");let e=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(t=>{if(11===t.code){if(!i.src)return void console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");if(0===i.readyState&&"none"===i.preload){let t=()=>{i.removeEventListener("loadedmetadata",a),i.preload="none"},a=()=>{i.requestPictureInPicture().catch(e),t()};i.addEventListener("loadedmetadata",a),i.preload="metadata",setTimeout(()=>{0===i.readyState&&e(),t()},1e3)}else throw t}else throw t})}else ii.pictureInPictureElement&&ii.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.videoRenditions)?t:[]].map(e=>({...e}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(e){var t,i,a;let{media:r}=e;return null==(a=null==(i=null==r?void 0:r.videoRenditions)?void 0:i[null==(t=r.videoRenditions)?void 0:t.selectedIndex])?void 0:a.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.videoRenditions))return void console.warn("MediaController: Rendition selection not supported by this media.");let a=Array.prototype.findIndex.call(i.videoRenditions,t=>t.id==e);i.videoRenditions.selectedIndex!=a&&(i.videoRenditions.selectedIndex=a)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.audioTracks)?t:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(e){var t,i;let{media:a}=e;return null==(i=[...null!=(t=null==a?void 0:a.audioTracks)?t:[]].find(e=>e.enabled))?void 0:i.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.audioTracks))return void console.warn("MediaChrome: Audio track selection not supported by this media.");for(let t of i.audioTracks)t.enabled=e==t.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get:e=>(e=>{var t;let{media:i,documentElement:a,fullscreenElement:r=i}=e;if(!i||!a)return!1;let s=(e=>{let{documentElement:t,media:i}=e,a=null==t?void 0:t[iZ];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===tq.FULLSCREEN?i:a})(e);if(!s)return!1;if(s===r||s===i)return!0;if(s.localName.includes("-")){let e=s.shadowRoot;if(!(iZ in e))return ic(s,r);for(;null==e?void 0:e[iZ];){if(e[iZ]===r)return!0;e=null==(t=e[iZ])?void 0:t.shadowRoot}}return!1})(e),set(e,t,i){var a;e?((e=>{var t;let{media:i,fullscreenElement:a}=e;try{let e=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(e){let i=null==(t=a[e])?void 0:t.call(a);if(i instanceof Promise)return i.catch(()=>{})}else(null==i?void 0:i.webkitEnterFullscreen)?i.webkitEnterFullscreen():(null==i?void 0:i.requestFullscreen)&&i.requestFullscreen()}catch(e){console.error(e)}})(t),i.detail&&(null==(a=t.media)||a.focus())):(e=>{var t;let{documentElement:i}=e;if(iz){let e=null==(t=null==i?void 0:i[iz])?void 0:t.call(i);if(e instanceof Promise)return e.catch(()=>{})}})(t)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(e){var t;let{media:i}=e;return!!(null==i?void 0:i.remote)&&(null==(t=i.remote)?void 0:t.state)!=="disconnected"&&!!i.remote.state},set(e,t){var i,a;let{media:r}=t;if(r&&(!e||(null==(i=r.remote)?void 0:i.state)==="disconnected")&&(e||(null==(a=r.remote)?void 0:a.state)==="connected")){if("function"!=typeof r.remote.prompt)return void console.warn("MediaChrome: Casting is not supported in this environment");r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get:()=>!1,set(e,t){let{media:i}=t;if(i){if(!(i.webkitShowPlaybackTargetPicker&&it.WebKitPlaybackTargetAvailabilityEvent))return void console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(e){let{media:t}=e;if(!i7||!i4(t))return tK.UNSUPPORTED}},mediaPipUnavailable:{get(e){let{media:t}=e;return i8&&i3(t)?(null==t?void 0:t.disablePictureInPicture)?tK.UNAVAILABLE:void 0:tK.UNSUPPORTED}},mediaVolumeUnavailable:{get(e){let{media:t}=e;if(!1===r||(null==t?void 0:t.volume)==void 0)return tK.UNSUPPORTED},stateOwnersUpdateHandlers:[e=>{null==r&&an.then(t=>e(t?void 0:tK.UNSUPPORTED))}]},mediaCastUnavailable:{get(e,{availability:t="not-available"}={}){var i;let{media:a}=e;return i9&&(null==(i=null==a?void 0:a.remote)?void 0:i.state)?null!=t&&"available"!==t?tK.UNAVAILABLE:void 0:tK.UNSUPPORTED},stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaAirplayUnavailable:{get:(e,t)=>i6?(null==t?void 0:t.availability)==="not-available"?tK.UNAVAILABLE:void 0:tK.UNSUPPORTED,mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(a)return a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaRenditionUnavailable:{get(e){var t;let{media:i}=e;return(null==i?void 0:i.videoRenditions)?(null==(t=i.videoRenditions)?void 0:t.length)?void 0:tK.UNAVAILABLE:tK.UNSUPPORTED},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(e){var t,i;let{media:a}=e;return(null==a?void 0:a.audioTracks)?(null!=(i=null==(t=a.audioTracks)?void 0:t.length)?i:0)<=1?tK.UNAVAILABLE:void 0:tK.UNSUPPORTED},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(e){let{options:{mediaLang:t}={}}=e;return null!=t?t:"en"}}},au={[tN.MEDIA_PREVIEW_REQUEST](e,t,{detail:i}){var a,r,s;let n,o,{media:l}=t,d=null!=i?i:void 0;if(l&&null!=d){let[e]=ij(l,{kind:tF.METADATA,label:"thumbnails"}),t=Array.prototype.find.call(null!=(a=null==e?void 0:e.cues)?a:[],(e,t,i)=>0===t?e.endTime>d:t===i.length-1?e.startTime<=d:e.startTime<=d&&e.endTime>d);if(t){let e=/'^(?:[a-z]+:)?\/\//i.test(t.text)||null==(r=null==l?void 0:l.querySelector('track[label="thumbnails"]'))?void 0:r.src,i=new URL(t.text,e);o=new URLSearchParams(i.hash).get("#xywh").split(",").map(e=>+e),n=i.href}}let u=e.mediaDuration.get(t),h=null==(s=e.mediaChaptersCues.get(t).find((e,t,i)=>t===i.length-1&&u===e.endTime?e.startTime<=d&&e.endTime>=d:e.startTime<=d&&e.endTime>d))?void 0:s.text;return null!=i&&null==h&&(h=""),{mediaPreviewTime:d,mediaPreviewImage:n,mediaPreviewCoords:o,mediaPreviewChapter:h}},[tN.MEDIA_PAUSE_REQUEST](e,t){e.mediaPaused.set(!0,t)},[tN.MEDIA_PLAY_REQUEST](e,t){var i,a,r,s;let n=e.mediaStreamType.get(t)===tG.LIVE,o=!(null==(i=t.options)?void 0:i.noAutoSeekToLive),l=e.mediaTargetLiveWindow.get(t)>0;if(n&&o&&!l){let i=null==(a=e.mediaSeekable.get(t))?void 0:a[1];if(i){let a=null!=(s=null==(r=t.options)?void 0:r.seekToLiveOffset)?s:0;e.mediaCurrentTime.set(i-a,t)}}e.mediaPaused.set(!1,t)},[tN.MEDIA_PLAYBACK_RATE_REQUEST](e,t,{detail:i}){e.mediaPlaybackRate.set(i,t)},[tN.MEDIA_MUTE_REQUEST](e,t){e.mediaMuted.set(!0,t)},[tN.MEDIA_UNMUTE_REQUEST](e,t){e.mediaVolume.get(t)||e.mediaVolume.set(.25,t),e.mediaMuted.set(!1,t)},[tN.MEDIA_LOOP_REQUEST](e,t,{detail:i}){let a=!!i;return e.mediaLoop.set(a,t),{mediaLoop:a}},[tN.MEDIA_VOLUME_REQUEST](e,t,{detail:i}){i&&e.mediaMuted.get(t)&&e.mediaMuted.set(!1,t),e.mediaVolume.set(i,t)},[tN.MEDIA_SEEK_REQUEST](e,t,{detail:i}){e.mediaCurrentTime.set(i,t)},[tN.MEDIA_SEEK_TO_LIVE_REQUEST](e,t){var i,a,r;let s=null==(i=e.mediaSeekable.get(t))?void 0:i[1];if(Number.isNaN(Number(s)))return;let n=null!=(r=null==(a=t.options)?void 0:a.seekToLiveOffset)?r:0;e.mediaCurrentTime.set(s-n,t)},[tN.MEDIA_SHOW_SUBTITLES_REQUEST](e,t,{detail:i}){var a;let{options:r}=t,s=ae(t),n=iK(i),o=null==(a=n[0])?void 0:a.language;o&&!r.noSubtitlesLangPref&&it.localStorage.setItem("media-chrome-pref-subtitles-lang",o),iY(t$.SHOWING,s,n)},[tN.MEDIA_DISABLE_SUBTITLES_REQUEST](e,t,{detail:i}){let a=ae(t);iY(t$.DISABLED,a,null!=i?i:[])},[tN.MEDIA_TOGGLE_SUBTITLES_REQUEST](e,t,{detail:i}){ai(t,i)},[tN.MEDIA_RENDITION_REQUEST](e,t,{detail:i}){e.mediaRenditionSelected.set(i,t)},[tN.MEDIA_AUDIO_TRACK_REQUEST](e,t,{detail:i}){e.mediaAudioTrackEnabled.set(i,t)},[tN.MEDIA_ENTER_PIP_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsPip.set(!0,t)},[tN.MEDIA_EXIT_PIP_REQUEST](e,t){e.mediaIsPip.set(!1,t)},[tN.MEDIA_ENTER_FULLSCREEN_REQUEST](e,t,i){e.mediaIsPip.get(t)&&e.mediaIsPip.set(!1,t),e.mediaIsFullscreen.set(!0,t,i)},[tN.MEDIA_EXIT_FULLSCREEN_REQUEST](e,t){e.mediaIsFullscreen.set(!1,t)},[tN.MEDIA_ENTER_CAST_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsCasting.set(!0,t)},[tN.MEDIA_EXIT_CAST_REQUEST](e,t){e.mediaIsCasting.set(!1,t)},[tN.MEDIA_AIRPLAY_REQUEST](e,t){e.mediaIsAirplaying.set(!0,t)}};var ah=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ac=(e,t,i)=>(ah(e,t,"read from private field"),i?i.call(e):t.get(e)),am=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ap=(e,t,i,a)=>(ah(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),aE=(e,t,i)=>(ah(e,t,"access private method"),i);let av=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],ab={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",DEFAULT_DURATION:"defaultduration",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYBOARD_BACKWARD_SEEK_OFFSET:"keyboardbackwardseekoffset",KEYBOARD_FORWARD_SEEK_OFFSET:"keyboardforwardseekoffset",KEYBOARD_DOWN_VOLUME_STEP:"keyboarddownvolumestep",KEYBOARD_UP_VOLUME_STEP:"keyboardupvolumestep",KEYS_USED:"keysused",LANG:"lang",LOOP:"loop",LIVE_EDGE_OFFSET:"liveedgeoffset",NO_AUTO_SEEK_TO_LIVE:"noautoseektolive",NO_DEFAULT_STORE:"nodefaultstore",NO_HOTKEYS:"nohotkeys",NO_MUTED_PREF:"nomutedpref",NO_SUBTITLES_LANG_PREF:"nosubtitleslangpref",NO_VOLUME_PREF:"novolumepref",SEEK_TO_LIVE_OFFSET:"seektoliveoffset"};class ag extends iP{constructor(){super(),am(this,H),am(this,F),am(this,B),am(this,G),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,am(this,C,new iF(this,ab.HOTKEYS)),am(this,O,void 0),am(this,N,void 0),am(this,x,null),am(this,P,void 0),am(this,U,void 0),am(this,V,e=>{var t;null==(t=ac(this,N))||t.dispatch(e)}),this.associateElement(this);let e={};ap(this,P,t=>{Object.entries(t).forEach(([t,i])=>{if(t in e&&e[t]===i)return;this.propagateMediaState(t,i);let a=t.toLowerCase(),r=new it.CustomEvent(tW[a],{composed:!0,detail:i});this.dispatchEvent(r)}),e=t}),this.hasAttribute(ab.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}static get observedAttributes(){return super.observedAttributes.concat(ab.NO_HOTKEYS,ab.HOTKEYS,ab.DEFAULT_STREAM_TYPE,ab.DEFAULT_SUBTITLES,ab.DEFAULT_DURATION,ab.NO_MUTED_PREF,ab.NO_VOLUME_PREF,ab.LANG,ab.LOOP)}get mediaStore(){return ac(this,N)}set mediaStore(e){var t,i;if(ac(this,N)&&(null==(t=ac(this,U))||t.call(this),ap(this,U,void 0)),ap(this,N,e),!ac(this,N)&&!this.hasAttribute(ab.NO_DEFAULT_STORE))return void aE(this,H,W).call(this);ap(this,U,null==(i=ac(this,N))?void 0:i.subscribe(ac(this,P)))}get fullscreenElement(){var e;return null!=(e=ac(this,O))?e:this}set fullscreenElement(e){var t;this.hasAttribute(ab.FULLSCREEN_ELEMENT)&&this.removeAttribute(ab.FULLSCREEN_ELEMENT),ap(this,O,e),null==(t=ac(this,N))||t.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return iA(this,ab.DEFAULT_SUBTITLES)}set defaultSubtitles(e){i_(this,ab.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return iT(this,ab.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){iy(this,ab.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return ib(this,ab.DEFAULT_DURATION)}set defaultDuration(e){ig(this,ab.DEFAULT_DURATION,e)}get noHotkeys(){return iA(this,ab.NO_HOTKEYS)}set noHotkeys(e){i_(this,ab.NO_HOTKEYS,e)}get keysUsed(){return iT(this,ab.KEYS_USED)}set keysUsed(e){iy(this,ab.KEYS_USED,e)}get liveEdgeOffset(){return ib(this,ab.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){ig(this,ab.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return iA(this,ab.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){i_(this,ab.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return iA(this,ab.NO_VOLUME_PREF)}set noVolumePref(e){i_(this,ab.NO_VOLUME_PREF,e)}get noMutedPref(){return iA(this,ab.NO_MUTED_PREF)}set noMutedPref(e){i_(this,ab.NO_MUTED_PREF,e)}get noSubtitlesLangPref(){return iA(this,ab.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){i_(this,ab.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return iA(this,ab.NO_DEFAULT_STORE)}set noDefaultStore(e){i_(this,ab.NO_DEFAULT_STORE,e)}attributeChangedCallback(e,t,i){var a,r,s,n,o,l,d,u,h,c,m,p;if(super.attributeChangedCallback(e,t,i),e===ab.NO_HOTKEYS)i!==t&&""===i?(this.hasAttribute(ab.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):i!==t&&null===i&&this.enableHotkeys();else if(e===ab.HOTKEYS)ac(this,C).value=i;else if(e===ab.DEFAULT_SUBTITLES&&i!==t)null==(a=ac(this,N))||a.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(ab.DEFAULT_SUBTITLES)}});else if(e===ab.DEFAULT_STREAM_TYPE)null==(s=ac(this,N))||s.dispatch({type:"optionschangerequest",detail:{defaultStreamType:null!=(r=this.getAttribute(ab.DEFAULT_STREAM_TYPE))?r:void 0}});else if(e===ab.LIVE_EDGE_OFFSET)null==(n=ac(this,N))||n.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(ab.LIVE_EDGE_OFFSET)?+this.getAttribute(ab.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(ab.SEEK_TO_LIVE_OFFSET)?void 0:+this.getAttribute(ab.LIVE_EDGE_OFFSET)}});else if(e===ab.SEEK_TO_LIVE_OFFSET)null==(o=ac(this,N))||o.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(ab.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(ab.SEEK_TO_LIVE_OFFSET):void 0}});else if(e===ab.NO_AUTO_SEEK_TO_LIVE)null==(l=ac(this,N))||l.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(ab.NO_AUTO_SEEK_TO_LIVE)}});else if(e===ab.FULLSCREEN_ELEMENT){let e=i?null==(d=this.getRootNode())?void 0:d.getElementById(i):void 0;ap(this,O,e),null==(u=ac(this,N))||u.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===ab.LANG&&i!==t?(t1=i,null==(h=ac(this,N))||h.dispatch({type:"optionschangerequest",detail:{mediaLang:i}})):e===ab.LOOP&&i!==t?null==(c=ac(this,N))||c.dispatch({type:tN.MEDIA_LOOP_REQUEST,detail:null!=i}):e===ab.NO_VOLUME_PREF&&i!==t?null==(m=ac(this,N))||m.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(ab.NO_VOLUME_PREF)}}):e===ab.NO_MUTED_PREF&&i!==t&&(null==(p=ac(this,N))||p.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(ab.NO_MUTED_PREF)}}))}connectedCallback(){var e,t;ac(this,N)||this.hasAttribute(ab.NO_DEFAULT_STORE)||aE(this,H,W).call(this),null==(e=ac(this,N))||e.dispatch({type:"documentelementchangerequest",detail:ii}),super.connectedCallback(),ac(this,N)&&!ac(this,U)&&ap(this,U,null==(t=ac(this,N))?void 0:t.subscribe(ac(this,P))),this.hasAttribute(ab.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,t,i,a;null==(e=super.disconnectedCallback)||e.call(this),ac(this,N)&&(null==(t=ac(this,N))||t.dispatch({type:"documentelementchangerequest",detail:void 0}),null==(i=ac(this,N))||i.dispatch({type:tN.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})),ac(this,U)&&(null==(a=ac(this,U))||a.call(this),ap(this,U,void 0))}mediaSetCallback(e){var t;super.mediaSetCallback(e),null==(t=ac(this,N))||t.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var t;super.mediaUnsetCallback(e),null==(t=ac(this,N))||t.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,t){ak(this.mediaStateReceivers,e,t)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(t.has(e))return;let i=aL(e,this.registerMediaStateReceiver.bind(this),this.unregisterMediaStateReceiver.bind(this));Object.values(tN).forEach(t=>{e.addEventListener(t,ac(this,V))}),t.set(e,i)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;t.has(e)&&(t.get(e)(),t.delete(e),Object.values(tN).forEach(t=>{e.removeEventListener(t,ac(this,V))}))}registerMediaStateReceiver(e){if(!e)return;let t=this.mediaStateReceivers;!(t.indexOf(e)>-1)&&(t.push(e),ac(this,N)&&Object.entries(ac(this,N).getState()).forEach(([t,i])=>{ak([e],t,i)}))}unregisterMediaStateReceiver(e){let t=this.mediaStateReceivers,i=t.indexOf(e);i<0||t.splice(i,1)}enableHotkeys(){this.addEventListener("keydown",aE(this,B,K))}disableHotkeys(){this.removeEventListener("keydown",aE(this,B,K)),this.removeEventListener("keyup",aE(this,F,$))}get hotkeys(){return iT(this,ab.HOTKEYS)}set hotkeys(e){iy(this,ab.HOTKEYS,e)}keyboardShortcutHandler(e){var t,i,a,r,s,n,o,l,d;let u,h,c,m=e.target;if(!((null!=(a=null!=(i=null==(t=m.getAttribute(ab.KEYS_USED))?void 0:t.split(" "))?i:null==m?void 0:m.keysUsed)?a:[]).map(e=>"Space"===e?" ":e).filter(Boolean).includes(e.key)||ac(this,C).contains(`no${e.key.toLowerCase()}`)||" "===e.key&&ac(this,C).contains("nospace"))&&!(e.shiftKey&&("/"===e.key||"?"===e.key)&&ac(this,C).contains("noshift+/")))switch(e.key){case" ":case"k":u=ac(this,N).getState().mediaPaused?tN.MEDIA_PLAY_REQUEST:tN.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new it.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"m":u="off"===this.mediaStore.getState().mediaVolumeLevel?tN.MEDIA_UNMUTE_REQUEST:tN.MEDIA_MUTE_REQUEST,this.dispatchEvent(new it.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"f":u=this.mediaStore.getState().mediaIsFullscreen?tN.MEDIA_EXIT_FULLSCREEN_REQUEST:tN.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new it.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new it.CustomEvent(tN.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{let e=this.hasAttribute(ab.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(ab.KEYBOARD_BACKWARD_SEEK_OFFSET):10;h=Math.max((null!=(r=this.mediaStore.getState().mediaCurrentTime)?r:0)-e,0),c=new it.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"ArrowRight":case"l":{let e=this.hasAttribute(ab.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(ab.KEYBOARD_FORWARD_SEEK_OFFSET):10;h=Math.max((null!=(s=this.mediaStore.getState().mediaCurrentTime)?s:0)+e,0),c=new it.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"ArrowUp":{let e=this.hasAttribute(ab.KEYBOARD_UP_VOLUME_STEP)?+this.getAttribute(ab.KEYBOARD_UP_VOLUME_STEP):.025;h=Math.min((null!=(n=this.mediaStore.getState().mediaVolume)?n:1)+e,1),c=new it.CustomEvent(tN.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"ArrowDown":{let e=this.hasAttribute(ab.KEYBOARD_DOWN_VOLUME_STEP)?+this.getAttribute(ab.KEYBOARD_DOWN_VOLUME_STEP):.025;h=Math.max((null!=(o=this.mediaStore.getState().mediaVolume)?o:1)-e,0),c=new it.CustomEvent(tN.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"<":h=Math.max((null!=(l=this.mediaStore.getState().mediaPlaybackRate)?l:1)-.25,.25).toFixed(2),c=new it.CustomEvent(tN.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break;case">":h=Math.min((null!=(d=this.mediaStore.getState().mediaPlaybackRate)?d:1)+.25,2).toFixed(2),c=new it.CustomEvent(tN.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break;case"/":case"?":e.shiftKey&&aE(this,G,q).call(this);break;case"p":u=this.mediaStore.getState().mediaIsPip?tN.MEDIA_EXIT_PIP_REQUEST:tN.MEDIA_ENTER_PIP_REQUEST,c=new it.CustomEvent(u,{composed:!0,bubbles:!0}),this.dispatchEvent(c)}}}C=new WeakMap,O=new WeakMap,N=new WeakMap,x=new WeakMap,P=new WeakMap,U=new WeakMap,V=new WeakMap,H=new WeakSet,W=function(){var e;this.mediaStore=(({media:e,fullscreenElement:t,documentElement:i,stateMediator:a=ad,requestMap:r=au,options:s={},monitorStateOwnersOnlyWithSubscriptions:n=!0})=>{let o,l=[],d={options:{...s}},u=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),h=e=>{void 0!=e&&(aa(e,u)||(u=Object.freeze({...u,...e}),l.forEach(e=>e(u))))},c=()=>{h(Object.entries(a).reduce((e,[t,{get:i}])=>(e[t]=i(d),e),{}))},m={},p=async(e,t)=>{var i,r,s,u,p,E,v,b,g,f,A,_,T,y,I,w;let S=!!o;if(o={...d,...null!=o?o:{},...e},S)return;await ao(...Object.values(e));let k=l.length>0&&0===t&&n,L=d.media!==o.media,M=(null==(i=d.media)?void 0:i.textTracks)!==(null==(r=o.media)?void 0:r.textTracks),R=(null==(s=d.media)?void 0:s.videoRenditions)!==(null==(u=o.media)?void 0:u.videoRenditions),D=(null==(p=d.media)?void 0:p.audioTracks)!==(null==(E=o.media)?void 0:E.audioTracks),C=(null==(v=d.media)?void 0:v.remote)!==(null==(b=o.media)?void 0:b.remote),O=d.documentElement!==o.documentElement,N=!!d.media&&(L||k),x=!!(null==(g=d.media)?void 0:g.textTracks)&&(M||k),P=!!(null==(f=d.media)?void 0:f.videoRenditions)&&(R||k),U=!!(null==(A=d.media)?void 0:A.audioTracks)&&(D||k),V=!!(null==(_=d.media)?void 0:_.remote)&&(C||k),H=!!d.documentElement&&(O||k),W=N||x||P||U||V||H,F=0===l.length&&1===t&&n,$=!!o.media&&(L||F),B=!!(null==(T=o.media)?void 0:T.textTracks)&&(M||F),K=!!(null==(y=o.media)?void 0:y.videoRenditions)&&(R||F),G=!!(null==(I=o.media)?void 0:I.audioTracks)&&(D||F),q=!!(null==(w=o.media)?void 0:w.remote)&&(C||F),Q=!!o.documentElement&&(O||F),Y=$||B||K||G||q||Q;if(!(W||Y)){Object.entries(o).forEach(([e,t])=>{d[e]=t}),c(),o=void 0;return}Object.entries(a).forEach(([e,{get:t,mediaEvents:i=[],textTracksEvents:a=[],videoRenditionsEvents:r=[],audioTracksEvents:s=[],remoteEvents:n=[],rootEvents:l=[],stateOwnersUpdateHandlers:u=[]}])=>{let c;m[e]||(m[e]={});let p=i=>{h({[e]:t(d,i)})};c=m[e].mediaEvents,i.forEach(t=>{c&&N&&(d.media.removeEventListener(t,c),m[e].mediaEvents=void 0),$&&(o.media.addEventListener(t,p),m[e].mediaEvents=p)}),c=m[e].textTracksEvents,a.forEach(t=>{var i,a;c&&x&&(null==(i=d.media.textTracks)||i.removeEventListener(t,c),m[e].textTracksEvents=void 0),B&&(null==(a=o.media.textTracks)||a.addEventListener(t,p),m[e].textTracksEvents=p)}),c=m[e].videoRenditionsEvents,r.forEach(t=>{var i,a;c&&P&&(null==(i=d.media.videoRenditions)||i.removeEventListener(t,c),m[e].videoRenditionsEvents=void 0),K&&(null==(a=o.media.videoRenditions)||a.addEventListener(t,p),m[e].videoRenditionsEvents=p)}),c=m[e].audioTracksEvents,s.forEach(t=>{var i,a;c&&U&&(null==(i=d.media.audioTracks)||i.removeEventListener(t,c),m[e].audioTracksEvents=void 0),G&&(null==(a=o.media.audioTracks)||a.addEventListener(t,p),m[e].audioTracksEvents=p)}),c=m[e].remoteEvents,n.forEach(t=>{var i,a;c&&V&&(null==(i=d.media.remote)||i.removeEventListener(t,c),m[e].remoteEvents=void 0),q&&(null==(a=o.media.remote)||a.addEventListener(t,p),m[e].remoteEvents=p)}),c=m[e].rootEvents,l.forEach(t=>{c&&H&&(d.documentElement.removeEventListener(t,c),m[e].rootEvents=void 0),Q&&(o.documentElement.addEventListener(t,p),m[e].rootEvents=p)});let E=m[e].stateOwnersUpdateHandlers;if(E&&W&&(Array.isArray(E)?E:[E]).forEach(e=>{"function"==typeof e&&e()}),Y){let t=u.map(e=>e(p,o)).filter(e=>"function"==typeof e);m[e].stateOwnersUpdateHandlers=1===t.length?t[0]:t}else W&&(m[e].stateOwnersUpdateHandlers=void 0)}),Object.entries(o).forEach(([e,t])=>{d[e]=t}),c(),o=void 0};return p({media:e,fullscreenElement:t,documentElement:i,options:s}),{dispatch(e){let{type:t,detail:i}=e;if(r[t]&&null==u.mediaErrorCode)return void h(r[t](a,d,e));"mediaelementchangerequest"===t?p({media:i}):"fullscreenelementchangerequest"===t?p({fullscreenElement:i}):"documentelementchangerequest"===t?p({documentElement:i}):"optionschangerequest"===t&&(Object.entries(null!=i?i:{}).forEach(([e,t])=>{d.options[e]=t}),c())},getState:()=>u,subscribe:e=>(p({},l.length+1),l.push(e),e(u),()=>{let t=l.indexOf(e);t>=0&&(p({},l.length-1),l.splice(t,1))})}})({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(ab.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(ab.DEFAULT_DURATION)?+this.getAttribute(ab.DEFAULT_DURATION):void 0,defaultStreamType:null!=(e=this.getAttribute(ab.DEFAULT_STREAM_TYPE))?e:void 0,liveEdgeOffset:this.hasAttribute(ab.LIVE_EDGE_OFFSET)?+this.getAttribute(ab.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(ab.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(ab.SEEK_TO_LIVE_OFFSET):this.hasAttribute(ab.LIVE_EDGE_OFFSET)?+this.getAttribute(ab.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(ab.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(ab.NO_VOLUME_PREF),noMutedPref:this.hasAttribute(ab.NO_MUTED_PREF),noSubtitlesLangPref:this.hasAttribute(ab.NO_SUBTITLES_LANG_PREF)}})},F=new WeakSet,$=function(e){let{key:t,shiftKey:i}=e;if(!(i&&("/"===t||"?"===t)||av.includes(t)))return void this.removeEventListener("keyup",aE(this,F,$));this.keyboardShortcutHandler(e)},B=new WeakSet,K=function(e){var t;let{metaKey:i,altKey:a,key:r,shiftKey:s}=e,n=s&&("/"===r||"?"===r);if(n&&(null==(t=ac(this,x))?void 0:t.open)||i||a||!n&&!av.includes(r))return void this.removeEventListener("keyup",aE(this,F,$));let o=e.target,l=o instanceof HTMLElement&&("media-volume-range"===o.tagName.toLowerCase()||"media-time-range"===o.tagName.toLowerCase());![" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(r)||ac(this,C).contains(`no${r.toLowerCase()}`)||" "===r&&ac(this,C).contains("nospace")||l||e.preventDefault(),this.addEventListener("keyup",aE(this,F,$),{once:!0})},G=new WeakSet,q=function(){ac(this,x)||(ap(this,x,ii.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(ac(this,x))),ac(this,x).open=!0};let af=Object.values(tV),aA=Object.values(tP),a_=e=>{var t,i,a,r;let{observedAttributes:s}=e.constructor;!s&&(null==(t=e.nodeName)?void 0:t.includes("-"))&&(it.customElements.upgrade(e),{observedAttributes:s}=e.constructor);let n=null==(r=null==(a=null==(i=null==e?void 0:e.getAttribute)?void 0:i.call(e,tx.MEDIA_CHROME_ATTRIBUTES))?void 0:a.split)?void 0:r.call(a,/\s+/);return Array.isArray(s||n)?(s||n).filter(e=>af.includes(e)):[]},aT=e=>(e=>{var t,i;return(null==(t=e.nodeName)?void 0:t.includes("-"))&&it.customElements.get(null==(i=e.nodeName)?void 0:i.toLowerCase())&&!(e instanceof it.customElements.get(e.nodeName.toLowerCase()))&&it.customElements.upgrade(e),aA.some(t=>t in e)})(e)||!!a_(e).length,ay=e=>{var t;return null==(t=null==e?void 0:e.join)?void 0:t.call(e,":")},aI={[tV.MEDIA_SUBTITLES_LIST]:iq,[tV.MEDIA_SUBTITLES_SHOWING]:iq,[tV.MEDIA_SEEKABLE]:ay,[tV.MEDIA_BUFFERED]:e=>null==e?void 0:e.map(ay).join(" "),[tV.MEDIA_PREVIEW_COORDS]:e=>null==e?void 0:e.join(" "),[tV.MEDIA_RENDITION_LIST]:function(e){return null==e?void 0:e.map(tQ).join(" ")},[tV.MEDIA_AUDIO_TRACK_LIST]:function(e){return null==e?void 0:e.map(tY).join(" ")}},aw=async(e,t,i)=>{var a,r;if(e.isConnected||await tz(0),"boolean"==typeof i||null==i)return i_(e,t,i);if("number"==typeof i)return ig(e,t,i);if("string"==typeof i)return iy(e,t,i);if(Array.isArray(i)&&!i.length)return e.removeAttribute(t);let s=null!=(r=null==(a=aI[t])?void 0:a.call(aI,i))?r:i;return e.setAttribute(t,s)},aS=(e,t)=>{if((e=>{var t;return!!(null==(t=e.closest)?void 0:t.call(e,'*[slot="media"]'))})(e))return;let i=(e,t)=>{var i,a;aT(e)&&t(e);let{children:r=[]}=null!=e?e:{};[...r,...null!=(a=null==(i=null==e?void 0:e.shadowRoot)?void 0:i.children)?a:[]].forEach(e=>aS(e,t))},a=null==e?void 0:e.nodeName.toLowerCase();if(a.includes("-")&&!aT(e))return void it.customElements.whenDefined(a).then(()=>{i(e,t)});i(e,t)},ak=(e,t,i)=>{e.forEach(e=>{if(t in e){e[t]=i;return}let a=a_(e),r=t.toLowerCase();a.includes(r)&&aw(e,r,i)})},aL=(e,t,i)=>{aS(e,t);let a=e=>{var i;t(null!=(i=null==e?void 0:e.composedPath()[0])?i:e.target)},r=e=>{var t;i(null!=(t=null==e?void 0:e.composedPath()[0])?t:e.target)};e.addEventListener(tN.REGISTER_MEDIA_STATE_RECEIVER,a),e.addEventListener(tN.UNREGISTER_MEDIA_STATE_RECEIVER,r);let s=[],n=e=>{let a=e.target;"media"!==a.name&&(s.forEach(e=>aS(e,i)),(s=[...a.assignedElements({flatten:!0})]).forEach(e=>aS(e,t)))};e.addEventListener("slotchange",n);let o=new MutationObserver(e=>{e.forEach(e=>{let{addedNodes:a=[],removedNodes:r=[],type:s,target:n,attributeName:o}=e;"childList"===s?(Array.prototype.forEach.call(a,e=>aS(e,t)),Array.prototype.forEach.call(r,e=>aS(e,i))):"attributes"===s&&o===tx.MEDIA_CHROME_ATTRIBUTES&&(aT(n)?t(n):i(n))})});return o.observe(e,{childList:!0,attributes:!0,subtree:!0}),()=>{aS(e,i),e.removeEventListener("slotchange",n),o.disconnect(),e.removeEventListener(tN.REGISTER_MEDIA_STATE_RECEIVER,a),e.removeEventListener(tN.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};it.customElements.get("media-controller")||it.customElements.define("media-controller",ag);let aM={PLACEMENT:"placement",BOUNDS:"bounds"};class aR extends it.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!ip(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let t=this.placement;if("left"===t||"right"===t)return void this.style.removeProperty("--media-tooltip-offset-x");let i=getComputedStyle(this),a=null!=(e=im(this,"#"+this.bounds))?e:function(e){var t;return null!=(t=function(e){var t;let{MEDIA_CONTROLLER:i}=tx,a=e.getAttribute(i);if(a)return null==(t=function(e){var t;let i=null==(t=null==e?void 0:e.getRootNode)?void 0:t.call(e);return i instanceof ShadowRoot||i instanceof Document?i:null}(e))?void 0:t.getElementById(a)}(e))?t:im(e,"media-controller")}(this);if(!a)return;let{x:r,width:s}=a.getBoundingClientRect(),{x:n,width:o}=this.getBoundingClientRect(),l=i.getPropertyValue("--media-tooltip-offset-x"),d=l?parseFloat(l.replace("px","")):0,u=i.getPropertyValue("--media-tooltip-container-margin"),h=u?parseFloat(u.replace("px","")):0,c=n-r+d-h,m=n+o-(r+s)+d+h;return c<0?void this.style.setProperty("--media-tooltip-offset-x",`${c}px`):m>0?void this.style.setProperty("--media-tooltip-offset-x",`${m}px`):void this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){let e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[aM.PLACEMENT,aM.BOUNDS]}get placement(){return iT(this,aM.PLACEMENT)}set placement(e){iy(this,aM.PLACEMENT,e)}get bounds(){return iT(this,aM.BOUNDS)}set bounds(e){iy(this,aM.BOUNDS,e)}}aR.shadowRootOptions={mode:"open"},aR.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `},it.customElements.get("media-tooltip")||it.customElements.define("media-tooltip",aR);var aD=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aC=(e,t,i)=>(aD(e,t,"read from private field"),i?i.call(e):t.get(e)),aO=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},aN=(e,t,i,a)=>(aD(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let ax={TOOLTIP_PLACEMENT:"tooltipplacement",DISABLED:"disabled",NO_TOOLTIP:"notooltip"};class aP extends it.HTMLElement{constructor(){if(super(),aO(this,X),aO(this,Q,void 0),this.preventClick=!1,this.tooltipEl=null,aO(this,Y,e=>{this.preventClick||this.handleClick(e),setTimeout(aC(this,j),0)}),aO(this,j,()=>{var e,t;null==(t=null==(e=this.tooltipEl)?void 0:e.updateXOffset)||t.call(e)}),aO(this,z,e=>{let{key:t}=e;if(!this.keysUsed.includes(t))return void this.removeEventListener("keyup",aC(this,z));this.preventClick||this.handleClick(e)}),aO(this,Z,e=>{let{metaKey:t,altKey:i,key:a}=e;if(t||i||!this.keysUsed.includes(a))return void this.removeEventListener("keyup",aC(this,z));this.addEventListener("keyup",aC(this,z),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",ax.TOOLTIP_PLACEMENT,tx.MEDIA_CONTROLLER,tV.MEDIA_LANG]}enable(){this.addEventListener("click",aC(this,Y)),this.addEventListener("keydown",aC(this,Z)),this.tabIndex=0}disable(){this.removeEventListener("click",aC(this,Y)),this.removeEventListener("keydown",aC(this,Z)),this.removeEventListener("keyup",aC(this,z)),this.tabIndex=-1}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tx.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=aC(this,Q))?void 0:a.unassociateElement)||r.call(a,this),aN(this,Q,null)),i&&this.isConnected&&(aN(this,Q,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=aC(this,Q))?void 0:n.associateElement)||o.call(n,this))):"disabled"===e&&i!==t?null==i?this.enable():this.disable():e===ax.TOOLTIP_PLACEMENT&&this.tooltipEl&&i!==t?this.tooltipEl.placement=i:e===tV.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),aC(this,j).call(this)}connectedCallback(){var e,t,i;let{style:a}=iE(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");let r=this.getAttribute(tx.MEDIA_CONTROLLER);r&&(aN(this,Q,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=aC(this,Q))?void 0:t.associateElement)||i.call(t,this)),it.customElements.whenDefined("media-tooltip").then(()=>{var e,t;return(e=X,t=J,aD(this,e,"access private method"),t).call(this)})}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=aC(this,Q))?void 0:e.unassociateElement)||t.call(e,this),aN(this,Q,null),this.removeEventListener("mouseenter",aC(this,j)),this.removeEventListener("focus",aC(this,j)),this.removeEventListener("click",aC(this,Y))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return iT(this,ax.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){iy(this,ax.TOOLTIP_PLACEMENT,e)}get mediaController(){return iT(this,tx.MEDIA_CONTROLLER)}set mediaController(e){iy(this,tx.MEDIA_CONTROLLER,e)}get disabled(){return iA(this,ax.DISABLED)}set disabled(e){i_(this,ax.DISABLED,e)}get noTooltip(){return iA(this,ax.NO_TOOLTIP)}set noTooltip(e){i_(this,ax.NO_TOOLTIP,e)}handleClick(e){}}Q=new WeakMap,Y=new WeakMap,j=new WeakMap,z=new WeakMap,Z=new WeakMap,X=new WeakSet,J=function(){this.addEventListener("mouseenter",aC(this,j)),this.addEventListener("focus",aC(this,j)),this.addEventListener("click",aC(this,Y));let e=this.tooltipPlacement;e&&this.tooltipEl&&(this.tooltipEl.placement=e)},aP.shadowRootOptions={mode:"open"},aP.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${aR.shadowRootOptions.mode}">
          ${aR.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(e)}
        </slot>
      </media-tooltip>
    </slot>
  `},aP.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},aP.getTooltipContentHTML=function(){return""},it.customElements.get("media-chrome-button")||it.customElements.define("media-chrome-button",aP);let aU=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`,aV=e=>{let t=e.mediaIsAirplaying?t2("stop airplay"):t2("start airplay");e.setAttribute("aria-label",t)};class aH extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_IS_AIRPLAYING,tV.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),aV(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_IS_AIRPLAYING&&aV(this)}get mediaIsAirplaying(){return iA(this,tV.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){i_(this,tV.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return iT(this,tV.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){iy(this,tV.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new it.CustomEvent(tN.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}aH.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tV.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tV.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tV.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${tV.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${aU}</slot>
      <slot name="exit">${aU}</slot>
    </slot>
  `},aH.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${t2("start airplay")}</slot>
    <slot name="tooltip-exit">${t2("stop airplay")}</slot>
  `},it.customElements.get("media-airplay-button")||it.customElements.define("media-airplay-button",aH);let aW=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,aF=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,a$=e=>{e.setAttribute("aria-checked",(e=>{var t;return!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)||e.hasAttribute(tV.MEDIA_SUBTITLES_SHOWING)})(e).toString())};class aB extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_SUBTITLES_LIST,tV.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","switch"),this.setAttribute("aria-label",t2("closed captions")),a$(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_SUBTITLES_SHOWING&&a$(this)}get mediaSubtitlesList(){return aK(this,tV.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){aG(this,tV.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return aK(this,tV.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){aG(this,tV.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new it.CustomEvent(tN.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}aB.getSlotTemplateHTML=function(e){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${aW}</slot>
      <slot name="off">${aF}</slot>
    </slot>
  `},aB.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enable">${t2("Enable captions")}</slot>
    <slot name="tooltip-disable">${t2("Disable captions")}</slot>
  `};let aK=(e,t)=>{let i=e.getAttribute(t);return i?iB(i):[]},aG=(e,t,i)=>{if(!(null==i?void 0:i.length))return void e.removeAttribute(t);let a=iq(i);e.getAttribute(t)!==a&&e.setAttribute(t,a)};it.customElements.get("media-captions-button")||it.customElements.define("media-captions-button",aB);let aq=e=>{let t=e.mediaIsCasting?t2("stop casting"):t2("start casting");e.setAttribute("aria-label",t)};class aQ extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_IS_CASTING,tV.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),aq(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_IS_CASTING&&aq(this)}get mediaIsCasting(){return iA(this,tV.MEDIA_IS_CASTING)}set mediaIsCasting(e){i_(this,tV.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return iT(this,tV.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){iy(this,tV.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?tN.MEDIA_EXIT_CAST_REQUEST:tN.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new it.CustomEvent(e,{composed:!0,bubbles:!0}))}}aQ.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tV.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tV.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tV.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${tV.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg></slot>
      <slot name="exit"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg></slot>
    </slot>
  `},aQ.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${t2("Start casting")}</slot>
    <slot name="tooltip-exit">${t2("Stop casting")}</slot>
  `},it.customElements.get("media-cast-button")||it.customElements.define("media-cast-button",aQ);var aY=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aj=(e,t,i)=>(aY(e,t,"read from private field"),i?i.call(e):t.get(e)),az=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},aZ=(e,t,i,a)=>(aY(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),aX=(e,t,i)=>(aY(e,t,"access private method"),i);let aJ={OPEN:"open",ANCHOR:"anchor"};class a0 extends it.HTMLElement{constructor(){super(),az(this,ea),az(this,es),az(this,eo),az(this,ed),az(this,eh),az(this,em),az(this,ee,!1),az(this,et,null),az(this,ei,null),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}static get observedAttributes(){return[aJ.OPEN,aJ.ANCHOR]}get open(){return iA(this,aJ.OPEN)}set open(e){i_(this,aJ.OPEN,e)}handleEvent(e){switch(e.type){case"invoke":aX(this,ed,eu).call(this,e);break;case"focusout":aX(this,eh,ec).call(this,e);break;case"keydown":aX(this,em,ep).call(this,e)}}connectedCallback(){aX(this,ea,er).call(this),this.role||(this.role="dialog")}attributeChangedCallback(e,t,i){aX(this,ea,er).call(this),e===aJ.OPEN&&i!==t&&(this.open?aX(this,es,en).call(this):aX(this,eo,el).call(this))}focus(){aZ(this,et,function e(t=document){var i;let a=null==t?void 0:t.activeElement;return a?null!=(i=e(a.shadowRoot))?i:a:null}());let e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),t=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||t)return;let i=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==i||i.focus()}get keysUsed(){return["Escape","Tab"]}}ee=new WeakMap,et=new WeakMap,ei=new WeakMap,ea=new WeakSet,er=function(){if(!aj(this,ee)&&(aZ(this,ee,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e),queueMicrotask(()=>{let{style:e}=iE(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}},es=new WeakSet,en=function(){var e;null==(e=aj(this,ei))||e.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})},eo=new WeakSet,el=function(){var e;null==(e=aj(this,ei))||e.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))},ed=new WeakSet,eu=function(e){aZ(this,ei,e.relatedTarget),ic(this,e.relatedTarget)||(this.open=!this.open)},eh=new WeakSet,ec=function(e){var t;!ic(this,e.relatedTarget)&&(null==(t=aj(this,et))||t.focus(),aj(this,ei)&&aj(this,ei)!==e.relatedTarget&&this.open&&(this.open=!1))},em=new WeakSet,ep=function(e){var t,i,a,r,s;let{key:n,ctrlKey:o,altKey:l,metaKey:d}=e;o||l||d||this.keysUsed.includes(n)&&(e.preventDefault(),e.stopPropagation(),"Tab"===n?(e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()):"Escape"===n&&(null==(s=aj(this,et))||s.focus(),this.open=!1))},a0.shadowRootOptions={mode:"open"},a0.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(e)}
  `},a0.getSlotTemplateHTML=function(e){return`
    <slot id="content"></slot>
  `},it.customElements.get("media-chrome-dialog")||it.customElements.define("media-chrome-dialog",a0);var a1=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},a2=(e,t,i)=>(a1(e,t,"read from private field"),i?i.call(e):t.get(e)),a5=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},a3=(e,t,i,a)=>(a1(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),a4=(e,t,i)=>(a1(e,t,"access private method"),i);class a7 extends it.HTMLElement{constructor(){if(super(),a5(this,eI),a5(this,eS),a5(this,eL),a5(this,eR),a5(this,eC),a5(this,eN),a5(this,eP),a5(this,eV),a5(this,eE,void 0),a5(this,ev,void 0),a5(this,eb,void 0),a5(this,eg,void 0),a5(this,ef,{}),a5(this,eA,[]),a5(this,e_,()=>{if(this.range.matches(":focus-visible")){let{style:e}=iE(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),a5(this,eT,()=>{let{style:e}=iE(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),a5(this,ey,()=>{let e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.container=this.shadowRoot.querySelector("#container"),a3(this,eb,this.shadowRoot.querySelector("#startpoint")),a3(this,eg,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",tx.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tx.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=a2(this,eE))?void 0:a.unassociateElement)||r.call(a,this),a3(this,eE,null)),i&&this.isConnected&&(a3(this,eE,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=a2(this,eE))?void 0:n.associateElement)||o.call(n,this))):("disabled"===e||"aria-disabled"===e&&t!==i)&&(null==i?(this.range.removeAttribute(e),a4(this,eS,ek).call(this)):(this.range.setAttribute(e,i),a4(this,eL,eM).call(this)))}connectedCallback(){var e,t,i;let{style:a}=iE(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),a2(this,ef).pointer=iE(this.shadowRoot,"#pointer"),a2(this,ef).progress=iE(this.shadowRoot,"#progress"),a2(this,ef).thumb=iE(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),a2(this,ef).activeSegment=iE(this.shadowRoot,"#segments-clipping rect:nth-child(0)");let r=this.getAttribute(tx.MEDIA_CONTROLLER);r&&(a3(this,eE,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=a2(this,eE))?void 0:t.associateElement)||i.call(t,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",a2(this,e_)),this.shadowRoot.addEventListener("focusout",a2(this,eT)),a4(this,eS,ek).call(this),io(this.container,a2(this,ey))}disconnectedCallback(){var e,t;a4(this,eL,eM).call(this),null==(t=null==(e=a2(this,eE))?void 0:e.unassociateElement)||t.call(e,this),a3(this,eE,null),this.shadowRoot.removeEventListener("focusin",a2(this,e_)),this.shadowRoot.removeEventListener("focusout",a2(this,eT)),il(this.container,a2(this,ey))}updatePointerBar(e){var t;null==(t=a2(this,ef).pointer)||t.style.setProperty("width",`${100*this.getPointerRatio(e)}%`)}updateBar(){var e,t;let i=100*this.range.valueAsNumber;null==(e=a2(this,ef).progress)||e.style.setProperty("width",`${i}%`),null==(t=a2(this,ef).thumb)||t.style.setProperty("left",`${i}%`)}updateSegments(e){let t=this.shadowRoot.querySelector("#segments-clipping");if(t.textContent="",this.container.classList.toggle("segments",!!(null==e?void 0:e.length)),!(null==e?void 0:e.length))return;let i=[...new Set([+this.range.min,...e.flatMap(e=>[e.start,e.end]),+this.range.max])];a3(this,eA,[...i]);let a=i.pop();for(let[e,r]of i.entries()){let[s,n]=[0===e,e===i.length-1],o=s?"calc(var(--segments-gap) / -1)":`${100*r}%`,l=n?a:i[e+1],d=`calc(${(l-r)*100}%${s||n?"":" - var(--segments-gap)"})`,u=ii.createElementNS("http://www.w3.org/2000/svg","rect"),h=iv(this.shadowRoot,`#segments-clipping rect:nth-child(${e+1})`);h.style.setProperty("x",o),h.style.setProperty("width",d),t.append(u)}}getPointerRatio(e){return function(e,t,i,a){let r=a.x-i.x,s=a.y-i.y,n=r*r+s*s;return 0===n?0:Math.max(0,Math.min(1,((e-i.x)*r+(t-i.y)*s)/n))}(e.clientX,e.clientY,a2(this,eb).getBoundingClientRect(),a2(this,eg).getBoundingClientRect())}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":a4(this,eV,eH).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":a4(this,eC,eO).call(this,e);break;case"pointerdown":a4(this,eR,eD).call(this,e);break;case"pointerup":a4(this,eN,ex).call(this);break;case"pointerleave":a4(this,eP,eU).call(this)}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}eE=new WeakMap,ev=new WeakMap,eb=new WeakMap,eg=new WeakMap,ef=new WeakMap,eA=new WeakMap,e_=new WeakMap,eT=new WeakMap,ey=new WeakMap,eI=new WeakSet,ew=function(e){let t=a2(this,ef).activeSegment;if(!t)return;let i=this.getPointerRatio(e),a=a2(this,eA).findIndex((e,t,a)=>{let r=a[t+1];return null!=r&&i>=e&&i<=r}),r=`#segments-clipping rect:nth-child(${a+1})`;t.selectorText==r&&t.style.transform||(t.selectorText=r,t.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))},eS=new WeakSet,ek=function(){this.hasAttribute("disabled")||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))},eL=new WeakSet,eM=function(){var e,t;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),null==(e=it.window)||e.removeEventListener("pointerup",this),null==(t=it.window)||t.removeEventListener("pointermove",this)},eR=new WeakSet,eD=function(e){var t;a3(this,ev,e.composedPath().includes(this.range)),null==(t=it.window)||t.addEventListener("pointerup",this)},eC=new WeakSet,eO=function(e){var t;"mouse"!==e.pointerType&&a4(this,eR,eD).call(this,e),this.addEventListener("pointerleave",this),null==(t=it.window)||t.addEventListener("pointermove",this)},eN=new WeakSet,ex=function(){var e;null==(e=it.window)||e.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")},eP=new WeakSet,eU=function(){var e,t;this.removeEventListener("pointerleave",this),null==(e=it.window)||e.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),null==(t=a2(this,ef).activeSegment)||t.style.removeProperty("transform")},eV=new WeakSet,eH=function(e){("pen"!==e.pointerType||0!==e.buttons)&&(this.toggleAttribute("dragging",1===e.buttons||"mouse"!==e.pointerType),this.updatePointerBar(e),a4(this,eI,ew).call(this,e),this.dragging&&("mouse"!==e.pointerType||!a2(this,ev))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(e),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))},a7.shadowRootOptions={mode:"open"},a7.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, -7px);
        height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, -5px);
          height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
      <input id="range" type="range" min="0" max="1" step="any" value="0">
    </div>
    <div id="rightgap"></div>
  `},it.customElements.get("media-chrome-range")||it.customElements.define("media-chrome-range",a7);var a8=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},a6=(e,t,i)=>(a8(e,t,"read from private field"),i?i.call(e):t.get(e)),a9=(e,t,i,a)=>(a8(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class re extends it.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,eW,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tx.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tx.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=a6(this,eW))?void 0:a.unassociateElement)||r.call(a,this),a9(this,eW,null)),i&&this.isConnected&&(a9(this,eW,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=a6(this,eW))?void 0:n.associateElement)||o.call(n,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(tx.MEDIA_CONTROLLER);a&&(a9(this,eW,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=a6(this,eW))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=a6(this,eW))?void 0:e.unassociateElement)||t.call(e,this),a9(this,eW,null)}}eW=new WeakMap,re.shadowRootOptions={mode:"open"},re.getTemplateHTML=function(e){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `},it.customElements.get("media-control-bar")||it.customElements.define("media-control-bar",re);var rt=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ri=(e,t,i)=>(rt(e,t,"read from private field"),i?i.call(e):t.get(e)),ra=(e,t,i,a)=>(rt(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class rr extends it.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,eF,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tx.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tx.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=ri(this,eF))?void 0:a.unassociateElement)||r.call(a,this),ra(this,eF,null)),i&&this.isConnected&&(ra(this,eF,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=ri(this,eF))?void 0:n.associateElement)||o.call(n,this)))}connectedCallback(){var e,t,i;let{style:a}=iE(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let r=this.getAttribute(tx.MEDIA_CONTROLLER);r&&(ra(this,eF,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=ri(this,eF))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=ri(this,eF))?void 0:e.unassociateElement)||t.call(e,this),ra(this,eF,null)}}eF=new WeakMap,rr.shadowRootOptions={mode:"open"},rr.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}
  `},rr.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},it.customElements.get("media-text-display")||it.customElements.define("media-text-display",rr);var rs=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rn=(e,t,i)=>(rs(e,t,"read from private field"),i?i.call(e):t.get(e));class ro extends rr{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,e$,void 0),((e,t,i,a)=>(rs(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,e$,this.shadowRoot.querySelector("slot")),rn(this,e$).textContent=tJ(null!=(e=this.mediaDuration)?e:0)}static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_DURATION]}attributeChangedCallback(e,t,i){e===tV.MEDIA_DURATION&&(rn(this,e$).textContent=tJ(+i)),super.attributeChangedCallback(e,t,i)}get mediaDuration(){return ib(this,tV.MEDIA_DURATION)}set mediaDuration(e){ig(this,tV.MEDIA_DURATION,e)}}e$=new WeakMap,ro.getSlotTemplateHTML=function(e,t){return`
    <slot>${tJ(t.mediaDuration)}</slot>
  `},it.customElements.get("media-duration-display")||it.customElements.define("media-duration-display",ro);let rl={2:t2("Network Error"),3:t2("Decode Error"),4:t2("Source Not Supported"),5:t2("Encryption Error")},rd={2:t2("A network error caused the media download to fail."),3:t2("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:t2("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:t2("The media is encrypted and there are no keys to decrypt it.")},ru=e=>{var t,i;return 1===e.code?null:{title:null!=(t=rl[e.code])?t:`Error ${e.code}`,message:null!=(i=rd[e.code])?i:e.message}};var rh=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};function rc(e){var t;let{title:i,message:a}=null!=(t=ru(e))?t:{},r="";return i&&(r+=`<slot name="error-${e.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${e.code}-message"><p>${a}</p></slot>`),r}let rm=[tV.MEDIA_ERROR_CODE,tV.MEDIA_ERROR_MESSAGE];class rp extends a0{constructor(){super(...arguments),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,eB,null)}static get observedAttributes(){return[...super.observedAttributes,...rm]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,t,i){var a;if(super.attributeChangedCallback(e,t,i),!rm.includes(e))return;let r=null!=(a=this.mediaError)?a:{code:this.mediaErrorCode,message:this.mediaErrorMessage};this.open=r.code&&null!==ru(r),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(r))}get mediaError(){var e,t;return rh(this,e=eB,"read from private field"),t?t.call(this):e.get(this)}set mediaError(e){var t,i;rh(this,t=eB,"write to private field"),i?i.call(this,e):t.set(this,e)}get mediaErrorCode(){return ib(this,"mediaerrorcode")}set mediaErrorCode(e){ig(this,"mediaerrorcode",e)}get mediaErrorMessage(){return iT(this,"mediaerrormessage")}set mediaErrorMessage(e){iy(this,"mediaerrormessage",e)}}eB=new WeakMap,rp.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${e.mediaerrorcode}" id="content">
      ${rc({code:+e.mediaerrorcode,message:e.mediaerrormessage})}
    </slot>
  `},rp.formatErrorMessage=rc,it.customElements.get("media-error-dialog")||it.customElements.define("media-error-dialog",rp);var rE=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot read from private field");return i?i.call(e):t.get(e)},rv=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)};class rb extends a0{constructor(){super(...arguments),rv(this,eK,e=>{var t;if(!this.open)return;let i=null==(t=this.shadowRoot)?void 0:t.querySelector("#content");if(!i)return;let a=e.composedPath(),r=a[0]===this||a.includes(this),s=a.includes(i);r&&!s&&(this.open=!1)}),rv(this,eG,e=>{if(!this.open)return;let t=e.shiftKey&&("/"===e.key||"?"===e.key);"Escape"!==e.key&&!t||e.ctrlKey||e.altKey||e.metaKey||(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",rE(this,eK)),document.addEventListener("keydown",rE(this,eG)))}disconnectedCallback(){this.removeEventListener("click",rE(this,eK)),document.removeEventListener("keydown",rE(this,eG))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),"open"===e&&(this.open?(this.addEventListener("click",rE(this,eK)),document.addEventListener("keydown",rE(this,eG))):(this.removeEventListener("click",rE(this,eK)),document.removeEventListener("keydown",rE(this,eG))))}}eK=new WeakMap,eG=new WeakMap,rb.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${function(){let e=[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["←","j"],description:"Seek back 10s"},{keys:["→","l"],description:"Seek forward 10s"},{keys:["↑"],description:"Turn volume up"},{keys:["↓"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:e,description:t})=>{let i=e.map((e,t)=>t>0?`<span class="key-separator">or</span><span class="key">${e}</span>`:`<span class="key">${e}</span>`).join("");return`
      <tr>
        <td>
          <div class="key-combo">${i}</div>
        </td>
        <td class="description">${t}</td>
      </tr>
    `}).join("");return`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${e}</table>
  `}()}
    </slot>
  `},it.customElements.get("media-keyboard-shortcuts-dialog")||it.customElements.define("media-keyboard-shortcuts-dialog",rb);var rg=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};let rf=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,rA=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`,r_=e=>{let t=e.mediaIsFullscreen?t2("exit fullscreen mode"):t2("enter fullscreen mode");e.setAttribute("aria-label",t)};class rT extends aP{constructor(){super(...arguments),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,eq,null)}static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_IS_FULLSCREEN,tV.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),r_(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_IS_FULLSCREEN&&r_(this)}get mediaFullscreenUnavailable(){return iT(this,tV.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){iy(this,tV.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return iA(this,tV.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){i_(this,tV.MEDIA_IS_FULLSCREEN,e)}handleClick(e){var t,i,a,r;rg(this,t=eq,"write to private field"),i?i.call(this,e):t.set(this,e);let s=(rg(this,a=eq,"read from private field"),(r?r.call(this):a.get(this))instanceof PointerEvent),n=this.mediaIsFullscreen?new it.CustomEvent(tN.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new it.CustomEvent(tN.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:s});this.dispatchEvent(n)}}eq=new WeakMap,rT.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tV.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tV.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tV.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${tV.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${rf}</slot>
      <slot name="exit">${rA}</slot>
    </slot>
  `},rT.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${t2("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${t2("Exit fullscreen mode")}</slot>
  `},it.customElements.get("media-fullscreen-button")||it.customElements.define("media-fullscreen-button",rT);let{MEDIA_TIME_IS_LIVE:ry,MEDIA_PAUSED:rI}=tV,{MEDIA_SEEK_TO_LIVE_REQUEST:rw,MEDIA_PLAY_REQUEST:rS}=tN,rk=e=>{var t;let i=e.mediaPaused||!e.mediaTimeIsLive,a=i?t2("seek to live"):t2("playing live");e.setAttribute("aria-label",a);let r=null==(t=e.shadowRoot)?void 0:t.querySelector('slot[name="text"]');r&&(r.textContent=t2("live")),i?e.removeAttribute("aria-disabled"):e.setAttribute("aria-disabled","true")};class rL extends aP{static get observedAttributes(){return[...super.observedAttributes,ry,rI]}connectedCallback(){super.connectedCallback(),rk(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),rk(this)}get mediaPaused(){return iA(this,tV.MEDIA_PAUSED)}set mediaPaused(e){i_(this,tV.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return iA(this,tV.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){i_(this,tV.MEDIA_TIME_IS_LIVE,e)}handleClick(){(this.mediaPaused||!this.mediaTimeIsLive)&&(this.dispatchEvent(new it.CustomEvent(rw,{composed:!0,bubbles:!0})),this.hasAttribute(rI)&&this.dispatchEvent(new it.CustomEvent(rS,{composed:!0,bubbles:!0})))}}rL.getSlotTemplateHTML=function(e){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${ry}]:not([${rI}])) slot[name=indicator] > *,
      :host([${ry}]:not([${rI}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${ry}]:not([${rI}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator"><svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg></slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${t2("live")}</slot>
  `},it.customElements.get("media-live-button")||it.customElements.define("media-live-button",rL);var rM=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rR=(e,t,i)=>(rM(e,t,"read from private field"),i?i.call(e):t.get(e)),rD=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rC=(e,t,i,a)=>(rM(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let rO={LOADING_DELAY:"loadingdelay",NO_AUTOHIDE:"noautohide"},rN=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;class rx extends it.HTMLElement{constructor(){if(super(),rD(this,eQ,void 0),rD(this,eY,500),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tx.MEDIA_CONTROLLER,tV.MEDIA_PAUSED,tV.MEDIA_LOADING,rO.LOADING_DELAY]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===rO.LOADING_DELAY&&t!==i?this.loadingDelay=Number(i):e===tx.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=rR(this,eQ))?void 0:a.unassociateElement)||r.call(a,this),rC(this,eQ,null)),i&&this.isConnected&&(rC(this,eQ,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=rR(this,eQ))?void 0:n.associateElement)||o.call(n,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(tx.MEDIA_CONTROLLER);a&&(rC(this,eQ,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=rR(this,eQ))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=rR(this,eQ))?void 0:e.unassociateElement)||t.call(e,this),rC(this,eQ,null)}get loadingDelay(){return rR(this,eY)}set loadingDelay(e){rC(this,eY,e);let{style:t}=iE(this.shadowRoot,":host");t.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return iA(this,tV.MEDIA_PAUSED)}set mediaPaused(e){i_(this,tV.MEDIA_PAUSED,e)}get mediaLoading(){return iA(this,tV.MEDIA_LOADING)}set mediaLoading(e){i_(this,tV.MEDIA_LOADING,e)}get mediaController(){return iT(this,tx.MEDIA_CONTROLLER)}set mediaController(e){iy(this,tx.MEDIA_CONTROLLER,e)}get noAutohide(){return iA(this,rO.NO_AUTOHIDE)}set noAutohide(e){i_(this,rO.NO_AUTOHIDE,e)}}eQ=new WeakMap,eY=new WeakMap,rx.shadowRootOptions={mode:"open"},rx.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, 500ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${tV.MEDIA_LOADING}]:not([${tV.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${tV.MEDIA_LOADING}]:not([${tV.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${tV.MEDIA_LOADING}]:not([${tV.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${rN}</slot>
    <div id="status" role="status" aria-live="polite">${t2("media loading")}</div>
  `},it.customElements.get("media-loading-indicator")||it.customElements.define("media-loading-indicator",rx);let rP=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,rU=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,rV=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`,rH=e=>{let t="off"===e.mediaVolumeLevel?t2("unmute"):t2("mute");e.setAttribute("aria-label",t)};class rW extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),rH(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_VOLUME_LEVEL&&rH(this)}get mediaVolumeLevel(){return iT(this,tV.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){iy(this,tV.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e="off"===this.mediaVolumeLevel?tN.MEDIA_UNMUTE_REQUEST:tN.MEDIA_MUTE_REQUEST;this.dispatchEvent(new it.CustomEvent(e,{composed:!0,bubbles:!0}))}}rW.getSlotTemplateHTML=function(e){return`
    <style>
      :host(:not([${tV.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${tV.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${tV.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${tV.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${tV.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${tV.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${tV.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${rP}</slot>
      <slot name="low">${rU}</slot>
      <slot name="medium">${rU}</slot>
      <slot name="high">${rV}</slot>
    </slot>
  `},rW.getTooltipContentHTML=function(){return`
    <slot name="tooltip-mute">${t2("Mute")}</slot>
    <slot name="tooltip-unmute">${t2("Unmute")}</slot>
  `},it.customElements.get("media-mute-button")||it.customElements.define("media-mute-button",rW);let rF=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`,r$=e=>{let t=e.mediaIsPip?t2("exit picture in picture mode"):t2("enter picture in picture mode");e.setAttribute("aria-label",t)};class rB extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_IS_PIP,tV.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),r$(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_IS_PIP&&r$(this)}get mediaPipUnavailable(){return iT(this,tV.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){iy(this,tV.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return iA(this,tV.MEDIA_IS_PIP)}set mediaIsPip(e){i_(this,tV.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?tN.MEDIA_EXIT_PIP_REQUEST:tN.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new it.CustomEvent(e,{composed:!0,bubbles:!0}))}}rB.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tV.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${tV.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tV.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${tV.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${rF}</slot>
      <slot name="exit">${rF}</slot>
    </slot>
  `},rB.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${t2("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${t2("Exit picture in picture mode")}</slot>
  `},it.customElements.get("media-pip-button")||it.customElements.define("media-pip-button",rB);var rK=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot read from private field");return i?i.call(e):t.get(e)};let rG={RATES:"rates"},rq=[1,1.2,1.5,1.7,2];class rQ extends aP{constructor(){var e;super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,ej,new iF(this,rG.RATES,{defaultValue:rq})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${null!=(e=this.mediaPlaybackRate)?e:1}x`}static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_PLAYBACK_RATE,rG.RATES]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===rG.RATES&&(rK(this,ej).value=i),e===tV.MEDIA_PLAYBACK_RATE){let e=i?+i:NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",t2("Playback rate {playbackRate}",{playbackRate:t}))}}get rates(){return rK(this,ej)}set rates(e){e?Array.isArray(e)?rK(this,ej).value=e.join(" "):"string"==typeof e&&(rK(this,ej).value=e):rK(this,ej).value=""}get mediaPlaybackRate(){return ib(this,tV.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){ig(this,tV.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,t;let i=Array.from(rK(this,ej).values(),e=>+e).sort((e,t)=>e-t),a=null!=(t=null!=(e=i.find(e=>e>this.mediaPlaybackRate))?e:i[0])?t:1,r=new it.CustomEvent(tN.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:a});this.dispatchEvent(r)}}ej=new WeakMap,rQ.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${e.mediaplaybackrate||1}x</slot>
  `},rQ.getTooltipContentHTML=function(){return t2("Playback rate")},it.customElements.get("media-playback-rate-button")||it.customElements.define("media-playback-rate-button",rQ);let rY=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,rj=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`,rz=e=>{let t=e.mediaPaused?t2("play"):t2("pause");e.setAttribute("aria-label",t)};class rZ extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_PAUSED,tV.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),rz(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),(e===tV.MEDIA_PAUSED||e===tV.MEDIA_LANG)&&rz(this)}get mediaPaused(){return iA(this,tV.MEDIA_PAUSED)}set mediaPaused(e){i_(this,tV.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?tN.MEDIA_PLAY_REQUEST:tN.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new it.CustomEvent(e,{composed:!0,bubbles:!0}))}}rZ.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tV.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${tV.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${tV.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${tV.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${rY}</slot>
      <slot name="pause">${rj}</slot>
    </slot>
  `},rZ.getTooltipContentHTML=function(){return`
    <slot name="tooltip-play">${t2("Play")}</slot>
    <slot name="tooltip-pause">${t2("Pause")}</slot>
  `},it.customElements.get("media-play-button")||it.customElements.define("media-play-button",rZ);let rX={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"};class rJ extends it.HTMLElement{static get observedAttributes(){return[rX.PLACEHOLDER_SRC,rX.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,t,i){if(e===rX.SRC&&(null==i?this.image.removeAttribute(rX.SRC):this.image.setAttribute(rX.SRC,i)),e===rX.PLACEHOLDER_SRC)if(null==i)this.image.style.removeProperty("background-image");else{var a;a=this.image,a.style["background-image"]=`url('${i}')`}}get placeholderSrc(){return iT(this,rX.PLACEHOLDER_SRC)}set placeholderSrc(e){iy(this,rX.SRC,e)}get src(){return iT(this,rX.SRC)}set src(e){iy(this,rX.SRC,e)}}rJ.shadowRootOptions={mode:"open"},rJ.getTemplateHTML=function(e){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `},it.customElements.get("media-poster-image")||it.customElements.define("media-poster-image",rJ);var r0=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)};class r1 extends rr{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,ez,void 0),((e,t,i,a)=>(r0(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,ez,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_PREVIEW_CHAPTER,tV.MEDIA_LANG]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),(e===tV.MEDIA_PREVIEW_CHAPTER||e===tV.MEDIA_LANG)&&i!==t&&null!=i){var a,r;if((r0(this,a=ez,"read from private field"),r?r.call(this):a.get(this)).textContent=i,""!==i){let e=t2("chapter: {chapterName}",{chapterName:i});this.setAttribute("aria-valuetext",e)}else this.removeAttribute("aria-valuetext")}}get mediaPreviewChapter(){return iT(this,tV.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){iy(this,tV.MEDIA_PREVIEW_CHAPTER,e)}}ez=new WeakMap,it.customElements.get("media-preview-chapter-display")||it.customElements.define("media-preview-chapter-display",r1);var r2=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},r5=(e,t,i)=>(r2(e,t,"read from private field"),i?i.call(e):t.get(e)),r3=(e,t,i,a)=>(r2(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class r4 extends it.HTMLElement{constructor(){if(super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,eZ,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=id(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tx.MEDIA_CONTROLLER,tV.MEDIA_PREVIEW_IMAGE,tV.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,t,i;let a=this.getAttribute(tx.MEDIA_CONTROLLER);a&&(r3(this,eZ,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=r5(this,eZ))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=r5(this,eZ))?void 0:e.unassociateElement)||t.call(e,this),r3(this,eZ,null)}attributeChangedCallback(e,t,i){var a,r,s,n,o;[tV.MEDIA_PREVIEW_IMAGE,tV.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===tx.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=r5(this,eZ))?void 0:a.unassociateElement)||r.call(a,this),r3(this,eZ,null)),i&&this.isConnected&&(r3(this,eZ,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=r5(this,eZ))?void 0:n.associateElement)||o.call(n,this)))}get mediaPreviewImage(){return iT(this,tV.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){iy(this,tV.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(tV.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(e=>+e)}set mediaPreviewCoords(e){if(!e)return void this.removeAttribute(tV.MEDIA_PREVIEW_COORDS);this.setAttribute(tV.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){let e=this.mediaPreviewCoords,t=this.mediaPreviewImage;if(!(e&&t))return;let[i,a,r,s]=e,n=t.split("#")[0],{maxWidth:o,maxHeight:l,minWidth:d,minHeight:u}=getComputedStyle(this),h=Math.min(parseInt(o)/r,parseInt(l)/s),c=Math.max(parseInt(d)/r,parseInt(u)/s),m=h<1,p=m?h:c>1?c:1,{style:E}=iE(this.shadowRoot,":host"),v=iE(this.shadowRoot,"img").style,b=this.shadowRoot.querySelector("img"),g=m?"min":"max";E.setProperty(`${g}-width`,"initial","important"),E.setProperty(`${g}-height`,"initial","important"),E.width=`${r*p}px`,E.height=`${s*p}px`;let f=()=>{v.width=`${this.imgWidth*p}px`,v.height=`${this.imgHeight*p}px`,v.display="block"};b.src!==n&&(b.onload=()=>{this.imgWidth=b.naturalWidth,this.imgHeight=b.naturalHeight,f()},b.src=n,f()),f(),v.transform=`translate(-${i*p}px, -${a*p}px)`}}eZ=new WeakMap,r4.shadowRootOptions={mode:"open"},r4.getTemplateHTML=function(e){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `},it.customElements.get("media-preview-thumbnail")||it.customElements.define("media-preview-thumbnail",r4);var r7=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},r8=(e,t,i)=>(r7(e,t,"read from private field"),i?i.call(e):t.get(e));class r6 extends rr{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,eX,void 0),((e,t,i,a)=>(r7(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,eX,this.shadowRoot.querySelector("slot")),r8(this,eX).textContent=tJ(0)}static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_PREVIEW_TIME&&null!=i&&(r8(this,eX).textContent=tJ(parseFloat(i)))}get mediaPreviewTime(){return ib(this,tV.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){ig(this,tV.MEDIA_PREVIEW_TIME,e)}}eX=new WeakMap,it.customElements.get("media-preview-time-display")||it.customElements.define("media-preview-time-display",r6);let r9={SEEK_OFFSET:"seekoffset"};class se extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_CURRENT_TIME,r9.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=ib(this,r9.SEEK_OFFSET,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===r9.SEEK_OFFSET&&(this.seekOffset=ib(this,r9.SEEK_OFFSET,30))}get seekOffset(){return ib(this,r9.SEEK_OFFSET,30)}set seekOffset(e){ig(this,r9.SEEK_OFFSET,e),this.setAttribute("aria-label",t2("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),iu(ih(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return ib(this,tV.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){ig(this,tV.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),t=new it.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}se.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${i}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`}</slot>
  `},se.getTooltipContentHTML=function(){return t2("Seek backward")},it.customElements.get("media-seek-backward-button")||it.customElements.define("media-seek-backward-button",se);let st={SEEK_OFFSET:"seekoffset"};class si extends aP{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_CURRENT_TIME,st.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=ib(this,st.SEEK_OFFSET,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===st.SEEK_OFFSET&&(this.seekOffset=ib(this,st.SEEK_OFFSET,30))}get seekOffset(){return ib(this,st.SEEK_OFFSET,30)}set seekOffset(e){ig(this,st.SEEK_OFFSET,e),this.setAttribute("aria-label",t2("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),iu(ih(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return ib(this,tV.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){ig(this,tV.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,t=new it.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}si.getSlotTemplateHTML=function(e,t){let i;return`
    <slot name="icon">${i=t.seekOffset,`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${i}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`}</slot>
  `},si.getTooltipContentHTML=function(){return t2("Seek forward")},it.customElements.get("media-seek-forward-button")||it.customElements.define("media-seek-forward-button",si);var sa=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sr=(e,t,i)=>(sa(e,t,"read from private field"),i?i.call(e):t.get(e));let ss={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},sn=[...Object.values(ss),tV.MEDIA_CURRENT_TIME,tV.MEDIA_DURATION,tV.MEDIA_SEEKABLE],so=["Enter"," "],sl="&nbsp;/&nbsp;",sd=(e,{timesSep:t=sl}={})=>{var i,a;let r=null!=(i=e.mediaCurrentTime)?i:0,[,s]=null!=(a=e.mediaSeekable)?a:[],n=0;Number.isFinite(e.mediaDuration)?n=e.mediaDuration:Number.isFinite(s)&&(n=s);let o=e.remaining?tJ(0-(n-r)):tJ(r);return e.showDuration?`${o}${t}${tJ(n)}`:o};class su extends rr{constructor(){super(),((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,eJ,void 0),((e,t,i,a)=>(sa(e,t,"write to private field"),a?a.call(e,i):t.set(e,i)))(this,eJ,this.shadowRoot.querySelector("slot")),sr(this,eJ).innerHTML=`${sd(this)}`}static get observedAttributes(){return[...super.observedAttributes,...sn,"disabled"]}connectedCallback(){let{style:e}=iE(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","progressbar"),this.setAttribute("aria-label",t2("playback time"));let t=e=>{let{key:i}=e;if(!so.includes(i))return void this.removeEventListener("keyup",t);this.toggleTimeDisplay()};this.addEventListener("keydown",e=>{let{metaKey:i,altKey:a,key:r}=e;if(i||a||!so.includes(r))return void this.removeEventListener("keyup",t);this.addEventListener("keyup",t)}),this.addEventListener("click",this.toggleTimeDisplay),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),super.disconnectedCallback()}attributeChangedCallback(e,t,i){sn.includes(e)?this.update():"disabled"===e&&i!==t&&(null==i?this.enable():this.disable()),super.attributeChangedCallback(e,t,i)}enable(){this.tabIndex=0}disable(){this.tabIndex=-1}get remaining(){return iA(this,ss.REMAINING)}set remaining(e){i_(this,ss.REMAINING,e)}get showDuration(){return iA(this,ss.SHOW_DURATION)}set showDuration(e){i_(this,ss.SHOW_DURATION,e)}get noToggle(){return iA(this,ss.NO_TOGGLE)}set noToggle(e){i_(this,ss.NO_TOGGLE,e)}get mediaDuration(){return ib(this,tV.MEDIA_DURATION)}set mediaDuration(e){ig(this,tV.MEDIA_DURATION,e)}get mediaCurrentTime(){return ib(this,tV.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){ig(this,tV.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(tV.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){if(null==e)return void this.removeAttribute(tV.MEDIA_SEEKABLE);this.setAttribute(tV.MEDIA_SEEKABLE,e.join(":"))}update(){let e=sd(this);(e=>{var t;let i=e.mediaCurrentTime,[,a]=null!=(t=e.mediaSeekable)?t:[],r=null;if(Number.isFinite(e.mediaDuration)?r=e.mediaDuration:Number.isFinite(a)&&(r=a),null==i||null===r)return e.setAttribute("aria-valuetext","video not loaded, unknown time.");let s=e.remaining?tX(0-(r-i)):tX(i);if(!e.showDuration)return e.setAttribute("aria-valuetext",s);let n=tX(r),o=`${s} of ${n}`;e.setAttribute("aria-valuetext",o)})(this),e!==sr(this,eJ).innerHTML&&(sr(this,eJ).innerHTML=e)}}eJ=new WeakMap,su.getSlotTemplateHTML=function(e,t){return`
    <slot>${sd(t)}</slot>
  `},it.customElements.get("media-time-display")||it.customElements.define("media-time-display",su);var sh=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sc=(e,t,i)=>(sh(e,t,"read from private field"),i?i.call(e):t.get(e)),sm=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sp=(e,t,i,a)=>(sh(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class sE{constructor(e,t,i){sm(this,e0,void 0),sm(this,e1,void 0),sm(this,e2,void 0),sm(this,e5,void 0),sm(this,e3,void 0),sm(this,e4,void 0),sm(this,e7,void 0),sm(this,e8,void 0),sm(this,e6,0),sm(this,e9,(e=performance.now())=>{sp(this,e6,requestAnimationFrame(sc(this,e9))),sp(this,e5,performance.now()-sc(this,e2));let t=1e3/this.fps;if(sc(this,e5)>t){sp(this,e2,e-sc(this,e5)%t);let i=1e3/((e-sc(this,e1))/++((e,t,i,a)=>({set _(value){sp(e,t,value,i)},get _(){return sc(e,t,a)}}))(this,e3)._),a=(e-sc(this,e4))/1e3/this.duration,r=sc(this,e7)+a*this.playbackRate;r-sc(this,e0).valueAsNumber>0?sp(this,e8,this.playbackRate/this.duration/i):(sp(this,e8,.995*sc(this,e8)),r=sc(this,e0).valueAsNumber+sc(this,e8)),this.callback(r)}}),sp(this,e0,e),this.callback=t,this.fps=i}start(){0===sc(this,e6)&&(sp(this,e2,performance.now()),sp(this,e1,sc(this,e2)),sp(this,e3,0),sc(this,e9).call(this))}stop(){0!==sc(this,e6)&&(cancelAnimationFrame(sc(this,e6)),sp(this,e6,0))}update({start:e,duration:t,playbackRate:i}){let a=e-sc(this,e0).valueAsNumber,r=Math.abs(t-this.duration);(a>0||a<-.03||r>=.5)&&this.callback(e),sp(this,e7,e),sp(this,e4,performance.now()),this.duration=t,this.playbackRate=i}}e0=new WeakMap,e1=new WeakMap,e2=new WeakMap,e5=new WeakMap,e3=new WeakMap,e4=new WeakMap,e7=new WeakMap,e8=new WeakMap,e6=new WeakMap,e9=new WeakMap;var sv=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sb=(e,t,i)=>(sv(e,t,"read from private field"),i?i.call(e):t.get(e)),sg=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sf=(e,t,i,a)=>(sv(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),sA=(e,t,i)=>(sv(e,t,"access private method"),i);let s_=(e,t=e.mediaCurrentTime)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:Math.max(0,Math.min((t-i)/(a-i),1))},sT=(e,t=e.range.valueAsNumber)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:t*(a-i)+i};class sy extends a7{constructor(){super(),sg(this,tu),sg(this,tc),sg(this,tE),sg(this,tb),sg(this,tf),sg(this,t_),sg(this,ty),sg(this,tw),sg(this,te,void 0),sg(this,tt,void 0),sg(this,ti,void 0),sg(this,ta,void 0),sg(this,tr,void 0),sg(this,ts,void 0),sg(this,tn,void 0),sg(this,to,void 0),sg(this,tl,void 0),sg(this,td,void 0),sg(this,tp,e=>{!this.dragging&&(tj(e)&&(this.range.valueAsNumber=e),sb(this,td)||this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),sf(this,ti,this.shadowRoot.querySelectorAll('[part~="box"]')),sf(this,tr,this.shadowRoot.querySelector('[part~="preview-box"]')),sf(this,ts,this.shadowRoot.querySelector('[part~="current-box"]'));let e=getComputedStyle(this);sf(this,tn,parseInt(e.getPropertyValue("--media-box-padding-left"))),sf(this,to,parseInt(e.getPropertyValue("--media-box-padding-right"))),sf(this,tt,new sE(this.range,sb(this,tp),60))}static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_PAUSED,tV.MEDIA_DURATION,tV.MEDIA_SEEKABLE,tV.MEDIA_CURRENT_TIME,tV.MEDIA_PREVIEW_IMAGE,tV.MEDIA_PREVIEW_TIME,tV.MEDIA_PREVIEW_CHAPTER,tV.MEDIA_BUFFERED,tV.MEDIA_PLAYBACK_RATE,tV.MEDIA_LOADING,tV.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",t2("seek")),sA(this,tu,th).call(this),sf(this,te,this.getRootNode()),null==(e=sb(this,te))||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),sA(this,tu,th).call(this),null==(e=sb(this,te))||e.removeEventListener("transitionstart",this),sf(this,te,null)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),t!=i&&(e===tV.MEDIA_CURRENT_TIME||e===tV.MEDIA_PAUSED||e===tV.MEDIA_ENDED||e===tV.MEDIA_LOADING||e===tV.MEDIA_DURATION||e===tV.MEDIA_SEEKABLE?(sb(this,tt).update({start:s_(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),sA(this,tu,th).call(this),(e=>{let t=e.range,i=tX(+sT(e)),a=tX(+e.mediaSeekableEnd),r=i&&a?`${i} of ${a}`:"video not loaded, unknown time.";t.setAttribute("aria-valuetext",r)})(this)):e===tV.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===tV.MEDIA_DURATION||e===tV.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=sb(this,tl),this.updateBar()))}get mediaChaptersCues(){return sb(this,tl)}set mediaChaptersCues(e){var t;sf(this,tl,e),this.updateSegments(null==(t=sb(this,tl))?void 0:t.map(e=>({start:s_(this,e.startTime),end:s_(this,e.endTime)})))}get mediaPaused(){return iA(this,tV.MEDIA_PAUSED)}set mediaPaused(e){i_(this,tV.MEDIA_PAUSED,e)}get mediaLoading(){return iA(this,tV.MEDIA_LOADING)}set mediaLoading(e){i_(this,tV.MEDIA_LOADING,e)}get mediaDuration(){return ib(this,tV.MEDIA_DURATION)}set mediaDuration(e){ig(this,tV.MEDIA_DURATION,e)}get mediaCurrentTime(){return ib(this,tV.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){ig(this,tV.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return ib(this,tV.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){ig(this,tV.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(tV.MEDIA_BUFFERED);return e?e.split(" ").map(e=>e.split(":").map(e=>+e)):[]}set mediaBuffered(e){if(!e)return void this.removeAttribute(tV.MEDIA_BUFFERED);let t=e.map(e=>e.join(":")).join(" ");this.setAttribute(tV.MEDIA_BUFFERED,t)}get mediaSeekable(){let e=this.getAttribute(tV.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){if(null==e)return void this.removeAttribute(tV.MEDIA_SEEKABLE);this.setAttribute(tV.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;let[,t=this.mediaDuration]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaSeekableStart(){var e;let[t=0]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaPreviewImage(){return iT(this,tV.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){iy(this,tV.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return ib(this,tV.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){ig(this,tV.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return iA(this,tV.MEDIA_ENDED)}set mediaEnded(e){i_(this,tV.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;let t,i=this.mediaBuffered;if(!i.length)return;if(this.mediaEnded)t=1;else{let a=this.mediaCurrentTime,[,r=this.mediaSeekableStart]=null!=(e=i.find(([e,t])=>e<=a&&a<=t))?e:[];t=s_(this,r)}let{style:a}=iE(this.shadowRoot,"#buffered");a.setProperty("width",`${100*t}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;let e=iE(this.shadowRoot,"#current-rail"),t=iE(this.shadowRoot,'[part~="current-box"]'),i=sA(this,tE,tv).call(this,sb(this,ts)),a=sA(this,tb,tg).call(this,i,this.range.valueAsNumber),r=sA(this,tf,tA).call(this,i,this.range.valueAsNumber);e.style.transform=`translateX(${a})`,e.style.setProperty("--_range-width",`${i.range.width}`),t.style.setProperty("--_box-shift",`${r}`),t.style.setProperty("--_box-width",`${i.box.width}px`),t.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":sA(this,tw,tS).call(this);break;case"pointermove":sA(this,t_,tT).call(this,e);break;case"pointerup":sb(this,td)&&sf(this,td,!1);break;case"pointerdown":sf(this,td,!0);break;case"pointerleave":sA(this,ty,tI).call(this,null);break;case"transitionstart":ic(e.target,this)&&setTimeout(()=>sA(this,tu,th).call(this),0)}}}te=new WeakMap,tt=new WeakMap,ti=new WeakMap,ta=new WeakMap,tr=new WeakMap,ts=new WeakMap,tn=new WeakMap,to=new WeakMap,tl=new WeakMap,td=new WeakMap,tu=new WeakSet,th=function(){sA(this,tc,tm).call(this)?sb(this,tt).start():sb(this,tt).stop()},tc=new WeakSet,tm=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&ip(this)},tp=new WeakMap,tE=new WeakSet,tv=function(e){var t;let i=(null!=(t=this.getAttribute("bounds")?im(this,`#${this.getAttribute("bounds")}`):this.parentElement)?t:this).getBoundingClientRect(),a=this.range.getBoundingClientRect(),r=e.offsetWidth,s=-(a.left-i.left-r/2),n=i.right-a.left-r/2;return{box:{width:r,min:s,max:n},bounds:i,range:a}},tb=new WeakSet,tg=function(e,t){let i=`${100*t}%`,{width:a,min:r,max:s}=e.box;if(!a)return i;if(!Number.isNaN(r)){let e=`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`;i=`max(${e}, ${i})`}if(!Number.isNaN(s)){let e=`calc(1 / var(--_range-width) * 100 * ${s}% - var(--media-box-padding-right))`;i=`min(${i}, ${e})`}return i},tf=new WeakSet,tA=function(e,t){let{width:i,min:a,max:r}=e.box,s=t*e.range.width;if(s<a+sb(this,tn)){let t=e.range.left-e.bounds.left-sb(this,tn);return`${s-i/2+t}px`}if(s>r-sb(this,to)){let t=e.bounds.right-e.range.right-sb(this,to);return`${s+i/2-t-e.range.width}px`}return 0},t_=new WeakSet,tT=function(e){let t=[...sb(this,ti)].some(t=>e.composedPath().includes(t));if(!this.dragging&&(t||!e.composedPath().includes(this)))return void sA(this,ty,tI).call(this,null);let i=this.mediaSeekableEnd;if(!i)return;let a=iE(this.shadowRoot,"#preview-rail"),r=iE(this.shadowRoot,'[part~="preview-box"]'),s=sA(this,tE,tv).call(this,sb(this,tr)),n=(e.clientX-s.range.left)/s.range.width;n=Math.max(0,Math.min(1,n));let o=sA(this,tb,tg).call(this,s,n),l=sA(this,tf,tA).call(this,s,n);a.style.transform=`translateX(${o})`,a.style.setProperty("--_range-width",`${s.range.width}`),r.style.setProperty("--_box-shift",`${l}`),r.style.setProperty("--_box-width",`${s.box.width}px`),1>Math.abs(Math.round(sb(this,ta))-Math.round(n*i))&&n>.01&&n<.99||(sf(this,ta,n*i),sA(this,ty,tI).call(this,sb(this,ta)))},ty=new WeakSet,tI=function(e){this.dispatchEvent(new it.CustomEvent(tN.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:e}))},tw=new WeakSet,tS=function(){sb(this,tt).stop();let e=sT(this);this.dispatchEvent(new it.CustomEvent(tN.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e}))},sy.shadowRootOptions={mode:"open"},sy.getTemplateHTML=function(e){return`
    ${a7.getTemplateHTML(e)}
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${tV.MEDIA_PREVIEW_IMAGE}], [${tV.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${tV.MEDIA_PREVIEW_IMAGE}], [${tV.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${tV.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${tV.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${tV.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${tV.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${tV.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${tV.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${tV.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${tV.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${tV.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${tV.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${tV.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${tV.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${r4.shadowRootOptions.mode}">
            ${r4.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `},it.customElements.get("media-time-range")||it.customElements.define("media-time-range",sy);class sI extends a7{static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_VOLUME,tV.MEDIA_MUTED,tV.MEDIA_VOLUME_UNAVAILABLE]}constructor(){super(),this.range.addEventListener("input",()=>{let e=this.range.value,t=new it.CustomEvent(tN.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)})}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",t2("volume"))}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===tV.MEDIA_VOLUME||e===tV.MEDIA_MUTED){let e;this.range.valueAsNumber=this.mediaMuted?0:this.mediaVolume,this.range.setAttribute("aria-valuetext",(e=this.range.valueAsNumber,`${Math.round(100*e)}%`)),this.updateBar()}}get mediaVolume(){return ib(this,tV.MEDIA_VOLUME,1)}set mediaVolume(e){ig(this,tV.MEDIA_VOLUME,e)}get mediaMuted(){return iA(this,tV.MEDIA_MUTED)}set mediaMuted(e){i_(this,tV.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return iT(this,tV.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){iy(this,tV.MEDIA_VOLUME_UNAVAILABLE,e)}}it.customElements.get("media-volume-range")||it.customElements.define("media-volume-range",sI);class sw extends aP{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,tV.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=(null==(e=this.shadowRoot)?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=t2("Loop"))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tV.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return iA(this,tV.MEDIA_LOOP)}set mediaLoop(e){i_(this,tV.MEDIA_LOOP,e)}handleClick(){let e=!this.mediaLoop,t=new it.CustomEvent(tN.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}function sS(e){return"boolean"==typeof e?e?"":void 0:"function"==typeof e?void 0:Array.isArray(e)&&e.every(e=>"string"==typeof e||"number"==typeof e||"boolean"==typeof e)?e.join(" "):"object"!=typeof e||null===e?e:void 0}sw.getSlotTemplateHTML=function(e){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${tV.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `},sw.getTooltipContentHTML=function(){return t2("Loop")},it.customElements.get("media-loop-button")||it.customElements.define("media-loop-button",sw),tC({tagName:"media-gesture-receiver",elementClass:ik,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-container",elementClass:iP,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});let sk=tC({tagName:"media-controller",elementClass:ag,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});tC({tagName:"media-tooltip",elementClass:aR,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-chrome-button",elementClass:aP,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-airplay-button",elementClass:aH,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-captions-button",elementClass:aB,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-cast-button",elementClass:aQ,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-chrome-dialog",elementClass:a0,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-chrome-range",elementClass:a7,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});let sL=tC({tagName:"media-control-bar",elementClass:re,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});tC({tagName:"media-text-display",elementClass:rr,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-duration-display",elementClass:ro,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-error-dialog",elementClass:rp,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-keyboard-shortcuts-dialog",elementClass:rb,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-fullscreen-button",elementClass:rT,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-live-button",elementClass:rL,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-loading-indicator",elementClass:rx,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});let sM=tC({tagName:"media-mute-button",elementClass:rW,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});tC({tagName:"media-pip-button",elementClass:rB,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-playback-rate-button",elementClass:rQ,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});let sR=tC({tagName:"media-play-button",elementClass:rZ,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});tC({tagName:"media-poster-image",elementClass:rJ,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-preview-chapter-display",elementClass:r1,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-preview-thumbnail",elementClass:r4,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-preview-time-display",elementClass:r6,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-seek-backward-button",elementClass:se,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-seek-forward-button",elementClass:si,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-time-display",elementClass:su,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});let sD=tC({tagName:"media-time-range",elementClass:sy,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}});tC({tagName:"media-volume-range",elementClass:sI,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}}),tC({tagName:"media-loop-button",elementClass:sw,react:tk,toAttributeValue:sS,defaultProps:{suppressHydrationWarning:!0}})},71838:(e,t,i)=>{i.d(t,{i:()=>F});class a{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>e.finished))}getAll(e){return this.animations[0][e]}setAll(e,t){for(let i=0;i<this.animations.length;i++)this.animations[i][e]=t}attachTimeline(e){let t=this.animations.map(t=>t.attachTimeline(e));return()=>{t.forEach((e,t)=>{e&&e(),this.animations[t].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return r(this.animations,"duration")}get iterationDuration(){return r(this.animations,"iterationDuration")}runAll(e){this.animations.forEach(t=>t[e]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function r(e,t){let i=0;for(let a=0;a<e.length;a++){let r=e[a][t];null!==r&&r>i&&(i=r)}return i}class s extends a{then(e,t){return this.finished.finally(e).then(()=>{})}}var n=i(16105),o=i(55565),l=i(44554),d=i(65181),u=i(65971),h=i(28634),c=i(33182),m=i(27290),p=i(78041),E=i(55038);function v(e,t){return(0,E.h)(e)?e[((e,t,i)=>{let a=t-e;return((i-e)%a+a)%a+e})(0,e.length,t)]:e}var b=i(91225),g=i(38561);function f(e){return"object"==typeof e&&!Array.isArray(e)}function A(e,t,i,a){return"string"==typeof e&&f(t)?(0,g.K)(e,i,a):e instanceof NodeList?Array.from(e):Array.isArray(e)?e:[e]}function _(e,t,i,a){return"number"==typeof t?t:t.startsWith("-")||t.startsWith("+")?Math.max(0,e+parseFloat(t)):"<"===t?i:t.startsWith("<")?Math.max(0,i+parseFloat(t.slice(1))):a.get(t)??e}var T=i(39361);function y(e,t){return e.at!==t.at?e.at-t.at:null===e.value?1:null===t.value?-1:0}function I(e,t){return t.has(e)||t.set(e,{}),t.get(e)}function w(e,t){return t[e]||(t[e]=[]),t[e]}let S=e=>"number"==typeof e,k=e=>e.every(S);var L=i(50010),M=i(18402),R=i(29089),D=i(25188),C=i(84546),O=i(59955),N=i(86663);class x extends N.B{constructor(){super(...arguments),this.type="object"}readValueFromInstance(e,t){if(t in e){let i=e[t];if("string"==typeof i||"number"==typeof i)return i}}getBaseTargetFromProps(){}removeValueFromRenderState(e,t){delete t.output[e]}measureInstanceViewportBox(){return(0,O.ge)()}build(e,t){Object.assign(e.output,t)}renderInstance(e,{output:t}){Object.assign(e,t)}sortInstanceNodePosition(){return 0}}var P=i(12905);function U(e){let t={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},i=(0,R.x)(e)&&!(0,D.h)(e)?new P.l(t):new C.M(t);i.mount(e),L.C.set(e,i)}function V(e){let t=new x({presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}});t.mount(e),L.C.set(e,t)}var H=i(8197);function W(e,t,i,a){let r=[];if((0,c.S)(e)||"number"==typeof e||"string"==typeof e&&!f(t))r.push((0,H.z)(e,f(t)&&t.default||t,i&&i.default||i));else{let s=A(e,t,a),n=s.length;(0,p.V)(!!n,"No valid elements provided.","no-valid-elements");for(let e=0;e<n;e++){let a=s[e];(0,p.V)(null!==a,"You're trying to perform an animation on null. Ensure that selectors are correctly finding elements and refs are correctly hydrated.","animate-null");let o=a instanceof Element?U:V;L.C.has(a)||o(a);let l=L.C.get(a),d={...i};"delay"in d&&"function"==typeof d.delay&&(d.delay=d.delay(e,n)),r.push(...(0,M.$)(l,{...t,transition:d},{}))}}return r}let F=function(e){return function(t,i,a){let r,E=[];if(Array.isArray(t)&&t.some(Array.isArray))E=function(e,t,i){let a=[];return(function(e,{defaultTransition:t={},...i}={},a,r){let s=t.duration||.3,o=new Map,E=new Map,g={},f=new Map,S=0,L=0,M=0;for(let i=0;i<e.length;i++){let o=e[i];if("string"==typeof o){f.set(o,L);continue}if(!Array.isArray(o)){f.set(o.name,_(L,o.at,S,f));continue}let[b,y,C={}]=o;void 0!==C.at&&(L=_(L,C.at,S,f));let O=0,N=(e,i,a,o=0,c=0)=>{var E;let b=Array.isArray(E=e)?E:[E],{delay:g=0,times:f=(0,l.Z)(b),type:A="keyframes",repeat:_,repeatType:y,repeatDelay:I=0,...w}=i,{ease:S=t.ease||"easeOut",duration:R}=i,D="function"==typeof g?g(o,c):g,C=b.length,N=(0,d.W)(A)?A:r?.[A||"keyframes"];if(C<=2&&N){let e=100;2===C&&k(b)&&(e=Math.abs(b[1]-b[0]));let t={...w};void 0!==R&&(t.duration=(0,m.f)(R));let i=(0,u.X)(t,e,N);S=i.ease,R=i.duration}R??(R=s);let x=L+D;1===f.length&&0===f[0]&&(f[1]=1);let P=f.length-b.length;if(P>0&&(0,h.f)(f,P),1===b.length&&b.unshift(null),_){(0,p.V)(_<20,"Repeat count too high, must be less than 20","repeat-count-high");R*=_+1;let e=[...b],t=[...f],i=[...S=Array.isArray(S)?[...S]:[S]];for(let a=0;a<_;a++){b.push(...e);for(let r=0;r<e.length;r++)f.push(t[r]+(a+1)),S.push(0===r?"linear":v(i,r-1))}for(let e=0;e<f.length;e++)f[e]=f[e]/(_+1)}let U=x+R;!function(e,t,i,a,r,s){for(let t=0;t<e.length;t++){let i=e[t];i.at>r&&i.at<s&&((0,n.Ai)(e,i),t--)}for(let n=0;n<t.length;n++)e.push({value:t[n],at:(0,T.k)(r,s,a[n]),easing:v(i,n)})}(a,b,S,f,x,U),O=Math.max(D+R,O),M=Math.max(U,M)};if((0,c.S)(b))N(y,C,w("default",I(b,E)));else{let e=A(b,y,a,g),t=e.length;for(let i=0;i<t;i++){let a=I(e[i],E);for(let e in y){var R,D;N(y[e],(R=C,D=e,R&&R[D]?{...R,...R[D]}:{...R}),w(e,a),i,t)}}}S=L,L+=O}return E.forEach((e,a)=>{for(let r in e){let s=e[r];s.sort(y);let n=[],l=[],d=[];for(let e=0;e<s.length;e++){let{at:t,value:i,easing:a}=s[e];n.push(i),l.push((0,b.q)(0,M,t)),d.push(a||"easeOut")}0!==l[0]&&(l.unshift(0),n.unshift(n[0]),d.unshift("easeInOut")),1!==l[l.length-1]&&(l.push(1),n.push(null)),o.has(a)||o.set(a,{keyframes:{},transition:{}});let u=o.get(a);u.keyframes[r]=n,u.transition[r]={...t,duration:M,ease:d,times:l,...i}}}),o})(e,t,i,{spring:o.o}).forEach(({keyframes:e,transition:t},i)=>{a.push(...W(i,e,t))}),a}(t,i,void 0);else{let{onComplete:e,...s}=a||{};"function"==typeof e&&(r=e),E=W(t,i,s,void 0)}let g=new s(E);return r&&g.finished.then(r),e&&(e.animations.push(g),g.finished.then(()=>{(0,n.Ai)(e.animations,g)})),g}}()},85921:(e,t,i)=>{i.d(t,{A:()=>a});let a=(0,i(71847).A)("play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])}}]);