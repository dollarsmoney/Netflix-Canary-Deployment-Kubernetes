import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from '../../../common/components/Navbar';
import { fetchInitial, fetchUpdatedNewsfeed } from '../../../actions/Newsfeed';
import PostNewsfeed from '../../../common/components/Post/PostNewsfeed';
import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';

const Newsfeed = (props) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    var userId = props.currentUserData.userId;
    props.fetchInitialNewsfeed(userId);

    const newConnection = new HubConnectionBuilder()
      .withUrl('/hubs/newsfeed', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Debug)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      var userId = props.currentUserData.userId;
      var timeStamp = props.newsfeed.fetchedAt;

      connection
        .start()
        .then((result) => {
          console.log('Connection started!');

          connection.on('FetchNewsfeed', () => {
            console.log('FetchNewsfeed message received!');
            fetchUpdatedNewsfeed(userId, timeStamp);
          });
        })
        .catch((e) => console.log('Connection failed: ', e));
    }
  }, [connection]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto flex max-w-[470px] flex-col px-2 py-6">
        {props.newsfeed && props.newsfeed.length > 0 ? (
          props.newsfeed.map((post, index) => (
            <PostNewsfeed key={post.id || index} currentPostId={post.id} currentFileData={post} />
          ))
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No posts in your feed yet. Follow people to see their posts here.
          </p>
        )}
      </main>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUserData: state.Login.currentUserData,
    newsfeed: state.Newsfeed.newsfeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchInitialNewsfeed: (userId) => dispatch(fetchInitial(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Newsfeed);
