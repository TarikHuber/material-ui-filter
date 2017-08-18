import { formatDateToObject } from '../utils/date'

export const STRING_TYPE = 'string'
export const NUMBER_TYPE = 'number'
export const DATE_TYPE = 'date'
export const TIME_TYPE = 'time'
export const ARRAY_TYPE = 'array'
export const SELECT_FIELD_TYPE = 'select_field'

function getValue (source, fieldName, getSourceValue = fieldValue => fieldValue, isCaseSensitive, type) {
  if (source != null && getSourceValue(source)) {
    let fieldValue = getSourceValue(source)[fieldName]

    if (typeof fieldValue === 'object' || fieldValue instanceof Object) {
      if (fieldValue.hasOwnProperty('label')) {
        fieldValue = fieldValue.label
      }
    }

    if (type === 'date') {
      return new Date(fieldValue).setHours(0, 0, 0, 0)
    } else if (type === 'bool') {
      return fieldValue === undefined ? 'false' : fieldValue
    } else {
      return isCaseSensitive === true ? fieldValue : String(fieldValue).toUpperCase()
    }
  }
}

export function dynamicSort (sortField, sortOrientation, getSourceValue) {
  var sortOrder = sortOrientation ? 1 : -1

  return (x, y) => {
    var a = getValue(x, sortField, getSourceValue)
    var b = getValue(y, sortField, getSourceValue)
    var result = (a < b) ? -1 : (a > b) ? 1 : 0
    return result * sortOrder
  }
}

export function selectFilterProps (filterName, filters) {
  let isOpen = false
  let hasFilters = false
  let sortField = null
  let sortOrientation = true
  let queries = []

  if (filters !== undefined && filters[filterName] !== undefined) {
    const filter = filters[filterName]

    isOpen = filter.isOpen !== undefined ? filter.isOpen : isOpen
    hasFilters = filter.queries !== undefined ? filter.queries.length : hasFilters
    sortField = filter.sortField !== undefined ? filter.sortField : sortField
    sortOrientation = filter.sortOrientation !== undefined ? filter.sortOrientation : sortOrientation
    queries = filter.queries !== undefined ? filter.queries : queries
  }

  return {
    isOpen,
    hasFilters,
    sortField,
    sortOrientation,
    queries
  }
}

export function selectQueryProps (query) {
  let value = ''
  let operator
  let field
  let type = 'string'
  let isCaseSensitive = false
  let isSet = false

  if (query !== undefined) {
    value = query.value !== undefined ? query.value : value
    operator = query.operator !== undefined ? query.operator : operator
    field = query.field !== undefined ? query.field : field
    type = query.type !== undefined ? query.type : type
    isCaseSensitive = query.isCaseSensitive !== undefined ? query.isCaseSensitive : isCaseSensitive
    isSet = field !== undefined && field !== null && operator !== undefined && operator !== null && value !== undefined
  }

  return {
    value,
    operator,
    field,
    type,
    isCaseSensitive,
    isSet
  }
}

export function getFilteredList (filterName, filters, list, getSourceValue) {
  const { sortField, sortOrientation, queries } = selectFilterProps(filterName, filters)
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
  let result = [...list]

  if (list !== undefined && queries) {
    for (let query of queries) {
      const { value, operator, field, isCaseSensitive, isSet, type } = selectQueryProps(query)
      const queryDateString = new Date(value).toLocaleString('de-DE', dateOptions)
      const queryDateObjWithTime = new Date(formatDateToObject(queryDateString, dateOptions, 'de-DE'))
      const queryDateObj = new Date(queryDateObjWithTime).setHours(0, 0, 0, 0)

      result = result.filter((row, i) => {
        let show = false

        if (isSet) {
          let fieldValue = getValue(row, field.value, getSourceValue, isCaseSensitive, type)

          if (type === 'date') {
            switch (operator.value) {
              case '=':
                show = (queryDateObj - fieldValue === 0)
                break

              case '!=':
                show = (queryDateObj - fieldValue !== 0)
                break

              case '>':
                show = (queryDateObj - fieldValue < 0)
                break

              case '>=':
                show = (queryDateObj - fieldValue <= 0)
                break

              case '<':
                show = (queryDateObj - fieldValue > 0)
                break

              case '<=':
                show = (queryDateObj - fieldValue >= 0)
                break

              default:
                break
            }
          } else if (type === 'bool') {
            let fieldVal = false
            if (fieldValue === true || fieldValue === 'true') {
              fieldVal = true
            }

            let queryVal = false
            if (value === true || value === 'true') {
              queryVal = true
            }

            show = (fieldVal === queryVal)
          } else {
            const valueString = String(value)
            const fieldValueString = String(fieldValue)
            let queryValueString = isCaseSensitive === true ? valueString : valueString.toUpperCase()

            switch (operator.value) {
              case 'like':
                show = fieldValueString.indexOf(queryValueString) !== -1
                break

              case 'notlike':
                show = fieldValueString.indexOf(queryValueString) === -1
                break

              case '=':
                show = fieldValueString === queryValueString
                break

              case '>':
                show = fieldValueString.localeCompare(queryValueString) > 0
                break

              case '>=':
                show = fieldValueString.localeCompare(queryValueString) >= 0
                break

              case '<':
                show = fieldValueString.localeCompare(queryValueString) < 0
                break

              case '<=':
                show = fieldValueString.localeCompare(valueString) <= 0
                break

              default:
                break
            }
          }
        } else {
          show = true // If the query is not completed
        }

        if (!show) {
          return false // We return false if one of all queries doesn't match
        }

        return show
      })
    }
  }

  if (result !== undefined && sortField !== null) {
    result.sort(dynamicSort(sortField.value, sortOrientation, getSourceValue))
  }

  return result
}
