import * as filterSelectors from '../store/selectors'
import Delete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import React, { Component } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import { SelectField } from 'muishift'
import { withTheme, withStyles } from '@material-ui/core/styles'

const styles = {}

export const OperatorField = ({
  queryIndex,
  currentField,
  query,
  fields,
  operators,
  handleQueryChange,
  formatMessage,
  classes,
  onClick
}) => {
  const getFieldType = currentField => {
    let fieldType = ''

    fields.map(field => {
      if (field.name === currentField.value) {
        fieldType = field.type
      }
      return field
    })

    return fieldType
  }

  const { operator, isCaseSensitive } = filterSelectors.selectQueryProps(query)

  if (queryIndex == null || currentField == null || query == null || handleQueryChange == null || fields == null) {
    return <div />
  }

  const fieldType = getFieldType(currentField)
  let divFields = []

  operators.map(operator => {
    if (operator.type === fieldType || (operator.type === 'string' && fieldType === undefined)) {
      operator.operators.map(op => {
        return divFields.push({
          value: op.value,
          label: op.label
        })
      })
    }
    return divFields
  })

  return (
    <Toolbar>
      <div style={{ maxWidth: 160 }}>
        <SelectField
          input={{ value: operator }}
          onChange={val => {
            handleQueryChange(queryIndex, 'operator', val)
          }}
          items={divFields}
          itemToString={item => (item ? item.label : '')}
          id="react-select-single"
          inputProps={{
            fullWidth: true,
            placeholder: formatMessage ? formatMessage({ id: 'hint_autocomplete' }) : 'Select operator'
          }}
        />
      </div>

      <Tooltip
        id="tooltip-bottom-start"
        title={
          formatMessage
            ? formatMessage({ id: isCaseSensitive ? 'disable_case_sensitivity' : 'enable_case_sensitivity' })
            : ''
        }
        placement="bottom-end"
      >
        <IconButton onClick={onClick} aria-label="Delete" color="secondary">
          <Delete />
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

export default withStyles(styles)(OperatorField)
