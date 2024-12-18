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

const initialLeftItems: Item[] = [
  { id: 'item-1', label: 'First Item' },
  { id: 'item-2', label: 'Second Item' },
];

const initialRightItems: Item[] = [
  { id: 'item-3', label: 'Third Item' },
  { id: 'item-4', label: 'Fourth Item' },
];

function ListExample() {
  const [leftItems, setLeftItems] = useState(initialLeftItems);
  const [rightItems, setRightItems] = useState(initialRightItems);

  const setupDropTarget = (
    containerId: string,
    setTargetItems: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    return dropTargetForElements({
      element: document.getElementById(containerId)!,
      getData: () => ({ containerId }),
      onDrop({ source }) {
        const sourceId = source.data.itemId;
        if (!sourceId) return;

        const newItem = { id: sourceId, label: `Moved ${sourceId}` };

        setTargetItems((prev) => {
          if (prev.some((item) => item.id === sourceId)) return prev;
          return [...prev, newItem];
        });
      },
    });
  };

  useEffect(() => {
    const cleanupLeft = setupDropTarget('left-column', setLeftItems);
    const cleanupRight = setupDropTarget('right-column', setRightItems);

    return () => {
      cleanupLeft();
      cleanupRight();
    };
  }, [leftItems, rightItems]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>List Example Six - Drag and Drop</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Column title="Left Column" id="left-column" items={leftItems} />
        <Column title="Right Column" id="right-column" items={rightItems} />
      </div>
    </div>
  );
}

function Column({
  title,
  id,
  items,
}: {
  title: string;
  id: string;
  items: Item[];
}) {
  return (
    <div
      id={id}
      style={{
        flex: 1,
        padding: '10px',
        background: '#f8f8f8',
        border: '1px solid #ccc',
        borderRadius: '5px',
        minHeight: '150px',
      }}
    >
      <h2>{title} - Items: {items.length}</h2>
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

    draggable({
      element,
      getInitialData: () => ({ itemId: item.id }),
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

export default ListExample;

