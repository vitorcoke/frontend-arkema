import {
  Alert,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useControllerPagesContext } from "../../../../contexts/ControllerPagesContext";
import { TransitionProps } from "@mui/material/transitions";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "../../../../service";
import { Occurrence } from "../../../../types/occurrence.type";
import { User } from "../../../../types/user.type";
import Carousel from "react-bootstrap/Carousel";
import { set } from "immer/dist/internal";

type AnalysisOfTheOccurrenceProps = {
  occurrence: Occurrence;
  users: User[];
  nextStep: () => void;
  setOccurrence: Dispatch<SetStateAction<Occurrence | undefined>>;
};

const AnalysisOfTheOccurrence: React.FC<AnalysisOfTheOccurrenceProps> = ({
  occurrence,
  users,
  nextStep,
  setOccurrence,
}) => {
  const { setOpenDialogEditOccurrence } = useControllerPagesContext();

  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);

  const handleCloseAlertSuccess = () => {
    setOpenAlertSuccess(false);
  };

  const handleCloseAlertError = () => {
    setOpenAlertError(false);
  };

  const handleSubimit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newAction = await api.post("remedial-action", {
        occurrence_id: occurrence._id,
        description_problem: occurrence.type_occurrence,
        responsible_id: occurrence.responsible_id,
      });
      await api.patch(`/occurrence/${occurrence._id}`, {
        type_analysis: occurrence.type_analysis,
        status: occurrence.status,
        responsible_id: occurrence.responsible_id,
        remedial_action_id: newAction.data._id,
        step: 1,
      });

      nextStep();
    } catch {
      console.log("error");
    }
  };

  const handleStatusObservation = async () => {
    try {
      await api.patch(`/occurrence/${occurrence._id}`, {
        status: occurrence.status,
      });
      setOpenDialogEditOccurrence(false);
    } catch {
      console.log("error");
    }
  };

  const handleSendEmail = async () => {
    try {
      await api.post("occurrence/send-email", {
        occurrence_id: occurrence._id,
        responsible_id: occurrence.responsible_id,
      });
      setOpenAlertSuccess(true);
    } catch {
      setOpenAlertError(true);
    }
  };

  return (
    <Box display="flex" gap={5} p={3}>
      <Box
        display="flex"
        flexDirection="column"
        component={Paper}
        p={3}
        width="50%"
        height="75vh"
        gap={2}
      >
        <Typography variant="h5">Occurrence selected</Typography>
        <Typography variant="body1">
          <b>Type Occurrence</b> : {occurrence.type_occurrence}
        </Typography>
        <Typography variant="body1">
          <b>Type Client</b> : {occurrence.type_client}
        </Typography>
        <Typography variant="body1">
          <b>Client Name</b> : {occurrence.name_client}
        </Typography>
        <Typography variant="body1">
          <b>Customer/Supplier</b> : {occurrence.client}
        </Typography>
        <Typography variant="body1">
          <b>Description</b> : {occurrence.description}
        </Typography>
        <Typography variant="body1">
          <b>Type Document</b> : {occurrence.type_document}
        </Typography>
        <Typography variant="body1">
          <b>Number Document</b> : {occurrence.document}
        </Typography>
        <Typography variant="body1">
          <b>Immediate Action</b> : {occurrence.action}
        </Typography>

        {occurrence.evidence.length > 0 && (
          <Box width="80%">
            <Carousel variant="dark">
              {occurrence.evidence.map((evidence, index) => (
                <Carousel.Item key={index}>
                  <Box
                    component="img"
                    src={evidence}
                    width="100%"
                    height="15rem"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Box>
        )}
      </Box>
      <Box
        component={Paper}
        display="flex"
        flexDirection="column"
        width="50%"
        p={3}
      >
        <Typography variant="h3">Analysis of the occurrence</Typography>
        <Box
          component={"form"}
          onSubmit={handleSubimit}
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <Box
            width="100%"
            height="30vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            p={3}
          >
            <FormControl fullWidth>
              <InputLabel>Types analysis</InputLabel>
              <Select
                required
                value={occurrence.type_analysis ? occurrence.type_analysis : ""}
                label="Types analysis"
                onChange={(e) =>
                  setOccurrence({
                    ...occurrence,
                    type_analysis: e.target.value as string,
                  })
                }
              >
                <MenuItem value="Non-compliance">Non-compliance </MenuItem>
                <MenuItem value="Occurrence">Occurrence</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                required
                value={occurrence.status ? occurrence.status : ""}
                label="Status"
                onChange={(e) =>
                  setOccurrence({
                    ...occurrence,
                    status: e.target.value as string,
                  })
                }
              >
                <MenuItem value="Action plan">Action plan</MenuItem>
                <MenuItem value="Observation">Observation</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box p={3}>
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name}
              value={users.filter((user) =>
                occurrence.responsible_id.includes(user._id)
              )}
              onChange={(_, value) =>
                setOccurrence({
                  ...occurrence,
                  responsible_id: value.map((user) => user._id),
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Responsible" />
              )}
            />
          </Box>
          <Box
            width="100%"
            display="flex"
            flex={1}
            justifyContent="space-between"
            alignItems="end"
          >
            <Button
              disabled={occurrence.responsible_id.length === 0}
              variant="contained"
              onClick={handleSendEmail}
            >
              Send email
            </Button>
            {occurrence.status === "Observation" && (
              <Button variant="contained" onClick={handleStatusObservation}>
                Observation
              </Button>
            )}
            {occurrence.status === "Action plan" && (
              <Button variant="contained" type="submit">
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openAlertSuccess}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={handleCloseAlertSuccess}
        autoHideDuration={3000}
      >
        <Alert severity="success">Sent with success</Alert>
      </Snackbar>
      <Snackbar
        open={openAlertError}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={handleCloseAlertError}
        autoHideDuration={3000}
      >
        <Alert severity="error">failed to send</Alert>
      </Snackbar>
    </Box>
  );
};

export default AnalysisOfTheOccurrence;
