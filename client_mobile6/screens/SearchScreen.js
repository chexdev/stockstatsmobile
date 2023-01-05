import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useStocksContext } from "../context/StocksContext";
import { Ionicons } from "@expo/vector-icons";

//Searchbox for searching stocks
function SearchBox({ searchText, handleChangeSearchText }) {
  return (
    <View style={styles.searchSection}>
      <Ionicons style={styles.searchIcon} name="md-search" />
      <TextInput
        style={styles.searchInput}
        placeholder="Enter a company name or stock symbol"
        placeholderTextColor="#fff"
        defaultValue={searchText}
        onChangeText={(text) => handleChangeSearchText(text)}
      />
    </View>
  );
}

//List of stocks items
function StockListItem({ stock }) {
  return (
    <View style={styles.stockListItem}>
      <Text style={styles.stockSymbol}>{stock.symbol}</Text>
      <Text style={styles.stockName}>{stock.name}</Text>
    </View>
  );
}
//Make stock list items clickable using Touchables
function StockList({ stocks, addStockToWatchList }) {
  //create new "stocks" param
  return (
    <ScrollView>
      {stocks.map(
        (
          stock //call "stock" param from StockListItem function above & map out new array
        ) => (
          <TouchableOpacity
            onPress={() => addStockToWatchList(stock)}
            key={stock.symbol}
          >
            <StockListItem stock={stock} />
          </TouchableOpacity>
        )
      )}
    </ScrollView>
  );
}

export default function SearchScreen({ navigation }) {
  //Setup Context to save state
  const { serverURL, addToWatchList } = useStocksContext(); //call all relevant params from StocksContext.js to implement useContext

  const [state, setState] = useState({
    searchText: "", //call searchText from SearchBox function above to start with empty string state
    stocks: [], // all stocks from StockList function above to start with empty array
  });

  useEffect(() => {
    fetch(`${serverURL}/all`, { method: "GET" })
      .then((response) => response.json())
      .then((stockData) => {
        //create new param StocksData
        setState((prev) => ({ ...prev, stocks: stockData })); //"stocks" from StockList = new param "stockData"
      })

      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChangeSearchText = (text) => {
    text = text.replace(/[.*+\-?^${}()|[\]\\]/g, ""); //prevent the error caused by entering special characters
    const regex = RegExp(text, "i"); // case insensitive regular expression
    setState((prev) => ({
      ...prev,
      searchText: text,
      filteredStocks: state.stocks.filter(
        (stock) => regex.test(stock.symbol) || regex.test(stock.name)
      ),
    }));
  };

  const handleAddStockToWatchList = (stock) => {
    addToWatchList(stock.symbol);
    navigation.navigate("Stocks");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <SearchBox
            searchText={state.searchText}
            handleChangeSearchText={handleChangeSearchText}
          />

          {state.searchText !== "" && (
            <StockList
              stocks={state.filteredStocks}
              addStockToWatchList={handleAddStockToWatchList}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
//Styling:
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    height: 40,
    borderRadius: 10,
    marginHorizontal: 3,
    marginTop: 5,
  },

  searchIcon: {
    paddingHorizontal: 15,
    color: "#fff",
    fontSize: 20,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
  },

  stockListItem: {
    paddingBottom: 10,
    borderBottomColor: "#F5F5F5",
    borderBottomWidth: 1,
  },

  stockSymbol: {
    paddingHorizontal: 10,
    paddingTop: 10,
    color: "#000000",
    fontSize: 20,
  },

  stockName: {
    paddingHorizontal: 10,
    color: "#000000",
  },
});
