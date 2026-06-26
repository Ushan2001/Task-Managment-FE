import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs select-none">
      <div className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl flex items-center justify-center shrink-0 bg-[#FFEBEA] text-brand">
            <AlertCircle size={24} className="stroke-[2.5]" />
          </div>
          <h3 className="font-bold text-[18px] text-[#1e293b] font-sans">{title}</h3>
        </div>
        <p className="text-[13.5px] text-[#64748b] font-sans leading-relaxed">{description}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs font-sans cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-white font-bold rounded-xl text-xs font-sans cursor-pointer transition-transform hover:-translate-y-px active:translate-y-0 bg-brand shadow-[0_4px_12px_rgba(255,80,45,0.25)] hover:bg-[#e04324]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
