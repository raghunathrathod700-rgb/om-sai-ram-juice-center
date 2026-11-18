const RatingStars = ({ rating }) => (
  <span className="text-warning" role="img" aria-label={`Rated ${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <i
        key={n}
        className={`bi ${rating >= n - 0.25 ? 'bi-star-fill' : rating >= n - 0.75 ? 'bi-star-half' : 'bi-star'}`}
        aria-hidden="true"
      ></i>
    ))}
  </span>
);

export default RatingStars;
