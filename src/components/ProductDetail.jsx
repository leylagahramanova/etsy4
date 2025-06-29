import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { IoIosArrowBack } from "react-icons/io";
import Timer from "./Timer";

const ProductDetail = () => {
    const { productId } = useParams();
    const [productDetailItem, setProductDetailItem] = useState(null);
    const navigate = useNavigate();
    
        const handleAddToWishlist = (product) => {
            const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
            const alreadyInWishlist = existing.find((p) => p.id === product.id);
            if (!alreadyInWishlist) {
                existing.push(product);
                localStorage.setItem("wishlist", JSON.stringify(existing));
            }
            navigate("/wishlist");
        };
    const [openSections, setOpenSections] = useState({
        details: true,
        delivery: false,
        instantDownload: true, 
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://ecommerce.ibradev.me/products/get/${productId}`);
                if (!response.ok) {
                    console.error(`Product with ID ${productId} not found or API error: ${response.status}`);
                    setProductDetailItem(null);
                    return;
                }
                const data = await response.json();
                setProductDetailItem(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setProductDetailItem(null);
            }
        };

        if (productId) {
            fetchProduct();
        } else {
            setProductDetailItem(null);
        }

    }, [productId]);


    const defaultImageUrl = "https://via.placeholder.com/600x400?text=No+Image+Available";
    const images = (productDetailItem?.images && Array.isArray(productDetailItem.images) && productDetailItem.images.length > 0)
        ? productDetailItem.images.map(imgUrl => ({
            original: imgUrl,
            thumbnail: imgUrl,
        }))
        : [{ original: defaultImageUrl, thumbnail: defaultImageUrl }];


 const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleAddToCart = () => {
        if (!productDetailItem) {
            console.log("Product data not loaded, cannot add to cart.");
            return;
        }

        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

        const isItemInCart = currentCart.some(item => item.id === productDetailItem.id);

        if (!isItemInCart) {
            currentCart.push(productDetailItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
            console.log('Product added to cart:', productDetailItem);
        } else {
            console.log('Product already in cart:', productDetailItem);
        }

        navigate('/cart');
    };


    if (!productDetailItem) {
        return <div className="text-center py-10 text-gray-600">Product information not available.</div>;
    }

   const inCarts = 16; 


  
    const isNewMarkdown = true; 
    const sellerName = "LittleBirdieCanada";
    const sellerRating = 5; 
    const sellerReviewCount = 1234; 
    const sellerMessage = "Star Seller. This seller consistently earned 5-star reviews, shipped on time, and replied quickly to any messages they received.";
    const isInstantDownload = true; 
const isLargeScreen = window.innerWidth >= 765;
const thumbnailPosition = isLargeScreen ? "left" : "bottom";

    return (
        <section className="container flex-grow mx-auto max-w-[1200px] py-5 lg:grid lg:grid-cols-2 lg:gap-10 lg:py-10">
            <div className="container mx-auto px-4 lg:px-0 relative"> 
                <div className="relative">
                <ReactImageGallery
                    showBullets={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    items={images}
                    showThumbnails={true}
                    showNav={true} 
                        thumbnailPosition={thumbnailPosition}
                        renderLeftNav={(onClick, disabled) => (
                            <button
                                type="button"
                                className="absolute left-0 top-1/2  flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer  hover:bg-gray-300 transition"
                                onClick={onClick}
                                disabled={disabled}
                                aria-label="Previous Slide"
                                style={{ zIndex: 50 }}
                            >
                                <IoIosArrowBack className="w-8 h-8 text-black" />
                            </button>
                        )}
                        renderRightNav={(onClick, disabled) => (
                            <button
                                type="button"
                                className="absolute right-0 top-1/2   flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer hover:bg-gray-300 transition"
                                onClick={onClick}
                                disabled={disabled}
                                aria-label="Next Slide"
                                style={{ zIndex: 50 }}
                            >
                                <IoIosArrowForward className="w-8 h-8 text-black" />
                            </button>
                        )}
                    />

                    <span
                        onClick={() => handleAddToWishlist(productDetailItem)}
                        className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 shadow-xl rounded-full bg-white cursor-pointer z-10"
                    >
                        <AiOutlineHeart className="w-8 h-8 text-black" />
                    </span>
                </div>
                <div className="text-center mt-4 text-sm">
                    <a href="#" className="text-gray-500 hover:underline">
                        Report this item to Etsy
                    </a>
                </div>
            </div>

            <div className="mx-auto px-5 lg:px-0">
                {inCarts > 0 && (
                    <div className="text-sm text-gray-600 mb-2">{`In ${inCarts} carts`}</div>
                )}

                <div className="flex items-center gap-2 mb-2">
                    <p className="text-4xl font-bold text-gray-800">
                        ${productDetailItem.price?.toFixed(2) || 'N/A'}
                    </p>

                        <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        {productDetailItem.discount}% off
                        </span>

                </div>

         
                    <div className="text-sm text-red-600 mb-4 flex ">
                      <span className="mr-2">Sale ends in </span>    <Timer className="ml-2"/>
                    </div>
    

                {isNewMarkdown && (
                    <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm px-3 py-2 rounded mb-4">
                        <Star className="w-4 h-4 mr-2 fill-yellow-800 text-yellow-800" /> 
                        New markdown! Biggest sale in 5 days
                    </div>
                )}

                <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                    {productDetailItem.title || productDetailItem.name || 'Product Title'}
                </h1>

                <div className="flex items-center mb-6">
                    <a href="#" className="text-sm text-gray-700 hover:underline mr-2">
                        {sellerName}
                    </a>
                <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < sellerRating ? 'fill-black text-black' : 'text-gray-300'}`}
                                fill={i < sellerRating ? 'currentColor' : 'none'}
                            />
                        ))}
                        {sellerReviewCount > 0 && (
                            <span className="ml-2 text-sm text-gray-500">({sellerReviewCount})</span>
                        )}
                    </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <button
                        className="flex items-center justify-center bg-black text-white text-lg px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition w-full "
                        onClick={handleAddToCart}
                    >

                        Add to cart
                    </button>

                </div>

                <div className="flex items-start text-sm text-gray-700 bg-gray-50 p-4 rounded-lg mb-6">
                    <Star className="w-5 h-5 fill-purple-600 text-purple-600 mr-3 mt-1" />
                    <p>{sellerMessage}</p>
                </div>


                <div className="border-t border-gray-200 py-4 cursor-pointer" onClick={() => toggleSection('details')}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Item details</h3>
                        {openSections.details ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {openSections.details && (
                        <div className="mt-3 text-gray-700">
                           <p className="font-bold mb-1">
                                Availability:
                                {productDetailItem.availability ? (
                                    <span className="font-normal text-green-600"> In Stock </span>
                                ) : (
                                    <span className="font-normal text-red-600"> Out of Stock</span>
                                )}
                            </p>
                            {productDetailItem.brand && (
                                <p className="font-bold mb-1">
                                    Brand: <span className="font-normal"> {productDetailItem.brand}</span>
                                </p>
                            )}
                            {productDetailItem.category && (
                                <p className="font-bold mb-1">
                                    Cathegory:
                                    <span className="font-normal"> {productDetailItem.category.name}</span>
                                </p>
                            )}
                            {productDetailItem.sku && (
                                <p className="font-bold mb-1">
                                    SKU: <span className="font-normal"> {productDetailItem.sku}</span>
                                </p>
                            )}
                            <p className="mt-3 text-sm leading-5 text-gray-500">
                                {productDetailItem.description || 'No description available.'}
                            </p>
                       </div>
                    )}
                </div>

                <div className="border-t border-gray-200 py-4 cursor-pointer" onClick={() => toggleSection('delivery')}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Delivery</h3>
                        {openSections.delivery ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {openSections.delivery && (
                        <div className="mt-3 text-gray-700">
                            <p>Shipping details...</p>
                        </div>
                    )}
                </div>

                {isInstantDownload && (
                    <div className="border-t border-gray-200 py-4 cursor-pointer" onClick={() => toggleSection('instantDownload')}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Instant Download</h3>
                            {openSections.instantDownload ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </div>
                        {openSections.instantDownload && (
                            <div className="mt-3 text-gray-700">
                              <p>Your files will be available to download once payment is confirmed.</p>
                                <a href="#" className="text-blue-600 hover:underline">Here's how.</a>
                            </div>
                        )}
                    </div>
                )}

                <div className="border-b border-gray-200"></div>

            </div>
        </section>
    );
};

export default ProductDetail;