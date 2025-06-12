import React, { useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";

function flattenMeshes(obj, arr = []) {
    if (obj.type === "Mesh") arr.push(obj);
    if (obj.children && obj.children.length > 0)
        obj.children.forEach(child => flattenMeshes(child, arr));
    return arr;
}

const API_URL = import.meta.env.VITE_API_URL;

function My3DComponent({ onMuscleClick }) {
    const gltf = useLoader(GLTFLoader, "/3d/man.glb");
    const meshes = flattenMeshes(gltf.scene);

    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(null);

    return (
        <Canvas camera={{ position: [0, -50, 40], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />
            <group>
                {meshes.map(mesh => {
                    const isObject = mesh.name && mesh.name.includes("Object");
                    const isSelectable = mesh.name && !isObject;

                    // 렌더는 항상 한다!
                    return (
                        <mesh
                            key={mesh.uuid}
                            geometry={mesh.geometry}
                            position={mesh.position}
                            rotation={mesh.rotation}
                            scale={mesh.scale}
                            // 이벤트: Object 영역이 아니어야 동작!
                            onPointerOver={
                                isSelectable
                                    ? e => {
                                        e.stopPropagation();
                                        setHovered(mesh.uuid);
                                    }
                                    : undefined
                            }
                            onPointerOut={
                                isSelectable
                                    ? e => {
                                        e.stopPropagation();
                                        setHovered(null);
                                    }
                                    : undefined
                            }
                            onClick={
                                isSelectable
                                    ? e => {
                                        e.stopPropagation();
                                        setSelected(mesh.uuid);
                                        fetch(`${API_URL}/api/muscles/${mesh.name}`)
                                            .then(res => res.json())
                                            .then(data => {
                                                if (onMuscleClick) onMuscleClick(mesh.name, data);
                                            });
                                    }
                                    : undefined
                            }
                            // 커서 스타일 변경: 선택 가능한 영역만 pointer
                            style={{
                                cursor: isSelectable ? "pointer" : "default",
                            }}
                        >
                            <meshStandardMaterial
                                attach="material"
                                color={
                                    isSelectable &&
                                    (hovered === mesh.uuid || selected === mesh.uuid)
                                        ? "red"
                                        : mesh.material.color
                                }
                            />
                        </mesh>
                    );
                })}
            </group>
            <OrbitControls />
        </Canvas>
    );
}

export default My3DComponent;
