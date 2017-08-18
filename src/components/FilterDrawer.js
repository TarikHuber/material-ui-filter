import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SuperSelectField from 'material-ui-superselectfield';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as filterActions from '../store/actions';
import * as filterSelectors from '../store/selectors';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { OperatorField } from './OperatorField'
import { SearchField } from './SearchField'


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

    addFilterQuery(name, {operator: {value: 'like', label: formatMessage?formatMessage({id: 'operator_like_label'}):'operator_like_label'}});
  }

  handleQueryChange = (index, field, value, operator) => {
    const { editFilterQuery, name } = this.props;

    let change={
      [field]: value
    }

    if(operator!==undefined){
      change.operator=operator
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
      if(field.name === currentField.value) {
        fieldType = field.type?field.type:'string';
      }
      return field;
    });

    return fieldType;
  }

  getFirstOperator = (currentField) => {
    const { operators } = this.props;
    const fieldType = this.getFieldType(currentField);

    if(!fieldType) {
      return undefined;
    }

    let op = undefined;

    operators.map((operator) => {
      if(operator.type === fieldType || (operator.type === 'string' && fieldType === undefined)) {
        op = { value: operator.operators[0].value, label: operator.operators[0].label };
      }
      return op;
    });

    return op;
  }

  handleFieldChange = (i, field, val) => {
    const { editFilterQuery, name } = this.props;
    const operator = this.getFirstOperator(val);
    const type=this.getFieldType(val);

    editFilterQuery(name, i, {[field]: val, type, operator, value: ''});
  }

  handleQueryDelete = (index) => {
    const { removeFilterQuery, name }= this.props;

    removeFilterQuery(name, index);
  }


  render() {
    const {
      muiTheme,
      formatMessage,
      filters,
      name,
      fields,
      operators,
      DateTimeFormat,
      locale,
      okLabel,
      cancelLabel
    } = this.props;

    const { isOpen, sortField, sortOrientation, queries } = filterSelectors.selectFilterProps(name, filters);

    return (
      <Drawer  openSecondary={true} open={isOpen} width={this.props.width}>
        <AppBar
          title={formatMessage?formatMessage({id:'filter'}):'Filter'}
          onLeftIconButtonTouchTap={this.handleCloseFilter}
          iconElementLeft={
            <IconButton
              tooltipPosition={'bottom-right'}
              tooltip={formatMessage?formatMessage({id:'close_filter'}):'Close filter'}>
              <FontIcon className="material-icons" >chevron_right</FontIcon>
            </IconButton>
          }
        />
        <div>
          <div style={{display: 'flex', flexDirectiaron: 'row', alignItems: 'center'}}>
            <Subheader >{formatMessage?formatMessage({id:'sorting'}):'Sorting'}</Subheader>
            <div>
              <IconButton
                style={{padding: 0}}
                onClick={()=>{this.handleSortOrientationChange(!sortOrientation)}}
                tooltipPosition={'bottom-left'}
                tooltip={formatMessage?formatMessage({id:'change_sort_orientation'}):'Change orientation'}>
                <FontIcon
                  className="material-icons"
                  color={sortOrientation===false?muiTheme.palette.accent1Color:muiTheme.palette.primary1Color}>
                  sort_by_alpha
                </FontIcon>
              </IconButton>
            </div>
          </div>

          <div >
            <div>
              <SuperSelectField
                name='sortField'
                value={sortField}
                hintText={formatMessage?formatMessage({id:'select_field'}):'Select field'}
                onChange={this.handleSortFieldChange}
                fullWidth={true}
                showAutocompleteThreshold={4}
                style={{marginLeft: 15, marginRight: 10}}>
                {fields.map((field)=>{
                  return <div
                    value={field.name}
                    key={field.name}
                    label={field.label}>
                    {field.label}
                  </div>
                })}
              </SuperSelectField>
              <br/>
            </div>
          </div>
          <Divider />
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Subheader >{formatMessage?formatMessage({id:'filters'}):'Filters'}</Subheader>
            <div>
              <IconButton
                style={{padding: 0}}
                onClick={this.handleAddFilterQuery}
                tooltipPosition={'bottom-left'}
                tooltip={formatMessage?formatMessage({id:'add_filter'}):'Add filter'}>
                <FontIcon
                  className="material-icons"
                  color={muiTheme.palette.primary1Color}>
                  add_circle
                </FontIcon>
              </IconButton>
            </div>
          </div>

          {queries.map((query, i)=>{
            const { field } = filterSelectors.selectQueryProps(query);

            return  <div key={i}>
              <div>
                <br/>
                <SuperSelectField
                  name='field'
                  value={field}
                  showAutocompleteThreshold={4}
                  onChange={(val)=>{this.handleFieldChange(i, 'field', val)}}
                  hintText={formatMessage?formatMessage({id:'select_field'}):'Select field'}
                  style={{marginLeft: 15, marginRight: 10 }}>
                  {fields.map((field)=>{
                    return <div
                      value={field.name}
                      key={field.name}
                      label={field.label}>
                      {field.label}
                    </div>
                  })}
                </SuperSelectField>
              </div>
              <br/>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

                <OperatorField
                  queryIndex={i}
                  currentField={field}
                  query={query}
                  fields={fields}
                  operators={operators}
                  handleQueryChange={this.handleQueryChange}
                  formatMessage={formatMessage}
                />

                <div>
                  <IconButton
                    style={{padding: 0}}
                    onClick={()=>{this.handleQueryDelete(i)}}
                    tooltipPosition={'bottom-left'}
                    tooltip={formatMessage?formatMessage({id:'delete_filter'}):'Delete filter'}>
                    <FontIcon
                      className="material-icons"
                      color={muiTheme.palette.accent1Color}>
                      delete
                    </FontIcon>
                  </IconButton>
                </div>
              </div>

              <SearchField
                id={'searchField'}
                queryIndex={i}
                currentField={field}
                query={query}
                DateTimeFormat={DateTimeFormat}
                locale={locale}
                muiTheme={muiTheme}
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
      </Drawer>
    );
  }
}

FilterDrawer.propTypes = {
  formatMessage: PropTypes.func,
  muiTheme: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  setFilterIsOpen: PropTypes.func.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  const { filters, userSetOperators } = state;
  const { fields, formatMessage } = ownProps;

  const  allOperators = [
    {value: 'like', label: formatMessage?formatMessage({id: 'operator_like_label'}):'Like'},
    {value: 'notlike', label: formatMessage?formatMessage({id: 'operator_notlike_label'}):'Not like'},
    {value: '=', label: formatMessage?formatMessage({id: 'operator_equal_label'}):'='},
    {value: '!=', label: formatMessage?formatMessage({id: 'operator_notequal_label'}):'!='},
    {value: '>', label: '>'},
    {value: '>=', label: '>='},
    {value: '<', label: '<'},
    {value: '<=', label: '<='},
    {value: 'novalue', label: formatMessage?formatMessage({id: 'operator_novalue_label'}):'No value'},
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
    operators: userSetOperators?userSetOperators:operators,
    filters,
    formatMessage,
  };
};

export default connect(
  mapStateToProps, {...filterActions}
)(muiThemeable()(FilterDrawer));
