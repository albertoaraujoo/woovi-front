import { Box, Card, CardContent, Typography } from "@mui/material";
import { formatCurrency } from "../helper/format-currency";
import { StorageService } from "../helper/local-storage";
import { HelpOutline } from "@mui/icons-material";
import { useContext, useState } from "react";
import { AmountContext } from "../context/amount-provider";
import { useLocation } from "react-router-dom";
import { CalcCetFee } from "../helper/calc-cet-fee";

export function TotalAmount() {
  const { getItem } = StorageService;
  const { cetFee } = useContext(AmountContext);
  const location = useLocation();
  const newTotalDebits = getItem<number>("newTotalDebits");
  const selectedAmount = getItem<number>("selectedAmount");
  const [helpIsOpen, setHelpIsOpen] = useState(false);

  function mouseHoverHelp() {
    setHelpIsOpen(true);
  }

  function mouseLeaveHelp() {
    setHelpIsOpen(false);
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        sx={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
      >
        CET: 0,5%
        <HelpOutline
          sx={{ fontSize: 16 }}
          onMouseOver={mouseHoverHelp}
          onMouseLeave={mouseLeaveHelp}
        />
      </Typography>
      {helpIsOpen && (
        <Card
          sx={{
            minWidth: 275,
            position: "absolute",
            top: "1.5rem",
            maxWidth: "10rem",
          }}
        >
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Typography variant="h4" component="div">
              A Taxa de Custo Efetivo Total (CET) representa o custo total de um
              financiamento, incluindo juros, seguros, tarifas e demais
              encargos.
            </Typography>
            <Typography variant="h4">
              Ela foi adicionada ao valor final do financiamento para
              proporcionar uma visão clara e transparente de todos os custos
              envolvidos, permitindo que você tome decisões informadas sobre
              suas opções de crédito.
            </Typography>
          </CardContent>
        </Card>
      )}
      <Typography variant="h2" sx={{ fontWeight: 400 }}>
        {location.pathname === "/credit"
          ? formatCurrency(
              CalcCetFee(
                Number(newTotalDebits) - Number(selectedAmount),
                cetFee
              )
            )
          : formatCurrency(Number(newTotalDebits))}
      </Typography>
    </Box>
  );
}
