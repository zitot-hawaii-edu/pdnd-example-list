// Updated ListExampleSix with Item Counter and Fixed Empty Column Drop

import React, { useState, useRef, useEffect } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import {
  extractClosestEdge,
  attachClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

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
  const [highlight, setHighlight] = useState<{ id: string; edge: Edge | null } | null>(null);

  const setupDropTarget = (containerId: string, setTargetItems: React.Dispatch<React.SetStateAction<Item[]>>) => {
    return dropTargetForElements({
      element: document.getElementById(containerId)!,
      getData: () => ({ containerId }),

      onDrop({ source, location }) {
        const sourceId = source.data.itemId;
        const target = location.current.dropTargets[0]?.data;

        if (!sourceId || !target || target.containerId !== containerId) return;

        setTargetItems((prev) => {
          if (prev.find((item) => item.id === sourceId)) return prev;
          const newItem = { id: sourceId, label: `New Item ${sourceId}` };
          return [...prev, newItem];
        });
        setHighlight(null);
      },

      onDrag({ self, location }) {
        const target = location.current.dropTargets[0]?.data;
        if (target?.containerId === containerId) {
          setHighlight({ id: containerId, edge: null });
        }
      },

      onDragLeave() {
        setHighlight(null);
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
      <h1>List Example Six - Drag and Drop with Edge Highlight</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Column
          title="Left Column"
          id="left-column"
          items={leftItems}
          highlight={highlight}
        />
        <Column
          title="Right Column"
          id="right-column"
          items={rightItems}
          highlight={highlight}
        />
      </div>
    </div>
  );
}

function Column({
  title,
  id,
  items,
  highlight,
}: {
  title: string;
  id: string;
  items: Item[];
  highlight: { id: string; edge: Edge | null } | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isHighlighted = highlight?.id === id;

  return (
    <div
      ref={ref}
      id={id}
      style={{
        flex: 1,
        padding: '10px',
        background: isHighlighted ? '#e0ffe0' : '#f8f8f8',
        border: '1px solid #ccc',
        borderRadius: '5px',
        minHeight: '150px',
      }}
    >
      <h2>{title} - Items: {items.length}</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} highlight={highlight} />
        ))}
      </ul>
    </div>
  );
}

function DraggableItem({
  item,
  highlight,
}: {
  item: Item;
  highlight: { id: string; edge: Edge | null } | null;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    draggable({
      element,
      getInitialData: () => ({
        itemId: item.id,
      }),
    });
  }, [item]);

  const isHighlighted = highlight?.id === item.id;
  const highlightStyle = isHighlighted && highlight?.edge ? {
    boxShadow:
      highlight.edge === 'top'
        ? '0 -4px 0 0 blue inset'
        : highlight.edge === 'bottom'
        ? '0 4px 0 0 blue inset'
        : highlight.edge === 'left'
        ? '-4px 0 0 0 green inset'
        : '4px 0 0 0 green inset',
  } : {};

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
        ...highlightStyle,
      }}
    >
      {item.label}
    </li>
  );
}

export default ListExample;

