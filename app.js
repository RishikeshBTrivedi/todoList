const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine" , "ejs")
app.use(express.static("public"))
var newTODOs = []
mongoose.connect("mongodb+srv://admin-rbt:rbtrivedi@cluster0.yyqot.mongodb.net/todoDB")
const todoSchema = new mongoose.Schema({
    name:String
})
//collection name item ; db name todoDB ; 
const itemModel = mongoose.model("item" , todoSchema)

app.get("/" , function(req , res)
{
    
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    //res.render('index' , {ejsDay:today.toLocaleDateString("en-US", options) , newTodoItem:newTODOs}); // Saturday, September 17, 20
    itemModel.find({} , function(err , result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
    
            //newTODOs = result.name
            for(var i = 0 ; i < result.length ; i++)
            {
                newTODOs[i] =  result[i].name
            }
           
            
            
        }
    })
    
    res.render('index' , {ejsDay:today.toLocaleDateString("en-US", options) , newTodoItem:newTODOs}); // Saturday, September 17, 20

})
app.post("/" , function(req , res)
{
    newTODO = req.body.newTodo
    newTODOs.push(newTODO);
    itemModel.create({name:newTODO})
    if(newTODO !== "")
    {

        console.log("New TODO Added -> "+newTODO)
        console.log(req.body);
        res.redirect("/")
    }
    else
    {
        console.log("Blanck TODO added");
    }
})
// mongoose.connection.collections['items'].drop( function(err) {
//     console.log('collection dropped');
// });
app.post("/delete" , function(req , res)
{
    console.log(req.body.check);
    itemModel.deleteOne({name:req.body.check}, function(err)
    {
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully Deleted");
           //res.redirect("/delete")
           const index = newTODOs.indexOf(req.body.check)
           newTODOs.splice(index , 1)
           res.redirect("/")
            
        }
        
    })
})

app.listen(3000 , function()
{
    console.log("Server Running on port 3000")
})
