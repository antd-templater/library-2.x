<template>
  <div class="s-form-container">
    <a-spin :spinning="spinning">
      <a-form
        :form="sForm"
        v-bind="handleFormBind(form)"
      >
        <slot
          name="before"
          :options="options"
          :form="form"
        />
        <div
          class="s-form-group-container"
          v-show="handleShowGroup(groupItem, form)"
          v-for="(groupItem, groupIndex) of sGroups"
          v-bind="handleGroupBind(groupItem, form)"
          :key="groupIndex"
        >
          <template v-if="handleRenderGroup(groupItem, form)">
            <div
              v-if="!!groupItem.title || !!groupItem.slot"
              class="s-form-group-item-header"
            >
              <slot
                :name="groupItem.slot"
                :options="options"
                :group-index="groupIndex"
                :group-data="groupItem"
                :group="groupItem"
                :index="groupIndex"
                :item="groupItem"
                :form="form"
              >
                <div class="s-form-group-item-header-title">
                  {{ groupItem.title }}
                </div>
              </slot>
            </div>
            <div class="s-form-group-item-content">
              <div
                v-show="handleShowRowItem(rowItem, groupItem, form)"
                v-for="(rowItem, rowIndex) in groupItem.items"
                :key="rowIndex"
              >
                <template v-if="handleRenderRowItem(rowItem, groupItem, form)">
                  <a-row v-bind="handleRowGridBind(rowItem, groupItem, form)">
                    <a-col
                      v-show="handleShowColItem(colItem, rowItem, groupItem, form)"
                      v-bind="handleColGridBind(colItem, rowItem, groupItem, form)"
                      v-for="(colItem, colIndex) of rowItem.items"
                      :key="colIndex"
                    >
                      <template v-if="handleRenderColItem(colItem, rowItem, groupItem, form)">
                        <div
                          class="s-form-group-item-template"
                          v-bind="handleColStateBind(colItem, rowItem, groupItem, form)"
                        >
                          <slot
                            :name="colItem.slot"
                            :type="colItem.type"
                            :field="colItem.field"
                            :label="colItem.label"
                            :decorator="colItem.decorator"
                            :binds="handleTemplateBind(colItem, rowItem, groupItem, form)"
                            :events="handleTemplateEvent(colItem, rowItem, groupItem, form)"
                            :extender="handleTemplateExtender(colItem, rowItem, groupItem, form)"
                            :groupIndex="groupIndex"
                            :groupData="groupItem"
                            :group="groupItem"
                            :rowIndex="rowIndex"
                            :rowData="rowItem"
                            :row="rowItem"
                            :colIndex="colIndex"
                            :colData="colItem"
                            :col="colItem"
                            :index="colIndex"
                            :item="colItem"
                            :form="form"
                          >
                            <s-form-item
                              :type="colItem.type"
                              :field="colItem.field"
                              :label="colItem.label"
                              :decorator="colItem.decorator"
                              :binds="handleTemplateBind(colItem, rowItem, groupItem, form)"
                              :events="handleTemplateEvent(colItem, rowItem, groupItem, form)"
                              :extender="handleTemplateExtender(colItem, rowItem, groupItem, form)"
                              :group="groupItem"
                              :row="rowItem"
                              :col="colItem"
                              :item="colItem"
                              :form="form"
                            />
                          </slot>
                        </div>
                      </template>
                    </a-col>
                  </a-row>
                </template>
              </div>
            </div>
          </template>
        </div>

        <slot
          name="after"
          :options="options"
          :form="form"
        />
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import SFormItem from './Item.vue'
import Initial from './initial'
import Util from '@/util/base'

export default {
  name: 'SForm',
  components: {
    SFormItem
  },
  props: {
    // 表单布局
    grid: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 表单监听事件
    watch: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 表单属性
    attrs: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 表单分组选项
    groups: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 表单扩展配置
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 表单禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 表单只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 表单loading
    spinning: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sForm: this.$form.createForm(this, this.handleWatch()),
      sGroups: [],
      sItems: []
    }
  },
  computed: {
    form () {
      return this
    }
  },
  watch: {
    // 表单配置处理
    groups: {
      handler (groups) {
        if (Util.isArray(groups)) {
          this.handleGroups()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     * @description 处理监听回调
     * @returns {Object}
     */
    handleWatch () {
      if (Util.isObject(this.watch)) {
        for (const key of Object.keys(this.watch)) {
          if (Util.isFunction(this.watch[key])) {
            Object.assign(this.watch, {
              [key]: this.watch[key].bind(this)
            })
          }
        }
      }
      return {
        ...this.watch,
        onFieldsChange: (...rest) => {
          if (Util.isFunction(this.watch.onFieldsChange)) {
            this.watch.onFieldsChange(...rest)
          }
        }
      }
    },

    /**
     * @description 进行表单配置
     * @returns {Array}
     */
    handleGroups () {
      this.sGroups = []
      this.sItems = []
      let group = {
        type: 'AGroup',
        slot: '',
        field: '',
        title: '',
        attrs: {
          disabled: false,
          readonly: false
        },
        items: [],
        grid: {}
      }
      for (const node of this.groups) {
        if (Util.isObject(node)) {
          if (node.type === 'AGroup') {
            const disabled = Util.isObject(node.attrs) && node.attrs.disabled === true
            const readonly = Util.isObject(node.attrs) && node.attrs.readonly === true
            const attrs = { disabled, readonly }
            group = {
              type: 'AGroup',
              slot: (Util.isString(node.slot) && node.slot) || '',
              field: (Util.isString(node.field) && node.field) || '',
              title: (Util.isString(node.title) && node.title) || '',
              attrs: Util.isObject(node.attrs) ? { ...node.attrs, ...attrs } : { ...attrs },
              items: Util.isArray(node.items) ? [...node.items] : [],
              grid: Util.isObject(node.grid) ? { ...node.grid } : {},
              render: node.render,
              show: node.show
            }
            this.sGroups.push(group)
          } else {
            if (!this.sGroups.includes(group)) {
              this.sGroups.push(group)
            }
            group.items.push(node)
          }
        }
      }
      for (const item of this.sGroups) {
        this.handleEverys(item)
      }
      return this.sGroups
    },

    /**
     * @description 进行表单分组
     * @param {Array} group
     * @returns {Array}
     */
    handleEverys (group) {
      let row = {
        grid: {},
        items: []
      }
      const oldItems = group.items || []
      const newItems = (group.items = [])
      for (const oldItem of oldItems) {
        if (Util.isObject(oldItem)) {
          if (Util.isObject(oldItem.grid)) {
            if (oldItem.grid.newline === true) {
              row = {
                grid: {},
                items: []
              }
            }
          }
          if (!newItems.includes(row)) {
            newItems.push(row)
          }
          if (Util.isObject(Initial[oldItem.type])) {
            const col = Util.toDeepClone({}, Initial[oldItem.type], oldItem)
            const item = Util.toDeepClone({}, Initial[oldItem.type], oldItem)
            this.sItems.push(
              Object.assign(item, {
                group,
                row,
                col
              })
            )
            row.items.push(col)
          }
        }
      }
      return group
    },

    /**
     * @description 计算渲染/显示
     * @param {Array} items
     * @returns {Array}
     */
    handleCompute (items) {
      if (!Util.isArray(items)) {
        items = this.sItems
      }
      const form = this.form
      const options = this.options
      for (const item of items) {
        const col = item.col
        const row = item.row
        const group = item.group
        const field = item.field
        const configs = options[field]

        if (![true, false].includes(col.render)) {
          if (Util.isObject(configs)) {
            Util.isFunction(configs.handleRender)
              ? (item.render =
                  configs.handleRender(col, {
                    col,
                    row,
                    group,
                    form,
                    Util
                  }) !== false)
              : configs.handleRender !== undefined
                ? (item.render = configs.handleRender !== false)
                : (item.render = undefined)
          }
          if (item.render === undefined) {
            Util.isFunction(col.render)
              ? (item.render = col.render(col, { col, row, group, form, Util }) !== false)
              : (item.render = col.render !== false)
          }
        }

        if (![true, false].includes(col.show)) {
          if (Util.isObject(configs)) {
            Util.isFunction(configs.handleShow)
              ? (item.show = configs.handleShow(col, { col, row, group, form, Util }) !== false)
              : configs.handleShow !== undefined
                ? (item.show = configs.handleShow !== false)
                : (item.show = undefined)
          }
          if (item.show === undefined) {
            Util.isFunction(col.show)
              ? (item.show = col.show(col, { col, row, group, form, Util }) !== false)
              : (item.show = col.show !== false)
          }
        }

        if (item.render === undefined) {
          item.render = col.render
        }

        if (item.show === undefined) {
          item.show = col.show
        }
      }
      return items
    },

    /**
     * @description 表单属性绑定
     * @param {Object} form
     * @returns {Object}
     */
    handleFormBind (form) {
      const disabled = [form.disabled].includes(true)
      const readonly = [form.readonly].includes(true)
      return {
        ...form.attrs,
        disabled: readonly || disabled,
        'off-disabled': readonly && !disabled
      }
    },

    /**
     * @description 分组属性绑定
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleGroupBind (group, form) {
      const disabled = [form.disabled, group.attrs.disabled].includes(true)
      const readonly = [form.readonly, group.attrs.readonly].includes(true)
      return {
        ...group.attrs,
        disabled: readonly || disabled,
        'off-disabled': readonly && !disabled
      }
    },

    /**
     * @description 进行分组显示
     * @param {Object} group
     * @param {Object} form
     * @returns {Boolean}
     */
    handleShowGroup (group, form) {
      const field = group.field
      const options = this.options
      const configs = options[field]

      if (group.show === false) {
        return false
      }

      if (group.show === undefined) {
        if (Util.isObject(configs) && Util.isFunction(configs.handleShow)) {
          if (configs.handleShow(group, { group, form, Util }) === false) {
            return false
          }
        }
      }

      if (Util.isFunction(group.show)) {
        if (group.show(group, { group, form, Util }) === false) {
          return false
        }
      }

      this.handleCompute(this.sItems)

      for (const row of group.items) {
        if (Util.isObject(row)) {
          if (Util.isArray(row.items)) {
            for (const col of row.items) {
              if (Util.isObject(col)) {
                if (this.sItems.some(item => item.field === col.field)) {
                  if (this.sItems.find(item => item.field === col.field).show === true) {
                    return true
                  }
                }
              }
            }
          }
        }
      }
      return false
    },

    /**
     * @description 进行分组渲染
     * @param {Object} group
     * @param {Object} form
     * @returns {Boolean}
     */
    handleRenderGroup (group, form) {
      const field = group.field
      const options = this.options
      const configs = options[field]

      if (group.render === false) {
        return false
      }

      if (group.render === undefined) {
        if (Util.isObject(configs) && Util.isFunction(configs.handleRender)) {
          if (configs.handleRender(group, { group, form, Util }) === false) {
            return false
          }
        }
      }

      if (Util.isFunction(group.render)) {
        if (group.render(group, { group, form, Util }) === false) {
          return false
        }
      }

      this.handleCompute(this.sItems)

      for (const row of group.items) {
        if (Util.isObject(row)) {
          if (Util.isArray(row.items)) {
            for (const col of row.items) {
              if (Util.isObject(col)) {
                if (this.sItems.some(item => item.field === col.field)) {
                  if (this.sItems.find(item => item.field === col.field).render === true) {
                    return true
                  }
                }
              }
            }
          }
        }
      }
      return false
    },

    /**
     * @description 行布局绑定
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleRowGridBind (row, group, form) {
      const rowAttr = {}
      const setAttr = grid => {
        const type = grid.type
        const align = grid.align
        const gutter = grid.gutter
        const justify = grid.justify
        const classes = grid.class
        const styles = grid.style
        if (['flex'].includes(type)) {
          rowAttr.type = type
        }
        if (['top', 'middle', 'bottom'].includes(align)) {
          rowAttr.align = align
        }
        if (Util.isObject(gutter) || Util.isArray(gutter) || Util.isNumber(gutter)) {
          rowAttr.gutter = gutter
        }
        if (['start', 'end', 'center', 'space-around', 'space-between'].includes(justify)) {
          rowAttr.justify = justify
        }
        if (Util.isString(classes) || Util.isObject(classes) || Util.isArray(classes)) {
          rowAttr.class = classes
        }
        if (Util.isString(styles) || Util.isObject(styles)) {
          rowAttr.style = styles
        }
      }
      if (Util.isObject(form) && Util.isObject(form.grid)) {
        setAttr(form.grid)
      }
      if (Util.isObject(group) && Util.isObject(group.grid)) {
        setAttr(group.grid)
      }
      if (Util.isObject(row) && Util.isObject(row.grid)) {
        setAttr(row.grid)
      }
      return rowAttr
    },

    /**
     * @description 进行行显示
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Boolean}
     */
    handleShowRowItem (row, group, form) {
      for (const col of row.items) {
        if (Util.isObject(col)) {
          if (this.sItems.some(item => item.field === col.field)) {
            if (this.sItems.find(item => item.field === col.field).show === true) {
              return true
            }
          }
        }
      }
      return false
    },

    /**
     * @description 进行行渲染
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Boolean}
     */
    handleRenderRowItem (row, group, form) {
      for (const col of row.items) {
        if (Util.isObject(col)) {
          if (this.sItems.some(item => item.field === col.field)) {
            if (this.sItems.find(item => item.field === col.field).render === true) {
              return true
            }
          }
        }
      }
      return false
    },

    /**
     * @description 列布局绑定
     * @param {Object} col
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleColGridBind (col, row, group, form) {
      const colAttr = {}
      const setAttr = grid => {
        const flex = grid.flex
        const offset = grid.offset
        const order = grid.order
        const pull = grid.pull
        const push = grid.push
        const span = grid.span
        const xs = grid.xs
        const sm = grid.sm
        const md = grid.md
        const lg = grid.lg
        const xl = grid.xl
        const xxl = grid.xxl
        const styles = grid.style
        const classes = grid.class
        if (Util.isNumber(flex) || Util.isString(flex)) {
          colAttr.flex = flex
        }
        if (Util.isNumber(offset)) {
          colAttr.offset = offset
        }
        if (Util.isNumber(order)) {
          colAttr.order = order
        }
        if (Util.isNumber(pull)) {
          colAttr.pull = pull
        }
        if (Util.isNumber(push)) {
          colAttr.push = push
        }
        if (Util.isNumber(span)) {
          colAttr.span = span
        }
        if (Util.isNumber(xs) || Util.isObject(xs)) {
          colAttr.xs = xs
        }
        if (Util.isNumber(sm) || Util.isObject(sm)) {
          colAttr.sm = sm
        }
        if (Util.isNumber(md) || Util.isObject(md)) {
          colAttr.md = md
        }
        if (Util.isNumber(lg) || Util.isObject(lg)) {
          colAttr.lg = lg
        }
        if (Util.isNumber(xl) || Util.isObject(xl)) {
          colAttr.xl = xl
        }
        if (Util.isNumber(xxl) || Util.isObject(xxl)) {
          colAttr.xxl = xxl
        }
        if (Util.isString(styles) || Util.isObject(styles)) {
          colAttr.style = styles
        }
        if (Util.isString(classes) || Util.isObject(classes) || Util.isArray(classes)) {
          colAttr.class = classes
        }
      }
      if (Util.isObject(form) && Util.isObject(form.grid)) {
        setAttr(form.grid)
      }
      if (Util.isObject(group) && Util.isObject(group.grid)) {
        setAttr(group.grid)
      }
      if (Util.isObject(row) && Util.isObject(row.grid)) {
        setAttr(row.grid)
      }
      if (Util.isObject(col) && Util.isObject(col.grid)) {
        setAttr(col.grid)
      }
      return colAttr
    },

    /**
     * @description 进行列显示
     * @param {Object} col
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleShowColItem (col, row, group, form) {
      if (Util.isObject(col)) {
        if (this.sItems.some(item => item.field === col.field)) {
          if (this.sItems.find(item => item.field === col.field).show === true) {
            return true
          }
        }
      }
      return false
    },

    /**
     * @description 进行列渲染
     * @param {Object} col
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleRenderColItem (col, row, group, form) {
      if (Util.isObject(col)) {
        if (this.sItems.some(item => item.field === col.field)) {
          if (this.sItems.find(item => item.field === col.field).render === true) {
            return true
          }
        }
      }
      return false
    },

    /**
     * @description 状态绑定
     * @param {Object} col
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleColStateBind (col, row, group, form) {
      const field = col.field
      const options = this.options || {}
      const configs = options[field] || {}
      const mixins = { attrs: {} }

      if (Util.isFunction(configs.handleAttrs)) {
        mixins.attrs = configs.handleAttrs(col, {
          col,
          row,
          group,
          form,
          Util
        })
      }

      if (Util.isObject(configs.handleAttrs)) {
        mixins.attrs = configs.handleAttrs
      }

      if (!Util.isObject(mixins.attrs)) {
        mixins.attrs = {}
      }

      const disabled = [
        form.disabled,
        group.attrs.disabled,
        Object.assign({}, col.attrs, mixins.attrs).disabled
      ].includes(true)

      const readonly = [
        form.readonly,
        group.attrs.readonly,
        Object.assign({}, col.attrs, mixins.attrs).readonly
      ].includes(true)

      return {
        disabled: readonly || disabled,
        'off-disabled': readonly && !disabled
      }
    },

    /**
     * @description 组件绑定属性
     * @param {Object} col
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleTemplateBind (col, row, group, form) {
      const field = col.field
      const options = this.options || {}
      const configs = options[field] || {}
      const mixins = {}
      const attrs = {}

      if (Util.isFunction(configs.handleAttrs)) {
        mixins.attrs = configs.handleAttrs(col, {
          col,
          row,
          group,
          form,
          Util
        })
      }

      if (Util.isObject(configs.handleAttrs)) {
        mixins.attrs = configs.handleAttrs
      }

      if (!Util.isObject(mixins.attrs)) {
        mixins.attrs = {}
      }

      const disabled = [
        form.disabled,
        group.attrs.disabled,
        Object.assign({}, col.attrs, mixins.attrs).disabled
      ].includes(true)

      const readonly = [
        form.readonly,
        group.attrs.readonly,
        Object.assign({}, col.attrs, mixins.attrs).readonly
      ].includes(true)

      return Object.assign(attrs, {
        ...col.attrs,
        ...mixins.attrs,
        disabled: readonly || disabled
      })
    },

    /**
     * @description 组件绑定事件
     * @param {Object} col
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleTemplateEvent (col, row, group, form) {
      const field = col.field
      const options = this.options || {}
      const configs = options[field] || {}
      const events = { ...col.events }

      if (Util.isObject(configs) && Util.isObject(configs.handleEvents)) {
        Object.assign(events, {
          ...configs.handleEvents
        })
      }

      return events
    },

    /**
     * @description 组件扩展属性
     * @param {Object} col
     * @param {Object} row
     * @param {Object} group
     * @param {Object} form
     * @returns {Object}
     */
    handleTemplateExtender (col, row, group, form) {
      const field = col.field
      const options = this.options || {}
      const configs = options[field] || {}
      const extender = { ...configs }

      if (Util.isObject(configs) && Util.isFunction(configs.selectOptions)) {
        Object.assign(extender, {
          selectOptions: configs.selectOptions(col, {
            col,
            row,
            group,
            form,
            Util
          })
        })
      }

      return extender
    },

    /**
     * @description 表单取值
     * @param {String} field
     * @param {Object} base
     * @returns {String}
     */
    getFieldValue (field, base = {}) {
      if (Util.isString(field) && !!field.trim()) {
        // 初始化
        const form = this.form
        const sForm = this.sForm
        const sItems = this.sItems
        const fieldsValue = { [field]: sForm.getFieldValue(field) }

        // 遍历处理
        if (sItems.some(item => item.field === field)) {
          const item = sItems.find(item => item.field === field)
          const itemDefault = item.default
          const itemTransfer = item.transfer
          const baseValue = base[field]
          let outputDefValue

          if (fieldsValue[field] === undefined) {
            if (Util.isObject(itemDefault)) {
              const col = item.col
              const row = item.row
              const group = item.group
              Util.isFunction(itemDefault.output)
                ? (outputDefValue = itemDefault.output({
                  col,
                  row,
                  group,
                  form,
                  Util
                }))
                : (outputDefValue = itemDefault.output)
            }

            if (outputDefValue !== undefined) {
              fieldsValue[field] = outputDefValue
            }

            if (baseValue !== undefined) {
              fieldsValue[field] = baseValue
            }
          }

          if (Util.isObject(itemTransfer)) {
            if (Util.isFunction(itemTransfer.output)) {
              const col = item.col
              const row = item.row
              const group = item.group
              fieldsValue[field] = itemTransfer.output(fieldsValue[field], {
                col,
                row,
                group,
                form,
                Util
              })
            }
          }
        }

        // 返回数据
        return fieldsValue[field]
      }
    },

    /**
     * @description 表单取值
     * @param {Array} fields
     * @param {Object} base
     * @returns {Object}
     */
    getFieldsValue (fields = [], base = {}) {
      // 兼容处理
      if (Util.isObject(fields)) {
        base = fields
        fields = undefined
      }

      // 初始化
      let fieldsValue = {}
      const form = this.form
      const sForm = this.sForm
      const sItems = this.sItems

      // 预处理
      Util.isNotEmptyArray(fields)
        ? (fieldsValue = sForm.getFieldsValue(fields))
        : (fieldsValue = sForm.getFieldsValue())

      // 遍历处理
      for (const field of Object.keys(fieldsValue)) {
        if (sItems.some(item => item.field === field)) {
          const item = sItems.find(item => item.field === field)
          const itemField = item.field
          const itemDefault = item.default
          const itemTransfer = item.transfer
          const baseValue = base[itemField]
          let outputDefValue

          if (fieldsValue[field] === undefined) {
            if (Util.isObject(itemDefault)) {
              const col = item.col
              const row = item.row
              const group = item.group
              Util.isFunction(itemDefault.output)
                ? (outputDefValue = itemDefault.output({
                  col,
                  row,
                  group,
                  form,
                  Util
                }))
                : (outputDefValue = itemDefault.output)
            }

            if (outputDefValue !== undefined) {
              fieldsValue[itemField] = outputDefValue
            }

            if (baseValue !== undefined) {
              fieldsValue[itemField] = baseValue
            }
          }

          if (Util.isObject(itemTransfer)) {
            if (Util.isFunction(itemTransfer.output)) {
              const col = item.col
              const row = item.row
              const group = item.group
              fieldsValue[itemField] = itemTransfer.output(fieldsValue[itemField], {
                col,
                row,
                group,
                form,
                Util
              })
            }
          }
        }
      }

      // 返回数据
      return fieldsValue
    },

    /**
     * @description 表单赋值
     * @param {Object} data
     * @param {Object} base
     * @returns {undefined}
     */
    setFieldsValue (data = {}, base = {}) {
      if (Util.isObject(data)) {
        // 初始化
        let fieldsKeys = []
        const fieldsValue = {}
        const form = this.form
        const sForm = this.sForm
        const sItems = this.sItems
        const sFilter = sItems.filter(item => item.field)
        const sKeys = sFilter.map(item => item.field)

        // 预处理
        Util.isNotEmptyObject(data)
          ? (fieldsKeys = Object.keys(data).filter(field => sKeys.includes(field)))
          : (fieldsKeys = sFilter.map(item => item.field))

        // 遍历处理
        for (const field of fieldsKeys) {
          if (sItems.some(item => item.field === field)) {
            const item = sItems.find(item => item.field === field)
            const itemField = item.field
            const itemDefault = item.default
            const itemTransfer = item.transfer
            const baseValue = base[itemField]
            const dataValue = data[itemField]
            let inputDefValue

            // 未定义
            fieldsValue[itemField] = undefined

            if (Util.isObject(itemDefault)) {
              const col = item.col
              const row = item.row
              const group = item.group
              Util.isFunction(itemDefault.input)
                ? (inputDefValue = itemDefault.input({
                  col,
                  row,
                  group,
                  form,
                  Util
                }))
                : (inputDefValue = itemDefault.input)
            }

            if (inputDefValue !== undefined) {
              fieldsValue[itemField] = inputDefValue
            }

            if (baseValue !== undefined) {
              fieldsValue[itemField] = baseValue
            }

            if (dataValue !== undefined) {
              fieldsValue[itemField] = dataValue
            }

            if (Util.isObject(itemTransfer)) {
              if (Util.isFunction(itemTransfer.input)) {
                const col = item.col
                const row = item.row
                const group = item.group
                fieldsValue[itemField] = itemTransfer.input(fieldsValue[itemField], {
                  col,
                  row,
                  group,
                  form,
                  Util
                })
              }
            }
          }
        }

        sForm.setFieldsValue({
          ...fieldsValue
        })
      }
    },

    /**
     * @description 表单校验
     * @param {Function}
     * @returns {undefined}
     */
    validateFieldsAndScroll () {
      this.sForm.validateFieldsAndScroll(...arguments)
    },

    /**
     * @description 表单校验
     * @param {Function}
     * @returns {undefined}
     */
    validateFields () {
      this.sForm.validateFields(...arguments)
    },

    /**
     * @description 表单重置
     * @param {Array}
     * @returns {undefined}
     */
    resetFields () {
      this.sForm.resetFields(...arguments)
    }
  }
}
</script>

<style lang="less" scoped>
.s-form-container::v-deep {
  width: 100%;
  height: auto;

  .s-form-group-container {
    width: 100%;
    height: auto;

    &[border='no'] {
      & > .s-form-group-item-header {
        border-bottom: none;
      }
    }

    & > .s-form-group-item-header {
      display: flex;
      width: 100%;
      padding-left: 5px;
      margin: 12px 0;
      line-height: 30px;
      font-size: 13px;
      color: #303133;
      border-bottom: dashed 1px #e8e8e8;

      & > .s-form-group-item-header-title {
        flex: 1 1 auto;
        font-size: 14px;
        font-weight: 600;
        color: #808399;
        padding-left: 8px;
        line-height: 32px;
      }
    }

    & > .s-form-group-item-content {
      padding: 0 3px;
      margin-bottom: 10px;

      .s-form-group-item-template {
        width: 100%;
        height: auto;
      }
    }
  }

  .ant-form {
    &.ant-form-inline,
    &.ant-form-vertical,
    &.ant-form-horizontal {
      .ant-form-item {
        width: 100%;
        display: flex;
        margin-bottom: 16px;

        & > .ant-form-item-label {
          width: auto;
          flex: 0 0 auto;
          color: #30323c;
          font-family: PingFangSC-Semibold, PingFang SC;
          display: inline-block;
        }

        & > .ant-form-item-control-wrapper {
          width: 100%;
          flex: 1 1 auto;
          display: inline-block;
          vertical-align: middle;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          .ant-form-item-control {
            max-width: 100%;

            .ant-form-item-children {
              max-width: 100%;

              .ant-rate {
                display: block;

                .ant-rate-star {
                  top: -1px;
                }
              }

              .ant-input-number,
              .ant-calendar-picker {
                width: 100%;
                min-width: 0 !important;
              }

              .ant-checkbox-group {
                width: 100%;
                white-space: normal;

                .ant-checkbox-wrapper {
                  margin: 8px 8px 0 0;

                  .ant-checkbox-checked.ant-checkbox-disabled {
                    .ant-checkbox-inner {
                      background-color: #f5f5f5;
                    }
                  }
                }
              }

              .ant-radio-group {
                width: 100%;
                white-space: normal;

                .ant-radio-wrapper {
                  margin: 8px 8px 0 0;

                  .ant-radio-checked.ant-radio-disabled {
                    .ant-radio-inner {
                      background-color: #f5f5f5;
                    }
                  }
                }
              }
            }

            .ant-form-explain,
            .ant-form-extra {
              height: 18px;
              min-height: 18px;
              margin: -2px 0 0;
              font-size: 12px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }

    &.ant-form-inline {
      .ant-form-item {
        display: flex;
        margin-bottom: 16px;

        & > .ant-form-item-label {
          width: auto;
          flex: 0 0 auto;
        }

        &.ant-form-item-with-help {
          margin-bottom: 0;
        }
      }
    }

    &.ant-form-horizontal {
      .ant-form-item {
        display: flex;
        margin-bottom: 16px;

        & > .ant-form-item-label {
          width: 80px;
        }

        &.ant-form-item-with-help {
          margin-bottom: 0;
        }
      }
    }

    &.ant-form-vertical {
      .ant-form-item {
        display: flex;
        flex-flow: row wrap;
        margin-bottom: 16px;

        & > .ant-form-item-label {
          width: 100%;
        }

        &.ant-form-item-with-help {
          margin-bottom: 0;
        }
      }
    }

    &.ant-form-inline[labelWidthAuto],
    &.ant-form-inline[label-width-auto],
    &.ant-form-vertical[labelWidthAuto],
    &.ant-form-vertical[label-width-auto],
    &.ant-form-horizontal[labelWidthAuto],
    &.ant-form-horizontal[label-width-auto] {
      .ant-form-item {
        & > .ant-form-item-label {
          width: auto;
        }
      }
    }
  }
}
</style>
