import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './Board.css'; 

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [
        { name: 'Client A', status: 'backlog' },
        { name: 'Client B', status: 'backlog' },
        { name: 'Client C', status: 'backlog' },
      ],
    };
    this.columns = {
      backlog: React.createRef(),
      'in-progress': React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    const drake = Dragula([
      this.columns.backlog.current,
      this.columns['in-progress'].current,
      this.columns.complete.current,
    ]);

    drake.on('drop', (el, target, source) => {
      const name = el.getAttribute('data-name');
      const newStatus = target.getAttribute('data-status');

      this.setState((prevState) => ({
        clients: prevState.clients.map((client) =>
          client.name === name ? { ...client, status: newStatus } : client
        ),
      }));
    });
  }

  renderCards(status) {
    const colorMap = {
      backlog: '#ffe0e0',
      'in-progress': '#fff3cd',
      complete: '#d4edda',
    };

    return this.state.clients
      .filter((client) => client.status === status)
      .map((client) => (
        <div
          key={client.name}
          data-name={client.name}
          className="card"
          style={{ backgroundColor: colorMap[status], padding: '10px', margin: '10px', borderRadius: '8px' }}
        >
          {client.name}
        </div>
      ));
  }

  render() {
    return (
      <div className="board-container" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {['backlog', 'in-progress', 'complete'].map((status) => (
          <div key={status} className="swimlane" style={{ flex: 1 }}>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'center' }}>{status.replace('-', ' ')}</h3>
            <div
              ref={this.columns[status]}
              data-status={status}
              className="card-container"
              style={{
                minHeight: '200px',
                backgroundColor: '#f0f0f0',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {this.renderCards(status)}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Board;
