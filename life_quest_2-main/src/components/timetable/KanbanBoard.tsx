
'use client';

import React, { useState } from 'react';
import './kanban.css';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { Input } from '../ui/input';

export type KanbanCard = {
    id: string;
    title: string;
    description: string;
    difficulty: Task['difficulty'];
};

export type KanbanColumn = {
    id: string;
    title: string;
    cards: KanbanCard[];
};

export type KanbanData = {
    columns: KanbanColumn[];
}

interface KanbanBoardProps {
    data: KanbanData;
    className?: string;
    style?: React.CSSProperties;
}

const difficultyColors = {
    'Easy': 'border-green-500/50 bg-green-500/10',
    'Medium': 'border-orange-500/50 bg-orange-500/10',
    'Hard': 'border-red-500/50 bg-red-500/10',
    'N/A': 'border-gray-500/50 bg-gray-500/10'
};

const EditableCardTitle = ({ initialTitle, onSave }: { initialTitle: string, onSave: (newTitle: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (title.trim()) {
            onSave(title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setTitle(initialTitle);
            setIsEditing(false);
        }
    };

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="kanban-card-title-input"
            />
        );
    }

    return (
        <h4 className="kanban-card-title" onClick={() => setIsEditing(true)}>
            {title}
        </h4>
    );
};

function getDragAfterElement(container: Element, y: number) {
    const draggableElements = [...container.querySelectorAll('.kanban-card:not(.is-dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element as HTMLElement | null;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ data, className, style }) => {
    const [boardData, setBoardData] = useState(data);
    const [draggedItem, setDraggedItem] = useState<{ card: KanbanCard; fromColumnId: string, fromIndex: number } | null>(null);
    const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
    const [newCardTitle, setNewCardTitle] = useState('');

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: KanbanCard, fromColumnId: string, fromIndex: number) => {
        setDraggedItem({ card, fromColumnId, fromIndex });
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('is-dragging');
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget?.classList.remove('is-dragging');
        setDraggedItem(null);
        // Clear all drop indicators
        document.querySelectorAll('.kanban-drop-indicator').forEach(el => el.remove());
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const columnElement = e.currentTarget;
        const cardsContainer = columnElement.querySelector('.kanban-column-cards');
        if (!cardsContainer || !draggedItem) return;

        // Clear previous indicators
        document.querySelectorAll('.kanban-drop-indicator').forEach(el => el.remove());

        const dropIndicator = document.createElement('div');
        dropIndicator.className = 'kanban-drop-indicator';

        const afterElement = getDragAfterElement(cardsContainer, e.clientY);

        if (afterElement == null) {
            cardsContainer.appendChild(dropIndicator);
        } else {
            cardsContainer.insertBefore(dropIndicator, afterElement);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, toColumnId: string) => {
        e.preventDefault();
        if (!draggedItem) return;

        const { card, fromColumnId } = draggedItem;
        
        const columnElement = e.currentTarget;
        const cardsContainer = columnElement.querySelector('.kanban-column-cards');
        if (!cardsContainer) return;

        const afterElement = getDragAfterElement(cardsContainer, e.clientY);

        setBoardData(prevData => {
            const newColumns = [...prevData.columns];

            // Remove card from source column
            const fromColIndex = newColumns.findIndex(col => col.id === fromColumnId);
            if (fromColIndex === -1) return prevData;

            const fromCards = [...newColumns[fromColIndex].cards];
            fromCards.splice(draggedItem.fromIndex, 1);
            newColumns[fromColIndex] = { ...newColumns[fromColIndex], cards: fromCards };

            // Add card to destination column
            const toColIndex = newColumns.findIndex(col => col.id === toColumnId);
            if (toColIndex === -1) return prevData;

            const toCards = [...newColumns[toColIndex].cards];
            const dropIndex = afterElement
                ? toCards.findIndex(c => c.id === (afterElement as HTMLElement).dataset.cardId)
                : toCards.length;
            
            toCards.splice(dropIndex, 0, card);
            newColumns[toColIndex] = { ...newColumns[toColIndex], cards: toCards };

            return { columns: newColumns };
        });

        // Final cleanup on drop
        handleDragEnd(e);
    };

    const handleAddNewCard = (columnId: string) => {
        if (!newCardTitle.trim()) {
            setAddingToColumn(null);
            return;
        }

        const newCard: KanbanCard = {
            id: `card-${Date.now()}`,
            title: newCardTitle,
            description: '',
            difficulty: 'Easy'
        };

        setBoardData(prevData => {
            const newColumns = prevData.columns.map(col => {
                if (col.id === columnId) {
                    return {
                        ...col,
                        cards: [...col.cards, newCard]
                    };
                }
                return col;
            });
            return { columns: newColumns };
        });
        
        setNewCardTitle('');
        setAddingToColumn(null);
    };

    const handleCardTitleChange = (cardId: string, columnId: string, newTitle: string) => {
        setBoardData(prevData => {
            return {
                ...prevData,
                columns: prevData.columns.map(col => {
                    if (col.id === columnId) {
                        return {
                            ...col,
                            cards: col.cards.map(card => card.id === cardId ? {...card, title: newTitle} : card)
                        }
                    }
                    return col;
                })
            }
        });
    }

    return (
        <div className={cn("kanban-board", className)} style={style}>
            {boardData.columns.map(column => (
                <div 
                    key={column.id} 
                    className="kanban-column"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                >
                    <h3 className="kanban-column-title">{column.title} ({column.cards.length})</h3>
                    <div className="kanban-column-cards">
                        {column.cards.map((card, index) => (
                            <div 
                                key={card.id} 
                                className={cn("kanban-card", difficultyColors[card.difficulty])}
                                draggable
                                onDragStart={(e) => handleDragStart(e, card, column.id, index)}
                                onDragEnd={handleDragEnd}
                                data-card-id={card.id}
                            >
                                <EditableCardTitle 
                                    initialTitle={card.title} 
                                    onSave={(newTitle) => handleCardTitleChange(card.id, column.id, newTitle)}
                                />
                                <p className="kanban-card-description">{card.description}</p>
                            </div>
                        ))}
                    </div>
                     <div className="mt-auto pt-2">
                        {addingToColumn === column.id ? (
                            <div className="space-y-2">
                                <Input
                                    placeholder="New card title..."
                                    value={newCardTitle}
                                    onChange={e => setNewCardTitle(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddNewCard(column.id)}
                                    autoFocus
                                    className="h-8"
                                />
                                <div className="flex items-center gap-2">
                                    <Button size="sm" className="h-7" onClick={() => handleAddNewCard(column.id)}>Add</Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setAddingToColumn(null)}><X className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ) : (
                            <Button variant="ghost" className="w-full justify-start text-sm h-8" onClick={() => { setAddingToColumn(column.id); setNewCardTitle('')}}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add a card
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
