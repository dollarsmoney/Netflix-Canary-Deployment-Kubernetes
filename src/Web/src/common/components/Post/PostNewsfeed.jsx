import React from 'react';
import ReactPlayer from 'react-player';
import { Heart, MessageCircle, Send, Bookmark, Play } from 'lucide-react';
import * as Constants from './constants';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PostNewsfeed = (props) => {
  const { currentFileData, currentPostId } = props;
  const userName = currentFileData.userName || 'instagram_user';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <Card className="mx-auto mb-6 w-full max-w-[470px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="rounded-full p-[2px] ig-gradient-ring">
          <Avatar className="h-8 w-8 border-2 border-card">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </div>
        <span className="text-sm font-semibold">{userName}</span>
      </div>

      {/* Media */}
      <div className="flex aspect-square w-full items-center justify-center bg-black">
        {currentFileData.fileType === 'image' ? (
          <img
            key={currentPostId}
            src={Constants.postFileUrl + currentFileData.fileId}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <ReactPlayer
            key={currentPostId}
            url={Constants.postFileUrl + currentFileData.fileId}
            playing
            controls
            width="100%"
            height="100%"
            playIcon={<Play className="h-12 w-12 text-white" />}
            light={Constants.postFileThumbnailUrl + currentFileData.fileId}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <button aria-label="Like" className="transition-transform hover:scale-110">
          <Heart className="h-6 w-6" />
        </button>
        <button aria-label="Comment" className="transition-transform hover:scale-110">
          <MessageCircle className="h-6 w-6" />
        </button>
        <button aria-label="Share" className="transition-transform hover:scale-110">
          <Send className="h-6 w-6" />
        </button>
        <button aria-label="Save" className="ml-auto transition-transform hover:scale-110">
          <Bookmark className="h-6 w-6" />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-2 pt-2">
        <p className="text-sm font-semibold">174 likes</p>
        {currentFileData.caption ? (
          <p className="mt-1 text-sm">
            <span className="font-semibold">{userName}</span>{' '}
            <span>{currentFileData.caption}</span>
          </p>
        ) : null}
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">June 15</p>
      </div>

      <Separator />

      {/* Add comment */}
      <form className="flex items-center gap-2 px-2 py-1">
        <Input
          type="text"
          placeholder="Add a comment..."
          className="border-0 shadow-none focus-visible:ring-0"
        />
        <Button type="button" variant="link" size="sm" className="font-semibold">
          Post
        </Button>
      </form>
    </Card>
  );
};

export default PostNewsfeed;
