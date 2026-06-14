<template>
  <div class="cart-item">
    <div class="item-image">
      <img :src="item.image" :alt="item.name" />
    </div>
    <div class="item-details">
      <h4>{{ item.name }}</h4>
      <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
    </div>
    <div class="item-quantity">
      <button @click="handleDecrease" :disabled="item.quantity <= 1">-</button>
      <input 
        type="number" 
        :value="item.quantity" 
        @change="handleInputChange"
        @blur="validateInput"
        :min="1" 
        :max="item.stock || 999"
        class="quantity-input"
      />
      <button @click="updateQuantity(item.quantity + 1)" :disabled="item.quantity >= (item.stock || 999)">+</button>
    </div>
    <div class="item-subtotal">
      ¥{{ (item.price * item.quantity).toFixed(2) }}
    </div>
    <button class="remove-btn" @click="emit('removeItem', item)">删除</button>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updateQuantity', 'removeItem'])

// 处理输入框变化
const handleInputChange = (event) => {
  const value = parseInt(event.target.value)
  if (value && value >= 1) {
    const maxStock = props.item.stock || 999
    if (value > maxStock) {
      emit('updateQuantity', props.item, maxStock)
      alert(`⚠️ 库存不足，最多可购买 ${maxStock} 件`)
    } else {
      emit('updateQuantity', props.item, value)
    }
  }
}

// 验证输入（失去焦点时）
const validateInput = (event) => {
  const value = parseInt(event.target.value)
  if (!value || value < 1) {
    emit('updateQuantity', props.item, 1)
  }
}

const updateQuantity = (newQuantity) => {
  const maxStock = props.item.stock || 999
  if (newQuantity >= 1 && newQuantity <= maxStock) {
    emit('updateQuantity', props.item, newQuantity)
  } else if (newQuantity > maxStock) {
    emit('updateQuantity', props.item, maxStock)
    alert(`⚠️ 库存不足，最多可购买 ${maxStock} 件`)
  }
}

const handleDecrease = () => {
  if (props.item.quantity <= 1) {
    emit('removeItem', props.item)
  } else {
    updateQuantity(props.item.quantity - 1)
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f2f3f5;
  gap: 16px;
  flex-wrap: wrap;
  transition: background 0.2s;
}

.cart-item:hover {
  background: #fafafa;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 2;
  min-width: 150px;
}

.item-details h4 {
  margin-bottom: 6px;
  color: #1f2329;
  font-weight: 500;
  font-size: 0.95rem;
}

.item-price {
  color: #0052d9;
  font-weight: 600;
  font-size: 1rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-input {
  width: 60px;
  height: 32px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #1f2329;
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  padding: 4px;
  transition: all 0.2s;
}

.quantity-input:focus {
  outline: none;
  border-color: #0052d9;
  box-shadow: 0 0 0 2px rgba(0, 82, 217, 0.1);
}

.item-quantity button {
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 16px;
  background: #f5f7fa;
  color: #646a73;
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  transition: all 0.2s;
}

.item-quantity button:hover:not(:disabled) {
  background: #e8ebff;
  border-color: #0052d9;
  color: #0052d9;
}

.item-quantity button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.item-quantity span {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
  display: none;
}

.item-subtotal {
  min-width: 100px;
  font-weight: 600;
  color: #0052d9;
  font-size: 1.1rem;
}

.remove-btn {
  background: #ffffff;
  color: #dc3545;
  border: 1px solid #dc3545;
  padding: 6px 14px;
  font-size: 0.8rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #dc3545;
  color: white;
}

@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
  }

  .item-details {
    text-align: center;
  }
}
</style>