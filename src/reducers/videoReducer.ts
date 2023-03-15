const videoReducer = (state: any, action: any) => {
    switch (action.type) {
      case "SET_GRID_VIEW":
        return {
          ...state,
          grid_view: true,
        };
  
      default:
        return state;
    }
  };
  
  export default videoReducer;