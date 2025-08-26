import React, { useEffect, useRef, useState } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './shipping.css';

// Alle Tasks starten im Backlog
const initialTasks = [
  { id: 't1', title: 'Validate address field', status: 'backlog' },
  { id: 't2', title: 'Add SSL badge', status: 'backlog' },
  { id: 't3', title: 'Progress bar stepper', status: 'backlog' },
];

export default function ShippingRequests() {
  // ⬇️ Immer mit Backlog starten (ignoriert evtl. alten Speicherstand)
  const [tasks, setTasks] = useState(initialTasks);

  const backlogRef  = useRef(null);
  const progressRef = useRef(null);
  const doneRef     = useRef(null);

  const laneOf = (container) => {
    if (!container) return null;
    if (container === backlogRef.current)  return 'backlog';
    if (container === progressRef.current) return 'progress';
    if (container === doneRef.current)     return 'done';
    return null;
  };

  const applyMove = (id, sourceLane, targetLane, siblingId) => {
    const lists = {
      backlog:  tasks.filter(t => t.status === 'backlog'),
      progress: tasks.filter(t => t.status === 'progress'),
      done:     tasks.filter(t => t.status === 'done'),
    };

    let moved = null;
    lists[sourceLane] = lists[sourceLane].filter(t => {
      if (t.id === id) { moved = t; return false; }
      return true;
    });
    if (!moved) return;

    const targetList = lists[targetLane] || [];
    let insertAt = targetList.length;
    if (siblingId) {
      const idx = targetList.findIndex(t => t.id === siblingId);
      if (idx >= 0) insertAt = idx;
    }

    targetList.splice(insertAt, 0, { ...moved, status: targetLane });
    setTasks([...lists.backlog, ...lists.progress, ...lists.done]);
  };

  useEffect(() => {
    const containers = [backlogRef.current, progressRef.current, doneRef.current].filter(Boolean);
    const drake = dragula(containers, { revertOnSpill: true, direction: 'vertical', copy: false });

    drake.on('drop', function (el, target, source, sibling) {
      try {
        const id = el && el.getAttribute ? el.getAttribute('data-id') : null;
        const srcLane = laneOf(source);
        const tgtLane = laneOf(target);
        const sibId = sibling && sibling.getAttribute ? sibling.getAttribute('data-id') : null;

        // Dragula-Änderung rückgängig machen → nur React rendert
        drake.cancel(true);

        if (id && srcLane && tgtLane) {
          setTimeout(() => applyMove(id, srcLane, tgtLane, sibId), 0);
        }
      } catch (e) { console.error('drop handler error:', e); }
    });

    return () => drake.destroy();
  }, [tasks]);

  // ⬇️ Beim ersten Mount den Startzustand bewusst als "Backlog-only" speichern
  useEffect(() => {
    try { localStorage.setItem('tasks', JSON.stringify(initialTasks)); } catch {}
  }, []);

  // ⬇️ Danach jede Änderung normal persistieren
  useEffect(() => {
    try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const renderCard = (t) => (
    <div key={t.id} className={'card ' + t.status} data-id={t.id} data-title={t.title}>
      {t.title}
    </div>
  );

  return (
    <div className="shipping-requests">
      <h2>Shipping Requests</h2>
      <div className="board">
        <div className="Swimlane-column">
          <h3>Backlog</h3>
          <div ref={backlogRef} className="lane lane-backlog">
            {tasks.filter(t => t.status === 'backlog').map(renderCard)}
          </div>
        </div>
        <div className="Swimlane-column">
          <h3>In Progress</h3>
          <div ref={progressRef} className="lane lane-progress">
            {tasks.filter(t => t.status === 'progress').map(renderCard)}
          </div>
        </div>
        <div className="Swimlane-column">
          <h3>Complete</h3>
          <div ref={doneRef} className="lane lane-done">
            {tasks.filter(t => t.status === 'done').map(renderCard)}
          </div>
        </div>
      </div>
    </div>
  );
}
