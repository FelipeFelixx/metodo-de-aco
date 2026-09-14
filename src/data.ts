import type { Lesson, Prompt, Student } from "./types";

export const lessons: Lesson[] = [
  { id:"aula-1", title:"Como Eliminar Distrações em 24h", subtitle:"Recupere atenção e crie um ambiente de foco.", duration:"18 min",
    content:["Identifique as três maiores fontes de distração do seu dia.","Faça uma limpeza digital: notificações desnecessárias, abas abertas e aplicativos que interrompem seu trabalho.","Defina um ambiente de foco com celular fora do alcance e uma única tarefa visível.","Complete o Desafio 24h e registre o que mudou."] },
  { id:"aula-2", title:"Blocos de Tempo", subtitle:"Organize trabalho, estudo e vida real no calendário.", duration:"22 min",
    content:["Liste compromissos fixos antes de planejar tarefas.","Agrupe tarefas semelhantes em blocos.","Use blocos de 50/10 para trabalho profundo ou 25/5 quando precisar de uma entrada mais leve.","Reserve margem para imprevistos: planejamento sem margem vira frustração."] },
  { id:"aula-3", title:"Rotina Sem Procrastinação", subtitle:"Transforme intenção em execução.", duration:"20 min",
    content:["Escolha uma prioridade real para o dia.","Quebre tarefas grandes na menor próxima ação possível.","Use a regra dos cinco minutos para vencer a resistência inicial.","No fim do dia, revise o que avançou e prepare o primeiro passo de amanhã."] },
  { id:"aula-4", title:"Plano de Ação Semanal", subtitle:"Converta objetivos em uma semana executável.", duration:"24 min",
    content:["Defina até três resultados importantes para a semana.","Distribua as ações pelos dias e blocos disponíveis.","Faça uma revisão semanal objetiva: concluído, pendente, eliminado e próximo.","Ajuste o sistema; não dependa de motivação para recomeçar."] },
  { id:"conclusao", title:"Conclusão — Foco de Aço", subtitle:"Seu sistema começa quando você executa.", duration:"8 min",
    content:["Produtividade sustentável é clareza + prioridade + execução + revisão.","Use as ferramentas da plataforma como suporte ao método, não como substituto da ação.","Escolha uma mudança para começar hoje e mantenha consistência suficiente para que ela vire padrão."] }
];

export const prompts: Prompt[] = Array.from({length:30}, (_, i) => ({
  id:i+1,
  title:["Planejamento do dia","Prioridades","Quebrar tarefa","Combater procrastinação","Revisão semanal","Agenda de estudos","Planejamento de carreira","Foco profundo","Organização de projetos","Checklist de execução"][i%10] + ` #${i+1}`,
  text:`Atue como meu assistente de produtividade. Ajude-me a ${["planejar o dia","definir minhas 3 prioridades","quebrar uma tarefa complexa em ações pequenas","identificar a causa da minha procrastinação","fazer uma revisão objetiva da semana","montar uma sessão de estudos","transformar um objetivo profissional em plano de ação","preparar um bloco de foco profundo","organizar um projeto em etapas","criar um checklist executável"][i%10]}. Faça perguntas apenas quando forem realmente necessárias e entregue um plano prático, realista e mensurável.`
}));

export const students: Student[] = [
  {id:"1",name:"Ana Souza",email:"ana@example.com",progress:82,status:"active",purchasedAt:"10/09/2026",lastAccess:"Hoje"},
  {id:"2",name:"Carlos Lima",email:"carlos@example.com",progress:47,status:"active",purchasedAt:"11/09/2026",lastAccess:"Ontem"},
  {id:"3",name:"Marina Alves",email:"marina@example.com",progress:64,status:"refunded",purchasedAt:"08/09/2026",lastAccess:"12/09"},
  {id:"4",name:"Rafael Santos",email:"rafael@example.com",progress:15,status:"active",purchasedAt:"13/09/2026",lastAccess:"Hoje"}
];