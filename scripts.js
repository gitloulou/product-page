// 获取页面中的元素
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartButton = document.getElementById('cartButton');
const cartPopup = document.getElementById('cartPopup');
const cartList = document.getElementById('cartList');
const totalPriceEl = document.getElementById('totalPrice');
const closeCart = document.getElementById('closeCart');
const checkoutButton = document.getElementById('checkoutButton');

// 初始化购物车
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 渲染购物车内容
function renderCart() {
    cartList.innerHTML = ''; // 清空现有列表
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - €${item.price.toFixed(2)}
            <button class="remove-item" data-index="${index}">❌</button>
        `;
        cartList.appendChild(li);
        total += item.price;
    });

    totalPriceEl.textContent = `Total: €${total.toFixed(2)}`;
    cartButton.textContent = `Panier (${cart.length})`;

    // 绑定删除事件
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// 更新购物车数据 + 重新渲染 + 保存到 localStorage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// 添加商品到购物车
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price); // 保证是浮点数
        cart.push({ name, price });
        updateCart();
    });
});

// 显示购物车
cartButton.addEventListener('click', () => {
    cartPopup.style.display = 'block';
});

// 关闭购物车
closeCart.addEventListener('click', () => {
    cartPopup.style.display = 'none';
});

// 模拟结算
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    alert("Merci pour votre achat !");
    cart = [];
    updateCart();
    cartPopup.style.display = 'none';
});

// 页面加载时渲染购物车
renderCart();

document.addEventListener('DOMContentLoaded', function () {
    const commentForm = document.getElementById('commentForm');
    const commentList = document.querySelector('#commentList ul');
    const clearButton = document.getElementById('clearComments');

    // ✅ 抽出函数用于添加留言到页面
    function addCommentToList(name, message, time) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${name}</strong> <em>(${time})</em><br>${message}`;
        commentList.appendChild(li);
    }

    // ✅ 加载本地保存的留言
    const savedComments = JSON.parse(localStorage.getItem('comments')) || [];

    savedComments.forEach(comment => {
        addCommentToList(comment.name, comment.message, comment.time);
    });

    // ✅ 提交留言表单
    commentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        const time = new Date().toLocaleString();

        if (name && message) {
            const newComment = { name, message, time };

            addCommentToList(name, message, time);
            savedComments.push(newComment);
            localStorage.setItem('comments', JSON.stringify(savedComments));
            commentForm.reset();
        }
    });

    // ✅ 清空留言（需密码验证）
    clearButton.addEventListener('click', function () {
        const confirmClear = confirm('Voulez-vous vraiment supprimer tous les messages ?');

        if (confirmClear) {
            const password = prompt("Entrez le mot de passe pour supprimer les messages :");

            if (password === "admin123") {
                localStorage.removeItem('comments');
                commentList.innerHTML = '';
                savedComments.length = 0;
                alert("Les messages ont été supprimés.");
            } else {
                alert("Mot de passe incorrect !");
            }
        }
    });
});










