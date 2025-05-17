console.log('🔔 Announce router loaded');

const express = require('express');
const Ann          = require('../models/announcement');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router       = express.Router();

// List
router.get('/', async (req,res)=>{
  const list = await Ann.find().sort({date:-1});
  res.json(list);
});

// Create (Admin)
router.post('/', verifyToken, isAdmin, async (req,res)=>{
  const a = await new Ann(req.body).save();
  res.status(201).json(a);
});

// Delete (Admin)
router.delete('/:id', verifyToken, isAdmin, async (req,res)=>{
  await Ann.findByIdAndDelete(req.params.id);
  res.json({msg:'Deleted'});
});

module.exports = router;
