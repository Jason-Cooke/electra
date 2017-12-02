import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import moment from 'moment';

import styles from '../css/eventslist.css';

// Use named export for unconnected component for jest
//export
class EventsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fsEvents: [],
      fsEffectiveEvents: []
    }

    this.badgeStyle = {
        float: 'right'
    }
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.fsEvent ) {

      const fsEvent = nextProps.fsEvent;

      this.setState( prevState => ({
        fsEvents: [...this.state.fsEvents, {
                        eventType: fsEvent.eventType,
                        fileName: fsEvent.fileName,
                        watched: fsEvent.watched,
                        subscription: fsEvent.subscription
                      }
                  ]
      }))
    }
  }

  handleHeaderClick = (day, e) => {
    e.preventDefault();

    let fromDate = day.unix();
    let toDate = day.add(1, 'day');


    const effectiveEvents = this.state.fsEvents.filter( (fsEvent) => {
      const _watched = parseInt(fsEvent.watched / 1000, 10); // without mills
      console.log('From: ' + fromDate + ' To: ' + fromDate + ' Watched: ' + _watched);
      return _watched > fromDate && _watched < toDate;
    });

    this.setState({
      fsEffectiveEvents: effectiveEvents
    });
  }

  render() {

    const self = this;

    var dates = [];
    const today = moment({
      hour: 0,
      minute: 0,
      seconds: 0,
      milliseconds: 0
    });

    let i = 1;
    while(i < 14) {
      let day = today.add(-1, 'day');
      dates.push(day.clone());  // add is a mutator method,
                                // i.e. day itself object is changed after add()
      i++;
    }

    var items = ['one', 'two'];

    return(<div>
             <h1>Sanfona</h1>
             <h2>{this.props.activeFolder}</h2>
             <div id='accordion' role='tablist' aria-multiselectable='true'>
                {dates.map( (day, index)  => {
                    return (<div className='card' key={index}>
                              <div className='card-header' role='tab' id={'heading'+index}
                                  onClick={ (e) => this.handleHeaderClick(day, e)}>
                                <h5 className='mb-0'>
                                  <a data-toggle='collapse' data-parent='#accordion'
                                    href={'#u' + index.toString()} aria-expanded='false'>
                                      {day.format('DD.MM.YYYY')}
                                      <span style={this.badgeStyle}
                                            className="badge badge-primary">New
                                      </span>
                                  </a>
                                </h5>
                              </div>

                              <div id={'u' + index} className='collapse hide'
                                    role='tabpanel'
                                    aria-labelledby={'heading'+index}>
                                <div className='card-block'>
                                {this.state.fsEffectiveEvents.map( (item, i) => {
                                  const _watched = moment.unix( parseInt(item.watched/1000) );
                                  return(<div key={i} className='row'>
                                            <div className='col'>{item.fileName}</div>
                                            <div className='col'>{_watched.format('DD.MM.YYYY')}</div>
                                        </div>)
                                  })
                                }
                                </div>
                              </div>
                            </div>)
                })}
             </div>
           </div>)
  }
};

const mapStateToProps = state => {

  return {
    fsEvent: state.fsEvent,
    activeSubscription: state.activeSubscription,
    activeFolder: state.activeFolder
  };
};

export default connect(mapStateToProps)(EventsList);
