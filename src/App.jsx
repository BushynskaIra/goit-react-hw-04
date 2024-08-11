
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ImageModal from './components/ImageModal/ImageModal';
import './App.css';

const API_KEY = 'TaQDrKEIdojPl19--8Vl3ti0lQTtq1sFNIy2BNfJKG8'; 
const BASE_URL = 'https://api.unsplash.com/search/photos';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchImages = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          query,
          page,
          per_page: 12,
          client_id: API_KEY,
        },
      });

      const newImages = response.data.results;

      if (newImages.length === 0 && page === 1) {
        toast.error('No images found for your search.');
      }

      setImages((prevImages) => [...prevImages, ...newImages]);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page, query]); // Ensure that fetchImages runs when query or page changes

  const handleSearchSubmit = (newQuery) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setImages([]);
      setPage(1);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} />
      <SearchBar onSubmit={handleSearchSubmit} />
      {error && <ErrorMessage message={error} />}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {images.length > 0 && !loading && <LoadMoreBtn onClick={handleLoadMore} />}
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          image={selectedImage}
        />
      )}
    </div>
  );
};

export default App;
