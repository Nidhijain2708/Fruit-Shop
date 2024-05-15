const removeFromCartButton=document.querySelectorAll('.removeFromCart');

removeFromCartButton.forEach((btn)=>{
    btn.addEventListener('click',async (ev)=>{
        console.log(ev.target.getAttribute('productId'));
        let productId=ev.target.getAttribute('productId');
        let data=await axios.get(`/shop/removeFromCart?productId=${productId}`);
        console.log(data.data.cartCount);
        let cartCount=document.querySelector('.cartCount');
        cartCount.innerText=data.data.cartCount;
        window.location.reload()
    })
})