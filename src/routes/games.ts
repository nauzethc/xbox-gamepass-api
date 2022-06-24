import express from 'express'
import { findGamesByIds, findRawGamesByIds } from '../services/games'

const router = express.Router()

// Get games by ID
router.get('/:ids', (req, res) => {
  const isRaw: boolean = req.query.raw === 'true'
  const findGames = isRaw
    ? findRawGamesByIds
    : findGamesByIds

  findGames(req.params.ids)
    .then(games => {
      res.status(200).json(games)
    })
    .catch(err => {
      res.status(500).json({ status: 500, message: err })
    })
})

export default router
