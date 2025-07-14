import { exec } from "child_process"
import path from 'path'
import util from 'util'
import fsPromises from 'fs/promises'

const execAsync: (command: string) => Promise<{ stdout: string; stderr: string }> = util.promisify(exec)

const buildDockerFile = async (imageName: string, dockerfileName: string): Promise<void> => {
  try {
    let isDockerfileBuilt = false

    try {
      const { stdout } = await execAsync(`docker image inspect ${imageName}`)
      if (stdout) {
        console.warn(`Docker image "${imageName}" already built`)
        isDockerfileBuilt = true
      }
    } catch {
      console.warn(`Docker image "${imageName}" not built`)
    }

    if (!isDockerfileBuilt) {
      console.warn(`Building Docker image "${imageName}"...`)
      const dockerfilePath = path.join(process.cwd(), "src", "docker", dockerfileName)
      const contextPath = path.join(process.cwd(), "src")

      const { stdout, stderr } = await execAsync(
        `docker build -t ${imageName} -f ${dockerfilePath} ${contextPath}`
      )

      if (stdout || stderr) {
        console.warn(`Built image "${imageName}":\n${stderr || stdout}`)
      }
    }

  } catch (e: unknown) {
    const errMessage = e instanceof Error ? e.message : String(e)
    throw new Error(`Failed to build Docker image "${imageName}": ${errMessage}`)
  }
}

const runDockerPDFtoHTMLService = async (fileAlias: string): Promise<void> => {
  const fileBasedir = path.join(process.cwd(), 'src', 'files', 'import', fileAlias)
  const uid = process.getuid?.() || 1000
  const gid = process.getgid?.() || 1000

  await execAsync(`docker run --rm -u ${uid}:${gid} -v ${fileBasedir}:/pdf -w /pdf service-pdf2htmlex ${fileAlias}.pdf --zoom 1.3 --dpi 100`)
}

const runDockerImageExtractorService = async (): Promise<Boolean> => {
  const imageExtractorBaseDir = path.join(process.cwd(), 'src', 'image-extractor')
  const sourceDir = path.join(imageExtractorBaseDir, 'source')
  const scriptDir = path.join(imageExtractorBaseDir, 'script')
  const outputDir = path.join(imageExtractorBaseDir, 'output')

  const uid = process.getuid?.() || 1000
  const gid = process.getgid?.() || 1000

  const dockerCmd = [
    'docker run --rm',
    `-u ${uid}:${gid}`,
    `-v "${scriptDir}":/app/script`,
    `-v "${sourceDir}":/app/source`,
    `-v "${outputDir}":/app/output`,
    'service-image-extractor'
  ].join(' ')

  try {
    const { stdout, stderr } = await execAsync(dockerCmd)
    if (stdout) {
      console.log(stdout)
      return true
    } else {
      console.warn(stderr)
      return false
    }
  } catch (error: any) {
    throw new Error(`Failed to run opencv-extract container: ${error.message}`)
  }
}

const runDockerImageConverterService = async (fileAlias: string): Promise<Boolean> => {
  const imageConverterBaseDir = path.join(process.cwd(), 'src', 'image-converter')
  const filePath = path.join(process.cwd(), 'src', 'files', 'import', fileAlias, `${fileAlias}.pdf`)

  await fsPromises.copyFile(filePath, imageConverterBaseDir)

  const uid = process.getuid?.() || 1000
  const gid = process.getgid?.() || 1000

  const dockerCmd = [
    'docker run --rm',
    `-u ${uid}:${gid}`,
    `-v "${imageConverterBaseDir}":/app`,
    'service-image-extractor',
    `${fileAlias}.pdf`
  ].join(' ')

  try {
    const { stdout, stderr } = await execAsync(dockerCmd)
    if (stdout) {
      console.log(stdout)
      return true
    } else {
      console.warn(stderr)
      return false
    }
  } catch (error: any) {
    throw new Error(`Failed to run service-image-extractor container: ${error.message}`)
  }
}


export {
  buildDockerFile,
  runDockerPDFtoHTMLService,
  runDockerImageExtractorService,
  runDockerImageConverterService
}
