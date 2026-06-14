<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
    </div>
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="price">¥{{ product.price.toFixed(2) }}</p>
      <p class="stock">库存: {{ product.stock }}件</p>
      <button @click.stop="handleAddToCart">➕ 加入购物车</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['addToCart'])
const router = useRouter()

// 跳转到商品详情
const goToDetail = () => {
  router.push(`/product/${props.product.id}`)
}

// 添加到购物车（阻止事件冒泡）
const handleAddToCart = (event) => {
  event.stopPropagation()
  emit('addToCart', props.product)
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e7e7e7;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.08);
  border-color: #0052d9;
}

.product-image {
  height: 200px;
  overflow: hidden;
  background: #f5f7fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.03);
}

.product-info {
  padding: 16px;
}

.product-info h3 {
  font-size: 0.95rem;
  margin-bottom: 8px;
  color: #1f2329;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0052d9;
  margin: 8px 0;
}

.stock {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 12px;
}

.product-info button {
  width: 100%;
  padding: 10px;
  font-size: 0.85rem;
  background: #0052d9;
  border-radius: 6px;
}

.product-info button:hover {
  background: #003cab;
}
</style>
