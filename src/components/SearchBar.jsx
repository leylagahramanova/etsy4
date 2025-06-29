import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

// Helper function to format category slugs for display (moved from Navbar)
const formatCategoryDisplayName = (slug) => {
    if (!slug) return '';

    const parts = slug.split('/');
    let formattedParts = parts.map(part => {
        return part.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });

    return formattedParts.join(' / ');
};

const SearchBar = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [products, setProducts] = useState([]); // Products for search suggestions
    const [categories, setCategories] = useState([]); // Categories for search suggestions

    const navigate = useNavigate();

    // Fetch products and categories for search suggestions
    useEffect(() => {
        axios.get("https://ecommerce.ibradev.me/products/all")
            .then((res) => {
                console.log("API response (SearchBar):", res.data);
                const fetchedProducts = res.data.data;

                if (Array.isArray(fetchedProducts)) {
                    setProducts(fetchedProducts);

                    const categoryMap = new Map();
                    fetchedProducts.forEach(product => {
                        const mainCategorySlug = product.category?.slug;
                        if (mainCategorySlug && !categoryMap.has(mainCategorySlug)) {
                            categoryMap.set(mainCategorySlug, { 
                                name: formatCategoryDisplayName(mainCategorySlug),
                                slug: mainCategorySlug
                            });
                        }
                    });
                    setCategories(Array.from(categoryMap.values()));

                } else {
                    console.error("Expected an array in res.data.data, got:", fetchedProducts);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch products/categories for search:", err);
            });
    }, []);

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchVal(value);

        if (value.length > 0) {
            // Filter categories based on search input
            const filteredCategories = categories.filter(cat =>
                formatCategoryDisplayName(cat.name).toLowerCase().includes(value.toLowerCase())
            ).map(cat => ({ label: formatCategoryDisplayName(cat.name), type: 'category', value: cat.slug }));

            // Also filter products by name for direct search suggestions
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase())
            ).map(product => ({ label: product.name, type: 'product', value: product.id }));

            setSearchResults([...filteredCategories, ...filteredProducts]);
        } else {
            setSearchResults([]); // Clear results if input is empty
        }
        setShowSuggestions(true); // Always show suggestions when typing
    };

    const handleSearchInputFocus = () => {
        setIsSearchActive(true);
        setShowSuggestions(true);
    };

    const handleSearchInputBlur = () => {
        // Use a timeout to allow click events on suggestions before closing the dropdown
        setTimeout(() => {
            setIsSearchActive(false);
            setShowSuggestions(false);
        }, 100); // Small delay
    };

    const handleClearSearch = () => {
        setSearchVal("");
        setSearchResults([]);
        setShowSuggestions(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchVal.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchVal)}`);
        }
        setShowSuggestions(false);
        setIsSearchActive(false);
    };

    const handleSuggestionClick = (value, type) => {
        if (type === 'category') {
            setSearchVal(formatCategoryDisplayName(value));
        } else {
            setSearchVal(value); // This will be the actual search term or product name
        }

        setShowSuggestions(false);
        setIsSearchActive(false);

        if (type === 'category') {
            navigate(`/category/${value}`);
        } else if (type === 'product') {
            navigate(`/product/${value}`);
        } else {
            navigate(`/search?q=${encodeURIComponent(value)}`);
        }
    };

    return (
        <form onSubmit={handleSearchSubmit} className="flex justify-between flex-1 max-w-4xl border-black border-4 rounded-full relative z-30">
            <input
                type="text"
                placeholder="Search for anything"
                className="flex-1 py-2 pl-4 pr-2 rounded-l-full focus:outline-none focus:ring-2 text-sm"
                value={searchVal}
                onChange={handleSearchInputChange}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
            />
            {searchVal && isSearchActive && (
                <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
            )}
            <button
                type="submit"
                className={`bg-orange-500 text-white w-11 h-11 flex items-center justify-center border transition-all duration-200 ${isSearchActive ? 'rounded-r-full m-0' : 'rounded-full m-1'}`}
                aria-label="Search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    className="h-5 w-5" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd"
                        d="M10.5 19a8.46 8.46 0 0 0 5.262-1.824l4.865 4.864 1.414-1.414-4.865-4.865A8.5 8.5 0 1 0 10.5 19m0-2a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13" />
                </svg>
            </button>

            {showSuggestions && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10 max-h-80 overflow-y-auto">
                    {searchVal.length > 0 ? (
                        searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map((result, idx) => (
                                    <li
                                        key={idx}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                                        onMouseDown={(e) => e.preventDefault()} // Prevent blur from closing before click
                                        onClick={() => handleSuggestionClick(result.value, result.type)}
                                    >
                                        {result.label}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-4 py-2 text-gray-500">No results found.</p>
                        )
                    ) : (
                        <div className='mt-2'>
                            <p className="px-4 py-2 text-gray-800 font-semibold ">More foolproof favorites</p>
                            <ul>
                                {products.slice(0, 7).map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSuggestionClick(item.name, 'text')}
                                    >
                                        {item.images?.[0] && <img src={item.images?.[0]} alt={item.name} className="w-8 h-8 rounded-md mr-2 object-cover" />}
                                        <span className="text-gray-800">{item.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
};

export default SearchBar; 