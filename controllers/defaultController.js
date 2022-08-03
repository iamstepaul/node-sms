const express = require('express')

module.exports = {

    indexGet:(req, res)=>{
        res.render('default/index')
    }
}