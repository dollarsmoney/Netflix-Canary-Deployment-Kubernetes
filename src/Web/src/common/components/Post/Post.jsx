import React from 'react';
import ReactPlayer from 'react-player';
import { Heart, MessageCircle, Send, Bookmark, Play } from 'lucide-react';
import * as Constants from './constants';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Post = (props) => {
  const { currentFileData, currentPostId } = props;
  const userName = currentFileData.userName || 'instagram_user';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="grid w-full grid-cols-1 overflow-hidden md:grid-cols-[1.4fr_1fr]">
      {/* Media */}
      <div className="flex min-h-[300px] items-center justify-center bg-black md:min-h-[520px]">
        {currentFileData.fileType === 'image' ? (
          <img
            key={currentPostId}
            src={Constants.postFileUrl + currentFileData.fileId}
            alt=""
            className="h-full max-h-[80vh] w-full object-contain"
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

      {/* Details */}
      <div className="flex max-h-[80vh] flex-col bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="rounded-full p-[2px] ig-gradient-ring">
            <Avatar className="h-8 w-8 border-2 border-card">
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-sm font-semibold">{userName}</span>
        </div>
        <Separator />

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {currentFileData.caption ? (
            <p className="text-sm">
              <span className="font-semibold">{userName}</span> {currentFileData.caption}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No caption.</p>
          )}
        </div>

        <Separator />
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
        <div className="px-4 pb-2 pt-2">
          <p className="text-sm font-semibold">174 likes</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">June 15</p>
        </div>

        <Separator />
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
      </div>
    </div>
  );
};

export default Post;
