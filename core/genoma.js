import React, { useState, useMemo, useEffect } from 'react';
import { 
  School, Users, Building2, LayoutGrid, Database, 
  X, Trash2, CheckCircle2, Plus, Save,
  GraduationCap, Truck, ChevronDown, 
  Warehouse, Laptop, Loader2, Presentation, Users2, 
  CheckSquare, Square, MinusSquare, Layers,
  FileText, BadgeCheck, UserCog, CalendarRange, TrendingUp,
  Pencil, Baby, UserCheck2, Stethoscope, ShieldCheck,
  FileBadge, Smartphone, KeyRound, Search
} from 'lucide-react';

/**
 * CONFIGURAÇÕES BNCC E MEC
 */
const THEME_BG = "bg-indigo-600";
const BORDER_CONTRAST = "border-slate-300";

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const PERIODOS = ["07:00 - 07:50", "07:50 - 08:40", "08:40 - 09:30", "09:50 - 10:40", "10:40 - 11:30"];

const MEC_DISCIPLINAS = [
  "Língua Portuguesa", "Matemática", "História", "Geografia", "Ciências Naturais",
  "Biologia", "Física", "Química", "Língua Inglesa", "Artes",
  "Educação Física", "Filosofia", "Sociologia"
];

const TURNOS_OPCOES = ['Manhã', 'Tarde', 'Noite'];
const SETORES_RH = ['Administrativo', 'Financeiro', 'Operacional', 'Zeladoria', 'Secretaria'];
const MEC_ANOS_LETIVOS = [
  "1º Ano (Fundamental)", "2º Ano (Fundamental)", "3º Ano (Fundamental)",
  "1ª Série (Ensino Médio)", "2ª Série (Ensino Médio)", "3ª Série (Ensino Médio)"
];
const ESCOLARIDADE_OPCOES = ["Graduação Completa", "Pós-graduação", "Mestrado", "Doutorado"];
const ESTADO_EQUIPAMENTO = ['Novo', 'Bom', 'Regular', 'Manutenção'];
const ACESSIBILIDADE_OPCOES = ['Não', 'Sim'];
const TIPO_ACESSIBILIDADE_OPCOES = ['Motora', 'Auditiva', 'Visual', 'TEA (Autismo)'];

const getRowId = (row) => row.id || row.Nome || row.Empresa || row.Item || row.nome;
const generateSecretCode = () => 'SEC-' + Math.random().toString(36).substring(2, 7).toUpperCase();

// --- COMPONENTES AUXILIARES ---

const CustomSelect = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="flex flex-col gap-1.5 min-w-[200px]">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>}
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600">
        <Icon size={16} strokeWidth={3} />
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white border ${BORDER_CONTRAST} rounded-2xl pl-11 pr-10 py-3 text-xs font-black uppercase text-slate-700 appearance-none outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm`}
      >
        {options.map(opt => (
          <option key={opt.id || opt} value={opt.id || opt}>{opt.label || opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <ChevronDown size={14} />
      </div>
    </div>
  </div>
);

const DataTable = ({ headers, data, selectedIds, toggleSelect, toggleSelectAll, onScheduleClick, tableName }) => {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <div className={`overflow-hidden bg-white border ${BORDER_CONTRAST} rounded-[1.5rem] shadow-sm`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b ${BORDER_CONTRAST}`}>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleSelectAll} className="p-1 rounded hover:bg-slate-200 transition-colors">
                  {isAllSelected ? <CheckSquare size={16} className="text-indigo-600" /> : isSomeSelected ? <MinusSquare size={16} className="text-indigo-600" /> : <Square size={16} />}
                </button>
              </th>
              {headers.map((h, i) => <th key={i} className="px-6 py-4">{h}</th>)}
              {tableName === 'classes' && <th className="px-6 py-4 text-center">Grade</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length > 0 ? data.map((row, i) => (
              <tr key={i} className={`transition-colors group cursor-pointer ${selectedIds.includes(getRowId(row)) ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}>
                <td className="px-6 py-3" onClick={() => toggleSelect(getRowId(row))}>
                  {selectedIds.includes(getRowId(row)) ? <CheckSquare size={16} className="text-indigo-600" /> : <Square size={16} className="text-slate-300" />}
                </td>
                {headers.map((h, j) => (
                  <td key={j} className="px-6 py-4 text-xs font-medium text-slate-600">
                    {String(row[h])}
                  </td>
                ))}
                {tableName === 'classes' && (
                  <td className="px-6 py-4 text-center">
                    {/* Correção: Adicionado verificação opcional para evitar erro se onScheduleClick for undefined */}
                    <button onClick={() => onScheduleClick?.(row)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                      <CalendarRange size={16} />
                    </button>
                  </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan={10} className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">Nenhum dado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- COMPONENTE DA APLICAÇÃO ESCOLA (SEU CÓDIGO) ---

const SchoolApp = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedSector, setSelectedSector] = useState('pedagogical');
  const [selectedDataTable, setSelectedDataTable] = useState('classes');
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [units] = useState([{ id: 'U1', Nome: 'Escola Digital Pro', Gestor: 'Mariana Santos', Localização: 'SJC - SP' }]);
  const [students] = useState([{ id: "AL-001", Nome: "Ana Silva", "Status Matrícula": "CONCLUÍDA", Turma: "9º Ano A", "Responsável": "João Silva" }]);
  const [classes] = useState([{ id: "TUR-001", Nome: "9º Ano A", Turno: "Manhã", "Ano Letivo": "9º Ano", Coordenador: "Mariana Santos" }]);

  const sectors = [
    { id: 'infrastructure', label: 'Infraestrutura', icon: Building2 },
    { id: 'hr', label: 'Recursos Humanos', icon: Users },
    { id: 'pedagogical', label: 'Pedagógico', icon: GraduationCap }
  ];

  const tablesBySector = {
    infrastructure: [{ id: 'units', label: 'Unidades', icon: Building2, headers: ["Nome", "Gestor", "Localização"], data: units }],
    pedagogical: [
      { id: 'classes', label: 'Turmas', icon: Presentation, headers: ["Nome", "Turno", "Coordenador"], data: classes },
      { id: 'students', label: 'Alunos', icon: Users, headers: ["Nome", "Status Matrícula", "Turma"], data: students }
    ],
    hr: [{ id: 'staff', label: 'Equipe', icon: UserCog, headers: ["Nome", "Cargo"], data: [] }]
  };

  const currentSectorTables = tablesBySector[selectedSector] || [];
  const currentTable = currentSectorTables.find(t => t.id === selectedDataTable) || currentSectorTables[0];

  return (
    <div className="h-full bg-slate-50 overflow-y-auto pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl text-indigo-600 shadow-sm">
              <School size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase">Gestão Digital Pro</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Painel Administrativo</p>
            </div>
          </div>
          <div className="flex gap-4">
             <CustomSelect icon={TrendingUp} value={activeView} onChange={setActiveView} options={['dashboard', 'dataCentral']} />
          </div>
        </header>

        {activeView === 'dashboard' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4"><Users size={20}/></div>
               <div className="text-3xl font-black text-slate-900">{students.length}</div>
               <div className="text-[10px] font-black text-slate-400 uppercase">Alunos Ativos</div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><Presentation size={20}/></div>
               <div className="text-3xl font-black text-slate-900">{classes.length}</div>
               <div className="text-[10px] font-black text-slate-400 uppercase">Turmas Formadas</div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-6 items-end border-b border-slate-200 pb-8">
              <CustomSelect label="Setor" icon={Users} value={selectedSector} onChange={setSelectedSector} options={sectors} />
              <CustomSelect label="Entidade" icon={LayoutGrid} value={selectedDataTable} onChange={setSelectedDataTable} options={currentSectorTables} />
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
                <currentTable.icon size={16} /> {currentTable.label}
              </h2>
              <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition-transform">
                <Plus size={18} />
              </button>
            </div>
            <DataTable 
              headers={currentTable.headers} 
              data={currentTable.data} 
              tableName={selectedDataTable} 
              selectedIds={selectedRows}
              toggleSelect={(id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
              toggleSelectAll={() => {
                if (selectedRows.length === currentTable.data.length) setSelectedRows([]);
                else setSelectedRows(currentTable.data.map(item => getRowId(item)));
              }}
              // Correção: Passando o onScheduleClick para evitar o TypeError
              onScheduleClick={(row) => console.log('Abrir grade da turma:', row)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (SIMULADOR MOBILE) ---

export default function App() {
  const [isAppOpen, setIsAppOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      {/* BACKGROUND SIMULANDO WALLPAPER */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-400 opacity-80" />
      
      {/* ÍCONE NA TELA INICIAL */}
      {!isAppOpen && (
        <div 
          className="relative flex flex-col items-center cursor-pointer group transition-transform active:scale-90"
          onClick={() => setIsAppOpen(true)}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[1.5rem] shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <School className="text-white w-12 h-12" strokeWidth={1.5} />
            {/* Brilho estilo app icon */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
          <span className="mt-3 text-white text-sm font-semibold drop-shadow-md">Escola</span>
        </div>
      )}

      {/* JANELA DO APLICATIVO (O SEU SISTEMA) */}
      <div 
        className={`fixed inset-0 bg-white z-50 flex flex-col transition-all duration-500 ease-in-out ${
          isAppOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* BARRA SUPERIOR (HEADER) */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <School size={16} />
            </div>
            <span className="font-bold text-slate-800">Sistema Escolar</span>
          </div>
          <button 
            onClick={() => setIsAppOpen(false)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl transition-colors font-bold text-xs uppercase"
          >
            <X size={16} /> Fechar
          </button>
        </div>

        {/* CONTEÚDO DO SEU APP ESCOLA */}
        <div className="flex-1 overflow-hidden">
          <SchoolApp />
        </div>
      </div>
    </div>
  );
}
