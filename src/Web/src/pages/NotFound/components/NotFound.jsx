import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <Logo className="text-4xl" />
      <h1 className="text-2xl font-semibold">Sorry, this page isn't available.</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The link you followed may be broken, or the page may have been removed.
      </p>
      <Button asChild>
        <Link to="/newsfeed">Go back to Instagram</Link>
      </Button>
    </div>
  );
};

export default NotFound;
