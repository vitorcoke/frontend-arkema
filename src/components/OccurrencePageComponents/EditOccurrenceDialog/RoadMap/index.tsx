import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "../../../../service";
import { Occurrence } from "../../../../types/occurrence.type";
import { RemediaAction } from "../../../../types/remediaAction.type";

type RoadMapProps = {
  nextStep: () => void;
  backStep: () => void;
  occurrence: Occurrence;
};

const RoadMap: React.FC<RoadMapProps> = ({
  nextStep,
  backStep,
  occurrence,
}) => {
  const [remedial_action, setRemedialAction] = useState<RemediaAction>();
  const [w2h, setW2h] = useState({
    who: "",
    what: "",
    where: "",
    when: "",
    why: "",
    how: "",
    how_much: "",
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

  const handleSubimit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (remedial_action?.w2h) {
        await api.patch(`/remedial-action/${remedial_action?._id}`, {
          w2h: remedial_action?.w2h,
        });
        await api.patch(`/occurrence/${occurrence._id}`, {
          step: 3,
        });
        nextStep();
      } else {
        await api.patch(`/remedial-action/${remedial_action?._id}`, {
          w2h: w2h,
        });
        await api.patch(`/occurrence/${occurrence._id}`, {
          step: 3,
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
      {remedial_action?.w2h ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="50%"
          height="75vh"
          p={3}
          gap={3}
        >
          <Typography variant="h3">Road map Analysis</Typography>

          <TextField
            label="What"
            value={remedial_action.w2h.what}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                w2h: {
                  ...remedial_action.w2h,
                  what: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Why"
            value={remedial_action.w2h.why}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                w2h: {
                  ...remedial_action.w2h,
                  why: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Where"
            value={remedial_action.w2h.where}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                w2h: {
                  ...remedial_action.w2h,
                  where: e.target.value,
                },
              })
            }
          />
          <TextField
            label="When"
            value={remedial_action.w2h.when}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                w2h: {
                  ...remedial_action.w2h,
                  when: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Who"
            value={remedial_action.w2h.who}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                w2h: {
                  ...remedial_action.w2h,
                  who: e.target.value,
                },
              })
            }
          />
          <TextField
            label="How"
            value={remedial_action.w2h.how}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                w2h: {
                  ...remedial_action.w2h,
                  how: e.target.value,
                },
              })
            }
          />
          <TextField
            label="How much"
            value={remedial_action.w2h.how_much}
            onChange={(e) =>
              setRemedialAction({
                ...remedial_action,
                w2h: {
                  ...remedial_action.w2h,
                  how_much: e.target.value,
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
          <Typography variant="h3">Road map Analysis</Typography>
          <TextField
            label="What"
            value={w2h.what}
            onChange={(e) => setW2h({ ...w2h, what: e.target.value })}
          />
          <TextField
            label="Why"
            value={w2h.why}
            onChange={(e) => setW2h({ ...w2h, why: e.target.value })}
          />
          <TextField
            label="Where"
            value={w2h.where}
            onChange={(e) => setW2h({ ...w2h, where: e.target.value })}
          />
          <TextField
            label="When"
            value={w2h.when}
            onChange={(e) => setW2h({ ...w2h, when: e.target.value })}
          />
          <TextField
            label="Who"
            value={w2h.who}
            onChange={(e) => setW2h({ ...w2h, who: e.target.value })}
          />
          <TextField
            label="How"
            value={w2h.how}
            onChange={(e) => setW2h({ ...w2h, how: e.target.value })}
          />
          <TextField
            label="How much"
            value={w2h.how_much}
            onChange={(e) => setW2h({ ...w2h, how_much: e.target.value })}
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

export default RoadMap;
