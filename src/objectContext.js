// ObjectContext.js
import React, { createContext, useContext } from 'react';
import RigidBodyWithGeometry from './RigidBody';

const ObjectContext = createContext();

export const ObjectProvider = ({ children }) => {
  // Initialize the object in the context provider
  const obj2 = <RigidBodyWithGeometry /* additional props */ />;

  return <ObjectContext.Provider value={obj2}>{children}</ObjectContext.Provider>;
};

export const useObject = () => {
  return useContext(ObjectContext);
};
