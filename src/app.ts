import express from 'express';
import "dotenv/config"
const app =express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));


const APP_PORT = process.env.NODE_ENV === 'production'? process.env.PORT : 3000;


app.listen(APP_PORT, () => {
    console.log("app in running on port " + APP_PORT + " (env: " + process.env.NODE_ENV);
    
})