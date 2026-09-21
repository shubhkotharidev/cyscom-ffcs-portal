import React from "react";

export default function DysonSphere() {
  return (
    <div className="cg-dyson-inline">
      <img className="cg-dyson-core-inline" src="/logo1.png" alt="Cyscom" />
      <div className="cg-dyson-ring-wrap a">
        <div className="cg-dyson-ring" style={{ animationDuration: "6s" }} />
      </div>
      <div className="cg-dyson-ring-wrap b">
        <div className="cg-dyson-ring reverse" style={{ animationDuration: "9s" }} />
      </div>
    </div>
  );
}
