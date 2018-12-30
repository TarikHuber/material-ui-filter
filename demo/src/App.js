import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import { FilterDrawer, filterSelectors, filterActions } from '../../src'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import source from '../src/data.json'
import ReactList from 'react-list'
import Divider from '@material-ui/core/Divider'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  typography: {
    useNextVariants: true,
  }
})

class App extends Component {
  renderItem = (i, k) => {
    const { list } = this.props
    const key = i
    const val = list[i]

    return (
      <div key={i}>
        <ListItem key={key} id={key}>
          <div key={i} style={{ display: 'flex' }}>
            <div style={{ width: 200 }}>{val.name}</div>
            <div style={{ width: 400 }}>{val.email}</div>
            <div style={{ width: 200 }}>{val.registered}</div>
            <div style={{ width: 200 }}>{val.isActive ? 'Active' : ''}</div>
          </div>
        </ListItem>
        <Divider />
      </div>
    )
  }

  render() {
    const { setFilterIsOpen, list, setSearch, muiTheme, classes } = this.props

    const filterFields = [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'registered', label: 'Registered', type: 'date' },
      { name: 'isActive', label: 'Is Active', type: 'bool' },
      { name: 'testObject', label: 'Object', type: 'object' }
    ]

    return (
      <div>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {`material-ui-filter (${source.length} entries)`}
            </Typography>
            <div style={{ display: 'flex' }}>
              <div style={{ width: 'calc(100% - 84px)' }}>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    width: 600,
                    maxWidth: '100%'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      borderRadius: 4,
                      paddingLeft: 10,
                      paddingRight: 10
                    }}
                  >
                    <Icon style={{ marginLeft: 10, marginTop: 12, marginRight: 15 }}>search</Icon>
                    <TextField
                      style={{ width: '100%' }}
                      onChange={e => {
                        setSearch('demo', e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <IconButton color="inherit" onClick={() => setFilterIsOpen('demo', true)}>
              <Icon>filter_list</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <List>
          <ReactList itemRenderer={this.renderItem} length={list ? list.length : 0} type="simple" />
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
  setFilterIsOpen: PropTypes.func.isRequired
}

const mapStateToProps = state => {
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
)(withStyles(styles, { withTheme: true })(App))
