import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';
import DragulaContainer from './DragulaContainer';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'backlog'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'backlog'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'backlog'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'backlog'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'backlog'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'backlog'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref} getCardColorClass={this.getCardColorClass}/>
    );
  }

  updateClientStatus = (clientId, newStatus) => {
	  this.setState(prevState => {
		  let clientToMove = null
		  let updatedClients = {...prevState.clients}

		  Object.keys(updatedClients).forEach(status => {
			  const clientIndex = updatedClients[status].findIndex(client => client.id === clientId)
			  if (clientIndex !== -1) {
				  clientToMove = {...updatedClients[status][clientIndex], status: newStatus}
				  updatedClients[status] = updatedClients[status].filter(client => client.id !== clientId);
			  }
		  });

		  if (clientToMove) {
			  const targetLane = this.getSwimLaneName(newStatus)
			  updatedClients[targetLane] = [...updatedClients[targetLane], clientToMove]
		  }

		  return { clients: updatedClients };
	  });
  }


  getSwimLaneName = (status) => {
	  const mapping = {
		'backlog': 'backlog',
		'in-progress': 'inProgress',
		'complete': 'complete'
	  };
	  return mapping[status] || 'backlog'
  }

  getStatusFromRef = (ref) => {
	  if (ref === this.swimlanes.backlog.current) return 'backlog'
	  if (ref === this.swimlanes.inProgress.current) return 'in-progress'
	  if (ref === this.swimlanes.complete.current) return 'complete'

	  return 'backlog'
  }

  getCardColorClass = (status) => {
    const colorMap = {
      'backlog': 'Card-grey',
      'in-progress': 'Card-blue', 
      'complete': 'Card-green'
    };
    return colorMap[status] || 'Card-grey';
  }



  render() {
    return (
      <div className="Board">
	<DragulaContainer 
	    refs={this.swimlanes}  
	    onUpdateClientStatus={this.updateClientStatus}
	    getStatusFromRef={this.getStatusFromRef}
	/>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
