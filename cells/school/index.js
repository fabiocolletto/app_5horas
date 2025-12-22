import React, { useState, useRef, useEffect } from 'react';
import { 
  School, Briefcase, Users, FileText, Plus, X, Building2, Hash, Phone, 
  AlertCircle, RefreshCcw, Pencil, Trash2, Save, PenTool, UserPlus, 
  Fingerprint, Wrench, Hammer, Bell, Scale, UserCheck, Calendar, Heart, 
  CheckCircle2, ChevronRight, GraduationCap, BookOpen, Layers, MapPin, Map,
  ShieldCheck, Smartphone, Mail, Award, MessageSquare, Home, Landmark, UserCog,
  Globe, Instagram, FileCheck, Shield, Copy, Trash, Activity, Database, Settings,
  Info, BarChart3, TrendingUp, ChevronLeft, CreditCard, PieChart, ClipboardList,
  Menu, ChevronUp, ChevronDown, Search, Filter, Lock, Share2, UserCircle, Key,
  ShieldAlert, ToggleLeft, ToggleRight, Check, History, ShieldEllipsis, MousePointer2,
  HardDrive, Monitor, Users2, FileSignature, Building, ClipboardCheck,
  Eye, Maximize2, MoreVertical, LayoutGrid, Tooltip, Droplets, Zap, Accessibility, 
  Construction, ArrowLeft, DoorOpen, Layout, CheckCircle, Navigation, Contact2,
  Backpack, IdentificationCard, GraduationCap as StudentIcon, PanelsTopLeft,
  User, Moon, Sun, BellRing, Languages, Clock, Download, Cloud, Link, Facebook,
  Github, Chrome, UserCheck2, UserMinus, UserSearch, UserRoundPlus, Box, Microscope,
  MonitorPlay, Wind, Trash2 as TrashIcon, Laptop, Tv, Speaker, Coffee
} from 'lucide-react';

/**
 * MOTOR DE GESTÃO UNIVERSAL (REGISTRY ENGINE)
 * Renderiza dinamicamente as 8 áreas do sistema com base na configuração.
 */
const RegistryEngine = ({ 
  config, 
  data, 
  onAdd, 
  onEdit, 
  onDelete, 
  isHome,
  renderForm
}) => {
  if (isHome) return null;

  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      <SectionHeader 
        title={config.label} 
        subtitle={config.description} 
        icon={config.icon} 
        hideAdd={config.readOnly || config.type === 'form'} 
        onAdd={onAdd} 
      />
      
      {config.type === 'form' ? (
        renderForm()
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 items-start">
          {Array.isArray(data) && data.map(item => (
            <DataCard 
              key={item.id} 
              item={item} 
              subtitle={item.espaco ? `Local: ${item.espaco}` : (item.campus ? `${item.campus} • ${item.bloco || 'Interno'}` : (item.cargo || item.serie || item.tipo || item.versao))} 
              onDelete={() => onDelete(item.id)} 
              onEdit={() => onEdit(item)} 
            />
          ))}
          {!config.readOnly && config.type !== 'form' && (
            <div 
              onClick={onAdd} 
              className="aspect-[16/10] border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all cursor-pointer bg-white/50 active:scale-95 min-w-[280px] max-w-[380px] w-full"
            >
              <Plus size={24} className="mb-2 opacity-50" />
              <p className="font-bold uppercase text-[9px] tracking-widest text-center px-4">Adicionar {config.label}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * COMPONENTE DE CABEÇALHO DE SEÇÃO
 */
const SectionHeader = ({ title, subtitle, icon: Icon, colorClass = "text-slate-900", onAdd, hideAdd = true }) => {
  return (
    <div className="flex flex-col mb-6 animate-in fade-in slide-in-from-top-1 duration-500 -ml-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm ${colorClass}`}>
              <Icon size={20} />
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none">{title}</h2>
            {subtitle && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">{subtitle}</p>}
          </div>
        </div>
        {!hideAdd && (
          <button 
            onClick={onAdd} 
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all border border-slate-200 text-slate-600 shadow-sm active:scale-90"
          >
            <Plus size={18}/>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * CARD DE DADOS PADRONIZADO
 */
const DataCard = ({ item, onDelete, onEdit, subtitle }) => {
  const Icon = item.icon || Database;

  const handleAction = (e, type) => {
    e.stopPropagation();
    if (type === 'delete' && onDelete) onDelete();
    if (type === 'edit' && onEdit) onEdit();
  };

  return (
    <div className="p-6 rounded-[1.5rem] bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition-all aspect-[16/10] flex flex-col justify-between group cursor-pointer animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden min-w-[280px] max-w-[380px] w-full">
      <div className="relative flex items-center gap-4">
        <div className="flex-none p-3 rounded-xl bg-slate-50 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h4 className="font-bold text-slate-900 text-base leading-tight truncate">
            {item.nome || item.label || "Novo Registro"}
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 truncate">
            {subtitle}
          </p>
        </div>
        <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 p-1 rounded-lg border border-slate-100">
          <button onClick={(e) => handleAction(e, 'edit')} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded transition-all"><Pencil size={14} /></button>
          <button onClick={(e) => handleAction(e, 'delete')} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all"><Trash2 size={14} /></button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-2">
          {item.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-slate-100 rounded-md text-[9px] font-bold uppercase tracking-wider text-slate-600">{tag}</span>
          ))}
          {item.espaco && <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-md text-[9px] font-bold uppercase tracking-wider text-amber-700">Atrelado</span>}
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{item.status || item.capacidade || item.patrimonio || ''}</span>
        </div>
      </div>
    </div>
  );
};

const CarouselNav = ({ items, activeId, onSelect, noPadding = false }) => {
  return (
    <div className="relative flex-1 group">
      <div className={`flex overflow-x-auto gap-3 no-scrollbar scroll-smooth snap-x snap-mandatory ${noPadding ? 'px-0' : 'px-1 py-1'}`}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const IconComp = item.icon; 
          return (
            <button key={item.id} onClick={() => onSelect(item.id)} className={`flex-none snap-start px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2.5 border-2 ${isActive ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700'}`}>
              {IconComp && <IconComp size={14}/>}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }) => {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[1.25rem] shadow-sm flex items-center gap-5 hover:border-slate-300 transition-all group">
      <div className="text-slate-900 group-hover:scale-110 transition-transform"><Icon size={24} /></div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-xl font-bold text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
};

/**
 * COMPONENTE DE FORMULÁRIO GENÉRICO
 */
const GenericListForm = ({ title, items, onSave, onCancel, context, spaces = [] }) => {
  const [listData, setListData] = useState(items || []);

  const addNew = () => {
    setListData([...listData, { id: Date.now(), nome: "Novo Item", status: "Ativo", espaco: spaces[0]?.nome || "Não Definido", tags: ["Novo"] }]);
  };

  const update = (id, field, value) => setListData(listData.map(i => i.id === id ? { ...i, [field]: value } : i));
  const remove = (id) => setListData(listData.filter(i => i.id !== id));

  return (
    <div className="animate-in zoom-in-95 duration-500 space-y-6 max-w-5xl mx-auto px-2 pb-20">
      <SectionHeader title={`Gestão de ${title}`} subtitle={`Manutenção de ${context}`} icon={Database} />
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="p-2.5 bg-white text-slate-400 hover:text-slate-900 rounded-xl border border-slate-200 shadow-sm transition-all"><ArrowLeft size={18} /></button>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-tight">Lista de Registros Ativos</h3>
          </div>
          <div className="flex gap-2">
             <button onClick={onCancel} className="px-5 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-widest">Descartar</button>
             <button onClick={() => onSave(listData)} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"><Save size={14} /> Salvar Tudo</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="pl-10 py-4 text-[9px] font-bold uppercase text-slate-400 tracking-widest">Nome / Identificação</th>
                <th className="px-4 py-4 text-[9px] font-bold uppercase text-slate-400 tracking-widest">Ambiente / Localização</th>
                <th className="px-4 py-4 text-[9px] font-bold uppercase text-slate-400 tracking-widest">Status</th>
                <th className="pr-10 py-3 text-[9px] font-bold uppercase text-slate-400 tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {listData.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group text-sm">
                  <td className="pl-10 py-3 font-semibold text-slate-900">
                    <input type="text" value={item.nome} onChange={(e) => update(item.id, 'nome', e.target.value)} className="w-full bg-transparent outline-none focus:text-blue-600" />
                  </td>
                  <td className="px-4 py-3">
                    <select value={item.espaco} onChange={(e) => update(item.id, 'espaco', e.target.value)} className="bg-transparent font-semibold outline-none text-slate-600">
                      {spaces.map((s, idx) => <option key={idx} value={s.nome}>{s.nome}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">{item.status}</span>
                  </td>
                  <td className="pr-10 py-3 text-right">
                    <button onClick={() => remove(item.id)} className="p-1.5 text-slate-300 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"><TrashIcon size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addNew} className="w-full py-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold uppercase text-[10px] tracking-widest"><UserPlus size={16} /> Adicionar Novo Item à Tabela</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeModule, setActiveModule] = useState('instituicao');
  const [activeTab, setActiveTab] = useState('infraestrutura');
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null); 
  const [isNavVisible, setIsNavVisible] = useState(false);

  // Banco de Dados Mockado - Base PT-BR
  const [db, setDb] = useState({
    infraestrutura: [
      { id: 'if1', nome: "Campus Central SJC", tipo: "Unidade Principal", tags: ["Sede"], icon: Building2 },
      { id: 'if2', nome: "Anexo Desportivo", tipo: "Unidade Satélite", tags: ["Esportes"], icon: Box }
    ],
    espacos: [
      { id: 'sl1', nome: "Laboratório de Informática 01", campus: "Campus Central SJC", bloco: "Bloco B", tipo: "Técnico", capacidade: "40", icon: Microscope },
      { id: 'sl2', nome: "Auditório Nobre", campus: "Campus Central SJC", bloco: "Ala Norte", tipo: "Eventos", capacidade: "120", icon: MonitorPlay }
    ],
    equipamentos: [
      { id: 'eqp1', nome: "Projetor Epson X41", espaco: "Auditório Nobre", patrimonio: "PAT-001", tags: ["Multimídia"], icon: Tv },
      { id: 'eqp2', nome: "iMac 24' M3", espaco: "Laboratório de Informática 01", patrimonio: "PAT-088", tags: ["TI"], icon: Laptop }
    ],
    equipe: [{ id: 'eq1', nome: "Marcos Pontes", cargo: "Professor Catedrático", status: "Ativo", tags: ["Física"], icon: UserCheck }],
    alunos: [{ id: 'al1', nome: "Enzo Gabriel", serie: "9º Ano A", status: "Matriculado", tags: ["Integral"], icon: StudentIcon }],
    turmas: [{ id: 'tr1', nome: "Turma 9-A (Matutino)", serie: "9º Ano", status: "Aberta", tags: ["Manhã"], icon: Layout }],
    gestao_dados: [
      { id: 'bk1', nome: "Backup de Matrículas", versao: "v2.4", status: "Seguro", tags: ["Cloud"], icon: Database },
      { id: 'bk2', nome: "Histórico 2024", versao: "v1.0", status: "Arquivado", tags: ["Local"], icon: HardDrive }
    ],
    gestao_conexoes: [{ id: 'cx1', nome: "Ana Paula", cargo: "Coordenadora Pedagógica", status: "Ativa", tags: ["Sede"], icon: UserCircle }],
    cadastro: { nome: "Gestor Administrativo", email: "direcao@escoladigitalpro.com.br", unidade: "SJC Unidade Modelo" }
  });

  const REGISTRY_CONFIG = {
    // INSTITUIÇÃO
    infraestrutura: { label: 'Patrimônio e Unidades', description: 'Gestão de Campus, Blocos e Instalações', icon: Building, module: 'instituicao' },
    equipe: { label: 'Recursos Humanos', description: 'Gestão de Docentes e Colaboradores', icon: Users, module: 'instituicao' },
    alunos: { label: 'Corpo Discente', description: 'Gestão de Alunos e Matrículas Ativas', icon: StudentIcon, module: 'instituicao' },
    turmas: { label: 'Oferta Educativa', description: 'Organização de Turmas e Ciclos Letivos', icon: Layout, module: 'instituicao' },
    // USUÁRIO
    dados_cadastro: { label: 'Perfil de Usuário', description: 'Informações de Identificação e Conta', icon: UserCog, module: 'usuario', type: 'form' },
    preferencias: { label: 'Configurações Globais', description: 'Ajustes de Sistema e Interface', icon: Settings, module: 'usuario', type: 'form' },
    gestao_dados: { label: 'Gerenciamento de Dados', description: 'Backups, Exportações e Logs de Sistema', icon: ShieldCheck, module: 'usuario' },
    gestao_conexoes: { label: 'Segurança e Acessos', description: 'Controle de Colaboradores Vinculados', icon: Globe, module: 'usuario' }
  };

  const modules = [
    { id: 'instituicao', label: 'Instituição', icon: Landmark },
    { id: 'usuario', label: 'Usuário', icon: UserCircle }
  ];

  const subTabs = Object.keys(REGISTRY_CONFIG)
    .filter(key => REGISTRY_CONFIG[key].module === activeModule)
    .map(key => ({ id: key, ...REGISTRY_CONFIG[key] }));

  const handleEdit = (item, type = activeTab) => {
    setEditingType(type);
    setEditingItem(type === 'infraestrutura' ? item : db[type]);
  };

  const handleStartAdd = (type) => {
    setEditingType(type);
    setEditingItem(type === 'infraestrutura' ? { nome: "", tags: [], icon: Building2 } : db[type] || []);
  };

  const handleSaveBatch = (data) => {
    setDb(prev => ({ ...prev, [editingType]: data }));
    setEditingItem(null);
    setEditingType(null);
  };

  const handleDelete = (id, type = activeTab) => {
    setDb(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== id) }));
  };

  const isAtHome = !isNavVisible && !editingItem;
  const currentConfig = REGISTRY_CONFIG[activeTab];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 font-sans text-slate-800 tracking-tight transition-all duration-500 overflow-x-hidden">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="py-8 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-3 rounded-xl shadow-md hidden sm:flex text-white"><School size={24} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-widest leading-none">Gestão Digital Pro</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">SJC Unidade Modelo • {currentConfig?.label}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {setIsNavVisible(false); setEditingItem(null);}} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${isAtHome ? 'bg-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}><Home size={18} /></button>
            <button onClick={() => setIsNavVisible(!isNavVisible)} className={`hidden sm:flex w-10 h-10 rounded-xl border-2 items-center justify-center transition-all ${isNavVisible ? 'bg-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}><Layout size={18} /></button>
          </div>
        </div>

        {/* NAVEGAÇÃO */}
        <div className={`hidden sm:block transition-all duration-500 overflow-hidden ${isNavVisible && !editingItem ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="flex items-center mb-3">
             <div className="flex items-center gap-3 bg-slate-100/30 p-1 rounded-2xl -ml-1">
               <CarouselNav items={modules} activeId={activeModule} onSelect={(id) => { setActiveModule(id); setActiveTab(Object.keys(REGISTRY_CONFIG).find(k => REGISTRY_CONFIG[k].module === id)); }} noPadding />
             </div>
          </div>
          <div className="animate-in slide-in-from-left-4 duration-500 -ml-1">
            <CarouselNav items={subTabs} activeId={activeTab} onSelect={setActiveTab} noPadding />
          </div>
        </div>

        {/* INTERFACE PRINCIPAL */}
        <div className="transition-all duration-500">
          {editingItem ? (
            <GenericListForm 
              title={editingType === 'espacos' ? 'Ambientes' : editingType === 'equipamentos' ? 'Equipamentos' : (REGISTRY_CONFIG[editingType]?.label || 'Registro')}
              context={editingType === 'equipamentos' ? 'Inventário de Ativos Técnicos' : 'Registros da Unidade'}
              items={editingItem} 
              spaces={db.espacos}
              onSave={handleSaveBatch} 
              onCancel={() => {setEditingItem(null); setEditingType(null);}} 
            />
          ) : activeTab === 'infraestrutura' ? (
             <div className="space-y-16">
                <RegistryEngine config={REGISTRY_CONFIG.infraestrutura} data={db.infraestrutura} onAdd={() => handleStartAdd('infraestrutura')} onEdit={(item) => handleEdit(item, 'infraestrutura')} onDelete={(id) => handleDelete(id, 'infraestrutura')} />
                <RegistryEngine config={{ label: 'Espaços e Ambientes', description: 'Inventário Técnico de Áreas para Agendamento', icon: LayoutGrid }} data={db.espacos} onAdd={() => handleStartAdd('espacos')} onEdit={() => handleEdit(null, 'espacos')} onDelete={(id) => handleDelete(id, 'espacos')} />
                <RegistryEngine config={{ label: 'Equipamentos', description: 'Ativos Técnicos Atrelados aos Ambientes', icon: Wrench }} data={db.equipamentos} onAdd={() => handleStartAdd('equipamentos')} onEdit={() => handleEdit(null, 'equipamentos')} onDelete={(id) => handleDelete(id, 'equipamentos')} />
             </div>
          ) : (
            <RegistryEngine 
              config={currentConfig} 
              data={db[activeTab] || []} 
              onAdd={() => handleStartAdd(activeTab)} 
              onEdit={(item) => handleEdit(item, activeTab)} 
              onDelete={(id) => handleDelete(id, activeTab)} 
              renderForm={() => (
                <section className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {activeTab === 'dados_cadastro' ? 'Usuário de Acesso' : 'Configurações Ativas'}
                      </label>
                      <input type="text" readOnly className="w-full px-4 py-3 bg-slate-50 border rounded-xl opacity-60 font-mono text-sm" defaultValue={db.cadastro.email} />
                    </div>
                  </div>
                </section>
              )}
            />
          )}

          {isAtHome && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard label="Unidades" value={db.infraestrutura.length} icon={Building} />
               <StatCard label="Ambientes" value={db.espacos.length} icon={LayoutGrid} />
               <StatCard label="Equipamentos" value={db.equipamentos.length} icon={Wrench} />
               <StatCard label="Colaboradores" value={db.equipe.length} icon={Users} />
            </div>
          )}
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default App;
