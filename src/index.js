import Vue from 'vue'
import STree from './lib/S-Tree/index.vue'
import SForm from './lib/S-Form/index.vue'
import SEllipsis from './lib/S-Ellipsis/index.vue'
import SIconSelect from './lib/S-IconSelect/index.vue'
import SEditCellInput from './lib/S-EditCell/Input.vue'
import SEditCellSelect from './lib/S-EditCell/Select.vue'
import SEditCellTextarea from './lib/S-EditCell/Textarea.vue'
import SEditCellDatePicker from './lib/S-EditCell/DatePicker.vue'
import SEditCellTreeSelect from './lib/S-EditCell/TreeSelect.vue'
import STableFilter from './lib/S-Table/filter.js'
import STable from './lib/S-Table/index.js'

import './components'

Vue.component('STree', STree)
Vue.component('SForm', SForm)
Vue.component('SEllipsis', SEllipsis)
Vue.component('SIconSelect', SIconSelect)
Vue.component('SEditCellInput', SEditCellInput)
Vue.component('SEditCellSelect', SEditCellSelect)
Vue.component('SEditCellTextarea', SEditCellTextarea)
Vue.component('SEditCellDatePicker', SEditCellDatePicker)
Vue.component('SEditCellTreeSelect', SEditCellTreeSelect)
Vue.component('STableFilter', STableFilter)
Vue.component('STable', STable)
