import { Box, Button, Paper, Typography } from "@mui/material";
import { Add, DeleteRounded, Edit } from "@mui/icons-material";
import { useControllerPagesContext } from "../../contexts/ControllerPagesContext";
import { api } from "../../service";
import { Occurrence } from "../../types/occurrence.type";
import { produce } from "immer";

type BaseLayoutProps = {
  children: React.ReactNode;
  title: string;
  setOccurrence?: React.Dispatch<React.SetStateAction<Occurrence[]>>;
};

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  title,
  setOccurrence,
}) => {
  const {
    setOpenDialogCreateOccurrence,
    setOpenDialogEditOccurrence,
    checkboxAddOccurrence,
  } = useControllerPagesContext();

  const handleDeleteOccurrence = () => {
    try {
      checkboxAddOccurrence.map(async (id) => {
        await api.delete(`/occurrence/${id}`);
        await api.delete(`/remedial-action/${id}`);
        setOccurrence &&
          setOccurrence((prev) =>
            produce(prev, (draft) => {
              const index = draft.findIndex(
                (occurrence) => occurrence._id === id
              );
              draft.splice(index, 1);
            })
          );
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Box>
        <Typography variant="h3">{title}</Typography>
      </Box>
      <Box component={Paper} p={1.5} display="flex" gap={3}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialogCreateOccurrence(true)}
        >
          New
        </Button>
        {checkboxAddOccurrence.length > 0 && (
          <>
            <Button
              variant="contained"
              startIcon={<DeleteRounded />}
              onClick={handleDeleteOccurrence}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setOpenDialogEditOccurrence(true)}
            >
              Edit
            </Button>
          </>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default BaseLayout;
