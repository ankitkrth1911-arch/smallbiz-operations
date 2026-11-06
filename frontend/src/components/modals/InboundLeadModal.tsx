import React, { useState } from 'react';
import { X, Sparkles, Building2, Package, Hash, DollarSign, Clock, Send, CheckCircle2 } from 'lucide-react';
import { InquiryCreateRequest } from '../../services/inquiryApi';

interface InboundLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: InquiryCreateRequest) => Promise<any>;
}

export const InboundLeadModal: React.FC<InboundLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [business, setBusiness] = useState('College merchandise supplier');
  const [product, setProduct] = useState('Customised T-shirts');
  const [quantity, setQuantity] = useState('50');
  const [budget, setBudget] = useState('₹15,000');
  const [delivery, setDelivery] = useState('10 days');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        client: business,
        business,
        product,
        quantity: parseInt(quantity, 10) || quantity,
        budget,
        budgetRange: budget,
        delivery,
        timeline: `${delivery} Turnaround`,
        sourceType: 'Inbound Portal Form',
        keyItems: [
          `Product: ${product}`,
          `Batch Size: ${quantity} units`,
          `Target Budget: ${budget}`,
          `Delivery Window: ${delivery}`,
          'Quality: 100% Bio-washed combed cotton with chest screen-print',
        ],
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyPreset = (type: 'college' | 'apex') => {
    if (type === 'college') {
      setBusiness('College merchandise supplier');
      setProduct('Customised T-shirts');
      setQuantity('50');
      setBudget('₹15,000');
      setDelivery('10 days');
    } else {
      setBusiness('Apex Logistics Global');
      setProduct('SAP Inventory Sync Bridge');
      setQuantity('1');
      setBudget('$29,500');
      setDelivery('6 Weeks');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1430]/80 backdrop-blur-md animate-fade-in select-none">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[rgba(10,14,26,0.92)] border border-[rgba(170,182,208,0.25)] rounded-xl shadow-2xl z-10 overflow-hidden text-[#E8EEFF] font-sans backdrop-blur-md">
        {/* Header */}
        <div className="p-4 border-b border-[rgba(170,182,208,0.18)] bg-[#141A2A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[rgba(255,217,138,0.15)] border border-[rgba(255,217,138,0.3)] flex items-center justify-center text-[#FFD98A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8EEFF] font-mono uppercase tracking-wider">
                Ingest Inbound Lead / RFP
              </h3>
              <p className="text-[11px] text-[#9FB0D4]">
                Dispatches to Research Agent & triggers SQLite persistence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-4 pt-3 flex items-center gap-2 text-[10px] font-mono">
          <span className="text-[#9FB0D4]">PRESETS:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('college')}
            className="px-2 py-0.5 rounded bg-[rgba(255,217,138,0.15)] border border-[rgba(255,217,138,0.3)] text-[#FFD98A] hover:bg-[rgba(255,217,138,0.25)] transition-all font-semibold"
          >
            College Merch (T-Shirts)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('apex')}
            className="px-2 py-0.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.2)] text-[#C8D4F0] hover:border-[#FFD98A]/50 transition-all"
          >
            Apex Logistics (SAP Sync)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-[10px] font-mono text-[#9FB0D4] uppercase mb-1">
              Business / Client Name
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-[#7A96C0] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.22)] text-xs text-[#E8EEFF] focus:outline-none focus:border-[#FFD98A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[#9FB0D4] uppercase mb-1">
                Product / Scope
              </label>
              <div className="relative">
                <Package className="w-3.5 h-3.5 text-[#7A96C0] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.22)] text-xs text-[#E8EEFF] focus:outline-none focus:border-[#FFD98A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#9FB0D4] uppercase mb-1">
                Quantity (Units)
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-[#7A96C0] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.22)] text-xs text-[#E8EEFF] font-mono focus:outline-none focus:border-[#FFD98A]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[#9FB0D4] uppercase mb-1">
                Budget
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-[#7A96C0] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.22)] text-xs text-[#E8EEFF] font-mono focus:outline-none focus:border-[#FFD98A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#9FB0D4] uppercase mb-1">
                Delivery Timeline
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-[#7A96C0] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.22)] text-xs text-[#E8EEFF] focus:outline-none focus:border-[#FFD98A]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[rgba(170,182,208,0.18)]">
            <div className="text-[10px] font-mono text-[#9FB0D4]">
              Endpoint: <span className="text-[#C8D4F0]">POST /api/inquiries</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#FFD98A] hover:bg-[#FFE7AB] text-[#14182A] text-xs font-semibold font-mono transition-all shadow-sm disabled:opacity-50"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14182A]" />
                  <span>Persisted to SQLite!</span>
                </>
              ) : submitting ? (
                <span>Ingesting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InboundLeadModal;
