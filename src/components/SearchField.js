import React, { Component } from 'react'
import * as filterSelectors from '../store/selectors'
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui-pickers/DatePicker'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
//import { DatePicker } from 'material-ui-pickers';
import { formatDateToString, formatDateToObject } from '../utils/date'

export class SearchField extends Component {

  handleDateInputTextChange = (queryIndex, field, val) => {
    const { handleQueryChange } = this.props;
    const yearMonthDayOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }

    const date = formatDateToObject(val, yearMonthDayOptions);
    handleQueryChange(queryIndex, field, date);
    handleQueryChange(queryIndex, 'textValue', val);
  }

  handleDatePickerChange = (queryIndex, field, val) => {
    const { handleQueryChange } = this.props;
    const yearMonthDayOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }

    const date = formatDateToObject(new Date(val).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }), yearMonthDayOptions);
    const dateString = formatDateToString(new Date(val).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }), { day: '2-digit', month: '2-digit', year: 'numeric' });
    handleQueryChange(queryIndex, field, date);
    handleQueryChange(queryIndex, 'textValue', dateString);
  }


  render() {
    const {
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
    } = this.props;

    const { value, isCaseSensitive } = filterSelectors.selectQueryProps(query);

    if (queryIndex == null ||
      currentField == null ||
      query == null ||
      handleQueryChange == null ||
      fields == null) {
      return (<div></div>);
    }

    let fieldType = '';
    let fieldLabel = '';

    fields.map((field) => {
      if (field.name === currentField.value) {
        fieldType = field.type;
        fieldLabel = field.label;
      }
      return field;
    });


    if (fieldType === "date") {
      return (
        <Toolbar>
          <DatePicker
            keyboard
            label={formatMessage ? formatMessage({ id: 'enter_query_text' }) : ''}
            format="DD/MM/YYYY"
            placeholder="10/10/2018"
            // handle clearing outside => pass plain array if you are not controlling value outside
            mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            value={value}
            onChange={val => {
              console.log(val)
              this.handleQueryChange(queryIndex, 'value', val.format())
            }}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </Toolbar>
      );
    }

    if (fieldType === "bool") {
      return (
        <Toolbar>
          <Switch
            label={fieldLabel}
            onChange={(e, val) => { handleQueryChange(queryIndex, 'value', val) }}
            value={value}
          />
        </Toolbar>
      );
    }

    else {  //string
      return (

        <Toolbar>
          <TextField
            fullWidth
            name='value'
            onChange={(e, val) => { handleQueryChange(queryIndex, 'value', e.target.value) }}
            value={value}
            hintText={formatMessage ? formatMessage({ id: 'enter_query_text' }) : ''}
          />
          <Tooltip
            id="tooltip-bottom-start"
            title={formatMessage ? formatMessage({ id: isCaseSensitive ? 'disable_case_sensitivity' : 'enable_case_sensitivity' }) : ''}
            placement="bottom-end">
            <IconButton onClick={() => { handleQueryChange(queryIndex, 'isCaseSensitive', !isCaseSensitive) }} >
              <Icon>format_size</Icon>
            </IconButton>
          </Tooltip>
        </Toolbar>

      );
    }
  }


}
