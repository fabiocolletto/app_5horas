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
  HardDrive, Monitor, Users2, FileSignature, LandmarkIcon, Building, ClipboardCheck,
  Eye, Maximize2, MoreVertical, LayoutGrid, Tooltip, Droplets, Zap, Accessibility, 
  Construction, ArrowLeft
} from 'lucide-react';

/**
 * COMPONENTES DE UI REUTILIZÁVEIS
 */

const CarouselNav = ({ items, activeId, onSelect, className = "" }) => {
  const scrollRef = useRef(null);
  return (
    <div className={`relative flex-1 group ${className}`}>
      <div ref={scrollRef} className="flex overflow-x-auto gap-3 py-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory">
        {items.map((item) => {
          const id = item.id || (typeof item === 'string' ? item.toLowerCase() : "");
          const label = item.label || item;
          const Icon = item.icon;
          const isActive = activeId === id;
          return (
            <button 
              key={id}
              onClick={() => onSelect(id)}
              className={`flex-none snap-start px-8 py-4 rounded-[2.5rem] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border-2 ${
                isActive 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
              }`}
            >
              {Icon && <Icon size={18}/>}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, colorClass, onAdd, hideAdd = false, subtitle = "" }) => {
  const colorPart = colorClass?.split('-')[1] || 'blue';
  return (
    <div className="flex flex-col mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-10 ${colorClass} rounded-full shadow-lg shadow-${colorPart}-100`}></div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-widest">{title}</h2>
        </div>
        {!hideAdd && (
          <button 
            onClick={onAdd} 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-105 transition-all border-2 bg-${colorPart}-50/50 border-${colorPart}-200/40 text-${colorPart}-600 active:scale-90 shadow-sm`}
          >
            <Plus size={24}/>
          </button>
        )}
      </div>
      {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-7 leading-relaxed">{subtitle}</p>}
    </div>
  );
};

const DataCard = ({ item, colorClass, onDelete, onEdit }) => {
  const colorPart = colorClass?.split('-')[1] || 'blue';
  const Icon = item.icon || Database;

  const handleAction = (e, type) => {
    e.stopPropagation();
    if (type === 'delete' && onDelete) onDelete();
    if (type === 'edit' && onEdit) onEdit();
  };

  return (
    <div className="p-7 rounded-[3rem] bg-white border-2 border-slate-100 shadow-sm hover:border-blue-400 transition-all aspect-[16/10] flex flex-col justify-between group cursor-pointer animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
      {item.progress > 0 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
          <div className={`h-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${item.progress}%` }}></div>
        </div>
      )}

      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl bg-${colorPart}-50/50 text-${colorPart}-600 group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon size={22} />
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-100 shadow-sm">
            <button onClick={(e) => handleAction(e, 'view')} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Eye size={16} /></button>
            <button onClick={(e) => handleAction(e, 'edit')} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"><Pencil size={16} /></button>
            <button onClick={(e) => handleAction(e, 'duplicate')} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><Copy size={16} /></button>
            <button onClick={(e) => handleAction(e, 'delete')} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"><Trash2 size={16} /></button>
          </div>
        </div>
        
        <p className="font-black text-slate-900 text-lg leading-tight mb-1">{item.nome || "Sem Nome"}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{item.tipo || item.cargo || "Registro Geral"}</p>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-wrap gap-2">
          {item.tags?.map((tag, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[8px] font-black uppercase tracking-tighter text-slate-500">
              {tag}
            </span>
          ))}
        </div>
        {item.progress > 0 && <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.progress}%</div>}
      </div>
    </div>
  );
};

// Formulário Genérico e Inteligente
const ItemForm = ({ item, context, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item || {
    nome: "",
    tipo: "",
    progress: 0,
    tags: []
  });

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[4rem] p-10 md:p-14 shadow-2xl shadow-slate-200/40 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button onClick={onCancel} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              {item.id ? `Editar ${context}` : `Novo ${context}`}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Preenchimento de Informações do Censo 2026</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Identificação / Nome</label>
            <input 
              type="text" 
              value={formData.nome || ""}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Digite o nome principal" 
              className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl outline-none font-bold shadow-sm transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Categoria ou Cargo</label>
            <input 
              type="text" 
              value={formData.tipo || formData.cargo || ""}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              placeholder="Ex: Diretor, Sala de Aula, Responsável" 
              className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl outline-none font-bold shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Progresso ({formData.progress || 0}%)</label>
            <div className="px-4 py-8 bg-slate-50 rounded-3xl flex items-center gap-6">
              <input 
                type="range" 
                min="0" max="100" 
                value={formData.progress || 0}
                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Tags (Separadas por vírgula)</label>
            <input 
              type="text" 
              defaultValue={formData.tags?.join(', ')}
              onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
              placeholder="Ex: Urgente, Ativo, 2026" 
              className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl outline-none font-bold transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-16 pt-10 border-t border-slate-50">
        <button onClick={onCancel} className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-400 hover:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest transition-all">Descartar</button>
        <button onClick={() => onSave(formData)} className="px-16 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Confirmar Dados</button>
      </div>
    </div>
  );
};

// Card de Estatística
const StatCard = ({ label, value, icon: Icon, colorClass }) => {
  const textColor = colorClass?.replace('bg-', 'text-') || 'text-blue-600';
  return (
    <div className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-6 hover:border-blue-200 transition-all group animate-in zoom-in-95 duration-700">
      <div className={`${textColor} group-hover:scale-110 transition-transform`}>
        <Icon size={40} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
};

/**
 * APP PRINCIPAL
 */

const App = () => {
  // --- ESTADOS DE CONTROLO ---
  const [activeModule, setActiveModule] = useState('instituicao');
  const [activeTab, setActiveTab] = useState('equipe');
  const [instSubTab, setInstSubTab] = useState('infraestrutura');
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isUserVisible, setIsUserVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // --- DADOS DINÂMICOS (STATE) ---
  const [infraItems, setInfraItems] = useState([
    { id: 'if1', nome: "Abastecimento de Água", tipo: "Utilidade", tags: ["Potável", "Medidor Ativo"], progress: 100, icon: Droplets },
    { id: 'if2', nome: "Energia Elétrica", tipo: "Utilidade", tags: ["Bifásica", "Poste Interno"], progress: 100, icon: Zap },
    { id: 'if3', nome: "Banheiros Acessíveis", tipo: "Acessibilidade", tags: ["Norma NBR 9050", "Pendente"], progress: 40, icon: Accessibility },
    { id: 'if4', nome: "Salas de Aula (Bloco A)", tipo: "Ensino", tags: ["12 Salas", "Climatizado"], progress: 85, icon: LayoutGrid },
    { id: 'if5', nome: "Laboratório de Ciências", tipo: "Ensino", tags: ["Requisito Censo", "Completo"], progress: 100, icon: Wrench },
    { id: 'if6', nome: "Pátio Coberto", tipo: "Lazer", tags: ["Área Comum", "Ventilado"], progress: 60, icon: Construction }
  ]);

  const [diretoria, setDiretoria] = useState([
    { id: 'dir1', nome: "Prof. Alberto Santos", cargo: "Diretor Geral", tags: ["INEP Ativo", "Gestor"], progress: 100, icon: UserCheck }
  ]);

  const [responsaveisInst, setResponsaveisInst] = useState([
    { id: 'ri1', nome: "Conselho de Pais", cargo: "Órgão Colegiado", tags: ["Legal", "Ativo"], progress: 100, icon: Users2 },
    { id: 'ri2', nome: "Secretaria de Educação", cargo: "Mantenedora", tags: ["Público"], progress: 100, icon: LandmarkIcon }
  ]);

  // --- ESTRUTURAS DE NAVEGAÇÃO ---
  const modules = [
    { id: 'instituicao', label: 'Instituição', icon: Landmark },
    { id: 'cadastros', label: 'Dados Escolares', icon: Database },
    { id: 'pedagogico', label: 'Pedagógico', icon: GraduationCap },
    { id: 'financas', label: 'Finanças', icon: PieChart }
  ];
  
  const registrationTabs = [
    { id: 'equipe', label: 'Equipe', icon: Briefcase },
    { id: 'alunos', label: 'Alunos', icon: Users },
    { id: 'turmas', label: 'Turmas', icon: Layers }
  ];

  const institutionTabs = [
    { id: 'infraestrutura', label: 'Infraestrutura', icon: Building },
    { id: 'gestor', label: 'Gestor Escolar', icon: FileSignature },
    { id: 'caracterizacao', label: 'Caracterização', icon: Map },
    { id: 'responsaveis', label: 'Responsáveis', icon: Users2 },
    { id: 'conectividade', label: 'Conectividade', icon: Monitor }
  ];

  // --- LÓGICA DE AÇÃO CONTEXTUAL ---

  const handleStartAdd = () => {
    // Detecta o contexto para criar o template correto
    let template = { nome: "", tags: [], progress: 0 };

    if (activeModule === 'instituicao') {
      if (instSubTab === 'infraestrutura') template = { ...template, tipo: "Dependência", icon: Building };
      else if (instSubTab === 'gestor') template = { ...template, cargo: "Novo Gestor", icon: UserCheck };
      else if (instSubTab === 'responsaveis') template = { ...template, cargo: "Novo Responsável", icon: Users2 };
      else if (instSubTab === 'caracterizacao') template = { ...template, tipo: "Dados de Área", icon: Map };
      else template = { ...template, tipo: "Registro", icon: Database };
    } else {
      template = { ...template, tipo: `Membro de ${activeTab}`, icon: UserPlus };
    }

    setEditingItem(template);
  };

  const handleSaveItem = (data) => {
    // Escolhe qual array atualizar baseado no contexto ativo
    if (activeModule === 'instituicao') {
      if (instSubTab === 'infraestrutura') {
        if (data.id) setInfraItems(infraItems.map(i => i.id === data.id ? data : i));
        else setInfraItems([{ ...data, id: `if-${Date.now()}` }, ...infraItems]);
      } else if (instSubTab === 'gestor') {
        if (data.id) setDiretoria(diretoria.map(i => i.id === data.id ? data : i));
        else setDiretoria([{ ...data, id: `dir-${Date.now()}` }, ...diretoria]);
      } else if (instSubTab === 'responsaveis') {
        if (data.id) setResponsaveisInst(responsaveisInst.map(i => i.id === data.id ? data : i));
        else setResponsaveisInst([{ ...data, id: `ri-${Date.now()}` }, ...responsaveisInst]);
      }
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    if (activeModule === 'instituicao') {
      if (instSubTab === 'infraestrutura') setInfraItems(infraItems.filter(i => i.id !== id));
      else if (instSubTab === 'gestor') setDiretoria(diretoria.filter(i => i.id !== id));
      else if (instSubTab === 'responsaveis') setResponsaveisInst(responsaveisInst.filter(i => i.id !== id));
    }
  };

  const handleHome = () => {
    setActiveModule('instituicao');
    setActiveTab('equipe');
    setInstSubTab('infraestrutura');
    setEditingItem(null);
    setSearchTerm("");
    setIsSearchVisible(false);
    setIsNavVisible(false);
    setIsUserVisible(false);
  };

  const changeModule = (id) => {
    setActiveModule(id);
    setEditingItem(null);
    setSearchTerm("");
    if (id === 'pedagogico') setActiveTab('turmas');
    else if (id === 'financas') setActiveTab('contas');
    else if (id === 'instituicao') setInstSubTab('infraestrutura');
    else setActiveTab('equipe');
  };

  const isAtHome = !isUserVisible && !isNavVisible;

  const getFilteredItems = (data = []) => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item => (item.nome || "").toLowerCase().includes(term));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 font-sans text-slate-800 tracking-tight transition-all duration-500">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-8">
        
        {/* HEADER / COCKPIT */}
        <div className="relative py-8 mb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-white p-4 rounded-[2.2rem] border-2 border-slate-100 flex items-center justify-center shadow-sm">
                {isUserVisible ? (
                   <UserCog size={40} className="text-blue-600 animate-in zoom-in-50 duration-500" />
                ) : isNavVisible ? (
                   <Database size={40} className="text-blue-600 animate-in zoom-in-50 duration-500" />
                ) : (
                   <School size={40} className="text-slate-900" />
                )}
              </div>
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                  {isUserVisible ? "Gestão de Perfil" : isNavVisible ? (editingItem ? "Editor Ativo" : "Central de Cadastros") : "Escola Digital Pro"}
                </h1>
                <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] mt-1">
                  <Activity size={10} className={isAtHome ? "animate-pulse" : ""} />
                  <span>
                    {isUserVisible ? "Acesso Seguro" : isNavVisible ? `Gestão: ${instSubTab || activeTab}` : "Censo Escolar 2026"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={handleHome} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 backdrop-blur-md shadow-sm active:scale-95 ${isAtHome ? 'bg-blue-600/10 border-blue-600 text-blue-600 shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:text-blue-600'}`}><Home size={28} /></button>
              <button onClick={() => { setIsUserVisible(!isUserVisible); setIsNavVisible(false); setIsSearchVisible(false); }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 backdrop-blur-md shadow-sm active:scale-95 ${isUserVisible ? 'bg-blue-600/10 border-blue-600 text-blue-600 shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:text-blue-900'}`}><UserCog size={28} /></button>
              <button onClick={() => { setIsNavVisible(!isNavVisible); setIsUserVisible(false); setIsSearchVisible(false); }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 backdrop-blur-md shadow-sm active:scale-95 ${isNavVisible ? 'bg-blue-600/10 border-blue-600 text-blue-600 shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:text-blue-600'}`}>{isNavVisible ? <X size={28} /> : <Database size={28} />}</button>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO DE CADASTRO */}
        <div className={`transition-all duration-500 overflow-hidden ${isNavVisible ? 'max-h-[500px] opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'}`}>
          {!editingItem && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setIsSearchVisible(!isSearchVisible)} className={`w-[72px] h-[72px] rounded-[1.8rem] flex items-center justify-center transition-all border-2 active:scale-95 flex-none ${isSearchVisible ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}><Search size={24} /></button>
                <CarouselNav items={modules} activeId={activeModule} onSelect={changeModule} />
              </div>
              {activeModule === 'instituicao' && <div className="animate-in slide-in-from-left-4 duration-500"><CarouselNav items={institutionTabs} activeId={instSubTab} onSelect={(id) => { setInstSubTab(id); setEditingItem(null); }} /></div>}
              {activeModule === 'cadastros' && <div className="animate-in slide-in-from-left-4 duration-500"><CarouselNav items={registrationTabs} activeId={activeTab} onSelect={(id) => { setActiveTab(id); setEditingItem(null); }} /></div>}
            </>
          )}
        </div>

        {/* BUSCA OPERACIONAL */}
        <div className={`transition-all duration-500 overflow-hidden ${(isSearchVisible && isNavVisible && !editingItem) ? 'max-h-24 opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="relative group"><Search size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" /><input type="text" placeholder={`Pesquisar...`} className="w-full pl-18 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none focus:border-blue-600 font-bold shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        </div>

        {/* CONTEÚDO DINÂMICO */}
        <div className="transition-all duration-500">
          {isUserVisible ? (
            <div className="animate-in zoom-in-95 fade-in duration-700 space-y-12"><section className="bg-white border-2 border-slate-100 rounded-[4rem] p-12 shadow-xl shadow-slate-200/20"><SectionHeader title="Gestor Responsável" colorClass="bg-blue-600" hideAdd={true} /><div className="flex flex-col md:flex-row gap-12 items-start"><div className="w-48 h-48 rounded-[3.5rem] bg-slate-50 border-4 border-white shadow-lg flex items-center justify-center"><UserCircle size={100} className="text-blue-100" /></div><div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4"><input type="text" defaultValue="Gestor Principal" className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none font-bold shadow-sm" /><input type="email" defaultValue="diretoria@escoladigital.pro" className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none font-bold shadow-sm" /></div></div></section></div>
          ) : isNavVisible ? (
            <div className="animate-in fade-in duration-700 space-y-12">
              {editingItem ? (
                <ItemForm 
                  item={editingItem} 
                  context={institutionTabs.find(t => t.id === instSubTab)?.label || activeTab}
                  onSave={handleSaveItem} 
                  onCancel={() => setEditingItem(null)} 
                />
              ) : (
                <section>
                  <SectionHeader 
                    title={activeModule === 'instituicao' ? institutionTabs.find(t => t.id === instSubTab)?.label : activeTab} 
                    colorClass={activeModule === 'instituicao' ? "bg-blue-600" : "bg-emerald-600"}
                    onAdd={handleStartAdd} 
                    subtitle={`Gestão centralizada de ${instSubTab || activeTab}`}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeModule === 'instituicao' && instSubTab === 'infraestrutura' && getFilteredItems(infraItems).map(i => <DataCard key={i.id} item={i} colorClass="bg-emerald-500" onDelete={() => handleDeleteItem(i.id)} onEdit={() => setEditingItem(i)} />)}
                    {activeModule === 'instituicao' && instSubTab === 'gestor' && getFilteredItems(diretoria).map(i => <DataCard key={i.id} item={i} colorClass="bg-blue-600" onDelete={() => handleDeleteItem(i.id)} onEdit={() => setEditingItem(i)} />)}
                    {activeModule === 'instituicao' && instSubTab === 'responsaveis' && getFilteredItems(responsaveisInst).map(i => <DataCard key={i.id} item={i} colorClass="bg-blue-600" onDelete={() => handleDeleteItem(i.id)} onEdit={() => setEditingItem(i)} />)}
                    
                    <div onClick={handleStartAdd} className="aspect-[16/10] border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-300 transition-all cursor-pointer group bg-white/40"><Plus size={32} className="mb-2 group-hover:scale-125 transition-transform" /><p className="font-black uppercase text-[10px] tracking-widest">Adicionar {instSubTab || activeTab}</p></div>
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000 space-y-12"><div className="grid grid-cols-1 md:grid-cols-4 gap-6"><StatCard label="Censo 2026" value="62%" icon={Activity} colorClass="bg-blue-600" /><StatCard label="Matrículas" value="1.240" icon={Users} colorClass="bg-emerald-600" /><StatCard label="Docentes" value="32" icon={Briefcase} colorClass="bg-indigo-600" /><StatCard label="Sincronização" value="Ativa" icon={RefreshCcw} colorClass="bg-slate-900" /></div><div className="h-48 border-2 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center opacity-40 gap-4"><ClipboardCheck size={32} className="text-slate-200" /><p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Painel de Monitoramento Geral</p></div></div>
          )}
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default App;

