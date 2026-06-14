import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
    // 从 localStorage 加载购物车数据
    const loadCartFromStorage = () => {
        try {
            const savedCart = localStorage.getItem('shopping-cart')
            return savedCart ? JSON.parse(savedCart) : []
        } catch (error) {
            console.error('加载购物车数据失败:', error)
            return []
        }
    }

    // 购物车数据：{ id, name, price, image, quantity }
    const cartItems = ref(loadCartFromStorage())

    // 监听购物车变化，自动保存到 localStorage
    watch(cartItems, (newCart) => {
        try {
            localStorage.setItem('shopping-cart', JSON.stringify(newCart))
        } catch (error) {
            console.error('保存购物车数据失败:', error)
        }
    }, { deep: true })

    // 获取购物车商品总数
    const totalCount = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
    })

    // 获取购物车总价
    const totalPrice = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })

    // 添加商品到购物车
    const addToCart = (product, quantity = 1) => {
        const existingItem = cartItems.value.find(item => item.id === product.id)

        if (existingItem) {
            existingItem.quantity += quantity
            // 更新库存信息
            if (product.stock !== undefined) {
                existingItem.stock = product.stock
            }
        } else {
            cartItems.value.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                stock: product.stock || 999 // 默认库存999
            })
        }
    }

    // 更新商品数量
    const updateQuantity = (productId, newQuantity) => {
        const item = cartItems.value.find(item => item.id === productId)
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId)
            } else {
                item.quantity = newQuantity
            }
        }
    }

    // 从购物车移除商品
    const removeFromCart = (productId) => {
        const index = cartItems.value.findIndex(item => item.id === productId)
        if (index !== -1) {
            cartItems.value.splice(index, 1)
        }
    }

    // 清空购物车
    const clearCart = () => {
        cartItems.value = []
        localStorage.removeItem('shopping-cart')
    }

    return {
        cartItems,
        totalCount,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
    }
})