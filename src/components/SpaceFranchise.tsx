import React, { useState } from 'react';
import { ShoppingCart, Star, Book, Shirt, Gamepad2, Award, Filter, Search, Heart, Plus, Minus, Crown, TrendingUp, Zap, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'books' | 'apparel' | 'toys' | 'collectibles';
  rating: number;
  reviews: number;
  description: string;
  featured?: boolean;
  bestseller?: boolean;
  inStock: boolean;
  tags: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 'book-1',
    name: 'Wings of Fire: An Autobiography by Dr. A.P.J. Abdul Kalam',
    price: 299,
    originalPrice: 399,
    image: 'https://uniathenaprods3.uniathena.com/s3fs-public/2024-01/Wings-of-Fire-Abdul-Kalam.jpg',
    category: 'books',
    rating: 4.9,
    reviews: 15420,
    description: 'The inspiring autobiography of India\'s Missile Man and former President, Dr. A.P.J. Abdul Kalam. A journey from humble beginnings to becoming one of the world\'s most respected scientists and leaders.',
    featured: true,
    bestseller: true,
    inStock: true,
    tags: ['autobiography', 'inspiration', 'science', 'bestseller']
  },
  {
    id: 'book-2',
    name: 'Astrophysics for People in a Hurry',
    price: 450,
    image: 'https://rukminim2.flixcart.com/image/850/1000/l59xq4w0/regionalbooks/w/i/h/astrophysics-for-people-in-a-hurry-original-imagfzhetxvdqmjt.jpeg?q=90&crop=false',
    category: 'books',
    rating: 4.7,
    reviews: 8920,
    description: 'Neil deGrasse Tyson brings the universe down to Earth succinctly and clearly, with sparkling wit.',
    inStock: true,
    tags: ['astrophysics', 'science', 'education']
  },
  {
    id: 'book-3',
    name: 'The Right Stuff by Tom Wolfe',
    price: 520,
    image: 'https://i.ytimg.com/vi/9GjfGXBkvqY/maxresdefault.jpg',
    category: 'books',
    rating: 4.6,
    reviews: 5670,
    description: 'The classic account of the early days of the space program and the test pilots who became astronauts.',
    inStock: true,
    tags: ['space program', 'history', 'astronauts']
  },
  {
    id: 'book-4',
    name: 'Cosmos by Carl Sagan',
    price: 480,
    image: 'https://lh3.googleusercontent.com/proxy/ItrtdqYjfNEl8Fgos1tc0-23FbbPPAjryRdCiIzhpuz7X50zK4D8tWNpsgCEJgV-xsGP6CCccI7TkCfsc805q00ebmQDO6chlhsUnCrMikTnwjlIdYTXbOQIv8N2F1lD7w',
    category: 'books',
    rating: 4.8,
    reviews: 12340,
    description: 'A classic work that continues to inspire wonder about the cosmos and our place in it.',
    inStock: true,
    tags: ['cosmos', 'science', 'philosophy']
  },
  {
    id: 'apparel-1',
    name: 'Official NASA Logo T-Shirt',
    price: 899,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRFw3uM8iZ9gUMMd62VDIOUmZcXTZyDc-RVnMan1w4Ovs3BGHqondmNafpFQI2CHDm2cGTSXYrzH8N0xkGtA0op6j3BolH7AEAwL7pVwCYtZhacIiCReWFv',
    category: 'apparel',
    rating: 4.5,
    reviews: 3240,
    description: 'Premium quality cotton t-shirt featuring the iconic NASA logo. Officially licensed merchandise.',
    bestseller: true,
    inStock: true,
    tags: ['nasa', 'official', 'cotton', 'logo']
  },
  {
    id: 'apparel-2',
    name: 'Space Shuttle Mission Hoodie',
    price: 1599,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT3EIsVPup9CyupVZrsZjgbQYjXCs9OcErcOBjLZ6IJRHeRucfPv4MVqabtxr0HvT0gmPnJAmXnLlneFCEtK4zWKnv5HFN5L9msJzXj5jtzHNUMtn1mySqopA',
    category: 'apparel',
    rating: 4.7,
    reviews: 1890,
    description: 'Comfortable hoodie featuring space shuttle mission patches and NASA branding.',
    inStock: true,
    tags: ['hoodie', 'space shuttle', 'missions', 'warm']
  },
  {
    id: 'apparel-3',
    name: 'Astronaut Training Jacket',
    price: 2299,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSNPruNB9roo9inMdV2ReZ2MPcCDaYo5rjB2R1uxAl1gM5EhNBz2NYKzwaLSZ6ngQW_VW5gBIl2bE1cVtucjwdgbfDfDYogKFmdA38bkcvWCGZJARHPcu50OR7N',
    category: 'apparel',
    rating: 4.8,
    reviews: 980,
    description: 'Professional-grade jacket inspired by astronaut training gear with multiple pockets.',
    inStock: true,
    tags: ['jacket', 'astronaut', 'training', 'professional']
  },
  {
    id: 'toy-1',
    name: 'NASA Space Shuttle Model Kit',
    price: 1299,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQRTEOTunzIr8aTJbsx3UVS-xgf22Yw1x055QC_4c0aQC8vGkGTESEzU4_ED5DmGTEoavQK5WjuPBikD_k5h5RP9UW0MCdsUki1ZMKSDYde03YjKqZu65EdvQ',
    category: 'toys',
    rating: 4.6,
    reviews: 2150,
    description: 'Detailed 1:144 scale model of the Space Shuttle with authentic markings and moveable parts.',
    inStock: true,
    tags: ['model', 'shuttle', 'educational', 'detailed']
  },
  {
    id: 'toy-2',
    name: 'Solar System Planetarium',
    price: 1899,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSd6zMU_AGdqfwVujwcjghk9ujlQ8l8Z3qoCwpG1tt0L68-HQbhpY1LVAVt41z1fJ23E7ueufw_rFHOzSbUpVF_oVOTGAH8A5XVUFP4r7d0GjqL7e8M_mkErQ',
    category: 'toys',
    rating: 4.7,
    reviews: 1670,
    description: 'Interactive planetarium showing the solar system with LED lights and educational content.',
    bestseller: true,
    inStock: true,
    tags: ['planetarium', 'solar system', 'educational', 'interactive']
  },
  {
    id: 'toy-3',
    name: 'Rocket Launch Pad Set',
    price: 2499,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTTnAOV9HkVFNuRan7hT7nh_UkXiDU-MMFSH5LYxw8lBejk1sQGIolsFz8GWcX53Tye_8HF5MuH_wy9JAMS0TGyY2fxm3xzsgAPUEbHcSSO8gKFInSet0nZ8g',
    category: 'toys',
    rating: 4.5,
    reviews: 890,
    description: 'Complete rocket launch set with multiple rockets, launch pad, and mission control center.',
    inStock: true,
    tags: ['rocket', 'launch', 'playset', 'mission control']
  },
  {
    id: 'collectible-1',
    name: 'Apollo 11 Mission Poster Set',
    price: 799,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTKV1uwQhFIMFxqEXHMC4Afrqreq7qeC18Cx-AM9k9M1xyDr1skgvAFfljc3eHXavqrTdkl7z1D8FyrIhcEhmbOw8ienkQ1BiXXWmtDZ9RJlNHZtrMEECMi',
    category: 'collectibles',
    rating: 4.8,
    reviews: 1450,
    description: 'High-quality prints of iconic Apollo 11 mission photographs and technical diagrams.',
    inStock: true,
    tags: ['apollo 11', 'posters', 'historical', 'prints']
  },
  {
    id: 'collectible-2',
    name: 'Astronaut Portrait Collection',
    price: 1199,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTjcumGQ4OFjYg3M-CQI910rUAmn7HteJbGgGSMUBAGJEd50fs3kb0Q8oruo15oSRsSZfMwdLcTWwOiJDrUC2yQEIY4RTwOu6oDKAaT_nWs6n0IRNfm9VC8',
    category: 'collectibles',
    rating: 4.6,
    reviews: 780,
    description: 'Premium poster collection featuring portraits of famous astronauts from different eras.',
    inStock: true,
    tags: ['astronauts', 'portraits', 'collection', 'premium']
  },
  {
    id: 'collectible-3',
    name: 'Space Station Blueprint Poster',
    price: 649,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSBSkXmHM3sxK8DekcWgKlg1026KZLAeGCPIj2-mxA3u2ID-AtMnRABNQ1gIJTg53CrCTpCKlKr-IP2hn6sQ3PeaB1nPfD4fzwT3hsg0qIz7YNAjxZa0Nrttg',
    category: 'collectibles',
    rating: 4.4,
    reviews: 560,
    description: 'Detailed technical blueprint of the International Space Station in poster format.',
    inStock: true,
    tags: ['ISS', 'blueprint', 'technical', 'educational']
  }
];

export const SpaceFranchise: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products', icon: Package },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'apparel', label: 'Apparel', icon: Shirt },
    { id: 'toys', label: 'Toys & Models', icon: Gamepad2 },
    { id: 'collectibles', label: 'Posters & Art', icon: Award }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredProduct = products.find(p => p.featured);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <ShoppingCart className="w-8 h-8 text-purple-400" />
          <span>Cosmic Store</span>
          <Zap className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Official space merchandise, educational materials, and collectibles
        </p>
      </div>

      {/* Featured Product - Wings of Fire */}
      {featuredProduct && (
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
                <h3 className="text-2xl font-bold text-yellow-400">MOST POPULAR BOOK</h3>
                <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-lg"></div>
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="relative w-full h-80 object-cover rounded-xl shadow-2xl"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
                    BESTSELLER
                  </span>
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    25% OFF
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <TrendingUp className="w-8 h-8 text-yellow-400 animate-bounce" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-3xl font-bold text-white mb-2">{featuredProduct.name}</h4>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(featuredProduct.rating)}
                      <span className="text-yellow-400 font-semibold ml-2">{featuredProduct.rating}</span>
                    </div>
                    <span className="text-gray-400">({featuredProduct.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">{featuredProduct.description}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-green-400">₹{featuredProduct.price}</span>
                    {featuredProduct.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">₹{featuredProduct.originalPrice}</span>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    Save ₹{featuredProduct.originalPrice! - featuredProduct.price}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => addToCart(featuredProduct)}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(featuredProduct.id)}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      wishlist.includes(featuredProduct.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${wishlist.includes(featuredProduct.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Free shipping on orders over ₹500</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Fast delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="relative bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-l border-white/20 w-96 h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Shopping Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-400 text-sm">₹{item.price}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-white/20 rounded text-white flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-white/20 rounded text-white flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-green-400">₹{getTotalPrice()}</span>
                    </div>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300">
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.filter(p => !p.featured).map((product) => (
          <div
            key={product.id}
            className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                  wishlist.includes(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-black/50 text-white hover:bg-black/70'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
              </button>
              {product.bestseller && (
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    BESTSELLER
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center space-x-1 mb-3">
                {renderStars(product.rating)}
                <span className="text-gray-400 text-sm ml-2">({product.reviews})</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-green-400">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Store Information */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
          <Package className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h4 className="text-white font-semibold mb-2">Free Shipping</h4>
          <p className="text-gray-400 text-sm">Free shipping on orders over ₹500</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
          <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-white font-semibold mb-2">Authentic Products</h4>
          <p className="text-gray-400 text-sm">Official merchandise and licensed products</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
          <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h4 className="text-white font-semibold mb-2">Fast Delivery</h4>
          <p className="text-gray-400 text-sm">Quick delivery across India</p>
        </div>
      </div>
    </div>
  );
};