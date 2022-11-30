<script setup>
import { RouterView, useRouter } from 'vue-router'
import BlankPageContainer from '@/components/BlankPageContainer.vue'
import { onMounted, ref } from 'vue'
import { SSO_HOST, SSO_REDIRECT } from '../config'
import { menus } from '@/router'

const userInfo = ref(null)
const selectedMenu = ref(['/'])

const router = useRouter()

function getUserInfo() {
  const authToken = localStorage.getItem('auth-token')
  if (!authToken) {
    window.location.href = SSO_REDIRECT
  }
  fetch(`${SSO_HOST}/api/userInfo?authToken=${authToken}`)
    .then((v) => {
      return v.json()
    })
    .then((v) => {
      if (v?.success) {
        userInfo.value = v.data
        if (location.search) {
          window.location.search = ''
        }
      }
    })
}

function handleLogout() {
  localStorage.removeItem('auth-token')
  window.location.href = SSO_REDIRECT
}

function handleClickMenu({ key }) {
  router.push({
    path: key,
  })
}

onMounted(() => {
  const search = decodeURIComponent(document.location.search)

  // 有拿到 ticket
  const found = /\?ticket=(\S+)/g.exec(search)
  if (found !== null) {
    // 去验证 ticket
    const ticket = found[1]
    fetch(`${SSO_HOST}/api/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.success === true) {
          localStorage.setItem('auth-token', res.data.authToken)
          getUserInfo()
        } else {
          throw new Error('wrong ticket')
        }
      })
      .catch(() => {
        window.location.href = SSO_REDIRECT
      })
  } else {
    getUserInfo()
  }
})
</script>

<template>
  <a-layout style="height: 100vh">
    <a-layout-header class="header">
      <div class="logo">
        <img
          src="../public/logo.png"
          alt="png"
          style="width: 32px; margin-right: 24px"
        />
        <span>Log IT</span>
      </div>
      <div class="header">
        <a-menu
          v-model:selected-keys="selectedMenu"
          @click="handleClickMenu"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px', width: '100%' }"
        >
          <a-menu-item v-for="m in menus" :key="m.path">{{
            m.name
          }}</a-menu-item>
        </a-menu>
        <a-popover>
          <template #content>
            <a-button type="text" @click="handleLogout">登出</a-button>
          </template>
          <a-space size="middle">
            <span class="name">{{ userInfo?.name }}</span>
            <img class="avatar" alt="avatar" :src="userInfo?.avatar" />
          </a-space>
        </a-popover>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        width="200"
        style="background: #fff; padding: 8px 0; position: relative"
      >
        <a-menu
          v-model:selected-keys="selectedMenu"
          @click="handleClickMenu"
          mode="inline"
          style="height: 100%"
        >
          <a-menu-item v-for="m in menus" :key="m.path">
            <template #icon>
              <component :is="m.icon" />
            </template>
            {{ m.name }}
          </a-menu-item>
        </a-menu>
        <span class="footer">Log IT | hong97.ltd</span>
      </a-layout-sider>
      <BlankPageContainer
        :title="menus.find((e) => e.path === selectedMenu[0]).name"
      >
        <RouterView />
      </BlankPageContainer>
    </a-layout>
  </a-layout>
</template>

<style lang="stylus" scoped>
.logo
  color #fff
  width 200px
  font-size 18px

.header
  display flex
  justify-content space-between
  width 100%

  .name
    color #fff

  .avatar
    width 32px
    height 32px
    border-radius 100%

.footer
  position absolute
  bottom 8px
  width 100%
  text-align center
  font-size 12px
  color #b1b1b1
</style>
