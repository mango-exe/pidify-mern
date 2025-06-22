import { exec } from "child_process"
import path from 'path'
import util from 'util'

const execAsync: (command: string) => Promise<{ stdout: string; stderr: string }> = util.promisify(exec)

const buildDockerFile = async (): Promise<void> => {
  try {
    let isDockerfileBuilt: boolean = false
    try {
      const { stdout } = await execAsync('docker image inspect service-pdf2htmlex')
      if (stdout) {
        console.warn('Dockerfile already build')
        isDockerfileBuilt = true
      } else {
        console.warn('Dockerfile not build')
        isDockerfileBuilt = false
      }
    } catch(e: unknown) {
      console.warn('Dockerfile not built')
      isDockerfileBuilt = false
    }

    if (isDockerfileBuilt) {
      console.warn('Dockerfile already build')
    } else {
      console.warn('Building Dockerfile...')
      const dockerFilePath = path.join(process.cwd(), 'src')
      const { stdout, stderr } = await execAsync(`docker build -t service-pdf2htmlex ${dockerFilePath}`)
      if (stdout || stderr) {
        console.warn(`Done building Dockerfile ${stderr}`)
      }
    }

  } catch(e: unknown) {
    const errMessage = e instanceof Error ? e.message : String(e)
    throw new Error(`Failed to build the Dockerfile with error: ${errMessage}`)
  }
}

const runDockerPDFtoHTMLService = async (fileAlias: string): Promise<void> => {
  const fileBasedir = path.join(process.cwd(), 'src', 'files', 'import', fileAlias)
  await execAsync(`docker run --rm -v ${fileBasedir}:/pdf -w /pdf service-pdf2htmlex ${fileAlias}.pdf`)
}

export {
  buildDockerFile,
  runDockerPDFtoHTMLService
}
