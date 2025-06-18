import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Heart from '../components/Heart';
import { Plus } from 'lucide-react';
import { RiArrowRightSLine } from 'react-icons/ri';

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const decodedCategory = decodeURIComponent(category);
    const decodedSubcategory = decodeURIComponent(subcategory);

    axios.get("https://ecommerce.ibradev.me/products/all")
      .then((response) => {
        const allProducts = response.data.data;
        const filtered = allProducts.filter(
          (item) =>
            item.category?.slug === decodedCategory &&
            item.subcategory?.slug === decodedSubcategory
        );
        setProducts(filtered);
      });
  }, [category, subcategory]);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    console.log('Item added to cart!', product);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {decodeURIComponent(category)} / {decodeURIComponent(subcategory)}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
                <div
                            key={product.id}
                            className="flex-shrink-0 bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition duration-200 cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            {/* Image */}
                            <div className="group relative w-full h-49 overflow-hidden">
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name || "Product"}
                                    className="w-full h-full object-cover"
                                />
                                 <span
                    className="absolute top-2 right-2 hidden group-hover:flex fade-slide-up items-center justify-center w-8 h-8 rounded-full bg-white cursor-pointer"
                  >
                    <Heart product={product} />
                  </span>
                            </div>

                            {/* Text Details */}
                            <div className="p-3 flex flex-col">
                                {/* Product Name and Rating */}
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm text-gray-800 font-semibold truncate pr-2 flex-grow">{product.name || product.title || 'Product Name'}</p>
                                    {/* Using placeholder rating/reviews if not available in product data */}
                                    {product.rating && product.reviewCount !== undefined ? (
                                        <div className="flex items-center text-xs text-gray-600 flex-shrink-0">
                                            <span className="font-bold mr-0.5">{product.rating.toFixed(1)}</span>
                                            <span className="text-yellow-500">★</span>
                                            <span className="ml-0.5">({product.reviewCount})</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-xs text-gray-600 flex-shrink-0">
                                            <span className="font-bold mr-0.5">4.9</span>
                                            <span className="text-yellow-500">★</span>
                                            <span className="ml-0.5">(10)</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-gray-600 mb-1">Ad by Etsy seller</p>

                                {/* Price and Discount */}
                                <div className="flex items-baseline mb-1">
                                    {product.discount && product.originalPrice ? (
                                        <>
                                            <p className="text-base text-green-700 font-bold mr-2">USD {product.price?.toFixed(2) || '0.00'}</p>
                                            <p className="text-sm text-gray-500 line-through mr-1">USD {product.originalPrice?.toFixed(2)}</p>
                                            <span className="text-xs font-bold text-green-700">({product.discount}% off)</span>
                                        </>
                                    ) : (
                                        <p className="text-base text-gray-800 font-bold">USD {product.price?.toFixed(2) || '0.00'}</p>
                                    )}
                                </div>

                                {/* Free Shipping */}
                                {product.isFreeShipping && (
                                    <p className="text-xs text-gray-600 mb-2">Free shipping</p>
                                )}

                                {/* Add to Cart Button and More like this */}
                                <div className="flex items-center justify-between mt-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-full font-semibold text-sm flex items-center justify-center hover:bg-gray-100 transition duration-200"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add to cart
                                    </button>
                                    <Link to={`/search?q=${encodeURIComponent(product.name || product.title || '')}`} className="text-sm text-gray-700 flex items-center hover:underline">
                                        More like this <RiArrowRightSLine className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
