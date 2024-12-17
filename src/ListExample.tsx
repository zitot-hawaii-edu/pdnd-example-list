import React from 'react';

type Item = {
  id: string;
  label: string;
};

const defaultItems: Item[] = [
  { id: 'item-1', label: 'First Item' },
  { id: 'item-2', label: 'Second Item' },
  { id: 'item-3', label: 'Third Item' },
];

function ListExample() {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>Simple List</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {defaultItems.map((item) => (
          <li
            key={item.id}
            style={{
              padding: '10px',
              marginBottom: '5px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListExample;

