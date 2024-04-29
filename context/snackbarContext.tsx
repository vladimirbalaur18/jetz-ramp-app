import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  ReactElement,
} from "react";
import { Snackbar } from "react-native-paper";

type ISnackbarContext = {
  showSnackbar: (text: string) => void;
  hideSnackbar: () => void;
};
const SnackbarContext = createContext<ISnackbarContext>({
  showSnackbar: () => {},
  hideSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = (message = "") => {
    setMessage(message);
    setVisible(true);
  };

  const hideSnackbar = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={Snackbar.DURATION_SHORT}
        action={{
          label: "Close",
          onPress: () => setVisible(false),
        }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
