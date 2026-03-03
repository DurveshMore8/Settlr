import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ options, value, onChange, className = '', icon: Icon, placeholder = 'Select an option' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = (() => {
        const selectedOpt = options.find(opt =>
            (typeof opt === 'object' ? opt.value : opt) === value
        );
        if (!selectedOpt) return placeholder;
        return typeof selectedOpt === 'object' ? selectedOpt.label : selectedOpt;
    })();

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className={`w-full flex items-center justify-between text-left transition-all ${className}`}
                onClick={() => {
                    if (!isOpen && dropdownRef.current) {
                        const rect = dropdownRef.current.getBoundingClientRect();
                        const spaceBelow = window.innerHeight - rect.bottom;
                        // Determine if there is less than 250px below
                        setOpenUpwards(spaceBelow < 250);
                    }
                    setIsOpen(!isOpen);
                }}
            >
                <div className="flex items-center gap-2 truncate">
                    {Icon && <Icon className="text-slate-500" size={20} />}
                    <span className="truncate">{selectedLabel}</span>
                </div>
                <ChevronDown size={18} className={`text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-[100] w-full glass-card !bg-navy-950/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden ${openUpwards ? 'bottom-full mb-2 origin-bottom animate-slide-up' : 'mt-2 origin-top animate-slide-down'
                    }`}>
                    <ul className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {options.map((opt, i) => {
                            const optValue = typeof opt === 'object' ? opt.value : opt;
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            const isSelected = value === optValue;

                            return (
                                <li key={i}>
                                    <button
                                        type="button"
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${isSelected
                                            ? 'bg-purple-500/20 text-purple-300'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                        onClick={() => {
                                            // Handle fake synthetic event structure for seamless replacement
                                            onChange({ target: { value: optValue } });
                                            setIsOpen(false);
                                        }}
                                    >
                                        {optLabel}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Select;
