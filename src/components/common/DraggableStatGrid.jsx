import { useState } from "react";
import { GripVertical } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { usePersistedOrder } from "@/hooks/use-persisted-order";
import { cn } from "@/lib/utils";

/**
 * A grid of draggable stat cards that preserves user‑defined order in localStorage.
 * 
 * @param {Object} props
 * @param {string} props.storageKey - localStorage key for the order.
 * @param {Array<{ key: string, label: string, value: any, hint?: string }>} props.items - Cards to render.
 * @returns {JSX.Element}
 */
export function DraggableStatGrid({ storageKey, items }) {
    const defaultOrder = items.map((i) => i.key);
    const { order, moveToIndex } = usePersistedOrder(storageKey, defaultOrder);
    const [draggingKey, setDraggingKey] = useState(null);

    const itemsByKey = Object.fromEntries(items.map((i) => [i.key, i]));
    const orderedItems = order.map((key) => itemsByKey[key]).filter(Boolean);

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {orderedItems.map((item, index) => (
                <div
                    key={item.key}
                    draggable
                    onDragStart={() => setDraggingKey(item.key)}
                    onDragEnd={() => setDraggingKey(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (draggingKey && draggingKey !== item.key) moveToIndex(draggingKey, index);
                    }}
                    className={cn("group relative cursor-grab active:cursor-grabbing", draggingKey === item.key && "opacity-50")}
                >
                    <GripVertical className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60" />
                    <StatCard label={item.label} value={item.value} hint={item.hint} />
                </div>
            ))}
        </div>
    );
}