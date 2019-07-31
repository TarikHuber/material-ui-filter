import * as filterSelectors from '../store/selectors'
import FormatSize from '@material-ui/icons/FormatSize'
import IconButton from '@material-ui/core/IconButton'
import React, { Component } from 'react'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import { DatePicker } from 'material-ui-pickers'

export const SearchField = ({
  theme,
  queryIndex,
  currentField,
  query,
  formatMessage,
  fields,
  handleQueryChange,
  DateTimeFormat,
  locale,
  okLabel,
  cancelLabel
}) => {
  const { value, isCaseSensitive } = filterSelectors.selectQueryProps(query)

  if (queryIndex == null || currentField == null || query == null || handleQueryChange == null || fields == null) {
    return <div />
  }

  let fieldType = ''
  let fieldLabel = ''

  fields.map(field => {
    if (field.name === currentField.value) {
      fieldType = field.type
      fieldLabel = field.label
    }
    return field
  })

  if (fieldType === 'date') {
    return (
      <Toolbar>
        <DatePicker
          keyboard
          label={formatMessage ? formatMessage({ id: 'enter_query_text' }) : ''}
          format="DD/MM/YYYY"
          placeholder="10/10/2018"
          mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
          value={value}
          onChange={val => {
            handleQueryChange(queryIndex, 'value', val.format())
          }}
          disableOpenOnEnter
          animateYearScrolling={false}
        />
      </Toolbar>
    )
  }

  if (fieldType === 'bool') {
    return (
      <Toolbar>
        <Switch
          label={fieldLabel}
          onChange={(e, val) => {
            handleQueryChange(queryIndex, 'value', val)
          }}
          value={value}
        />
      </Toolbar>
    )
  } else {
    //string

    return (
      <Toolbar>
        <TextField
          fullWidth
          name="value"
          onChange={(e, val) => {
            handleQueryChange(queryIndex, 'value', e.target.value)
          }}
          value={value ? value : ''}
          placeholder={formatMessage ? formatMessage({ id: 'enter_query_text' }) : ''}
        />
        <Tooltip
          id="tooltip-bottom-start"
          title={
            formatMessage
              ? formatMessage({ id: isCaseSensitive ? 'disable_case_sensitivity' : 'enable_case_sensitivity' })
              : ''
          }
          placement="bottom-end"
        >
          <IconButton
            onClick={() => {
              handleQueryChange(queryIndex, 'isCaseSensitive', !isCaseSensitive)
            }}
            color={isCaseSensitive ? 'primary' : undefined}
          >
            <FormatSize />
          </IconButton>
        </Tooltip>
      </Toolbar>
    )
  }
}
