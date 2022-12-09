import moment from 'moment'

/**
 * @description 组件默认配置
 */
export default {
  ARate: {
    type: 'ARate',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      ouput: ''
    },
    transfer: {
      input (value, { Util }) {
        return value && Util.isNumber(+value) ? +value : ''
      },
      output (value, { Util }) {
        return value && Util.isNumber(+value) ? +value : ''
      }
    },
    grid: {}
  },

  AInput: {
    type: 'AInput',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      ouput: ''
    },
    transfer: {
      input (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      },
      output (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  ASwitch: {
    type: 'ASwitch',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: false,
      output: ''
    },
    transfer: {
      input (value, { Util }) {
        if (Util.isBoolean(value)) {
          return value
        }
        return ['Y', 'y'].includes(value)
      },
      output (value, { Util }) {
        return value === true ? 'Y' : 'N'
      }
    },
    grid: {}
  },

  ASelect: {
    type: 'ASelect',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input ({ Util, col }) {
        return ['multiple', 'combobox'].includes(col.attrs.mode) ? [] : undefined
      },
      output: undefined
    },
    transfer: {
      input (value, { Util, col }) {
        if (['multiple', 'combobox'].includes(col.attrs.mode)) {
          if (Util.isString(value)) {
            return value.trim() ? value.trim().split(',') : []
          }
          return Util.isArray(value) ? value : []
        }
        return Util.isNumber(value) || Util.isString(value) ? value : undefined
      },
      output (value, { Util, col }) {
        if (['multiple', 'combobox'].includes(col.attrs.mode)) {
          if (Util.isArray(value)) {
            return value.join(',')
          }
          return Util.isString(value) ? value.trim() : ''
        }
        return Util.isNumber(value) || Util.isString(value) ? value : undefined
      }
    },
    grid: {}
  },

  ATreeSelect: {
    type: 'ATreeSelect',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input ({ Util, col }) {
        return col.attrs.multiple === true ? [] : undefined
      },
      output: ''
    },
    transfer: {
      input (value, { Util, col }) {
        if (col.attrs.multiple === true) {
          if (Util.isString(value)) {
            return value.trim() ? value.trim().split(',') : []
          }
          return Util.isArray(value) ? value : []
        }
        return Util.isNumber(value) || Util.isString(value) ? value : undefined
      },
      output (value, { Util, col }) {
        if (col.attrs.multiple === true) {
          if (Util.isArray(value)) {
            return value.join(',')
          }
          return Util.isString(value) ? value.trim() : ''
        }
        return Util.isNumber(value) || Util.isString(value) ? value : undefined
      }
    },
    grid: {}
  },

  ARadioGroup: {
    type: 'ARadioGroup',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      output: ''
    },
    transfer: {
      input (value, { Util, col }) {
        return value !== undefined && value !== null ? value : ''
      },
      output (value, { Util, col }) {
        return value !== undefined && value !== null ? value : ''
      }
    },
    grid: {}
  },

  ACheckboxGroup: {
    type: 'ACheckboxGroup',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input ({ Util, col }) {
        return []
      },
      output: ''
    },
    transfer: {
      input (value, { Util, col }) {
        if (Util.isString(value)) {
          return value.trim() ? value.trim().split(',') : []
        }
        return Util.isArray(value) ? value : []
      },
      output (value, { Util, col }) {
        if (Util.isArray(value)) {
          return value.join(',')
        }
        return Util.isString(value) ? value.trim() : ''
      }
    },
    grid: {}
  },

  AInputPassword: {
    type: 'AInputPassword',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      ouput: ''
    },
    transfer: {
      input (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      },
      output (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  AAutoComplete: {
    type: 'AAutoComplete',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      ouput: ''
    },
    transfer: {
      input (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      },
      output (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  AInputNumber: {
    type: 'AInputNumber',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      ouput: ''
    },
    transfer: {
      input (value, { Util }) {
        return value && Util.isNumber(+value) ? +value : ''
      },
      output (value, { Util }) {
        return value && Util.isNumber(+value) ? +value : ''
      }
    },
    grid: {}
  },

  ARangePicker: {
    type: 'ARangePicker',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: [],
      output: []
    },
    transfer: {
      input (value, { Util, col }) {
        if (Util.isArray(value)) {
          return value
            .filter(every => Util.isString(every))
            .map(every => Util.isString(every)
              ? moment(every, col.attrs.format || 'YYYY-MM-DD')
              : null
            )
        }
        return []
      },
      output (value, { Util, col }) {
        if (Util.isArray(value)) {
          return value.map(every =>
            Util.isObject(every)
              ? every.format(col.attrs.valueFormat || col.attrs.format || 'YYYY-MM-DD')
              : ''
          )
        }
        return []
      }
    },
    grid: {}
  },

  AYearPicker: {
    type: 'AYearPicker',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: null,
      output: ''
    },
    transfer: {
      input (value, { Util, col }) {
        if (value === undefined || Util.isNumber(value) || Util.isString(value)) {
          if (value) {
            return moment(value, col.attrs.format || 'YYYY')
          }
          return null
        }
        return value
      },
      output (value, { Util, col }) {
        if (Util.isObject(value)) {
          return value.format(col.attrs.valueFormat || col.attrs.format || 'YYYY')
        }
        return Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  AMonthPicker: {
    type: 'AMonthPicker',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: null,
      output: ''
    },
    transfer: {
      input (value, { Util, col }) {
        if (value === undefined || Util.isNumber(value) || Util.isString(value)) {
          if (value) {
            return moment(value, col.attrs.format || 'YYYY-MM')
          }
          return null
        }
        return value
      },
      output (value, { Util, col }) {
        if (Util.isObject(value)) {
          return value.format(col.attrs.valueFormat || col.attrs.format || 'YYYY-MM')
        }
        return Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  ADatePicker: {
    type: 'ADatePicker',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: null,
      output: ''
    },
    transfer: {
      input (value, { Util, col }) {
        if (value === undefined || Util.isNumber(value) || Util.isString(value)) {
          if (value) {
            return moment(value, col.attrs.format || (col.attrs.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'))
          }
          return null
        }
        return value
      },
      output (value, { Util, col }) {
        if (Util.isObject(value)) {
          return value.format(col.attrs.valueFormat || col.attrs.format || (col.attrs.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'))
        }
        return Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  ATimePicker: {
    type: 'ATimePicker',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: null,
      output: ''
    },
    transfer: {
      input (value, { Util, col }) {
        if (value === undefined || Util.isNumber(value) || Util.isString(value)) {
          if (value) {
            return moment(value, col.attrs.format || (col.attrs.use12Hours ? 'h:mm:ss' : 'HH:mm:ss'))
          }
          return null
        }
        return value
      },
      output (value, { Util, col }) {
        if (Util.isObject(value)) {
          return value.format(col.attrs.valueFormat || col.attrs.format || (col.attrs.use12Hours ? 'h:mm:ss' : 'HH:mm:ss'))
        }
        return Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  ATextarea: {
    type: 'ATextarea',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      output: ''
    },
    transfer: {
      input (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      },
      output (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  ACascader: {
    type: 'ACascader',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: [],
      ouput: ''
    },
    transfer: {
      input (value, { Util, col }) {
        if (Util.isArray(value)) {
          return value
        }
        if (Util.isString(value)) {
          return value.split(col.attrs.separator || '/')
        }
        return []
      },
      output (value, { Util, col }) {
        if (Util.isArray(value)) {
          return value.join(col.attrs.separator || '/')
        }
        return Util.isString(value) ? value : ''
      }
    },
    grid: {}
  },

  ASearch: {
    type: 'ASearch',
    slot: '',
    field: '',
    label: '',
    decorator: {},
    attrs: {},
    events: {},
    default: {
      input: '',
      ouput: ''
    },
    transfer: {
      input (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      },
      output (value, { Util }) {
        return Util.isNumber(value) || Util.isString(value) ? value : ''
      }
    },
    grid: {}
  }
}
