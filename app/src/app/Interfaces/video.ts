import { Issue } from "./issue";

/**
 * Video Interface
 * 
 * This interface defines the structure of a Video object within the application.
 * A Video represents a video file associated with an issue. It includes details 
 * such as a unique identifier, the related issue, the file path, the file size, 
 * and the upload time.
 */

export interface Video {
    id: string;
    issue: Issue;
    videoPath: string;
    fileSize: number;
    uploadTime: Date;
}