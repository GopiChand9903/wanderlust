const express = require("express");
const router = express.Router();

//Users
router.get("/",(req,res)=>{
  res.send("GET for users");
});

router.get("/:id",(req,res)=>{
  res.send("GET for user id");
})

router.post("/",(req,res)=>{
  res.send("POST for show users");
});

router.delete("/:id",(req,res)=>{
  res.send("DELETE for users");
})

module.exports = router;