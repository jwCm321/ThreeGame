// RigidBody.jsx
import React from 'react';
import { IcosahedronGeometry } from 'three';
import {  useRapier,RigidBody } from '@react-three/rapier'
import { useState, useEffect, useRef } from 'react'

const RigidBodyWithGeometry = (props) => {
  const { ...otherProps } = props;
  const body = useRef()
  return (
    <RigidBody
      canSleep={false}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};

export default RigidBodyWithGeometry;