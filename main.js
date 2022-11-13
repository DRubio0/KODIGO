const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const template = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', ()=>{
    feachData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
} )

cards.addEventListener('click',e=>{
    addCarrito(e)
})

items.addEventListener('click', e=>{
    btnAccion(e)
})
//capturando los datos del Json
const feachData = async()=>{
    try {
        const res = await fetch('api.json')
        const data = await res.json()
       // console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data =>{
   // console.log(data)
    data.forEach(producto =>{

        //cargando datos a la CARD de bootstrap
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p').textContent = producto.precio
        template.querySelector('img').setAttribute ("src",producto.thumbnailUrl)
        template.querySelector('.btn-dark').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e=>{
   //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
        
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
   // console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad +1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () =>{
  //  console.log(carrito)
    items.innerHTML =''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pritarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pritarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
          <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=> acc + cantidad ,0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio})=>acc + cantidad *precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', ()=>{
        carrito ={}
        pintarCarrito()
    })
}

const btnAccion = e =>{
    // console.log(e.target)
    //accion de aumetar por boton
    if(e.target.classList.contains('btn-info')){
       // carrito[e.target.dataset.id]
       // console.log(carrito[e.target.dataset.id])

    //console.log(e.target)
        const producto = carrito[e.target.dataset.id]
        producto.cantidad ++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad --
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}