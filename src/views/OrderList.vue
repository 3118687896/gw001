<template>
  <div class="order-page">
    <h2>📋 我的订单</h2>

    <!-- 订单状态筛选 -->
    <div class="order-tabs">
      <button 
        :class="{ active: selectedStatus === 'all' }"
        @click="filterByStatus('all')"
      >
        全部订单 ({{ orderStore.allOrders.length }})
      </button>
      <button 
        :class="{ active: selectedStatus === 'unpaid' }"
        @click="filterByStatus('unpaid')"
      >
        未付款 ({{ orderStore.unpaidOrders.length }})
      </button>
      <button 
        :class="{ active: selectedStatus === 'paid' }"
        @click="filterByStatus('paid')"
      >
        已付款 ({{ orderStore.paidOrders.length }})
      </button>
      <button 
        :class="{ active: selectedStatus === 'shipped' }"
        @click="filterByStatus('shipped')"
      >
        已发货 ({{ orderStore.shippedOrders.length }})
      </button>
      <button 
        :class="{ active: selectedStatus === 'delivered' }"
        @click="filterByStatus('delivered')"
      >
        待发货 ({{ orderStore.deliveredOrders.length }})
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredOrders.length === 0" class="empty-orders">
      <p>😕 暂无订单</p>
      <router-link to="/products" class="shop-btn">去购物</router-link>
    </div>

    <!-- 订单列表 -->
    <div v-else class="orders-list">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="order-card"
      >
        <!-- 订单头部 -->
        <div class="order-header">
          <div class="order-info">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
          </div>
          <div class="order-status" :class="`status-${order.status}`">
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <!-- 收货地址 -->
        <div v-if="order.address" class="order-address">
          <div class="address-label">📍 收货地址</div>
          <div class="address-content">
            <strong>{{ order.address.name }}</strong>
            <span>{{ order.address.phone }}</span>
            <p>{{ order.address.province }} {{ order.address.city }} {{ order.address.district }} {{ order.address.detail }}</p>
          </div>
        </div>

        <!-- 订单商品列表 -->
        <div class="order-items">
          <div 
            v-for="item in order.items" 
            :key="item.id" 
            class="order-item"
          >
            <img :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
              <p class="item-quantity">x{{ item.quantity }}</p>
            </div>
            <div class="item-subtotal">
              ¥{{ (item.price * item.quantity).toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- 订单底部 -->
        <div class="order-footer">
          <div class="order-total">
            <span>共 {{ getTotalQuantity(order.items) }} 件商品</span>
            <span class="total-amount">合计：¥{{ order.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <!-- 未付款状态 -->
            <template v-if="order.status === 'unpaid'">
              <button class="btn-pay" @click="handlePayOrder(order)">
                立即付款
              </button>
              <button class="btn-cancel" @click="handleCancelOrder(order)">
                取消订单
              </button>
            </template>
            
            <!-- 已付款状态 -->
            <template v-else-if="order.status === 'paid'">
              <button class="btn-ship" @click="handleShipOrder(order)" v-if="isAdmin">
                确认发货
              </button>
              <span class="status-tip">等待商家发货</span>
            </template>
            
            <!-- 已发货状态 -->
            <template v-else-if="order.status === 'shipped'">
              <button class="btn-deliver" @click="handleDeliverOrder(order)">
                确认收货
              </button>
              <span class="status-tip">商品运输中</span>
            </template>
            
            <!-- 已完成状态 -->
            <template v-else-if="order.status === 'delivered'">
              <span class="status-tip">✓ 交易完成</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '../stores/orderStore'

const orderStore = useOrderStore()
const selectedStatus = ref('all')
const isAdmin = ref(false) // 模拟管理员权限，实际项目中从用户信息获取

// 根据选中状态过滤订单
const filteredOrders = computed(() => {
  return orderStore.getOrdersByStatus(selectedStatus.value)
})

// 按状态筛选
const filterByStatus = (status) => {
  selectedStatus.value = status
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'unpaid': '未付款',
    'paid': '已付款',
    'shipped': '已发货',
    'delivered': '待发货'
  }
  return statusMap[status] || '未知状态'
}

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 计算商品总数
const getTotalQuantity = (items) => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

// 支付订单
const handlePayOrder = (order) => {
  if (confirm(`确认支付订单 ${order.orderNo}？\n金额：¥${order.totalAmount.toFixed(2)}`)) {
    orderStore.payOrder(order.id)
    alert('✅ 支付成功！')
  }
}

// 取消订单
const handleCancelOrder = (order) => {
  if (confirm(`确认取消订单 ${order.orderNo}？`)) {
    orderStore.cancelOrder(order.id)
    alert('✅ 订单已取消')
  }
}

// 发货（管理员功能）
const handleShipOrder = (order) => {
  if (confirm(`确认发货订单 ${order.orderNo}？`)) {
    orderStore.shipOrder(order.id)
    alert('✅ 已发货')
  }
}

// 确认收货
const handleDeliverOrder = (order) => {
  if (confirm(`确认收到订单 ${order.orderNo} 的商品？`)) {
    orderStore.deliverOrder(order.id)
    alert('✅ 确认收货，交易完成！')
  }
}
</script>

<style scoped>
.order-page {
  max-width: 1200px;
  margin: 0 auto;
}

.order-page h2 {
  margin-bottom: 24px;
  color: #1f2329;
  font-weight: 600;
  font-size: 1.5rem;
}

/* 订单状态筛选 */
.order-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e7e7e7;
  padding-bottom: 12px;
}

.order-tabs button {
  padding: 8px 18px;
  border-radius: 6px;
  background: white;
  color: #646a73;
  border: 1px solid #e7e7e7;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 0.9rem;
}

.order-tabs button:hover {
  border-color: #0052d9;
  color: #0052d9;
  background: #f5f7fa;
}

.order-tabs button.active {
  background: #0052d9;
  color: white;
  border-color: #0052d9;
}

/* 空状态 */
.empty-orders {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.empty-orders p {
  font-size: 1rem;
  color: #9ca3af;
  margin-bottom: 24px;
}

.shop-btn {
  display: inline-block;
  background: #0052d9;
  color: white;
  text-decoration: none;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.shop-btn:hover {
  background: #003cab;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.15);
}

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 订单卡片 */
.order-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.order-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f2f3f5;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-no {
  font-weight: 600;
  color: #1f2329;
  font-size: 0.9rem;
}

.order-time {
  font-size: 0.8rem;
  color: #9ca3af;
}

.order-status {
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.85rem;
}

.status-unpaid {
  background: #fff7e6;
  color: #d46b08;
}

.status-paid {
  background: #e6f7ff;
  color: #0052d9;
}

.status-shipped {
  background: #f6ffed;
  color: #389e0d;
}

.status-delivered {
  background: #f0f0f0;
  color: #595959;
}

/* 订单地址 */
.order-address {
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #f2f3f5;
}

.address-label {
  font-size: 0.85rem;
  color: #646a73;
  margin-bottom: 8px;
}

.address-content {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.address-content strong {
  color: #1f2329;
  font-size: 0.95rem;
}

.address-content span {
  color: #646a73;
  font-size: 0.9rem;
}

.address-content p {
  width: 100%;
  color: #646a73;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 8px 0 0 0;
}

/* 订单商品列表 */
.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f2f3f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background: #f5f7fa;
}

.item-details {
  flex: 2;
}

.item-details h4 {
  margin-bottom: 8px;
  color: #1f2329;
  font-weight: 500;
  font-size: 0.95rem;
}

.item-price {
  color: #0052d9;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.95rem;
}

.item-quantity {
  color: #9ca3af;
  font-size: 0.85rem;
}

.item-subtotal {
  min-width: 100px;
  text-align: right;
  font-weight: 600;
  color: #0052d9;
  font-size: 1.05rem;
}

/* 订单底部 */
.order-footer {
  padding: 16px 20px;
  background: #fafafa;
  border-top: 1px solid #f2f3f5;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e7e7e7;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0052d9;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.order-actions button {
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.btn-pay {
  background: #0052d9;
  color: white;
}

.btn-pay:hover {
  background: #003cab;
  box-shadow: 0 2px 6px rgba(0, 82, 217, 0.15);
}

.btn-cancel {
  background: white;
  color: #dc3545;
  border-color: #dc3545;
}

.btn-cancel:hover {
  background: #dc3545;
  color: white;
}

.btn-ship {
  background: #07c160;
  color: white;
}

.btn-ship:hover {
  background: #06ad56;
}

.btn-deliver {
  background: #0052d9;
  color: white;
}

.btn-deliver:hover {
  background: #003cab;
}

.status-tip {
  color: #646a73;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .order-item {
    flex-wrap: wrap;
  }

  .item-subtotal {
    width: 100%;
    text-align: left;
    margin-top: 10px;
  }

  .order-actions {
    flex-direction: column;
  }

  .order-actions button {
    width: 100%;
  }
}
</style>
