'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Add Google Maps types
declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

interface SuburbAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

// Typewriter suburbs for placeholder animation
const TYPEWRITER_SUBURBS = [
  'Bondi, NSW',
  'Toorak, VIC',
  'Ascot, QLD',
  'Cottesloe, WA',
  'Norwood, SA',
  'Sandy Bay, TAS',
];

export default function SuburbAutocomplete({
  onPlaceSelect,
  placeholder,
  className = '',
  inputClassName = '',
}: SuburbAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(TYPEWRITER_SUBURBS[0]);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (placeholder) return; // Skip animation if custom placeholder provided

    let phraseIdx = 0;
    let charIdx = TYPEWRITER_SUBURBS[0].length;
    let isDeleting = true;
    let isPaused = false;

    const tick = () => {
      const currentPhrase = TYPEWRITER_SUBURBS[phraseIdx];
      
      if (isPaused) {
        isPaused = false;
        return;
      }

      if (isDeleting) {
        if (charIdx > 0) {
          setAnimatedPlaceholder(currentPhrase.substring(0, charIdx - 1));
          charIdx--;
        } else {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % TYPEWRITER_SUBURBS.length;
        }
      } else {
        const newPhrase = TYPEWRITER_SUBURBS[phraseIdx];
        if (charIdx < newPhrase.length) {
          setAnimatedPlaceholder(newPhrase.substring(0, charIdx + 1));
          charIdx++;
        } else {
          isDeleting = true;
          isPaused = true;
        }
      }
    };

    const interval = setInterval(tick, isDeleting ? 50 : 100);
    return () => clearInterval(interval);
  }, [placeholder]);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found. Autocomplete will be disabled.');
      return;
    }

    // Check if already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup callback
      delete window.initGoogleMaps;
    };
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      types: ['(regions)'], // Focus on suburbs/localities
      componentRestrictions: { country: 'au' }, // Australia only
      fields: ['place_id', 'name', 'formatted_address', 'address_components', 'geometry'],
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    // Style the autocomplete dropdown
    const pacContainer = document.querySelector('.pac-container');
    if (pacContainer) {
      (pacContainer as HTMLElement).style.zIndex = '9999';
    }

    // Listen for place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && onPlaceSelect) {
        onPlaceSelect(place);
      }
    });

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded, onPlaceSelect]);

  // Handle keyboard navigation - prevent form submission on Enter
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        className={inputClassName || 'flex-1 bg-transparent outline-none border-none text-gray-900 placeholder-gray-400 text-lg focus:ring-0'}
        placeholder={placeholder || animatedPlaceholder}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
    </div>
  );
}
