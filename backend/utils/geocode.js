import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Geocode an address string to latitude and longitude using Google Maps Geocoding API.
 * @param {string} address - The address to geocode.
 * @returns {Promise<{lat: number, lng: number}>} - The latitude and longitude of the address.
 */
export async function geocodeAddress(address) {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key is not set in environment variables');
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      throw new Error(`Geocoding failed for address: ${address}, status: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error in geocodeAddress:', error.message);
    throw error;
  }
}
