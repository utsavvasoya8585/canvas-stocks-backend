const Blogs = require("../models/Blogs");

const addBlog = async (req, res) => {
  try {
    const newBlog = new Blogs(req.body);
    await newBlog.save();
    res.send({
      message: "Blog added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllBlogs = async (req, res) => {
  // console.log('get all Blogs')
  try {
    const blogs = await Blogs.find({});
    // console.log('Blogs',blogs)
    res.send(blogs);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    res.send(blog);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (blog) {
      blog.name = req.body.name;
      blog.content = req.body.content;
      blog.image = req.body.image;
      blog.subtitle = req.body.subtitle;
    }
    await blog.save();
    res.send({
      message: "Blog update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogs = await Blogs.deleteOne({ _id: req.params.id });
    res.send({
      message: "Delete blog successfully!",
      blogs
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
