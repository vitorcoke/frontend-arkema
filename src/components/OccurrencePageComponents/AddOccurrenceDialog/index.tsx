import {
  Alert,
  Box,
  Button,
  Dialog,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { CloudUploadRounded } from "@mui/icons-material";
import { useState } from "react";
import { useControllerPagesContext } from "../../../contexts/ControllerPagesContext";
import { api } from "../../../service";
import { Occurrence } from "../../../types/occurrence.type";
import { convertToBase64 } from "../../../utils/base64";

type AddOccurrenceDialogProps = {
  setOccurrence: React.Dispatch<React.SetStateAction<Occurrence[]>>;
};

const AddOccurrenceDialog: React.FC<AddOccurrenceDialogProps> = ({
  setOccurrence,
}) => {
  const { openDialogCreateOccurrence, setOpenDialogCreateOccurrence } =
    useControllerPagesContext();

  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);

  const [type_occurrence, setTypeOcurrence] = useState("");
  const [client, setClient] = useState("");
  const [type_client, setTypeClient] = useState("");
  const [name_client, setNameClient] = useState("");
  const [description, setDescription] = useState("");
  const [type_document, setTypeDocument] = useState("");
  const [document, setDocument] = useState("");
  const [action, setAction] = useState("");
  const [evidence, setEvidence] = useState<File[]>([]);

  const handleCloseDialog = () => {
    setOpenDialogCreateOccurrence(false);
  };

  const handleCloseAlertSuccess = () => {
    setOpenAlertSuccess(false);
  };

  const handleCloseAlertError = () => {
    setOpenAlertError(false);
  };

  const handleImgEvidence = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file && file.type.includes("image")) {
          let url = window.URL || window.webkitURL;
          let objectUrl = url.createObjectURL(file);
          let img = new Image();
          img.src = objectUrl;
          img.onload = () => {
            if (img.width > 100 && img.height > 100) {
              setEvidence((prev) => [...prev, file]);
            } else {
              alert("A imagem deve ter no mínimo 100x100");
            }
          };
        } else {
          alert("O arquivo deve ser uma imagem");
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formatBase64 = evidence ? await convertToBase64(evidence) : null;

    try {
      const newOccurrence = await api.post("/occurrence", {
        type_occurrence,
        client,
        type_client,
        name_client,
        description,
        type_document,
        document,
        action,
        evidence: formatBase64,
        step: 0,
      });
      setOccurrence((old) => [...old, newOccurrence.data]);
      setOpenAlertSuccess(true);
    } catch {
      setOpenAlertError(true);
    }
  };

  return (
    <Dialog
      open={openDialogCreateOccurrence}
      maxWidth={"md"}
      onClose={handleCloseDialog}
    >
      <Box p={5} component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl required fullWidth>
              <InputLabel>Type of occurrence</InputLabel>
              <Select
                label="Type of occurrence"
                value={type_occurrence}
                onChange={(e) => setTypeOcurrence(e.target.value as string)}
              >
                <MenuItem value={1}>Erros de emissão de pedido</MenuItem>
                <MenuItem value={2}>Atraso na entrega</MenuItem>
                <MenuItem value={3}>Produto fora de especificação</MenuItem>
                <MenuItem value={4}>Embalagem avariada </MenuItem>
                <MenuItem value={5}>Falta de certificado</MenuItem>
                <MenuItem value={6}>Produto trocado</MenuItem>
                <MenuItem value={7}>Produto a mais/menos</MenuItem>
                <MenuItem value={8}>
                  Separação de produto vencido enviado ao cliente
                </MenuItem>
                <MenuItem value={9}>
                  Problemas com transportadoras/armazém
                </MenuItem>
                <MenuItem value={10}>DI</MenuItem>
                <MenuItem value={11}>Lacre</MenuItem>
                <MenuItem value={12}>NCM</MenuItem>
                <MenuItem value={13}>Peso</MenuItem>
                <MenuItem value={14}>Problemas na importação</MenuItem>
                <MenuItem value={15}>Outros</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              border="1px solid"
              borderColor="#28285f"
              p={3}
              borderRadius="8px "
              gap={2}
            >
              <FormControl required sx={{ width: "20rem" }}>
                <InputLabel>Customer</InputLabel>
                <Select
                  label="Customer"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                >
                  <MenuItem value={"Customer"}>Customer</MenuItem>
                  <MenuItem value={"Supplier"}>Supplier</MenuItem>
                </Select>
              </FormControl>
              <FormControl required disabled={!client} sx={{ width: "20rem" }}>
                <InputLabel>Client Type</InputLabel>
                <Select
                  label="Client Type"
                  value={type_client}
                  onChange={(e) => setTypeClient(e.target.value)}
                >
                  <MenuItem value={"Internal"}>Internal</MenuItem>
                  <MenuItem value={"External"}>External</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                disabled={!client || !type_client}
                fullWidth
                label="Name"
                onChange={(e) => setNameClient(e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              label="Description"
              multiline
              fullWidth
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              border="1px solid"
              borderColor="#28285f"
              p={3}
              borderRadius="8px "
              gap={2}
            >
              <FormControl required fullWidth>
                <InputLabel>Document</InputLabel>
                <Select
                  label="Document"
                  value={type_document}
                  onChange={(e) => setTypeDocument(e.target.value)}
                >
                  <MenuItem value={"PO"}>PO</MenuItem>
                  <MenuItem value={"BATCH"}>BATCH</MenuItem>
                  <MenuItem value={"INVOICE"}>INVOICE</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                disabled={!type_document}
                label="Document Number"
                fullWidth
                onChange={(e) => setDocument(e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              label="Immediate action"
              fullWidth
              onChange={(e) => setAction(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              endIcon={<CloudUploadRounded />}
            >
              Upload evidence
              <input
                hidden
                accept="image/*"
                type="file"
                multiple
                onChange={handleImgEvidence}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ marginTop: "20px" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          open={openAlertSuccess}
          onClose={handleCloseAlertSuccess}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <Alert severity="success">Sent with success</Alert>
        </Snackbar>
        <Snackbar
          open={openAlertError}
          onClose={handleCloseAlertError}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <Alert severity="error">Error</Alert>
        </Snackbar>
      </Box>
    </Dialog>
  );
};

export default AddOccurrenceDialog;
