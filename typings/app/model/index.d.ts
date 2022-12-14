// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSubscription from '../../../app/model/subscription';
import ExportUser from '../../../app/model/user';
import ExportVideo from '../../../app/model/video';
import ExportVideoComment from '../../../app/model/video_comment';
import ExportVideoLike from '../../../app/model/video_like';
import ExportVideoView from '../../../app/model/video_view';

declare module 'egg' {
  interface IModel {
    Subscription: ReturnType<typeof ExportSubscription>;
    User: ReturnType<typeof ExportUser>;
    Video: ReturnType<typeof ExportVideo>;
    VideoComment: ReturnType<typeof ExportVideoComment>;
    VideoLike: ReturnType<typeof ExportVideoLike>;
    VideoView: ReturnType<typeof ExportVideoView>;
  }
}
