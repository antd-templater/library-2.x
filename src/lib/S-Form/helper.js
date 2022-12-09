import Util from '@/util/base'

/**
 * @description 校验器
 */
export const validator = {
  number (options) {
    const rule = {}
    const pattern = options.pattern
    const message = options.message
    const validator = options.validator

    if (Util.isObject(options)) {
      Object.assign(rule, options)
    }

    if (Util.isString(validator)) {
      if (!Util.isRegExp(pattern)) {
        Object.assign(rule, {
          pattern: /^[+-]?\d+\.?\d*$/i
        })
      }
      rule.validator = (rule, value, callback) => {
        if (!value && value !== 0) {
          if (rule.required !== true) {
            return callback()
          }
          return callback(new Error(message || '该项必填'))
        }
        if (!rule.pattern.test(value)) {
          return callback(new Error(validator || message || '格式有误'))
        }
        return callback()
      }
      Object.assign(rule, { message: undefined })
    }
    return rule
  },
  password (options) {
    const rule = {}
    const pattern = options.pattern
    const message = options.message
    const validator = options.validator

    if (Util.isObject(options)) {
      Object.assign(rule, options)
    }

    if (Util.isString(validator)) {
      if (!Util.isRegExp(pattern)) {
        Object.assign(rule, {
          pattern: /.{6,}/iu
        })
      }
      rule.validator = (rule, value, callback) => {
        if (!value && value !== 0) {
          if (rule.required !== true) {
            return callback()
          }
          return callback(new Error(message || '密码必填'))
        }
        if (!rule.pattern.test(value)) {
          return callback(new Error(validator || message || '密码过短'))
        }
        return callback()
      }
      Object.assign(rule, { message: undefined })
    }
    return rule
  }
}

/**
 * @description 扩展器
 */
export const extender = {
  groups (groups = [], fn = null, options = {}) {
    if (Util.isFunction(fn)) {
      let region = { type: 'AGroup' }
      const clones = Util.toDeepClone(groups)
      const entries = groups.entries()
      for (const [index, group] of entries) {
        group.type === 'AGroup'
          ? (region = Util.toDeepClone(group))
          : (region = Util.toDeepClone(region))

        const result = fn(group, index, clones, region)

        if (Util.isObject(result)) {
          const clone = clones[index]
          const part = Util.toDeepClone(result)
          Object.assign(group, result)
          Object.assign(clone, part)
        }
      }
    }
    return groups
  },
  options (groups = [], fn = null, options = {}) {
    if (Util.isFunction(fn)) {
      let region = { type: 'AGroup' }
      const clones = Util.toDeepClone(groups)
      const entries = groups.entries()
      for (const [index, group] of entries) {
        group.type === 'AGroup'
          ? (region = Util.toDeepClone(group))
          : (region = Util.toDeepClone(region))

        const result = fn(group, index, clones, region)

        if (Util.isObject(result)) {
          if (group.field) {
            options[group.field] = Object.assign(
              options[group.field] || {},
              result
            )
          }
        }
      }
    }
    return options
  }
}
