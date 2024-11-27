import type { FictionEnv } from '../index.js'
import type { ConfigFileGenerator } from './generate.js'

import fs from 'fs-extra'
import { log } from '../../plugin-log/index.js'

type DirectoryStructure = {
  [key: string]: DirectoryStructure | null
}

/**
 * Check if a file or directory should be ignored
 */
function shouldIgnore(name: string): boolean {
  const ignorePatterns = new Set([
    // Directories
    '.git',
    '__pycache__',
    'node_modules',
    'dist',
    'build',
    'venv',
    'env',
    '.env',
    '.venv',
    'target',
    // Files
    '.DS_Store',
    // Cache directories
    '.pytest_cache',
    '.mypy_cache',
    '.ruff_cache',
    '.coverage',
    // IDE directories
    '.idea',
    '.vscode',
    '.vs',
  ])

  const ignoreExtensions = new Set([
    '.pyc',
    '.pyo',
    '.pyd',
    '.so',
    '.egg',
    '.egg-info',
    '.coverage',
    '.swp',
    '.swo',
  ])

  return (
    ignorePatterns.has(name)
    || Array.from(ignoreExtensions).some(ext => name.endsWith(ext))
    || name.startsWith('.')
  )
}

/**
 * Recursively scan directory and return structure as object
 */
async function scanDirectory(dirPath: string): Promise<DirectoryStructure | null> {
  const result: DirectoryStructure = {}

  const { join } = await import('node:path')

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true })

    for (const item of items) {
      if (shouldIgnore(item.name)) {
        continue
      }

      const fullPath = join(dirPath, item.name)

      if (item.isFile()) {
        result[item.name] = null
      }
      else if (item.isDirectory()) {
        const subdir = await scanDirectory(fullPath)
        if (subdir && Object.keys(subdir).length > 0) {
          result[item.name] = subdir
        }
      }
    }

    return result
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EACCES') {
      log.warn('scanDirectory', `Permission denied accessing ${dirPath}`)
      return null
    }
    throw error
  }
}

/**
 * Generate project structure and write to .fiction config directory
 */
export const generateProjectStructure: ConfigFileGenerator = async (args: {
  fictionEnv: FictionEnv
}): Promise<{ fileName: string, content: string }> => {
  const { fictionEnv } = args
  const context = 'generateProjectStructure'

  if (!fictionEnv.cwd) {
    throw new Error(`${context}: cwd not found`)
  }

  const structure = await scanDirectory(fictionEnv.monorepoRoot)

  return { fileName: 'projectStructure.json', content: JSON.stringify(structure, null, 2) }
}

/**
 * Generate project structure as string
 */
export async function getProjectStructure(directory = '.'): Promise<string> {
  const { resolve, basename } = await import('node:path')
  const absPath = resolve(directory)
  const structure = {
    [basename(absPath)]: await scanDirectory(absPath),
  }
  return JSON.stringify(structure, null, 2)
}
