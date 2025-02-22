import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import photosData from "./photos.json";
import "./App.css";

interface Photo {
      url: string;
      orientation: "portrait" | "landscape";
}

function App() {
      const [photos, setPhotos] = useState<Photo[]>([]);
      const [activeIndex, setActiveIndex] = useState<number | null>(null);
      const [positions, setPositions] = useState<{
            [key: number]: { x: number; y: number; rotate: number };
      }>({});
      const [isDragging, setIsDragging] = useState<boolean>(false);

      // Load photos data and set initial positions
      useEffect(() => {
            setPhotos(photosData as Photo[]);
            const initialPositions: { [key: number]: { x: number; y: number; rotate: number } } =
                  {};
            photosData.forEach((_, index) => {
                  initialPositions[index] = randomPosition();
            });
            setPositions(initialPositions);
      }, []);

      // Randomize x, y positions and rotation to spread them across the screen
    const randomPosition = () => {
          const minOffsetX = -5; // Adjust this value as needed
          const minOffsetY = -24; // Adjust this value as needed
          const maxOffsetX = 76; // Adjust this value as needed
          const maxOffsetY = 10; // Adjust this value as needed

          const x = Math.random() * (maxOffsetX - minOffsetX) + minOffsetX;
          const y = Math.random() * (maxOffsetY - minOffsetY) + minOffsetY;
          const rotate = Math.random() * 30 - 15;

          return { x, y, rotate };
    };

      // Shuffle function to randomize positions and rotations of the photos
      const shufflePhotos = () => {
            const shuffledPositions: { [key: number]: { x: number; y: number; rotate: number } } =
                  {};
            photos.forEach((_, index) => {
                  shuffledPositions[index] = randomPosition();
            });
            setPositions(shuffledPositions);
      };

      // Handle click outside of the photo container to reset active index
      const handleOutsideClick = useCallback((event: MouseEvent) => {
            const gallery = document.querySelector(".gallery");
            if (gallery && !gallery.contains(event.target as Node)) {
                  setActiveIndex(null); // Reset active image when clicked outside
            }
      }, []);

      // Register the event listener when the component mounts and cleanup on unmount
      useEffect(() => {
            document.addEventListener("click", handleOutsideClick);
            return () => {
                  document.removeEventListener("click", handleOutsideClick);
            };
      }, [handleOutsideClick]);

      // Handle drag start and end events
      const handleDragStart = () => {
            setIsDragging(true);
      };

      const handleDragEnd = () => {
            setIsDragging(false);
      };

      return (
            <div className="gallery-container">
                  {/* Shuffle Button */}
                  <button
                        onClick={shufflePhotos}
                        className="shuffle-button"
                  >
                        Shuffle
                  </button>

                  <div className="gallery">
                        {photos.map((photo, index) => {
                              return (
                                    <motion.div
                                          key={index}
                                          className={`polaroid ${photo.orientation}`}
                                          initial={{
                                                rotate: positions[index]?.rotate,
                                                scale: 0.5,
                                                opacity: 0
                                          }}
                                          animate={
                                                activeIndex === index
                                                      ? {
                                                              zIndex: 100,
                                                              scale: 1.5,
                                                              rotate: positions[index]?.rotate,
                                                              opacity: 1
                                                        }
                                                      : {
                                                              opacity: 1,
                                                              scale: 0.5,
                                                              rotate: positions[index]?.rotate
                                                        }
                                          }
                                          onClick={(e) => {
                                                // Prevent triggering the outside click listener
                                                e.stopPropagation();
                                                // Only trigger onClick if not dragging
                                                if (!isDragging) {
                                                      setActiveIndex(
                                                            activeIndex === index ? null : index
                                                      ); // Toggle active image
                                                }
                                          }}
                                          onDragStart={handleDragStart}
                                          onDragEnd={handleDragEnd}
                                          transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 10
                                          }}
                                          style={{
                                                left: `${positions[index]?.x}rem`, // Set random horizontal position
                                                top: `${positions[index]?.y}rem` // Set random vertical position
                                          }}
                                          drag
                                          dragMomentum={false} // Disable momentum to stop the drag from bouncing
                                          dragElastic={0.2} // Control how elastic the drag behavior is
                                    >
                                          <img
                                                src={`/img/${photo.url}`}
                                                alt="Polaroid"
                                                draggable={false} // Prevent dragging on the image itself
                                          />
                                    </motion.div>
                              );
                        })}
                  </div>
            </div>
      );
}

export default App;
