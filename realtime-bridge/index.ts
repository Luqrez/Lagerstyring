import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

console.log('Connecting to Supabase Realtime...')

supabase
  .channel('realtime:beholdning')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'beholdning' },
    async (payload) => {
      console.log('Received change:', payload)

      try {
        await axios.post(process.env.BACKEND_ENDPOINT || '', payload)
        console.log('Forwarded to backend')
      } catch (err) {
        console.error('Error forwarding:', err)
      }
    }
  )
  .subscribe()
