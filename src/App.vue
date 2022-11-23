<script setup>
import { RouterView } from 'vue-router'
import BlankPageContainer from '@/components/BlankPageContainer.vue'
import { onMounted, ref } from 'vue'
import { SSO_HOST, SSO_REDIRECT } from '../config'

const userInfo = ref(null)

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
          window.location.href = location.origin
        }
      }
    })
}

function handleLogout() {
  localStorage.removeItem('auth-token')
  window.location.href = SSO_REDIRECT
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
  <a-layout>
    <a-layout-header class="header">
      <div class="header">
        <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item key="1">Logs</a-menu-item>
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
    <BlankPageContainer title="Logs">
      <RouterView />
    </BlankPageContainer>
    <footer
      style="position: absolute; bottom: 8px; width: 100%; text-align: center"
    >
      Copyright © {{ new Date().getFullYear() }} hong97.ltd
    </footer>
  </a-layout>
</template>

<style lang="stylus" scoped>
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
</style>
