import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Loader2, Grid3x3, Settings, Heart, MessageCircle, Play } from 'lucide-react';
import Navbar from '../../../common/components/Navbar';
import { getUserProfileData, clearUserProfileData } from '../../../actions/UserProfile';
import { logoutUser } from '../../../actions/Authentication';
import * as Constants from '../constants';
import TokenChecker from '../../../common/helpers/TokenChecker';
import FetchUserId from '../services/fetchUserId';
import { fetchUserRelation, followUserRequest, unFollowUserRequest } from '../services/followUnfollowUser';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const UserProfile = (props) => {
  let location = useLocation();
  let { username } = useParams();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followButton, setFollowButton] = useState(null);

  useEffect(() => {
    const tokenValidator = TokenChecker();

    if (tokenValidator === true) {
      Promise.resolve(FetchUserId(username)).then((result) => {
        setUserData(result);

        Promise.resolve(props.getUserProfileDataAction(result.id)).then((r) => {
          if (username !== props.currentUserData.userName) {
            const userId = props.currentUserData.userId;
            const followedUserId = result.id;

            Promise.resolve(fetchUserRelation(userId, followedUserId)).then((data) => {
              if (data.relation === 1) {
                setFollowButton(1);
              } else {
                setFollowButton(0);
              }
            });
          }

          setLoading(false);
        });
      });
    } else {
      props.history.push('/');
    }

    return () => props.clearUserProfileDataAction();
  }, []);

  const followUser = () => {
    const userId = props.currentUserData.userId;
    const followedUserId = userData.id;

    Promise.resolve(followUserRequest(userId, followedUserId)).then(() => {
      setFollowButton(1);
    });
  };

  const unFollowUser = () => {
    const userId = props.currentUserData.userId;
    const followedUserId = userData.id;

    Promise.resolve(unFollowUserRequest(userId, followedUserId)).then(() => {
      setFollowButton(0);
    });
  };

  const initial = username ? username.charAt(0).toUpperCase() : 'U';
  const isOwnProfile = username === props.currentUserData.userName;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="rounded-full p-[3px] ig-gradient-ring">
            <Avatar className="h-24 w-24 border-4 border-background sm:h-36 sm:w-36">
              <AvatarFallback className="text-4xl">{initial}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-xl font-light">{username}</h1>
              {followButton === 1 ? (
                <Button variant="secondary" onClick={unFollowUser}>
                  Following
                </Button>
              ) : followButton === 0 ? (
                <Button onClick={followUser}>Follow</Button>
              ) : null}
              {isOwnProfile ? (
                <>
                  <Button asChild variant="secondary">
                    <Link to="/accounts/edit">Edit Profile</Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" aria-label="Settings">
                    <Link to="/accounts/edit">
                      <Settings className="h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : null}
            </div>

            <div className="mt-4 flex gap-8 text-sm">
              <span>
                <b>{props.userPosts.length}</b> posts
              </span>
              <span>
                <b>165</b> followers
              </span>
              <span>
                <b>120</b> following
              </span>
            </div>

            <div className="mt-4 text-sm">
              {props.userBio.text ? <p className="font-semibold">{props.userBio.text}</p> : null}
              {props.userBio.gender ? <p className="text-muted-foreground">{props.userBio.gender}</p> : null}
              {props.userBio.websiteUrl ? (
                <a href={props.userBio.websiteUrl} className="font-medium text-primary">
                  {props.userBio.websiteUrl}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Posts tab */}
        <div className="mb-4 flex justify-center">
          <span className="flex items-center gap-2 border-t-2 border-foreground py-3 text-xs font-semibold uppercase tracking-widest">
            <Grid3x3 className="h-4 w-4" /> Posts
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-6">
          {props.userPosts.map((post, index) => (
            <Link
              key={index}
              to={{
                pathname: `/post/${post.id}/${index}`,
                state: {
                  background: location,
                  postList: 'userposts',
                },
              }}
              className="group relative aspect-square overflow-hidden bg-muted"
            >
              <img
                src={Constants.postFileThumbnailUrl + post.fileId}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/40 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1">
                  {post.fileType === 'video' ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}{' '}
                  150
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-5 w-5" /> 240
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUserData: state.Login.currentUserData,
    userBio: state.UserProfile.userBio,
    userPosts: state.UserProfile.userPosts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserProfileDataAction: (userId) => dispatch(getUserProfileData(userId)),
  clearUserProfileDataAction: () => dispatch(clearUserProfileData()),
  logoutUser: dispatch(logoutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
