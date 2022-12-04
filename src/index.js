import { backup } from './backup.js'
import { CronJob } from 'cron'

new CronJob({
  cronTime: process.env.APP_CRONJOB,
  onTick: () => backup(),
  start: true,
  runOnInit: true,
})
