const products = [
    { id: 1, name: "LS Classic Rock Tee", price: 399, imgText: "Graphic 1 (Gray/Black)" },
    { id: 2, name: "LS Vintage Heavy Tee", price: 399, imgText: "Graphic 2 (Gray/Black)" },
    { id: 3, name: "LS Dark Soul Tee", price: 399, imgText: "Graphic 3 (Gray/Black)" },
    { id: 4, name: "LS American Heritage Tee", price: 399, imgText: "Graphic 4 (Gray/Black)" }
];

let cart = [];

// โหลดแสดงสินค้าหน้าแรก
document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">[ รูปเสื้อ: ${p.imgText} ]</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price} บาท</div>
                <select id="size-${p.id}" class="size-select">
                    <option value="S">Size: S</option>
                    <option value="M">Size: M</option>
                    <option value="L" selected>Size: L</option>
                    <option value="XL">Size: XL</option>
                </select>
                <button class="add-btn" onclick="addToCart(${p.id})">เพิ่มลงตะกร้า</button>
            </div>
        </div>
    `).join('');
});

function toggleCart() {
    const modal = document.getElementById("cart-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const size = document.getElementById(`size-${productId}`).value;
    
    const cartItem = cart.find(item => item.id === productId && item.size === size);
    if (cartItem) {
        cartItem.qty += 1;
    } else {
        cart.push({ ...product, size, qty: 1 });
    }
    
    updateCartCount();
    alert("เพิ่มสินค้าลงตะกร้าแล้ว!");
}

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cart-count").innerText = totalCount;
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align:center; color:#888;'>ไม่มีสินค้าในตะกร้า</p>";
        document.getElementById("shipping-fee").innerText = "40";
        document.getElementById("grand-total").innerText = "0";
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong> (${item.size})<br>
                ${item.price} ฿ x ${item.qty}
            </div>
            <div>
                <button onclick="changeQty(${index}, -1)">-</button>
                <span style="margin: 0 8px;">${item.qty}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
        </div>
    `).join('');

    calculateTotal();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    updateCartUI();
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let shipping = subtotal >= 500 ? 0 : 40;
    if (subtotal === 0) shipping = 0;

    document.getElementById("shipping-fee").innerText = shipping;
    document.getElementById("grand-total").innerText = subtotal + shipping;
}

function openCheckout() {
    if (cart.length === 0) {
        alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");
        return;
    }
    document.getElementById("cart-modal").style.display = "none";
    document.getElementById("checkout-modal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

function submitOrder(event) {
    event.preventDefault();
    const name = document.getElementById("cust-name").value;
    const phone = document.getElementById("cust-phone").value;
    const address = document.getElementById("cust-address").value;
    const shippingPartner = document.getElementById("shipping-partner").value;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal >= 500 ? 0 : 40;
    const grandTotal = subtotal + shipping;

    let summaryText = `📦 *มีคำสั่งซื้อใหม่จาก LOUD SOUL* 📦\n\n`;
    cart.forEach(i => {
        summaryText += `- ${i.name} (Size: ${i.size}) x ${i.qty} = ${i.price * i.qty} ฿\n`;
    });
    summaryText += `\nค่าส่ง: ${shipping} ฿\n`;
    summaryText += `ยอดรวมทั้งหมด: *${grandTotal} ฿*\n\n`;
    summaryText += `👤 *ข้อมูลจัดส่ง*\n`;
    summaryText += `ชื่อ: ${name}\n`;
    summaryText += `เบอร์โทร: ${phone}\n`;
    summaryText += `ที่อยู่: ${address}\n`;
    summaryText += `ขนส่ง: ${shippingPartner}\n\n`;
    summaryText += `💳 โอนแล้วผ่าน KBank (1298712217 เนตรชนก)`;

    // คัดลอกข้อความสรุปคำสั่งซื้อลงคลิปบอร์ดอัตโนมัติ
    navigator.clipboard.writeText(summaryText).then(() => {
        alert("คัดลอกรายละเอียดคำสั่งซื้อสำเร็จ! กรุณานำส่งสลิปและข้อความนี้ให้ร้านค้าทาง Instagram / LINE ได้เลยครับ");
        location.reload();
    }).catch(err => {
        alert("สั่งซื้อสำเร็จ! กรุณาแคปหน้าจอสรุปยอดแจ้งร้านค้า");
    });
}