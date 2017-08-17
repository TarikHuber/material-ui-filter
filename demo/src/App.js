import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { FilterDrawer, filterSelectors, filterActions } from '../../src'
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';

const source=[
  {
    name: 'Tarik Huber',
    email: 'huber.tarik@gmail.com',
    birthDate: '14.12.1987',
    isAuthor: true
  },
  {
    name: 'Maximilian Pichler',
    email: 'maximilian.pichler97@gmail.com',
    birthDate: '25.09.1997',
    isAuthor: true
  },
  {
    name: 'Bill Gates',
    email: 'bill.gates@gmail.com',
    birthDate: '28.10.1955',
    isAuthor: false
  },
  {
    name: 'Mark Zuckerberg',
    email: 'mark.zuckerberg@gmail.com',
    birthDate: '14.05.1984'
  }
]


class App extends Component {

  render() {
    const {
      setFilterIsOpen,
      list
    } = this.props

    const filterFields = [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email'  },
      { name: 'birthDate', label: 'Birthdate', type: 'date'  },
      { name: 'isAuthor', label: 'Author', type: 'bool'  },
    ];

    return (

      <div>
        <AppBar
          title="material-ui-filter"
          iconElementRight={
            <IconButton onClick={()=>setFilterIsOpen('demo', true)}>
              <FontIcon className="material-icons">filter_list</FontIcon>
            </IconButton>
          }
        />

          <List>
            {list.map((item, i)=>{
              return <ListItem
                key={i}
                primaryText={item.name}
                secondaryText={`${item.email} ${item.birthDate} ${item.isAuthor?'Author':''}`}
              />
            })}
          </List>


        <FilterDrawer
          name={'demo'}
          fields={filterFields}
        />

      </div>
    );
  }
}

App.propTypes = {
  setFilterIsOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {  filters } = state;
  const { hasFilters } = filterSelectors.selectFilterProps('demo', filters);
  const list = filterSelectors.getFilteredList('demo', filters, source);

  return {
    hasFilters,
    list
  };
};



export default connect(
  mapStateToProps, { ...filterActions }
)(App);
