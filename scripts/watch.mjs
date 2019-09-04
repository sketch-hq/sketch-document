import fs from 'fs'
import { execSync } from 'child_process'
import chalk from 'chalk'

const { log, clear } = console
const { red, green } = chalk

const validate = () => {
  try {
    execSync('yarn validate', { encoding: 'utf8' })
    clear()
    log(green('Schema OK'))
  } catch (error) {
    clear()
    log(red('Validation failed'))
    log(error.stderr)
  }
}

validate()
fs.watch('./schema', { recursive: true }, () => validate())
