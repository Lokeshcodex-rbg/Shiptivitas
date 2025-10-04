import React from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients,
        'in-progress': [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      'in-progress': React.createRef(),
      complete: React.createRef(),
    }
    this.drake = null;
  }
  getClients() {
    return [
      {id: '1', name: 'Stark, White and Abbott', description: 'Cloned Optimal Architecture', status: 'backlog'},
      {id: '2', name: 'Wiza LLC', description: 'Exclusive Bandwidth-Monitored Implementation', status: 'backlog'},
      {id: '3', name: 'Nolan LLC', description: 'Vision-Oriented 4Thgeneration Graphicaluserinterface', status: 'backlog'},
      {id: '4', name: 'Thompson PLC', description: 'Streamlined Regional Knowledgeuser', status: 'backlog'},
      {id: '5', name: 'Walker-Williamson', description: 'Team-Oriented 6Thgeneration Matrix', status: 'backlog'},
      {id: '6', name: 'Boehm and Sons', description: 'Automated Systematic Paradigm', status: 'backlog'},
      {id: '7', name: 'Runolfsson, Hegmann and Block', description: 'Integrated Transitional Strategy', status: 'backlog'},
      {id: '8', name: 'Schumm-Labadie', description: 'Operative Heuristic Challenge', status: 'backlog'},
      {id: '9', name: 'Kohler Group', description: 'Re-Contextualized Multi-Tasking Attitude', status: 'backlog'},
      {id: '10', name: 'Romaguera Inc', description: 'Managed Foreground Toolset', status: 'backlog'},
      {id: '11', name: 'Reilly-King', description: 'Future-Proofed Interactive Toolset', status: 'backlog'},
      {id: '12', name: 'Emard, Champlin and Runolfsdottir', description: 'Devolved Needs-Based Capability', status: 'backlog'},
      {id: '13', name: 'Fritsch, Cronin and Wolff', description: 'Open-Source 3Rdgeneration Website', status: 'backlog'},
      {id: '14', name: 'Borer LLC', description: 'Profit-Focused Incremental Orchestration', status: 'backlog'},
      {id: '15', name: 'Emmerich-Ankunding', description: 'User-Centric Stable Extranet', status: 'backlog'},
      {id: '16', name: 'Willms-Abbott', description: 'Progressive Bandwidth-Monitored Access', status: 'backlog'},
      {id: '17', name: 'Brekke PLC', description: 'Intuitive User-Facing Customerloyalty', status: 'backlog'},
      {id: '18', name: 'Bins, Toy and Klocko', description: 'Integrated Assymetric Software', status: 'backlog'},
      {id: '19', name: 'Hodkiewicz-Hayes', description: 'Programmable Systematic Securedline', status: 'backlog'},
      {id: '20', name: 'Murphy, Lang and Ferry', description: 'Organized Explicit Access', status: 'backlog'},
    ];
  }
  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes['in-progress'].current,
      this.swimlanes.complete.current,
    ].filter(Boolean);

    this.drake = dragula(containers, {
      copy: false,
      moves: function (el, source) {
        return true;
      },
    });
    this.drake.on('drop', (el, target, source, sibling) => {
      if (!target) return;
      const newStatus = target.getAttribute('data-status');
      if (!newStatus) return;
      const cardId = el.getAttribute('data-id');
      if (source !== target) {
        source.appendChild(el);
      }
      setTimeout(() => {
        this.updateCardStatus(cardId, newStatus, sibling);
      }, 0);
    });
  }
  updateCardStatus(cardId, newStatus, sibling) {
    this.setState(prevState => {
      const oldStatus = Object.keys(prevState.clients).find(status => 
        prevState.clients[status].some(c => c.id === cardId)
      );
      if (!oldStatus) return prevState;
      let targetList = [...prevState.clients[newStatus]];
      let oldList = null;
      let card;
      if (oldStatus !== newStatus) {
        oldList = [...prevState.clients[oldStatus]];
        const cardIndex = oldList.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
          card = { ...oldList[cardIndex], status: newStatus };
          oldList.splice(cardIndex, 1);
        } else {
          return prevState;
        }
      } else {
        const cardIndex = targetList.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
          card = { ...targetList[cardIndex], status: newStatus };
          targetList.splice(cardIndex, 1);
        } else {
          return prevState;
        }
      }
      let insertIndex = targetList.length;
      if (sibling) {
        const siblingId = sibling.getAttribute('data-id');
        if (siblingId) {
          insertIndex = targetList.findIndex(c => c.id === siblingId);
          if (insertIndex === -1) {
            insertIndex = targetList.length;
          }
        }
      }
      targetList.splice(insertIndex, 0, card);
      const newClients = { ...prevState.clients };
      newClients[newStatus] = targetList;
      if (oldStatus !== newStatus && oldList) {
        newClients[oldStatus] = oldList;
      }
      return { clients: newClients };
    });
  }
  renderSwimlane(name, clients, ref) {
    let statusKey;
    if (name === 'Backlog') statusKey = 'backlog';
    else if (name === 'In-Progress') statusKey = 'in-progress';
    else if (name === 'Complete') statusKey = 'complete';
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref} statusKey={statusKey} />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In-Progress', this.state.clients['in-progress'], this.swimlanes['in-progress'])}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }

 componentWillUnmount() {
    if (this.drake) {
      try {
        this.drake.destroy();
      } catch (error) {
        console.error('Error destroying dragula:', error);
      }
    }
  }
}