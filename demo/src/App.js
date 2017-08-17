import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { FilterDrawer, filterSelectors, filterActions } from '../../src'
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const source=[
  {
    name: 'Tarik Huber',
    email: 'huber.tarik@gmail.com',
    birthDate: '14.12.1987'
  },
  {
    name: 'Maximilian Pichler',
    email: 'maximilian.pichler97@gmail.com',
    birthDate: '25.09.1997'
  },
  {
    name: 'Bill Gates',
    email: 'bill.gates@gmail.com',
    birthDate: '28.10.1955'
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
    } = this.props

    const filterFields = [
      { name: 'name', label: 'test' },
      { name: 'vat', label: 'test2'  }
    ];

    return (

      <div>
        <AppBar
          title="Title"
          iconElementRight={
            <IconButton onClick={()=>setFilterIsOpen('demo', true)}>
              <FontIcon className="material-icons">filter_list</FontIcon>
            </IconButton>
          }
        />

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
  const { hasFilters } = filterSelectors.selectFilterProps('companies', filters);
  const list = filterSelectors.getFilteredList('companies', filters, source);

  return {
    hasFilters,
    list
  };
};



export default connect(
  mapStateToProps, { ...filterActions }
)(App);
