const addToCartButton=document.querySelectorAll('.addToCart');

addToCartButton.forEach((btn)=>{
    btn.addEventListener('click',async (ev)=>{
        console.log(ev.target.getAttribute('productId'));
        let productId=ev.target.getAttribute('productId');
        let data=await axios.get(`/shop/addTocart?productId=${productId}`);
        console.log(data.data.cartCount);
        let cartCount=document.querySelector('.cartCount');
        cartCount.innerText=data.data.cartCount;
    })
})