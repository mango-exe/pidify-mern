import { Processor, Queue, Worker, Job } from 'bullmq'
import IORedis, { Redis } from 'ioredis'
import { models } from '../models'
import { JobStatus } from '../types/models/filemeta'
import { runDockerPDFtoHTMLService } from './docker-lib'
import { WSWrapper } from './ws-lib'
import path from 'path'
import { setTimeout } from 'node:timers'
import { IUser } from '../types/models/user'

type PDFJobData = {
  fileAlias: string
  user: IUser
}

class ProcessingQueue {
  private static instance: ProcessingQueue
  private QUEUE_NAME: string = 'pdf-conversion'
  private worker!: Worker
  private queue!: Queue

  public connection: Redis

  private constructor() {
    this.connection = this.connect()
    this.createQueue()
    this.createPDFProcessingWorker()
    this.attachWorkerListeners()
    console.warn('PDF processing queue CONNECTED')
  }

  public static init() {
    if (!ProcessingQueue.instance) {
      ProcessingQueue.instance = new ProcessingQueue()
    } else {
      throw new Error('PDF processing queue already initialized')
    }
  }

  public static getInstance(): ProcessingQueue {
    if (!ProcessingQueue.instance) {
      throw new Error('PDF processing queue not initialized')
    }

    return ProcessingQueue.instance
  }

  private connect(): Redis {
    return new IORedis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null
    })
  }

  private createQueue() {
    this.queue = new Queue(this.QUEUE_NAME, {
      connection: this.connection
    })
  }

  private createPDFProcessingWorker() {
    this.worker = new Worker(this.QUEUE_NAME, this.PDFWorkerProcessor, {
      connection: this.connection
    })
  }

  private attachWorkerListeners(): void {
    this.worker.on('completed', (job: Job<PDFJobData, void>) => {
      const ws = WSWrapper.getInstance()
      ws.sendToClient(job.data.user.socketId, 'PDF_PROCESSING_JOB_FINISHED')
    })

    this.worker.on('failed', (job: Job | undefined, err: Error) => {
      if (!job) {
        console.error('Job is undefined in failed event:', err)
        return
      }

      const data = job.data as PDFJobData
      const ws = WSWrapper.getInstance()

      if (data?.user?.socketId) {
        ws.sendToClient(data.user.socketId, 'PDF_PROCESSING_JOB_FAILED')
      }

      console.error(`Job failed for ${data?.fileAlias ?? 'unknown file'}`, err)
    })
  }

  public async addJob(jobName: string, fileAlias: string, user: IUser) {
    await this.queue.add(jobName, { fileAlias, user }, {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 5000
      },
      removeOnComplete: true
    })
  }

  private async PDFWorkerProcessor(job: Job<{ fileAlias: string, user: IUser }>): Promise<void> {
    const { fileAlias } = job.data;
    console.warn(`Processing job for ${fileAlias}`);

    const fileMeta = await models.FileMeta.findOne({ alias: fileAlias });
    if (!fileMeta) {
      throw new Error(`FileMeta not found for ${fileAlias}`);
    }

    fileMeta.jobStatus = JobStatus.IN_PROGRESS;
    await fileMeta.save();

    try {
      // Simulate a failure
      throw new Error("Simulated processing failure");

      // This would normally run if there was no error
      await runDockerPDFtoHTMLService(fileAlias);
    } catch (e: any) {
      console.error(`Error during processing: ${e.message}`);
      throw new Error(`Job failed for ${fileAlias}: ${e.toString()}`);
    }

    fileMeta.jobStatus = JobStatus.FULFILLED;
    await fileMeta.save();

    console.warn(`Job finished for ${job.data.fileAlias}`);
  }
}

export {
  ProcessingQueue
}
