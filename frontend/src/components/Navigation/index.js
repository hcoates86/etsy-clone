// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import CategoryButton from './CategoryButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='nav-bar'>
      <div className='left-side'>
        <li className='right-spacer'>
          <NavLink className='betsy' exact to="/">Betsy</NavLink>
        </li>
        <li className='hover-focus flex relative'>
          <CategoryButton />
        </li>
        <li>
        <NavLink className='' exact to="/about">About</NavLink>
        </li>
      </div>

      <div className='right-side'>
      {sessionUser && (
        <>
        <li className='right-spacer'>
          <NavLink exact to='/new-listing'><i className="fa-solid fa-cow"></i><i className="fa-solid fa-plus fa-2xs"></i></NavLink>
        </li>
        <li className='right-spacer'>
          <NavLink exact to='/user/listings'>My Listings</NavLink>
        </li>
        <li className='hover-focus right-spacer'>
          <NavLink exact to='/cart'><i className="fa-solid fa-cart-shopping"></i></NavLink>
        </li>
        </>

      )}

     
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </div>

    </ul>
  );
}

export default Navigation;