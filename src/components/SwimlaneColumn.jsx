import React from 'react';

const SwimlaneColumn = ({ title, color, children }) => (
  <div className="Swimlane-column col-md-4 px-1">
    <h5 className="text-center py-2" style={{ backgroundColor: color, color: '#fff' }}>
      {title}
    </h5>
    <div className="card-list">{children}</div>
  </div>
);

export default SwimlaneColumn;
