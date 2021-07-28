import React, { useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import "../styles/maps.scss";

const geoUrl = "/json/mali-topo.json";

const Maps = ({ projects, markers }) => {
  const [province, setProvince] = useState(null);
  const colorScale = scaleQuantile()
    .domain(projects.map((d) => d.funds))
    .range(["#f2f5fc", "#f9fafe", "#acbbf9"]);

  const colorScaleHover = scaleQuantile()
    .domain(projects.map((d) => d.funds))
    .range(["#f9fafe", "#acbbf9", "#4155f1"]);

  const mk = markers
    .map((x, i) => {
      if (projects[i]) {
        return { ...projects[i], ...x, id: projects[i].id };
      }
      return false;
    })
    .filter((x) => x);

  return (
    <ComposableMap
      projectionConfig={{ scale: 800, projection: "geoEqualEarth" }}
      style={{ height: 550, width: "100%", background: "#f0f8ff" }}
    >
      <ZoomableGroup zoom={2} center={[-5, 17]} maxZoom={2} minZoom={2}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo, i) => {
              const cs = mk.filter(
                (x) => x.GID_2 === geo.properties.GID_2 && x.funds
              );
              const cur = cs.reduce((x, i) => x + i.funds, 0);
              return (
                <Geography
                  key={i}
                  onClick={(e) =>
                    setProvince(
                      cur === 0 || province ? null : geo.properties.GID_2
                    )
                  }
                  geography={geo}
                  style={{
                    default: {
                      fill: cur !== 0 ? colorScale(cur) : "#EAEAEC",
                      stroke: "#FFF",
                      strokeWidth: 0.1,
                      outline: "none",
                    },
                    hover: {
                      fill: cur !== 0 ? colorScaleHover(cur) : "#EAEAEC",
                      stroke: "#FFF",
                      strokeWidth: 0.1,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
        {mk
          .filter((x) => (province === null ? x : x.GID_2 === province))
          .map((props) => (
            <Marker key={props.id} coordinates={props.coordinates}>
              <circle
                data-aos="zoom-in"
                r={1.8}
                fill="#f2f5fc"
                stroke="#acbcf9"
                strokeWidth={1}
                className="points"
              />
            </Marker>
          ))}
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default Maps;
