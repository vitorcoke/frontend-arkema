import { createContext, useContext, useState } from "react";
import { GridRowId } from "@mui/x-data-grid";

type ControllerPagesProviderProps = {
  children: React.ReactNode;
};

type ControllerPagesContextData = {
  openDialogCreateOccurrence: boolean;
  setOpenDialogCreateOccurrence: (value: boolean) => void;
  checkboxAddOccurrence: GridRowId[];
  setCheckboxAddOccurrence: (value: GridRowId[]) => void;
  openDialogEditOccurrence: boolean;
  setOpenDialogEditOccurrence: (value: boolean) => void;
};

const ControllerPagesContext = createContext({} as ControllerPagesContextData);

export const useControllerPagesContext = () => {
  return useContext(ControllerPagesContext);
};

const ControllerPagesProvider: React.FC<ControllerPagesProviderProps> = ({
  children,
}) => {
  const [openDialogCreateOccurrence, setOpenDialogCreateOccurrence] =
    useState(false);

  const [openDialogEditOccurrence, setOpenDialogEditOccurrence] =
    useState(false);

  const [checkboxAddOccurrence, setCheckboxAddOccurrence] = useState<
    GridRowId[]
  >([]);

  return (
    <ControllerPagesContext.Provider
      value={{
        openDialogCreateOccurrence,
        setOpenDialogCreateOccurrence,
        checkboxAddOccurrence,
        setCheckboxAddOccurrence,
        openDialogEditOccurrence,
        setOpenDialogEditOccurrence,
      }}
    >
      {children}
    </ControllerPagesContext.Provider>
  );
};

export default ControllerPagesProvider;
