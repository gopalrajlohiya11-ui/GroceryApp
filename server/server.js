const express=require("express");
const cors=require("cors");
const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("chal rha hu be");
});

app.get("/api/products",(req,res)=>{
    res.json([
        {id:1,name:"laptop",price:50000},
        {id:2,name:"mouse",price:500},
    ]);
});

let products=[
    {id:1,name:"laptop",price:50000},
    {id:2,name:"mouse",price:500},
];
app.post("/api/products",(req,res)=>{
    const newProduct={
        id:Date.now(),
        name:req.body.name,
        price:req.body.price,
    };
    products.push(newProduct);

    res.status(201).json(newProduct);
})
app.listen(5000,()=>{
    console.log("5k port pr hu");
});