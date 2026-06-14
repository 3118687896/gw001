<template>
  <div class="header">
    <h1>🛒 购物商城</h1>
    <div class="nav">
      <router-link to="/">🏠 首页</router-link>
      <router-link to="/products">📦 商品列表</router-link>
      <router-link to="/cart">🛒 购物车 ({{ cartStore.totalCount }})</router-link>
      <router-link to="/orders">📋 我的订单</router-link>
      
      <!-- 用户相关导航 -->
      <template v-if="userStore.isLoggedIn">
        <router-link to="/addresses">📍 收货地址</router-link>
        <span class="user-info">
          👤 {{ userStore.currentUser.nickname || userStore.currentUser.username }}
        </span>
        <button @click="handleLogout" class="btn-logout">退出</button>
      </template>
      <router-link v-else to="/login" class="btn-login">🔑 登录</router-link>
    </div>
  </div>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import { useCartStore } from './stores/cartStore'
import { useUserStore } from './stores/userStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()

// 处理登出
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e7e7e7;
  padding: 16px 32px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.header h1 {
  margin: 0 0 12px 0;
  color: #1f2329;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.nav a {
  color: #646a73;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  padding: 6px 12px;
  border-radius: 4px;
}

.nav a:hover,
.nav a.router-link-active {
  color: #0052d9;
  background: #f0f7ff;
}

.user-info {
  color: #1f2329;
  font-weight: 500;
  padding: 6px 12px;
}

.btn-logout {
  padding: 6px 16px;
  background: white;
  color: #646a73;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-logout:hover {
  border-color: #dc3545;
  color: #dc3545;
  background: #fff5f5;
}

.btn-login {
  background: #0052d9;
  color: white !important;
  padding: 6px 16px;
  border-radius: 4px;
}

.btn-login:hover {
  background: #003cab !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}
</style>