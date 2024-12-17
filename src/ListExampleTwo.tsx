import React, { useState, useRef, useEffect } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';

type Item = {
  id: string;
  label: string;
};

const initialItems: Item[] = [
  { id: 'item-1', label: 'First Item' },
  { id: 'item-2', label: 'Second Item' },
  { id: 'item-3', label: 'Third Item' },
];

function ListExampleTwo() {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const dropTargetCleanup = dropTargetForElements({
      element: document.getElementById('list-container')!,
      getData({ input }) {
        const closest = document.elementFromPoint(input.clientX, input.clientY);
        const itemId = closest?.getAttribute('data-id');
        return { itemId };
      },
      onDrop({ source, location }) {
        const sourceId = source.data.itemId;
        const targetId = location.current.dropTargets[0]?.data.itemId;

        if (!sourceId || !targetId || sourceId === targetId) return;

        const startIndex = items.findIndex((item) => item.id === sourceId);
        const finishIndex = items.findIndex((item) => item.id === targetId);

        setItems((prevItems) =>
          reorder({
            list: prevItems,
            startIndex,
            finishIndex,
          })
        );
      },
    });

    return () => dropTargetCleanup(); // Cleanup
  }, [items]);

  return (
    <div
      id="list-container"
      style={{
        padding: '20px',
        maxWidth: '400px',
        margin: 'auto',
        border: '1px solid #ccc',
      }}
    >
      <h1>Reorderable List</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function DraggableItem({ item }: { item: Item }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Make element draggable
    return draggable({
      element,
      getInitialData: () => ({
        itemId: item.id,
      }),
    });
  }, [item]);

  return (
    <li
      ref={ref}
      data-id={item.id}
      style={{
        padding: '10px',
        margin: '5px 0',
        background: '#cce7ff',
        border: '1px solid #0044cc',
        borderRadius: '5px',
        cursor: 'grab',
      }}
    >
      {item.label}
    </li>
  );
}

export default ListExampleTwo;

