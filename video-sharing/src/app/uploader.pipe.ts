import { Pipe, PipeTransform } from '@angular/core';
import { VideoItem } from '../app/pages/video/video.component';

@Pipe({
  name: 'uploaderFilter'
})
export class UploaderFilterPipe implements PipeTransform {
  transform(videos: VideoItem[] | null, uploader: string): VideoItem[] {
    if (!videos) {
      return [];
    }

    if (uploader === 'All' || !uploader) {
      return videos;
    }

    return videos.filter(video => video.uploader === uploader);
  }
}
