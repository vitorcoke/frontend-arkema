import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useControllerPagesContext } from "../contexts/ControllerPagesContext";
import { api, getApiClient } from "../service";
import { Occurrence } from "../types/occurrence.type";
import { User } from "../types/user.type";
import BaseLayout from "../layout/BaseLayout";
import NavPage from "../layout/NavPage";
import AddOccurrenceDialog from "../components/OccurrencePageComponents/AddOccurrenceDialog";
import EditOccurrenceDialgo from "../components/OccurrencePageComponents/EditOccurrenceDialog";

type OccurrencePageProps = {
  initialOccurrence: Occurrence[];
  initialUsers: User[];
};

const Occurrence: React.FC<OccurrencePageProps> = ({
  initialOccurrence,
  initialUsers,
}) => {
  const { checkboxAddOccurrence, setCheckboxAddOccurrence } =
    useControllerPagesContext();
  const [occurrence, setOccurrence] = useState(initialOccurrence);
  const [users, setUsers] = useState(initialUsers);
  const [editOccurrence, setEditOccurrence] = useState<Occurrence>();

  const typeOccurence = [
    { value: "1", label: "Erros de emissão de pedido" },
    { value: "2", label: "Atraso na entrega" },
    { value: "3", label: "Produto fora de especificação" },
    { value: "4", label: "Embalagem avariada" },
    { value: "5", label: "Falta de certificado" },
    { value: "6", label: "Produto trocado" },
    { value: "7", label: "Produto a mais/menos" },
    { value: "8", label: "Separação de produto vencido enviado ao cliente" },
    { value: "9", label: "Problemas com transportadoras/armazém" },
    { value: "10", label: "DI" },
    { value: "11", label: "Lacre" },
    { value: "12", label: "NCM" },
    { value: "13", label: "Peso" },
    { value: "14", label: "Problemas na importação" },
    { value: "15", label: "Outros" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "client", headerName: "Customer/Supplier", flex: 1 },
    { field: "type_occurrence", headerName: "Type Occurrence", flex: 1 },
    { field: "document", headerName: "Document", flex: 1 },
  ];

  useEffect(() => {
    api.get<Occurrence[]>("/occurrence").then((response) => {
      setOccurrence(response.data);
    });
  }, [checkboxAddOccurrence]);

  const rows = occurrence.map((occurrence) => ({
    id: occurrence._id,
    _id: occurrence._id,
    client: occurrence.client,
    type_occurrence: typeOccurence.find(
      (type) => type.value === occurrence.type_occurrence
    )?.label,
    name_client: occurrence.name_client,
    type_client: occurrence.type_client,
    description: occurrence.description,
    type_document: occurrence.type_document,
    document: occurrence.document,
    action: occurrence.action,
    responsible_id: occurrence.responsible_id,
    evidence: occurrence.evidence,
    status: occurrence.status,
    type_analysis: occurrence.type_analysis,
    remedial_action_id: occurrence.remedial_action_id,
    step: occurrence.step,
  }));

  return (
    <NavPage>
      <BaseLayout title="Occurrence" setOccurrence={setOccurrence}>
        <Box width="100%" height="60vh">
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            checkboxSelection
            onSelectionModelChange={(newSelection) => {
              setCheckboxAddOccurrence(newSelection);
            }}
            onCellClick={(cell) => {
              setEditOccurrence(cell.row as Occurrence);
            }}
          />
          <AddOccurrenceDialog setOccurrence={setOccurrence} />
          {editOccurrence && (
            <EditOccurrenceDialgo
              occurrence={editOccurrence}
              users={users}
              setOccurrence={setEditOccurrence}
            />
          )}
        </Box>
      </BaseLayout>
    </NavPage>
  );
};

export default Occurrence;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const api = getApiClient(ctx);
  try {
    const occurrence = await api.get<Occurrence[]>("/occurrence");
    const users = await api.get<User>("/user");
    return {
      props: {
        initialOccurrence: occurrence.data,
        initialUsers: users.data,
      },
    };
  } catch {
    return {
      props: {
        initialOccurrence: [],
        initialUsers: [],
      },
    };
  }
};
