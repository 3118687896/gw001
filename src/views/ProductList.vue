<template>
  <div class="product-list">
    <h2>🔥 精选商品</h2>
    
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchKeyword"
          @input="handleSearch"
          placeholder="搜索商品名称..."
          class="search-input"
        >
        <button v-if="searchKeyword" @click="clearSearch" class="clear-btn">✕</button>
      </div>
      <div class="search-stats" v-if="searchKeyword">
        找到 <span class="highlight">{{ filteredProducts.length }}</span> 个相关商品
      </div>
    </div>
    
    <!-- 分类筛选 -->
    <div class="category-filter">
      <button 
        :class="{ active: selectedCategory === 'all' }"
        @click="filterByCategory('all')"
      >
        全部
      </button>
      <button 
        v-for="cat in categories"
        :key="cat.id"
        :class="{ active: selectedCategory === cat.id }"
        @click="filterByCategory(cat.id)"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="filteredProducts.length === 0" class="no-products">
      <p>😕 该分类下暂无商品</p>
    </div>
    <div v-else class="products-grid">
      <ProductItem
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductItem from '../components/ProductItem.vue'
import { getProducts } from '../api/productApi'
import { useCartStore } from '../stores/cartStore'

const route = useRoute()
const products = ref([])
const loading = ref(true)
const cartStore = useCartStore()
const selectedCategory = ref('all')
const searchKeyword = ref('')

// 商品分类
const categories = ref([
  { id: 'electronics', name: '数码电子', icon: '📱' },
  { id: 'food', name: '食品饮料', icon: '☕' },
  { id: 'office', name: '办公用品', icon: '📝' },
  { id: 'home', name: '家居生活', icon: '🏠' },
  { id: 'photography', name: '摄影摄像', icon: '📷' }
])

// 根据选中分类和搜索关键词过滤商品
const filteredProducts = computed(() => {
  let result = products.value
  
  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  
  // 按搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(keyword) ||
      p.description?.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 加载商品数据
const loadProducts = async () => {
  loading.value = true
  try {
    const data = await getProducts()
    products.value = data
    
    // 如果 URL 中有分类参数，自动选中
    const categoryParam = route.query.category
    if (categoryParam) {
      selectedCategory.value = categoryParam
    }
    
    // 如果 URL 中有关键词参数，自动填充搜索框
    const keywordParam = route.query.keyword
    if (keywordParam) {
      searchKeyword.value = keywordParam
    }
  } catch (error) {
    console.error('加载商品失败:', error)
    alert('⚠️ 加载商品失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 按分类筛选
const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

// 搜索处理
const handleSearch = () => {
  // 实时搜索，computed会自动更新
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
}

// 添加到购物车
const handleAddToCart = (product) => {
  cartStore.addToCart(product)
  // 可选：弹出提示
  alert(`✅ ${product.name} 已添加到购物车`)
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-list h2 {
  margin-bottom: 20px;
  color: #333;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 24px;
}
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid #e8e8e8;
  transition: all 0.3s;
  overflow: hidden;
}
.search-box:focus-within {
  border-color: #ff6a00;
  box-shadow: 0 4px 16px rgba(255, 106, 0, 0.15);
}
.search-icon {
  padding: 0 16px;
  font-size: 20px;
  color: #999;
}
.search-input {
  flex: 1;
  height: 52px;
  border: none;
  outline: none;
  font-size: 15px;
  color: #333;
  background: transparent;
}
.search-input::placeholder {
  color: #bbb;
}
.clear-btn {
  width: 52px;
  height: 52px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.clear-btn:hover {
  color: #ff6a00;
  background: rgba(255, 106, 0, 0.05);
}
.search-stats {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
  text-align: center;
}
.search-stats .highlight {
  color: #ff6a00;
  font-weight: 600;
  font-size: 16px;
}

/* 分类筛选 */
.category-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-filter button {
  padding: 8px 20px;
  border-radius: 4px;
  background: white;
  color: #5f6368;
  border: 1px solid #dadce0;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.category-filter button:hover {
  border-color: #1a73e8;
  color: #1a73e8;
  background: #f8f9fa;
}

.category-filter button.active {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}

.no-products {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e8eaed;
}

.no-products p {
  font-size: 18px;
  color: #999;
}
</style>