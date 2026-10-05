import * as tus from 'tus-js-client';
import { supabase, supabaseUrl, supabaseAnonKey } from '../supabaseClient';

export interface StorageUploadProgress {
  loaded: number;
  total: number;
  percent: number;
  loadedMB: string;
  totalMB: string;
  speedMBs?: string;
  message: string;
}

export interface StorageUploadResult {
  data: { path: string; fullPath: string; publicUrl?: string } | null;
  error: { message: string; statusCode?: string } | null;
}

// Supabase requires exactly 6 MB chunks for resumable uploads
const TUS_CHUNK_SIZE = 6 * 1024 * 1024;

/**
 * For large files Supabase recommends the direct storage hostname
 * (https://<ref>.storage.supabase.co) instead of the API gateway.
 */
function resumableEndpoint(): string {
  const match = supabaseUrl.match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/i);
  if (match) return `https://${match[1]}.storage.supabase.co/storage/v1/upload/resumable`;
  return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/upload/resumable`;
}

const toMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

/**
 * Upload a file to Supabase Storage using the resumable (TUS) protocol.
 * - Real byte-level progress
 * - Automatic retry / resume after network drops
 * - Supports files up to the bucket's file_size_limit (5 GB for `videos`)
 */
export async function uploadToSupabaseWithProgress(
  bucket: string,
  filePath: string,
  file: File | Blob,
  options: {
    contentType?: string;
    upsert?: boolean;
    onProgress?: (progress: StorageUploadProgress) => void;
  } = {}
): Promise<StorageUploadResult> {
  const { onProgress, upsert = true } = options;
  const cleanPath = filePath.replace(/^\/+/, '');
  const contentType = options.contentType || (file as File).type || 'application/octet-stream';
  const totalMB = toMB(file.size);

  if (!supabase) {
    return { data: null, error: { message: 'Supabase client unavailable' } };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) {
    return { data: null, error: { message: 'Please sign in to upload files.', statusCode: '401' } };
  }

  return new Promise<StorageUploadResult>((resolve) => {
    let lastTime = Date.now();
    let lastLoaded = 0;
    let speedStr = '';

    const upload = new tus.Upload(file, {
      endpoint: resumableEndpoint(),
      retryDelays: [0, 3000, 5000, 10000, 20000],
      chunkSize: TUS_CHUNK_SIZE,
      headers: {
        authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey,
        'x-upsert': upsert ? 'true' : 'false',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // allow re-uploading the same file later
      metadata: {
        bucketName: bucket,
        objectName: cleanPath,
        contentType,
        cacheControl: '3600',
      },
      onProgress: (loaded, total) => {
        if (!onProgress) return;
        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        if (dt > 0.5) {
          speedStr = `${((loaded - lastLoaded) / (1024 * 1024) / dt).toFixed(1)} MB/s`;
          lastTime = now;
          lastLoaded = loaded;
        }
        const percent = Math.min(99, Math.round((loaded / total) * 100));
        const loadedMB = toMB(loaded);
        onProgress({
          loaded,
          total,
          percent,
          loadedMB,
          totalMB,
          speedMBs: speedStr,
          message: `Uploading: ${loadedMB} MB of ${totalMB} MB (${percent}%)${speedStr ? ` • ${speedStr}` : ''}`,
        });
      },
      onSuccess: () => {
        const { data: pub } = supabase!.storage.from(bucket).getPublicUrl(cleanPath);
        onProgress?.({
          loaded: file.size,
          total: file.size,
          percent: 100,
          loadedMB: totalMB,
          totalMB,
          message: `Upload complete (${totalMB} MB)`,
        });
        resolve({
          data: { path: cleanPath, fullPath: `${bucket}/${cleanPath}`, publicUrl: pub.publicUrl },
          error: null,
        });
      },
      onError: (err) => {
        const status = (err as tus.DetailedError).originalResponse?.getStatus();
        let message = err.message || 'Upload failed';
        const body = (err as tus.DetailedError).originalResponse?.getBody();
        if (body) {
          try {
            const parsed = JSON.parse(body);
            message = parsed.message || parsed.error || message;
          } catch {
            /* non-JSON body */
          }
        }
        if (status === 413) message = `File exceeds the storage size limit (${totalMB} MB).`;
        resolve({ data: null, error: { message, statusCode: status ? String(status) : undefined } });
      },
    });

    // Resume a previous interrupted upload of the same file if one exists
    upload
      .findPreviousUploads()
      .then((previous) => {
        if (previous.length > 0) upload.resumeFromPreviousUpload(previous[0]);
        upload.start();
      })
      .catch(() => upload.start());
  });
}
