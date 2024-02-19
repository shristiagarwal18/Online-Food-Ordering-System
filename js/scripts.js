let recentOrders = [
    { orderId: '1001', customerName: 'Alice Johnson', itemName: 'Margherita Pizza', itemDescription: 'Classic pizza with tomato sauce, mozzarella, and basil', price: '300', orderDate: '2024-02-15' },
    { orderId: '1002', customerName: 'Bob Smith', itemName: 'Vegetable Biryani', itemDescription: 'Basmati rice with mixed vegetables and spices', price: '250', orderDate: '2024-02-16' }
];

document.addEventListener('DOMContentLoaded', function () {
    browseMenu();
    setupModal();
    setupOrderPlacement();
    setupOrderTracking();
    displayRecentOrders();
});

function browseMenu() {
    const dummyMenuItems = [
        { id: '001', name: 'Paneer Tikka', category: 'North Indian', price: '200', description: 'Marinated paneer grilled to perfection' },
        { id: '002', name: 'Masala Dosa', category: 'South Indian', price: '150', description: 'Crispy dosa with a filling of potato masala' }
    ];

    dummyMenuItems.forEach(item => addMenuItem(item));
}

function setupModal() {
    const addFoodModal = document.getElementById('add-food-modal');
    const openAddFoodBtn = document.getElementById('open-add-food-modal');
    const closeAddFoodBtn = document.querySelector('.close-button');

    openAddFoodBtn.addEventListener('click', function () {
        addFoodModal.style.display = 'block';
    });

    closeAddFoodBtn.addEventListener('click', function () {
        addFoodModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === addFoodModal) {
            addFoodModal.style.display = 'none';
        }
    });

    document.getElementById('add-food-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const foodId = document.getElementById('food-id').value;
        const foodName = document.getElementById('food-name').value;
        const foodCategory = document.getElementById('food-category').value;
        const foodPrice = document.getElementById('food-price').value;
        const foodDescription = document.getElementById('food-description').value;

        const newItem = { id: foodId, name: foodName, category: foodCategory, price: foodPrice, description: foodDescription };
        addMenuItem(newItem);
        addFoodModal.style.display = 'none';
        this.reset();
    });
}

function setupOrderPlacement() {
    document.getElementById('place-order-btn').addEventListener('click', function () {
        const customerName = document.getElementById('customer-name').value;
        const email = document.getElementById('customer-email').value;
        const phone = document.getElementById('customer-phone').value;
        const address = document.getElementById('customer-address').value;
        const orderItemId = document.getElementById('order-item-id').value; // Input field for item ID in the order form
        const orderId = generateOrderId();
        const orderDate = new Date().toISOString().split('T')[0];

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!validatePhoneNumber(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        const { itemName, itemDescription, price } = getItemDetailsById(orderItemId);
        if (!itemName) {
            alert('Item not found in the menu. Please check the Item ID.');
            return;
        }

        const orderDetails = {
            orderId,
            customerName,
            itemName,
            itemDescription,
            price,
            orderDate
        };

        placeOrder(orderDetails);
    });
}

function getItemDetailsById(itemId) {
    const menuItemsTable = document.getElementById('menu-items');
    const rows = Array.from(menuItemsTable.rows);

    const itemDetails = rows.find(row => row.cells[0].textContent === itemId);
    if (itemDetails) {
        return {
            itemName: itemDetails.cells[1].textContent,
            itemDescription: itemDetails.cells[4].textContent,
            price: itemDetails.cells[3].textContent.replace('₹', '')
        };
    }

    return {}; 
}


function addMenuItem(item) {
    const menuItemsTableBody = document.getElementById('menu-items');
    const row = menuItemsTableBody.insertRow();
    row.innerHTML = `<td>${item.id}</td><td>${item.name}</td><td>${item.category}</td><td>₹${item.price}</td><td>${item.description}</td><td><button class="add-to-cart-btn">Add to Cart</button></td>`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(phone) {
    const re = /^\d{10}$/;
    return re.test(String(phone));
}

async function placeOrder(orderDetails) {
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    recentOrders.push(orderDetails); 
    displayRecentOrders(); 
    alert('Order placed successfully!');
}

function displayRecentOrders() {
    const recentOrdersList = document.getElementById('recent-orders-list');
    recentOrdersList.innerHTML = ''; // Clear existing orders

    recentOrders.forEach(order => {
        const row = recentOrdersList.insertRow();
        row.innerHTML = `<td>${order.orderId}</td><td>${order.customerName}</td><td>${order.itemName}</td><td>${order.itemDescription}</td><td>₹${order.price}</td><td>${order.orderDate}</td>`;
    });
}

function setupOrderTracking() {
    document.getElementById('track-order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const orderID = document.getElementById('track-order-id').value;
        const orderStatusDisplay = document.getElementById('order-status');
        const order = recentOrders.find(o => o.orderId === orderID);

        if (order) {
            orderStatusDisplay.textContent = `Order Status for ${orderID}: In Transit`;
        } else {
            orderStatusDisplay.textContent = "Order not found. Please check your Order ID.";
        }
    });
}

function generateOrderId() {
    return Math.floor(Math.random() * 1000000).toString();
}

function filterOrders(startDate, endDate) {
    const filteredOrders = recentOrders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

}
