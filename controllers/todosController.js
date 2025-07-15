const axios = require('axios');

// Get all todos
exports.getTodos = async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${req.params.id}`);
    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}; 