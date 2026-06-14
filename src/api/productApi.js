// 模拟商品图片（可使用网络图片，这里使用占位图）
const images = [
    '../src/assets/images/咖啡.jpg',   // 咖啡
    '../src/assets/images/全新轻薄本.jpg',   // 树叶
    '../src/assets/images/智能手表.jpg',   // 手机
    '../src/assets/images/便携式相机.jpg',   // 相机
    '../src/assets/images/陶瓷茶具.jpg',  // 茶具
    '../src/assets/images/台灯.jpg',   // 建筑
    '../src/assets/images/平板电脑.jpg',   // 电脑
    '../src/assets/images/降噪耳机.jpg',  // 耳机
    '../src/assets/images/运动手环.jpg',  // 手表
    '../src/assets/images/机械键盘.jpg',  // 键盘
    '../src/assets/images/鼠标.jpg',  // 鼠标
    'https://picsum.photos/id/237/300/200',  // 书籍
    'https://picsum.photos/id/250/300/200',  // 背包
    'https://picsum.photos/id/274/300/200',  // 鞋子
    'https://picsum.photos/id/292/300/200',  // 眼镜
    'https://picsum.photos/id/312/300/200',  // 水杯
    'https://picsum.photos/id/325/300/200',  // 台灯
    'https://picsum.photos/id/346/300/200',  // 植物
    'https://picsum.photos/id/367/300/200',  // 音响
    '../src/assets/images/平板电脑.jpg',  // 平板
    'https://picsum.photos/id/409/300/200',  // 充电宝
    'https://picsum.photos/id/430/300/200',  // 钱包
    'https://picsum.photos/id/451/300/200',  // 围巾
    'https://picsum.photos/id/472/300/200',  // 帽子
    'https://picsum.photos/id/493/300/200',  // 手套
    'https://picsum.photos/id/514/300/200',  // 雨伞
    'https://picsum.photos/id/535/300/200',  // 毛巾
    'https://picsum.photos/id/556/300/200',  // 枕头
    'https://picsum.photos/id/577/300/200',  // 地毯
    'https://picsum.photos/id/598/300/200',  // 画框
    'https://picsum.photos/id/619/300/200',  // 花瓶
    'https://picsum.photos/id/640/300/200',  // 蜡烛
    'https://picsum.photos/id/661/300/200',  // 香薰
    'https://picsum.photos/id/682/300/200',  // 护肤品
    'https://picsum.photos/id/703/300/200',  // 化妆品
    'https://picsum.photos/id/724/300/200',  // 牙刷
    'https://picsum.photos/id/745/300/200',  // 吹风机
    'https://picsum.photos/id/766/300/200',  // 剃须刀
    'https://picsum.photos/id/787/300/200',  // 体重秤
    'https://picsum.photos/id/808/300/200',  // 瑜伽垫
    'https://picsum.photos/id/829/300/200',  // 哑铃
    'https://picsum.photos/id/850/300/200',  // 篮球
    'https://picsum.photos/id/871/300/200',  // 足球
    'https://picsum.photos/id/892/300/200',  // 网球拍
    'https://picsum.photos/id/913/300/200',  // 羽毛球拍
    'https://picsum.photos/id/934/300/200',  // 乒乓球拍
    'https://picsum.photos/id/955/300/200',  // 滑板
    'https://picsum.photos/id/976/300/200',  // 自行车
    'https://picsum.photos/id/997/300/200'   // 行李箱
]

// 商品数据（50种商品）
const products = [
    // 数码电子类 (electronics)
    { id: 1, name: '精品手冲咖啡豆', price: 89.00, image: images[0], stock: 50, category: 'food' },
    { id: 2, name: '原木笔记本套装', price: 35.00, image: images[1], stock: 120, category: 'office' },
    { id: 3, name: '智能运动手环', price: 199.00, image: images[2], stock: 30, category: 'electronics' },
    { id: 4, name: '便携单反相机', price: 3299.00, image: images[3], stock: 10, category: 'photography' },
    { id: 5, name: '日式陶瓷茶具', price: 128.00, image: images[4], stock: 25, category: 'home' },
    { id: 6, name: '极简台灯', price: 159.00, image: images[5], stock: 40, category: 'home' },
    { id: 7, name: '超薄笔记本电脑', price: 5999.00, image: images[6], stock: 15, category: 'electronics' },
    { id: 8, name: '无线降噪耳机', price: 899.00, image: images[7], stock: 45, category: 'electronics' },
    { id: 9, name: '智能手表Pro', price: 1299.00, image: images[8], stock: 20, category: 'electronics' },
    { id: 10, name: '机械键盘RGB', price: 459.00, image: images[9], stock: 60, category: 'electronics' },
    { id: 11, name: '游戏鼠标', price: 299.00, image: images[10], stock: 80, category: 'electronics' },
    { id: 12, name: '平板电脑10寸', price: 2499.00, image: images[19], stock: 25, category: 'electronics' },
    { id: 13, name: '便携式充电宝', price: 129.00, image: images[20], stock: 100, category: 'electronics' },
    { id: 14, name: '蓝牙音箱', price: 399.00, image: images[18], stock: 55, category: 'electronics' },
    
    // 食品饮料类 (food)
    { id: 15, name: '进口巧克力礼盒', price: 168.00, image: images[11], stock: 70, category: 'food' },
    { id: 16, name: '有机绿茶500g', price: 98.00, image: images[12], stock: 90, category: 'food' },
    { id: 17, name: '坚果大礼包', price: 138.00, image: images[13], stock: 65, category: 'food' },
    { id: 18, name: '蜂蜜天然纯正', price: 78.00, image: images[14], stock: 85, category: 'food' },
    { id: 19, name: '咖啡豆意式浓缩', price: 118.00, image: images[15], stock: 40, category: 'food' },
    { id: 20, name: '红酒法国进口', price: 299.00, image: images[16], stock: 30, category: 'food' },
    { id: 21, name: '橄榄油特级初榨', price: 88.00, image: images[17], stock: 75, category: 'food' },
    
    // 办公用品类 (office)
    { id: 22, name: '钢笔礼盒装', price: 258.00, image: images[21], stock: 35, category: 'office' },
    { id: 23, name: '文件夹套装', price: 45.00, image: images[22], stock: 150, category: 'office' },
    { id: 24, name: '便签纸创意款', price: 28.00, image: images[23], stock: 200, category: 'office' },
    { id: 25, name: '订书机专业版', price: 68.00, image: images[24], stock: 95, category: 'office' },
    { id: 26, name: '计算器科学型', price: 89.00, image: images[25], stock: 70, category: 'office' },
    { id: 27, name: '文件收纳盒', price: 55.00, image: images[26], stock: 110, category: 'office' },
    
    // 家居生活类 (home)
    { id: 28, name: '纯棉四件套', price: 399.00, image: images[27], stock: 40, category: 'home' },
    { id: 29, name: '记忆棉枕头', price: 189.00, image: images[28], stock: 60, category: 'home' },
    { id: 30, name: '羊毛地毯', price: 599.00, image: images[29], stock: 20, category: 'home' },
    { id: 31, name: '装饰画现代简约', price: 268.00, image: images[30], stock: 45, category: 'home' },
    { id: 32, name: '陶瓷花瓶', price: 158.00, image: images[31], stock: 55, category: 'home' },
    { id: 33, name: '香薰蜡烛套装', price: 98.00, image: images[32], stock: 80, category: 'home' },
    { id: 34, name: '精油香薰机', price: 178.00, image: images[33], stock: 50, category: 'home' },
    
    // 摄影摄像类 (photography)
    { id: 35, name: '微单相机套机', price: 4599.00, image: images[34], stock: 12, category: 'photography' },
    { id: 36, name: '无人机航拍器', price: 3899.00, image: images[35], stock: 8, category: 'photography' },
    { id: 37, name: '三脚架专业版', price: 459.00, image: images[36], stock: 35, category: 'photography' },
    { id: 38, name: '相机包防水', price: 228.00, image: images[37], stock: 50, category: 'photography' },
    
    // 生活方式类 (lifestyle)
    { id: 39, name: '时尚双肩包', price: 299.00, image: images[12], stock: 70, category: 'lifestyle' },
    { id: 40, name: '运动鞋透气款', price: 459.00, image: images[13], stock: 55, category: 'lifestyle' },
    { id: 41, name: '太阳镜偏光', price: 328.00, image: images[14], stock: 65, category: 'lifestyle' },
    { id: 42, name: '保温杯500ml', price: 89.00, image: images[15], stock: 120, category: 'lifestyle' },
    { id: 43, name: '真皮钱包', price: 268.00, image: images[21], stock: 80, category: 'lifestyle' },
    { id: 44, name: '羊绒围巾', price: 398.00, image: images[22], stock: 45, category: 'lifestyle' },
    { id: 45, name: '棒球帽潮流', price: 78.00, image: images[23], stock: 100, category: 'lifestyle' },
    { id: 46, name: '防晒雨伞', price: 68.00, image: images[25], stock: 90, category: 'lifestyle' },
    { id: 47, name: '瑜伽垫加厚', price: 128.00, image: images[39], stock: 75, category: 'lifestyle' },
    { id: 48, name: '健身哑铃套装', price: 299.00, image: images[40], stock: 40, category: 'lifestyle' },
    { id: 49, name: '篮球正品', price: 189.00, image: images[41], stock: 60, category: 'lifestyle' },
    { id: 50, name: '旅行箱拉杆箱', price: 599.00, image: images[49], stock: 30, category: 'lifestyle' }
]

// 获取所有分类
export const getCategories = () => {
    const categories = [...new Set(products.map(p => p.category))]
    return categories
}

// 根据分类获取商品
export const getProductsByCategory = (category) => {
    if (!category || category === 'all') {
        return Promise.resolve([...products])
    }
    return Promise.resolve(products.filter(p => p.category === category))
}

// 模拟异步获取商品列表
export const getProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...products])
        }, 300)  // 模拟网络延迟
    })
}

// 根据id获取单个商品
export const getProductById = (id) => {
    return products.find(p => p.id === id)
}