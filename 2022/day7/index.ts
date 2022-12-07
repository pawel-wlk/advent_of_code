import { readFileSync } from "fs"

interface FilesystemMember {
  name: string
  size: number
  parent: Directory|null
}

class SimpleFile implements FilesystemMember {
  public parent: Directory|null = null
  constructor (
    public name: string,
    public size: number
  ) {}
}

class Directory  implements FilesystemMember {
  private _size: number|null = null
  private children: FilesystemMember[]
  public parent: Directory|null = null

  constructor (
    public name: string,
  ) {
    this.children = []
  }

  get size(): number {
    if (this._size === null) {
      this._size = this.children.reduce((sum, child) => sum + child.size, 0)
    }

    return this._size
  }

  findChildDirByName(name: string): Directory {
    const newDir =  this.children.find(child => child.name === name)

    if (!newDir) throw 'not found'
    if (!(newDir instanceof Directory)) throw 'not a directory'

    return newDir
  }

  addChild(child: FilesystemMember): void {
    child.parent = this
    this.children.push(child)
  }

  getChildren() {
    return this.children
  }

  getChildDirSizes() {
    const sizes: {name: string, size: number}[] = []

    this.children.forEach(child => {
      if (!(child instanceof Directory)) {
        return
      }

      sizes.push({
        name: child.name,
        size: child.size,
      })

      child.getChildDirSizes().forEach(childSize => sizes.push(childSize))
    })

    return sizes
  }
}


function parseInput(input: string) {
  let rootDir = new Directory('/')
  let currentDir: Directory

  input.trim().split('\n').forEach(line => {
    if (line === '$ cd /') {
      currentDir = rootDir
    } else if (line === '$ cd ..') {
      if (!currentDir.parent) throw 'Cannot go up'
      currentDir = currentDir.parent
    } else if (line.includes('$ cd')) {
      const [, , name] = line.split(' ')
      currentDir = currentDir.findChildDirByName(name)
    } else if (line === '$ ls') {
      // do nothing
    } else {
      const [sizeOrDir, name] = line.split(' ')

      if (sizeOrDir === 'dir') {
        currentDir.addChild(new Directory(name))
      } else {
        currentDir.addChild(new SimpleFile(name, parseInt(sizeOrDir)))
      }
    }
  })

  return rootDir
}

function solve1() {
  const dir = parseInput(readFileSync('./input.txt', {encoding: 'utf-8'}))

  return dir.getChildDirSizes()
    .map(dir => dir.size)
    .filter(size => size <= 100_000)
    .reduce((a,b) => a+b, 0)
}

console.log(solve1())

function solve2() {
  const MAX_SPACE = 70000000
  const REQUIRED_FREE_SPACE = 30000000

  const dir = parseInput(readFileSync('./input.txt', {encoding: 'utf-8'}))

  const currentFreeSpace = MAX_SPACE - dir.size

  return dir.getChildDirSizes()
    .map(dir => dir.size)
    .filter(childSize => currentFreeSpace + childSize > REQUIRED_FREE_SPACE)
    .reduce((a,b) => Math.min(a,b), Infinity)
}

console.log(solve2())