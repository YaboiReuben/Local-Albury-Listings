
import React from 'react';
import { POSTING_RULES } from '../constants';

interface RulesModalProps {
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📋 Website Posting Rules</h2>
            <p className="text-sm text-gray-500 mt-1">Please read carefully before submitting.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-gray-400">✕</button>
        </div>
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POSTING_RULES.map((rule, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                <span className="text-blue-600 font-bold"># {i + 1}</span>
                {rule}
              </li>
            ))}
          </ul>
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-800 leading-relaxed">
            Note: Local Albury Listing reserves the right to remove any listing that violates these rules or misrepresents a business. Free listings automatically expire after 48 hours. Paid tiers are non-refundable.
          </div>
        </div>
        <div className="p-8 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
