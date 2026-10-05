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

/**
 * Uploads a file to Supabase Storage with real-time byte-for-byte progress tracking.
 * Prevents the UI from looking stuck during large video uploads.
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
  const totalBytes = file.size;
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

  // If in browser environment with XMLHttpRequest, use XHR for precise progress events
  if (typeof window !== 'undefined' && typeof XMLHttpRequest !== 'undefined') {
    return new Promise((resolve) => {
      try {
        supabase!.auth.getSession().then(({ data }) => {
          const token = data.session?.access_token || supabaseAnonKey;
          const cleanPath = filePath.replace(/^\/+/, '');
          const endpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${cleanPath}`;

          const formData = new FormData();
          formData.append('cacheControl', '3600');
          formData.append('', file);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', endpoint, true);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.setRequestHeader('apikey', supabaseAnonKey);
          if (upsert) {
            xhr.setRequestHeader('x-upsert', 'true');
          }

          let lastTime = Date.now();
          let lastLoaded = 0;

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
              const now = Date.now();
              const timeDiff = (now - lastTime) / 1000;
              let speedStr = '';
              if (timeDiff > 0.4) {
                const bytesDiff = e.loaded - lastLoaded;
                const speedMB = (bytesDiff / (1024 * 1024)) / timeDiff;
                speedStr = `${speedMB.toFixed(1)} MB/s`;
                lastTime = now;
                lastLoaded = e.loaded;
              }

              const percent = Math.min(99, Math.round((e.loaded / e.total) * 100));
              const loadedMB = (e.loaded / (1024 * 1024)).toFixed(1);

              onProgress({
                loaded: e.loaded,
                total: e.total,
                percent,
                loadedMB,
                totalMB,
                speedMBs: speedStr,
                message: `Uploading: ${loadedMB} MB of ${totalMB} MB (${percent}%)${speedStr ? ` • ${speedStr}` : ''}`
              });
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const { data: pubData } = supabase!.storage.from(bucket).getPublicUrl(cleanPath);
              if (onProgress) {
                onProgress({
                  loaded: totalBytes,
                  total: totalBytes,
                  percent: 100,
                  loadedMB: totalMB,
                  totalMB,
                  message: `Upload complete (${totalMB} MB)! Verifying file...`
                });
              }
              resolve({
                data: {
                  path: cleanPath,
                  fullPath: `${bucket}/${cleanPath}`,
                  publicUrl: pubData.publicUrl
                },
                error: null
              });
            } else {
              let errorMsg = `Upload failed (Status ${xhr.status})`;
              try {
                const parsed = JSON.parse(xhr.responseText || '{}');
                errorMsg = parsed.message || parsed.error || errorMsg;
              } catch {}
              resolve({
                data: null,
                error: { message: errorMsg, statusCode: String(xhr.status) }
              });
            }
          };

          xhr.onerror = () => {
            resolve({
              data: null,
              error: { message: 'Network connection failed during upload. Please check your internet connection.', statusCode: '0' }
            });
          };

          xhr.ontimeout = () => {
            resolve({
              data: null,
              error: { message: 'Upload timed out. The file may be too large for your current connection speed.', statusCode: '408' }
            });
          };

          // 10 minutes timeout for very large videos
          xhr.timeout = 10 * 60 * 1000;

          xhr.send(formData);
        }).catch(err => {
          resolve({ data: null, error: { message: err?.message || 'Authentication error before upload' } });
        });
      } catch (err: any) {
        resolve({ data: null, error: { message: err?.message || 'Failed to start upload' } });
      }
    });
  }

  // Fallback to supabase SDK standard upload
  try {
    const res = await supabase!.storage.from(bucket).upload(filePath, file, {
      contentType: (file as File).type || 'video/mp4',
      cacheControl: '3600',
      upsert
    });

    if (res.error) {
      return { data: null, error: { message: res.error.message } };
    }

    const { data: pubData } = supabase!.storage.from(bucket).getPublicUrl(filePath);
    return {
      data: {
        path: filePath,
        fullPath: `${bucket}/${filePath}`,
        publicUrl: pubData.publicUrl
      },
      error: null
    };
  } catch (err: any) {
    return { data: null, error: { message: err?.message || 'Upload failed' } };
  }
}
