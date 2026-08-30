(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`business`,title:`Start & Grow a Business`,subtitle:`From zero to customers, product-market fit, growth and operating a real business.`,stages:[{id:`business-foundations`,title:`Stage 1 · Foundations`,description:`Problems, customers and the basic model of a business.`,lessons:[{id:`business-ideas-01`,title:`How to Get and Evaluate Startup Ideas`,source:`Y Combinator`,type:`video`,priority:`core`,durationMinutes:33,url:`https://www.youtube.com/watch?v=Th8JoIan4dg`},{id:`business-model-canvas-01`,title:`Business Model Canvas Explained`,source:`Strategyzer`,type:`video`,priority:`core`,durationMinutes:3,url:`https://www.youtube.com/watch?v=QoAOzMTLP5s`},{id:`business-value-proposition-01`,title:`Value Proposition Canvas Explained`,source:`Strategyzer`,type:`video`,priority:`core`,durationMinutes:3,url:`https://www.youtube.com/watch?v=ReM1uqmVfP0`},{id:`business-user-interviews-01`,title:`How to Talk to Users`,source:`Y Combinator`,type:`video`,priority:`core`,durationMinutes:31,url:`https://www.youtube.com/watch?v=z1iF1c8w5Lg`}]},{id:`business-market`,title:`Stage 2 · Product & Market`,description:`Get real customers, launch, and learn what product-market fit feels like.`,lessons:[{id:`business-first-customers-01`,title:`How to Get Your First Customers`,source:`Y Combinator`,type:`video`,priority:`core`,durationMinutes:28,url:`https://www.youtube.com/watch?v=hyYCn_kAngI`},{id:`business-launch-01`,title:`How to Launch (Again and Again)`,source:`Y Combinator`,type:`video`,priority:`recommended`,durationMinutes:25,url:`https://www.youtube.com/watch?v=3xU050kMbHM`},{id:`business-pmf-01`,title:`How to Find Product Market Fit`,source:`Stanford · Peter Reinhardt`,type:`case-study`,priority:`core`,durationMinutes:48,url:`https://www.youtube.com/watch?v=_6pl5GG8RQ4`}]},{id:`business-growth`,title:`Stage 3 · Funnel, Metrics & Growth`,description:`Understand where customers are in the journey and what numbers matter.`,lessons:[{id:`business-funnel-01`,title:`TOFU / MOFU / BOFU — The 3 Funnel Stages`,source:`YouTube`,type:`video`,priority:`core`,durationMinutes:10,url:`https://www.youtube.com/watch?v=02cqK-CR9ws`},{id:`business-aarrr-01`,title:`Startup Metrics for Pirates: AARRR`,source:`Dave McClure`,type:`video`,priority:`core`,durationMinutes:5,url:`https://www.youtube.com/watch?v=irjgfW0BIrw`},{id:`business-small-startup-product-01`,title:`How To Build Product As A Small Startup`,source:`Y Combinator · Michael Seibel`,type:`video`,priority:`core`,durationMinutes:29,url:`https://www.youtube.com/watch?v=kzVvjKLdAbk`}]}]},{id:`ai-agents`,title:`Great & Reliable AI Agent Team`,subtitle:`Build agents that use tools, work together, can be evaluated, and are safe enough for real work.`,stages:[{id:`agents-foundations`,title:`Stage 1 · Agent Fundamentals`,description:`What an agent is, when to use one, and the core mental models.`,lessons:[{id:`agents-what-are-agents-01`,title:`What are AI Agents?`,source:`IBM Technology`,type:`video`,priority:`core`,durationMinutes:11,url:`https://www.youtube.com/watch?v=F8NKVhkZZWI`},{id:`agents-effective-agents-01`,title:`How to Build Effective AI Agents`,source:`Anthropic`,type:`video`,priority:`core`,durationMinutes:40,url:`https://www.youtube.com/watch?v=LP5OCa20Zpg`},{id:`agents-guides-overview-01`,title:`Google, Anthropic & OpenAI's Guides to AI Agents`,source:`YouTube`,type:`video`,priority:`recommended`,durationMinutes:16,url:`https://www.youtube.com/watch?v=TlbcAphLGSc`}]},{id:`agents-architecture`,title:`Stage 2 · Build & Architecture`,description:`Tools, MCP, agent loops and multi-agent patterns.`,lessons:[{id:`agents-sdk-build-hour-01`,title:`Build Hour: Agents SDK`,source:`OpenAI`,type:`video`,priority:`core`,durationMinutes:48,url:`https://www.youtube.com/watch?v=tK32trvj_b4`},{id:`agents-multi-agent-architecture-01`,title:`Conceptual Guide: Multi-Agent Architectures`,source:`LangChain`,type:`video`,priority:`core`,durationMinutes:49,url:`https://www.youtube.com/watch?v=4nZl32FwU-o`},{id:`agents-choose-architecture-01`,title:`Choosing the Right Multi-Agent Architecture`,source:`LangChain`,type:`video`,priority:`core`,durationMinutes:35,url:`https://www.youtube.com/watch?v=fqvbxkgU6vE`}]},{id:`agents-reliability`,title:`Stage 3 · Reliability & Security`,description:`Trace what happened, evaluate behavior, and design for failure.`,lessons:[{id:`agents-observability-evals-01`,title:`Observability and Evals for AI Agents`,source:`LangChain`,type:`video`,priority:`core`,durationMinutes:45,url:`https://www.youtube.com/watch?v=FDVdLrloFOw`},{id:`agents-security-risks-01`,title:`Top 10 Security Risks in AI Agents Explained`,source:`IBM Technology`,type:`video`,priority:`core`,durationMinutes:16,url:`https://www.youtube.com/watch?v=soFWS8NBcSU`}]}]},{id:`negotiation`,title:`Business Negotiation Strategy`,subtitle:`Prepare leverage, uncover interests, structure deals and know when to walk away.`,stages:[{id:`negotiation-foundations`,title:`Stage 1 · Fundamentals`,description:`A principled framework for preparing and solving negotiation problems.`,lessons:[{id:`negotiation-neale-01`,title:`Negotiation: Getting What You Want`,source:`Stanford GSB · Margaret Neale`,type:`video`,priority:`core`,durationMinutes:54,url:`https://www.youtube.com/watch?v=MXFpOWDAhvM`},{id:`negotiation-ury-01`,title:`The Walk from “No” to “Yes”`,source:`William Ury`,type:`video`,priority:`core`,durationMinutes:19,url:`https://www.youtube.com/watch?v=Hc6yi_FtoNo`}]},{id:`negotiation-tactical`,title:`Stage 2 · Tactical Negotiation`,description:`Listening, tactical empathy, information and difficult conversations.`,lessons:[{id:`negotiation-voss-01`,title:`Never Split the Difference`,source:`Talks at Google · Chris Voss`,type:`video`,priority:`core`,durationMinutes:51,url:`https://www.youtube.com/watch?v=guZa7mQV1l0`},{id:`negotiation-diamond-01`,title:`The Art of Negotiation`,source:`Talks at Google · Stuart Diamond`,type:`video`,priority:`recommended`,durationMinutes:66,url:`https://www.youtube.com/watch?v=2QtZ-vObJrk`}]},{id:`negotiation-deals`,title:`Stage 3 · Deal Structure`,description:`Use leverage and structure the whole package rather than arguing over one number.`,lessons:[{id:`negotiation-malhotra-01`,title:`How to Negotiate Your Job Offer`,source:`Harvard Business School · Deepak Malhotra`,type:`case-study`,priority:`core`,durationMinutes:65,url:`https://www.youtube.com/watch?v=km2Hd_xgo9Q`}]}]}],t=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`,n=e=>{let[t,n,r]=e.split(`-`).map(Number);return new Date(t,n-1,r)},r=e=>typeof e==`string`&&/^\d{4}-\d{2}-\d{2}$/.test(e),i=(e,t=new Date)=>{try{let n=new Intl.DateTimeFormat(`en-US`,{timeZone:e,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hour12:!1}).formatToParts(t),r=e=>{let t=n.find(t=>t.type===e);return t?Number(t.value):0};return new Date(r(`year`),r(`month`)-1,r(`day`),r(`hour`)%24,r(`minute`),r(`second`))}catch{return new Date(t)}},a=(e,t=4,n=new Date)=>{let r=i(e,n);return r.getHours()<t&&r.setDate(r.getDate()-1),r.setHours(0,0,0,0),r},o=(e,n,r)=>t(a(e,n,r)),s=e=>{let t=new Date(e);t.setHours(0,0,0,0);let n=(t.getDay()+6)%7;return t.setDate(t.getDate()-n),t},c=(e,t)=>{let n=new Date(e);return n.setHours(0,0,0,0),n.setDate(n.getDate()+t),n},l=e=>{let n=s(e);return Array.from({length:7},(e,r)=>t(c(n,r)))},u=(e,t)=>e>t,d=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`],f=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],p=e=>`${f[e.getDay()]}, ${e.getDate()} ${d[e.getMonth()]} ${e.getFullYear()}`,m=e=>`${e.getDate()} ${d[e.getMonth()]}`,h=(e,t)=>`${e.getFullYear()===t.getFullYear()?m(e):`${m(e)} ${e.getFullYear()}`} – ${m(t)} ${t.getFullYear()}`,g=()=>{let e=globalThis.crypto;return e&&typeof e.randomUUID==`function`?`u_${e.randomUUID().slice(0,8)}`:`u_${Math.random().toString(36).slice(2,10)}`},_=e=>({id:e.id,name:e.name,time:e.time,core:e.core===!0,habit:e.habit??null,weight:typeof e.weight==`number`&&e.weight>0?e.weight:1,done:!1,adhoc:!1}),v=(e,t)=>{if(e.length===0)throw Error(`no templates in storage`);let n=[...e].sort((e,t)=>e.version-t.version),r=n[0];for(let e of n)e.effectiveFrom<=t&&(r=e);return r},y=(e,t)=>v(e,t),b=(e,t,r,i)=>{let a=v(t,e),o=n(e).getDay(),s=a.days[o];return{date:e,status:`active`,dayType:s?.type??``,templateVersion:a.version,tasks:(s?.tasks??[]).map(_),note:``,createdAt:r,updatedAt:r,editedRetroactively:e<i}},x=(e,t)=>{let r=t.days[n(e.date).getDay()],i=new Map(e.tasks.map(e=>[e.id,e.done])),a=(r?.tasks??[]).map(e=>({..._(e),done:i.get(e.id)??!1})),o=e.tasks.filter(e=>e.adhoc);return{...e,dayType:r?.type??``,templateVersion:t.version,tasks:[...a,...o]}},S=e=>`${e.id}${e.name}${e.time}${e.core}${e.weight}${e.habit??``}`,C=(e,t)=>{let r=t.days[n(e.date).getDay()];return(r?.tasks??[]).map(e=>S(_(e))).join(``)!==e.tasks.filter(e=>!e.adhoc).map(S).join(``)||(r?.type??``)!==e.dayType},w=(e,t)=>{let r=v(t,e).days[n(e).getDay()];return{dayType:r?.type??``,tasks:(r?.tasks??[]).map(_)}},T={"north-star":40,primary:30,support:20,next:10},E=e=>Object.values(e).filter(e=>e.execution.status===`active`),D=(e,t)=>{let r=n(e).getDay(),i=t.find(e=>e.weekday===r);return i?Math.max(0,Math.floor(i.focusBlocks)):0},O=(e,r)=>{let i=t(s(n(e)));return Object.values(r).find(e=>e.startsOn===i)},k=(e,t)=>O(e,t)?e:Object.values(t).filter(t=>t.startsOn>e).sort((e,t)=>e.startsOn.localeCompare(t.startsOn))[0]?.startsOn??e,A=(e,t)=>{if(!e)return 0;if(e<t)return 100;if(e===t)return 90;let r=Math.round((n(e).getTime()-n(t).getTime())/864e5);return r===1?70:r<=3?50:r<=7?20:0},j=e=>Math.max(1,Math.floor(e||1)),M=e=>e.find(e=>e.type===`career`&&e.outcome.priority===`north-star`)??e.find(e=>e.type===`career`),ee=({dateK:e,capacityProfiles:t,workstreams:n,plannedActions:r,jobApplications:i})=>{let a=D(e,t),o=E(n),s=new Map(o.map(e=>[e.id,e])),c=[],l=[],u=Object.values(r).filter(t=>t.date===e&&(t.status===`planned`||t.status===`done`)&&s.has(t.workstreamId)),d=u.reduce((e,t)=>e+j(t.focusBlocks),0);for(let t of u){if(t.status!==`planned`)continue;let n=s.get(t.workstreamId);if(!n)continue;let r=j(t.focusBlocks),i=t.due??n.plan.deadline;c.push({item:{id:t.id,source:`action`,workstreamId:n.id,title:t.title,focusBlocks:r,due:i??null,linkedHabitId:t.linkedHabitId??n.linkedHabitId??null,applicationId:t.applicationId??null,reason:i&&i<=e?`Due now`:n.outcome.priority===`north-star`?`North Star`:`Planned today`},score:300+A(i??null,e)+T[n.outcome.priority],stableOrder:`0:${t.id}`})}c.sort((e,t)=>t.score-e.score||e.stableOrder.localeCompare(t.stableOrder));let f=c.slice(0,2).map(e=>e.item),p=[],m=M(o);if(m)for(let t of Object.values(i)){if(!t.nextAction||!t.nextActionDue||t.nextActionDue>e||t.stage===`rejected`||t.stage===`withdrawn`||t.stage===`offer`||u.some(e=>e.applicationId===t.id))continue;let n=t.stage===`screening`||t.stage===`interview`||t.stage===`final`;p.push({id:`application:${t.id}`,source:`application`,workstreamId:m.id,title:`${t.company} — ${t.nextAction}`,due:t.nextActionDue,applicationId:t.id,reason:n?`Live pipeline`:t.nextActionDue<e?`Overdue application`:`Application due`})}p.sort((e,t)=>{let n=+(e.reason===`Live pipeline`);return+(t.reason===`Live pipeline`)-n||e.due.localeCompare(t.due)||e.id.localeCompare(t.id)});let h=[];for(let e of o){let t=e.execution.nextAction?.trim();t&&(u.some(t=>t.workstreamId===e.id)||h.push({id:`workstream:${e.id}`,source:`workstream`,workstreamId:e.id,title:t,due:e.plan.deadline,reason:e.outcome.priority===`north-star`?`North Star next action`:`Active milestone`}))}h.sort((t,r)=>A(r.due,e)-A(t.due,e)||T[n[r.workstreamId]?.outcome.priority??`next`]-T[n[t.workstreamId]?.outcome.priority??`next`]||t.id.localeCompare(r.id));let g=o.find(t=>t.type===`project`&&t.plan.deadline!==null&&t.plan.deadline<e);return g&&l.push(`${g.title}: deadline missed — replan explicitly.`),d>a&&l.push(`Today is overbooked by ${d-a} Focus Block${d-a===1?``:`s`}.`),{date:e,capacityBlocks:a,usedBlocks:d,remainingBlocks:Math.max(0,a-d),items:f,attention:p,suggestions:h,warnings:l}},N=({dateK:e,capacityProfiles:r,weekPlans:i,plannedActions:a})=>{let o=t(s(n(e))),c=l(n(e)),u=new Set(c),d=O(e,i),f=Object.values(a).filter(e=>u.has(e.date)&&(e.status===`planned`||e.status===`done`));return{startsOn:o,capacityBlocks:c.reduce((e,t)=>e+D(t,r),0),plannedBlocks:f.reduce((e,t)=>e+j(t.focusBlocks),0),completedBlocks:f.filter(e=>e.status===`done`).reduce((e,t)=>e+j(t.focusBlocks),0),commitments:(d?.commitments??[]).map(e=>{let t=f.filter(t=>t.workstreamId===e.workstreamId).reduce((e,t)=>e+j(t.focusBlocks),0),n=f.filter(t=>t.workstreamId===e.workstreamId&&t.status===`done`).reduce((e,t)=>e+j(t.focusBlocks),0);return{workstreamId:e.workstreamId,targetBlocks:Math.max(0,e.targetBlocks),scheduledBlocks:t,completedBlocks:n,outcome:e.outcome}})}},te=e=>typeof e.weight==`number`&&e.weight>0?e.weight:1,P=e=>{let t=e.reduce((e,t)=>e+te(t),0);if(!t)return 0;let n=e.reduce((e,t)=>e+(t.done?te(t):0),0);return Math.round(n/t*100)},F=e=>{let t=e.filter(e=>e.core);return t.length?P(t):P(e)},ne=e=>e.some(e=>e.core),I=(e,t)=>{let n=0,r=0,i=0,a=0,o=0;for(let s of e){let e=t[s];if(!e){o+=1;continue}if(e.status===`rest`){a+=1;continue}n+=F(e.tasks),r+=P(e.tasks),i+=1}return{average:i?Math.round(n/i):0,averageTotal:i?Math.round(r/i):0,tracked:i,rest:a,untracked:o}},re=(e,t)=>e.tasks.filter(e=>e.core&&e.habit===t),L=(e,t)=>{let n=re(e,t);return n.length?e.status===`rest`?`rest`:e.status===`skipped`?`missed`:n.every(e=>e.done)?`done`:`missed`:`unscheduled`},R=(e,r,i)=>{let a=new Map(r.filter(e=>e.date<=i).map(e=>[e.date,e])),o=[...a.values()].sort((e,t)=>e.date.localeCompare(t.date)),s=null,l=0,u=0,d=0,f=0,p=0;for(let t of o){let n=L(t,e);n!==`unscheduled`&&n!==`rest`&&(s===null&&(s=t.date),u+=1,n===`done`?(l+=1,p+=1,f=Math.max(f,p)):p=0)}d=p;let m=n(i),h=[];for(let n=-6;n<=0;n+=1){let r=t(c(m,n)),i=a.get(r);h.push({date:r,state:i?L(i,e):`untracked`})}return{habitId:e,firstDate:s,completed:l,scheduled:u,completionRate:u?Math.round(l/u*100):0,currentStreak:d,longestStreak:f,recent7:h}},ie=(e,t,n)=>({...e,tasks:e.tasks.map(e=>e.id===t?{...e,done:!e.done}:e),updatedAt:n}),ae=[{weekday:0,focusBlocks:3,label:`Weekend`},{weekday:1,focusBlocks:2,label:`Normal weekday`},{weekday:2,focusBlocks:2,label:`Normal weekday`},{weekday:3,focusBlocks:1,label:`Low-capacity weekday`},{weekday:4,focusBlocks:2,label:`Normal weekday`},{weekday:5,focusBlocks:1,label:`Low-capacity weekday`},{weekday:6,focusBlocks:3,label:`Weekend`}],oe=()=>({workstreams:{},capacityProfiles:structuredClone(ae),weekPlans:{},plannedActions:{},jobApplications:{}}),se=e=>{let t=typeof e==`object`&&e?e:{},n=oe();return{workstreams:typeof t.workstreams==`object`&&t.workstreams!==null?structuredClone(t.workstreams):n.workstreams,capacityProfiles:Array.isArray(t.capacityProfiles)&&t.capacityProfiles.length>0?structuredClone(t.capacityProfiles):n.capacityProfiles,weekPlans:typeof t.weekPlans==`object`&&t.weekPlans!==null?structuredClone(t.weekPlans):n.weekPlans,plannedActions:typeof t.plannedActions==`object`&&t.plannedActions!==null?structuredClone(t.plannedActions):n.plannedActions,jobApplications:typeof t.jobApplications==`object`&&t.jobApplications!==null?structuredClone(t.jobApplications):n.jobApplications}},ce={1:{type:`WFH · Gym AM`,tasks:[{id:`wake`,name:`Wake up`,time:`6:30–7:00`},{id:`gym`,name:`Gym`,time:`7:00–8:00`,core:!0,habit:`gym`},{id:`jobsearch`,name:`Job search (focus block)`,time:`8:30–9:00`,core:!0,habit:`jobsearch`},{id:`work`,name:`Work`,time:`9:00–18:00`,core:!0,habit:`work`},{id:`personal`,name:`Personal project`,time:`19:00–20:30`,core:!0,habit:`personal`},{id:`learning`,name:`Learning`,time:`20:30–21:30`,core:!0,habit:`learning`},{id:`winddown`,name:`Wind down`,time:`21:30–22:00`}]},2:{type:`Office day`,tasks:[{id:`wake`,name:`Wake up`,time:`6:30–7:00`},{id:`learning`,name:`Learning (focus block)`,time:`7:00–7:30`,core:!0,habit:`learning`},{id:`work`,name:`Office work`,time:`9:00–18:00`,core:!0,habit:`work`},{id:`content`,name:`Content creation`,time:`19:00–20:30`,core:!0,habit:`content`},{id:`personal`,name:`Personal project`,time:`20:30–21:30`,core:!0,habit:`personal`},{id:`winddown`,name:`Wind down`,time:`21:30–22:00`}]},3:{type:`WFH · Gym AM · Pin PM`,tasks:[{id:`wake`,name:`Wake up`,time:`6:30–7:00`},{id:`gym`,name:`Gym`,time:`7:00–8:00`,core:!0,habit:`gym`},{id:`personal`,name:`Personal project (focus block)`,time:`8:30–9:00`,core:!0,habit:`personal`},{id:`work`,name:`Work`,time:`9:00–12:00`,core:!0,habit:`work`},{id:`pin`,name:`See Pin`,time:`12:00–22:30`,core:!0,habit:`pin`},{id:`winddown`,name:`Wind down`,time:`23:00–23:30`}]},4:{type:`Office day`,tasks:[{id:`wake`,name:`Wake up`,time:`6:30–7:00`},{id:`jobsearch`,name:`Job search (focus block)`,time:`7:00–7:30`,core:!0,habit:`jobsearch`},{id:`work`,name:`Office work`,time:`9:00–18:00`,core:!0,habit:`work`},{id:`learning`,name:`Learning`,time:`19:00–20:30`,core:!0,habit:`learning`},{id:`content`,name:`Content creation`,time:`20:30–21:30`,core:!0,habit:`content`},{id:`winddown`,name:`Wind down`,time:`21:30–22:00`}]},5:{type:`WFH · Gym AM · Pin PM`,tasks:[{id:`wake`,name:`Wake up`,time:`6:30–7:00`},{id:`gym`,name:`Gym`,time:`7:00–8:00`,core:!0,habit:`gym`},{id:`personal`,name:`Personal project (focus block)`,time:`8:30–9:00`,core:!0,habit:`personal`},{id:`work`,name:`Work`,time:`9:00–12:00`,core:!0,habit:`work`},{id:`pin`,name:`See Pin`,time:`12:00–22:30`,core:!0,habit:`pin`},{id:`winddown`,name:`Wind down`,time:`23:00–23:30`}]},6:{type:`Weekend`,tasks:[{id:`wake`,name:`Wake up`,time:`8:00–9:00`},{id:`personal`,name:`Personal project (deep work)`,time:`9:00–11:00`,core:!0,habit:`personal`},{id:`jobsearch`,name:`Job search`,time:`11:00–12:00`,core:!0,habit:`jobsearch`},{id:`pin`,name:`With Pin`,time:`12:00–evening`,core:!0,habit:`pin`},{id:`content`,name:`Content creation batch`,time:`Evening`,core:!0,habit:`content`}]},0:{type:`Weekend`,tasks:[{id:`wake`,name:`Wake up`,time:`8:00–9:00`},{id:`learning`,name:`Learning`,time:`9:00–10:30`,core:!0,habit:`learning`},{id:`personal`,name:`Light personal project / plan week`,time:`10:30–12:00`,core:!0,habit:`personal`},{id:`pin`,name:`With Pin`,time:`12:00–evening`,core:!0,habit:`pin`},{id:`review`,name:`Rest, review the week`,time:`Evening`}]}},z=[{id:`gym`,label:`Gym`,color:`teal`},{id:`personal`,label:`Personal project`,color:`amber`},{id:`jobsearch`,label:`Job search`,color:`violet`},{id:`learning`,label:`Learning`,color:`sky`},{id:`content`,label:`Content`,color:`rose`},{id:`pin`,label:`Pin`,color:`coral`},{id:`work`,label:`Work`,color:`slate`}],B={timezone:`Asia/Bangkok`,dayCutoffHour:4,weekStartsOn:1,lastExportAt:null},le=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],ue={1:e=>{let t=e?.days??{},i=e?.schedule??ce,a=Object.keys(t).map(e=>e.replace(/^day:/,``)).filter(r).sort(),o={version:1,effectiveFrom:a[0]??`1970-01-01`,createdAt:new Date(0).toISOString(),days:i},s={};for(let e of a){let r=t[`day:${e}`]??t[e]??{},i=r.tasks??{},a=n(e).getDay(),c=o.days[a],l=(c?.tasks??[]).map(e=>({..._(e),done:i[e.id]===!0}));for(let[e,t]of Object.entries(i))t&&!l.some(t=>t.id===e)&&l.push({id:e,name:e,time:``,core:!1,habit:null,weight:1,done:!0,adhoc:!0});let u=new Date(0).toISOString();s[e]={date:e,status:`active`,dayType:c?.type??``,templateVersion:1,tasks:l,note:typeof r.note==`string`?r.note:``,createdAt:u,updatedAt:u,editedRetroactively:!1}}return{schemaVersion:2,settings:{...B,...e?.settings??{}},templates:[o],days:s}},2:e=>{let t=new Map(z.map(e=>[e.id,structuredClone(e)])),n=e=>{typeof e!=`string`||e===``||t.has(e)||t.set(e,{id:e,label:e,color:`slate`})};for(let t of e?.templates??[])for(let e of Object.values(t.days??{}))for(let t of e?.tasks??[])n(t.habit);for(let t of Object.values(e?.days??{}))for(let e of t?.tasks??[])n(e.habit);return{...e,schemaVersion:3,habits:[...t.values()]}},3:e=>({...e,schemaVersion:4,learningProgress:e?.learningProgress??{}}),4:e=>({...e,schemaVersion:5,planning:se(e?.planning)})},de=e=>(e.schemaVersion??1)<5,fe=e=>{let t=e,n=t?.schemaVersion??1;for(;n<5;){let e=ue[n];if(!e)throw Error(`no migration from schema version ${n}`);t=e(t);let r=t?.schemaVersion??n+1;if(r<=n)throw Error(`migration from ${n} did not advance schemaVersion`);n=r}if(n>5)throw Error(`data is from a newer version (v${n}) than this app supports (v5)`);return t},pe=e=>{if(typeof e!=`object`||!e)return{ok:!1,error:`File is not a JSON object.`};let t=e;return typeof t.schemaVersion==`number`?t.schemaVersion>5?{ok:!1,error:`Backup is schema v${t.schemaVersion}; this app supports up to v5.`}:typeof t.days!=`object`||t.days===null?{ok:!1,error:`Missing days.`}:{ok:!0}:{ok:!1,error:`Missing schemaVersion — not a routine backup.`}},V={meta:`rt:meta`,habits:`rt:habits`,templates:`rt:templates`,learningProgress:`rt:learning:progress`,planningWorkstreams:`rt:planning:workstreams`,planningCapacity:`rt:planning:capacity`,planningWeeks:`rt:planning:weeks`,planningActions:`rt:planning:actions`,jobApplications:`rt:job:applications`,index:`rt:index`,day:e=>`rt:day:${e}`,backupMigration:e=>`rt:backup:preMigration:v${e}`,backupImport:`rt:backup:preImport`},me=`rt:day:`,H=(e,t)=>{if(e===null)return t;try{return JSON.parse(e)}catch{return t}},he=e=>{let t=new Set,n=()=>t.forEach(e=>e()),i=()=>H(e.get(V.meta),{schemaVersion:5,settings:{...B}}),a=t=>e.set(V.meta,JSON.stringify(t)),o=()=>H(e.get(V.index),[]),s=t=>e.set(V.index,JSON.stringify([...new Set(t)].sort())),c=()=>e.keys().filter(e=>e.startsWith(me)).map(e=>e.slice(7)).filter(r).sort(),l=()=>H(e.get(V.templates),[]),u=t=>e.set(V.templates,JSON.stringify(t)),d=()=>H(e.get(V.habits),[]),f=t=>e.set(V.habits,JSON.stringify(t)),p=()=>H(e.get(V.learningProgress),{}),m=t=>e.set(V.learningProgress,JSON.stringify(t)),h=()=>se({workstreams:H(e.get(V.planningWorkstreams),{}),capacityProfiles:H(e.get(V.planningCapacity),[]),weekPlans:H(e.get(V.planningWeeks),{}),plannedActions:H(e.get(V.planningActions),{}),jobApplications:H(e.get(V.jobApplications),{})}),g=t=>{let n=se(t);e.set(V.planningWorkstreams,JSON.stringify(n.workstreams)),e.set(V.planningCapacity,JSON.stringify(n.capacityProfiles)),e.set(V.planningWeeks,JSON.stringify(n.weekPlans)),e.set(V.planningActions,JSON.stringify(n.plannedActions)),e.set(V.jobApplications,JSON.stringify(n.jobApplications))},_=t=>{let n=e.get(V.day(t));return n===null?void 0:H(n,void 0)},v=()=>{let e=i(),t={};for(let e of c()){let n=_(e);n&&(t[e]=n)}return{schemaVersion:e.schemaVersion,settings:e.settings,habits:d(),templates:l(),days:t,learningProgress:p(),planning:h()}},y=t=>{for(let t of c())e.remove(V.day(t));a({schemaVersion:t.schemaVersion,settings:{...B,...t.settings}}),f(t.habits?.length?t.habits:structuredClone(z)),u(t.templates),m(t.learningProgress??{}),g(t.planning??oe());let n=Object.keys(t.days).filter(r).sort();for(let r of n)e.set(V.day(r),JSON.stringify(t.days[r]));s(n)},b=(e,t)=>{a({schemaVersion:5,settings:{...B}}),f(structuredClone(z)),u([{version:1,effectiveFrom:t,createdAt:e,days:structuredClone(ce)}]),m({}),g(oe()),s([])};return{init(t,n){if(e.get(V.meta)===null){b(t,n);return}if(de(i())){let t=v();e.set(V.backupMigration(t.schemaVersion),JSON.stringify(t)),y(fe(t))}l().length===0&&u([{version:1,effectiveFrom:n,createdAt:t,days:structuredClone(ce)}]),d().length===0&&f(structuredClone(z));let r=h();e.get(V.planningWorkstreams)===null&&e.set(V.planningWorkstreams,JSON.stringify(r.workstreams)),e.get(V.planningCapacity)===null&&e.set(V.planningCapacity,JSON.stringify(r.capacityProfiles)),e.get(V.planningWeeks)===null&&e.set(V.planningWeeks,JSON.stringify(r.weekPlans)),e.get(V.planningActions)===null&&e.set(V.planningActions,JSON.stringify(r.plannedActions)),e.get(V.jobApplications)===null&&e.set(V.jobApplications,JSON.stringify(r.jobApplications));let a=c(),p=o();(a.length!==p.length||a.some((e,t)=>e!==p[t]))&&s(a)},getDay:_,setDay(t,r,i){let a={...r,date:t,updatedAt:i};e.set(V.day(t),JSON.stringify(a));let c=o();c.includes(t)||s([...c,t]),n()},deleteDay(t){e.remove(V.day(t)),s(o().filter(e=>e!==t)),n()},listDays(e){return o().filter(t=>(e?.from===void 0||t>=e.from)&&(e?.to===void 0||t<=e.to)).map(_).filter(e=>e!==void 0)},dayKeys:o,getTemplates:l,appendTemplate(e){let t=l(),r=t.reduce((e,t)=>Math.max(e,t.version),0)+1,i={...e,version:r};return u([...t,i]),n(),i},getHabits:d,addHabit(e){let t=e.trim();if(!t)throw Error(`Habit needs a name.`);let r=d(),i=t.toLowerCase().normalize(`NFKD`).replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`habit`,a=new Set(r.map(e=>e.id)),o=i,s=2;for(;a.has(o);)o=`${i}-${s++}`;let c={id:o,label:t,color:`slate`};return f([...r,c]),n(),c},setHabitLabel(e,t){let r=t.trim();if(!r)throw Error(`Habit needs a name.`);let i=d(),a=i.find(t=>t.id===e);if(!a)return;let o={...a,label:r};return f(i.map(t=>t.id===e?o:t)),n(),o},setHabitArchived(e,t){let r=d(),i=r.find(t=>t.id===e);if(!i)return;let a={...i,archived:t};return f(r.map(t=>t.id===e?a:t)),n(),a},getLearningProgress:p,setLearningLessonCompleted(e,t,r){let i=p();return t?i[e]={lessonId:e,completedAt:r}:delete i[e],m(i),n(),i},clearLearningProgress(){m({}),n()},getWorkstreams(){return h().workstreams},upsertWorkstream(t){if(!t.id.trim())throw Error(`Workstream needs an id.`);let r=h();return r.workstreams[t.id]=structuredClone(t),e.set(V.planningWorkstreams,JSON.stringify(r.workstreams)),n(),structuredClone(t)},getCapacityProfiles(){return h().capacityProfiles},setCapacityProfiles(t){let r=new Set,i=[...t].map(e=>({...e,focusBlocks:Math.max(0,Math.floor(e.focusBlocks))})).filter(e=>Number.isInteger(e.weekday)&&e.weekday>=0&&e.weekday<=6).filter(e=>!r.has(e.weekday)&&(r.add(e.weekday),!0)).sort((e,t)=>e.weekday-t.weekday);if(i.length!==7)throw Error(`Capacity profile needs one entry for each weekday.`);return e.set(V.planningCapacity,JSON.stringify(i)),n(),structuredClone(i)},getWeekPlans(){return h().weekPlans},upsertWeekPlan(t){if(!t.id.trim())throw Error(`Week Plan needs an id.`);let r=h();return r.weekPlans[t.id]=structuredClone(t),e.set(V.planningWeeks,JSON.stringify(r.weekPlans)),n(),structuredClone(t)},getPlannedActions(){return h().plannedActions},upsertPlannedAction(t){if(!t.id.trim())throw Error(`Planned Action needs an id.`);let r=h();return r.plannedActions[t.id]=structuredClone(t),e.set(V.planningActions,JSON.stringify(r.plannedActions)),n(),structuredClone(t)},getJobApplications(){return h().jobApplications},upsertJobApplication(t){if(!t.id.trim())throw Error(`Job Application needs an id.`);let r=h();return r.jobApplications[t.id]=structuredClone(t),e.set(V.jobApplications,JSON.stringify(r.jobApplications)),n(),structuredClone(t)},getSettings(){return{...B,...i().settings}},setSettings(e){let t=i(),r={...B,...t.settings,...e};return a({...t,settings:r}),n(),r},exportAll:v,previewImport(e){let t=pe(e);if(!t.ok)return t;let n;try{n=fe(structuredClone(e))}catch(e){return{ok:!1,error:e instanceof Error?e.message:String(e)}}let i=new Set(c()),a=0,o=0,s=0;for(let e of Object.keys(n.days).filter(r))i.has(e)?JSON.stringify(_(e))===JSON.stringify(n.days[e])?s+=1:o+=1:a+=1;return{ok:!0,summary:{added:a,overwritten:o,unchanged:s,templates:n.templates.length,learningCompleted:Object.keys(n.learningProgress??{}).length,workstreams:Object.keys(n.planning?.workstreams??{}).length,plannedActions:Object.keys(n.planning?.plannedActions??{}).length,jobApplications:Object.keys(n.planning?.jobApplications??{}).length}}},importAll(t){let r=this.previewImport(t);if(!r.ok)throw Error(r.error);let i=fe(structuredClone(t));return e.set(V.backupImport,JSON.stringify(v())),y(i),n(),r.summary},subscribe(e){return t.add(e),()=>void t.delete(e)},notify:n}},ge=(e={})=>{let t=new Map(Object.entries(e));return{get:e=>t.get(e)??null,set:(e,n)=>void t.set(e,n),remove:e=>void t.delete(e),keys:()=>[...t.keys()]}},_e=()=>({get:e=>window.localStorage.getItem(e),set:(e,t)=>window.localStorage.setItem(e,t),remove:e=>window.localStorage.removeItem(e),keys:()=>{let e=[];for(let t=0;t<window.localStorage.length;t+=1){let n=window.localStorage.key(t);n!==null&&e.push(n)}return e}}),ve=()=>{try{let e=`__rt_probe__`;return window.localStorage.setItem(e,`1`),window.localStorage.removeItem(e),!0}catch{return!1}},U=null,ye=!1,be=()=>U||(ve()?U=he(_e()):(ye=!0,U=he(ge())),U),W=e=>e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]),G=(...e)=>e.filter(Boolean).join(` `),xe,K=(e,t=`info`)=>{let n=document.getElementById(`toast`);n&&(n.textContent=e,n.className=`toast toast--${t} is-visible`,window.clearTimeout(xe),xe=window.setTimeout(()=>{n.className=`toast`},3200))},Se=[`saved`,`preparing`,`applied`,`screening`,`interview`,`final`,`offer`,`rejected`,`withdrawn`],Ce=e=>e===`offer`||e===`rejected`||e===`withdrawn`,we=e=>e.charAt(0).toUpperCase()+e.slice(1),q=(e,t)=>!Ce(e.stage)&&!!(e.nextAction&&e.nextActionDue&&e.nextActionDue<=t),Te=(e,t)=>{let r=s(n(t)),i=[r.getFullYear(),String(r.getMonth()+1).padStart(2,`0`),String(r.getDate()).padStart(2,`0`)].join(`-`);return e.filter(e=>e.appliedAt&&e.appliedAt.slice(0,10)>=i).length},Ee=e=>Se.map(t=>`<option value="${t}" ${t===e?`selected`:``}>${we(t)}</option>`).join(``),De=(e,t)=>{let n=q(e,t),r=e.nextAction||`No next action`,i=e.nextActionDue?`Due ${W(e.nextActionDue)}`:`No due date`;return`
    <details class="application-row ${n?`application-row--attention`:``}" data-application-id="${W(e.id)}">
      <summary>
        <span class="application-row__copy">
          <small>${n?`NEEDS ATTENTION`:we(e.stage).toUpperCase()}</small>
          <strong>${W(e.company)}</strong>
          <em>${W(e.role)}</em>
        </span>
        <span class="application-row__next">
          <strong>${W(r)}</strong>
          <small>${i}</small>
        </span>
      </summary>

      <div class="application-row__editor">
        <div class="planner-form-grid application-row__quickedit">
          <label>Stage
            <select data-field="stage" aria-label="Stage for ${W(e.company)}">${Ee(e.stage)}</select>
          </label>
          <label>Next action due
            <input data-field="nextActionDue" type="date" value="${W(e.nextActionDue??``)}">
          </label>
        </div>
        <label>Next action
          <input data-field="nextAction" value="${W(e.nextAction??``)}" placeholder="Prepare interview">
        </label>

        <details class="application-more">
          <summary>More details</summary>
          <div class="application-more__body">
            <div class="planner-form-grid">
              <label>Fit 1–5
                <input data-field="fitScore" type="number" min="1" max="5" value="${e.fitScore??``}">
              </label>
              <label>Next event
                <input data-field="nextEventAt" type="date" value="${W(e.nextEventAt?.slice(0,10)??``)}">
              </label>
            </div>
            <label>Job URL
              <input data-field="jobUrl" value="${W(e.jobUrl??``)}" placeholder="https://…">
            </label>
            <label>Fit reason
              <input data-field="fitReason" value="${W(e.fitReason??``)}" placeholder="Why this role fits">
            </label>
            <label>Notes
              <textarea data-field="notes" rows="2" placeholder="Private notes">${W(e.notes??``)}</textarea>
            </label>
          </div>
        </details>

        <div class="application-card__footer">
          <span>${e.appliedAt?`Applied ${W(e.appliedAt.slice(0,10))}`:e.savedAt?`Saved ${W(e.savedAt.slice(0,10))}`:`Not dated`}</span>
          <button type="button" class="btn btn--primary btn--tiny" data-action="application-save" data-id="${W(e.id)}">Save</button>
        </div>
      </div>
    </details>`},Oe=({todayKey:e,applications:t})=>{let n=Object.values(t),r=n.filter(t=>q(t,e)),i=n.filter(e=>e.stage===`screening`||e.stage===`interview`||e.stage===`final`).length,a=n.filter(e=>e.stage===`offer`).length,o=Te(n,e),s=[...n].sort((t,n)=>{let r=Number(q(n,e))-Number(q(t,e));if(r!==0)return r;let i=t.nextActionDue??`9999-12-31`,a=n.nextActionDue??`9999-12-31`;return i.localeCompare(a)||t.company.localeCompare(n.company)});return`
    <section class="applications applications--simple">
      <header class="planner-manager__head planner-manager__head--compact">
        <button type="button" class="back" data-action="close-applications">← Job Search</button>
        <p class="day__date">APPLICATIONS</p>
        <h1>Pipeline</h1>
        <p>Keep only the next move visible.</p>
      </header>

      <section class="application-metrics application-metrics--simple">
        <div><strong>${r.length}</strong><span>needs attention</span></div>
        <div><strong>${o}</strong><span>applied this week</span></div>
        <div><strong>${i}</strong><span>live interviews</span></div>
        <div><strong>${a}</strong><span>offers</span></div>
      </section>

      ${r.length?`<section class="application-attention">
            <div class="planner-section-head"><div><span>NEEDS ATTENTION</span><strong>Closest conversion work first</strong></div></div>
            ${r.map(e=>`<div class="application-attention__row">
                    <div><strong>${W(e.company)}</strong><span>${W(e.nextAction??``)}</span></div>
                    <span>${W(e.nextActionDue??``)}</span>
                  </div>`).join(``)}
          </section>`:``}

      <section class="planner-manager__section planner-manager__section--flat">
        <div class="planner-section-head"><div><span>PIPELINE</span><strong>${n.length} applications</strong></div></div>
        <div class="application-list">
          ${s.length?s.map(t=>De(t,e)).join(``):`<p class="empty">No applications yet.</p>`}
        </div>

        <details class="planner-disclosure planner-disclosure--create">
          <summary>＋ Add application</summary>
          <div class="planner-disclosure__body">
            <div class="planner-form-grid">
              <label>Company<input id="application-new-company" placeholder="Company"></label>
              <label>Role<input id="application-new-role" placeholder="AI Solutions Engineer"></label>
              <label>Fit 1–5<input id="application-new-fit" type="number" min="1" max="5"></label>
              <label>Stage<select id="application-new-stage">${Ee(`saved`)}</select></label>
              <label>Next action due<input id="application-new-due" type="date"></label>
              <label>Job URL<input id="application-new-url" placeholder="https://…"></label>
            </div>
            <label>Next action<input id="application-new-next" placeholder="Tailor and submit application"></label>
            <button type="button" class="btn btn--primary btn--tiny" data-action="application-add">Add application</button>
          </div>
        </details>
      </section>
    </section>`},ke=e=>e.stages.flatMap(e=>e.lessons),Ae=(e,t)=>t[e]!==void 0,je=(e,t)=>{let n=e.filter(e=>e.priority===`core`),r=n.filter(e=>Ae(e.id,t)),i=n.reduce((e,t)=>e+t.durationMinutes,0),a=r.reduce((e,t)=>e+t.durationMinutes,0);return{completedLessons:r.length,totalLessons:n.length,completedMinutes:a,totalMinutes:i,completionRate:i===0?0:Math.round(a/i*100)}},J=(e,t)=>je(ke(e),t),Y=(e,t)=>ke(e).find(e=>e.priority===`core`&&!Ae(e.id,t)),X=e=>{let t=Math.floor(e/60),n=e%60;return t===0?`${n}m`:n===0?`${t}h`:`${t}h ${n}m`},Me=e=>{let t=(e.habit??e.id).toLowerCase();return t.includes(`gym`)?`⌁`:t.includes(`learning`)?`◇`:t.includes(`work`)?`▣`:t.includes(`personal`)?`◆`:t.includes(`content`)?`✦`:t.includes(`job`)?`◎`:t.includes(`pin`)?`♡`:t.includes(`wind`)?`☾`:`·`},Ne=(e,t,n)=>`<button type="button" class="${G(`today-status__btn`,e===t&&`is-active`)}"
           data-action="set-status" data-status="${e}" aria-pressed="${e===t}">${n}</button>`,Pe=(e,t)=>`
  <li class="${G(`today-task`,e.done&&`is-done`)}">
    <button class="today-task__hit" type="button" data-action="toggle-task" data-id="${W(e.id)}"
            ${t?`disabled`:``} aria-pressed="${e.done}">
      <span class="today-task__check" aria-hidden="true">${e.done?`✓`:Me(e)}</span>
      <span class="today-task__copy">
        <span class="today-task__name">${W(e.name)}</span>
        ${e.time?`<span class="today-task__time">${W(e.time)}</span>`:``}
      </span>
      ${e.core?`<span class="today-task__core">CORE</span>`:``}
      <span class="today-task__chev" aria-hidden="true">›</span>
    </button>
  </li>`,Fe=({dateKey:e,record:t,templates:r,learningPaths:i,learningProgress:a,greeting:o,outOfSync:s,planningHtml:c=``,plannedActions:l={},workstreams:u={}})=>{let d=t?null:w(e,r),f=t?.tasks??d?.tasks??[],m=t?.dayType??d?.dayType??``,h=t?.status??`active`,g=h===`rest`,_=Object.values(l).filter(t=>t.date===e&&(t.status===`planned`||t.status===`done`)&&u[t.workstreamId]?.execution.status===`active`).sort((e,t)=>e.id.localeCompare(t.id)),v=new Set(_.map(e=>e.linkedHabitId).filter(e=>!!e)),y=f.filter(e=>!(e.habit&&v.has(e.habit))),b=y.filter(e=>e.core),x=b.length?b:y,S=x.length+_.length,C=x.filter(e=>e.done).length+_.filter(e=>e.status===`done`).length,T=S>0?Math.round(C/S*100):0,E=S>0&&C===S,D=i.find(e=>Y(e,a)),O=D?Y(D,a):void 0,k=D?J(D,a):void 0,A=k&&k.completedLessons>0?`Resume`:`Start`,j=v.has(`learning`),M=_.map(e=>{let t=e.status===`done`,n=u[e.workstreamId];return`<li class="${G(`today-task`,`today-task--planned`,t&&`is-done`)}">
        <button class="today-task__hit" type="button" data-action="planning-action-status"
                data-id="${W(e.id)}" data-status="${t?`planned`:`done`}"
                ${g?`disabled`:``} aria-pressed="${t}">
          <span class="today-task__check" aria-hidden="true">${t?`✓`:`◆`}</span>
          <span class="today-task__copy">
            <span class="today-task__name">${W(e.title)}</span>
            <span class="today-task__time">${W(n?.title??`Planned action`)} · ${e.focusBlocks} Focus Block${e.focusBlocks===1?``:`s`}</span>
          </span>
          <span class="today-task__core today-task__core--focus">FOCUS</span>
          <span class="today-task__chev" aria-hidden="true">›</span>
        </button>
      </li>`}).join(``);return`
    <section class="today-dashboard">
      <header class="today-hero">
        <div class="today-brandrow">
          <strong class="today-brand">Routine</strong>
          <button class="today-edit" type="button" data-action="edit-template" aria-label="Edit today's routine">•••</button>
        </div>
        <div class="today-greeting">
          <div>
            <h1>${W(o)} <span aria-hidden="true">✦</span></h1>
            <p>${W(p(n(e)))}</p>
          </div>
          <span class="today-orb" aria-hidden="true">R</span>
        </div>
        <div class="today-view-toggle" role="group" aria-label="Today or week">
          <button class="is-active" type="button" data-action="today-mode" data-mode="today">Today</button>
          <button type="button" data-action="today-mode" data-mode="week">Week</button>
        </div>
      </header>

      ${s?`<div class="confirm today-sync">
             <p class="confirm__text">You changed this weekday's tasks after logging today. This snapshot still shows the old list.</p>
             <div class="row">
               <button class="btn btn--primary btn--tiny" type="button" data-action="sync-template">Update this day</button>
               <button class="btn btn--tiny" type="button" data-action="sync-dismiss">Keep as logged</button>
             </div>
           </div>`:``}

      ${c}

      <section class="today-score">
        <div class="today-ring" style="--rate:${T}">
          <div class="today-ring__inner"><strong>${T}%</strong></div>
        </div>
        <div class="today-score__copy">
          <strong>${E?`Agenda complete`:`today's agenda`}</strong>
          <span>${C} of ${S} important items</span>
          <div class="today-score__bar" role="img" aria-label="${T}% complete">
            <span style="width:${T}%"></span>
          </div>
        </div>
      </section>

      ${h===`active`?``:`<div class="today-state-note">${h===`rest`?`Rest day · excluded from the week average and neutral in your stats.`:`Skipped day · counts as an honest miss.`}</div>`}

      <div class="today-status" role="group" aria-label="Day status">
        ${Ne(`active`,h,`Track`)}
        ${Ne(`rest`,h,`Rest`)}
        ${Ne(`skipped`,h,`Skip`)}
      </div>

      ${D&&O&&k&&!j?`<button class="today-learning" type="button" data-action="open-learning-path" data-id="${W(D.id)}"
                   aria-label="${A} learning: ${W(O.title)}">
             <div class="today-learning__label">CONTINUE LEARNING</div>
             <div class="today-learning__content">
               <span class="today-learning__thumb" aria-hidden="true">
                 <span class="today-learning__spark">✦</span>
                 <span class="today-learning__book">◇</span>
               </span>

               <div class="today-learning__body">
                 <strong class="today-learning__title">${W(O.title)}</strong>
                 <span class="today-learning__meta">${W(D.title)} · ${X(O.durationMinutes)}</span>

                 <div class="today-learning__progress">
                   <span class="today-learning__track" role="img"
                         aria-label="${W(D.title)} ${k.completionRate}% complete">
                     <span style="width:${k.completionRate}%"></span>
                   </span>
                   <span class="today-learning__rate">${k.completionRate}%</span>
                   <span class="today-learning__resume">${A}</span>
                 </div>
               </div>

               <span class="today-learning__cta" aria-hidden="true">
                 <span class="today-learning__triangle"></span>
               </span>
             </div>
           </button>`:``}

      <section class="today-rest today-agenda">
        <div class="today-section-head">
          <span>TODAY'S AGENDA</span>
          <strong>${C} / ${S}</strong>
        </div>
        ${M||y.length?`<ul class="today-tasks">${M}${y.map(e=>Pe(e,g)).join(``)}</ul>`:`<p class="empty">Nothing scheduled for today.</p>`}
        <p class="today-agenda__hint">Focus actions replace matching generic Job Search / Project / Learning placeholders here. Routine history stays intact underneath.</p>
      </section>
      <p class="today-agenda__routine-note">Routine template: ${W(m||`No template`)}</p>
    </section>`},Ie={active:`Tracking`,rest:`Rest day`,skipped:`Skipped`},Le=(e,t)=>`
  <li class="${G(`task`,e.done&&`task--done`,e.core&&`task--core`)}">
    <button class="task__hit" type="button" data-action="toggle-task" data-id="${W(e.id)}"
            ${t?`disabled`:``} aria-pressed="${e.done}">
      <span class="task__box" aria-hidden="true">${e.done?`✓`:``}</span>
      <span class="task__body">
        <span class="task__name">${W(e.name)}</span>
        ${e.time?`<span class="task__time">${W(e.time)}</span>`:``}
      </span>
      ${e.core?`<span class="task__flag" title="Core task">core</span>`:``}
    </button>
  </li>`,Re=(e,t,n)=>`
  <div class="meter">
    <div class="meter__figure">
      <span class="meter__value">${e}<span class="meter__pct">%</span></span>
      ${n?`<span class="meter__sub">core ${t}%</span>`:``}
    </div>
    <div class="meter__track" role="img" aria-label="${e}% complete">
      <div class="meter__ghost" style="width:${e}%"></div>
      ${n?`<div class="meter__fill" style="width:${t}%"></div>`:`<div class="meter__fill" style="width:${e}%"></div>`}
    </div>
  </div>`,ze=e=>`
  <div class="chips" role="group" aria-label="Day status">
    ${[`active`,`rest`,`skipped`].map(t=>`<button type="button" class="${G(`chip`,e===t&&`chip--on`,`chip--${t}`)}"
                    data-action="set-status" data-status="${t}" aria-pressed="${e===t}">
                  ${Ie[t]}
                </button>`).join(``)}
  </div>`,Be=({dateKey:e,todayKey:t,record:r,templates:i,standalone:a,outOfSync:o})=>{let s=n(e),c=u(e,t),l=r?null:w(e,i),d=r?.tasks??l?.tasks??[],f=r?.dayType??l?.dayType??``,m=r?.status??`active`,h=m===`rest`,g=P(d),_=F(d);return`
    <section class="day">
      <header class="day__head">
        ${a?`<button class="linkback" type="button" data-action="back">← Week</button>`:``}
        <p class="day__date">${W(p(s))}${e===t?` <span class="tag">today</span>`:``}</p>
        <div class="day__titlerow">
          <h1 class="day__type">${W(f||`No tasks scheduled`)}</h1>
          ${c?``:`<button class="btn btn--tiny" type="button" data-action="edit-template">Edit tasks</button>`}
        </div>
        ${r?.editedRetroactively?`<p class="day__retro" title="First logged on a later day">logged later</p>`:``}
      </header>

      ${c?`<p class="empty">This day hasn't happened yet.</p>`:`
        ${o?`<div class="confirm">
                 <p class="confirm__text">You changed this weekday's tasks after logging this day. It still shows the old list.</p>
                 <div class="row">
                   <button class="btn btn--primary btn--tiny" type="button" data-action="sync-template">Update this day</button>
                   <button class="btn btn--tiny" type="button" data-action="sync-dismiss">Keep as logged</button>
                 </div>
               </div>`:``}
        ${h?`<p class="restnote">Rest day — excluded from the week average.</p>`:Re(g,_,ne(d))}
        ${ze(m)}
        ${d.length?`<ul class="tasks">${d.map(e=>Le(e,h)).join(``)}</ul>`:`<p class="empty">No tasks scheduled for this weekday.</p>`}
        ${!r&&d.length?`<p class="hint">Nothing logged yet — tap a task to start this day.</p>`:``}
      `}
    </section>`},Ve=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],He=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],Ue=[1,2,3,4,5,6,0],We=(e,t)=>[`<option value=""${t?``:` selected`}>No habit</option>`].concat(e.filter(e=>!e.archived||t===e.id).map(e=>`<option value="${W(e.id)}"${t===e.id?` selected`:``}>${W(e.label)}${e.archived?` (archived)`:``}</option>`)).join(``),Ge=(e,t)=>`
  <div class="daypick" role="group" aria-label="Weekday to edit">
    ${Ue.map(n=>`<button type="button" class="${G(`daypick__btn`,n===e&&`is-active`,t.includes(n)&&`is-dirty`)}"
                 data-action="edit-weekday" data-weekday="${n}" aria-pressed="${n===e}">
                ${W(He[n]??``)}
              </button>`).join(``)}
  </div>`,Ke=(e,t,n,r)=>`
  <li class="edit-task">
    <div class="edit-task__row">
      <input class="field__input edit-task__name" type="text" value="${W(e.name)}"
             placeholder="Task name" data-action="edit-name" data-index="${t}" />
      <div class="edit-task__order">
        <button class="iconbtn" type="button" data-action="task-move" data-index="${t}" data-dir="-1"
                ${t===0?`disabled`:``} aria-label="Move up">↑</button>
        <button class="iconbtn" type="button" data-action="task-move" data-index="${t}" data-dir="1"
                ${t===n-1?`disabled`:``} aria-label="Move down">↓</button>
      </div>
    </div>
    <div class="edit-task__row">
      <input class="field__input edit-task__time" type="text" value="${W(e.time)}"
             placeholder="e.g. 19:00–20:30" data-action="edit-time" data-index="${t}" />
      <select class="field__input edit-task__habit" data-action="edit-habit" data-index="${t}"
              aria-label="Habit">${We(r,e.habit)}</select>
    </div>
    <div class="edit-task__row edit-task__row--foot">
      <button class="chip ${e.core?`chip--on chip--active`:``}" type="button"
              data-action="task-core" data-index="${t}" aria-pressed="${e.core===!0}">
        ${e.core?`★ Core task`:`☆ Core task`}
      </button>
      <button class="btn btn--tiny btn--danger" type="button" data-action="task-delete" data-index="${t}">Delete</button>
    </div>
  </li>`,qe=({weekday:e,draft:t,dirty:n,habits:r})=>{let i=t[e]??{type:``,tasks:[]},a=Ve[e]??``;return`
    <section class="edit">
      <header class="day__head">
        <button class="linkback" type="button" data-action="edit-cancel">← Cancel</button>
        <h1 class="day__type">Edit tasks</h1>
      </header>

      ${Ge(e,n)}

      <p class="hint hint--tight">
        Editing <strong>every ${W(a)}</strong>, from today on. Days you have already logged keep the
        tasks they were logged with, so past percentages don't change.
        ${n.length>1?` You have unsaved edits on more than one weekday — saving applies them all.`:``}
      </p>

      <label class="field">
        <span class="field__label">Day label</span>
        <input class="field__input" type="text" value="${W(i.type)}"
               placeholder="e.g. WFH · Gym AM" data-action="edit-type" />
      </label>

      <ul class="edit-tasks">
        ${i.tasks.map((e,t)=>Ke(e,t,i.tasks.length,r)).join(``)}
      </ul>

      ${i.tasks.length===0?`<p class="empty">No tasks on ${W(a)}s yet.</p>`:``}

      <div class="row row--spread">
        <button class="btn" type="button" data-action="task-add">+ Add task</button>
        <button class="btn btn--primary" type="button" data-action="edit-save"
                ${n.length===0?`disabled`:``}>Save changes</button>
      </div>
    </section>`},Je=e=>Object.fromEntries(e.map(e=>[e.date,e])),Ye=e=>`<span class="insight-bar"><span style="width:${Math.max(0,Math.min(100,e))}%"></span></span>`,Xe=({todayKey:r,records:i,habits:a,learningProgress:o})=>{let s=Je(i),u=l(n(r)).filter(e=>e<=r),d=l(n(t(c(n(r),-7)))),f=I(u,s),p=I(d,s),m=f.average-p.average,h=a.map(e=>({habit:e,stats:R(e.id,i,r)})).filter(({habit:e,stats:t})=>(!e.archived||t.scheduled>0)&&t.scheduled>0).sort((e,t)=>t.stats.completionRate-e.stats.completionRate),g=h.reduce((e,t)=>Math.max(e,t.stats.longestStreak),0),_=h.reduce((e,t)=>Math.max(e,t.stats.currentStreak),0),v=e.map(e=>({path:e,stats:J(e,o)})),y=v.reduce((e,t)=>e+t.stats.completedMinutes,0),b=f.tracked===0?`Ready`:f.average>=80?`Strong`:f.average>=60?`Building`:`Reset`,x=b===`Strong`?`You’re building real momentum.`:b===`Building`?`Keep the next few days simple and consistent.`:b===`Reset`?`Pick one important win and restart the chain.`:`Track today to establish your baseline.`;return`
    <section class="insights">
      <header class="insights__head">
        <p class="day__date">PERSONAL OPERATING SYSTEM</p>
        <h1 class="day__type">Insights</h1>
      </header>

      <section class="insight-hero">
        <div class="insight-ring" style="--rate:${f.average}">
          <div><strong>${f.average}%</strong></div>
        </div>
        <div class="insight-hero__copy">
          <strong>this week</strong>
          <span class="${m>=0?`is-positive`:`is-negative`}">${m>=0?`▲`:`▼`} ${Math.abs(m)}% vs last week</span>
          <p>${W(x)}</p>
        </div>
      </section>

      <div class="insight-metrics">
        <div><span>◎ Consistency</span><strong>${f.average}%</strong><small>${f.tracked} tracked days</small></div>
        <div><span>♨ Streaks</span><strong>${_}</strong><small>best current</small></div>
        <div><span>◇ Learning</span><strong>${X(y)}</strong><small>core learned</small></div>
      </div>

      <section class="insight-card">
        <div class="insight-card__head"><span>HABITS OVERVIEW</span><small>lifetime</small></div>
        <div class="insight-habits">
          ${h.length?h.slice(0,7).map(({habit:e,stats:t})=>`
                <div class="insight-habit">
                  <span class="insight-habit__icon">•</span>
                  <strong>${W(e.label)}</strong>
                  ${Ye(t.completionRate)}
                  <span>${t.completionRate}%</span>
                </div>`).join(``):`<p class="empty">Track a routine day to unlock habit insights.</p>`}
        </div>
      </section>

      <div class="insight-split">
        <section class="insight-card insight-card--compact">
          <div class="insight-card__head"><span>LONGEST STREAK</span></div>
          <strong class="insight-big">${g} days</strong>
          <p>Consistency compounds.</p>
          <div class="insight-mini-bars" aria-hidden="true">
            ${[35,54,69,62,81,74,94].map((e,t)=>`<i style="height:${e}%" class="${t===6?`is-hot`:``}"></i>`).join(``)}
          </div>
        </section>

        <section class="insight-card insight-card--compact momentum-card">
          <div class="insight-card__head"><span>MOMENTUM</span></div>
          <div class="momentum-mark">↗</div>
          <strong class="insight-big">${b}</strong>
          <p>${W(x)}</p>
        </section>
      </div>

      <section class="insight-card">
        <div class="insight-card__head"><span>LEARNING PROGRESS</span><small>core path</small></div>
        <div class="insight-learning">
          ${v.map(({path:e,stats:t})=>`
            <button type="button" data-action="open-learning-path" data-id="${W(e.id)}">
              <strong>${W(e.title.replace(`Start & Grow a `,``).replace(`Great & Reliable `,``).replace(`Business `,``))}</strong>
              ${Ye(t.completionRate)}
              <span>${t.completionRate}%</span>
              <b>›</b>
            </button>`).join(``)}
        </div>
      </section>
    </section>`},Ze=e=>e===`core`?`Core`:e===`recommended`?`Recommended`:`Optional`,Qe=e=>e.type===`video`?`Watch`:e.type===`case-study`?`Open`:e.type===`practice`?`Practice`:e.type===`exercise`?`Exercise`:e.type===`project`?`Project`:`Read`,$e=(e,t)=>`<div class="learn-meter" role="img" aria-label="${W(t)} ${e}% complete">
     <span class="learn-meter__fill" style="width:${e}%"></span>
   </div>`,et=(e,t)=>{let n=Ae(e.id,t);return`
    <article class="learn-lesson${n?` is-complete`:``}" id="lesson-${W(e.id)}">
      <button class="learn-lesson__check" type="button"
              data-action="toggle-learning-lesson" data-id="${W(e.id)}"
              aria-pressed="${n}" aria-label="${n?`Mark incomplete`:`Mark complete`}: ${W(e.title)}">
        ${n?`✓`:``}
      </button>
      <div class="learn-lesson__body">
        <div class="learn-lesson__tags">
          <span class="learn-tag learn-tag--${W(e.priority)}">${Ze(e.priority)}</span>
          <span class="learn-lesson__time">${X(e.durationMinutes)}</span>
        </div>
        <h3 class="learn-lesson__title">${W(e.title)}</h3>
        <p class="learn-lesson__source">${W(e.source)}</p>
      </div>
      ${e.url?`<a class="learn-lesson__link" href="${W(e.url)}" target="_blank" rel="noopener noreferrer">${Qe(e)} ↗</a>`:``}
    </article>`},tt=(e,t)=>{let n=J(e,t),r=Y(e,t);return`
    <section class="learn">
      <button class="linkback" type="button" data-action="learning-back">← Learning paths</button>
      <header class="learn__head">
        <p class="day__date">CORE CURRICULUM</p>
        <h1 class="day__type">${W(e.title)}</h1>
        <p class="progress__intro">${W(e.subtitle)}</p>
      </header>

      <div class="learn-detail-summary">
        <div>
          <strong>${n.completionRate}%</strong>
          <span>core complete</span>
        </div>
        <div>
          <strong>${X(n.completedMinutes)}</strong>
          <span>learned</span>
        </div>
        <div>
          <strong>${X(Math.max(0,n.totalMinutes-n.completedMinutes))}</strong>
          <span>core remaining</span>
        </div>
      </div>
      ${$e(n.completionRate,e.title)}

      ${r?`<div class="learn-next">
             <span class="learn-continue__eyebrow">UP NEXT</span>
             <strong>${W(r.title)}</strong>
             <span>${W(r.source)} · ${X(r.durationMinutes)}</span>
             ${r.url?`<a class="btn btn--primary btn--tiny" href="${W(r.url)}" target="_blank" rel="noopener noreferrer">Start ↗</a>`:``}
           </div>`:``}

      <div class="learn-stages">
        ${e.stages.map(e=>{let n=je(e.lessons,t);return`
            <section class="learn-stage">
              <div class="learn-stage__head">
                <div>
                  <h2>${W(e.title)}</h2>
                  ${e.description?`<p>${W(e.description)}</p>`:``}
                </div>
                <span>${n.completionRate}%</span>
              </div>
              ${$e(n.completionRate,e.title)}
              <div class="learn-stage__meta">${n.completedLessons}/${n.totalLessons} core · ${X(n.completedMinutes)} / ${X(n.totalMinutes)}</div>
              <div class="learn-lessons">
                ${e.lessons.map(e=>et(e,t)).join(``)}
              </div>
            </section>`}).join(``)}
      </div>
    </section>`},nt=(e,t)=>{let n=e.find(e=>Y(e,t)),r=n?Y(n,t):void 0;return`
    <section class="learning-workstream-panel">
      ${n&&r?`<button class="learning-workstream-next" type="button" data-action="open-learning-path" data-id="${W(n.id)}">
             <span><small>CONTINUE LEARNING</small><strong>${W(r.title)}</strong><em>${W(n.title)} · ${X(r.durationMinutes)}</em></span>
             <span aria-hidden="true">›</span>
           </button>`:`<div class="learn-complete"><strong>Core paths complete.</strong><span>Recommended and optional resources remain available.</span></div>`}

      <div class="learning-workstream-paths">
        ${e.map(e=>{let n=J(e,t),r=Y(e,t);return`<button type="button" class="learning-workstream-path" data-action="open-learning-path" data-id="${W(e.id)}">
            <span>
              <strong>${W(e.title)}</strong>
              <small>${n.completedLessons}/${n.totalLessons} core · ${n.completionRate}%</small>
              <em>${r?`Next · ${W(r.title)}`:`Core complete`}</em>
            </span>
            <span class="learning-workstream-path__rate">${n.completionRate}%</span>
          </button>`}).join(``)}
      </div>
    </section>`},rt=e=>e===`north-star`?`NORTH STAR`:e===`primary`?`PRIMARY`:e===`support`?`SUPPORT`:`NEXT`,Z=e=>e?e.title:`Unknown workstream`,Q=e=>new Intl.DateTimeFormat(`en-US`,{weekday:`short`}).format(n(e)),$=e=>new Intl.DateTimeFormat(`en-US`,{day:`numeric`,month:`short`}).format(n(e)),it=(e,t)=>Object.values(e).filter(e=>(e.status===`planned`||e.status===`done`)&&(t===void 0||e.workstreamId===t)).sort((e,t)=>e.date.localeCompare(t.date)||e.id.localeCompare(t.id)),at=({plan:e,workstreams:t})=>{let n=`${e.capacityBlocks} Focus Block${e.capacityBlocks===1?``:`s`}`,r=e.items.map((e,n)=>{let r=t[e.workstreamId];return`<article class="${G(`planner-action`,n===0&&`planner-action--must`)}">
        <div class="planner-action__eyebrow">${n===0?`MUST WIN`:`NEXT`} · ${W(e.reason)}</div>
        <div class="planner-action__body">
          <button class="planner-action__copybtn" type="button" data-action="open-workstream" data-id="${W(e.workstreamId)}">
            <h3>${W(e.title)}</h3>
            <p>${W(Z(r))} · ${e.focusBlocks} block${e.focusBlocks===1?``:`s`}${e.due?` · due ${W(e.due)}`:``}</p>
          </button>
          <span class="planner-action__scheduled">SCHEDULED</span>
        </div>
      </article>`}).join(``),i=e.attention.length?`<div class="planner-attention">
        <div class="planner-attention__label">NEEDS ATTENTION · not scheduled</div>
        ${e.attention.slice(0,2).map(e=>`<button type="button" class="planner-attention__row" data-action="open-applications">
              <span><strong>${W(e.title)}</strong><small>${W(e.reason)} · due ${W(e.due)}</small></span>
              <span aria-hidden="true">›</span>
            </button>`).join(``)}
      </div>`:``,a=e.items.length===0&&e.suggestions.length?`<div class="planner-suggestions">
          <div class="planner-attention__label">SUGGESTED NEXT · does not use capacity</div>
          ${e.suggestions.slice(0,2).map(e=>`<button type="button" class="planner-attention__row" data-action="open-workstream" data-id="${W(e.workstreamId)}">
                <span><strong>${W(e.title)}</strong><small>${W(Z(t[e.workstreamId]))} · ${W(e.reason)}</small></span>
                <span aria-hidden="true">›</span>
              </button>`).join(``)}
        </div>`:``;return`
    <section class="planner-today">
      <div class="planner-section-head">
        <div>
          <span>PLAN FOR TODAY</span>
          <strong>${n}</strong>
        </div>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Plan week</button>
      </div>
      ${e.warnings.map(e=>`<p class="planner-warning">${W(e)}</p>`).join(``)}
      ${r||`<div class="planner-empty planner-empty--compact">
        <strong>No Focus Block scheduled today.</strong>
        <span>Suggestions below are context only until you explicitly put an action on today.</span>
      </div>`}
      ${i}
      ${a}
      <div class="planner-capacity">
        <span>${e.usedBlocks} / ${e.capacityBlocks} blocks scheduled</span>
        <span>${e.remainingBlocks} free</span>
      </div>
    </section>`},ot=({summary:e,workstreams:t})=>{let n=e.commitments.length?e.commitments.map(e=>{let n=t[e.workstreamId],r=e.targetBlocks>0?Math.min(100,Math.round(e.completedBlocks/e.targetBlocks*100)):0,i=e.scheduledBlocks<e.targetBlocks;return`<button type="button" class="planner-commitment ${i?`planner-commitment--risk`:``}"
                          data-action="open-workstream" data-id="${W(e.workstreamId)}">
            <div class="planner-commitment__top">
              <strong>${W(Z(n))}</strong>
              <span>${e.completedBlocks} done · ${e.scheduledBlocks} scheduled · ${e.targetBlocks} target</span>
            </div>
            <div class="planner-commitment__bar"><span style="width:${r}%"></span></div>
            <p>${i?`AT RISK · `:``}${W(e.outcome)}</p>
          </button>`}).join(``):`<div class="planner-empty planner-empty--compact">
        <strong>No Week Plan yet.</strong>
        <span>Allocate finite blocks before the week fills itself.</span>
      </div>`;return`
    <section class="planner-week">
      <div class="planner-section-head">
        <div>
          <span>WEEK PLAN</span>
          <strong>${e.completedBlocks} done · ${e.plannedBlocks} scheduled · ${e.capacityBlocks} capacity</strong>
        </div>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Plan week</button>
      </div>
      ${n}
    </section>`},st=({anchorKey:e,todayKey:t,capacityProfiles:r,plannedActions:i,workstreams:a})=>{let o=l(n(e)),s=it(i);return`
    <section class="week-calendar">
      <div class="planner-section-head">
        <div><span>EXECUTION CALENDAR</span><strong>What is actually scheduled each day</strong></div>
      </div>
      <div class="weekcal-grid">${o.map(e=>{let n=s.filter(t=>t.date===e),i=n.reduce((e,t)=>e+Math.max(1,Math.floor(t.focusBlocks||1)),0),o=D(e,r),c=Math.max(0,o-i),l=i>o?`OVER`:c===0&&o>0?`FULL`:`${c} free`;return`<article class="${G(`weekcal-day`,e===t&&`is-today`)}">
        <div class="weekcal-day__head">
          <div><strong>${W(Q(e))}</strong><span>${W($(e))}</span></div>
          <small>${i}/${o} · ${l}</small>
        </div>
        <div class="weekcal-day__items">
          ${n.length?n.map(e=>{let t=a[e.workstreamId];return`<button type="button" class="${G(`weekcal-item`,e.status===`done`&&`is-done`)}"
                                  data-action="open-workstream" data-id="${W(e.workstreamId)}">
                    <span>${W(e.title)}</span>
                    <small>${W(Z(t))} · ${e.focusBlocks} block${e.focusBlocks===1?``:`s`}</small>
                  </button>`}).join(``):`<span class="weekcal-day__empty">No Focus Block</span>`}
        </div>
      </article>`}).join(``)}</div>
    </section>`},ct=(e,t)=>[`<option value="">No linked habit</option>`,...e.filter(e=>!e.archived).map(e=>`<option value="${W(e.id)}" ${e.id===t?`selected`:``}>${W(e.label)}</option>`)].join(``),lt=(e,t)=>e.map(e=>`<option value="${W(e.id)}" ${e.id===t?`selected`:``}>${W(e.title)}</option>`).join(``),ut=(e,t,n)=>{let r=t[e.workstreamId];return`<details class="planner-action-row planner-disclosure">
    <summary>
      <span class="planner-action-row__date">${W($(e.date))}<small>${W(Q(e.date))}</small></span>
      <span class="planner-action-row__copy">
        <strong>${W(e.title)}</strong>
        <small>${W(Z(r))} · ${e.focusBlocks} block${e.focusBlocks===1?``:`s`}</small>
      </span>
      <span class="${G(`planner-status-pill`,e.status===`done`&&`is-done`)}">${W(e.status)}</span>
    </summary>
    <div class="planner-action-row__controls">
      <div class="planner-action__buttons">
        <button type="button" class="btn btn--tiny" data-action="planning-action-status" data-id="${W(e.id)}" data-status="done">Done</button>
        <button type="button" class="btn btn--tiny" data-action="planning-action-status" data-id="${W(e.id)}" data-status="deferred">Defer</button>
        <button type="button" class="btn btn--tiny" data-action="planning-action-status" data-id="${W(e.id)}" data-status="cancelled">Cancel</button>
      </div>
      ${e.status===`done`?``:`<div class="planner-replan">
            <input type="date" data-field="replanDate" value="${W(e.date<n?n:e.date)}">
            <button type="button" class="btn btn--tiny" data-action="planning-replan-action" data-id="${W(e.id)}">Move</button>
          </div>`}
    </div>
  </details>`},dt=({todayKey:e,workstreams:t,habits:r,weekPlan:i,plannedActions:a,weekSummary:o})=>{let s=Object.values(t),c=s.filter(e=>e.execution.status===`active`),u=new Set(l(n(e))),d=Object.values(a).filter(e=>u.has(e.date)&&e.status!==`cancelled`).sort((e,t)=>e.date.localeCompare(t.date)||e.id.localeCompare(t.id)),f=new Map((i?.commitments??[]).map(e=>[e.workstreamId,e])),m=new Map(o.commitments.map(e=>[e.workstreamId,e])),h=s.length?s.map(e=>{let t=m.get(e.id),n=e.plan.deadline?$(e.plan.deadline):`No deadline`,r=e.execution.nextAction||e.execution.milestone||e.outcome.goal||`No next action yet`,i=t?`${t.scheduledBlocks}/${t.targetBlocks} blocks`:`No weekly target`;return`<button type="button" class="planner-workstream-card"
                          data-action="open-workstream" data-id="${W(e.id)}">
            <span class="planner-workstream-card__top">
              <span class="planner-workstream-card__kicker">${rt(e.outcome.priority)} · ${W(e.type)}</span>
              <span class="${G(`planner-status-pill`,e.execution.status===`active`&&`is-active`)}">${W(e.execution.status)}</span>
            </span>
            <strong>${W(e.title)}</strong>
            <span class="planner-workstream-card__next">${W(r)}</span>
            <span class="planner-workstream-card__meta">
              <span>${W(n)}</span>
              <span>${W(i)}</span>
              <span aria-hidden="true">›</span>
            </span>
          </button>`}).join(``):`<p class="empty">No workstreams yet. Add only what you are actively managing.</p>`,g=c.length?c.map(e=>{let t=f.get(e.id);return`<div class="planner-commitment-edit" data-commitment-workstream="${W(e.id)}">
            <strong>${W(e.title)}</strong>
            <label>Blocks<input data-field="targetBlocks" type="number" min="0" max="14" value="${t?.targetBlocks??0}"></label>
            <label>Outcome<input data-field="outcome" value="${W(t?.outcome??e.execution.weeklyCommitment??``)}"></label>
          </div>`}).join(``):`<p class="empty">Activate a workstream before allocating blocks.</p>`,_=o.commitments.length?o.commitments.map(e=>{let n=t[e.workstreamId];return`<button type="button" class="planner-allocation-row"
                          data-action="open-workstream" data-id="${W(e.workstreamId)}">
            <span><strong>${W(Z(n))}</strong><small>${W(e.outcome)}</small></span>
            <span><strong>${e.scheduledBlocks}/${e.targetBlocks}</strong><small>blocks</small></span>
          </button>`}).join(``):`<p class="empty">No weekly allocation yet.</p>`;return`
    <section class="planner-manager planner-manager--simple">
      <header class="planner-manager__head planner-manager__head--compact">
        <button type="button" class="back" data-action="close-planner">← Back</button>
        <p class="day__date">PLANNING</p>
        <h1>Plan this week</h1>
        <p>${W(p(n(e)))}</p>
      </header>

      <section class="planner-overview">
        <div><strong>${o.plannedBlocks}/${o.capacityBlocks}</strong><span>blocks scheduled</span></div>
        <div><strong>${c.length}</strong><span>active workstreams</span></div>
        <div><strong>${d.length}</strong><span>planned actions</span></div>
      </section>

      <section class="planner-manager__section planner-manager__section--flat">
        <div class="planner-section-head">
          <div><span>WORKSTREAMS</span><strong>Tap a card to see its schedule</strong></div>
        </div>
        <div class="planner-workstream-list">${h}</div>

        <details class="planner-disclosure planner-disclosure--create">
          <summary>＋ Add workstream</summary>
          <div class="planner-disclosure__body planner-create">
            <div class="planner-form-grid">
              <label>Title<input id="planner-new-title" placeholder="Job Search"></label>
              <label>Type<select id="planner-new-type">
                <option value="career">Career</option>
                <option value="project">Project</option>
                <option value="learning">Learning</option>
              </select></label>
              <label>Priority<select id="planner-new-priority">
                <option value="north-star">North Star</option>
                <option value="primary">Primary</option>
                <option value="support">Support</option>
                <option value="next">Next</option>
              </select></label>
              <label>Linked habit<select id="planner-new-habit">${ct(r)}</select></label>
            </div>
            <button type="button" class="btn btn--primary btn--tiny" data-action="planning-add-workstream">Add workstream</button>
          </div>
        </details>
      </section>

      <section class="planner-manager__section planner-manager__section--flat">
        <div class="planner-section-head">
          <div><span>THIS WEEK</span><strong>${o.completedBlocks} done · ${o.plannedBlocks} scheduled · ${o.capacityBlocks} capacity</strong></div>
        </div>
        <div class="planner-allocation-list">${_}</div>

        <details class="planner-disclosure">
          <summary>Adjust weekly allocation</summary>
          <div class="planner-disclosure__body">
            ${g}
            <button type="button" class="btn btn--primary btn--tiny" data-action="planning-save-week">Save Week Plan</button>
          </div>
        </details>
      </section>

      <section class="planner-manager__section planner-manager__section--flat">
        <div class="planner-section-head">
          <div><span>PLANNED ACTIONS</span><strong>${d.length} this week</strong></div>
        </div>
        <div class="planner-action-list">
          ${d.length?d.map(n=>ut(n,t,e)).join(``):`<p class="empty">No actions planned this week.</p>`}
        </div>

        <details class="planner-disclosure planner-disclosure--create">
          <summary>＋ Add action</summary>
          <div class="planner-disclosure__body planner-create">
            ${c.length?`<div class="planner-form-grid">
                  <label>Workstream<select id="planner-action-workstream">${lt(c)}</select></label>
                  <label>Date<input id="planner-action-date" type="date" value="${W(e)}"></label>
                  <label>Blocks<input id="planner-action-blocks" type="number" min="1" max="3" value="1"></label>
                  <label>Due<input id="planner-action-due" type="date"></label>
                </div>
                <label>Action<input id="planner-action-title" placeholder="Prepare and submit application"></label>
                <button type="button" class="btn btn--primary btn--tiny" data-action="planning-add-action">Add action</button>`:`<p class="empty">Activate a workstream first.</p>`}
          </div>
        </details>
      </section>

      <details class="planner-disclosure planner-review-card">
        <summary>
          <span><small>WEEKLY REVIEW</small><strong>${i?.review?`Review saved`:`Do this at the end of the week`}</strong></span>
          <span>›</span>
        </summary>
        <div class="planner-disclosure__body">
          <label>Wins<textarea id="planner-review-wins" rows="2">${W(i?.review?.wins??``)}</textarea></label>
          <label>Misses<textarea id="planner-review-misses" rows="2">${W(i?.review?.misses??``)}</textarea></label>
          <label>Bottleneck<input id="planner-review-bottleneck" value="${W(i?.review?.bottleneck??``)}" placeholder="What repeatedly got in the way?"></label>
          <label>Adjustment for next week<input id="planner-review-adjustment" value="${W(i?.review?.adjustment??``)}" placeholder="One change only"></label>
          <div class="planner-review__actions">
            <button type="button" class="btn btn--primary btn--tiny" data-action="planning-save-review">Save review</button>
            <button type="button" class="btn btn--tiny" data-action="planning-create-next-week">Create next week</button>
          </div>
        </div>
      </details>
    </section>`},ft=({workstream:e,todayKey:r,capacityProfiles:i,plannedActions:a,jobApplications:o,habits:u,domainHtml:d=``,weekProgress:f})=>{let p=it(a,e.id),m=p.filter(e=>e.date>=r),h=l(n(r)),g=p.some(e=>h.includes(e.date))?r:m[0]?.date??r,_=s(n(g)),v=l(n(g)),y=p.filter(e=>v.includes(e.date)),b=v.map(e=>{let t=y.filter(t=>t.date===e),n=t.reduce((e,t)=>e+Math.max(1,Math.floor(t.focusBlocks||1)),0),a=D(e,i);return`<div class="${G(`workstream-day`,e===r&&`is-today`)}">
        <div class="workstream-day__date"><strong>${W(Q(e))}</strong><span>${W($(e))}</span></div>
        ${t.length?t.map(e=>`<div class="${G(`workstream-day__action`,e.status===`done`&&`is-done`)}">
                  <span>${W(e.title)}</span><small>${e.focusBlocks} block${e.focusBlocks===1?``:`s`}</small>
                </div>`).join(``):`<span class="workstream-day__empty">—</span>`}
        <small class="workstream-day__capacity">${n}/${a}</small>
      </div>`}).join(``),x=m.length?m.map(e=>`<article class="${G(`workstream-schedule__item`,e.status===`done`&&`is-done`)}">
            <div><strong>${W($(e.date))}</strong><span>${W(Q(e.date))}</span></div>
            <div><strong>${W(e.title)}</strong><span>${e.focusBlocks} Focus Block${e.focusBlocks===1?``:`s`}${e.due?` · due ${W(e.due)}`:``}</span></div>
          </article>`).join(``):`<p class="empty">No upcoming action is scheduled for this workstream.</p>`,S=f&&f.targetBlocks>0?Math.min(100,Math.round(f.completedBlocks/f.targetBlocks*100)):null,C=e.type===`career`?Object.values(o).filter(e=>e.stage!==`rejected`&&e.stage!==`withdrawn`):[],w=C.filter(e=>e.stage===`screening`||e.stage===`interview`||e.stage===`final`).length;return`
    <section class="workstream-detail">
      <header class="planner-manager__head">
        <button type="button" class="back" data-action="close-workstream">← Back</button>
        <p class="day__date">${rt(e.outcome.priority)} · ${W(e.execution.status.toUpperCase())}</p>
        <h1>${W(e.title)}</h1>
        <p>${W(e.outcome.goal||`No goal written yet.`)}</p>
      </header>

      <section class="workstream-hero">
        <div><span>DEADLINE</span><strong>${W(e.plan.deadline??`No deadline`)}</strong></div>
        <div><span>CURRENT MILESTONE</span><strong>${W(e.execution.milestone??`No milestone`)}</strong></div>
        <div><span>NEXT ACTION</span><strong>${W(e.execution.nextAction??`No next action`)}</strong></div>
      </section>

      ${S===null?``:`<section class="workstream-week-progress">
            <div><span>THIS WEEK</span><strong>${S}%</strong></div>
            <div class="workstream-week-progress__bar"><span style="width:${S}%"></span></div>
            <small>${f?.completedBlocks??0} done · ${f?.scheduledBlocks??0} scheduled · ${f?.targetBlocks??0} target blocks</small>
          </section>`}

      ${d}

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>THIS WEEK</span><strong>${W($(t(_)))} – ${W($(t(c(_,6))))}</strong></div></div>
        <div class="workstream-week">${b}</div>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>SCHEDULE</span><strong>Only this workstream</strong></div></div>
        <div class="workstream-schedule">${x}</div>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>DEFINITION OF DONE</span><strong>Finish line</strong></div></div>
        ${e.plan.definitionOfDone.length?`<ul class="workstream-dod">${e.plan.definitionOfDone.map(e=>`<li>${W(e)}</li>`).join(``)}</ul>`:`<p class="empty">No finish line written yet.</p>`}
      </section>

      <details class="planner-disclosure workstream-edit" data-workstream-id="${W(e.id)}">
        <summary>
          <span><small>EDIT</small><strong>Workstream details</strong></span>
          <span>›</span>
        </summary>
        <div class="planner-disclosure__body">
          <div class="planner-form-grid">
            <label>Status
              <select data-field="status">
                ${[`active`,`queued`,`maintenance`,`parked`,`done`].map(t=>`<option value="${t}" ${t===e.execution.status?`selected`:``}>${t}</option>`).join(``)}
              </select>
            </label>
            <label>Deadline<input data-field="deadline" type="date" value="${W(e.plan.deadline??``)}"></label>
            <label>Habit<select data-field="habit">${ct(u,e.linkedHabitId)}</select></label>
          </div>
          <label>Goal<input data-field="goal" value="${W(e.outcome.goal)}"></label>
          <label>Milestone<input data-field="milestone" value="${W(e.execution.milestone??``)}"></label>
          <label>Next action<input data-field="nextAction" value="${W(e.execution.nextAction??``)}"></label>
          <label>Definition of done<textarea data-field="definitionOfDone" rows="3">${W(e.plan.definitionOfDone.join(`
`))}</textarea></label>
          <button type="button" class="btn btn--primary btn--tiny" data-action="planning-save-workstream" data-id="${W(e.id)}">Save changes</button>
        </div>
      </details>

      ${e.type===`career`?`<section class="planner-manager__section">
            <div class="planner-section-head">
              <div><span>APPLICATIONS</span><strong>${C.length} active · ${w} live pipeline</strong></div>
              <button type="button" class="btn btn--tiny" data-action="open-applications">Open tracker</button>
            </div>
          </section>`:``}
    </section>`},pt=[`Asia/Bangkok`,`Asia/Singapore`,`Asia/Tokyo`,`Europe/London`,`Europe/Berlin`,`America/New_York`,`America/Los_Angeles`,`UTC`],mt=e=>{if(!e)return null;let t=new Date(e).getTime();return Number.isNaN(t)?null:Math.floor((Date.now()-t)/864e5)},ht=({settings:e,habits:t,dayCount:n,templateCount:r,ephemeral:i,rawOpen:a,raw:o,resetArmed:s,pendingImport:c})=>{let l=mt(e.lastExportAt);return`
    <section class="settings">
      <p class="day__date">CONTROL CENTER</p>
      <h1 class="settings__title">More</h1>

      ${i?`<p class="warn">Browser storage is unavailable (private window?). Data is kept in memory only and will be lost when this tab closes.</p>`:``}

      <div class="card">
        <h2 class="card__title">Backup</h2>
        <p class="card__note">
          ${n} day${n===1?``:`s`} logged · ${r} template version${r===1?``:`s`}.
          ${l===null?`Never exported.`:`Last export ${l===0?`today`:`${l} day${l===1?``:`s`} ago`}.`}
        </p>
        <p class="card__note card__note--dim">
          Local storage is one cache clear away from empty. Export monthly and keep the file somewhere real.
        </p>
        <div class="row">
          <button class="btn btn--primary" type="button" data-action="export">Export JSON</button>
          <button class="btn" type="button" data-action="import-pick">Import JSON…</button>
        </div>
        <input id="import-file" class="visually-hidden" type="file" accept="application/json,.json" />
        ${c?`<div class="confirm">
                 <p class="confirm__text">
                   <strong>${W(c.fileName)}</strong> replaces your current data:
                   adds ${c.added}, overwrites ${c.overwritten}, leaves ${c.unchanged} unchanged.
                   Learning progress: ${c.learningCompleted} completed lesson${c.learningCompleted===1?``:`s`}.
                   Days and learning progress not in the file are removed.
                 </p>
                 <div class="row">
                   <button class="btn btn--primary" type="button" data-action="import-confirm">Replace my data</button>
                   <button class="btn" type="button" data-action="import-cancel">Cancel</button>
                 </div>
               </div>`:``}
      </div>

      <div class="card">
        <h2 class="card__title">Weekly schedule</h2>
        <p class="card__note">Add, rename, reorder or remove tasks on any weekday.</p>
        <div class="row">
          <button class="btn" type="button" data-action="edit-template">Edit tasks</button>
        </div>
      </div>

      <div class="card">
        <h2 class="card__title">Habits</h2>
        <p class="card__note">Rename a habit without resetting its Progress history. The stable id stays unchanged.</p>
        ${t.map(e=>`<div class="field">
              <span class="field__label">${W(e.id)}${e.archived?` · archived`:``}</span>
              <div class="row">
                <input class="field__input" type="text" value="${W(e.label)}"
                       data-action="set-habit-label" data-id="${W(e.id)}" />
                <button class="btn btn--tiny" type="button" data-action="toggle-habit-archive"
                        data-id="${W(e.id)}" data-archived="${e.archived===!0}">
                  ${e.archived?`Restore`:`Archive`}
                </button>
              </div>
            </div>`).join(``)}
        <div class="field">
          <span class="field__label">New habit</span>
          <div class="row">
            <input id="new-habit-label" class="field__input" type="text" placeholder="e.g. Morning run" />
            <button class="btn" type="button" data-action="add-habit">+ Add habit</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="card__title">Time</h2>
        <label class="field">
          <span class="field__label">Home timezone</span>
          <input class="field__input" type="text" list="tz-list" value="${W(e.timezone)}"
                 data-action="set-timezone" spellcheck="false" autocapitalize="off" />
          <datalist id="tz-list">${pt.map(e=>`<option value="${W(e)}"></option>`).join(``)}</datalist>
          <span class="field__hint">Dates follow this zone, so travelling doesn't shift your history.</span>
        </label>
        <label class="field">
          <span class="field__label">Day starts at</span>
          <input class="field__input field__input--num" type="number" min="0" max="12" step="1"
                 value="${e.dayCutoffHour}" data-action="set-cutoff" />
          <span class="field__hint">Taps before ${e.dayCutoffHour}:00 still count for the previous day.</span>
        </label>
      </div>

      <div class="card">
        <h2 class="card__title">Data</h2>
        <p class="card__note">Schema v5. Weeks run Monday to Sunday.</p>
        <div class="row">
          <button class="btn" type="button" data-action="toggle-raw">${a?`Hide`:`View`} raw data</button>
        </div>
        ${a?`<pre class="raw">${W(o)}</pre>`:``}
      </div>

      <div class="card card--danger">
        <h2 class="card__title">Danger zone</h2>
        ${s?`<p class="card__note">Type <code>ERASE</code> to wipe every day record and reset templates. Export first.</p>
               <div class="row">
                 <input class="field__input" type="text" id="reset-confirm" placeholder="ERASE" autocapitalize="characters" spellcheck="false" />
                 <button class="btn btn--danger" type="button" data-action="reset-confirm">Erase everything</button>
                 <button class="btn" type="button" data-action="reset-cancel">Cancel</button>
               </div>`:`<div class="row"><button class="btn btn--danger" type="button" data-action="reset-arm">Reset all data…</button></div>`}
      </div>
    </section>`},gt=(e,t,r)=>{let i=le[n(e).getDay()]??``,a=u(e,t),o=e===t,s=r?.status===`rest`,c=r?F(r.tasks):0,l=r?P(r.tasks):0,d=a?`future`:s?`rest`:r?`tracked`:`untracked`,f=s?`<span class="bar__rest">R</span>`:`<span class="bar__ghost" style="height:${l}%"></span><span class="bar__fill" style="height:${c}%"></span>`;return`
    <${a?`div`:`button`} class="${G(`bar`,`bar--${d}`,o&&`bar--today`)}"
      ${a?``:`type="button" data-action="open-day" data-date="${W(e)}"`}
      ${a?``:`aria-label="${W(i)} ${c}%"`}>
      <span class="bar__col">${f}</span>
      <span class="bar__pct">${a?``:s?`—`:r?`${c}%`:`·`}</span>
      <span class="bar__day">${W(i)}</span>
    </${a?`div`:`button`}>`},_t=({anchorKey:e,todayKey:t,records:r,planningHtml:i=``,calendarHtml:a=``})=>{let o=n(e),d=s(o),f=l(o),p=f.filter(e=>!u(e,t)),m=I(p,r),g=s(c(n(t),28)),_=d.getTime()>=g.getTime(),v=[`${m.tracked} of ${p.length} day${p.length===1?``:`s`} tracked`];return m.rest&&v.push(`${m.rest} rest`),m.untracked&&v.push(`${m.untracked} untracked`),`
    <section class="week">
      <div class="today-view-toggle today-view-toggle--week" role="group" aria-label="Today or week">
        <button type="button" data-action="today-mode" data-mode="today">Today</button>
        <button class="is-active" type="button" data-action="today-mode" data-mode="week">Week</button>
      </div>
      <header class="week__head">
        <button class="navbtn" type="button" data-action="week-nav" data-delta="-1" aria-label="Previous week">‹</button>
        <div class="week__title">
          <p class="week__range">${W(h(d,c(d,6)))}</p>
          <p class="week__meta">${W(v.join(` · `))}</p>
        </div>
        <button class="navbtn" type="button" data-action="week-nav" data-delta="1"
          aria-label="Next week" ${_?`disabled`:``}>›</button>
      </header>

      ${i}
      ${a}

      <div class="week-routine-head"><span>ROUTINE HISTORY</span><small>Habit consistency stays separate from execution planning.</small></div>
      <div class="week__avg">
        <span class="week__avgvalue">${m.average}<span class="meter__pct">%</span></span>
        <span class="week__avglabel">week average${m.averageTotal===m.average?``:` · total ${m.averageTotal}%`}</span>
      </div>

      <div class="chart">${f.map(e=>gt(e,t,r[e])).join(``)}</div>

      <p class="hint">Tap any past day to log it. Rest days are excluded from the average.</p>
    </section>`},vt={"north-star":0,primary:1,support:2,next:3},yt=e=>e===`north-star`?`NORTH STAR`:e===`primary`?`PRIMARY`:e===`support`?`SUPPORT`:`NEXT`,bt=e=>{if(!e)return`No deadline`;let[t,n,r]=e.split(`-`).map(Number);return!t||!n||!r?e:new Intl.DateTimeFormat(`en-US`,{day:`numeric`,month:`short`}).format(new Date(t,n-1,r))},xt=({workstreams:e,weekSummary:t,weekPlan:n,applications:r,learningPaths:i,learningProgress:a})=>{let o=Object.values(e).sort((e,t)=>vt[e.outcome.priority]-vt[t.outcome.priority]||e.title.localeCompare(t.title)),s=o.filter(e=>e.execution.status===`active`),c=o.filter(e=>[`queued`,`maintenance`,`parked`].includes(e.execution.status)),l=new Map(t.commitments.map(e=>[e.workstreamId,e])),u=s.length?s.map(e=>{let t=l.get(e.id),n=t&&t.targetBlocks>0?Math.min(100,Math.round(t.completedBlocks/t.targetBlocks*100)):null,o=t?`${t.completedBlocks} done · ${t.scheduledBlocks}/${t.targetBlocks} blocks`:`No weekly target`,s=e.execution.nextAction||e.execution.milestone||e.outcome.goal||`No next action yet`,c=``;if(e.type===`career`){let e=Object.values(r).filter(e=>[`screening`,`interview`,`final`].includes(e.stage)).length;c=e?`${e} live interview${e===1?``:`s`}`:`${Object.keys(r).length} applications`}else if(e.type===`learning`){let e=i.find(e=>Y(e,a));if(e){let t=J(e,a);c=`${e.title} · ${t.completionRate}%`}}return`<button type="button" class="work-card" data-action="open-workstream" data-id="${W(e.id)}">
            <span class="work-card__top">
              <span>${yt(e.outcome.priority)}</span>
              <span>${n===null?W(o):`THIS WEEK · ${n}%`}</span>
            </span>
            <strong>${W(e.title)}</strong>
            <span class="work-card__next">${W(s)}</span>
            ${n===null?``:`<span class="work-card__progress" role="img" aria-label="This week ${n}% complete">
                   <span style="width:${n}%"></span>
                 </span>
                 <span class="work-card__progressmeta">${W(o)}</span>`}
            <span class="work-card__bottom">
              <span>${W(bt(e.plan.deadline))}${c?` · ${W(c)}`:``}</span>
              <span aria-hidden="true">›</span>
            </span>
          </button>`}).join(``):`<div class="work-empty"><strong>No active workstreams.</strong><span>Use Plan week to activate only what matters now.</span></div>`,d=c.length?`<section class="work-section work-section--secondary">
        <div class="work-section__head"><span>ON DECK</span><strong>Important, not active today</strong></div>
        <div class="work-deck">
          ${c.map(e=>`<button type="button" class="work-deck__item" data-action="open-workstream" data-id="${W(e.id)}">
                <span><strong>${W(e.title)}</strong><small>${W(e.execution.status)}</small></span>
                <span>›</span>
              </button>`).join(``)}
        </div>
      </section>`:``,f=o.some(e=>e.type===`learning`)?``:(()=>{let e=i.find(e=>Y(e,a)),t=e?Y(e,a):void 0;return`<button type="button" class="work-utility" data-action="open-learning-hub">
          <span><small>LEARNING</small><strong>Learning Paths</strong><em>${t?`Next · ${W(t.title)} · ${X(t.durationMinutes)}`:`Open curriculum`}</em></span>
          <span>›</span>
        </button>`})(),p=Math.max(0,t.capacityBlocks-t.plannedBlocks);return`
    <section class="work-home">
      <header class="work-home__head">
        <div>
          <p class="day__date">WORK</p>
          <h1>What are you moving forward?</h1>
        </div>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Plan week</button>
      </header>

      <div class="work-week-label">WEEK OF ${W(bt(t.startsOn).toUpperCase())}</div>
      <section class="work-week-summary">
        <div><strong>${t.plannedBlocks}/${t.capacityBlocks}</strong><span>blocks scheduled</span></div>
        <div><strong>${t.completedBlocks}</strong><span>blocks done</span></div>
        <div><strong>${p}</strong><span>buffer</span></div>
      </section>

      <section class="work-section">
        <div class="work-section__head"><span>ACTIVE NOW</span><strong>${s.length} workstream${s.length===1?``:`s`}</strong></div>
        <div class="work-card-list">${u}</div>
      </section>

      ${d}
      ${f}

      ${n?``:`<p class="work-home__hint">No Week Plan yet. Keep Work simple: activate only what deserves Focus Blocks this week.</p>`}
    </section>`},St=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],Ct=()=>{let r=be(),i=()=>new Date().toISOString(),a=()=>{let e=r.getSettings();return o(e.timezone,e.dayCutoffHour)};r.init(i(),a());let s={tab:`today`,todayMode:`today`,weekAnchor:a(),openDay:null,learningPathId:null,learningReturnWorkstreamId:null,planningOpen:!1,applicationsOpen:!1,applicationsReturnWorkstreamId:null,workstreamOpenId:null,workstreamReturn:`today`,rawOpen:!1,resetArmed:!1,pendingImport:null,nudgeDismissed:!1,editing:null,syncDismissed:new Set},d=e=>{let t=r.getDay(e);if(t)return t;let n=b(e,r.getTemplates(),i(),a());return r.setDay(e,n,n.updatedAt),n},f=e=>{let t={};for(let n of e)t[n]=r.getDay(n);return t},p=()=>{document.documentElement.scrollTop=0,document.body.scrollTop=0},m=()=>{if(s.nudgeDismissed)return!1;let{lastExportAt:e}=r.getSettings(),t=r.dayKeys().length;return e===null?t>=14:(Date.now()-new Date(e).getTime())/864e5>30},h=e=>[[`today`,`Today`,`⌂`],[`work`,`Work`,`◇`],[`insights`,`Insights`,`▥`],[`more`,`More`,`•••`]].map(([t,n,r])=>`<button type="button" class="tabbar__btn${e===t?` is-active`:``}" data-action="tab" data-tab="${t}"
             aria-current="${e===t}">
             <span class="tabbar__icon" aria-hidden="true">${r}</span>
             <span>${n}</span>
           </button>`).join(``),_=()=>{let{timezone:e}=r.getSettings(),t=Number(new Intl.DateTimeFormat(`en-US`,{timeZone:e,hour:`2-digit`,hourCycle:`h23`}).format(new Date));return t<12?`Good morning`:t<17?`Good afternoon`:`Good evening`},v=()=>{let t=document.getElementById(`app`);if(!t)return;let i=a(),o=r.getTemplates(),c=r.getHabits(),u;if(s.learningPathId){let t=e.find(e=>e.id===s.learningPathId);u=t?tt(t,r.getLearningProgress()):`<p class="empty">Learning path not found.</p>`}else if(s.workstreamOpenId){let t=r.getWorkstreams()[s.workstreamOpenId],n=N({dateK:k(i,r.getWeekPlans()),capacityProfiles:r.getCapacityProfiles(),weekPlans:r.getWeekPlans(),plannedActions:r.getPlannedActions()});u=t?ft({workstream:t,todayKey:i,capacityProfiles:r.getCapacityProfiles(),plannedActions:r.getPlannedActions(),jobApplications:r.getJobApplications(),habits:c,weekProgress:n.commitments.find(e=>e.workstreamId===t.id),domainHtml:t.type===`learning`?nt(e,r.getLearningProgress()):``}):`<p class="empty">Workstream not found.</p>`}else if(s.applicationsOpen)u=Oe({todayKey:i,applications:r.getJobApplications()});else if(s.planningOpen){let e=O(i,r.getWeekPlans()),t=N({dateK:i,capacityProfiles:r.getCapacityProfiles(),weekPlans:r.getWeekPlans(),plannedActions:r.getPlannedActions()});u=dt({todayKey:i,workstreams:r.getWorkstreams(),habits:c,weekPlan:e,plannedActions:r.getPlannedActions(),weekSummary:t})}else if(s.editing)u=qe({...s.editing,dirty:S(),habits:c});else if(s.openDay){let e=r.getDay(s.openDay);u=Be({dateKey:s.openDay,todayKey:i,record:e,templates:o,standalone:!0,outOfSync:e!==void 0&&!s.syncDismissed.has(s.openDay)&&C(e,y(o,i))})}else if(s.tab===`today`)u=s.todayMode===`week`?_t({anchorKey:s.weekAnchor,todayKey:i,records:f(l(n(s.weekAnchor))),planningHtml:ot({summary:N({dateK:s.weekAnchor,capacityProfiles:r.getCapacityProfiles(),weekPlans:r.getWeekPlans(),plannedActions:r.getPlannedActions()}),workstreams:r.getWorkstreams()}),calendarHtml:st({anchorKey:s.weekAnchor,todayKey:i,capacityProfiles:r.getCapacityProfiles(),plannedActions:r.getPlannedActions(),workstreams:r.getWorkstreams()})}):Fe({dateKey:i,record:r.getDay(i),templates:o,learningPaths:e,learningProgress:r.getLearningProgress(),greeting:_(),planningHtml:at({plan:ee({dateK:i,capacityProfiles:r.getCapacityProfiles(),workstreams:r.getWorkstreams(),plannedActions:r.getPlannedActions(),jobApplications:r.getJobApplications()}),workstreams:r.getWorkstreams()}),plannedActions:r.getPlannedActions(),workstreams:r.getWorkstreams(),outOfSync:r.getDay(i)!==void 0&&!s.syncDismissed.has(i)&&C(r.getDay(i),y(o,i))});else if(s.tab===`work`){let t=k(i,r.getWeekPlans()),n=O(t,r.getWeekPlans());u=xt({workstreams:r.getWorkstreams(),weekSummary:N({dateK:t,capacityProfiles:r.getCapacityProfiles(),weekPlans:r.getWeekPlans(),plannedActions:r.getPlannedActions()}),weekPlan:n,applications:r.getJobApplications(),learningPaths:e,learningProgress:r.getLearningProgress()})}else u=s.tab===`insights`?Xe({todayKey:i,records:r.listDays({to:i}),habits:c,learningProgress:r.getLearningProgress()}):ht({settings:r.getSettings(),habits:c,dayCount:r.dayKeys().length,templateCount:o.length,ephemeral:ye,rawOpen:s.rawOpen,raw:s.rawOpen?JSON.stringify(r.exportAll(),null,2):``,resetArmed:s.resetArmed,pendingImport:s.pendingImport});t.innerHTML=`${s.tab===`today`&&!s.openDay&&!s.editing&&!s.planningOpen&&!s.applicationsOpen&&!s.workstreamOpenId&&m()?`<div class="nudge">
             <span>Back up your history — it only lives in this browser.</span>
             <button class="btn btn--tiny" type="button" data-action="goto-backup">Export</button>
             <button class="nudge__x" type="button" data-action="dismiss-nudge" aria-label="Dismiss">×</button>
           </div>`:``}<main class="main">${u}</main><nav class="tabbar">${h(s.tab)}</nav>`},S=()=>{let e=s.editing;if(!e)return[];let t=y(r.getTemplates(),a()).days;return[0,1,2,3,4,5,6].filter(n=>JSON.stringify(e.draft[n]??null)!==JSON.stringify(t[n]??null))},w=()=>{let e=S(),t=document.querySelector(`[data-action="edit-save"]`);t&&(t.disabled=e.length===0);for(let t of document.querySelectorAll(`[data-action="edit-weekday"]`))t.classList.toggle(`is-dirty`,e.includes(Number(t.dataset.weekday)))},T=()=>s.editing?s.editing.draft[s.editing.weekday]:void 0,E=e=>{s.tab=e,s.openDay=null,s.learningPathId=null,s.learningReturnWorkstreamId=null,s.planningOpen=!1,s.applicationsOpen=!1,s.applicationsReturnWorkstreamId=null,s.workstreamOpenId=null,s.editing=null,e===`today`&&(s.todayMode=`today`,s.weekAnchor=a()),v(),p()},D=()=>s.openDay??a(),A=e=>{let t=D();if(u(t,a()))return;let n=e(d(t));r.setDay(t,n,i()),v()},j=()=>{let e=r.exportAll(),n=t(new Date),a=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),o=URL.createObjectURL(a),c=document.createElement(`a`);c.href=o,c.download=`routine-backup-${n}.json`,document.body.appendChild(c),c.click(),c.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e3),r.setSettings({lastExportAt:i()}),s.nudgeDismissed=!0,K(`Backup downloaded.`),v()},M=async e=>{let t;try{t=JSON.parse(await e.text())}catch{K(`That file is not valid JSON.`,`error`);return}let n=r.previewImport(t);if(!n.ok){K(n.error,`error`);return}s.pendingImport={raw:t,fileName:e.name,...n.summary},v()},te={tab:e=>E(e.dataset.tab??`today`),"open-planner":()=>{s.planningOpen=!0,s.applicationsOpen=!1,s.workstreamOpenId=null,s.openDay=null,s.editing=null,v(),p()},"close-planner":()=>{s.planningOpen=!1,v()},"open-applications":()=>{let e=Object.values(r.getWorkstreams()).find(e=>e.type===`career`);s.applicationsReturnWorkstreamId=s.workstreamOpenId??e?.id??null,s.applicationsOpen=!0,s.planningOpen=!1,s.workstreamOpenId=null,s.openDay=null,s.editing=null,v(),p()},"close-applications":()=>{s.applicationsOpen=!1,s.applicationsReturnWorkstreamId?(s.workstreamOpenId=s.applicationsReturnWorkstreamId,s.applicationsReturnWorkstreamId=null):s.planningOpen=!0,v()},"open-workstream":e=>{let t=e.dataset.id;!t||!r.getWorkstreams()[t]||(s.workstreamReturn=s.tab===`work`?`work`:s.planningOpen?`planner`:s.todayMode,s.workstreamOpenId=t,s.planningOpen=!1,s.applicationsOpen=!1,s.openDay=null,s.editing=null,v(),p())},"close-workstream":()=>{s.workstreamOpenId=null,s.workstreamReturn===`planner`?s.planningOpen=!0:s.workstreamReturn===`work`?s.tab=`work`:(s.tab=`today`,s.todayMode=s.workstreamReturn),v(),p()},back:()=>{s.openDay=null,s.tab=`today`,s.todayMode=`week`,v()},"today-mode":e=>{let t=e.dataset.mode;(t===`today`||t===`week`)&&(s.tab=`today`,s.todayMode=t,t===`week`&&(s.weekAnchor=a()),v())},"open-learning-path":t=>{let n=t.dataset.id;if(!n||!e.some(e=>e.id===n))return;let i=Object.values(r.getWorkstreams()).find(e=>e.type===`learning`);s.tab=`work`,s.learningReturnWorkstreamId=i?.id??null,s.learningPathId=n,s.workstreamOpenId=null,s.planningOpen=!1,s.applicationsOpen=!1,s.openDay=null,v(),p()},"open-learning-hub":()=>{let t=Object.values(r.getWorkstreams()).find(e=>e.type===`learning`);t?(s.tab=`work`,s.workstreamReturn=`work`,s.workstreamOpenId=t.id):(s.tab=`work`,s.learningReturnWorkstreamId=null,s.learningPathId=e[0]?.id??null),v(),p()},"learning-back":()=>{s.learningPathId=null,s.tab=`work`,s.learningReturnWorkstreamId&&r.getWorkstreams()[s.learningReturnWorkstreamId]&&(s.workstreamReturn=`work`,s.workstreamOpenId=s.learningReturnWorkstreamId),s.learningReturnWorkstreamId=null,v(),p()},"toggle-learning-lesson":e=>{let t=e.dataset.id;if(!t)return;let n=r.getLearningProgress()[t]!==void 0;r.setLearningLessonCompleted(t,!n,i()),v()},"open-day":e=>{let t=e.dataset.date;!t||u(t,a())||(s.openDay=t,v())},"week-nav":e=>{let r=Number(e.dataset.delta??0),i=t(c(n(s.weekAnchor),r*7)),o=t(c(n(a()),28));r>0&&i>o||(s.weekAnchor=i,v())},"edit-template":e=>{let t=e.dataset.weekday===void 0?n(s.openDay??a()).getDay():Number(e.dataset.weekday),i=y(r.getTemplates(),a());s.editing={weekday:t,draft:structuredClone(i.days)},v()},"edit-weekday":e=>{s.editing&&(s.editing.weekday=Number(e.dataset.weekday),v())},"edit-cancel":()=>{s.editing=null,v()},"task-add":()=>{let e=T();if(!e)return;e.tasks.push({id:g(),name:``,time:``,core:!1,habit:null,weight:1}),v();let t=document.querySelectorAll(`[data-action="edit-name"]`);t[t.length-1]?.focus()},"task-delete":e=>{let t=T();t&&(t.tasks.splice(Number(e.dataset.index),1),v())},"task-move":e=>{let t=T();if(!t)return;let n=Number(e.dataset.index),r=n+Number(e.dataset.dir),i=t.tasks;if(r<0||r>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(r,0,a),v()},"task-core":e=>{let t=T()?.tasks[Number(e.dataset.index)];t&&(t.core=!t.core),v()},"edit-save":()=>{let e=s.editing;if(!e)return;let t={};for(let n of[0,1,2,3,4,5,6]){let r=e.draft[n];if(!r)continue;let i=r.tasks.map(e=>({...e,name:e.name.trim(),time:e.time.trim()}));if(i.some(e=>e.name===``)){e.weekday=n,K(`Every task needs a name — check ${St[n]}.`,`error`),v();return}t[n]={type:r.type.trim(),tasks:i}}r.appendTemplate({effectiveFrom:a(),createdAt:i(),days:t}),s.editing=null,s.syncDismissed.clear(),K(`Saved. Applies from today on.`),v()},"sync-template":()=>{let e=s.openDay??a(),t=r.getDay(e);t&&(r.setDay(e,x(t,y(r.getTemplates(),a())),i()),K(`Day updated to the new task list.`),v())},"sync-dismiss":()=>{s.syncDismissed.add(s.openDay??a()),v()},"add-habit":()=>{let e=document.getElementById(`new-habit-label`)?.value.trim()??``;if(!e){K(`Habit needs a name.`,`error`);return}try{r.addHabit(e),K(`Added habit “${e}”.`),v()}catch(e){K(e instanceof Error?e.message:`Could not add habit.`,`error`)}},"toggle-habit-archive":e=>{let t=e.dataset.id;if(!t)return;let n=e.dataset.archived===`true`;r.setHabitArchived(t,!n),K(n?`Habit restored.`:`Habit archived. History is preserved.`),v()},"planning-add-workstream":()=>{let e=document.getElementById(`planner-new-title`)?.value.trim()??``;if(!e)return void K(`Workstream needs a title.`,`error`);let t=document.getElementById(`planner-new-type`)?.value??`project`,n=document.getElementById(`planner-new-priority`)?.value??`primary`,i=document.getElementById(`planner-new-habit`)?.value||null,a=`ws_${globalThis.crypto?.randomUUID?.().slice(0,8)??Math.random().toString(36).slice(2,10)}`;r.upsertWorkstream({id:a,type:t,title:e,outcome:{goal:``,priority:n},plan:{deadline:null,definitionOfDone:[]},execution:{status:`active`,milestone:null,weeklyCommitment:null,nextAction:null},linkedHabitId:i}),K(`Workstream added.`),v()},"planning-save-workstream":e=>{let t=e.dataset.id;if(!t)return;let n=r.getWorkstreams()[t],i=e.closest(`[data-workstream-id]`);if(!n||!i)return;let a=e=>i.querySelector(`[data-field="${e}"]`),o=a(`status`)?.value,s=a(`deadline`)?.value||null,c=a(`definitionOfDone`)?.value.split(`
`).map(e=>e.trim()).filter(Boolean)??[];r.upsertWorkstream({...n,outcome:{...n.outcome,goal:a(`goal`)?.value.trim()??``},plan:{deadline:s,definitionOfDone:c},execution:{...n.execution,status:o??n.execution.status,milestone:a(`milestone`)?.value.trim()||null,nextAction:a(`nextAction`)?.value.trim()||null},linkedHabitId:a(`habit`)?.value||null}),K(`Workstream saved.`),v()},"planning-save-week":()=>{let e=[...document.querySelectorAll(`[data-commitment-workstream]`)].map(e=>({workstreamId:e.dataset.commitmentWorkstream??``,targetBlocks:Math.max(0,Math.floor(Number(e.querySelector(`[data-field="targetBlocks"]`)?.value??0))),outcome:e.querySelector(`[data-field="outcome"]`)?.value.trim()??``})).filter(e=>e.workstreamId&&e.targetBlocks>0),i=t((()=>{let e=n(a()),t=(e.getDay()+6)%7;return e.setDate(e.getDate()-t),e})());r.upsertWeekPlan({id:`week:${i}`,startsOn:i,commitments:e}),K(`Week Plan saved.`),v()},"planning-add-action":()=>{let e=document.getElementById(`planner-action-workstream`)?.value??``,t=document.getElementById(`planner-action-title`)?.value.trim()??``,n=document.getElementById(`planner-action-date`)?.value??``,i=Math.max(1,Math.min(3,Math.floor(Number(document.getElementById(`planner-action-blocks`)?.value??1)))),a=document.getElementById(`planner-action-due`)?.value||null,o=r.getWorkstreams()[e];if(!o||!t||!n)return void K(`Action needs workstream, date, and title.`,`error`);let s=`action_${globalThis.crypto?.randomUUID?.().slice(0,8)??Math.random().toString(36).slice(2,10)}`;r.upsertPlannedAction({id:s,date:n,workstreamId:e,title:t,focusBlocks:i,due:a,linkedHabitId:o.linkedHabitId??null,status:`planned`}),K(`Action planned.`),v()},"planning-replan-action":e=>{let t=e.dataset.id;if(!t)return;let n=r.getPlannedActions()[t],i=e.closest(`.planner-action-row`)?.querySelector(`[data-field="replanDate"]`)?.value??``;if(!n||!i)return void K(`Choose a new date first.`,`error`);if(i===n.date&&n.status===`planned`)return void K(`Choose a different date to replan.`,`error`);r.upsertPlannedAction({...n,status:`deferred`});let a=`action_${globalThis.crypto?.randomUUID?.().slice(0,8)??Math.random().toString(36).slice(2,10)}`;r.upsertPlannedAction({...n,id:a,date:i,status:`planned`}),K(`Moved explicitly to ${i}. Original kept as deferred.`),v()},"planning-save-review":()=>{let e=a(),o=n(e),s=(o.getDay()+6)%7;o.setDate(o.getDate()-s);let c=t(o),l=O(e,r.getWeekPlans())??{id:`week:${c}`,startsOn:c,commitments:[]},u=document.getElementById(`planner-review-wins`)?.value.trim()??``,d=document.getElementById(`planner-review-misses`)?.value.trim()??``,f=document.getElementById(`planner-review-bottleneck`)?.value.trim()??``,p=document.getElementById(`planner-review-adjustment`)?.value.trim()??``;r.upsertWeekPlan({...l,review:{completedAt:i(),wins:u,misses:d,bottleneck:f,adjustment:p}}),K(`Weekly Review saved.`),v()},"planning-create-next-week":()=>{let e=O(a(),r.getWeekPlans());if(!e)return void K(`Save this Week Plan first.`,`error`);let i=t(c(n(e.startsOn),7));if(Object.values(r.getWeekPlans()).find(e=>e.startsOn===i))return void K(`Next week already exists.`);r.upsertWeekPlan({id:`week:${i}`,startsOn:i,commitments:structuredClone(e.commitments)}),K(`Next week created. Actions were not carried over.`),v()},"planning-action-status":e=>{let t=e.dataset.id,n=e.dataset.status;if(!t||!n)return;let o=r.getPlannedActions()[t];if(o){if(r.upsertPlannedAction({...o,status:n}),n===`done`&&o.date===a()&&o.linkedHabitId){let e=d(a());if(e.status===`active`){let t=e.tasks.filter(e=>e.core&&e.habit===o.linkedHabitId);t.length===1&&t[0]&&!t[0].done&&r.setDay(a(),{...e,tasks:e.tasks.map(e=>e.id===t[0]?.id?{...e,done:!0}:e)},i())}}K(n===`deferred`?`Deferred. It will not move dates automatically.`:`Action ${n}.`),v()}},"application-add":()=>{let e=document.getElementById(`application-new-company`)?.value.trim()??``,t=document.getElementById(`application-new-role`)?.value.trim()??``;if(!e||!t)return void K(`Application needs company and role.`,`error`);let n=document.getElementById(`application-new-stage`)?.value??`saved`,a=Number(document.getElementById(`application-new-fit`)?.value??``),o=Number.isFinite(a)&&a>=1&&a<=5?a:void 0,s=document.getElementById(`application-new-due`)?.value||void 0,c=document.getElementById(`application-new-next`)?.value.trim()||void 0,l=document.getElementById(`application-new-url`)?.value.trim()||void 0,u=`app_${globalThis.crypto?.randomUUID?.().slice(0,8)??Math.random().toString(36).slice(2,10)}`,d=i();r.upsertJobApplication({id:u,company:e,role:t,stage:n,...o?{fitScore:o}:{},...c?{nextAction:c}:{},...s?{nextActionDue:s}:{},...l?{jobUrl:l}:{},savedAt:d,...n===`applied`?{appliedAt:d}:{}}),K(`Application added.`),v()},"application-save":e=>{let t=e.dataset.id;if(!t)return;let n=r.getJobApplications()[t],a=e.closest(`[data-application-id]`);if(!n||!a)return;let o=e=>a.querySelector(`[data-field="${e}"]`),s=o(`stage`)?.value??n.stage,c=Number(o(`fitScore`)?.value??``),l=Number.isFinite(c)&&c>=1&&c<=5?c:void 0,u=o(`nextEventAt`)?.value||void 0,d=o(`nextActionDue`)?.value||void 0,f=o(`nextAction`)?.value.trim()||void 0,p=o(`fitReason`)?.value.trim()||void 0,m=o(`jobUrl`)?.value.trim()||void 0,h=o(`notes`)?.value.trim()||void 0;r.upsertJobApplication({...n,stage:s,...l?{fitScore:l}:{fitScore:void 0},...f?{nextAction:f}:{nextAction:void 0},...d?{nextActionDue:d}:{nextActionDue:void 0},...u?{nextEventAt:`${u}T00:00:00`}:{nextEventAt:void 0},...p?{fitReason:p}:{fitReason:void 0},...m?{jobUrl:m}:{jobUrl:void 0},...h?{notes:h}:{notes:void 0},...s===`applied`&&!n.appliedAt?{appliedAt:i()}:{}}),K(`Application saved.`),v()},"toggle-task":e=>{let t=e.dataset.id;t&&A(e=>e.status===`rest`?e:ie(e,t,i()))},"set-status":e=>{let t=e.dataset.status;t&&A(e=>({...e,status:t}))},export:j,"goto-backup":()=>E(`more`),"dismiss-nudge":()=>{s.nudgeDismissed=!0,v()},"import-pick":()=>document.getElementById(`import-file`)?.click(),"import-confirm":()=>{let e=s.pendingImport;if(e){try{let t=r.importAll(e.raw);s.pendingImport=null,s.weekAnchor=a(),s.openDay=null,s.learningPathId=null,K(`Imported ${t.added+t.overwritten+t.unchanged} days and ${t.learningCompleted} learning completions.`)}catch(e){K(e instanceof Error?e.message:`Import failed.`,`error`)}v()}},"import-cancel":()=>{s.pendingImport=null,v()},"toggle-raw":()=>{s.rawOpen=!s.rawOpen,v()},"reset-arm":()=>{s.resetArmed=!0,v()},"reset-cancel":()=>{s.resetArmed=!1,v()},"reset-confirm":()=>{if(document.getElementById(`reset-confirm`)?.value.trim().toUpperCase()!==`ERASE`){K(`Type ERASE to confirm.`,`error`);return}for(let e of r.dayKeys())r.deleteDay(e);r.clearLearningProgress(),s.resetArmed=!1,s.openDay=null,s.learningPathId=null,K(`Day records and learning progress erased.`),v()}},P=e=>{let t=e.target?.closest(`[data-action]`);if(!t||t.hasAttribute(`disabled`))return;let n=te[t.dataset.action??``];n&&(e.preventDefault(),n(t))},F=e=>{let t=e.target;if(!s.editing)return;let n=T();if(!n)return;if(t instanceof HTMLInputElement&&t.dataset.action===`edit-type`){n.type=t.value,w();return}if(!(t instanceof HTMLInputElement)&&!(t instanceof HTMLSelectElement))return;let r=n.tasks[Number(t.dataset.index)];r&&(t.dataset.action===`edit-name`&&(r.name=t.value),t.dataset.action===`edit-time`&&(r.time=t.value),t.dataset.action===`edit-habit`&&(r.habit=t.value===``?null:t.value),w())},ne=e=>{let t=e.target;if(t instanceof HTMLSelectElement&&t.dataset.action===`edit-habit`){F(e);return}if(t instanceof HTMLInputElement&&t.id===`import-file`){let e=t.files?.[0];t.value=``,e&&M(e);return}if(t instanceof HTMLInputElement){if(t.dataset.action===`set-habit-label`){let e=t.dataset.id;if(!e)return;try{let n=r.setHabitLabel(e,t.value);if(!n)return;K(`Habit renamed to “${n.label}”. History is unchanged.`),v()}catch(e){K(e instanceof Error?e.message:`Could not rename habit.`,`error`),v()}return}if(t.dataset.action===`set-timezone`){let e=t.value.trim();try{new Intl.DateTimeFormat(`en-US`,{timeZone:e}).format(new Date)}catch{K(`Unknown timezone "${e}".`,`error`),v();return}r.setSettings({timezone:e}),s.weekAnchor=a(),K(`Timezone set to ${e}.`),v()}if(t.dataset.action===`set-cutoff`){let e=Math.min(12,Math.max(0,Math.round(Number(t.value))));if(Number.isNaN(e))return;r.setSettings({dayCutoffHour:e}),s.weekAnchor=a(),K(`Day now starts at ${e}:00.`),v()}}},I=e=>{e.key?.startsWith(`rt:`)&&v()},re=a(),L=()=>{let e=a();e!==re&&(re=e,s.openDay||(s.weekAnchor=e),v())},R=()=>{document.hidden||L()};document.addEventListener(`click`,P),document.addEventListener(`input`,F),document.addEventListener(`change`,ne),document.addEventListener(`visibilitychange`,R),window.addEventListener(`storage`,I);let ae=window.setInterval(L,6e4);return v(),()=>{document.removeEventListener(`click`,P),document.removeEventListener(`input`,F),document.removeEventListener(`change`,ne),document.removeEventListener(`visibilitychange`,R),window.removeEventListener(`storage`,I),window.clearInterval(ae)}},wt=`app-update`,Tt=e=>{let t=document.getElementById(wt);t||(t=document.createElement(`aside`),t.id=wt,t.className=`update-banner`,t.setAttribute(`role`,`status`),t.setAttribute(`aria-live`,`polite`),document.body.appendChild(t)),t.innerHTML=`
    <div class="update-banner__copy">
      <strong>Routine update ready</strong>
      <span>Your saved data stays on this device.</span>
    </div>
    <button class="btn btn--primary btn--tiny" type="button" data-update-now>Update now</button>
  `;let n=t.querySelector(`[data-update-now]`);n?.addEventListener(`click`,()=>{if(!n)return;n.disabled=!0,n.textContent=`Updating…`;let t=!1;navigator.serviceWorker.addEventListener(`controllerchange`,()=>{t||(t=!0,window.location.reload())},{once:!0}),e.postMessage({type:`SKIP_WAITING`})},{once:!0})},Et=e=>{let t=e.installing;t&&t.addEventListener(`statechange`,()=>{t.state===`installed`&&navigator.serviceWorker.controller&&Tt(t)})},Dt=async e=>{if(!(`serviceWorker`in navigator))return()=>void 0;let t=await navigator.serviceWorker.register(`${e}sw.js`,{updateViaCache:`none`});t.waiting&&navigator.serviceWorker.controller&&Tt(t.waiting);let n=()=>Et(t);t.addEventListener(`updatefound`,n);let r=()=>{document.visibilityState===`visible`&&t.update().catch(()=>void 0)},i=()=>r(),a=()=>r();document.addEventListener(`visibilitychange`,i),window.addEventListener(`pageshow`,a);let o=window.setInterval(r,36e5);return r(),()=>{t.removeEventListener(`updatefound`,n),document.removeEventListener(`visibilitychange`,i),window.removeEventListener(`pageshow`,a),window.clearInterval(o),document.getElementById(wt)?.remove()}};Ct(),`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{Dt(`./`).catch(()=>{})});
//# sourceMappingURL=index-B0Rv4N4k.js.map