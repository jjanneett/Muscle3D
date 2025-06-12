import React, { useState } from "react";
import My3DComponent from "./My3DComponent";
import "./App.css";

const muscleNameKorMap = {
    "Sternocleidomastoid": "흉쇄유돌근",
    "Trapezius": "승모근",
    "Deltoid": "삼각근",
    "Brachioradialis": "상완요골근",
    "Hand": "손",
    "Pectoralis_major": "대흉근",
    "Wrist_extensor_muscle": "손목 폄근",
    "Biceps_brachii": "상완이두근",
    "Triceps_brachii": "상완삼두근",
    "Anterior_abdominal_wall_muscle": "복부 전벽근",
    "Latissimus_dorsi": "광배근",
    "Wrist_flexor_muscle": "손목 굴곡근",
};


function MuscleInfoPanel({ muscleName, muscleInfo }) {
    const [videoIdx, setVideoIdx] = useState(0);

    if (!muscleName) {
        return (
            <div style={{ padding: "2rem", color: "#aaa" }}>
                근육을 클릭하면 정보가 여기에 표시됩니다.
            </div>
        );
    }

    if (!muscleInfo) {
        return (
            <div style={{ padding: "2rem" }}>
                <b>{muscleName}</b> 정보를 불러오는 중...
            </div>
        );
    }

    const videos = muscleInfo.videos || [];
    const multipleVideos = videos.length > 1;

    // 유튜브 임베드 주소 변환 함수
    const getYoutubeEmbedUrl = (url) =>
        url.includes("watch?v=")
            ? url.replace("watch?v=", "embed/")
            : url.replace("youtu.be/", "youtube.com/embed/");

    return (
        <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ marginBottom: "1rem" }}>
                {muscleNameKorMap[muscleInfo.muscle_name] || muscleInfo.muscle_name}
            </h2>

            <h3 style={{ margin: "1rem 0 0.5rem 0" }}>관련 원인 동작</h3>
            <ul>
                {muscleInfo.causes?.map((item, i) => (
                    <li key={i}>{item.description}</li>
                ))}
            </ul>

            <h3 style={{ margin: "1rem 0 0.5rem 0" }}>주요 증상</h3>
            <ul>
                {muscleInfo.symptoms?.map((item, i) => (
                    <li key={i}>{item.description}</li>
                ))}
            </ul>

            {videos.length > 0 && (
                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                    <h3>관련 동영상</h3>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        {multipleVideos && (
                            <button
                                style={{
                                    position: "absolute",
                                    left: -40,
                                    top: "40%",
                                    fontSize: "2rem",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    zIndex: 2,
                                    color: "#888"
                                }}
                                disabled={videoIdx === 0}
                                onClick={() => setVideoIdx((i) => Math.max(i - 1, 0))}
                            >
                                ◀
                            </button>
                        )}
                        <iframe
                            width="100%"
                            height="200"
                            style={{ minWidth: 0, maxWidth: "100%", borderRadius: "12px" }}
                            src={getYoutubeEmbedUrl(videos[videoIdx].url)}
                            title={`YouTube video ${videoIdx + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>

                        {multipleVideos && (
                            <button
                                style={{
                                    position: "absolute",
                                    right: -40,
                                    top: "40%",
                                    fontSize: "2rem",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    zIndex: 2,
                                    color: "#888"
                                }}
                                disabled={videoIdx === videos.length - 1}
                                onClick={() => setVideoIdx((i) => Math.min(i + 1, videos.length - 1))}
                            >
                                ▶
                            </button>
                        )}
                    </div>
                    {/* 인디케이터 */}
                    {multipleVideos && (
                        <div style={{ marginTop: 8 }}>
                            {videos.map((_, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        display: "inline-block",
                                        width: 10,
                                        height: 10,
                                        margin: "0 3px",
                                        borderRadius: "50%",
                                        background: idx === videoIdx ? "#555" : "#ccc"
                                    }}
                                ></span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


function App() {
    const [muscleName, setMuscleName] = useState("");
    const [muscleInfo, setMuscleInfo] = useState(null);

    const handleMuscleClick = (name, info) => {
        setMuscleName(name);
        setMuscleInfo(info);
    };

    return (
        <div className="container">
            <div className="left-panel">
                <div className="overlay-title">Human 3D Model</div>
                <My3DComponent onMuscleClick={handleMuscleClick} />
            </div>
            <div className="right-panel">
                <MuscleInfoPanel muscleName={muscleName} muscleInfo={muscleInfo} />
            </div>

        </div>
    );
}

export default App;

