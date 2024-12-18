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

function ListExampleFour() {
  const [leftItems, setLeftItems] = useState(initialLeftItems);
  const [rightItems, setRightItems] = useState(initialRightItems);

  const setupDropTarget = (containerId: string) => {
    return dropTargetForElements({
      element: document.getElementById(containerId)!,
      getData({ input }) {
        const closest = document.elementFromPoint(input.clientX, input.clientY);
        const itemId = closest?.getAttribute('data-id');
        return { itemId, containerId };
      },
      onDrop({ source, location }) {
        const sourceId = source.data.itemId;
        const targetId = location.current.dropTargets[0]?.data.itemId;
        const targetContainerId = location.current.dropTargets[0]?.data.containerId;

        if (!sourceId || !targetContainerId) return;

        const isSourceLeft = leftItems.some((item) => item.id === sourceId);
        const sourceItems = isSourceLeft ? leftItems : rightItems;
        const setSourceItems = isSourceLeft ? setLeftItems : setRightItems;

        const isTargetLeft = targetContainerId === 'left-column';
        const targetItems = isTargetLeft ? leftItems : rightItems;
        const setTargetItems = isTargetLeft ? setLeftItems : setRightItems;

        const startIndex = sourceItems.findIndex((item) => item.id === sourceId);
        const finishIndex = targetId
          ? targetItems.findIndex((item) => item.id === targetId)
          : targetItems.length;

        // If source and target are the same and indexes are the same, skip
        if (sourceItems === targetItems && startIndex === finishIndex) return;

        // Same-column move
        if (sourceItems === targetItems) {
          setTargetItems(
            reorder({
              list: targetItems,
              startIndex,
              finishIndex,
            })
          );
        } else {
          // Cross-column move
          setSourceItems(sourceItems.filter((item) => item.id !== sourceId));
          setTargetItems([
            ...targetItems.slice(0, finishIndex),
            sourceItems[startIndex],
            ...targetItems.slice(finishIndex),
          ]);
        }
      },
    });
  };

  useEffect(() => {
    const cleanupLeft = setupDropTarget('left-column');
    const cleanupRight = setupDropTarget('right-column');

    return () => {
      cleanupLeft();
      cleanupRight();
    };
  }, [leftItems, rightItems]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>List Example Four - Drag and Drop</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Column title="Left Column" id="left-column" items={leftItems} />
        <Column title="Right Column" id="right-column" items={rightItems} />
      </div>
    </div>
  );
}

function Column({ title, id, items }: { title: string; id: string; items: Item[] }) {
  return (
    <div
      id={id}
      style={{
        flex: 1,
        padding: '10px',
        background: '#f8f8f8',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      <h2>{title}</h2>
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

export default ListExampleFour;

