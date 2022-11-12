import {
  AppBar,
  Box,
  Dialog,
  IconButton,
  Slide,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { useControllerPagesContext } from "../../../contexts/ControllerPagesContext";
import { TransitionProps } from "@mui/material/transitions";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Occurrence } from "../../../types/occurrence.type";
import { User } from "../../../types/user.type";
import AnalysisOfTheOccurrence from "./AnalysisOfTheOccurrence";
import RootCauseAnalysis from "./RootCauseAnalysis";
import RoadMap from "./RoadMap";
import { RemediaAction } from "../../../types/remediaAction.type";
import { api } from "../../../service";
import VerificationOfEffectiveness from "./VerificationOfEffectiveness";

type EditOccurrenceDialogProps = {
  occurrence: Occurrence;
  users: User[];
  setOccurrence: Dispatch<SetStateAction<Occurrence | undefined>>;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditOccurrenceDialgo: React.FC<EditOccurrenceDialogProps> = ({
  occurrence,
  users,
  setOccurrence,
}) => {
  const { openDialogEditOccurrence, setOpenDialogEditOccurrence } =
    useControllerPagesContext();

  const [activeStep, setActiveStep] = useState(0);

  const handleCloseDialog = () => {
    setOpenDialogEditOccurrence(false);
    setActiveStep(occurrence.step);
  };

  const nextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const backStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    setActiveStep(occurrence.step);
  }, [openDialogEditOccurrence]);

  return (
    <Dialog
      fullScreen
      open={openDialogEditOccurrence}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
    >
      <AppBar>
        <Toolbar>
          <IconButton onClick={handleCloseDialog}>
            <CloseRounded />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box display="flex" flexDirection="column" gap={3} mt={5}>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Occurrence verification</StepLabel>
          </Step>
          <Step>
            <StepLabel>Root cause analysis</StepLabel>
          </Step>
          <Step>
            <StepLabel>Road map</StepLabel>
          </Step>
          <Step>
            <StepLabel>Verification of effectiveness</StepLabel>
          </Step>
          <Step>
            <StepLabel>Standardization</StepLabel>
          </Step>
        </Stepper>
      </Box>
      {activeStep === 0 && (
        <AnalysisOfTheOccurrence
          occurrence={occurrence}
          users={users}
          nextStep={nextStep}
          setOccurrence={setOccurrence}
        />
      )}
      {activeStep === 1 && (
        <RootCauseAnalysis
          nextStep={nextStep}
          backStep={backStep}
          occurrence={occurrence}
        />
      )}

      {activeStep === 2 && (
        <RoadMap
          nextStep={nextStep}
          backStep={backStep}
          occurrence={occurrence}
        />
      )}

      {activeStep === 3 && (
        <VerificationOfEffectiveness
          nextStep={nextStep}
          backStep={backStep}
          occurrence={occurrence}
        />
      )}
    </Dialog>
  );
};

export default EditOccurrenceDialgo;
