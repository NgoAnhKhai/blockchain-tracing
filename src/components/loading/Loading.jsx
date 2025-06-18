import { StyledWrapper } from "../../styles/Loader";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="overlay">
        <div className="pyramid-loader">
          <div className="wrapper">
            <span className="side side1" />
            <span className="side side2" />
            <span className="side side3" />
            <span className="side side4" />
            <span className="shadow" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default Loader;
