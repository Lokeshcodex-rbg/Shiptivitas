// src/pages/ShippingRequests.jsx
import React, { useState, useEffect, useRef } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';

import SwimlaneColumn from '../components/SwimlaneColumn';
import TaskCard       from '../components/TaskCard';

// colours that match the ticket
const COLORS = { backlog: '#cccccc', progress: '#007bff', complete: '#28a745' };

const lanes = [
  { key: 'backlog',  title: 'Backlog',     color: COLORS.backlog  },
  { key: 'progress', title: 'In Progress', color: COLORS.progress },
  { key: 'complete', title: 'Complete',    color: COLORS.complete }
];

// TODO: replace with real data or fetch later
const initialTasks = [
  { id: '1', title: 'Order #1', status: 'backlog' },
  { id: '2', title: 'Order #2', status: 'backlog' }
];

const ShippingRequests = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const containersRef     = useRef([]);

  /* ---------- Drag-and-drop setup ---------- */
  useEffect(() => {
    const drake = dragula(containersRef.current);

    drake.on('drop', (el, target) => {
      const newStatus = target.dataset.status;
      const id        = el.dataset.id;

      setTasks(prev =>
        prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
      );
    });

    return () => drake.destroy();
  }, []);

  /* ---------- Render ---------- */
  return (
    <div className="row no-gutters">
      {lanes.map(({ key, title, color }, i) => (
        <SwimlaneColumn
          key={key}
          title={title}
          color={color}
          ref={node => {
            // save each column’s inner <div class="card-list"> for Dragula
            if (node) containersRef.current[i] = node.querySelector('.card-list');
          }}
          data-status={key}
        >
          {tasks
            .filter(t => t.status === key)
            .map(t => (
              <TaskCard
                key={t.id}
                task={t}
                draggable
                data-id={t.id}      // Dragula uses this id later
              />
            ))}
        </SwimlaneColumn>
      ))}
    </div>
  );
};

export default ShippingRequests;

