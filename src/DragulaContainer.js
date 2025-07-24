import React, { useEffect } from 'react';
import dragula from 'dragula';

export default function DragulaContainer({ refs, onUpdateClientStatus, getStatusFromRef }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const containers = Object.values(refs)
        .map(ref => ref.current)
        .filter(container => container !== null);
      
      if (containers.length > 0) {
        const drake = dragula(containers, {
	  revertOnSpill: true,	
          moves: function (el, container, handle) {
            return true;
          },
          accepts: function (el, target, source, sibling) {
            return true;
          }
        });

	

        drake.on('drop', function (el, target, source, sibling) {
          console.log('Card dropped:', el, 'from:', source, 'to:', target);
	  if (target !== source) {
		  const clientId = el.getAttribute('data-client-id')

		  const newStatus = getStatusFromRef(target)

		  if (clientId && newStatus) {

			  drake.cancel(true);	

			  onUpdateClientStatus(clientId, newStatus);
		  }
	  }
        });

        return () => {
          drake.destroy();
        };
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [refs, onUpdateClientStatus, getStatusFromRef]);

  return null;
}
