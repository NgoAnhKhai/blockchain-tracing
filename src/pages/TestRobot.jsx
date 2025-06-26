import React from "react";
import RobotMascot from "../components/RobotMascot";
import WalkingRobot from "../components/WalkingRobot";

const TestRobot = () => {
  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <WalkingRobot />
      <RobotMascot />
    </div>
  );
};

export default TestRobot;
