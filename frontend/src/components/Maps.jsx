import React, { useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Tooltip } from "antd";
import { CloseCircleTwoTone, PlayCircleTwoTone } from "@ant-design/icons";
import { scaleQuantile } from "d3-scale";
import "../styles/maps.scss";
import { UIStore } from "../data/state";

const geoUrl = "/json/mali-topo.json";

const handleMarkerClick = ({ uuid }) => {
  const { currentState } = UIStore;
  const { tabs } = currentState;
  const available = tabs.filter((t) => t === uuid);
  if (!available.length) {
    const newTabs = [...[uuid], ...tabs];
    UIStore.update((u) => {
      u.tabs = newTabs;
    });
  }
};

const Maps = ({ projects, markers, handleEditTab, handleActiveTab }) => {
  const { currentState } = UIStore;
  const { tabs, tabActive } = currentState;
  const [province, setProvince] = useState(null);
  const colorScale = scaleQuantile()
    .domain(projects.map((d) => d.funds))
    .range(["#f2f5fc", "#f9fafe", "#1890ff"]);

  const colorScaleHover = scaleQuantile()
    .domain(projects.map((d) => d.funds))
    .range(["#f9fafe", "#acbbf9", "#1890ff"]);

  const mk = markers
    .map((x, i) => {
      if (projects[i]) {
        return { ...projects[i], ...x, uuid: x.uuid };
      }
      return false;
    })
    .filter((x) => x);

  return (
    <>
      <ComposableMap
        projectionConfig={{ scale: 800, projection: "geoEqualEarth" }}
        style={{ height: 650, width: "100%", background: "#f0f8ff" }}
      >
        <ZoomableGroup zoom={9} center={[-6.5, 13.3]} maxZoom={10} minZoom={10}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo, i) => {
                const cs = mk.filter(
                  (x) => x.location === geo.properties.GID_2 && x.funds
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
            .filter((x) => (province === null ? x : x.location === province))
            .map((props, pi) => (
              <Tooltip
                key={pi}
                title={
                  <span>
                    {props.uuid}
                    <CloseCircleTwoTone
                      twoToneColor="#eb2f96"
                      style={{ marginLeft: "5px" }}
                      onClick={() => handleEditTab(props.uuid)}
                    />
                    <PlayCircleTwoTone
                      twoToneColor="#52c41a"
                      style={{ marginLeft: "5px" }}
                      onClick={() => handleActiveTab(props.uuid)}
                    />
                  </span>
                }
                visible={() =>
                  tabActive === "overview" && tabs.includes(props.uuid)
                }
              >
                <Marker
                  key={props.uuid}
                  coordinates={props.coordinates}
                  onClick={() => handleMarkerClick(props)}
                >
                  <circle
                    data-aos="zoom-in"
                    r={props.status === "Compliant" ? 0.5 : 0.8}
                    fill={props.status === "Compliant" ? "#e6f7ff" : "#ffa39e"}
                    stroke={
                      props.status === "Compliant" ? "#acbcf9" : "#cf1322"
                    }
                    strokeWidth={0.3}
                    className="points"
                  />
                </Marker>
              </Tooltip>
            ))}
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default Maps;
