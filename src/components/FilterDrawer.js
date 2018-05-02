import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SelectWrapped from '../components/SelectWrapped'
import ListSubheader from 'material-ui/List/ListSubheader';
import Divider from 'material-ui/Divider'
import { withTheme, withStyles } from 'material-ui/styles';
import * as filterActions from '../store/actions'
import * as filterSelectors from '../store/selectors'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import OperatorField from './OperatorField'
import { SearchField } from './SearchField'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from 'material-ui/Tooltip';
import Input from 'material-ui/Input';

const styles = theme => ({
  flex: {
    flexGrow: 1
  },
  list: {
    zIndex: theme.zIndex.drawer + 1,
    width: 250,
  },
})

class FilterDrawer extends Component {

  handleCloseFilter = () => {
    const { setFilterIsOpen, name } = this.props;

    setFilterIsOpen(name, false);
  }

  handleSortFieldChange = (selectedField, fieldName) => {
    const { setFilterSortField, name } = this.props;

    setFilterSortField(name, selectedField);
  }

  handleSortOrientationChange = (orientation) => {
    const { setFilterSortOrientation, name } = this.props;

    setFilterSortOrientation(name, orientation);
  }

  handleAddFilterQuery = () => {
    const { addFilterQuery, name, formatMessage } = this.props;

    addFilterQuery(name, { operator: { value: 'like', label: formatMessage ? formatMessage({ id: 'operator_like_label' }) : 'operator_like_label' } });
  }

  handleQueryChange = (index, field, value, operator) => {
    const { editFilterQuery, name } = this.props;

    let change = {
      [field]: value
    }

    if (operator !== undefined) {
      change.operator = operator
    }

    editFilterQuery(name, index, change);

  }

  getFieldType = (currentField) => {
    const { fields } = this.props;

    if (!currentField) {
      return 'string';
    }

    let fieldType = 'string';

    fields.map((field) => {
      if (field.name === currentField.value) {
        fieldType = field.type ? field.type : 'string';
      }
      return field;
    });

    return fieldType;
  }

  getFirstOperator = (currentField) => {
    const { operators } = this.props;
    const fieldType = this.getFieldType(currentField);

    if (!fieldType) {
      return undefined;
    }

    let op = undefined;

    operators.map((operator) => {
      if (operator.type === fieldType || (operator.type === 'string' && fieldType === undefined)) {
        op = { value: operator.operators[0].value, label: operator.operators[0].label };
      }
      return op;
    });

    return op;
  }

  handleFieldChange = (i, field, val) => {
    const { editFilterQuery, name } = this.props;
    const operator = this.getFirstOperator(val);
    const type = this.getFieldType(val);

    editFilterQuery(name, i, { [field]: val, type, operator, value: '' });
  }

  handleQueryDelete = (index) => {
    const { removeFilterQuery, name } = this.props;

    removeFilterQuery(name, index);
  }


  render() {
    const {
      theme,
      formatMessage,
      filters,
      name,
      fields,
      operators,
      DateTimeFormat,
      locale,
      okLabel,
      cancelLabel,
      setFilterIsOpen,
      classes
    } = this.props;

    const { isOpen, sortField, sortOrientation, queries } = filterSelectors.selectFilterProps(name, filters);

    return (
      <Drawer
        variant="persistent"
        className={classes.list}
        anchor="right"
        open={isOpen}
        width={this.props.width}
        onClose={() => { setFilterIsOpen(name, false) }}>
        <div className={classes.list}>
          <AppBar position="static">
            <Toolbar>
              <Tooltip id="tooltip-bottom-end" title={formatMessage ? formatMessage({ id: 'close_filter' }) : 'Close filter'} placement="bottom-end">
                <IconButton color="inherit" onClick={this.handleCloseFilter} ><Icon>chevron_right</Icon></IconButton>
              </Tooltip>
              <Typography variant="title" color="inherit" >
                {formatMessage ? formatMessage({ id: 'filter' }) : 'Filter'}
              </Typography>
            </Toolbar>
          </AppBar>

          <Toolbar>

            <Input
              fullWidth
              inputComponent={SelectWrapped}
              value={sortField ? sortField.value : null}
              onChange={this.handleSortFieldChange}
              placeholder={formatMessage ? formatMessage({ id: 'select_field' }) : 'Select field'}
              id="react-select-single"
              inputProps={{
                classes,
                name: 'react-select-single',
                instanceId: 'react-select-single',
                options: fields.map(suggestion => ({
                  value: suggestion.name,
                  label: suggestion.label,
                })),
              }}
            />
            <Tooltip id="tooltip-bottom-end" title={formatMessage ? formatMessage({ id: 'change_sort_orientation' }) : 'Change orientation'} placement="bottom-end">
              <IconButton onClick={() => { this.handleSortOrientationChange(!sortOrientation) }} color={sortOrientation ? 'primary' : 'secondary'} ><Icon>sort_by_alpha</Icon></IconButton>
            </Tooltip>
          </Toolbar>
          <Divider />

          <Toolbar>
            <Typography
              variant="subheading"
              color="inherit"
              className={classes.flex}
            >
              {formatMessage ? formatMessage({ id: 'filter' }) : 'Filter'}
            </Typography>
            <Tooltip id="tooltip-bottom-start" title={formatMessage ? formatMessage({ id: 'add_filter' }) : 'Add filter'} placement="bottom-end">
              <IconButton onClick={this.handleAddFilterQuery} color="primary" ><Icon>add_circle</Icon></IconButton>
            </Tooltip>
          </Toolbar>
          <div>
            {queries.map((query, i) => {
              const { field } = filterSelectors.selectQueryProps(query);

              return <div key={i}>
                <Toolbar>
                  <Input
                    fullWidth
                    inputComponent={SelectWrapped}
                    value={field ? field.value : null}
                    onChange={(val) => { this.handleFieldChange(i, 'field', val) }}
                    placeholder={formatMessage ? formatMessage({ id: 'select_field' }) : 'Select field'}
                    id="react-select-single"
                    inputProps={{
                      classes,
                      name: 'react-select-single',
                      instanceId: 'react-select-single',
                      options: fields.map(suggestion => ({
                        value: suggestion.name,
                        label: suggestion.label,
                      })),
                    }}
                  />
                </Toolbar>

                <OperatorField
                  queryIndex={i}
                  currentField={field}
                  query={query}
                  fields={fields}
                  operators={operators}
                  handleQueryChange={this.handleQueryChange}
                  formatMessage={formatMessage}
                  onClick={() => { this.handleQueryDelete(i) }}
                />


                <SearchField
                  id={'searchField'}
                  queryIndex={i}
                  currentField={field}
                  query={query}
                  DateTimeFormat={DateTimeFormat}
                  locale={locale}
                  theme={theme}
                  formatMessage={formatMessage}
                  handleQueryChange={this.handleQueryChange}
                  fields={fields}
                  okLabel={okLabel}
                  cancelLabel={cancelLabel}
                />
                <Divider />
              </div>
            })}

          </div>
        </div>
      </Drawer >
    );
  }
}

FilterDrawer.propTypes = {
  formatMessage: PropTypes.func,
  theme: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  setFilterIsOpen: PropTypes.func.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  const { filters, userSetOperators } = state;
  const { fields, formatMessage } = ownProps;

  const allOperators = [
    { value: 'like', label: formatMessage ? formatMessage({ id: 'operator_like_label' }) : 'Like' },
    { value: 'notlike', label: formatMessage ? formatMessage({ id: 'operator_notlike_label' }) : 'Not like' },
    { value: '=', label: formatMessage ? formatMessage({ id: 'operator_equal_label' }) : '=' },
    { value: '!=', label: formatMessage ? formatMessage({ id: 'operator_notequal_label' }) : '!=' },
    { value: '>', label: '>' },
    { value: '>=', label: '>=' },
    { value: '<', label: '<' },
    { value: '<=', label: '<=' },
    { value: 'novalue', label: formatMessage ? formatMessage({ id: 'operator_novalue_label' }) : 'No value' },
  ]

  const operators = [
    {
      type: 'string',
      operators: allOperators.filter((operator) => {
        return (operator.value === 'like' ||
          operator.value === 'notlike' ||
          operator.value === '=' ||
          operator.value === '!=' ||
          operator.value === 'novalue');
      })
    },
    {
      type: 'date',
      operators: allOperators.filter((operator) => {
        return (operator.value === '=' ||
          operator.value === '!=' ||
          operator.value === '<=' ||
          operator.value === '>=' ||
          operator.value === '<' ||
          operator.value === '>');
      })
    },
    {
      type: 'bool',
      operators: allOperators.filter((operator) => {
        return operator.value === '=';
      })
    }
  ];

  return {
    fields,
    operators: userSetOperators ? userSetOperators : operators,
    filters,
    formatMessage,
  };
};

export default connect(
  mapStateToProps, { ...filterActions }
)(withTheme()(withStyles(styles, { withTheme: true })(FilterDrawer)))
