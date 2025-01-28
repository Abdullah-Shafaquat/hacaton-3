'use client';
import { useState, useEffect } from 'react';
import { IoMdStarHalf } from 'react-icons/io';
import { MdOutlineStar } from 'react-icons/md';

const AddReviews = () => {
  const [reviews, setReviews] = useState<{ name: string; text: string; rating: number; date: string }[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);

  // Load reviews from localStorage when the component mounts
  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  const submitReview = () => {
    if (name && text) {
      const newReview = { name, text, rating, date: new Date().toLocaleDateString() };
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews); // Update the state with new reviews
      setName('');
      setText('');
      setRating(1);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<MdOutlineStar key={i} size={20} className="text-yellow-500" />);
      } else if (i - rating < 1) {
        stars.push(<IoMdStarHalf key={i} size={20} className="text-yellow-500" />);
      } else {
        stars.push(<MdOutlineStar key={i} size={20} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="flex flex-col sm:flex-row justify-between border-b pb-4">
            <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {review.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold">{review.name}</h3>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="text-sm mt-2">{review.text}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-500">{review.date}</p>
              <div className="mt-2 flex">{renderStars(review.rating)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            placeholder="Your Review"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-3 border rounded-lg"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <button
            onClick={submitReview}
            className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviews;
