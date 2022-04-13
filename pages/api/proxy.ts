// @ts-nocheck

import axios from 'axios'
import nc from 'next-connect'
import cors from 'cors'

const handler = nc()
  .use(cors())
  .post((req, res) => {
    let options = {
      url: req.body.url,
      method: req.body.method,
      params: req.body.params || {},
      data: req.body.data || {},
    }

    axios(options)
      .then(({ data }) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        console.log(err.message)
        res.status(500).json({
          error: `Endpoint ${req.body.url} failed.`,
          message: err.message,
        })
      })
  })

export default handler
