import { TimelineConnector } from "@mui/lab";
import { Box, Radio, Stack, Typography, useTheme } from "@mui/material";
import { formatCurrency } from "../helper/format-currency";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useContext, useEffect, useState } from "react";
import { AmountContext } from "../context/amount-provider";
import { useLocation } from "react-router-dom";
import { StorageService } from "../helper/local-storage";
import { CalcCetFee } from "../helper/calc-cet-fee";

export function TimeLinePayment() {
  const theme = useTheme();
  const location = useLocation();
  const { selectedAmount, selectedInstallment, cetFee } =
    useContext(AmountContext);
  const [newInstallmentSelected, setNewInstallmentSelected] = useState(
    StorageService.getItem<number>("newInstallmentCardPayment") || 1
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const newValue =
        StorageService.getItem<number>("newInstallmentCardPayment") || 1;
      setNewInstallmentSelected(newValue);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const hasNewInstallmentCardPaymentAvailable = `${newInstallmentSelected}x de ${
    newInstallmentSelected
      ? formatCurrency(
          CalcCetFee(
            (selectedAmount * (selectedInstallment - 1)) /
              newInstallmentSelected,
            cetFee
          )
        )
      : formatCurrency(
          CalcCetFee(selectedAmount * (selectedInstallment - 1), cetFee)
        )
  }`;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        mt: "1.25rem",
      }}
    >
      <Stack sx={{ alignItems: "flex-start" }}>
        <Box sx={{ display: "flex" }}>
          <Stack sx={{ alignItems: "center" }}>
            <Radio
              disabled
              checked={location.pathname === "/credit"}
              checkedIcon={
                <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
              }
              sx={{
                "& .MuiSvgIcon-root": {
                  color: theme.palette.primary.main,
                  fontSize: 20,
                },
                padding: 0,
              }}
            />
            {selectedInstallment > 1 && (
              <Stack sx={{ alignItems: "center" }}>
                <TimelineConnector
                  sx={{
                    height: "1.6rem",
                    mt: "-0.125rem",
                    backgroundColor: theme.palette.primary.light,
                  }}
                />
                <Radio
                  disabled
                  checkedIcon={
                    <CheckCircleIcon
                      sx={{ color: theme.palette.primary.main }}
                    />
                  }
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.primary.main,
                      fontSize: 20,
                      mt: "-0.125rem",
                      fill: theme.palette.primary.light,
                    },
                    padding: 0,
                  }}
                />
              </Stack>
            )}
          </Stack>
          <Stack sx={{ ml: "0.625rem", justifyContent: "space-between" }}>
            <Typography variant="h3" color={theme.palette.text.primary}>
              À vista no Pix
            </Typography>
            {selectedInstallment > 1 && (
              <Typography variant="h3" color={theme.palette.text.primary}>
                Restante no cartão
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>

      <Stack sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h3"
          color={theme.palette.text.primary}
          sx={{ lineHeight: 1, textAlign: "right" }}
        >
          {formatCurrency(selectedAmount)}
        </Typography>
        {selectedInstallment > 1 && (
          <Typography
            variant="h3"
            color={theme.palette.text.primary}
            sx={{ lineHeight: 1, textAlign: "right" }}
          >
            {location.pathname === "/credit"
              ? hasNewInstallmentCardPaymentAvailable
              : newInstallmentSelected
              ? formatCurrency(
                  (selectedAmount * (selectedInstallment - 1)) /
                    newInstallmentSelected
                )
              : formatCurrency(selectedAmount * (selectedInstallment - 1))}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
