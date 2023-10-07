import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "./utils";

const ShareCreated = () => {
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const value = BASE_URL + "play/" + id;
  return (
    <Box align="center" justify="center">
      <TextField
        sx={{ width: "600px", padding: "10px" }}
        value={value}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <ContentCopyIcon
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    setCopied(true);
                  }}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {copied && (
        <Alert sx={{ width: "570px" }} severity="success">
          Text copied!
        </Alert>
      )}
    </Box>
  );
};

export default ShareCreated;
