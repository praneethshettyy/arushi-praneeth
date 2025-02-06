import { useState, useEffect, useRef } from "react";
import {
    Heart,
    Calendar,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Music,
    Volume2,
    VolumeX,
} from "lucide-react";
import "./MemoryTimeline.css";
import memories from "./data/memories";

const MemoryTimeline = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    const songs = [
        {
            title: "Perfect - Ed Sheeran",
            url: "public/music/sample.mp3",
        },
        {
            title: "Can't Help Falling in Love - Elvis Presley",
            url: "public/music/sample.mp3",
        },
        {
            title: "I'm Yours - Jason Mraz",
            url: "public/music/sample.mp3",
        },
    ];

    // const memories = [
    //     {
    //         date: "January 15, 2023",
    //         title: "The Day We Met",
    //         description:
    //             "That magical moment at the coffee shop when you spilled your latte and I offered my napkin.",
    //         location: "Sunny Side Café",
    //         image: "https://static.desygner.com/wp-content/uploads/sites/13/2022/05/04141642/Free-Stock-Photos-01.jpg",
    //     },
    //     {
    //         date: "February 14, 2023",
    //         title: "First Valentine's Day",
    //         description:
    //             "Our picnic in the park. You brought strawberries, I brought chocolate, and it started raining!",
    //         location: "Central Park",
    //         image: "https://via.placeholder.com/600x400",
    //     },
    //     {
    //         date: "March 20, 2023",
    //         title: "Our First Road Trip",
    //         description:
    //             "Getting lost was the best part - finding that amazing small town diner made it all worth it.",
    //         location: "Coastal Highway",
    //         image: "https://via.placeholder.com/600x400",
    //     },
    // ];

    // Handle auto-play slideshow
    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                goToNext();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isPlaying, memories.length]);

    // Handle music playback and looping
    useEffect(() => {
        const audio = audioRef.current;

        const handleSongEnd = () => {
            setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
        };

        if (audio) {
            audio.addEventListener("ended", handleSongEnd);

            // Start playing when component mounts
            audio.play().catch((error) => {
                console.log("Auto-play prevented:", error);
            });
        }

        return () => {
            if (audio) {
                audio.removeEventListener("ended", handleSongEnd);
            }
        };
    }, [songs.length]);

    // Update audio source when song changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.src = songs[currentSongIndex].url;
            audio.load(); // Ensure new song loads correctly
            if (!isMuted) {
                audio.play().catch((error) => {
                    console.log("Playback failed:", error);
                });
            }
        }
    }, [currentSongIndex, songs]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const goToNext = () => {
        setCurrentIndex((prev) => {
            const newIndex = (prev + 1) % memories.length;
            setCurrentSongIndex((prevSong) => (prevSong + 1) % songs.length); // Change song
            return newIndex;
        });
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => {
            const newIndex = (prev - 1 + memories.length) % memories.length;
            setCurrentSongIndex(
                (prevSong) => (prevSong - 1 + songs.length) % songs.length
            ); // Change song
            return newIndex;
        });
    };

    return (
        <div className="timeline">
            <header className="header">
                <h1>Happy Birthday, My Love! 🎂</h1>
                <p className="subtitle">
                    A Journey Through Our Beautiful Memories
                </p>
                <p className="love-text">
                    Made with <Heart className="heart-icon" /> for your special
                    day
                </p>
                <div className="now-playing">
                    <Music className="icon" />
                    <span>Now Playing: {songs[currentSongIndex].title}</span>
                    <button className="mute-button" onClick={toggleMute}>
                        {isMuted ? (
                            <VolumeX size={20} />
                        ) : (
                            <Volume2 size={20} />
                        )}
                    </button>
                </div>
            </header>

            <div className="memory-card">
                <div className="memory-content">
                    <div className="image-section">
                        <img
                            src={memories[currentIndex].image}
                            alt={memories[currentIndex].title}
                            className="memory-image"
                        />
                        <div className="memory-number">
                            Memory #{currentIndex + 1}
                        </div>
                    </div>

                    <div className="details-section">
                        <div className="date">
                            <Calendar className="icon" />
                            <span>{memories[currentIndex].date}</span>
                        </div>

                        <h2 className="title">
                            {memories[currentIndex].title}
                        </h2>
                        <p className="description">
                            {memories[currentIndex].description}
                        </p>

                        <div className="location">
                            <MapPin className="icon" />
                            <span>{memories[currentIndex].location}</span>
                        </div>
                    </div>
                </div>

                <button className="nav-button prev" onClick={goToPrevious}>
                    <ChevronLeft />
                </button>
                <button className="nav-button next" onClick={goToNext}>
                    <ChevronRight />
                </button>

                <div className="controls">
                    <div className="dots">
                        {memories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`dot ${
                                    currentIndex === index ? "active" : ""
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        className={`autoplay-button ${
                            isPlaying ? "playing" : ""
                        }`}
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? "Pause" : "Auto-play"}
                    </button>
                </div>

                <audio ref={audioRef} src={songs[currentSongIndex].url} />
            </div>
        </div>
    );
};

export default MemoryTimeline;
