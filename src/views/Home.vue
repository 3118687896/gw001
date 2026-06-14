<template>
  <div class="home">
    <!-- 顶部横幅 Hero 区 -->
    <section class="hero-banner">
      <div class="banner-inner">
        <div class="banner-text">
          <span class="banner-tag">品质商城 · 精选好物</span>
          <h1>畅享精致购物生活</h1>
          <p class="banner-desc">严选全球好物，正品保障 | 极速配送 | 贴心售后</p>
          <router-link to="/products" class="primary-btn">立即逛商城</router-link>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- 商品分类区域 -->
      <section class="category-section">
        <div class="section-head">
          <h2>全部分类</h2>
          <p>精准分类，快速找到心仪商品</p>
        </div>
        <div class="categories-grid">
          <div
              v-for="category in categories"
              :key="category.id"
              class="category-card"
              @click="goToCategory(category.id)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <h3>{{ category.name }}</h3>
            <span class="category-num">{{ category.count }} 款好物</span>
          </div>
        </div>
      </section>

      <!-- 热门推荐区域 -->
      <section class="featured-section">
        <div class="section-head">
          <h2>热门推荐</h2>
          <p>用户都在买的人气单品</p>
        </div>

        <div v-if="loading" class="loading-box">
          <div class="loading-spin"></div>
          <p>正在加载好物...</p>
        </div>

        <div v-else class="products-grid">
          <ProductItem
              v-for="product in featuredProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddToCart"
          />
        </div>
      </section>

      <!-- 服务保障区域 -->
      <section class="service-section">
        <div class="service-wrap">
          <div class="service-item">
            <div class="service-icon">🚚</div>
            <div class="service-text">
              <h4>极速配送</h4>
              <p>全国包邮 高效物流</p>
            </div>
          </div>
          <div class="service-item">
            <div class="service-icon">🛡️</div>
            <div class="service-text">
              <h4>正品保障</h4>
              <p>严格品控 假一赔十</p>
            </div>
          </div>
          <div class="service-item">
            <div class="service-icon">🔁</div>
            <div class="service-text">
              <h4>七天无忧退换</h4>
              <p>购物零风险</p>
            </div>
          </div>
          <!-- AI智能客服 点击打开对话 -->
          <div class="service-item ai-service" @click="openAiChat">
            <div class="service-icon">🤖</div>
            <div class="service-text">
              <h4>AI智能客服</h4>
              <p>在线问答 智能交互</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 悬浮 AI 客服入口 -->
    <div class="ai-float-btn" @click="openAiChat" title="点击咨询AI客服">
      <div class="btn-content">
        <span class="btn-icon">🤖</span>
        <span class="btn-text">客服</span>
      </div>
      <div class="pulse-ring"></div>
    </div>

    <!-- AI 对话弹窗 -->
    <div class="ai-chat-mask" v-if="showChat">
      <div class="ai-chat-box">
        <!-- 头部 -->
        <div class="chat-header">
          <div class="header-left">
            <div class="service-avatar">🤖</div>
            <div class="service-info">
              <h3>智能客服</h3>
              <span class="online-status">● 在线</span>
            </div>
          </div>
          <span class="close-btn" @click="closeAiChat">✕</span>
        </div>

        <!-- 聊天内容区 -->
        <div class="chat-content" ref="chatContentRef">
          <!-- 欢迎提示 -->
          <div class="welcome-tip">
            <p class="welcome-title">💡 常见问题</p>
            <div class="quick-questions">
              <span class="quick-tag" @click="sendQuickQuestion('什么时候发货？')">📦 什么时候发货？</span>
              <span class="quick-tag" @click="sendQuickQuestion('支持退换货吗？')">🔄 支持退换货吗？</span>
              <span class="quick-tag" @click="sendQuickQuestion('有什么优惠？')">💰 有什么优惠？</span>
              <span class="quick-tag" @click="sendQuickQuestion('如何查看订单？')">📋 如何查看订单？</span>
              <span class="quick-tag" @click="sendQuickQuestion('商品是正品吗？')">✅ 商品是正品吗？</span>
              <span class="quick-tag" @click="sendQuickQuestion('怎么联系客服？')">👨‍💼 怎么联系客服？</span>
            </div>
          </div>

          <!-- 消息列表 -->
          <div
              class="chat-item"
              :class="item.type"
              v-for="(item, index) in chatList"
              :key="index"
          >
            <!-- 机器人消息 -->
            <template v-if="item.type === 'robot'">
              <div class="avatar robot-avatar">🤖</div>
              <div class="message-wrapper">
                <div class="time-stamp" v-if="item.time">{{ item.time }}</div>
                <div class="message-bubble robot-bubble">
                  {{ item.content }}
                </div>
              </div>
            </template>

            <!-- 用户消息 -->
            <template v-else>
              <div class="message-wrapper">
                <div class="time-stamp" v-if="item.time">{{ item.time }}</div>
                <div class="message-bubble user-bubble">
                  {{ item.content }}
                </div>
              </div>
              <div class="avatar user-avatar">👤</div>
            </template>
          </div>

          <!-- 正在输入提示 -->
          <div class="chat-item robot" v-if="isTyping">
            <div class="avatar robot-avatar">🤖</div>
            <div class="message-wrapper">
              <div class="message-bubble robot-bubble typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="chat-input-area">
          <div class="input-wrapper">
            <input
                v-model="inputText"
                type="text"
                placeholder="请输入您的问题..."
                @keyup.enter="sendMsg"
                :disabled="isTyping"
            >
            <button 
                class="send-btn" 
                @click="sendMsg" 
                :disabled="isTyping || !inputText.trim()"
            >
              <span v-if="!isTyping">发送</span>
              <span v-else class="loading-icon">···</span>
            </button>
          </div>
          <div class="input-tip">按 Enter 发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ProductItem from '../components/ProductItem.vue'
import { getProducts } from '../api/productApi'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(true)
const featuredProducts = ref([])

// 商品分类数据
const categories = ref([
  { id: 'electronics', name: '数码电子', icon: '📱', count: 0 },
  { id: 'food', name: '食品饮料', icon: '☕', count: 0 },
  { id: 'office', name: '办公用品', icon: '📝', count: 0 },
  { id: 'home', name: '家居生活', icon: '🏠', count: 0 },
  { id: 'photography', name: '摄影摄像', icon: '📷', count: 0 },
  { id: 'lifestyle', name: '生活方式', icon: '✨', count: 0 }
])

// ========== AI 客服核心逻辑（DeepSeek API） ==========
const showChat = ref(false)
const inputText = ref('')
const chatContentRef = ref(null)
const isTyping = ref(false) // AI正在输入

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 对话记录
const chatList = ref([
  { type: 'robot', content: '你好😊！我是商城智能客服，有什么可以帮您？\n\n您可以点击下方快捷问题，或直接输入您的问题~', time: getCurrentTime() }
])

// DeepSeek API配置
const DEEPSEEK_API_KEY = 'sk-f68d8bfffcb341fa8ff8dbc81a2351c2'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 构建系统提示词
const getSystemPrompt = () => {
  return `你是一个专业的电商商城AI客服助手，请遵循以下规则：
1. 友好、专业地回答用户问题
2. 回答要简洁明了，控制在200字以内
3. 如果用户询问商品信息，可以推荐相关商品
4. 如果用户询问订单、物流、售后等问题，给出专业解答
5. 保持热情、耐心的服务态度
6. 使用中文回复
7. 适当使用emoji表情增加亲和力

商城基本信息：
- 支持7天无理由退换货
- 全国包邮，24小时内发货
- 正品保障，假一赔十
- 商品分类：数码电子、食品饮料、办公用品、家居生活、摄影摄像、生活方式`
}

// 打开聊天窗口
const openAiChat = () => {
  showChat.value = true
  nextTick(() => {
    // 兼容写法，杜绝语法报错
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  })
}

// 关闭聊天窗口
const closeAiChat = () => {
  showChat.value = false
}

// 发送快捷问题
const sendQuickQuestion = (question) => {
  inputText.value = question
  sendMsg()
}

// 调用DeepSeek API
const callDeepSeekAPI = async (userMessage) => {
  try {
    const messages = [
      { role: 'system', content: getSystemPrompt() },
      ...chatList.value.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ]

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('DeepSeek API调用失败:', error)
    throw error
  }
}

// 发送消息
const sendMsg = async () => {
  const val = inputText.value.trim()
  if (!val || isTyping.value) return

  // 添加用户消息
  chatList.value.push({ type: 'user', content: val, time: getCurrentTime() })
  inputText.value = ''
  isTyping.value = true

  // 滚动到底部
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  })

  try {
    // 调用DeepSeek API
    const reply = await callDeepSeekAPI(val)
    
    // 添加AI回复
    chatList.value.push({ type: 'robot', content: reply, time: getCurrentTime() })
  } catch (error) {
    // API失败时的降级处理
    chatList.value.push({ 
      type: 'robot', 
      content: '抱歉，服务暂时不可用，请稍后再试。您可以咨询：发货时间、退换政策、商品推荐等问题。' 
    })
  } finally {
    isTyping.value = false
    // 滚动到底部
    nextTick(() => {
      if (chatContentRef.value) {
        chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
      }
    })
  }
}

// ========== 原有商城业务逻辑 ==========
const loadProducts = async () => {
  loading.value = true
  try {
    const data = await getProducts()
    featuredProducts.value = data.slice(0, 4)

    const categoryCount = {}
    data.forEach(product => {
      const cat = product.category || 'lifestyle'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    categories.value.forEach(cat => {
      cat.count = categoryCount[cat.id] || 0
    })
  } catch (error) {
    console.error('加载商品失败:', error)
    alert('⚠️ 加载商品失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 跳转分类
const goToCategory = (categoryId) => {
  router.push({ path: '/products', query: { category: categoryId } })
}

// 加入购物车
const handleAddToCart = (product) => {
  cartStore.addToCart(product)
  alert(`✅ ${product.name} 已添加到购物车`)
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.home {
  width: 100%;
  background-color: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 顶部横幅 */
.hero-banner {
  width: 100%;
  height: 520px;
  background: linear-gradient(120deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 80px;
}
.hero-banner::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 55%;
  height: 100%;
  background: rgba(255, 255, 255, 0.08);
  clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
}
.banner-inner {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;
}
.banner-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 14px;
  letter-spacing: 1px;
  margin-bottom: 20px;
  backdrop-filter: blur(4px);
}
.banner-text h1 {
  font-size: 52px;
  color: #ffffff;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.banner-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 40px;
  letter-spacing: 0.5px;
}
.primary-btn {
  display: inline-block;
  background: #ffffff;
  color: #2563eb;
  font-size: 16px;
  font-weight: 600;
  padding: 16px 48px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.primary-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

/* 区块标题 */
.section-head {
  text-align: center;
  margin-bottom: 40px;
}
.section-head h2 {
  font-size: 32px;
  color: #1f2937;
  font-weight: 700;
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}
.section-head h2::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -8px;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  border-radius: 3px;
}
.section-head p {
  font-size: 15px;
  color: #6b7280;
}

/* 商品分类 */
.category-section {
  margin-bottom: 80px;
}
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
}
.category-card {
  background: #fff;
  padding: 36px 16px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
}
.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(37, 99, 235, 0.12);
  border-color: #2563eb;
}
.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}
.category-card h3 {
  font-size: 17px;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 6px;
}
.category-num {
  font-size: 14px;
  color: #9ca3af;
}

/* 热门推荐 */
.featured-section {
  margin-bottom: 80px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
.loading-box {
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
}
.loading-spin {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 服务区域 */
.service-section {
  margin-bottom: 80px;
}
.service-wrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  background: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.service-item {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ai-service {
  cursor: pointer;
  transition: transform 0.2s;
}
.ai-service:hover {
  transform: scale(1.03);
}
.service-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe8dd 100%);
  border-radius: 12px;
}
.ai-service .service-icon {
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c00 100%);
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
}
.service-text h4 {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 4px;
}
.service-text p {
  font-size: 13px;
  color: #6b7280;
}

/* 悬浮客服按钮 - 淘宝风格 */
.ai-float-btn {
  position: fixed;
  right: 30px;
  bottom: 40px;
  width: 68px;
  height: 68px;
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c00 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 998;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(255, 106, 0, 0.4),
              0 0 0 0 rgba(255, 106, 0, 0.4);
  animation: pulse-shadow 2s infinite;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 2;
}

.btn-icon {
  font-size: 28px;
  line-height: 1;
}

.btn-text {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
}

/* 脉冲光环 */
.pulse-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 106, 0, 0.6);
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes pulse-shadow {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(255, 106, 0, 0.4),
                0 0 0 0 rgba(255, 106, 0, 0.4);
  }
  50% {
    box-shadow: 0 4px 16px rgba(255, 106, 0, 0.4),
                0 0 0 10px rgba(255, 106, 0, 0);
  }
}

.ai-float-btn:hover {
  transform: translateY(-6px) scale(1.08);
  box-shadow: 0 8px 24px rgba(255, 106, 0, 0.6);
  animation-play-state: paused;
}

.ai-float-btn:active {
  transform: translateY(-2px) scale(1.02);
}

/* AI聊天弹窗 - 淘宝风格 */
.ai-chat-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
}
.ai-chat-box {
  width: 480px;
  height: 640px;
  background: #f5f5f5;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

/* 头部样式 */
.chat-header {
  height: 60px;
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c00 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(255, 106, 0, 0.2);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.service-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(10px);
}
.service-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}
.online-status {
  font-size: 12px;
  opacity: 0.9;
  color: #7aff7a;
}
.close-btn {
  font-size: 20px;
  cursor: pointer;
  opacity: 0.9;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.close-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

/* 聊天内容区 */
.chat-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f5f5f5;
}
.chat-content::-webkit-scrollbar {
  width: 6px;
}
.chat-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}
.chat-content::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 欢迎提示 */
.welcome-tip {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.welcome-title {
  font-size: 15px;
  color: #333;
  margin-bottom: 16px;
  font-weight: 600;
}
.quick-questions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.quick-tag {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe8dd 100%);
  color: #ff6a00;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid #ffd9cc;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}
.quick-tag::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 106, 0, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}
.quick-tag:hover {
  background: linear-gradient(135deg, #ffe8dd 0%, #ffd9cc 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(255, 106, 0, 0.2);
  border-color: #ffb380;
}
.quick-tag:hover::before {
  width: 200px;
  height: 200px;
}
.quick-tag:active {
  transform: translateY(-1px) scale(0.98);
}

/* 消息项 */
.chat-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: messageSlideIn 0.3s ease-out;
}
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.chat-item.robot {
  justify-content: flex-start;
}
.chat-item.user {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

/* 头像 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.robot-avatar {
  background: linear-gradient(135deg, #fff5f0 0%, #ffe8dd 100%);
  border: 2px solid #ffd9cc;
}
.user-avatar {
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c00 100%);
  border: 2px solid #ffb380;
}

/* 消息包装器 */
.message-wrapper {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

/* 时间戳 */
.time-stamp {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  padding: 0 4px;
}
.chat-item.user .time-stamp {
  text-align: right;
}

/* 消息气泡 */
.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.7;
  font-size: 14px;
  word-wrap: break-word;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}
.robot-bubble {
  background: #fff;
  color: #333;
  border-top-left-radius: 4px;
  border: 1px solid #f0f0f0;
}
.user-bubble {
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c00 100%);
  color: #fff;
  border-top-right-radius: 4px;
}

/* 消息中的可点击链接 */
.clickable-text {
  color: #ff6a00;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dashed;
  transition: all 0.2s;
}
.clickable-text:hover {
  color: #e65c00;
  text-decoration-style: solid;
}

/* 正在输入动画 */
.typing-bubble {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 16px 20px !important;
  background: #fff !important;
}
.typing-dot {
  width: 8px;
  height: 8px;
  background: #ff6a00;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}
.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 输入区域 */
.chat-input-area {
  background: #fff;
  padding: 16px;
  border-top: 1px solid #e8e8e8;
}
.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}
.chat-input-area input {
  flex: 1;
  height: 44px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 22px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s;
  background: #fafafa;
}
.chat-input-area input:focus {
  border-color: #ff6a00;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.1);
}
.chat-input-area input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

/* 发送按钮 */
.send-btn {
  width: 80px;
  height: 44px;
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c00 100%);
  color: #fff;
  border: none;
  border-radius: 22px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(255, 106, 0, 0.3);
}
.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.4);
}
.send-btn:active:not(:disabled) {
  transform: translateY(0);
}
.send-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  box-shadow: none;
}
.loading-icon {
  display: inline-block;
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 输入提示 */
.input-tip {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .hero-banner {
    height: 420px;
  }
  .banner-text h1 {
    font-size: 40px;
  }
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .service-wrap {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .hero-banner {
    height: 360px;
  }
  .banner-inner {
    padding: 0 20px;
  }
  .banner-text h1 {
    font-size: 28px;
  }
  .banner-desc {
    font-size: 15px;
  }
  .primary-btn {
    padding: 14px 32px;
  }
  .section-head h2 {
    font-size: 24px;
  }
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .products-grid {
    grid-template-columns: 1fr;
  }
  .service-wrap {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .ai-chat-box {
    width: 92%;
    height: 80vh;
  }
  .ai-float-btn {
    right: 20px;
    bottom: 20px;
    width: 60px;
    height: 60px;
  }
  .btn-icon {
    font-size: 24px;
  }
  .btn-text {
    font-size: 11px;
  }
  .quick-questions {
    grid-template-columns: 1fr;
  }
}
</style>