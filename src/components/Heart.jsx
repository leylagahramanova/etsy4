import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Heart = ({ product, setLastAction }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const productInWishlist = existingWishlist.some((p) => p.id === product.id);
    setIsFavorite(productInWishlist);
  }, [product]);

  const handleToggleWishlist = () => {
    let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isFavorite) {
      currentWishlist = currentWishlist.filter((p) => p.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      setIsFavorite(false);
      if (setLastAction) setLastAction("deleted");
    } else {
      currentWishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      setIsFavorite(true);
      if (setLastAction) setLastAction("added");
    }
  };

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        handleToggleWishlist();
      }}
      className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer z-10 "
    >
      {isFavorite ? (
        <AiFillHeart className="w-8 h-8 text-red-500" />
      ) : (
      <AiOutlineHeart className="w-8 h-8 text-black" />
      )}
    </span>
  );
};

export default Heart;
