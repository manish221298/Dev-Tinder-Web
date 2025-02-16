const UserCard = ({ feedData }) => {
  return (
    <div className="card bg-base-200 w-96 shadow-sm">
      <figure>
        <img
          src={
            feedData?.photo ||
            "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          }
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {feedData?.firstName + " " + feedData?.lastName}
        </h2>
        <p>{feedData?.gender + ", " + feedData?.nationality}</p>
        <p>{feedData?.bio}</p>
        <div className="card-actions justify-center">
          <button className="btn btn-error">Ignore</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
