import { createRouter, createWebHistory } from 'vue-router'
import Log from '../views/Log/LogView.vue'
import StatisticsChart from '../views/Statistics/StatisticsChart.vue'
import { BarChartOutlined, InboxOutlined } from '@ant-design/icons-vue'

export const menus = [
  {
    path: '/',
    name: 'Logs',
    component: Log,
    icon: InboxOutlined,
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsChart,
    icon: BarChartOutlined,
  },
]

const router = createRouter({
  history: createWebHistory('/log'),
  routes: menus,
})

export default router
