export const FORBIDDEN_EXECUTABLE_EXTENSIONS = [
  'exe', 'bat', 'cmd', 'sh', 'bash', 'zsh', 'msi', 'scr', 'vbs', 'com', 'pif', 
  'application', 'gadget', 'app', 'dmg', 'pkg', 'sys', 'dll', 'bin', 'jar', 
  'vbe', 'jse', 'wsf', 'wsh', 'ps1', 'psm1', 'cpl', 'hta', 'inf', 'ins', 'isp', 
  'job', 'lib', 'lnk', 'msc', 'msp', 'mst', 'reg', 'rgs', 'sct', 'shb', 'shs', 
  'u3p', 'vb', 'vbs', 'vsmacros', 'iso', 'img', 'vmdk'
];

/**
 * Checks if a file is an executable or script format.
 * Returns true if the file is an executable/script format.
 */
export function isExecutableFile(file: File | { name: string; type?: string }): boolean {
  if (!file || !file.name) return false;
  const ext = file.name.split('?')[0].split('.').pop()?.toLowerCase() || '';
  const fileType = (file.type || '').toLowerCase();

  if (FORBIDDEN_EXECUTABLE_EXTENSIONS.includes(ext)) {
    return true;
  }
  
  if (
    fileType.includes('executable') ||
    fileType.includes('msdownload') ||
    fileType.includes('x-sh') ||
    fileType.includes('x-bat') ||
    fileType.includes('x-msi') ||
    fileType.includes('x-dosexec') ||
    fileType.includes('x-apple-diskimage')
  ) {
    return true;
  }

  return false;
}

/**
 * Validates a single file or multiple files for platform-wide security.
 * Returns { safe: false, blockedFileName } if any executable file is detected.
 */
export function validateFileSafety(files: File | File[] | FileList | null | undefined): { safe: boolean; blockedFileName?: string } {
  if (!files) return { safe: true };

  let fileList: File[] = [];
  if (files instanceof File) {
    fileList = [files];
  } else if (files instanceof FileList) {
    fileList = Array.from(files);
  } else if (Array.isArray(files)) {
    fileList = files;
  }

  for (const f of fileList) {
    if (isExecutableFile(f)) {
      return { safe: false, blockedFileName: f.name };
    }
  }

  return { safe: true };
}
