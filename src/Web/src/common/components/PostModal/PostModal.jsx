import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Post from '../../../common/components/Post';
import PostData from './services/fetchPostData';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const PostModal = (props) => {
  let location = useLocation();
  let { id, index } = useParams();

  const [state, setLocalState] = useState({
    currentPostId: null,
    currentIndex: null,
    currentFileData: null,
    postListLength: null,
  });

  useEffect(() => {
    const postListLength =
      props.location.state.postList === 'userposts' ? props.userPosts.length : null;

    setLocalState({
      ...state,
      currentPostId: id,
      currentIndex: parseInt(index),
      postListLength,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (state.currentPostId != null) {
        Promise.resolve(PostData(state.currentPostId)).then((result) => {
          setLocalState({
            ...state,
            currentFileData: result,
          });
        });
      }
    }

    return () => (mounted = false);
  }, [state.currentPostId]);

  const getParentUrl = (x) => {
    if (typeof x.state !== 'object') {
      return x.pathname;
    }

    let prop;
    for (prop in x) {
      if (prop === 'state') {
        return getParentUrl(x[prop].background);
      }
    }
  };

  const closeModal = () => {
    const parentUrl = getParentUrl(props.location.state.background);
    props.history.push(parentUrl);
  };

  const prevPost = () => {
    const newPostId =
      props.location.state.postList === 'userposts'
        ? props.userPosts[state.currentIndex - 1].id
        : null;

    setLocalState({
      ...state,
      currentPostId: newPostId,
      currentIndex: state.currentIndex - 1,
    });
  };

  const nextPost = () => {
    const newPostId =
      props.location.state.postList === 'userposts'
        ? props.userPosts[state.currentIndex + 1].id
        : null;

    setLocalState({
      ...state,
      currentPostId: newPostId,
      currentIndex: state.currentIndex + 1,
    });
  };

  const hasPrev = state.currentIndex > 0;
  const hasNext = state.currentIndex !== state.postListLength - 1;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-4xl overflow-hidden p-0 sm:rounded-lg">
        <DialogTitle className="sr-only">Post</DialogTitle>

        {hasPrev && (
          <Link
            onClick={prevPost}
            to={{
              pathname: `/post/${props.userPosts[state.currentIndex - 1].id}/${state.currentIndex - 1}`,
              state: {
                background: location,
                postList: props.location.state.postList,
              },
            }}
            className="absolute left-2 top-1/2 z-50 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            aria-label="Previous post"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        )}

        {state.currentFileData ? (
          <Post currentPostId={state.currentPostId} currentFileData={state.currentFileData} />
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        )}

        {hasNext && (
          <Link
            onClick={nextPost}
            to={{
              pathname: `/post/${props.userPosts[state.currentIndex + 1].id}/${state.currentIndex + 1}`,
              state: {
                background: location,
                postList: props.location.state.postList,
              },
            }}
            className="absolute right-2 top-1/2 z-50 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            aria-label="Next post"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    userPosts: state.UserProfile.userPosts,
  };
};

export default withRouter(connect(mapStateToProps)(PostModal));
