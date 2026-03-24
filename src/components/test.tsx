import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { setView } from "../store/store";

const Test: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentView = useSelector((state: RootState) => state.app.currentView);

  const handleClick = (): void => {
    // Dispatch the setView action
    dispatch(setView("timeline"));
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <h3>Redux Store Test</h3>
      <p>Current View: <strong>{currentView}</strong></p>
      <button onClick={handleClick}>
        Set View to Timeline
      </button>
    </div>
  );
};

export default Test;