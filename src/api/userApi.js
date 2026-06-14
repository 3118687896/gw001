// 模拟用户数据
const users = [
    {
        id: 1,
        username: 'admin',
        password: '123456', // 实际项目中应该加密存储
        email: 'admin@example.com',
        phone: '13800138000',
        avatar: 'https://picsum.photos/id/1005/100/100',
        nickname: '管理员'
    },
    {
        id: 2,
        username: 'user1',
        password: '123456',
        email: 'user1@example.com',
        phone: '13800138001',
        avatar: 'https://picsum.photos/id/1006/100/100',
        nickname: '张三'
    },
    {
        id: 3,
        username: 'user2',
        password: '123456',
        email: 'user2@example.com',
        phone: '13800138002',
        avatar: 'https://picsum.photos/id/1007/100/100',
        nickname: '李四'
    }
]

// 模拟地址数据
let addresses = [
    {
        id: 1,
        userId: 2,
        name: '张三',
        phone: '13800138001',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技南路1001号',
        isDefault: true
    },
    {
        id: 2,
        userId: 2,
        name: '张三',
        phone: '13800138001',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '建国路99号',
        isDefault: false
    },
    {
        id: 3,
        userId: 3,
        name: '李四',
        phone: '13800138002',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        detail: '世纪大道1000号',
        isDefault: true
    }
]

// 登录
export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.username === username && u.password === password)
            if (user) {
                // 返回用户信息（不包含密码）
                const { password, ...userInfo } = user
                resolve(userInfo)
            } else {
                reject(new Error('用户名或密码错误'))
            }
        }, 500) // 模拟网络延迟
    })
}

// 注册
export const register = (userData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 检查用户名是否已存在
            const existingUser = users.find(u => u.username === userData.username)
            if (existingUser) {
                reject(new Error('用户名已存在'))
                return
            }

            // 创建新用户
            const newUser = {
                id: users.length + 1,
                username: userData.username,
                password: userData.password,
                email: userData.email || '',
                phone: userData.phone || '',
                avatar: `https://picsum.photos/id/${1005 + users.length}/100/100`,
                nickname: userData.nickname || userData.username
            }

            users.push(newUser)
            
            // 返回用户信息（不包含密码）
            const { password, ...userInfo } = newUser
            resolve(userInfo)
        }, 500)
    })
}

// 获取用户信息
export const getUserInfo = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = users.find(u => u.id === userId)
            if (user) {
                const { password, ...userInfo } = user
                resolve(userInfo)
            } else {
                resolve(null)
            }
        }, 300)
    })
}

// 更新用户信息
export const updateUserInfo = (userId, userData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userIndex = users.findIndex(u => u.id === userId)
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...userData }
                const { password, ...userInfo } = users[userIndex]
                resolve(userInfo)
            } else {
                reject(new Error('用户不存在'))
            }
        }, 300)
    })
}

// 获取用户地址列表
export const getAddresses = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userAddresses = addresses.filter(addr => addr.userId === userId)
            resolve(userAddresses)
        }, 300)
    })
}

// 添加地址
export const addAddress = (userId, addressData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newAddress = {
                id: Date.now(),
                userId: userId,
                ...addressData,
                isDefault: addressData.isDefault || false
            }

            // 如果设置为默认地址，取消其他默认地址
            if (newAddress.isDefault) {
                addresses.forEach(addr => {
                    if (addr.userId === userId) {
                        addr.isDefault = false
                    }
                })
            }

            addresses.push(newAddress)
            resolve(newAddress)
        }, 300)
    })
}

// 更新地址
export const updateAddress = (userId, addressId, addressData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const addressIndex = addresses.findIndex(
                addr => addr.id === addressId && addr.userId === userId
            )
            
            if (addressIndex !== -1) {
                // 如果设置为默认地址，取消其他默认地址
                if (addressData.isDefault) {
                    addresses.forEach(addr => {
                        if (addr.userId === userId && addr.id !== addressId) {
                            addr.isDefault = false
                        }
                    })
                }

                addresses[addressIndex] = { ...addresses[addressIndex], ...addressData }
                resolve(addresses[addressIndex])
            } else {
                reject(new Error('地址不存在'))
            }
        }, 300)
    })
}

// 删除地址
export const deleteAddress = (userId, addressId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const addressIndex = addresses.findIndex(
                addr => addr.id === addressId && addr.userId === userId
            )
            
            if (addressIndex !== -1) {
                addresses.splice(addressIndex, 1)
                resolve(true)
            } else {
                reject(new Error('地址不存在'))
            }
        }, 300)
    })
}

// 设置默认地址
export const setDefaultAddress = (userId, addressId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const address = addresses.find(
                addr => addr.id === addressId && addr.userId === userId
            )
            
            if (address) {
                // 取消其他默认地址
                addresses.forEach(addr => {
                    if (addr.userId === userId) {
                        addr.isDefault = false
                    }
                })
                
                // 设置新的默认地址
                address.isDefault = true
                resolve(address)
            } else {
                reject(new Error('地址不存在'))
            }
        }, 300)
    })
}

// 获取默认地址
export const getDefaultAddress = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const defaultAddr = addresses.find(
                addr => addr.userId === userId && addr.isDefault
            )
            resolve(defaultAddr || null)
        }, 300)
    })
}
