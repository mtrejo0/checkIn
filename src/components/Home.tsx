import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import GetData from "./GetData";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Home() {
  const [value, setValue] = useState(0);

  const form = (
    <iframe
      title="form"
      src="https://docs.google.com/forms/d/e/1FAIpQLSeFuJS3RXD94spL-5nlXSjbtfGquamZ75sdVz69SJCRgp340A/viewform?embedded=true"
      width="100%"
      height="772"
    >
      Loading…
    </iframe>
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Form" />
          <Tab label="Results!" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {form}
        <h1>Click "Results" after submitting this form!</h1>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GetData />
      </TabPanel>
    </Box>
  );
}
