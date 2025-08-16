// Import React hooks for state management and side effects
import React, { useState, useEffect, useRef } from 'react';
// Import icons for search, location pin, and navigation
import { Search, MapPin, Navigation } from 'lucide-react';
// Import CSS styles for this component
import './SearchBar.css';

// Main SearchBar component that handles city search with smart suggestions
const SearchBar = ({ onSearch, onLocationClick, currentCity }) => {
  // State to store the current search input value
  const [searchTerm, setSearchTerm] = useState('');
  // State to store filtered city suggestions based on search term
  const [suggestions, setSuggestions] = useState([]);
  // State to control whether suggestions dropdown is visible
  const [showSuggestions, setShowSuggestions] = useState(false);
  // State to track which suggestion is currently selected (for keyboard navigation)
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // State for loading indicator (future enhancement)
  const [isLoading, setIsLoading] = useState(false);
  // Ref to the main search container for detecting clicks outside
  const searchRef = useRef(null);
  // Ref to the suggestions dropdown for scrolling selected items into view
  const suggestionsRef = useRef(null);

  // Comprehensive database of cities organized by regions for smart suggestions
  const citiesDatabase = [
    // Major Cities (A-Z) - Global metropolitan areas
    'Amsterdam', 'Athens', 'Atlanta', 'Austin', 'Bangkok', 'Barcelona', 'Beijing', 'Berlin', 'Boston', 'Brisbane',
    'Brussels', 'Budapest', 'Buenos Aires', 'Cairo', 'Calgary', 'Cape Town', 'Chicago', 'Copenhagen', 'Dallas',
    'Delhi', 'Detroit', 'Dhaka', 'Dubai', 'Dublin', 'Edinburgh', 'Florence', 'Frankfurt', 'Geneva', 'Glasgow',
    'Gothenburg', 'Hamburg', 'Hanoi', 'Helsinki', 'Hong Kong', 'Houston', 'Istanbul', 'Jakarta', 'Johannesburg',
    'Kansas City', 'Karachi', 'Kiev', 'Kolkata', 'Kuala Lumpur', 'Las Vegas', 'Lima', 'Lisbon', 'Liverpool',
    'London', 'Los Angeles', 'Madrid', 'Manchester', 'Manila', 'Melbourne', 'Mexico City', 'Miami', 'Milan',
    'Minneapolis', 'Montreal', 'Moscow', 'Mumbai', 'Munich', 'Nairobi', 'Nashville', 'New Orleans', 'New York',
    'Nice', 'Osaka', 'Oslo', 'Ottawa', 'Paris', 'Perth', 'Philadelphia', 'Phoenix', 'Pittsburgh', 'Portland',
    'Prague', 'Quebec', 'Rio de Janeiro', 'Rome', 'Rotterdam', 'San Antonio', 'San Diego', 'San Francisco',
    'Santiago', 'São Paulo', 'Seattle', 'Seoul', 'Shanghai', 'Singapore', 'Stockholm', 'Stuttgart', 'Sydney',
    'Taipei', 'Tel Aviv', 'Tokyo', 'Toronto', 'Vancouver', 'Venice', 'Vienna', 'Warsaw', 'Washington DC',
    'Wellington', 'Zurich',
    
    // US Cities - Major American cities for comprehensive coverage
    'Albany', 'Albuquerque', 'Anchorage', 'Ann Arbor', 'Arlington', 'Aurora', 'Baltimore', 'Baton Rouge',
    'Birmingham', 'Boise', 'Buffalo', 'Charlotte', 'Cincinnati', 'Cleveland', 'Colorado Springs', 'Columbus',
    'Denver', 'Des Moines', 'Detroit', 'El Paso', 'Fort Worth', 'Fresno', 'Grand Rapids', 'Greensboro',
    'Hartford', 'Honolulu', 'Indianapolis', 'Jacksonville', 'Kansas City', 'Lexington', 'Long Beach', 'Louisville',
    'Memphis', 'Milwaukee', 'Nashville', 'Newark', 'Norfolk', 'Oakland', 'Oklahoma City', 'Omaha', 'Orlando',
    'Pittsburgh', 'Portland', 'Providence', 'Raleigh', 'Richmond', 'Rochester', 'Sacramento', 'Salt Lake City',
    'San Antonio', 'San Jose', 'Spokane', 'Springfield', 'St. Louis', 'St. Paul', 'Tampa', 'Toledo', 'Tucson',
    'Tulsa', 'Virginia Beach', 'Wichita', 'Winston-Salem',
    
    // European Cities - Major European metropolitan areas
    'Aberdeen', 'Antwerp', 'Belfast', 'Bilbao', 'Birmingham', 'Bologna', 'Bordeaux', 'Bristol', 'Cardiff',
    'Cologne', 'Dresden', 'Düsseldorf', 'Edinburgh', 'Florence', 'Frankfurt', 'Glasgow', 'Gothenburg', 'Graz',
    'Hamburg', 'Hannover', 'Helsinki', 'Krakow', 'Leeds', 'Leipzig', 'Lille', 'Lyon', 'Marseille', 'Milan',
    'Munich', 'Nantes', 'Newcastle', 'Nuremberg', 'Palermo', 'Porto', 'Rotterdam', 'Sheffield', 'Strasbourg',
    'Stuttgart', 'Toulouse', 'Turin', 'Valencia', 'Vienna', 'Warsaw', 'Wroclaw', 'Zagreb', 'Zurich',
    
    // Asian Cities - Major Asian metropolitan areas
    'Ahmedabad', 'Bangkok', 'Beijing', 'Bengaluru', 'Chennai', 'Chongqing', 'Delhi', 'Dhaka', 'Fukuoka',
    'Guangzhou', 'Hangzhou', 'Harbin', 'Ho Chi Minh City', 'Hong Kong', 'Hyderabad', 'Jakarta', 'Kolkata',
    'Kuala Lumpur', 'Kyoto', 'Lahore', 'Manila', 'Mumbai', 'Nagoya', 'Nanjing', 'Osaka', 'Pune', 'Seoul',
    'Shanghai', 'Shenzhen', 'Singapore', 'Suzhou', 'Taipei', 'Tianjin', 'Tokyo', 'Wuhan', 'Xi\'an',
    
    // African Cities - Major African metropolitan areas
    'Abidjan', 'Accra', 'Addis Ababa', 'Algiers', 'Cairo', 'Cape Town', 'Casablanca', 'Dar es Salaam',
    'Durban', 'Johannesburg', 'Khartoum', 'Kinshasa', 'Lagos', 'Luanda', 'Nairobi', 'Rabat', 'Tunis',
    
    // Australian Cities - Major Australian metropolitan areas
    'Adelaide', 'Brisbane', 'Canberra', 'Darwin', 'Gold Coast', 'Hobart', 'Melbourne', 'Newcastle',
    'Perth', 'Sydney', 'Townsville', 'Wollongong',
    
    // Canadian Cities - Major Canadian metropolitan areas
    'Calgary', 'Edmonton', 'Halifax', 'Hamilton', 'Kitchener', 'London', 'Mississauga', 'Montreal',
    'Ottawa', 'Quebec City', 'Regina', 'Saskatoon', 'Toronto', 'Vancouver', 'Victoria', 'Winnipeg',
    
    // South American Cities - Major South American metropolitan areas
    'Belo Horizonte', 'Bogota', 'Brasilia', 'Buenos Aires', 'Caracas', 'Curitiba', 'Fortaleza', 'Guayaquil',
    'Lima', 'Medellin', 'Montevideo', 'Porto Alegre', 'Quito', 'Recife', 'Rio de Janeiro', 'Salvador',
    'Santiago', 'São Paulo', 'Valencia'
  ];

  // Function to filter cities based on search term with smart logic
  const getSuggestions = (term) => {
    // Return empty array if search term is empty or only whitespace
    if (!term.trim()) return [];
    
    // Convert search term to lowercase for case-insensitive comparison
    const searchLower = term.toLowerCase();
    // Get length of search term for different filtering strategies
    const searchLength = searchLower.length;
    
    // Initialize filtered results array
    let filtered = [];
    
    // Smart filtering strategy: For 1-2 characters, show cities starting with those characters
    if (searchLength <= 2) {
      // Filter cities that start with the search term (prefix matching)
      filtered = citiesDatabase.filter(city => 
        city.toLowerCase().startsWith(searchLower)
      );
    } else {
      // For 3+ characters, show cities containing the search term anywhere (substring matching)
      filtered = citiesDatabase.filter(city => 
        city.toLowerCase().includes(searchLower)
      );
      
      // Prioritize cities that start with the search term for better user experience
      const startsWith = filtered.filter(city => 
        city.toLowerCase().startsWith(searchLower)
      );
      // Cities that contain the search term but don't start with it
      const contains = filtered.filter(city => 
        !city.toLowerCase().startsWith(searchLower)
      );
      
      // Combine results with priority order: startsWith first, then contains
      filtered = [...startsWith, ...contains];
    }
    
    // Add the search term itself if it's not in the database and has 3+ characters
    // This allows users to search for cities not in our database
    if (searchLength >= 3 && !filtered.includes(term) && !citiesDatabase.includes(term)) {
      filtered.unshift(term); // Add to beginning of array
    }
    
    // Limit results to 12 suggestions to prevent overwhelming the user
    return filtered.slice(0, 12);
  };

  // Effect hook to update suggestions whenever search term changes
  useEffect(() => {
    // Only show suggestions if there's actual text in the search input
    if (searchTerm.trim().length > 0) {
      // Get new suggestions based on current search term
      const newSuggestions = getSuggestions(searchTerm);
      // Update suggestions state with new filtered results
      setSuggestions(newSuggestions);
      // Show suggestions dropdown if we have results
      setShowSuggestions(newSuggestions.length > 0);
      // Reset selected index when search term changes
      setSelectedIndex(-1);
    } else {
      // Clear suggestions and hide dropdown if search term is empty
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]); // Dependency array: effect runs when searchTerm changes

  // Function to handle keyboard navigation in suggestions dropdown
  const handleKeyDown = (e) => {
    // Only handle keyboard events if suggestions are visible
    if (!showSuggestions) return;

    // Switch statement to handle different key presses
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // Prevent default page scrolling
        // Move selection down, but don't go beyond the last suggestion
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault(); // Prevent default page scrolling
        // Move selection up, but don't go below -1 (no selection)
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault(); // Prevent form submission
        // If a suggestion is selected, use that; otherwise search the entered text
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (searchTerm.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        // Hide suggestions and reset selection when Escape is pressed
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        // Do nothing for other keys
        break;
    }
  };

  // Function to handle when user clicks on a suggestion
  const handleSuggestionClick = (city) => {
    // Update search input with selected city name
    setSearchTerm(city);
    // Hide suggestions dropdown
    setShowSuggestions(false);
    // Reset keyboard selection
    setSelectedIndex(-1);
    // Trigger search with selected city
    onSearch(city);
  };

  // Function to handle search form submission
  const handleSearch = () => {
    // Only search if there's actual text to search for
    if (searchTerm.trim()) {
      // Call parent component's search function
      onSearch(searchTerm.trim());
      // Hide suggestions dropdown
      setShowSuggestions(false);
      // Reset keyboard selection
      setSelectedIndex(-1);
    }
  };

  // Function to handle input field changes
  const handleInputChange = (e) => {
    // Update search term state with current input value
    setSearchTerm(e.target.value);
  };

  // Function to handle when input field gains focus
  const handleInputFocus = () => {
    // Show suggestions if we have any when user focuses on input
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Effect hook to handle clicks outside the search component
  useEffect(() => {
    // Function to handle mouse clicks
    const handleClickOutside = (event) => {
      // Check if click target is outside our search container
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Hide suggestions and reset selection when clicking outside
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    // Add event listener for mouse clicks
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup: remove event listener when component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array: effect runs only once on mount

  // Effect hook to scroll selected suggestion into view
  useEffect(() => {
    // Only scroll if we have a selected suggestion and suggestions ref exists
    if (selectedIndex >= 0 && suggestionsRef.current) {
      // Get the DOM element of the selected suggestion
      const selectedElement = suggestionsRef.current.children[selectedIndex];
      if (selectedElement) {
        // Scroll the selected element into view smoothly
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]); // Dependency array: effect runs when selectedIndex changes

  // Render the search bar component
  return (
    // Main container with ref for detecting outside clicks
    <div className="search-container" ref={searchRef}>
      {/* Search form with submit handler */}
      <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        {/* Container for search input and suggestions dropdown */}
        <div className="search-input-group">
          {/* Search icon positioned absolutely over input */}
          <Search className="search-icon" />
          {/* Main search input field */}
          <input
            ref={searchRef} // Ref for focus management
            type="text" // Text input type
            className="search-input" // CSS class for styling
            placeholder="Search for a city" // Helpful placeholder text
            value={searchTerm} // Controlled input value
            onChange={handleInputChange} // Handler for input changes
            onKeyDown={handleKeyDown} // Handler for keyboard navigation
            onFocus={handleInputFocus} // Handler for input focus
            autoComplete="off" // Disable browser autocomplete
          />
          
          {/* Conditional rendering of suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            // Suggestions container with ref for scrolling
            <div className="search-suggestions" ref={suggestionsRef}>
               {/* Map through suggestions to create suggestion items */}
               {suggestions.map((city, index) => (
                // Individual suggestion item with click and hover handlers
                <div
                  key={city} // Unique key for React rendering
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`} // Dynamic CSS classes
                  onClick={() => handleSuggestionClick(city)} // Click handler for selection
                  onMouseEnter={() => setSelectedIndex(index)} // Hover handler for keyboard sync
                >
                  {/* Location pin icon for visual appeal */}
                  <MapPin size={16} />
                  {/* City name with specific CSS class */}
                  <span className="city-name">{city}</span>
                  {/* Show hint for custom search terms */}
                  {index === 0 && !citiesDatabase.includes(city) && (
                    <span className="suggestion-hint">Press Enter to search</span>
                  )}
                  {/* Show city type badge for known cities */}
                  {citiesDatabase.includes(city) && (
                    <span className="city-type">
                      {/* Special badge for major global cities */}
                      {city === 'London' || city === 'Paris' || city === 'New York' || city === 'Tokyo' ? 'Major City' : 'City'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Search button with icon and text */}
        <button type="submit" className="search-btn">
          <Search size={18} /> {/* Search icon */}
          Search {/* Button text */}
        </button>
      </form>

      {/* Button to use current GPS location */}
      <button className="location-btn" onClick={onLocationClick}>
        <Navigation size={18} /> {/* Navigation icon */}
        Use Current Location {/* Button text */}
      </button>

      {/* Display current city if one is selected */}
      {currentCity && (
        <div className="current-city">
          Currently showing weather for: <strong>{currentCity}</strong>
        </div>
      )}
    </div>
  );
};

// Export the component for use in other parts of the application
export default SearchBar;
