import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { login, register, getUserInfo, updateUserInfo } from '../api/userApi'

export const useUserStore = defineStore('user', () => {
    // 从 localStorage 加载用户信息
    const loadUserFromStorage = () => {
        try {
            const savedUser = localStorage.getItem('shopping-user')
            return savedUser ? JSON.parse(savedUser) : null
        } catch (error) {
            console.error('加载用户信息失败:', error)
            return null
        }
    }

    // 当前用户信息
    const currentUser = ref(loadUserFromStorage())
    
    // 登录状态
    const isLoggedIn = computed(() => !!currentUser.value)

    // 监听用户变化，自动保存到 localStorage
    watch(currentUser, (newUser) => {
        try {
            if (newUser) {
                localStorage.setItem('shopping-user', JSON.stringify(newUser))
            } else {
                localStorage.removeItem('shopping-user')
            }
        } catch (error) {
            console.error('保存用户信息失败:', error)
        }
    }, { deep: true })

    // 登录
    const userLogin = async (username, password) => {
        try {
            const userInfo = await login(username, password)
            currentUser.value = userInfo
            return { success: true, user: userInfo }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 注册
    const userRegister = async (userData) => {
        try {
            const userInfo = await register(userData)
            currentUser.value = userInfo
            return { success: true, user: userInfo }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 登出
    const logout = () => {
        currentUser.value = null
        localStorage.removeItem('shopping-user')
    }

    // 更新用户信息
    const updateUser = async (userData) => {
        if (!currentUser.value) {
            return { success: false, error: '用户未登录' }
        }

        try {
            const updatedUser = await updateUserInfo(currentUser.value.id, userData)
            currentUser.value = updatedUser
            return { success: true, user: updatedUser }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 刷新用户信息
    const refreshUserInfo = async () => {
        if (!currentUser.value) {
            return { success: false, error: '用户未登录' }
        }

        try {
            const userInfo = await getUserInfo(currentUser.value.id)
            if (userInfo) {
                currentUser.value = userInfo
                return { success: true, user: userInfo }
            }
            return { success: false, error: '获取用户信息失败' }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return {
        currentUser,
        isLoggedIn,
        userLogin,
        userRegister,
        logout,
        updateUser,
        refreshUserInfo
    }
})
