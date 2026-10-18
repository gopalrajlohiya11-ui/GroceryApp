import { useEffect,useState } from "react";

function App(){
  const [products,setProducts]=useState([]);
  const [name,setName]=useState("");
  const [price,setPrice]=useState("");
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("all");
  const [sortOrder,setSortOrder]=useState("default");
  const [cart,setCart]=useState([]);

  const categories=[
    ...new Set(products.map((product)=>product.category)),
  ];
  function addToCart(product){
    setCart((prev)=>[...prev,product]);
  }
  useEffect(()=>{
    async function fetchProducts() {
      try{
        const response =await fetch(
          "https://dummyjson.com/products"
        );
        if(!response.ok){
          throw new Error("nhi hua add , fail");
        }
        const data =await response.json();
        setProducts(data.products);
      }catch(e){
        console.error("error aa gaya",e);
      }
    }
    fetchProducts();
  },[]);

  async function handleAddProduct(e) {
    e.preventDefault();
    try{
      const response=await fetch(
        "http://localhost:5000/api/products",
        {
          method:"post",
          headers:{
            "content-type":"application/json",
          },
          body:JSON.stringify({
            name,
            price:Number(price),
          }),
        }
      );
      if(!response.ok){
        throw new Error("nhi hua add , fail");
      }
      const newProduct=await response.json();
      setProducts((prev)=>[...prev,newProduct]);
      setName("");
      setPrice("");
    }catch(e){
      console.error(e);
    }
    
  }

  const filteredProducts=products.filter((product)=>
    (product.title || product.name || "").toLowerCase().includes(search.toLowerCase())
  ).filter(
    (product)=>
      category==="all" || product.category===category
  ).sort((a,b)=>{
    if(sortOrder==="low"){
      return a.price-b.price;
    }
    if(sortOrder==="high"){
      return b.price-a.price;
    }
    return 0;
  });
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
      <h1>Product Manager</h1>
      <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}/>
      <form onSubmit={handleAddProduct}>
        <input
        placeholder="Product name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        required/>
        <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
        min="0"
        required/>

        <button type="submit">Add</button>
      </form>
      <select
      value={category}
      onChange={(e)=>setCategory(e.target.value)}
      >
      <option value="all"> ALl categories</option>
      {categories.map((cat)=>(
        <option key={cat} value={cat}>{cat}</option>
      ))}
      </select>
      
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="default">Default Order</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>

      <div className="product-grid">
        {filteredProducts.map((product)=>(
          <div className="product-card" key={product.id}>
            <h3>{product.title || product.name}</h3>
            <p>price :{product.price}</p>
            <img src={product.thumbnail} alt={product.title} width="100"/>
            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>

          </div>
        ))}
      </div>
      <div className="cart">

        <h2>Shopping Cart</h2>

        {cart.map((product, index) => (
          <div key={`${product.id}-${index}`}>
            <span>{product.title} — ₹{product.price}</span>

            <button
              onClick={() =>
                setCart((prevCart) =>
                  prevCart.filter((_, i) => i !== index)
                )
              }
            >
              Remove
            </button>
          </div>
        ))}

        <h3>
          Total: ₹{cart.reduce((sum, product) => sum + product.price, 0)}
        </h3>
      </div>
    </div>
    
  )
}

export default App;