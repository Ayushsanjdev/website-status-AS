import { useEffect, useRef, useState } from 'react';
import styles from './select.module.scss';
import { SelectOption, SelectProps } from '@/types/Select';

export function Select({ value, onChange, options }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    function selectOption(option: SelectOption) {
        if (option !== value) onChange(option);
    }

    function isOptionSelected(option: SelectOption) {
        return option === value;
    }

    // Accessiblity
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return;
            switch (e.code) {
                case 'Enter':
                case 'Space':
                    setIsOpen((prev) => !prev);
                    if (isOpen) selectOption(options[highlightedIndex]);
                    break;
                case 'ArrowUp':
                case 'ArrowDown': {
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }

                    const newValue =
                        highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue);
                    }
                    break;
                }
                case 'Escape':
                    setIsOpen(false);
                    break;
            }
        };
        containerRef.current?.addEventListener('keydown', handler);

        return () => {
            containerRef.current?.removeEventListener('keydown', handler);
        };
    }, [isOpen, highlightedIndex, options]);

    return (
        <div
            ref={containerRef}
            onBlur={() => setIsOpen(false)}
            onClick={() => setIsOpen((prev) => !prev)}
            tabIndex={0}
            className={styles.container}
        >
            <span className={styles.value}>{value?.label}</span>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
                {options.map((option, index) => (
                    <li
                        onClick={(e) => {
                            e.stopPropagation();
                            selectOption(option);
                            setIsOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        key={option.value}
                        className={`${styles.option} ${
                            isOptionSelected(option) ? styles.selected : ''
                        } ${
                            index === highlightedIndex ? styles.highlighted : ''
                        }`}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
