import NavPage from "../layout/NavPage";
import { Box } from "@mui/material";
import { Chart } from "react-google-charts";

const Dashboard = () => {
  const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
  ];

  const options = {
    title: "My Daily Activities",
    is3D: true,
  };

  return (
    <NavPage>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width="100%"
        height="400px"
      />
    </NavPage>
  );
};

export default Dashboard;
