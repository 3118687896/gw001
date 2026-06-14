import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useOrderStore = defineStore('order', () => {
    // 从 localStorage 加载订单数据
    const loadOrdersFromStorage = () => {
        try {
            const savedOrders = localStorage.getItem('shopping-orders')
            return savedOrders ? JSON.parse(savedOrders) : []
        } catch (error) {
            console.error('加载订单数据失败:', error)
            return []
        }
    }

    // 订单列表
    const orders = ref(loadOrdersFromStorage())

    // 监听订单变化，自动保存到 localStorage
    watch(orders, (newOrders) => {
        try {
            localStorage.setItem('shopping-orders', JSON.stringify(newOrders))
        } catch (error) {
            console.error('保存订单数据失败:', error)
        }
    }, { deep: true })

    // 订单状态枚举
    const OrderStatus = {
        UNPAID: 'unpaid',         // 未付款
        PAID: 'paid',             // 已付款
        SHIPPED: 'shipped',       // 已发货
        DELIVERED: 'delivered'    // 待发货（已完成）
    }

    // 获取所有订单
    const allOrders = computed(() => {
        return orders.value
    })

    // 获取未付款订单
    const unpaidOrders = computed(() => {
        return orders.value.filter(order => order.status === OrderStatus.UNPAID)
    })

    // 获取已付款订单
    const paidOrders = computed(() => {
        return orders.value.filter(order => order.status === OrderStatus.PAID)
    })

    // 获取已发货订单
    const shippedOrders = computed(() => {
        return orders.value.filter(order => order.status === OrderStatus.SHIPPED)
    })

    // 获取待发货订单（已完成）
    const deliveredOrders = computed(() => {
        return orders.value.filter(order => order.status === OrderStatus.DELIVERED)
    })

    // 根据状态获取订单
    const getOrdersByStatus = (status) => {
        if (!status || status === 'all') {
            return allOrders.value
        }
        return orders.value.filter(order => order.status === status)
    }

    // 创建新订单（从购物车结算）
    const createOrder = (cartItems, totalPrice, address = null) => {
        const newOrder = {
            id: Date.now(), // 使用时间戳作为订单ID
            orderNo: generateOrderNo(), // 订单号
            items: [...cartItems], // 商品列表
            totalAmount: totalPrice, // 总金额
            address: address, // 收货地址
            status: OrderStatus.UNPAID, // 初始状态：未付款
            createTime: new Date().toISOString(), // 创建时间
            payTime: null, // 支付时间
            shipTime: null, // 发货时间
            deliverTime: null // 完成时间
        }

        orders.value.unshift(newOrder) // 添加到订单列表开头
        return newOrder
    }

    // 生成订单号
    const generateOrderNo = () => {
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
        return `ORD${year}${month}${day}${random}`
    }

    // 更新订单状态
    const updateOrderStatus = (orderId, newStatus) => {
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
            order.status = newStatus
            
            // 记录状态变更时间
            const now = new Date().toISOString()
            if (newStatus === OrderStatus.PAID) {
                order.payTime = now
            } else if (newStatus === OrderStatus.SHIPPED) {
                order.shipTime = now
            } else if (newStatus === OrderStatus.DELIVERED) {
                order.deliverTime = now
            }
        }
    }

    // 支付订单
    const payOrder = (orderId) => {
        updateOrderStatus(orderId, OrderStatus.PAID)
    }

    // 发货
    const shipOrder = (orderId) => {
        updateOrderStatus(orderId, OrderStatus.SHIPPED)
    }

    // 确认收货（完成订单）
    const deliverOrder = (orderId) => {
        updateOrderStatus(orderId, OrderStatus.DELIVERED)
    }

    // 取消订单
    const cancelOrder = (orderId) => {
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index !== -1) {
            orders.value.splice(index, 1)
        }
    }

    // 清空所有订单
    const clearAllOrders = () => {
        orders.value = []
        localStorage.removeItem('shopping-orders')
    }

    return {
        orders,
        allOrders,
        unpaidOrders,
        paidOrders,
        shippedOrders,
        deliveredOrders,
        OrderStatus,
        getOrdersByStatus,
        createOrder,
        updateOrderStatus,
        payOrder,
        shipOrder,
        deliverOrder,
        cancelOrder,
        clearAllOrders
    }
})
