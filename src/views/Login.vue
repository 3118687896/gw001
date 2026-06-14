<template>
    <div class="login-container">
        <div class="login-box">
            <h2>{{ isLoginMode ? '用户登录' : '用户注册' }}</h2>
            
            <!-- 登录表单 -->
            <form v-if="isLoginMode" @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input 
                        type="text" 
                        id="username" 
                        v-model="loginForm.username" 
                        placeholder="请输入用户名"
                        required
                    />
                </div>
                
                <div class="form-group">
                    <label for="password">密码</label>
                    <input 
                        type="password" 
                        id="password" 
                        v-model="loginForm.password" 
                        placeholder="请输入密码"
                        required
                    />
                </div>
                
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
                
                <button type="submit" class="btn-primary" :disabled="loading">
                    {{ loading ? '登录中...' : '登录' }}
                </button>
                
                <p class="switch-mode">
                    还没有账号？
                    <a href="#" @click.prevent="toggleMode">立即注册</a>
                </p>
            </form>
            
            <!-- 注册表单 -->
            <form v-else @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="reg-username">用户名</label>
                    <input 
                        type="text" 
                        id="reg-username" 
                        v-model="registerForm.username" 
                        placeholder="请输入用户名"
                        required
                    />
                </div>
                
                <div class="form-group">
                    <label for="reg-password">密码</label>
                    <input 
                        type="password" 
                        id="reg-password" 
                        v-model="registerForm.password" 
                        placeholder="请输入密码（至少6位）"
                        minlength="6"
                        required
                    />
                </div>
                
                <div class="form-group">
                    <label for="reg-nickname">昵称（可选）</label>
                    <input 
                        type="text" 
                        id="reg-nickname" 
                        v-model="registerForm.nickname" 
                        placeholder="请输入昵称"
                    />
                </div>
                
                <div class="form-group">
                    <label for="reg-email">邮箱（可选）</label>
                    <input 
                        type="email" 
                        id="reg-email" 
                        v-model="registerForm.email" 
                        placeholder="请输入邮箱"
                    />
                </div>
                
                <div class="form-group">
                    <label for="reg-phone">手机号（可选）</label>
                    <input 
                        type="tel" 
                        id="reg-phone" 
                        v-model="registerForm.phone" 
                        placeholder="请输入手机号"
                    />
                </div>
                
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
                
                <button type="submit" class="btn-primary" :disabled="loading">
                    {{ loading ? '注册中...' : '注册' }}
                </button>
                
                <p class="switch-mode">
                    已有账号？
                    <a href="#" @click.prevent="toggleMode">立即登录</a>
                </p>
            </form>
            
            <!-- 测试账号提示 -->
            <div class="test-accounts" v-if="isLoginMode">
                <p><strong>测试账号：</strong></p>
                <p>用户名: admin / 密码: 123456</p>
                <p>用户名: user1 / 密码: 123456</p>
                <p>用户名: user2 / 密码: 123456</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// 是否为登录模式
const isLoginMode = ref(true)

// 加载状态
const loading = ref(false)

// 错误信息
const errorMessage = ref('')

// 登录表单
const loginForm = ref({
    username: '',
    password: ''
})

// 注册表单
const registerForm = ref({
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: ''
})

// 切换登录/注册模式
const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value
    errorMessage.value = ''
    loginForm.value = { username: '', password: '' }
    registerForm.value = { username: '', password: '', nickname: '', email: '', phone: '' }
}

// 处理登录
const handleLogin = async () => {
    loading.value = true
    errorMessage.value = ''
    
    const result = await userStore.userLogin(loginForm.value.username, loginForm.value.password)
    
    loading.value = false
    
    if (result.success) {
        // 登录成功，跳转到首页
        router.push('/')
    } else {
        errorMessage.value = result.error
    }
}

// 处理注册
const handleRegister = async () => {
    loading.value = true
    errorMessage.value = ''
    
    const result = await userStore.userRegister(registerForm.value)
    
    loading.value = false
    
    if (result.success) {
        // 注册成功，跳转到首页
        router.push('/')
    } else {
        errorMessage.value = result.error
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 120px);
    padding: 20px;
}

.login-box {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px;
}

.login-box h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
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

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
}

.error-message {
    background: #fee;
    color: #c33;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 14px;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

.btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.switch-mode {
    text-align: center;
    margin-top: 20px;
    color: #666;
}

.switch-mode a {
    color: #007bff;
    text-decoration: none;
}

.switch-mode a:hover {
    text-decoration: underline;
}

.test-accounts {
    margin-top: 30px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 13px;
    color: #666;
}

.test-accounts p {
    margin: 5px 0;
}
</style>
