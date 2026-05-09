'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ClientDetails, DubbingRow, InvoiceData } from '../types';
import { usePDF } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { format } from 'date-fns';

const CLIENT_PRESETS: Record<string, ClientDetails> = {
  subhash: {
    name: "Subhash Studios Private Limited",
    address: "201, Nimbus Centre, Plot Number 69\nOberoi Complex, Near Laxmi Industrial Estate\nAndheri West, Mumbai-53",
    contact: "9930405505",
    gst: "27AABCS1126R1Z3"
  },
  zibanka: {
    name: "Zibanka Media Services Private Limited",
    address: "Unit no. 21, 2nd floor, Techniplex Towers 1\nNext to Witty International school, Pawan Baug\nGoregaon West, Mumbai-64",
    contact: "",
    gst: ""
  }
};

export const InvoiceForm = () => {
  const [client, setClient] = useState<ClientDetails>({ name: '', contact: '', address: '', gst: '' });
  const [clientPreset, setClientPreset] = useState<string>('new');
  
  const [rows, setRows] = useState<DubbingRow[]>([
    { id: crypto.randomUUID(), date: '', seriesName: '', characters: '', director: '', episodes: '', amount: '' }
  ]);

  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedClient = localStorage.getItem('invoice_client');
    const savedRows = localStorage.getItem('invoice_rows');
    const savedPreset = localStorage.getItem('invoice_preset');
    
    if (savedClient) setClient(JSON.parse(savedClient));
    if (savedRows) setRows(JSON.parse(savedRows));
    if (savedPreset) setClientPreset(savedPreset);
    
    setMounted(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('invoice_client', JSON.stringify(client));
      localStorage.setItem('invoice_rows', JSON.stringify(rows));
      localStorage.setItem('invoice_preset', clientPreset);
    }
  }, [client, rows, clientPreset, mounted]);

  const handleClientPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setClientPreset(val);
    if (CLIENT_PRESETS[val]) {
      setClient(CLIENT_PRESETS[val]);
    } else {
      setClient({ name: '', contact: '', address: '', gst: '' });
    }
  };

  const addRow = () => {
    setRows([...rows, { id: crypto.randomUUID(), date: '', seriesName: '', characters: '', director: '', episodes: '', amount: '' }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof DubbingRow, value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const total = rows.reduce((sum, r) => {
    const amt = parseFloat(r.amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd-MM-yyyy');
    } catch {
      return dateStr;
    }
  };

  const invoiceData: InvoiceData = {
    invoiceDate: format(new Date(), 'dd-MM-yyyy'),
    client,
    total,
    rows: rows.map(r => ({
      ...r,
      date: getFormattedDate(r.date)
    }))
  };

  const [instance, updateInstance] = usePDF({ document: <InvoicePDF data={invoiceData} /> });

  useEffect(() => {
    updateInstance(<InvoicePDF data={invoiceData} />);
  }, [client, rows, updateInstance]);

  const isFormValid = client.name.trim() !== '';

  const handleGenerate = () => {
    if (instance.url) {
      const link = document.createElement('a');
      link.href = instance.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      // On iOS, sometimes we need to add the link to the DOM
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (instance.blob) {
      if (navigator.share) {
        try {
          const file = new File([instance.blob], 'jullie-devaani-invoice.pdf', { type: 'application/pdf' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Invoice',
            });
          } else {
            handleGenerate();
          }
        } catch (err) {
          console.error('Error sharing:', err);
          handleGenerate();
        }
      } else {
        handleGenerate();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Client Section */}
      <section className="glass rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-medium tracking-tight">
          client details
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">choose preset</label>
            <select 
              value={clientPreset}
              onChange={handleClientPreset}
              className="glass-select w-full p-3 rounded-lg text-sm text-white"
            >
              <option value="new" className="bg-[#0a0a0a]">new client</option>
              <option value="subhash" className="bg-[#0a0a0a]">subhash studios private limited</option>
              <option value="zibanka" className="bg-[#0a0a0a]">zibanka media services private limited</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={client.name}
                onChange={e => setClient({...client, name: e.target.value})}
                className={`glass-input w-full p-3 rounded-lg text-sm text-white placeholder-white/20 ${!client.name ? 'border-red-500/50' : ''}`}
                placeholder="company name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">contact</label>
              <input 
                type="text" 
                value={client.contact}
                onChange={e => setClient({...client, contact: e.target.value})}
                className="glass-input w-full p-3 rounded-lg text-sm text-white placeholder-white/20"
                placeholder="phone number"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">address</label>
              <textarea 
                value={client.address}
                onChange={e => setClient({...client, address: e.target.value})}
                rows={3}
                className="glass-input w-full p-3 rounded-lg text-sm text-white placeholder-white/20 resize-none"
                placeholder="full address"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">gstin</label>
              <input 
                type="text" 
                value={client.gst}
                onChange={e => setClient({...client, gst: e.target.value})}
                className="glass-input w-full p-3 rounded-lg text-sm text-white placeholder-white/20"
                placeholder="gst number"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="glass rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-medium tracking-tight">
          project details
        </h2>

        <div className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id} className="relative bg-black/20 border border-white/5 rounded-xl p-4 sm:p-6 pb-6">
              {rows.length > 1 && (
                <button 
                  onClick={() => removeRow(row.id)}
                  className="absolute top-4 right-4 text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <div className="grid grid-cols-1 gap-4 mt-2 sm:mt-0">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">date</label>
                  <input 
                    type="date" 
                    value={row.date}
                    onChange={e => updateRow(row.id, 'date', e.target.value)}
                    className="glass-input w-full p-2.5 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">series/movie</label>
                  <input 
                    type="text" 
                    value={row.seriesName}
                    onChange={e => updateRow(row.id, 'seriesName', e.target.value)}
                    className="glass-input w-full p-2.5 rounded-lg text-sm text-white placeholder-white/20"
                    placeholder="project name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">characters</label>
                  <input 
                    type="text" 
                    value={row.characters}
                    onChange={e => updateRow(row.id, 'characters', e.target.value)}
                    className="glass-input w-full p-2.5 rounded-lg text-sm text-white placeholder-white/20"
                    placeholder="voiced characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">director</label>
                  <input 
                    type="text" 
                    value={row.director}
                    onChange={e => updateRow(row.id, 'director', e.target.value)}
                    className="glass-input w-full p-2.5 rounded-lg text-sm text-white placeholder-white/20"
                    placeholder="director name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">episode(s)</label>
                  <input 
                    type="text" 
                    value={row.episodes}
                    onChange={e => updateRow(row.id, 'episodes', e.target.value)}
                    className="glass-input w-full p-2.5 rounded-lg text-sm text-white placeholder-white/20"
                    placeholder="e.g. 1-5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 tracking-wider">amount (₹)</label>
                  <input 
                    type="number" 
                    value={row.amount}
                    onChange={e => updateRow(row.id, 'amount', e.target.value)}
                    className="glass-input w-full p-2.5 rounded-lg text-sm text-white placeholder-white/20"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addRow}
          className="flex items-center justify-center w-full py-4 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
          title="Add Another Dubbing Session"
        >
          <Plus size={20} />
        </button>
      </section>

      {/* Action Button */}
      <div className="flex justify-center mt-8">
        {mounted && isFormValid ? (
          <>
            <button
              onClick={handleShare}
              disabled={instance.loading}
              className="sm:hidden flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-medium disabled:opacity-50"
            >
              {instance.loading ? 'preparing pdf...' : 'share invoice'}
            </button>
            <button
              onClick={handleGenerate}
              disabled={instance.loading}
              className="hidden sm:flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-medium disabled:opacity-50"
            >
              {instance.loading ? 'preparing pdf...' : 'generate invoice'}
            </button>
          </>
        ) : (
          <>
            <button 
              disabled
              className="sm:hidden flex items-center gap-2 bg-white/10 text-white/30 cursor-not-allowed px-8 py-4 rounded-xl font-medium"
            >
              share invoice
            </button>
            <button 
              disabled
              className="hidden sm:flex items-center gap-2 bg-white/10 text-white/30 cursor-not-allowed px-8 py-4 rounded-xl font-medium"
              title="please fill in company name and all required date fields"
            >
              generate invoice
            </button>
          </>
        )}
      </div>
    </div>
  );
};
