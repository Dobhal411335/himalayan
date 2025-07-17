"use client";
import React, { useState } from "react";
import FeaturedRoomsSection from "./FeaturedRoomsSection";
import ReviewListModal from "./ReviewListModal";
import BookingDetails from "./BookingDetails";

export default function FeaturedRoomsClient({ rooms }) {
  // console.log(rooms)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowBookModal(true);
  };

  const handleShowReviews = (room) => {
    setSelectedRoom(room);
    setShowReviewModal(true);
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
    setSelectedRoom(null);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRoom(null);
  };

  return (
    <>
      {rooms.length > 0 && (
        <FeaturedRoomsSection
          rooms={rooms}
          onBook={handleBookNow}
          onShowReviews={handleShowReviews}
        />
      )}
      {showReviewModal && selectedRoom && (
        <ReviewListModal
          open={showReviewModal}
          onClose={handleCloseReviewModal}
          reviews={selectedRoom.reviews || []}
        />
      )}
      {showBookModal && selectedRoom && (
        <BookingDetails
          room={selectedRoom}
          onClose={handleCloseBookModal}
          type="room"
        />
      )}
    </>
  );
}