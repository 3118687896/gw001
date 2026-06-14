<template>
  <div class="product-detail" v-if="product">
    <!-- 返回按钮组 -->
    <div class="back-buttons">
      <button class="back-btn back-to-list" @click="goToProductList">
        ← 返回列表
      </button>
      <button class="back-btn back-to-previous" @click="goBack" v-if="hasHistory">
        ⬅ 上一个商品
      </button>
    </div>

    <div class="detail-container">
      <!-- 商品图片 -->
      <div class="product-image-section">
        <img :src="product.image" :alt="product.name" />
      </div>

      <!-- 商品信息 -->
      <div class="product-info-section">
        <h1>{{ product.name }}</h1>
        
        <div class="price-stock">
          <div class="price">¥{{ product.price.toFixed(2) }}</div>
          <div class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
            {{ product.stock > 0 ? `库存: ${product.stock}件` : '已售罄' }}
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="description">
          <h3>商品介绍</h3>
          <p>{{ getProductDescription(product.id) }}</p>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-selector">
          <label>购买数量：</label>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <input 
              type="number" 
              v-model.number="quantity" 
              @change="validateQuantity"
              :min="1" 
              :max="product.stock"
              class="quantity-input"
            />
            <button @click="increaseQuantity" :disabled="quantity >= product.stock">+</button>
          </div>
          <p class="stock-hint">库存: {{ product.stock }} 件</p>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button 
            class="add-to-cart-btn" 
            @click="handleAddToCart"
            :disabled="product.stock === 0"
          >
            🛒 加入购物车
          </button>
          <button 
            class="buy-now-btn" 
            @click="handleBuyNow"
            :disabled="product.stock === 0"
          >
            ⚡ 立即购买
          </button>
        </div>

        <!-- 商品参数 -->
        <div class="product-params">
          <h3>商品参数</h3>
          <div class="param-item">
            <span class="param-label">商品编号：</span>
            <span class="param-value">{{ String(product.id).padStart(6, '0') }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">所属分类：</span>
            <span class="param-value">{{ getCategoryName(product.category) }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">价格：</span>
            <span class="param-value">¥{{ product.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 相关推荐 -->
    <div class="related-products" v-if="relatedProducts.length > 0">
      <h2>📦 相关推荐</h2>
      <div class="products-grid">
        <ProductItem
          v-for="item in relatedProducts"
          :key="item.id"
          :product="item"
          @add-to-cart="handleRelatedAddToCart"
        />
      </div>
    </div>
  </div>

  <div v-else class="loading">
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductItem from '../components/ProductItem.vue'
import { getProductById, getProducts } from '../api/productApi'
import { useCartStore } from '../stores/cartStore'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const product = ref(null)
const quantity = ref(1)
const allProducts = ref([])
const hasHistory = ref(false) // 是否有浏览历史

// 获取商品分类名称
const getCategoryName = (category) => {
  const categoryMap = {
    'electronics': '数码电子',
    'food': '食品饮料',
    'office': '办公用品',
    'home': '家居生活',
    'photography': '摄影摄像',
    'lifestyle': '生活方式'
  }
  return categoryMap[category] || '其他'
}

// 获取商品描述
const getProductDescription = (productId) => {
  const descriptions = {
    1: '精选优质阿拉比卡咖啡豆，经过精心烘焙，口感醇厚，香气浓郁。适合手冲、滴滤等多种冲泡方式，为您带来完美的咖啡体验。',
    2: '采用天然原木材质制作，环保健康。套装包含笔记本和配套笔，设计简约大方，是办公学习的理想选择。',
    3: '智能运动手环，支持心率监测、步数统计、睡眠分析等功能。防水设计，续航持久，帮助您更好地管理健康生活。',
    4: '专业级便携单反相机，高像素传感器，快速对焦系统。轻巧便携，适合旅行摄影和日常拍摄，记录美好瞬间。',
    5: '传统日式工艺制作的陶瓷茶具，釉面光滑，造型优雅。包含茶壶和茶杯，适合品茗休闲，感受茶道文化。',
    6: '现代极简设计台灯，LED光源，三档亮度调节。护眼无频闪，适合阅读和工作，为您的桌面增添一份简约美感。',
    7: '超薄机身设计，高性能处理器，16GB内存+512GB存储。14英寸高清屏幕，适合办公、学习和娱乐使用。',
    8: '主动降噪技术，蓝牙5.0连接，40小时超长续航。舒适佩戴，音质清晰，让您沉浸在音乐世界中。',
    9: '多功能智能手表，支持电话、消息提醒、健康监测。GPS定位，多种运动模式，时尚外观，科技与美学的完美结合。',
    10: '机械轴体，RGB背光效果，全键无冲突。人体工学设计，打字游戏两相宜，提升您的操作体验。',
    11: '高精度传感器，可编程按键，RGB灯效。符合人体工学设计，助您在游戏中获得优势，精准操控。',
    12: '10英寸高清屏幕，轻薄便携，支持触控操作。适合阅读、看视频、玩游戏，娱乐办公两不误。',
    13: '大容量电池，快充技术，多接口设计。小巧便携，可为手机、平板等设备多次充电，出行必备。',
    14: '360度环绕立体声，蓝牙无线连接，防水设计。音质饱满，低音震撼，适合户外聚会和家庭使用。',
    15: '进口可可豆制作，口感丝滑，甜度适中。精美礼盒包装，适合送礼或自用，享受甜蜜时光。',
    16: '高山有机茶园采摘，茶香清香，回味甘甜。富含茶多酚，提神醒脑，健康养生佳品。',
    17: '精选多种坚果，营养丰富，口感香脆。独立小包装设计，方便携带，是健康零食的理想选择。',
    18: '天然花蜜酿造，纯正无添加，口感醇厚。富含多种维生素和矿物质，滋补养生，美容养颜。',
    19: '意式浓缩配方，深度烘焙，油脂丰富。适合制作拿铁、卡布奇诺等咖啡饮品，在家也能享受咖啡店品质。',
    20: '法国原装进口，单宁柔和，果香浓郁。经过橡木桶陈酿，口感复杂，适合配餐或单独品尝。',
    21: '特级初榨工艺，酸度低，营养丰富。适合凉拌、烹饪，健康食用油的不二之选。',
    22: '优质钢笔，书写流畅，笔尖细腻。精美礼盒包装，适合商务送礼或个人收藏，彰显品味。',
    23: '多规格文件夹套装，分类清晰，便于整理。优质材料制作，耐用实用，让办公更有序。',
    24: '创意设计便签纸，色彩鲜艳，粘性强。多种形状可选，适合标记、留言，为工作增添趣味。',
    25: '专业级订书机，装订牢固，操作简单。金属材质，经久耐用，办公室必备文具。',
    26: '科学计算器，功能强大，运算快速。液晶显示屏，太阳能供电，适合学生和专业人士使用。',
    27: '多层文件收纳盒，分类存放，节省空间。透明设计，一目了然，让办公桌更加整洁。',
    28: '100%纯棉面料，柔软舒适，透气性好。四件套包含床单、被套、枕套，为您提供舒适的睡眠体验。',
    29: '记忆棉材质，贴合颈椎曲线，支撑力好。透气孔设计，四季适用，改善睡眠质量。',
    30: '优质羊毛材质，手感柔软，保暖性好。精美图案设计，为家居增添温馨氛围，提升生活品质。',
    31: '现代简约风格装饰画，高清印刷，色彩饱满。多种尺寸可选，适合客厅、卧室、办公室装饰。',
    32: '手工陶瓷花瓶，造型独特，釉面光滑。适合插花装饰，为家居增添艺术气息。',
    33: '天然大豆蜡制作，香味持久，燃烧均匀。多款香型可选，营造浪漫温馨的氛围。',
    34: '超声波雾化技术，静音运行，定时功能。配合精油使用，舒缓压力，改善空气质量。',
    35: '微单相机套机，高像素传感器，快速对焦。4K视频录制，Wi-Fi传输，适合专业摄影和日常拍摄。',
    36: '高清航拍无人机，GPS定位，自动返航。稳定云台，长续航时间，轻松拍摄空中美景。',
    37: '铝合金材质三脚架，稳固耐用，高度可调。便携设计，适合相机、摄像机使用，摄影必备配件。',
    38: '防水相机包，多层分隔，保护性强。肩带可调节，携带方便，有效保护您的摄影器材。',
    39: '时尚双肩包，大容量设计，多隔层分类。防水面料，舒适背带，适合通勤、旅行使用。',
    40: '透气运动鞋，缓震鞋底，轻便舒适。防滑耐磨，适合跑步、健身等多种运动场景。',
    41: '偏光太阳镜，防紫外线，清晰视野。时尚框架设计，适合驾驶、户外活动佩戴。',
    42: '304不锈钢保温杯，保温保冷效果好。500ml容量，便携设计，随时享受适宜温度的饮品。',
    43: '真皮钱包，做工精细，多卡位设计。轻薄便携，质感上乘，商务休闲皆宜。',
    44: '羊绒围巾，手感柔软，保暖性极佳。经典款式，多色可选，冬季必备时尚单品。',
    45: '潮流棒球帽，透气面料，可调节尺寸。遮阳防晒，时尚百搭，户外运动必备。',
    46: '防晒雨伞，防紫外线涂层，轻便易携。一键开合，防风骨架，晴雨两用。',
    47: '加厚瑜伽垫，防滑纹理，环保材质。提供良好支撑，保护关节，适合瑜伽、健身练习。',
    48: '哑铃套装，重量可调，握感舒适。适合家庭健身，锻炼肌肉，塑造完美身材。',
    49: '正品篮球，标准7号球，手感好。耐磨皮质，室内外通用，篮球爱好者必备。',
    50: '大容量旅行箱，万向轮设计，推拉顺畅。TSA海关锁，安全可靠，长途旅行好帮手。'
  }
  return descriptions[productId] || '优质商品，品质保证。'
}

// 相关推荐商品（同分类的其他商品）
const relatedProducts = computed(() => {
  if (!product.value) return []
  return allProducts.value
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

// 加载商品数据
const loadProduct = async () => {
  const productId = parseInt(route.params.id)
  
  try {
    // 获取当前商品
    const currentProduct = getProductById(productId)
    if (currentProduct) {
      product.value = currentProduct
    } else {
      router.push('/products')
      return
    }
    
    // 获取所有商品用于推荐
    const products = await getProducts()
    allProducts.value = products
  } catch (error) {
    console.error('加载商品失败:', error)
    alert('⚠️ 加载商品失败，请稍后重试')
  }
}

// 验证数量输入
const validateQuantity = () => {
  if (!quantity.value || quantity.value < 1) {
    quantity.value = 1
  } else if (quantity.value > product.value.stock) {
    quantity.value = product.value.stock
    alert(`⚠️ 库存不足，最多可购买 ${product.value.stock} 件`)
  }
  // 确保是整数
  quantity.value = Math.floor(quantity.value)
}

// 减少数量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 增加数量
const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

// 添加到购物车
const handleAddToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
  alert(`✅ ${product.value.name} x${quantity.value} 已添加到购物车`)
}

// 立即购买
const handleBuyNow = () => {
  cartStore.addToCart(product.value, quantity.value)
  alert(`🎉 即将跳转到结算页面\n商品：${product.value.name}\n数量：${quantity.value}\n总价：¥${(product.value.price * quantity.value).toFixed(2)}`)
  router.push('/cart')
}

// 推荐商品添加到购物车
const handleRelatedAddToCart = (relatedProduct) => {
  cartStore.addToCart(relatedProduct)
  alert(`✅ ${relatedProduct.name} 已添加到购物车`)
}

// 返回商品列表页
const goToProductList = () => {
  router.push('/products')
}

// 返回上一个浏览的商品（浏览器后退）
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    // 如果没有历史记录，返回列表页
    router.push('/products')
  }
}

// 滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听路由变化，切换商品时滚动到顶部
watch(() => route.params.id, (newId, oldId) => {
  // 如果有旧ID，说明是从另一个商品跳转过来的，记录历史
  if (oldId) {
    hasHistory.value = true
  }
  // 重置数量为1
  quantity.value = 1
  // 加载新商品数据
  loadProduct()
  // 滚动到顶部
  setTimeout(() => {
    scrollToTop()
  }, 100)
})

onMounted(() => {
  loadProduct()
  // 首次加载也滚动到顶部
  setTimeout(() => {
    scrollToTop()
  }, 100)
})
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
}

/* 返回按钮组 */
.back-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

/* 返回按钮 */
.back-btn {
  background: white;
  color: #1a73e8;
  border: 1px solid #dadce0;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.back-btn:hover {
  background: #f8f9fa;
  border-color: #1a73e8;
}

.back-to-list {
  /* 主要按钮样式 */
}

.back-to-previous {
  /* 次要按钮样式 */
  color: #5f6368;
}

/* 详情容器 */
.detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  border: 1px solid #e8eaed;
  margin-bottom: 40px;
}

/* 商品图片 */
.product-image-section {
  position: sticky;
  top: 20px;
}

.product-image-section img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

/* 商品信息 */
.product-info-section h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.price-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e8eaed;
  margin-bottom: 20px;
}

.price {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a73e8;
}

.stock {
  font-size: 1rem;
  color: #5f6368;
}

.stock.out-of-stock {
  color: #dc3545;
  font-weight: 600;
}

/* 商品描述 */
.description {
  margin-bottom: 30px;
}

.description h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.description p {
  line-height: 1.8;
  color: #5f6368;
  font-size: 0.95rem;
}

/* 数量选择 */
.quantity-selector {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.quantity-selector label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-input {
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 5px;
}

.quantity-input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
}

.stock-hint {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #5f6368;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #dadce0;
  color: #5f6368;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #e8f0fe;
  border-color: #1a73e8;
  color: #1a73e8;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls span {
  min-width: 50px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  display: none; /* 隐藏旧的 span，保留以备后用 */
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart-btn {
  background: white;
  color: #1a73e8;
  border: 2px solid #1a73e8;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #e8f0fe;
}

.buy-now-btn {
  background: #1a73e8;
  color: white;
  border: none;
}

.buy-now-btn:hover:not(:disabled) {
  background: #1557b0;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
}

.add-to-cart-btn:disabled,
.buy-now-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 商品参数 */
.product-params {
  padding-top: 20px;
  border-top: 1px solid #e8eaed;
}

.product-params h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.param-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f1f3f4;
}

.param-label {
  min-width: 100px;
  color: #5f6368;
  font-size: 0.9rem;
}

.param-value {
  color: #333;
  font-weight: 500;
}

/* 相关推荐 */
.related-products {
  margin-top: 40px;
}

.related-products h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 100px 20px;
  color: #5f6368;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-container {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .product-image-section {
    position: static;
  }

  .product-info-section h1 {
    font-size: 1.5rem;
  }

  .price {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
