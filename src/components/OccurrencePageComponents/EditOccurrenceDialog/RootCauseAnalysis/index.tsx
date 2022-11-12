import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "../../../../service";
import { Occurrence } from "../../../../types/occurrence.type";
import { RemediaAction } from "../../../../types/remediaAction.type";

type RemediaActionProps = {
  nextStep: () => void;
  backStep: () => void;
  occurrence: Occurrence;
};

const RootCauseAnalysis: React.FC<RemediaActionProps> = ({
  nextStep,
  backStep,
  occurrence,
}) => {
  const [remedial_action, setRemedialAction] = useState<RemediaAction>();
  const [whys, setWhys] = useState({
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
  });

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

  console.log(occurrence);

  const handleSubimit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (remedial_action?.five_whys) {
        await api.patch(`/remedial-action/${remedial_action?._id}`, {
          five_whys: remedial_action?.five_whys,
        });
        await api.patch(`/occurrence/${occurrence._id}`, {
          step: 2,
        });
        nextStep();
      } else {
        await api.patch(`/remedial-action/${remedial_action?._id}`, {
          five_whys: whys,
        });
        await api.patch(`/occurrence/${occurrence._id}`, {
          step: 2,
        });
        nextStep();
      }
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
      {remedial_action?.five_whys ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="50%"
          height="75vh"
          p={3}
          gap={3}
        >
          <Typography variant="h3">Root Cause Analysis</Typography>
          <TextField
            label="why1"
            value={remedial_action.five_whys.why1}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                five_whys: {
                  ...remedial_action.five_whys,
                  why1: e.target.value,
                },
              })
            }
          />

          <TextField
            label="why2"
            value={remedial_action.five_whys.why2}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                five_whys: {
                  ...remedial_action.five_whys,
                  why2: e.target.value,
                },
              })
            }
          />
          <TextField
            label="why3"
            value={remedial_action.five_whys.why3}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                five_whys: {
                  ...remedial_action.five_whys,
                  why3: e.target.value,
                },
              })
            }
          />
          <TextField
            label="why4"
            value={remedial_action.five_whys.why4}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                five_whys: {
                  ...remedial_action.five_whys,
                  why4: e.target.value,
                },
              })
            }
          />
          <TextField
            label="why5"
            value={remedial_action.five_whys.why5}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                five_whys: {
                  ...remedial_action.five_whys,
                  why5: e.target.value,
                },
              })
            }
          />
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="50%"
          height="75vh"
          p={3}
          gap={3}
        >
          <Typography variant="h3">Root Cause Analysis</Typography>
          <TextField
            label="why1"
            value={whys.why1}
            onChange={(e) => setWhys({ ...whys, why1: e.target.value })}
          />
          <TextField
            label="why2"
            value={whys.why2}
            onChange={(e) => setWhys({ ...whys, why2: e.target.value })}
          />
          <TextField
            label="why3"
            value={whys.why3}
            onChange={(e) => setWhys({ ...whys, why3: e.target.value })}
          />
          <TextField
            label="why4"
            value={whys.why4}
            onChange={(e) => setWhys({ ...whys, why4: e.target.value })}
          />
          <TextField
            label="why5"
            value={whys.why5}
            onChange={(e) => setWhys({ ...whys, why5: e.target.value })}
          />
        </Box>
      )}
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

export default RootCauseAnalysis;
