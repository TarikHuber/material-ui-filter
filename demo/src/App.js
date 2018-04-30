import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import { FilterDrawer, filterSelectors, filterActions } from '../../src'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'
import List, { ListItem } from 'material-ui/List'
import TextField from 'material-ui/TextField'
import source from '../src/data.json'
import ReactList from 'react-list'
import Divider from 'material-ui/Divider'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import MenuIcon from '@material-ui/icons/Menu';


/*

        <AppBar
          iconElementLeft={<div></div>}
          title={`material-ui-filter (${source.length} entries)`}
          iconStyleRight={{ width: '50%', textAlign: 'center', marginLeft: 0 }}
          iconElementRight={
            <div style={{ display: 'flex' }}>
              <div style={{ width: 'calc(100% - 84px)' }}>
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
                    <Icon style={{ marginLeft: 10, marginTop: 12, marginRight: 15 }} className="material-icons">search</Icon>
                    <TextField
                      style={{ width: '100%' }}
                      underlineShow={false}
                      onChange={(e, newVal) => {
                        setSearch('demo', newVal)
                      }}
                      hintText={'Search'}
                    />
                  </div>
                </div>
              </div>
              <div style={{ position: 'absolute', right: 10, width: 100 }}>
                <IconButton onClick={() => setFilterIsOpen('demo', true)}>
                  <Icon className="material-icons">filter_list</Icon>
                </IconButton>
              </div>
            </div>
          }
        />

        <List>
          <ReactList
            itemRenderer={this.renderItem}
            length={list ? list.length : 0}
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

*/

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


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
          <div key={i} style={{ display: 'flex' }}>
            <div style={{ width: 200 }}>
              {val.name}
            </div>
            <div style={{ width: 400 }}>
              {val.email}
            </div>
            <div style={{ width: 200 }}>
              {val.registered}
            </div>
            <div style={{ width: 200 }}>
              {val.isActive ? 'Active' : ''}
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
      muiTheme,
      classes
    } = this.props

    const filterFields = [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'registered', label: 'Registered', type: 'date' },
      { name: 'isActive', label: 'Is Active', type: 'bool' },
    ]


    return (
      <div>

        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {`material-ui-filter (${source.length} entries)`}
            </Typography>
            <div style={{ display: 'flex' }}>
              <div style={{ width: 'calc(100% - 84px)' }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'transparent',
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
                    <Icon style={{ marginLeft: 10, marginTop: 12, marginRight: 15 }} >search</Icon>
                    <TextField
                      style={{ width: '100%' }}
                      underlineShow={false}
                      onChange={(e) => {
                        setSearch('demo', e.target.value)
                      }}
                      hintText={'Search'}
                    />
                  </div>
                </div>
              </div>

            </div>
            <IconButton color="inherit" onClick={() => setFilterIsOpen('demo', true)} ><Icon>filter_list</Icon></IconButton>
          </Toolbar>
        </AppBar>

        <List>
          <ReactList
            itemRenderer={this.renderItem}
            length={list ? list.length : 0}
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
)(withStyles(styles)(App))
