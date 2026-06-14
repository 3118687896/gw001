<template>
  <div class="shopping-cart">
    <h2>🛒 我的购物车</h2>

    <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
      <p>购物车还是空的~</p>
      <router-link to="/" class="continue-shopping">去逛逛</router-link>
    </div>

    <div v-else>
      <div class="cart-items">
        <CartItem
            v-for="item in cartStore.cartItems"
            :key="item.id"
            :item="item"
            @update-quantity="handleUpdateQuantity"
            @remove-item="handleRemoveItem"
        />
      </div>

      <div class="cart-summary">
        <!-- 地址选择 -->
        <div v-if="userStore.isLoggedIn" class="address-section">
          <h3>📍 收货地址</h3>
          
          <!-- 显示默认地址或提示 -->
          <div v-if="addressStore.defaultAddress" class="selected-address">
            <div class="address-info">
              <strong>{{ addressStore.defaultAddress.name }}</strong>
              <span>{{ addressStore.defaultAddress.phone }}</span>
            </div>
            <p>{{ addressStore.defaultAddress.province }} {{ addressStore.defaultAddress.city }} {{ addressStore.defaultAddress.district }} {{ addressStore.defaultAddress.detail }}</p>
          </div>
          <div v-else class="no-address">
            <p>⚠️ 您还没有设置收货地址</p>
            <router-link to="/addresses" class="btn-add-address">+ 添加收货地址</router-link>
          </div>
          
          <router-link to="/addresses" class="manage-addresses">管理收货地址 ></router-link>
        </div>
        
        <div v-else class="login-hint">
          <p>💡 登录后可以保存收货地址</p>
          <router-link to="/login" class="btn-login-cart">去登录</router-link>
        </div>
        
        <div class="summary-row">
          <span>商品总数：</span>
          <strong>{{ cartStore.totalCount }} 件</strong>
        </div>
        <div class="summary-row total">
          <span>合计金额：</span>
          <strong>¥{{ cartStore.totalPrice.toFixed(2) }}</strong>
        </div>
        <button class="checkout-btn" @click="handleCheckout" :disabled="!canCheckout">
          去结算 🧾
        </button>
        <button class="clear-btn" @click="handleClearCart">
          清空购物车
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CartItem from '../components/CartItem.vue'
import { useCartStore } from '../stores/cartStore'
import { useOrderStore } from '../stores/orderStore'
import { useUserStore } from '../stores/userStore'
import { useAddressStore } from '../stores/addressStore'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const userStore = useUserStore()
const addressStore = useAddressStore()
const router = useRouter()

// 检查是否可以结算（需要登录且有地址）
const canCheckout = computed(() => {
  if (!userStore.isLoggedIn) {
    return true // 未登录也可以结算，但会提示
  }
  return !!addressStore.defaultAddress
})

// 加载用户地址
onMounted(async () => {
  if (userStore.isLoggedIn && userStore.currentUser) {
    await addressStore.loadUserAddresses(userStore.currentUser.id)
  }
})

// 更新商品数量
const handleUpdateQuantity = (item, newQuantity) => {
  cartStore.updateQuantity(item.id, newQuantity)
}

// 移除商品
const handleRemoveItem = (item) => {
  if (confirm(`确定要从购物车移除 ${item.name} 吗？`)) {
    cartStore.removeFromCart(item.id)
  }
}

// 结算
const handleCheckout = async () => {
  if (cartStore.cartItems.length === 0) {
    alert('⚠️ 购物车是空的')
    return
  }
  
  // 如果已登录但没有默认地址，提示用户添加地址
  if (userStore.isLoggedIn && !addressStore.defaultAddress) {
    if (confirm('您还没有设置收货地址，是否先去添加收货地址？')) {
      router.push('/addresses')
      return
    }
  }
  
  const total = cartStore.totalPrice.toFixed(2)
  
  let confirmMessage = `🎉 确认结算？\n商品数量：${cartStore.totalCount} 件\n总金额：¥${total}`
  
  if (addressStore.defaultAddress) {
    const addr = addressStore.defaultAddress
    confirmMessage += `\n\n收货地址：${addr.province} ${addr.city} ${addr.district} ${addr.detail}\n收货人：${addr.name} ${addr.phone}`
  }
  
  if (confirm(confirmMessage)) {
    // 创建订单，包含地址信息
    const orderData = {
      items: cartStore.cartItems,
      totalAmount: cartStore.totalPrice,
      address: addressStore.defaultAddress ? { ...addressStore.defaultAddress } : null
    }
    
    const newOrder = orderStore.createOrder(
      orderData.items,
      orderData.totalAmount,
      orderData.address
    )
    
    // 清空购物车
    cartStore.clearCart()
    
    alert(`✅ 订单创建成功！\n订单号：${newOrder.orderNo}\n\n即将跳转到订单页面...`)
    
    // 跳转到订单页面
    router.push('/orders')
  }
}

// 清空购物车
const handleClearCart = () => {
  if (confirm('确定要清空购物车吗？')) {
    cartStore.clearCart()
  }
}
</script>

<style scoped>
.shopping-cart h2 {
  margin-bottom: 24px;
  color: #1f2329;
  font-weight: 600;
  font-size: 1.5rem;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.empty-cart p {
  font-size: 1rem;
  color: #9ca3af;
  margin-bottom: 24px;
}

.continue-shopping {
  display: inline-block;
  background: #0052d9;
  color: white;
  text-decoration: none;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.continue-shopping:hover {
  background: #003cab;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.15);
}

.cart-items {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid #e7e7e7;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.cart-summary {
  background: white;
  border-radius: 8px;
  padding: 24px;
  text-align: right;
  border: 1px solid #e7e7e7;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.address-section {
  text-align: left;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
}

.address-section h3 {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #1f2329;
}

.selected-address {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #0052d9;
  margin-bottom: 10px;
}

.selected-address .address-info {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
}

.selected-address strong {
  color: #1f2329;
}

.selected-address span {
  color: #646a73;
}

.selected-address p {
  color: #646a73;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.no-address {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px dashed #ddd;
  margin-bottom: 10px;
}

.no-address p {
  color: #ff9800;
  margin-bottom: 10px;
}

.btn-add-address {
  display: inline-block;
  background: #0052d9;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-add-address:hover {
  background: #003cab;
}

.manage-addresses {
  display: block;
  text-align: right;
  color: #0052d9;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 10px;
}

.manage-addresses:hover {
  text-decoration: underline;
}

.login-hint {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
  background: #f0f7ff;
  border-radius: 6px;
}

.login-hint p {
  color: #646a73;
  margin-bottom: 10px;
}

.btn-login-cart {
  display: inline-block;
  background: #0052d9;
  color: white;
  padding: 8px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-login-cart:hover {
  background: #003cab;
}

.summary-row {
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #646a73;
}

.summary-row.total {
  font-size: 1.1rem;
  margin-bottom: 24px;
  padding-top: 16px;
  border-top: 1px solid #f2f3f5;
  color: #1f2329;
}

.summary-row.total strong {
  color: #0052d9;
  font-size: 1.5rem;
  font-weight: 600;
}

.checkout-btn, .clear-btn {
  padding: 10px 28px;
  margin-left: 12px;
  font-size: 0.9rem;
  border-radius: 6px;
}

.clear-btn {
  background: #ffffff;
  color: #646a73;
  border: 1px solid #e7e7e7;
}

.clear-btn:hover {
  background: #f5f7fa;
  border-color: #0052d9;
  color: #0052d9;
}
</style>