import * as Database from 'better-sqlite3'
import { join } from 'path'
import { initDatabase, insertCard } from './sql'
import { writeFileSync, mkdirSync, rmdirSync, createWriteStream } from 'fs'
import * as rimraf from 'rimraf'
import * as archiver from 'archiver'

export class APKG {
  private db: any
  private deck: DeckConfig
  private dest: string
  private mediaFiles: Array<string>
  constructor(private config: DeckConfig) {
    this.dest = join(__dirname, config.name)
    this.clean()
    mkdirSync(this.dest)
    this.db = new Database(join(this.dest, 'collection.anki2'))
    this.deck = {
      ...config,
      id: +new Date()
    }
    initDatabase(this.db, this.deck)
    this.mediaFiles = []
  }
  addCard(card: Card) {
    insertCard(this.db, this.deck, card)
  }
  addMedia(filename: string, data: Buffer) {
    const index = this.mediaFiles.length
    this.mediaFiles.push(filename)
    writeFileSync(join(this.dest, `${index}`), data)
  }
  save(destination: string) {
    try {
      const archive = this.generateStream()
      archive.on('error', err => {
        throw err
      })
      archive.pipe(
        createWriteStream(join(destination, `${this.config.name}.apkg`))
      )
    } catch (err) {
      this.clean()
      throw err
    }
  }
  generateStream(): NodeJS.ReadableStream {
    const archive = archiver('zip')
    const mediaObj = this.mediaFiles.reduce((obj, file, idx) => {
      obj[idx] = file
      return obj
    }, {})
    writeFileSync(join(this.dest, 'media'), JSON.stringify(mediaObj))
    archive.directory(this.dest, false)
    archive.on('error', err => {
      this.clean()
      throw err
    })
    archive.on('end', this.clean.bind(this))
    archive.finalize()

    return archive
  }
  private clean() {
    rimraf(this.dest, () => {})
  }
}
