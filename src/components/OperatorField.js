import React, { Component } from 'react'
import SelectField from '../components/SelectField'
import SelectWrapped from '../components/SelectField'
import Input from 'material-ui/Input'
import { withTheme, withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import * as filterSelectors from '../store/selectors'

const styles = {
  list: {
    width: 250,
  },
  flex: {
    flex: 1,
  },
};

export class OperatorField extends Component {

  getFieldType = (currentField) => {
    const { fields } = this.props;

    let fieldType = '';

    fields.map((field) => {
      if (field.name === currentField.value) {
        fieldType = field.type;
      }
      return field;
    });

    return fieldType;
  }

  render() {

    const { queryIndex, currentField, query, fields, operators, handleQueryChange, formatMessage, classes, onClick } = this.props;
    const { operator } = filterSelectors.selectQueryProps(query);


    if (queryIndex == null ||
      currentField == null ||
      query == null ||
      handleQueryChange == null ||
      fields == null) {
      return <div></div>;
    }

    const fieldType = this.getFieldType(currentField);
    let divFields = [];

    operators.map((operator) => {
      if (operator.type === fieldType || (operator.type === 'string' && fieldType === undefined)) {
        operator.operators.map((op) => {
          return (
            divFields.push({
              value: op.value,
              label: op.label,
            })
          );
        });
      }
      return divFields;
    });

    return (


      <Toolbar>
        <Input
          fullWidth
          inputComponent={SelectWrapped}
          value={operator}
          onChange={(val) => { handleQueryChange(queryIndex, 'operator', val) }}
          placeholder={formatMessage ? formatMessage({ id: 'hint_autocomplete' }) : 'Select operator'}
          id="react-select-single"
          inputProps={{
            classes,
            name: 'react-select-single',
            instanceId: 'react-select-single',
            options: divFields
          }}
        />
        <Tooltip
          id="tooltip-bottom-start"
          title={formatMessage ? formatMessage({ id: isCaseSensitive ? 'disable_case_sensitivity' : 'enable_case_sensitivity' }) : ''}
          placement="bottom-end">
          <IconButton onClick={onClick} >
            <Icon>delete</Icon>
          </IconButton>
        </Tooltip>
      </Toolbar>

    );
  }
}

export default withStyles(styles)(OperatorField)
