const menuList = document.getElementById('menu-list')
const openBtn = document.getElementById('openBtn')
const closeBtn = document.getElementById('closeBtn')
const item = document.querySelector('.item')
const items = document.getElementById('item')
const itemss = document.getElementById('items')


function menuTransform() {
    if (menuList.classList.contains("open")) {
        menuList.classList.remove("open");
        menuList.classList.add("close");

    } else {
        menuList.classList.remove("close");
        menuList.classList.add("open");
    }

    
}

item.addEventListener("click", menuTransform)
items.addEventListener("click", menuTransform)
itemss.addEventListener("click", menuTransform)
openBtn.addEventListener("click", menuTransform)
closeBtn.addEventListener("click", menuTransform)

