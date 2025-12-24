import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  School, Users, Building2, UserCheck, Calendar, MapPin, 
  Home, Activity, LayoutGrid, UserPlus, Layout, Database, 
  ChevronLeft, ChevronRight, List, Clock, X, Edit2, Trash2, 
  CheckCircle2, Clock3, CalendarDays, Search, Plus, Save,
  Copy, GraduationCap, Briefcase, Truck, History, ChevronDown, 
  ClipboardList, HardDrive, ShieldCheck, Warehouse, AlertTriangle,
  UserSquare2, Accessibility, Laptop, Loader2, BookOpen, Phone, Mail,
  Presentation, Users2, CheckSquare, Square, MinusSquare, Layers,
  FileText, BadgeCheck, UserCog, ShieldAlert, CalendarRange, TrendingUp,
  PieChart, BarChart3, ArrowUpRight, ArrowDownRight, User, Sparkles,
  ArrowRightLeft, ClipboardCheck, Pencil, AlertCircle, Baby, GraduationCap as StudentIcon,
  Accessibility as AccessibilityIcon, KeyRound, UserCheck2, Stethoscope, ShieldCheck as ShieldIcon,
  FileBadge, Smartphone
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
  "Biologia", "Física", "Química", "Língua Inglesa", "Língua Espanhola", "Artes",
  "Educação Física", "Filosofia", "Sociologia", "Ensino Religioso",
  "Informática/Tecnologia", "Polivalente (Ensino Fundamental I)"
];

const TURNOS_OPCOES = ['Manhã', 'Tarde', 'Noite'];
const SETORES_RH = ['Administrativo', 'Financeiro', 'Operacional', 'Zeladoria', 'Secretaria'];
const MEC_ANOS_LETIVOS = [
  "Berçário (Educação Infantil)", "Maternal I (Educação Infantil)", "Maternal II (Educação Infantil)",
  "Pré-Escola I (Educação Infantil)", "Pré-Escola II (Educação Infantil)",
  "1º Ano (Ensino Fundamental)", "2º Ano (Ensino Fundamental)", "3º Ano (Ensino Fundamental)",
  "4º Ano (Ensino Fundamental)", "5º Ano (Ensino Fundamental)", "6º Ano (Ensino Fundamental)",
  "7º Ano (Ensino Fundamental)", "8º Ano (Ensino Fundamental)", "9º Ano (Ensino Fundamental)",
  "1ª Série (Ensino Médio)", "2ª Série (Ensino Médio)", "3ª Série (Ensino Médio)",
  "EJA - Ensino Fundamental", "EJA - Ensino Médio", "Curso Técnico Profissionalizante"
];
const ESCOLARIDADE_OPCOES = ["Graduação Completa", "Pós-graduação", "Mestrado", "Doutorado", "Pós-Doutorado"];
const ESTADO_EQUIPAMENTO = ['Novo', 'Bom', 'Regular', 'Manutenção', 'Descartado'];
const ACESSIBILIDADE_OPCOES = ['Não', 'Sim'];
const TIPO_ACESSIBILIDADE_OPCOES = ['Motora', 'Auditiva', 'Visual', 'Intelectual', 'TEA (Autismo)', 'Altas Habilidades', 'Outros'];

const getRowId = (row) => row.id || row.Nome || row.Empresa || row.Item || row.nome;

const generateSecretCode = () => 'SEC-' + Math.random().toString(36).substring(2, 7).toUpperCase();

const TAILWIND_CDN_ID = 'tailwindcss-cdn';

let tailwindStylesPromise = null;

const ensureTailwindStyles = () => {
  if (tailwindStylesPromise) {
    return tailwindStylesPromise;
  }

  const existingScript = document.getElementById(TAILWIND_CDN_ID);
  if (existingScript) {
    if (existingScript.dataset.loaded === 'true' || window?.tailwind) {
      tailwindStylesPromise = Promise.resolve();
      return tailwindStylesPromise;
    }

    tailwindStylesPromise = new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Falha ao carregar estilos do Tailwind.')),
        { once: true },
      );
    });

    return tailwindStylesPromise;
  }

  tailwindStylesPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = TAILWIND_CDN_ID;
    script.src = 'https://cdn.tailwindcss.com';
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Falha ao carregar estilos do Tailwind.'));
    document.head.append(script);
  });

  return tailwindStylesPromise;
};

/**
 * 1. COMPONENTES ATÔMICOS
 */
const CustomSelect = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="flex flex-col gap-1.5 min-w-[240px]">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>}
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600`}>
        <Icon size={16} strokeWidth={3} />
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white border ${BORDER_CONTRAST} rounded-2xl pl-11 pr-10 py-3 text-xs font-black uppercase tracking-widest text-slate-700 appearance-none outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer shadow-sm`}
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors">
        <ChevronDown size={14} strokeWidth={3} />
      </div>
    </div>
  </div>
);

const WidgetHeader = ({ title, children, icon: Icon }) => (
  <div className="flex items-center justify-between mb-6 text-left">
    <div className="flex items-center gap-3">
      {Icon ? (
        <div className={`p-2 bg-indigo-50 rounded-xl border ${BORDER_CONTRAST} text-indigo-600`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      ) : (
        <div className={`w-1.5 h-6 rounded-full ${THEME_BG}`} />
      )}
      <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 leading-none">
        {title}
      </h4>
    </div>
    <div className="flex items-center gap-2">
      {children}
    </div>
  </div>
);

const WidgetCard = ({ title, children, headerActions, className = "", icon, footer }) => (
  <div className={`bg-transparent flex flex-col min-w-0 h-full transition-all ${className}`}>
    <WidgetHeader title={title} icon={icon}>{headerActions}</WidgetHeader>
    <div className="flex-1 min-h-0">{children}</div>
    {footer && <div className={`mt-6 pt-4 border-t ${BORDER_CONTRAST} flex items-center justify-between`}>{footer}</div>}
  </div>
);

/**
 * 2. COMPONENTES DE CONTEÚDO (TABELA)
 */
const DataTable = ({ headers, data, selectedIds, toggleSelect, toggleSelectAll, onScheduleClick, tableName }) => {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <div className={`overflow-hidden bg-white border ${BORDER_CONTRAST} rounded-[1.5rem] animate-in fade-in duration-500 shadow-sm`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b ${BORDER_CONTRAST}`}>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleSelectAll} className="p-1 rounded hover:bg-slate-200 transition-colors">
                  {isAllSelected ? <CheckSquare size={16} className="text-indigo-600" /> : isSomeSelected ? <MinusSquare size={16} className="text-indigo-600" /> : <Square size={16} />}
                </button>
              </th>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-4">
                  {h === 'id' ? 'ID' : h}
                </th>
              ))}
              {tableName === 'classes' && <th className="px-6 py-4 text-center">Grade</th>}
            </tr>
          </thead>
          <tbody className={`divide-y ${BORDER_CONTRAST}`}>
            {data.length > 0 ? (
              data.map((row, i) => {
                const rowId = getRowId(row);
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr 
                    key={i} 
                    className={`transition-colors group cursor-pointer ${isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-3" onClick={() => toggleSelect(rowId)}>
                      <div className="p-1">
                        {isSelected ? <CheckSquare size={16} className="text-indigo-600" /> : <Square size={16} className="text-slate-300 group-hover:text-slate-400" />}
                      </div>
                    </td>
                    {headers.map((header, j) => {
                      const val = row[header];
                      return (
                        <td key={j} className="px-6 py-4 text-xs font-medium text-slate-600" onClick={() => toggleSelect(rowId)}>
                          {header === "Coordenador" || header === "Turma" || header === "Responsável" ? (
                            <div className="flex items-center gap-2 text-indigo-700 font-bold">
                                {header === "Coordenador" ? <UserCog size={12} className="text-indigo-400" /> : header === "Responsável" ? <Users2 size={12} className="text-indigo-400" /> : <Layers size={12} className="text-indigo-400" />}
                                <span className="truncate max-w-[150px]">{val || "-"}</span>
                            </div>
                          ) : header === "Status Matrícula" ? (
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${val === 'CONCLUÍDA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                {val}
                            </span>
                          ) : header === "Acessibilidade" && val === "Sim" ? (
                            <span className="text-indigo-600 flex items-center gap-1.5 font-bold bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                                <AccessibilityIcon size={12} strokeWidth={3} /> {val}
                            </span>
                          ) : val === "Sim" || val === "Novo" ? (
                            <span className="text-emerald-700 flex items-center gap-1 font-bold"><CheckCircle2 size={12} /> {val}</span>
                          ) : (
                            <div className="flex flex-wrap gap-1 text-left">
                              {(header === "Disciplinas" || header === "Turnos" || header === "Disciplinas Habilitadas" || header === "Alunos Vinculados" || header === "Tipo de Acessibilidade") && String(val).includes(', ') ? (
                                 String(val).split(', ').map((tag, idx) => (
                                   <span key={idx} className={`bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-indigo-200`}>{tag}</span>
                                 ))
                              ) : val}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    {tableName === 'classes' && (
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onScheduleClick(row); }}
                          className={`p-2 rounded-xl border ${BORDER_CONTRAST} text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all`}
                        >
                          <CalendarRange size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={headers.length + 2} className="px-6 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum registro encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 3. COMPONENTE DE FORMULÁRIO
 */
const FormInput = ({ label, value, onChange, placeholder, options, isMulti, isLoading, isError, disabled }) => {
  const [showOptions, setShowOptions] = useState(false);
  const displayLabel = label === 'id' ? 'Identificador (ID)' : label;

  return (
    <div className="flex flex-col gap-2 w-full text-left relative">
      <div className="flex items-center justify-between ml-1">
        <label className={`text-[10px] font-black uppercase tracking-widest ${isError ? 'text-rose-500' : 'text-slate-500'}`}>{displayLabel}</label>
        {isLoading && <Loader2 className="animate-spin text-indigo-500" size={12} />}
      </div>
      {options ? (
        <div className="relative">
          {isMulti ? (
            <div className="flex flex-col gap-2">
              <div onClick={() => !disabled && setShowOptions(!showOptions)} className={`w-full ${isError ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-300'} border rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 outline-none focus-within:bg-white focus-within:border-indigo-500 min-h-[48px] cursor-pointer flex flex-wrap gap-2 transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {value && String(value).split(', ').filter(v => v).length > 0 ? (
                  String(value).split(', ').map((v, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-indigo-200">
                      {v} {!disabled && <X size={10} onClick={(e) => { e.stopPropagation(); const currentArr = String(value).split(', '); const newValue = currentArr.filter(item => item !== v).join(', '); onChange(newValue); }} />}
                    </span>
                  ))
                ) : <span className="text-slate-400 font-medium">{placeholder || "Selecionar múltiplos..."}</span>}
                <div className="ml-auto text-slate-400"><ChevronDown size={14} className={showOptions ? 'rotate-180' : ''} /></div>
              </div>
              {showOptions && !disabled && (
                <div className={`absolute top-full left-0 right-0 mt-2 bg-white border ${BORDER_CONTRAST} rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto no-scrollbar`}>
                  {options.map((opt, i) => {
                    const isSelected = String(value || "").includes(opt);
                    return (
                      <div key={i} onClick={() => { const currentValues = value ? String(value).split(', ') : []; const newValue = isSelected ? currentValues.filter(v => v !== opt).join(', ') : [...currentValues, opt].filter(v => v).join(', '); onChange(newValue); }}
                        className={`px-5 py-3 text-xs font-bold cursor-pointer transition-colors flex items-center justify-between ${isSelected ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-700'}`}>
                        {opt} {isSelected && <CheckCircle2 size={14} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <select disabled={disabled} value={value || ''} onChange={(e) => onChange(e.target.value)} className={`w-full ${isError ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-300'} border rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <option value="">{options.length > 0 ? "Selecione uma opção..." : "Nenhum resultado disponível..."}</option>
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={14} /></div>
            </div>
          )}
        </div>
      ) : <input disabled={disabled} type={label === 'Data de Nascimento' ? 'date' : 'text'} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full bg-slate-50 border ${BORDER_CONTRAST} rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />}
    </div>
  );
};

/**
 * 3.1 FORMULÁRIO EXTENSO DE MATRÍCULA 2026
 */
const EnrollmentFullForm = ({ studentData, onComplete, onCancel }) => {
  const [ficha, setFicha] = useState(studentData.fichaMatricula || {
    documentacao: {},
    saude: {},
    autorizacoes: {},
    contatos: {}
  });

  const handleSave = () => {
    // Validação básica: se alguns campos chave estão preenchidos
    onComplete(ficha);
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300">
      <div className="p-8 bg-indigo-50 border border-indigo-200 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
        <div className="p-4 bg-white rounded-3xl text-indigo-600 shadow-sm border border-indigo-100"><GraduationCap size={32} /></div>
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase">Ficha Cadastral: Matrícula 2026</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">Aluno: {studentData.Nome} | ID: {studentData.id}</p>
        </div>
      </div>

      {/* SEÇÃO 1: DOCUMENTOS */}
      <div className="space-y-6">
        <WidgetHeader title="1. Documentação Oficial" icon={FileBadge} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Número do RG" placeholder="Inserir RG..." value={ficha.documentacao.rg} onChange={(v) => setFicha(p => ({...p, documentacao: {...p.documentacao, rg: v}}))} />
          <FormInput label="Número do CPF" placeholder="Inserir CPF..." value={ficha.documentacao.cpf} onChange={(v) => setFicha(p => ({...p, documentacao: {...p.documentacao, cpf: v}}))} />
          <FormInput label="Certidão de Nascimento" placeholder="Termo / Livro..." value={ficha.documentacao.certidao} onChange={(v) => setFicha(p => ({...p, documentacao: {...p.documentacao, certidao: v}}))} />
          <FormInput label="Cartão do SUS" placeholder="Número do cartão..." value={ficha.documentacao.sus} onChange={(v) => setFicha(p => ({...p, documentacao: {...p.documentacao, sus: v}}))} />
        </div>
      </div>

      {/* SEÇÃO 2: SAÚDE */}
      <div className="space-y-6">
        <WidgetHeader title="2. Quadro Clínico e Alergias" icon={Stethoscope} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Tipo Sanguíneo" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} value={ficha.saude.sangue} onChange={(v) => setFicha(p => ({...p, saude: {...p.saude, sangue: v}}))} />
          <FormInput label="Possui Alergias?" options={['Sim', 'Não']} value={ficha.saude.alergiasSim} onChange={(v) => setFicha(p => ({...p, saude: {...p.saude, alergiasSim: v}}))} />
          <FormInput label="Quais?" placeholder="Descreva aqui..." disabled={ficha.saude.alergiasSim !== 'Sim'} value={ficha.saude.alergiasDesc} onChange={(v) => setFicha(p => ({...p, saude: {...p.saude, alergiasDesc: v}}))} />
        </div>
        <FormInput label="Medicamentos de Uso Contínuo" placeholder="Liste medicamentos e horários..." value={ficha.saude.medicamentos} onChange={(v) => setFicha(p => ({...p, saude: {...p.saude, medicamentos: v}}))} />
      </div>

      {/* SEÇÃO 3: AUTORIZAÇÕES */}
      <div className="space-y-6">
        <WidgetHeader title="3. Autorizações Legais" icon={ShieldIcon} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Uso de Imagem e Som" options={['Autorizado', 'Não Autorizado']} value={ficha.autorizacoes.imagem} onChange={(v) => setFicha(p => ({...p, autorizacoes: {...p.autorizacoes, imagem: v}}))} />
          <FormInput label="Saída Desacompanhado" options={['Autorizado', 'Não Autorizado']} value={ficha.autorizacoes.saida} onChange={(v) => setFicha(p => ({...p, autorizacoes: {...p.autorizacoes, saida: v}}))} />
        </div>
      </div>

      {/* SEÇÃO 4: EMERGÊNCIA */}
      <div className="space-y-6">
        <WidgetHeader title="4. Contatos de Emergência" icon={Smartphone} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Nome do Contato 1" placeholder="Ex: Avó Materna..." value={ficha.contatos.nome1} onChange={(v) => setFicha(p => ({...p, contatos: {...p.contatos, nome1: v}}))} />
          <FormInput label="Telefone de Emergência 1" placeholder="(00) 00000-0000" value={ficha.contatos.tel1} onChange={(v) => setFicha(p => ({...p, contatos: {...p.contatos, tel1: v}}))} />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-10 border-t border-slate-200">
        <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:brightness-110 shadow-lg active:scale-95 transition-all">
          <BadgeCheck size={20} /> Finalizar Matrícula e Gerar Código Secreto
        </button>
        <button onClick={onCancel} className="px-10 py-5 bg-slate-100 text-slate-500 border border-slate-300 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
          Voltar
        </button>
      </div>
    </div>
  );
};

const DataEntryForm = ({ headers, onSave, onCancel, initialData, unitsList, classesList, staffList, guardiansData, studentsData, tableName, onOpenSchedule, onOpenFullMatricula }) => {
  const [formData, setFormData] = useState({});
  const [keyCodeInput, setKeyCodeInput] = useState("");

  useEffect(() => {
    if (initialData) {
        setFormData({...initialData});
    } else {
        const newData = {};
        if (tableName === 'students') {
            newData['Status Matrícula'] = 'PENDENTE';
        }
        setFormData(newData);
    }
  }, [initialData, tableName]);

  const isStudentMinor = useMemo(() => {
    if (tableName !== 'students' || !formData['Data de Nascimento']) return false;
    const birthDate = new Date(formData['Data de Nascimento']);
    if (isNaN(birthDate)) return false;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    return age < 18;
  }, [formData, tableName]);

  const filteredGuardians = useMemo(() => {
    if (tableName !== 'students' || !formData.Nome) return guardiansData.map(g => g.Nome);
    const claimants = guardiansData.filter(g => String(g["Alunos Vinculados"] || "").split(', ').includes(formData.Nome));
    return claimants.map(g => g.Nome);
  }, [guardiansData, formData.Nome, tableName]);

  const handleLinkByCode = () => {
    const student = studentsData.find(s => s['Código Secreto de Matrícula'] === keyCodeInput.trim());
    if (student) {
        const currentList = formData['Alunos Vinculados'] ? formData['Alunos Vinculados'].split(', ') : [];
        if (!currentList.includes(student.Nome)) {
            const newList = [...currentList, student.Nome].join(', ');
            setFormData(prev => ({...prev, 'Alunos Vinculados': newList}));
            setKeyCodeInput("");
        }
    }
  };

  const visibleHeaders = headers.filter(h => h !== 'Professor' && h !== 'Status Matrícula');

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* BOTÃO PARA MATRÍCULA EXTENSA - SÓ PARA ALUNOS */}
      {tableName === 'students' && initialData && (
          <div className={`p-8 rounded-[2.5rem] border flex flex-col gap-6 transition-all ${formData['Status Matrícula'] === 'CONCLUÍDA' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl shadow-sm border ${formData['Status Matrícula'] === 'CONCLUÍDA' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'}`}>
                        {formData['Status Matrícula'] === 'CONCLUÍDA' ? <BadgeCheck size={24} /> : <FileText size={24} />}
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Processo de Matrícula 2026</h5>
                        <p className={`text-[8px] font-bold uppercase mt-1 ${formData['Status Matrícula'] === 'CONCLUÍDA' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            Status: {formData['Status Matrícula']}
                        </p>
                    </div>
                </div>
                {formData['Código Secreto de Matrícula'] && (
                    <div className="bg-white border border-emerald-100 px-4 py-2 rounded-xl text-center">
                        <p className="text-[7px] font-black uppercase text-slate-400">Chave do Aluno</p>
                        <p className="text-xs font-black text-emerald-700 tracking-tighter">{formData['Código Secreto de Matrícula']}</p>
                    </div>
                )}
              </div>
              
              {formData['Status Matrícula'] !== 'CONCLUÍDA' && (
                <button 
                    onClick={(e) => { e.preventDefault(); onOpenFullMatricula(formData); }}
                    className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    <Plus size={16} /> Preencher Ficha Completa 2026
                </button>
              )}
          </div>
      )}

      {tableName === 'guardians' && (
          <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-700 flex flex-col gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-xl"><KeyRound size={20} /></div>
                  <div>
                      <h5 className="text-[10px] font-black uppercase text-white tracking-widest">Ativação de Vínculo Familiar</h5>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Informe a chave secreta do aluno gerada após a matrícula.</p>
                  </div>
              </div>
              <div className="flex gap-2">
                  <input value={keyCodeInput} onChange={(e) => setKeyCodeInput(e.target.value)} placeholder="EX: SEC-ABC12" className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500 transition-all" />
                  <button onClick={handleLinkByCode} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg"><UserCheck2 size={16} /> Validar</button>
              </div>
          </div>
      )}

      {isStudentMinor && !formData['Responsável'] && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-[2rem] flex items-center gap-4">
          <div className="p-2 bg-white rounded-xl text-rose-500 shadow-sm"><Baby size={18} /></div>
          <div><p className="text-[10px] font-black uppercase text-rose-700 tracking-wider">Atenção: Aluno Menor de Idade</p><p className="text-[8px] font-bold text-rose-500 uppercase leading-none mt-1">É obrigatório selecionar um dos responsáveis vinculados.</p></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleHeaders.map((header, idx) => {
          if (header === 'Tipo de Acessibilidade' && formData['Acessibilidade'] !== 'Sim') return null;
          const isVinculados = header === 'Alunos Vinculados' && tableName === 'guardians';

          return (
            <FormInput 
              key={idx}
              label={header} 
              value={formData[header]} 
              disabled={isVinculados || header === 'Código Secreto de Matrícula'}
              isError={header === 'Responsável' && isStudentMinor && !formData['Responsável']}
              onChange={(val) => setFormData(prev => ({...prev, [header]: val}))} 
              placeholder={`Inserir ${header.toLowerCase()}...`}
              isMulti={header === 'Disciplinas' || header === 'Turnos' || header === 'Disciplinas Habilitadas' || header === 'Alunos Vinculados' || header === 'Tipo de Acessibilidade'}
              options={
                header === 'Unidade' ? unitsList : 
                header === 'Turnos' ? TURNOS_OPCOES :
                header === 'Ano Letivo' ? MEC_ANOS_LETIVOS :
                header === 'Disciplinas' || header === 'Disciplinas Habilitadas' ? MEC_DISCIPLINAS :
                header === 'Escolaridade' ? ESCOLARIDADE_OPCOES : 
                header === 'Estado' ? ESTADO_EQUIPAMENTO :
                header === 'Setor' ? SETORES_RH :
                header === 'Coordenador' ? staffList : 
                header === 'Turma' ? classesList : 
                header === 'Responsável' ? filteredGuardians :
                header === 'Acessibilidade' ? ACESSIBILIDADE_OPCOES :
                header === 'Tipo de Acessibilidade' ? TIPO_ACESSIBILIDADE_OPCOES : null
              }
            />
          );
        })}
      </div>
      <div className={`flex items-center gap-3 pt-6 border-t ${BORDER_CONTRAST}`}>
        <button onClick={() => onSave(formData)} className="flex items-center justify-center gap-2.5 px-8 py-4 bg-indigo-600 text-white border border-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm group"><Save size={16} className="group-hover:scale-110" /> Salvar Registro </button>
        <button onClick={onCancel} className="px-8 py-4 bg-slate-100 text-slate-500 border border-slate-300 rounded-2xl text-xs font-black uppercase hover:bg-slate-200 transition-all">Descartar</button>
      </div>
    </div>
  );
};

/**
 * 4. COMPONENTE MODAL
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200 text-left">
      <div className={`bg-white w-full ${maxWidth} rounded-[3rem] border-2 border-slate-300 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95`}>
        <div className={`p-10 pb-4 flex items-center justify-between border-b ${BORDER_CONTRAST}`}>
          <WidgetHeader title={title} />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 mb-6"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-10 py-10 no-scrollbar">{children}</div>
      </div>
    </div>
  );
};

/**
 * 5. COMPONENTE DA GRADE ESCOLAR
 */
const ScheduleModal = ({ isOpen, onClose, classData, onSave, teachersData }) => {
  const [activeTab, setActiveTab] = useState('weekly_grid'); 
  const [grade, setGrade] = useState({});
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    if (classData?.grade) setGrade({...classData.grade});
    if (classData?.assignments) setAssignments({...classData.assignments});
    else { setGrade({}); setAssignments({}); }
  }, [classData, isOpen]);

  const handleAssignmentChange = (disciplina, professor) => { setAssignments(prev => ({ ...prev, [disciplina]: professor })); };
  const handleGridChange = (dia, periodo, disciplina) => { setGrade(prev => ({ ...prev, [`${dia}-${periodo}`]: disciplina })); };

  if (!isOpen || !classData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Gestão de Grade: ${classData?.Nome}`} maxWidth="max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
            <button onClick={() => setActiveTab('weekly_grid')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'weekly_grid' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}><CalendarRange size={14} /> 1. Grade (Matérias)</button>
            <button onClick={() => setActiveTab('assignments')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'assignments' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}><Users2 size={14} /> 2. Alocação (Docentes)</button>
        </div>

        {activeTab === 'weekly_grid' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl p-1 shadow-sm">
                    <table className="w-full border-separate border-spacing-1">
                        <thead>
                            <tr>
                                <th className="p-2 text-[9px] font-black uppercase text-slate-400 text-left w-24">Horário</th>
                                {DIAS_SEMANA.map(dia => (<th key={dia} className="p-2 text-[9px] font-black uppercase text-indigo-600 bg-indigo-50/40 rounded-xl">{dia}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERIODOS.map((periodo, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 whitespace-nowrap align-middle">
                                        <div className="flex flex-col"><span className="text-[9px] font-black text-slate-800 uppercase">{idx + 1}º Per</span><span className="text-[8px] font-bold text-slate-400">{periodo}</span></div>
                                    </td>
                                    {DIAS_SEMANA.map(dia => {
                                        const discName = grade[`${dia}-${idx}`] || "";
                                        const assignedProf = assignments[discName] || "";
                                        return (
                                            <td key={dia} className="min-w-[150px]">
                                                <div className={`p-3 rounded-2xl border transition-all ${discName ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                                                    <div className="relative mb-1.5">
                                                        <select value={discName} onChange={(e) => handleGridChange(dia, idx, e.target.value)} className="w-full bg-transparent text-[9px] font-black uppercase text-slate-800 outline-none pr-4 appearance-none cursor-pointer">
                                                            <option value="">Matéria...</option>
                                                            {MEC_DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                                                        </select>
                                                        <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                                    </div>
                                                    {discName && <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-50"><User size={10} className={assignedProf ? "text-indigo-400" : "text-rose-400"} /><span className={`text-[8px] font-black uppercase truncate ${assignedProf ? 'text-indigo-600' : 'text-rose-400 italic'}`}>{assignedProf || "Sem Docente"}</span></div>}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'assignments' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MEC_DISCIPLINAS.map((disc, idx) => {
                        const availableTeachers = teachersData.filter(t => String(t["Disciplinas Habilitadas"] || "").toLowerCase().includes(disc.toLowerCase()));
                        return (
                            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col gap-3 shadow-sm hover:border-indigo-300 transition-all group">
                                <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase text-slate-800">{disc}</span>{assignments[disc] ? <BadgeCheck size={16} className="text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />}</div>
                                <select value={assignments[disc] || ""} onChange={(e) => handleAssignmentChange(disc, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-600 outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                                    <option value="">Indicar Docente...</option>
                                    {availableTeachers.map(t => <option key={t.Nome} value={t.Nome}>{t.Nome}</option>)}
                                </select>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
          <button onClick={() => onSave(classData.id || classData.Nome, { grade, assignments })} className="flex items-center justify-center gap-2.5 px-8 py-4 bg-indigo-600 text-white border border-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm group"><Save size={16} className="group-hover:scale-110" /> Finalizar Grade </button>
          <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-500 border border-slate-300 rounded-2xl text-xs font-black uppercase hover:bg-slate-200 transition-all">Fechar</button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * 6. COMPONENTE PRINCIPAL (APP)
 */
const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedSector, setSelectedSector] = useState('pedagogical'); 
  const [selectedDataTable, setSelectedDataTable] = useState('classes');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [scheduleView, setScheduleView] = useState(null);
  const [editView, setEditView] = useState(null);
  
  // DADOS DO SISTEMA
  const [units, setUnits] = useState([{ id: 'U1', Nome: 'Escola Digital Pro - Unidade Modelo', Gestor: 'Mariana Santos', Localização: 'SJC - SP', INEP: '35012345' }]);
  const [rooms, setRooms] = useState([{ id: 'R1', Nome: "Laboratório de Robótica", Unidade: "Unidade Modelo", Capacidade: "30", Bloco: "A" }, { id: 'R2', Nome: "Sala 101", Unidade: "Unidade Modelo", Capacidade: "40", Bloco: "B" }]);
  const [inventory, setInventory] = useState([{ id: 'I1', Item: "Kit LEGO Mindstorms", Categoria: "Robótica", Unidade: "Unidade Modelo", Estado: "Novo" }, { id: 'I2', Item: "Projetor 4K", Categoria: "Audiovisual", Unidade: "Unidade Modelo", Estado: "Bom" }]);
  const [teachers, setTeachers] = useState([{ Nome: "Marcos Pontes", Escolaridade: "Doutorado", "Disciplinas Habilitadas": "Matemática, Física", Telefone: "(12) 98821-2201" }, { Nome: "Cecília Meireles", Escolaridade: "Mestrado", "Disciplinas Habilitadas": "Língua Portuguesa, Literatura", Telefone: "(11) 97712-0091" }]);
  const [staff, setStaff] = useState([{ Nome: "Mariana Santos", Cargo: "Secretária Acadêmica", Setor: "Administrativo", Email: "secretaria@escoladigitalpro.com" }]);
  const [vendors, setVendors] = useState([{ Empresa: "Segurança Forte LTDA", Serviço: "Segurança Patrimonial", Responsável: "Jorge Medeiros" }]);
  const [classes, setClasses] = useState([{ id: "TUR-001", Nome: "9º Ano A", Turno: "Manhã", "Ano Letivo": "9º Ano (Ensino Fundamental)", Coordenador: "Mariana Santos", Sala: "Sala 101", grade: {}, assignments: {} }]);
  const [guardians, setGuardians] = useState([{ id: "RESP-001", Nome: "João Silva", CPF: "123.456.789-00", "Alunos Vinculados": "Ana Silva" }]);
  const [students, setStudents] = useState([
    { id: "AL-001", Nome: "Ana Silva", "Status Matrícula": "CONCLUÍDA", "Código Secreto de Matrícula": "SEC-ANA22", Turma: "9º Ano A", "Responsável": "João Silva", "Data de Nascimento": "2012-05-15", Acessibilidade: "Não" }
  ]);

  const stats = [ { label: 'Unidades', value: units.length, icon: Building2, color: 'indigo' }, { label: 'Docentes', value: teachers.length, icon: GraduationCap, color: 'emerald' }, { label: 'Alunos', value: students.length, icon: Users, color: 'blue' }, { label: 'Turmas', value: classes.length, icon: Presentation, color: 'amber' } ];
  const sectors = [ { id: 'infrastructure', label: 'Infraestrutura', icon: Building2 }, { id: 'hr', label: 'Recursos Humanos', icon: Users }, { id: 'pedagogical', label: 'Pedagógico', icon: GraduationCap } ];

  const tablesBySector = {
    infrastructure: [ { id: 'units', label: 'Unidades Ativas', icon: Building2, headers: ["Nome", "Gestor", "Localização"], data: units, setter: setUnits }, { id: 'rooms', label: 'Salas e Ambientes', icon: Warehouse, headers: ["Nome", "Unidade", "Capacidade", "Bloco"], data: rooms, setter: setRooms }, { id: 'equipments', label: 'Inventário', icon: Laptop, headers: ["Item", "Categoria", "Unidade", "Estado"], data: inventory, setter: setInventory } ],
    hr: [ { id: 'teachers', label: 'Corpo Docente', icon: GraduationCap, headers: ["Nome", "Escolaridade", "Disciplinas Habilitadas", "Telefone"], data: teachers, setter: setTeachers }, { id: 'staff', label: 'Equipe Administrativa', icon: UserCog, headers: ["Nome", "Cargo", "Setor"], data: staff, setter: setStaff }, { id: 'vendors', label: 'Prestadores (B2B)', icon: Truck, headers: ["Empresa", "Serviço", "Responsável"], data: vendors, setter: setVendors } ],
    pedagogical: [ { id: 'classes', label: 'Cadastro de Turmas', icon: Presentation, headers: ["id", "Nome", "Turno", "Ano Letivo", "Coordenador", "Sala"], data: classes, setter: setClasses }, { id: 'students', label: 'Cadastro de Alunos', icon: Users, headers: ["id", "Nome", "Status Matrícula", "Turma", "Responsável", "Data de Nascimento"], data: students, setter: setStudents }, { id: 'guardians', label: 'Cadastro de Responsáveis', icon: Users2, headers: ["Nome", "CPF", "Telefone", "Alunos Vinculados", "Endereço"], data: guardians, setter: setGuardians } ]
  };

  const currentSector = sectors.find(s => s.id === selectedSector);
  const availableTables = tablesBySector[selectedSector] || [];
  
  useEffect(() => { if (availableTables.length > 0) { setSelectedDataTable(availableTables[0].id); } setSelectedRows([]); }, [selectedSector]);
  useEffect(() => { setSelectedRows([]); }, [selectedDataTable]);

  const currentTable = useMemo(() => availableTables.find(t => t.id === selectedDataTable) || availableTables[0], [selectedSector, selectedDataTable, availableTables]);

  const handleEditAction = () => {
    const target = currentTable.data.find(item => getRowId(item) === selectedRows[0]);
    if (target) { setEditView({...target}); setActiveModal('data_form'); }
  };

  const handleSaveData = (data) => {
    const isNew = !editView;
    const currentId = isNew ? `CAD-${Date.now()}` : getRowId(editView);

    if (selectedDataTable === 'guardians') {
        const vinculados = data["Alunos Vinculados"] ? data["Alunos Vinculados"].split(', ') : [];
        setStudents(prev => prev.map(aluno => {
            if (vinculados.includes(aluno.Nome)) { return { ...aluno, "Responsável": data.Nome }; }
            if (aluno.Responsável === (editView?.Nome || data.Nome) && !vinculados.includes(aluno.Nome)) { return { ...aluno, "Responsável": "" }; }
            return aluno;
        }));
    }

    if (editView) { currentTable.setter(prev => prev.map(item => getRowId(item) === currentId ? {...item, ...data} : item)); }
    else { currentTable.setter(prev => [{...data, id: currentId}, ...prev]); }
    setActiveModal(null); setEditView(null);
  };

  const toggleSelect = (id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased pb-24 text-left">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
      
      <ScheduleModal isOpen={activeModal === 'schedule_grid'} onClose={() => setActiveModal(null)} classData={scheduleView} onSave={(id, data) => { setClasses(p => p.map(c => getRowId(c) === id ? {...c, ...data} : c)); setActiveModal(null); }} teachersData={teachers} />

      <Modal isOpen={activeModal === 'full_matricula'} onClose={() => setActiveModal(null)} title="Formulário de Matrícula Completa 2026" maxWidth="max-w-5xl">
        <EnrollmentFullForm 
            studentData={editView} 
            onCancel={() => setActiveModal(null)}
            onComplete={(ficha) => {
                const updatedStudent = {
                    ...editView,
                    fichaMatricula: ficha,
                    'Status Matrícula': 'CONCLUÍDA',
                    'Código Secreto de Matrícula': generateSecretCode()
                };
                setStudents(p => p.map(s => getRowId(s) === getRowId(editView) ? updatedStudent : s));
                setEditView(updatedStudent);
                setActiveModal('data_form'); // Retorna ao formulário principal com o código gerado
            }}
        />
      </Modal>

      <Modal isOpen={activeModal === 'data_form'} onClose={() => { setActiveModal(null); setEditView(null); }} title={editView ? "Editar Registro" : "Adicionar Novo"}>
        <DataEntryForm 
            key={editView ? getRowId(editView) : 'new_form'}
            headers={currentTable?.headers || []} 
            initialData={editView}
            tableName={selectedDataTable}
            unitsList={units.map(u => u.Nome)}
            classesList={classes.map(c => c.Nome)}
            staffList={staff.map(s => s.Nome)}
            guardiansData={guardians}
            studentsData={students}
            onOpenFullMatricula={(data) => { setEditView(data); setActiveModal('full_matricula'); }}
            onOpenSchedule={(data) => { setScheduleView(data); setActiveModal('schedule_grid'); }}
            onSave={handleSaveData} 
            onCancel={() => { setActiveModal(null); setEditView(null); }} 
        />
      </Modal>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-3xl text-indigo-600 bg-white border ${BORDER_CONTRAST} shadow-sm`}><School size={32} /></div>
            <div className="flex flex-col"><h1 className="text-2xl font-black text-slate-900 uppercase leading-none">Gestão Digital Pro</h1><p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Console de Administração</p></div>
          </div>
          <div className={`flex items-center gap-4 bg-white border ${BORDER_CONTRAST} p-2 rounded-3xl shadow-sm`}>
            <CustomSelect label="Mudar Visão" value={activeView} onChange={setActiveView} options={[{ id: 'dashboard', label: 'Painel Geral', icon: TrendingUp }, { id: 'dataCentral', label: 'Console de Dados', icon: Database }]} icon={activeView === 'dashboard' ? TrendingUp : Database} />
          </div>
        </header>

        {activeView === 'dashboard' ? (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-slate-300 p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4">
                        <div className={`p-3 w-fit bg-${s.color}-50 text-${s.color}-600 rounded-2xl border border-${s.color}-100`}><s.icon size={20} /></div>
                        <div><h3 className="text-3xl font-black text-slate-900 leading-none mb-1">{s.value}</h3><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p></div>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          <main className="space-y-12 animate-in fade-in duration-500">
            <div className={`flex flex-col md:flex-row items-end justify-between gap-8 border-b ${BORDER_CONTRAST} pb-12`}>
              <div className="flex flex-col text-left"><span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Painel de Exploração</span><h6 className="text-xl font-black text-slate-900 uppercase">Gestão de Dados</h6></div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <CustomSelect label="Setor" value={selectedSector} onChange={setSelectedSector} options={sectors} icon={currentSector?.icon || Users} />
                <CustomSelect label="Entidade" value={selectedDataTable} onChange={setSelectedDataTable} options={availableTables} icon={LayoutGrid} />
              </div>
            </div>
            
            <WidgetCard title={currentTable?.label} icon={currentTable?.icon} headerActions={
                <div className="flex items-center gap-3">
                    {selectedRows.length > 0 && (
                      <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                        <button onClick={handleEditAction} className={`p-3 bg-white border ${BORDER_CONTRAST} text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all`} title="Editar"><Pencil size={18} /></button>
                        <button onClick={() => {
                            const newData = currentTable.data.filter(item => !selectedRows.includes(getRowId(item)));
                            currentTable.setter(newData);
                            setSelectedRows([]);
                        }} className={`p-3 bg-white border ${BORDER_CONTRAST} text-rose-600 rounded-2xl hover:bg-rose-50 transition-all`} title="Excluir"><Trash2 size={18} /></button>
                      </div>
                    )}
                    <button onClick={() => { setEditView(null); setActiveModal('data_form'); }} className={`p-3 bg-indigo-600 text-white rounded-2xl hover:brightness-110 shadow-lg transition-all active:scale-95`} title="Adicionar Novo"><Plus size={18} /></button>
                </div>
            }>
                <DataTable headers={currentTable.headers} data={currentTable.data} selectedIds={selectedRows} toggleSelect={toggleSelect} toggleSelectAll={() => { if (selectedRows.length === currentTable.data.length) setSelectedRows([]); else setSelectedRows(currentTable.data.map(item => getRowId(item))); }} tableName={selectedDataTable} onScheduleClick={(row) => { setScheduleView(row); setActiveModal('schedule_grid'); }} />
            </WidgetCard>
          </main>
        )}
      </div>
    </div>
  );
};

let root = null;

export function mount(host) {
  if (!host) {
    return null;
  }

  if (root) {
    root.unmount();
  }

  root = createRoot(host);

  let isMounted = true;
  const renderFallback = (message) => (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {message}
    </div>
  );

  root.render(renderFallback('Carregando estilos...'));

  ensureTailwindStyles()
    .then(() => {
      if (isMounted) {
        root.render(<App />);
      }
    })
    .catch(() => {
      if (isMounted) {
        root.render(renderFallback('Não foi possível carregar os estilos.'));
      }
    });

  return () => {
    isMounted = false;
    if (root) {
      root.unmount();
      root = null;
    }
  };
}

export default App;
