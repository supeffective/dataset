import path from 'node:path'
import { globSync } from 'glob'
import { getDataDistPath, writeFile } from '../utils/fs'

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>SuperEffective Dataset CDN</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
      }
      html {
        font-size: 16px;
        line-height: 1.5;
      }

      body {
        padding: 1rem;
      }

      h1 {
        margin: 0;
        font-size: 2rem;
      }

      a {
        color: #0366d6;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
      }

      .dirtree {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .dirtree > li {
        margin-bottom: 1rem;
      }

      .dirtree > li ul {
        padding-left: 1rem;
      }

      .dirtree > li ul li {
        margin-bottom: 0.5rem;
      }

      .big-list {
        column-count: 4;
      }
    </style>
  </head>
  <body>
  <div class="container">
    <h1>SuperEffective Dataset CDN</h1>
    <ul class="dirtree">
      <li><strong>/</strong><li>
      {{children}}
    </ul>
  </div>
  </body>
</html>
  `.trim()

function renderTemplate(children: string) {
  return htmlTemplate.replace('{{children}}', children)
}

function generateIndexHtml() {
  // traverse the data folder looking for .json files and generate the index.html file with the tree structure

  const dataPath = getDataDistPath()
  const files = globSync(path.join(dataPath, '**', '*.min.json'))

  const tree: Record<string, string[]> = {}

  for (const file of files) {
    const relativePath = path.relative(dataPath, file)
    const parts = relativePath.split(path.sep)
    const fileName = parts.pop()
    if (!fileName) {
      continue
    }

    const dir = parts.join(path.sep)

    if (!tree[dir]) {
      tree[dir] = []
    }
    ;(tree[dir] as Array<string>).push(fileName)
  }

  const children = Object.entries(tree)
    .map(([dir, files]) => {
      const children = files
        .map((file) => {
          const url = path.join(dir, file).replace(/\\/g, '/')
          return `<li><a href="${url}">${file.replace(/(\.min\.json|\.json)$/gi, '')}</a></li>`
        })
        .join('\n')

      const ulClass = files.length >= 9 ? 'big-list' : ''

      return `<li>${dir ? `<strong>/${dir}</strong>` : ''}<ul class=${ulClass}>${children}</ul></li>`
    })
    .join('\n')

  const html = renderTemplate(children)
  const outputPath = path.join(dataPath, 'index.html')

  writeFile(outputPath, html)
}

generateIndexHtml()
