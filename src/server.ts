import 'dotenv/config'

import express from 'express'
import categories from './routes/categories'
import games from './routes/games'

// Config
const PORT: number = Number(process.env.PORT ?? 3000)
const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/api/categories', categories)
app.use('/api/games', games)

// Init
app.listen(PORT, () => console.log(`Listening at :${PORT}`))
