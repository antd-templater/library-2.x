<script>
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ACascader from 'ant-design-vue/es/cascader'
import Util from '@/util/base'

export default {
  name: 'SCascader',
  inheritAttrs: false,
  methods: {
    /**
     * @description 绑定作用域
     * @param {Object} obj
     * @returns {Object}
     */
    handleScope (obj) {
      const scope = { ...obj }
      const names = Object.keys(obj)
      for (const name of names) {
        if (Util.isFunction(scope[name])) {
          scope[name] = scope[name].bind(this)
        }
      }
      return scope
    },

    /**
     * @description 过滤选项组
     * @param {Array} opts
     * @returns {Array}
     */
    optionsRender (opts) {
      const col = this.$attrs.col
      const row = this.$attrs.row
      const form = this.$attrs.form
      const group = this.$attrs.group
      const option = this.$attrs.option
      const extender = this.$attrs.extender
      const children = []

      if (Util.isArray(opts)) {
        children.push(...opts)
      }

      if (Util.isNotEmptyArray(opts)) {
        if (Util.isObject(extender)) {
          if (Util.isFunction(extender.selectOptionsRender)) {
            const result = extender.selectOptionsRender(children, {
              option,
              col,
              row,
              group,
              form,
              Util
            })
            return Util.isArray(result) ? result : children
          }
        }
      }

      return children
    },

    /**
     * @description 选项禁用与否
     * @param {Object} opt
     * @returns {Boolean}
     */
    optionDisabled (opt) {
      const col = this.$attrs.col
      const row = this.$attrs.row
      const form = this.$attrs.form
      const group = this.$attrs.group
      const extender = this.$attrs.extender
      const children = []

      if (Util.isObject(opt)) {
        if (Util.isArray(opt.children)) {
          children.push(...opt.children)
        }
      }

      if (Util.isObject(extender)) {
        if (Util.isFunction(extender.selectOptionItemDisabled)) {
          const result = extender.selectOptionItemDisabled(opt, {
            children: children,
            col,
            row,
            group,
            form,
            Util
          })
          return Util.isBoolean(result) ? result : opt.disabled === true
        }
      }

      return opt.disabled === true
    },

    /**
     * @description 选项渲染与否
     * @param {Object} opt
     * @returns {Boolean}
     */
    optionRender (opt) {
      const col = this.$attrs.col
      const row = this.$attrs.row
      const form = this.$attrs.form
      const group = this.$attrs.group
      const extender = this.$attrs.extender
      const children = []

      if (Util.isObject(opt)) {
        if (Util.isArray(opt.children)) {
          children.push(...opt.children)
        }
      }

      if (Util.isObject(extender)) {
        if (Util.isFunction(extender.selectOptionItemRender)) {
          const result = extender.selectOptionItemRender(opt, {
            children: children,
            col,
            row,
            group,
            form,
            Util
          })
          return Util.isBoolean(result) ? result : opt.render !== false
        }
      }

      return opt.render !== false
    },

    /**
     * @description 选项显示与否
     * @param {Object} opt
     * @returns {Boolean}
     */
    optionShow (opt) {
      const col = this.$attrs.col
      const row = this.$attrs.row
      const form = this.$attrs.form
      const group = this.$attrs.group
      const extender = this.$attrs.extender
      const children = []

      if (Util.isObject(opt)) {
        if (Util.isArray(opt.children)) {
          children.push(...opt.children)
        }
      }

      if (Util.isObject(extender)) {
        if (Util.isFunction(extender.selectOptionItemShow)) {
          const result = extender.selectOptionItemShow(opt, {
            children: children,
            col,
            row,
            group,
            form,
            Util
          })
          return Util.isBoolean(result) ? result : opt.show !== false
        }
      }

      return opt.show !== false
    }
  },
  render () {
    const label = this.$attrs.label
    const field = this.$attrs.field
    const binds = this.$attrs.binds
    const events = this.$attrs.events
    const decorator = this.$attrs.decorator
    const classAttrs = this.$attrs.binds.class
    const styleAttrs = this.$attrs.binds.style
    const optionAttrs = this.$attrs.binds.options
    const selectOptions = this.$attrs.extender.selectOptions
    const optionsNodes = optionAttrs || selectOptions || []

    const replaceFields = Object.assign(
      {
        key: 'value',
        label: 'label',
        value: 'value',
        children: 'children'
      },
      binds.replaceFields,
      binds.fieldNames
    )

    const handleScope = this.handleScope
    const optionsRender = this.optionsRender
    const optionDisabled = this.optionDisabled
    const optionRender = this.optionRender

    const createOptions = nodes => {
      return optionsRender(nodes)
        .filter(node => optionRender(node))
        .map(node => ({
          ...node,
          disabled: optionDisabled(node),
          children: Util.isArray(node[replaceFields.children])
            ? createOptions(node[replaceFields.children])
            : undefined
        }))
    }

    return (
      <AFormItem label={label}>
        <ACascader
          ref="component"
          v-decorator={[field, decorator]}
          attrs={handleScope(binds)}
          on={handleScope(events)}
          class={classAttrs}
          style={styleAttrs}
          fieldNames={replaceFields}
          options={createOptions(optionsNodes)}
        />
      </AFormItem>
    )
  }
}
</script>

<style lang="less">
[off-disabled] {
  .ant-cascader-picker[disabled],
  .ant-cascader-picker-disabled {
    color: rgba(0, 0, 0, 0.65);
    background-color: #ffffff;
    cursor: default;
    opacity: 1;
  }
}
</style>
