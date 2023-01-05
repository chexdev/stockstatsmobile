import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useStocksContext } from "../context/StocksContext";

export default function StocksScreen({}) {
  const { serverURL, watchList } = useStocksContext(); // call relevant params from StocksContext.js to implement useContext

  const [state, setState] = useState({
    watchListStocks: [], //stocks in watchlist start as empty array
    selectedStock: {}, //stocks selected for detailed display on watchlist start as empty object
  });

  useEffect(() => {
    //fetch stock data from server for new symbols added to watchlist and saved locally
    watchList.forEach((stockSymbol) => {
      if (
        !state.watchListStocks.some((stock) => stock.symbol === stockSymbol) //.some - if at least 1 element in array passes implementation
      ) {
        fetch(`${serverURL}/history?symbol=${stockSymbol}`)
          .then((res) => res.json())
          .then((stockHistory) => {
            // console.log("history", stockHistory);
            const stockDetail = stockHistory[0];
            stockDetail.percentage = (
              ((stockDetail.close - stockDetail.open) * 100) /
              stockDetail.open
            ).toFixed(2); //calculate % gain/loss since open
            setState((prev) => ({
              ...prev,
              watchListStocks: prev.watchListStocks.concat(stockDetail),
            }));
          })
          .catch((err) => console.log(err));
      }
    });
  }, [watchList]);

  useEffect(() => {
    //create side effect for when a stock is selected for displaying it's details/history
    if (
      state.watchListStocks.length > 0 &&
      Object.keys(state.selectedStock).length === 0
    ) {
      setState((prev) => ({
        ...prev,
        selectedStock: state.watchListStocks[0],
      }));
    }
  }, [state.watchListStocks]);

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
    >
      <View style={styles.stockList}>
        <ScrollView>
          {state?.watchListStocks?.length > 0 &&
            state.watchListStocks.map((stock) => (
              <View
                key={stock.symbol}
                onPress={() =>
                  setState((prev) => ({ ...prev, selectedStock: stock }))
                }
              >
                <View
                  style={{
                    ...styles.stockItem,
                    backgroundColor:
                      stock.symbol === state.selectedStock.symbol
                        ? "#373839"
                        : "#000",
                  }}
                >
                  <Text style={styles.symbol}>{stock.symbol}</Text>
                  <View style={styles.stockItemRightContainer}>
                    <Text style={styles.closingPrice}>
                      {stock.close.toFixed(2)}
                    </Text>
                    <View
                      style={{
                        ...styles.percentageGainOrLossContainer,
                        backgroundColor:
                          stock.percentage >= 0 ? "green" : "red",
                      }}
                    >
                      <Text style={styles.percentageGainOrLoss}>
                        {stock.percentage}%
                      </Text>
                    </View>
                  </View>
                </View>
                <View styles={styles.divider}></View>
              </View>
            ))}
        </ScrollView>
      </View>
      <View style={styles.stockDetail}>
        <Text style={styles.stockName}>{state.selectedStock.name}</Text>
        <View style={styles.stockDetailDivider} />

        <View style={styles.stockDetailRow}>
          <View style={styles.stockProperty}>
            <Text style={styles.stockPropertyName}>OPEN</Text>
            <Text style={styles.stockPropertyValue}>
              {state.selectedStock.open}
            </Text>
          </View>

          <View style={styles.stockProperty}>
            <Text style={styles.stockPropertyName}>LOW</Text>
            <Text style={styles.stockPropertyValue}>
              {state.selectedStock.low}
            </Text>
          </View>
        </View>
        <View styles={styles.stockDetailDivider} />

        <View style={styles.stockDetailRow}>
          <View style={styles.stockProperty}>
            <Text style={styles.stockPropertyName}>CLOSE</Text>
            <Text style={styles.stockPropertyValue}>
              {state.selectedStock.close}
            </Text>
          </View>

          <View style={styles.stockProperty}>
            <Text style={styles.stockPropertyName}>HIGH</Text>
            <Text style={styles.stockPropertyValue}>
              {state.selectedStock.high}
            </Text>
          </View>
        </View>
        <View styles={styles.stockDetailDivider} />

        <View style={styles.stockDetailRow}>
          <View style={styles.stockProperty}>
            <Text style={styles.stockPropertyName}>VOLUME</Text>
            <Text style={styles.stockPropertyValue}>
              {state.selectedStock.volumes}
            </Text>
          </View>
        </View>
        <View styles={styles.stockDetailDivider} />
      </View>
    </View>
  );
}

//Styling
const styles = StyleSheet.create({
  stockName: {
    color: "black",
    fontSize: 23,
    textAlign: "center",
    marginVertical: 14,
  },
  stockDetailDivider: {
    borderBottomColor: "silver",
    borderBottomWidth: 1,
  },
  stockDetailRow: {
    flexDirection: "row",
  },
  stockProperty: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 3,
  },
  stockPropertyName: {
    color: "grey",
    fontSize: 20,
  },
  stockPropertyValue: {
    color: "black",
    fontSize: 23,
  },

  container: {
    flex: 1,
    padding: 3,
  },

  stockList: {
    flex: 3,
    backgroundColor: "black",
  },
  stockDetail: {
    flex: 1,
    backgroundColor: "#696969	",
    bordercolor: "black",
    borderWidth: 1,
  },

  stockItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  stockItemRightContainer: {
    flexDirection: "row",
    borderwidth: 1,
    bordercolor: "#white",
  },
  divider: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },

  symbol: {
    color: "white",
    fontSize: 20,
    marginRight: 10,
    padding: 5,
  },

  closingPrice: {
    color: "#fff",
    fontSize: 20,
    marginRight: 10,
    padding: 5,
  },

  percentageGainOrLossContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "red",
    width: 100,
    height: 35,
    borderRadius: 30,
  },

  percentageGainOrLoss: {
    color: "#fff",
    fontSize: 20,
    padding: 5,
  },
});
