import React, { Component } from 'react';
import * as filterSelectors from '../store/selectors';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { formatDateToString, formatDateToObject } from '../utils/date'


export class SearchField extends Component {

  handleDateInputTextChange = (queryIndex, field,  val) => {
    const { handleQueryChange } = this.props;
    const yearMonthDayOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }

    const date = formatDateToObject(val, yearMonthDayOptions);
    handleQueryChange(queryIndex, field, date);
    handleQueryChange(queryIndex, 'textValue', val);
  }

  handleDatePickerChange = (queryIndex, field,  val) => {
    const { handleQueryChange } = this.props;
    const yearMonthDayOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }

    const date = formatDateToObject(new Date(val).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }), yearMonthDayOptions);
    const dateString = formatDateToString(new Date(val).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }), { day: '2-digit', month: '2-digit', year: 'numeric' });
    handleQueryChange(queryIndex, field, date);
    handleQueryChange(queryIndex, 'textValue', dateString);
  }



  render() {

    const { muiTheme, queryIndex, currentField, query, formatMessage, fields, handleQueryChange } = this.props;
    const { value,  isCaseSensitive } = filterSelectors.selectQueryProps(query);

    if(queryIndex == null ||
      currentField == null ||
      query == null ||
      handleQueryChange == null ||
      fields == null)
      {
        return (<div></div>);
      }

      let fieldType = '';

      fields.map((field) => {
        if(field.name === currentField.value) {
          fieldType = field.type;
        }
        return field;
      });


      if(fieldType === "date") {
        return (

          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div >
              <TextField
                value={query.textValue?query.textValue:''}
                onChange={(e, val)=>{this.handleDateInputTextChange(queryIndex, 'value', val)}}
                style={{ marginLeft: 15, marginRight: 10 }}
                hintText={formatMessage?formatMessage({id:'enter_query_text'}):''}
              />
            </div>
            <div>
              <DatePicker
                hintText='value'
                tabIndex={-1}
                autoOk={true}
                style={{display: 'none'}}
                onChange={(e, val)=>{this.handleDatePickerChange(queryIndex, 'value', val)}}
                DateTimeFormat={global.Intl.DateTimeFormat}
                locale={formatMessage?formatMessage({id: 'current_locale'}):''}
                ref='value'
              />
              <IconButton
                style={{padding: 0}}
                onClick={()=>{this.refs['value'].openDialog();}}
                tooltipPosition={'bottom-left'}
                tabIndex={-1}
                tooltip={formatMessage?formatMessage({id: 'date_picker_text'}):''}>
                <FontIcon
                  className="material-icons"
                  style={{fontSize: 12}}
                  color={muiTheme.palette.primary1Color}>
                  event
                </FontIcon>
              </IconButton>
            </div>
          </div>
        );
      }

      if(fieldType === "bool") {
        return (
          <div style={{paddingLeft: '10px'}}>
            <br />
            <Toggle
              style={{width: '200px'}}
              onToggle={(e, val)=>{handleQueryChange(queryIndex, 'value', val)}}
              value={value}
            />
            <br />
          </div>
        );
      }

      else {  //string
        return (
          <div style={{display: 'flex'}}>
            <TextField
              name='value'
              onChange={(e, val)=>{handleQueryChange(queryIndex, 'value', val)}}
              value={value}
              style={{marginLeft: 15, marginRight: 10 }}
              hintText={formatMessage?formatMessage({id:'enter_query_text'}):''}
            />
            <IconButton
              style={{padding: 0}}
              onClick={()=>{handleQueryChange(queryIndex, 'isCaseSensitive', !isCaseSensitive)}}
              tooltipPosition={'bottom-left'}
              tooltip={formatMessage?formatMessage({id:isCaseSensitive?'disable_case_sensitivity':'enable_case_sensitivity'}):''}>
              <FontIcon
                className="material-icons"
                color={isCaseSensitive?muiTheme.palette.primary1Color:muiTheme.palette.disabledColor}>
                format_size
              </FontIcon>
            </IconButton>
          </div>
        );
      }
    }


  }
