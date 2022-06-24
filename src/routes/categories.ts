import express from 'express'
import { findMergedCategoriesById, getEntries } from '../services/categories'

const router = express.Router()

// Get category by ID
router.get('/:ids', (req, res) => {
  findMergedCategoriesById(req.params.ids.split(','))
    .then(category => {
      res.status(200).json(category)
    })
    .catch(err => {
      res.status(404).json({ status: 404, message: err })
    })
})

// Get all categories
router.get('/', (_, res) => {
  getEntries()
    .then(categories => {
      res.status(200).json(categories)
    })
    .catch(err => {
      res.status(500).json({ status: 500, message: err })
    })
})

export default router
