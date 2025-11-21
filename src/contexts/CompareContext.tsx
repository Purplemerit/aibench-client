import React, { createContext, useContext, useState, ReactNode } from "react";

interface CompareModel {
  id: string;
  rank: number;
  model: string;
  organization: string;
  score: number;
  type: string;
  cost: string;
  license: string;
  released: string;
}

interface CompareContextType {
  compareModels: CompareModel[];
  addModel: (model: CompareModel) => boolean;
  removeModel: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  canAddMore: boolean;
  initializeWithModel: (model: CompareModel) => void;
  replaceModel: (index: number, model: CompareModel) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [compareModels, setCompareModels] = useState<CompareModel[]>([]);

  const addModel = (model: CompareModel): boolean => {
    if (compareModels.length >= 3) {
      return false;
    }
    if (compareModels.some((m) => m.id === model.id)) {
      return false;
    }
    setCompareModels((prev) => [...prev, model]);
    return true;
  };

  const removeModel = (id: string) => {
    setCompareModels((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAll = () => {
    setCompareModels([]);
  };

  const isSelected = (id: string): boolean => {
    return compareModels.some((m) => m.id === id);
  };

  const canAddMore = compareModels.length < 3;

  const initializeWithModel = (model: CompareModel) => {
    setCompareModels([model]);
  };

  const replaceModel = (index: number, model: CompareModel) => {
    setCompareModels((prev) => {
      const newModels = [...prev];
      newModels[index] = model;
      return newModels;
    });
  };

  return (
    <CompareContext.Provider
      value={{
        compareModels,
        addModel,
        removeModel,
        clearAll,
        isSelected,
        canAddMore,
        initializeWithModel,
        replaceModel,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
};
