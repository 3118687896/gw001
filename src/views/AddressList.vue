<template>
    <div class="address-container">
        <h2>我的收货地址</h2>
        
        <!-- 未登录提示 -->
        <div v-if="!userStore.isLoggedIn" class="not-logged-in">
            <p>请先登录后再管理收货地址</p>
            <router-link to="/login" class="btn-primary">去登录</router-link>
        </div>
        
        <!-- 已登录内容 -->
        <div v-else>
            <!-- 操作按钮 -->
            <div class="actions">
                <button @click="showAddForm = !showAddForm" class="btn-primary">
                    {{ showAddForm ? '取消添加' : '+ 添加新地址' }}
                </button>
            </div>
            
            <!-- 添加地址表单 -->
            <div v-if="showAddForm" class="address-form">
                <h3>{{ editingAddressId ? '编辑地址' : '添加新地址' }}</h3>
                <form @submit.prevent="handleSubmitAddress">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">收货人姓名</label>
                            <input 
                                type="text" 
                                id="name" 
                                v-model="addressForm.name" 
                                placeholder="请输入收货人姓名"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="phone">手机号码</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                v-model="addressForm.phone" 
                                placeholder="请输入手机号码"
                                pattern="[0-9]{11}"
                                required
                            />
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="province">省份</label>
                            <input 
                                type="text" 
                                id="province" 
                                v-model="addressForm.province" 
                                placeholder="例如：广东省"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="city">城市</label>
                            <input 
                                type="text" 
                                id="city" 
                                v-model="addressForm.city" 
                                placeholder="例如：深圳市"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="district">区县</label>
                            <input 
                                type="text" 
                                id="district" 
                                v-model="addressForm.district" 
                                placeholder="例如：南山区"
                                required
                            />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="detail">详细地址</label>
                        <textarea 
                            id="detail" 
                            v-model="addressForm.detail" 
                            placeholder="请输入详细地址（街道、门牌号等）"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label>
                            <input 
                                type="checkbox" 
                                v-model="addressForm.isDefault"
                            />
                            设为默认地址
                        </label>
                    </div>
                    
                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary" :disabled="loading">
                            {{ loading ? '保存中...' : '保存' }}
                        </button>
                        <button type="button" @click="cancelEdit" class="btn-secondary">
                            取消
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- 地址列表 -->
            <div class="address-list" v-if="addressStore.addresses.length > 0">
                <div 
                    v-for="addr in addressStore.addresses" 
                    :key="addr.id"
                    class="address-card"
                    :class="{ 'is-default': addr.isDefault }"
                >
                    <div class="address-header">
                        <span class="recipient-name">{{ addr.name }}</span>
                        <span class="recipient-phone">{{ addr.phone }}</span>
                        <span v-if="addr.isDefault" class="default-badge">默认</span>
                    </div>
                    
                    <div class="address-content">
                        {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}
                    </div>
                    
                    <div class="address-actions">
                        <button 
                            @click="handleSetDefault(addr.id)" 
                            class="btn-small"
                            :disabled="addr.isDefault || loading"
                        >
                            设为默认
                        </button>
                        <button 
                            @click="handleEditAddress(addr)" 
                            class="btn-small btn-edit"
                            :disabled="loading"
                        >
                            编辑
                        </button>
                        <button 
                            @click="handleDeleteAddress(addr.id)" 
                            class="btn-small btn-delete"
                            :disabled="loading"
                        >
                            删除
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 空状态 -->
            <div v-else-if="!loading && !showAddForm" class="empty-state">
                <p>暂无收货地址</p>
                <p>点击上方"添加新地址"按钮添加您的第一个收货地址</p>
            </div>
            
            <!-- 加载状态 -->
            <div v-if="loading" class="loading">
                <p>加载中...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useAddressStore } from '../stores/addressStore'

const userStore = useUserStore()
const addressStore = useAddressStore()

// 是否显示添加表单
const showAddForm = ref(false)

// 正在编辑的地址ID
const editingAddressId = ref(null)

// 加载状态
const loading = ref(false)

// 错误信息
const errorMessage = ref('')

// 地址表单
const addressForm = ref({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
})

// 加载用户地址
const loadAddresses = async () => {
    if (!userStore.currentUser) return
    
    loading.value = true
    await addressStore.loadUserAddresses(userStore.currentUser.id)
    loading.value = false
}

// 提交地址表单
const handleSubmitAddress = async () => {
    if (!userStore.currentUser) return
    
    loading.value = true
    errorMessage.value = ''
    
    let result
    if (editingAddressId.value) {
        // 更新地址
        result = await addressStore.updateUserAddress(
            userStore.currentUser.id,
            editingAddressId.value,
            addressForm.value
        )
    } else {
        // 添加地址
        result = await addressStore.addUserAddress(
            userStore.currentUser.id,
            addressForm.value
        )
    }
    
    loading.value = false
    
    if (result.success) {
        // 重置表单
        resetForm()
        showAddForm.value = false
    } else {
        errorMessage.value = result.error
    }
}

// 编辑地址
const handleEditAddress = (address) => {
    editingAddressId.value = address.id
    addressForm.value = { ...address }
    showAddForm.value = true
}

// 取消编辑
const cancelEdit = () => {
    resetForm()
    showAddForm.value = false
}

// 重置表单
const resetForm = () => {
    editingAddressId.value = null
    addressForm.value = {
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: false
    }
}

// 设置默认地址
const handleSetDefault = async (addressId) => {
    if (!userStore.currentUser) return
    
    loading.value = true
    const result = await addressStore.setUserDefaultAddress(
        userStore.currentUser.id,
        addressId
    )
    loading.value = false
    
    if (!result.success) {
        alert('设置默认地址失败：' + result.error)
    }
}

// 删除地址
const handleDeleteAddress = async (addressId) => {
    if (!userStore.currentUser) return
    
    if (!confirm('确定要删除这个地址吗？')) return
    
    loading.value = true
    const result = await addressStore.removeUserAddress(
        userStore.currentUser.id,
        addressId
    )
    loading.value = false
    
    if (result.success) {
        // 如果删除的是正在编辑的地址，重置表单
        if (editingAddressId.value === addressId) {
            resetForm()
            showAddForm.value = false
        }
    } else {
        alert('删除地址失败：' + result.error)
    }
}

// 组件挂载时加载地址
onMounted(() => {
    if (userStore.isLoggedIn) {
        loadAddresses()
    }
})
</script>

<style scoped>
.address-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.address-container h2 {
    color: #333;
    margin-bottom: 30px;
}

.not-logged-in {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 8px;
}

.not-logged-in p {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
}

.actions {
    margin-bottom: 20px;
}

.address-form {
    background: white;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-form h3 {
    margin-bottom: 20px;
    color: #333;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007bff;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
}

.error-message {
    background: #fee;
    color: #c33;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 14px;
}

.form-actions {
    display: flex;
    gap: 10px;
}

.address-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.address-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: all 0.3s;
}

.address-card.is-default {
    border-color: #007bff;
}

.address-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.recipient-name {
    font-weight: 600;
    font-size: 16px;
    color: #333;
}

.recipient-phone {
    color: #666;
}

.default-badge {
    background: #007bff;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.address-content {
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
}

.address-actions {
    display: flex;
    gap: 10px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 8px;
    color: #999;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #666;
}

.btn-primary {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
    text-decoration: none;
    display: inline-block;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

.btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.btn-secondary {
    padding: 10px 20px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-secondary:hover {
    background: #545b62;
}

.btn-small {
    padding: 6px 12px;
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-small:hover:not(:disabled) {
    background: #e9ecef;
}

.btn-small:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-edit {
    color: #007bff;
    border-color: #007bff;
}

.btn-edit:hover:not(:disabled) {
    background: #007bff;
    color: white;
}

.btn-delete {
    color: #dc3545;
    border-color: #dc3545;
}

.btn-delete:hover:not(:disabled) {
    background: #dc3545;
    color: white;
}
</style>
