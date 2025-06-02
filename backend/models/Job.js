const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  contactNumber: String,
  salary: String,
  background: String,
  location: String,
  email: String,
  workType: String,
  description: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);