import { useEffect, useState, useContext, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Create context object
const StocksContext = createContext();

//Create context provider
export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);
  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  const _retrieveData = async () => {
    //retrieve watchlist from Async storage
    try {
      const stockWatchList = await AsyncStorage.getItem("stockWatchList");
      if (stockWatchList !== null) {
        setState(JSON.parse(stockWatchList));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value); //store in AsyncStorage
    } catch (err) {
      console.error(err);
    }
  };

  //add watchlist new symbol
  function addToWatchList(newSymbol) {
    setState((prev) => {
      if (prev.includes(newSymbol)) {
        return prev;
      }

      const stockWatchList = JSON.stringify(prev.concat(newSymbol));
      _storeData("stockWatchList", stockWatchList);

      return prev.concat(newSymbol);
    });
  }
  useEffect(() => {
    _retrieveData();
    // AsyncStorage.clear(); //for clearing AsyncStorage during tests
  }, []);

  return {
    serverURL: "http://fosapps01.qut.edu.au:3000",
    watchList: state, //call to StocksScreen.js via useStocksContext
    addToWatchList, //call to SearchScreen.js via useStocksContext
  };
};
