import { Issue } from "./issue";

export interface Video {
    id: string;
    issue: Issue;
    videoPath: string;
    fileSize: number;
    uploadTime: Date;
}