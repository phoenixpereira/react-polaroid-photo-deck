import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
    const [folders, setFolders] = useState<string[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>("");
    const [numImages, setNumImages] = useState<number>(10);
    const isDragging = useRef(false);
    const galleryRef = useRef<HTMLDivElement>(null);

    // Load photos data and set initial positions
    useEffect(() => {
        setFolders([...new Set(photosData.map(photo => photo.folder))]);
        setSelectedFolder([...new Set(photosData.map(photo => photo.folder))][0]);
    }, []);

    const filteredPhotos = useMemo(() => {
        return photosData.filter(photo => photo.folder === selectedFolder);
    }, [selectedFolder]);

    const shuffledPhotos = useMemo(() => {
        return [...filteredPhotos].map(photo => ({
            ...photo,
            orientation: photo.orientation as "portrait" | "landscape"
        })).sort(() => 0.5 - Math.random()).slice(0, numImages); // Use numImages state
    }, [filteredPhotos, numImages]);

    useEffect(() => {
        if (selectedFolder) {
            setPhotos(shuffledPhotos);
            const initialPositions: { [key: number]: { x: number; y: number; rotate: number } } = {};
            shuffledPhotos.forEach((_, index) => {
                initialPositions[index] = randomPosition();
            });
            setPositions(initialPositions);
        }
    }, [selectedFolder, shuffledPhotos]);

    // Randomise x, y positions and rotation to spread them across the screen
    const randomPosition = () => {
        const minOffsetX = -5;
        const minOffsetY = -24;
        const maxOffsetX = window.innerWidth / 16 - 18;
        const maxOffsetY = window.innerHeight / 16 - 40;

        const x = Math.random() * (maxOffsetX - minOffsetX) + minOffsetX;
        const y = Math.random() * (maxOffsetY - minOffsetY) + minOffsetY;
        const rotate = Math.random() * 30 - 15;

        return { x, y, rotate };
    };

    // Shuffle function to randomise positions and rotations of the photos
    const shufflePhotos = () => {
        const filteredPhotos = photosData.filter(photo => photo.folder === selectedFolder);
        const allShuffledPhotos = [...filteredPhotos]
            .map(photo => ({
                ...photo,
                orientation: photo.orientation as "portrait" | "landscape"
            }))
            .sort(() => 0.5 - Math.random())
            .slice(0, numImages);

        setPhotos(allShuffledPhotos);

        const shuffledPositions: { [key: number]: { x: number; y: number; rotate: number } } = {};
        allShuffledPhotos.forEach((_, index) => {
            shuffledPositions[index] = randomPosition();
        });

        setPositions(shuffledPositions);
    };

    // Handle click outside of the photo container to reset active index
    const handleOutsideClick = useCallback((event: MouseEvent) => {
        if (galleryRef.current && !galleryRef.current.contains(event.target as Node)) {
            setActiveIndex(null);
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
        isDragging.current = true;
    };

    const handleDragEnd = () => {
        isDragging.current = false;
    };

    return (
        <div className="gallery-container">
            <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="folder-select"
            >
                {folders.map((folder) => (
                    <option key={folder} value={folder}>
                        {folder
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                    </option>
                ))}
            </select>

            <select
                value={numImages}
                onChange={(e) => setNumImages(Number(e.target.value))}
                className="num-images-select"
            >
                {[10, 20, 30, 40, 50].map((num) => (
                    <option key={num} value={num}>
                        {num} Images
                    </option>
                ))}
            </select>

            <button
                onClick={shufflePhotos}
                className="shuffle-button"
            >
                Shuffle
            </button>

            <div className="gallery" ref={galleryRef}>
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
                                if (!isDragging.current) {
                                    setActiveIndex(
                                        activeIndex === index ? null : index
                                    ); 
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
                                left: `${positions[index]?.x}rem`,
                                top: `${positions[index]?.y}rem`
                            }}
                            drag
                            dragMomentum={false}
                            dragElastic={0.2}
                        >
                            <img
                                src={`/img/${selectedFolder}/${photo.url}`}
                                draggable={false}
                                loading="lazy"
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
