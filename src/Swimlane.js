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
    })
    
    // Determine the status based on the swimlane name
    let status = 'backlog';
    if (this.props.name === 'In Progress') {
      status = 'in-progress';
    } else if (this.props.name === 'Complete') {
      status = 'complete';
    }
    
    return (
      <div className="Swimlane-column">
        <div className="Swimlane-title">{this.props.name}</div>
        <div 
          className="Swimlane-dragColumn" 
          ref={this.props.dragulaRef}
          data-status={status}
        >
          {cards}
        </div>
      </div>);
  }

}
