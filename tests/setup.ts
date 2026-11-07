import { createServer } from 'vite'

// Run Vite in this process so Windows does not need to terminate an npm process tree.
export default async function setup() {
  const server = await createServer({ server: { host: '127.0.0.1', port: 4175, strictPort: true } })
  await server.listen()
  return async () => { await server.close() }
}
