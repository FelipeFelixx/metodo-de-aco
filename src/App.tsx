import { useMemo, useState } from "react";
import { BarChart3, BookOpen, CheckCircle2, ChevronRight, Clock3, Copy, Flame, Gauge, LayoutDashboard, LockKeyhole, LogOut, Menu, Play, Plus, ShieldCheck, Sparkles, Target, Users, X, Zap } from "lucide-react";
import { lessons, prompts, students } from "./data";
import { useLocalStorage } from "./hooks";
import type { View } from "./types";

const nav: {id:View; label:string; icon:any}[] = [
  {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
  {id:"lessons",label:"Método Foco de Aço",icon:BookOpen},
  {id:"challenges",label:"Desafios",icon:Target},
  {id:"timer",label:"Pomodoro",icon:Clock3},
  {id:"planner",label:"Planner",icon:Gauge},
  {id:"prompts",label:"30 Prompts",icon:Sparkles},
  {id:"progress",label:"Meu Progresso",icon:BarChart3},
];

export default function App() {
  const [view,setView] = useState<View>("dashboard");
  const [menu,setMenu] = useState(false);
  const [admin,setAdmin] = useState(false);
  const [completed,setCompleted] = useLocalStorage<string[]>("foco.completed",[]);
  const [checks,setChecks] = useLocalStorage<boolean[]>("foco.challenge24",[false,false,false,false,false,false]);
  const [days,setDays] = useLocalStorage<boolean[]>("foco.challenge7",[false,false,false,false,false,false,false]);
  const [copied,setCopied] = useState<number|null>(null);
  const progress = Math.round((completed.length / lessons.length) * 100);
  const activeStudents = students.filter(s=>s.status==="active").length;

  const complete = (id:string) => setCompleted(prev => prev.includes(id) ? prev : [...prev,id]);
  const copyPrompt = async (id:number,text:string) => { await navigator.clipboard?.writeText(text); setCopied(id); setTimeout(()=>setCopied(null),1200); };

  return <div className="min-h-screen bg-zinc-950 text-zinc-100">
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <button onClick={()=>setView("dashboard")} className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-yellow-400 text-zinc-950"><Zap size={20}/></div>
          <div className="text-left"><div className="font-black tracking-tight">FOCO DE AÇO</div><div className="text-[10px] uppercase tracking-[.2em] text-zinc-500">Sistema de produtividade</div></div>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={()=>setAdmin(!admin)} className={`hidden rounded-xl border px-3 py-2 text-xs font-semibold md:flex items-center gap-2 ${admin?"border-yellow-400/50 bg-yellow-400/10 text-yellow-300":"border-zinc-800 text-zinc-400"}`}><ShieldCheck size={15}/> {admin?"Admin ativo":"Modo admin"}</button>
          <button onClick={()=>setMenu(!menu)} className="rounded-xl border border-zinc-800 p-2 md:hidden">{menu?<X/>:<Menu/>}</button>
          <div className="hidden h-9 w-9 place-items-center rounded-full bg-zinc-800 text-sm font-bold md:grid">LF</div>
        </div>
      </div>
    </header>

    <div className="mx-auto flex max-w-7xl">
      <aside className={`${menu?"block":"hidden"} fixed inset-x-0 top-16 z-20 border-b border-zinc-800 bg-zinc-950 p-3 md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)] md:w-64 md:shrink-0 md:border-0 md:bg-transparent md:p-4`}>
        <nav className="space-y-1">
          {nav.map(n=>{const Icon=n.icon; return <button key={n.id} onClick={()=>{setView(n.id);setMenu(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${view===n.id&&!admin?"bg-yellow-400/10 text-yellow-300":"text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"}`}><Icon size={17}/>{n.label}</button>})}
          <div className="my-3 border-t border-zinc-800"/>
          <button onClick={()=>{setAdmin(true);setView("admin");setMenu(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${admin&&view==="admin"?"bg-yellow-400/10 text-yellow-300":"text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"}`}><LockKeyhole size={17}/>Área administrativa</button>
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-500"><div className="mb-2 flex items-center gap-2 text-zinc-300"><ShieldCheck size={15}/> Segurança</div>Esta V2 não usa frontend como autoridade de acesso. A integração real com Auth/RLS/webhooks fica no backend.</div>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        {view==="dashboard"&&!admin && <Dashboard progress={progress} completed={completed.length} lessons={lessons.length} days={days.filter(Boolean).length} onView={setView}/>}
        {view==="lessons"&&!admin && <Lessons completed={completed} complete={complete}/>}
        {view==="challenges"&&!admin && <Challenges checks={checks} setChecks={setChecks} days={days} setDays={setDays}/>}
        {view==="timer"&&!admin && <Timer/>}
        {view==="planner"&&!admin && <Planner/>}
        {view==="prompts"&&!admin && <div><SectionTitle title="30 Prompts de Produtividade" text="Copie prompts prontos para transformar IA em ferramenta de execução."/><div className="grid gap-4 md:grid-cols-2">{prompts.map(p=><div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"><div className="mb-3 flex items-start justify-between gap-4"><div><span className="text-xs text-yellow-400">PROMPT {p.id}</span><h3 className="mt-1 font-bold">{p.title}</h3></div><button onClick={()=>copyPrompt(p.id,p.text)} className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-white">{copied===p.id?<CheckCircle2 size={16}/>:<Copy size={16}/>}</button></div><p className="text-sm leading-6 text-zinc-400">{p.text}</p></div>)}</div></div>}
        {view==="progress"&&!admin && <Progress progress={progress} completed={completed.length} days={days.filter(Boolean).length}/>}
        {view==="admin" && admin && <Admin activeStudents={activeStudents}/>}
        {view==="admin" && !admin && <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6"><LockKeyhole/> Acesso administrativo indisponível.</div>}
      </main>
    </div>
    <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">Método Foco de Aço • V2 • Protótipo de produto</footer>
  </div>
}

function SectionTitle({title,text}:{title:string;text:string}){return <div className="mb-7"><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1 text-xs font-semibold text-yellow-300"><Sparkles size={13}/> Método Foco de Aço</div><h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-zinc-400">{text}</p></div>}

function Dashboard({progress,completed,lessons,days,onView}:{progress:number;completed:number;lessons:number;days:number;onView:(v:View)=>void}){
return <><SectionTitle title="Bom trabalho, Luiz. Vamos manter o foco." text="Seu painel central para estudar, executar e acompanhar sua evolução."/>
<div className="grid gap-4 md:grid-cols-3"><Card label="Progresso geral" value={`${progress}%`} icon={<BarChart3/>}/><Card label="Aulas concluídas" value={`${completed}/${lessons}`} icon={<BookOpen/>}/><Card label="Dias do desafio" value={`${days}/7`} icon={<Flame/>}/></div>
<div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]"><div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-zinc-500">Hoje</p><h2 className="mt-1 text-2xl font-bold">Uma ação importante.</h2></div><div className="rounded-2xl bg-yellow-400/10 p-3 text-yellow-300"><Target/></div></div><p className="mt-4 text-zinc-400">Escolha uma prioridade, reserve um bloco de tempo e execute antes de buscar novas tarefas.</p><button onClick={()=>onView("planner")} className="mt-6 flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-bold text-zinc-950">Abrir planner <ChevronRight size={17}/></button></div>
<div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6"><p className="text-sm text-zinc-500">Próximo passo</p><h3 className="mt-1 text-xl font-bold">Continuar o método</h3><p className="mt-2 text-sm text-zinc-400">Avance uma aula por vez e marque a conclusão.</p><button onClick={()=>onView("lessons")} className="mt-5 flex w-full items-center justify-between rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold hover:bg-zinc-800">Ver aulas <Play size={16}/></button></div></div></>}

function Card({label,value,icon}:{label:string;value:string;icon:any}){return <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-zinc-500">{label}</span><span className="text-yellow-300">{icon}</span></div><div className="text-3xl font-black">{value}</div></div>}

function Lessons({completed,complete}:{completed:string[];complete:(id:string)=>void}){const [selected,setSelected]=useState(lessons[0]); return <><SectionTitle title="Método Foco de Aço" text="Leia, aplique e conclua cada etapa."/><div className="grid gap-6 lg:grid-cols-[320px_1fr]"><div className="space-y-2">{lessons.map((l,i)=><button key={l.id} onClick={()=>setSelected(l)} className={`w-full rounded-2xl border p-4 text-left ${selected.id===l.id?"border-yellow-400/40 bg-yellow-400/5":"border-zinc-800 bg-zinc-900/40"}`}><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-800 text-xs font-bold">{i+1}</span><div className="min-w-0 flex-1"><div className="font-semibold">{l.title}</div><div className="text-xs text-zinc-500">{l.duration}</div></div>{completed.includes(l.id)&&<CheckCircle2 className="text-green-400" size={18}/>}</div></button>)}</div><article className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8"><span className="text-xs font-bold uppercase tracking-widest text-yellow-400">{selected.duration}</span><h2 className="mt-2 text-3xl font-black">{selected.title}</h2><p className="mt-2 text-zinc-400">{selected.subtitle}</p><div className="mt-8 space-y-5">{selected.content.map((c,i)=><div key={i} className="flex gap-4"><span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-zinc-700 text-xs">{i+1}</span><p className="leading-7 text-zinc-300">{c}</p></div>)}</div><button onClick={()=>complete(selected.id)} disabled={completed.includes(selected.id)} className="mt-9 flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-zinc-950 disabled:cursor-default disabled:opacity-50">{completed.includes(selected.id)?"Aula concluída":"Concluir Aula"} <CheckCircle2 size={17}/></button></article></div></>}

function Challenges({checks,setChecks,days,setDays}:{checks:boolean[];setChecks:(v:boolean[])=>void;days:boolean[];setDays:(v:boolean[])=>void}){const items=["Desative notificações não essenciais","Deixe o celular fora do alcance","Escolha uma prioridade","Faça um bloco de foco","Registre uma distração que venceu","Revise seu dia"]; return <><SectionTitle title="Desafios" text="A prática é o que transforma o método em comportamento."/><div className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6"><h2 className="text-xl font-bold">Desafio 24h</h2><p className="mt-1 text-sm text-zinc-500">Uma experiência de foco para hoje.</p><div className="mt-5 space-y-2">{items.map((x,i)=><label key={x} className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-zinc-800"><input type="checkbox" checked={checks[i]} onChange={()=>setChecks(checks.map((v,j)=>j===i?!v:v))} className="accent-yellow-400"/><span className={checks[i]?"text-zinc-500 line-through":"text-zinc-300"}>{x}</span></label>)}</div></div><div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6"><h2 className="text-xl font-bold">Desafio 7 dias</h2><p className="mt-1 text-sm text-zinc-500">Marque cada dia após cumprir sua prática.</p><div className="mt-5 grid grid-cols-7 gap-2">{days.map((v,i)=><button key={i} onClick={()=>setDays(days.map((x,j)=>j===i?!x:x))} className={`aspect-square rounded-xl border text-sm font-bold ${v?"border-yellow-400 bg-yellow-400 text-zinc-950":"border-zinc-700 bg-zinc-900 text-zinc-500"}`}>{i+1}</button>)}</div><div className="mt-6 flex items-center gap-2 text-sm text-zinc-400"><Flame size={16} className="text-yellow-400"/> {days.filter(Boolean).length}/7 dias registrados</div></div></div></>}

function Timer(){const [mode,setMode]=useState<"25/5"|"50/10">("50/10");const [seconds,setSeconds]=useState(mode==="50/10"?3000:1500);const [running,setRunning]=useState(false);useMemo(()=>{if(!running)return; const id=setInterval(()=>setSeconds(s=>s>0?s-1:0),1000); return()=>clearInterval(id)},[running]); const mins=Math.floor(seconds/60).toString().padStart(2,"0"),secs=(seconds%60).toString().padStart(2,"0"); return <><SectionTitle title="Pomodoro" text="Use o tempo como uma ferramenta de execução."/><div className="mx-auto max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center"><div className="flex justify-center gap-2"><button onClick={()=>{setMode("25/5");setSeconds(1500);setRunning(false)}} className={`rounded-xl px-4 py-2 text-sm ${mode==="25/5"?"bg-yellow-400 text-zinc-950":"bg-zinc-800 text-zinc-400"}`}>25/5</button><button onClick={()=>{setMode("50/10");setSeconds(3000);setRunning(false)}} className={`rounded-xl px-4 py-2 text-sm ${mode==="50/10"?"bg-yellow-400 text-zinc-950":"bg-zinc-800 text-zinc-400"}`}>50/10</button></div><div className="my-10 text-7xl font-black tabular-nums tracking-tight">{mins}:{secs}</div><button onClick={()=>setRunning(!running)} className="rounded-xl bg-yellow-400 px-7 py-3 font-bold text-zinc-950">{running?"Pausar":"Começar foco"}</button></div></>}

function Planner(){const [blocks,setBlocks]=useLocalStorage<string[]>("foco.blocks",["08:00 — Prioridade principal"]);return <><SectionTitle title="Planner de Blocos" text="Planeje quando você fará o trabalho, não apenas o que deseja fazer."/><div className="max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6"><div className="space-y-3">{blocks.map((b,i)=><div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3"><Clock3 size={17} className="text-yellow-400"/><input value={b} onChange={e=>setBlocks(blocks.map((x,j)=>j===i?e.target.value:x))} className="min-w-0 flex-1 bg-transparent outline-none"/><button onClick={()=>setBlocks(blocks.filter((_,j)=>j!==i))} className="text-zinc-600 hover:text-red-300"><X size={16}/></button></div>)}</div><button onClick={()=>setBlocks([...blocks,"Novo bloco — atividade"])} className="mt-5 flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold"><Plus size={16}/> Adicionar bloco</button></div></>}

function Progress({progress,completed,days}:{progress:number;completed:number;days:number}){return <><SectionTitle title="Meu Progresso" text="Veja o quanto você já avançou."/><div className="max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-7"><div className="flex items-end justify-between"><div><div className="text-5xl font-black">{progress}%</div><div className="mt-1 text-zinc-500">conclusão do método</div></div><CheckCircle2 className="text-yellow-400" size={34}/></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-yellow-400" style={{width:`${progress}%`}}/></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><Stat label="Aulas concluídas" value={`${completed}/5`}/><Stat label="Desafio 7 dias" value={`${days}/7`}/></div></div></>}

function Stat({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-zinc-800 p-4"><div className="text-xs text-zinc-500">{label}</div><div className="mt-1 text-xl font-bold">{value}</div></div>}

function Admin({activeStudents}:{activeStudents:number}){return <><SectionTitle title="Dashboard Administrativo" text="Área reservada ao proprietário do produto. Na versão integrada, autorização virá do backend/RLS."/><div className="grid gap-4 md:grid-cols-4"><Card label="Alunos" value="1.248" icon={<Users/>}/><Card label="Ativos" value={String(activeStudents+1240)} icon={<CheckCircle2/>}/><Card label="Vendas • 7 dias" value="86" icon={<BarChart3/>}/><Card label="Faturamento" value="R$ 4.042" icon={<Sparkles/>}/></div><div className="mt-6 rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-6"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 text-yellow-300"/><div><h2 className="font-bold">Controle de acesso planejado</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">Kiwify/Cakto deverão confirmar compras por webhook. O backend cria ou atualiza o entitlement do aluno. Reembolso/cancelamento revoga o acesso. O frontend não poderá conceder acesso nem transformar um aluno em administrador.</p></div></div></div><div className="mt-6 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40"><div className="border-b border-zinc-800 p-5 font-bold">Alunos recentes</div><div className="divide-y divide-zinc-800">{students.map(s=><div key={s.id} className="flex flex-wrap items-center gap-4 p-5"><div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-800 font-bold">{s.name.slice(0,1)}</div><div className="min-w-[180px] flex-1"><div className="font-semibold">{s.name}</div><div className="text-xs text-zinc-500">{s.email}</div></div><div className="text-sm text-zinc-400">{s.progress}%</div><div className={`rounded-full px-3 py-1 text-xs font-semibold ${s.status==="active"?"bg-green-400/10 text-green-300":"bg-red-400/10 text-red-300"}`}>{s.status}</div></div>)}</div></div></>}
