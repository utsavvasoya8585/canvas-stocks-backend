const express = require('express');
const router = express.Router();

const {
    addBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} = require('../controller/blogsController');

// add a blog
router.post('/add', addBlog);

// get all blog
router.get('/all', getAllBlogs);

// get a blog
router.get('/:id', getBlogById);

// update a blog
router.put('/:id', updateBlog);

// delete a blog
router.patch('/:id', deleteBlog);

module.exports = router;
