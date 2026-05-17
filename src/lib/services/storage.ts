import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase";

export function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<{ path: string; url: string }> {
  if (!firebaseStorage) {
    onProgress?.(100);
    return Promise.resolve({ path, url: URL.createObjectURL(file) });
  }
  return new Promise((resolve, reject) => {
    const storageRef = ref(firebaseStorage, path);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      async () => resolve({ path, url: await getDownloadURL(task.snapshot.ref) }),
    );
  });
}
