import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../../../../service";
import { Occurrence } from "../../../../types/occurrence.type";
import { RemediaAction } from "../../../../types/remediaAction.type";

type VerificationOfEffectivenessProps = {
  nextStep: () => void;
  backStep: () => void;
  occurrence: Occurrence;
};

const VerificationOfEffectiveness: React.FC<
  VerificationOfEffectivenessProps
> = ({ nextStep, backStep, occurrence }) => {
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  const [remedial_action, setRemedialAction] = useState<RemediaAction>();

  useEffect(() => {
    const getRemedialAction = async () => {
      try {
        const remedialAction = await api.get(
          `/remedial-action/occurrence/${occurrence._id}`
        );
        setRemedialAction(remedialAction.data);
      } catch {
        setRemedialAction(undefined);
      }
    };
    getRemedialAction();
  }, []);

  const handleSubimit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.patch(`/remedial-action/${remedial_action?._id}`, {
        effectiveness: {
          status: status,
          description: description,
        },
      });
      await api.patch(`/occurrence/${occurrence._id}`, {
        step: 4,
      });
      nextStep();
    } catch {
      console.log("error");
    }
  };

  return (
    <Box
      component={"form"}
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      onSubmit={handleSubimit}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="50%"
        height="75vh"
        p={3}
        gap={3}
      >
        <Typography>Effective of action</Typography>
        <Box border="0.5px solid black" />
        <FormControl>
          <RadioGroup
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <FormControlLabel
              value="Effective"
              control={<Radio />}
              label="Effective"
            />
            <FormControlLabel
              value="No effective"
              control={<Radio />}
              label="No effective"
            />
          </RadioGroup>
        </FormControl>
        <Typography>Comment:</Typography>
        <TextField
          required
          multiline
          placeholder="Comment"
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>
      <Box
        width="100%"
        display="flex"
        flex={1}
        justifyContent="space-between"
        alignItems="center"
        px={5}
      >
        <Button variant="contained" onClick={() => backStep()}>
          Back
        </Button>
        <Button variant="contained" type="submit">
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default VerificationOfEffectiveness;
