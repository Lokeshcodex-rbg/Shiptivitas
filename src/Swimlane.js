import React from 'react';
import Card from './Card';
import './Swimlane.css';

export default class Swimlane extends React.Component {
  render() {
    const cards = this.props.clients.map(client => {
      return (
        <Card
          key={client.id}
          id={client.id}
          name={client.name}
          description={client.description}
          status={client.status}
        />
      );
    });

    return (
      <div className="Swimlane-column">
        <div className="Swimlane-title">{this.props.name}</div>

        {/* 🔥 KEY CHANGE: Add data-lane for Dragula logic */}
        <div
          className="Swimlane-dragColumn"
          ref={this.props.dragulaRef}
          data-lane={this.props.laneKey} // "backlog", "in-progress", "complete"
        >
          {cards}
        </div>
      </div>
    );
  }
}
