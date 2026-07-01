import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Home, PlusSquare, Search, Menu, User, LogOut } from 'lucide-react';
import { logoutUser } from '../../../actions/Authentication';
import Logo from '@/components/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar = (props) => {
  const [search, setSearch] = useState('');
  const userName = props.currentUserData?.userName;
  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const logout = (event) => {
    event.preventDefault();
    props.logoutUser();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link to={`/userprofile/${userName}`} className="flex items-center">
          <Logo className="text-2xl" />
        </Link>

        <form onSubmit={handleSubmit} className="relative hidden max-w-xs flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search"
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-secondary pl-9"
          />
        </form>

        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Home">
            <Link to="/newsfeed">
              <Home className="h-6 w-6" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Create post">
            <Link to="/create">
              <PlusSquare className="h-6 w-6" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link to={`/userprofile/${userName}`}>
                  <User className="mr-1" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/accounts/edit">
                  <Menu className="mr-1" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-1" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUserData: state.Login.currentUserData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  logoutUser: dispatch(logoutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
