import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { Badge } from '@mui/material';
import { Dropdown } from 'antd';
import { AiOutlineHeart, AiOutlineGift, AiOutlineShoppingCart } from "react-icons/ai";
import {  GiftOutlined, } from '@ant-design/icons';
import { RiArrowDownSFill } from "react-icons/ri";
import { PiBellSimpleRinging } from "react-icons/pi";
import Login from './Login';
import CategoryNavigation from './CategoryNavigation';
import SearchBar from './SearchBar';
import QuestionMenuItem from './questionMenuItems';
import UserMenuItem from './userMenuItems';
import { googleLogout } from "@react-oauth/google";

const Navbar = ({ onSignOut }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("storage"));
        if (onSignOut) onSignOut();
    };

    const handleSignIn = () => {
        setShowLoginModal(true);
    };

    // Login status check and event listeners
    useEffect(() => {
        const checkLoginStatus = () => {
            const storedLoggedIn = localStorage.getItem("isLoggedIn");
            const storedUser = localStorage.getItem("user");
            setIsLoggedIn(storedLoggedIn === "true" && storedUser !== null);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Error parsing user data from localStorage:", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus);
        window.addEventListener("login", checkLoginStatus);

        return () => {
            window.removeEventListener("storage", checkLoginStatus);
            window.removeEventListener("login", checkLoginStatus);
        };
    }, []);

    // Cart item count update
    useEffect(() => {
        const updateCartCount = () => {
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartItemCount(storedCart.length);
        };

        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    const handleLoginClose = () => {
        setShowLoginModal(false);
        const storedLoggedIn = localStorage.getItem("isLoggedIn");
        const storedUser = localStorage.getItem("user");
        setIsLoggedIn(storedLoggedIn === "true" && storedUser !== null);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data from localStorage:", e);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    return (    
        <div className="border-b-2 border-b-gray-200">
            <div className="max-w-screen-xl mx-auto px-2 py-2 space-y-3 lg:space-y-0">
                <div className="flex flex-wrap items-center justify-between">
                    {/* Logo */}
                    <div className="text-orange-600 font-serif text-4xl">
                        <Link to="/">Etsy</Link>
                    </div>
                    {/* Center Section for large screens */}
                    <div className="hidden lg:flex lg:flex-1 lg:justify-between lg:items-center gap-4 px-4">
                        {/* Categories Dropdown Button (Desktop) */}
                        <CategoryNavigation />

                        {/* Search Bar (Desktop) */}
                        <SearchBar />
                    </div>
              
                    {/* Sign In and Icons (Desktop/Tablet) */}
                    <div className="flex items-center space-x-4 flex-wrap">
                        {isLoggedIn ? (
                            <>
                                <Dropdown trigger={['click']} arrow style={{ padding: '0' }}>
                                  
                                    <div className='flex py-1 px-2 rounded-full hover:bg-blue-100 group cursor-pointer group-hover:text-blue-700'>
                                        <Tooltip title="Deals" placement="bottom" className='flex'>
                                                                                <PiBellSimpleRinging size={24} className="text-gray-700 curso r-pointer" />
                                        <RiArrowDownSFill size={20} />
                                        </Tooltip>
  
                                    </div>
                                </Dropdown>
                                      <QuestionMenuItem/>
                                        <UserMenuItem user={user} onSignOut={handleLogout}  />
                                   
                              
                            </>
                        ) : (
                            <div onClick={handleSignIn} className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-xl cursor-pointer text-sm lg:text-base">
                                Sign in
                            </div>
                        )}
                        <Tooltip title="Favorites" placement="bottom">
                            <Link to="/wishlist" className="relative flex items-center justify-center w-8 h-8 rounded-full transition duration-200 hover:bg-blue-100 group cursor-pointer">
                                <AiOutlineHeart className="w-6 h-6 text-gray-700 group-hover:text-blue-700" />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Gifts" placement="bottom">
                            <span className="relative flex items-center justify-center w-8 h-8 rounded-full transition duration-200 hover:bg-blue-100 group cursor-pointer">
                                <AiOutlineGift className="w-6 h-6 text-gray-700 group-hover:text-blue-700" />
                            </span>
                        </Tooltip>
                        <Tooltip title="Cart" placement="bottom">
                            <span>
                                <Link
                                    to="/cart"
                                    className="relative flex items-center justify-center w-8 h-8 rounded-full transition duration-200 hover:bg-blue-100 group cursor-pointer"
                                >
                                    <Badge badgeContent={cartItemCount} color="error">
                                        <AiOutlineShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-700" />
                                    </Badge>
                                </Link>
                            </span>
                        </Tooltip>
                    </div>
                </div>

                {/* Second Row - Mobile Categories Button and Search */}
                <div className="flex flex-row items-center gap-2 mt-3 justify-between lg:hidden">
                    {/* Mobile Category Navigation */}
                    <CategoryNavigation />
                    {/* Mobile Search Bar */}
                    <SearchBar />
                </div>

                {/* Optional Category Navigation Row (Desktop) */}
                <div className="hidden lg:flex items-center justify-center max-w-screen-xl mx-auto px-4 py-1 space-x-8 text-base">
                    <span className="flex items-center cursor-pointer hover:bg-gray-100 rounded-xl p-1.5">
                        <GiftOutlined className="w-4 h-4 mr-1" /> Gifts
                    </span>
                    <span className="cursor-pointer hover:bg-gray-100 rounded-xl p-1.5">The Personalization Shop</span>
                    <span className="cursor-pointer hover:bg-gray-100 rounded-xl p-1.5">Home Favorites</span>
                    <span className="cursor-pointer hover:bg-gray-100 rounded-xl p-1.5">Fashion Finds</span>
                    <span className="cursor-pointer hover:bg-gray-100 rounded-xl p-1.5">Registry</span>
                </div>
            </div>

            {/* Add the Login modal */}
            {showLoginModal && (
                <Login onClose={handleLoginClose} />
            )}
        </div>
    );
};

export default Navbar;