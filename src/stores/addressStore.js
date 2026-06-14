import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { 
    getAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    getDefaultAddress 
} from '../api/userApi'

export const useAddressStore = defineStore('address', () => {
    // 从 localStorage 加载地址数据
    const loadAddressesFromStorage = () => {
        try {
            const savedAddresses = localStorage.getItem('shopping-addresses')
            return savedAddresses ? JSON.parse(savedAddresses) : []
        } catch (error) {
            console.error('加载地址数据失败:', error)
            return []
        }
    }

    // 地址列表
    const addresses = ref(loadAddressesFromStorage())

    // 监听地址变化，自动保存到 localStorage
    watch(addresses, (newAddresses) => {
        try {
            localStorage.setItem('shopping-addresses', JSON.stringify(newAddresses))
        } catch (error) {
            console.error('保存地址数据失败:', error)
        }
    }, { deep: true })

    // 获取默认地址
    const defaultAddress = computed(() => {
        return addresses.value.find(addr => addr.isDefault) || null
    })

    // 加载用户地址列表
    const loadUserAddresses = async (userId) => {
        try {
            const userAddresses = await getAddresses(userId)
            addresses.value = userAddresses
            return { success: true, addresses: userAddresses }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 添加地址
    const addUserAddress = async (userId, addressData) => {
        try {
            const newAddress = await addAddress(userId, addressData)
            addresses.value.push(newAddress)
            return { success: true, address: newAddress }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 更新地址
    const updateUserAddress = async (userId, addressId, addressData) => {
        try {
            const updatedAddress = await updateAddress(userId, addressId, addressData)
            const index = addresses.value.findIndex(addr => addr.id === addressId)
            if (index !== -1) {
                addresses.value[index] = updatedAddress
            }
            return { success: true, address: updatedAddress }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 删除地址
    const removeUserAddress = async (userId, addressId) => {
        try {
            await deleteAddress(userId, addressId)
            const index = addresses.value.findIndex(addr => addr.id === addressId)
            if (index !== -1) {
                addresses.value.splice(index, 1)
            }
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 设置默认地址
    const setUserDefaultAddress = async (userId, addressId) => {
        try {
            const defaultAddr = await setDefaultAddress(userId, addressId)
            // 更新本地数据
            addresses.value.forEach(addr => {
                if (addr.userId === userId) {
                    addr.isDefault = addr.id === addressId
                }
            })
            return { success: true, address: defaultAddr }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 获取默认地址
    const fetchDefaultAddress = async (userId) => {
        try {
            const defaultAddr = await getDefaultAddress(userId)
            if (defaultAddr) {
                // 更新本地数据
                const index = addresses.value.findIndex(addr => addr.id === defaultAddr.id)
                if (index !== -1) {
                    addresses.value[index] = defaultAddr
                } else {
                    addresses.value.push(defaultAddr)
                }
            }
            return { success: true, address: defaultAddr }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    // 清空地址列表
    const clearAddresses = () => {
        addresses.value = []
        localStorage.removeItem('shopping-addresses')
    }

    return {
        addresses,
        defaultAddress,
        loadUserAddresses,
        addUserAddress,
        updateUserAddress,
        removeUserAddress,
        setUserDefaultAddress,
        fetchDefaultAddress,
        clearAddresses
    }
})
