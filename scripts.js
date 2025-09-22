console.log("📦 JS load！");

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
    console.log("📦 JS and DOM loaded！");

    const commentForm = document.getElementById('commentForm');
    const commentList = document.querySelector('#commentList ul');
    const clearButton = document.getElementById('clearComments');

    // 显示评论到页面
    function addCommentToList(name, message, time) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${name}</strong> <em>(${time})</em><br>${message}`;
        commentList.appendChild(li);
    }

    // 从 Firestore 读取评论
    function loadComments() {
        commentList.innerHTML = ''; // 清空列表
        db.collection('comments')
          .orderBy('time', 'desc')
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data();
                addCommentToList(data.name, data.message, new Date(data.time).toLocaleString());
            });
          })
          .catch(error => {
            console.error("Erreur lors du chargement des commentaires : ", error);
          });
    }

    loadComments();

    // 提交评论到 Firestore
    commentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        const time = Date.now();

        if (name && message) {
            db.collection('comments').add({
                name: name,
                message: message,
                time: time
            }).then(() => {
                addCommentToList(name, message, new Date(time).toLocaleString());
                commentForm.reset();
            }).catch(error => {
                alert('Erreur lors de l\'ajout du commentaire.');
                console.error(error);
            });
        }
    });

    // 清空留言需要权限 — 这里改成清空 Firestore 的 comments 集合（要小心用）
    clearButton.addEventListener('click', async function () {
        const confirmClear = confirm('Voulez-vous vraiment supprimer tous les messages ?');

        if (!confirmClear) return;

        const password = prompt("Entrez le mot de passe pour supprimer les messages :");

        if (password !== "admin123") {
            alert("Mot de passe incorrect !");
            return;
        }

        // 读取所有文档并删除
        try {
            const snapshot = await db.collection('comments').get();
            const batch = db.batch();

            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            commentList.innerHTML = '';
            alert("Les messages ont été supprimés.");
        } catch (error) {
            alert("Erreur lors de la suppression des messages.");
            console.error(error);
        }
    });
});














