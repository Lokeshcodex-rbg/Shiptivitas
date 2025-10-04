import React from 'react';
import './Card.css';

export default class Card extends React.Component {
  render() {
    const statusClassMap = {
      'backlog': 'Card-grey',
      'in-progress': 'Card-blue',
      'complete': 'Card-green'
    };

    const statusClass = statusClassMap[this.props.status] || 'Card-grey';

    const finalClassName = `Card ${statusClass}`;

    return (
      <div className={finalClassName} data-id={this.props.id}>
        <div className="Card-title">{this.props.name}</div>
        <div className="Card-description">{this.props.description}</div>
      </div>
    );
  }
}