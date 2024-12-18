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

function ListExampleThree() {
  const [leftItems, setLeftItems] = useState(initialLeftItems);
  const [rightItems, setRightItems] = useState(initialRightItems);

  const setupDropTarget = (
    containerId: string,
    setItems: React.Dispatch<React.SetStateAction<Item[]>>,
    getItems: () => Item[]
  ) => {
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

        const sourceItems =
          leftItems.find((item) => item.id === sourceId) != null
            ? leftItems
            : rightItems;

        const targetItems = targetContainerId === 'left-column' ? leftItems : rightItems;
        const setTargetItems =
          targetContainerId === 'left-column' ? setLeftItems : setRightItems;

        const startIndex = sourceItems.findIndex((item) => item.id === sourceId);
        const finishIndex = targetId
          ? targetItems.findIndex((item) => item.id === targetId)
          : targetItems.length;

        if (sourceItems === targetItems && startIndex === finishIndex) return;

        setLeftItems(
          sourceItems === leftItems ? reorder({ list: leftItems, startIndex, finishIndex }) : leftItems
        );
        setRightItems(
          sourceItems === rightItems ? reorder({ list: rightItems, startIndex, finishIndex }) : rightItems
        );
      },
    });
  };

  useEffect(() => {
    const cleanupLeft = setupDropTarget('left-column', setLeftItems, () => leftItems);
    const cleanupRight = setupDropTarget('right-column', setRightItems, () => rightItems);

    return () => {
      cleanupLeft();
      cleanupRight();
    };
  }, [leftItems, rightItems]);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <Column title="Left Column" id="left-column" items={leftItems} />
      <Column title="Right Column" id="right-column" items={rightItems} />
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

export default ListExampleThree;

