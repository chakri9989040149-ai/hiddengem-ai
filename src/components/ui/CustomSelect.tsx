'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

interface CustomSelectProps {
  label?: string;
  value: string | number;
  onChange: (val: any) => void;
  options: (SelectOption | string | number)[];
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  name?: string;
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  className = '',
  id,
  disabled = false,
  name,
}: CustomSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Normalize options array into structured objects
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as SelectOption;
    }
    return {
      value: opt,
      label: String(opt),
    };
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const selectedIndex = normalizedOptions.findIndex(
    (opt) => String(opt.value) === String(value)
  );

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Keep highlighted index in sync with open/selected
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, selectedIndex]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (opt: SelectOption) => {
    if (disabled) return;
    onChange(opt.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
            handleSelect(normalizedOptions[highlightedIndex]);
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < normalizedOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : normalizedOptions.length - 1
          );
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-stone-700 dark:text-stone-300 uppercase font-black text-[11px] tracking-wider block mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={buttonRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 transition-all duration-200 select-none ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400'
            : isOpen
            ? 'bg-stone-50 dark:bg-stone-800 border-emerald-500 ring-2 ring-emerald-500/30 text-stone-900 dark:text-stone-50 shadow-md'
            : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-50 hover:border-emerald-500/50 shadow-sm'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <ChevronDown
          className={`w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-500' : ''
          }`}
        />
      </button>

      {/* Hidden native select for form compatibility */}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        {normalizedOptions.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Floating Options Dropdown Menu */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label={label || placeholder}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/95 dark:bg-stone-900/98 backdrop-blur-2xl shadow-2xl p-1.5 space-y-1 text-xs focus:outline-none"
        >
          {normalizedOptions.map((opt, index) => {
            const isSelected = String(opt.value) === String(value);
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2 transition-colors select-none ${
                  isSelected
                    ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-500/30'
                    : isHighlighted
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold'
                    : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <div>
                    <span className="block truncate">{opt.label}</span>
                    {opt.subtitle && (
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-normal">
                        {opt.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
