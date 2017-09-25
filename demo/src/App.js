import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import { FilterDrawer, filterSelectors, filterActions } from '../../src'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'
import TextField from 'material-ui/TextField'
import source from '../src/data.json'
import ReactList from 'react-list'
import Divider from 'material-ui/Divider'

class App extends Component {

  renderItem = (i, k) => {
    const { list } = this.props
    const key = i
    const val = list[i]

    return (
      <div key={i}>
        <ListItem
          key={key}
          id={key}>
          <div key={i} style={{display: 'flex'}}>
            <div style={{width: 200}}>
              {val.name}
            </div>
            <div style={{width: 400}}>
              {val.email}
            </div>
            <div style={{width: 200}}>
              {val.registered}
            </div>
            <div style={{width: 200}}>
              {val.isActive?'Active':''}
            </div>
          </div>
        </ListItem>
        <Divider />
      </div>
    )
  }

  render() {
    const {
      setFilterIsOpen,
      list,
      setSearch,
      muiTheme
    } = this.props

    const filterFields = [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'registered', label: 'Registered', type: 'date' },
      { name: 'isActive', label: 'Is Active', type: 'bool' },
    ]

    return (
      <div>
        <AppBar
          iconElementLeft={<div></div>}
          title={`material-ui-filter (${source.length} entries)`}
          iconStyleRight={{width: '50%', textAlign: 'center', marginLeft: 0}}
          iconElementRight={
            <div style={{display: 'flex'}}>
              <div style={{width: 'calc(100% - 84px)'}}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  width: 600,
                  maxWidth: '100%'
                }}
                >
                  <div style={{
                    display: 'flex',
                    borderRadius: 4,
                    paddingLeft: 10,
                    paddingRight: 10
                  }}
                  >
                    <FontIcon style={{marginLeft: 10, marginTop: 12, marginRight: 15}} className="material-icons">search</FontIcon>
                    <TextField
                      style={{width: '100%'}}
                      underlineShow={false}
                      onChange={(e, newVal) => {
                        setSearch('demo', 'name', newVal)
                      }}
                      hintText={'Search'}
                    />
                  </div>
                </div>
              </div>
              <div style={{position: 'absolute', right: 10, width: 100}}>
                <IconButton onClick={()=>setFilterIsOpen('demo', true)}>
                  <FontIcon className="material-icons">filter_list</FontIcon>
                </IconButton>
              </div>
            </div>
          }
        />

        <List>
          <ReactList
            itemRenderer={this.renderItem}
            length={list?list.length:0}
            type='simple'
          />
        </List>

        <FilterDrawer
          name={'demo'}
          fields={filterFields}

          //localizing the DatePicker
          //locale={'de-DE'}
          //DateTimeFormat={global.Intl.DateTimeFormat}
          //okLabel="OK"
          //cancelLabel="Abbrechen"
        />
      </div>
    )
  }
}

App.propTypes = {
  setFilterIsOpen: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  const { filters, muiTheme } = state
  const { hasFilters } = filterSelectors.selectFilterProps('demo', filters)
  const list = filterSelectors.getFilteredList('demo', filters, source /*, fieldValue => fieldValue.val*/)

  return {
    hasFilters,
    list
  }
}


export default connect(
  mapStateToProps,
  { ...filterActions }
)(App)
